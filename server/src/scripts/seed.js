import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../services/db.js';
import { signPassToken } from '../utils/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanPhone(p) {
  if (!p || p.trim() === '.') return '+91 9847000000';
  p = p.trim();
  try {
    const val = parseInt(parseFloat(p));
    const s = String(val);
    if (s.length === 10) return '+91 ' + s;
    if (s.length === 12 && s.startsWith('91')) return '+' + s.slice(0, 2) + ' ' + s.slice(2);
    return s;
  } catch {
    const digits = p.replace(/\D/g, '');
    if (digits.length === 10) return '+91 ' + digits;
    return p;
  }
}

function cleanEmail(e, name) {
  if (!e || e.trim() === '.') {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${slug}@visat.ac.in`;
  }
  e = e.trim().replace(/\s+/g, '');
  if (!e.endsWith('.com') && !e.endsWith('.in') && e.includes('@')) {
    e = e + '.com';
  }
  return e;
}

const TEAM_METADATA = [
  { name: 'Team ByteCraft', table: 'Table 01', project: 'Autonomous Drone Path Optimizer' },
  { name: 'Team NeuralPulse', table: 'Table 02', project: 'Neural Speech Synthesis & Voice Translation' },
  { name: 'Team CyberKnights', table: 'Table 03', project: 'Zero-Trust Identity & QR Verification Protocol' },
  { name: 'Team HyperLedger', table: 'Table 04', project: 'Cross-Chain Decentralized Liquidity Vault' },
  { name: 'Team MatrixOps', table: 'Table 05', project: 'Kubernetes Cluster Self-Healing Engine' },
  { name: 'Team CloudScale', table: 'Table 06', project: 'Edge-Cached Serverless MicroVM Gateway' },
  { name: 'Team QuantumLeap', table: 'Table 07', project: 'Post-Quantum Lattice Key Exchange' },
  { name: 'Team DevHedge', table: 'Table 08', project: 'Decentralized Algorithmic Orderbook' },
  { name: 'Team ApexCoders', table: 'Table 09', project: 'Low-Latency Multi-Agent Swarm Framework' },
  { name: 'Team CodePulse', table: 'Table 10', project: 'Computer Vision PPE & Safety Inspector' },
  { name: 'Team SynthAI', table: 'Table 11', project: 'Context-Aware Healthcare Diagnostic Copilot' },
  { name: 'Team LogicForge', table: 'Table 12', project: 'Offline Mesh Emergency Dispatcher' },
  { name: 'Team AlgoKnights', table: 'Table 13', project: 'Dynamic Smart-City Traffic Router' },
  { name: 'Team BinaryBandits', table: 'Table 14', project: 'Automated Smart Contract Vulnerability Auditor' },
  { name: 'Team CircuitBreakers', table: 'Table 15', project: 'IoT Power Grid Optimization Matrix' },
  { name: 'Team Zenith', table: 'Table 16', project: 'Biometric Anti-Spoofing Sentinel' },
];

async function seed() {
  console.log('🌱 Starting Prisma database seeding for HackMe 26...');

  // 1. Wipe existing records cleanly
  await prisma.attendanceRecord.deleteMany();
  await prisma.movementPass.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.mentorRequest.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.team.deleteMany();
  await prisma.daySession.deleteMany();

  // 2. Day Sessions
  const day1 = await prisma.daySession.create({
    data: {
      id: 'day-sess-01',
      label: 'Day 1 — 24H Overnight Sprint',
      startedAt: new Date(Date.now() - 3 * 3600 * 1000 - 15 * 60 * 1000),
      status: 'active'
    }
  });

  const day2 = await prisma.daySession.create({
    data: {
      id: 'day-sess-02',
      label: 'Day 2 — Final Polish & Demos',
      startedAt: new Date(Date.now() + 24 * 3600 * 1000),
      status: 'closed'
    }
  });

  // 3. Create Teams
  const createdTeams = [];
  for (const t of TEAM_METADATA) {
    const team = await prisma.team.create({
      data: {
        name: t.name,
        tableNumber: t.table,
        projectTitle: t.project
      }
    });
    createdTeams.push(team);
  }

  // 4. Load Real Participants from parsed_responses.json
  const jsonPath = path.resolve(__dirname, '../../../admin/data/parsed_responses.json');
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const rows = rawData.slice(1);

  console.log(`Loaded ${rows.length} real participant rows from parsed_responses.json.`);

  const letters = ['A', 'B', 'C', 'D'];
  const createdParticipants = [];

  for (let tIdx = 0; tIdx < createdTeams.length; tIdx++) {
    const team = createdTeams[tIdx];
    const count = tIdx === 15 ? 2 : 4;
    const startRow = tIdx * 4;
    const squad = rows.slice(startRow, startRow + count);

    for (let mIdx = 0; mIdx < squad.length; mIdx++) {
      const row = squad[mIdx];
      const rollNumber = `HACK-${String(tIdx + 1).padStart(2, '0')}${letters[mIdx]}`;
      const name = row[1]?.trim() || `Participant ${rollNumber}`;
      const college = row[2]?.trim() || 'VISAT';
      const department = row[3]?.trim() || 'CSE';
      const phone = cleanPhone(row[4]);
      const email = cleanEmail(row[5], name);
      const referral = row[7]?.trim() || null;

      const participant = await prisma.participant.create({
        data: {
          name,
          rollNumber,
          email,
          phone,
          college,
          department,
          referral,
          teamId: team.id
        }
      });
      createdParticipants.push(participant);

      // Initial attendance: mark ~50 present, leave some not_scanned
      const gIdx = createdParticipants.length - 1;
      if (![59, 60, 61, 52, 53, 35, 36].includes(gIdx)) {
        await prisma.attendanceRecord.create({
          data: {
            participantId: participant.id,
            daySessionId: day1.id,
            status: gIdx === 13 ? 'absent' : 'present',
            scannedAt: gIdx === 13 ? null : new Date(Date.now() - (60 - gIdx) * 60 * 1000),
            markedBy: gIdx === 13 ? 'manual_override' : 'scan'
          }
        });
      }
    }
  }

  console.log(`Created ${createdTeams.length} teams and ${createdParticipants.length} real participants.`);

  // 5. Seed Movement Passes for Demo
  const passDemos = [
    { rollNumber: 'HACK-01D', passType: 'washroom', minsAgo: 4, limitMins: 10, reason: 'Restroom break - 2nd floor' },
    { rollNumber: 'HACK-02B', passType: 'food_pickup', minsAgo: 14, limitMins: 20, reason: 'Outside Swiggy/Zomato pickup gate' },
    { rollNumber: 'HACK-03A', passType: 'rest_break', minsAgo: 32, limitMins: 45, reason: 'Quiet nap pod lounge (Block C)' },
    { rollNumber: 'HACK-05A', passType: 'left_venue', minsAgo: 75, limitMins: 90, reason: 'Home to fetch hardware debugger / ESP32 board' },
  ];

  for (const p of passDemos) {
    const part = createdParticipants.find((cp) => cp.rollNumber === p.rollNumber);
    if (part) {
      const requestedAt = new Date(Date.now() - p.minsAgo * 60 * 1000);
      const expectedReturnBy = new Date(requestedAt.getTime() + p.limitMins * 60 * 1000);
      await prisma.movementPass.create({
        data: {
          participantId: part.id,
          daySessionId: day1.id,
          passType: p.passType,
          reason: p.reason,
          requestedAt,
          expectedReturnBy,
          status: 'active'
        }
      });
    }
  }

  // 6. Food Requests
  const foodOrders = [
    { teamName: 'Team ByteCraft', items: '2x Margherita Pizza, 1x Red Bull', qty: 3, diet: 'Veg', status: 'preparing' },
    { teamName: 'Team CyberKnights', items: '4x Steaming Masala Chai, 2x Samosa Duo', qty: 6, diet: 'Veg', status: 'pending' },
    { teamName: 'Team MatrixOps', items: '1x Avocado & Hummus Bowl', qty: 1, diet: 'Vegan', status: 'ready' },
    { teamName: 'Team HyperLedger', items: '3x BBQ Chicken Pizza Slice', qty: 3, diet: 'Non-Veg', status: 'delivered' },
  ];

  for (const f of foodOrders) {
    const team = createdTeams.find((ct) => ct.name === f.teamName);
    await prisma.foodRequest.create({
      data: {
        teamId: team?.id,
        teamName: f.teamName,
        table: team?.tableNumber,
        items: f.items,
        quantity: f.qty,
        dietaryNote: f.diet,
        status: f.status
      }
    });
  }

  // Generate a sample signed Base JWT QR token for the first participant
  const sampleParticipant = createdParticipants[0];
  const sampleToken = signPassToken({
    participantId: sampleParticipant.id,
    rollNumber: sampleParticipant.rollNumber,
    name: sampleParticipant.name,
    team: 'Team ByteCraft',
    type: 'base'
  }, '24h');

  console.log('\n✅ Database seeded successfully!');
  console.log(`Sample test QR Token for ${sampleParticipant.name} (${sampleParticipant.rollNumber}):\n${sampleToken}\n`);
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
