import express from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { processScan } from '../services/scanService.js';

const router = express.Router();

// Security: Rate limit scan endpoint to prevent token probe attacks (60 scans/min per IP)
const scanLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many scan attempts from this station. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false
});

const scanSchema = z.object({
  qrToken: z.string().min(1, 'QR token is required')
});

router.post('/scan', scanLimiter, async (req, res) => {
  const parseResult = scanSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      code: 'VALIDATION_ERROR',
      details: parseResult.error.errors
    });
  }

  const { qrToken } = parseResult.data;
  const socketIo = req.app.get('io');
  const staffId = req.headers['x-staff-id'] || 'ops_lead';

  try {
    const result = await processScan(qrToken, socketIo, staffId);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      error: err.message || 'Internal server error during scan processing',
      code: err.code || 'SCAN_ERROR',
      data: err.data || null
    });
  }
});

export default router;
