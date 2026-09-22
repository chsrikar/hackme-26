from rest_framework import serializers
from .models import DaySession, Team, Participant, MovementPass, FoodRequest, MentorRequest


class DaySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DaySession
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    participant_count = serializers.IntegerField(source='participants.count', read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'table_number', 'project_title', 'participant_count']


class ParticipantSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    table = serializers.SerializerMethodField()

    class Meta:
        model = Participant
        fields = [
            'id',
            'roll_no',
            'name',
            'email',
            'phone',
            'team',
            'team_name',
            'table',
            'status',
            'scanned_at',
            'marked_by',
            'override_notes',
        ]

    def get_table(self, obj):
        return obj.table or (obj.team.table_number if obj.team else 'Main Floor')


class MovementPassSerializer(serializers.ModelSerializer):
    participant_name = serializers.CharField(source='participant.name', read_only=True)
    roll_no = serializers.CharField(source='participant.roll_no', read_only=True)
    team = serializers.CharField(source='participant.team.name', read_only=True)
    overdue_threshold_minutes = serializers.ReadOnlyField()

    class Meta:
        model = MovementPass
        fields = [
            'id',
            'participant',
            'participant_name',
            'roll_no',
            'team',
            'day_session',
            'pass_type',
            'reason',
            'depart_time',
            'return_time',
            'status',
            'closed_by',
            'overdue_threshold_minutes',
        ]


class FoodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = '__all__'


class MentorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorRequest
        fields = '__all__'
