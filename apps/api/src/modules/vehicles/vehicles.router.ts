import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';

const router = Router();

router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { residentId } = req.query;
    const whereClause: any = {};
    if (residentId) whereClause.residentId = String(residentId);

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        resident: {
          include: { residentProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = vehicles.map((v) => ({
      id: v.id,
      residentId: v.residentId,
      residentName: v.resident.name,
      roomNumber: v.resident.residentProfile?.roomNumber || 'Unknown',
      vehicleType: v.vehicleType,
      licensePlate: v.licensePlate,
      model: v.model,
      parkingSlot: v.parkingSlot || 'Slot P-12',
      digitalPassQr: v.digitalPassQr,
      status: v.status,
      createdAt: v.createdAt.toISOString()
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

router.post('/register', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { vehicleType, licensePlate, model } = req.body;
    const residentId = req.user!.id;

    const digitalPassQr = `VEH-${licensePlate.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;

    const vehicle = await prisma.vehicle.create({
      data: {
        residentId,
        vehicleType: vehicleType || 'TWO_WHEELER',
        licensePlate: licensePlate.toUpperCase(),
        model: model || 'Standard Vehicle',
        parkingSlot: `Slot P-${Math.floor(Math.random() * 50) + 1}`,
        digitalPassQr,
        status: 'APPROVED'
      }
    });

    await createAuditRecord(
      residentId,
      req.user!.role,
      'REGISTER_VEHICLE',
      'VEHICLE',
      vehicle.id,
      { licensePlate: vehicle.licensePlate }
    );

    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register vehicle' });
  }
});

export default router;
