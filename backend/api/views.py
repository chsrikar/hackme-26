from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import DaySession, Team, Participant, MovementPass, FoodRequest, MentorRequest
from .serializers import (
    DaySessionSerializer,
    TeamSerializer,
    ParticipantSerializer,
    MovementPassSerializer,
    FoodRequestSerializer,
    MentorRequestSerializer
)


class DaySessionViewSet(viewsets.ModelViewSet):
    queryset = DaySession.objects.all().order_by('-start_time')
    serializer_class = DaySessionSerializer

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        session = self.get_object()
        session.status = 'closed'
        session.end_time = timezone.now()
        session.save()

        # Force close any remaining open passes for this session
        open_passes = MovementPass.objects.filter(day_session=session, status='active')
        open_passes.update(status='force_closed', closed_by='day_session_closed', return_time=timezone.now())

        # Unscanned participants become absent
        Participant.objects.filter(status='not_scanned').update(status='absent', marked_by='day_closed')

        return Response({
            'status': 'closed',
            'session_id': session.id,
            'closed_at': session.end_time
        })


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all().select_related('team').order_by('roll_no')
    serializer_class = ParticipantSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        team_name = self.request.query_params.get('team')
        status_param = self.request.query_params.get('status')
        if team_name and team_name != 'all':
            qs = qs.filter(team__name=team_name)
        if status_param and status_param != 'all':
            qs = qs.filter(status=status_param)
        return qs

    @action(detail=True, methods=['post'])
    def override(self, request, pk=None):
        participant = self.get_object()
        new_status = request.data.get('status', 'present')
        reason = request.data.get('notes', 'Ops Manual Override')

        participant.status = new_status
        participant.marked_by = 'ops_override'
        participant.override_notes = reason
        if new_status == 'present' and not participant.scanned_at:
            participant.scanned_at = timezone.now()
        participant.save()

        return Response(ParticipantSerializer(participant).data)

    @action(detail=False, methods=['post'])
    def scan(self, request):
        """Unified QR Scan Processor (Check-in, Pass Checkout, Pass Return)"""
        roll_no = request.data.get('rollNo') or request.data.get('roll_no')
        scan_type = (request.data.get('type') or 'CHECKIN').upper()
        reason = request.data.get('reason', '')

        if not roll_no:
            return Response({'error': 'rollNo is required'}, status=status.HTTP_400_BAD_REQUEST)

        participant = Participant.objects.filter(roll_no__iexact=roll_no).first()
        if not participant:
            return Response({'error': f'Participant {roll_no} not registered'}, status=status.HTTP_404_NOT_FOUND)

        # Check if participant currently has an active movement pass
        active_pass = MovementPass.objects.filter(participant=participant, status='active').first()

        # Handle Pass Return (explicit return or auto-detected return)
        if scan_type in ['RETURN', 'PASS_RETURN'] or (active_pass and scan_type == 'CHECKIN'):
            if not active_pass:
                return Response({'error': f'No active pass found for {participant.name}'}, status=status.HTTP_400_BAD_REQUEST)

            active_pass.status = 'returned'
            active_pass.return_time = timezone.now()
            active_pass.save()

            elapsed_seconds = int((active_pass.return_time - active_pass.depart_time).total_seconds())
            duration_str = f"{elapsed_seconds // 60}m {elapsed_seconds % 60}s"

            return Response({
                'action': 'pass_returned',
                'participant': participant.name,
                'team': participant.team.name,
                'pass_type': active_pass.pass_type,
                'duration': duration_str,
                'message': f"↩️ {participant.name} returned from {active_pass.pass_type} ({duration_str})"
            })

        # Handle Movement Pass Checkout (WASHROOM, FOOD_PICKUP, REST_BREAK, LEFT_VENUE)
        if scan_type in ['WASHROOM', 'FOOD_PICKUP', 'REST_BREAK', 'LEFT_VENUE']:
            if active_pass:
                return Response({
                    'error': f'{participant.name} already has an active {active_pass.pass_type} pass open.'
                }, status=status.HTTP_400_BAD_REQUEST)

            active_day = DaySession.objects.filter(status='active').first()
            new_pass = MovementPass.objects.create(
                participant=participant,
                day_session=active_day,
                pass_type=scan_type,
                reason=reason or f'Authorized {scan_type}',
                status='active'
            )

            return Response({
                'action': 'pass_issued',
                'participant': participant.name,
                'team': participant.team.name,
                'pass_type': scan_type,
                'pass_id': new_pass.id,
                'message': f"{scan_type} pass issued to {participant.name}"
            })

        # Standard Check-in scan
        if participant.status == 'present':
            return Response({
                'error': f'{participant.name} is already checked in.'
            }, status=status.HTTP_400_BAD_REQUEST)

        participant.status = 'present'
        participant.scanned_at = timezone.now()
        participant.marked_by = 'qr_scan'
        participant.save()

        return Response({
            'action': 'checkin',
            'participant': participant.name,
            'team': participant.team.name,
            'table': participant.table or participant.team.table_number,
            'scanned_at': participant.scanned_at,
            'message': f"✅ {participant.name} checked in successfully!"
        })


class MovementPassViewSet(viewsets.ModelViewSet):
    queryset = MovementPass.objects.all().select_related('participant', 'participant__team').order_by('-depart_time')
    serializer_class = MovementPassSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param == 'active':
            qs = qs.filter(status='active')
        return qs

    @action(detail=True, methods=['post'])
    def mark_returned(self, request, pk=None):
        pass_obj = self.get_object()
        pass_obj.status = 'returned'
        pass_obj.return_time = timezone.now()
        pass_obj.save()
        return Response(MovementPassSerializer(pass_obj).data)

    @action(detail=True, methods=['post'])
    def force_close(self, request, pk=None):
        pass_obj = self.get_object()
        pass_obj.status = 'force_closed'
        pass_obj.closed_by = request.data.get('closed_by', 'ops_force_close')
        pass_obj.return_time = timezone.now()
        pass_obj.save()
        return Response(MovementPassSerializer(pass_obj).data)


class FoodRequestViewSet(viewsets.ModelViewSet):
    queryset = FoodRequest.objects.all().order_by('-requested_at')
    serializer_class = FoodRequestSerializer

    @action(detail=True, methods=['patch'])
    def advance(self, request, pk=None):
        food_req = self.get_object()
        pipeline = ['pending', 'preparing', 'ready', 'delivered']
        if food_req.status in pipeline:
            curr_idx = pipeline.index(food_req.status)
            if curr_idx < len(pipeline) - 1:
                next_status = pipeline[curr_idx + 1]
                food_req.status = next_status
                if next_status == 'delivered':
                    food_req.delivered_at = timezone.now()
                food_req.save()

        return Response(FoodRequestSerializer(food_req).data)


class MentorRequestViewSet(viewsets.ModelViewSet):
    queryset = MentorRequest.objects.all().order_by('-requested_at')
    serializer_class = MentorRequestSerializer

    @action(detail=True, methods=['patch'])
    def claim(self, request, pk=None):
        mentor_req = self.get_object()
        mentor_req.status = 'claimed'
        mentor_req.mentor_assigned = request.data.get('mentor_name', 'Ops Mentor')
        mentor_req.save()
        return Response(MentorRequestSerializer(mentor_req).data)

    @action(detail=True, methods=['patch'])
    def resolve(self, request, pk=None):
        mentor_req = self.get_object()
        mentor_req.status = 'resolved'
        mentor_req.resolved_at = timezone.now()
        mentor_req.save()
        return Response(MentorRequestSerializer(mentor_req).data)


class ReportsSummaryView(APIView):
    def get(self, request):
        total_participants = Participant.objects.count()
        checked_in = Participant.objects.filter(status='present').count()
        active_passes = MovementPass.objects.filter(status='active').count()
        total_food = FoodRequest.objects.count()
        delivered_food = FoodRequest.objects.filter(status='delivered').count()

        # Pass breakdown by type
        pass_counts = {}
        for ptype, _ in MovementPass.PASS_TYPE_CHOICES:
            pass_counts[ptype] = MovementPass.objects.filter(pass_type=ptype).count()

        return Response({
            'total_participants': total_participants,
            'checked_in': checked_in,
            'attendance_rate': round((checked_in / total_participants * 100), 1) if total_participants else 0,
            'active_passes': active_passes,
            'total_food_orders': total_food,
            'delivered_food_orders': delivered_food,
            'passes_by_type': pass_counts
        })
