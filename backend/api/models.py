from django.db import models
from django.utils import timezone


class DaySession(models.Model):
    """Represents an active or archived Hackathon Day Session (e.g. Day 1, Day 2)"""
    id = models.CharField(max_length=64, primary_key=True)
    code = models.CharField(max_length=32, default='Day 1')
    name = models.CharField(max_length=255)
    venue = models.CharField(max_length=255, default='Convention Center Arena & Lab A')
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=32, default='active', choices=[('active', 'Active'), ('closed', 'Closed')])

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code}: {self.name} [{self.status.upper()}]"


class Team(models.Model):
    """Hackathon registered team"""
    name = models.CharField(max_length=128, unique=True)
    table_number = models.CharField(max_length=64, default='Table 01')
    project_title = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.table_number})"


class Participant(models.Model):
    """Participant registered for the hackathon"""
    STATUS_CHOICES = [
        ('not_scanned', 'Not Checked In'),
        ('present', 'Checked In / Present'),
        ('absent', 'Absent'),
    ]

    roll_no = models.CharField(max_length=32, unique=True)  # Badge ID, e.g. HACK-01A
    name = models.CharField(max_length=128)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, null=True)
    team = models.ForeignKey(Team, related_name='participants', on_delete=models.CASCADE)
    table = models.CharField(max_length=64, blank=True, null=True)
    
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='not_scanned')
    scanned_at = models.DateTimeField(null=True, blank=True)
    marked_by = models.CharField(max_length=64, null=True, blank=True)
    override_notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.roll_no}) - {self.team.name}"


class MovementPass(models.Model):
    """Multi-type movement pass for participants"""
    PASS_TYPE_CHOICES = [
        ('WASHROOM', 'Washroom (10m)'),
        ('FOOD_PICKUP', 'Food Pickup (20m)'),
        ('REST_BREAK', 'Rest Break (45m)'),
        ('LEFT_VENUE', 'Left Venue (60m)'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('returned', 'Returned'),
        ('force_closed', 'Force Closed'),
    ]

    participant = models.ForeignKey(Participant, related_name='passes', on_delete=models.CASCADE)
    day_session = models.ForeignKey(DaySession, related_name='passes', on_delete=models.SET_NULL, null=True, blank=True)
    pass_type = models.CharField(max_length=32, choices=PASS_TYPE_CHOICES, default='WASHROOM')
    reason = models.CharField(max_length=255, blank=True)
    
    depart_time = models.DateTimeField(default=timezone.now)
    return_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='active')
    closed_by = models.CharField(max_length=64, blank=True, null=True)

    @property
    def overdue_threshold_minutes(self):
        timeouts = {
            'WASHROOM': 10,
            'FOOD_PICKUP': 20,
            'REST_BREAK': 45,
            'LEFT_VENUE': 60,
        }
        return timeouts.get(self.pass_type, 15)

    def __str__(self):
        return f"{self.pass_type} pass for {self.participant.name} [{self.status}]"


class FoodRequest(models.Model):
    """Fulfillment order for midnight snacks, catering and beverages"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready for Pickup'),
        ('delivered', 'Delivered'),
    ]

    team = models.ForeignKey(Team, related_name='food_requests', on_delete=models.SET_NULL, null=True, blank=True)
    team_name = models.CharField(max_length=128)
    participant_name = models.CharField(max_length=128, default='Desk')
    table = models.CharField(max_length=64, default='Table 01')
    items = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    dietary = models.CharField(max_length=64, default='Standard')
    notes = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(default=timezone.now)
    delivered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Order for {self.team_name}: {self.items} [{self.status}]"


class MentorRequest(models.Model):
    """Technical assistance request queue"""
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('claimed', 'Claimed'),
        ('resolved', 'Resolved'),
    ]

    team = models.ForeignKey(Team, related_name='mentor_requests', on_delete=models.SET_NULL, null=True, blank=True)
    team_name = models.CharField(max_length=128)
    participant_name = models.CharField(max_length=128)
    table = models.CharField(max_length=64, default='Table 01')
    topic = models.TextField()
    category = models.CharField(max_length=64, default='General Tech')
    
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='open')
    mentor_assigned = models.CharField(max_length=128, null=True, blank=True)
    requested_at = models.DateTimeField(default=timezone.now)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Mentor request by {self.team_name} on {self.category} [{self.status}]"
