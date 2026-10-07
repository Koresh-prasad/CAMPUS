'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '../../../../components/RoleGuard';
import {
  Wrench,
  Camera,
  ExternalLink,
  CheckCircle,
  Inbox,
  Utensils,
  Package,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  RefreshCw,
  LogOut,
  Droplets,
  Zap,
  Wifi,
  HelpCircle,
  Building,
  Check,
  X,
  Search,
  Sliders,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
  Thermometer,
  ShieldCheck,
  Bell,
  Download,
  Printer,
  ChevronRight,
  User,
  ShieldAlert,
  Flame,
  CheckCheck,
  KeyRound,
  RotateCcw,
  Activity,
  Award,
} from 'lucide-react';

import {
  ServiceTab,
  ServiceCategory,
  ServicePriority,
  ServiceStatus,
  ServiceRequest,
  MaintenanceScheduleItem,
  ServiceInventoryItem,
  ServiceReportItem,
  ServiceStaffProfile,
  StudentNotification,
} from './types';

import {
  INITIAL_SERVICE_STAFF,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_MAINTENANCE_SCHEDULE,
  INITIAL_SERVICE_INVENTORY,
  INITIAL_SERVICE_REPORTS,
  INITIAL_STUDENT_NOTIFICATIONS,
} from './mockData';

import {
  CreateServiceTicketModal,
  UpdateTicketStatusModal,
  AssignStaffModal,
  AddInventoryItemModal,
  ServiceHelpModal,
  TrackStatusModal,
} from './modals';

const API_BASE = '/api';

export default function ServicesDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={['SERVICES', 'STAFF', 'DIRECTOR', 'ADMIN']}
      portalTitle="Campus Operations & Services Console"
    >
      {({ user, token, logout }) => (
        <ServicesPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function ServicesPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  // Navigation & Settings
  const [activeTab, setActiveTab] = useState<ServiceTab>('DASHBOARD');
  const [toastMsg, setToastMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Staff Profile
  const [staff, setStaff] = useState<ServiceStaffProfile>(() => {
    if (user?.name) {
      return {
        ...INITIAL_SERVICE_STAFF,
        name: user.name,
      };
    }
    return INITIAL_SERVICE_STAFF;
  });

  // Core Data States
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [maintenance, setMaintenance] = useState<MaintenanceScheduleItem[]>(INITIAL_MAINTENANCE_SCHEDULE);
  const [inventory, setInventory] = useState<ServiceInventoryItem[]>(INITIAL_SERVICE_INVENTORY);
  const [reports, setReports] = useState<ServiceReportItem[]>(INITIAL_SERVICE_REPORTS);

  // Filters & Search
  const [requestCategoryFilter, setRequestCategoryFilter] = useState<'ALL' | ServiceCategory>('ALL');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [requestSearch, setRequestSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Selected for modals
  const [selectedTicketForUpdate, setSelectedTicketForUpdate] = useState<ServiceRequest | null>(null);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<ServiceRequest | null>(null);

  // Modal Visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Track Status Modal State
  const [selectedTicketForTrack, setSelectedTicketForTrack] = useState<ServiceRequest | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Student Notifications State
  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_STUDENT_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  // Request History State
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'ALL' | ServiceCategory>('ALL');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'ALL' | ServiceStatus>('ALL');
  const [historySearch, setHistorySearch] = useState('');

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Clock Timer
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4500);
  };

  // Two-way synchronization with Student Platform & Backend Complaints API
  useEffect(() => {
    const syncComplaints = async () => {
      try {
        const res = await fetch(`${API_BASE}/complaints`, { credentials: 'omit' }).catch(() => null);
        if (res && res.ok) {
          const cData = await res.json();
          const apiComplaints = cData.complaints || cData;
          if (Array.isArray(apiComplaints) && apiComplaints.length > 0) {
            setRequests((prev) => {
              const ids = new Set(prev.map((r) => r.id));
              const fresh = apiComplaints
                .filter((c: any) => !ids.has(c.id))
                .map((c: any) => ({
                  id: c.id,
                  ticketNumber: c.ticketNumber || `SR-${c.id.slice(0, 6)}`,
                  studentName: c.residentName || 'Student Resident',
                  studentId: c.residentId || 'CS2023042',
                  studentRoll: c.residentId || 'REC-CS-000',
                  studentPhone: '+91 98765 43210',
                  hostel: c.blockName || 'Nilgiri Residence (Block A)',
                  room: c.roomNumber || 'A-101',
                  category: (c.category || 'Plumbing') as ServiceCategory,
                  title: c.title || 'Service Complaint',
                  description: c.description || 'Hostel defect reported by student.',
                  priority: (c.priority || 'MEDIUM') as ServicePriority,
                  assignedStaffName: c.assignedStaffName || 'Unassigned',
                  status: (c.status === 'RESOLVED'
                    ? 'Resolved'
                    : c.status === 'IN_PROGRESS'
                    ? 'In Progress'
                    : 'New') as ServiceStatus,
                  createdTime: 'Today',
                  updatedTime: 'Today',
                  slaDue: 'Within 24 hours',
                }));
              return [...fresh, ...prev];
            });
          }
        }
      } catch (e) {
        console.warn('Service sync notice:', e);
      }
    };

    syncComplaints();
    const interval = setInterval(syncComplaints, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update Status Action
  const handleUpdateStatus = (ticketId: string, newStatus: ServiceStatus, notes?: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === ticketId
          ? {
              ...r,
              status: newStatus,
              updatedTime: currentTime || 'Just now',
              completionNote: notes || r.completionNote,
            }
          : r
      )
    );

    // Call backend API if possible
    fetch(`${API_BASE}/complaints/${ticketId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus.toUpperCase().replace(/\s+/g, '_'), notes }),
    }).catch(() => null);

    triggerToast(`Ticket status updated to: ${newStatus}`);
  };

  // Reopen Ticket Action (if student rejected resolution)
  const handleReopenTicket = (ticketId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === ticketId
          ? {
              ...r,
              status: 'In Progress',
              updatedTime: currentTime || 'Just now',
              description: `${r.description} [REOPENED: Work was rejected, requires follow-up inspection]`,
            }
          : r
      )
    );
    triggerToast('Ticket has been reopened for follow-up inspection.');
  };

  // Assign Staff Action
  const handleAssignStaff = (ticketId: string, staffName: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === ticketId
          ? {
              ...r,
              assignedStaffName: staffName,
              status: 'Assigned',
              updatedTime: currentTime || 'Just now',
            }
          : r
      )
    );
    triggerToast(`Work order assigned to ${staffName}.`);
  };

  // Download Sample CSV Report
  const handleDownloadCsv = (reportName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        `CAMPUSHELPER SERVICE REGISTER REPORT: ${reportName}\n` +
          `Generated Date,${currentDate} ${currentTime}\n` +
          `Supervisor,${staff.name} (${staff.badgeId})\n` +
          `Assigned Zone,${staff.assignedZone}\n\n` +
          `Ticket ID,Student,Roll No,Hostel,Room,Category,Priority,Assigned Staff,Status,SLA Due\n` +
          requests
            .map(
              (r) =>
                `"${r.ticketNumber}","${r.studentName}","${r.studentRoll}","${r.hostel}","${r.room}","${r.category}","${r.priority}","${r.assignedStaffName}","${r.status}","${r.slaDue}"`
            )
            .join('\n')
      );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Report downloaded: ${reportName}`);
  };

  // Metrics Calculations
  const newRequestsCount = requests.filter((r) => r.status === 'New').length;
  const openRequestsCount = requests.filter((r) => r.status !== 'Resolved' && r.status !== 'Closed').length;
  const assignedTasksCount = requests.filter((r) => r.status === 'Assigned' || r.status === 'Accepted').length;
  const inProgressCount = requests.filter((r) => r.status === 'In Progress').length;
  const highPriorityCount = requests.filter((r) => r.priority === 'HIGH' || r.priority === 'CRITICAL').length;
  const overdueCount = requests.filter((r) => r.priority === 'CRITICAL' && r.status !== 'Resolved').length;
  const resolvedTodayCount = requests.filter((r) => r.status === 'Resolved' || r.status === 'Student Confirmed').length;

  const primaryTicket = requests.find((r) => r.ticketNumber === 'SR-2026-1042') || requests[0];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* =================================================================== */}
      {/* 1. LEFT SIDEBAR: PURE DARK / BLACK (EXACTLY AS IN PHOTO)            */}
      {/* =================================================================== */}
      <aside className="w-64 bg-[#0d1527] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none text-slate-100 z-20 shadow-xl">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/70 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-1.5">
                  <span>Campus Helper</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-400 mt-0.5">
                  SERVICE SUPER APP • 8 HUBS
                </p>
              </div>
            </div>
          </div>

          {/* Supervisor Profile Badge Card (Matching photo style) */}
          <div className="px-3 pt-3">
            <div className="bg-[#141e33] border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
              <div className="relative">
                <img
                  src={staff.avatarUrl}
                  alt={staff.name}
                  className="w-10 h-10 rounded-xl object-cover border border-blue-500/40"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#141e33] absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-xs text-white truncate">{staff.name}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {staff.badgeId} • Supervisor
                </p>
                <p className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="truncate">Nilgiri & Mess Operations</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="px-3 pt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search service features..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#141e33] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Navigation Links (8 items matching prompt) */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-290px)] overflow-y-auto custom-scrollbar">
            {[
              { id: 'DASHBOARD', label: 'Home Dashboard', icon: Wrench, badge: null },
              { id: 'SERVICE_REQUESTS', label: 'Service Requests', icon: FileText, badge: `${openRequestsCount}`, badgeColor: 'bg-blue-500/20 text-blue-300' },
              { id: 'REQUEST_HISTORY', label: 'Request History', icon: Clock, badge: `${requests.length} total`, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
              { id: 'NOTIFICATIONS', label: 'Student Notifications', icon: Bell, badge: unreadNotifCount > 0 ? `${unreadNotifCount} new` : null, badgeColor: 'bg-rose-500/20 text-rose-300' },
              { id: 'MAINTENANCE', label: 'Maintenance Schedule', icon: Calendar, badge: 'Daily', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
              { id: 'ASSIGNED_TASKS', label: 'Assigned Tasks', icon: CheckCircle2, badge: `${inProgressCount} active`, badgeColor: 'bg-purple-500/20 text-purple-300' },
              { id: 'COMPLAINTS', label: 'Student Complaints', icon: AlertTriangle, badge: newRequestsCount > 0 ? `${newRequestsCount} new` : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
              { id: 'INVENTORY', label: 'Spare Parts & Inventory', icon: Package, badge: `${inventory.filter((i) => i.isLowStock).length} low`, badgeColor: 'bg-rose-500/20 text-rose-300' },
              { id: 'REPORTS', label: 'Reports & Audits', icon: FileText, badge: '6 Reg', badgeColor: 'bg-slate-700 text-slate-300' },
              { id: 'SETTINGS', label: 'Profile & Settings', icon: Sliders, badge: null },
            ]
              .filter((tab) => !sidebarSearch || tab.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ServiceTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#141e33]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tight shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : tab.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Bottom Actions: Help & Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5 bg-[#0b1220]">
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/70 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Help & Maintenance SOPs</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141e33] hover:bg-rose-600/90 transition cursor-pointer border border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Service Hub</span>
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* 2. MAIN CONTENT AREA: CRISP WHITE / LIGHT THEME (AS IN PHOTO)       */}
      {/* =================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] text-slate-800 overflow-hidden">
        {/* Top Header Navbar */}
        <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🛠️</span>
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Campus Operations & Service Hub</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-blue-600 text-xs font-bold font-mono">
                  {activeTab === 'DASHBOARD' && 'Operations Overview'}
                  {activeTab === 'SERVICE_REQUESTS' && 'All Work Order Requests'}
                  {activeTab === 'REQUEST_HISTORY' && 'Request History & Work Order Audit'}
                  {activeTab === 'NOTIFICATIONS' && 'Student Service Notifications'}
                  {activeTab === 'MAINTENANCE' && 'Preventive Maintenance Schedules'}
                  {activeTab === 'ASSIGNED_TASKS' && 'Technician Task Board'}
                  {activeTab === 'COMPLAINTS' && 'Hostel Grievances & Service Tickets'}
                  {activeTab === 'INVENTORY' && 'Equipment & Spare Parts Inventory'}
                  {activeTab === 'REPORTS' && 'Maintenance Logs & SLA Reports'}
                  {activeTab === 'SETTINGS' && 'Staff Profile & Configuration'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Clock & Date Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono font-bold text-slate-800">{currentTime || '08:00:00 AM'}</span>
              <span className="text-slate-400">|</span>
              <span className="font-medium text-slate-600">{currentDate}</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('SERVICE_REQUESTS')}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="New Requests"
            >
              <Bell className="w-4 h-4" />
              {newRequestsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
              )}
            </button>

            {/* Refresh Sync */}
            <button
              onClick={() => triggerToast('Synchronizing maintenance logs with central campus cloud...')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Primary Action Button (+ Work Order) */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Work Order</span>
            </button>

            {/* Staff Avatar */}
            <div
              onClick={() => setActiveTab('SETTINGS')}
              className="cursor-pointer group pl-1"
              title="Supervisor Profile"
            >
              <img
                src={staff.avatarUrl}
                alt={staff.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-600 transition"
              />
            </div>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between shadow-md animate-in slide-in-from-top duration-200 shrink-0">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg('')} className="p-0.5 hover:bg-emerald-700 rounded">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        )}

        {/* Dynamic Light Theme Content View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================================================================= */}
          {/* TAB 1: SERVICE DASHBOARD (MATCHING THE REFERENCE PHOTO STYLE)     */}
          {/* ================================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* 1. HERO BLUE GRADIENT BANNER (EXACTLY AS IN PHOTO) */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={staff.avatarUrl}
                      alt={staff.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                    />
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center absolute -bottom-1 -right-1 text-white shadow-xs">
                      <Wrench className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                        ACTIVE SUPERVISOR
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                        ID: {staff.badgeId}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Welcome Back, {staff.name}!
                    </h3>
                    <p className="text-xs text-blue-100 font-medium mt-0.5">
                      {staff.designation} • {staff.assignedZone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>New Request</span>
                  </button>
                  <button
                    onClick={() => setShowAddInventoryModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Add Parts</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('MAINTENANCE')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedules</span>
                  </button>
                </div>
              </div>

              {/* 2. FOUR PRIMARY METRIC CARDS (EXACTLY AS IN PHOTO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      OPEN SERVICE REQUESTS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {openRequestsCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 mt-1">
                      <span>{newRequestsCount} New • {inProgressCount} In Progress</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      ASSIGNED TASKS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {assignedTasksCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 mt-1">
                      <span>Plumbing, Electrical, Wi-Fi</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      HIGH PRIORITY & HAZARDS
                    </span>
                    <p className="text-2xl font-black text-rose-600 tracking-tight mt-1 flex items-center space-x-1.5">
                      <span>{highPriorityCount}</span>
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-600 mt-1">
                      <span>{overdueCount} Critical SLA &lt; 2h</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      RESOLVED TODAY
                    </span>
                    <p className="text-2xl font-black text-emerald-600 tracking-tight mt-1 flex items-center space-x-1">
                      <span>{resolvedTodayCount}</span>
                      <Check className="w-5 h-5 text-emerald-600" />
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <span>96.4% SLA Compliance</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* 3. TWO COLUMNS LAYOUT: LEFT IS FEATURED WORK ORDER TICKET & RIGHT IS TODAY'S MAINTENANCE SCHEDULE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Featured Work Order Ticket (Matching photo style) */}
                <div className="bg-white rounded-3xl p-6 border-2 border-blue-400/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Active Work Order Ticket</h4>
                      <div className="w-16 h-1 bg-blue-600 rounded-full mt-1"></div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider">
                      {primaryTicket.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <span>Status:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{primaryTicket.status}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold">
                      {primaryTicket.priority} Priority
                    </span>
                  </div>

                  {/* Form Table Layout (Matching photo style) */}
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs pt-1 border-t border-slate-100">
                    <div className="text-slate-500 font-semibold">Student:</div>
                    <div className="text-slate-900 font-extrabold text-right">
                      {primaryTicket.studentName}
                    </div>

                    <div className="text-slate-500 font-semibold">Roll Number:</div>
                    <div className="font-mono text-blue-600 font-bold text-right">
                      {primaryTicket.studentRoll}
                    </div>

                    <div className="text-slate-500 font-semibold">Student Contact:</div>
                    <div className="font-mono text-emerald-600 font-bold text-right">
                      {primaryTicket.studentPhone}
                    </div>

                    <div className="text-slate-500 font-semibold">Hostel & Room:</div>
                    <div className="text-slate-900 font-bold text-right">
                      {primaryTicket.hostel} • Room {primaryTicket.room}
                    </div>

                    <div className="text-slate-500 font-semibold">Defect Summary:</div>
                    <div className="text-slate-800 font-medium text-right truncate">
                      {primaryTicket.title}
                    </div>

                    <div className="text-slate-500 font-semibold">Assigned Technician:</div>
                    <div className="text-blue-600 font-extrabold text-right">
                      {primaryTicket.assignedStaffName}
                    </div>

                    <div className="text-slate-500 font-semibold">Reported At:</div>
                    <div className="font-mono text-slate-800 text-right">
                      {primaryTicket.createdTime}
                    </div>

                    <div className="text-slate-500 font-semibold">SLA Commitment:</div>
                    <div className="font-mono text-rose-600 font-bold text-right">
                      {primaryTicket.slaDue}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTicketForUpdate(primaryTicket);
                        setShowUpdateModal(true);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Status & Mark Resolved</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTicketForAssign(primaryTicket);
                        setShowAssignModal(true);
                      }}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Reassign
                    </button>
                  </div>
                </div>

                {/* Right Card: Today's Maintenance Schedule (Matching photo style) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Today's Preventive Maintenance</h4>
                        <p className="text-[11px] text-slate-400">Scheduled facility upkeep & inspections</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('MAINTENANCE')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {maintenance.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-slate-200 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {item.facility} • {item.scheduledTime} • Assigned: <strong className="text-slate-700">{item.assignedTeam}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. RECENT WORK ORDER REQUESTS TABLE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Recent Service Requests Feed</h4>
                      <p className="text-xs text-slate-400">Incoming tickets from Student Complaints & Warden desks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('SERVICE_REQUESTS')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All Tickets</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Ticket</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Assigned Staff</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">{req.ticketNumber}</td>
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-slate-900 block">{req.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{req.studentRoll}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {req.hostel} • {req.room}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {req.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                                req.priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800'
                                  : req.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {req.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-bold">{req.assignedStaffName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === 'Resolved' || req.status === 'Student Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setSelectedTicketForUpdate(req);
                                setShowUpdateModal(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold transition cursor-pointer"
                            >
                              Update
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: SERVICE REQUESTS (ALL CATEGORIES & STATUSES)               */}
          {/* ================================================================= */}
          {activeTab === 'SERVICE_REQUESTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {(
                    [
                      'ALL',
                      'Electrical',
                      'Plumbing',
                      'Cleaning',
                      'Wi-Fi',
                      'Water',
                      'Furniture',
                      'Room Repair',
                      'Mess',
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setRequestCategoryFilter(cat as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        requestCategoryFilter === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by student, room, or ticket..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests
                  .filter((r) => {
                    if (requestCategoryFilter !== 'ALL' && r.category !== requestCategoryFilter) return false;
                    if (
                      requestSearch &&
                      !r.studentName.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.studentRoll.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.ticketNumber.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.room.toLowerCase().includes(requestSearch.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 hover:border-blue-300 shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs text-blue-600">{req.ticketNumber}</span>
                            <span className="text-slate-400">•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {req.category}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1">{req.title}</h4>
                          <p className="text-xs text-slate-500">
                            {req.studentName} ({req.studentRoll}) • {req.hostel} • Room {req.room}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            req.status === 'Resolved' || req.status === 'Student Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : req.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {req.description}
                      </p>

                      {req.completionNote && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800">
                          <strong>Technician Note:</strong> {req.completionNote}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Tech: <strong className="text-slate-800">{req.assignedStaffName}</strong>
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedTicketForAssign(req);
                              setShowAssignModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicketForUpdate(req);
                              setShowUpdateModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                          >
                            Update Status
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: MAINTENANCE SCHEDULE                                       */}
          {/* ================================================================= */}
          {activeTab === 'MAINTENANCE' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Preventive Maintenance Calendar</h3>
                  <p className="text-xs text-slate-500">
                    Recurring audits for water purifiers, solar geysers, mess exhaust ducts, and power lines.
                  </p>
                </div>
                <button
                  onClick={() => triggerToast('New maintenance schedule slot added.')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Schedule Task</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {maintenance.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-blue-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                          {item.frequency}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.facility}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <p className="text-slate-700">Timing: <strong className="text-slate-900">{item.scheduledTime}</strong></p>
                      <p className="text-slate-500">Assigned Team: <strong className="text-slate-800">{item.assignedTeam}</strong></p>
                    </div>

                    <div className="flex justify-end pt-1">
                      {item.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            setMaintenance((prev) =>
                              prev.map((m) => (m.id === item.id ? { ...m, status: 'COMPLETED' } : m))
                            );
                            triggerToast('Preventive maintenance marked completed.');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Audit Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: ASSIGNED TASKS                                             */}
          {/* ================================================================= */}
          {activeTab === 'ASSIGNED_TASKS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Assigned Tasks Queue</h3>
                  <p className="text-xs text-slate-500">
                    Active tasks routed to {staff.name} or maintenance team members.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests
                  .filter((r) => r.status !== 'Closed')
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-blue-300 shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs text-blue-600">{task.ticketNumber}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {task.category}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1">{task.title}</h4>
                          <p className="text-xs text-slate-500">
                            {task.hostel} • Room {task.room}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase">
                          {task.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 font-mono">SLA: {task.slaDue}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedTicketForUpdate(task);
                              setShowUpdateModal(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            Update Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: COMPLAINTS (STUDENT INTEGRATION & REOPEN)                   */}
          {/* ================================================================= */}
          {activeTab === 'COMPLAINTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Student Grievances & Service Complaints</h3>
                  <p className="text-xs text-slate-500">
                    Two-way feedback loop: Students confirm resolution or request ticket reopening.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {requests.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-slate-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-blue-600">{c.ticketNumber}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                            {c.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-500">
                          Reported by <strong className="text-slate-800">{c.studentName}</strong> ({c.studentRoll}) • {c.hostel} • Room {c.room}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          c.status === 'Student Confirmed' || c.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {c.description}
                    </p>

                    {c.studentFeedback && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <CheckCheck className="w-4 h-4 text-emerald-600" />
                          <span>Student Feedback (Rating: {'★'.repeat(c.rating || 5)})</span>
                        </div>
                        <p className="text-emerald-800">{c.studentFeedback}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Technician in charge: <strong className="text-slate-800">{c.assignedStaffName}</strong>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReopenTicket(c.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reopen Ticket</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicketForUpdate(c);
                            setShowUpdateModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: INVENTORY & SPARE PARTS                                    */}
          {/* ================================================================= */}
          {activeTab === 'INVENTORY' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Spare Parts & Consumables Inventory</h3>
                  <p className="text-xs text-slate-500">
                    Stock tracking for electrical battens, plumbing taps, LAN cables, and disinfectants.
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search parts or SKU..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => setShowAddInventoryModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory
                  .filter((item) =>
                    !inventorySearch ||
                    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    item.itemCode.toLowerCase().includes(inventorySearch.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-amber-300 shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-[10px] text-blue-600">{item.itemCode}</span>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{item.name}</h4>
                          <span className="text-xs text-slate-400">{item.category} • {item.location}</span>
                        </div>
                        {item.isLowStock && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase">
                            Low Stock
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Stock:</span>
                          <span className="font-extrabold text-slate-900">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Min Threshold:</span>
                          <span className="font-bold text-slate-700">{item.minStock} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                          <span>Last Restocked: {item.lastRestocked}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => {
                            setInventory((prev) =>
                              prev.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 10, isLowStock: false } : i
                              )
                            );
                            triggerToast(`Restocked +10 ${item.unit} of ${item.name}.`);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          + Restock (+10)
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: REPORTS                                                    */}
          {/* ================================================================= */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Maintenance & Facilities Registers</h3>
                  <p className="text-xs text-slate-500">
                    Official CSV downloads and printable registers for campus operations audits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-blue-300 shadow-sm transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{rep.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Records: {rep.recordCount} entries
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-blue-700 font-mono text-[10px] font-bold">
                          {rep.format}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {rep.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleDownloadCsv(rep.name)}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download CSV</span>
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="Print Register"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: PROFILE & SETTINGS (PERMISSIONS BOUNDARY)                  */}
          {/* ================================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-4">
                    <img
                      src={staff.avatarUrl}
                      alt={staff.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-lg text-slate-900">{staff.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                          {staff.badgeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{staff.designation}</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{staff.department}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs uppercase tracking-wider">
                    On Duty Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Contact Phone</span>
                    <span className="font-mono text-slate-900 font-bold">{staff.phone}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Assigned Shift</span>
                    <span className="text-slate-900 font-bold">{staff.shift}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Assigned Zone</span>
                    <span className="text-slate-900 font-bold">{staff.assignedZone}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Control Room Helpline</span>
                    <span className="font-mono text-rose-600 font-bold">{staff.emergencyHelpline}</span>
                  </div>
                </div>
              </div>

              {/* Role Permissions Boundary */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Service Staff Role Permission Boundary</h4>
                    <p className="text-xs text-slate-500">
                      Standard operational matrix for Campus Operations & Maintenance Staff in CampusHelper.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>View assigned service requests & maintenance tasks</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Accept tasks & update status (In Progress, Resolved)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Add work notes & upload completion proof</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manage equipment, consumables & spare parts inventory</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot approve student leave or outings (Warden only)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot approve gate passes (Warden only)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot access private medical records or consultations</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot access master system Admin settings or credentials</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. MODALS SUITE                                                     */}
      
      {/* 6. TRACK STATUS MODAL */}
      <TrackStatusModal
        isOpen={showTrackModal}
        ticket={selectedTicketForTrack}
        onClose={() => setShowTrackModal(false)}
        onUpdateStatus={handleUpdateStatus}
        onAssignStaff={handleAssignStaff}
      />
{/* =================================================================== */}
      <CreateServiceTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTicket={(newT) => {
          const ticketObj: ServiceRequest = {
            id: `sr-${Date.now()}`,
            ticketNumber: newT.ticketNumber || `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            studentName: newT.studentName || 'Student Resident',
            studentId: newT.studentId || 'CS2023042',
            studentRoll: newT.studentRoll || 'REC-2023-CS042',
            studentPhone: newT.studentPhone || '+91 98765 43210',
            hostel: newT.hostel || 'Nilgiri Residence (Block A)',
            room: newT.room || 'A-204',
            category: newT.category || 'Plumbing',
            title: newT.title || 'Service Ticket',
            description: newT.description || '',
            priority: newT.priority || 'MEDIUM',
            assignedStaffName: 'Unassigned (Awaiting Dispatch)',
            status: 'New',
            createdTime: 'Just now',
            updatedTime: 'Just now',
            slaDue: newT.priority === 'CRITICAL' ? 'Within 2 hours' : 'Within 24 hours',
          };
          setRequests((prev) => [ticketObj, ...prev]);
          triggerToast(`Service ticket ${ticketObj.ticketNumber} created.`);
        }}
      />

      <UpdateTicketStatusModal
        ticket={selectedTicketForUpdate}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      <AssignStaffModal
        ticket={selectedTicketForAssign}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignStaff}
      />

      <AddInventoryItemModal
        isOpen={showAddInventoryModal}
        onClose={() => setShowAddInventoryModal(false)}
        onAddItem={(newItem) => {
          const invObj: ServiceInventoryItem = {
            id: `inv-${Date.now()}`,
            itemCode: newItem.itemCode || `ITM-${Date.now().toString().slice(-5)}`,
            name: newItem.name || 'Stock Part',
            category: newItem.category || 'Electrical',
            quantity: newItem.quantity || 10,
            unit: newItem.unit || 'Pieces',
            minStock: newItem.minStock || 5,
            location: newItem.location || 'Maintenance Store',
            condition: 'GOOD',
            lastRestocked: 'Today',
            isLowStock: (newItem.quantity || 10) <= (newItem.minStock || 5),
          };
          setInventory((prev) => [invObj, ...prev]);
          triggerToast(`Item ${invObj.name} added to stock.`);
        }}
      />

      <ServiceHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
