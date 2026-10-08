import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware, optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';
import { broadcastComplaintUpdate } from '../../socket';
import { SLA_HOURS_BY_CATEGORY } from '@shms/shared';

const router = Router();

// Get list of complaints with optional filters
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, category, residentId } = req.query;

    const whereClause: any = {};
    const tenantFilter = req.user?.tenantId || (req.query.tenantId as string);
    if (tenantFilter) {
      whereClause.resident = { tenantId: tenantFilter };
    }
    if (status) whereClause.status = String(status);
    if (category) whereClause.category = String(category);
    if (residentId) whereClause.residentId = String(residentId);

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        resident: {
          include: { residentProfile: true }
        },
        assignedStaff: true,
        logs: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = complaints.map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      title: c.title,
      description: c.description,
      category: c.category,
      status: c.status,
      priority: c.priority,
      residentId: c.residentId,
      residentName: c.isAnonymous ? 'Anonymous Student' : c.resident.name,
      roomNumber: c.resident.residentProfile?.roomNumber || 'Unknown',
      blockName: c.resident.residentProfile?.blockName || 'Main Campus',
      assignedStaffId: c.assignedStaffId,
      assignedStaffName: c.assignedStaff?.name || 'Unassigned',
      photoUrl: c.photoUrl,
      videoUrl: (c as any).videoUrl || null,
      voiceUrl: (c as any).voiceUrl || null,
      isAnonymous: c.isAnonymous,
      slaHours: c.slaHours,
      slaDueAt: c.slaDueAt.toISOString(),
      rating: c.rating,
      ratingComment: c.ratingComment,
      resolvedAt: c.resolvedAt?.toISOString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      logs: c.logs
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Fetch complaints error:', error);
    return res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Complaint submission (Supports ANY reason/type with photo & video evidence)
router.post('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category = 'OTHER',
      priority = 'MEDIUM',
      isAnonymous = false,
      photoUrl,
      voiceUrl,
      videoUrl,
      studentName,
      roomNumber,
      blockName
    } = req.body;

    let residentId = req.user?.id;
    let actorName = req.user?.name;

    if (!residentId) {
      // Find default resident or create demo student
      const fallbackResident = await prisma.user.findFirst({
        where: { role: { in: ['STUDENT', 'RESIDENT'] } },
        include: { residentProfile: true }
      });
      if (fallbackResident) {
        residentId = fallbackResident.id;
        actorName = studentName || fallbackResident.name;
      } else {
        // Find any user
        const anyUser = await prisma.user.findFirst();
        residentId = anyUser?.id || 'demo-student-subham';
        actorName = studentName || 'Subham Pradhan';
      }
    }

    const catKey = (category || 'OTHER') as keyof typeof SLA_HOURS_BY_CATEGORY;
    const slaHours = SLA_HOURS_BY_CATEGORY[catKey] || 24;
    const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const ticketNumber = `CMP-${Date.now().toString().slice(-6)}`;

    // Auto-assign staff based on department if available
    let assignedStaff = null;
    const deptMap: Record<string, string> = {
      WATER: 'PLUMBING',
      ELECTRICITY: 'ELECTRICAL',
      SECURITY: 'SECURITY',
      HOUSEKEEPING: 'HOUSEKEEPING',
      CLEANLINESS: 'HOUSEKEEPING',
      WIFI: 'ADMIN',
      MESS: 'MESS',
      MESS_CANTEEN: 'MESS',
      ACADEMIC: 'ADMIN',
      MEDICAL: 'ADMIN',
      INFRASTRUCTURE: 'HOUSEKEEPING',
      FURNITURE: 'HOUSEKEEPING',
      OTHER: 'ADMIN'
    };
    const targetDept = deptMap[category] || 'ADMIN';
    const staff = await prisma.staffProfile.findFirst({
      where: { department: targetDept },
      include: { user: true }
    });
    if (staff) {
      assignedStaff = staff.user;
    }

    // Build rich description incorporating voice / video metadata if attached
    let finalDescription = description || 'Issue reported by resident';
    if (voiceUrl) {
      finalDescription += `\n[🎤 Voice Message Attached]`;
    }
    if (videoUrl) {
      finalDescription += `\n[🎥 Video Proof Attached: ${videoUrl}]`;
    }
    if (photoUrl) {
      finalDescription += `\n[📷 Photo Proof Attached: ${photoUrl}]`;
    }

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        title: title || `${category} issue in room`,
        description: finalDescription,
        category: category || 'OTHER',
        priority: priority || 'MEDIUM',
        status: 'RAISED',
        residentId: residentId!,
        isAnonymous: Boolean(isAnonymous),
        photoUrl: photoUrl || null,
        videoUrl: videoUrl || null,
        voiceUrl: voiceUrl || null,
        slaHours,
        slaDueAt,
        assignedStaffId: assignedStaff?.id,
        logs: {
          create: {
            actorName: isAnonymous ? 'Anonymous' : (actorName || 'Student'),
            action: 'COMPLAINT_RAISED',
            note: `Direct complaint registered via portal. Notified admin platform via WebSocket.`
          }
        }
      },
      include: {
        resident: { include: { residentProfile: true } },
        assignedStaff: true,
        logs: true
      }
    });

    const broadcastPayload = {
      type: 'CREATED',
      complaintId: complaint.id,
      ticketNumber: complaint.ticketNumber,
      category: complaint.category,
      status: complaint.status,
      title: complaint.title,
      description: complaint.description,
      priority: complaint.priority,
      photoUrl: complaint.photoUrl,
      videoUrl: complaint.videoUrl,
      residentName: complaint.isAnonymous ? 'Anonymous Student' : (studentName || complaint.resident?.name || 'Subham Pradhan'),
      roomNumber: roomNumber || complaint.resident?.residentProfile?.roomNumber || 'A-204',
      blockName: blockName || complaint.resident?.residentProfile?.blockName || 'Hostel A',
      createdAt: complaint.createdAt.toISOString()
    };

    broadcastComplaintUpdate(broadcastPayload);

    if (req.user) {
      try {
        await createAuditRecord(
          residentId!,
          req.user.role,
          'RAISE_COMPLAINT',
          'COMPLAINT',
          complaint.id,
          { ticketNumber, category, priority }
        );
      } catch {}
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. Admin platform has been directly notified via real-time WebSocket.',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    return res.status(500).json({ error: 'Failed to create complaint' });
  }
});

// Update complaint status (Kanban movement)
router.patch('/:id/status', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedStaffId, note } = req.body;

    const existing = await prisma.complaint.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Complaint not found' });

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }
    if (assignedStaffId) {
      updateData.assignedStaffId = assignedStaffId;
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        ...updateData,
        logs: {
          create: {
            actorName: req.user?.name || 'Administrator',
            action: `STATUS_CHANGED_TO_${status}`,
            note: note || `Status transitioned to ${status}`
          }
        }
      },
      include: {
        resident: { include: { residentProfile: true } },
        assignedStaff: true,
        logs: true
      }
    });

    broadcastComplaintUpdate({
      type: 'STATUS_UPDATED',
      complaintId: updated.id,
      status: updated.status,
      ticketNumber: updated.ticketNumber
    });

    await createAuditRecord(
      req.user!.id,
      req.user!.role,
      `COMPLAINT_${status}`,
      'COMPLAINT',
      id,
      { previousStatus: existing.status, newStatus: status, note }
    );

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

// Resident rating after resolution
router.post('/:id/rate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, ratingComment } = req.body;

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        rating: Number(rating),
        ratingComment: ratingComment || null
      }
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to record rating' });
  }
});

export default router;
