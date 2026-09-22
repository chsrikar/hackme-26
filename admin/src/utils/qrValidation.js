// Hackathon QR Payload Validator & Test Generator

import { PASS_TYPES } from './passTypeConfig.js';

/**
 * Validates and normalizes scanned QR payloads.
 * Supports:
 * 1. Embedded JSON ({ rollNumber, name, team, passId, ... })
 * 2. Full Verification URLs (e.g. http://127.0.0.1:5000/verify/<token_or_passId>)
 * 3. URL Query parameters (e.g. ?rollNo=...&name=...)
 * 4. HACK26 Pass IDs (e.g. HM26-001, HM26-002, HM26-003)
 * 5. General badge/token strings
 */
export function validateAndParseQrPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'string') {
    return { isValid: false, error: 'Empty or invalid QR code format' };
  }

  const trimmed = rawPayload.trim();

  // 1. JSON format (Option 2: Embedded Participant JSON Payload)
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

  // 2. URL Verification format (e.g. http://127.0.0.1:5000/verify/HM26-003 or https://.../verify/<token>)
  if (trimmed.includes('/verify/')) {
    try {
      const parts = trimmed.split('/verify/');
      const rawToken = parts[1]?.split('?')[0]?.split('#')[0]?.trim();
      if (rawToken) {
        const isPassId = /^HM26-\d{3}$/i.test(rawToken);
        const displayName = isPassId ? `Participant ${rawToken.toUpperCase()}` : `Pass Badge (${rawToken.slice(0, 8)})`;
        return {
          isValid: true,
          type: 'CHECKIN',
          rollNo: rawToken.toUpperCase(),
          passId: rawToken.toUpperCase(),
          name: displayName,
          team: 'Team Alpha',
          table: 'Table 01',
          college: 'VISAT',
          timestamp: Date.now()
        };
      }
    } catch {
      // ignore and fallback
    }
  }

  // 3. URL Query parameter format (e.g. ?rollNo=HACK-01A or ?passId=HM26-001)
  if (trimmed.includes('rollNo=') || trimmed.includes('passId=') || trimmed.includes('team=')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://portal.internal/?${trimmed.split('?')[1] || trimmed}`);
      const rollNo = url.searchParams.get('rollNo') || url.searchParams.get('passId') || url.searchParams.get('id');
      const type = (url.searchParams.get('type') || 'checkin').toUpperCase();
      const name = url.searchParams.get('name') || (rollNo ? `Participant ${rollNo}` : 'Participant');
      const team = url.searchParams.get('team') || 'Registered Team';

      if (!rollNo) return { isValid: false, error: 'Missing participant badge ID in URL' };

      return {
        isValid: true,
        type,
        rollNo: String(rollNo).toUpperCase(),
        name,
        team,
        college: 'VISAT',
        timestamp: Date.now()
      };
    } catch {
      // ignore
    }
  }

  // 4. Any generic HTTP/HTTPS URL with an ID/token in the path
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const segments = url.pathname.split('/').filter(Boolean);
      const lastSeg = segments[segments.length - 1];
      if (lastSeg && lastSeg.length >= 3) {
        return {
          isValid: true,
          type: 'CHECKIN',
          rollNo: lastSeg.toUpperCase(),
          name: `Badge ${lastSeg.slice(0, 10).toUpperCase()}`,
          team: 'Registered Team',
          college: 'VISAT',
          timestamp: Date.now()
        };
      }
    } catch {
      // ignore
    }
  }

  // 5. Pattern match for HM26 Pass ID (e.g. HM26-001, HM26-002, HM26-003)
  const hmMatch = trimmed.match(/HM26-[0-9]{3}/i);
  if (hmMatch) {
    const code = hmMatch[0].toUpperCase();
    return {
      isValid: true,
      type: 'CHECKIN',
      rollNo: code,
      passId: code,
      name: `Participant ${code}`,
      team: 'Registered Team',
      college: 'VISAT',
      timestamp: Date.now()
    };
  }

  // 6. Pattern match for HACK badge code or alphanumeric badge code
  const codeMatch = trimmed.match(/HACK-[0-9]{2}[A-D]/i) || trimmed.match(/^[A-Z0-9_-]{3,64}$/i);
  if (codeMatch) {
    const code = codeMatch[0].toUpperCase();
    return {
      isValid: true,
      type: 'CHECKIN',
      rollNo: code,
      name: `Participant ${code}`,
      team: 'Registered Team',
      college: 'VISAT',
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
