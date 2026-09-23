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

  // Helper: check participant directory with live cache priority
  const lookupParticipant = (key) => {
    if (!key) return null;
    const strKey = String(key).trim();

    // 1. Check verified live resolutions in localStorage first
    try {
      const cachedMap = JSON.parse(localStorage.getItem('ops_resolved_passes') || '{}');
      const cached = cachedMap[strKey] ||
                     cachedMap[strKey.toUpperCase()] ||
                     cachedMap[strKey.toLowerCase()];
      if (cached && cached.name) {
        return {
          id: cached.passId || strKey,
          name: cached.name,
          passId: cached.passId || strKey,
          college: cached.college || 'Visat Engineering College',
          department: cached.department || 'CSE, 4th Year',
          phone: cached.phone || ''
        };
      }
    } catch {}

    // 2. Fallback to participant directory
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

      if (known || queryParams.name || queryParams.passId) {
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

      // If not yet known, do not assume valid HM26-000; defer to async live verifier
      return {
        isValid: false,
        needsResolve: true,
        error: 'Resolving badge from verification URL...'
      };
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
 * Asynchronously resolves participant details from verifier endpoint or backend API.
 * Guarantees that live badge verification URLs (e.g. hack26-public-verifier.onrender.com)
 * resolve to their real name, college, department, and Pass ID instead of HM26-000.
 */
export async function resolveAndParseQrPayloadAsync(rawPayload) {
  const syncResult = validateAndParseQrPayload(rawPayload);

  // If already resolved to a specific known pass ID (not HM26-000 fallback), return it
  if (syncResult.isValid && syncResult.passId && syncResult.passId !== 'HM26-000' && !syncResult.name.startsWith('Participant HM26-000')) {
    return syncResult;
  }

  const trimmed = String(rawPayload || '').trim();
  let tokenCandidate = trimmed;
  if (trimmed.includes('/verify/')) {
    tokenCandidate = trimmed.split('/verify/')[1]?.split('?')[0]?.split('#')[0]?.trim();
  }

  // Check client-side resolved cache first
  try {
    const cachedMap = JSON.parse(localStorage.getItem('ops_resolved_passes') || '{}');
    const cached = cachedMap[trimmed] || cachedMap[tokenCandidate];
    if (cached && cached.passId) {
      return {
        ...syncResult,
        isValid: true,
        passId: cached.passId,
        rollNo: cached.passId,
        name: cached.name,
        college: cached.college || 'Visat Engineering College',
        department: cached.department || 'CSE, 4th Year',
        phone: cached.phone || syncResult.phone || ''
      };
    }
  } catch {}

  // List of endpoints to query for real-time resolution
  const customBackend = localStorage.getItem('ops_backend_url')?.trim()?.replace(/\/+$/, '');
  const candidateUrls = [
    '/api/resolve', // Vercel Serverless Function (same-origin, no CORS)
    '/api/resolve-pass', // Local proxy or backend
    customBackend ? `${customBackend}/api/resolve-pass` : null,
    customBackend ? `${customBackend}/api/scan` : null,
    'http://127.0.0.1:5000/api/resolve-pass',
    'http://localhost:5000/api/resolve-pass',
    'http://192.168.5.184:5000/api/resolve-pass'
  ].filter(Boolean);

  for (const url of candidateUrls) {
    try {
      const isGet = url.includes('/api/resolve');
      const fetchUrl = isGet ? `${url}?token=${encodeURIComponent(trimmed)}` : url;
      const res = await fetch(fetchUrl, {
        method: isGet ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isGet ? undefined : JSON.stringify({ token: trimmed, qrToken: trimmed }),
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const data = await res.json();

        // If verifier explicitly declares pass is inactive or not found
        if (data.isActive === false || data.success === false) {
          return {
            isValid: false,
            isActive: false,
            error: data.error || 'Pass is not active or unapproved. Attendee must activate pass before scanning.'
          };
        }

        const p = data.participant || data;
        if (p && (p.name || p.passId)) {
          // If status says INACTIVE
          if (p.status && (p.status.toUpperCase() === 'INACTIVE' || p.status.toUpperCase() === 'PENDING')) {
            return {
              isValid: false,
              isActive: false,
              error: 'Pass is inactive. Attendee has not activated pass.'
            };
          }

          const finalPassId = p.passId || p.rollNo || syncResult.passId;
          const finalName = p.name || syncResult.name;
          const finalCollege = p.college || 'Visat Engineering College';
          const finalDept = p.department || 'CSE, 4th Year';

          // Save to local cache
          try {
            const cachedMap = JSON.parse(localStorage.getItem('ops_resolved_passes') || '{}');
            const entry = {
              passId: finalPassId,
              name: finalName,
              college: finalCollege,
              department: finalDept,
              phone: p.phone || syncResult.phone || ''
            };
            cachedMap[trimmed] = entry;
            cachedMap[tokenCandidate] = entry;
            if (finalPassId) {
              cachedMap[finalPassId] = entry;
              cachedMap[finalPassId.toUpperCase()] = entry;
            }
            localStorage.setItem('ops_resolved_passes', JSON.stringify(cachedMap));
          } catch {}

          return {
            isValid: true,
            type: syncResult.type || 'CHECKIN',
            participantId: p.id || syncResult.participantId || finalPassId,
            rollNo: finalPassId,
            passId: finalPassId,
            name: finalName,
            phone: p.phone || syncResult.phone || '',
            college: finalCollege,
            department: finalDept,
            team: p.team || syncResult.team || 'Team Alpha',
            table: p.table || syncResult.table || 'Table 01',
            timestamp: Date.now()
          };
        }
      }
    } catch {
      // try next endpoint
    }
  }

  // If this was a verification URL or long token and could NOT be verified / resolved:
  if (trimmed.includes('/verify/') || trimmed.length > 20) {
    return {
      isValid: false,
      isActive: false,
      error: 'Pass is inactive or unapproved. Attendee must activate pass before scanning.'
    };
  }

  return syncResult;
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
