import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { broadcastPassUpdate } from '../../socket';

const router = Router();

router.post('/simulate-scan', async (req: Request, res: Response) => {
  try {
    const { token, gateId, direction } = req.body; // direction: "ENTRY" | "EXIT"
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const now = new Date();

    // Check if token matches a Pass
    const pass = await prisma.pass.findUnique({
      where: { qrCodeToken: token },
      include: {
        resident: {
          include: { residentProfile: true }
        }
      }
    });

    if (pass) {
      if (pass.status !== 'APPROVED' && pass.status !== 'ACTIVE') {
        return res.json({
          status: 'ACCESS_DENIED',
          reason: `Pass status is ${pass.status}. Entry forbidden.`,
          timestamp: now.toISOString()
        });
      }

      const isExit = direction ? direction === 'EXIT' : !pass.actualExitAt;
      const newPresence = isExit ? (pass.passType === 'LEAVE' ? 'OUT_ON_LEAVE' : 'OUT_ON_PASS') : 'IN_HOSTEL';

      await prisma.pass.update({
        where: { id: pass.id },
        data: {
          actualExitAt: isExit ? now : pass.actualExitAt,
          actualReturnAt: !isExit ? now : null,
          status: isExit ? 'ACTIVE' : 'RETURNED'
        }
      });

      if (pass.resident.residentProfile) {
        await prisma.residentProfile.update({
          where: { id: pass.resident.residentProfile.id },
          data: {
            currentPresence: newPresence,
            lastGateScanAt: now
          }
        });
      }

      await prisma.gateScanLog.create({
        data: {
          passId: pass.id,
          personName: pass.resident.name,
          personType: 'RESIDENT',
          scanType: isExit ? 'EXIT' : 'ENTRY',
          guardName: gateId || 'Automated Turnstile Turnstile-North-01',
          notes: `Pass: ${pass.passNumber} (${pass.passType})`
        }
      });

      broadcastPassUpdate({
        type: isExit ? 'GATE_EXIT' : 'GATE_ENTRY',
        residentId: pass.residentId,
        presence: newPresence
      });

      return res.json({
        status: 'ACCESS_GRANTED',
        personType: 'RESIDENT',
        name: pass.resident.name,
        room: pass.resident.residentProfile?.roomNumber,
        direction: isExit ? 'EXIT' : 'ENTRY',
        passType: pass.passType,
        destination: pass.destination,
        message: `Welcome ${pass.resident.name}. Gate opened.`,
        timestamp: now.toISOString()
      });
    }

    // Check if token matches a Visitor pass
    const visitor = await prisma.visitor.findUnique({
      where: { qrPassCode: token },
      include: {
        resident: { include: { residentProfile: true } }
      }
    });

    if (visitor) {
      const isExit = direction ? direction === 'EXIT' : Boolean(visitor.checkInAt && !visitor.checkOutAt);

      await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          status: isExit ? 'CHECKED_OUT' : 'CHECKED_IN',
          checkInAt: isExit ? visitor.checkInAt : now,
          checkOutAt: isExit ? now : null
        }
      });

      await prisma.gateScanLog.create({
        data: {
          personName: visitor.visitorName,
          personType: 'VISITOR',
          scanType: isExit ? 'EXIT' : 'ENTRY',
          guardName: gateId || 'Main Security Turnstile 01',
          notes: `Visitor visiting ${visitor.resident.name} (Room ${visitor.resident.residentProfile?.roomNumber})`
        }
      });

      return res.json({
        status: 'ACCESS_GRANTED',
        personType: 'VISITOR',
        name: visitor.visitorName,
        visiting: visitor.resident.name,
        room: visitor.resident.residentProfile?.roomNumber,
        direction: isExit ? 'EXIT' : 'ENTRY',
        message: `Visitor pass validated. Gate opened.`,
        timestamp: now.toISOString()
      });
    }

    return res.json({
      status: 'ACCESS_DENIED',
      reason: 'Unrecognized barcode/QR pass. Alert logged.',
      timestamp: now.toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Turnstile scan failure' });
  }
});

// In-memory store for SMS issued offline passes & fallback numeric codes
interface OfflinePassRecord {
  code: string;
  residentName: string;
  residentPhone: string;
  roomNumber: string;
  destination: string;
  validUntil: string;
  issuedAt: string;
  used: boolean;
}

const offlinePasses: Map<string, OfflinePassRecord> = new Map();

// Helper to pre-populate sample offline codes
offlinePasses.set('PASS-749201', {
  code: 'PASS-749201',
  residentName: 'Rahul Sharma',
  residentPhone: '+91 98765 43210',
  roomNumber: 'A-302',
  destination: 'Local Market / Medical',
  validUntil: new Date(Date.now() + 3 * 3600000).toISOString(),
  issuedAt: new Date().toISOString(),
  used: false
});

// SMS Gateway Webhook / Simulator for 2G / Keypad Feature Phones
router.post('/sms-gateway', async (req: Request, res: Response) => {
  try {
    const { fromPhone, messageText, gateId } = req.body;
    const cleanMsg = (messageText || '').trim().toUpperCase();
    const phone = fromPhone || '+91 98765 43210';
    const now = new Date();

    // Match student by phone or use default resident profile
    const student = await prisma.user.findFirst({
      where: {
        role: 'STUDENT',
        phone: { contains: phone.slice(-8) }
      },
      include: { residentProfile: true }
    }) || await prisma.user.findFirst({
      where: { role: 'STUDENT' },
      include: { residentProfile: true }
    });

    const studentName = student?.name || 'Resident Student';
    const roomNumber = student?.residentProfile?.roomNumber || 'A-302';

    // 1. HELP command
    if (cleanMsg === 'HELP' || cleanMsg === '?') {
      const reply = `CAMPUS ASSIST SMS HELP:
1. Text 'PASS OUT 3HRS' or 'PASS OUT MARKET' to request outpass
2. Text 'STATUS' to check ticket/pass status
3. Text 'SOS' for immediate emergency help`;
      return res.json({ success: true, replySms: reply, actionTaken: 'HELP_INFO' });
    }

    // 2. SOS Emergency Command
    if (cleanMsg.startsWith('SOS') || cleanMsg.includes('EMERGENCY')) {
      if (student) {
        await prisma.emergencyAlert.create({
          data: {
            residentId: student.id,
            emergencyType: 'SECURITY_THREAT',
            locationDetails: `Room ${roomNumber} (Triggered via SMS)`,
            notes: 'Emergency SOS initiated via Keypad SMS Shortcode 56070'
          }
        });
      }
      const reply = `🚨 EMERGENCY ALERT LOGGED: Rapid Response Unit & Chief Warden notified for ${studentName} (Room ${roomNumber}). Security has been dispatched. Stay calm.`;
      return res.json({ success: true, replySms: reply, actionTaken: 'EMERGENCY_TRIGGERED' });
    }

    // 3. STATUS Command
    if (cleanMsg.startsWith('STATUS') || cleanMsg === 'CHECK') {
      const latestComplaint = student ? await prisma.complaint.findFirst({
        where: { residentId: student.id },
        include: { assignedStaff: true },
        orderBy: { createdAt: 'desc' }
      }) : null;

      const latestPass = student ? await prisma.pass.findFirst({
        where: { residentId: student.id },
        orderBy: { createdAt: 'desc' }
      }) : null;

      const passStatus = latestPass ? `${latestPass.passType}: ${latestPass.status}` : 'No active outpass';
      const complaintStatus = latestComplaint
        ? `Ticket #${latestComplaint.ticketNumber} (${latestComplaint.category}) is ${latestComplaint.status} (Staff: ${latestComplaint.assignedStaff?.name || 'Assigned'})`
        : 'No pending complaints';

      const reply = `CAMPUS STATUS for ${studentName}:
- Pass: ${passStatus}
- Maintenance: ${complaintStatus}
Mess Meal today: Special Thali available till 14:30.`;
      return res.json({ success: true, replySms: reply, actionTaken: 'STATUS_LOOKUP' });
    }

    // 4. PASS OUT Command (e.g. PASS OUT 3HRS or PASS OUT MARKET)
    if (cleanMsg.startsWith('PASS') || cleanMsg.startsWith('OUT')) {
      // Generate 6-digit numeric fallback TOTP
      const randomSixDigit = Math.floor(100000 + Math.random() * 900000).toString();
      const offlineCode = `PASS-${randomSixDigit}`;
      const validUntil = new Date(Date.now() + 3.5 * 3600000);

      // Create actual pass in database
      if (student) {
        await prisma.pass.create({
          data: {
            passNumber: offlineCode,
            passType: 'OUTPASS',
            status: 'APPROVED',
            residentId: student.id,
            reason: cleanMsg.replace(/^PASS\s*/i, '') || 'Market / Essential errand (SMS Request)',
            destination: 'Local Vicinity (Keypad Pass)',
            validFrom: now,
            validTill: validUntil,
            qrCodeToken: offlineCode,
            approvedByName: 'Auto-Approval Engine (SMS Fallback)'
          }
        });
      }

      offlinePasses.set(offlineCode, {
        code: offlineCode,
        residentName: studentName,
        residentPhone: phone,
        roomNumber,
        destination: 'Local Vicinity',
        validUntil: validUntil.toISOString(),
        issuedAt: now.toISOString(),
        used: false
      });

      const reply = `GATEPASS APPROVED:
Code: ${offlineCode}
Resident: ${studentName} (Room ${roomNumber})
Valid until: ${validUntil.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
Tell code to gate guard or keypad turnstile to exit.`;

      return res.json({
        success: true,
        replySms: reply,
        offlineCode,
        actionTaken: 'OUTPASS_ISSUED',
        validUntil: validUntil.toISOString()
      });
    }

    // Fallback response for unparsed SMS
    const reply = `CAMPUS SMS: Command not recognized. Text 'PASS OUT 3HRS' for outpass, 'STATUS' for ticket status, or 'SOS' for emergency.`;
    return res.json({ success: true, replySms: reply, actionTaken: 'UNKNOWN_COMMAND' });
  } catch (error) {
    console.error('SMS Gateway error:', error);
    return res.status(500).json({ error: 'SMS Gateway processing failed' });
  }
});

// Guard / Turnstile Keypad: Verify 6-digit numeric offline pass code
router.post('/verify-offline-code', async (req: Request, res: Response) => {
  try {
    let { offlineCode, gateId, direction } = req.body;
    if (!offlineCode) return res.status(400).json({ error: 'Offline code is required' });

    offlineCode = offlineCode.trim().toUpperCase();
    if (!offlineCode.startsWith('PASS-') && /^\d{6}$/.test(offlineCode)) {
      offlineCode = `PASS-${offlineCode}`;
    }

    const now = new Date();
    const pass = await prisma.pass.findFirst({
      where: {
        OR: [
          { qrCodeToken: offlineCode },
          { passNumber: offlineCode }
        ]
      },
      include: {
        resident: { include: { residentProfile: true } }
      }
    });

    const memoryRecord = offlinePasses.get(offlineCode);

    if (!pass && !memoryRecord) {
      return res.json({
        status: 'ACCESS_DENIED',
        reason: 'Invalid or expired 6-digit numeric pass code.',
        code: offlineCode,
        timestamp: now.toISOString()
      });
    }

    const residentName = pass?.resident.name || memoryRecord?.residentName || 'Resident Student';
    const roomNumber = pass?.resident.residentProfile?.roomNumber || memoryRecord?.roomNumber || 'A-302';
    const isExit = direction ? direction === 'EXIT' : true;

    if (pass) {
      await prisma.pass.update({
        where: { id: pass.id },
        data: {
          actualExitAt: isExit ? now : pass.actualExitAt,
          actualReturnAt: !isExit ? now : null,
          status: isExit ? 'ACTIVE' : 'RETURNED'
        }
      });

      if (pass.resident.residentProfile) {
        await prisma.residentProfile.update({
          where: { id: pass.resident.residentProfile.id },
          data: {
            currentPresence: isExit ? 'OUT_ON_PASS' : 'IN_HOSTEL',
            lastGateScanAt: now
          }
        });
      }
    }

    if (memoryRecord) {
      memoryRecord.used = true;
    }

    await prisma.gateScanLog.create({
      data: {
        passId: pass?.id || null,
        personName: residentName,
        personType: 'RESIDENT',
        scanType: isExit ? 'EXIT' : 'ENTRY',
        guardName: gateId || 'North Guard Keypad Station',
        notes: `Offline 6-digit code verified: ${offlineCode}`
      }
    });

    broadcastPassUpdate({
      type: isExit ? 'GATE_EXIT' : 'GATE_ENTRY',
      residentId: pass?.residentId || 'offline-res',
      presence: isExit ? 'OUT_ON_PASS' : 'IN_HOSTEL'
    });

    return res.json({
      status: 'ACCESS_GRANTED',
      code: offlineCode,
      name: residentName,
      room: roomNumber,
      direction: isExit ? 'EXIT' : 'ENTRY',
      message: `Offline code verified successfully. Turnstile barrier unlocked.`,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('Verify offline code error:', error);
    return res.status(500).json({ error: 'Failed to verify offline code' });
  }
});

export default router;
