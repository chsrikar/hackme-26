import express from 'express';
import prisma from '../services/db.js';
import { signPassToken } from '../utils/jwt.js';

const router = express.Router();

/**
 * GET /api/participants
 */
router.get('/participants', async (req, res) => {
  const { team, status } = req.query;
  try {
    const where = {};
    if (team && team !== 'all') {
      where.team = { name: team };
    }

    const participants = await prisma.participant.findMany({
      where,
      include: {
        team: true,
        attendance: { orderBy: { createdAt: 'desc' }, take: 1 },
        passes: { where: { status: { in: ['active', 'overdue'] } } }
      },
      orderBy: { rollNumber: 'asc' }
    });

    const activeSession = await prisma.daySession.findFirst({
      where: { status: 'active' },
      orderBy: { startedAt: 'desc' }
    });

    // Map to convenient structure
    const mapped = participants.map((p) => {
      const activeAtt = p.attendance.find((a) => !activeSession || a.daySessionId === activeSession.id);
      return {
        id: p.id,
        name: p.name,
        rollNumber: p.rollNumber,
        rollNo: p.rollNumber,
        email: p.email,
        phone: p.phone,
        college: p.college,
        department: p.department,
        referral: p.referral,
        teamId: p.teamId,
        team: p.team.name,
        table: p.team.tableNumber,
        status: activeAtt ? activeAtt.status : 'not_scanned',
        scannedAt: activeAtt ? activeAtt.scannedAt : null,
        markedBy: activeAtt ? activeAtt.markedBy : null,
        activePass: p.passes[0] || null
      };
    });

    const filtered = status && status !== 'all' ? mapped.filter((p) => p.status === status) : mapped;
    return res.status(200).json(filtered);
  } catch (err) {
    console.error('[GetParticipants] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch participants.' });
  }
});

/**
 * GET /api/participants/:id/badge-token
 * Generates signed 24H Base Attendance JWT Token for this participant badge
 */
router.get('/participants/:id/badge-token', async (req, res) => {
  const { id } = req.params;
  try {
    const participant = await prisma.participant.findFirst({
      where: { OR: [{ id }, { rollNumber: id.toUpperCase() }] },
      include: { team: true }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found.' });
    }

    const token = signPassToken({
      participantId: participant.id,
      rollNumber: participant.rollNumber,
      name: participant.name,
      team: participant.team.name,
      type: 'base'
    }, '24h');

    return res.status(200).json({
      participantId: participant.id,
      rollNumber: participant.rollNumber,
      name: participant.name,
      team: participant.team.name,
      token
    });
  } catch (err) {
    console.error('[BadgeToken] Error:', err);
    return res.status(500).json({ error: 'Failed to generate badge token.' });
  }
});

/**
 * POST /api/participants/:id/override
 * Manual faculty/staff attendance status override
 */
router.post('/participants/:id/override', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const staffId = req.headers['x-staff-id'] || 'ops_lead';
  const socketIo = req.app.get('io');

  try {
    const activeSession = await prisma.daySession.findFirst({
      where: { status: 'active' },
      orderBy: { startedAt: 'desc' }
    });

    if (!activeSession) {
      return res.status(400).json({ error: 'No active Day Session found.' });
    }

    const participant = await prisma.participant.findFirst({
      where: { OR: [{ id }, { rollNumber: id.toUpperCase() }] },
      include: { team: true }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found.' });
    }

    const now = new Date();
    const record = await prisma.attendanceRecord.upsert({
      where: {
        participantId_daySessionId: {
          participantId: participant.id,
          daySessionId: activeSession.id
        }
      },
      update: {
        status: status || 'present',
        scannedAt: status === 'present' ? now : null,
        markedBy: 'manual_override',
        overrideByStaffId: `${staffId}:${notes || 'Manual Override'}`
      },
      create: {
        participantId: participant.id,
        daySessionId: activeSession.id,
        status: status || 'present',
        scannedAt: status === 'present' ? now : null,
        markedBy: 'manual_override',
        overrideByStaffId: `${staffId}:${notes || 'Manual Override'}`
      }
    });

    if (socketIo) {
      socketIo.to(activeSession.id).emit('attendance:marked', {
        participantId: participant.id,
        participantName: participant.name,
        rollNumber: participant.rollNumber,
        team: participant.team.name,
        table: participant.team.tableNumber,
        status: record.status,
        markedBy: 'manual_override'
      });
    }

    return res.status(200).json({ success: true, record, participant });
  } catch (err) {
    console.error('[Override] Error:', err);
    return res.status(500).json({ error: 'Failed to apply manual override.' });
  }
});

/**
 * GET /api/days
 */
router.get('/days', async (req, res) => {
  try {
    const days = await prisma.daySession.findMany({
      orderBy: { startedAt: 'desc' },
      include: {
        _count: {
          select: { attendance: true, passes: true }
        }
      }
    });
    return res.status(200).json(days);
  } catch (err) {
    console.error('[GetDays] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch day sessions.' });
  }
});

/**
 * GET /api/reports/summary
 */
router.get('/reports/summary', async (req, res) => {
  try {
    const totalParticipants = await prisma.participant.count();
    const activeSession = await prisma.daySession.findFirst({
      where: { status: 'active' },
      orderBy: { startedAt: 'desc' }
    });

    const checkedIn = activeSession
      ? await prisma.attendanceRecord.count({
          where: { daySessionId: activeSession.id, status: 'present' }
        })
      : 0;

    const activePasses = await prisma.movementPass.count({
      where: { status: { in: ['active', 'overdue'] } }
    });

    const totalFood = await prisma.foodRequest.count();
    const deliveredFood = await prisma.foodRequest.count({ where: { status: 'delivered' } });

    // Group passes by type
    const passGroups = await prisma.movementPass.groupBy({
      by: ['passType'],
      _count: { id: true }
    });
    const passesByType = {};
    passGroups.forEach((g) => {
      passesByType[g.passType.toUpperCase()] = g._count.id;
    });

    return res.status(200).json({
      total_participants: totalParticipants,
      checked_in: checkedIn,
      attendance_rate: totalParticipants ? Math.round((checkedIn / totalParticipants) * 1000) / 10 : 0,
      active_passes: activePasses,
      total_food_orders: totalFood,
      delivered_food_orders: deliveredFood,
      passes_by_type: passesByType
    });
  } catch (err) {
    console.error('[Summary] Error:', err);
    return res.status(500).json({ error: 'Failed to compile summary.' });
  }
});

export default router;
