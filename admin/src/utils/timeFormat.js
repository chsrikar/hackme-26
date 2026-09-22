import { getPassConfig } from './passTypeConfig';

/**
 * Format milliseconds into MMm SSs (e.g. "06m 42s" or "14m 02s")
 */
export function formatDuration(ms) {
  if (!ms || ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

/**
 * Calculate elapsed duration string from a past timestamp
 */
export function getElapsedTime(startTime) {
  if (!startTime) return '00m 00s';
  const now = Date.now();
  const elapsedMs = now - Number(startTime);
  return formatDuration(elapsedMs);
}

/**
 * Calculate countdown and overdue status tailored to the specific pass type
 */
export function getPassTiming(departTime, passTypeKey = 'WASHROOM') {
  const config = getPassConfig(passTypeKey);
  const allowedMinutes = config.overdueMinutes || 15;
  const totalAllowedMs = allowedMinutes * 60 * 1000;

  const now = Date.now();
  const elapsedMs = now - Number(departTime);
  const remainingMs = totalAllowedMs - elapsedMs;

  const isOverdue = remainingMs < 0;
  // Warning triggers when 20% or less time remaining, or under 3 minutes
  const warningThresholdMs = Math.min(3 * 60 * 1000, totalAllowedMs * 0.25);
  const isWarning = !isOverdue && remainingMs <= warningThresholdMs;

  const percentUsed = Math.min(100, Math.round((elapsedMs / totalAllowedMs) * 100));

  return {
    elapsedText: formatDuration(elapsedMs),
    remainingText: isOverdue
      ? `Overdue by ${formatDuration(Math.abs(remainingMs))}`
      : `Due in ${formatDuration(remainingMs)}`,
    isOverdue,
    isWarning,
    percentUsed,
    config
  };
}

/**
 * Format standard current clock time (e.g. "02:14 AM")
 */
export function formatClockTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Format readable date
 */
export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
