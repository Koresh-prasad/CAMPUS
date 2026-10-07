'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Home,
  Users,
  GraduationCap,
  Building,
  Building2,
  BookOpen,
  UserCheck,
  Shield,
  Bell,
  Bed,
  MapPin,
  ShieldAlert,
  Heart,
  HeartPulse,
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
  ChevronDown,
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
  LayoutGrid,
  Check,
  CheckSquare,
  ListTodo,
  ArrowRight,
  ArrowUpRight,
  Ticket,
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
  const router = useRouter();

  type AdminTab =
    | 'DASHBOARD'
    | 'STUDENTS'
    | 'HOSTEL'
    | 'LEAVE_GATE_PASS'
    | 'GRIEVANCES'
    | 'VISITORS'
    | 'EMERGENCY'
    | 'REPORTS'
    | 'SETTINGS'
    // Operational Role Platforms
    | 'WARDEN'
    | 'SERVICES'
    | 'SECURITY'
    | 'MEDICAL'
    // Other administrative views
    | 'STAFF_ROLES'
    | 'NOTICES'
    | 'MESS_MANAGEMENT'
    | 'CALENDAR'
    | 'GALLERY'
    | 'CONTACTS'
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

  // 9 Essential Admin Manager Modules (Exact specification)
  const adminModules = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: Home },
    {
      id: 'STUDENTS',
      label: 'Student Management',
      icon: GraduationCap,
      badge: pendingStudents.length > 0 ? `${pendingStudents.length}` : '',
    },
    { id: 'HOSTEL', label: 'Hostel Management', icon: Building2 },
    { id: 'LEAVE_GATE_PASS', label: 'Leave & Gate Pass', icon: FileText, badge: '18' },
    {
      id: 'GRIEVANCES',
      label: 'Complaints & Grievances',
      icon: AlertTriangle,
      badge: complaints.filter((c) => c.status === 'RAISED').length > 0 ? `${complaints.filter((c) => c.status === 'RAISED').length}` : '',
    },
    { id: 'VISITORS', label: 'Visitor Management', icon: UserCheck, badge: '4' },
    { id: 'EMERGENCY', label: 'Emergency & SOS', icon: ShieldAlert, badge: activeSosAlert ? 'SOS' : '' },
    { id: 'REPORTS', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'SETTINGS', label: 'College Settings', icon: Settings },
  ];

  // 4 Operational Role Platforms (Visually distinct cards from normal modules)
  const rolePlatforms = [
    {
      id: 'WARDEN',
      label: 'Warden',
      roleTitle: 'Warden Platform',
      subtitle: 'Hostel & Student Welfare',
      icon: Building2,
      href: '/admin/warden',
      cardBg: 'bg-[#0f2922]/80 hover:bg-[#14382e] border-emerald-800/40 text-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'SERVICES',
      label: 'Service',
      roleTitle: 'Service Platform',
      subtitle: 'Maintenance & Support',
      icon: Wrench,
      href: '/admin/service',
      cardBg: 'bg-[#2a1d12]/80 hover:bg-[#3d2918] border-amber-800/40 text-amber-300',
      iconBg: 'bg-amber-600 text-white',
    },
    {
      id: 'SECURITY',
      label: 'Security',
      roleTitle: 'Security Platform',
      subtitle: 'Safety & Access Control',
      icon: Shield,
      href: '/admin/security',
      cardBg: 'bg-[#1b1735]/80 hover:bg-[#27214e] border-indigo-800/40 text-indigo-300',
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      id: 'MEDICAL',
      label: 'Medical',
      roleTitle: 'Medical Platform',
      subtitle: 'Health & Emergency Care',
      icon: HeartPulse,
      href: '/admin/medical',
      cardBg: 'bg-[#2a131a]/80 hover:bg-[#3d1a25] border-rose-800/40 text-rose-300',
      iconBg: 'bg-rose-600 text-white',
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FC] text-slate-800 font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR (Dark Navy, Organized Admin Modules + Distinct Role Platforms) */}
      <aside className="w-64 md:w-72 bg-[#0B132B] text-slate-200 flex flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800/80 select-none">
        <div className="overflow-y-auto scrollbar-thin px-3.5 py-4 space-y-4">
          {/* Logo & Platform Tagline */}
          <div className="px-1.5 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-base text-white tracking-tight leading-tight truncate">
                CampusHelper
              </h1>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                One Platform • Every Campus Need
              </p>
            </div>
          </div>

          {/* Admin Role Selector Capsule */}
          <div className="p-3 rounded-2xl bg-[#14203D] border border-slate-700/60 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Admin Manager</p>
                <p className="text-[10px] text-slate-400 truncate">Manage All Campus Operations</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>

          {/* Section 1: ADMIN MANAGER (9 Focused Modules) */}
          <div className="space-y-1">
            <p className="px-2 pt-1 pb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Admin Manager
            </p>
            <nav className="space-y-1 text-xs">
              {adminModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      setActiveSubTab('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                      isActive
                        ? 'bg-[#1E6BFF] text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate text-xs">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold truncate max-w-[80px] ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-sky-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section 2: ROLE PLATFORMS (4 Distinct Operational Team Cards) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/70">
            <div className="px-2 flex items-center space-x-1.5 text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Role Platforms</span>
            </div>

            <div className="space-y-2">
              {rolePlatforms.map((role) => {
                const Icon = role.icon;
                const isCurrentTab = activeTab === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => router.push(role.href)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between group cursor-pointer shadow-xs ${
                      role.cardBg
                    } ${isCurrentTab ? 'ring-2 ring-white/30' : ''}`}
                    title={`Open ${role.roleTitle}`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${role.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-white truncate">
                          {role.label}
                        </p>
                        <p className="text-[10px] text-slate-300/80 truncate">
                          {role.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition shrink-0 ml-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom: User Profile Capsule & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070D1F] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'SP'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#070D1F]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name || 'R. Subham Pradhan'}</p>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-400 truncate">Admin Manager</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">• Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shadow-2xs shrink-0 z-20">
          {/* Left: Search Box */}
          <div className="flex items-center flex-1 max-w-md lg:max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students, hostels, rooms, complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Right: Notification Bell, Calendar/Time, College Selector */}
          <div className="flex items-center space-x-3.5 shrink-0 ml-4">
            {/* Notification Bell with Dynamic Real-Time Unread Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className={`relative p-2 rounded-xl transition cursor-pointer ${
                  showNotificationDropdown ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                }`}
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Real-time Notifications Popover Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BellRing className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black tracking-wide">Live Campus Notifications</span>
                    </div>
                    {notifications.some((n) => !n.read) && (
                      <button
                        type="button"
                        onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                        className="text-[10px] text-blue-300 hover:text-white underline font-bold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
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
                        setActiveTab('NOTICES');
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

            {/* Date & Time Capsule */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateTime}</span>
            </div>

            {/* College Badge */}
            <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Building className="w-4.5 h-4.5" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Raajdhani Engineering College
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Bhubaneswar, Odisha</p>
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
                onClick={() => router.push('/admin/security')}
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
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-[#0A1628] min-h-[140px] flex items-center">
                <img
                  src="/images/rec-building.jpg"
                  alt="Raajdhani Engineering College Campus"
                  loading="lazy"
                  className="absolute right-0 inset-y-0 w-1/2 h-full object-cover object-center opacity-40 mix-blend-luminosity"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#071328] via-[#0B1E3B]/90 to-transparent" />

                <div className="relative z-10 w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                      ADMIN MANAGER DASHBOARD
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                      Good Morning, R. Subham Pradhan!
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      Manage your campus efficiently. Keep everything under control.
                    </p>
                    <div className="flex items-center space-x-2 text-slate-300 text-xs mt-3 bg-white/10 backdrop-blur-xs w-fit px-3 py-1 rounded-full border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>{currentDateTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/40 shadow-lg text-slate-800 self-start md:self-auto">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 leading-tight truncate">
                        Raajdhani Engineering College
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">Bhubaneswar, Odisha</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Prominent Pending Admissions Notification Banner (Preserved for Instant Alert) */}
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

              {/* 2. Top KPI Cards (Exact 7 KPI Cards) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {/* 1. Total Students */}
                <div
                  onClick={() => { setActiveTab('STUDENTS'); setActiveSubTab(''); }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-blue-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Total Students</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">2,485</h3>
                    <p className="text-[10px] text-emerald-600 font-bold truncate mt-0.5">↑ +12 this month</p>
                  </div>
                </div>

                {/* 2. Hostel Occupancy (Circular SVG Ring) */}
                <div
                  onClick={() => { setActiveTab('HOSTEL'); setActiveSubTab(''); }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-emerald-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Bed className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Hostel Occupancy</p>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">78%</h3>
                      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">1,237 / 1,580</p>
                    </div>
                    {/* Circular SVG Ring */}
                    <div className="relative w-8 h-8 shrink-0">
                      <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-600"
                          strokeDasharray="78, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 3. Students Inside */}
                <div
                  onClick={() => router.push('/admin/security')}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-amber-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Students Inside</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">2,342</h3>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">96% on campus</p>
                  </div>
                </div>

                {/* 4. Active Gate Passes */}
                <div
                  onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab(''); }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-purple-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Active Gate Passes</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">34</h3>
                    <p className="text-[10px] text-emerald-600 font-bold truncate mt-0.5">↑ +6 today</p>
                  </div>
                </div>

                {/* 5. Pending Complaints */}
                <div
                  onClick={() => { setActiveTab('GRIEVANCES'); setActiveSubTab(''); }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-rose-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Pending Complaints</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      {complaints.filter((c) => c.status === 'RAISED').length || 24}
                    </h3>
                    <p className="text-[10px] text-rose-600 font-bold truncate mt-0.5">↓ 5 new</p>
                  </div>
                </div>

                {/* 6. Medical Cases */}
                <div
                  onClick={() => router.push('/admin/medical')}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-teal-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Medical Cases</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">8</h3>
                    <p className="text-[10px] text-rose-500 font-bold truncate mt-0.5">2 critical</p>
                  </div>
                </div>

                {/* 7. Emergency Alerts */}
                <div
                  onClick={() => { setActiveTab('EMERGENCY'); setActiveSubTab(''); }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-indigo-400 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-600 truncate">Emergency Alerts</p>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">0</h3>
                    <p className="text-[10px] text-emerald-600 font-bold truncate mt-0.5">All safe</p>
                  </div>
                </div>
              </div>

              {/* 3. Main Section: Campus Operations — Role Based Access (4 Large Cards) */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Campus Operations — Role Based Access
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quick access to your assigned modules and pending tasks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4.5">
                  {/* CARD 1: WARDEN (Green Theme) */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Top Row: Icon + Vector Illustration */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
                          <Building2 className="w-5 h-5" />
                        </div>
                        {/* Custom Vector Illustration of Hostel Building */}
                        <div className="w-24 h-16 shrink-0 opacity-90 group-hover:scale-105 transition">
                          <svg viewBox="0 0 120 75" fill="none" className="w-full h-full">
                            <rect x="25" y="20" width="70" height="52" rx="3" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
                            <path d="M20 20L60 4L100 20H20Z" fill="#0284C7" />
                            <rect x="33" y="27" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="47" y="27" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="65" y="27" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="79" y="27" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="33" y="43" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="79" y="43" width="8" height="10" rx="1" fill="#0369A1" />
                            <rect x="52" y="45" width="16" height="27" rx="1" fill="#0369A1" />
                            <line x1="60" y1="45" x2="60" y2="72" stroke="#BAE6FD" strokeWidth="1.5" />
                            <circle cx="12" cy="50" r="10" fill="#10B981" />
                            <rect x="10" y="55" width="4" height="17" fill="#78350F" />
                            <circle cx="108" cy="50" r="10" fill="#10B981" />
                            <rect x="106" y="55" width="4" height="17" fill="#78350F" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                          Warden Platform
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Manage hostel, students and wardens
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Hostel Management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Student List & Allocation</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Leave & Gate Pass Approval</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Warden & Staff Management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Hostel Complaints</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => router.push('/admin/warden')}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <span>View Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: SERVICE (Orange Theme) */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Top Row: Icon + Vector Illustration */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                          <Wrench className="w-5 h-5" />
                        </div>
                        {/* Custom Vector Illustration of Maintenance Worker */}
                        <div className="w-24 h-16 shrink-0 opacity-90 group-hover:scale-105 transition">
                          <svg viewBox="0 0 120 75" fill="none" className="w-full h-full">
                            <circle cx="70" cy="20" r="10" fill="#F59E0B" />
                            <path d="M60 14Q70 9 82 14L86 16L82 18H60Z" fill="#D97706" />
                            <path d="M52 42C52 32 60 28 70 28C80 28 88 32 88 42L84 72H56L52 42Z" fill="#F59E0B" />
                            <path d="M60 40V68H80V40H60Z" fill="#D97706" />
                            <path d="M86 48L102 34C104 32 108 32 110 34C112 36 112 40 110 42L94 56L86 48Z" fill="#94A3B8" />
                            <circle cx="106" cy="38" r="3" fill="#FFFFFF" />
                            <circle cx="28" cy="38" r="15" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.5" strokeDasharray="5 3" />
                            <circle cx="28" cy="38" r="6" fill="#F97316" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                          Service Platform
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Maintenance & facility support
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Service Requests</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Maintenance Tracking</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Room & Campus Facilities</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Staff Management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Issue Resolution</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => router.push('/admin/service')}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <span>View Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 3: SECURITY (Purple Theme) */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-500/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Top Row: Icon + Vector Illustration */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                          <Shield className="w-5 h-5" />
                        </div>
                        {/* Custom Vector Illustration of Security Officer & CCTV */}
                        <div className="w-24 h-16 shrink-0 opacity-90 group-hover:scale-105 transition">
                          <svg viewBox="0 0 120 75" fill="none" className="w-full h-full">
                            <circle cx="48" cy="22" r="9" fill="#6366F1" />
                            <path d="M36 17C36 13 42 11 48 11C54 11 60 13 60 17L62 19H34L36 17Z" fill="#312E81" />
                            <rect x="42" y="18" width="12" height="2" fill="#E0E7FF" />
                            <path d="M34 40C34 32 40 28 48 28C56 28 62 32 62 40L60 72H36L34 40Z" fill="#4338CA" />
                            <path d="M46 30H50V70H46V30Z" fill="#E0E7FF" />
                            <rect x="80" y="24" width="22" height="11" rx="2.5" fill="#312E81" transform="rotate(-15 80 24)" />
                            <circle cx="98" cy="18" r="3.5" fill="#06B6D4" />
                            <path d="M78 29L72 33" stroke="#6366F1" strokeWidth="2.5" />
                            <rect x="70" y="32" width="3.5" height="12" fill="#312E81" />
                            <path d="M98 26C103 29 106 34 106 40" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                          Security Platform
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Campus safety & access control
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Gate Pass Management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Visitor Management</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Security Staff</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Incident Reports</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[3]" />
                          <span className="font-medium">Emergency Response</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => router.push('/admin/security')}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <span>View Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 4: MEDICAL (Red Theme) */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-rose-500/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      {/* Top Row: Icon + Vector Illustration */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                          <HeartPulse className="w-5 h-5" />
                        </div>
                        {/* Custom Vector Illustration of Medical Doctor */}
                        <div className="w-24 h-16 shrink-0 opacity-90 group-hover:scale-105 transition">
                          <svg viewBox="0 0 120 75" fill="none" className="w-full h-full">
                            <circle cx="68" cy="22" r="9" fill="#FB7185" />
                            <path d="M58 20C58 14 64 10 72 10C80 10 84 16 84 22C84 22 80 18 72 18C64 18 60 21 58 20Z" fill="#4C0519" />
                            <path d="M54 42C54 34 60 30 70 30C80 30 86 34 86 42L84 72H56L54 42Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                            <path d="M64 32L69 44L74 32H64Z" fill="#38BDF8" />
                            <path d="M60 34Q60 48 68 50Q76 48 76 34" stroke="#475569" strokeWidth="2" fill="none" />
                            <circle cx="68" cy="52" r="3" fill="#94A3B8" />
                            <circle cx="28" cy="38" r="12" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="2" />
                            <rect x="26" y="32" width="4" height="12" rx="1" fill="#E11D48" />
                            <rect x="22" y="36" width="12" height="4" rx="1" fill="#E11D48" />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-base font-black text-slate-900 leading-tight">
                          Medical Platform
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Health care & emergency support
                        </p>
                      </div>

                      {/* Feature Checklist */}
                      <ul className="mt-4 space-y-2 text-xs text-slate-600">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Medical Records</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Health Center Patients</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Emergency Alerts</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Ambulance & Referral</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 stroke-[3]" />
                          <span className="font-medium">Health Reports</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        onClick={() => router.push('/admin/medical')}
                        className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <span>View Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Essential Quick Actions Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider px-2">
                  Quick Actions:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => { setActiveTab('STUDENTS'); setActiveSubTab(''); }}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Student</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab('Leave Requests'); }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Leave</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('LEAVE_GATE_PASS'); setActiveSubTab('Gate Passes'); }}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Approve Gate Pass</span>
                  </button>
                  <button
                    onClick={() => router.push('/admin/service')}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Create Service Request</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('NOTICES'); setActiveSubTab(''); }}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Publish Notice</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('EMERGENCY'); setActiveSubTab(''); }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>View Emergency Alerts</span>
                  </button>
                </div>
              </div>

              {/* Bottom Dashboard: 3 Clean Columns (Recent Activities, Important Alerts, Upcoming/Pending Tasks) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* 1. RECENT ACTIVITIES */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Recent Activities</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Real-time operational stream</p>
                      </div>
                    </div>
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Feed</span>
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
                    {/* Activity 1 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Leave request received</p>
                          <span className="text-[10px] text-slate-400 font-medium">5m ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Amit Sharma (CSE - Block A) · Room 204</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">Warden Approval Required</span>
                      </div>
                    </div>

                    {/* Activity 2 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Ticket className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Gate pass approved</p>
                          <span className="text-[10px] text-slate-400 font-medium">14m ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Priya Patel (Pass #GP-8841) · Weekend Outing</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200/60">Main Gate Verified</span>
                      </div>
                    </div>

                    {/* Activity 3 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Complaint submitted</p>
                          <span className="text-[10px] text-slate-400 font-medium">32m ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Water leakage in Block B, 3rd Floor Washroom</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200/60">Grievance Desk</span>
                      </div>
                    </div>

                    {/* Activity 4 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Service request created</p>
                          <span className="text-[10px] text-slate-400 font-medium">1h ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">AC repair in Computer Lab 4 · Assigned to Ramesh</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-orange-50 text-orange-700 border border-orange-200/60">Facility Maintenance</span>
                      </div>
                    </div>

                    {/* Activity 5 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Security incident resolved</p>
                          <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Visitor ID mismatch cleared at North Gate</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">Security Desk</span>
                      </div>
                    </div>

                    {/* Activity 6 */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <HeartPulse className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-800 truncate">Medical case registered</p>
                          <span className="text-[10px] text-slate-400 font-medium">3h ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">First aid administered at Campus Health Centre</p>
                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200/60">Medical Care</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('AUDIT_LOGS')}
                    className="mt-3 w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>View All Activity Logs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. IMPORTANT ALERTS */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Important Alerts</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Urgent attention & escalations</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/60">
                      5 Active
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
                    {/* Alert 1 */}
                    <div className="p-3 rounded-xl border border-rose-200/80 bg-rose-50/40 hover:bg-rose-50/70 transition space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-rose-800 text-xs font-bold">
                          <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                          <span>Medical emergency triage</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">Critical</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Health Centre logged severe dehydration (Room 112). Physician on duty notified.</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Health Centre · 12m ago</span>
                        <button
                          onClick={() => { setActiveTab('MEDICAL'); router.push('/admin/medical'); }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>Review Case</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Alert 2 */}
                    <div className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/70 transition space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-amber-800 text-xs font-bold">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>Unauthorized entry attempt</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Security</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Unregistered vehicle flagged at South Gate #2. Guard on site verified guest pass.</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Security · 28m ago</span>
                        <button
                          onClick={() => { setActiveTab('SECURITY'); router.push('/admin/security'); }}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>Check Gate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Alert 3 */}
                    <div className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/40 hover:bg-blue-50/70 transition space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-blue-800 text-xs font-bold">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Pending leave approvals</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">12 Pending</span>
                      </div>
                      <p className="text-[11px] text-slate-600">12 weekend outstation leave applications awaiting chief warden authorization.</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Hostel Desk · 45m ago</span>
                        <button
                          onClick={() => { setActiveTab('LEAVE_GATE_PASS'); }}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>Approve All</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Alert 4 */}
                    <div className="p-3 rounded-xl border border-orange-200/80 bg-orange-50/40 hover:bg-orange-50/70 transition space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-orange-800 text-xs font-bold">
                          <Wrench className="w-3.5 h-3.5 text-orange-600" />
                          <span>Critical maintenance issue</span>
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-orange-800">Service</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Main water pump pressure dropped in Boys Hostel Block C. Plumber team assigned.</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium">Facility · 1h ago</span>
                        <button
                          onClick={() => { setActiveTab('SERVICES'); router.push('/admin/service'); }}
                          className="text-[11px] font-bold text-orange-700 hover:text-orange-900 flex items-center space-x-0.5 cursor-pointer"
                        >
                          <span>Track Ticket</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => { setActiveTab('EMERGENCY'); }}
                    className="mt-3 w-full py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Open Emergency Center</span>
                  </button>
                </div>

                {/* 3. UPCOMING / PENDING TASKS */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <ListTodo className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">Upcoming / Pending Tasks</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Priority action list for today</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200/60">
                      5 Tasks
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
                    {/* Task 1 */}
                    <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-blue-300 transition flex items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 text-transparent hover:text-blue-600 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Review leave requests</p>
                          <p className="text-[10px] text-slate-400">12 applications awaiting clearance</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('LEAVE_GATE_PASS')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Review
                      </button>
                    </div>

                    {/* Task 2 */}
                    <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-emerald-300 transition flex items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 text-transparent hover:text-emerald-600 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Approve gate passes</p>
                          <p className="text-[10px] text-slate-400">34 active passes today · Roll call at 7 PM</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('LEAVE_GATE_PASS')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Approve
                      </button>
                    </div>

                    {/* Task 3 */}
                    <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-amber-300 transition flex items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 text-transparent hover:text-amber-600 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Resolve complaints</p>
                          <p className="text-[10px] text-slate-400">24 complaints open · 3 marked urgent</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('GRIEVANCES')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>

                    {/* Task 4 */}
                    <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-rose-300 transition flex items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 text-transparent hover:text-rose-600 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Verify medical cases</p>
                          <p className="text-[10px] text-slate-400">8 health clinic reports need follow-up</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveTab('MEDICAL'); router.push('/admin/medical'); }}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>

                    {/* Task 5 */}
                    <div className="p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-orange-300 transition flex items-center justify-between gap-2.5">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md border border-slate-300 flex items-center justify-center mt-0.5 text-transparent hover:text-orange-600 cursor-pointer">
                          <Check className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800">Follow up maintenance</p>
                          <p className="text-[10px] text-slate-400">5 electrical & plumbing tickets in progress</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setActiveTab('SERVICES'); router.push('/admin/service'); }}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-[10px] font-bold shrink-0 transition cursor-pointer"
                      >
                        Follow Up
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('CALENDAR')}
                    className="mt-3 w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>View Campus Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Clean Footer Banner */}
              <footer className="pt-3 pb-3 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-200/80 gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">CampusHelper</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-medium">Safe Campus • Smart Management • Better Tomorrow</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1.5 font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Realtime Connected</span>
                  </span>
                  <span>•</span>
                  <span>Raajdhani Engineering College (REC)</span>
                  <span>•</span>
                  <span>v2.4.0</span>
                </div>
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
          {(activeTab === 'HOSTEL' || (activeTab as string) === 'WARDEN') && (
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
