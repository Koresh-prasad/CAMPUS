import { prisma } from '../../prisma';

export class ComplianceExportService {
  /**
   * Generates formatted CSV for NAAC Criterion 5.1.2: Student Grievance Redressal
   */
  static async generateGrievanceRedressalCSV(): Promise<string> {
    const complaints = await prisma.complaint.findMany({
      include: {
        resident: { include: { residentProfile: true } },
        assignedStaff: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const headers = [
      'Ticket Number',
      'Category',
      'Room Number',
      'Block Name',
      'Status',
      'Priority',
      'SLA Target (Hours)',
      'Assigned Staff',
      'Raised Timestamp',
      'Resolved Timestamp',
      'Student Satisfaction Rating (1-5★)',
      'Student Feedback'
    ];

    const rows = complaints.map((c) => [
      c.ticketNumber,
      c.category,
      c.resident.residentProfile?.roomNumber || 'N/A',
      `"${c.resident.residentProfile?.blockName || 'Hostel'}"`,
      c.status,
      c.priority,
      c.slaHours,
      `"${c.assignedStaff?.name || 'Unassigned'}"`,
      c.createdAt.toISOString(),
      c.resolvedAt ? c.resolvedAt.toISOString() : 'PENDING',
      c.rating || 'N/A',
      `"${(c.ratingComment || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Generates formatted CSV for NAAC Criterion 7.1.1: Campus Safety & Curfew Logs
   */
  static async generateSafetyAuditCSV(): Promise<string> {
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200
    });

    const headers = ['Audit ID', 'Timestamp', 'Actor Role', 'Action', 'Entity Type', 'Entity Reference', 'Details'];

    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.actorRole,
      log.action,
      log.entity,
      log.entityId,
      `"${log.detailsJson.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
