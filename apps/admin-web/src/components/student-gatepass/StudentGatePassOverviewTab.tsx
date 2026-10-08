'use client';

import React from 'react';
import {
  QrCode,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  Plus,
  ShieldCheck,
  Building,
  User,
  Compass,
  Phone,
  FileText,
  BellRing,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentGatePassOverviewTabProps {
  stats: any;
  activePass: any | null;
  studentProfile: any;
  lang: StudentLang;
  onOpenApplyGatePass: () => void;
  onOpenApplyLeave: () => void;
  onOpenShowMyPass: (pass: any) => void;
  onSwitchTab: (tabKey: string) => void;
  onCancelPass: (id: string) => Promise<void>;
}

export default function StudentGatePassOverviewTab({
  stats,
  activePass,
  studentProfile,
  lang,
  onOpenApplyGatePass,
  onOpenApplyLeave,
  onOpenShowMyPass,
  onSwitchTab,
  onCancelPass,
}: StudentGatePassOverviewTabProps) {
  const t = passI18n[lang] || passI18n.EN;

  const currentPresence = stats?.currentPresence || 'IN_HOSTEL';
  const isOverdue = stats?.isOverdue || false;
  const overdueMinutes = stats?.overdueMinutes || 0;

  // Banner status text
  const getBannerDetails = () => {
    if (isOverdue) {
      return {
        bg: 'bg-rose-600 text-white border-rose-700',
        title: `${t.returnOverdue} (+${overdueMinutes} mins)`,
        desc: 'Please report back to the campus security gate immediately or submit a late explanation note.',
        icon: Flame,
      };
    }
    if (currentPresence === 'OUT_ON_PASS' || (activePass && activePass.actualExitAt && !activePass.actualReturnAt)) {
      return {
        bg: 'bg-blue-600 text-white border-blue-700',
        title: `${t.outOnPass} • Return by ${activePass?.validTill ? new Date(activePass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:30 PM'}`,
        desc: `Destination: ${activePass?.destination || 'Local Market'} • Turnstile entry QR is ready.`,
        icon: Compass,
      };
    }
    if (currentPresence === 'OUT_ON_LEAVE') {
      return {
        bg: 'bg-indigo-600 text-white border-indigo-700',
        title: `${t.outOnLeave}`,
        desc: `Approved for multi-day leave until ${activePass?.validTill ? new Date(activePass.validTill).toLocaleDateString() : 'Tomorrow'}.`,
        icon: Building,
      };
    }
    return {
      bg: 'bg-emerald-600 text-white border-emerald-700',
      title: `${t.inHostel} • Campus Gate Open`,
      desc: `Curfew at ${stats?.curfewTime || '21:30'}. Today gate hours: 06:00 AM - 09:30 PM.`,
      icon: ShieldCheck,
    };
  };

  const banner = getBannerDetails();
  const BannerIcon = banner.icon;

  return (
    <div className="space-y-6">
      {/* Live Campus Presence Banner */}
      <div className={`p-5 rounded-2xl shadow-md border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${banner.bg}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <BannerIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
              {banner.title}
              {isOverdue && <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>}
            </h3>
            <p className="text-xs text-white/90 mt-0.5 max-w-xl">{banner.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {activePass && (
            <button
              onClick={() => onOpenShowMyPass(activePass)}
              className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>{t.showMyPass}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Active Pass Card */}
        <div
          onClick={() => activePass && onOpenShowMyPass(activePass)}
          className={`p-4 rounded-2xl border shadow-xs transition-all ${
            activePass
              ? 'bg-blue-50/70 border-blue-200 cursor-pointer hover:shadow-md'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-blue-900 uppercase">{t.activePass}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <QrCode className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {activePass ? (activePass.passNumber || 'Valid') : 'None'}
          </div>
          <p className="text-[10px] text-blue-700 font-medium mt-1 truncate">
            {activePass ? `${activePass.passType}` : 'Ready to apply'}
          </p>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => onSwitchTab('TRACK')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-amber-800 uppercase">{t.pendingRequests}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{stats?.pendingCount ?? 0}</div>
          <p className="text-[10px] text-amber-600 font-medium mt-1">With Hostel Warden</p>
        </div>

        {/* Approved Passes */}
        <div
          onClick={() => onSwitchTab('TRACK')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">{t.approvedPasses}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{stats?.approvedCount ?? 0}</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-1">Verified & Issued</p>
        </div>

        {/* Rejected Passes */}
        <div
          onClick={() => onSwitchTab('TRACK')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-rose-800 uppercase">{t.rejectedPasses}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">{stats?.rejectedCount ?? 0}</div>
          <p className="text-[10px] text-rose-600 font-medium mt-1">Remarks recorded</p>
        </div>

        {/* Monthly Quota Meter */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-indigo-900 uppercase">{t.usedThisMonth}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900">
            {stats?.monthlyUsed ?? 0} / {stats?.monthlyLimit ?? 6}
          </div>
          <p className="text-[10px] text-indigo-700 font-bold mt-1">
            {stats?.passesRemaining ?? 2} {t.passesLeft}
          </p>
        </div>
      </div>

      {/* Main Action Hub & Information Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Quick Action Launcher */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-slate-900">Pass & Leave Quick Launch</h4>
                <p className="text-xs text-slate-500 mt-0.5">Submit new requests or check currently active passes</p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Turnstile Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={onOpenApplyGatePass}
                className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-sm transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-sm">{t.applyGatePass}</div>
                <p className="text-[11px] text-blue-100 mt-1">Day outings, coaching, city errands & medical visits</p>
              </button>

              <button
                onClick={onOpenApplyLeave}
                className="p-4 bg-gradient-to-br from-indigo-700 to-indigo-800 hover:from-indigo-800 hover:to-indigo-900 text-white rounded-2xl shadow-sm transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-sm">{t.applyLeave}</div>
                <p className="text-[11px] text-indigo-100 mt-1">Home visits, medical leave, academic duty & holidays</p>
              </button>
            </div>

            {/* Quick Secondary Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSwitchTab('TRACK')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.trackRequests}</span>
              </button>

              <button
                onClick={() => onSwitchTab('ALERTS')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.guardianAlerts}</span>
              </button>

              <button
                onClick={() => onSwitchTab('HELP')}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.historyAndHelp}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Timings & Rules Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Today Gate Timing & Curfew Rules
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-600">{t.gateTiming}</span>
                <span className="font-bold text-slate-900 font-mono">06:00 AM – 09:30 PM</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-semibold">{t.curfewCutoff}</span>
                <span className="font-mono font-bold text-amber-900">{stats?.curfewTime || '21:30'} hrs</span>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-900 space-y-1">
                <div className="font-bold text-[11px] uppercase tracking-wider text-blue-800">Turnstile Scanner Note:</div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Present your digital QR code to the barrier turnstile scanner at Main Gate 1. Once scanned, your status is automatically updated to Out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
