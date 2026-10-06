import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';
import { broadcastVisitorOverstay } from '../../socket';

const router = Router();

// Get list of visitors
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, residentId } = req.query;
    const whereClause: any = {};
    if (status) whereClause.status = String(status);
    if (residentId) whereClause.residentId = String(residentId);

    const visitors = await prisma.visitor.findMany({
      where: whereClause,
      include: {
        resident: {
          include: { residentProfile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    const formatted = visitors.map((v) => {
      let isOverstayed = v.status === 'OVERSTAYED';
      let overstayMinutes = 0;
      if (v.status === 'CHECKED_IN' && v.checkInAt) {
        const elapsed = Math.floor((now.getTime() - new Date(v.checkInAt).getTime()) / (1000 * 60));
        if (elapsed > 120) {
          isOverstayed = true;
          overstayMinutes = elapsed - 120;
        }
      }

      return {
        id: v.id,
        visitorName: v.visitorName,
        visitorPhone: v.visitorPhone,
        residentId: v.residentId,
        residentName: v.resident.name,
        roomNumber: v.resident.residentProfile?.roomNumber || 'Unknown',
        blockName: v.resident.residentProfile?.blockName || 'Hostel',
        purpose: v.purpose,
        expectedDate: v.expectedDate,
        expectedTime: v.expectedTime,
        checkInAt: v.checkInAt?.toISOString(),
        checkOutAt: v.checkOutAt?.toISOString(),
        status: isOverstayed ? 'OVERSTAYED' : v.status,
        overstayMinutes,
        qrPassCode: v.qrPassCode,
        isRegularVisitor: v.isRegularVisitor,
        createdAt: v.createdAt.toISOString()
      };
    });

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// Resident pre-approves visitor
router.post('/pre-approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { visitorName, visitorPhone, purpose, expectedDate, expectedTime, isRegularVisitor } = req.body;
    const residentId = req.user!.id;

    const qrPassCode = `VIS-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const visitor = await prisma.visitor.create({
      data: {
        visitorName,
        visitorPhone,
        residentId,
        purpose: purpose || 'Personal Visit',
        expectedDate: expectedDate || new Date().toISOString().split('T')[0],
        expectedTime: expectedTime || '16:00',
        status: 'PRE_APPROVED',
        qrPassCode,
        isRegularVisitor: Boolean(isRegularVisitor)
      },
      include: {
        resident: { include: { residentProfile: true } }
      }
    });

    await createAuditRecord(
      residentId,
      req.user!.role,
      'PRE_APPROVE_VISITOR',
      'VISITOR',
      visitor.id,
      { visitorName, visitorPhone }
    );

    return res.status(201).json(visitor);
  } catch (error) {
    console.error('Pre-approve visitor error:', error);
    return res.status(500).json({ error: 'Failed to pre-approve visitor' });
  }
});

// Security checks in visitor
router.post('/:id/check-in', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { guardName } = req.body;

    const visitor = await prisma.visitor.update({
      where: { id },
      data: {
        status: 'CHECKED_IN',
        checkInAt: new Date()
      },
      include: { resident: true }
    });

    // Log gate scan
    await prisma.gateScanLog.create({
      data: {
        personName: visitor.visitorName,
        personType: 'VISITOR',
        scanType: 'ENTRY',
        guardName: guardName || 'Main Gate Security',
        notes: `Visitor for resident: ${visitor.resident.name}`
      }
    });

    return res.json(visitor);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check in visitor' });
  }
});

// Security checks out visitor
router.post('/:id/check-out', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { guardName } = req.body;

    const visitor = await prisma.visitor.update({
      where: { id },
      data: {
        status: 'CHECKED_OUT',
        checkOutAt: new Date()
      },
      include: { resident: true }
    });

    await prisma.gateScanLog.create({
      data: {
        personName: visitor.visitorName,
        personType: 'VISITOR',
        scanType: 'EXIT',
        guardName: guardName || 'Main Gate Security',
        notes: `Visitor exited`
      }
    });

    return res.json(visitor);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check out visitor' });
  }
});

export default router;
