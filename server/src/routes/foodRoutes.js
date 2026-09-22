import express from 'express';
import { z } from 'zod';
import prisma from '../services/db.js';

const router = express.Router();

const foodRequestSchema = z.object({
  participantId: z.string().optional(),
  teamId: z.string().optional(),
  teamName: z.string().optional(),
  table: z.string().optional(),
  items: z.string().min(1, 'Item list is required'),
  quantity: z.number().int().positive().default(1),
  dietaryNote: z.string().optional()
});

/**
 * GET /api/food-requests
 */
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const where = status ? { status } : {};
    const requests = await prisma.foodRequest.findMany({
      where,
      orderBy: { requestedAt: 'desc' }
    });
    return res.status(200).json(requests);
  } catch (err) {
    console.error('[GetFoodRequests] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch food requests.' });
  }
});

/**
 * POST /api/food-requests
 */
router.post('/', async (req, res) => {
  const parseResult = foodRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation error', details: parseResult.error.errors });
  }

  const socketIo = req.app.get('io');

  try {
    const newRequest = await prisma.foodRequest.create({
      data: {
        ...parseResult.data,
        status: 'pending'
      }
    });

    if (socketIo) {
      socketIo.emit('food:requested', newRequest);
    }

    return res.status(201).json(newRequest);
  } catch (err) {
    console.error('[CreateFoodRequest] Error:', err);
    return res.status(500).json({ error: 'Failed to create food request.' });
  }
});

/**
 * PATCH /api/food-requests/:id
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const socketIo = req.app.get('io');

  const validStatuses = ['pending', 'preparing', 'ready', 'delivered'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of ${validStatuses.join(', ')}` });
  }

  try {
    const existing = await prisma.foodRequest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Food request not found.' });
    }

    // Auto-advance if status not specified
    let nextStatus = status;
    if (!nextStatus) {
      const idx = validStatuses.indexOf(existing.status);
      if (idx < validStatuses.length - 1) {
        nextStatus = validStatuses[idx + 1];
      } else {
        nextStatus = existing.status;
      }
    }

    const updated = await prisma.foodRequest.update({
      where: { id },
      data: { status: nextStatus }
    });

    if (socketIo) {
      socketIo.emit('food:statusUpdated', updated);
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error('[UpdateFoodStatus] Error:', err);
    return res.status(500).json({ error: 'Failed to update food request status.' });
  }
});

export default router;
