'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  Search,
  Filter,
  Calendar,
  Building,
  GraduationCap,
  Users,
  Shield,
  Heart,
  Wrench,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';

type ReportDomain =
  | 'ALL'
  | 'STUDENTS'
  | 'HOSTEL'
  | 'LEAVE_GATE'
  | 'SECURITY'
  | 'SERVICES'
  | 'COMPLAINTS'
  | 'MEDICAL'
  | 'EMERGENCY'
  | 'STAFF';

export default function AdminCentralizedReportsView() {
  const [selectedDomain, setSelectedDomain] = useState<ReportDomain>('ALL');
  const [dateRange, setDateRange] = useState('THIS_MONTH');
  const [searchQuery, setSearchQuery] = useState('');
  const [hostelFilter, setHostelFilter] = useState('ALL');
  const [isExporting, setIsExporting] = useState(false);

  const domainTabs = [
    { id: 'ALL', label: 'Consolidated Overview', icon: TrendingUp },
    { id: 'STUDENTS', label: 'Students', icon: GraduationCap },
    { id: 'HOSTEL', label: 'Hostel & Occupancy', icon: Building },
    { id: 'LEAVE_GATE', label: 'Leave & Gate Movement', icon: FileText },
    { id: 'SECURITY', label: 'Security & Visitors', icon: Shield },
    { id: 'SERVICES', label: 'Services & Maintenance', icon: Wrench },
    { id: 'COMPLAINTS', label: 'Complaints & SLA', icon: AlertTriangle },
    { id: 'MEDICAL', label: 'Medical Operations', icon: Heart },
    { id: 'EMERGENCY', label: 'Emergency & SOS', icon: ShieldAlert },
    { id: 'STAFF', label: 'Staff Performance', icon: Users },
  ];

  // Report records data
  const reportData = [
    // Students
    { id: 'RPT-STD-01', domain: 'STUDENTS', title: 'Student Enrollment by Department', metric: '2,450 Total Enrolled', detail: 'CSE: 840, ECE: 385, ME: 420, CE: 360, EE: 445', date: '2025-09-30', status: 'VERIFIED' },
    { id: 'RPT-STD-02', domain: 'STUDENTS', title: 'Student Presence & In-Campus Audit', metric: '94.2% On Campus', detail: 'Inside: 2,308 | Permitted Out: 130 | Overdue: 12', date: '2025-09-30', status: 'VERIFIED' },
    // Hostel
    { id: 'RPT-HST-01', domain: 'HOSTEL', title: 'Hostel Bed Occupancy Ledger', metric: '78.3% Total Occupancy', detail: '1,237 Occupied Beds / 1,580 Total Capacity', date: '2025-09-30', status: 'VERIFIED' },
    { id: 'RPT-HST-02', domain: 'HOSTEL', title: 'Vacant Bed Allotment Availability', metric: '343 Vacant Beds', detail: 'Nilgiri A: 180 beds, Shivalik B: 140 beds, Aravali: 23 beds', date: '2025-09-30', status: 'UPDATED' },
    // Leave & Gate
    { id: 'RPT-LVG-01', domain: 'LEAVE_GATE', title: 'Daily Gate Outing & Leave Approvals', metric: '142 Passes Issued', detail: 'Day Passes: 98, Weekend Leaves: 38, Emergency Out: 6', date: '2025-09-29', status: 'COMPLETED' },
    { id: 'RPT-LVG-02', domain: 'LEAVE_GATE', title: 'Curfew Adherence & Overdue Returns', metric: '99.1% On-Time Return', detail: '3 Overdue returns logged and reported to Wardens', date: '2025-09-29', status: 'FLAGGED' },
    // Security
    { id: 'RPT-SEC-01', domain: 'SECURITY', title: 'Main Turnstiles Entry & Exit Volume', metric: '1,894 Total Scans', detail: 'Main Gate 1: 1,420 scans, Gate 2 (Library): 474 scans', date: '2025-09-30', status: 'VERIFIED' },
    { id: 'RPT-SEC-02', domain: 'SECURITY', title: 'Visitor Registrations & Deliveries', metric: '38 Visitors Logged', detail: 'Parents: 22, Vendor deliveries: 12, Official guests: 4', date: '2025-09-30', status: 'COMPLETED' },
    // Services
    { id: 'RPT-SRV-01', domain: 'SERVICES', title: 'Hostel Maintenance Tickets Resolution', metric: '92.4% Resolved On-Time', detail: '38 orders closed, Avg Resolution Time: 2.8 hrs', date: '2025-09-28', status: 'EXCELLENT' },
    { id: 'RPT-SRV-02', domain: 'SERVICES', title: 'Plumbing & Electrical Inventory Consumption', metric: '64 Parts Issued', detail: 'LED tubes: 24, Taps: 12, Wi-Fi cables: 8, Misc: 20', date: '2025-09-27', status: 'COMPLETED' },
    // Complaints
    { id: 'RPT-CMP-01', domain: 'COMPLAINTS', title: 'Student Grievances Ageing & SLA Report', metric: '96.8% SLA Adherence', detail: 'Resolved in <24h: 88%, Resolved in <48h: 12%', date: '2025-09-30', status: 'VERIFIED' },
    { id: 'RPT-CMP-02', domain: 'COMPLAINTS', title: 'Recurring Facility Issues Analysis', metric: 'Top Issue: Wi-Fi Access', detail: 'Corridor 2B router firmware upgraded to resolve packet drop', date: '2025-09-25', status: 'RESOLVED' },
    // Medical
    { id: 'RPT-MED-01', domain: 'MEDICAL', title: 'Campus Health Center Consultations', metric: '48 OPD Visits', detail: 'General ailments: 34, First-aid sports: 10, Dental referral: 4', date: '2025-09-30', status: 'COMPLETED' },
    { id: 'RPT-MED-02', domain: 'MEDICAL', title: 'Medical Leave Certificates Issued', metric: '6 Certified Leaves', detail: 'All certified leaves synced with Warden Leave Desk', date: '2025-09-29', status: 'VERIFIED' },
    // Emergency
    { id: 'RPT-EMG-01', domain: 'EMERGENCY', title: 'Emergency SOS Response Performance', metric: '100% Rapid Response', detail: '1 SOS trigger this month (sprain), security arrived in 2.2 min', date: '2025-09-21', status: 'RESOLVED' },
    // Staff
    { id: 'RPT-STF-01', domain: 'STAFF', title: 'Warden & Security Staff Attendance', metric: '98.5% On Duty', detail: '6 Wardens, 18 Security Guards, 4 Medical Officers', date: '2025-09-30', status: 'ACTIVE' },
  ];

  const filteredReports = reportData.filter((r) => {
    const matchDomain = selectedDomain === 'ALL' || r.domain === selectedDomain;
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDomain && matchSearch;
  });

  // Export CSV Functionality
  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const headers = ['Report ID', 'Domain', 'Report Title', 'Key Metric', 'Details & Breakdown', 'Date Generated', 'Status'];
      const rows = filteredReports.map((r) => [
        r.id,
        r.domain,
        `"${r.title.replace(/"/g, '""')}"`,
        `"${r.metric.replace(/"/g, '""')}"`,
        `"${r.detail.replace(/"/g, '""')}"`,
        r.date,
        r.status,
      ]);

      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `CampusHelper_Report_${selectedDomain}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export CSV error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Print PDF Functionality
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              Centralized Reports & Campus Intelligence
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Institutional analytics, NAAC audit metrics, security movement logs, and operational reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-blue-500/25 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report / PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Domain Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-1 overflow-x-auto scrollbar-thin">
        {domainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id as ReportDomain)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Filter & Date Range Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by report title, metrics, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="TODAY">Today (Live 24h)</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="THIS_MONTH">This Month (September 2025)</option>
            <option value="SEMESTER">Academic Term (Autumn 2025)</option>
            <option value="ANNUAL">Annual Accreditation Period (2024-25)</option>
          </select>

          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Hostels & Blocks</option>
            <option value="NILGIRI">Nilgiri Block A</option>
            <option value="SHIVALIK">Shivalik Block B</option>
            <option value="ARAVALI">Aravali Residence</option>
          </select>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-slate-800">{filteredReports.length}</strong> reports
        </p>
      </div>

      {/* 4. Domain KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hostel Capacity Utilization</p>
          <h4 className="text-2xl font-black text-blue-600">78.3%</h4>
          <p className="text-[11px] text-slate-500">1,237 / 1,580 Beds Allocated</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Grievance SLA Compliance</p>
          <h4 className="text-2xl font-black text-emerald-600">96.8%</h4>
          <p className="text-[11px] text-slate-500">Avg Resolution: 2.8 hrs</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gate Curfew Adherence</p>
          <h4 className="text-2xl font-black text-slate-900">99.1%</h4>
          <p className="text-[11px] text-slate-500">Only 3 overdue alerts this term</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campus Safety Index</p>
          <h4 className="text-2xl font-black text-purple-600">100%</h4>
          <p className="text-[11px] text-slate-500">Zero active emergency alerts</p>
        </div>
      </div>

      {/* 5. Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Generated Institutional Reports Ledger
          </h4>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Autonomous Audit Certified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Report Identifier</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4">Report Title</th>
                <th className="py-3.5 px-4">Primary Metric</th>
                <th className="py-3.5 px-4">Summary & Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{r.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                      {r.domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.title}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-600">{r.metric}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{r.detail}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">{r.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'VERIFIED' || r.status === 'COMPLETED' || r.status === 'EXCELLENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : r.status === 'FLAGGED'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Viewing full breakdown for report ${r.id}: ${r.title}\n\n${r.detail}`)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      View Full
                    </button>
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
