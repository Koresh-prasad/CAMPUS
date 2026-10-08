'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  Clock,
  BellRing,
  FileText,
  Plus,
  Calendar,
  Globe,
  RefreshCw,
  QrCode,
  Wifi,
  WifiOff,
} from 'lucide-react';

import StudentGatePassOverviewTab from './StudentGatePassOverviewTab';
import StudentGatePassApplyModal from './StudentGatePassApplyModal';
import StudentLeaveApplyModal from './StudentLeaveApplyModal';
import StudentTrackRequestsTab from './StudentTrackRequestsTab';
import StudentMyPassModal from './StudentMyPassModal';
import StudentGuardianAlertsTab from './StudentGuardianAlertsTab';
import StudentPassHistoryHelpTab from './StudentPassHistoryHelpTab';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentHostelLeaveGatePassViewProps {
  studentProfile?: any;
  token?: string;
}

export default function StudentHostelLeaveGatePassView({
  studentProfile,
  token,
}: StudentHostelLeaveGatePassViewProps) {
  const [lang, setLang] = useState<StudentLang>('EN');
  const t = passI18n[lang] || passI18n.EN;

  const [currentTab, setCurrentTab] = useState<'OVERVIEW' | 'TRACK' | 'ALERTS' | 'HELP'>('OVERVIEW');
  const [passes, setPasses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    activePass: null,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    monthlyUsed: 0,
    monthlyLimit: 6,
    passesRemaining: 6,
    curfewTime: '21:30',
    currentPresence: 'IN_HOSTEL',
    isOverdue: false,
    overdueMinutes: 0,
  });

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Modals state
  const [isApplyGatePassOpen, setIsApplyGatePassOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState<any | null>(null);

  // Online / Offline Detection
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline queue auto-sync when network returns
  const syncOfflineQueue = async () => {
    try {
      const queueRaw = localStorage.getItem('shms_pending_pass_queue');
      if (!queueRaw) return;
      const queue = JSON.parse(queueRaw);
      if (Array.isArray(queue) && queue.length > 0) {
        for (const item of queue) {
          await fetch('/api/passes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
        }
        localStorage.removeItem('shms_pending_pass_queue');
        fetchMyPasses();
      }
    } catch (e) {
      console.warn('Offline sync background error:', e);
    }
  };

  // Fetch student passes from backend
  const fetchMyPasses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/passes/my-passes', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setPasses(data.passes || []);
        if (data.stats) setStats(data.stats);

        // Also check if an active pass is cached
        if (data.stats?.activePass) {
          localStorage.setItem('shms_cached_active_pass', JSON.stringify(data.stats.activePass));
        }
      }
    } catch {
      // Offline fallback: load from cached active pass in localStorage
      const cached = localStorage.getItem('shms_cached_active_pass');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setStats((prev: any) => ({ ...prev, activePass: parsed }));
        } catch (_) {}
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyPasses();
    // Auto-sync offline queue if items were queued previously
    if (navigator.onLine) {
      syncOfflineQueue();
    }
  }, [fetchMyPasses]);

  // Action handlers calling real backend endpoints
  const handleCancelPass = async (id: string, reason?: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        alert('Pass request cancelled.');
        fetchMyPasses();
      } else {
        alert('Cannot cancel pass.');
      }
    } catch {
      alert('Error cancelling pass.');
    }
  };

  const handleEscalatePass = async (id: string, note?: string) => {
    try {
      const res = await fetch(`/api/passes/${id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        alert('Pass review escalated to Chief Warden.');
        fetchMyPasses();
      }
    } catch {
      alert('Error escalating pass.');
    }
  };

  const handleExtendReturn = async (id: string, requestedReturnTime: string, reason: string) => {
    await fetch(`/api/passes/${id}/extend-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestedReturnTime, reason }),
    });
    fetchMyPasses();
  };

  const handleLateExplanation = async (id: string, explanation: string) => {
    await fetch(`/api/passes/${id}/late-explanation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ explanation }),
    });
    fetchMyPasses();
  };

  const handleReplyInfo = async (id: string, reply: string) => {
    await fetch(`/api/passes/${id}/reply-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    });
    fetchMyPasses();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Offline Status Pill if disconnected */}
      {!isOnline && (
        <div className="p-3 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-slate-900" />
            <span>{t.offlineNotice}</span>
          </div>
          <span className="text-[11px] font-normal">{t.offlineSync}</span>
        </div>
      )}

      {/* Module Title Header Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
              Student Platform
            </span>
            <span className="text-xs text-slate-400 font-mono">• Direct Warden &amp; Admin Sync</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">{t.deskTitle}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.deskSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Regional Language Toggle (EN / HI / OD) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['EN', 'HI', 'OD'] as StudentLang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  lang === l
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {l === 'EN' ? 'EN' : l === 'HI' ? 'हिन्दी' : 'ଓଡ଼ିଆ'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMyPasses}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto border border-slate-200/80 shadow-inner">
        <button
          onClick={() => setCurrentTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            currentTab === 'OVERVIEW'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <LayoutDashboard className={`w-3.5 h-3.5 ${currentTab === 'OVERVIEW' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setCurrentTab('TRACK')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            currentTab === 'TRACK'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${currentTab === 'TRACK' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>{t.trackRequests}</span>
          {stats?.pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
              {stats.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('ALERTS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            currentTab === 'ALERTS'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BellRing className={`w-3.5 h-3.5 ${currentTab === 'ALERTS' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>{t.guardianAlerts}</span>
          {stats?.isOverdue && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('HELP')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            currentTab === 'HELP'
              ? 'bg-white text-blue-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className={`w-3.5 h-3.5 ${currentTab === 'HELP' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>{t.historyAndHelp}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {currentTab === 'OVERVIEW' && (
        <StudentGatePassOverviewTab
          stats={stats}
          activePass={stats?.activePass}
          studentProfile={studentProfile}
          lang={lang}
          onOpenApplyGatePass={() => setIsApplyGatePassOpen(true)}
          onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
          onOpenShowMyPass={(p) => setSelectedPassForQR(p)}
          onSwitchTab={(t) => setCurrentTab(t as any)}
          onCancelPass={handleCancelPass}
        />
      )}

      {currentTab === 'TRACK' && (
        <StudentTrackRequestsTab
          passes={passes}
          lang={lang}
          onOpenShowMyPass={(p) => setSelectedPassForQR(p)}
          onCancelPass={handleCancelPass}
          onEscalatePass={handleEscalatePass}
          onReplyInfo={handleReplyInfo}
          onRefresh={fetchMyPasses}
          loading={loading}
        />
      )}

      {currentTab === 'ALERTS' && (
        <StudentGuardianAlertsTab
          passes={passes}
          activePass={stats?.activePass}
          stats={stats}
          studentProfile={studentProfile}
          lang={lang}
          onExtendReturn={handleExtendReturn}
          onLateExplanation={handleLateExplanation}
        />
      )}

      {currentTab === 'HELP' && (
        <StudentPassHistoryHelpTab
          passes={passes}
          stats={stats}
          studentProfile={studentProfile}
          lang={lang}
        />
      )}

      {/* Modals */}
      <StudentGatePassApplyModal
        isOpen={isApplyGatePassOpen}
        onClose={() => setIsApplyGatePassOpen(false)}
        studentProfile={studentProfile}
        passesRemaining={stats?.passesRemaining ?? 6}
        curfewTime={stats?.curfewTime ?? '21:30'}
        lang={lang}
        onSuccess={fetchMyPasses}
      />

      <StudentLeaveApplyModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        studentProfile={studentProfile}
        lang={lang}
        onSuccess={fetchMyPasses}
      />

      <StudentMyPassModal
        pass={selectedPassForQR}
        studentProfile={studentProfile}
        onClose={() => setSelectedPassForQR(null)}
      />
    </div>
  );
}
