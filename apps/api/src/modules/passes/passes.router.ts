import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';
import { broadcastPassUpdate, broadcastCurfewAlert } from '../../socket';
import { checkCurfewViolations } from '../rules-engine/alertRulesEngine';

const router = Router();

// Get list of passes
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, passType, residentId } = req.query;

    const whereClause: any = {};
    const tenantFilter = req.user?.tenantId || (req.query.tenantId as string);
    if (tenantFilter) {
      whereClause.resident = { tenantId: tenantFilter };
    }
    if (status) whereClause.status = String(status);
    if (passType) whereClause.passType = String(passType);
    if (residentId) whereClause.residentId = String(residentId);

    const passes = await prisma.pass.findMany({
      where: whereClause,
      include: {
        resident: {
          include: { residentProfile: true }
        },
        scanLogs: {
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    const formatted = passes.map((p) => {
      const isOverdue = (p.status === 'APPROVED' || p.status === 'ACTIVE') && now > new Date(p.validTill);
      return {
        id: p.id,
        passNumber: p.passNumber,
        passType: p.passType,
        residentId: p.residentId,
        residentName: p.resident.name,
        roomNumber: p.resident.residentProfile?.roomNumber || 'Unknown',
        blockName: p.resident.residentProfile?.blockName || 'Main Block',
        reason: p.reason,
        destination: p.destination,
        validFrom: p.validFrom.toISOString(),
        validTill: p.validTill.toISOString(),
        status: isOverdue ? 'EXPIRED' : p.status,
        qrCodeToken: p.qrCodeToken,
        approvedById: p.approvedById,
        approvedByName: p.approvedByName,
        rejectionReason: p.rejectionReason,
        actualExitAt: p.actualExitAt?.toISOString(),
        actualReturnAt: p.actualReturnAt?.toISOString(),
        isOverdue: isOverdue || p.isOverdue,
        createdAt: p.createdAt.toISOString(),
        scanLogs: p.scanLogs
      };
    });

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch passes' });
  }
});

// Live "Who's Out" board - critical alerting feature
router.get('/live-whos-out', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const tenantFilter = req.user?.tenantId || (req.query.tenantId as string);
    const violations = await checkCurfewViolations('21:30', tenantFilter);

    const outResidentsWhere: any = {
      currentPresence: {
        in: ['OUT_ON_PASS', 'OUT_ON_LEAVE', 'OVERDUE']
      }
    };
    if (tenantFilter) {
      outResidentsWhere.user = { tenantId: tenantFilter };
    }

    // Also get all residents currently out (whether on approved leave, gate pass, or overdue)
    const outResidents = await prisma.residentProfile.findMany({
      where: outResidentsWhere,
      include: {
        user: {
          include: {
            passes: {
              where: { status: { in: ['APPROVED', 'ACTIVE', 'EXPIRED'] } },
              orderBy: { validTill: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    const result = outResidents.map((r) => {
      const activePass = r.user.passes[0];
      const now = new Date();
      const isOverdue = activePass ? now > new Date(activePass.validTill) : true;
      const minutesOverdue = activePass && isOverdue
        ? Math.floor((now.getTime() - new Date(activePass.validTill).getTime()) / (1000 * 60))
        : 0;

      return {
        residentId: r.userId,
        name: r.user.name,
        roomNumber: r.roomNumber,
        blockName: r.blockName,
        phone: r.user.phone,
        parentPhone: r.parentPhone,
        currentPresence: r.currentPresence,
        isOverdue,
        minutesOverdue,
        destination: activePass?.destination || 'Not Specified',
        reason: activePass?.reason || 'Unknown',
        passType: activePass?.passType || 'NO_PASS',
        validTill: activePass?.validTill.toISOString(),
        lastGateScanAt: r.lastGateScanAt?.toISOString()
      };
    });

    return res.json({
      totalOut: result.length,
      overdueCount: result.filter((r) => r.isOverdue).length,
      residents: result,
      curfewViolations: violations
    });
  } catch (error) {
    console.error('Live who is out error:', error);
    return res.status(500).json({ error: 'Failed to fetch live presence board' });
  }
});

// Request a new Pass (Gate Pass, Exit Pass, or Leave)
async function handleCreatePass(req: Request, res: Response) {
  try {
    const {
      passType = 'GATE_PASS',
      reason = 'Campus Outing',
      destination = 'City Center',
      validFrom,
      validTill,
      studentName,
      roomNumber,
      blockName
    } = req.body;

    let residentId = req.user?.id;
    let resident = residentId
      ? await prisma.user.findUnique({
          where: { id: residentId },
          include: { residentProfile: true }
        })
      : null;

    if (!resident) {
      resident = await prisma.user.findFirst({
        where: { role: { in: ['STUDENT', 'RESIDENT'] } },
        include: { residentProfile: true }
      });
      if (resident) residentId = resident.id;
    }

    if (!resident || !residentId) {
      return res.status(400).json({ error: 'No student record found to attach pass' });
    }

    const fromDate = validFrom ? new Date(validFrom) : new Date();
    const tillDate = validTill ? new Date(validTill) : new Date(Date.now() + 4 * 60 * 60 * 1000);

    const passNumber = `PASS-${Date.now().toString().slice(-6)}`;
    const qrCodeToken = `QR-${passNumber}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const pass = await prisma.pass.create({
      data: {
        passNumber,
        passType: passType || 'GATE_PASS',
        residentId,
        reason: reason || 'Personal errand',
        destination: destination || 'City Center',
        validFrom: fromDate,
        validTill: tillDate,
        status: 'PENDING',
        qrCodeToken
      },
      include: {
        resident: {
          include: { residentProfile: true }
        }
      }
    });

    const studentDisplayName = studentName || resident.name;
    const studentRoomDisplay = roomNumber || resident.residentProfile?.roomNumber || 'A-204';
    const studentBlockDisplay = blockName || resident.residentProfile?.blockName || 'Hostel A';

    const broadcastData = {
      type: 'REQUESTED',
      passId: pass.id,
      id: pass.id,
      passNumber: pass.passNumber,
      passType: pass.passType,
      status: pass.status,
      residentId,
      studentName: studentDisplayName,
      studentId: resident.residentProfile?.studentId || 'REC-STU-01',
      roomNumber: studentRoomDisplay,
      blockName: studentBlockDisplay,
      destination: pass.destination,
      reason: pass.reason,
      validFrom: pass.validFrom.toISOString(),
      validTill: pass.validTill.toISOString(),
      createdAt: pass.createdAt.toISOString()
    };

    broadcastPassUpdate(broadcastData);

    try {
      await createAuditRecord(
        residentId,
        req.user?.role || 'STUDENT',
        'REQUEST_PASS',
        'PASS',
        pass.id,
        { passNumber, passType, status: pass.status }
      );
    } catch (_) {}

    return res.status(201).json(pass);
  } catch (error) {
    console.error('Pass request error:', error);
    return res.status(500).json({ error: 'Failed to request pass' });
  }
}

router.post('/', optionalAuthMiddleware, handleCreatePass);
router.post('/request', optionalAuthMiddleware, handleCreatePass);

// Warden/Admin Approve Pass
router.post('/:id/approve', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const approverId = req.user?.id || 'admin-sys';
    const approverName = req.user?.name || 'Warden Office';

    const pass = await prisma.pass.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: approverId,
        approvedByName: approverName
      },
      include: { resident: true }
    });

    broadcastPassUpdate({
      type: 'APPROVED',
      passId: pass.id,
      passNumber: pass.passNumber,
      residentId: pass.residentId,
      studentName: pass.resident.name,
      status: 'APPROVED'
    });

    try {
      await createAuditRecord(
        approverId,
        req.user?.role || 'WARDEN',
        'APPROVE_PASS',
        'PASS',
        id,
        { approvedBy: approverName }
      );
    } catch (_) {}

    return res.json(pass);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve pass' });
  }
});

// Warden/Admin Reject Pass
router.post('/:id/reject', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const approverId = req.user?.id || 'admin-sys';
    const approverName = req.user?.name || 'Warden Office';

    const pass = await prisma.pass.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Declined by Warden'
      },
      include: { resident: true }
    });

    broadcastPassUpdate({
      type: 'REJECTED',
      passId: pass.id,
      passNumber: pass.passNumber,
      residentId: pass.residentId,
      studentName: pass.resident.name,
      status: 'REJECTED'
    });

    try {
      await createAuditRecord(
        approverId,
        req.user?.role || 'WARDEN',
        'REJECT_PASS',
        'PASS',
        id,
        { reason }
      );
    } catch (_) {}

    return res.json(pass);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reject pass' });
  }
});

// Gate Security scans QR token (Turnstile / Security desk scan)
router.post('/scan-gate', async (req: Request, res: Response) => {
  try {
    const { qrCodeToken, scanType, guardName } = req.body;
    if (!qrCodeToken) return res.status(400).json({ error: 'QR Code Token is required' });

    const pass = await prisma.pass.findUnique({
      where: { qrCodeToken },
      include: {
        resident: {
          include: { residentProfile: true }
        }
      }
    });

    if (!pass) return res.status(404).json({ error: 'Invalid or unrecognized QR pass' });

    if (pass.status !== 'APPROVED' && pass.status !== 'ACTIVE') {
      return res.status(400).json({ error: `Cannot scan pass with status: ${pass.status}` });
    }

    const now = new Date();
    const isExit = (scanType || (pass.actualExitAt ? 'ENTRY' : 'EXIT')) === 'EXIT';

    // Update Pass
    const updatedPass = await prisma.pass.update({
      where: { id: pass.id },
      data: {
        actualExitAt: isExit ? now : pass.actualExitAt,
        actualReturnAt: !isExit ? now : null,
        status: isExit ? 'ACTIVE' : 'RETURNED'
      }
    });

    // Update Resident Presence
    const newPresence = isExit
      ? (pass.passType === 'LEAVE' ? 'OUT_ON_LEAVE' : 'OUT_ON_PASS')
      : 'IN_HOSTEL';

    if (pass.resident.residentProfile) {
      await prisma.residentProfile.update({
        where: { id: pass.resident.residentProfile.id },
        data: {
          currentPresence: newPresence,
          lastGateScanAt: now
        }
      });
    }

    // Log gate entry
    const scanLog = await prisma.gateScanLog.create({
      data: {
        passId: pass.id,
        personName: pass.resident.name,
        personType: 'RESIDENT',
        scanType: isExit ? 'EXIT' : 'ENTRY',
        guardName: guardName || 'Gate Security Post 1',
        notes: `Pass: ${pass.passNumber} (${pass.passType})`
      }
    });

    broadcastPassUpdate({
      type: isExit ? 'SCANNED_EXIT' : 'SCANNED_ENTRY',
      passId: pass.id,
      residentId: pass.residentId,
      presence: newPresence
    });

    return res.json({
      success: true,
      message: `${pass.resident.name} marked ${isExit ? 'EXIT' : 'RETURNED'}`,
      pass: updatedPass,
      scanLog,
      residentName: pass.resident.name,
      roomNumber: pass.resident.residentProfile?.roomNumber,
      presence: newPresence
    });
  } catch (error) {
    console.error('Scan gate error:', error);
    return res.status(500).json({ error: 'Failed to process gate scan' });
  }
});

export default router;
