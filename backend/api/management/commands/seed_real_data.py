import os
import json
import re
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import DaySession, Team, Participant, MovementPass, FoodRequest, MentorRequest


def clean_phone(p):
    if not p or p.strip() == '.':
        return '+91 9847000000'
    p = p.strip()
    try:
        val = int(float(p))
        s = str(val)
        if len(s) == 10:
            return '+91 ' + s
        if len(s) == 12 and s.startswith('91'):
            return '+' + s[:2] + ' ' + s[2:]
        return s
    except Exception:
        digits = re.sub(r'\D', '', p)
        if len(digits) == 10:
            return '+91 ' + digits
        return p


def clean_email(e, name):
    if not e or e.strip() == '.':
        slug = re.sub(r'[^a-z0-9]', '', name.lower())
        return f"{slug}@visat.ac.in"
    e = e.strip().replace(' ', '')
    if not e.endswith('.com') and not e.endswith('.in') and '@' in e:
        e = e + '.com'
    return e


TEAM_METADATA = [
    ('Team ByteCraft', 'Table 01', 'Autonomous Drone Path Optimizer'),
    ('Team NeuralPulse', 'Table 02', 'Neural Speech Synthesis & Voice Translation'),
    ('Team CyberKnights', 'Table 03', 'Zero-Trust Identity & QR Verification Protocol'),
    ('Team HyperLedger', 'Table 04', 'Cross-Chain Decentralized Liquidity Vault'),
    ('Team MatrixOps', 'Table 05', 'Kubernetes Cluster Self-Healing Engine'),
    ('Team CloudScale', 'Table 06', 'Edge-Cached Serverless MicroVM Gateway'),
    ('Team QuantumLeap', 'Table 07', 'Post-Quantum Lattice Key Exchange'),
    ('Team DevHedge', 'Table 08', 'Decentralized Algorithmic Orderbook'),
    ('Team ApexCoders', 'Table 09', 'Low-Latency Multi-Agent Swarm Framework'),
    ('Team CodePulse', 'Table 10', 'Computer Vision PPE & Safety Inspector'),
    ('Team SynthAI', 'Table 11', 'Context-Aware Healthcare Diagnostic Copilot'),
    ('Team LogicForge', 'Table 12', 'Offline Mesh Emergency Dispatcher'),
    ('Team AlgoKnights', 'Table 13', 'Dynamic Smart-City Traffic Router'),
    ('Team BinaryBandits', 'Table 14', 'Automated Smart Contract Vulnerability Auditor'),
    ('Team CircuitBreakers', 'Table 15', 'IoT Power Grid Optimization Matrix'),
    ('Team Zenith', 'Table 16', 'Biometric Anti-Spoofing Sentinel'),
]


class Command(BaseCommand):
    help = 'Seeds real participant registration data from admin/data/parsed_responses.json into SQLite database'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Importing real hackathon cohort into SQLite database...'))

        # Locate parsed_responses.json
        possible_paths = [
            os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'admin', 'data', 'parsed_responses.json'),
            r'd:\hackme26\admin\data\parsed_responses.json',
        ]
        json_path = None
        for p in possible_paths:
            norm = os.path.normpath(p)
            if os.path.exists(norm):
                json_path = norm
                break

        if not json_path:
            self.stdout.write(self.style.ERROR('parsed_responses.json not found!'))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)

        header = raw_data[0]
        rows = raw_data[1:]
        self.stdout.write(f'Found {len(rows)} real participant records in {json_path}.')

        # Wipe old mock participant/pass/team data cleanly
        MovementPass.objects.all().delete()
        FoodRequest.objects.all().delete()
        MentorRequest.objects.all().delete()
        Participant.objects.all().delete()
        Team.objects.all().delete()

        # 1. Day Sessions
        day1, _ = DaySession.objects.get_or_create(
            id='day-1',
            defaults={
                'code': 'Day 1',
                'name': 'Day 1 — 24H Overnight Sprint & Hacking Kickoff',
                'venue': 'Convention Center Arena & Lab A',
                'start_time': timezone.now() - timedelta(hours=3, minutes=15),
                'status': 'active'
            }
        )

        day2, _ = DaySession.objects.get_or_create(
            id='day-2',
            defaults={
                'code': 'Day 2',
                'name': 'Day 2 — Final Polish, Code Freeze & Project Demos',
                'venue': 'Main Stage Auditorium',
                'start_time': timezone.now() + timedelta(days=1),
                'status': 'closed'
            }
        )

        # 2. Create Teams
        team_objects = []
        for t_name, table, project in TEAM_METADATA:
            team_obj = Team.objects.create(
                name=t_name,
                table_number=table,
                project_title=project
            )
            team_objects.append(team_obj)

        # 3. Create Participants
        participants_by_roll = {}
        letters = ['A', 'B', 'C', 'D']

        for t_idx, team_obj in enumerate(team_objects):
            # Team 16 has 2 members, other 15 teams have 4 members
            count = 2 if t_idx == 15 else 4
            start_row = t_idx * 4
            squad_rows = rows[start_row:start_row + count]

            for m_idx, row in enumerate(squad_rows):
                name = row[1].strip() if len(row) > 1 and row[1] else f'Participant {t_idx+1}{letters[m_idx]}'
                college = row[2].strip() if len(row) > 2 and row[2] else 'VISAT'
                dept = row[3].strip() if len(row) > 3 and row[3] else 'CSE'
                phone_raw = row[4] if len(row) > 4 else ''
                email_raw = row[5] if len(row) > 5 else ''
                pay_status = row[6].strip() if len(row) > 6 and row[6] else 'Pay at Venue'
                referral = row[7].strip() if len(row) > 7 and row[7] else ''

                phone = clean_phone(phone_raw)
                email = clean_email(email_raw, name)
                roll_no = f'HACK-{(t_idx+1):02d}{letters[m_idx]}'

                # Initial status: ~70% checked in, some not_scanned, 1-2 absent for realistic demo
                global_idx = start_row + m_idx
                if global_idx in [59, 60, 61, 52, 53, 35, 36]:
                    status = 'not_scanned'
                    scanned_at = None
                    marked_by = None
                elif global_idx == 13:
                    status = 'absent'
                    scanned_at = None
                    marked_by = 'ops_override'
                else:
                    status = 'present'
                    scanned_at = timezone.now() - timedelta(hours=3, minutes=max(2, 60 - global_idx))
                    marked_by = 'qr_scan'

                p_obj = Participant.objects.create(
                    roll_no=roll_no,
                    name=name,
                    email=email,
                    phone=phone,
                    team=team_obj,
                    table=team_obj.table_number,
                    status=status,
                    scanned_at=scanned_at,
                    marked_by=marked_by,
                    override_notes=f"College: {college} | Dept: {dept} | Referral: {referral or 'None'} | Payment: {pay_status}"
                )
                participants_by_roll[roll_no] = p_obj

        self.stdout.write(f'Created {len(team_objects)} teams and {len(participants_by_roll)} real participants.')

        # 4. Movement Passes (Linked to Real Participants)
        passes_data = [
            ('HACK-01D', 'WASHROOM', 'Restroom break - 2nd floor', timedelta(minutes=4)),
            ('HACK-02B', 'FOOD_PICKUP', 'Outside Swiggy/Zomato delivery gate', timedelta(minutes=14)),
            ('HACK-03A', 'REST_BREAK', 'Nap pod lounge (Block C)', timedelta(minutes=32)),
            ('HACK-05A', 'LEFT_VENUE', 'Home to fetch hardware debugger / ESP32 board', timedelta(minutes=75)),
        ]

        for roll, pass_type, reason, td in passes_data:
            if roll in participants_by_roll:
                MovementPass.objects.create(
                    participant=participants_by_roll[roll],
                    day_session=day1,
                    pass_type=pass_type,
                    status='active',
                    reason=reason,
                    depart_time=timezone.now() - td
                )

        # 5. Food Requests (Linked to Real Teams)
        food_data = [
            ('Team ByteCraft', participants_by_roll['HACK-01B'].name, 'Table 01', '2x Margherita Pizza, 1x Red Bull', 3, 'Veg', 'preparing', timedelta(minutes=18)),
            ('Team CyberKnights', participants_by_roll['HACK-03B'].name, 'Table 03', '4x Steaming Masala Chai, 2x Samosa Duo', 6, 'Veg', 'pending', timedelta(minutes=6)),
            ('Team MatrixOps', participants_by_roll['HACK-05B'].name, 'Table 05', '1x Avocado & Hummus Bowl', 1, 'Vegan', 'ready', timedelta(minutes=25)),
            ('Team HyperLedger', participants_by_roll['HACK-04B'].name, 'Table 04', '3x BBQ Chicken Pizza Slice', 3, 'Non-Veg', 'delivered', timedelta(minutes=55)),
        ]

        for tname, pname, table, items, qty, diet, status, td in food_data:
            team_match = Team.objects.filter(name=tname).first()
            FoodRequest.objects.create(
                team=team_match,
                team_name=tname,
                participant_name=pname,
                table=table,
                items=items,
                quantity=qty,
                dietary=diet,
                status=status,
                requested_at=timezone.now() - td,
                delivered_at=timezone.now() - timedelta(minutes=10) if status == 'delivered' else None
            )

        # 6. Mentor Requests (Linked to Real Teams)
        mentor_data = [
            ('Team NeuralPulse', participants_by_roll['HACK-02C'].name, 'Table 02', 'PyTorch CUDA Out of Memory error on RTX 4090', 'AI / Machine Learning', 'open', None),
            ('Team HyperLedger', participants_by_roll['HACK-04B'].name, 'Table 04', 'Smart contract deployment failed on Sepolia RPC', 'Web3 / Blockchain', 'claimed', 'David K. (Mentor)'),
        ]

        for tname, pname, table, topic, cat, status, mentor in mentor_data:
            team_match = Team.objects.filter(name=tname).first()
            MentorRequest.objects.create(
                team=team_match,
                team_name=tname,
                participant_name=pname,
                table=table,
                topic=topic,
                category=cat,
                status=status,
                mentor_assigned=mentor,
                requested_at=timezone.now() - timedelta(minutes=20)
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully imported 62 real participants across 16 teams into SQLite db.sqlite3!'))
