import jwt from 'jsonwebtoken';

const SECRET = process.env.QR_SIGNING_SECRET || 'hackme26_super_secure_qr_jwt_signing_secret_988776655';

/**
 * Sign a QR Pass Token (Base Attendance or Short-Lived Movement Pass)
 * @param {object} payload - { participantId, passId, rollNumber, name, passType }
 * @param {string|number} expiresIn - e.g. '20m', '24h', or seconds
 */
export function signPassToken(payload, expiresIn = '24h') {
  const nowSec = Math.floor(Date.now() / 1000);
  const data = {
    ...payload,
    issuedAt: nowSec
  };
  return jwt.sign(data, SECRET, { expiresIn });
}

/**
 * Verify and decode a QR token
 * @param {string} token - Raw JWT scanned by camera
 * @returns {object} Decoded payload
 */
export function verifyPassToken(token) {
  if (!token || typeof token !== 'string') {
    const err = new Error('Empty or invalid QR code token');
    err.code = 'INVALID_QR';
    throw err;
  }

  try {
    const decoded = jwt.verify(token.trim(), SECRET);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const expErr = new Error('QR Pass has expired. Please refresh your digital pass badge.');
      expErr.code = 'EXPIRED_QR';
      expErr.expiredAt = err.expiredAt;
      throw expErr;
    }
    const invErr = new Error('Untrusted or malformed QR signature.');
    invErr.code = 'INVALID_QR';
    throw invErr;
  }
}
