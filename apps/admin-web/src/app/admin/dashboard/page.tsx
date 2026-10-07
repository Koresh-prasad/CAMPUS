'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import RoleGuard from '../../../components/RoleGuard';
import StudentManagementView from '../../../components/StudentManagementView';
import HostelManagementView from '../../../components/HostelManagementView';
import HostelLeaveGatePassView from '../../../components/HostelLeaveGatePassView';
import WardenSecurityView from '../../../components/WardenSecurityView';
import MedicalCareView from '../../../components/MedicalCareView';
import EmergencyView from '../../../components/EmergencyView';
import CollegeProfileView from '../../../components/CollegeProfileView';
import AdminOperatorManagementView from '../../../components/AdminOperatorManagementView';
import CampusServicesView from '../../../components/CampusServicesView';
import NotificationsView from '../../../components/NotificationsView';
import SettingsView from '../../../components/SettingsView';
import AdminGrievanceDeskView from '../../../components/AdminGrievanceDeskView';
import AdminCentralizedReportsView from '../../../components/AdminCentralizedReportsView';
import AdminAuditLogsView from '../../../components/AdminAuditLogsView';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building,
  BookOpen,
  UserCheck,
  Shield,
  Bell,
  Bed,
  MapPin,
  ShieldAlert,
  Heart,
  TrendingUp,
  Settings,
  FileText,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Activity,
  AlertTriangle,
  Award,
  ChevronRight,
  Globe,
  Calendar,
  ExternalLink,
  HelpCircle,
  PhoneCall,
  Utensils,
  Megaphone,
  Headphones,
  Pin,
  Camera,
  Wrench,
  User,
  Car,
  Package,
  Ambulance,
  UserPlus,
  BellRing,
} from 'lucide-react';
import { DASHBOARD_MOCK } from '../../../data/dashboardMock';
import {
  AdminStaffRolesView,
  AdminSecurityManagementView,
  AdminServiceMaintenanceView,
  AdminMedicalManagementView,
  AdminVisitorManagementView,
  AdminMessManagementView,
  AdminCalendarView,
  AdminCampusContactsView,
  AdminMyProfileView,
} from './adminComponents';

const API_BASE = '/api';

export default function AdminDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={['DIRECTOR', 'ADMIN', 'ADMIN_MANAGER', 'STAFF', 'WARDEN']}
      portalTitle="Admin Manager Command Center"
    >
      {({ user, token, logout }) => (
        <AdminPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function AdminPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  type AdminTab =
    | 'DASHBOARD'
    | 'STUDENTS'
    | 'STAFF_ROLES'
    | 'HOSTEL'
    | 'LEAVE_GATE_PASS'
    | 'SECURITY'
    | 'SERVICES'
    | 'MEDICAL'
    | 'GRIEVANCES'
    | 'VISITORS'
    | 'EMERGENCY'
    | 'NOTICES'
    | 'MESS_MANAGEMENT'
    | 'CALENDAR'
    | 'GALLERY'
    | 'CONTACTS'
    | 'REPORTS'
    | 'SETTINGS'
    | 'AUDIT_LOGS'
    | 'MY_PROFILE'
    // Backwards-compatible aliases
    | 'STAFF'
    | 'DEPARTMENTS'
    | 'COURSES'
    | 'APPROVALS'
    | 'ROLES_PERMISSIONS'
    | 'ANNOUNCEMENTS'
    | 'NOTIFICATIONS'
    | 'EVENTS'
    | 'WARDEN_SECURITY'
    | 'COLLEGE_PROFILE'
    | 'OPERATOR_MANAGEMENT';

  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'OD'>('EN');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('Tue, 30 Sep 2025 | 10:24 AM');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        const formatted = now.toLocaleDateString('en-US', options);
        setCurrentDateTime(formatted);
      } catch (err) {
        // fallback
      }
    };
    updateTime();
  }, []);

  // Live Data States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [residents, setResidents] = useState<any[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [pendingStaff, setPendingStaff] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 'aud-1', actor: 'Administrator Singh', action: 'Approved Student Gate Pass #GP-8812', timestamp: '10 mins ago', ip: '192.168.1.10' },
    { id: 'aud-2', actor: 'Chief Warden', action: 'Allocated Room A-204 to Aman Verma', timestamp: '45 mins ago', ip: '192.168.1.14' },
    { id: 'aud-3', actor: 'Security Control Desk', action: 'Main Turnstile Exit Scan Processed', timestamp: '1 hour ago', ip: '192.168.1.5' },
    { id: 'aud-4', actor: 'System Auto-Audit', action: 'Night Curfew Verification Completed', timestamp: 'Yesterday 21:30', ip: 'System Cron' },
  ]);

  // Real-Time Notifications State
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    message: string;
    type: 'EMERGENCY' | 'PASS' | 'COMPLAINT' | 'ADMISSION' | 'STAFF' | 'GENERAL';
    timestamp: string;
    read: boolean;
    targetTab?: AdminTab;
    data?: any;
  }>>([
    {
      id: 'init-1',
      title: '🚪 Gate Pass Request: Subham Pradhan',
      message: 'Weekend Home Visit leave requested for Cuttack (Room A-204)',
      type: 'PASS',
      timestamp: '2 mins ago',
      read: false,
      targetTab: 'LEAVE_GATE_PASS',
    },
    {
      id: 'init-2',
      title: '📝 Grievance Ticket #CMP-10492',
      message: 'Water heater malfunction reported in Hostel Block A',
      type: 'COMPLAINT',
      timestamp: '15 mins ago',
      read: false,
      targetTab: 'GRIEVANCES',
    },
    {
      id: 'init-3',
      title: '👨‍🎓 New Student Registration',
      message: 'Rohan Sen applied for B.Tech Computer Science admission',
      type: 'ADMISSION',
      timestamp: '1 hour ago',
      read: true,
      targetTab: 'APPROVALS',
    },
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [activeSosAlert, setActiveSosAlert] = useState<any>(null);

  // Departments List
  const departments = [
    { name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. S. Mohanty', students: 340, faculty: 24, labs: 8 },
    { name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. R. K. Patra', students: 280, faculty: 18, labs: 6 },
    { name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. B. N. Sahoo', students: 210, faculty: 16, labs: 7 },
    { name: 'Civil Engineering', code: 'CE', hod: 'Dr. P. C. Nayak', students: 160, faculty: 12, labs: 5 },
    { name: 'Electrical & Electronics', code: 'EEE', hod: 'Dr. K. C. Ray', students: 190, faculty: 14, labs: 5 },
    { name: 'Master of Business Administration', code: 'MBA', hod: 'Dr. M. Mishra', students: 120, faculty: 10, labs: 2 },
  ];

  // Courses List
  const coursesList = [
    { program: 'Bachelor of Technology (B.Tech)', duration: '4 Years', depts: 5, totalIntake: 600, status: 'AICTE Approved' },
    { program: 'Master of Technology (M.Tech)', duration: '2 Years', depts: 3, totalIntake: 90, status: 'AICTE Approved' },
    { program: 'Master of Business Administration (MBA)', duration: '2 Years', depts: 1, totalIntake: 120, status: 'UGC Recognized' },
    { program: 'Master of Computer Applications (MCA)', duration: '2 Years', depts: 1, totalIntake: 60, status: 'AICTE Approved' },
  ];

  // Staff Roster
  const staffRoster = [
    { name: 'Dr. Ramesh Sharma', role: 'FACULTY', dept: 'CSE', email: 'sharma.faculty@rec.edu', phone: '+91 98765 43210', status: 'ACTIVE' },
    { name: 'Dr. K. N. Mohapatra', role: 'WARDEN', dept: 'Hostels', email: 'warden.boys@rec.edu', phone: '+91 94371 88921', status: 'ACTIVE' },
    { name: 'S. K. Mahapatra', role: 'DOCTOR', dept: 'Health Center', email: 'health.centre@rec.edu', phone: '+91 98610 22334', status: 'ACTIVE' },
    { name: 'Vikram Singh', role: 'SECURITY', dept: 'Gate Security', email: 'security.main@rec.edu', phone: '+91 98112 00011', status: 'ACTIVE' },
    { name: 'Manoj Jena', role: 'SERVICES', dept: 'Maintenance & Mess', email: 'facilities@rec.edu', phone: '+91 97762 99881', status: 'ACTIVE' },
  ];

  // Fetch Admin Data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [rRes, pRes, cRes, pendRes, pendStaffRes] = await Promise.all([
        fetch(`${API_BASE}/residents`, { headers }).catch(() => null),
        fetch(`${API_BASE}/passes`, { headers }).catch(() => null),
        fetch(`${API_BASE}/complaints`, { headers }).catch(() => null),
        fetch(`${API_BASE}/auth/pending-students`, { headers }).catch(() => null),
        fetch(`${API_BASE}/auth/pending-staff`, { headers }).catch(() => null),
      ]);

      if (rRes && rRes.ok) {
        const rData = await rRes.json();
        setResidents(rData.residents || rData || []);
      }
      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setPasses(pData.passes || pData || []);
      }
      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        setComplaints(cData.complaints || cData || []);
      }
      if (pendRes && pendRes.ok) {
        const pendData = await pendRes.json();
        setPendingStudents(Array.isArray(pendData) ? pendData : pendData.pending || []);
      }
      if (pendStaffRes && pendStaffRes.ok) {
        const staffData = await pendStaffRes.json();
        setPendingStaff(Array.isArray(staffData) ? staffData : staffData.pending || []);
      }
    } catch (e) {
      console.warn('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Web Audio Synthesizer Chime for Admin Instant Alert
  const playAdminAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [
        { freq: 523.25, time: 0.0 },
        { freq: 659.25, time: 0.12 },
        { freq: 783.99, time: 0.24 },
        { freq: 1046.5, time: 0.36 },
      ].forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.2, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + 0.3);
      });
    } catch (e) {
      console.warn('Audio chime playback note:', e);
    }
  };

  useEffect(() => {
    fetchAdminData();

    // Socket.io for instant real-time notifications and approvals
    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');
    socket.on('connect', () => {
      console.log('[Admin Dashboard] Socket connected');
    });

    // 1. Staff Registration Alert
    socket.on('staff:registered', (data) => {
      console.log('Real-time staff registered alert:', data);
      playAdminAudioChime();
      setPendingStaff((prev) => {
        const exists = prev.some((p) => p.id === data.id || p.userId === data.id || p.email === data.email);
        if (exists) return prev;
        return [data, ...prev];
      });
      setNotifications((prev) => [
        {
          id: `notif-staff-${Date.now()}`,
          title: '👔 New Staff Registration',
          message: `${data.name} applied as ${data.category || data.designation || 'Staff'}`,
          type: 'STAFF',
          timestamp: 'Just now',
          read: false,
          targetTab: 'APPROVALS',
          data,
        },
        ...prev,
      ]);
      setSuccessMsg(`🔔 New Staff Registration: ${data.name} (${data.category || data.designation || 'Staff'})!`);
      setTimeout(() => setSuccessMsg(''), 6000);
    });

    // 2. Student Admission Application Alert
    socket.on('student:registered', (data) => {
      console.log('Real-time student registered alert:', data);
      playAdminAudioChime();
      setPendingStudents((prev) => {
        const exists = prev.some((p) => p.id === data.id || p.userId === data.id || p.email === data.email);
        if (exists) return prev;
        return [data, ...prev];
      });
      setNotifications((prev) => [
        {
          id: `notif-stu-${Date.now()}`,
          title: '👨‍🎓 Student Admission Application',
          message: `${data.name} submitted enrollment application (${data.course || 'B.Tech'})`,
          type: 'ADMISSION',
          timestamp: 'Just now',
          read: false,
          targetTab: 'APPROVALS',
          data,
        },
        ...prev,
      ]);
      setSuccessMsg(`🔔 New Student Admission Request: ${data.name}!`);
      setTimeout(() => setSuccessMsg(''), 6000);
    });

    socket.on('staff:approved', (data) => {
      setPendingStaff((prev) => prev.filter((p) => p.id !== data.id && p.id !== data.userId && p.email !== data.email));
    });

    socket.on('student:approved', (data) => {
      setPendingStudents((prev) => prev.filter((p) => p.id !== data.id && p.id !== data.userId && p.email !== data.email));
    });

    // 3. Real-Time Grievance / Complaint Dispatch from Students
    const handleComplaintIncoming = (data: any) => {
      console.log('⚡ Real-time grievance incoming to Admin Dashboard:', data);
      playAdminAudioChime();
      setComplaints((prev) => {
        const id = data.complaintId || data.id;
        const exists = prev.some((c) => c.id === id || c.ticketNumber === data.ticketNumber);
        if (exists) {
          return prev.map((c) => (c.id === id || c.ticketNumber === data.ticketNumber ? { ...c, ...data } : c));
        }
        return [
          {
            id: id || `cmp-${Date.now()}`,
            ticketNumber: data.ticketNumber || `CMP-${Math.floor(100000 + Math.random() * 900000)}`,
            category: data.category || 'OTHER',
            status: data.status || 'RAISED',
            title: data.title || 'Student Grievance',
            description: data.description || 'Issue reported',
            priority: data.priority || 'MEDIUM',
            photoUrl: data.photoUrl || null,
            videoUrl: data.videoUrl || null,
            resident: {
              name: data.residentName || 'Student Resident',
              residentProfile: {
                roomNumber: data.roomNumber || 'A-204',
                blockName: data.blockName || 'Hostel A',
              },
            },
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ];
      });
      setNotifications((prev) => [
        {
          id: `notif-cmp-${Date.now()}`,
          title: `📝 Grievance #${data.ticketNumber || 'TKT'}`,
          message: `${data.residentName || 'Student'} (${data.roomNumber || 'Room'}) reported [${data.category || 'OTHER'}]`,
          type: 'COMPLAINT',
          timestamp: 'Just now',
          read: false,
          targetTab: 'GRIEVANCES',
          data,
        },
        ...prev,
      ]);
      setSuccessMsg(`🚨 Grievance Alert #${data.ticketNumber || 'TKT'}: ${data.residentName || 'Student'} (${data.roomNumber || 'Room'}) - [${data.category || 'OTHER'}]`);
      setTimeout(() => setSuccessMsg(''), 7000);
    };

    socket.on('complaint:created', handleComplaintIncoming);
    socket.on('complaint:update', handleComplaintIncoming);
    socket.on('complaint:raised', handleComplaintIncoming);

    // 4. Real-Time Gate Pass / Leave Request from Students
    const handlePassIncoming = (data: any) => {
      console.log('⚡ Real-time pass update received in Admin Dashboard:', data);
      playAdminAudioChime();
      setPasses((prev) => {
        const id = data.passId || data.id;
        const exists = prev.some((p) => (id && p.id === id) || (data.passNumber && p.passNumber === data.passNumber));
        if (exists) {
          return prev.map((p) => ((id && p.id === id) || (data.passNumber && p.passNumber === data.passNumber) ? { ...p, ...data } : p));
        }
        return [
          {
            id: id || `pass-${Date.now()}`,
            passNumber: data.passNumber || `GP-${Math.floor(10000 + Math.random() * 90000)}`,
            passType: data.passType || 'OUTING',
            status: data.status || 'PENDING',
            destination: data.destination || 'Campus Outing',
            reason: data.reason || 'Personal outing',
            validTill: data.validTill || new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
            createdAt: data.createdAt || new Date().toISOString(),
            resident: {
              name: data.studentName || data.residentName || 'Student Resident',
              residentProfile: {
                roomNumber: data.roomNumber || 'A-204',
                blockName: data.blockName || 'Hostel A',
              },
            },
          },
          ...prev,
        ];
      });
      setNotifications((prev) => [
        {
          id: `notif-pass-${Date.now()}`,
          title: `🚪 Gate Pass: ${data.studentName || data.residentName || 'Student'}`,
          message: `${data.passType || 'Pass'} applied for ${data.destination || 'outing'} (${data.roomNumber || 'Room'})`,
          type: 'PASS',
          timestamp: 'Just now',
          read: false,
          targetTab: 'LEAVE_GATE_PASS',
          data,
        },
        ...prev,
      ]);
      setSuccessMsg(`🚪 Gate Pass Request: ${data.studentName || 'Student'} (${data.roomNumber || 'Hostel'}) - [${data.destination || 'Outing'}]`);
      setTimeout(() => setSuccessMsg(''), 7000);
    };

    socket.on('pass:requested', handlePassIncoming);
    socket.on('pass:created', handlePassIncoming);
    socket.on('pass:status_update', handlePassIncoming);

    // 5. Emergency SOS Critical Alarm
    const handleEmergencyIncoming = (data: any) => {
      console.log('🚨 EMERGENCY SOS received in Admin Dashboard:', data);
      playAdminAudioChime();
      setActiveSosAlert(data);
      setNotifications((prev) => [
        {
          id: `notif-em-${Date.now()}`,
          title: `🚨 EMERGENCY SOS: ${data.emergencyType || 'CODE RED'}`,
          message: `${data.residentName || 'Student'} triggered SOS at ${data.locationDetails || 'Hostel Room'}!`,
          type: 'EMERGENCY',
          timestamp: 'Just now',
          read: false,
          targetTab: 'EMERGENCY',
          data,
        },
        ...prev,
      ]);
      setSuccessMsg(`🚨 CRITICAL ALERT: Emergency SOS from ${data.residentName || 'Student'} at ${data.locationDetails || 'Hostel'}!`);
      setTimeout(() => setSuccessMsg(''), 10000);
    };

    socket.on('emergency:triggered', handleEmergencyIncoming);
    socket.on('emergency:sos', handleEmergencyIncoming);
    socket.on('emergency:resolved', () => {
      setActiveSosAlert(null);
    });

    // 6. Unified Notification Event
    socket.on('notification:new', (payload: any) => {
      console.log('📩 notification:new received in Admin Dashboard:', payload);
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === payload.id);
        if (exists) return prev;
        return [
          {
            id: payload.id || `notif-${Date.now()}`,
            title: payload.title || 'Campus Update',
            message: payload.message || 'New activity logged on campus',
            type: payload.type || 'GENERAL',
            timestamp: 'Just now',
            read: false,
            targetTab:
              payload.type === 'EMERGENCY'
                ? 'EMERGENCY'
                : payload.type === 'PASS'
                ? 'LEAVE_GATE_PASS'
                : payload.type === 'COMPLAINT'
                ? 'GRIEVANCES'
                : payload.type === 'ADMISSION'
                ? 'APPROVALS'
                : 'DASHBOARD',
            data: payload.data,
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Handle Approve Staff
  const handleApproveStaff = async (id: string, name: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/approve-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: id })
      });
      if (res.ok) {
        setPendingStaff((prev) => prev.filter((s) => s.id !== id && s.userId !== id));
        setSuccessMsg(`✓ Staff account for ${name} approved and activated in database!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to approve staff account');
      }
    } catch (e) {
      console.error('Approve staff error:', e);
    }
  };

  // Handle Reject Staff
  const handleRejectStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to reject the application for ${name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/auth/reject-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: id })
      });
      if (res.ok) {
        setPendingStaff((prev) => prev.filter((s) => s.id !== id && s.userId !== id));
        setSuccessMsg(`Staff application for ${name} rejected.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchAdminData();
      }
    } catch (e) {
      console.error('Reject staff error:', e);
    }
  };

  // Handle Approve Student
  const handleApproveStudent = async (id: string, name: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/approve-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: id, userId: id })
      });
      if (res.ok) {
        setPendingStudents((prev) => prev.filter((s) => s.id !== id && s.userId !== id));
        setSuccessMsg(`✓ Student admission for ${name} approved and activated!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to approve student');
      }
    } catch (e) {
      console.error('Approve student error:', e);
    }
  };

  // Handle Reject Student
  const handleRejectStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to reject admission request for ${name}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/auth/reject-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: id, userId: id })
      });
      if (res.ok) {
        setPendingStudents((prev) => prev.filter((s) => s.id !== id && s.userId !== id));
        setSuccessMsg(`Student admission request for ${name} rejected.`);
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchAdminData();
      }
    } catch (e) {
      console.error('Reject student error:', e);
    }
  };

  // Navigation Items matching target dashboard (Exact 20 Modules)
  const navItems = [
    { id: 'DASHBOARD', emoji: '🏠', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'STUDENTS', emoji: '👨‍🎓', label: 'Student Management', icon: GraduationCap, badge: pendingStudents.length > 0 ? `${pendingStudents.length}` : '' },
    { id: 'STAFF_ROLES', emoji: '👥', label: 'Staff & Role Management', icon: Users, badge: pendingStaff.length > 0 ? `${pendingStaff.length}` : '' },
    { id: 'HOSTEL', emoji: '🏢', label: 'Hostel Management', icon: Bed },
    { id: 'LEAVE_GATE_PASS', emoji: '🚪', label: 'Leave & Gate Pass', icon: FileText, badge: '18' },
    { id: 'SECURITY', emoji: '🔐', label: 'Security Management', icon: Shield },
    { id: 'SERVICES', emoji: '🛠️', label: 'Service & Maintenance', icon: Wrench },
    { id: 'MEDICAL', emoji: '🏥', label: 'Medical Management', icon: Heart },
    { id: 'GRIEVANCES', emoji: '📝', label: 'Complaints & Grievances', icon: AlertTriangle, badge: complaints.filter((c) => c.status === 'RAISED').length > 0 ? `${complaints.filter((c) => c.status === 'RAISED').length}` : '' },
    { id: 'VISITORS', emoji: '👥', label: 'Visitor Management', icon: UserCheck, badge: '4' },
    { id: 'EMERGENCY', emoji: '🚨', label: 'Emergency & SOS', icon: ShieldAlert },
    { id: 'NOTICES', emoji: '📢', label: 'Notices & Broadcasts', icon: Bell, badge: '3' },
    { id: 'MESS_MANAGEMENT', emoji: '🍽️', label: 'Mess Management', icon: Utensils },
    { id: 'CALENDAR', emoji: '📅', label: 'Academic & Campus Calendar', icon: Calendar },
    { id: 'GALLERY', emoji: '🖼️', label: 'College Gallery', icon: Camera },
    { id: 'CONTACTS', emoji: '📞', label: 'Campus Contacts', icon: PhoneCall },
    { id: 'REPORTS', emoji: '📊', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'SETTINGS', emoji: '⚙️', label: 'College Settings', icon: Settings },
    { id: 'AUDIT_LOGS', emoji: '📋', label: 'Audit Logs', icon: FileText },
    { id: 'MY_PROFILE', emoji: '👤', label: 'My Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#f4f7fc] text-slate-800 font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#0a192f] text-slate-200 flex flex-col justify-between shrink-0 shadow-xl border-r border-slate-800 select-none">
        <div className="overflow-y-auto scrollbar-thin">
          {/* Logo & Platform Badge */}
          <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-black text-sm text-white tracking-wide truncate">
                ADMIN MANAGER HUB
              </h1>
              <p className="text-[10px] text-blue-400 font-bold truncate">
                Campus Admin Command Center
              </p>
            </div>
          </div>

          {/* Admin Capsule */}
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-sm">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'AM'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-sky-400 font-bold truncate">Campus Admin Manager</p>
              <p className="text-[9px] text-emerald-400 font-semibold truncate">
                {user.tenantName || 'Raajdhani Engineering College (Autonomous)'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Administration Modules
            </p>
            {navItems.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                    setActiveSubTab('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-sm select-none shrink-0">{tab.emoji}</span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold truncate max-w-[80px] ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Banner & Sign Out */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
              <Building className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-white truncate">Empowering Students</p>
              <p className="text-[9px] text-slate-400 truncate">Building a Safer Campus</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 z-20">
          {/* Top Left: College Name & Location */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-slate-900 leading-tight">
                Raajdhani Engineering College (Autonomous)
              </h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">Bhubaneswar, Odisha</p>
            </div>
          </div>

          {/* Middle: Search Box */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Top Right: Actions, Language Toggle, Bell, Admin Pill */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Language Toggle (EN / हिन्दी / ଓଡ଼ିଆ) */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              <button
                onClick={() => setSelectedLang('EN')}
                className={`px-2 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                  selectedLang === 'EN' ? 'bg-blue-600 text-white shadow-2xs' : 'hover:text-blue-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLang('HI')}
                className={`px-2 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                  selectedLang === 'HI' ? 'bg-blue-600 text-white shadow-2xs' : 'hover:text-blue-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setSelectedLang('OD')}
                className={`px-2 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                  selectedLang === 'OD' ? 'bg-blue-600 text-white shadow-2xs' : 'hover:text-blue-600'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            {/* Approvals Queue Button */}
            <button
              onClick={() => {
                setActiveTab('STUDENTS');
                setActiveSubTab('Admission Requests');
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Approvals Queue ({pendingStaff.length + pendingStudents.length})</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchAdminData}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Notification Bell with Dynamic Real-Time Unread Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className={`relative p-2 rounded-xl transition cursor-pointer ${
                  showNotificationDropdown ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Real-Time Admin Activity & Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Real-time Notifications Popover Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black tracking-wide">Live Campus Activity & Notifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notifications.some((n) => !n.read) && (
                        <button
                          type="button"
                          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                          className="text-[10px] text-blue-300 hover:text-white underline font-bold transition cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-slate-700 text-[10px] font-bold text-slate-200">
                        {notifications.length} total
                      </span>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-semibold">
                        No notifications yet. Student and campus actions will show up here live!
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
                            if (item.targetTab) {
                              setActiveTab(item.targetTab);
                              setActiveSubTab('');
                            }
                            setShowNotificationDropdown(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                            !item.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                              item.type === 'EMERGENCY'
                                ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-400 animate-pulse'
                                : item.type === 'PASS'
                                ? 'bg-blue-100 text-blue-600'
                                : item.type === 'COMPLAINT'
                                ? 'bg-amber-100 text-amber-600'
                                : item.type === 'ADMISSION'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.type === 'EMERGENCY'
                              ? '🚨'
                              : item.type === 'PASS'
                              ? '🚪'
                              : item.type === 'COMPLAINT'
                              ? '📝'
                              : item.type === 'ADMISSION'
                              ? '🎓'
                              : '🔔'}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs truncate ${!item.read ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.message}</p>
                            <span className="inline-block text-[10px] text-blue-600 font-bold mt-1">
                              Click to view in {item.targetTab || 'portal'} &rarr;
                            </span>
                          </div>

                          {!item.read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('ANNOUNCEMENTS');
                        setShowNotificationDropdown(false);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                    >
                      View All Campus Broadcasts &amp; Notices &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Avatar & Role Capsule */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-2xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user.name || 'Admin Manager'}</p>
                <p className="text-[10px] text-blue-600 font-bold">Campus Admin Manager</p>
              </div>
            </div>
          </div>
        </header>

        {/* Sticky Active Emergency Alert Siren Banner */}
        {activeSosAlert && (
          <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-6 py-3.5 flex items-center justify-between shadow-lg border-b-2 border-red-400 animate-pulse z-30 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">
                  🚨 ACTIVE CRISIS CODE RED: {activeSosAlert.emergencyType || 'EMERGENCY SOS'}
                </p>
                <p className="text-xs text-rose-100">
                  Resident: <strong>{activeSosAlert.residentName || 'Student'}</strong> • Location: <strong>{activeSosAlert.locationDetails || 'Campus'}</strong> (Contact: {activeSosAlert.residentPhone || activeSosAlert.phone || '+91 98765 43210'})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('EMERGENCY');
                  setActiveSubTab('Security');
                }}
                className="px-4 py-1.5 rounded-xl bg-white text-rose-700 font-black text-xs hover:bg-rose-50 shadow transition cursor-pointer"
              >
                Dispatch Security
              </button>
              <button
                type="button"
                onClick={() => setActiveSosAlert(null)}
                className="px-3 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================= */}
          {/* MODULE 1: DASHBOARD OVERVIEW                              */}
          {/* ========================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* 1. Welcome Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 min-h-[140px] flex items-center">
                <img
                  src="/images/rec-building.jpg"
                  alt="Raajdhani Engineering College"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-blue-950/65" />

                <div className="relative z-10 w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back, Admin!</h2>
                    <p className="text-xs text-slate-200 mt-1 font-medium">
                      Manage your campus, students and operations efficiently.
                    </p>
                    <div className="flex items-center space-x-2 text-slate-300 text-xs mt-3">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{currentDateTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/40 shadow-lg text-slate-800 self-start md:self-auto">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-tight">Raajdhani Engineering College (Autonomous)</p>
                      <p className="text-[10px] text-slate-500 font-medium">Bhubaneswar, Odisha</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prominent Pending Admissions Notification Banner */}
              {pendingStudents.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                          Action Required
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {pendingStudents.length} New Student Admission Request{pendingStudents.length > 1 ? 's' : ''} Awaiting Approval
                        </h3>
                      </div>
                      <p className="text-xs text-amber-100 mt-0.5">
                        Latest applicant: <strong>{pendingStudents[0].name}</strong> ({pendingStudents[0].course || 'B.Tech'}) • Room {pendingStudents[0].roomNumber || '101'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleApproveStudent(pendingStudents[0].id || pendingStudents[0].userId, pendingStudents[0].name)}
                      className="px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black transition shadow-sm cursor-pointer"
                    >
                      Quick Approve {pendingStudents[0].name.split(' ')[0]}
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('STUDENTS');
                        setActiveSubTab('Admission Requests');
                      }}
                      className="px-3.5 py-2 bg-slate-950/40 hover:bg-slate-950/60 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      View All Requests ({pendingStudents.length}) →
                    </button>
                  </div>
                </div>
              )}

              {/* 16 Campus Overview Stat Cards (Organized Grid with Click-to-Module Navigation) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {/* 1. Total Students */}
                <div
                  onClick={() => { setActiveTab('STUDENTS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-blue-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Total Students</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">2,485</h3>
                    <p className="text-[9px] text-emerald-600 font-semibold truncate">↑ 5% this term</p>
                  </div>
                </div>

                {/* 2. Active Students */}
                <div
                  onClick={() => { setActiveTab('STUDENTS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-blue-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Active Students</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">2,410</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Enrolled & Valid</p>
                  </div>
                </div>

                {/* 3. Faculty & Staff */}
                <div
                  onClick={() => { setActiveTab('STAFF_ROLES'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-teal-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Faculty & Staff</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">182</h3>
                    <p className="text-[9px] text-emerald-600 font-semibold truncate">All blocks active</p>
                  </div>
                </div>

                {/* 4. Hostel Occupancy */}
                <div
                  onClick={() => { setActiveTab('HOSTEL'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-indigo-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Bed className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Hostel Occupancy</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">78%</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">1,237 / 1,580</p>
                  </div>
                </div>

                {/* 5. Students Inside */}
                <div
                  onClick={() => { setActiveTab('SECURITY'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-emerald-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Students Inside</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-emerald-700 tracking-tight">2,342</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">96% on campus</p>
                  </div>
                </div>

                {/* 6. Students Outside */}
                <div
                  onClick={() => { setActiveTab('SECURITY'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-blue-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Students Outside</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-blue-700 tracking-tight">98</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Active gate pass</p>
                  </div>
                </div>

                {/* 7. Students On Leave */}
                <div
                  onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-purple-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">On Home Leave</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">45</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Authorized leave</p>
                  </div>
                </div>

                {/* 8. Pending Leave Requests */}
                <div
                  onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-amber-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Pending Leave</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-amber-700 tracking-tight">18</h3>
                    <p className="text-[9px] text-amber-600 font-semibold truncate">Warden review</p>
                  </div>
                </div>

                {/* 9. Active Gate Passes */}
                <div
                  onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-indigo-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Active Passes</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">34</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">QR generated</p>
                  </div>
                </div>

                {/* 10. Pending Complaints */}
                <div
                  onClick={() => { setActiveTab('GRIEVANCES'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-rose-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Complaints</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-rose-700 tracking-tight">
                      {complaints.filter((c) => c.status === 'RAISED').length || 24}
                    </h3>
                    <p className="text-[9px] text-rose-600 font-semibold truncate">Awaiting resolution</p>
                  </div>
                </div>

                {/* 11. Open Service Requests */}
                <div
                  onClick={() => { setActiveTab('SERVICES'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-purple-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Service Orders</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-purple-700 tracking-tight">14</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Technicians on task</p>
                  </div>
                </div>

                {/* 12. Medical Cases */}
                <div
                  onClick={() => { setActiveTab('MEDICAL'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-rose-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Heart className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Medical Cases</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">8</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">OPD & Bed rest</p>
                  </div>
                </div>

                {/* 13. Emergency Alerts */}
                <div
                  onClick={() => { setActiveTab('EMERGENCY'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-red-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Emergency Alerts</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">0</h3>
                    <p className="text-[9px] text-emerald-600 font-semibold truncate">All quiet • Safe</p>
                  </div>
                </div>

                {/* 14. Visitors Today */}
                <div
                  onClick={() => { setActiveTab('VISITORS'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-indigo-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Visitors Today</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">12</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Passes issued</p>
                  </div>
                </div>

                {/* 15. Security Incidents */}
                <div
                  onClick={() => { setActiveTab('SECURITY'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-amber-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Incidents</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-amber-700 tracking-tight">1</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Late return curfew</p>
                  </div>
                </div>

                {/* 16. Maintenance Issues */}
                <div
                  onClick={() => { setActiveTab('SERVICES'); setActiveSubTab(''); }}
                  className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs hover:border-purple-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 truncate">Maintenance</p>
                  </div>
                  <div className="mt-1.5">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">6</h3>
                    <p className="text-[9px] text-slate-400 font-medium truncate">Preventive tasks</p>
                  </div>
                </div>
              </div>

              {/* 3-Column Middle Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* COLUMN 1: Hostel Occupancy & Student Trend (Col 1-3) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Card 1: Hostel Occupancy Overview */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black text-slate-900">Hostel Occupancy Overview</h3>

                    <div className="flex items-center justify-center relative py-2">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                        {/* 78% occupied: 0.78 * 238.76 = 186.2 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#2563eb"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray="186.2 238.8"
                        />
                        {/* 22% vacant: 0.22 * 238.76 = 52.5 */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="#10b981"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray="52.5 238.8"
                          strokeDashoffset="-186.2"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-slate-900 leading-none">78%</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5">Occupied</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span className="text-[11px] font-medium">Occupied</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">1,237</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-medium">Vacant</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">343</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                          <span className="text-[11px] font-medium">Maintenance</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">0</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="flex items-center space-x-1.5 text-slate-500 font-bold text-[11px]">
                          Total Rooms
                        </span>
                        <span className="font-black text-slate-900 text-[11px]">1,580</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Student & Hostel Trend */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900">Student & Hostel Trend</h3>
                      <div className="flex items-center space-x-2 text-[8px] font-bold">
                        <span className="flex items-center space-x-1 text-blue-600">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span>Students</span>
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Occupancy</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative pt-2">
                      <svg className="w-full h-32" viewBox="0 0 320 120" preserveAspectRatio="none">
                        <line x1="25" y1="20" x2="295" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="25" y1="50" x2="295" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="25" y1="80" x2="295" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="25" y1="105" x2="295" y2="105" stroke="#e2e8f0" strokeWidth="1" />

                        <text x="5" y="23" fill="#94a3b8" fontSize="7">2.5K</text>
                        <text x="5" y="53" fill="#94a3b8" fontSize="7">1.5K</text>
                        <text x="5" y="83" fill="#94a3b8" fontSize="7">500</text>
                        <text x="5" y="107" fill="#94a3b8" fontSize="7">0</text>

                        <text x="300" y="23" fill="#94a3b8" fontSize="7">100%</text>
                        <text x="300" y="53" fill="#94a3b8" fontSize="7">50%</text>
                        <text x="300" y="83" fill="#94a3b8" fontSize="7">25%</text>
                        <text x="300" y="107" fill="#94a3b8" fontSize="7">0%</text>

                        <defs>
                          <linearGradient id="studentTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 30,85 Q 70,75 110,65 T 180,45 T 250,30 T 290,20 L 290,105 L 30,105 Z"
                          fill="url(#studentTrendGrad)"
                        />
                        <path
                          d="M 30,85 Q 70,75 110,65 T 180,45 T 250,30 T 290,20"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                        />
                        <circle cx="30" cy="85" r="2" fill="#2563eb" stroke="#fff" />
                        <circle cx="110" cy="65" r="2" fill="#2563eb" stroke="#fff" />
                        <circle cx="180" cy="45" r="2" fill="#2563eb" stroke="#fff" />
                        <circle cx="250" cy="30" r="2" fill="#2563eb" stroke="#fff" />
                        <circle cx="290" cy="20" r="2" fill="#2563eb" stroke="#fff" />

                        <path
                          d="M 30,95 Q 70,90 110,88 T 180,82 T 250,80 T 290,78"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                        />
                        <circle cx="30" cy="95" r="2" fill="#10b981" stroke="#fff" />
                        <circle cx="110" cy="88" r="2" fill="#10b981" stroke="#fff" />
                        <circle cx="180" cy="82" r="2" fill="#10b981" stroke="#fff" />
                        <circle cx="290" cy="78" r="2" fill="#10b981" stroke="#fff" />
                      </svg>

                      <div className="flex justify-between px-2 text-[8px] font-semibold text-slate-400 mt-1">
                        <span>23 Sep</span>
                        <span>24 Sep</span>
                        <span>25 Sep</span>
                        <span>26 Sep</span>
                        <span>27 Sep</span>
                        <span>28 Sep</span>
                        <span>29 Sep</span>
                        <span>30 Sep</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Activities, Quick Actions, Notice Board & Events (Col 4-9) */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Row A: Recent Activities & Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-900">Recent Activities</h3>
                        <button
                          onClick={() => setActiveTab('AUDIT_LOGS')}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              New leave request from Rahul Kumar (Hostel B)
                            </p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-1">2 hours ago</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              Grievance #GRV-124 resolved
                            </p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-1">3 hours ago</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                              <Bell className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              Notice published: Semester Exam Schedule
                            </p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-1">4 hours ago</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              New student registered: Priya Sahu
                            </p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-1">5 hours ago</span>
                        </div>

                        <div className="flex items-center justify-between text-xs py-0.5">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-800 truncate">
                              Gate pass verified at Main Gate
                            </p>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 ml-1">6 hours ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions (6 Colorful Tiles) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-900">Quick Actions</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => setActiveTab('STUDENTS')}
                          className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <UserPlus className="w-5 h-5 text-blue-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">Add Student</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('ANNOUNCEMENTS')}
                          className="p-3 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <Megaphone className="w-5 h-5 text-emerald-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">Publish Notice</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('ANNOUNCEMENTS')}
                          className="p-3 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <Calendar className="w-5 h-5 text-purple-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">Create Event</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('APPROVALS')}
                          className="p-3 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <AlertTriangle className="w-5 h-5 text-rose-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">Manage Grievances</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('SERVICES')}
                          className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <Utensils className="w-5 h-5 text-amber-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">Update Mess Menu</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('REPORTS')}
                          className="p-3 rounded-xl bg-teal-50/80 hover:bg-teal-100 border border-teal-100 flex flex-col items-center justify-center text-center transition cursor-pointer"
                        >
                          <TrendingUp className="w-5 h-5 text-teal-600 mb-1" />
                          <span className="text-[10px] font-black text-slate-800">View Reports</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row B: Notice Board & Upcoming Events */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Notice Board */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-900">Notice Board</h3>
                        <button
                          onClick={() => setActiveTab('ANNOUNCEMENTS')}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                          <Pin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-bold text-slate-900 truncate">
                                Important: Semester Exam schedule 2025
                              </p>
                              <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full shrink-0 ml-1">
                                Pinned &gt;
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">29 Sep 2025</p>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                          <Building className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              College will remain closed on 2nd Oct 2025 (Gandhi Jayanti)
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">28 Sep 2025</p>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              Tech Fest 2025 – Registration Open
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">26 Sep 2025</p>
                          </div>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                          <Utensils className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-900 truncate">
                              Hostel Mess Menu Updated
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">24 Sep 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-900">Upcoming Events</h3>
                        <button
                          onClick={() => setActiveTab('ANNOUNCEMENTS')}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-l-4 border-l-rose-500 shadow-2xs">
                          <h4 className="text-[11px] font-bold text-slate-900 truncate">Tech Fest 2025</h4>
                          <p className="text-[10px] text-slate-500">02 Oct 2025</p>
                          <p className="text-[9px] text-slate-400">Main Auditorium</p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-l-4 border-l-purple-500 shadow-2xs">
                          <h4 className="text-[11px] font-bold text-slate-900 truncate">Cultural Fest</h4>
                          <p className="text-[10px] text-slate-500">16 Oct 2025</p>
                          <p className="text-[9px] text-slate-400">College Ground</p>
                        </div>

                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white border-l-4 border-l-blue-500 shadow-2xs">
                          <h4 className="text-[11px] font-bold text-slate-900 truncate">Workshop on Career Guidance</h4>
                          <p className="text-[10px] text-slate-500">25 Oct 2025</p>
                          <p className="text-[9px] text-slate-400">Seminar Hall</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: College Info, Quick Stats, System Status (Col 10-12) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Card 1: College Information */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-black text-slate-900">College Information</h3>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                        Raajdhani Engineering College (Autonomous)
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Bhubaneswar, Odisha</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 text-[10px] text-slate-600 pt-1 border-t border-slate-100">
                      <p className="flex items-center space-x-2">
                        <PhoneCall className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>+91 674 2751 017</span>
                      </p>
                      <p className="flex items-center space-x-2 truncate">
                        <span className="w-3 h-3 text-slate-400 flex items-center justify-center shrink-0">@</span>
                        <span className="truncate">info@rec.ac.in</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-blue-600">www.rec.ac.in</span>
                      </p>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200 mt-2">
                      <img
                        src="/images/rec-building.jpg"
                        alt="REC Campus"
                        loading="lazy"
                        className="w-full h-24 object-cover object-center"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Card 2: Quick Stats */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-black text-slate-900">Quick Stats</h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Hostels</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">6</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Departments</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">12</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Total Rooms</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">1,580</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Warden</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">6</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Shield className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Security Guards</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">18</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Heart className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Medical Staff</span>
                        </span>
                        <span className="font-bold text-slate-900 text-[11px]">4</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: System Status */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900">System Status</h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] text-slate-600">Server</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">Online</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] text-slate-600">Database</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">Connected</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] text-slate-600">All Services Running</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600">✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hackathon Grievance & SLA Intelligence Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Hackathon Analytics & Grievance Intelligence</span>
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Real-time complaint ageing, recurring issues & staff workload SLA
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold border border-blue-200">
                      Avg Resolution: {DASHBOARD_MOCK.avgResolutionHours} hrs ({DASHBOARD_MOCK.avgResolutionTrend})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {/* 1. Complaint Ageing */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">Complaint Ageing Distribution</p>
                    <div className="space-y-1.5">
                      {DASHBOARD_MOCK.complaintAgeing.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-600 font-medium">{item.range}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              item.isCritical
                                ? 'bg-rose-100 text-rose-700 font-black ring-1 ring-rose-300'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {item.count} tickets
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Top Recurring Issues */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">Top 3 Recurring Issues</p>
                    <div className="space-y-1.5">
                      {DASHBOARD_MOCK.repeatIssues.map((issue, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-800 truncate max-w-[170px]">
                              {issue.title}
                            </p>
                            <span className="text-[9px] font-black text-blue-600">{issue.occurrences}x</span>
                          </div>
                          <p className="text-[9px] text-slate-400">{issue.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Notice Delivery Metrics */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">Notice Delivery Rate</p>
                    <div className="space-y-2">
                      {DASHBOARD_MOCK.noticeDelivery.slice(0, 2).map((notice, i) => (
                        <div key={i} className="text-xs space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-800 truncate">{notice.title}</p>
                          <div className="flex items-center space-x-2 text-[9px] text-slate-500 font-semibold">
                            <span className="text-emerald-600">Delivered: {notice.delivered}%</span>
                            <span className="text-blue-600">Read: {notice.read}%</span>
                            <span className="text-purple-600">Action: {notice.actionDone}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Quick Links */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
                <p className="text-xs font-black text-slate-900">Quick Links</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  <button
                    onClick={() => setActiveTab('SERVICES')}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px]">Campus Map</span>
                  </button>

                  <a
                    href="http://www.rec.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[11px]">College Website</span>
                  </a>

                  <button
                    onClick={() => setActiveTab('SERVICES')}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[11px]">Library</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('MEDICAL')}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[11px]">Medical Center</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('SECURITY')}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span className="text-[11px]">Emergency Contacts</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('SETTINGS')}
                    className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 hover:border-blue-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    <Headphones className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-[11px]">Help & Support</span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <footer className="pt-2 pb-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-700">Campus Helper</span>
                  <span>© 2025 Campus Helper. All rights reserved.</span>
                </div>
                <p className="mt-1 sm:mt-0 font-medium">Version 1.0.0 | Developed for a Better Campus Experience</p>
              </footer>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODULE 2: STUDENT MANAGEMENT (REUSING StudentManagementView) */}
          {/* ========================================================= */}
          {activeTab === 'STUDENTS' && (
            <StudentManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              residents={residents}
              pendingStudents={pendingStudents}
              onApproveStudent={handleApproveStudent}
              onRejectStudent={handleRejectStudent}
              onRefresh={fetchAdminData}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 3: STAFF & ROLE MANAGEMENT                         */}
          {/* ========================================================= */}
          {(activeTab === 'STAFF_ROLES' || activeTab === 'STAFF' || activeTab === 'APPROVALS' || activeTab === 'ROLES_PERMISSIONS') && (
            <AdminStaffRolesView
              staffRoster={staffRoster}
              pendingStaff={pendingStaff}
              pendingStudents={pendingStudents}
              activeSubTab={activeSubTab || (activeTab === 'APPROVALS' ? 'APPROVALS' : '')}
              onApproveStaff={handleApproveStaff}
              onRejectStaff={handleRejectStaff}
              onApproveStudent={handleApproveStudent}
              onRejectStudent={handleRejectStudent}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 4: HOSTEL MANAGEMENT                               */}
          {/* ========================================================= */}
          {activeTab === 'HOSTEL' && (
            <HostelManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 5: LEAVE & GATE PASS                               */}
          {/* ========================================================= */}
          {activeTab === 'LEAVE_GATE_PASS' && (
            <HostelLeaveGatePassView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              externalPasses={passes}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 6: SECURITY MANAGEMENT                             */}
          {/* ========================================================= */}
          {activeTab === 'SECURITY' && <AdminSecurityManagementView />}

          {/* ========================================================= */}
          {/* MODULE 7: SERVICE & MAINTENANCE                           */}
          {/* ========================================================= */}
          {activeTab === 'SERVICES' && <AdminServiceMaintenanceView />}

          {/* ========================================================= */}
          {/* MODULE 8: MEDICAL MANAGEMENT                              */}
          {/* ========================================================= */}
          {activeTab === 'MEDICAL' && <AdminMedicalManagementView />}

          {/* ========================================================= */}
          {/* MODULE 9: COMPLAINTS & GRIEVANCES                         */}
          {/* ========================================================= */}
          {activeTab === 'GRIEVANCES' && (
            <AdminGrievanceDeskView
              complaints={complaints}
              onRefresh={fetchAdminData}
              token={token}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 10: VISITOR MANAGEMENT                             */}
          {/* ========================================================= */}
          {activeTab === 'VISITORS' && <AdminVisitorManagementView />}

          {/* ========================================================= */}
          {/* MODULE 11: EMERGENCY & SOS                                */}
          {/* ========================================================= */}
          {activeTab === 'EMERGENCY' && (
            <EmergencyView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              activeAlerts={activeSosAlert ? [activeSosAlert] : []}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 12: NOTICES & BROADCASTS                           */}
          {/* ========================================================= */}
          {(activeTab === 'NOTICES' || activeTab === 'NOTIFICATIONS' || activeTab === 'ANNOUNCEMENTS') && (
            <NotificationsView />
          )}

          {/* ========================================================= */}
          {/* MODULE 13: MESS MANAGEMENT                                */}
          {/* ========================================================= */}
          {activeTab === 'MESS_MANAGEMENT' && <AdminMessManagementView />}

          {/* ========================================================= */}
          {/* MODULE 14: ACADEMIC & CAMPUS CALENDAR                     */}
          {/* ========================================================= */}
          {(activeTab === 'CALENDAR' || activeTab === 'EVENTS') && <AdminCalendarView />}

          {/* ========================================================= */}
          {/* MODULE 15: COLLEGE GALLERY                                */}
          {/* ========================================================= */}
          {activeTab === 'GALLERY' && (
            <CollegeProfileView
              activeSubTab="Campus Photos & Videos"
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* ========================================================= */}
          {/* MODULE 16: CAMPUS CONTACTS                                */}
          {/* ========================================================= */}
          {activeTab === 'CONTACTS' && <AdminCampusContactsView />}

          {/* ========================================================= */}
          {/* MODULE 17: REPORTS & ANALYTICS                            */}
          {/* ========================================================= */}
          {activeTab === 'REPORTS' && <AdminCentralizedReportsView />}

          {/* ========================================================= */}
          {/* MODULE 18: COLLEGE SETTINGS                               */}
          {/* ========================================================= */}
          {activeTab === 'SETTINGS' && <SettingsView />}

          {/* ========================================================= */}
          {/* MODULE 19: AUDIT LOGS                                     */}
          {/* ========================================================= */}
          {activeTab === 'AUDIT_LOGS' && <AdminAuditLogsView />}

          {/* ========================================================= */}
          {/* MODULE 20: MY PROFILE                                     */}
          {/* ========================================================= */}
          {activeTab === 'MY_PROFILE' && (
            <AdminMyProfileView user={user} logout={logout} />
          )}

          {/* ========================================================= */}
          {/* BACKWARD-COMPATIBLE FALLBACK VIEWS                        */}
          {/* ========================================================= */}
          {activeTab === 'DEPARTMENTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Academic Departments & Faculties</h3>
                  <p className="text-xs text-slate-500">Degree programs, department heads, and laboratory allocations.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                      {dept.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                    <p className="text-xs text-slate-500">Head of Department: <strong className="text-slate-700">{dept.hod}</strong></p>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-semibold">
                      <span>{dept.students} Students</span>
                      <span>{dept.faculty} Faculty</span>
                      <span>{dept.labs} Labs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'COURSES' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Academic Degree Programs & Courses</h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="py-3 px-4">Program Name</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-center">Departments</th>
                    <th className="py-3 px-4 text-center">Approved Seat Intake</th>
                    <th className="py-3 px-4 text-center">Accreditation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coursesList.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.program}</td>
                      <td className="py-3 px-4 text-slate-600">{c.duration}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">{c.depts}</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600">{c.totalIntake} Seats</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'COLLEGE_PROFILE' && (
            <CollegeProfileView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'OPERATOR_MANAGEMENT' && (
            <AdminOperatorManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {activeTab === 'WARDEN_SECURITY' && (
            <WardenSecurityView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
