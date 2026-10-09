'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import { playGatePassUniqueSound } from '../lib/audioSound';
import {
  LayoutDashboard,
  FileText,
  ShieldAlert,
  Settings,
  PhoneCall,
  Compass,
  CalendarDays,
  BarChart3,
  UserCheck,
  RefreshCw,
  BellRing,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

import GatePassOverviewTab from './gatepass/GatePassOverviewTab';
import GatePassRequestsTab from './gatepass/GatePassRequestsTab';
import GatePassApprovalsOverridesTab from './gatepass/GatePassApprovalsOverridesTab';
import GatePassTypesAndRulesTab from './gatepass/GatePassTypesAndRulesTab';
import GatePassGuardianVerificationTab from './gatepass/GatePassGuardianVerificationTab';
import GatePassGateTrackingOverdueTab from './gatepass/GatePassGateTrackingOverdueTab';
import GatePassLeaveManagementTab from './gatepass/GatePassLeaveManagementTab';
import GatePassInsightsReportsTab from './gatepass/GatePassInsightsReportsTab';
import GatePassDetailDrawer from './gatepass/GatePassDetailDrawer';
import GatePassHelpdeskModal from './gatepass/GatePassHelpdeskModal';

interface HostelLeaveGatePassProps {
  activeSubTab?: string;
  setActiveSubTab?: (tab: string) => void;
  externalPasses?: any[];
}

export type GatePassModuleTab =
  | 'OVERVIEW'
  | 'REQUESTS'
  | 'APPROVALS_OVERRIDES'
  | 'PASS_TYPES_RULES'
  | 'GUARDIAN_VERIFICATION'
  | 'GATE_TRACKING'
  | 'LEAVE_MANAGEMENT'
  | 'INSIGHTS_REPORTS';

export default function HostelLeaveGatePassView({
  activeSubTab,
  setActiveSubTab,
  externalPasses,
}: HostelLeaveGatePassProps) {
  // Map legacy subTabs to new 8-tier module tabs
  const mapLegacyTab = (tab?: string): GatePassModuleTab => {
    if (!tab) return 'OVERVIEW';
    const t = tab.toUpperCase();
    if (t.includes('PENDING') || t.includes('WARDEN') || t.includes('OVERRIDE')) return 'APPROVALS_OVERRIDES';
    if (t.includes('GATE PASS') || t.includes('REQUEST') || t.includes('APPROVED') || t.includes('REJECTED')) return 'REQUESTS';
    if (t.includes('SECURITY') || t.includes('ENTRY') || t.includes('EXIT') || t.includes('TRACK')) return 'GATE_TRACKING';
    if (t.includes('GUARDIAN') || t.includes('VERIF')) return 'GUARDIAN_VERIFICATION';
    if (t.includes('LEAVE') || t.includes('MEDICAL')) return 'LEAVE_MANAGEMENT';
    if (t.includes('REPORT') || t.includes('INSIGHT') || t.includes('HISTORY')) return 'INSIGHTS_REPORTS';
    if (t.includes('RULE') || t.includes('TYPE')) return 'PASS_TYPES_RULES';
    return 'OVERVIEW';
  };

  const [currentTab, setCurrentTab] = useState<GatePassModuleTab>(mapLegacyTab(activeSubTab));

  // Sync with prop when external nav changes
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(mapLegacyTab(activeSubTab));
    }
  }, [activeSubTab]);

  const handleTabChange = (tab: GatePassModuleTab) => {
    setCurrentTab(tab);
    if (setActiveSubTab) {
      setActiveSubTab(tab);
    }
  };

  // Central Passes and Analytics State
  const [passes, setPasses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    pending: 0,
    approvedToday: 0,
    rejected: 0,
    outNow: 0,
    overdue: 0,
    emergencyCount: 0,
    hostelBreakdown: {},
    reasonBreakdown: {},
    trendDaily: {},
    totalCount: 0,
  });
  const [liveWhosOut, setLiveWhosOut] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination & Filtering for Requests Tab
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPassesCount, setTotalPassesCount] = useState(0);
  const [filters, setFilters] = useState({
    status: 'ALL',
    passType: 'ALL',
    hostel: 'ALL',
    search: '',
    fromDate: '',
    toDate: '',
  });

  // Drawer & Modal State
  const [selectedPass, setSelectedPass] = useState<any | null>(null);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);
  const [livePassToast, setLivePassToast] = useState<{
    id?: string;
    studentName?: string;
    roomNumber?: string;
    passType?: string;
    destination?: string;
  } | null>(null);

  // Sync external passes from parent dashboard
  useEffect(() => {
    if (externalPasses && externalPasses.length > 0) {
      setPasses((prev) => {
        const map = new Map<string, any>();
        prev.forEach((p) => map.set(p.id, p));
        externalPasses.forEach((p) => {
          if (p.id) {
            map.set(p.id, { ...map.get(p.id), ...p });
          }
        });
        return Array.from(map.values());
      });
    }
  }, [externalPasses]);

  // Fetch Stats and Live Whos Out
  const fetchOverviewData = useCallback(async () => {
    try {
      const [statsRes, whosOutRes] = await Promise.all([
        fetch('/api/passes/stats'),
        fetch('/api/passes/live-whos-out'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (whosOutRes.ok) {
        const outData = await whosOutRes.json();
        setLiveWhosOut(outData);
      }
    } catch (e) {
      console.error('Error fetching overview stats:', e);
    }
  }, []);

  // Fetch Passes with Filters & Pagination
  const fetchPasses = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(currentPage),
        limit: '20',
      });

      if (filters.status && filters.status !== 'ALL') queryParams.set('status', filters.status);
      if (filters.passType && filters.passType !== 'ALL') queryParams.set('passType', filters.passType);
      if (filters.hostel && filters.hostel !== 'ALL') queryParams.set('hostel', filters.hostel);
      if (filters.search.trim()) queryParams.set('search', filters.search.trim());
      if (filters.fromDate) queryParams.set('fromDate', filters.fromDate);
      if (filters.toDate) queryParams.set('toDate', filters.toDate);

      const res = await fetch(`/api/passes?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPasses(data.passes || []);
        setTotalPassesCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Error fetching passes:', e);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Initial and continuous 4-second live polling + WebSocket updates
  useEffect(() => {
    fetchOverviewData();
    fetchPasses();

    // 4-second auto-poll so admin always sees new passes in real-time
    const interval = setInterval(() => {
      fetchPasses();
      fetchOverviewData();
    }, 4000);

    // Socket.io for immediate push notifications
    const socketUrl = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
    let socket: any = null;
    try {
      socket = io(socketUrl, { transports: ['websocket', 'polling'] });
      
      const onPassIncoming = (data: any) => {
        console.log('⚡ Live pass event in HostelLeaveGatePassView:', data);
        playGatePassUniqueSound();
        setLivePassToast({
          id: data.passId || data.id,
          studentName: data.studentName || 'Student Resident',
          roomNumber: data.roomNumber || 'Hostel',
          passType: data.passType || 'Gate Pass',
          destination: data.destination || 'Campus Outing',
        });
        setTimeout(() => setLivePassToast(null), 6500);
        fetchPasses();
        fetchOverviewData();
      };

      socket.on('pass:requested', onPassIncoming);
      socket.on('pass:created', onPassIncoming);
      socket.on('pass:status_update', () => {
        fetchPasses();
        fetchOverviewData();
      });
      socket.on('pass:approved', () => {
        fetchPasses();
        fetchOverviewData();
      });
      socket.on('pass:rejected', () => {
        fetchPasses();
        fetchOverviewData();
      });
    } catch (err) {
      console.warn('Socket connection note in HostelLeaveGatePassView:', err);
    }

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.disconnect();
      }
    };
  }, [fetchPasses, fetchOverviewData]);

  // Core Actions connected to backend
  const handleApprove = async (id: string, notes?: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        fetchPasses();
        fetchOverviewData();
      } else {
        alert('Failed to approve request');
      }
    } catch (e) {
      alert('Error approving request');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        fetchPasses();
        fetchOverviewData();
      } else {
        alert('Failed to reject request');
      }
    } catch (e) {
      alert('Error rejecting request');
    }
  };

  const handleOverride = async (id: string, newStatus: string, reason: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus, overrideReason: reason }),
      });
      if (res.ok) {
        fetchPasses();
        fetchOverviewData();
      } else {
        alert('Failed to override pass status');
      }
    } catch (e) {
      alert('Error executing administrative override');
    }
  };

  const handleBulkAction = async (ids: string[], action: 'APPROVE' | 'REJECT' | 'CANCEL', reason?: string) => {
    try {
      const res = await fetch('/api/passes/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passIds: ids, action, reason }),
      });
      if (res.ok) {
        fetchPasses();
        fetchOverviewData();
      } else {
        alert('Failed to execute bulk action');
      }
    } catch (e) {
      alert('Error executing bulk action');
    }
  };

  const handleSendReminder = async (id: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Return reminder dispatched via SMS!');
      } else {
        alert('Failed to send reminder');
      }
    } catch (e) {
      alert('Error dispatching reminder');
    }
  };

  const handleReassignWarden = async (id: string, wardenName: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wardenName }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Pass reassigned successfully');
        fetchPasses();
      } else {
        alert('Failed to reassign pass');
      }
    } catch (e) {
      alert('Error reassigning pass');
    }
  };

  const handleVerifyGuardian = async (id: string, type: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/guardian-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardianStatus: `CONFIRMED_${type}`, autoApprove: false }),
      });
      if (res.ok) {
        fetchPasses();
        alert('Guardian consent recorded!');
      } else {
        alert('Failed to update guardian verification');
      }
    } catch (e) {
      alert('Error saving guardian verification');
    }
  };

  const handleLinkAttendance = async (id: string, dutyType: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/link-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dutyType, syncWithERP: true }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Attendance linked successfully!');
      } else {
        alert('Failed to link attendance');
      }
    } catch (e) {
      alert('Error connecting to ERP attendance');
    }
  };

  // Pending passes subset for quick actions
  const pendingPasses = passes.filter((p) => p.status === 'PENDING');

  const tabsConfig = [
    { id: 'OVERVIEW', label: '1. Overview', icon: LayoutDashboard },
    { id: 'REQUESTS', label: '2. Request Management', icon: FileText },
    { id: 'APPROVALS_OVERRIDES', label: '3. Approvals & Overrides', icon: ShieldAlert },
    { id: 'PASS_TYPES_RULES', label: '4. Rules & Curfew Engine', icon: Settings },
    { id: 'GUARDIAN_VERIFICATION', label: '5. Guardian Verification', icon: PhoneCall },
    { id: 'GATE_TRACKING', label: '6. Gate & Overdue Ladder', icon: Compass },
    { id: 'LEAVE_MANAGEMENT', label: '7. Leave & ERP Sync', icon: CalendarDays },
    { id: 'INSIGHTS_REPORTS', label: '8. Insights & Reports', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 relative">
      {/* Real-Time Live Pass Push Notification Toast */}
      {livePassToast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm w-full">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black text-lg shadow-md">
              🚪
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-amber-400 uppercase tracking-wider text-[10px]">
                  ⚡ Live Pass Applied
                </span>
                <button
                  type="button"
                  onClick={() => setLivePassToast(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-bold text-white text-sm mt-0.5">
                {livePassToast.studentName}
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {livePassToast.passType} • {livePassToast.roomNumber} • {livePassToast.destination}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                {livePassToast.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (livePassToast.id) handleApprove(livePassToast.id);
                      setLivePassToast(null);
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Now</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleTabChange('REQUESTS');
                    setLivePassToast(null);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg text-xs cursor-pointer"
                >
                  View Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Title & Global Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
              Hostel Administration
            </span>
            <span className="text-xs text-slate-400 font-mono">• Real-time Sync Active</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Hostel Leave &amp; Gate Pass Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Campus-wide gate pass issuance, automated guardian consent verification, live turnstile tracking, warden decision overrides, and curfew escalation ladder.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              fetchOverviewData();
              fetchPasses();
            }}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh All Pass Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsHelpdeskOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-indigo-200" />
            <span>Help-Desk Mode (Create On-Behalf)</span>
          </button>
        </div>
      </div>

      {/* 8-Tier Modern Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto border border-slate-200/80 shadow-inner">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as GatePassModuleTab)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      {currentTab === 'OVERVIEW' && (
        <GatePassOverviewTab
          stats={stats}
          liveWhosOut={liveWhosOut}
          pendingPasses={pendingPasses}
          onSelectPass={(p) => setSelectedPass(p)}
          onQuickApprove={(id) => handleApprove(id)}
          onQuickReject={(id) => handleReject(id, 'Declined by Admin')}
          onSendReminder={handleSendReminder}
          onSwitchTab={(tabKey) => handleTabChange(tabKey as GatePassModuleTab)}
          onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        />
      )}

      {currentTab === 'REQUESTS' && (
        <GatePassRequestsTab
          passes={passes}
          totalPasses={totalPassesCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onSelectPass={(p) => setSelectedPass(p)}
          onApprove={(id, notes) => handleApprove(id, notes)}
          onReject={(id, reason) => handleReject(id, reason)}
          loading={loading}
          onRefresh={() => {
            fetchPasses();
            fetchOverviewData();
          }}
        />
      )}

      {currentTab === 'APPROVALS_OVERRIDES' && (
        <GatePassApprovalsOverridesTab
          pendingPasses={pendingPasses}
          allPasses={passes}
          onApprove={(id, notes) => handleApprove(id, notes)}
          onReject={(id, reason) => handleReject(id, reason)}
          onOverride={handleOverride}
          onBulkAction={handleBulkAction}
          onReassignWarden={handleReassignWarden}
          onSelectPass={(p) => setSelectedPass(p)}
          onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
          loading={loading}
        />
      )}

      {currentTab === 'PASS_TYPES_RULES' && <GatePassTypesAndRulesTab />}

      {currentTab === 'GUARDIAN_VERIFICATION' && (
        <GatePassGuardianVerificationTab
          passes={passes}
          onVerifyGuardian={handleVerifyGuardian}
          onSelectPass={(p) => setSelectedPass(p)}
        />
      )}

      {currentTab === 'GATE_TRACKING' && (
        <GatePassGateTrackingOverdueTab
          onSendReminder={handleSendReminder}
          onSelectPass={(p) => setSelectedPass(p)}
        />
      )}

      {currentTab === 'LEAVE_MANAGEMENT' && (
        <GatePassLeaveManagementTab
          passes={passes}
          onSelectPass={(p) => setSelectedPass(p)}
          onLinkAttendance={handleLinkAttendance}
          onApprove={(id, notes) => handleApprove(id, notes)}
          onReject={(id, reason) => handleReject(id, reason)}
        />
      )}

      {currentTab === 'INSIGHTS_REPORTS' && (
        <GatePassInsightsReportsTab stats={stats} passes={passes} />
      )}

      {/* Detail Dossier Drawer */}
      <GatePassDetailDrawer
        pass={selectedPass}
        onClose={() => setSelectedPass(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onOverride={handleOverride}
        onVerifyGuardian={handleVerifyGuardian}
      />

      {/* Helpdesk Issuance Modal */}
      <GatePassHelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
        onSuccess={() => {
          fetchPasses();
          fetchOverviewData();
        }}
      />
    </div>
  );
}
