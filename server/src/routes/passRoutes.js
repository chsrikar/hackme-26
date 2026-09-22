import express from 'express';
import { z } from 'zod';
import prisma from '../services/db.js';
import { PASS_CONFIG } from '../config/constants.js';
import { signPassToken } from '../utils/jwt.js';

const router = express.Router();

const passRequestSchema = z.object({
  participantId: z.string().min(1, 'participantId is required'),
  passType: z.enum(['washroom', 'food_pickup', 'rest_break', 'left_venue']),
  reason: z.string().optional()
});

/**
 * POST /api/passes/request
 * Initiates a movement pass, checks active attendance & open pass constraints,
 * creates MovementPass record, and returns signed movement QR token.
 */
router.post('/request', async (req, res) => {
  const parseResult = passRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation error', details: parseResult.error.errors });
  }

  const { participantId, passType, reason } = parseResult.data;
  const socketIo = req.app.get('io');

  try {
    // 1. Get active day session
    const activeSession = await prisma.daySession.findFirst({
      where: { status: 'active' },
      orderBy: { startedAt: 'desc' }
    });

    if (!activeSession) {
      return res.status(400).json({ error: 'No active Day Session found.' });
    }

    // 2. Fetch participant
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: { team: true }
    });

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found.' });
    }

    // 3. Enforce Rule: Must have marked attendance for active session
    const attendance = await prisma.attendanceRecord.findUnique({
      where: {
        participantId_daySessionId: {
          participantId: participant.id,
          daySessionId: activeSession.id
        }
      }
    });

    if (!attendance || attendance.status !== 'present') {
      return res.status(403).json({
        error: `${participant.name} is not checked into the active session. Check in first before requesting a pass.`
      });
    }

    // 4. Enforce Rule: Cannot have multiple open active passes simultaneously
    const existingPass = await prisma.movementPass.findFirst({
      where: {
        participantId: participant.id,
        status: { in: ['active', 'overdue'] }
      }
    });

    if (existingPass) {
      return res.status(409).json({
        error: `${participant.name} already has an active ${existingPass.passType} pass open.`
      });
    }

    // 5. Calculate Return Threshold & Expiry
    const config = PASS_CONFIG[passType];
    const requestedAt = new Date();
    const expectedReturnBy = new Date(requestedAt.getTime() + config.thresholdMinutes * 60 * 1000);

    // 6. Create MovementPass in Database
    const newPass = await prisma.movementPass.create({
      data: {
        participantId: participant.id,
        daySessionId: activeSession.id,
        passType,
        reason: reason || `Authorized ${config.label}`,
        requestedAt,
        expectedReturnBy,
        status: 'active'
      }
    });

    // 7. Generate Signed QR Token (Short-lived: 2x threshold)
    const qrToken = signPassToken(
      {
        participantId: participant.id,
        passId: newPass.id,
        rollNumber: participant.rollNumber,
        name: participant.name,
        passType
      },
      `${config.tokenExpiryMinutes}m`
    );

    // 8. Broadcast to staff dashboard via Socket.io
    if (socketIo) {
      socketIo.to(activeSession.id).emit('hallpass:requested', {
        passId: newPass.id,
        participantId: participant.id,
        participantName: participant.name,
        rollNumber: participant.rollNumber,
        team: participant.team.name,
        table: participant.team.tableNumber,
        passType,
        reason: newPass.reason,
        requestedAt: requestedAt.toISOString(),
        expectedReturnBy: expectedReturnBy.toISOString(),
        thresholdMinutes: config.thresholdMinutes
      });
    }

    return res.status(201).json({
      success: true,
      pass: newPass,
      qrToken,
      config
    });
  } catch (err) {
    console.error('[PassRequest] Error:', err);
    return res.status(500).json({ error: 'Failed to issue movement pass.' });
  }
});

/**
 * POST /api/passes/:id/force-close
 * Staff manual force-close with audit logging
 */
router.post('/:id/force-close', async (req, res) => {
  const { id } = req.params;
  const staffId = req.headers['x-staff-id'] || 'ops_lead';
  const socketIo = req.app.get('io');

  try {
    const pass = await prisma.movementPass.findUnique({
      where: { id },
      include: { participant: { include: { team: true } }, daySession: true }
    });

    if (!pass) {
      return res.status(404).json({ error: 'Pass record not found.' });
    }

    const now = new Date();
    const durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(pass.requestedAt).getTime()) / 1000));

    const updated = await prisma.movementPass.update({
      where: { id },
      data: {
        status: 'returned',
        closedBy: `staff_force_close:${staffId}`,
        returnedAt: now
      }
    });

    if (socketIo && pass.daySessionId) {
      socketIo.to(pass.daySessionId).emit('hallpass:returned', {
        passId: updated.id,
        participantId: pass.participantId,
        participantName: pass.participant.name,
        rollNumber: pass.participant.rollNumber,
        team: pass.participant.team.name,
        passType: pass.passType,
        durationSeconds,
        closedBy: updated.closedBy,
        returnedAt: now.toISOString()
      });
    }

    return res.status(200).json({ success: true, pass: updated });
  } catch (err) {
    console.error('[PassForceClose] Error:', err);
    return res.status(500).json({ error: 'Failed to force-close pass.' });
  }
});

/**
 * GET /api/passes/active
 * Returns all active & overdue passes
 */
router.get('/active', async (req, res) => {
  try {
    const passes = await prisma.movementPass.findMany({
      where: { status: { in: ['active', 'overdue'] } },
      include: {
        participant: { include: { team: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });

    return res.status(200).json(passes);
  } catch (err) {
    console.error('[GetActivePasses] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch active passes.' });
  }
});

export default router;
