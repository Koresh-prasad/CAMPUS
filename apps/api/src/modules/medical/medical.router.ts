import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { optionalAuthMiddleware, createAuditRecord } from '../../middlewares/auth';
import { broadcastMedicalRequest, broadcastComplaintUpdate, broadcastEmergency } from '../../socket';

const router = Router();

// GET all active student medical requests
router.get('/requests', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const medicalComplaints = await prisma.complaint.findMany({
      where: {
        category: 'MEDICAL'
      },
      include: {
        resident: {
          include: { residentProfile: true }
        },
        logs: {
          orderBy: { timestamp: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = medicalComplaints.map((c) => ({
      id: c.id,
      ticketNumber: c.ticketNumber,
      studentName: c.isAnonymous ? 'Anonymous Student' : c.resident?.name || 'Student Resident',
      studentId: c.resident?.residentProfile?.studentId || 'REC-STU',
      studentRoll: c.resident?.residentProfile?.studentId || 'REC-2023-CS042',
      studentPhone: c.resident?.phone || '+91 98765 43210',
      parentPhone: c.resident?.residentProfile?.parentPhone || '+91 94370 88990',
      hostel: c.resident?.residentProfile?.blockName || 'Nilgiri Residence (Block A)',
      room: c.resident?.residentProfile?.roomNumber || 'A-204',
      requestType: c.priority === 'CRITICAL' ? 'Emergency' : 'Illness',
      description: c.description,
      urgency: c.priority === 'CRITICAL' ? 'EMERGENCY' : c.priority === 'HIGH' ? 'URGENT' : 'NORMAL',
      dateTime: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: c.status === 'RESOLVED' ? 'Completed' : c.status === 'IN_PROGRESS' ? 'In Progress' : 'New',
      attendingStaff: 'Dr. Pratima Mishra, MD',
      createdAt: c.createdAt.toISOString()
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Fetch medical requests error:', error);
    return res.status(500).json({ error: 'Failed to fetch medical requests' });
  }
});

// POST student submits a new medical / medicine request
router.post('/requests', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      symptoms,
      medicineNeeded,
      urgency = 'NORMAL',
      studentName,
      roomNumber,
      blockName,
      notes,
      phone
    } = req.body;

    let residentId = req.user?.id;
    let actorName = req.user?.name;

    if (!residentId) {
      const fallback = await prisma.user.findFirst({
        where: { role: { in: ['STUDENT', 'RESIDENT'] } },
        include: { residentProfile: true }
      });
      if (fallback) {
        residentId = fallback.id;
        actorName = studentName || fallback.name;
      } else {
        const anyUser = await prisma.user.findFirst();
        residentId = anyUser?.id || 'demo-student';
        actorName = studentName || 'Student';
      }
    }

    const priority = urgency === 'EMERGENCY' ? 'CRITICAL' : urgency === 'URGENT' ? 'HIGH' : 'MEDIUM';
    const ticketNumber = `MED-${Date.now().toString().slice(-5)}`;
    const fullDesc = `Health Problem: ${symptoms || 'Medical consultation requested'}${medicineNeeded ? ` | Medicine requested: ${medicineNeeded}` : ''}${notes ? ` | Notes: ${notes}` : ''}`;

    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        title: symptoms ? `Medical: ${symptoms.slice(0, 40)}` : 'Campus Medical Request',
        description: fullDesc,
        category: 'MEDICAL',
        priority,
        status: 'RAISED',
        residentId: residentId!,
        slaHours: urgency === 'EMERGENCY' ? 1 : 4,
        slaDueAt: new Date(Date.now() + (urgency === 'EMERGENCY' ? 1 : 4) * 60 * 60 * 1000),
        logs: {
          create: {
            actorName: actorName || 'Student Patient',
            action: 'MEDICAL_REQUEST_CREATED',
            note: `Medical assistance requested. Urgency: ${urgency}`
          }
        }
      },
      include: {
        resident: { include: { residentProfile: true } }
      }
    });

    const payload = {
      id: complaint.id,
      ticketNumber: complaint.ticketNumber,
      studentName: studentName || complaint.resident.name,
      studentId: complaint.resident.residentProfile?.studentId || 'REC-STU',
      studentRoll: complaint.resident.residentProfile?.studentId || 'REC-2023-CS042',
      studentPhone: phone || complaint.resident.phone || '+91 98765 43210',
      parentPhone: complaint.resident.residentProfile?.parentPhone || '+91 94370 88990',
      hostel: blockName || complaint.resident.residentProfile?.blockName || 'Hostel A',
      room: roomNumber || complaint.resident.residentProfile?.roomNumber || 'A-204',
      requestType: urgency === 'EMERGENCY' ? 'Emergency' : 'Illness',
      description: fullDesc,
      urgency,
      dateTime: 'Just now',
      status: 'New',
      attendingStaff: 'Dr. Pratima Mishra, MD',
      category: 'MEDICAL',
      priority,
      createdAt: complaint.createdAt.toISOString()
    };

    // Broadcast instant socket alerts to Admin & Doctor
    broadcastMedicalRequest(payload);
    broadcastComplaintUpdate({
      ...payload,
      complaintId: complaint.id,
      residentName: payload.studentName,
      roomNumber: payload.room,
      blockName: payload.hostel
    });

    return res.status(201).json({
      success: true,
      message: 'Medical request registered! Campus doctor and admin platform notified.',
      request: payload
    });
  } catch (error) {
    console.error('Create medical request error:', error);
    return res.status(500).json({ error: 'Failed to create medical request' });
  }
});

// PATCH doctor updates status of medical case
router.patch('/requests/:id/status', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, doctorNotes, prescription } = req.body;

    const dbStatus = status === 'Completed' ? 'RESOLVED' : status === 'In Progress' ? 'IN_PROGRESS' : 'ACKNOWLEDGED';

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status: dbStatus,
        resolvedAt: status === 'Completed' ? new Date() : undefined,
        logs: {
          create: {
            actorName: req.user?.name || 'Dr. Pratima Mishra, MD',
            action: `STATUS_UPDATED_${status.toUpperCase().replace(/\s+/g, '_')}`,
            note: doctorNotes ? `${doctorNotes} (Rx: ${prescription || 'N/A'})` : `Status marked as ${status}`
          }
        }
      }
    });

    broadcastMedicalRequest({
      id: updated.id,
      ticketNumber: updated.ticketNumber,
      status,
      doctorNotes,
      prescription,
      updatedAt: new Date().toISOString()
    });

    return res.json({ success: true, updated });
  } catch (error) {
    console.error('Update medical request error:', error);
    return res.status(500).json({ error: 'Failed to update request' });
  }
});

export default router;
