'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Bed,
  Ticket,
  Clock,
  AlertTriangle,
  ShieldAlert,
  HeartPulse,
  Wrench,
  CheckCircle2,
  Calendar,
  Building,
  Building2,
  Shield,
  ChevronDown,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  UserCheck,
  Check,
  Filter,
  Package,
  Megaphone,
  ScanLine,
  Video,
  UserPlus,
  Zap,
} from 'lucide-react';

interface AdminDashboardOverviewViewProps {
  user: { name?: string; role?: string };
  currentDateTime: string;
  activeSosAlert: any;
  pendingStudents: any[];
  serviceTickets: any[];
  rolePlatforms?: Array<any>;
  onNavigateTab: (tab: any, subTab?: string) => void;
  onOpenServiceModal: (item: any) => void;
  onApproveStudent: (id: string, name: string) => void;
}

export function AdminDashboardOverviewView({
  user,
  currentDateTime,
  activeSosAlert,
  pendingStudents,
  serviceTickets,
  rolePlatforms,
  onNavigateTab,
  onOpenServiceModal,
  onApproveStudent,
}: AdminDashboardOverviewViewProps) {
  const router = useRouter();
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'CRITICAL' | 'MAINTENANCE' | 'SECURITY_ADMIN'>('ALL');

  // Priority Queue Items
  const priorityItems = [
    {
      id: 'p1',
      category: 'EMERGENCY',
      categoryLabel: '1. EMERGENCY',
      categoryColor: 'bg-red-600 text-white',
      cardBg: 'bg-red-50/70 border-red-200',
      icon: ShieldAlert,
      iconColor: 'text-red-600',
      title: 'Hostel A-112 SOS Alert: Rahul Verma (Heat Exhaustion / Dehydration)',
      time: 'Just now',
      desc: 'Nilgiri Block A, Room 112 • Immediate medical escort & security perimeter dispatch required.',
      actionLabel: 'Dispatch Medical Team',
      actionClass: 'bg-red-600 hover:bg-red-700 text-white',
      onAction: () => router.push('/admin/medical'),
      filterType: 'CRITICAL',
    },
    {
      id: 'p2',
      category: 'MEDICAL',
      categoryLabel: '2. MEDICAL',
      categoryColor: 'bg-rose-500 text-white',
      cardBg: 'bg-rose-50/60 border-rose-200',
      icon: HeartPulse,
      iconColor: 'text-rose-500',
      title: 'Urgent OPD Bed Triage: Sneha Roy (Shivalik Block B-204)',
      time: '18m ago',
      desc: 'Severe migraine with persistent high fever • Dispensary nurse requested approval for referral.',
      actionLabel: 'Review Triage',
      actionClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      onAction: () => router.push('/admin/medical'),
      filterType: 'CRITICAL',
    },
    {
      id: 'p3',
      category: 'SECURITY',
      categoryLabel: '3. GATE PASS',
      categoryColor: 'bg-indigo-600 text-white',
      cardBg: 'bg-indigo-50/60 border-indigo-200',
      icon: Shield,
      iconColor: 'text-indigo-600',
      title: 'Overdue Gate Pass Return: Subham Pradhan (#GP-2026-8812)',
      time: '+45m Overdue',
      desc: 'Scheduled return 07:00 PM • Main Turnstile Gate #1 shows resident not checked in.',
      actionLabel: 'Verify Gate Scanner',
      actionClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      onAction: () => onNavigateTab('SECURITY_SCANNER'),
      filterType: 'SECURITY_ADMIN',
    },
    {
      id: 'p4',
      category: 'MAINTENANCE',
      categoryLabel: '4. HIGH MAINTENANCE',
      categoryColor: 'bg-amber-500 text-white',
      cardBg: 'bg-amber-50/60 border-amber-200',
      icon: Wrench,
      iconColor: 'text-amber-600',
      title: '#SR-1042 Electricity: Room A-204 Wall Socket Sparking & Outage',
      time: 'SLA: 28m left',
      desc: 'Student Subham Pradhan • Nilgiri Block A • Routed to Electrical Team (Er. Dilip Das).',
      actionLabel: 'Open Ticket #SR-1042',
      actionClass: 'bg-amber-600 hover:bg-amber-700 text-white',
      onAction: () => {
        const ticket = serviceTickets.find((t) => t.id === 'sr-1042') || serviceTickets[0];
        if (ticket) onOpenServiceModal(ticket);
      },
      filterType: 'MAINTENANCE',
    },
    {
      id: 'p5',
      category: 'SLA_WARNING',
      categoryLabel: '5. SLA WARNING',
      categoryColor: 'bg-orange-600 text-white',
      cardBg: 'bg-orange-50/60 border-orange-200',
      icon: Clock,
      iconColor: 'text-orange-600',
      title: '#SR-1043 Plumbing Leak in B-312: SLA Target Breached (+12m)',
      time: 'Overdue',
      desc: 'Student Ananya Pattnaik • Shivalik Block B • Assigned Plumber Mahendra Singh on site.',
      actionLabel: 'Expedite Ticket',
      actionClass: 'bg-orange-600 hover:bg-orange-700 text-white',
      onAction: () => {
        const ticket = serviceTickets.find((t) => t.id === 'sr-1043') || serviceTickets[1] || serviceTickets[0];
        if (ticket) onOpenServiceModal(ticket);
      },
      filterType: 'MAINTENANCE',
    },
    {
      id: 'p6',
      category: 'ADMISSION',
      categoryLabel: '6. NORMAL REQUEST',
      categoryColor: 'bg-blue-600 text-white',
      cardBg: 'bg-blue-50/50 border-blue-200',
      icon: UserCheck,
      iconColor: 'text-blue-600',
      title: 'Student Admission Application: Rohan Sen (B.Tech Computer Science)',
      time: '1h ago',
      desc: 'Application credentials verified • Awaiting administrative enrollment clearance.',
      actionLabel: 'Verify Admission',
      actionClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      onAction: () => onNavigateTab('STUDENTS', 'Admission Requests'),
      filterType: 'SECURITY_ADMIN',
    },
  ];

  const filteredItems = priorityItems.filter((item) => {
    if (priorityFilter === 'ALL') return true;
    return item.filterType === priorityFilter;
  });

  return (
    <div className="space-y-6">
      {/* 1. PANORAMIC CAMPUS WELCOME BANNER (Matching Target Design) */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 min-h-[140px] md:min-h-[160px] flex items-center bg-[#07478a]">
        {/* Campus Background Image */}
        <img
          src="/images/rec-campus-overview.jpg"
          alt="Raajdhani Engineering College Campus"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Smooth Blue Gradient: Solid blue on left for text readability, fading to clear campus view on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#034a94] via-[#085aa8]/90 via-35% md:via-45% to-transparent" />

        {/* Banner Content */}
        <div className="relative z-10 w-full p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Welcome Text & Date */}
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back, Admin Manager!
            </h2>
            <p className="text-xs md:text-sm text-blue-100 font-normal">
              Your campus, your control. Keep everything running smoothly.
            </p>
            <div className="flex items-center space-x-2 text-white/90 text-xs pt-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span>{currentDateTime}</span>
            </div>
          </div>

          {/* Right: Floating Campus Badge Card */}
          <div
            onClick={() => onNavigateTab('CAMPUS_CONFIG')}
            className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/50 shadow-lg text-slate-800 self-start md:self-auto shrink-0 hover:bg-white transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 pr-1 text-left">
              <p className="text-xs font-black text-slate-900 leading-tight">
                Raajdhani Engineering College
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Bhubaneswar, Odisha
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Prominent Action Banner for Admissions (Only when pending) */}
      {pendingStudents.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3.5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">
                {pendingStudents.length} Admission Request{pendingStudents.length > 1 ? 's' : ''} Awaiting Approval: {pendingStudents[0].name} ({pendingStudents[0].course || 'B.Tech'})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onApproveStudent(pendingStudents[0].id || pendingStudents[0].userId, pendingStudents[0].name)}
              className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => onNavigateTab('STUDENTS', 'Admission Requests')}
              className="px-3 py-1.5 bg-slate-950/30 hover:bg-slate-950/50 text-white rounded-xl text-xs font-medium transition cursor-pointer"
            >
              View All ({pendingStudents.length}) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE KPI SUMMARY CARDS (Spacious 4-Card Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigateTab('STUDENTS')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">2,485</h3>
            <p className="text-xs text-emerald-600 font-semibold mt-1">↑ 98.4% Present on Campus</p>
          </div>
        </div>

        {/* Card 2: Hostel Occupancy */}
        <div
          onClick={() => onNavigateTab('HOSTEL')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">78%</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">1,237 of 1,580 Beds Allocated</p>
          </div>
        </div>

        {/* Card 3: Gate Passes */}
        <div
          onClick={() => onNavigateTab('LEAVE_GATE_PASS')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-400 transition cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gate Passes Today</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">34 Passes</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1">Curfew Roll Call: 09:30 PM</p>
          </div>
        </div>

        {/* Card 4: Open Tickets & Actions */}
        <div
          onClick={() => onNavigateTab('SERVICES')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Actions</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-600 tracking-tight">18 Items</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">1 Emergency • 7 Complaints • 8 Medical</p>
          </div>
        </div>
      </div>

      {/* 3. BALANCED TWO-COLUMN WORKSPACE (Left: Action Queue & Overview; Right: Hub & Quick Access) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========================================================= */}
        {/* LEFT COLUMN (2/3 width): PRIORITY QUEUE & OPERATIONS       */}
        {/* ========================================================= */}
        <div className="xl:col-span-2 space-y-6">
          {/* Card A: Prioritized Action Required Queue */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase flex items-center space-x-2">
                  <span>ACTION REQUIRED</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold lowercase">
                    {filteredItems.length} tasks
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-priority requests requiring administrator intervention
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {[
                  { key: 'ALL', label: 'All (6)' },
                  { key: 'CRITICAL', label: 'Emergency & Medical' },
                  { key: 'MAINTENANCE', label: 'Maintenance & SLA' },
                  { key: 'SECURITY_ADMIN', label: 'Pass & Curfew' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setPriorityFilter(f.key as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      priorityFilter === f.key
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Items List */}
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${item.cardBg}`}
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/90 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className={`px-2 py-0.2 rounded-md text-[9px] font-black ${item.categoryColor}`}>
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-bold">{item.time}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{item.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={item.onAction}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${item.actionClass}`}
                      >
                        {item.actionLabel} &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card B: Today's Operations & Utilities Snapshot */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Today's Campus Operations</h3>
                <p className="text-xs text-slate-500">Live operational snapshot across campus facilities</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Operational
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px]">Turnstile Activity</span>
                <p className="text-base font-black text-slate-900">4,120 Scans</p>
                <span className="text-[10px] text-emerald-600 font-bold">Main Gate Online</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px]">Curfew Compliance</span>
                <p className="text-base font-black text-slate-900">98.4%</p>
                <span className="text-[10px] text-slate-500">Roll call at 09:30 PM</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px]">Hostel Mess Service</span>
                <p className="text-base font-black text-slate-900">Lunch Complete</p>
                <span className="text-[10px] text-amber-600 font-bold">Snacks at 05:00 PM</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-500 text-[11px]">Power & Water Grid</span>
                <p className="text-base font-black text-slate-900">Normal 230V</p>
                <span className="text-[10px] text-emerald-600 font-bold">Tanks 92% Full</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN (1/3 width): FAST ACTIONS & INVENTORY         */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Card: Quick Actions Launcher */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
              Fast Administrative Actions
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigateTab('SECURITY_SCANNER')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold border border-slate-200 flex flex-col items-center justify-center text-center transition cursor-pointer"
              >
                <ScanLine className="w-4 h-4 text-blue-600 mb-1" />
                <span>Scan Pass</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('CCTV')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex flex-col items-center justify-center text-center transition cursor-pointer"
              >
                <Video className="w-4 h-4 text-slate-600 mb-1" />
                <span>CCTV Feeds</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('STUDENTS')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold border border-slate-200 flex flex-col items-center justify-center text-center transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-purple-600 mb-1" />
                <span>Add Student</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('NOTICES')}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-semibold border border-slate-200 flex flex-col items-center justify-center text-center transition cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-amber-600 mb-1" />
                <span>Post Notice</span>
              </button>
            </div>
          </div>

          {/* Card E: Critical Inventory Warnings */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Low Stock Inventory
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('INVENTORY')}
                className="text-[10px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: '18W LED Tube Light', count: '3 pcs left', min: 'Min: 15' },
                { name: '16A Single Pole MCB', count: '2 pcs left', min: 'Min: 10' },
                { name: 'Brass Ball Valve 1/2"', count: '1 pc left', min: 'Min: 8' },
              ].map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.name}</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-800 text-[11px]">{item.count}</span>
                    <span className="text-[9px] text-slate-400 block">{item.min}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
