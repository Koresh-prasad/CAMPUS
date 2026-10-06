'use client';

import React, { useState, useEffect, useMemo } from 'react';
import RoleGuard from '../../../../components/RoleGuard';
import {
  LayoutDashboard,
  Building,
  Users,
  Bed as BedIcon,
  Calendar,
  QrCode,
  Compass,
  UserCheck,
  MessageSquare,
  Wrench,
  Moon,
  Megaphone,
  AlertTriangle,
  Siren,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Phone,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ChevronRight,
  Filter,
  Check,
  X,
  Flame,
  ShieldCheck,
  Eye,
  Camera,
  User,
  Key,
  Radio,
  ChevronDown,
  PhoneCall,
  Utensils,
  Shield,
  ExternalLink,
} from 'lucide-react';

import {
  WardenTab,
  Language,
  WardenProfile,
  GatePass,
  Resident,
  Room,
  RoomChangeRequest,
  RollCallRecord,
  CurfewViolation,
  HostelComplaint,
  VisitorRequest,
  DisciplinaryRecord,
  HostelEmergency,
  HostelNotice,
  HostelStaff,
  LeaveRequestItem,
  StudentMovementRecord,
  MaintenanceTicketItem,
  HostelReportItem,
  MovementStatus,
  PresenceStatus,
} from './types';

import {
  INITIAL_WARDEN_PROFILE,
  INITIAL_GATE_PASSES,
  INITIAL_RESIDENTS,
  INITIAL_ROOMS,
  INITIAL_ROOM_REQUESTS,
  INITIAL_ROLL_CALLS,
  INITIAL_CURFEW_VIOLATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_VISITORS,
  INITIAL_DISCIPLINARY_RECORDS,
  INITIAL_EMERGENCIES,
  INITIAL_NOTICES,
  INITIAL_HOSTEL_STAFF,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_MOVEMENT_RECORDS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_REPORTS,
  HOSTEL_OVERVIEW_DETAILS,
} from './mockData';

import {
  EditProfileModal,
  DigitalIdCardModal,
  ChangePasswordModal,
  PassActionModal,
  RollCallModal,
  AssignComplaintModal,
  EmergencyBroadcastModal,
  CreateNoticeModal,
  StudentProfileDrawer,
  GatePassQrModal,
  CreateIncidentModal,
  ConfirmActionModal,
  HelpSupportModal,
} from './modals';

export default function WardenDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={['WARDEN', 'STAFF', 'DIRECTOR', 'ADMIN', 'ADMIN_MANAGER']}
      portalTitle="Campus Operations Desk"
    >
      {({ user, token, logout }) => (
        <WardenPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function WardenPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  // Navigation & Preferences
  const [activeTab, setActiveTab] = useState<WardenTab>('DASHBOARD');
  const [selectedLang, setSelectedLang] = useState<Language>('EN');
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Live Clock & Date
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

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
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Primary State Data
  const [profile, setProfile] = useState<WardenProfile>(INITIAL_WARDEN_PROFILE);
  const [passes, setPasses] = useState<GatePass[]>(INITIAL_GATE_PASSES);
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [roomRequests, setRoomRequests] = useState<RoomChangeRequest[]>(INITIAL_ROOM_REQUESTS);
  const [rollCalls, setRollCalls] = useState<RollCallRecord[]>(INITIAL_ROLL_CALLS);
  const [violations, setViolations] = useState<CurfewViolation[]>(INITIAL_CURFEW_VIOLATIONS);
  const [complaints, setComplaints] = useState<HostelComplaint[]>(INITIAL_COMPLAINTS);
  const [visitors, setVisitors] = useState<VisitorRequest[]>(INITIAL_VISITORS);
  const [disciplinary, setDisciplinary] = useState<DisciplinaryRecord[]>(INITIAL_DISCIPLINARY_RECORDS);
  const [emergencies, setEmergencies] = useState<HostelEmergency[]>(INITIAL_EMERGENCIES);
  const [notices, setNotices] = useState<HostelNotice[]>(INITIAL_NOTICES);
  const [staff, setStaff] = useState<HostelStaff[]>(INITIAL_HOSTEL_STAFF);

  // New Warden Specific States
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestItem[]>(INITIAL_LEAVE_REQUESTS);
  const [movementRecords, setMovementRecords] = useState<StudentMovementRecord[]>(INITIAL_MOVEMENT_RECORDS);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicketItem[]>(INITIAL_MAINTENANCE_TICKETS);
  const [reportsList, setReportsList] = useState<HostelReportItem[]>(INITIAL_REPORTS);

  // Filters & Sub-view states
  const [passFilter, setPassFilter] = useState<'ALL' | 'PENDING' | 'OUT' | 'OVERDUE' | 'APPROVED' | 'RETURNED'>('PENDING');
  const [leaveFilter, setLeaveFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [movementFilter, setMovementFilter] = useState<'ALL' | MovementStatus>('ALL');
  const [maintenanceFilter, setMaintenanceFilter] = useState<'ALL' | 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [residentSearch, setResidentSearch] = useState('');
  const [residentBlockFilter, setResidentBlockFilter] = useState('ALL');
  const [residentFloorFilter, setResidentFloorFilter] = useState('ALL');
  const [residentStatusFilter, setResidentStatusFilter] = useState('ALL');
  const [selectedRoomFloor, setSelectedRoomFloor] = useState('ALL');
  const [complaintCategoryFilter, setComplaintCategoryFilter] = useState('ALL');

  // Modals visibility & selected objects
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [selectedPassForAction, setSelectedPassForAction] = useState<GatePass | null>(null);
  const [selectedPassForQr, setSelectedPassForQr] = useState<GatePass | null>(null);
  const [selectedResidentForDrawer, setSelectedResidentForDrawer] = useState<Resident | null>(null);
  const [showRollCallModal, setShowRollCallModal] = useState(false);
  const [selectedComplaintToAssign, setSelectedComplaintToAssign] = useState<HostelComplaint | null>(null);
  const [showEmergencyBroadcast, setShowEmergencyBroadcast] = useState(false);
  const [showCreateNotice, setShowCreateNotice] = useState(false);
  const [showCreateIncident, setShowCreateIncident] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Confirm Action Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  // Sync profile name with authenticated user
  useEffect(() => {
    if (user?.name) {
      const isAdm =
        user.role === 'ADMIN_MANAGER' ||
        user.role === 'ADMIN' ||
        user.role === 'DIRECTOR' ||
        (user.name || '').toLowerCase().includes('administrator') ||
        (user.email || '').toLowerCase().includes('admin');

      setProfile((prev) => ({
        ...prev,
        name: user.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        designation: isAdm ? 'Campus Admin Manager' : (user.staffProfile?.designation || prev.designation),
        assignedHostel: isAdm ? 'All Campus Hostels & Facilities' : prev.assignedHostel,
        assignedBlocks: isAdm ? ['Campus Executive Oversight'] : prev.assignedBlocks,
      }));
    }
  }, [user]);

  // Check if current user is an Admin Manager / College Administrator
  const isAdminManager = useMemo(() => {
    const role = (user?.role || '').toUpperCase();
    const name = (user?.name || '').toUpperCase();
    const email = (user?.email || '').toUpperCase();
    const pName = (profile?.name || '').toUpperCase();
    const pDesig = (profile?.designation || '').toUpperCase();
    return (
      role === 'ADMIN_MANAGER' ||
      role === 'ADMIN' ||
      role === 'DIRECTOR' ||
      name.includes('ADMINISTRATOR') ||
      email.includes('ADMIN') ||
      pName.includes('ADMINISTRATOR') ||
      pDesig.includes('ADMINISTRATOR') ||
      pDesig.includes('ADMIN MANAGER')
    );
  }, [user, profile]);

  // Auto-redirect Admin Manager to central Admin Command Center
  useEffect(() => {
    if (isAdminManager && typeof window !== 'undefined') {
      window.location.href = '/admin/dashboard';
    }
  }, [isAdminManager]);

  // Two-way synchronization with Student Platform (LocalStorage + Backend API)
  useEffect(() => {
    const API_BASE = 'http://localhost:4000/api';

    const syncFromStudentPlatform = async () => {
      try {
        const savedSos = localStorage.getItem('shms_active_emergency');
        if (savedSos) {
          try {
            const parsedSos = JSON.parse(savedSos);
            if (parsedSos?.id && !emergencies.some((e) => e.id === parsedSos.id)) {
              setEmergencies((prev) => [parsedSos, ...prev]);
            }
          } catch (e) {}
        }

        const passRes = await fetch(`${API_BASE}/passes`, { credentials: 'omit' }).catch(() => null);
        if (passRes && passRes.ok) {
          const pData = await passRes.json();
          const apiPasses = pData.passes || pData;
          if (Array.isArray(apiPasses) && apiPasses.length > 0) {
            setPasses((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              const fresh = apiPasses.filter((p: any) => !ids.has(p.id));
              return [...fresh, ...prev];
            });
          }
        }

        const compRes = await fetch(`${API_BASE}/complaints`, { credentials: 'omit' }).catch(() => null);
        if (compRes && compRes.ok) {
          const cData = await compRes.json();
          const apiComps = cData.complaints || cData;
          if (Array.isArray(apiComps) && apiComps.length > 0) {
            setComplaints((prev) => {
              const ids = new Set(prev.map((c) => c.id));
              const fresh = apiComps.filter((c: any) => !ids.has(c.id));
              return [...fresh, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn('Warden desk background sync notice:', err);
      }
    };

    syncFromStudentPlatform();
    const interval = setInterval(syncFromStudentPlatform, 8000);
    return () => clearInterval(interval);
  }, []);

  const syncPassApprovalToStudent = (studentName: string, passId: string, qrToken: string) => {
    try {
      const updatedPassCard = {
        status: 'Approved ✅',
        studentName: studentName,
        rollNumber: 'REC-2023-CS042',
        hostel: 'Nilgiri Residence (Block A)',
        room: 'A-204',
        purpose: 'Approved Campus Gate Pass / Outing',
        outTime: '05:30 PM',
        returnTime: '09:00 PM (Curfew 09:30 PM)',
        qrToken: qrToken,
        warden: 'Approved ✅',
        security: 'Verify at Gate',
        studentPhone: '+91 98765 43210',
        fatherPhone: '+91 94370 88990',
        motherPhone: '+91 94371 67890',
      };
      localStorage.setItem('shms_gate_pass_data', JSON.stringify(updatedPassCard));

      const existing = localStorage.getItem('shms_student_passes');
      let passList = existing ? JSON.parse(existing) : [];
      passList = passList.map((p: any) =>
        p.id === passId ? { ...p, status: 'APPROVED', qrToken } : p
      );
      localStorage.setItem('shms_student_passes', JSON.stringify(passList));
    } catch (e) {
      console.warn('Student localStorage sync error:', e);
    }
  };

  // 10 Exact Dashboard Metric Calculations
  const totalResidentsCount = HOSTEL_OVERVIEW_DETAILS.occupancy || 520;
  const presentResidentsCount = 497;
  const outsideCampusCount = 23;
  const pendingLeaveCount = leaveRequests.filter((l) => l.status === 'PENDING').length;
  const pendingGatePassCount = passes.filter((p) => p.status === 'PENDING').length;
  const openComplaintsCount = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const maintenanceIssuesCount = maintenanceTickets.filter((m) => m.status !== 'RESOLVED').length;
  const todayVisitorsCount = visitors.length;
  const lateReturnsCount = movementRecords.filter((m) => m.status === 'OVERDUE').length;
  const activeEmergencyAlertsCount = emergencies.filter((e) => e.status !== 'RESOLVED').length;

  // Handlers
  const handleApprovePass = (passId: string) => {
    const target = passes.find((p) => p.id === passId);
    const tokenGen = `REC-PASS-${(target?.studentName || 'STUDENT').split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'APPROVED',
              qrToken: tokenGen,
            }
          : p
      )
    );

    if (target) {
      syncPassApprovalToStudent(target.studentName, passId, tokenGen);
    }

    triggerToast('✓ Gate pass approved! Turnstile QR token generated and synchronized with Student Platform.');
  };

  const handleRejectPass = (passId: string, reason: string) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId ? { ...p, status: 'REJECTED', rejectionReason: reason } : p
      )
    );
    triggerToast('✗ Gate pass rejected. Dispatched explanation notification to student and guardian.');
  };

  const handleRevokePass = (passId: string) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId ? { ...p, status: 'REJECTED', rejectionReason: 'Revoked by Warden for curfew compliance' } : p
      )
    );
    triggerToast('⚠️ Gate pass revoked immediately. Turnstile authorization cancelled.');
  };

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId ? { ...l, status: 'APPROVED' } : l
      )
    );
    triggerToast('✓ Hostel leave request approved! Student Platform updated with signed departure permission.');
  };

  const handleRejectLeave = (leaveId: string, reason: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId ? { ...l, status: 'REJECTED', rejectionReason: reason } : l
      )
    );
    triggerToast('✗ Leave request rejected. Formal reason communicated to resident & guardian.');
  };

  const handleSaveRollCall = (entries: any[]) => {
    const newRecord: RollCallRecord = {
      id: `rc-rec-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      blockName: 'Nilgiri Block A & B',
      floor: 'All Floors',
      conductedBy: profile.name,
      timeTaken: currentTime || '09:40 PM',
      totalResidents: entries.length,
      presentCount: entries.filter((e) => e.status === 'PRESENT').length,
      absentCount: entries.filter((e) => e.status === 'ABSENT').length,
      onPassCount: entries.filter((e) => e.status === 'ON_PASS').length,
      entries,
    };
    setRollCalls([newRecord, ...rollCalls]);
    triggerToast(`✓ Night roll call finalized! Logged ${entries.length} residents across Block A & B.`);
  };

  const handleAssignTechnician = (complaintId: string, workerName: string, notes: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'ASSIGNED',
              assignedTo: workerName,
              resolutionNotes: notes,
            }
          : c
      )
    );
    triggerToast(`✓ Ticket assigned to ${workerName}. Contractor notified via campus dispatch.`);
  };

  const handleResolveEmergency = (emergencyId: string) => {
    setEmergencies((prev) =>
      prev.map((e) =>
        e.id === emergencyId ? { ...e, status: 'RESOLVED' } : e
      )
    );
    localStorage.removeItem('shms_active_emergency');
    triggerToast('✓ Emergency crisis marked resolved. Incident log filed for administrative review.');
  };

  const handleAddNotice = (noticeData: Partial<HostelNotice>) => {
    const newN: HostelNotice = {
      id: `hn-${Date.now()}`,
      title: noticeData.title || 'Hostel Circular',
      category: noticeData.category || 'GENERAL',
      targetAudience: noticeData.targetAudience || 'ALL_HOSTEL',
      date: 'Today',
      content: noticeData.content || '',
      isActionRequired: noticeData.isActionRequired || false,
      deliveredCount: 520,
      readCount: 142,
      actionDoneCount: 0,
      isPinned: noticeData.isPinned || false,
      smsFallbackSent: false,
    };
    setNotices([newN, ...notices]);

    try {
      const existing = localStorage.getItem('shms_campus_notices');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('shms_campus_notices', JSON.stringify([newN, ...parsed]));
    } catch (e) {}

    triggerToast('✓ Notice published! Broadcast sent to hostel student apps immediately.');
  };

  const handleAddIncident = (incidentData: any) => {
    const newInc: DisciplinaryRecord = {
      id: `disp-${Date.now()}`,
      studentId: incidentData.studentId || 'CS2023089',
      studentName: incidentData.studentName || 'Student',
      roomNumber: incidentData.roomNumber || 'A-204',
      incidentDate: incidentData.date || new Date().toISOString().split('T')[0],
      category: incidentData.type || 'CURFEW',
      severity: incidentData.severity || 'LOW',
      description: incidentData.description || 'Misconduct reported at Nilgiri complex.',
      actionTaken: incidentData.actionTaken || 'Verbal Warning Issued',
      guardianInformed: incidentData.guardianNotified ?? true,
    };
    setDisciplinary([newInc, ...disciplinary]);
    triggerToast('✓ Misconduct incident recorded in discipline ledger. Dispatched audit trail.');
  };

  const handleExportReportCsv = (report: HostelReportItem) => {
    const headers = 'Metric,Value,Status,Timestamp\n';
    const rows = [
      `Report Title,${report.name},Active,${new Date().toISOString()}`,
      `Category,${report.category},Generated,${profile.name}`,
      `Summary,${report.description},Verified,OK`,
      `Records Analyzed,${report.recordCount},Completed,Nilgiri Block A & B`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`📥 Downloading ${report.name} (CSV)...`);
  };

  // Filtered Residents
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      const matchesSearch =
        !residentSearch ||
        r.name.toLowerCase().includes(residentSearch.toLowerCase()) ||
        r.studentId.toLowerCase().includes(residentSearch.toLowerCase()) ||
        r.roomNumber.toLowerCase().includes(residentSearch.toLowerCase()) ||
        r.branch.toLowerCase().includes(residentSearch.toLowerCase()) ||
        r.phone.includes(residentSearch);

      const matchesBlock =
        residentBlockFilter === 'ALL' || r.blockName.includes(residentBlockFilter);

      const matchesFloor =
        residentFloorFilter === 'ALL' || r.roomNumber.startsWith(residentFloorFilter);

      const matchesStatus =
        residentStatusFilter === 'ALL' || r.presenceStatus === residentStatusFilter;

      return matchesSearch && matchesBlock && matchesFloor && matchesStatus;
    });
  }, [residents, residentSearch, residentBlockFilter, residentFloorFilter, residentStatusFilter]);

  // Sidebar Items Definition (Exact 16 Items from Section 5)
  const SIDEBAR_ITEMS: {
    id: WardenTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'MY_HOSTEL', label: 'My Hostel', icon: Building, badge: 'Cap: 600' },
    { id: 'RESIDENTS', label: 'Residents', icon: Users, badge: `${residents.length}` },
    { id: 'ROOMS_BEDS', label: 'Rooms & Beds', icon: BedIcon, badge: `${rooms.length}` },
    {
      id: 'LEAVE_REQUESTS',
      label: 'Leave Requests',
      icon: Calendar,
      badge: pendingLeaveCount ? `${pendingLeaveCount} New` : undefined,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'GATE_PASS',
      label: 'Gate Pass',
      icon: QrCode,
      badge: pendingGatePassCount ? `${pendingGatePassCount} New` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
    },
    {
      id: 'STUDENT_MOVEMENT',
      label: 'Student Movement',
      icon: Compass,
      badge: lateReturnsCount ? `${lateReturnsCount} Late` : `${outsideCampusCount} Out`,
      badgeColor: lateReturnsCount ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200',
    },
    { id: 'VISITORS', label: 'Visitors', icon: UserCheck, badge: `${visitors.length}` },
    {
      id: 'COMPLAINTS',
      label: 'Complaints',
      icon: MessageSquare,
      badge: openComplaintsCount ? `${openComplaintsCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'MAINTENANCE', label: 'Maintenance', icon: Wrench, badge: `${maintenanceIssuesCount}` },
    { id: 'NIGHT_ROLL_CALL', label: 'Night Roll Call', icon: Moon },
    { id: 'NOTICES', label: 'Notices', icon: Megaphone },
    { id: 'DISCIPLINE_INCIDENTS', label: 'Discipline & Incidents', icon: AlertTriangle },
    {
      id: 'EMERGENCY',
      label: 'Emergency',
      icon: Siren,
      badge: activeEmergencyAlertsCount ? 'SOS' : undefined,
      badgeColor: 'bg-rose-600 text-white font-black animate-pulse',
    },
    { id: 'REPORTS', label: 'Reports', icon: FileText },
    { id: 'PROFILE_SETTINGS', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-hidden">
      {/* =================================================================== */}
      {/* 1. WARDEN SIDEBAR (Exact WARDEN HUB)                                */}
      {/* =================================================================== */}
      <aside className="w-64 bg-[#0a192f] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none z-20">
        <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
            <Building className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-black text-white tracking-wide truncate">
              {isAdminManager ? 'ADMIN MANAGER HUB' : 'CAMPUS OPERATIONS HUB'}
            </h1>
            <p className="text-[10px] text-blue-400 font-bold truncate">
              {isAdminManager ? 'College Operations & Oversight' : 'Hostel & Residence Desk'}
            </p>
          </div>
        </div>

        {/* Profile Capsule */}
        <div
          onClick={() => setActiveTab('PROFILE_SETTINGS')}
          className="p-3 mx-3 mt-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center space-x-3 cursor-pointer hover:bg-slate-800 transition shrink-0"
        >
          <div className="relative">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'}
              alt={profile.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-600"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a192f]"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{profile.name}</p>
            <p className="text-[10px] text-sky-400 font-bold truncate">
              {isAdminManager ? 'Campus Admin Manager' : profile.designation}
            </p>
            <p className="text-[9px] text-emerald-400 font-semibold truncate">
              {isAdminManager ? 'Central Campus Administration' : 'Nilgiri (Block A & B)'}
            </p>
          </div>
        </div>

        {/* 16 Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {isAdminManager && (
            <div className="pb-2">
              <a
                href="/admin/dashboard"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2 truncate">
                  <Shield className="w-4 h-4 shrink-0 text-white" />
                  <span className="truncate">20-Module Command Center</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

          <p className="px-3 pt-2 pb-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            {isAdminManager ? 'Campus & Residence Operations' : 'Hostel Operations'}
          </p>

          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'LEAVE_REQUESTS' && activeTab === 'GATE_PASS_LEAVE' && passFilter !== 'PENDING') ||
              (item.id === 'PROFILE_SETTINGS' && activeTab === 'ACCOUNT');

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar: Help / Support & Logout */}
        <div className="p-3 border-t border-slate-800 shrink-0 space-y-1.5">
          <button
            onClick={() => setShowHelpSupport(true)}
            className="w-full flex items-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700/40"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Help / Support</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Desk</span>
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* 2. MAIN VIEWABLE CONTENT AREA                                       */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm md:text-base font-black text-slate-900">
                  Welcome back, {profile.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider hidden sm:inline ${
                  isAdminManager ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isAdminManager ? 'ADMIN MANAGER' : 'Warden'}
                </span>
                {isAdminManager && (
                  <a
                    href="/admin/dashboard"
                    className="hidden md:inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold transition ml-1"
                  >
                    <Building className="w-3 h-3" />
                    <span>20-Module Command Center</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Assigned:{' '}
                <span className="font-bold text-slate-800">
                  {isAdminManager ? 'Central Campus Administration — All Hostels & Facilities' : profile.assignedHostel}
                </span>{' '}
                {!isAdminManager && (
                  <>
                    • <span className="font-bold text-slate-800">{profile.assignedBlocks.join(' & ')}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentDate}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1.5 font-mono font-bold text-slate-900">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentTime}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setActiveTab('EMERGENCY')}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-xs ${
                activeEmergencyAlertsCount > 0
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              <Siren className="w-3.5 h-3.5 text-current" />
              <span className="hidden sm:inline">Emergency SOS</span>
              {activeEmergencyAlertsCount > 0 && (
                <span className="bg-white text-rose-700 px-1.5 py-0.2 rounded-full text-[9px]">
                  {activeEmergencyAlertsCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                {(pendingGatePassCount > 0 || pendingLeaveCount > 0 || lateReturnsCount > 0) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 rounded-full font-black text-[9px] flex items-center justify-center shadow-xs">
                    {pendingGatePassCount + pendingLeaveCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-30 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <p className="font-extrabold text-xs text-slate-900">Hostel Desk Alerts</p>
                    <span className="text-[10px] font-bold text-blue-600 cursor-pointer" onClick={() => setShowNotificationMenu(false)}>Dismiss</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
                    {pendingLeaveCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('LEAVE_REQUESTS');
                          setShowNotificationMenu(false);
                        }}
                        className="py-2 cursor-pointer hover:bg-slate-50 rounded-lg p-1.5"
                      >
                        <p className="font-bold text-indigo-700">{pendingLeaveCount} Pending Leave Requests</p>
                        <p className="text-[10px] text-slate-500">Requires Warden verification & departure stamp</p>
                      </div>
                    )}
                    {pendingGatePassCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('GATE_PASS');
                          setShowNotificationMenu(false);
                        }}
                        className="py-2 cursor-pointer hover:bg-slate-50 rounded-lg p-1.5"
                      >
                        <p className="font-bold text-amber-700">{pendingGatePassCount} Pending Gate Passes</p>
                        <p className="text-[10px] text-slate-500">Awaiting turnstile QR issuance</p>
                      </div>
                    )}
                    {lateReturnsCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('STUDENT_MOVEMENT');
                          setMovementFilter('OVERDUE');
                          setShowNotificationMenu(false);
                        }}
                        className="py-2 text-rose-600 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{lateReturnsCount} resident(s) overdue past curfew!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                  alt={profile.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="font-bold text-xs text-slate-800 hidden md:inline">
                  {profile.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-30 text-xs font-semibold">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-extrabold text-slate-900">{profile.name}</p>
                    <p className="text-[10px] text-slate-400">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('PROFILE_SETTINGS');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDigitalId(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                    <span>Digital ID Card</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowChangePassword(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change Password</span>
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-bold flex items-center space-x-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between shadow-xs animate-in slide-in-from-top z-10">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{successToast}</span>
            </span>
            <button onClick={() => setSuccessToast('')} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD (10 Exact Metric Cards from Section 7)    */}
          {/* ========================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-in fade-in">
              {lateReturnsCount > 0 && (
                <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <p className="font-black text-rose-900 text-sm">
                        Curfew Alert: {lateReturnsCount} resident(s) have not returned past 09:30 PM!
                      </p>
                      <p className="text-xs text-rose-700">
                        Turnstile verification required. Contact student & guard desk before parental notification.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('STUDENT_MOVEMENT');
                      setMovementFilter('OVERDUE');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap"
                  >
                    Verify Overdue List
                  </button>
                </div>
              )}

              {/* 10 Exact Dashboard Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div
                  onClick={() => setActiveTab('RESIDENTS')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Total Residents
                    </span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">{totalResidentsCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Nilgiri Block A & B</p>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('STUDENT_MOVEMENT');
                    setMovementFilter('PRESENT');
                  }}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-emerald-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Present
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-emerald-600 mt-2">{presentResidentsCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Inside Hostel Premises</p>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('STUDENT_MOVEMENT');
                    setMovementFilter('OUTSIDE');
                  }}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-amber-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Outside Campus
                    </span>
                    <Compass className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-600 mt-2">{outsideCampusCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Out on Approved Pass</p>
                </div>

                <div
                  onClick={() => setActiveTab('LEAVE_REQUESTS')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-indigo-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Pending Leave
                    </span>
                    <Calendar className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-black text-indigo-600 mt-2">{pendingLeaveCount}</p>
                  <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Requires Warden Review</p>
                </div>

                <div
                  onClick={() => setActiveTab('GATE_PASS')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-purple-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Gate Passes
                    </span>
                    <QrCode className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-2xl font-black text-purple-600 mt-2">{pendingGatePassCount}</p>
                  <p className="text-[10px] text-purple-600 font-bold mt-0.5">Pending QR Issuance</p>
                </div>

                <div
                  onClick={() => setActiveTab('COMPLAINTS')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-rose-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Open Complaints
                    </span>
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-2xl font-black text-rose-600 mt-2">{openComplaintsCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Plumbing, Wi-Fi, Electrical</p>
                </div>

                <div
                  onClick={() => setActiveTab('MAINTENANCE')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-orange-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Maintenance
                    </span>
                    <Wrench className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-2xl font-black text-orange-600 mt-2">{maintenanceIssuesCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Work Orders in Flight</p>
                </div>

                <div
                  onClick={() => setActiveTab('VISITORS')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-teal-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Visitors Today
                    </span>
                    <UserCheck className="w-4 h-4 text-teal-500" />
                  </div>
                  <p className="text-2xl font-black text-teal-700 mt-2">{todayVisitorsCount}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Entry Gate Verified</p>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('STUDENT_MOVEMENT');
                    setMovementFilter('OVERDUE');
                  }}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-red-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Late Returns
                    </span>
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-2xl font-black text-red-600 mt-2">{lateReturnsCount}</p>
                  <p className="text-[10px] text-red-700 font-bold mt-0.5">Overdue Past Curfew</p>
                </div>

                <div
                  onClick={() => setActiveTab('EMERGENCY')}
                  className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition cursor-pointer border-t-4 border-t-red-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Emergency Alerts
                    </span>
                    <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                  </div>
                  <p className="text-2xl font-black text-red-600 mt-2">{activeEmergencyAlertsCount}</p>
                  <p className="text-[10px] text-red-700 font-bold mt-0.5">1-Tap Dial & Crisis Hub</p>
                </div>
              </div>

              {/* Quick Action Button Strip */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-slate-900 mr-2">Warden Actions:</span>

                <button
                  onClick={() => setActiveTab('GATE_PASS')}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-blue-200"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Review Gate Passes ({pendingGatePassCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('LEAVE_REQUESTS')}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-indigo-200"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Process Leave Requests ({pendingLeaveCount})</span>
                </button>

                <button
                  onClick={() => setShowRollCallModal(true)}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-emerald-200"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Start Night Roll Call</span>
                </button>

                <button
                  onClick={() => setShowCreateNotice(true)}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-purple-200"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Broadcast Hostel Notice</span>
                </button>

                <button
                  onClick={() => setShowCreateIncident(true)}
                  className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-amber-200"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Log Misconduct / Incident</span>
                </button>

                <button
                  onClick={() => setShowEmergencyBroadcast(true)}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-rose-200"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Broadcast Emergency Alert</span>
                </button>
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <QrCode className="w-4 h-4 text-purple-600" />
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Pending Gate Passes ({pendingGatePassCount})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('GATE_PASS')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All Passes →
                    </button>
                  </div>

                  {pendingGatePassCount === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Check className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                      <p className="font-bold text-xs">All gate passes cleared!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 space-y-2">
                      {passes
                        .filter((p) => p.status === 'PENDING')
                        .slice(0, 4)
                        .map((p) => (
                          <div key={p.id} className="pt-2 flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-xs text-slate-900">{p.studentName}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                                  Room {p.roomNumber}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                                {p.destination} • {p.reason}
                              </p>
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                Out: {p.departureTime} | Return: {p.expectedReturnTime}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => setSelectedPassForAction(p)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-bold text-slate-700 cursor-pointer"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleApprovePass(p.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                Approve
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Pending Leave Requests ({pendingLeaveCount})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('LEAVE_REQUESTS')}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      View All Leaves →
                    </button>
                  </div>

                  {pendingLeaveCount === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Check className="w-8 h-8 mx-auto text-emerald-500 mb-1" />
                      <p className="font-bold text-xs">No pending leave requests!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 space-y-2">
                      {leaveRequests
                        .filter((l) => l.status === 'PENDING')
                        .slice(0, 4)
                        .map((l) => (
                          <div key={l.id} className="pt-2 flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-black text-xs text-slate-900">{l.studentName}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                  {l.leaveType}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                                Destination: {l.destination} • {l.reason}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {l.outDate} {l.outTime} → {l.returnDate} {l.returnTime}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => handleApproveLeave(l.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold shadow-xs cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(l.id, 'Parent confirmation call pending')}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-[11px] font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MY HOSTEL (Section 8: Hostel Overview)              */}
          {/* ========================================================= */}
          {activeTab === 'MY_HOSTEL' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-black text-slate-900">
                        {HOSTEL_OVERVIEW_DETAILS.name}
                      </h2>
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase">
                        {HOSTEL_OVERVIEW_DETAILS.block}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {HOSTEL_OVERVIEW_DETAILS.type} Complex • {HOSTEL_OVERVIEW_DETAILS.floorsCount} Floors • {HOSTEL_OVERVIEW_DETAILS.roomsCount} Rooms
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${HOSTEL_OVERVIEW_DETAILS.securityGatePhone}`}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>Security: {HOSTEL_OVERVIEW_DETAILS.securityGatePhone}</span>
                    </a>
                    <a
                      href={`tel:${HOSTEL_OVERVIEW_DETAILS.medicalEmergencyPhone}`}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition"
                    >
                      <Siren className="w-3.5 h-3.5 text-rose-600" />
                      <span>Ambulance: {HOSTEL_OVERVIEW_DETAILS.medicalEmergencyPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Occupancy Visualization */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between text-xs font-bold">
                    <span className="text-slate-500 uppercase tracking-wider text-[11px] font-black">
                      Overall Living Capacity
                    </span>
                    <div className="space-x-4">
                      <span className="text-slate-700">Total Capacity: <strong className="text-slate-900 font-black">{HOSTEL_OVERVIEW_DETAILS.capacity}</strong></span>
                      <span className="text-blue-600">Occupied: <strong className="font-black">{HOSTEL_OVERVIEW_DETAILS.occupancy}</strong> (86.7%)</span>
                      <span className="text-emerald-600">Available: <strong className="font-black">{HOSTEL_OVERVIEW_DETAILS.availableBeds}</strong> (13.3%)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-2xl h-4 overflow-hidden flex">
                    <div
                      className="bg-blue-600 h-full transition-all"
                      style={{ width: `${(HOSTEL_OVERVIEW_DETAILS.occupancy / HOSTEL_OVERVIEW_DETAILS.capacity) * 100}%` }}
                      title="Occupied Beds"
                    ></div>
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{ width: `${(HOSTEL_OVERVIEW_DETAILS.availableBeds / HOSTEL_OVERVIEW_DETAILS.capacity) * 100}%` }}
                      title="Available Vacant Beds"
                    ></div>
                  </div>

                  <div className="flex items-center space-x-6 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>Occupied ({HOSTEL_OVERVIEW_DETAILS.occupancy} Beds)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Available ({HOSTEL_OVERVIEW_DETAILS.availableBeds} Beds)</span>
                    </span>
                  </div>
                </div>

                {/* Floor-wise Matrix */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900">Floor-wise Occupancy Matrix</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {HOSTEL_OVERVIEW_DETAILS.floors.map((floor) => {
                      const pct = Math.round((floor.occupied / floor.capacity) * 100);
                      return (
                        <div key={floor.floor} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900">Floor {floor.floor}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {floor.rooms} Rooms
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="text-slate-500 font-medium">{floor.occupied} / {floor.capacity} Beds</span>
                            <span className="font-bold text-slate-800">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            {floor.available} Vacant Bed(s) Available ({floor.status})
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Room-wise Status Breakdown & Block Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Room Status Summary (150 Rooms)
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Fully Occupied</span>
                        <span className="text-base font-black text-slate-900">
                          {rooms.filter((r) => r.occupiedCount >= r.capacity).length} Rooms
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Partially Occupied</span>
                        <span className="text-base font-black text-blue-600">
                          {rooms.filter((r) => r.occupiedCount > 0 && r.occupiedCount < r.capacity).length} Rooms
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Completely Vacant</span>
                        <span className="text-base font-black text-emerald-600">
                          {rooms.filter((r) => r.occupiedCount === 0 && r.status !== 'MAINTENANCE').length} Rooms
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Under Maintenance</span>
                        <span className="text-base font-black text-amber-600">
                          {rooms.filter((r) => r.status === 'MAINTENANCE').length} Rooms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Block Operational Health
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900">Nilgiri Block A (Rooms 101 - 338)</p>
                          <p className="text-[10px] text-slate-500">Power: Normal • Water: RO Online • Wi-Fi 5GHz: Optimal</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          NORMAL
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900">Nilgiri Block B (Rooms 101 - 338)</p>
                          <p className="text-[10px] text-slate-500">Water Supply: Normal • Passenger Lift B: Servicing</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                          LIFT MAINT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: RESIDENTS (Section 9: Residents Directory)         */}
          {/* ========================================================= */}
          {activeTab === 'RESIDENTS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Hostel Residents Directory ({filteredResidents.length} / {residents.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Restricted to assigned complex: Nilgiri Residence (Block A & B)
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setResidentSearch('');
                        setResidentBlockFilter('ALL');
                        setResidentFloorFilter('ALL');
                        setResidentStatusFilter('ALL');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name, roll, room, branch, phone..."
                      value={residentSearch}
                      onChange={(e) => setResidentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={residentBlockFilter}
                    onChange={(e) => setResidentBlockFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Blocks (A & B)</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                  </select>

                  <select
                    value={residentFloorFilter}
                    onChange={(e) => setResidentFloorFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Floors</option>
                    <option value="A-1">Floor 1</option>
                    <option value="A-2">Floor 2</option>
                    <option value="A-3">Floor 3</option>
                  </select>

                  <select
                    value={residentStatusFilter}
                    onChange={(e) => setResidentStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="IN_HOSTEL">In Hostel</option>
                    <option value="OUT_ON_PASS">Out on Pass</option>
                    <option value="ON_LEAVE">On Approved Leave</option>
                    <option value="OVERDUE">Overdue Return</option>
                  </select>
                </div>
              </div>

              {/* Resident Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Resident</th>
                        <th className="py-3 px-4">Student ID / Roll</th>
                        <th className="py-3 px-4">Branch & Sem</th>
                        <th className="py-3 px-4">Room & Bed</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4">Leave Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredResidents.map((r) => {
                        const isOut = r.presenceStatus === 'OUT_ON_PASS';
                        const isLeave = r.presenceStatus === 'ON_LEAVE';
                        const isOverdue = r.presenceStatus === 'OVERDUE';

                        return (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={r.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                                  alt={r.name}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <p className="font-extrabold text-slate-900">{r.name}</p>
                                  <p className="text-[10px] text-slate-400">{r.blockName}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-slate-900">{r.studentId}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800">{r.branch}</span>
                              <span className="block text-[10px] text-slate-500">
                                {r.semester || (r.year ? `Year ${r.year}` : 'Active')}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                                {r.roomNumber} (Bed {r.bedNumber})
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <a href={`tel:${r.phone}`} className="text-blue-600 font-mono font-bold hover:underline">
                                {r.phone}
                              </a>
                            </td>

                            <td className="py-3 px-4">
                              {isOverdue ? (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-[10px]">
                                  OVERDUE
                                </span>
                              ) : isLeave ? (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-black text-[10px]">
                                  ON LEAVE
                                </span>
                              ) : isOut ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px]">
                                  OUT ON PASS
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                                  IN HOSTEL
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              {isLeave ? (
                                <span className="text-[11px] font-bold text-indigo-700">
                                  Approved Leave Active
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">No Active Leave</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedResidentForDrawer(r)}
                                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition cursor-pointer border border-blue-200"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: ROOMS & BEDS (Section 11)                           */}
          {/* ========================================================= */}
          {activeTab === 'ROOMS_BEDS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Rooms & Bed Allocations
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nilgiri Residence • Capacity: 4 Beds per Room • Block A & B
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={selectedRoomFloor}
                    onChange={(e) => setSelectedRoomFloor(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Floors</option>
                    <option value="1">1st Floor</option>
                    <option value="2">2nd Floor</option>
                    <option value="3">3rd Floor</option>
                  </select>
                </div>
              </div>

              {/* Room Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms
                  .filter((rm) => selectedRoomFloor === 'ALL' || rm.floor.toString() === selectedRoomFloor)
                  .map((room) => {
                    const isFull = room.occupiedCount >= room.capacity;
                    const isMaint = room.status === 'MAINTENANCE';

                    return (
                      <div
                        key={room.roomNumber}
                        className={`p-5 rounded-3xl border transition bg-white shadow-2xs space-y-3 ${
                          isMaint ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div>
                            <span className="font-black text-sm text-slate-900">Room {room.roomNumber}</span>
                            <span className="text-[10px] text-slate-400 block">{room.blockName} • Floor {room.floor}</span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isMaint
                                ? 'bg-amber-100 text-amber-800'
                                : isFull
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {room.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Bed slots visualization */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase">
                            Bed Allocation ({room.occupiedCount} / {room.capacity} Occupied)
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {room.beds.map((b) => (
                              <div
                                key={b.bedNumber}
                                className={`p-2 rounded-xl border text-[11px] ${
                                  b.isOccupied
                                    ? 'bg-blue-50/60 border-blue-200 text-blue-900'
                                    : 'bg-slate-50 border-slate-200 text-slate-400 border-dashed'
                                }`}
                              >
                                <span className="font-bold">Bed {b.bedNumber}: </span>
                                {b.isOccupied ? (
                                  <span className="font-extrabold text-slate-900 block truncate">
                                    {b.residentName || 'Assigned'}
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-bold block">Available</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Room Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: `Room ${room.roomNumber} Maintenance Toggle`,
                                message: `Are you sure you want to mark Room ${room.roomNumber} as ${isMaint ? 'Available' : 'Under Maintenance'}? Any ongoing room bed allocations will be locked.`,
                                confirmLabel: isMaint ? 'Mark Available' : 'Mark Maintenance',
                                isDanger: !isMaint,
                                onConfirm: () => {
                                  setRooms((prev) =>
                                    prev.map((r) =>
                                      r.roomNumber === room.roomNumber
                                        ? { ...r, status: isMaint ? 'PARTIALLY_OCCUPIED' : 'MAINTENANCE' }
                                        : r
                                    )
                                  );
                                  triggerToast(`✓ Room ${room.roomNumber} status updated to ${isMaint ? 'Available' : 'Maintenance'}.`);
                                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                },
                              });
                            }}
                            className="text-amber-700 hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            {isMaint ? 'Remove Maintenance' : 'Mark Maintenance'}
                          </button>

                          <button
                            onClick={() => {
                              const residentInRoom = residents.find((r) => r.roomNumber === room.roomNumber);
                              if (residentInRoom) {
                                setSelectedResidentForDrawer(residentInRoom);
                              } else {
                                triggerToast(`Room ${room.roomNumber} currently has no active registered resident.`);
                              }
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] cursor-pointer"
                          >
                            View Residents
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: LEAVE REQUESTS (Section 12)                         */}
          {/* ========================================================= */}
          {activeTab === 'LEAVE_REQUESTS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Resident Leave Requests ({leaveRequests.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Syncs directly with Student Platform leave applications
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setLeaveFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        leaveFilter === filter
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leave Requests Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Room & Hostel</th>
                        <th className="py-3 px-4">Leave Type</th>
                        <th className="py-3 px-4">Reason & Destination</th>
                        <th className="py-3 px-4">Out Date / Time</th>
                        <th className="py-3 px-4">Return Date / Time</th>
                        <th className="py-3 px-4">Parent Status</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {leaveRequests
                        .filter((l) => leaveFilter === 'ALL' || l.status === leaveFilter)
                        .map((l) => (
                          <tr key={l.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              <p className="font-extrabold text-slate-900">{l.studentName}</p>
                              <span className="font-mono text-[10px] text-slate-400">{l.studentId}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800">{l.roomNumber}</span>
                              <span className="block text-[10px] text-slate-400">{l.hostelName}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                                {l.leaveType}
                              </span>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <p className="font-bold text-slate-800 truncate">{l.destination}</p>
                              <p className="text-[10px] text-slate-500 truncate">{l.reason}</p>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800">{l.outDate}</span>
                              <span className="block text-[10px] text-slate-400">{l.outTime}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800">{l.returnDate}</span>
                              <span className="block text-[10px] text-slate-400">{l.returnTime}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                {l.guardianConsent}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  l.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : l.status === 'REJECTED'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              {l.status === 'PENDING' ? (
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => handleApproveLeave(l.id)}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectLeave(l.id, 'Parent confirmation call pending')}
                                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-[11px] cursor-pointer"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Processed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: GATE PASS (Section 13)                              */}
          {/* ========================================================= */}
          {activeTab === 'GATE_PASS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Gate Pass & Turnstile Clearance ({passes.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curfew limit: 09:30 PM • Generates encrypted QR passes for turnstile barrier
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['PENDING', 'OUT', 'OVERDUE', 'APPROVED', 'RETURNED', 'ALL'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setPassFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        passFilter === filter
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passes List / Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Pass Type</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Destination & Reason</th>
                        <th className="py-3 px-4">Departure Time</th>
                        <th className="py-3 px-4">Expected In</th>
                        <th className="py-3 px-4">Turnstile QR</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {passes
                        .filter((p) => passFilter === 'ALL' || p.status === passFilter)
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4">
                              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                                {p.type.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <p className="font-extrabold text-slate-900">{p.studentName}</p>
                              <span className="font-mono text-[10px] text-slate-400">{p.studentId}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800">{p.roomNumber}</span>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <p className="font-bold text-slate-800 truncate">{p.destination}</p>
                              <p className="text-[10px] text-slate-500 truncate">{p.reason}</p>
                            </td>

                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {p.departureTime || '—'}
                            </td>

                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {p.expectedReturnTime}
                            </td>

                            <td className="py-3 px-4">
                              {p.qrToken ? (
                                <button
                                  onClick={() => setSelectedPassForQr(p)}
                                  className="flex items-center space-x-1 text-blue-600 hover:underline font-mono text-[10px] cursor-pointer"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>{p.qrToken.slice(0, 10)}...</span>
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Pending Approval</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  p.status === 'APPROVED' || p.status === 'RETURNED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.status === 'OUT'
                                    ? 'bg-blue-100 text-blue-800'
                                    : p.status === 'OVERDUE'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                {p.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => handleApprovePass(p.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectPass(p.id, 'Hostel curfew limit conflict')}
                                      className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-bold text-[11px] cursor-pointer"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {p.status === 'APPROVED' && (
                                  <button
                                    onClick={() => handleRevokePass(p.id)}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-bold text-[11px] cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                )}

                                {p.qrToken && (
                                  <button
                                    onClick={() => setSelectedPassForQr(p)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer flex items-center space-x-1"
                                    title="View Turnstile QR"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>QR</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: STUDENT MOVEMENT (Section 14)                       */}
          {/* ========================================================= */}
          {activeTab === 'STUDENT_MOVEMENT' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Real-time Student Movement & Curfew Tracker
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curfew Deadline: 09:30 PM • Monitored via Main Gate Turnstile
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(['ALL', 'PRESENT', 'OUTSIDE', 'ON_LEAVE', 'OVERDUE'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMovementFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        movementFilter === filter
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filter === 'ALL' ? 'All Movement' : filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {lateReturnsCount > 0 && (
                <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-amber-900 text-sm">
                        Return overdue — verification required ({lateReturnsCount} resident(s))
                      </p>
                      <p className="text-xs text-amber-800">
                        Curfew closed at 09:30 PM. Please verify student status with security gate before initiating parental calls.
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:+919437088214"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Security Desk</span>
                  </a>
                </div>
              )}

              {/* Movement Records Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Room & Block</th>
                        <th className="py-3 px-4">Movement Status</th>
                        <th className="py-3 px-4">Out Time</th>
                        <th className="py-3 px-4">Expected In (Curfew)</th>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4 text-right">Verification Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {movementRecords
                        .filter((m) => movementFilter === 'ALL' || m.status === movementFilter)
                        .map((m) => {
                          const isOverdue = m.status === 'OVERDUE';
                          const isOut = m.status === 'OUTSIDE';

                          return (
                            <tr key={m.id} className={`hover:bg-slate-50 transition ${isOverdue ? 'bg-rose-50/30' : ''}`}>
                              <td className="py-3 px-4">
                                <p className="font-extrabold text-slate-900">{m.name}</p>
                                <span className="font-mono text-[10px] text-slate-400">{m.studentId}</span>
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-800">{m.roomNumber}</span>
                                <span className="block text-[10px] text-slate-400">{m.blockName}</span>
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    isOverdue
                                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                                      : isOut
                                      ? 'bg-amber-100 text-amber-800'
                                      : m.status === 'ON_LEAVE'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {m.status.replace('_', ' ')}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                {m.exitTime || '—'}
                              </td>

                              <td className="py-3 px-4 font-mono font-bold text-slate-800">
                                {m.expectedReturnTime || '09:30 PM'}
                              </td>

                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-800">{m.destination || 'Campus Premises'}</span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <a
                                    href={`tel:${m.phone}`}
                                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                                    title="Call Student"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>Student</span>
                                  </a>

                                  <a
                                    href={`tel:${m.guardianPhone}`}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1"
                                    title="Call Guardian"
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                    <span>Guardian</span>
                                  </a>

                                  {isOverdue && (
                                    <button
                                      onClick={() => {
                                        setMovementRecords((prev) =>
                                          prev.map((rec) =>
                                            rec.id === m.id ? { ...rec, status: 'PRESENT' } : rec
                                          )
                                        );
                                        triggerToast(`✓ Verified return of ${m.name} at Nilgiri desk.`);
                                      }}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                    >
                                      Mark In
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: VISITORS (Section 15)                               */}
          {/* ========================================================= */}
          {activeTab === 'VISITORS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Visitors Registry ({visitors.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visiting Hours: 10:00 AM - 07:00 PM • Parents & Authorized Guests Only
                  </p>
                </div>
              </div>

              {/* Visitors Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Visitor</th>
                        <th className="py-3 px-4">Relation</th>
                        <th className="py-3 px-4">Student Visited</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Purpose</th>
                        <th className="py-3 px-4">Date & Slot</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {visitors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-extrabold text-slate-900">{v.visitorName}</td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 font-bold border border-teal-200">
                              {v.relation}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-800">{v.studentName}</td>

                          <td className="py-3 px-4 font-bold text-blue-600">{v.roomNumber}</td>

                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{v.phone}</td>

                          <td className="py-3 px-4 max-w-xs truncate text-slate-600">{v.purpose}</td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800">{v.date}</span>
                            <span className="block text-[10px] text-slate-400">{v.entryTime}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                v.status === 'APPROVED' || v.status === 'Checked In'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.status === 'Checked Out'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            {v.status === 'Expected' && (
                              <button
                                onClick={() => {
                                  setVisitors((prev) =>
                                    prev.map((vis) =>
                                      vis.id === v.id ? { ...vis, status: 'Checked In' } : vis
                                    )
                                  );
                                  triggerToast(`✓ Checked in visitor ${v.visitorName}. Entry pass generated.`);
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Check In
                              </button>
                            )}

                            {v.status === 'Checked In' && (
                              <button
                                onClick={() => {
                                  setVisitors((prev) =>
                                    prev.map((vis) =>
                                      vis.id === v.id ? { ...vis, status: 'Checked Out' } : vis
                                    )
                                  );
                                  triggerToast(`✓ Checked out ${v.visitorName}. Visit completed.`);
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Check Out
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: COMPLAINTS (Section 16)                             */}
          {/* ========================================================= */}
          {activeTab === 'COMPLAINTS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Maintenance & Grievances ({complaints.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct integration with Student Platform complaint tickets
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={complaintCategoryFilter}
                    onChange={(e) => setComplaintCategoryFilter(e.target.value)}
                    className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="WIFI_INTERNET">Wi-Fi & Internet</option>
                    <option value="CLEANING">Cleaning & Hygiene</option>
                    <option value="FURNITURE">Furniture</option>
                  </select>
                </div>
              </div>

              {/* Complaints Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Ticket</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Student & Room</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Assigned Worker</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {complaints
                        .filter((c) => complaintCategoryFilter === 'ALL' || c.category === complaintCategoryFilter)
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.ticketNumber}</td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                                {c.category.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <p className="font-extrabold text-slate-900">{c.studentName}</p>
                              <span className="text-[10px] text-slate-400 font-bold">Room {c.roomNumber}</span>
                            </td>

                            <td className="py-3 px-4 max-w-xs truncate">{c.description}</td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  c.priority === 'CRITICAL' || c.priority === 'EMERGENCY'
                                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                                    : c.priority === 'HIGH'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {c.priority}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              {c.assignedTo ? (
                                <span className="font-bold text-slate-800">{c.assignedTo}</span>
                              ) : (
                                <span className="text-rose-600 font-bold text-[10px]">Unassigned</span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  c.status === 'RESOLVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : c.status === 'ASSIGNED'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedComplaintToAssign(c)}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold text-[11px] cursor-pointer"
                                >
                                  {c.assignedTo ? 'Reassign' : 'Assign'}
                                </button>

                                {c.status !== 'RESOLVED' && (
                                  <button
                                    onClick={() => {
                                      setComplaints((prev) =>
                                        prev.map((comp) =>
                                          comp.id === c.id ? { ...comp, status: 'RESOLVED' } : comp
                                        )
                                      );
                                      triggerToast(`✓ Ticket ${c.ticketNumber} marked resolved. Student notified.`);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: MAINTENANCE (Section 17: Work Orders)              */}
          {/* ========================================================= */}
          {activeTab === 'MAINTENANCE' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Maintenance Work Orders ({maintenanceTickets.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Coordination for common areas, washrooms, RO purifiers, lifts & pest control
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {(['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMaintenanceFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        maintenanceFilter === filter
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {filter.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Maintenance Tickets Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Work Order</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Assigned Worker</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {maintenanceTickets
                        .filter((m) => maintenanceFilter === 'ALL' || m.status === maintenanceFilter)
                        .map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{m.ticketNumber}</td>

                            <td className="py-3 px-4 font-bold text-slate-800">
                              {m.blockName} - Room {m.roomNumber}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-200">
                                {m.category}
                              </span>
                            </td>

                            <td className="py-3 px-4 max-w-xs truncate text-slate-600">{m.description}</td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  m.priority === 'CRITICAL'
                                    ? 'bg-rose-100 text-rose-800'
                                    : m.priority === 'HIGH'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {m.priority}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-bold text-slate-800">
                              {m.assignedStaffName || 'Unassigned'}
                            </td>

                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {m.updatedAt || 'Standard SLA'}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                  m.status === 'RESOLVED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : m.status === 'IN_PROGRESS'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {m.status.replace('_', ' ')}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              {m.status !== 'RESOLVED' ? (
                                <button
                                  onClick={() => {
                                    setMaintenanceTickets((prev) =>
                                      prev.map((t) =>
                                        t.id === m.id ? { ...t, status: 'RESOLVED' } : t
                                      )
                                    );
                                    triggerToast(`✓ Work Order ${m.ticketNumber} marked resolved.`);
                                  }}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                                >
                                  Mark Done
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Completed</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: NIGHT ROLL CALL (Section 18)                       */}
          {/* ========================================================= */}
          {activeTab === 'NIGHT_ROLL_CALL' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Night Attendance & Verification (Curfew 09:30 PM)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conducted nightly across Block A & Block B (Ground to 3rd Floor)
                  </p>
                </div>

                <button
                  onClick={() => setShowRollCallModal(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <Moon className="w-4 h-4" />
                  <span>Start Night Roll Call</span>
                </button>
              </div>

              {/* Attendance Statistics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Total Residents</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">520</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Present Inside</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">497</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase">On Gate Pass</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">15</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase">On Approved Leave</span>
                  <p className="text-2xl font-black text-indigo-600 mt-1">5</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Absent / Unverified</span>
                  <p className="text-2xl font-black text-rose-600 mt-1">3</p>
                </div>
              </div>

              {/* Roll Call Submission History */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900">
                  Recent Roll Call Logs
                </h4>
                <div className="space-y-3">
                  {rollCalls.map((rc) => (
                    <div
                      key={rc.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900">{rc.date}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            {rc.timeTaken}
                          </span>
                          <span className="text-slate-500 font-bold">{rc.blockName}</span>
                        </div>
                        <p className="text-slate-500 mt-1">
                          Conducted by {rc.conductedBy} • Total Audited: {rc.totalResidents}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-emerald-700 font-bold">✓ {rc.presentCount} Present</span>
                        <span className="text-blue-700 font-bold">🎫 {rc.onPassCount} On Pass</span>
                        <span className="text-rose-700 font-bold">✗ {rc.absentCount} Absent</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: NOTICES (Section 19: Hostel Notices)               */}
          {/* ========================================================= */}
          {activeTab === 'NOTICES' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Notices & Circulars ({notices.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Broadcasted immediately to student mobile apps and notice boards
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateNotice(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Publish New Notice</span>
                </button>
              </div>

              {/* Notices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className={`p-6 rounded-3xl border transition bg-white shadow-2xs space-y-3 ${
                      n.isPinned ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                        {n.category.replace('_', ' ')}
                      </span>
                      {n.isPinned && (
                        <span className="text-[10px] font-black text-amber-600 flex items-center space-x-1">
                          <span>📌 PINNED</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-base text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Target: {n.targetAudience}</span>
                      <span>Audience Reach: {n.deliveredCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 13: DISCIPLINE & INCIDENTS (Section 20)                */}
          {/* ========================================================= */}
          {activeTab === 'DISCIPLINE_INCIDENTS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Discipline & Misconduct Registry ({disciplinary.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curfew violations, unauthorized guests, noise disruption & disciplinary actions
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateIncident(true)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Record Misconduct Incident</span>
                </button>
              </div>

              {/* Incidents Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Incident Type</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Action Taken</th>
                        <th className="py-3 px-4">Guardian Notified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {disciplinary.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-extrabold text-slate-900">{d.studentName}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{d.roomNumber}</td>
                          <td className="py-3 px-4 font-mono">{d.incidentDate}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                              {d.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                d.severity === 'CRITICAL' || d.severity === 'HIGH'
                                  ? 'bg-rose-100 text-rose-800'
                                  : d.severity === 'MEDIUM'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {d.severity}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600">{d.description}</td>
                          <td className="py-3 px-4 font-bold text-blue-700">{d.actionTaken}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                d.guardianInformed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {d.guardianInformed ? 'YES' : 'NO'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 14: EMERGENCY (Section 21: High Priority Crisis Hub)   */}
          {/* ========================================================= */}
          {activeTab === 'EMERGENCY' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-950 text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-rose-500/40 relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 text-xs font-black uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping"></span>
                      <span>High Priority Crisis & Incident Response Hub</span>
                    </div>

                    <button
                      onClick={() => setShowEmergencyBroadcast(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center space-x-1.5"
                    >
                      <Flame className="w-4 h-4 fill-white" />
                      <span>Broadcast Emergency Instructions</span>
                    </button>
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                      <Siren className="w-7 h-7 text-rose-400 animate-bounce" />
                      <span>Hostel Emergency Desk (Nilgiri Block A & B)</span>
                    </h2>
                    <p className="text-xs md:text-sm text-rose-100 max-w-2xl leading-relaxed mt-1">
                      Direct single-tap response system for medical trauma, fire alerts, facility breakdowns, and immediate safety interventions.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Tap Emergency Direct Contacts Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <a
                  href="tel:+919437000108"
                  className="p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs hover:shadow-md transition flex items-center space-x-3 text-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                    <Siren className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-rose-900">24x7 Ambulance</p>
                    <p className="text-xs font-mono font-bold text-rose-600">+91 94370 00108</p>
                    <p className="text-[10px] text-slate-400">Campus Pharmacy Post</p>
                  </div>
                </a>

                <a
                  href="tel:+919437088214"
                  className="p-4 rounded-2xl bg-white border border-blue-200 shadow-2xs hover:shadow-md transition flex items-center space-x-3 text-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-blue-900">Main Campus Security</p>
                    <p className="text-xs font-mono font-bold text-blue-600">+91 94370 88214</p>
                    <p className="text-[10px] text-slate-400">Turnstile & Barrier Desk</p>
                  </div>
                </a>

                <a
                  href="tel:+919437088990"
                  className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs hover:shadow-md transition flex items-center space-x-3 text-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-emerald-900">Subham Guardian</p>
                    <p className="text-xs font-mono font-bold text-emerald-600">+91 94370 88990</p>
                    <p className="text-[10px] text-slate-400">Parental Direct Contact</p>
                  </div>
                </a>

                <div
                  onClick={() => setShowEmergencyBroadcast(true)}
                  className="p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs hover:shadow-md transition flex items-center space-x-3 cursor-pointer text-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-purple-900">Nilgiri Siren Beacon</p>
                    <p className="text-xs font-bold text-purple-600">Broadcast Alert</p>
                    <p className="text-[10px] text-slate-400">Instant notification to all</p>
                  </div>
                </div>
              </div>

              {/* Active Emergency Incident Cards */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900">Active Emergency Incidents</h3>
                {emergencies.map((em) => (
                  <div
                    key={em.id}
                    className="p-6 rounded-3xl bg-white border-2 border-rose-400 shadow-md space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase">
                            {em.type}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">
                            Location: {em.blockName} {em.roomNumber ? `Room ${em.roomNumber}` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Reported by: <strong className="text-slate-900">{em.studentName || 'Student'}</strong> • Reported at {em.timestamp}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href="tel:+919876543210"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Student</span>
                        </a>
                        <a
                          href="tel:+919437000108"
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                        >
                          <Siren className="w-3.5 h-3.5" />
                          <span>Dispatch Ambulance</span>
                        </a>
                        <button
                          onClick={() => handleResolveEmergency(em.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Resolve & Clear
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{em.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 15: REPORTS (Section 22: 11 Official Reports)          */}
          {/* ========================================================= */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Hostel Operational Reports & Registers ({reportsList.length} Pre-built)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Export verified administrative logs for Principal, Chief Warden & Audit
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Page</span>
                  </button>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportsList.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {rep.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {rep.recordCount} records
                        </span>
                      </div>

                      <h4 className="font-black text-sm text-slate-900">{rep.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{rep.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">Auto-generated daily</span>
                      <button
                        onClick={() => handleExportReportCsv(rep)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 16: PROFILE & SETTINGS (Section 23)                    */}
          {/* ========================================================= */}
          {(activeTab === 'PROFILE_SETTINGS' || activeTab === 'ACCOUNT') && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                  <div className="relative">
                    <img
                      src={profile.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                      alt={profile.name}
                      className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-100 shadow-md"
                    />
                    <button
                      onClick={() => setShowEditProfile(true)}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer"
                      title="Update Profile Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                        {profile.empId}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-600">{profile.designation}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {profile.assignedHostel} • {profile.officeRoom}
                    </p>
                    <p className="text-xs text-slate-600 pt-2 max-w-xl leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                  >
                    <span>Edit Profile & Bio</span>
                  </button>
                  <button
                    onClick={() => setShowDigitalId(true)}
                    className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Digital ID Card</span>
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Key className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>

              {/* Hostel Operational Rules & Configuration Settings (Section 23) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    Hostel Operational Timing Rules
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Hostel Curfew Limit</span>
                        <span className="text-[10px] text-slate-500">Main gate turnstiles lock automatically</span>
                      </div>
                      <span className="font-mono font-black text-rose-600 text-sm">09:30 PM</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Night Roll Call Timing</span>
                        <span className="text-[10px] text-slate-500">Daily verification across all floors</span>
                      </div>
                      <span className="font-mono font-black text-blue-600 text-sm">09:40 PM</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Hostel Quiet Hours</span>
                        <span className="text-[10px] text-slate-500">Strict noise & loudspeaker restriction</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800">11:00 PM - 06:00 AM</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Guest & Visitor Window</span>
                        <span className="text-[10px] text-slate-500">Allowed visitation in common lobby</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800">10:00 AM - 07:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                    Emergency Escalation Protocols
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-rose-900 block">Campus Medical Center</span>
                        <span className="text-[10px] text-rose-700">24x7 Ambulance & Emergency Duty Doctor</span>
                      </div>
                      <a href="tel:+919437000108" className="font-mono font-black text-rose-600 hover:underline">
                        +91 94370 00108
                      </a>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Dean Student Affairs (Hostels)</span>
                        <span className="text-[10px] text-slate-500">Administrative Escalation</span>
                      </div>
                      <a href="tel:+919437144520" className="font-mono font-black text-slate-800 hover:underline">
                        +91 94371 44520
                      </a>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 block">Campus Security Office</span>
                        <span className="text-[10px] text-slate-500">Turnstile Barrier & Perimeter Patrol</span>
                      </div>
                      <a href="tel:+919437088214" className="font-mono font-black text-slate-800 hover:underline">
                        +91 94370 88214
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MODALS AND DRAWERS SUITE                               */}
      {/* ========================================================= */}

      {/* 1. Student Profile Drawer (Requirement 10) */}
      <StudentProfileDrawer
        resident={selectedResidentForDrawer}
        isOpen={!!selectedResidentForDrawer}
        onClose={() => setSelectedResidentForDrawer(null)}
        onAction={(action) => {
          if (action === 'LEAVE') {
            setActiveTab('LEAVE_REQUESTS');
            setSelectedResidentForDrawer(null);
          } else if (action === 'PASS') {
            setActiveTab('GATE_PASS');
            setSelectedResidentForDrawer(null);
          } else if (action === 'COMPLAINT') {
            setActiveTab('COMPLAINTS');
            setSelectedResidentForDrawer(null);
          } else if (action === 'MOVEMENT') {
            setActiveTab('STUDENT_MOVEMENT');
            setSelectedResidentForDrawer(null);
          }
        }}
      />

      {/* 2. Gate Pass QR Display Modal */}
      <GatePassQrModal
        pass={selectedPassForQr}
        isOpen={!!selectedPassForQr}
        onClose={() => setSelectedPassForQr(null)}
      />

      {/* 3. Pass Action Modal */}
      {selectedPassForAction && (
        <PassActionModal
          pass={selectedPassForAction}
          isOpen={!!selectedPassForAction}
          onClose={() => setSelectedPassForAction(null)}
          onApprove={(passId) => {
            handleApprovePass(passId);
            setSelectedPassForAction(null);
          }}
          onReject={(passId, reason) => {
            handleRejectPass(passId, reason);
            setSelectedPassForAction(null);
          }}
          onSendGuardianAlert={(studentName, phoneNum) => {
            triggerToast(`📞 Connecting call to guardian of ${studentName}: ${phoneNum}`);
          }}
        />
      )}

      {/* 4. Night Roll Call Register Modal */}
      <RollCallModal
        isOpen={showRollCallModal}
        onClose={() => setShowRollCallModal(false)}
        blockName="Nilgiri Block A & B"
        residents={residents.map((r) => ({
          studentId: r.studentId,
          name: r.name,
          roomNumber: r.roomNumber,
          status: (r.presenceStatus === 'OUT_ON_PASS' ? 'ON_PASS' : 'PRESENT') as 'PRESENT' | 'ABSENT' | 'ON_PASS',
        }))}
        onSaveRollCall={handleSaveRollCall}
      />

      {/* 5. Create Incident Modal */}
      <CreateIncidentModal
        isOpen={showCreateIncident}
        onClose={() => setShowCreateIncident(false)}
        onSubmit={handleAddIncident}
      />

      {/* 6. Assign Complaint Modal */}
      {selectedComplaintToAssign && (
        <AssignComplaintModal
          complaint={selectedComplaintToAssign}
          isOpen={!!selectedComplaintToAssign}
          onClose={() => setSelectedComplaintToAssign(null)}
          staffList={staff}
          onAssign={(complaintId, workerName, notes) => {
            handleAssignTechnician(complaintId, workerName, notes);
            setSelectedComplaintToAssign(null);
          }}
        />
      )}

      {/* 7. Create Hostel Notice Modal */}
      <CreateNoticeModal
        isOpen={showCreateNotice}
        onClose={() => setShowCreateNotice(false)}
        onPublish={handleAddNotice}
      />

      {/* 8. Emergency Broadcast Modal */}
      <EmergencyBroadcastModal
        isOpen={showEmergencyBroadcast}
        onClose={() => setShowEmergencyBroadcast(false)}
        onBroadcast={() => {
          triggerToast('🚨 Emergency broadcast dispatched to hostel residents');
          setShowEmergencyBroadcast(false);
        }}
      />

      {/* 9. Help & Support Modal */}
      <HelpSupportModal
        isOpen={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      {/* 10. Confirmation Action Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />

      {/* 11. Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          triggerToast('✓ Warden profile updated successfully.');
        }}
      />

      {/* 12. Digital ID Card Modal */}
      <DigitalIdCardModal
        isOpen={showDigitalId}
        onClose={() => setShowDigitalId(false)}
        profile={profile}
      />

      {/* 13. Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={(msg) => {
          triggerToast(msg);
        }}
      />
    </div>
  );
}
