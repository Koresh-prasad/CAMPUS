'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Send,
  Building,
  Calendar,
  Flame,
  Search,
  Users,
  Compass,
  FileText,
  BellRing,
} from 'lucide-react';

interface GatePassOverviewTabProps {
  stats: any;
  liveWhosOut: any[];
  pendingPasses: any[];
  onSelectPass: (pass: any) => void;
  onQuickApprove: (id: string) => Promise<void>;
  onQuickReject: (id: string) => Promise<void>;
  onSendReminder: (id: string) => Promise<void>;
  onSwitchTab: (tabKey: string) => void;
  onOpenHelpdesk: () => void;
}

export default function GatePassOverviewTab({
  stats,
  liveWhosOut,
  pendingPasses,
  onSelectPass,
  onQuickApprove,
  onQuickReject,
  onSendReminder,
  onSwitchTab,
  onOpenHelpdesk,
}: GatePassOverviewTabProps) {
  const [whoOutSearch, setWhoOutSearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredWhosOut = liveWhosOut.filter((item) => {
    if (!whoOutSearch.trim()) return true;
    const q = whoOutSearch.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(q) ||
      item.rollNo?.toLowerCase().includes(q) ||
      item.destination?.toLowerCase().includes(q) ||
      item.roomNumber?.toLowerCase().includes(q)
    );
  });

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await onQuickApprove(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await onQuickReject(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReminder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await onSendReminder(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Small chart calculations
  const hostelBreakdown: Record<string, any> = stats?.hostelBreakdown || { 'Nilgiri (Block A)': 4, 'Shivalik (Block B)': 2 };
  const totalHostelPasses: number = Number(Object.values(hostelBreakdown).reduce((acc: number, curr: any) => acc + Number(curr || 0), 0)) || 1;

  const reasonBreakdown: Record<string, any> = stats?.reasonBreakdown || { Coaching: 3, Medical: 2, Market: 4, Personal: 1 };
  const totalReasonPasses: number = Number(Object.values(reasonBreakdown).reduce((acc: number, curr: any) => acc + Number(curr || 0), 0)) || 1;

  const trendDaily = stats?.trendDaily || { '10-06': 12, '10-07': 18, '10-08': 24 };
  const maxTrend = Math.max(...Object.values(trendDaily).map((v) => Number(v)), 1);

  return (
    <div className="space-y-6">
      {/* 6 Key KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onSwitchTab('REQUESTS')}
          className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-amber-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats?.pending ?? 0}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Requires Review
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('REQUESTS')}
          className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-emerald-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Approved Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats?.approvedToday ?? 0}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Processed today</div>
        </div>

        <div
          onClick={() => onSwitchTab('REQUESTS')}
          className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-rose-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-700 tracking-wide uppercase">Rejected</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats?.rejected ?? 0}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">With recorded reason</div>
        </div>

        <div
          onClick={() => onSwitchTab('GATE_TRACKING')}
          className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">Out Now</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">{stats?.outNow ?? liveWhosOut.length}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Beyond campus gates</div>
        </div>

        <div
          onClick={() => onSwitchTab('GATE_TRACKING')}
          className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-orange-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-orange-700 tracking-wide uppercase">Overdue</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats?.overdue ?? 0}</div>
          <div className="text-[11px] text-orange-600 font-medium mt-1 flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500 animate-bounce" /> Past return cutoff
          </div>
        </div>

        <div
          onClick={() => onSwitchTab('APPROVALS_OVERRIDES')}
          className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-purple-400"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-700 tracking-wide uppercase">Emergency</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-700">{stats?.emergencyCount ?? 0}</div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">High priority queue</div>
        </div>
      </div>

      {/* Main Grid: Pending Action Center & Live Who's Out Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Urgent Pending Queue & Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                <h3 className="font-semibold text-slate-800 text-sm">Pending Approval Queue</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingPasses.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenHelpdesk}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Help-Desk Mode
                </button>
                <button
                  onClick={() => onSwitchTab('REQUESTS')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {pendingPasses.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Inbox Zero!</p>
                  <p className="text-xs text-slate-400 mt-1">All gate pass & leave requests have been resolved.</p>
                </div>
              ) : (
                pendingPasses.slice(0, 5).map((pass) => (
                  <div
                    key={pass.id}
                    onClick={() => onSelectPass(pass)}
                    className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{pass.residentName || pass.studentName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                          {pass.rollNo}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {pass.passType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" /> {pass.roomNumber} ({pass.blockName})
                        </span>
                        <span className="flex items-center gap-1">
                          <Compass className="w-3 h-3 text-slate-400" /> {pass.destination}
                        </span>
                        <span className="text-slate-400">Reason: {pass.reason}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        disabled={actionLoadingId === pass.id}
                        onClick={(e) => handleApprove(pass.id, e)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={actionLoadingId === pass.id}
                        onClick={(e) => handleReject(pass.id, e)}
                        className="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mini Analytics Widgets: Passes per Day, Hostel, Reason */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Daily Passes Bar Chart */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Passes / Day</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="h-24 flex items-end gap-2 pt-2 border-b border-slate-100">
                {Object.entries(trendDaily).map(([day, count]) => {
                  const heightPercent = Math.max(15, Math.round((Number(count) / maxTrend) * 100));
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        {count as number}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-indigo-500 group-hover:bg-indigo-600 rounded-t-md transition-all"
                      ></div>
                      <span className="text-[10px] text-slate-500 font-mono">{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-[11px] text-slate-400 mt-2 text-center">Peak volume on weekends</div>
            </div>

            {/* Passes by Hostel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">By Hostel</span>
                <Building className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="space-y-2">
                {Object.entries(hostelBreakdown).slice(0, 3).map(([hostel, count]) => {
                  const pct = Math.round((Number(count) / totalHostelPasses) * 100);
                  return (
                    <div key={hostel} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium truncate max-w-[120px]">{hostel}</span>
                        <span className="text-slate-900 font-bold font-mono">{count as number} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passes by Reason */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Top Reasons</span>
                <FileText className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="space-y-2">
                {Object.entries(reasonBreakdown).slice(0, 3).map(([reason, count]) => {
                  const pct = Math.round((Number(count) / totalReasonPasses) * 100);
                  return (
                    <div key={reason} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 font-medium truncate max-w-[110px]">{reason}</span>
                        <span className="text-slate-900 font-bold font-mono">{count as number}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live "Who is out now" Board */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
                  <h3 className="font-semibold text-slate-800 text-sm">Live Who's Out Board</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {liveWhosOut.length} Out
                </span>
              </div>
              <div className="relative mt-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search out students..."
                  value={whoOutSearch}
                  onChange={(e) => setWhoOutSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-3 divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {filteredWhosOut.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Compass className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium">No students currently flagged outside campus.</p>
                </div>
              ) : (
                filteredWhosOut.map((item) => (
                  <div
                    key={item.residentId || item.passId}
                    className={`p-3 rounded-xl transition-all ${
                      item.isOverdue ? 'bg-orange-50/60 border border-orange-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                          {item.studentName}
                          {item.isOverdue && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                              OVERDUE (+{item.minutesOverdue}m)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {item.rollNo} • Room {item.roomNumber}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-slate-400" /> {item.destination}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[11px] font-mono text-slate-500">
                          Out: {item.minutesOut} mins ago
                        </span>
                        {item.isOverdue ? (
                          <button
                            disabled={actionLoadingId === item.passId}
                            onClick={(e) => handleReminder(item.passId, e)}
                            className="px-2 py-1 text-[11px] font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <BellRing className="w-3 h-3" /> Remind
                          </button>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                            Valid till {new Date(item.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => onSwitchTab('GATE_TRACKING')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
              >
                Open Full Turnstile & Overdue Escalation Ladder <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
