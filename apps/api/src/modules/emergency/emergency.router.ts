import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, createAuditRecord } from '../../middlewares/auth';
import { broadcastEmergency, broadcastEmergencyResolved } from '../../socket';

const router = Router();

router.get('/active', async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.emergencyAlert.findMany({
      where: {
        status: { in: ['ACTIVE', 'INVESTIGATING'] }
      },
      include: {
        resident: {
          include: {
            residentProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = alerts.map((a) => ({
      id: a.id,
      emergencyType: a.emergencyType,
      status: a.status,
      residentId: a.residentId,
      residentName: a.resident.name,
      residentPhone: a.resident.phone,
      parentPhone: a.resident.residentProfile?.parentPhone,
      roomNumber: a.resident.residentProfile?.roomNumber || 'Unknown',
      blockName: a.resident.residentProfile?.blockName || 'Main Campus',
      locationDetails: a.locationDetails,
      gpsCoords: a.gpsCoords,
      notes: a.notes,
      createdAt: a.createdAt.toISOString()
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch active alerts' });
  }
});

router.post('/trigger', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { emergencyType, locationDetails, gpsCoords, notes } = req.body;
    const residentId = req.user!.id;

    const resident = await prisma.user.findUnique({
      where: { id: residentId },
      include: { residentProfile: true }
    });

    if (!resident) return res.status(404).json({ error: 'Resident not found' });

    const alert = await prisma.emergencyAlert.create({
      data: {
        emergencyType: emergencyType || 'OTHER',
        status: 'ACTIVE',
        residentId,
        locationDetails: locationDetails || `Room ${resident.residentProfile?.roomNumber || 'N/A'}, ${resident.residentProfile?.blockName || 'Hostel'}`,
        gpsCoords,
        notes
      }
    });

    const alertPayload = {
      id: alert.id,
      emergencyType: alert.emergencyType,
      status: alert.status,
      residentId,
      residentName: resident.name,
      residentPhone: resident.phone,
      roomNumber: resident.residentProfile?.roomNumber || 'Unknown',
      blockName: resident.residentProfile?.blockName || 'Hostel Block',
      locationDetails: alert.locationDetails,
      gpsCoords: alert.gpsCoords,
      createdAt: alert.createdAt.toISOString()
    };

    // Instant siren broadcast to all connected dashboards
    broadcastEmergency(alertPayload);

    // NAAC-compliant audit record
    await createAuditRecord(
      residentId,
      req.user!.role,
      'EMERGENCY_SOS_TRIGGERED',
      'EMERGENCY_ALERT',
      alert.id,
      alertPayload
    );

    return res.status(201).json(alertPayload);
  } catch (error) {
    console.error('Trigger emergency error:', error);
    return res.status(500).json({ error: 'Failed to trigger emergency alert' });
  }
});

router.post('/:id/resolve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes, status } = req.body;

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: status || 'RESOLVED',
        resolvedById: req.user!.id,
        resolvedByName: req.user!.name,
        resolvedAt: new Date(),
        notes: notes ? notes : undefined
      }
    });

    broadcastEmergencyResolved({ id, resolvedBy: req.user!.name });

    await createAuditRecord(
      req.user!.id,
      req.user!.role,
      'EMERGENCY_RESOLVED',
      'EMERGENCY_ALERT',
      id,
      { resolvedBy: req.user!.name, notes }
    );

    return res.json(alert);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to resolve emergency' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.emergencyAlert.findMany({
      include: {
        resident: {
          include: {
            residentProfile: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch emergency history' });
  }
});

export default router;
