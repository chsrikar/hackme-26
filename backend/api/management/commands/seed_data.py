from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import DaySession, Team, Participant, MovementPass, FoodRequest, MentorRequest


class Command(BaseCommand):
    help = 'Seeds initial teams, participants, movement passes, and catering requests into SQLite database'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE('Seeding database...'))

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

        # 2. Teams
        teams_data = [
            ('Team ByteCraft', 'Table 01', 'Autonomous Drone Navigation System'),
            ('Team NeuralPulse', 'Table 02', 'Edge AI Vision for Low-Resource Hardware'),
            ('Team CyberKnights', 'Table 03', 'Decentralized Identity & Zero-Knowledge Passes'),
            ('Team HyperLedger', 'Table 04', 'Cross-Chain Smart Contract Arbiter'),
            ('Team MatrixOps', 'Table 05', 'Automated DevOps Chaos Simulator'),
            ('Team CloudScale', 'Table 06', 'Serverless MicroVM Orchestrator'),
            ('Team QuantumLeap', 'Table 07', 'Post-Quantum Lattice Cryptography Suite'),
            ('Team DevHedge', 'Table 08', 'Real-Time DeFi Risk Management Dashboard'),
        ]

        teams = {}
        for name, table, project in teams_data:
            team_obj, _ = Team.objects.get_or_create(
                name=name,
                defaults={'table_number': table, 'project_title': project}
            )
            teams[name] = team_obj

        # 3. Participants
        participants_data = [
            # Team ByteCraft
            ('HACK-01A', 'Aarav Sharma', 'aarav@bytecraft.dev', 'Team ByteCraft', 'present', timezone.now() - timedelta(hours=3, minutes=10)),
            ('HACK-01B', 'Diya Patel', 'diya@bytecraft.dev', 'Team ByteCraft', 'present', timezone.now() - timedelta(hours=3, minutes=8)),
            ('HACK-01C', 'Rohan Iyer', 'rohan@bytecraft.dev', 'Team ByteCraft', 'present', timezone.now() - timedelta(hours=3, minutes=5)),
            ('HACK-01D', 'Ananya Verma', 'ananya@bytecraft.dev', 'Team ByteCraft', 'present', timezone.now() - timedelta(hours=3, minutes=2)),

            # Team NeuralPulse
            ('HACK-02A', 'Karthik Reddy', 'karthik@neuralpulse.ai', 'Team NeuralPulse', 'present', timezone.now() - timedelta(hours=2, minutes=50)),
            ('HACK-02B', 'Sneha Nair', 'sneha@neuralpulse.ai', 'Team NeuralPulse', 'present', timezone.now() - timedelta(hours=2, minutes=45)),
            ('HACK-02C', 'Vikram Joshi', 'vikram@neuralpulse.ai', 'Team NeuralPulse', 'present', timezone.now() - timedelta(hours=2, minutes=40)),
            ('HACK-02D', 'Pooja Hegde', 'pooja@neuralpulse.ai', 'Team NeuralPulse', 'not_scanned', None),

            # Team CyberKnights
            ('HACK-03A', 'Aditya Rao', 'aditya@cyberknights.sec', 'Team CyberKnights', 'present', timezone.now() - timedelta(hours=2, minutes=35)),
            ('HACK-03B', 'Meera Kulkarni', 'meera@cyberknights.sec', 'Team CyberKnights', 'present', timezone.now() - timedelta(hours=2, minutes=30)),
            ('HACK-03C', 'Nikhil Saxena', 'nikhil@cyberknights.sec', 'Team CyberKnights', 'present', timezone.now() - timedelta(hours=2, minutes=25)),
            ('HACK-03D', 'Tanvi Deshmukh', 'tanvi@cyberknights.sec', 'Team CyberKnights', 'absent', None),

            # Team HyperLedger
            ('HACK-04A', 'Arjun Nambiar', 'arjun@hyperledger.io', 'Team HyperLedger', 'present', timezone.now() - timedelta(hours=2, minutes=20)),
            ('HACK-04B', 'Ishita Gupta', 'ishita@hyperledger.io', 'Team HyperLedger', 'present', timezone.now() - timedelta(hours=2, minutes=15)),
            ('HACK-04C', 'Siddharth Menon', 'siddharth@hyperledger.io', 'Team HyperLedger', 'not_scanned', None),
            ('HACK-04D', 'Kavya Pillai', 'kavya@hyperledger.io', 'Team HyperLedger', 'not_scanned', None),

            # Team MatrixOps
            ('HACK-05A', 'Rahul Choudhary', 'rahul@matrixops.net', 'Team MatrixOps', 'present', timezone.now() - timedelta(hours=2, minutes=10)),
            ('HACK-05B', 'Zoya Khan', 'zoya@matrixops.net', 'Team MatrixOps', 'present', timezone.now() - timedelta(hours=2, minutes=8)),
            ('HACK-05C', 'Varun Bhatia', 'varun@matrixops.net', 'Team MatrixOps', 'present', timezone.now() - timedelta(hours=2, minutes=5)),
            ('HACK-05D', 'Rhea Sen', 'rhea@matrixops.net', 'Team MatrixOps', 'present', timezone.now() - timedelta(hours=2, minutes=2)),

            # Team CloudScale
            ('HACK-06A', 'Gaurav Das', 'gaurav@cloudscale.cloud', 'Team CloudScale', 'not_scanned', None),
            ('HACK-06B', 'Shreya Roy', 'shreya@cloudscale.cloud', 'Team CloudScale', 'not_scanned', None),
            ('HACK-06C', 'Manish Tiwari', 'manish@cloudscale.cloud', 'Team CloudScale', 'not_scanned', None),
            ('HACK-06D', 'Priyanka Bose', 'priyanka@cloudscale.cloud', 'Team CloudScale', 'not_scanned', None),
        ]

        participants = {}
        for roll, name, email, team_name, status, scanned in participants_data:
            p_obj, _ = Participant.objects.get_or_create(
                roll_no=roll,
                defaults={
                    'name': name,
                    'email': email,
                    'team': teams[team_name],
                    'table': teams[team_name].table_number,
                    'status': status,
                    'scanned_at': scanned,
                    'marked_by': 'qr_scan' if status == 'present' else ('ops_override' if status == 'absent' else None)
                }
            )
            participants[roll] = p_obj

        # 4. Movement Passes
        passes_data = [
            ('HACK-01D', 'WASHROOM', 'Restroom break - 2nd floor', timezone.now() - timedelta(minutes=4)),
            ('HACK-03A', 'FOOD_PICKUP', 'Outside Swiggy/Zomato delivery gate', timezone.now() - timedelta(minutes=17)),
            ('HACK-04A', 'REST_BREAK', 'Nap pod lounge (Block C)', timezone.now() - timedelta(minutes=32)),
            ('HACK-05A', 'LEFT_VENUE', 'Home to fetch hardware debugger / ESP32 board', timezone.now() - timedelta(minutes=75)),
        ]

        for roll, pass_type, reason, depart in passes_data:
            if roll in participants:
                MovementPass.objects.get_or_create(
                    participant=participants[roll],
                    pass_type=pass_type,
                    status='active',
                    defaults={
                        'day_session': day1,
                        'reason': reason,
                        'depart_time': depart
                    }
                )

        # 5. Food Requests
        food_data = [
            ('Team ByteCraft', 'Diya Patel', 'Table 01', '2x Margherita Pizza, 1x Red Bull', 3, 'Veg', 'preparing', timezone.now() - timedelta(minutes=18)),
            ('Team CyberKnights', 'Meera Kulkarni', 'Table 03', '4x Steaming Masala Chai, 2x Samosa Duo', 6, 'Veg', 'pending', timezone.now() - timedelta(minutes=6)),
            ('Team MatrixOps', 'Zoya Khan', 'Table 05', '1x Avocado & Hummus Bowl', 1, 'Vegan', 'ready', timezone.now() - timedelta(minutes=25)),
            ('Team HyperLedger', 'Ishita Gupta', 'Table 04', '3x BBQ Chicken Pizza Slice', 3, 'Non-Veg', 'delivered', timezone.now() - timedelta(minutes=55)),
        ]

        for tname, pname, table, items, qty, diet, status, req_at in food_data:
            FoodRequest.objects.get_or_create(
                team_name=tname,
                items=items,
                defaults={
                    'team': teams.get(tname),
                    'participant_name': pname,
                    'table': table,
                    'quantity': qty,
                    'dietary': diet,
                    'status': status,
                    'requested_at': req_at,
                    'delivered_at': timezone.now() - timedelta(minutes=10) if status == 'delivered' else None
                }
            )

        # 6. Mentor Requests
        mentor_data = [
            ('Team NeuralPulse', 'Sneha Nair', 'Table 02', 'PyTorch CUDA Out of Memory error on RTX 4090', 'AI / Machine Learning', 'open', None),
            ('Team HyperLedger', 'Ishita Gupta', 'Table 04', 'Smart contract deployment failed on Sepolia RPC', 'Web3 / Blockchain', 'claimed', 'David K. (Mentor)'),
        ]

        for tname, pname, table, topic, cat, status, mentor in mentor_data:
            MentorRequest.objects.get_or_create(
                team_name=tname,
                topic=topic,
                defaults={
                    'team': teams.get(tname),
                    'participant_name': pname,
                    'table': table,
                    'category': cat,
                    'status': status,
                    'mentor_assigned': mentor,
                    'requested_at': timezone.now() - timedelta(minutes=20)
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with teams, participants, passes, and queues!'))
