from django.contrib import admin
from .models import DaySession, Team, Participant, MovementPass, FoodRequest, MentorRequest


@admin.register(DaySession)
class DaySessionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'status', 'venue', 'start_time')
    list_filter = ('status',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'table_number', 'project_title')
    search_fields = ('name', 'table_number')


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('roll_no', 'name', 'team', 'status', 'scanned_at', 'marked_by')
    list_filter = ('status', 'team')
    search_fields = ('name', 'roll_no', 'team__name')


@admin.register(MovementPass)
class MovementPassAdmin(admin.ModelAdmin):
    list_display = ('participant', 'pass_type', 'status', 'depart_time', 'return_time')
    list_filter = ('pass_type', 'status')


@admin.register(FoodRequest)
class FoodRequestAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'items', 'quantity', 'dietary', 'status', 'requested_at')
    list_filter = ('status', 'dietary')


@admin.register(MentorRequest)
class MentorRequestAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'category', 'topic', 'status', 'mentor_assigned')
    list_filter = ('status', 'category')
