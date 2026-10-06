'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Shield,
  User,
  Clock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';

export default function AdminAuditLogsView() {
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const initialLogs = [
    {
      id: 'AUD-99120',
      action: 'Approved Student Gate Pass #GP-8812',
      actor: 'Dr. K. N. Mohapatra',
      role: 'WARDEN',
      module: 'LEAVE_GATE_PASS',
      recordId: 'GP-8812',
      target: 'Rahul Kumar (2101289001)',
      timestamp: 'Today 10:14 AM',
      ip: '192.168.1.14',
      prevValue: 'Status: PENDING_APPROVAL',
      newValue: 'Status: APPROVED (QR Code Generated)',
      notes: 'Parent verified via SMS OTP prior to approval.',
    },
    {
      id: 'AUD-99119',
      action: 'Security Gate Exit Scanned & Verified',
      actor: 'Vikram Singh',
      role: 'SECURITY',
      module: 'SECURITY',
      recordId: 'GP-8812',
      target: 'Rahul Kumar (2101289001)',
      timestamp: 'Today 10:25 AM',
      ip: '192.168.1.5 (Main Gate)',
      prevValue: 'Presence: IN_HOSTEL',
      newValue: 'Presence: OUT_PERMITTED (Exit main turnstile)',
      notes: 'Valid QR token scanned at turnstile 1.',
    },
    {
      id: 'AUD-99118',
      action: 'Room Bed Allocation Reassigned',
      actor: 'Administrator Singh',
      role: 'ADMIN_MANAGER',
      module: 'HOSTEL',
      recordId: 'RM-204-B1',
      target: 'Aman Verma (2201289045)',
      timestamp: 'Today 09:30 AM',
      ip: '192.168.1.10',
      prevValue: 'Room: Nilgiri A-102 Bed 2',
      newValue: 'Room: Nilgiri A-204 Bed 1',
      notes: 'Transferred on student mutual exchange request approved by Chief Warden.',
    },
    {
      id: 'AUD-99117',
      action: 'Service Work Order #SRV-1029 Marked Resolved',
      actor: 'Manoj Jena',
      role: 'SERVICE_STAFF',
      module: 'SERVICES',
      recordId: 'SRV-1029',
      target: 'Room A-204 Washroom',
      timestamp: 'Yesterday 04:15 PM',
      ip: '192.168.1.28',
      prevValue: 'Status: IN_PROGRESS',
      newValue: 'Status: RESOLVED (Technician completion photo attached)',
      notes: 'Washer replaced, verified water flow.',
    },
    {
      id: 'AUD-99116',
      action: 'Medical Fitness Certificate Issued for Sick Leave',
      actor: 'Dr. S. K. Mahapatra',
      role: 'MEDICAL_STAFF',
      module: 'MEDICAL',
      recordId: 'MED-LEAVE-402',
      target: 'Priya Sahu (2101289045)',
      timestamp: 'Yesterday 02:40 PM',
      ip: '192.168.1.33 (Health Center)',
      prevValue: 'Leave Clearance: NOT_ISSUED',
      newValue: 'Leave Clearance: 3 Days Medical Bed Rest Certified',
      notes: 'Clinical prescription confidential. Operational clearance synced to Warden.',
    },
    {
      id: 'AUD-99115',
      action: 'Student Grievance Ticket #CMP-40192 Resolved',
      actor: 'Chief Warden Office',
      role: 'WARDEN',
      module: 'COMPLAINTS',
      recordId: 'CMP-40192',
      target: 'Electrical Socket Replacement',
      timestamp: '28 Sep 2025 11:30 AM',
      ip: '192.168.1.14',
      prevValue: 'Status: ASSIGNED_ELECTRICIAN',
      newValue: 'Status: RESOLVED (Student Confirmed Fix)',
      notes: 'Student OTP confirmation entered.',
    },
    {
      id: 'AUD-99114',
      action: 'Night Gate Curfew Auto-Audit Check',
      actor: 'System Cron Service',
      role: 'SYSTEM',
      module: 'SECURITY',
      recordId: 'CRON-CRFW-25',
      target: 'Hostel Curfew Boundary 21:30',
      timestamp: '27 Sep 2025 21:35 PM',
      ip: '127.0.0.1 (Backend Kernel)',
      prevValue: 'Overdue Check: ACTIVE',
      newValue: 'Flagged 1 overdue student (Rohan Jena - Overdue 25m)',
      notes: 'Automated alert SMS dispatched to warden & security patrol.',
    },
    {
      id: 'AUD-99113',
      action: 'College Gallery Media Item Published',
      actor: 'Administrator Singh',
      role: 'ADMIN_MANAGER',
      module: 'GALLERY',
      recordId: 'GLR-5501',
      target: 'Annual Cultural Fest 2025 Album',
      timestamp: '26 Sep 2025 14:20 PM',
      ip: '192.168.1.10',
      prevValue: 'Publish State: DRAFT',
      newValue: 'Publish State: LIVE (Visible on Student Platform)',
      notes: 'Broadcasted to all student platforms via Socket.io.',
    },
  ];

  const filteredLogs = initialLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    const matchModule = selectedModule === 'ALL' || log.module === selectedModule;
    const matchRole = selectedRole === 'ALL' || log.role === selectedRole;
    return matchSearch && matchModule && matchRole;
  });

  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Action Description', 'Actor Name', 'Role', 'Module', 'Record ID', 'Target', 'Previous State', 'New State', 'IP Address'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.actor.replace(/"/g, '""')}"`,
      l.role,
      l.module,
      l.recordId,
      `"${l.target.replace(/"/g, '""')}"`,
      `"${l.prevValue.replace(/"/g, '""')}"`,
      `"${l.newValue.replace(/"/g, '""')}"`,
      l.ip,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CampusHelper_AuditLogs_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              Campus Administrative Audit Trail & Compliance Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable tracking of all operational actions, approvals, gate movements, and allocations across all 5 platforms.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search actor, action, ticket ID, student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Modules</option>
            <option value="LEAVE_GATE_PASS">Leave & Gate Pass</option>
            <option value="SECURITY">Security Gate Scans</option>
            <option value="HOSTEL">Hostel Allocation</option>
            <option value="SERVICES">Maintenance & Services</option>
            <option value="MEDICAL">Medical Operations</option>
            <option value="COMPLAINTS">Complaints Desk</option>
            <option value="GALLERY">College Gallery</option>
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN_MANAGER">Admin Manager</option>
            <option value="WARDEN">Warden</option>
            <option value="SECURITY">Security</option>
            <option value="SERVICE_STAFF">Service Staff</option>
            <option value="MEDICAL_STAFF">Medical Staff</option>
            <option value="SYSTEM">System Automations</option>
          </select>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-slate-800">{filteredLogs.length}</strong> audited events
        </p>
      </div>

      {/* 3. Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Record Identifier</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{log.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{log.action}</p>
                    <p className="text-[10px] text-slate-500">Target: {log.target}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{log.actor}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 font-semibold">{log.recordId}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    <p>{log.timestamp}</p>
                    <p className="text-[9px] text-slate-400 font-mono">{log.ip}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      Inspect Diff
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Inspect Diff Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-black text-sm text-slate-900">Audit Record Inspector: {selectedLog.id}</h4>
                <p className="text-[11px] text-slate-500">{selectedLog.timestamp} • {selectedLog.ip}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Action Logged</span>
                <p className="font-bold text-slate-900">{selectedLog.action}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Actor</span>
                  <strong>{selectedLog.actor}</strong> ({selectedLog.role})
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Module & Record</span>
                  <strong>{selectedLog.module}</strong> ({selectedLog.recordId})
                </div>
              </div>

              {/* State Transition Diff */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-700">Audit State Transition:</p>
                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-900">
                  <span className="text-[10px] font-bold text-rose-600 block uppercase">Previous Value:</span>
                  <p className="font-mono text-[11px]">{selectedLog.prevValue}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] font-bold text-emerald-600 block uppercase">New Value:</span>
                  <p className="font-mono text-[11px]">{selectedLog.newValue}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Compliance Notes</span>
                <p className="text-slate-600">{selectedLog.notes}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
