import prisma from './db.js';
import { OVERDUE_SWEEPER_INTERVAL_MS } from '../config/constants.js';

let intervalTimer = null;

/**
 * Start the background sweeper that evaluates active movement passes against expectedReturnBy
 * @param {object} socketIo - Socket.io server instance
 */
export function startOverdueSweeper(socketIo) {
  if (intervalTimer) return;

  intervalTimer = setInterval(async () => {
    try {
      const now = new Date();

      // Find all active passes that have exceeded their expected return time
      const overduePasses = await prisma.movementPass.findMany({
        where: {
          status: 'active',
          expectedReturnBy: { lt: now }
        },
        include: {
          participant: {
            include: { team: true }
          },
          daySession: true
        }
      });

      if (overduePasses.length > 0) {
        for (const pass of overduePasses) {
          // Update status in database to 'overdue'
          await prisma.movementPass.update({
            where: { id: pass.id },
            data: { status: 'overdue' }
          });

          const elapsedSec = Math.floor((now.getTime() - new Date(pass.requestedAt).getTime()) / 1000);
          const elapsedMinutes = Math.floor(elapsedSec / 60);

          console.log(`[Sweeper] Alert: Pass ${pass.id} for ${pass.participant.name} (${pass.passType}) is OVERDUE (${elapsedMinutes}m elapsed).`);

          if (socketIo && pass.daySessionId) {
            socketIo.to(pass.daySessionId).emit('hallpass:overdue', {
              passId: pass.id,
              participantId: pass.participantId,
              participantName: pass.participant.name,
              rollNumber: pass.participant.rollNumber,
              team: pass.participant.team.name,
              table: pass.participant.team.tableNumber,
              passType: pass.passType,
              requestedAt: pass.requestedAt.toISOString(),
              expectedReturnBy: pass.expectedReturnBy.toISOString(),
              elapsedMinutes,
              isCritical: pass.passType === 'left_venue'
            });
          }
        }
      }
    } catch (err) {
      console.error('[Sweeper] Error evaluating overdue passes:', err.message);
    }
  }, OVERDUE_SWEEPER_INTERVAL_MS);

  console.log(`[Sweeper] Background overdue evaluation active (every ${OVERDUE_SWEEPER_INTERVAL_MS / 1000}s).`);
}

export function stopOverdueSweeper() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}
