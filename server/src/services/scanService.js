import prisma from './db.js';
import { verifyPassToken } from '../utils/jwt.js';

/**
 * Process a scanned QR code with intent detection & transactional database updates
 * @param {string} rawToken - Scanned QR string (JWT or formatted payload)
 * @param {object} socketIo - Socket.io server instance for real-time broadcasts
 * @param {string} staffId - Optional staff ID performing the scan
 */
export async function processScan(rawToken, socketIo, staffId = 'scanner_station') {
  if (!rawToken || typeof rawToken !== 'string') {
    const error = new Error('No QR token provided');
    error.status = 400;
    error.code = 'INVALID_QR';
    throw error;
  }

  // 1. Decode & verify JWT or raw QR string
  let payload;
  try {
    payload = verifyPassToken(rawToken);
  } catch (err) {
    const trimmed = rawToken.trim();
    // If scanner emitted JSON payload (e.g. from UI simulator or custom pass app)
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        payload = JSON.parse(trimmed);
        if (!payload.rollNumber) {
          payload.rollNumber = payload.rollNo || payload.passId || payload.pass_id || payload.id;
        }
        if (!payload.name && payload.participantName) {
          payload.name = payload.participantName;
        }
        if (!payload.team && payload.teamName) {
          payload.team = payload.teamName;
        }
      } catch {}
    } else {
      // Direct badge code match (e.g. "HACK-01A" or badge ID)
      const match = trimmed.match(/HACK-[0-9]{2}[A-D]/i) || trimmed.match(/^[A-Z0-9_-]{3,20}$/i);
      if (match) {
        payload = {
          rollNumber: match[0].toUpperCase(),
          name: `Badge ${match[0].toUpperCase()}`,
          team: 'Open Squad',
          type: 'base'
        };
      }
    }

    if (!payload) {
      const error = new Error(err.message || 'Failed to verify QR token');
      error.status = 400;
      error.code = err.code || 'INVALID_QR';
      throw error;
    }
  }

  const passId = payload.movementPassId || (payload.type === 'RETURN' ? payload.passId : null);
  const rollNumber = (payload.rollNumber || payload.rollNo || payload.passId || payload.pass_id || '').trim();
  const participantId = payload.participantId || payload.studentId;

  if (!participantId && !rollNumber) {
    const error = new Error('Token payload missing participant badge identifier (e.g. rollNumber, rollNo, passId)');
    error.status = 400;
    error.code = 'INVALID_QR';
    throw error;
  }

  // 2. Fetch or Auto-Create Active Day Session
  let activeSession = await prisma.daySession.findFirst({
    where: { status: 'active' },
    orderBy: { startedAt: 'desc' }
  });

  if (!activeSession) {
    activeSession = await prisma.daySession.create({
      data: {
        id: 'day-sess-01',
        label: 'Day 1 — 24H Overnight Sprint',
        startedAt: new Date(),
        status: 'active'
      }
    });
  }

  // 3. Look up Participant in Database or Auto-Create from QR data
  let participant = await prisma.participant.findFirst({
    where: {
      OR: [
        ...(participantId ? [{ id: participantId }] : []),
        ...(rollNumber ? [{ rollNumber: rollNumber.toUpperCase() }] : [])
      ]
    },
    include: { team: true }
  });

  if (!participant) {
    // Dynamically auto-create team and participant from QR payload on first scan!
    const effectiveRoll = (rollNumber || participantId || `HACK-${Date.now().toString().slice(-4)}`).toUpperCase();
    const teamName = payload.team || payload.teamName || 'Team Alpha';
    const tableName = payload.table || payload.tableNumber || 'Table 01';

    let team = await prisma.team.findFirst({ where: { name: teamName } });
    if (!team) {
      team = await prisma.team.create({
        data: {
          name: teamName,
          tableNumber: tableName,
          projectTitle: payload.projectTitle || 'Autonomous Hackathon Project'
        }
      });
    }

    participant = await prisma.participant.create({
      data: {
        name: payload.name || `Participant ${effectiveRoll}`,
        rollNumber: effectiveRoll,
        email: payload.email || `${effectiveRoll.toLowerCase().replace(/[^a-z0-9]/g, '')}@hackme26.dev`,
        phone: payload.phone || payload.mobile || '+91 9847000000',
        college: payload.college || 'VISAT',
        department: payload.department || 'CSE',
        teamId: team.id
      },
      include: { team: true }
    });

    console.log(`[AutoRegister] New participant created from scan: ${participant.name} (${participant.rollNumber}) in ${team.name}`);
  } else if (payload.name && (!participant.name || participant.name.startsWith('Badge ') || participant.name.startsWith('Participant '))) {
    // Update existing placeholder with real name from QR
    participant = await prisma.participant.update({
      where: { id: participant.id },
      data: {
        name: payload.name,
        ...(payload.phone || payload.mobile ? { phone: payload.phone || payload.mobile } : {}),
        ...(payload.college ? { college: payload.college } : {})
      },
      include: { team: true }
    });
  }

  // 4. Intent Detection: Movement Pass Return vs. Attendance Check-in

  // Scenario A: Token is a Movement Pass Return
  if (passId) {
    const movementPass = await prisma.movementPass.findUnique({
      where: { id: passId },
      include: { participant: true }
    });

    if (movementPass && movementPass.status === 'active') {
      const error = new Error(`Pass ${passId} is no longer active (already returned or force-closed).`);
      error.status = 400;
      error.code = 'PASS_NOT_ACTIVE';
      throw error;
    }

    const now = new Date();
    const durationSeconds = Math.max(0, Math.floor((now.getTime() - new Date(movementPass.requestedAt).getTime()) / 1000));

    const updatedPass = await prisma.movementPass.update({
      where: { id: passId },
      data: {
        status: 'returned',
        returnedAt: now,
        closedBy: 'self'
      }
    });

    const result = {
      type: 'pass_returned',
      passId: updatedPass.id,
      participantId: participant.id,
      participantName: participant.name,
      rollNumber: participant.rollNumber,
      team: participant.team.name,
      passType: updatedPass.passType,
      durationSeconds,
      timestamp: now.toISOString(),
      message: `↩️ ${participant.name} returned from ${updatedPass.passType} (${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s)`
    };

    // Emit live push to all staff monitoring this DaySession
    if (socketIo) {
      socketIo.to(activeSession.id).emit('hallpass:returned', {
        passId: updatedPass.id,
        participantId: participant.id,
        participantName: participant.name,
        rollNumber: participant.rollNumber,
        team: participant.team.name,
        passType: updatedPass.passType,
        durationSeconds,
        returnedAt: now.toISOString()
      });
    }

    return result;
  }

  // Scenario B: Base Attendance Pass Scan
  const existingAttendance = await prisma.attendanceRecord.findUnique({
    where: {
      participantId_daySessionId: {
        participantId: participant.id,
        daySessionId: activeSession.id
      }
    }
  });

  // Check if already marked present
  if (existingAttendance && existingAttendance.status === 'present') {
    const error = new Error(`${participant.name} (${participant.rollNumber}) is already checked in.`);
    error.status = 409;
    error.code = 'ALREADY_MARKED';
    error.data = {
      participantName: participant.name,
      rollNumber: participant.rollNumber,
      scannedAt: existingAttendance.scannedAt
    };
    throw error;
  }

  const now = new Date();

  // Upsert Attendance Record
  const attendanceRecord = await prisma.attendanceRecord.upsert({
    where: {
      participantId_daySessionId: {
        participantId: participant.id,
        daySessionId: activeSession.id
      }
    },
    update: {
      status: 'present',
      scannedAt: now,
      markedBy: 'scan',
      overrideByStaffId: staffId
    },
    create: {
      participantId: participant.id,
      daySessionId: activeSession.id,
      status: 'present',
      scannedAt: now,
      markedBy: 'scan',
      overrideByStaffId: staffId
    }
  });

  const result = {
    type: 'attendance_marked',
    participantId: participant.id,
    participantName: participant.name,
    rollNumber: participant.rollNumber,
    team: participant.team.name,
    table: participant.team.tableNumber,
    scannedAt: now.toISOString(),
    timestamp: now.toISOString(),
    message: `✅ ${participant.name} (${participant.rollNumber}) checked in successfully!`
  };

  // Broadcast to all connected staff screens
  if (socketIo) {
    socketIo.to(activeSession.id).emit('attendance:marked', {
      participantId: participant.id,
      participantName: participant.name,
      rollNumber: participant.rollNumber,
      team: participant.team.name,
      table: participant.team.tableNumber,
      scannedAt: now.toISOString()
    });
  }

  return result;
}
