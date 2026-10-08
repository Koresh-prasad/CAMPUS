'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  RefreshCw,
  QrCode,
  ShieldAlert,
  ArrowUpDown,
  Download,
} from 'lucide-react';

interface GatePassRequestsTabProps {
  passes: any[];
  totalPasses: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filters: {
    status: string;
    passType: string;
    hostel: string;
    search: string;
    fromDate: string;
    toDate: string;
  };
  onFilterChange: (filters: any) => void;
  onSelectPass: (pass: any) => void;
  loading: boolean;
  onRefresh: () => void;
}

export default function GatePassRequestsTab({
  passes,
  totalPasses,
  currentPage,
  totalPages,
  onPageChange,
  filters,
  onFilterChange,
  onSelectPass,
  loading,
  onRefresh,
}: GatePassRequestsTabProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue || status === 'OVERDUE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-orange-600" /> Overdue
        </span>
      );
    }
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Submitted
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span> Out of Campus
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <CheckCircle2 className="w-3 h-3 text-slate-500" /> Returned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const exportCSV = () => {
    if (!passes.length) return;
    const headers = ['Pass #', 'Student', 'Roll No', 'Room', 'Hostel', 'Type', 'Destination', 'Status', 'Valid From', 'Valid Till'];
    const rows = passes.map((p) => [
      p.passNumber,
      `"${p.residentName}"`,
      p.rollNo,
      p.roomNumber,
      `"${p.blockName}"`,
      p.passType,
      `"${p.destination}"`,
      p.status,
      new Date(p.validFrom).toLocaleDateString(),
      new Date(p.validTill).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gate_passes_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, pass number, or destination..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending (Submitted)</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Out Now (Active)</option>
              <option value="RETURNED">Returned</option>
              <option value="OVERDUE">Overdue</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={filters.passType}
              onChange={(e) => onFilterChange({ ...filters, passType: e.target.value })}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Pass Types</option>
              <option value="DAY_OUTING">Day Outing</option>
              <option value="NIGHT_OUT">Night Out</option>
              <option value="WEEKEND">Weekend Outing</option>
              <option value="HOME_LEAVE">Home Leave</option>
              <option value="MEDICAL_LEAVE">Medical Leave</option>
              <option value="EMERGENCY_LEAVE">Emergency Leave</option>
              <option value="ACADEMIC_LEAVE">Academic / Duty Leave</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 text-xs rounded-xl border font-medium flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>

            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={exportCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters (Hostel, Date Range) */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Hostel / Block</label>
              <select
                value={filters.hostel}
                onChange={(e) => onFilterChange({ ...filters, hostel: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="ALL">All Hostels</option>
                <option value="Nilgiri">Nilgiri Block A (Boys)</option>
                <option value="Shivalik">Shivalik Block B (Girls)</option>
                <option value="Aravali">Aravali Block C (Senior)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">From Date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange({ ...filters, fromDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">To Date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange({ ...filters, toDate: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Requests Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Pass Code / Token</th>
                <th className="py-3.5 px-4">Student Dossier</th>
                <th className="py-3.5 px-4">Hostel & Room</th>
                <th className="py-3.5 px-4">Pass Type</th>
                <th className="py-3.5 px-4">Destination & Reason</th>
                <th className="py-3.5 px-4">Validity Range</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && passes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading requests from campus database...
                  </td>
                </tr>
              ) : passes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No gate passes match the applied filters.
                  </td>
                </tr>
              ) : (
                passes.map((pass) => (
                  <tr
                    key={pass.id}
                    onClick={() => onSelectPass(pass)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800 text-xs flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        {pass.passNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Applied {new Date(pass.validFrom).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{pass.residentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>{pass.rollNo}</span>
                        <span>•</span>
                        <span>{pass.branch || 'B.Tech'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 flex items-center gap-1">
                        <Building className="w-3 h-3 text-slate-400" />
                        {pass.roomNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">{pass.blockName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {pass.passType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate">{pass.destination}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{pass.reason}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-700 font-mono text-[11px]">
                        {new Date(pass.validFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(pass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(pass.validTill).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(pass.status, pass.isOverdue)}
                      {pass.overriddenByAdmin && (
                        <div className="text-[9px] font-bold text-purple-600 mt-0.5 uppercase">Admin Override</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPass(pass);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footbar */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{passes.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalPasses}</span> total requests
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
