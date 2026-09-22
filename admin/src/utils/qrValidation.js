// Hackathon QR Payload Validator & Test Generator

import { PASS_TYPES } from './passTypeConfig';

/**
 * Validates and normalizes scanned QR payloads.
 * Expected formats:
 * {
 *   "type": "checkin" | "WASHROOM" | "FOOD_PICKUP" | "REST_BREAK" | "LEFT_VENUE" | "return",
 *   "participantId": "p1",
 *   "rollNo": "HACK-01A",
 *   "name": "Aarav Sharma",
 *   "team": "Team ByteCraft",
 *   "timestamp": 1726981234567
 * }
 */
export function validateAndParseQrPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'string') {
    return { isValid: false, error: 'Empty or invalid QR code format' };
  }

  const trimmed = rawPayload.trim();

  // JSON format (Option 2: Embedded Participant JSON Payload)
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);

      const rollNo = parsed.rollNumber || parsed.rollNo || parsed.roll_no || parsed.passId || parsed.pass_id || parsed.studentId || parsed.participantId || parsed.id;
      if (!rollNo) {
        return { isValid: false, error: 'QR payload missing participant identifier (rollNumber / rollNo / passId)' };
      }

      // Check expiry (reject if older than 24 hours, only if timestamp exists)
      if (parsed.timestamp) {
        const ageMs = Date.now() - Number(parsed.timestamp);
        if (ageMs > 24 * 60 * 60 * 1000) {
          return { isValid: false, error: 'QR Pass has expired. Ask participant to refresh digital badge.' };
        }
      }

      let type = (parsed.type || 'CHECKIN').toUpperCase();
      if (type === 'ATTENDANCE') type = 'CHECKIN';

      return {
        isValid: true,
        type,
        participantId: parsed.participantId || parsed.studentId,
        rollNo: String(rollNo),
        name: parsed.name || parsed.participantName || parsed.studentName || `Participant ${rollNo}`,
        team: parsed.team || parsed.teamName || 'Team Alpha',
        table: parsed.table || parsed.tableNumber || 'Table 01',
        college: parsed.college || 'VISAT',
        phone: parsed.phone || parsed.mobile || '',
        reason: parsed.reason,
        timestamp: parsed.timestamp || Date.now()
      };
    } catch {
      return { isValid: false, error: 'Malformed QR JSON data' };
    }
  }

  // URL Query parameter format
  if (trimmed.includes('rollNo=') || trimmed.includes('team=')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://portal.internal/?${trimmed.split('?')[1] || trimmed}`);
      const rollNo = url.searchParams.get('rollNo') || url.searchParams.get('id');
      const type = (url.searchParams.get('type') || 'checkin').toUpperCase();
      const name = url.searchParams.get('name') || 'Participant';
      const team = url.searchParams.get('team') || 'Hackathon Team';

      if (!rollNo) return { isValid: false, error: 'Missing participant badge ID' };

      return {
        isValid: true,
        type,
        rollNo,
        name,
        team,
        timestamp: Date.now()
      };
    } catch {
      // ignore
    }
  }

  // Quick fallback: Pattern match for HACK badge code
  const codeMatch = trimmed.match(/HACK-[0-9]{2}[A-D]/i) || trimmed.match(/^[A-Z0-9_-]{4,15}$/i);
  if (codeMatch) {
    return {
      isValid: true,
      type: 'CHECKIN',
      rollNo: codeMatch[0].toUpperCase(),
      name: 'Participant ' + codeMatch[0].toUpperCase(),
      team: 'Registered Team',
      timestamp: Date.now()
    };
  }

  return { isValid: false, error: 'Unrecognized QR code schema' };
}

/**
 * Generate test payloads for quick demoing
 */
export function generateTestPayload(type = 'CHECKIN', participant = { rollNo: 'HACK-01A', name: 'Aarav Sharma', team: 'Team ByteCraft', id: 'p1' }) {
  return JSON.stringify({
    type,
    participantId: participant.id,
    rollNo: participant.rollNo,
    name: participant.name,
    team: participant.team,
    reason: type === 'LEFT_VENUE' ? 'Hardware pickup' : type === 'FOOD_PICKUP' ? 'Delivery gate' : 'Normal break',
    timestamp: Date.now(),
    sig: 'valid_hackathon_sig_099'
  });
}
