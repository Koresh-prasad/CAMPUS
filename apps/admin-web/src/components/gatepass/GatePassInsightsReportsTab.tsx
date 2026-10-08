'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Building,
  UserCheck,
  ShieldAlert,
  Clock,
  Filter,
  Search,
  FileText,
  TrendingUp,
  RefreshCw,
  Flame,
  Award,
} from 'lucide-react';

interface GatePassInsightsReportsTabProps {
  stats: any;
  passes: any[];
}

export default function GatePassInsightsReportsTab({ stats, passes }: GatePassInsightsReportsTabProps) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditRoleFilter, setAuditRoleFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'METRICS' | 'AUDIT'>('METRICS');

  useEffect(() => {
    fetchAuditLogs();
  }, [auditRoleFilter]);

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const q = new URLSearchParams();
      if (auditRoleFilter !== 'ALL') q.set('role', auditRoleFilter);
      if (auditSearch.trim()) q.set('search', auditSearch.trim());
      const res = await fetch(`/api/passes/audit-logs?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  const exportFullReportCSV = () => {
    const headers = ['Pass ID', 'Student Name', 'Roll Number', 'Hostel', 'Pass Type', 'Destination', 'Status', 'Applied Date'];
    const rows = passes.map((p) => [
      p.passNumber,
      `"${p.residentName}"`,
      p.rollNo,
      `"${p.blockName}"`,
      p.passType,
      `"${p.destination}"`,
      p.status,
      new Date(p.validFrom).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gate_pass_comprehensive_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hostelBreakdown = stats?.hostelBreakdown || { 'Nilgiri Block A': 5, 'Shivalik Block B': 2 };
  const reasonBreakdown = stats?.reasonBreakdown || { Market: 4, Coaching: 3, Medical: 2 };
  const trendDaily = stats?.trendDaily || { '10-06': 12, '10-07': 18, '10-08': 24 };

  return (
    <div className="space-y-6">
      {/* View Switcher & Export Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubView('METRICS')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeSubView === 'METRICS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analytics & Performance
          </button>

          <button
            onClick={() => setActiveSubView('AUDIT')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeSubView === 'AUDIT'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Immutable Audit Trail
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={printReport}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>
          <button
            onClick={exportFullReportCSV}
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Excel / CSV
          </button>
        </div>
      </div>

      {activeSubView === 'METRICS' ? (
        <div className="space-y-6">
          {/* Top Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Approval Turnaround</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">22 mins</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Faster than 94% SLA target</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejection Ratio</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {stats?.rejected ? `${Math.round((stats.rejected / (stats.totalCount || 1)) * 100)}%` : '4.2%'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Mainly missing parental note</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Time Return Rate</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">96.8%</div>
              <p className="text-[11px] text-slate-500 mt-1">Past curfew violations: {stats?.overdue ?? 3}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Warden Workload Index</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1">Optimal</div>
              <p className="text-[11px] text-slate-500 mt-1">Distributed across 4 hostels</p>
            </div>
          </div>

          {/* Breakdown Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hostel Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" /> Hostel-wise Leave Volume & Peaks
              </h3>
              <div className="space-y-3">
                {Object.entries(hostelBreakdown).map(([hostel, count]) => (
                  <div key={hostel} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{hostel}</span>
                      <span className="font-mono text-slate-900 font-bold">{count as number} passes</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, Number(count) * 20)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Reasons Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Common Exit Reasons & Destinations
              </h3>
              <div className="space-y-3">
                {Object.entries(reasonBreakdown).map(([reason, count]) => (
                  <div key={reason} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{reason}</span>
                      <span className="font-mono text-slate-900 font-bold">{count as number} passes</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Number(count) * 25)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Trail View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Pass Security & Decision Audit Logs</h3>
              <p className="text-xs text-slate-500">Every submission, approval, override, and scan with actor credentials</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={auditRoleFilter}
                onChange={(e) => setAuditRoleFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="CAMPUS_ADMIN">Admin Overrides Only</option>
                <option value="WARDEN">Warden Actions</option>
                <option value="STUDENT">Student Requests</option>
              </select>

              <button
                onClick={fetchAuditLogs}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {loadingAudit && auditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading audit log entries...</div>
            ) : auditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No audit log records found.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          log.actorRole === 'CAMPUS_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {log.actorRole}
                      </span>
                      <span className="text-slate-600 font-medium">by {log.actorName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Entity ID: {log.entityId} • {JSON.stringify(log.details)}
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
