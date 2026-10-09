import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { block, search } = req.query;

    const whereClause: any = {};
    const tenantFilter = req.user?.tenantId || (req.query.tenantId as string);
    if (tenantFilter) {
      whereClause.tenantId = tenantFilter;
    }
    if (block) {
      whereClause.residentProfile = { blockName: String(block) };
    }

    const residents = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        ...whereClause,
        ...(search
          ? {
              OR: [
                { name: { contains: String(search) } },
                { email: { contains: String(search) } },
                { phone: { contains: String(search) } }
              ]
            }
          : {})
      },
      include: {
        residentProfile: true
      },
      orderBy: { name: 'asc' }
    });

    const formatted = residents.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      avatarUrl: r.avatarUrl,
      studentId: r.residentProfile?.studentId || 'N/A',
      roomNumber: r.residentProfile?.roomNumber || 'N/A',
      blockName: r.residentProfile?.blockName || 'Main',
      bloodGroup: r.residentProfile?.bloodGroup,
      parentName: r.residentProfile?.parentName,
      parentPhone: r.residentProfile?.parentPhone,
      course: r.residentProfile?.course,
      year: r.residentProfile?.year,
      kycComplete: r.residentProfile?.kycComplete || false,
      status: r.status,
      currentPresence: r.residentProfile?.currentPresence || 'IN_HOSTEL',
      profileDataJson: (r.residentProfile as any)?.profileDataJson || null
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resident = await prisma.user.findUnique({
      where: { id },
      include: {
        residentProfile: true,
        complaints: { orderBy: { createdAt: 'desc' }, take: 10 },
        passes: { orderBy: { createdAt: 'desc' }, take: 10 },
        bills: { orderBy: { createdAt: 'desc' }, take: 10 },
        visitors: { orderBy: { createdAt: 'desc' }, take: 10 },
        vehicles: true
      }
    });

    if (!resident) return res.status(404).json({ error: 'Resident not found' });
    return res.json(resident);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch resident profile' });
  }
});

router.post('/kyc', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { bloodGroup, parentName, parentPhone, emergencyContact, idProofNumber } = req.body;
    const userId = req.user!.id;

    const profile = await prisma.residentProfile.upsert({
      where: { userId },
      update: {
        bloodGroup,
        parentName,
        parentPhone,
        emergencyContact,
        idProofNumber,
        kycComplete: true
      },
      create: {
        userId,
        studentId: `STU-${Date.now().toString().slice(-4)}`,
        roomNumber: '101',
        blockName: 'Nilgiri Block A',
        bloodGroup,
        parentName,
        parentPhone,
        emergencyContact,
        idProofNumber,
        kycComplete: true
      }
    });

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update KYC' });
  }
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { residentProfile: true, tenant: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch current profile' });
  }
});

router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      name,
      phone,
      avatarUrl,
      roomNumber,
      blockName,
      course,
      year,
      bloodGroup,
      parentName,
      parentPhone,
      emergencyContact,
      idProofNumber
    } = req.body;

    // Update User model fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(avatarUrl ? { avatarUrl } : {})
      }
    });

    // Upsert ResidentProfile
    const updatedProfile = await prisma.residentProfile.upsert({
      where: { userId },
      update: {
        ...((req.body.studentId || req.body.rollNo) ? { studentId: String(req.body.studentId || req.body.rollNo) } : {}),
        ...(roomNumber ? { roomNumber } : {}),
        ...(blockName ? { blockName } : {}),
        ...(course ? { course } : {}),
        ...(year ? { year } : {}),
        ...(bloodGroup !== undefined ? { bloodGroup } : {}),
        ...(parentName !== undefined ? { parentName } : {}),
        ...(parentPhone !== undefined ? { parentPhone } : {}),
        ...(emergencyContact !== undefined ? { emergencyContact } : {}),
        ...(idProofNumber !== undefined ? { idProofNumber } : {}),
        ...((req.body as any).profileDataJson !== undefined
          ? {
              profileDataJson:
                typeof (req.body as any).profileDataJson === 'string'
                  ? (req.body as any).profileDataJson
                  : JSON.stringify((req.body as any).profileDataJson)
            }
          : {})
      },
      create: {
        userId,
        studentId: `STU-${Date.now().toString().slice(-4)}`,
        roomNumber: roomNumber || '101',
        blockName: blockName || 'Block A',
        course: course || 'B.Tech',
        year: year || '3rd Year',
        bloodGroup,
        parentName,
        parentPhone,
        emergencyContact,
        idProofNumber,
        kycComplete: true,
        ...((req.body as any).profileDataJson !== undefined
          ? {
              profileDataJson:
                typeof (req.body as any).profileDataJson === 'string'
                  ? (req.body as any).profileDataJson
                  : JSON.stringify((req.body as any).profileDataJson)
            }
          : {})
      }
    });

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatarUrl: updatedUser.avatarUrl,
        tenantId: updatedUser.tenantId,
        residentProfile: updatedProfile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Submit a Profile Correction Request for locked fields
router.post('/correction-request', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fieldName, currentValue, requestedValue, reason } = req.body;

    if (!fieldName || !requestedValue) {
      return res.status(400).json({ error: 'Field name and requested value are required' });
    }

    const resident = await prisma.residentProfile.findUnique({ where: { userId } });
    if (!resident) return res.status(404).json({ error: 'Resident profile not found' });

    let currentData: any = {};
    try {
      if ((resident as any).profileDataJson) {
        currentData = JSON.parse((resident as any).profileDataJson);
      }
    } catch (e) {}

    const newRequest = {
      id: `CR-${Date.now().toString().slice(-6)}`,
      fieldName,
      currentValue: currentValue || 'N/A',
      requestedValue,
      reason: reason || 'Correction requested by student',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const existingRequests = currentData.correctionRequests || [];
    currentData.correctionRequests = [newRequest, ...existingRequests];

    await prisma.residentProfile.update({
      where: { userId },
      data: {
        profileDataJson: JSON.stringify(currentData)
      } as any
    });

    return res.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Correction request error:', error);
    return res.status(500).json({ error: 'Failed to submit correction request' });
  }
});

// Admin Review Profile Correction Request
router.post('/:id/correction-request/:reqId/review', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, reqId } = req.params;
    const { status, adminNote } = req.body; // 'APPROVED' | 'REJECTED'

    const resident = await prisma.residentProfile.findFirst({
      where: { OR: [{ userId: id }, { id }] }
    });
    if (!resident) return res.status(404).json({ error: 'Resident not found' });

    let currentData: any = {};
    try {
      if ((resident as any).profileDataJson) {
        currentData = JSON.parse((resident as any).profileDataJson);
      }
    } catch (e) {}

    const requests = currentData.correctionRequests || [];
    const targetReq = requests.find((r: any) => r.id === reqId);
    if (!targetReq) return res.status(404).json({ error: 'Correction request not found' });

    targetReq.status = status;
    targetReq.reviewedAt = new Date().toISOString();
    targetReq.adminNote = adminNote || (status === 'APPROVED' ? 'Approved by Admin' : 'Rejected');

    // If approved, update the actual field
    const updateData: any = { profileDataJson: JSON.stringify(currentData) };
    if (status === 'APPROVED') {
      if (targetReq.fieldName === 'roomNumber') updateData.roomNumber = targetReq.requestedValue;
      if (targetReq.fieldName === 'blockName') updateData.blockName = targetReq.requestedValue;
      if (targetReq.fieldName === 'course') updateData.course = targetReq.requestedValue;
    }

    await prisma.residentProfile.update({
      where: { id: resident.id },
      data: updateData
    });

    return res.json({ success: true, request: targetReq });
  } catch (error) {
    console.error('Review correction request error:', error);
    return res.status(500).json({ error: 'Failed to review correction request' });
  }
});

// Report Digital ID Lost / Stolen
router.post('/digital-id/report-lost', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { reason } = req.body;

    const resident = await prisma.residentProfile.findUnique({ where: { userId } });
    if (!resident) return res.status(404).json({ error: 'Resident not found' });

    let currentData: any = {};
    try {
      if ((resident as any).profileDataJson) {
        currentData = JSON.parse((resident as any).profileDataJson);
      }
    } catch (e) {}

    currentData.digitalId = {
      ...(currentData.digitalId || {}),
      cardStatus: 'BLOCKED_LOST',
      reportedLostAt: new Date().toISOString(),
      lostReason: reason || 'Reported lost by student'
    };

    await prisma.residentProfile.update({
      where: { userId },
      data: {
        profileDataJson: JSON.stringify(currentData)
      } as any
    });

    return res.json({ success: true, digitalId: currentData.digitalId });
  } catch (error) {
    console.error('Report lost ID error:', error);
    return res.status(500).json({ error: 'Failed to report lost ID' });
  }
});

// Request Digital ID Re-issue
router.post('/digital-id/request-new', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { reason } = req.body;

    const resident = await prisma.residentProfile.findUnique({ where: { userId } });
    if (!resident) return res.status(404).json({ error: 'Resident not found' });

    let currentData: any = {};
    try {
      if ((resident as any).profileDataJson) {
        currentData = JSON.parse((resident as any).profileDataJson);
      }
    } catch (e) {}

    currentData.digitalId = {
      ...(currentData.digitalId || {}),
      cardStatus: 'REISSUE_REQUESTED',
      reissueRequestedAt: new Date().toISOString(),
      reissueReason: reason || 'Replacement card requested'
    };

    await prisma.residentProfile.update({
      where: { userId },
      data: {
        profileDataJson: JSON.stringify(currentData)
      } as any
    });

    return res.json({ success: true, digitalId: currentData.digitalId });
  } catch (error) {
    console.error('Request new ID error:', error);
    return res.status(500).json({ error: 'Failed to request new ID' });
  }
});

export default router;
