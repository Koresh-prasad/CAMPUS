import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.get('/amenities', async (_req: Request, res: Response) => {
  try {
    const amenities = await prisma.amenity.findMany({
      include: {
        bookings: {
          orderBy: { slotStart: 'desc' },
          take: 5
        }
      }
    });
    return res.json(amenities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch amenities' });
  }
});

router.post('/book-amenity', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { amenityId, slotStart, slotEnd } = req.body;
    const residentId = req.user!.id;

    const booking = await prisma.amenityBooking.create({
      data: {
        amenityId,
        residentId,
        slotStart: new Date(slotStart || Date.now() + 3600000),
        slotEnd: new Date(slotEnd || Date.now() + 7200000),
        status: 'CONFIRMED'
      }
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to book amenity' });
  }
});

export default router;
