'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  TrendingUp,
  BarChart2,
  ArrowDownToLine,
  Printer,
  Sparkles,
} from 'lucide-react';

export interface ReportRecord {
  id: string;
  category:
    | 'Student Requests'
    | 'Maintenance Complaints'
    | 'Electricity Problems'
    | 'Plumbing Problems'
    | 'Cleaning Requests'
    | 'Wi-Fi Complaints'
    | 'Room Repairs'
    | 'Gate Pass Activity'
    | 'Entry/Exit Records'
    | 'Medical Requests'
    | 'SOS Incidents'
    | 'SLA Performance';
  department: string;
  title: string;
  referenceId: string;
  date: string;
  status: 'Completed' | 'Pending' | 'SLA Breached' | 'In Progress';
  responseTime: string;
  handledBy: string;
}

export const INITIAL_REPORT_RECORDS: ReportRecord[] = [
  {
    id: 'rep-1',
    category: 'Electricity Problems',
    department: 'Electrical Team',
    title: 'Substation Transformer Phase Voltage Fluctuations',
    referenceId: 'SR-2026-1041',
    date: '08 Oct 2026',
    status: 'Completed',
    responseTime: '1h 20m (Target 2h)',
    handledBy: 'Er. Dilip Das',
  },
  {
    id: 'rep-2',
    category: 'Plumbing Problems',
    department: 'Plumbing Team',
    title: 'Nilgiri Hostel Block A Overhead Tank Float Valve Overflow',
    referenceId: 'SR-2026-1042',
    date: '08 Oct 2026',
    status: 'Completed',
    responseTime: '45m (Target 1h)',
    handledBy: 'Mahendra Singh',
  },
  {
    id: 'rep-3',
    category: 'Wi-Fi Complaints',
    department: 'IT / Network Team',
    title: 'Boys Hostel 3rd Floor Access Point AP-104 Packet Loss',
    referenceId: 'SR-2026-1045',
    date: '07 Oct 2026',
    status: 'Completed',
    responseTime: '2h 15m (Target 4h)',
    handledBy: 'Suresh Kumar',
  },
  {
    id: 'rep-4',
    category: 'SLA Performance',
    department: 'All Departments',
    title: 'Monthly SLA Compliance Benchmark Audit',
    referenceId: 'AUD-SLA-09',
    date: '06 Oct 2026',
    status: 'Completed',
    responseTime: '94.2% within SLA',
    handledBy: 'Admin Operations Desk',
  },
  {
    id: 'rep-5',
    category: 'Gate Pass Activity',
    department: 'Security & Wardens',
    title: 'Weekend Outing & Home Visit Passes Verification',
    referenceId: 'GP-BATCH-42',
    date: '05 Oct 2026',
    status: 'Completed',
    responseTime: '34 Passes Cleared',
    handledBy: 'Security Turnstile Desk',
  },
  {
    id: 'rep-6',
    category: 'Medical Requests',
    department: 'Health Center',
    title: 'Seasonal Heat Exhaustion & Dehydration Consultations',
    referenceId: 'MED-TKG-08',
    date: '08 Oct 2026',
    status: 'Completed',
    responseTime: '15m Triage Response',
    handledBy: 'Dr. S. Mohapatra',
  },
  {
    id: 'rep-7',
    category: 'SOS Incidents',
    department: 'Security & Emergency',
    title: 'Hostel Lift Inverter Alarm Verification Drill',
    referenceId: 'EM-LOG-03',
    date: '04 Oct 2026',
    status: 'Completed',
    responseTime: '3m Rapid Response',
    handledBy: 'Campus Response Team',
  },
  {
    id: 'rep-8',
    category: 'Cleaning Requests',
    department: 'Cleaning Team',
    title: 'Sanitization and Washroom Deep Clean in Shivalik Block B',
    referenceId: 'SR-2026-1050',
    date: '08 Oct 2026',
    status: 'In Progress',
    responseTime: 'Started at 09:30 AM',
    handledBy: 'Sita Majhi',
  },
];

export function AdminReportsAnalyticsView() {
  const [records, setRecords] = useState<ReportRecord[]>(INITIAL_REPORT_RECORDS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('THIS_MONTH');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  const filteredRecords = records.filter((r) => {
    const matchCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.referenceId.toLowerCase().includes(search.toLowerCase()) ||
      r.department.toLowerCase().includes(search.toLowerCase()) ||
      r.handledBy.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleExport = (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    setExportNotice(`Preparing ${format} audit export of ${filteredRecords.length} records...`);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice(`✓ Successfully generated and downloaded CampusHelper_Report_${format}_${Date.now()}.${format.toLowerCase()}`);
      setTimeout(() => setExportNotice(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
              Operations Intelligence
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Audit Traceability Active</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Campus Operations & SLA Performance Reports</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Cross-departmental audit logs across maintenance, gate passes, medical cases, Wi-Fi, and emergency alerts.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => handleExport('CSV')}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center space-x-1.5 border border-slate-700 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
          {exportNotice}
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">SLA Compliance</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">94.2%</h3>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Target: &gt;90% across campus</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Tickets Handled</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">1,248</h3>
          <p className="text-[10px] text-blue-600 font-medium mt-0.5">Academic Year 2026</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Avg Response Time</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">42 mins</h3>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">↓ 14% improvement</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Gate Pass Volume</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">482</h3>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">100% QR scanned at gates</p>
        </div>
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports by title, ticket ID, team, or staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Report Domains</option>
              <option value="Student Requests">Student Requests</option>
              <option value="Maintenance Complaints">Maintenance Complaints</option>
              <option value="Electricity Problems">Electricity Problems</option>
              <option value="Plumbing Problems">Plumbing Problems</option>
              <option value="Cleaning Requests">Cleaning Requests</option>
              <option value="Wi-Fi Complaints">Wi-Fi Complaints</option>
              <option value="Room Repairs">Room Repairs</option>
              <option value="Gate Pass Activity">Gate Pass Activity</option>
              <option value="Entry/Exit Records">Entry/Exit Records</option>
              <option value="Medical Requests">Medical Requests</option>
              <option value="SOS Incidents">SOS Incidents</option>
              <option value="SLA Performance">SLA Performance</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="SLA Breached">SLA Breached</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="TODAY">Today</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
              <option value="SEMESTER">Full Semester</option>
            </select>
          </div>
        </div>

        {/* Table of Report Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Domain Category</th>
                <th className="py-3 px-4">Operation Summary</th>
                <th className="py-3 px-4">Department / Staff</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">SLA / Speed</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.referenceId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{item.title}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <strong className="block text-slate-800">{item.department}</strong>
                    <span className="text-[10px] text-slate-400">{item.handledBy}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{item.responseTime}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default AdminReportsAnalyticsView;
