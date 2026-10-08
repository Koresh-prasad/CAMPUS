'use client';

import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  UserCheck,
  Stethoscope,
  Briefcase,
  Share2,
  AlertCircle,
  ExternalLink,
  Search,
} from 'lucide-react';

interface GatePassLeaveManagementTabProps {
  passes: any[];
  onSelectPass: (pass: any) => void;
  onLinkAttendance: (id: string, dutyType: string) => Promise<void>;
  onApprove: (id: string, notes?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export default function GatePassLeaveManagementTab({
  passes,
  onSelectPass,
  onLinkAttendance,
  onApprove,
  onReject,
}: GatePassLeaveManagementTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'MEDICAL' | 'HOME' | 'ACADEMIC'>('ALL');
  const [linkingId, setLinkingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Leaves are passes of type HOME_LEAVE, MEDICAL_LEAVE, ACADEMIC_LEAVE, EMERGENCY_LEAVE or LEAVE
  const leavePasses = passes.filter((p) => {
    const isLeave =
      p.passType === 'HOME_LEAVE' ||
      p.passType === 'MEDICAL_LEAVE' ||
      p.passType === 'ACADEMIC_LEAVE' ||
      p.passType === 'EMERGENCY_LEAVE' ||
      p.passType === 'LEAVE';

    if (!isLeave) return false;

    if (selectedCategory === 'MEDICAL' && p.passType !== 'MEDICAL_LEAVE') return false;
    if (selectedCategory === 'HOME' && p.passType !== 'HOME_LEAVE') return false;
    if (selectedCategory === 'ACADEMIC' && p.passType !== 'ACADEMIC_LEAVE') return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.residentName?.toLowerCase().includes(q) ||
      p.rollNo?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q) ||
      p.reason?.toLowerCase().includes(q)
    );
  });

  const handleLink = async (id: string, dutyType: string) => {
    setLinkingId(id);
    try {
      await onLinkAttendance(id, dutyType);
    } finally {
      setLinkingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Extended Leaves
          </button>
          <button
            onClick={() => setSelectedCategory('MEDICAL')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === 'MEDICAL'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> Medical Leaves
          </button>
          <button
            onClick={() => setSelectedCategory('HOME')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === 'HOME'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Home Leaves
          </button>
          <button
            onClick={() => setSelectedCategory('ACADEMIC')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              selectedCategory === 'ACADEMIC'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Academic / Duty
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leaves..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Leave Requests Master Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leavePasses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No Leave Requests</p>
            <p className="text-xs text-slate-400 mt-1">No extended leave requests recorded under this filter.</p>
          </div>
        ) : (
          leavePasses.map((leave) => {
            const daysDiff = Math.max(
              1,
              Math.ceil(
                (new Date(leave.validTill).getTime() - new Date(leave.validFrom).getTime()) /
                  (1000 * 3600 * 24)
              )
            );

            return (
              <div
                key={leave.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{leave.residentName}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {leave.rollNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {leave.branch || 'B.Tech'} • Room {leave.roomNumber} ({leave.blockName})
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {leave.passType} ({daysDiff} {daysDiff === 1 ? 'day' : 'days'})
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Duration:</span>
                    <span className="font-mono">
                      {new Date(leave.validFrom).toLocaleDateString()} → {new Date(leave.validTill).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span className="font-semibold">Destination:</span>
                    <span>{leave.destination}</span>
                  </div>

                  <div className="text-slate-600">
                    <span className="font-semibold">Reason:</span> {leave.reason}
                  </div>

                  {/* Faculty & Academic Status */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Faculty Advisor Rec:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {leave.facultyRecommendation || 'Recommended'}
                    </span>
                  </div>
                </div>

                {/* ERP Attendance Link & Quick Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <button
                    disabled={linkingId === leave.id}
                    onClick={() => handleLink(leave.id, 'ON_DUTY_ACADEMIC')}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    {linkingId === leave.id ? 'Syncing...' : 'Link to ERP Attendance'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {leave.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onApprove(leave.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(leave.id, 'Declined by Admin')}
                          className="px-3 py-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onSelectPass(leave)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Dossier
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
