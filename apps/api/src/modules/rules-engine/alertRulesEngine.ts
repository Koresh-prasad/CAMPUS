import { prisma } from '../../prisma';
import { broadcastCurfewAlert, broadcastVisitorOverstay } from '../../socket';
import { createAuditRecord } from '../../middlewares/auth';
import { CurfewViolation } from '@shms/shared';

export interface AlertEngineStatus {
  lastRunAt: Date;
  activeCurfewViolations: number;
  activeVisitorOverstays: number;
  unresolvedEmergencies: number;
}

let cachedEngineStatus: AlertEngineStatus = {
  lastRunAt: new Date(),
  activeCurfewViolations: 0,
  activeVisitorOverstays: 0,
  unresolvedEmergencies: 0
};

export async function checkCurfewViolations(curfewTimeStr: string = '21:30', tenantId?: string): Promise<CurfewViolation[]> {
  const now = new Date();
  const [curfewHour, curfewMin] = curfewTimeStr.split(':').map(Number);
  
  // Check if current time is past curfew hour today
  const curfewToday = new Date();
  curfewToday.setHours(curfewHour, curfewMin, 0, 0);

  // We find all residents who are NOT inside the hostel or who have overdue passes
  const activeResidents = await prisma.residentProfile.findMany({
    where: tenantId ? { user: { tenantId } } : undefined,
    include: {
      user: true
    }
  });

  const violations: CurfewViolation[] = [];

  for (const resident of activeResidents) {
    // Check if resident is marked OUT
    if (resident.currentPresence === 'OUT_ON_PASS' || resident.currentPresence === 'OVERDUE' || resident.currentPresence === 'OUT_ON_LEAVE') {
      // Find their latest active pass
      const latestPass = await prisma.pass.findFirst({
        where: {
          residentId: resident.userId,
          status: { in: ['APPROVED', 'ACTIVE'] }
        },
        orderBy: { validTill: 'desc' }
      });

      let statusType: 'ON_APPROVED_LEAVE' | 'GATE_PASS_EXPIRED' | 'UNACCOUNTED_ABSENCE' = 'UNACCOUNTED_ABSENCE';
      let minutesOverdue = 0;

      if (latestPass) {
        const passEnd = new Date(latestPass.validTill);
        if (now > passEnd) {
          minutesOverdue = Math.floor((now.getTime() - passEnd.getTime()) / (1000 * 60));
          statusType = 'GATE_PASS_EXPIRED';
          
          // Mark pass and resident as overdue
          await prisma.pass.update({
            where: { id: latestPass.id },
            data: { isOverdue: true, status: 'EXPIRED' }
          });
          await prisma.residentProfile.update({
            where: { id: resident.id },
            data: { currentPresence: 'OVERDUE' }
          });
        } else if (latestPass.passType === 'LEAVE') {
          statusType = 'ON_APPROVED_LEAVE';
        }
      } else {
        // Resident is OUT with NO PASS! This is an unaccounted absence
        statusType = 'UNACCOUNTED_ABSENCE';
        const diff = Math.floor((now.getTime() - (resident.lastGateScanAt?.getTime() || now.getTime())) / (1000 * 60));
        minutesOverdue = Math.max(diff, 15);
      }

      // If it's past curfew or pass is expired, record violation
      if (now > curfewToday || statusType === 'GATE_PASS_EXPIRED' || statusType === 'UNACCOUNTED_ABSENCE') {
        const violation: CurfewViolation = {
          residentId: resident.userId,
          residentName: resident.user.name,
          roomNumber: resident.roomNumber,
          blockName: resident.blockName,
          phone: resident.user.phone,
          parentPhone: resident.parentPhone || undefined,
          lastKnownStatus: statusType,
          passId: latestPass?.id,
          expectedReturn: latestPass?.validTill.toISOString(),
          minutesOverdue
        };
        violations.push(violation);
      }
    }
  }

  if (violations.length > 0) {
    broadcastCurfewAlert({
      count: violations.length,
      violations,
      timestamp: now.toISOString()
    });
  }

  return violations;
}

export async function checkVisitorOverstays(): Promise<any[]> {
  const now = new Date();
  
  // Find all visitors who have CHECKED_IN but have NOT CHECKED_OUT
  const checkedInVisitors = await prisma.visitor.findMany({
    where: {
      status: 'CHECKED_IN'
    },
    include: {
      resident: true
    }
  });

  const overstayedList = [];

  for (const visitor of checkedInVisitors) {
    if (visitor.checkInAt) {
      // Default maximum permitted visitor duration is 2 hours (120 minutes)
      const maxDurationMinutes = 120;
      const elapsedMinutes = Math.floor((now.getTime() - visitor.checkInAt.getTime()) / (1000 * 60));

      if (elapsedMinutes > maxDurationMinutes) {
        const overstayMinutes = elapsedMinutes - maxDurationMinutes;

        // Update visitor status to OVERSTAYED
        await prisma.visitor.update({
          where: { id: visitor.id },
          data: { status: 'OVERSTAYED' }
        });

        const alertItem = {
          visitorId: visitor.id,
          visitorName: visitor.visitorName,
          visitorPhone: visitor.visitorPhone,
          hostResidentName: visitor.resident.name,
          hostResidentId: visitor.residentId,
          checkInAt: visitor.checkInAt,
          overstayMinutes,
          purpose: visitor.purpose
        };

        overstayedList.push(alertItem);

        // Record audit
        await createAuditRecord(
          null,
          'SYSTEM_RULES_ENGINE',
          'VISITOR_OVERSTAY_FLAGGED',
          'VISITOR',
          visitor.id,
          alertItem
        );
      }
    }
  }

  if (overstayedList.length > 0) {
    broadcastVisitorOverstay({
      count: overstayedList.length,
      visitors: overstayedList,
      timestamp: now.toISOString()
    });
  }

  return overstayedList;
}

export async function checkUnresolvedEmergencies(): Promise<number> {
  const activeCount = await prisma.emergencyAlert.count({
    where: {
      status: { in: ['ACTIVE', 'INVESTIGATING'] }
    }
  });
  return activeCount;
}

export async function runRulesEngineCycle() {
  try {
    const curfewViolations = await checkCurfewViolations('21:30');
    const visitorOverstays = await checkVisitorOverstays();
    const emergencies = await checkUnresolvedEmergencies();

    cachedEngineStatus = {
      lastRunAt: new Date(),
      activeCurfewViolations: curfewViolations.length,
      activeVisitorOverstays: visitorOverstays.length,
      unresolvedEmergencies: emergencies
    };
  } catch (error) {
    console.error('[AlertingRulesEngine] Evaluation error:', error);
  }
}

export function startRulesEngine(intervalSeconds = 30) {
  console.log(`[AlertingRulesEngine] Initializing standalone background rules engine (every ${intervalSeconds}s)`);
  runRulesEngineCycle();
  return setInterval(runRulesEngineCycle, intervalSeconds * 1000);
}

export function getRulesEngineStatus(): AlertEngineStatus {
  return cachedEngineStatus;
}
