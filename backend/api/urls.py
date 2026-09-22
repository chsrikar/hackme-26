from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DaySessionViewSet,
    TeamViewSet,
    ParticipantViewSet,
    MovementPassViewSet,
    FoodRequestViewSet,
    MentorRequestViewSet,
    ReportsSummaryView
)

router = DefaultRouter()
router.register(r'days', DaySessionViewSet, basename='days')
router.register(r'teams', TeamViewSet, basename='teams')
router.register(r'participants', ParticipantViewSet, basename='participants')
router.register(r'passes', MovementPassViewSet, basename='passes')
router.register(r'food', FoodRequestViewSet, basename='food')
router.register(r'mentors', MentorRequestViewSet, basename='mentors')

urlpatterns = [
    path('reports/summary/', ReportsSummaryView.as_view(), name='reports-summary'),
    path('', include(router.urls)),
]
