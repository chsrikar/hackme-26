// Hackathon QR Payload Validator & Normalizer
import { PASS_TYPES } from './passTypeConfig.js';
import { PARTICIPANT_DIRECTORY } from '../data/participantDirectory.js';

/**
 * Validates and normalizes scanned QR payloads.
 * Looks up official participant details (Name, HM26-xxx Code, Phone).
 */
export function validateAndParseQrPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'string') {
    return { isValid: false, error: 'Empty or invalid QR code format' };
  }

  const trimmed = rawPayload.trim();

  // Helper: check participant directory
  const lookupParticipant = (key) => {
    if (!key) return null;
    const strKey = String(key).trim();
    return PARTICIPANT_DIRECTORY[strKey] ||
           PARTICIPANT_DIRECTORY[strKey.toUpperCase()] ||
           PARTICIPANT_DIRECTORY[strKey.toLowerCase()] ||
           null;
  };

  // 1. JSON format (Option 2: Embedded Participant JSON Payload)
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const codeOrToken = parsed.passId || parsed.pass_id || parsed.rollNumber || parsed.rollNo || parsed.id;
      const known = lookupParticipant(codeOrToken) || lookupParticipant(parsed.token);

      let type = (parsed.type || 'CHECKIN').toUpperCase();
      if (type === 'ATTENDANCE') type = 'CHECKIN';

      const finalPassId = known?.passId || parsed.passId || parsed.pass_id || parsed.rollNumber || parsed.rollNo || 'HM26-000';
      const finalName = known?.name || parsed.name || parsed.participantName || `Participant ${finalPassId}`;
      const finalPhone = known?.phone || parsed.phone || parsed.mobile || '';

      return {
        isValid: true,
        type,
        participantId: known?.id || parsed.participantId || parsed.id,
        rollNo: finalPassId,
        passId: finalPassId,
        name: finalName,
        phone: finalPhone,
        college: known?.college || parsed.college || 'VISAT',
        department: known?.department || parsed.department || 'CSE',
        team: parsed.team || 'Team Alpha',
        table: parsed.table || 'Table 01',
        timestamp: parsed.timestamp || Date.now()
      };
    } catch {
      return { isValid: false, error: 'Malformed QR JSON data' };
    }
  }

  // 2. URL Verification format (e.g. http://127.0.0.1:5000/verify/<token_or_id>)
  if (trimmed.includes('/verify/')) {
    try {
      const parts = trimmed.split('/verify/');
      const rawToken = parts[1]?.split('?')[0]?.split('#')[0]?.trim();

      // Check query params if present (e.g. ?name=...&phone=...&pass_id=...)
      let queryParams = {};
      if (trimmed.includes('?')) {
        try {
          const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://portal.internal/${trimmed}`);
          queryParams.name = urlObj.searchParams.get('name');
          queryParams.phone = urlObj.searchParams.get('phone') || urlObj.searchParams.get('mobile');
          queryParams.passId = urlObj.searchParams.get('pass_id') || urlObj.searchParams.get('passId') || urlObj.searchParams.get('rollNo');
        } catch {}
      }

      const known = lookupParticipant(rawToken) || (queryParams.passId ? lookupParticipant(queryParams.passId) : null);

      if (rawToken || known) {
        const finalPassId = known?.passId || queryParams.passId || (rawToken && /^HM26-\d{3}$/i.test(rawToken) ? rawToken.toUpperCase() : 'HM26-000');
        const finalName = known?.name || queryParams.name || `Participant ${finalPassId}`;
        const finalPhone = known?.phone || queryParams.phone || '';

        return {
          isValid: true,
          type: 'CHECKIN',
          participantId: known?.id || rawToken,
          rollNo: finalPassId,
          passId: finalPassId,
          name: finalName,
          phone: finalPhone,
          college: known?.college || 'VISAT',
          department: known?.department || 'CSE',
          team: 'Team Alpha',
          table: 'Table 01',
          timestamp: Date.now()
        };
      }
    } catch {
      // fallback
    }
  }

  // 3. Direct HM26 Pass ID match (e.g. HM26-001, HM26-002, HM26-003, HM26-999)
  const hmMatch = trimmed.match(/HM26-[0-9]{3}/i);
  if (hmMatch) {
    const code = hmMatch[0].toUpperCase();
    const known = lookupParticipant(code);
    return {
      isValid: true,
      type: 'CHECKIN',
      participantId: known?.id || code,
      rollNo: code,
      passId: code,
      name: known?.name || `Participant ${code}`,
      phone: known?.phone || '',
      college: known?.college || 'VISAT',
      department: known?.department || 'CSE',
      team: 'Team Alpha',
      table: 'Table 01',
      timestamp: Date.now()
    };
  }

  // 4. Raw Token / Alphanumeric code lookup (e.g. 3MbN2t1Krlsh6SCFJieTKyA9ZiV5oE6VC8lZso8jqwM)
  const known = lookupParticipant(trimmed);
  if (known) {
    return {
      isValid: true,
      type: 'CHECKIN',
      participantId: known.id,
      rollNo: known.passId,
      passId: known.passId,
      name: known.name,
      phone: known.phone,
      college: known.college,
      department: known.department,
      team: 'Team Alpha',
      table: 'Table 01',
      timestamp: Date.now()
    };
  }

  // 5. Fallback badge pattern
  const codeMatch = trimmed.match(/HACK-[0-9]{2}[A-D]/i) || trimmed.match(/^[A-Z0-9_-]{3,32}$/i);
  if (codeMatch) {
    const code = codeMatch[0].toUpperCase();
    return {
      isValid: true,
      type: 'CHECKIN',
      rollNo: code,
      passId: code,
      name: `Participant ${code}`,
      phone: '',
      team: 'Team Alpha',
      table: 'Table 01',
      college: 'VISAT',
      timestamp: Date.now()
    };
  }

  return { isValid: false, error: 'Unrecognized QR code schema' };
}

/**
 * Generate test payloads for quick demoing
 */
export function generateTestPayload(type = 'CHECKIN', participant = { rollNo: 'HM26-003', name: 'Parthiv das', phone: '8547637499' }) {
  return JSON.stringify({
    type,
    passId: participant.rollNo || participant.passId || 'HM26-003',
    rollNumber: participant.rollNo || 'HM26-003',
    name: participant.name,
    phone: participant.phone || '8547637499',
    timestamp: Date.now()
  });
}
