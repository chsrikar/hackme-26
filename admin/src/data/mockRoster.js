// Hackathon Operations Dataset (Empty initial state for real-time QR scan tracking)

export const MOCK_OPS_USER = {
  id: 'lead_01',
  name: 'Alex Mercer',
  email: 'ops.lead@hackme26.dev',
  role: 'Operations Director',
  station: 'Main Stage Command Desk',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

export const MOCK_FACULTY = MOCK_OPS_USER;

export const MOCK_DAYS = [
  {
    id: 'day-1',
    code: 'Day 1',
    name: 'Day 1 — 24H Overnight Sprint & Hacking Kickoff',
    startTime: '10:00 AM (Saturday)',
    expectedEndTime: '10:00 AM (Sunday)',
    totalParticipants: 0,
    totalTeams: 0,
    venue: 'Convention Center Arena & Lab A'
  },
  {
    id: 'day-2',
    code: 'Day 2',
    name: 'Day 2 — Final Polish, Code Freeze & Project Demos',
    startTime: '10:00 AM (Sunday)',
    expectedEndTime: '06:00 PM (Sunday)',
    totalParticipants: 0,
    totalTeams: 0,
    venue: 'Main Stage Auditorium'
  }
];

export const HACKATHON_TEAMS = [
  "Team ByteCraft",
  "Team NeuralPulse",
  "Team CyberKnights",
  "Team HyperLedger",
  "Team MatrixOps",
  "Team CloudScale",
  "Team QuantumLeap",
  "Team DevHedge",
  "Team ApexCoders",
  "Team CodePulse",
  "Team SynthAI",
  "Team LogicForge",
  "Team AlgoKnights",
  "Team BinaryBandits",
  "Team CircuitBreakers",
  "Team Zenith"
];

// Clean empty arrays — records are dynamically added only when real QR badges are scanned
export const INITIAL_PARTICIPANTS = [];
export const INITIAL_ACTIVE_PASSES = [];
export const INITIAL_FOOD_REQUESTS = [];
export const INITIAL_MENTOR_REQUESTS = [];

export const MOCK_DAY_HISTORY = [
  {
    id: 'hist-d1',
    dayCode: 'Day 1',
    dayName: 'Day 1 — 24H Overnight Sprint',
    date: '2026-09-20',
    startTime: '10:00 AM',
    endTime: '10:00 AM (Day 2)',
    totalCheckedIn: 0,
    totalRegistered: 0,
    teamsCompleted: 0,
    totalTeams: 0,
    passesByType: {
      WASHROOM: 0,
      FOOD_PICKUP: 0,
      REST_BREAK: 0,
      LEFT_VENUE: 0
    },
    overdueIncidents: 0,
    foodRequestsDelivered: 0,
    status: 'closed'
  }
];

export const MOCK_REPORT_TRENDS = [];
export const MOCK_PASS_FREQUENCY_REPORT = [];
export const MOCK_FOOD_DEMAND_TREND = [];
