import prisma from '../services/db.js';

async function resetDatabase() {
  console.log('🧹 Wiping all data from SQLite database for clean fresh-scan operation...');

  // Delete all dependent records first
  await prisma.attendanceRecord.deleteMany();
  await prisma.movementPass.deleteMany();
  await prisma.foodRequest.deleteMany();
  await prisma.mentorRequest.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.team.deleteMany();
  await prisma.daySession.deleteMany();

  // Create clean Day 1 active session so scans have an active day to record to
  const daySession = await prisma.daySession.create({
    data: {
      id: 'day-sess-01',
      label: 'Day 1 — 24H Overnight Sprint & Hacking Kickoff',
      startedAt: new Date(),
      status: 'active'
    }
  });

  console.log(`✅ All participants, teams, passes, and records deleted!`);
  console.log(`Active Day Session created: "${daySession.label}" (ID: ${daySession.id})`);
  console.log(`Total Participants in DB: 0`);
  console.log(`Total Teams in DB: 0`);
  console.log(`Database is now completely blank and ready for real QR badge scans.`);
}

resetDatabase()
  .catch((err) => {
    console.error('Reset failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
