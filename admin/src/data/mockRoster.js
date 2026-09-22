// Hackathon Operations Dataset (Days, Teams, Participants, Passes, Food & Mentor Queues)

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
    totalParticipants: 64,
    totalTeams: 16,
    venue: 'Convention Center Arena & Lab A'
  },
  {
    id: 'day-2',
    code: 'Day 2',
    name: 'Day 2 — Final Polish, Code Freeze & Project Demos',
    startTime: '10:00 AM (Sunday)',
    expectedEndTime: '06:00 PM (Sunday)',
    totalParticipants: 64,
    totalTeams: 16,
    venue: 'Main Stage Auditorium'
  }
];

export const HACKATHON_TEAMS = [
  'Team ByteCraft',
  'Team NeuralPulse',
  'Team CyberKnights',
  'Team HyperLedger',
  'Team MatrixOps',
  'Team CloudScale',
  'Team QuantumLeap',
  'Team DevHedge'
];

export const INITIAL_PARTICIPANTS = [
  // Team ByteCraft (Table 01)
  { id: 'p1', name: 'Aarav Sharma', rollNo: 'HACK-01A', team: 'Team ByteCraft', table: 'Table 01', status: 'present', scannedAt: '10:05 AM', markedBy: 'qr_scan', phone: '+1 555-0101' },
  { id: 'p2', name: 'Diya Patel', rollNo: 'HACK-01B', team: 'Team ByteCraft', table: 'Table 01', status: 'present', scannedAt: '10:07 AM', markedBy: 'qr_scan', phone: '+1 555-0102' },
  { id: 'p3', name: 'Rohan Iyer', rollNo: 'HACK-01C', team: 'Team ByteCraft', table: 'Table 01', status: 'present', scannedAt: '10:08 AM', markedBy: 'qr_scan', phone: '+1 555-0103' },
  { id: 'p4', name: 'Ananya Verma', rollNo: 'HACK-01D', team: 'Team ByteCraft', table: 'Table 01', status: 'present', scannedAt: '10:12 AM', markedBy: 'qr_scan', phone: '+1 555-0104' },

  // Team NeuralPulse (Table 02)
  { id: 'p5', name: 'Karthik Reddy', rollNo: 'HACK-02A', team: 'Team NeuralPulse', table: 'Table 02', status: 'present', scannedAt: '10:15 AM', markedBy: 'qr_scan', phone: '+1 555-0201' },
  { id: 'p6', name: 'Sneha Nair', rollNo: 'HACK-02B', team: 'Team NeuralPulse', table: 'Table 02', status: 'present', scannedAt: '10:18 AM', markedBy: 'qr_scan', phone: '+1 555-0202' },
  { id: 'p7', name: 'Vikram Joshi', rollNo: 'HACK-02C', team: 'Team NeuralPulse', table: 'Table 02', status: 'present', scannedAt: '10:20 AM', markedBy: 'qr_scan', phone: '+1 555-0203' },
  { id: 'p8', name: 'Pooja Hegde', rollNo: 'HACK-02D', team: 'Team NeuralPulse', table: 'Table 02', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0204' },

  // Team CyberKnights (Table 03)
  { id: 'p9', name: 'Aditya Rao', rollNo: 'HACK-03A', team: 'Team CyberKnights', table: 'Table 03', status: 'present', scannedAt: '10:22 AM', markedBy: 'qr_scan', phone: '+1 555-0301' },
  { id: 'p10', name: 'Meera Kulkarni', rollNo: 'HACK-03B', team: 'Team CyberKnights', table: 'Table 03', status: 'present', scannedAt: '10:24 AM', markedBy: 'qr_scan', phone: '+1 555-0302' },
  { id: 'p11', name: 'Nikhil Saxena', rollNo: 'HACK-03C', team: 'Team CyberKnights', table: 'Table 03', status: 'present', scannedAt: '10:25 AM', markedBy: 'qr_scan', phone: '+1 555-0303' },
  { id: 'p12', name: 'Tanvi Deshmukh', rollNo: 'HACK-03D', team: 'Team CyberKnights', table: 'Table 03', status: 'absent', scannedAt: null, markedBy: 'ops_override', phone: '+1 555-0304' },

  // Team HyperLedger (Table 04)
  { id: 'p13', name: 'Arjun Nambiar', rollNo: 'HACK-04A', team: 'Team HyperLedger', table: 'Table 04', status: 'present', scannedAt: '10:30 AM', markedBy: 'qr_scan', phone: '+1 555-0401' },
  { id: 'p14', name: 'Ishita Gupta', rollNo: 'HACK-04B', team: 'Team HyperLedger', table: 'Table 04', status: 'present', scannedAt: '10:31 AM', markedBy: 'qr_scan', phone: '+1 555-0402' },
  { id: 'p15', name: 'Siddharth Menon', rollNo: 'HACK-04C', team: 'Team HyperLedger', table: 'Table 04', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0403' },
  { id: 'p16', name: 'Kavya Pillai', rollNo: 'HACK-04D', team: 'Team HyperLedger', table: 'Table 04', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0404' },

  // Team MatrixOps (Table 05)
  { id: 'p17', name: 'Rahul Choudhary', rollNo: 'HACK-05A', team: 'Team MatrixOps', table: 'Table 05', status: 'present', scannedAt: '10:35 AM', markedBy: 'qr_scan', phone: '+1 555-0501' },
  { id: 'p18', name: 'Zoya Khan', rollNo: 'HACK-05B', team: 'Team MatrixOps', table: 'Table 05', status: 'present', scannedAt: '10:38 AM', markedBy: 'qr_scan', phone: '+1 555-0502' },
  { id: 'p19', name: 'Varun Bhatia', rollNo: 'HACK-05C', team: 'Team MatrixOps', table: 'Table 05', status: 'present', scannedAt: '10:40 AM', markedBy: 'qr_scan', phone: '+1 555-0503' },
  { id: 'p20', name: 'Rhea Sen', rollNo: 'HACK-05D', team: 'Team MatrixOps', table: 'Table 05', status: 'present', scannedAt: '10:42 AM', markedBy: 'qr_scan', phone: '+1 555-0504' },

  // Team CloudScale (Table 06)
  { id: 'p21', name: 'Gaurav Das', rollNo: 'HACK-06A', team: 'Team CloudScale', table: 'Table 06', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0601' },
  { id: 'p22', name: 'Shreya Roy', rollNo: 'HACK-06B', team: 'Team CloudScale', table: 'Table 06', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0602' },
  { id: 'p23', name: 'Manish Tiwari', rollNo: 'HACK-06C', team: 'Team CloudScale', table: 'Table 06', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0603' },
  { id: 'p24', name: 'Priyanka Bose', rollNo: 'HACK-06D', team: 'Team CloudScale', table: 'Table 06', status: 'not_scanned', scannedAt: null, markedBy: null, phone: '+1 555-0604' }
];

export const INITIAL_ACTIVE_PASSES = [
  {
    id: 'pass-01',
    studentId: 'p4',
    participantName: 'Ananya Verma',
    rollNo: 'HACK-01D',
    team: 'Team ByteCraft',
    passType: 'WASHROOM',
    reason: 'Restroom break - 2nd floor',
    departTime: Date.now() - 4 * 60 * 1000, // 4m ago (timeout is 10m)
    status: 'active'
  },
  {
    id: 'pass-02',
    studentId: 'p9',
    participantName: 'Aditya Rao',
    rollNo: 'HACK-03A',
    team: 'Team CyberKnights',
    passType: 'FOOD_PICKUP',
    reason: 'Outside Swiggy/Zomato delivery pickup gate',
    departTime: Date.now() - 17 * 60 * 1000, // 17m ago (timeout 20m -> warning)
    status: 'active'
  },
  {
    id: 'pass-03',
    studentId: 'p13',
    participantName: 'Arjun Nambiar',
    rollNo: 'HACK-04A',
    team: 'Team HyperLedger',
    passType: 'REST_BREAK',
    reason: 'Quiet nap pod lounge (Block C)',
    departTime: Date.now() - 32 * 60 * 1000, // 32m ago (timeout 45m -> normal)
    status: 'active'
  },
  {
    id: 'pass-04',
    studentId: 'p17',
    participantName: 'Rahul Choudhary',
    rollNo: 'HACK-05A',
    team: 'Team MatrixOps',
    passType: 'LEFT_VENUE',
    reason: 'Home to fetch hardware debugger / ESP32 board',
    departTime: Date.now() - 75 * 60 * 1000, // 75m ago (timeout 60m -> OVERDUE CRITICAL)
    status: 'active'
  }
];

export const INITIAL_FOOD_REQUESTS = [
  {
    id: 'food-01',
    team: 'Team ByteCraft',
    participantName: 'Diya Patel',
    table: 'Table 01',
    items: '2x Margherita Pizza, 1x Red Bull',
    quantity: 3,
    dietary: 'Veg',
    notes: 'No spicy seasoning please',
    status: 'preparing', // 'pending' | 'preparing' | 'ready' | 'delivered'
    requestedAt: Date.now() - 18 * 60 * 1000
  },
  {
    id: 'food-02',
    team: 'Team CyberKnights',
    participantName: 'Meera Kulkarni',
    table: 'Table 03',
    items: '4x Steaming Masala Chai, 2x Samosa Duo',
    quantity: 6,
    dietary: 'Veg',
    notes: 'Urgent for debugging sprint',
    status: 'pending',
    requestedAt: Date.now() - 6 * 60 * 1000
  },
  {
    id: 'food-03',
    team: 'Team MatrixOps',
    participantName: 'Zoya Khan',
    table: 'Table 05',
    items: '1x Avocado & Hummus Bowl',
    quantity: 1,
    dietary: 'Vegan',
    notes: 'Strict vegan, nut allergy',
    status: 'ready',
    requestedAt: Date.now() - 25 * 60 * 1000
  },
  {
    id: 'food-04',
    team: 'Team HyperLedger',
    participantName: 'Ishita Gupta',
    table: 'Table 04',
    items: '3x BBQ Chicken Pizza Slice',
    quantity: 3,
    dietary: 'Non-Veg',
    notes: 'Delivered to Table 04 lounge',
    status: 'delivered',
    requestedAt: Date.now() - 55 * 60 * 1000,
    deliveredAt: Date.now() - 10 * 60 * 1000
  }
];

export const INITIAL_MENTOR_REQUESTS = [
  {
    id: 'mnt-01',
    team: 'Team NeuralPulse',
    participantName: 'Sneha Nair',
    table: 'Table 02',
    topic: 'PyTorch CUDA Out of Memory error on RTX 4090',
    category: 'AI / Machine Learning',
    status: 'open', // 'open' | 'claimed' | 'resolved'
    mentorAssigned: null,
    requestedAt: Date.now() - 14 * 60 * 1000
  },
  {
    id: 'mnt-02',
    team: 'Team HyperLedger',
    participantName: 'Ishita Gupta',
    table: 'Table 04',
    topic: 'Smart contract deployment failed on Sepolia RPC',
    category: 'Web3 / Blockchain',
    status: 'claimed',
    mentorAssigned: 'David K. (Mentor)',
    requestedAt: Date.now() - 30 * 60 * 1000
  }
];

export const MOCK_DAY_HISTORY = [
  {
    id: 'hist-d1',
    dayCode: 'Day 1',
    dayName: 'Day 1 — 24H Overnight Sprint',
    date: '2026-09-20',
    startTime: '10:00 AM',
    endTime: '10:00 AM (Day 2)',
    totalCheckedIn: 61,
    totalRegistered: 64,
    teamsCompleted: 15,
    totalTeams: 16,
    passesByType: {
      WASHROOM: 38,
      FOOD_PICKUP: 24,
      REST_BREAK: 19,
      LEFT_VENUE: 5
    },
    overdueIncidents: 3,
    foodRequestsDelivered: 42,
    status: 'closed'
  }
];

export const MOCK_REPORT_TRENDS = [
  { date: 'Day 1 - 10 AM', rate: 52, present: 33, absent: 31 },
  { date: 'Day 1 - 02 PM', rate: 78, present: 50, absent: 14 },
  { date: 'Day 1 - 08 PM', rate: 94, present: 60, absent: 4 },
  { date: 'Day 1 - Midnight', rate: 91, present: 58, absent: 6 },
  { date: 'Day 2 - 04 AM', rate: 86, present: 55, absent: 9 },
  { date: 'Day 2 - 10 AM', rate: 97, present: 62, absent: 2 }
];

export const MOCK_PASS_FREQUENCY_REPORT = [
  { team: 'Team MatrixOps', participant: 'Rahul Choudhary', rollNo: 'HACK-05A', washroom: 4, food: 3, rest: 2, leftVenue: 3, total: 12, flagAbuse: true },
  { team: 'Team CyberKnights', participant: 'Aditya Rao', rollNo: 'HACK-03A', washroom: 3, food: 4, rest: 1, leftVenue: 1, total: 9, flagAbuse: true },
  { team: 'Team HyperLedger', participant: 'Arjun Nambiar', rollNo: 'HACK-04A', washroom: 2, food: 2, rest: 3, leftVenue: 0, total: 7, flagAbuse: false },
  { team: 'Team ByteCraft', participant: 'Ananya Verma', rollNo: 'HACK-01D', washroom: 3, food: 2, rest: 1, leftVenue: 0, total: 6, flagAbuse: false },
  { team: 'Team NeuralPulse', participant: 'Karthik Reddy', rollNo: 'HACK-02A', washroom: 2, food: 1, rest: 1, leftVenue: 0, total: 4, flagAbuse: false }
];

export const MOCK_FOOD_DEMAND_TREND = [
  { time: '12:00 PM', orders: 18, delivered: 18 },
  { time: '04:00 PM', orders: 12, delivered: 12 },
  { time: '08:00 PM', orders: 34, delivered: 34 },
  { time: '12:00 AM', orders: 48, delivered: 46 }, // Midnight peak!
  { time: '03:00 AM', orders: 28, delivered: 26 }, // Late night chai & Red Bull
  { time: '07:00 AM', orders: 32, delivered: 30 }  // Breakfast rush
];
