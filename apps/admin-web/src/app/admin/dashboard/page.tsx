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
  playCuteNotificationSound,
  playCuteSuccessSound,
  playGatePassUniqueSound,
  playEmergencySirenSound,
} from '../../../lib/audioSound';
import { AdminDashboardOverviewView } from './modules/AdminDashboardOverviewView';
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
  Wifi,
  Sparkles,
  Lock,
  QrCode,
  ScanLine,
  Video,
  ShieldCheck,
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
import { WardenManagementView } from './modules/WardenManagementView';
import { MaintenanceScheduleView } from './modules/MaintenanceScheduleView';
import { AssignedTasksView } from './modules/AssignedTasksView';
import { InventoryManagementView } from './modules/InventoryManagementView';
import { CleaningServicesView } from './modules/CleaningServicesView';
import { WifiSupportView } from './modules/WifiSupportView';
import { LostAndFoundView } from './modules/LostAndFoundView';
import { TransportServiceView } from './modules/TransportServiceView';
import { CampusConfigurationView } from './modules/CampusConfigurationView';
import { UserRoleManagementView } from './modules/UserRoleManagementView';
import { ComplaintServiceDetailModal, ServiceDetailItem } from './modules/ComplaintServiceDetailModal';
import { NotificationCenterModal, AdminCampusNotification } from './modules/NotificationCenterModal';
import { CctvOperationsView } from './modules/CctvOperationsView';
import { SecurityGatePassScannerView } from './modules/SecurityGatePassScannerView';
import { StudentProfileDrawer, ComprehensiveStudentProfile } from './modules/StudentProfileDrawer';
import { AdminReportsAnalyticsView } from './modules/AdminReportsAnalyticsView';

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

const SAMPLE_SERVICE_ITEMS: ServiceDetailItem[] = [
  {
    id: 'sr-1042',
    ticketNumber: 'SR-2026-1042',
    studentName: 'Subham Pradhan',
    studentId: 'CS2023042',
    studentRoll: 'REC-2023-CS042',
    studentPhone: '+91 94370 12001',
    studentEmail: 'subham.pradhan@rec.ac.in',
    hostel: 'Nilgiri Block A',
    block: 'Block A',
    room: 'A-204',
    category: 'Electricity',
    description: 'Electricity not working in Room A-204. Ceiling fan stopped and study lamp sparking from wall socket.',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
    priority: 'HIGH',
    assignedTeam: 'Electrical Team',
    assignedStaff: 'Er. Dilip Das (Lead Electrician)',
    createdTime: 'Today, 08:30 AM',
    slaHours: 2,
    slaDeadline: 'Today, 10:30 AM',
    slaStatus: 'APPROACHING',
    slaMinutesRemaining: 28,
    status: 'NEW',
    timeline: [
      { status: 'Submitted', timestamp: '08:30 AM', note: 'Student submitted via Resident Web App', actor: 'Subham Pradhan' },
      { status: 'Assigned', timestamp: '08:35 AM', note: 'Auto-routed to Electrical Team', actor: 'System Dispatch' },
    ],
    internalNotes: [
      { id: 'n-1', author: 'Chief Warden Dash', timestamp: '08:40 AM', text: 'Checked breaker on 2nd floor DB box; socket needs replacement.' },
    ],
  },
  {
    id: 'sr-1043',
    ticketNumber: 'SR-2026-1043',
    studentName: 'Ananya Pattnaik',
    studentId: 'EC2023018',
    studentRoll: 'REC-2023-EC018',
    studentPhone: '+91 98610 22334',
    studentEmail: 'ananya.p@rec.ac.in',
    hostel: 'Shivalik Block B',
    block: 'Block B',
    room: 'B-312',
    category: 'Plumbing',
    description: 'Continuous water leakage from washbasin angle cock. Water dripping onto bathroom floor creating slip hazard.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    priority: 'HIGH',
    assignedTeam: 'Plumbing Team',
    assignedStaff: 'Mahendra Singh (Lead Plumber)',
    createdTime: 'Today, 09:15 AM',
    slaHours: 1,
    slaDeadline: 'Today, 10:15 AM',
    slaStatus: 'BREACHED',
    slaMinutesRemaining: -12,
    status: 'ASSIGNED',
    timeline: [
      { status: 'Submitted', timestamp: '09:15 AM', note: 'Student reported urgent bathroom leak', actor: 'Ananya Pattnaik' },
      { status: 'Assigned', timestamp: '09:20 AM', note: 'Dispatched plumber Mahendra Singh', actor: 'Admin Dispatch' },
    ],
    internalNotes: [
      { id: 'n-2', author: 'Estate Storekeeper', timestamp: '09:25 AM', text: 'Issued 1/2 inch ceramic tap spindle to technician.' },
    ],
  },
  {
    id: 'sr-1044',
    ticketNumber: 'SR-2026-1044',
    studentName: 'Rohan Verma',
    studentId: 'ME2022089',
    studentRoll: 'REC-2022-ME089',
    studentPhone: '+91 97762 99881',
    studentEmail: 'rohan.v@rec.ac.in',
    hostel: 'Dhaulagiri Block C',
    block: 'Block C',
    room: 'C-118',
    category: 'Wi-Fi / Internet',
    description: 'Hostel corridor Wi-Fi AP-104 high latency and packet loss. Cannot attend scheduled online lab evaluation.',
    priority: 'MEDIUM',
    assignedTeam: 'IT / Network Team',
    assignedStaff: 'Suresh Kumar (Network Tech)',
    createdTime: 'Today, 07:45 AM',
    slaHours: 4,
    slaDeadline: 'Today, 11:45 AM',
    slaStatus: 'ON_TRACK',
    slaMinutesRemaining: 110,
    status: 'IN_PROGRESS',
    timeline: [
      { status: 'Submitted', timestamp: '07:45 AM', note: 'Wi-Fi ticket logged', actor: 'Rohan Verma' },
      { status: 'Assigned', timestamp: '08:00 AM', note: 'Assigned to IT Network team', actor: 'IT Helpdesk' },
      { status: 'Work Started', timestamp: '08:30 AM', note: 'Suresh Kumar checking PoE switch port', actor: 'Suresh Kumar' },
    ],
    internalNotes: [],
  },
  {
    id: 'sr-1045',
    ticketNumber: 'SR-2026-1045',
    studentName: 'Pooja Mohanty',
    studentId: 'EE2024005',
    studentRoll: 'REC-2024-EE005',
    studentPhone: '+91 94371 88921',
    studentEmail: 'pooja.m@rec.ac.in',
    hostel: 'Shivalik Block B',
    block: 'Block B',
    room: 'B-108',
    category: 'Cleaning',
    description: 'Post-monsoon common washroom drainage clogged with fallen leaves and dust. Water accumulation in shower bay.',
    priority: 'MEDIUM',
    assignedTeam: 'Cleaning Team',
    assignedStaff: 'Sita Majhi (Lead Housekeeper)',
    createdTime: 'Today, 06:30 AM',
    slaHours: 4,
    slaDeadline: 'Today, 10:30 AM',
    slaStatus: 'ON_TRACK',
    slaMinutesRemaining: 45,
    status: 'IN_PROGRESS',
    timeline: [
      { status: 'Submitted', timestamp: '06:30 AM', note: 'Housekeeping request raised', actor: 'Pooja Mohanty' },
      { status: 'Work Started', timestamp: '07:00 AM', note: 'Housekeeping team dispatched', actor: 'Sita Majhi' },
    ],
    internalNotes: [],
  },
  {
    id: 'sr-1046',
    ticketNumber: 'SR-2026-1046',
    studentName: 'Manish Ray',
    studentId: 'CS2023110',
    studentRoll: 'REC-2023-CS110',
    studentPhone: '+91 98112 00011',
    studentEmail: 'manish.r@rec.ac.in',
    hostel: 'Nilgiri Block A',
    block: 'Block A',
    room: 'A-310',
    category: 'Furniture',
    description: 'Study table drawer slider stuck and cupboard lock cylinder jammed.',
    priority: 'LOW',
    assignedTeam: 'Maintenance Team',
    assignedStaff: 'Baidhar Rout (Carpenter)',
    createdTime: 'Yesterday, 04:00 PM',
    slaHours: 24,
    slaDeadline: 'Today, 04:00 PM',
    slaStatus: 'ON_TRACK',
    slaMinutesRemaining: 380,
    status: 'ASSIGNED',
    timeline: [
      { status: 'Submitted', timestamp: 'Yesterday 04:00 PM', note: 'Carpentry request raised', actor: 'Manish Ray' },
    ],
    internalNotes: [],
  },
];

const INITIAL_CENTRAL_NOTIFICATIONS: AdminCampusNotification[] = [
  {
    id: 'notif-1',
    eventType: '🚨 SOS Emergency Alarm',
    category: 'RED_URGENT',
    studentName: 'Rahul Verma',
    studentId: 'CS2023088',
    location: 'Hostel Nilgiri Block A',
    hostelRoom: 'Room A-112',
    time: '4 mins ago',
    priority: 'EMERGENCY',
    currentStatus: 'DISPATCHED',
    requiredAction: 'Immediate Medical Triage & Security Escort',
    read: false,
    targetTab: 'EMERGENCY',
    relatedId: 'sr-1042',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-2',
    eventType: '🏥 Acute Dehydration Case',
    category: 'RED_URGENT',
    studentName: 'Priya Das',
    studentId: 'EC2023018',
    location: 'Hostel Shivalik Block B',
    hostelRoom: 'Room B-210',
    time: '18 mins ago',
    priority: 'EMERGENCY',
    currentStatus: 'UNDER_TREATMENT',
    requiredAction: 'Health Center Ambulance Triage',
    read: false,
    targetTab: 'MEDICAL',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-3',
    eventType: '⚡ Electricity Outage & Sparking',
    category: 'ORANGE_HIGH',
    studentName: 'Subham Pradhan',
    studentId: 'CS2023042',
    location: 'Nilgiri Block A',
    hostelRoom: 'Room A-204',
    time: '32 mins ago',
    priority: 'HIGH',
    currentStatus: 'NEW',
    requiredAction: 'Assign Electrician to Replace DB Socket',
    read: false,
    targetTab: 'SERVICES',
    relatedId: 'sr-1042',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-4',
    eventType: '🚰 Plumbing Washbasin Leak',
    category: 'ORANGE_HIGH',
    studentName: 'Ananya Pattnaik',
    studentId: 'EC2023018',
    location: 'Shivalik Block B',
    hostelRoom: 'Room B-312',
    time: '45 mins ago',
    priority: 'HIGH',
    currentStatus: 'ASSIGNED',
    requiredAction: 'SLA Breached: Expedite Plumber Dispatch',
    read: false,
    targetTab: 'SERVICES',
    relatedId: 'sr-1043',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-5',
    eventType: '🚪 Gate Pass Overdue Notice',
    category: 'ORANGE_HIGH',
    studentName: 'Subham Pradhan',
    studentId: 'CS2023042',
    location: 'Main Gate Barrier #1',
    hostelRoom: 'Room A-204',
    time: '1 hour ago',
    priority: 'HIGH',
    currentStatus: 'OVERDUE',
    requiredAction: 'Contact Student / Verify Return',
    read: true,
    targetTab: 'LEAVE_GATE_PASS',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-6',
    eventType: '🧹 Washroom Sanitization',
    category: 'BLUE_NORMAL',
    studentName: 'Pooja Mohanty',
    studentId: 'EE2024005',
    location: 'Shivalik Block B',
    hostelRoom: 'Room B-108',
    time: '2 hours ago',
    priority: 'MEDIUM',
    currentStatus: 'IN_PROGRESS',
    requiredAction: 'Housekeeping Supervisor Inspection',
    read: true,
    targetTab: 'CLEANING_SERVICES',
    relatedId: 'sr-1045',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-7',
    eventType: '📶 Corridor Wi-Fi Packet Loss',
    category: 'BLUE_NORMAL',
    studentName: 'Rohan Verma',
    studentId: 'ME2022089',
    location: 'Dhaulagiri Block C',
    hostelRoom: 'Room C-118',
    time: '3 hours ago',
    priority: 'MEDIUM',
    currentStatus: 'IN_PROGRESS',
    requiredAction: 'PoE Switch Diagnostics by IT Team',
    read: true,
    targetTab: 'WIFI_SUPPORT',
    relatedId: 'sr-1044',
    dateGroup: 'TODAY',
  },
  {
    id: 'notif-8',
    eventType: '🪑 Study Table Repair',
    category: 'BLUE_NORMAL',
    studentName: 'Manish Ray',
    studentId: 'CS2023110',
    location: 'Nilgiri Block A',
    hostelRoom: 'Room A-310',
    time: 'Yesterday 04:00 PM',
    priority: 'LOW',
    currentStatus: 'ASSIGNED',
    requiredAction: 'Carpenter Dispatch to Room',
    read: true,
    targetTab: 'SERVICES',
    relatedId: 'sr-1046',
    dateGroup: 'YESTERDAY',
  },
];

const SAMPLE_STUDENT_PROFILE: ComprehensiveStudentProfile = {
  id: 'stu-1',
  name: 'Subham Pradhan',
  studentId: 'CS2023042',
  rollNumber: 'REC-2023-CS042',
  email: 'subham.pradhan@rec.ac.in',
  phone: '+91 94370 12001',
  gender: 'Male',
  bloodGroup: 'O+',
  dob: '14 Nov 2003',
  department: 'Computer Science & Engineering',
  course: 'B.Tech CSE',
  semester: '5th Semester (3rd Year)',
  cgpa: '8.84',
  attendancePercentage: 92,
  hostel: 'Nilgiri Residence (Boys)',
  block: 'Block A',
  roomNumber: 'A-204',
  accountStatus: 'ACTIVE',
  emergencyContact: {
    name: 'Pradeep Kumar Pradhan',
    relation: 'Father',
    phone: '+91 94371 55667',
  },
  gatePassHistory: [
    { passId: 'GP-2026-8812', destination: 'Cuttack Home Visit', departure: 'Today, 04:30 PM', returned: 'Sunday, 08:00 PM', status: 'APPROVED' },
    { passId: 'GP-2026-7201', destination: 'Bhubaneswar Railway Station', departure: '12 Sep 2026, 02:00 PM', returned: '14 Sep 2026, 06:00 PM', status: 'RETURNED' },
  ],
  serviceRequests: [
    { id: 'SR-2026-1042', category: 'Electricity Outage', date: 'Today, 08:30 AM', status: 'NEW' },
    { id: 'SR-2026-0810', category: 'Study Desk Hinge Repair', date: '18 Aug 2026', status: 'RESOLVED' },
  ],
  medicalHistory: [
    { id: 'MED-2026-102', type: 'Health Center OPD Consultation (Viral Fever)', date: '02 Sep 2026', status: 'Treated', authorizedOnly: true },
  ],
  documents: [
    { name: 'Semester 4 Grade Sheet.pdf', type: 'PDF', uploadDate: '15 Jul 2026' },
    { name: 'Hostel Undertaking Form.pdf', type: 'PDF', uploadDate: '01 Aug 2026' },
    { name: 'Anti-Ragging Affidavit.pdf', type: 'PDF', uploadDate: '01 Aug 2026' },
  ],
};

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
    | 'WARDEN_OPS'
    | 'LEAVE_GATE_PASS'
    | 'SERVICES'
    | 'MAINTENANCE_SCHEDULE'
    | 'ASSIGNED_TASKS'
    | 'INVENTORY'
    | 'CLEANING_SERVICES'
    | 'WIFI_SUPPORT'
    | 'MESS_MANAGEMENT'
    | 'SECURITY'
    | 'MEDICAL'
    | 'VISITORS'
    | 'EMERGENCY'
    | 'LOST_FOUND'
    | 'TRANSPORT'
    | 'USER_ROLES'
    | 'CAMPUS_CONFIG'
    | 'SETTINGS'
    | 'CCTV'
    | 'SECURITY_SCANNER'
    // Operational Role Platforms
    | 'WARDEN'
    // Other administrative views
    | 'STAFF_ROLES'
    | 'NOTICES'
    | 'CALENDAR'
    | 'GALLERY'
    | 'CONTACTS'
    | 'MY_PROFILE'
    | 'GRIEVANCES'
    | 'REPORTS'
    | 'AUDIT_LOGS'
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
        const dateStr = now.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const timeStr = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        setCurrentDateTime(`${dateStr}  |  ${timeStr}`);
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
    type: 'EMERGENCY' | 'PASS' | 'COMPLAINT' | 'ADMISSION' | 'STAFF' | 'GENERAL' | 'MEDICAL' | 'QUERY';
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

  // Operational State & Modal Integrations
  const [currentAdminRole, setCurrentAdminRole] = useState<
    | 'SUPER_ADMIN'
    | 'CAMPUS_ADMIN'
    | 'WARDEN'
    | 'SECURITY'
    | 'MAINTENANCE'
    | 'IT_STAFF'
    | 'MEDICAL_STAFF'
  >('SUPER_ADMIN');
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [showNotificationCenterModal, setShowNotificationCenterModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState<ServiceDetailItem | null>(null);
  const [showStudentDrawer, setShowStudentDrawer] = useState(false);
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<ComprehensiveStudentProfile | null>(SAMPLE_STUDENT_PROFILE);
  const [serviceTickets, setServiceTickets] = useState<ServiceDetailItem[]>(SAMPLE_SERVICE_ITEMS);
  const [centralNotifications, setCentralNotifications] = useState<AdminCampusNotification[]>(INITIAL_CENTRAL_NOTIFICATIONS);

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

  // Cute Audio Synthesizer Chime for Admin Instant Alert
  const playAdminAudioChime = () => {
    playCuteNotificationSound();
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
          title: data.category === 'MEDICAL'
            ? `💊 Medical Request: ${data.residentName || 'Student'}`
            : data.category === 'STUDENT_QUERY'
            ? `💬 Student Query #${data.ticketNumber || 'QRY'}`
            : `📝 Grievance #${data.ticketNumber || 'TKT'}`,
          message: `${data.residentName || 'Student'} (${data.roomNumber || 'Room'}): ${data.title || data.description || data.category}`,
          type: data.category === 'MEDICAL' ? 'MEDICAL' : data.category === 'STUDENT_QUERY' ? 'QUERY' : 'COMPLAINT',
          timestamp: 'Just now',
          read: false,
          targetTab: data.category === 'MEDICAL' ? 'MEDICAL' : 'GRIEVANCES',
          data,
        },
        ...prev,
      ]);
      setCentralNotifications((prev) => [
        {
          id: `notif-cmp-${Date.now()}`,
          eventType: data.category === 'MEDICAL'
            ? 'Medical Help Request'
            : data.category === 'STUDENT_QUERY'
            ? 'Student Query'
            : 'Campus Grievance',
          category: data.priority === 'CRITICAL' || data.priority === 'EMERGENCY'
            ? 'RED_URGENT'
            : data.priority === 'HIGH'
            ? 'ORANGE_HIGH'
            : 'BLUE_NORMAL',
          studentName: data.residentName || 'Student Resident',
          studentId: data.residentId || 'REC-STU',
          location: data.blockName || 'Hostel',
          hostelRoom: data.roomNumber || 'Room',
          time: 'Just now',
          priority: data.priority || 'MEDIUM',
          currentStatus: 'NEW',
          requiredAction: data.category === 'MEDICAL'
            ? 'Doctor / Pharmacy Consultation'
            : data.category === 'STUDENT_QUERY'
            ? 'Answer Student Query'
            : 'Assign Maintenance Staff',
          read: false,
          targetTab: data.category === 'MEDICAL' ? 'MEDICAL' : 'GRIEVANCES',
          dateGroup: 'TODAY',
          relatedId: data.ticketNumber || data.id,
        },
        ...prev,
      ]);
      setSuccessMsg(`🚨 Alert #${data.ticketNumber || 'TKT'}: ${data.residentName || 'Student'} (${data.roomNumber || 'Room'}) - [${data.category || 'OTHER'}]`);
      setTimeout(() => setSuccessMsg(''), 8000);
    };

    socket.on('complaint:created', handleComplaintIncoming);
    socket.on('complaint:update', handleComplaintIncoming);
    socket.on('complaint:raised', handleComplaintIncoming);

    // 4. Real-Time Gate Pass / Leave Request from Students
    const handlePassIncoming = (data: any) => {
      console.log('⚡ Real-time pass update received in Admin Dashboard:', data);
      playGatePassUniqueSound();
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
      setCentralNotifications((prev) => [
        {
          id: `notif-pass-${Date.now()}`,
          eventType: 'Gate Pass / Leave Request',
          category: 'ORANGE_HIGH',
          studentName: data.studentName || data.residentName || 'Student Resident',
          studentId: data.studentId || 'REC-STU',
          location: data.destination || 'Campus Outing',
          hostelRoom: data.roomNumber || 'Room',
          time: 'Just now',
          priority: 'HIGH',
          currentStatus: 'PENDING',
          requiredAction: 'Review and Approve Gate Pass',
          read: false,
          targetTab: 'LEAVE_GATE_PASS',
          dateGroup: 'TODAY',
          relatedId: data.passNumber || data.id,
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
      playEmergencySirenSound();
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
      setCentralNotifications((prev) => [
        {
          id: `notif-em-${Date.now()}`,
          eventType: `🚨 SOS Alarm: ${data.emergencyType || 'CRITICAL'}`,
          category: 'RED_URGENT',
          studentName: data.residentName || 'Student Resident',
          studentId: data.residentId || 'REC-STU',
          location: data.locationDetails || 'Campus Hostel',
          hostelRoom: data.roomNumber || 'Room',
          time: 'Just now',
          priority: 'EMERGENCY',
          currentStatus: 'ACTIVE',
          requiredAction: 'Immediate Campus Security & Medical Dispatch',
          read: false,
          targetTab: 'EMERGENCY',
          dateGroup: 'TODAY',
          relatedId: data.id,
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

    // 6. Real-Time Student Medical Requests
    socket.on('medical:request_created', (data: any) => {
      console.log('💊 Real-time medical request incoming:', data);
      playAdminAudioChime();
      setSuccessMsg(`💊 Student Medical Help: ${data.studentName || 'Student'} (${data.room || data.roomNumber || 'Room'}) - ${data.description || 'Medicine requested'}`);
      setTimeout(() => setSuccessMsg(''), 9000);
    });

    // 7. Real-Time Student Queries
    socket.on('query:created', (data: any) => {
      console.log('💬 Real-time student query incoming:', data);
      playAdminAudioChime();
      setSuccessMsg(`💬 New Student Query: ${data.residentName || data.studentName || 'Student'} asked "${data.title || data.description}"`);
      setTimeout(() => setSuccessMsg(''), 9000);
    });

    // 8. Unified Notification Event
    socket.on('notification:new', (payload: any) => {
      console.log('📩 notification:new received in Admin Dashboard:', payload);
      if (payload.type === 'EMERGENCY') {
        playEmergencySirenSound();
      } else if (payload.type === 'PASS') {
        playGatePassUniqueSound();
      } else {
        playAdminAudioChime();
      }
      if (payload.title) {
        setSuccessMsg(`${payload.title}: ${payload.message || 'New student action received'}`);
        setTimeout(() => setSuccessMsg(''), 8000);
      }
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
                : payload.type === 'MEDICAL'
                ? 'MEDICAL'
                : payload.type === 'COMPLAINT' || payload.type === 'QUERY'
                ? 'GRIEVANCES'
                : payload.type === 'ADMISSION'
                ? 'APPROVALS'
                : 'DASHBOARD',
            data: payload.data,
          },
          ...prev,
        ];
      });
      setCentralNotifications((prev) => {
        const exists = prev.some((n) => n.id === payload.id);
        if (exists) return prev;
        return [
          {
            id: payload.id || `notif-${Date.now()}`,
            eventType: payload.eventType || payload.title || 'Campus Event',
            category: payload.category || (payload.type === 'EMERGENCY' ? 'RED_URGENT' : 'BLUE_NORMAL'),
            studentName: payload.studentName || payload.data?.residentName || 'Student Resident',
            studentId: payload.studentId || payload.data?.residentId || 'REC-STU',
            location: payload.location || payload.data?.locationDetails || 'Campus',
            hostelRoom: payload.hostelRoom || payload.data?.roomNumber || 'Room',
            time: 'Just now',
            priority: payload.priority || (payload.type === 'EMERGENCY' ? 'EMERGENCY' : 'MEDIUM'),
            currentStatus: payload.currentStatus || 'NEW',
            requiredAction: payload.requiredAction || 'Action required',
            read: false,
            targetTab:
              payload.type === 'EMERGENCY'
                ? 'EMERGENCY'
                : payload.type === 'PASS'
                ? 'LEAVE_GATE_PASS'
                : payload.type === 'MEDICAL'
                ? 'MEDICAL'
                : payload.type === 'COMPLAINT' || payload.type === 'QUERY'
                ? 'GRIEVANCES'
                : 'DASHBOARD',
            dateGroup: 'TODAY',
            relatedId: payload.ticketNumber || payload.passNumber || payload.id,
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

  // Complete Campus Operations Suite
  const adminModules = [
    { id: 'DASHBOARD', label: 'Dashboard Overview', icon: Home },
    {
      id: 'STUDENTS',
      label: 'Student Management',
      icon: GraduationCap,
      badge: pendingStudents.length > 0 ? `${pendingStudents.length}` : '',
    },
    { id: 'HOSTEL', label: 'Hostel Management', icon: Building2 },
    { id: 'WARDEN_OPS', label: 'Warden Management', icon: Users },
    { id: 'LEAVE_GATE_PASS', label: 'Leave & Gate Pass', icon: FileText, badge: '34' },
    { id: 'SERVICES', label: 'Service Requests', icon: Wrench, badge: '18' },
    {
      id: 'GRIEVANCES',
      label: 'Student Queries & Grievances',
      icon: AlertTriangle,
      badge: complaints.filter((c) => c.status === 'RAISED' || c.status === 'IN_PROGRESS').length > 0
        ? `${complaints.filter((c) => c.status === 'RAISED' || c.status === 'IN_PROGRESS').length}`
        : '',
    },
    { id: 'SECURITY_SCANNER', label: 'Scan Gate Pass (QR)', icon: QrCode },
    { id: 'CCTV', label: 'CCTV Surveillance', icon: Camera, badge: '7 Online' },
    { id: 'MAINTENANCE_SCHEDULE', label: 'Maintenance Schedule', icon: Calendar, badge: '6' },
    { id: 'ASSIGNED_TASKS', label: 'Assigned Staff Tasks', icon: ListTodo, badge: '14' },
    { id: 'INVENTORY', label: 'Spare Parts & Inventory', icon: Package, badge: '4 Low' },
    { id: 'CLEANING_SERVICES', label: 'Cleaning & Sanitation', icon: Sparkles },
    { id: 'WIFI_SUPPORT', label: 'Wi-Fi & Internet Support', icon: Wifi, badge: '5' },
    { id: 'MESS_MANAGEMENT', label: 'Mess Services', icon: Utensils },
    { id: 'SECURITY', label: 'Security Operations', icon: Shield, badge: '1 Alert' },
    { id: 'MEDICAL', label: 'Medical Care Desk', icon: HeartPulse, badge: '8' },
    { id: 'REPORTS', label: 'Reports & Analytics', icon: FileText },
    { id: 'AUDIT_LOGS', label: 'Audit Logs', icon: Clock },
    { id: 'VISITORS', label: 'Visitor Management', icon: UserCheck, badge: '24' },
    { id: 'EMERGENCY', label: 'Emergency & SOS', icon: ShieldAlert, badge: activeSosAlert ? 'SOS' : '' },
    { id: 'LOST_FOUND', label: 'Lost & Found', icon: Package },
    { id: 'TRANSPORT', label: 'Transport & Shuttles', icon: Car },
    { id: 'USER_ROLES', label: 'User Roles & Access', icon: Lock },
    { id: 'CAMPUS_CONFIG', label: 'Campus Configuration', icon: Building },
    { id: 'SETTINGS', label: 'College Settings', icon: Settings },
  ];

  // RBAC Permission Scoping
  const rolePermissionMap: Record<string, string[]> = {
    SUPER_ADMIN: ['*'],
    CAMPUS_ADMIN: ['DASHBOARD', 'STUDENTS', 'HOSTEL', 'SERVICES', 'GRIEVANCES', 'SECURITY', 'REPORTS', 'CAMPUS_CONFIG', 'AUDIT_LOGS', 'SETTINGS'],
    WARDEN: ['DASHBOARD', 'STUDENTS', 'HOSTEL', 'WARDEN_OPS', 'LEAVE_GATE_PASS', 'GRIEVANCES', 'MESS_MANAGEMENT'],
    SECURITY: ['DASHBOARD', 'SECURITY', 'SECURITY_SCANNER', 'CCTV', 'VISITORS', 'EMERGENCY'],
    MAINTENANCE: ['DASHBOARD', 'SERVICES', 'MAINTENANCE_SCHEDULE', 'ASSIGNED_TASKS', 'INVENTORY', 'CLEANING_SERVICES'],
    IT_STAFF: ['DASHBOARD', 'WIFI_SUPPORT', 'SERVICES', 'ASSIGNED_TASKS'],
    MEDICAL_STAFF: ['DASHBOARD', 'MEDICAL', 'EMERGENCY'],
  };

  const allowedForCurrentRole = rolePermissionMap[currentAdminRole] || ['*'];
  const visibleModules = adminModules.filter(
    (m) => allowedForCurrentRole.includes('*') || allowedForCurrentRole.includes(m.id)
  );

  // 4 Operational Role Platforms (Visually distinct cards from normal modules)
  const rolePlatforms = [
    {
      id: 'WARDEN',
      label: 'Warden',
      roleTitle: 'Warden Platform',
      subtitle: 'Hostel & Student Welfare',
      icon: Building2,
      href: '/admin/warden',
      cardBg: 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200/90 text-emerald-950',
      iconBg: 'bg-emerald-600 text-white shadow-2xs',
    },
    {
      id: 'SERVICES',
      label: 'Service',
      roleTitle: 'Service Platform',
      subtitle: 'Maintenance & Support',
      icon: Wrench,
      href: '/admin/service',
      cardBg: 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/90 text-amber-950',
      iconBg: 'bg-amber-600 text-white shadow-2xs',
    },
    {
      id: 'SECURITY',
      label: 'Security',
      roleTitle: 'Security Platform',
      subtitle: 'Safety & Access Control',
      icon: Shield,
      href: '/admin/security',
      cardBg: 'bg-indigo-50/80 hover:bg-indigo-100/90 border-indigo-200/90 text-indigo-950',
      iconBg: 'bg-indigo-600 text-white shadow-2xs',
    },
    {
      id: 'MEDICAL',
      label: 'Medical',
      roleTitle: 'Medical Platform',
      subtitle: 'Health & Emergency Care',
      icon: HeartPulse,
      href: '/admin/medical',
      cardBg: 'bg-rose-50/80 hover:bg-rose-100/90 border-rose-200/90 text-rose-950',
      iconBg: 'bg-rose-600 text-white shadow-2xs',
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FC] text-slate-800 font-sans overflow-hidden">
      {/* 1. LEFT SIDEBAR (Clean White & Royal Blue, Organized Admin Modules + Distinct Role Platforms) */}
      <aside className="w-64 md:w-72 bg-white text-slate-800 flex flex-col justify-between shrink-0 shadow-lg border-r border-slate-200/90 select-none">
        <div className="overflow-y-auto scrollbar-thin px-3.5 py-4 space-y-4">
          {/* Logo & Platform Tagline */}
          <div className="px-1.5 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight truncate">
                CampusHelper
              </h1>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                One Platform • Every Campus Need
              </p>
            </div>
          </div>

          {/* Admin Role Selector Capsule (Interactive RBAC Switcher) */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-slate-900 truncate uppercase tracking-wider">Active Admin Role</p>
                  <p className="text-[9px] text-blue-600 font-semibold truncate">Role-Based Access Control</p>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-mono font-bold border border-blue-200/70">
                RBAC
              </span>
            </div>
            <select
              value={currentAdminRole}
              onChange={(e) => setCurrentAdminRole(e.target.value as any)}
              className="w-full bg-white border border-slate-200 hover:border-blue-300 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition"
            >
              <option value="SUPER_ADMIN">⚡ Super Admin (Full Command)</option>
              <option value="CAMPUS_ADMIN">🏛️ Campus Admin</option>
              <option value="WARDEN">🏢 Hostel Warden</option>
              <option value="MAINTENANCE">🔧 Maintenance &amp; Services</option>
              <option value="SECURITY">🛡️ Security In-Charge</option>
              <option value="MEDICAL_STAFF">🩺 Medical Officer</option>
              <option value="IT_STAFF">💻 IT &amp; Systems Admin</option>
            </select>
          </div>

          {/* Section 1: 4 CORE OPERATIONAL ROLE PLATFORMS (Elevated to Top of Sidebar) */}
          <div className="space-y-2 pt-1">
            <div className="px-2 flex items-center justify-between text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
              <div className="flex items-center space-x-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Operational Platforms</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono font-bold border border-blue-100">
                4 Hubs
              </span>
            </div>

            {/* Modern 2x2 Command Deck Grid */}
            <div className="grid grid-cols-2 gap-2">
              {rolePlatforms.map((role) => {
                const Icon = role.icon;
                const isCurrentTab = activeTab === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => router.push(role.href)}
                    className={`p-2.5 rounded-xl border transition flex flex-col justify-between group cursor-pointer shadow-2xs text-left ${
                      role.cardBg
                    } ${isCurrentTab ? 'ring-2 ring-blue-500 shadow-sm' : ''}`}
                    title={`Open ${role.roleTitle}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className={`w-7 h-7 rounded-lg ${role.iconBg} flex items-center justify-center shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {role.label}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate">
                        {role.label === 'Warden'
                          ? 'Hostel Welfare'
                          : role.label === 'Service'
                          ? 'Maintenance'
                          : role.label === 'Security'
                          ? 'Gate Control'
                          : 'Health Clinic'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: ADMIN MANAGER (Scoped by RBAC) */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-2 pt-1 pb-1 flex items-center justify-between">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Admin Manager
              </p>
              <span className="text-[9px] text-slate-400 font-mono font-semibold">
                {visibleModules.length} Modules
              </span>
            </div>
            <nav className="space-y-1 text-xs">
              {visibleModules.map((item) => {
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
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
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
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Bottom: User Profile Capsule & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'SP'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'R. Subham Pradhan'}</p>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-slate-500 truncate">Admin Manager</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">• Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('SETTINGS')}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-semibold transition shadow-2xs cursor-pointer"
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

          {/* Emergency Indicator Capsule */}
          <div className="hidden lg:flex items-center ml-3 shrink-0">
            {activeSosAlert ? (
              <button
                type="button"
                onClick={() => setActiveTab('EMERGENCY')}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-black animate-pulse transition cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 animate-bounce" />
                <span>🚨 ACTIVE SOS EMERGENCY</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>🟢 ALL SYSTEMS SECURE</span>
              </div>
            )}
          </div>

          {/* Right: Quick Action, Notification Bell, Calendar/Time, College Selector */}
          <div className="flex items-center space-x-3 shrink-0 ml-4">
            {/* Quick Action Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Action</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {quickActionOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-2 space-y-1">
                  <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Campus Operations
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('SECURITY_SCANNER');
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4 text-blue-600" />
                    <span>Scan Student Gate Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('CCTV');
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-slate-700" />
                    <span>CCTV Surveillance Deck</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServiceItem(serviceTickets[0]);
                      setShowServiceDetailModal(true);
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition cursor-pointer"
                  >
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span>Review High Priority Ticket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForDrawer(SAMPLE_STUDENT_PROFILE);
                      setShowStudentDrawer(true);
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>View Student Master Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('REPORTS');
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Generate Multi-Domain Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotificationCenterModal(true);
                      setQuickActionOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                  >
                    <BellRing className="w-4 h-4 text-rose-600" />
                    <span>Open Notification Center</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cute Notification Chime Sound Preview */}
            <button
              type="button"
              onClick={() => playCuteNotificationSound()}
              title="Click to hear the cute notification sound ✨"
              className="px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs flex items-center space-x-1.5 border border-pink-200 transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>🔔</span>
              <span className="hidden sm:inline">Cute Sound</span>
            </button>

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
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotificationCenterModal(true);
                          setShowNotificationDropdown(false);
                        }}
                        className="text-[10px] text-amber-300 hover:text-white font-bold cursor-pointer underline"
                      >
                        Center
                      </button>
                      {notifications.some((n) => !n.read) && (
                        <button
                          type="button"
                          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                          className="text-[10px] text-blue-300 hover:text-white underline font-bold cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
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

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex flex-col space-y-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotificationCenterModal(true);
                        setShowNotificationDropdown(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Open Central Notification Center &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('NOTICES');
                        setShowNotificationDropdown(false);
                      }}
                      className="text-xs text-slate-500 hover:text-blue-600 font-semibold cursor-pointer"
                    >
                      View All Campus Broadcasts &amp; Notices
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
            <AdminDashboardOverviewView
              user={user}
              currentDateTime={currentDateTime}
              activeSosAlert={activeSosAlert}
              pendingStudents={pendingStudents}
              serviceTickets={serviceTickets}
              rolePlatforms={rolePlatforms}
              onNavigateTab={(tab, subTab) => {
                setActiveTab(tab as AdminTab);
                if (subTab) setActiveSubTab(subTab);
              }}
              onOpenServiceModal={(item) => {
                setSelectedServiceItem(item);
                setShowServiceDetailModal(true);
              }}
              onApproveStudent={handleApproveStudent}
            />
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

          {/* WARDEN OPERATIONS MANAGEMENT (Module 5) */}
          {activeTab === 'WARDEN_OPS' && <WardenManagementView />}

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

          {/* MAINTENANCE SCHEDULE (Module 7) */}
          {activeTab === 'MAINTENANCE_SCHEDULE' && <MaintenanceScheduleView />}

          {/* ASSIGNED TASKS (Module 8) */}
          {activeTab === 'ASSIGNED_TASKS' && <AssignedTasksView />}

          {/* SPARE PARTS & INVENTORY (Module 9) */}
          {activeTab === 'INVENTORY' && <InventoryManagementView />}

          {/* CLEANING SERVICES (Module 11) */}
          {activeTab === 'CLEANING_SERVICES' && <CleaningServicesView />}

          {/* WI-FI / INTERNET SUPPORT (Module 12) */}
          {activeTab === 'WIFI_SUPPORT' && <WifiSupportView />}

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

          {/* LOST & FOUND MANAGEMENT (Module 17) */}
          {activeTab === 'LOST_FOUND' && <LostAndFoundView />}

          {/* TRANSPORT SERVICE (Module 18) */}
          {activeTab === 'TRANSPORT' && <TransportServiceView />}

          {/* USER & ROLE GOVERNANCE (Module 20) */}
          {activeTab === 'USER_ROLES' && <UserRoleManagementView />}

          {/* CAMPUS CONFIGURATION (Module 19) */}
          {activeTab === 'CAMPUS_CONFIG' && <CampusConfigurationView />}

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
          {/* CCTV SURVEILLANCE & SECURITY OPERATIONS                   */}
          {/* ========================================================= */}
          {activeTab === 'CCTV' && <CctvOperationsView />}

          {/* ========================================================= */}
          {/* GATE PASS VERIFICATION & TURNSTILE SCANNER                */}
          {/* ========================================================= */}
          {activeTab === 'SECURITY_SCANNER' && <SecurityGatePassScannerView />}

          {/* ========================================================= */}
          {/* MODULE 17: REPORTS & ANALYTICS                            */}
          {/* ========================================================= */}
          {activeTab === 'REPORTS' && <AdminReportsAnalyticsView />}

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

      {/* ========================================================= */}
      {/* MODAL 1: COMPLAINT & SERVICE REQUEST DETAIL WORKFLOW VIEW */}
      {/* ========================================================= */}
      {showServiceDetailModal && selectedServiceItem && (
        <ComplaintServiceDetailModal
          item={selectedServiceItem}
          onClose={() => {
            setShowServiceDetailModal(false);
            setSelectedServiceItem(null);
          }}
          onUpdateStatus={(id, newStatus, note) => {
            setServiceTickets((prev) =>
              prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
            );
            if (selectedServiceItem && selectedServiceItem.id === id) {
              setSelectedServiceItem({ ...selectedServiceItem, status: newStatus });
            }
            setSuccessMsg(`✓ Status for ticket #${selectedServiceItem.ticketNumber} updated to ${newStatus}`);
            setTimeout(() => setSuccessMsg(''), 4000);
          }}
          onAssignStaff={(id, team, staffName) => {
            setServiceTickets((prev) =>
              prev.map((t) =>
                t.id === id ? { ...t, assignedTeam: team, assignedStaff: staffName, status: 'ASSIGNED' } : t
              )
            );
            if (selectedServiceItem && selectedServiceItem.id === id) {
              setSelectedServiceItem({
                ...selectedServiceItem,
                assignedTeam: team,
                assignedStaff: staffName,
                status: 'ASSIGNED',
              });
            }
            setSuccessMsg(`✓ Staff ${staffName} assigned to #${selectedServiceItem.ticketNumber}`);
            setTimeout(() => setSuccessMsg(''), 4000);
          }}
          onChangePriority={(id, priority) => {
            setServiceTickets((prev) =>
              prev.map((t) => (t.id === id ? { ...t, priority } : t))
            );
            if (selectedServiceItem && selectedServiceItem.id === id) {
              setSelectedServiceItem({ ...selectedServiceItem, priority });
            }
          }}
          onAddNote={(id, noteText) => {
            const newNote = {
              id: `note-${Date.now()}`,
              author: user.name || 'Admin Manager',
              timestamp: 'Just now',
              text: noteText,
            };
            setServiceTickets((prev) =>
              prev.map((t) =>
                t.id === id
                  ? { ...t, internalNotes: [newNote, ...(t.internalNotes || [])] }
                  : t
              )
            );
            if (selectedServiceItem && selectedServiceItem.id === id) {
              setSelectedServiceItem({
                ...selectedServiceItem,
                internalNotes: [newNote, ...(selectedServiceItem.internalNotes || [])],
              });
            }
          }}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CENTRAL REAL-TIME NOTIFICATION CENTER            */}
      {/* ========================================================= */}
      <NotificationCenterModal
        isOpen={showNotificationCenterModal}
        onClose={() => setShowNotificationCenterModal(false)}
        notifications={centralNotifications}
        onMarkAsRead={(id) => {
          setCentralNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onMarkAllAsRead={() => {
          setCentralNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          setShowNotificationCenterModal(false);
          if (notif.relatedId) {
            const found = serviceTickets.find((t) => t.id === notif.relatedId);
            if (found) {
              setSelectedServiceItem(found);
              setShowServiceDetailModal(true);
              return;
            }
          }
          if (notif.targetTab) {
            setActiveTab(notif.targetTab as any);
            setActiveSubTab('');
          }
        }}
      />

      {/* ========================================================= */}
      {/* MODAL 3: STUDENT PROFILE & DIGITAL ID DRAWER              */}
      {/* ========================================================= */}
      <StudentProfileDrawer
        student={selectedStudentForDrawer}
        onClose={() => {
          setShowStudentDrawer(false);
          setSelectedStudentForDrawer(null);
        }}
      />
    </div>
  );
}
