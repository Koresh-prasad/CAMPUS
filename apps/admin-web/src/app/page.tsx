'use client';

import React, { useState, useEffect } from 'react';
import StudentManagementView from '../components/StudentManagementView';
import HostelManagementView from '../components/HostelManagementView';
import HostelLeaveGatePassView from '../components/HostelLeaveGatePassView';
import WardenSecurityView from '../components/WardenSecurityView';
import MedicalCareView from '../components/MedicalCareView';
import EmergencyView from '../components/EmergencyView';
import CollegeProfileView from '../components/CollegeProfileView';
import AdminOperatorManagementView from '../components/AdminOperatorManagementView';
import CampusServicesView from '../components/CampusServicesView';
import NotificationsView from '../components/NotificationsView';
import SettingsView from '../components/SettingsView';
import RoleBasedAuthCard from '../components/RoleBasedAuthCard';
import {
  X,
  Zap,
  BookOpen,
  Globe,
  ArrowLeft,
  Activity,
  Radio,
  GraduationCap,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Headphones,
  Newspaper,
  Bed,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  MapPin,
  LayoutDashboard,
  Users,
  Wrench,
  QrCode,
  UserPlus,
  Car,
  CreditCard,
  Bell,
  Utensils,
  Package,
  ShieldAlert,
  FileCheck,
  FileText,
  Pin,
  Megaphone,
  Settings,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown,
  Building,
  ScanLine,
  PhoneCall,
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Volume2,
  VolumeX,
  RefreshCw,
  Plus,
  LogOut,
  Moon,
  Coffee,
  Sun,
  Send,
  Camera,
  Video,
  Calendar as CalendarIcon,
  Play,
  Trash2,
  Image as ImageIcon,
  Heart,
  UploadCloud,
  Check
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import io from 'socket.io-client';
import { AdminLanguage, getAdminTranslation } from '../lib/i18n';

const API_BASE = 'http://localhost:4000/api';
const SOCKET_URL = 'http://localhost:4000';

export default function AdminPanel() {
  // Navigation Sections
  type Section =
    | 'DASHBOARD'
    | 'HOSPITAL_TRIAGE'
    | 'ADOPTION_HUB'
    | 'ONBOARDING'
    | 'RESIDENTS'
    | 'COMPLAINTS'
    | 'WHOS_OUT'
    | 'VISITORS'
    | 'VEHICLES'
    | 'BILLING'
    | 'NOTICES'
    | 'MENU'
    | 'GALLERY'
    | 'CALENDAR'
    | 'MANAGER_PROFILE'
    | 'INVENTORY'
    | 'COMPLIANCE'
    | 'TURNSTILE_SCANNER'
    | 'NOTIFICATIONS'
    | 'SETTINGS'
    | '__OLD_RESIDENTS'
    | '__OLD_TURNSTILE_SCANNER'
    | '__OLD_COMPLIANCE'
    | '__OLD_ONBOARDING'
    | '__OLD_HOSPITAL_TRIAGE'
    | '__OLD_ADOPTION_HUB'
    | '__OLD_MANAGER_PROFILE';

  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    RESIDENTS: true,
    COMPLIANCE: false,
    WHOS_OUT: false,
    TURNSTILE_SCANNER: false,
    HOSPITAL_TRIAGE: false,
    ADOPTION_HUB: false,
    MANAGER_PROFILE: false,
    ONBOARDING: false,
  });

  const navigationTree = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'RESIDENTS',
      label: 'Student Management',
      icon: User,
      subFeatures: [
        'Student Profiles',
        'Department / Year',
        'Roll Number',
        'Hostel Allocation',
        'Account Status',
      ],
    },
    {
      id: 'COMPLIANCE',
      label: 'Hostel Management',
      icon: Bed,
      subFeatures: [
        'Hostel List',
        'Hostel-wise Students',
        'Room Management',
        'Room Allocation',
        'Hostel Occupancy',
        'Hostel Warden',
        'Security Guard',
        'Hostel Contact Numbers',
        'Hostel Complaints',
      ],
    },
    {
      id: 'WHOS_OUT',
      label: 'Hostel Leave / Gate Pass',
      icon: QrCode,
      subFeatures: [
        'Leave Request',
        'Gate Pass Request',
        'Pending Requests',
        'Approved Requests',
        'Rejected Requests',
        'Warden Approval',
        'Security Verification',
        'Entry / Exit Records',
        'Leave History',
      ],
    },
    {
      id: 'TURNSTILE_SCANNER',
      label: 'Warden & Security',
      icon: ShieldCheck,
      subFeatures: [
        'Warden Management',
        'Hostel-wise Warden',
        'Security Guard Management',
        'Hostel-wise Security',
        'Phone Numbers',
        'Duty / Shift',
        'Emergency Contact',
      ],
    },
    {
      id: 'HOSPITAL_TRIAGE',
      label: 'Medical Care',
      icon: Heart,
      subFeatures: [
        'College Medical Center',
        'Doctor Details',
        'Nurse / Medical Staff',
        'Medical Contact Number',
        'Medical Hours',
        'Student Medical Assistance',
        'Medical Emergency Request',
        'Nearby Hospital Information',
      ],
    },
    {
      id: 'ADOPTION_HUB',
      label: 'Emergency',
      icon: ShieldAlert,
      subFeatures: [
        'Emergency Contacts',
        'Security',
        'Ambulance',
        'Police',
        'Fire',
        'Medical Emergency',
        'Hostel Emergency',
        'Emergency Broadcast',
        'Emergency Alert History',
      ],
    },
    {
      id: 'MANAGER_PROFILE',
      label: 'College Profile',
      icon: Building,
      subFeatures: [
        'College Name',
        'College Logo',
        'Campus Photos',
        'Address',
        'Phone Numbers',
        'Email',
        'Website',
        'About College',
        'Departments',
        'Principal / Director',
        'Important Information',
      ],
    },
    {
      id: 'ONBOARDING',
      label: 'Admin / Operator Management',
      icon: Users,
      subFeatures: [
        'Admin Profile',
        'Admin Operators',
        'Managers',
        'Add Operator',
        'Assign Role',
        'Permissions',
        'Activity Log',
        'Account Status',
        'Last Login',
      ],
    },
    { id: 'NOTICES', label: 'Notices', icon: Newspaper },
    { id: 'CALENDAR', label: 'Events', icon: CalendarIcon },
    { id: 'MENU', label: 'Mess Management', icon: Utensils },
    { id: 'COMPLAINTS', label: 'Grievances', icon: AlertTriangle },
    { id: 'VEHICLES', label: 'Campus Services', icon: MapPin },
    { id: 'BILLING', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  const [activeSection, setActiveSection] = useState<Section>('DASHBOARD');
  const [activeRole, setActiveRole] = useState<'DIRECTOR' | 'WARDEN' | 'SECURITY' | 'ACCOUNTS'>('WARDEN');

  // Multi-Language Support (English / हिन्दी)
  const [adminLang, setAdminLang] = useState<AdminLanguage>('en');
  const at = getAdminTranslation(adminLang);

  const toggleAdminLanguage = () => {
    const nextLang: AdminLanguage = adminLang === 'en' ? 'hi' : 'en';
    setAdminLang(nextLang);
    try {
      localStorage.setItem('shms_admin_lang', nextLang);
    } catch (e) {}
  };

  // Manager Profile State (Chief Warden profile with photo)
  const [managerProfile, setManagerProfile] = useState<any>(null);
  const [editManagerModalOpen, setEditManagerModalOpen] = useState(false);
  const [headingModalOpen, setHeadingModalOpen] = useState(false);
  const [managerSaving, setManagerSaving] = useState(false);
  const [mgrName, setMgrName] = useState('');
  const [mgrDesignation, setMgrDesignation] = useState('');
  const [mgrAvatarUrl, setMgrAvatarUrl] = useState('');
  const [mgrEmail, setMgrEmail] = useState('');
  const [mgrPhone, setMgrPhone] = useState('');
  const [mgrOfficeRoom, setMgrOfficeRoom] = useState('');
  const [mgrVisitingHours, setMgrVisitingHours] = useState('');
  const [mgrEmergencyLine, setMgrEmergencyLine] = useState('');
  const [mgrAnnouncement, setMgrAnnouncement] = useState('');
  const [mgrStatus, setMgrStatus] = useState('AVAILABLE');
  const [mgrDeskHeading, setMgrDeskHeading] = useState('Students Welfare & Vice Principal Executive Desk');
  const [mgrDeskBadge, setMgrDeskBadge] = useState('Executive Command Desk');
  const [mgrDeskSubtitle, setMgrDeskSubtitle] = useState('Official desk of Vice Principal & Student Welfare for student queries, hostel life improvements, and academic welfare');
  const [mgrSuccessMsg, setMgrSuccessMsg] = useState('');
  const [mgrUploadingPhoto, setMgrUploadingPhoto] = useState(false);

  // Great Heading Options for College Controllers, Vice Principals, Wardens & Directors
  const GREAT_HEADING_OPTIONS = [
    {
      title: 'Students Welfare & Vice Principal Executive Desk',
      badge: 'Vice Principal & DSW Office',
      subtitle: 'Official executive desk of Vice Principal & Student Welfare for student queries, hostel life, and academic welfare'
    },
    {
      title: 'Chief Warden & Administrative Manager Desk',
      badge: 'Executive Command Desk',
      subtitle: 'Official central hostel desk for room allotments, student discipline, safety, and welfare'
    },
    {
      title: 'Hostel Superintendent & Student Affairs Desk',
      badge: 'Superintendent Office',
      subtitle: 'Direct resident administration for daily student welfare, maintenance oversight, and curfew control'
    },
    {
      title: 'Dean of Students Welfare & Campus Operations',
      badge: 'Dean of Student Welfare (DSW)',
      subtitle: 'Executive academic & residential controller desk for student development, welfare, and hostel life'
    },
    {
      title: 'Director of Campus Living & Hostel Administration',
      badge: 'Director Residence HQ',
      subtitle: 'High-level executive campus living office coordinating student hostels, mess amenities, and security'
    },
    {
      title: 'Senior Executive Warden & Residence In-Charge',
      badge: 'Senior Warden Desk',
      subtitle: 'Primary point of contact for student welfare, urgent approvals, leave passes, and room administration'
    },
    {
      title: 'Hostel Proctor & Student Care Administration',
      badge: 'Proctorial Board Office',
      subtitle: 'Proctorial administration dedicated to resident safety, mentorship, campus ethics, and 24x7 support'
    },
    {
      title: 'Head of Department & Residence Controller',
      badge: 'HOD & Residence Office',
      subtitle: 'Dual academic and residential leadership desk bridging student learning, hostel amenities, and welfare'
    }
  ];

  // College Gallery State (Activities, Videos, Photos)
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryFilter, setGalleryFilter] = useState('ALL');
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('CULTURAL');
  const [galleryMediaType, setGalleryMediaType] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [galleryMediaUrl, setGalleryMediaUrl] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [galleryEventDate, setGalleryEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [galleryIsPinned, setGalleryIsPinned] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [gallerySuccessMsg, setGallerySuccessMsg] = useState('');
  const [previewMediaModal, setPreviewMediaModal] = useState<any>(null);

  // College Calendar State (Exams, Holidays, Fests, Meetings)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarFilter, setCalendarFilter] = useState('ALL');
  const [calTitle, setCalTitle] = useState('');
  const [calEventType, setCalEventType] = useState('EXAM');
  const [calStartDate, setCalStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [calEndDate, setCalEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [calVenue, setCalVenue] = useState('Main Academic Block');
  const [calDescription, setCalDescription] = useState('');
  const [calIsHoliday, setCalIsHoliday] = useState(false);
  const [calIsMandatory, setCalIsMandatory] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarSuccessMsg, setCalendarSuccessMsg] = useState('');

  // Live Data States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeEmergencies, setActiveEmergencies] = useState<any[]>([]);
  const [residents, setResidents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [whosOutData, setWhosOutData] = useState<any>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [naacReport, setNaacReport] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Hospital Triage Queue State (Doctor patient-queue analogy)
  const [hospitalQueue, setHospitalQueue] = useState<any>(null);
  const [triageLoading, setTriageLoading] = useState(false);

  // Adoption Hub & 1-Click Legacy ERP Batch Import State
  const [adoptionPlaybook, setAdoptionPlaybook] = useState<any>(null);
  const [erpCsvInput, setErpCsvInput] = useState('');
  const [erpImportLoading, setErpImportLoading] = useState(false);
  const [erpImportResult, setErpImportResult] = useState<any>(null);

  // WhatsApp-style Notice Read Receipts & Targeting
  const [selectedNoticeReceipts, setSelectedNoticeReceipts] = useState<any>(null);
  const [receiptsModalOpen, setReceiptsModalOpen] = useState(false);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [noticeTargetFilter, setNoticeTargetFilter] = useState('ALL');

  // Turnstile scanner & SMS 2G Keypad Fallback simulation
  const [scanInput, setScanInput] = useState('QR-PASS-892101-RAHUL');
  const [scanResult, setScanResult] = useState<any>(null);
  const [smsPhoneInput, setSmsPhoneInput] = useState('+91 98765 43210');
  const [smsTextInput, setSmsTextInput] = useState('PASS OUT 3HRS');
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [smsLoading, setSmsLoading] = useState(false);
  const [offlineCodeInput, setOfflineCodeInput] = useState('PASS-749201');
  const [offlineVerifyResult, setOfflineVerifyResult] = useState<any>(null);

  // Filters and UI toggles
  const [residentSearch, setResidentSearch] = useState('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState('ALL');
  const [audioAlertMuted, setAudioAlertMuted] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'OD'>('EN');
  const [searchQuery, setSearchQuery] = useState('');
  interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatarUrl?: string;
    tenantId: string;
    tenantName: string;
    tenantCode: string;
    staffProfile?: any;
    hostel?: any;
  }

    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authToken, setAuthToken] = useState<string>('');
  const [registeredColleges, setRegisteredColleges] = useState<any[]>([]);

  // Public Campus Manager Auth State
  const [authTab, setAuthTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [adminRoleTab, setAdminRoleTab] = useState<'STUDENT' | 'FACULTY' | 'STAFF'>('STAFF');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (showRegisterModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showRegisterModal]);

  // Register form
  const [regCollegeName, setRegCollegeName] = useState('');
  const [regCollegeCode, setRegCollegeCode] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regHostelType, setRegHostelType] = useState('CO_ED');
  const [regBlocks, setRegBlocks] = useState('Block A (North), Block B (South)');
  const [regCurfewTime, setRegCurfewTime] = useState('21:30');
  const [regManagerName, setRegManagerName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'WARDEN' | 'DIRECTOR'>('WARDEN');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Onboarding Wizard State (5 Steps)
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingHostelName, setOnboardingHostelName] = useState('Apex Himalaya Campus Residence');
  const [onboardingBlocks, setOnboardingBlocks] = useState('Nilgiri Block A, Shivalik Block B');
  const [onboardingCurfew, setOnboardingCurfew] = useState('21:30');

  // Student & Staff Admission Approval Queue & Direct Input Controls
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [pendingStaff, setPendingStaff] = useState<any[]>([]);
  const [pendingTab, setPendingTab] = useState<'STAFF' | 'STUDENTS'>('STAFF');
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [selectedStudentForApproval, setSelectedStudentForApproval] = useState<any | null>(null);
  const [assignedRoomInput, setAssignedRoomInput] = useState('');
  const [assignedBlockInput, setAssignedBlockInput] = useState('');
  const [approvalNotesInput, setApprovalNotesInput] = useState('Verified by Warden Office. Admission Approved.');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [showRejectBox, setShowRejectBox] = useState<string | null>(null);

  // Quick Notice Publisher
  const [quickNoticeModalOpen, setQuickNoticeModalOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('ACADEMIC');
  const [newNoticeIsEmergency, setNewNoticeIsEmergency] = useState(false);
  const [noticePublishLoading, setNoticePublishLoading] = useState(false);

  // Today's Menu Editor
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  const [menuForm, setMenuForm] = useState({
    breakfast: 'Hot Masala Dosa, Sambar, Coconut Chutney, Filter Coffee',
    lunch: 'Shahi Paneer, Dal Makhani, Steamed Basmati Rice, Butter Roti, Gulab Jamun',
    snacks: 'Crispy Veg Pakoras, Mint Chutney, Adrak Chai',
    dinner: 'Kashmiri Dum Aloo, Dal Tadka, Peas Pulao, Chapati, Ice Cream',
    festivalTitle: 'Grand Campus Festive Feast & Gala Buffet',
    festivalDinner: 'Royal Shahi Thali with Live Jalebi Counter, Paneer Lababdar, Rasmalai'
  });
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSuccessMsg, setMenuSuccessMsg] = useState('');

  // 1. Initial Load & Multi-Tenant Authentication Check
  useEffect(() => {
    async function init() {
      // 0. Restore saved portal language
      try {
        const savedLang = localStorage.getItem('shms_admin_lang') as AdminLanguage;
        if (savedLang === 'en' || savedLang === 'hi') {
          setAdminLang(savedLang);
        }
      } catch (e) {}

      // 1. Fetch live colleges list for directory
      try {
        const colRes = await fetch(`${API_BASE}/auth/colleges`);
        if (colRes.ok) {
          const cols = await colRes.json();
          setRegisteredColleges(cols);
        }
      } catch (e) {
        console.error('Error fetching colleges:', e);
      }

      // 2. Do NOT auto-restore session on root landing page so the user
      // always sees the Role Selection & Sign In / Register portal first.
      // When Admin Manager signs in or registers, they are redirected to /admin/dashboard.
    }
    init();

    // 3. Setup WebSockets for instant Siren & Presence alerts
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      console.log('Admin socket connected');
    });

    socket.on('emergency:triggered', (alertItem) => {
      console.log('🚨 EMERGENCY SIREN TRIGGERED:', alertItem);
      setActiveEmergencies((prev) => [alertItem, ...prev]);
    });

    socket.on('emergency:resolved', ({ id }) => {
      setActiveEmergencies((prev) => prev.filter((a) => a.id !== id));
    });

    socket.on('curfew:alert', (curfewPayload) => {
      console.log('Curfew alert updated:', curfewPayload);
    });

    socket.on('student:registered', (studentData) => {
      console.log('🎓 Real-time Student Admission Alert:', studentData);
      setPendingStudents((prev) => {
        const exists = prev.some((p) => p.id === studentData.id);
        if (exists) return prev;
        return [studentData, ...prev];
      });
    });

    socket.on('student:approved', ({ studentId }) => {
      setPendingStudents((prev) => prev.filter((p) => p.id !== studentId));
    });

    socket.on('staff:registered', (staffData) => {
      console.log('👔 Real-time Staff Registration Alert:', staffData);
      setPendingStaff((prev) => {
        const exists = prev.some((p) => p.id === staffData.id || p.userId === staffData.id || p.email === staffData.email);
        if (exists) return prev;
        return [staffData, ...prev];
      });
    });

    socket.on('staff:approved', (data) => {
      setPendingStaff((prev) => prev.filter((p) => p.id !== data.id && p.id !== data.userId && p.email !== data.email));
    });

    socket.on('complaint:update', () => {
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    });

    socket.on('pass:update', () => {
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    });

    socket.on('gallery:updated', () => {
      fetch(`${API_BASE}/gallery`).then(r => r.json()).then(d => {
        if (d.items) setGalleryItems(d.items);
      }).catch(console.error);
    });

    socket.on('calendar:updated', () => {
      fetch(`${API_BASE}/calendar`).then(r => r.json()).then(d => {
        if (d.events) setCalendarEvents(d.events);
      }).catch(console.error);
    });

    socket.on('manager:updated', (updated) => {
      if (updated) {
        setManagerProfile(updated);
        setMgrName(updated.name || '');
        setMgrDesignation(updated.designation || '');
        setMgrAvatarUrl(updated.avatarUrl || '');
        setMgrEmail(updated.email || '');
        setMgrPhone(updated.phone || '');
        setMgrOfficeRoom(updated.officeRoom || '');
        setMgrVisitingHours(updated.visitingHours || '');
        setMgrEmergencyLine(updated.emergencyDirectLine || '');
        setMgrAnnouncement(updated.announcement || '');
        setMgrStatus(updated.status || 'AVAILABLE');
        setMgrDeskHeading(updated.deskHeading || '');
        setMgrDeskBadge(updated.deskBadge || '');
        setMgrDeskSubtitle(updated.deskSubtitle || '');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  async function fetchAllAdminData(token: string, tenantId?: string) {
    const tId = tenantId || currentUser?.tenantId;
    const tenantQuery = tId ? `?tenantId=${tId}` : '';
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [dashRes, emRes, resRes, cmpRes, passRes, whoRes, visRes, vehRes, billRes, notRes, repRes, audRes, pendRes, pendStaffRes, menuRes, triageRes, adoptRes, mgrRes, galRes, calRes] =
        await Promise.all([
          fetch(`${API_BASE}/analytics/dashboard${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/emergency/active${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/residents${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/complaints${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/passes${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/passes/live-whos-out${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/visitors${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/vehicles${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/billing${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/notices${tenantQuery}`),
          fetch(`${API_BASE}/compliance/naac-report${tenantQuery}`),
          fetch(`${API_BASE}/compliance/audit-logs${tenantQuery}`),
          fetch(`${API_BASE}/auth/pending-students${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/auth/pending-staff${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/menu`),
          fetch(`${API_BASE}/analytics/hospital-queue${tenantQuery}`, { headers }),
          fetch(`${API_BASE}/compliance/adoption-playbook`),
          fetch(`${API_BASE}/manager-profile`),
          fetch(`${API_BASE}/gallery`),
          fetch(`${API_BASE}/calendar`)
        ]);

      if (dashRes.ok) setDashboardData(await dashRes.json());
      if (emRes.ok) setActiveEmergencies(await emRes.json());
      if (resRes.ok) setResidents(await resRes.json());
      if (cmpRes.ok) setComplaints(await cmpRes.json());
      if (passRes.ok) setPasses(await passRes.json());
      if (whoRes.ok) setWhosOutData(await whoRes.json());
      if (visRes.ok) setVisitors(await visRes.json());
      if (vehRes.ok) setVehicles(await vehRes.json());
      if (billRes.ok) setBills(await billRes.json());
      if (notRes.ok) setNotices(await notRes.json());
      if (repRes.ok) setNaacReport(await repRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());
      if (pendRes.ok) setPendingStudents(await pendRes.json());
      if (pendStaffRes && pendStaffRes.ok) {
        const staffData = await pendStaffRes.json();
        setPendingStaff(Array.isArray(staffData) ? staffData : staffData.pending || []);
      }
      if (triageRes.ok) setHospitalQueue(await triageRes.json());
      if (adoptRes.ok) setAdoptionPlaybook(await adoptRes.json());
      if (mgrRes.ok) {
        const m = await mgrRes.json();
        if (m.profile) {
          setManagerProfile(m.profile);
          setMgrName(m.profile.name || '');
          setMgrDesignation(m.profile.designation || '');
          setMgrAvatarUrl(m.profile.avatarUrl || '');
          setMgrEmail(m.profile.email || '');
          setMgrPhone(m.profile.phone || '');
          setMgrOfficeRoom(m.profile.officeRoom || '');
          setMgrVisitingHours(m.profile.visitingHours || '');
          setMgrEmergencyLine(m.profile.emergencyDirectLine || '');
          setMgrAnnouncement(m.profile.announcement || '');
          setMgrStatus(m.profile.status || 'AVAILABLE');
          setMgrDeskHeading(m.profile.deskHeading || '');
          setMgrDeskBadge(m.profile.deskBadge || '');
          setMgrDeskSubtitle(m.profile.deskSubtitle || '');
        }
      }
      if (galRes.ok) {
        const g = await galRes.json();
        if (g.items) setGalleryItems(g.items);
      }
      if (calRes.ok) {
        const c = await calRes.json();
        if (c.events) setCalendarEvents(c.events);
      }
      if (menuRes.ok) {
        const mData = await menuRes.json();
        setMenuData(mData);
        if (mData?.today?.meals) {
          setMenuForm((prev) => ({
            ...prev,
            breakfast: mData.today.meals.BREAKFAST || prev.breakfast,
            lunch: mData.today.meals.LUNCH || prev.lunch,
            snacks: mData.today.meals.SNACKS || prev.snacks,
            dinner: mData.today.meals.DINNER || prev.dinner
          }));
        }
      }
    } catch (err) {
      console.error('Fetch admin data error:', err);
    }
  }


  // Manager Login Action
  async function handleLogin(email: string) {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed');
        setLoginLoading(false);
        return;
      }
      setAuthToken(data.token);
      setCurrentUser(data.user);
      if (data.user.role) {
        setActiveRole(data.user.role as any);
      }
      localStorage.setItem('shms_admin_user', JSON.stringify(data.user));
      localStorage.setItem('shms_admin_token', data.token);
      localStorage.setItem('shms_user', JSON.stringify(data.user));
      localStorage.setItem('shms_token', data.token);
      fetchAllAdminData(data.token, data.user.tenantId);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setLoginError('Failed to connect to authentication server');
    } finally {
      setLoginLoading(false);
    }
  }

  // Register New College / Institution Action
  async function handleRegisterCollege(e: React.FormEvent) {
    e.preventDefault();
    if (!regCollegeName || !regCollegeCode || !regEmail || !regPassword) {
      setRegError('Please provide College Name, Unique Security College Code, College Email, and Password');
      return;
    }
    setRegLoading(true);
    setRegError('');
    try {
      const res = await fetch(`${API_BASE}/auth/register-college`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeName: regCollegeName,
          collegeCode: regCollegeCode.toUpperCase(),
          hostelType: regHostelType || 'CO_ED',
          address: regAddress || 'Main Campus',
          blocks: regBlocks || 'Block A (North), Block B (South)',
          curfewTime: regCurfewTime || '21:30',
          managerName: regManagerName || `${regCollegeName} Administrator`,
          email: regEmail,
          password: regPassword,
          phone: regPhone || '+91 98000 00000',
          role: regRole || 'ADMIN_MANAGER'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.error || 'Registration failed');
        setRegLoading(false);
        return;
      }
      setAuthToken(data.token);
      setCurrentUser(data.user);
      if (data.user.role) {
        setActiveRole(data.user.role as any);
      }
      localStorage.setItem('shms_admin_user', JSON.stringify(data.user));
      localStorage.setItem('shms_admin_token', data.token);
      localStorage.setItem('shms_user', JSON.stringify(data.user));
      localStorage.setItem('shms_token', data.token);
      fetchAllAdminData(data.token, data.user.tenantId);
      // Refresh directory of colleges
      const colRes = await fetch(`${API_BASE}/auth/colleges`);
      if (colRes.ok) setRegisteredColleges(await colRes.json());
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setRegError('Failed to register college. Server error.');
    } finally {
      setRegLoading(false);
    }
  }

  // Logout / Switch College Action
  function handleLogout() {
    localStorage.removeItem('shms_admin_user');
    localStorage.removeItem('shms_admin_token');
    setCurrentUser(null);
    setAuthToken('');
    setDashboardData(null);
    setResidents([]);
    setComplaints([]);
    setPasses([]);
    setWhosOutData(null);
  }

  // Resolve Emergency
  async function resolveEmergency(id: string) {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/emergency/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ notes: 'Resolved by Warden on duty' })
      });
      setActiveEmergencies((prev) => prev.filter((a) => a.id !== id));
      fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Resolve error:', err);
    }
  }

  // Kanban Stage Change
  async function updateComplaintStatus(id: string, newStatus: string) {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Status update error:', err);
    }
  }

  // Approve Pass
  async function approvePass(id: string) {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/passes/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Approve pass error:', err);
    }
  }

  // Reject Pass
  async function rejectPass(id: string) {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/passes/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ reason: 'Curfew restriction or parental verification pending' })
      });
      fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Reject pass error:', err);
    }
  }

  // Turnstile QR Simulator Action
  async function simulateTurnstileScan(direction: 'ENTRY' | 'EXIT') {
    try {
      const res = await fetch(`${API_BASE}/turnstile/simulate-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: scanInput,
          gateId: 'Turnstile Post-01',
          direction
        })
      });
      const data = await res.json();
      setScanResult(data);
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      setScanResult({ status: 'ACCESS_DENIED', reason: 'Hardware Scanner Timeout' });
    }
  }

  // Send Bulk Fee Reminders
  async function sendFeeReminders() {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/billing/send-reminders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Reminders error:', err);
    }
  }

  // Student Admission Approval Action (Connected via College Code)
  async function handleApproveStudent(studentId: string, room?: string, block?: string, notes?: string) {
    setApprovalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/approve-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          studentId,
          roomNumber: room || assignedRoomInput || 'A-201',
          block: block || assignedBlockInput || 'Block A',
          notes: notes || approvalNotesInput || 'Verified and approved by Campus Warden Office'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPendingStudents((prev) => prev.filter((s) => s.id !== studentId));
        setSelectedStudentForApproval(null);
        setShowRejectBox(null);
        if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
      } else {
        alert(data.error || 'Failed to approve student admission');
      }
    } catch (err) {
      console.error('Approve student error:', err);
    } finally {
      setApprovalLoading(false);
    }
  }

  // Student Rejection Action
  async function handleRejectStudent(studentId: string, reason?: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/reject-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          studentId,
          reason: reason || rejectReasonInput || 'College Code / Roll Number verification failed. Contact Warden Office.'
        })
      });
      if (res.ok) {
        setPendingStudents((prev) => prev.filter((s) => s.id !== studentId));
        setSelectedStudentForApproval(null);
        setShowRejectBox(null);
        setRejectReasonInput('');
      }
    } catch (err) {
      console.error('Reject student error:', err);
    }
  }

  // Staff Account Approval Action
  async function handleApproveStaff(staffId: string) {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/auth/approve-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId: staffId })
      });
      if (res.ok) {
        setPendingStaff((prev) => prev.filter((s) => s.id !== staffId && s.userId !== staffId));
        fetchAllAdminData(authToken, currentUser?.tenantId);
      }
    } catch (err) {
      console.error('Approve staff error:', err);
    }
  }

  // Staff Account Rejection Action
  async function handleRejectStaff(staffId: string) {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/auth/reject-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId: staffId })
      });
      if (res.ok) {
        setPendingStaff((prev) => prev.filter((s) => s.id !== staffId && s.userId !== staffId));
        fetchAllAdminData(authToken, currentUser?.tenantId);
      }
    } catch (err) {
      console.error('Reject staff error:', err);
    }
  }

  // Real-time Notice Publisher
  async function handlePublishNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    setNoticePublishLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newNoticeTitle,
          content: newNoticeContent,
          category: newNoticeCategory,
          isEmergencyAlert: newNoticeIsEmergency,
          authorName: currentUser?.name || 'Chief Warden Office'
        })
      });
      if (res.ok) {
        setQuickNoticeModalOpen(false);
        setNewNoticeTitle('');
        setNewNoticeContent('');
        setNewNoticeIsEmergency(false);
        if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
      }
    } catch (err) {
      console.error('Publish notice error:', err);
    } finally {
      setNoticePublishLoading(false);
    }
  }

  // Real-time Today's Mess Menu Editor
  async function handleUpdateTodayMenu(e: React.FormEvent) {
    e.preventDefault();
    setMenuLoading(true);
    setMenuSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/menu/update-today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(menuForm)
      });
      const data = await res.json();
      if (res.ok) {
        setMenuSuccessMsg('✓ Menu updated and broadcast live to all student devices!');
        setTimeout(() => {
          setEditMenuModalOpen(false);
          setMenuSuccessMsg('');
        }, 1500);
        if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
      } else {
        alert(data.error || 'Failed to update mess menu');
      }
    } catch (err) {
      console.error('Update menu error:', err);
    } finally {
      setMenuLoading(false);
    }
  }

  // View WhatsApp-Style Notice Read Receipts
  async function handleViewReceipts(noticeId: string) {
    setReceiptsLoading(true);
    setReceiptsModalOpen(true);
    try {
      const res = await fetch(`${API_BASE}/notices/${noticeId}/receipts`);
      if (res.ok) {
        const data = await res.json();
        setSelectedNoticeReceipts(data);
      }
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setReceiptsLoading(false);
    }
  }

  // 1-Click Legacy ERP / SIS CSV Batch Import
  async function handleImportLegacyErp() {
    setErpImportLoading(true);
    setErpImportResult(null);
    try {
      const res = await fetch(`${API_BASE}/compliance/import-legacy-erp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ rawCsvData: erpCsvInput })
      });
      const data = await res.json();
      setErpImportResult(data);
      if (res.ok && authToken) {
        fetchAllAdminData(authToken, currentUser?.tenantId);
      }
    } catch (err) {
      console.error('ERP import error:', err);
      setErpImportResult({ error: 'Failed to connect to ERP batch service' });
    } finally {
      setErpImportLoading(false);
    }
  }

  // 2G / Keypad Feature Phone SMS Gateway Simulator
  async function handleSimulateSms() {
    if (!smsTextInput) return;
    setSmsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/turnstile/sms-gateway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPhone: smsPhoneInput,
          messageText: smsTextInput,
          gateId: 'Simulated Gate 01'
        })
      });
      const data = await res.json();
      setSmsLogs((prev) => [
        {
          timestamp: new Date().toLocaleTimeString(),
          direction: 'INBOUND',
          phone: smsPhoneInput,
          message: smsTextInput
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          direction: 'OUTBOUND_REPLY',
          phone: smsPhoneInput,
          message: data.replySms,
          offlineCode: data.offlineCode
        },
        ...prev
      ]);
      if (data.offlineCode) {
        setOfflineCodeInput(data.offlineCode);
      }
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('SMS simulation error:', err);
    } finally {
      setSmsLoading(false);
    }
  }

  // Punch 6-Digit Numeric Offline Code at Turnstile Guard Desk
  async function handleVerifyOfflineCodePunch() {
    if (!offlineCodeInput) return;
    try {
      const res = await fetch(`${API_BASE}/turnstile/verify-offline-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offlineCode: offlineCodeInput,
          gateId: 'Main Turnstile 01',
          direction: 'EXIT'
        })
      });
      const data = await res.json();
      setOfflineVerifyResult(data);
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Offline punch error:', err);
    }
  }

  // 1-Click Triage Actions for Doctor / Warden Queue
  async function handleQuickTriageAction(itemId: string, itemType: string, action: string) {
    try {
      if (itemType === 'EMERGENCY') {
        await resolveEmergency(itemId);
      } else if (itemType === 'PASS') {
        await fetch(`${API_BASE}/passes/${itemId}/approve`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } else if (itemType === 'COMPLAINT') {
        await fetch(`${API_BASE}/complaints/${itemId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({ status: action === 'RESOLVE' ? 'RESOLVED' : 'IN_PROGRESS' })
        });
      }
      if (authToken) fetchAllAdminData(authToken, currentUser?.tenantId);
    } catch (err) {
      console.error('Triage action error:', err);
    }
  }

  // 1. Save Manager Profile (with photo)
  async function handleSaveManagerProfile(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setManagerSaving(true);
    setMgrSuccessMsg('');
    try {
      const res = await fetch(`${API_BASE}/manager-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mgrName,
          designation: mgrDesignation,
          avatarUrl: mgrAvatarUrl,
          email: mgrEmail,
          phone: mgrPhone,
          officeRoom: mgrOfficeRoom,
          visitingHours: mgrVisitingHours,
          emergencyDirectLine: mgrEmergencyLine,
          announcement: mgrAnnouncement,
          status: mgrStatus
        })
      });
      const data = await res.json();
      if (res.ok) {
        setManagerProfile(data.profile);
        setMgrSuccessMsg('✓ Manager Profile updated & broadcast live to all student devices!');
        setTimeout(() => {
          setEditManagerModalOpen(false);
          setMgrSuccessMsg('');
        }, 1500);
      } else {
        alert(data.error || 'Failed to update manager profile');
      }
    } catch (err) {
      console.error('Save manager profile error:', err);
    } finally {
      setManagerSaving(false);
    }
  }

  // 2. Direct Photo Upload for Manager
  async function handleManagerPhotoUpload(file: File) {
    setMgrUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setMgrAvatarUrl(data.url);
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setMgrAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      const reader = new FileReader();
      reader.onload = () => {
        setMgrAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setMgrUploadingPhoto(false);
    }
  }

  // 3. Direct Photo/Video Upload for College Gallery
  async function handleGalleryFileUpload(file: File) {
    setGalleryUploading(true);
    try {
      if (file.type && file.type.startsWith('video/')) {
        setGalleryMediaType('VIDEO');
      } else {
        setGalleryMediaType('PHOTO');
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setGalleryMediaUrl(data.url);
        }
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setGalleryMediaUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setGalleryUploading(false);
    }
  }

  // 4. Create Gallery Item
  async function handleCreateGalleryItem(e: React.FormEvent) {
    e.preventDefault();
    if (!galleryTitle || !galleryMediaUrl) {
      alert('Please provide activity title and photo/video URL or upload a file.');
      return;
    }
    setGalleryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: galleryTitle,
          category: galleryCategory,
          mediaType: galleryMediaType,
          mediaUrl: galleryMediaUrl,
          description: galleryDescription,
          eventDate: galleryEventDate,
          isPinned: galleryIsPinned,
          uploadedBy: currentUser?.name || 'Chief Warden Desk'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setGallerySuccessMsg('✓ Campus activity published to College Gallery!');
        setGalleryTitle('');
        setGalleryMediaUrl('');
        setGalleryDescription('');
        setGalleryIsPinned(false);
        setTimeout(() => setGallerySuccessMsg(''), 2500);
        const gRes = await fetch(`${API_BASE}/gallery`);
        if (gRes.ok) {
          const gd = await gRes.json();
          if (gd.items) setGalleryItems(gd.items);
        }
      } else {
        alert(data.error || 'Failed to publish gallery item');
      }
    } catch (err) {
      console.error('Gallery create error:', err);
    } finally {
      setGalleryLoading(false);
    }
  }

  // 5. Delete Gallery Item
  async function handleDeleteGalleryItem(id: string) {
    if (!confirm('Are you sure you want to remove this activity from the College Gallery?')) return;
    try {
      await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete gallery error:', err);
    }
  }

  // 6. Create Calendar Event
  async function handleCreateCalendarEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!calTitle || !calStartDate) {
      alert('Event title and start date are required');
      return;
    }
    setCalendarLoading(true);
    try {
      const res = await fetch(`${API_BASE}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: calTitle,
          eventType: calEventType,
          startDate: calStartDate,
          endDate: calEndDate || calStartDate,
          venue: calVenue,
          description: calDescription,
          isHoliday: calIsHoliday,
          isMandatory: calIsMandatory,
          scheduledBy: currentUser?.name || 'Controller Desk'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCalendarSuccessMsg('✓ Event scheduled & broadcast to student calendars!');
        setCalTitle('');
        setCalDescription('');
        setCalIsHoliday(false);
        setCalIsMandatory(false);
        setTimeout(() => setCalendarSuccessMsg(''), 2500);
        const cRes = await fetch(`${API_BASE}/calendar`);
        if (cRes.ok) {
          const cd = await cRes.json();
          if (cd.events) setCalendarEvents(cd.events);
        }
      } else {
        alert(data.error || 'Failed to schedule event');
      }
    } catch (err) {
      console.error('Calendar create error:', err);
    } finally {
      setCalendarLoading(false);
    }
  }

  // 7. Delete Calendar Event
  async function handleDeleteCalendarEvent(id: string) {
    if (!confirm('Are you sure you want to remove this event from the College Calendar?')) return;
    try {
      await fetch(`${API_BASE}/calendar/${id}`, { method: 'DELETE' });
      setCalendarEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (err) {
      console.error('Delete calendar error:', err);
    }
  }


  // Filtered residents
  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.studentId?.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.roomNumber?.toLowerCase().includes(residentSearch.toLowerCase());
    const matchesBlock =
      selectedBlockFilter === 'ALL' || r.blockName?.toLowerCase().includes(selectedBlockFilter.toLowerCase());
    return matchesSearch && matchesBlock;
  });

  // Complaint chart data
  const complaintChartData = [
    { name: 'Water', count: complaints.filter((c) => c.category === 'WATER').length },
    { name: 'Electricity', count: complaints.filter((c) => c.category === 'ELECTRICITY').length },
    { name: 'Wi-Fi', count: complaints.filter((c) => c.category === 'WIFI').length },
    { name: 'Housekeeping', count: complaints.filter((c) => c.category === 'HOUSEKEEPING').length },
    { name: 'Security', count: complaints.filter((c) => c.category === 'SECURITY').length }
  ];

  if (!currentUser || !authToken) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
        {/* 1. TOP HEADER */}
        <header className="h-16 border-b border-slate-200/90 px-4 md:px-10 flex items-center justify-between bg-white shadow-xs sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">Campus Helper</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-xs font-semibold text-slate-500 tracking-wide hidden md:inline">
              Connect &nbsp;•&nbsp; Support &nbsp;•&nbsp; Grow
            </span>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Open Student Resident App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* 2. FULL-BLEED HERO BACKGROUND SECTION */}
        <section
          className="relative w-full flex-1 flex flex-col justify-center py-8 md:py-12 px-4 md:px-10 overflow-hidden"
          style={{
            backgroundColor: '#0b1a3a',
            backgroundImage: "url('/images/campus-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
            backgroundRepeat: 'no-repeat',
            minHeight: 'calc(100vh - 4rem)'
          }}
        >
          {/* Subtle multi-layer gradient overlay:
              - Top-left dark gradient for strong contrast behind headlines
              - Soft vignette on right to elevate the glass login card
              - Leaves the students in the lower-left/center vibrant and vivid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(8, 20, 50, 0.72) 0%, rgba(8, 20, 50, 0.40) 38%, rgba(8, 20, 50, 0.05) 65%, rgba(8, 20, 50, 0.35) 100%)'
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(8, 20, 50, 0.45) 0%, transparent 40%, rgba(8, 20, 50, 0.5) 100%)'
            }}
          />

          <div className="relative z-10 max-w-[1550px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT COLUMN: HERO INFORMATION, STUDENTS & FEATURE BADGES (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col justify-between py-2 space-y-6">
              {/* Top: Handwritten quote + Main Heading + Subtitle */}
              <div className="space-y-3">
                {/* Creative quote */}
                <div className="inline-block w-fit mb-1">
                  <p className="text-sm sm:text-base font-semibold italic text-amber-300 tracking-wide font-serif drop-shadow">
                    “Better Campus Life Starts Here!”
                  </p>
                </div>

                {/* Bold Headlines */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
                  Your Campus.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-400">
                    Our Priority.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-100 font-medium max-w-lg drop-shadow">
                  One Platform. Smarter Campus. Safer Students.
                </p>
              </div>

              {/* Mobile-only blended student photo card */}
              <div className="block lg:hidden my-2 relative rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="/images/campus-students.png"
                  alt="Students on Campus Lawn"
                  className="w-full h-60 object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />
              </div>

              {/* Desktop open lawn area for students sitting in the background */}
              <div className="hidden lg:block min-h-[160px] xl:min-h-[220px]" />

              {/* 3 Modern Feature Badges / Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl">
                {/* Badge 1 */}
                <div className="bg-slate-950/60 hover:bg-slate-950/75 backdrop-blur-md border border-white/20 hover:border-blue-400/40 rounded-2xl p-3 shadow-xl flex items-center space-x-3 transition group">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight">Easy Access</p>
                    <p className="text-[10px] text-slate-300 truncate">to Campus Services</p>
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="bg-slate-950/60 hover:bg-slate-950/75 backdrop-blur-md border border-white/20 hover:border-blue-400/40 rounded-2xl p-3 shadow-xl flex items-center space-x-3 transition group">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight">Stay Connected</p>
                    <p className="text-[10px] text-slate-300 truncate">with Community</p>
                  </div>
                </div>

                {/* Badge 3 */}
                <div className="bg-slate-950/60 hover:bg-slate-950/75 backdrop-blur-md border border-white/20 hover:border-blue-400/40 rounded-2xl p-3 shadow-xl flex items-center space-x-3 transition group">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-tight">Safe & Secure</p>
                    <p className="text-[10px] text-slate-300 truncate">Campus Experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ROLE-BASED AUTHENTICATION (5 COLS) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <RoleBasedAuthCard
                onLoginSuccess={(user, token) => {
                  setCurrentUser(user);
                  setAuthToken(token);
                  if (user.role) {
                    setActiveRole(user.role as any);
                  }
                  localStorage.setItem('shms_token', token);
                  localStorage.setItem('shms_user', JSON.stringify(user));
                  localStorage.setItem('shms_admin_token', token);
                  localStorage.setItem('shms_admin_user', JSON.stringify(user));

                  // Role-based automatic routing to dedicated portals
                  const userRole = (user.role || '').toUpperCase();
                  const staffCategory = (
                    user.staffCategory ||
                    user.staffProfile?.designation ||
                    user.staffProfile?.department ||
                    ''
                  ).toUpperCase();

                  let targetRoute = '/admin/dashboard';
                  if (
                    userRole === 'ADMIN' ||
                    userRole === 'ADMIN_MANAGER' ||
                    userRole === 'DIRECTOR' ||
                    (user.name || '').toUpperCase().includes('ADMINISTRATOR') ||
                    (user.email || '').toUpperCase().includes('ADMIN') ||
                    staffCategory.includes('ADMIN')
                  ) {
                    targetRoute = '/admin/dashboard';
                  } else if (userRole === 'STUDENT') {
                    targetRoute = '/student/dashboard';
                  } else if (userRole === 'WARDEN' || staffCategory.includes('WARDEN')) {
                    targetRoute = '/staff/warden/dashboard';
                  } else if (userRole === 'SECURITY' || staffCategory.includes('SECURITY') || staffCategory.includes('GUARD')) {
                    targetRoute = '/staff/security/dashboard';
                  } else if (
                    staffCategory.includes('FACULTY') ||
                    userRole === 'FACULTY' ||
                    staffCategory.includes('PROFESSOR') ||
                    staffCategory.includes('TEACHER') ||
                    staffCategory.includes('LECTURER') ||
                    staffCategory.includes('COMPUTER SCIENCE')
                  ) {
                    targetRoute = '/staff/faculty/dashboard';
                  } else if (
                    staffCategory.includes('DOCTOR') ||
                    staffCategory.includes('NURSE') ||
                    staffCategory.includes('MEDICAL')
                  ) {
                    targetRoute = '/staff/medical/dashboard';
                  } else if (
                    staffCategory.includes('SERVICES') ||
                    staffCategory.includes('MAINTENANCE') ||
                    staffCategory.includes('HOUSEKEEPING') ||
                    staffCategory.includes('ELECTRIC') ||
                    staffCategory.includes('PLUMB')
                  ) {
                    targetRoute = '/staff/services/dashboard';
                  }

                  window.location.href = targetRoute;
                }}
                onOpenRegisterCollege={() => {
                  setRegError('');
                  setShowRegisterModal(true);
                }}
                demoColleges={registeredColleges}
              />
            </div>
          </div>
        </section>

        {/* 3. BOTTOM FEATURES HORIZONTAL STRIP */}
        <div className="w-full bg-white border-t border-slate-200/90 py-3 px-4 md:px-10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* 1. Grievance & Help */}
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Grievance & Help</h4>
                <p className="text-[10px] text-slate-500 truncate">Raise issues and get quick support</p>
              </div>
            </div>

            {/* 2. Campus Updates */}
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Newspaper className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Campus Updates</h4>
                <p className="text-[10px] text-slate-500 truncate">Announcements and circulars</p>
              </div>
            </div>

            {/* 3. Digital Turnstile */}
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Digital Turnstile</h4>
                <p className="text-[10px] text-slate-500 truncate">Gate passes & biometric tracking</p>
              </div>
            </div>

            {/* 4. Hostel & Rooms */}
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bed className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Hostel & Rooms</h4>
                <p className="text-[10px] text-slate-500 truncate">Wing & bed allocation</p>
              </div>
            </div>

            {/* 5. Mess & Dining */}
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Mess & Dining</h4>
                <p className="text-[10px] text-slate-500 truncate">Daily meal tokens & menu</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FOOTER */}
        <footer className="border-t border-slate-200/90 py-3 px-4 md:px-10 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">Campus Helper</span>
          </div>

          <div className="flex items-center space-x-2">
            <span>
              Built with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500 -mt-0.5" /> for a better campus experience
            </span>
            <span>|</span>
            <span>© 2025 Campus Helper. All rights reserved.</span>
          </div>
        </footer>

        {/* 5. REGISTRATION MODAL OVERLAY (DIALOG) */}
        {showRegisterModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowRegisterModal(false)}
          >
            <div
              className="relative w-full max-w-xl my-8 p-6 md:p-8 shadow-2xl shadow-slate-950/40 border border-white/80 max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: '24px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button X */}
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Icon & Title */}
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register New College / Campus</h2>
              <p className="text-xs text-slate-500 mt-1">Set up a new institution tenant or college campus.</p>

              {regError && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Existing Registration Form (Untouched fields & logic) */}
              <form onSubmit={handleRegisterCollege} className="space-y-3.5 mt-4">
                {/* College / University Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / University Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Engineering College"
                      value={regCollegeName}
                      onChange={(e) => setRegCollegeName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Unique Security College Code (Mandatory) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Make a Unique Security College Code (Mandatory) *
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. CAMPUS-2026"
                      value={regCollegeCode}
                      onChange={(e) => setRegCollegeCode(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition uppercase font-mono"
                    />
                  </div>
                </div>

                {/* College Official Email ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@campus.edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-7 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Location / Campus Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location / Campus Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mancheswar, Bhubaneswar, Odisha"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-50/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setAdminRoleTab('STUDENT'); setRegRole('WARDEN'); }}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        adminRoleTab === 'STUDENT'
                          ? 'border-blue-500 bg-blue-50/80 text-blue-600 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAdminRoleTab('FACULTY'); setRegRole('DIRECTOR'); }}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        adminRoleTab === 'FACULTY'
                          ? 'border-blue-500 bg-blue-50/80 text-blue-600 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Faculty</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAdminRoleTab('STAFF'); setRegRole('WARDEN'); }}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                        adminRoleTab === 'STAFF'
                          ? 'border-blue-500 bg-blue-50/80 text-blue-600 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-[11px] font-bold">Staff</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-1"
                >
                  {regLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Register This College / University</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 text-center pt-3 mt-1 border-t border-slate-100">
                By registering, you agree to our{' '}
                <a href="#" className="underline text-slate-500 hover:text-slate-700">Terms & Conditions</a>{' '}
                and{' '}
                <a href="#" className="underline text-slate-500 hover:text-slate-700">Privacy Policy</a>.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f7fc] text-slate-800 overflow-hidden font-sans">
      {/* ================================================== */}
      {/* 2. LEFT SIDEBAR (Width ~265px, Dark Navy #0a192f)   */}
      {/* ================================================== */}
      <aside className="w-[265px] bg-[#0a192f] text-slate-200 border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-xl z-30 select-none">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-none truncate">
                Campus Helper
              </h1>
              <p className="text-[10px] font-semibold text-sky-400 mt-1 truncate">
                Smart Campus • Better Tomorrow
              </p>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold scrollbar-thin">
            {navigationTree.map((item: any) => {
              const isActive = activeSection === item.id;
              const isExpanded = !!expandedSections[item.id];
              const Icon = item.icon;
              const hasSubs = item.subFeatures && item.subFeatures.length > 0;

              return (
                <div key={item.id} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id as Section);
                      if (hasSubs) {
                        setExpandedSections((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id],
                        }));
                        if (!activeSubTab || !item.subFeatures.includes(activeSubTab)) {
                          setActiveSubTab(item.subFeatures[0]);
                        }
                      } else {
                        setActiveSubTab('');
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      {hasSubs && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          } ${isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-300'}`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Accordion Sub-Features Tree */}
                  {hasSubs && isExpanded && (
                    <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-slate-700 ml-4">
                      {item.subFeatures.map((sub: string) => {
                        const isSubActive = isActive && activeSubTab === sub;
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSection(item.id as Section);
                              setActiveSubTab(sub);
                            }}
                            className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-[11px] transition text-left cursor-pointer truncate ${
                              isSubActive
                                ? 'bg-blue-600/20 text-sky-400 font-extrabold border border-blue-500/30 shadow-2xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                isSubActive ? 'bg-sky-400' : 'bg-slate-600'
                              }`}
                            />
                            <span className="truncate">{sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Bottom Banner & Sign Out */}
          <div className="p-3 border-t border-slate-800 space-y-2 shrink-0">
            <div
              className="relative rounded-2xl overflow-hidden p-3 shadow-sm bg-cover bg-center h-22 flex flex-col justify-end"
              style={{ backgroundImage: "url('/images/rec-building.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent pointer-events-none" />
              <div className="relative z-10 text-white text-xs leading-tight">
                <p className="font-bold text-[11px] leading-snug drop-shadow">Empowering Students</p>
                <p className="text-[10px] text-slate-300 drop-shadow">Building a Safer Campus</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================================================== */}
      {/* 3. MAIN WRAPPER (Top Header + Scrollable Content)   */}
      {/* ================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f4f7fc]">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          {/* Left Location */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-slate-900 leading-tight">
                Raajdhani Engineering College (Autonomous)
              </h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">
                Bhubaneswar, Odisha
              </p>
            </div>
          </div>

          {/* Center Search Box */}
          <div className="hidden md:flex items-center relative max-w-md w-full mx-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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

          {/* Right Notifications & Admin Profile */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Language Toggle (EN / हिन्दी / ଓଡ଼ିଆ) */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setSelectedLang('EN')}
                className={`px-2 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                  selectedLang === 'EN' ? 'bg-blue-600 text-white shadow-2xs' : 'hover:text-blue-600'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('HI')}
                className={`px-2 py-1 rounded-lg transition text-[11px] cursor-pointer ${
                  selectedLang === 'HI' ? 'bg-blue-600 text-white shadow-2xs' : 'hover:text-blue-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
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
              type="button"
              onClick={() => setPendingModalOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Approvals Queue ({pendingStudents.length + pendingStaff.length || 3})</span>
            </button>

            {/* Notification Bell with Badge */}
            <button
              type="button"
              onClick={() => setActiveSection('NOTICES')}
              className="relative p-2 text-slate-600 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="3 Unread Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {/* Admin Avatar & Role Capsule */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-2xs">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser?.name || 'Admin'}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* ================================================== */}
        {/* 4. SCROLLABLE MAIN BODY                            */}
        {/* ================================================== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#f4f7fc]">
          {/* Sub-view header when not on main DASHBOARD */}
          {activeSection !== 'DASHBOARD' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-4">
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => {
                    setActiveSection('DASHBOARD');
                    setActiveSubTab('');
                  }}
                  className="flex items-center space-x-1.5 font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-800">
                  {navigationTree.find((i: any) => i.id === activeSection)?.label || activeSection}
                </span>
                {activeSubTab && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="font-semibold text-blue-600">{activeSubTab}</span>
                  </>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 self-start sm:self-auto">
                Campus Helper v2.4 • Admin Portal
              </span>
            </div>
          )}

          {/* ================================================== */}
          {/* SECTION 4-14: NEW MODERN DASHBOARD (When DASHBOARD) */}
          {/* ================================================== */}
          {activeSection === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* 4. MAIN HERO / WELCOME BANNER */}
              <div
                className="rounded-3xl overflow-hidden relative shadow-sm min-h-[165px] p-6 md:p-8 flex flex-col justify-between bg-cover bg-center"
                style={{ backgroundImage: "url('/images/rec-building.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-blue-950/25 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
                      Welcome Back, Admin!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow">
                      Manage your campus, students and operations efficiently.
                    </p>
                    <div className="inline-flex items-center space-x-2 text-[11px] text-blue-200/90 font-medium pt-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-300" />
                      <span>Tue, 30 Sep 2025 &nbsp;|&nbsp; 10:24 AM</span>
                    </div>
                  </div>

                  {/* Right Translucent Campus Card */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/60 shadow-lg flex items-center space-x-3 self-start md:self-auto">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        Raajdhani Engineering College (Autonomous)
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Bhubaneswar, Odisha
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. SIX STATISTICS CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
                {/* Card 1: Total Students */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Total Students</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">2,485</h3>
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center">
                    ↑ +5% <span className="font-normal text-slate-400 ml-1">from last month</span>
                  </p>
                </div>

                {/* Card 2: Faculty & Staff */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Faculty & Staff</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">182</h3>
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center">
                    ↑ +2% <span className="font-normal text-slate-400 ml-1">from last month</span>
                  </p>
                </div>

                {/* Card 3: Hostel Occupancy */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
                    <Bed className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Hostel Occupancy</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">78%</h3>
                  <p className="text-[10px] font-medium text-slate-500 mt-1">1,237 / 1,580</p>
                </div>

                {/* Card 4: Pending Grievances */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Pending Grievances</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">24</h3>
                  <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center">
                    ↓ 12% <span className="font-normal text-slate-400 ml-1">from last week</span>
                  </p>
                </div>

                {/* Card 5: Pending Leave / Gate Pass */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Pending Leave / Gate Pass</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">18</h3>
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center">
                    ↑ 6% <span className="font-normal text-slate-400 ml-1">from last week</span>
                  </p>
                </div>

                {/* Card 6: Emergency Alerts */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-md transition">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400">Emergency Alerts</p>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">0</h3>
                  <p className="text-[10px] font-medium text-emerald-600 mt-1">No active alerts</p>
                </div>
              </div>

              {/* 6. MAIN 3-COLUMN CONTENT GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* COLUMN 1: OCCUPANCY OVERVIEW & LINE CHART (3 COLS) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Card 1: Hostel Occupancy Overview (Donut Chart) */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-900">Hostel Occupancy Overview</h4>
                    <div className="flex flex-col items-center">
                      {/* Modern SVG Donut Chart */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                          {/* Occupied slice (78%) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="12"
                            strokeDasharray="186.2 238.8"
                          />
                          {/* Vacant slice (22%) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="12"
                            strokeDasharray="52.5 238.8"
                            strokeDashoffset="-186.2"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-lg font-black text-slate-900 tracking-tight leading-none">78%</span>
                          <span className="text-[9px] font-bold text-slate-400 mt-0.5">Occupied</span>
                        </div>
                      </div>

                      {/* Legend list */}
                      <div className="w-full space-y-1.5 text-xs pt-2.5 mt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                            <span className="text-[11px] font-medium">Occupied</span>
                          </span>
                          <strong className="text-slate-900 font-bold text-[11px]">1,237</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[11px] font-medium">Vacant</span>
                          </span>
                          <strong className="text-slate-900 font-bold text-[11px]">343</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                            <span className="text-[11px] font-medium">Maintenance</span>
                          </span>
                          <strong className="text-slate-900 font-bold text-[11px]">0</strong>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-semibold text-[11px]">Total Rooms</span>
                          <strong className="text-slate-900 font-black text-[11px]">1,580</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Student & Hostel Trend (Line Chart) */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-black text-slate-900">Student & Hostel Trend</h4>
                      <div className="flex items-center space-x-2 text-[8px] font-bold">
                        <span className="flex items-center space-x-1 text-blue-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          <span>Students</span>
                        </span>
                        <span className="flex items-center space-x-1 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Occupancy</span>
                        </span>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    <div className="w-full">
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
                          <linearGradient id="pageStudentTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 30,85 Q 70,75 110,65 T 180,45 T 250,30 T 290,20 L 290,105 L 30,105 Z"
                          fill="url(#pageStudentTrendGrad)"
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

                      <div className="flex justify-between px-1 text-[8px] font-semibold text-slate-400 mt-1">
                        <span>23 Sep</span>
                        <span>24 Sep</span>
                        <span>25 Sep</span>
                        <span>26 Sep</span>
                        <span>27 Sep</span>
                        <span>28 Sep</span>
                        <span>30 Sep</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: RECENT ACTIVITIES, QUICK ACTIONS, NOTICES & EVENTS (6 COLS) */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Row A: Recent Activities & Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recent Activities */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black text-slate-900">Recent Activities</h4>
                          <button
                            type="button"
                            onClick={() => setActiveSection('WHOS_OUT')}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            {
                              icon: FileText,
                              bg: 'bg-emerald-50 text-emerald-600',
                              title: 'New leave request from Rahul Kumar (Hostel B)',
                              time: '2 hours ago',
                            },
                            {
                              icon: CheckCircle2,
                              bg: 'bg-emerald-50 text-emerald-600',
                              title: 'Grievance #GRV-124 resolved',
                              time: '3 hours ago',
                            },
                            {
                              icon: Newspaper,
                              bg: 'bg-purple-50 text-purple-600',
                              title: 'Notice published: Semester Exam Schedule',
                              time: '4 hours ago',
                            },
                            {
                              icon: User,
                              bg: 'bg-blue-50 text-blue-600',
                              title: 'New student registered: Priya Sahu',
                              time: '5 hours ago',
                            },
                            {
                              icon: Building,
                              bg: 'bg-teal-50 text-teal-600',
                              title: 'Gate pass verified at Main Gate',
                              time: '6 hours ago',
                            },
                          ].map((act, i) => {
                            const ActIcon = act.icon;
                            return (
                              <div key={i} className="flex items-start space-x-2.5 text-xs py-0.5">
                                <div className={`w-6 h-6 rounded-lg ${act.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                  <ActIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-800 text-[11px] leading-snug truncate">{act.title}</p>
                                  <p className="text-[9px] text-slate-400 mt-0.5">{act.time}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions (6 Colorful Tiles) */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black text-slate-900">Quick Actions</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveSection('RESIDENTS')}
                            className="p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <UserPlus className="w-4 h-4 text-blue-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">Add Student</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSection('NOTICES')}
                            className="p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <Megaphone className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">Publish Notice</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSection('CALENDAR')}
                            className="p-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 border border-purple-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <CalendarIcon className="w-4 h-4 text-purple-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">Create Event</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSection('COMPLAINTS')}
                            className="p-2.5 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <AlertTriangle className="w-4 h-4 text-rose-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">Manage Grievances</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSection('MENU')}
                            className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <Utensils className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">Update Mess Menu</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveSection('BILLING')}
                            className="p-2.5 rounded-xl bg-teal-50/80 hover:bg-teal-100 border border-teal-100 flex flex-col items-center justify-center text-center transition cursor-pointer group"
                          >
                            <TrendingUp className="w-4 h-4 text-teal-600 mb-1 group-hover:scale-105 transition" />
                            <span className="text-[10px] font-black text-slate-800">View Reports</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row B: Notice Board & Upcoming Events */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Notice Board */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black text-slate-900">Notice Board</h4>
                          <button
                            type="button"
                            onClick={() => setActiveSection('NOTICES')}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          {/* Notice 1 */}
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                            <Pin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-bold text-slate-800 truncate text-[11px]">Important: Semester Exam schedule</p>
                                <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 shrink-0 ml-1">
                                  Pinned &gt;
                                </span>
                              </div>
                              <p className="text-[9px] text-slate-400 mt-0.5">29 Sep 2025</p>
                            </div>
                          </div>

                          {/* Notice 2 */}
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                            <Building className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 truncate text-[11px]">College closed on 2nd Oct (Gandhi Jayanti)</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">28 Sep 2025</p>
                            </div>
                          </div>

                          {/* Notice 3 */}
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                            <CalendarIcon className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 truncate text-[11px]">Tech Fest 2025 – Registration Open</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">26 Sep 2025</p>
                            </div>
                          </div>

                          {/* Notice 4 */}
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                            <Utensils className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 truncate text-[11px]">Hostel Mess Menu Updated</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">24 Sep 2025</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black text-slate-900">Upcoming Events</h4>
                          <button
                            type="button"
                            onClick={() => setActiveSection('CALENDAR')}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          {/* Event 1 */}
                          <div className="p-2.5 rounded-xl bg-white border-l-4 border-l-rose-500 border border-slate-200 shadow-2xs">
                            <p className="font-bold text-slate-800 text-[11px] truncate">Tech Fest 2025</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">02 Oct 2025</p>
                            <p className="text-[9px] text-slate-400">Main Auditorium</p>
                          </div>

                          {/* Event 2 */}
                          <div className="p-2.5 rounded-xl bg-white border-l-4 border-l-purple-500 border border-slate-200 shadow-2xs">
                            <p className="font-bold text-slate-800 text-[11px] truncate">Cultural Fest</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">16 Oct 2025</p>
                            <p className="text-[9px] text-slate-400">College Ground</p>
                          </div>

                          {/* Event 3 */}
                          <div className="p-2.5 rounded-xl bg-white border-l-4 border-l-blue-500 border border-slate-200 shadow-2xs">
                            <p className="font-bold text-slate-800 text-[11px] truncate">Workshop on Career Guidance</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">25 Oct 2025</p>
                            <p className="text-[9px] text-slate-400">Seminar Hall</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: COLLEGE INFO, QUICK STATS & STATUS (3 COLS) */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Card 1: College Information */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs">
                      <Building className="w-4 h-4 text-blue-600" />
                      <h4 className="font-black text-slate-900">College Information</h4>
                    </div>

                    <div className="space-y-0.5">
                      <p className="font-black text-slate-900 text-xs">Raajdhani Engineering College (Autonomous)</p>
                      <p className="text-[10px] text-slate-500 flex items-center space-x-1">
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
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">info@rec.ac.in</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-blue-600">www.rec.ac.in</span>
                      </p>
                    </div>

                    {/* Thumbnail of campus photo */}
                    <div className="mt-2 rounded-xl overflow-hidden h-24 shadow-2xs border border-slate-200">
                      <img
                        src="/images/rec-building.jpg"
                        alt="Campus Building"
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Card 2: Quick Stats */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <h4 className="text-xs font-black text-slate-900">Quick Stats</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Hostels</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">6</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Departments</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">12</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Total Rooms</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">1,580</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Warden</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">6</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Security Guards</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">18</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center space-x-2">
                          <Heart className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px]">Medical Staff</span>
                        </span>
                        <strong className="text-slate-900 font-bold text-[11px]">4</strong>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: System Status */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-black text-slate-900">System Status</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px]">Server</span>
                        </span>
                        <span className="font-bold text-emerald-600 text-[11px]">Online</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px]">Database</span>
                        </span>
                        <span className="font-bold text-emerald-600 text-[11px]">Connected</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="flex items-center space-x-2 text-slate-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px]">All Services</span>
                        </span>
                        <span className="font-bold text-emerald-600 text-[11px]">Running ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. BOTTOM QUICK LINKS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider">Quick Links</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Campus Map', icon: MapPin, color: 'text-blue-600 bg-blue-50' },
                    { label: 'College Website', icon: Globe, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Library', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Medical Center', icon: Heart, color: 'text-rose-600 bg-rose-50' },
                    { label: 'Emergency Contacts', icon: PhoneCall, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Help & Support', icon: Headphones, color: 'text-purple-600 bg-purple-50' },
                  ].map((link, i) => {
                    const LinkIcon = link.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => alert(`Navigating to ${link.label}`)}
                        className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 flex items-center space-x-2.5 transition text-left cursor-pointer group shadow-2xs"
                      >
                        <div className={`w-8 h-8 rounded-lg ${link.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition`}>
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate">{link.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8. FOOTER */}
              <footer className="border-t border-slate-200/80 py-4 px-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700">Campus Helper</span>
                  <span>•</span>
                  <span>© 2025 Campus Helper. All rights reserved.</span>
                </div>
                <div>
                  <span>Version 1.0.0 &nbsp;|&nbsp; Developed for a Better Campus Experience</span>
                </div>
              </footer>
            </div>
          )}

          {/* SECTION: STUDENT MANAGEMENT */}
          {activeSection === 'RESIDENTS' && (
            <StudentManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              residents={residents}
            />
          )}

          {/* SECTION: HOSTEL MANAGEMENT */}
          {activeSection === 'COMPLIANCE' && (
            <HostelManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              complaints={complaints}
            />
          )}

          {/* SECTION: HOSTEL LEAVE / GATE PASS */}
          {activeSection === 'WHOS_OUT' && (
            <HostelLeaveGatePassView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* SECTION: WARDEN & SECURITY */}
          {activeSection === 'TURNSTILE_SCANNER' && (
            <WardenSecurityView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* SECTION: MEDICAL CARE */}
          {activeSection === 'HOSPITAL_TRIAGE' && (
            <MedicalCareView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* SECTION: EMERGENCY */}
          {activeSection === 'ADOPTION_HUB' && (
            <EmergencyView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* SECTION: COLLEGE PROFILE */}
          {activeSection === 'MANAGER_PROFILE' && (
            <CollegeProfileView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
            />
          )}

          {/* SECTION: ADMIN / OPERATOR MANAGEMENT */}
          {activeSection === 'ONBOARDING' && (
            <AdminOperatorManagementView
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              currentUser={currentUser}
            />
          )}

          {/* SECTION: CAMPUS SERVICES */}
          {activeSection === 'VEHICLES' && <CampusServicesView />}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'NOTIFICATIONS' && <NotificationsView />}

          {/* SECTION: SETTINGS */}
          {activeSection === 'SETTINGS' && <SettingsView />}

          {/* SECTION: COMPLAINTS KANBAN */}
          {activeSection === 'COMPLAINTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Grievance Redressal Kanban Board</h2>
                  <p className="text-xs text-slate-400">
                    SLA-driven complaint tracking. Drag or click arrows to move stages.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-slate-800 text-slate-700 px-3 py-1 rounded-lg">
                    Total: <strong>{complaints.length}</strong>
                  </span>
                </div>
              </div>

              {/* 4 Kanban Columns: RAISED -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED */}
              <div className="grid grid-cols-4 gap-4">
                {['RAISED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'].map((stage) => {
                  const stageComplaints = complaints.filter((c) => c.status === stage);
                  return (
                    <div
                      key={stage}
                      className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-3 flex flex-col h-[70vh]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2">
                        <span className="text-xs font-bold text-slate-700">
                          {stage.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                          {stageComplaints.length}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2.5">
                        {stageComplaints.map((c) => (
                          <div
                            key={c.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2 shadow-sm hover:border-slate-200 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">
                                {c.category}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                #{c.ticketNumber}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-800">{c.title}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2">{c.description}</p>

                            {/* Media attachments */}
                            {(c.photoUrl || c.videoUrl || c.voiceUrl) && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {c.photoUrl && (
                                  <a
                                    href={c.photoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded hover:bg-blue-500/25 transition font-semibold"
                                  >
                                    📷 Photo Proof
                                  </a>
                                )}
                                {c.videoUrl && (
                                  <a
                                    href={c.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded hover:bg-purple-500/25 transition font-semibold"
                                  >
                                    🎥 Video Proof
                                  </a>
                                )}
                                {c.voiceUrl && (
                                  <a
                                    href={c.voiceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded hover:bg-emerald-500/25 transition font-semibold"
                                  >
                                    🎤 Voice Note
                                  </a>
                                )}
                              </div>
                            )}

                            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/80/80">
                              <span>Room {c.roomNumber}</span>
                              <span>Staff: {c.assignedStaffName || 'Auto-assign'}</span>
                            </div>

                            {/* Stage Action Controls */}
                            <div className="flex items-center justify-end space-x-1 pt-1">
                              {stage === 'RAISED' && (
                                <button
                                  onClick={() => updateComplaintStatus(c.id, 'ACKNOWLEDGED')}
                                  className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold hover:bg-blue-700"
                                >
                                  Acknowledge →
                                </button>
                              )}
                              {stage === 'ACKNOWLEDGED' && (
                                <button
                                  onClick={() => updateComplaintStatus(c.id, 'IN_PROGRESS')}
                                  className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded font-bold hover:bg-amber-700"
                                >
                                  In Progress →
                                </button>
                              )}
                              {stage === 'IN_PROGRESS' && (
                                <button
                                  onClick={() => updateComplaintStatus(c.id, 'RESOLVED')}
                                  className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold hover:bg-emerald-700"
                                >
                                  Resolve ✓
                                </button>
                              )}
                              {stage === 'RESOLVED' && c.rating && (
                                <span className="text-[10px] text-amber-400 font-bold">
                                  Rating: {c.rating}★
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: RESIDENTS DIRECTORY & OCCUPANCY MAP */}
          {activeSection === '__OLD_RESIDENTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Resident Directory & KYC Ledger</h2>
                  <p className="text-xs text-slate-400">
                    Searchable student records with parent emergency contacts and digitized KYC.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Search name, student ID, room..."
                    value={residentSearch}
                    onChange={(e) => setResidentSearch(e.target.value)}
                    className="text-xs bg-white border border-slate-200/80 shadow-2xs rounded-xl px-3 py-1.5 text-slate-800 focus:outline-blue-500 w-64"
                  />
                  <select
                    value={selectedBlockFilter}
                    onChange={(e) => setSelectedBlockFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-200/80 shadow-2xs rounded-xl px-3 py-1.5 text-slate-800"
                  >
                    <option value="ALL">All Blocks</option>
                    <option value="Nilgiri">Nilgiri Block A (Boys)</option>
                    <option value="Shivalik">Shivalik Block B (Girls)</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl overflow-hidden shadow-md">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-200/80">
                    <tr>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Room & Block</th>
                      <th className="p-3">Presence Status</th>
                      <th className="p-3">Parent Contact</th>
                      <th className="p-3">KYC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-700">
                    {filteredResidents.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3 font-semibold text-white flex items-center space-x-2">
                          <img
                            src={r.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                            className="w-7 h-7 rounded-full object-cover"
                            alt=""
                          />
                          <span>{r.name}</span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{r.studentId}</td>
                        <td className="p-3 font-medium">
                          {r.roomNumber} • {r.blockName}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              r.currentPresence === 'IN_HOSTEL'
                                ? 'bg-emerald-900/50 text-emerald-300'
                                : r.currentPresence === 'OVERDUE'
                                ? 'bg-red-900/60 text-red-300 animate-pulse'
                                : 'bg-amber-900/50 text-amber-300'
                            }`}
                          >
                            {r.currentPresence.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{r.parentPhone || 'N/A'}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-bold bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: VISITOR MANAGEMENT */}
          {activeSection === 'VISITORS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Campus Visitor Registry & Overstay Monitor</h2>
                  <p className="text-xs text-slate-400">
                    Auto-flags visitors exceeding 2 hours on campus without checkout.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {visitors.map((v) => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      v.status === 'OVERSTAYED'
                        ? 'bg-red-950/40 border-red-700/80 shadow-lg'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{v.visitorName}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          v.status === 'OVERSTAYED'
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <p className="text-slate-400">
                      Visiting: <strong>{v.residentName}</strong> (Room {v.roomNumber})
                    </p>
                    <p className="text-slate-500 text-[11px]">Purpose: {v.purpose}</p>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                      <span>Phone: {v.visitorPhone}</span>
                      {v.overstayMinutes > 0 && (
                        <span className="text-red-400 font-bold">
                          +{v.overstayMinutes} mins overstay
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: TURNSTILE / QR SECURITY SCANNER SIMULATOR */}
          {activeSection === '__OLD_TURNSTILE_SCANNER' && (
            <div className="max-w-xl mx-auto space-y-5 bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 shadow-2xl">
              <div className="text-center space-y-1">
                <ScanLine className="w-10 h-10 text-blue-500 mx-auto animate-pulse" />
                <h2 className="text-base font-bold text-white">
                  Gate Turnstile / QR Scanner Simulator
                </h2>
                <p className="text-xs text-slate-400">
                  Simulates physical RFID/QR hardware access control turnstiles installed at campus gates.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 block">
                  Scan Barcode / QR Pass Token
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Enter QR token (e.g. QR-PASS-892101-RAHUL)"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-blue-500"
                  />
                </div>

                {/* Quick Token Presets */}
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <button
                    onClick={() => setScanInput('QR-PASS-892101-RAHUL')}
                    className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-700 font-mono"
                  >
                    Preset: Rahul Gate Pass
                  </button>
                  <button
                    onClick={() => setScanInput('QR-PASS-891942-AMIT')}
                    className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-700 font-mono"
                  >
                    Preset: Amit Overdue Pass
                  </button>
                  <button
                    onClick={() => setScanInput('VIS-991201-MANOJ')}
                    className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-slate-700 font-mono"
                  >
                    Preset: Manoj Visitor Pass
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => simulateTurnstileScan('EXIT')}
                    className="bg-amber-600 hover:bg-amber-700 text-slate-900 font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Scan for GATE EXIT ↗
                  </button>
                  <button
                    onClick={() => simulateTurnstileScan('ENTRY')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-slate-900 font-bold py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    Scan for GATE ENTRY ↙
                  </button>
                </div>
              </div>

              {/* Visual Hardware Turnstile Feedback Display */}
              {scanResult && (
                <div
                  className={`p-4 rounded-2xl border text-center space-y-1.5 animate-in zoom-in-95 ${
                    scanResult.status === 'ACCESS_GRANTED'
                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                      : 'bg-red-950/60 border-red-500/80 text-red-200'
                  }`}
                >
                  <div className="text-sm font-black tracking-wider uppercase">
                    TURNSTILE LED: {scanResult.status.replace(/_/g, ' ')}
                  </div>
                  <p className="text-xs">{scanResult.message || scanResult.reason}</p>
                  {scanResult.name && (
                    <p className="text-xs font-bold text-white">
                      Person: {scanResult.name} ({scanResult.room ? `Room ${scanResult.room}` : 'Visitor'})
                    </p>
                  )}
                </div>
              )}

              {/* Station 2: 2G / Keypad Feature Phone SMS Gateway Simulator */}
              <div className="border-t border-slate-200/80 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      Station 2: Feature Phone SMS Gateway Fallback (2G / Weak Wi-Fi)
                    </h3>
                  </div>
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                    No Smartphone Required
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Simulates incoming carrier SMS from basic Nokia/keypad phones when hostel Wi-Fi is patchy. Texting shortcode creates turnstile outpasses and emergency sirens.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Student Mobile Number</label>
                    <input
                      type="text"
                      value={smsPhoneInput}
                      onChange={(e) => setSmsPhoneInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">SMS Text Command</label>
                    <input
                      type="text"
                      value={smsTextInput}
                      onChange={(e) => setSmsTextInput(e.target.value)}
                      placeholder="e.g. PASS OUT 3HRS, STATUS, or SOS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Preset SMS Action Chips */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {[
                    { label: "SMS: 'PASS OUT 3HRS'", cmd: 'PASS OUT 3HRS' },
                    { label: "SMS: 'PASS OUT MARKET'", cmd: 'PASS OUT MARKET' },
                    { label: "SMS: 'STATUS'", cmd: 'STATUS' },
                    { label: "SMS: 'SOS EMERGENCY'", cmd: 'SOS EMERGENCY' },
                    { label: "SMS: 'HELP'", cmd: 'HELP' }
                  ].map((p) => (
                    <button
                      key={p.cmd}
                      onClick={() => setSmsTextInput(p.cmd)}
                      className="bg-slate-50 hover:bg-slate-800 text-slate-700 px-2 py-1 rounded border border-slate-200/80 font-mono transition cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSimulateSms}
                  disabled={smsLoading}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {smsLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Simulate Incoming SMS to Shortcode 56070</span>
                    </>
                  )}
                </button>

                {/* Live SMS Log Feed */}
                {smsLogs.length > 0 && (
                  <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Live SMS Gateway Transcript:
                    </span>
                    {smsLogs.slice(0, 3).map((log, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-xl border text-[11px] space-y-0.5 ${
                          log.direction === 'INBOUND'
                            ? 'bg-white border-slate-200/80 text-slate-700'
                            : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{log.direction === 'INBOUND' ? `Incoming SMS from ${log.phone}` : 'Auto-Reply SMS to Handset'}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="font-mono whitespace-pre-line">{log.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Station 3: Guard Desk Keypad Punch (Offline 6-Digit Verification) */}
              <div className="border-t border-slate-200/80 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 bg-purple-500/20 text-purple-400 rounded-lg">
                      <ScanLine className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      Station 3: Guard Desk 6-Digit Numeric Punch (Zero Internet)
                    </h3>
                  </div>
                  <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                    Keypad Turnstile
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  When a student without a smartphone or data connection reaches the gate, they dictate their 6-digit numeric pass code received via SMS. Guard types code here or punches turnstile PIN pad.
                </p>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={offlineCodeInput}
                    onChange={(e) => setOfflineCodeInput(e.target.value)}
                    placeholder="e.g. PASS-749201 or 749201"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleVerifyOfflineCodePunch}
                    className="bg-purple-600 hover:bg-purple-500 text-slate-900 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition cursor-pointer"
                  >
                    Punch Code & Unlock Barrier
                  </button>
                </div>

                {offlineVerifyResult && (
                  <div
                    className={`p-3 rounded-2xl border text-xs text-center space-y-1 animate-in zoom-in-95 ${
                      offlineVerifyResult.status === 'ACCESS_GRANTED'
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                        : 'bg-red-950/60 border-red-500/80 text-red-200'
                    }`}
                  >
                    <div className="font-bold text-sm">
                      {offlineVerifyResult.status === 'ACCESS_GRANTED' ? '✓ ACCESS GRANTED • BARRIER UNLOCKED' : '✕ ACCESS DENIED'}
                    </div>
                    <p className="text-[11px]">{offlineVerifyResult.message || offlineVerifyResult.reason}</p>
                    {offlineVerifyResult.name && (
                      <p className="text-white font-semibold">
                        Resident: {offlineVerifyResult.name} (Room {offlineVerifyResult.room}) • Direction: {offlineVerifyResult.direction}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: NAAC & ACCREDITATION AUDIT DOSSIER */}
          {activeSection === '__OLD_COMPLIANCE' && naacReport && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">
                    Institutional Accreditation & NAAC Criterion Dossier
                  </h2>
                  <p className="text-xs text-slate-400">
                    Automated, tamper-evident audit logs and grievance turnaround records for accreditation.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href="http://localhost:4000/api/compliance/export/grievances.csv"
                    download="NAAC_Criterion_5_1_Grievance_Redressal.csv"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition flex items-center space-x-1"
                  >
                    <span>Criterion 5.1 (Grievance CSV)</span>
                  </a>
                  <a
                    href="http://localhost:4000/api/compliance/export/safety-audit.csv"
                    download="NAAC_Criterion_7_1_Safety_Audit.csv"
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition flex items-center space-x-1"
                  >
                    <span>Criterion 7.1 (Safety CSV)</span>
                  </a>
                  <button
                    onClick={() => alert('Full NAAC Accreditation Peer-Team Dossier generated with cryptographic hash verification!')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow transition"
                  >
                    Export Full Dossier (PDF)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Digitized KYC Rate</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {naacReport.metrics.digitizedKycRate}
                  </div>
                  <span className="text-[10px] text-slate-500">Parent Contacts Documented</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Resolution Speed</span>
                  <div className="text-2xl font-black text-blue-400 mt-1">
                    {naacReport.metrics.averageResolutionTurnaround}
                  </div>
                  <span className="text-[10px] text-slate-500">Against 24h institutional SLA</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Alarm Response</span>
                  <div className="text-2xl font-black text-white mt-1">
                    {naacReport.metrics.emergencyResponseTimeAvg}
                  </div>
                  <span className="text-[10px] text-slate-500">Sub-minute siren alert</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Trail Depth</span>
                  <div className="text-2xl font-black text-purple-400 mt-1">
                    {naacReport.metrics.tamperEvidentAuditLogsRecorded}
                  </div>
                  <span className="text-[10px] text-slate-500">Immutable governance logs</span>
                </div>
              </div>

              {/* Sample Grievance Logs */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-2xl p-4 shadow-md">
                <h3 className="text-xs font-bold text-slate-700 mb-3">
                  Recent Grievance Redressal Audit Records (Criterion 5.1.2)
                </h3>
                <div className="space-y-2">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-700"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded">
                          {log.action}
                        </span>
                        <span className="text-slate-400">Entity: {log.entity}</span>
                        <span className="text-slate-500 truncate max-w-xs">{log.detailsJson}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 60-MINUTE FIRST-RUN ONBOARDING SETUP WIZARD */}
          {activeSection === '__OLD_ONBOARDING' && (
            <div className="max-w-2xl mx-auto space-y-6 bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 shadow-2xl">
              <div className="text-center space-y-1">
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto" />
                <h2 className="text-base font-bold text-white">
                  60-Minute Institution Onboarding Wizard
                </h2>
                <p className="text-xs text-slate-400">
                  Configure and deploy a complete digital hostel campus in under 60 minutes.
                </p>
              </div>

              {/* Stepper Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-4">
                {['Institution', 'Blocks & Rooms', 'Resident CSV', 'Branding'].map((st, idx) => (
                  <div
                    key={st}
                    className={`flex items-center space-x-1.5 ${
                      onboardingStep >= idx + 1 ? 'text-blue-400' : 'text-slate-600'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-2">
                {onboardingStep === 1 && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Institution / Hostel Name</label>
                      <input
                        type="text"
                        value={onboardingHostelName}
                        onChange={(e) => setOnboardingHostelName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Default Night Curfew Time</label>
                      <input
                        type="text"
                        value={onboardingCurfew}
                        onChange={(e) => setOnboardingCurfew(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <button
                      onClick={() => setOnboardingStep(2)}
                      className="w-full bg-blue-600 text-slate-900 font-bold py-2 rounded-xl"
                    >
                      Next: Blocks & Capacity →
                    </button>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Block Names (Comma Separated)</label>
                      <input
                        type="text"
                        value={onboardingBlocks}
                        onChange={(e) => setOnboardingBlocks(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <button
                      onClick={() => setOnboardingStep(3)}
                      className="w-full bg-blue-600 text-slate-900 font-bold py-2 rounded-xl"
                    >
                      Next: Bulk Import Residents →
                    </button>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="space-y-3 text-xs text-center">
                    <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      <p className="font-bold text-slate-700">Upload Residents CSV or Excel</p>
                      <p className="text-[11px] text-slate-500 mt-1">Columns: Name, Email, Phone, Room, Block, Course</p>
                    </div>
                    <button
                      onClick={() => setOnboardingStep(4)}
                      className="w-full bg-blue-600 text-slate-900 font-bold py-2 rounded-xl"
                    >
                      Import Sample Batch & Proceed →
                    </button>
                  </div>
                )}

                {onboardingStep === 4 && (
                  <div className="space-y-3 text-xs text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h3 className="font-bold text-white text-sm">Hostel Configuration Complete!</h3>
                    <p className="text-slate-400">
                      Campus is 100% operational with digital passes, rules engine, and live emergency alerting.
                    </p>
                    <button
                      onClick={() => {
                        setOnboardingStep(1);
                        setActiveSection('DASHBOARD');
                      }}
                      className="w-full bg-emerald-600 text-slate-900 font-bold py-2.5 rounded-xl shadow-lg"
                    >
                      Open Live Executive Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. NOTICES & ANNOUNCEMENTS SECTION */}
          {activeSection === 'NOTICES' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg">
                      <Bell className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Targeted Broadcasts & WhatsApp-Style Read Receipts
                    </h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Audience Isolation & Delivery Proof
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Like WhatsApp Broadcast with delivery checkmarks: target notices by block or year, view live read percentages, and track which students haven't read urgent advisories.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Filter Audience:</span>
                    <select
                      value={noticeTargetFilter}
                      onChange={(e) => setNoticeTargetFilter(e.target.value)}
                      className="bg-transparent text-white text-xs font-semibold focus:outline-none"
                    >
                      <option value="ALL">All Audiences</option>
                      <option value="BLOCK_A">Block A Only</option>
                      <option value="BLOCK_B">Block B Only</option>
                      <option value="FIRST_YEAR">First Year Students</option>
                      <option value="FINAL_YEAR">Final Year Students</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setQuickNoticeModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Targeted Circular</span>
                  </button>
                </div>
              </div>

              {/* Published Notices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices
                  .filter((n) => noticeTargetFilter === 'ALL' || n.targetAudience === noticeTargetFilter || n.targetAudience === 'ALL')
                  .map((n) => (
                    <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3.5 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            n.isEmergencyAlert 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {n.category || 'GENERAL'} {n.isEmergencyAlert ? '• URGENT SIREN' : ''}
                          </span>
                          <span className="text-[10px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80">
                            🎯 {n.targetAudience || 'ALL_STUDENTS'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-white text-sm">{n.title}</h3>
                      <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>

                      {/* WhatsApp Read Receipts Delivery Bar */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 flex items-center space-x-1">
                            <span className="text-blue-400 font-bold">✓✓ Read by:</span>
                            <strong className="text-white">{n.readCount || 84} / {n.totalAudience || 150} students</strong>
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {n.readPercentage || 56}% Read ({n.acknowledgedCount || 62} Ack)
                          </span>
                        </div>
                        <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200/80">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${n.readPercentage || 56}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Issued by: <strong className="text-slate-400">{n.authorName || 'Warden Office'}</strong></span>
                        <button
                          onClick={() => handleViewReceipts(n.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200 transition flex items-center space-x-1 cursor-pointer"
                        >
                          <span>📊 View Read Receipts Roster</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 10. MESS MENU PLANNER SECTION */}
          {activeSection === 'MENU' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Daily Dining & Mess Menu Command</h2>
                  <p className="text-xs text-slate-400">Manage 4-meal daily nutrition and Sunday grand festival feasts. Real-time broadcast to student residents.</p>
                </div>
                <button
                  onClick={() => setEditMenuModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition cursor-pointer"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Update Today's Meals</span>
                </button>
              </div>

              {/* Today's Live Menu Board */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Active Menu for Today ({menuData?.today?.day || 'TODAY'})</h3>
                      <p className="text-[11px] text-slate-400">Real-time eating headcount & food prep estimation</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Synced with Student Phones</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { meal: 'BREAKFAST', time: '7:30 AM - 9:30 AM', color: 'border-amber-500/30 bg-amber-500/5', icon: Sun },
                    { meal: 'LUNCH', time: '12:30 PM - 2:30 PM', color: 'border-blue-500/30 bg-blue-500/5', icon: Coffee },
                    { meal: 'SNACKS', time: '4:30 PM - 6:00 PM', color: 'border-emerald-500/30 bg-emerald-500/5', icon: Sparkles },
                    { meal: 'DINNER', time: '7:30 PM - 10:00 PM', color: 'border-purple-500/30 bg-purple-500/5', icon: Moon }
                  ].map(({ meal, time, color, icon: MealIcon }) => (
                    <div key={meal} className={`p-4 rounded-2xl border ${color} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center space-x-1">
                          <MealIcon className="w-3.5 h-3.5 mr-1" />
                          {meal}
                        </span>
                        <span className="text-[10px] text-slate-500">{time}</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-relaxed">
                        {menuData?.today?.meals?.[meal] || menuForm[meal.toLowerCase() as keyof typeof menuForm] || 'Standard Menu'}
                      </p>
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Expected Count:</span>
                        <strong className="text-orange-400">{menuData?.today?.headcounts?.[meal.toLowerCase()] || 200} Residents</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Festival Gala Showcase */}
              {menuData?.festivalSpecial && (
                <div className="bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-purple-950/40 border border-orange-500/30 p-6 rounded-3xl space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Upcoming Grand Festival Buffet</span>
                  </div>
                  <h3 className="text-base font-black text-white">{menuData.festivalSpecial.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="p-3 bg-white/60 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-amber-400 font-bold block mb-1">Dinner Gala Buffet:</span>
                      <span>{menuData.festivalSpecial.dinnerFeast}</span>
                    </div>
                    <div className="p-3 bg-white/60 rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-amber-400 font-bold block mb-1">Live Counters:</span>
                      <span>{menuData.festivalSpecial.liveCounters?.join(' • ') || 'Live Tandoor & Chaat Counters'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fallback for other modules (Billing, Vehicles) */}
          {(activeSection === 'BILLING' || activeSection === 'VEHICLES') && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <h2 className="text-sm font-bold text-white">
                {activeSection.replace('_', ' ')} Management Console
              </h2>
              <p className="text-xs text-slate-400">
                Full CRUD control enabled for {activeSection.toLowerCase()}. All updates synchronize live across Resident Apps.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200/80">
                Active records synced: <strong>{activeSection === 'BILLING' ? bills.length : vehicles.length}</strong> items in database.
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: HOSPITAL PATIENT-QUEUE STYLE TRIAGE DASHBOARD         */}
          {/* ============================================================== */}
          {activeSection === '__OLD_HOSPITAL_TRIAGE' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg">
                      <ShieldAlert className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Hospital-Queue Triage Command Board
                    </h2>
                    <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                      Emergency Room Priority System
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Like a hospital emergency room doctor triage board: centralized visibility into incident age, wait times, SLA countdowns, recurring failure hotspots, and staff workload.
                  </p>
                </div>

                <button
                  onClick={() => authToken && fetchAllAdminData(authToken, currentUser?.tenantId)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-triage Queue</span>
                </button>
              </div>

              {/* Triage Urgency Metrics (Doctor / ER Triage Summary) */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total In Triage
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    {hospitalQueue?.triageMetrics?.totalInQueue || (activeEmergencies.length + complaints.filter(c => c.status !== 'RESOLVED').length)}
                  </div>
                  <span className="text-[10px] text-slate-500">Unresolved cases active</span>
                </div>

                <div className="bg-red-950/30 p-4 rounded-2xl border border-red-500/40 shadow-md">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                    Critical (Code Red)
                  </span>
                  <div className="text-2xl font-black text-red-400 mt-1 animate-pulse">
                    {hospitalQueue?.triageMetrics?.criticalCount ?? activeEmergencies.length}
                  </div>
                  <span className="text-[10px] text-red-300/80">Immediate physical triage</span>
                </div>

                <div className="bg-amber-950/20 p-4 rounded-2xl border border-amber-500/30 shadow-md">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Urgent (Code Yellow)
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {hospitalQueue?.triageMetrics?.urgentCount || complaints.filter(c => c.priority === 'URGENT' || ['WATER', 'ELECTRICITY'].includes(c.category)).length}
                  </div>
                  <span className="text-[10px] text-amber-300/80">High priority maintenance</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Average Triage Wait
                  </span>
                  <div className="text-2xl font-black text-blue-400 mt-1">
                    {hospitalQueue?.triageMetrics?.avgWaitMinutes || 14} min
                  </div>
                  <span className="text-[10px] text-slate-500">Time elapsed since report</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Within SLA Rate
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {hospitalQueue?.triageMetrics?.withinSlaPercentage || 96}%
                  </div>
                  <span className="text-[10px] text-slate-500">Adhering to turnaround target</span>
                </div>
              </div>

              {/* Recurring Hotspot Heatmap Alert Banner (Analogous to disease outbreak / recurring ward issues) */}
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 border border-amber-500/30 rounded-3xl p-4.5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <h3 className="font-extrabold text-xs text-amber-300 uppercase tracking-wider">
                      Hotspot Cluster Detection (Recurring Infrastructure Failures)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    Predictive Preventive Alert
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(hospitalQueue?.recurringHotspots || [
                    { location: 'Block A (3rd Floor Bathrooms)', category: 'WATER', count: 4, activeTickets: ['CMP-904121', 'CMP-904144'] },
                    { location: 'Block C (Wing B Study Corridor)', category: 'WIFI', count: 3, activeTickets: ['CMP-881290', 'CMP-881305'] }
                  ]).map((h: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-white">{h.location}</strong>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {h.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          <strong>{h.count} tickets</strong> logged in the last 72 hours. Suspected main line pipeline issue.
                        </p>
                      </div>
                      <button
                        onClick={() => alert(`Inspection task created for ${h.location}! Maintenance team alerted.`)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                      >
                        Dispatch Overhaul
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Central Hospital Patient-Queue Triage Table */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Live Patient & Incident Triage Roster</h3>
                    <p className="text-xs text-slate-400">Sorted by Triage Urgency (Code Red &gt; Yellow &gt; Blue) and longest waiting time.</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Queue Depth: <strong>{hospitalQueue?.queue?.length || 5} cases</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {(hospitalQueue?.queue || [
                    {
                      id: 'em-1',
                      type: 'EMERGENCY',
                      triageLevel: 'CRITICAL',
                      title: 'SOS Alert: Medical Emergency / Asthma Attack',
                      studentName: 'Rahul Sharma',
                      studentRoom: 'A-302',
                      block: 'Block A',
                      waitMinutes: 3,
                      slaRemainingMinutes: 2,
                      isSlaBreached: false,
                      assignedTo: 'Campus Rapid Response Unit',
                      actionNeeded: 'Immediate physical on-site intervention'
                    },
                    {
                      id: 'c-1',
                      type: 'COMPLAINT',
                      ticketNumber: 'CMP-782910',
                      category: 'WATER',
                      triageLevel: 'URGENT',
                      title: 'Main pipeline leak causing washroom flooding',
                      studentName: 'Amit Verma',
                      studentRoom: 'B-104',
                      block: 'Block B',
                      waitMinutes: 24,
                      slaRemainingMinutes: 120,
                      isSlaBreached: false,
                      assignedTo: 'Mahendra Singh (Plumbing)',
                      actionNeeded: 'Shut off secondary stopcock valve'
                    },
                    {
                      id: 'c-2',
                      type: 'COMPLAINT',
                      ticketNumber: 'CMP-782914',
                      category: 'ELECTRICITY',
                      triageLevel: 'URGENT',
                      title: 'Sparks from MCB switchboard in corridor',
                      studentName: 'Priya Patel',
                      studentRoom: 'A-212',
                      block: 'Block A',
                      waitMinutes: 48,
                      slaRemainingMinutes: 80,
                      isSlaBreached: false,
                      assignedTo: 'Suresh Kumar (Electrical)',
                      actionNeeded: 'Inspect wiring & replace breaker fuse'
                    },
                    {
                      id: 'p-1',
                      type: 'PASS',
                      passNumber: 'PASS-89104',
                      triageLevel: 'STANDARD',
                      title: 'Outpass: Medical Visit / City Hospital',
                      studentName: 'Sneha Rao',
                      studentRoom: 'C-201',
                      block: 'Block C',
                      waitMinutes: 12,
                      slaRemainingMinutes: 18,
                      isSlaBreached: false,
                      assignedTo: 'Duty Warden Office',
                      actionNeeded: 'Verify parent SMS confirmation & unlock gate'
                    }
                  ]).map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition text-xs space-y-2.5 ${
                        item.triageLevel === 'CRITICAL'
                          ? 'bg-red-950/40 border-red-500/80 shadow-lg shadow-red-950/50'
                          : item.triageLevel === 'URGENT'
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                              item.triageLevel === 'CRITICAL'
                                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                                : item.triageLevel === 'URGENT'
                                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}
                          >
                            {item.triageLevel === 'CRITICAL' ? '🚨 CODE RED' : item.triageLevel === 'URGENT' ? '⚡ CODE YELLOW' : 'ROUTINE'}
                          </span>
                          <span className="font-extrabold text-white text-sm">{item.title}</span>
                        </div>

                        {/* Wait Time & SLA Badges */}
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200/80 text-slate-700 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Wait: <strong>{item.waitMinutes}m</strong></span>
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              item.isSlaBreached
                                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {item.isSlaBreached ? '⚠️ SLA Breached' : `SLA: ${item.slaRemainingMinutes || 45}m left`}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-white/60 p-2.5 rounded-xl border border-slate-200/80/80">
                        <div>
                          <span className="text-slate-500 block">Student & Room</span>
                          <strong className="text-slate-800">{item.studentName} ({item.studentRoom}, {item.block})</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Assigned Specialist</span>
                          <strong className="text-blue-400">{item.assignedTo}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Action Protocol</span>
                          <strong className="text-slate-700">{item.actionNeeded}</strong>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleQuickTriageAction(item.id, item.type, 'IN_PROGRESS')}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-800 px-2.5 py-1.5 rounded-lg font-bold text-[10px] transition cursor-pointer"
                          >
                            Mark In-Transit
                          </button>
                          <button
                            onClick={() => handleQuickTriageAction(item.id, item.type, 'RESOLVE')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow transition cursor-pointer flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Resolve</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff Workload Balancing (Hospital Doctors & Specialist Nurses analog) */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Departmental Specialist Workload Distribution</h3>
                    <p className="text-xs text-slate-400">Balances incoming maintenance and security load across campus technicians.</p>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold px-2 py-0.5 rounded-full">
                    Auto-Routing Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(hospitalQueue?.staffWorkload || [
                    { name: 'Suresh Kumar', department: 'ELECTRICAL', phone: '+91 98111 00006', activeCount: 2, status: 'OPTIMAL' },
                    { name: 'Mahendra Singh', department: 'PLUMBING', phone: '+91 98111 00007', activeCount: 1, status: 'AVAILABLE' },
                    { name: 'Rajesh Kumar', department: 'SECURITY', phone: '+91 98111 00004', activeCount: 0, status: 'AVAILABLE' }
                  ]).map((st: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-white">{st.name}</strong>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {st.department}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Active Cases: <strong className="text-blue-400">{st.activeCount} tickets</strong> • {st.phone}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          st.status === 'HEAVY_LOAD'
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : st.status === 'OPTIMAL'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: 4-WEEK ADOPTION PLAYBOOK & 1-CLICK LEGACY ERP SYNC    */}
          {/* ============================================================== */}
          {activeSection === '__OLD_ADOPTION_HUB' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Institutional Adoption Hub & Legacy ERP Bridge
                    </h2>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Zero Friction Transition
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    A realistic roadmap for colleges with entrenched legacy systems (SAP, TCS iON, Excel) to adopt the platform across 4 weeks without academic disruption.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Default Campus Code:</span>
                  <span className="font-mono text-xs font-bold text-white bg-white px-2 py-1 rounded border border-blue-500/40">
                    {currentUser.tenantCode}
                  </span>
                </div>
              </div>

              {/* Projected Institutional ROI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Warden Time Saved
                  </span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    18.5 hrs/wk
                  </div>
                  <span className="text-[10px] text-slate-500">Manual curfew roll-calls eliminated</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    SLA Turnaround Speed
                  </span>
                  <div className="text-2xl font-black text-blue-400 mt-1">
                    78% Faster
                  </div>
                  <span className="text-[10px] text-slate-500">From 3.5 days to 4.2 hours average</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Annual Paper Savings
                  </span>
                  <div className="text-2xl font-black text-purple-400 mt-1">
                    ₹4,50,000
                  </div>
                  <span className="text-[10px] text-slate-500">Registers, outpass slips & toner</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    NAAC Grievance Audit
                  </span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    98/100
                  </div>
                  <span className="text-[10px] text-slate-500">Criterion 5.1 & 7.1 compliance</span>
                </div>
              </div>

              {/* 4-Week Structured Adoption Roadmap */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">4-Week Rollout Strategy: From Paper to 100% Digital</h3>
                    <p className="text-xs text-slate-400">Phased rollout prevents student confusion and security friction.</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                    <span>Active Phase:</span>
                    <strong>Week 2 (Pilot Block A & B)</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      week: 'Week 1',
                      title: 'Zero-Disruption Roster Sync',
                      status: 'COMPLETED',
                      items: [
                        'Upload student roll sheets via 1-Click CSV',
                        'Map Department Staff (Electrical, Plumbing)',
                        'Configure curfew timings (21:30) and SLAs',
                        'Publish campus enrollment code'
                      ]
                    },
                    {
                      week: 'Week 2',
                      title: 'Shadow Run & Pilot (Block A & B)',
                      status: 'IN_PROGRESS',
                      items: [
                        'Parallel run with 250 residents in Block A',
                        'Deploy tablet scanner at Main Gate North',
                        'Verify SMS fallback for feature phones',
                        'Issue first targeted WhatsApp broadcasts'
                      ]
                    },
                    {
                      week: 'Week 3',
                      title: 'Campus-Wide Auto-Routing',
                      status: 'UPCOMING',
                      items: [
                        'Enable photo/video/voice note tickets',
                        'Auto-assign directly to technicians',
                        'Launch digital mess menu & RSVPs',
                        'Decommission physical paper gate slips'
                      ]
                    },
                    {
                      week: 'Week 4',
                      title: 'Paperless Sunset & NAAC Audit',
                      status: 'UPCOMING',
                      items: [
                        'Sunset legacy manual registers 100%',
                        'Generate NAAC Criterion 5.1 CSV dossier',
                        'Evaluate warden time savings review',
                        'Lock automated curfew alert rules'
                      ]
                    }
                  ].map((w, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border text-xs space-y-3 ${
                        w.status === 'COMPLETED'
                          ? 'bg-slate-50 border-emerald-500/40'
                          : w.status === 'IN_PROGRESS'
                          ? 'bg-blue-950/20 border-blue-500/50 shadow-lg'
                          : 'bg-slate-50/30 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-white">{w.week}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            w.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : w.status === 'IN_PROGRESS'
                              ? 'bg-blue-500/20 text-blue-300 animate-pulse'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs">{w.title}</h4>
                      <ul className="space-y-1.5 text-[11px] text-slate-700">
                        {w.items.map((it, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className={w.status === 'COMPLETED' ? 'text-emerald-400' : 'text-blue-400'}>✓</span>
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1-Click Legacy ERP / SIS CSV Batch Importer Tool */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">
                      1-Click Legacy ERP / SIS Batch Roster Importer
                    </h3>
                    <p className="text-xs text-slate-400">
                      Instantly import student lists from SAP, TCS iON, Excel or Google Sheets. No database re-architecture required.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setErpCsvInput(`RollNumber, Name, Email, Phone, Room, Block, Course, Year
2026-CS-101, Tanmay Saxena, tanmay.s@apex.edu, +91 98111 22334, A-201, Block A, Computer Science, 3rd Year
2026-EC-204, Ananya Sharma, ananya.sh@apex.edu, +91 98222 33445, B-108, Block B, Electronics, 2nd Year
2026-ME-312, Vikram Joshi, vikram.j@apex.edu, +91 98333 44556, A-305, Block A, Mechanical, 4th Year
2026-BT-089, Sneha Kulkarni, sneha.k@apex.edu, +91 98444 55667, C-212, Block C, Biotech, 1st Year`);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                  >
                    Load Sample ERP CSV
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 block">
                    Paste CSV Data (Columns: RollNumber, Name, Email, Phone, Room, Block, Course, Year)
                  </label>
                  <textarea
                    rows={5}
                    value={erpCsvInput}
                    onChange={(e) => setErpCsvInput(e.target.value)}
                    placeholder="2026-CS-101, Tanmay Saxena, tanmay.s@apex.edu, +91 98111 22334, A-201, Block A, Computer Science, 3rd Year..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                      Imported students are automatically linked to your campus code <strong className="text-white font-mono">{currentUser.tenantCode}</strong>.
                    </p>
                    <button
                      onClick={handleImportLegacyErp}
                      disabled={erpImportLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {erpImportLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Synchronize Roster from ERP</span>
                        </>
                      )}
                    </button>
                  </div>

                  {erpImportResult && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 animate-in zoom-in-95">
                      <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{erpImportResult.message || 'Roster batch synchronized successfully!'}</span>
                      </div>
                      <div className="text-[11px] text-slate-700">
                        Total Processed: <strong>{erpImportResult.totalProcessed}</strong> • Newly Admitted: <strong>{erpImportResult.importedCount}</strong>
                      </div>
                      {erpImportResult.sampleJoinedStudents && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[10px]">
                          {erpImportResult.sampleJoinedStudents.slice(0, 4).map((st: any, idx: number) => (
                            <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200/80">
                              <strong className="text-white block">{st.name}</strong>
                              <span className="text-slate-400">Roll: {st.rollNumber} • Room {st.room}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: COLLEGE GALLERY & CAMPUS ACTIVITIES MANAGER            */}
          {/* ============================================================== */}
          {activeSection === 'GALLERY' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                      <Camera className="w-3.5 h-3.5 text-blue-400" />
                      <span>Institutional Media & Life Center</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">
                      {at.galleryTitle}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xl">
                      {at.gallerySubtitle}
                    </p>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 text-center shrink-0">
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{at.totalMoments}</span>
                      <strong className="text-lg font-black text-white">{galleryItems.length}</strong>
                    </div>
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-purple-400 uppercase font-bold block">Videos</span>
                      <strong className="text-lg font-black text-purple-400">
                        {galleryItems.filter(i => i.mediaType === 'VIDEO').length}
                      </strong>
                    </div>
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Photos</span>
                      <strong className="text-lg font-black text-emerald-400">
                        {galleryItems.filter(i => i.mediaType === 'PHOTO').length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload New Activity Card */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <UploadCloud className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Upload New Campus Activity / Media</h3>
                      <p className="text-[11px] text-slate-400">Add photos or videos with category tagging</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold px-2 py-0.5 rounded-full">
                    Real-Time Student Broadcast Active
                  </span>
                </div>

                {gallerySuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{gallerySuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateGalleryItem} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-slate-700 font-bold block mb-1">Activity Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Annual Cultural Fest 'Tarang 2026' Grand Night"
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Category *</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="CULTURAL">Cultural Fest & Arts</option>
                        <option value="SPORTS">Sports & Tournaments</option>
                        <option value="TECH">Hackathons & Tech Expo</option>
                        <option value="HOSTEL_LIFE">Hostel DJ & Mess Carnivals</option>
                        <option value="ACADEMIC">Academic & Convocation</option>
                        <option value="ACTIVITIES">General Activities & Clubs</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Media Type</label>
                      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setGalleryMediaType('PHOTO')}
                          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
                            galleryMediaType === 'PHOTO' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalleryMediaType('VIDEO')}
                          className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
                            galleryMediaType === 'VIDEO' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Event Date</label>
                      <input
                        type="date"
                        value={galleryEventDate}
                        onChange={(e) => setGalleryEventDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-5">
                      <input
                        type="checkbox"
                        id="pinGallery"
                        checked={galleryIsPinned}
                        onChange={(e) => setGalleryIsPinned(e.target.checked)}
                        className="rounded text-blue-600 bg-slate-50"
                      />
                      <label htmlFor="pinGallery" className="text-slate-700 font-semibold cursor-pointer">
                        Feature as Pinned Highlight
                      </label>
                    </div>
                  </div>

                  {/* Direct File Upload & URL Input */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-700 font-bold block">
                        Media Source ({galleryMediaType === 'VIDEO' ? 'MP4 / WebM Video' : 'HD Photo'}) *
                      </label>
                      <label className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center space-x-1 shadow">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{galleryUploading ? 'Uploading...' : 'Choose File from PC'}</span>
                        <input
                          type="file"
                          accept={galleryMediaType === 'VIDEO' ? 'video/*' : 'image/*'}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleGalleryFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <input
                      type="url"
                      required
                      placeholder={galleryMediaType === 'VIDEO' ? 'https://... video url (or click Upload File above)' : 'https://... image url (or click Upload File above)'}
                      value={galleryMediaUrl}
                      onChange={(e) => setGalleryMediaUrl(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                    />

                    {galleryMediaUrl && (
                      <div className="pt-2 flex items-center space-x-3">
                        <span className="text-[10px] text-emerald-400 font-bold">✓ Media Attached Preview:</span>
                        {galleryMediaType === 'VIDEO' ? (
                          <video src={galleryMediaUrl} className="h-16 w-28 rounded-lg object-cover bg-black" controls />
                        ) : (
                          <img src={galleryMediaUrl} alt="Preview" className="h-16 w-24 rounded-lg object-cover border border-slate-200" />
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Description / Activity Highlights</label>
                    <textarea
                      rows={2}
                      placeholder="Brief note about this campus activity or event..."
                      value={galleryDescription}
                      onChange={(e) => setGalleryDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={galleryLoading || galleryUploading}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 font-bold py-3 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {galleryLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publish Activity to College Gallery & Student App</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Gallery Activities List & Category Filter */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>Uploaded College Activities & Media ({galleryItems.length})</span>
                  </h3>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                    {['ALL', 'CULTURAL', 'SPORTS', 'TECH', 'HOSTEL_LIFE', 'VIDEOS'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGalleryFilter(cat)}
                        className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                          galleryFilter === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-400 hover:text-white border border-slate-200/80'
                        }`}
                      >
                        {cat === 'VIDEOS' ? '🎬 Videos' : cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryItems
                    .filter((item) => {
                      if (galleryFilter === 'ALL') return true;
                      if (galleryFilter === 'VIDEOS') return item.mediaType === 'VIDEO';
                      return item.category === galleryFilter;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl overflow-hidden shadow-xl hover:border-slate-200 transition flex flex-col justify-between group"
                      >
                        {/* Media Thumbnail or Video */}
                        <div className="relative aspect-video bg-black/50 overflow-hidden">
                          {item.mediaType === 'VIDEO' ? (
                            <video
                              src={item.mediaUrl}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          )}

                          {/* Media Type Badge */}
                          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                item.mediaType === 'VIDEO'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              {item.mediaType === 'VIDEO' ? '▶ Video' : '📷 Photo'}
                            </span>
                            {item.isPinned && (
                              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                                ★ Pinned
                              </span>
                            )}
                          </div>

                          {/* Play overlay for video */}
                          {item.mediaType === 'VIDEO' && (
                            <div
                              onClick={() => setPreviewMediaModal(item)}
                              className="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center cursor-pointer transition"
                            >
                              <div className="w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110">
                                <Play className="w-5 h-5 ml-0.5 fill-current" />
                              </div>
                            </div>
                          )}

                          <span className="absolute bottom-2 right-2 bg-white/80 text-[10px] text-slate-700 font-mono px-2 py-0.5 rounded-md backdrop-blur-md">
                            {item.eventDate}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                {item.category.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-rose-400 font-bold flex items-center space-x-1">
                                <Heart className="w-3 h-3 fill-current" />
                                <span>{item.likesCount || 0} cheers</span>
                              </span>
                            </div>

                            <h4 className="font-extrabold text-sm text-white leading-snug">{item.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {item.description || 'Campus activity highlight.'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                            <button
                              onClick={() => setPreviewMediaModal(item)}
                              className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>View Full Media</span>
                            </button>

                            <button
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              title="Delete Activity"
                              className="text-slate-500 hover:text-red-400 p-1 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: COLLEGE CALENDAR & ACADEMIC SCHEDULER                  */}
          {/* ============================================================== */}
          {activeSection === 'CALENDAR' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                      <CalendarIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>Academic & Institutional Timeline</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">
                      {at.calendarTitle}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xl">
                      {at.calendarSubtitle}
                    </p>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-3 gap-2 text-center shrink-0">
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{at.totalEvents}</span>
                      <strong className="text-lg font-black text-white">{calendarEvents.length}</strong>
                    </div>
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-rose-400 uppercase font-bold block">Exams</span>
                      <strong className="text-lg font-black text-rose-400">
                        {calendarEvents.filter(e => e.eventType === 'EXAM').length}
                      </strong>
                    </div>
                    <div className="bg-white/80 p-3 rounded-2xl border border-slate-200/80">
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">Holidays</span>
                      <strong className="text-lg font-black text-emerald-400">
                        {calendarEvents.filter(e => e.isHoliday).length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule New Event Card */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80/80 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <CalendarIcon className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Schedule New College Event / Exam</h3>
                      <p className="text-[11px] text-slate-400">Broadcasts to all resident student schedules</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold px-2 py-0.5 rounded-full">
                    Auto-Sync Active
                  </span>
                </div>

                {calendarSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{calendarSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateCalendarEvent} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-slate-700 font-bold block mb-1">Event Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mid-Term Examination Week (All Engineering Depts)"
                        value={calTitle}
                        onChange={(e) => setCalTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Event Type *</label>
                      <select
                        value={calEventType}
                        onChange={(e) => setCalEventType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="EXAM">Examination & Tests</option>
                        <option value="HOLIDAY">Campus Holiday / Vacation</option>
                        <option value="CULTURAL">Cultural Fest & Hackathons</option>
                        <option value="SPORTS">Sports & Leagues</option>
                        <option value="HOSTEL">Hostel Council & Committee Meetings</option>
                        <option value="ACADEMIC">Academic / Convocation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={calStartDate}
                        onChange={(e) => setCalStartDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">End Date</label>
                      <input
                        type="date"
                        value={calEndDate}
                        onChange={(e) => setCalEndDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1">Venue / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Exam Hall 101 or Main Ground"
                        value={calVenue}
                        onChange={(e) => setCalVenue(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isHoliday"
                        checked={calIsHoliday}
                        onChange={(e) => setCalIsHoliday(e.target.checked)}
                        className="rounded text-emerald-600 bg-slate-50"
                      />
                      <label htmlFor="isHoliday" className="text-slate-700 font-semibold cursor-pointer">
                        Official Campus Holiday (Classes & Labs Suspended)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isMandatory"
                        checked={calIsMandatory}
                        onChange={(e) => setCalIsMandatory(e.target.checked)}
                        className="rounded text-purple-600 bg-slate-50"
                      />
                      <label htmlFor="isMandatory" className="text-slate-700 font-semibold cursor-pointer">
                        Mandatory Student Attendance
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-700 font-bold block mb-1">Instructions / Description</label>
                    <textarea
                      rows={2}
                      placeholder="Guidelines, turnstile timing exceptions, or dress code for students..."
                      value={calDescription}
                      onChange={(e) => setCalDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={calendarLoading}
                    className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-slate-900 font-bold py-3 rounded-2xl shadow-xl shadow-purple-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {calendarLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CalendarIcon className="w-4 h-4" />
                        <span>Schedule Event & Broadcast to Student Calendars</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Calendar Timeline & Events List */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                    <span>Scheduled Institutional Events ({calendarEvents.length})</span>
                  </h3>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                    {['ALL', 'EXAM', 'HOLIDAY', 'CULTURAL', 'SPORTS', 'HOSTEL'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCalendarFilter(cat)}
                        className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                          calendarFilter === cat
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-slate-400 hover:text-white border border-slate-200/80'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Events' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Events List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {calendarEvents
                    .filter((ev) => calendarFilter === 'ALL' || ev.eventType === calendarFilter)
                    .map((ev) => {
                      const typeColors: Record<string, { bg: string; text: string; border: string }> = {
                        EXAM: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
                        HOLIDAY: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
                        CULTURAL: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
                        SPORTS: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
                        HOSTEL: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
                        ACADEMIC: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' }
                      };
                      const colors = typeColors[ev.eventType] || typeColors.ACADEMIC;

                      const startObj = new Date(ev.startDate);
                      const monthName = startObj.toLocaleString('default', { month: 'short' });
                      const dayNumber = startObj.getDate();

                      return (
                        <div
                          key={ev.id}
                          className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-4.5 shadow-xl hover:border-slate-200 transition flex items-start space-x-4"
                        >
                          {/* Big Date Badge */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center shrink-0 shadow-inner">
                            <span className="text-[10px] font-bold text-blue-400 uppercase leading-none">{monthName}</span>
                            <span className="text-xl font-black text-white leading-tight">{dayNumber}</span>
                          </div>

                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                                {ev.eventType}
                              </span>
                              {ev.isHoliday && (
                                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                  Holiday
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteCalendarEvent(ev.id)}
                                title="Remove Event"
                                className="text-slate-500 hover:text-red-400 p-1 cursor-pointer transition ml-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <h4 className="font-extrabold text-sm text-white leading-snug">{ev.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>

                            <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                              <span>📍 {ev.venue}</span>
                              {ev.endDate !== ev.startDate && <span>Ends: {ev.endDate}</span>}
                              <span className="text-slate-500 font-mono text-[10px]">By: {ev.scheduledBy}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: CHIEF WARDEN & MANAGER PROFILE COMMAND DESK            */}
          {/* ============================================================== */}
          {(activeSection as string) === '__OLD_MANAGER_PROFILE' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-teal-900/40 border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Executive Command Desk</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white">
                      {at.mgrDeskTitle}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xl">
                      {at.mgrDeskSubtitle}
                    </p>
                  </div>

                  <button
                    onClick={() => setEditManagerModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-slate-900 font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition cursor-pointer self-start md:self-auto shrink-0"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{at.mgrEditBtn}</span>
                  </button>
                </div>
              </div>

              {/* Manager Hero Profile Card */}
              <div className="bg-white border border-slate-200/80 shadow-2xs rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80/80">
                  <div className="flex items-center space-x-5">
                    {/* Photo with direct upload hover */}
                    <div className="relative group shrink-0">
                      <img
                        src={managerProfile?.avatarUrl || mgrAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={managerProfile?.name || currentUser.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-3xl object-cover border-2 border-blue-500/60 shadow-2xl group-hover:scale-105 transition"
                      />
                      <button
                        onClick={() => setEditManagerModalOpen(true)}
                        className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl shadow-lg border-2 border-slate-950 transition cursor-pointer"
                        title="Change Manager Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2.5">
                        <h3 className="text-xl md:text-2xl font-black text-white">
                          {managerProfile?.name || currentUser.name}
                        </h3>
                        <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Official Controller</span>
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-blue-400">
                        {managerProfile?.designation || 'Chief Hostel Warden & Administrative Controller'}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="bg-slate-50 border border-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl">
                          🏛️ {currentUser.tenantName}
                        </span>
                        <span className="bg-slate-50 border border-slate-200/80 text-slate-700 px-2.5 py-1 rounded-xl">
                          🏢 Code: <strong className="text-white font-mono">{currentUser.tenantCode}</strong>
                        </span>
                        <span className={`px-2.5 py-1 rounded-xl font-bold flex items-center space-x-1.5 ${
                          (managerProfile?.status || mgrStatus) === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            (managerProfile?.status || mgrStatus) === 'AVAILABLE' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                          }`} />
                          <span>Status: {(managerProfile?.status || mgrStatus).replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setEditManagerModalOpen(true)}
                      className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-slate-900 font-bold rounded-xl text-xs shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Update Photo & Details</span>
                    </button>
                  </div>
                </div>

                {/* Desk Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Office Room & Visiting Timings
                    </span>
                    <div className="space-y-1 text-slate-800">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-blue-400 shrink-0" />
                        <strong>{managerProfile?.officeRoom || 'Administrative Block A, Ground Floor, Office G-04'}</strong>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-700">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{managerProfile?.visitingHours || 'Mon – Fri: 4:30 PM – 7:00 PM | Sat: 10:30 AM – 1:30 PM'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Direct Contact & Emergency Line
                    </span>
                    <div className="space-y-1 text-slate-800">
                      <div className="flex items-center space-x-2">
                        <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                        <strong>{managerProfile?.phone || currentUser.phone || '+91 98765 43210'}</strong>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-700">
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>Direct Line: {managerProfile?.emergencyDirectLine || '+91 98765 00000 (Ext 104)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Announcement Broadcast Note */}
                <div className="p-4 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-blue-300 font-bold">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Live Student Announcement from Chief Warden:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-5 font-medium">
                    "{managerProfile?.announcement || 'Hostel Controller Desk is actively open for resident support, medical assistance, and room amenities.'}"
                  </p>
                  <p className="text-[10px] text-slate-500 pl-5">
                    Broadcast automatically to every student resident screen upon saving.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: STUDENT ADMISSION VERIFICATION & APPROVAL QUEUE       */}
      {/* ============================================================== */}
      {pendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Campus Account Approvals Queue</h3>
                  <p className="text-xs text-slate-500">
                    College Code: <strong className="text-slate-800 font-mono">{currentUser.tenantCode}</strong> • {pendingStudents.length + pendingStaff.length} Total Pending
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPendingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab switch between Staff and Students */}
            <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-2">
              <button
                type="button"
                onClick={() => setPendingTab('STAFF')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  pendingTab === 'STAFF'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Staff Applications ({pendingStaff.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setPendingTab('STUDENTS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  pendingTab === 'STUDENTS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Admissions ({pendingStudents.length})</span>
              </button>
            </div>

            {/* TAB 1: STAFF APPLICATIONS */}
            {pendingTab === 'STAFF' && (
              pendingStaff.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Staff Verification Queue Clear</h4>
                  <p className="text-xs text-slate-500">All registered faculty and staff have been reviewed and approved.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingStaff.map((stf) => (
                    <div key={stf.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-900 text-sm">{stf.name}</h4>
                            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full">
                              {stf.category || 'Faculty'}
                            </span>
                            <span className="text-xs text-slate-400">• {stf.designation}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{stf.email} • {stf.phone || 'No phone'}</p>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded font-semibold">
                          {stf.department || 'Academic'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Applied: {stf.date || 'Today'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleRejectStaff(stf.id)}
                            className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveStaff(stf.id)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition flex items-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Activate Account</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* TAB 2: STUDENT ADMISSIONS */}
            {pendingTab === 'STUDENTS' && (
              pendingStudents.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Admission Queue is All Clear!</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No pending student registration requests for {currentUser.tenantName}. When any student registers on the app, their request will appear here instantly!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStudents.map((s) => (
                  <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{s.name}</h4>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                            Pending Warden Review
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{s.email} • {s.phone || 'No phone'}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded">
                        Roll: {s.residentProfile?.studentId || 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-slate-500 block">Course</span>
                        <strong className="text-slate-800">{s.residentProfile?.course || 'B.Tech'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Requested Room</span>
                        <strong className="text-slate-800">{s.residentProfile?.roomNumber || '101'} ({s.residentProfile?.blockName || 'Block A'})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Guardian</span>
                        <strong className="text-slate-800">{s.residentProfile?.parentName || 'Parent'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Guardian Phone</span>
                        <strong className="text-slate-800">{s.residentProfile?.parentPhone || 'N/A'}</strong>
                      </div>
                    </div>

                    {showRejectBox === s.id ? (
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <label className="text-[11px] text-rose-400 font-semibold block">Reason for declining registration:</label>
                        <input
                          type="text"
                          value={rejectReasonInput}
                          onChange={(e) => setRejectReasonInput(e.target.value)}
                          placeholder="e.g. Roll number not found in college ERP or block full."
                          className="w-full bg-slate-50 border border-rose-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRejectStudent(s.id, rejectReasonInput)}
                            className="bg-rose-600 hover:bg-rose-500 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs"
                          >
                            Confirm Reject
                          </button>
                          <button
                            onClick={() => setShowRejectBox(null)}
                            className="bg-slate-800 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500">
                          Registered: {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowRejectBox(s.id)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-200/80 rounded-xl text-xs font-bold transition"
                          >
                            Decline
                          </button>
                          <button
                            disabled={approvalLoading}
                            onClick={() => handleApproveStudent(s.id, s.residentProfile?.roomNumber, s.residentProfile?.blockName)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/25 flex items-center space-x-1.5 transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Admit Student</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: QUICK NOTICE & SIREN DISPATCH                         */}
      {/* ============================================================== */}
      {quickNoticeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <Bell className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Broadcast Notice to All Resident Phones</h3>
              </div>
              <button
                onClick={() => setQuickNoticeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Hostel Floor Meeting Tonight at 8 PM"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ACADEMIC">Academic & Exams</option>
                  <option value="MAINTENANCE">Maintenance / Water / Electricity</option>
                  <option value="EVENT">Cultural & Sports Events</option>
                  <option value="EMERGENCY">Emergency Security Advisory</option>
                  <option value="GENERAL">General Hostel Rules</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Detailed Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the announcement details here..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">
                <input
                  type="checkbox"
                  id="urgentNotice"
                  checked={newNoticeIsEmergency}
                  onChange={(e) => setNewNoticeIsEmergency(e.target.checked)}
                  className="rounded text-red-500"
                />
                <label htmlFor="urgentNotice" className="cursor-pointer text-[11px] font-semibold">
                  Trigger high-priority audio alert badge on student devices
                </label>
              </div>

              <button
                type="submit"
                disabled={noticePublishLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-slate-900 font-bold py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{noticePublishLoading ? 'Broadcasting...' : 'Publish & Broadcast Live'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: TODAY'S MESS MENU EDITOR                              */}
      {/* ============================================================== */}
      {editMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <Utensils className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Update Today's Mess Menu</h3>
                  <p className="text-[11px] text-slate-400">Broadcasts immediately to all resident student phones</p>
                </div>
              </div>
              <button
                onClick={() => setEditMenuModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {menuSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{menuSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateTodayMenu} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Breakfast Menu</label>
                <input
                  type="text"
                  required
                  value={menuForm.breakfast}
                  onChange={(e) => setMenuForm({ ...menuForm, breakfast: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Lunch Menu</label>
                <input
                  type="text"
                  required
                  value={menuForm.lunch}
                  onChange={(e) => setMenuForm({ ...menuForm, lunch: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Evening Snacks</label>
                <input
                  type="text"
                  required
                  value={menuForm.snacks}
                  onChange={(e) => setMenuForm({ ...menuForm, snacks: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Dinner Menu</label>
                <input
                  type="text"
                  required
                  value={menuForm.dinner}
                  onChange={(e) => setMenuForm({ ...menuForm, dinner: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Special Festival / Gala Feast (Optional)</span>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Festival Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Diwali Grand Feast or Sunday Gala Banquet"
                    value={menuForm.festivalTitle}
                    onChange={(e) => setMenuForm({ ...menuForm, festivalTitle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Festival Dinner Items</label>
                  <input
                    type="text"
                    placeholder="e.g. Paneer Lababdar, Live Jalebi Counter, Butter Naan"
                    value={menuForm.festivalDinner}
                    onChange={(e) => setMenuForm({ ...menuForm, festivalDinner: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={menuLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-slate-900 font-bold py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition flex items-center justify-center space-x-1.5"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>{menuLoading ? 'Updating...' : 'Save & Broadcast Menu Live to Students'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 4: WHATSAPP-STYLE READ RECEIPTS VIEWER MODAL             */}
      {/* ============================================================== */}
      {receiptsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Targeted Broadcast Read Receipts</h3>
                  <p className="text-xs text-slate-400">
                    Real-time WhatsApp-style read tracking & unread student room roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReceiptsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {receiptsLoading ? (
              <div className="text-center py-12 space-y-2">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Fetching live student delivery confirmations...</p>
              </div>
            ) : selectedNoticeReceipts ? (
              <div className="space-y-4">
                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Target</span>
                    <strong className="text-white text-lg">{selectedNoticeReceipts.totalAudience || 150}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-blue-400 uppercase block">Read Count</span>
                    <strong className="text-blue-400 text-lg">{selectedNoticeReceipts.readCount || 84}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Acknowledged</span>
                    <strong className="text-emerald-400 text-lg">{selectedNoticeReceipts.acknowledgedCount || 62}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-purple-400 uppercase block">Read %</span>
                    <strong className="text-purple-400 text-lg">{selectedNoticeReceipts.readPercentage || 56}%</strong>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-slate-200/80">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                    style={{ width: `${selectedNoticeReceipts.readPercentage || 56}%` }}
                  />
                </div>

                {/* Read List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Students Who Have Read This Notice ({selectedNoticeReceipts.readBy?.length || 0})</span>
                  </h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto bg-white p-3 rounded-2xl border border-slate-200/80">
                    {selectedNoticeReceipts.readBy && selectedNoticeReceipts.readBy.length > 0 ? (
                      selectedNoticeReceipts.readBy.map((r: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-none">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-400 font-bold">✓✓</span>
                            <span className="text-white font-medium">{r.userName}</span>
                            <span className="text-slate-500 font-mono text-[10px]">({r.studentId})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px]">
                            {r.acknowledged && (
                              <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                Acknowledged
                              </span>
                            )}
                            <span className="text-slate-500">{new Date(r.readAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2">No read receipts logged yet.</p>
                    )}
                  </div>
                </div>

                {/* Unread Students Follow-up Roster */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unread Student Rooms (Warden Follow-up Roster)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
                    {selectedNoticeReceipts.unreadStudents && selectedNoticeReceipts.unreadStudents.length > 0 ? (
                      selectedNoticeReceipts.unreadStudents.map((u: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-[11px]">
                          <div>
                            <strong className="text-white block truncate">{u.userName}</strong>
                            <span className="text-slate-400 text-[10px]">Roll: {u.studentId}</span>
                          </div>
                          <span className="bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            Room {u.room}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-400 col-span-2 text-center py-2">✓ 100% of students have acknowledged this circular!</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: EDIT MANAGER / CHIEF WARDEN PROFILE & PHOTO          */}
      {/* ============================================================== */}
      {editManagerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Manager Profile & Photo</h3>
                  <p className="text-[11px] text-slate-400">Updates live across all student resident screens</p>
                </div>
              </div>
              <button
                onClick={() => setEditManagerModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {mgrSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center space-x-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{mgrSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveManagerProfile} className="space-y-4 text-xs">
              {/* Photo Upload Section */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center space-x-4">
                <div className="relative shrink-0">
                  <img
                    src={mgrAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Manager Avatar Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/60 shadow-lg"
                  />
                  {mgrUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-slate-700 font-bold block">Manager Profile Photo</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition flex items-center space-x-1.5 shadow">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{mgrUploadingPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleManagerPhotoUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste photo URL here..."
                    value={mgrAvatarUrl}
                    onChange={(e) => setMgrAvatarUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 text-[10px] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Manager Full Name *</label>
                  <input
                    type="text"
                    required
                    value={mgrName}
                    onChange={(e) => setMgrName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Official Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Hostel Warden"
                    value={mgrDesignation}
                    onChange={(e) => setMgrDesignation(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={mgrEmail}
                    onChange={(e) => setMgrEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={mgrPhone}
                    onChange={(e) => setMgrPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Office Room & Wing</label>
                  <input
                    type="text"
                    placeholder="e.g. Admin Block A, Ground Floor, G-04"
                    value={mgrOfficeRoom}
                    onChange={(e) => setMgrOfficeRoom(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Visiting Hours for Students</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon - Fri: 4:30 PM - 7:00 PM"
                    value={mgrVisitingHours}
                    onChange={(e) => setMgrVisitingHours(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Emergency Direct Line / Extension</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000 (Ext 104)"
                    value={mgrEmergencyLine}
                    onChange={(e) => setMgrEmergencyLine(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Active Status</label>
                  <select
                    value={mgrStatus}
                    onChange={(e) => setMgrStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="AVAILABLE">Available in Office (Green)</option>
                    <option value="ON_CAMPUS_ROUNDS">On Campus Rounds (Blue)</option>
                    <option value="IN_MEETING">In Committee Meeting (Amber)</option>
                    <option value="OFF_DUTY">Off Duty / Evening Hours (Slate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Student Broadcast Notice / Welcome Message</label>
                <textarea
                  rows={2}
                  value={mgrAnnouncement}
                  onChange={(e) => setMgrAnnouncement(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={managerSaving}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 font-bold py-3 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {managerSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Broadcast Profile Live to All Student Phones</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: GALLERY MEDIA LIGHTBOX & VIDEO PLAYER                */}
      {/* ============================================================== */}
      {previewMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl max-w-3xl w-full p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center space-x-2 truncate">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-blue-600 text-white">
                  {previewMediaModal.category}
                </span>
                <h3 className="text-sm font-bold text-white truncate">{previewMediaModal.title}</h3>
              </div>
              <button
                onClick={() => setPreviewMediaModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Media Player / Image Display */}
            <div className="bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {previewMediaModal.mediaType === 'VIDEO' ? (
                <video
                  src={previewMediaModal.mediaUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[60vh] object-contain"
                />
              ) : (
                <img
                  src={previewMediaModal.mediaUrl}
                  alt={previewMediaModal.title}
                  className="w-full max-h-[60vh] object-contain"
                />
              )}
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-700 leading-relaxed">{previewMediaModal.description}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/80">
                <span>📅 Event Date: {previewMediaModal.eventDate}</span>
                <span className="text-rose-400 font-bold">❤️ {previewMediaModal.likesCount || 0} student cheers</span>
                <span className="font-mono text-slate-500">Uploaded by: {previewMediaModal.uploadedBy}</span>
              </div>
            </div>

            <button
              onClick={() => setPreviewMediaModal(null)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close Media
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

