'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  HeartPulse,
  Wrench,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  Car,
  Users,
  QrCode,
  Calendar,
  PhoneCall,
  Bell,
  Utensils,
  CreditCard,
  MessageSquare,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Star,
  Check,
  Send,
  HelpCircle,
  Building,
  UserCheck,
  Layers,
  FileText,
  Activity,
  ArrowRight,
  LogOut,
  Plus,
  RefreshCw,
  Camera,
  Mic,
  MicOff,
  Trash2,
  Video,
  Edit3,
  GraduationCap,
  Shield,
  Coffee,
  Sun,
  Moon,
  CheckCircle,
  Download,
  Smartphone,
  WifiOff,
  Play,
  Heart,
  Lock,
  Mail,
  User,
  UserPlus,
  Phone,
  ShieldCheck,
  Headphones,
  Newspaper,
  Bed,
  Eye,
  EyeOff
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import io from 'socket.io-client';
import { Language, getResidentTranslation } from '../lib/i18n';
import { playCuteNotificationSound, playCuteSuccessSound } from '../lib/audioSound';

const API_BASE = '/api';
const SOCKET_URL = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';

// 8 Rich Complaint Categories with Colors, Icons, and SLA
const COMPLAINT_CATEGORIES = [
  {
    key: 'WATER',
    label: 'Water Supply',
    sub: 'Taps, Geyser, RO',
    sla: '4h SLA',
    icon: Droplets,
    color: 'text-blue-500'
  },
  {
    key: 'ELECTRICITY',
    label: 'Electricity',
    sub: 'AC, Fan, Power',
    sla: '4h SLA',
    icon: Zap,
    color: 'text-amber-500'
  },
  {
    key: 'WIFI',
    label: 'Wi-Fi & Net',
    sub: 'LAN, Router, Speed',
    sla: '6h SLA',
    icon: Wifi,
    color: 'text-sky-500'
  },
  {
    key: 'CLEANLINESS',
    label: 'Cleanliness',
    sub: 'Room, Washroom',
    sla: '8h SLA',
    icon: Sparkles,
    color: 'text-emerald-500'
  },
  {
    key: 'SECURITY',
    label: 'Security',
    sub: 'Locks, Entry, Safety',
    sla: '1h SLA',
    icon: ShieldAlert,
    color: 'text-rose-500'
  },
  {
    key: 'MESS_CANTEEN',
    label: 'Mess & Food',
    sub: 'Food quality, Hygiene',
    sla: '4h SLA',
    icon: Utensils,
    color: 'text-orange-500'
  },
  {
    key: 'FURNITURE',
    label: 'Furniture',
    sub: 'Desk, Bed, Almirah',
    sla: '48h SLA',
    icon: Wrench,
    color: 'text-indigo-500'
  },
  {
    key: 'OTHER',
    label: 'Other Issue',
    sub: 'General, Roommate',
    sla: '24h SLA',
    icon: HelpCircle,
    color: 'text-purple-500'
  }
];

// Preset quick issue templates per category
const CATEGORY_PRESETS: Record<string, string[]> = {
  WATER: [
    'Washroom tap leaking continuously',
    'Geyser not heating water',
    'Low water pressure in shower',
    'Water cooler filter on floor 2 empty'
  ],
  ELECTRICITY: [
    'Power tripping in room sockets',
    'Ceiling fan making loud squeaking noise',
    'Tube light flickering / blown out',
    'Air Conditioner not cooling'
  ],
  WIFI: [
    'Hostel Wi-Fi router down in corridor',
    'Frequent disconnection during online lectures',
    'LAN port near study desk damaged',
    'High latency / ping issues'
  ],
  CLEANLINESS: [
    'Room sweeping & mopping requested',
    'Floor corridor dustbin overflowing',
    'Common washroom deep cleaning required',
    'Window pane cleaning required'
  ],
  SECURITY: [
    'Room door lock latch loose / jammed',
    'Suspicious person spotted in corridor',
    'Lost laundry / bicycle from parking',
    'Turnstile gate biometric scanner glitch'
  ],
  MESS_CANTEEN: [
    'Food served lukewarm / cold',
    'Cutlery / trays need better wash hygiene',
    'Shortage of chapatis during peak dinner hours',
    'Quality feedback on today lunch vegetables'
  ],
  FURNITURE: [
    'Study chair wheel broken / unstable',
    'Wardrobe door hinge loose',
    'Study desk drawer jammed',
    'Bed frame plywood slat replacement needed'
  ],
  OTHER: [
    'Loud noise / disturbance after 11 PM',
    'Roommate conflict regarding sleep schedule',
    'Courier package delivered to security gate',
    'Hostel ID card re-issue request'
  ]
};

// Preset high quality cartoon student avatars for 1-click selection
const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Subham&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=SubhamPradhan&clothingColor=26a69a',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CampusCoder&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/micah/svg?seed=CampusStar&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappyStudent&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma&clothingColor=3c4f5e',
  'https://api.dicebear.com/7.x/open-peeps/svg?seed=ScholarMind&backgroundColor=ffdfbf'
];

interface ResidentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  room: string;
  block: string;
  avatar: string;
  tenantId: string;
  tenantName: string;
  tenantCode: string;
  token: string;
  status?: 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED';
  approvalNote?: string;
  studentId?: string;
  course?: string;
  year?: string;
  bloodGroup?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  dietaryPreference?: string;
  address?: string;
  residentProfile?: {
    studentId?: string;
    roomNumber?: string;
    blockName?: string;
  };
}


// Client-side image compressor: converts large camera photos into clean, optimized Base64
function compressImageFile(file: File, maxWidth = 320, maxHeight = 320, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Universal Direct File Uploader (Supports ANY photo and ANY video format directly via /api/upload)
async function uploadFileDirectly(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch (e) {
    console.warn('Direct server upload error, using local fallback:', e);
  }

  // Fallback: If image, compress; if video or other, return data URL
  if (file.type && file.type.startsWith('image/')) {
    try {
      return await compressImageFile(file, 640, 640, 0.85);
    } catch {
      // ignore
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ResidentApp() {
  // Navigation Tabs: 'HOME' | 'PASSES' | 'COMPLAINTS' | 'MENU' | 'GALLERY' | 'CALENDAR' | 'PROFILE'
  const [activeTab, setActiveTab] = useState<'HOME' | 'PASSES' | 'COMPLAINTS' | 'MENU' | 'GALLERY' | 'CALENDAR' | 'PROFILE'>('HOME');

  // Multi-Language State (English 'en' & Hindi 'hi')
  const [lang, setLang] = useState<Language>('en');
  const t = getResidentTranslation(lang);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_lang', nextLang);
    }
  };

  // Modals
  const [showSosModal, setShowSosModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<{ title: string; qrValue: string; subtitle: string } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Manager Profile State (with photo of manager)
  const [managerProfile, setManagerProfile] = useState<any>(null);

  // College Gallery State (activity, video, photo)
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryFilter, setGalleryFilter] = useState('ALL');
  const [previewMediaModal, setPreviewMediaModal] = useState<any>(null);

  // College Calendar State (events, exams, holidays)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [calendarFilter, setCalendarFilter] = useState('ALL');
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any>(null);

  // User State
  const [user, setUser] = useState<ResidentUser | null>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [authTab, setAuthTab] = useState<'LOGIN' | 'ENROLL'>('LOGIN');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Enroll form
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [collegeCodeInput, setCollegeCodeInput] = useState('APEX-2026');
  const [statusChecking, setStatusChecking] = useState(false);
  const [statusCheckMsg, setStatusCheckMsg] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentRoom, setStudentRoom] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  // Design enhancements: Role selector & visibility toggles
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'FACULTY' | 'STAFF'>('STUDENT');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // App Data
  const [complaints, setComplaints] = useState<any[]>([]);
  const [passes, setPasses] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any>(null);
  const [selectedMenuDay, setSelectedMenuDay] = useState<string>('TODAY');
  const [bills, setBills] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [isEatingBreakfast, setIsEatingBreakfast] = useState(true);
  const [isEatingLunch, setIsEatingLunch] = useState(true);
  const [isEatingDinner, setIsEatingDinner] = useState(true);
  const [mealRating, setMealRating] = useState(5);
  const [mealFeedbackMsg, setMealFeedbackMsg] = useState('');
  const [mealRatedSuccess, setMealRatedSuccess] = useState(false);
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('B+');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editEmergencyContact, setEditEmergencyContact] = useState('');
  const [editDietaryPreference, setEditDietaryPreference] = useState('Vegetarian');
  const [editAddress, setEditAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Complaint Creation Form State
  const [selectedComplaintCategory, setSelectedComplaintCategory] = useState('WATER');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [isAnonymousComplaint, setIsAnonymousComplaint] = useState(false);
  const [complaintPhotoUrl, setComplaintPhotoUrl] = useState<string | null>(null);
  const [complaintVideoUrl, setComplaintVideoUrl] = useState<string | null>(null);
  const [complaintVideoName, setComplaintVideoName] = useState<string | null>(null);
  const [complaintVoiceUrl, setComplaintVoiceUrl] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecordingSeconds, setVoiceRecordingSeconds] = useState(0);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  // Pass Form State
  const [passType, setPassType] = useState('GATE_PASS');
  const [passReason, setPassReason] = useState('Market visit & grocery');
  const [passDestination, setPassDestination] = useState('Sector 18 Market');
  const [passHours, setPassHours] = useState('2');

  // Visitor & Vehicle Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('');
  const [vehicleType, setVehicleType] = useState('TWO_WHEELER');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  // Rating & Suggestion Form State
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingText, setRatingText] = useState('');
  const [suggestionText, setSuggestionText] = useState('');

  // Hidden File Inputs
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const directCameraInputRef = useRef<HTMLInputElement>(null);
  const complaintPhotoInputRef = useRef<HTMLInputElement>(null);
  const complaintVideoInputRef = useRef<HTMLInputElement>(null);
  const voiceTimerRef = useRef<any>(null);

  // 2G / Low-Data Mode State (Sub-40KB, offline-first fallback)
  const [isLowDataMode, setIsLowDataMode] = useState(false);

  // Live Food-Delivery-Style Order Tracker Modal State
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [showOrderTrackerModal, setShowOrderTrackerModal] = useState(false);

  // Keypad SMS Gateway & Offline Numeric Pass Modal State
  const [showSmsFallbackModal, setShowSmsFallbackModal] = useState(false);
  const [smsTestInput, setSmsTestInput] = useState('PASS OUT 3HRS');
  const [smsTestLoading, setSmsTestLoading] = useState(false);
  const [smsTestReply, setSmsTestReply] = useState<any | null>(null);

  // WhatsApp-Style Notice Read & Acknowledgment State
  const [acknowledgedNotices, setAcknowledgedNotices] = useState<Record<string, boolean>>({});

  // PWA (Progressive Web App) Offline & Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineVaultStats, setOfflineVaultStats] = useState<{ cachedAt?: string; passCount?: number } | null>(null);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);

  // Trigger PWA installation prompt or instructions modal
  async function handleInstallApp() {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstallable(false);
          setIsAppInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (e) {
        console.error('PWA install prompt error:', e);
      }
    } else {
      setShowPwaInstallModal(true);
    }
  }

  // Acknowledge official broadcast notice
  async function handleAcknowledgeNotice(noticeId: string) {
    try {
      const res = await fetch(`${API_BASE}/notices/${noticeId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          studentId: user?.studentId || user?.residentProfile?.studentId || 'STU-2026',
          acknowledged: true
        })
      });
      if (res.ok) {
        setAcknowledgedNotices((prev) => ({ ...prev, [noticeId]: true }));
      }
    } catch (err) {
      console.error('Error acknowledging notice:', err);
    }
  }

  // Student SMS Simulator Action
  async function handleTestStudentSms() {
    if (!smsTestInput) return;
    setSmsTestLoading(true);
    try {
      const res = await fetch(`${API_BASE}/turnstile/sms-gateway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromPhone: user?.phone || '+91 98765 43210',
          messageText: smsTestInput
        })
      });
      const data = await res.json();
      setSmsTestReply(data);
      if (user?.token) fetchData(user.token, user.id);
    } catch (err) {
      console.error('Student SMS test error:', err);
    } finally {
      setSmsTestLoading(false);
    }
  }

  // 1. Initial Login & Multi-Tenant Enrollment Check
  useEffect(() => {
    async function init() {
      // 1. Fetch live registered colleges
      try {
        const colRes = await fetch(`${API_BASE}/auth/colleges`);
        if (colRes.ok) {
          const cols = await colRes.json();
          setColleges(cols);
          if (cols.length > 0) {
            setSelectedCollegeId(cols[0].id);
            if (cols[0].blocks && cols[0].blocks.length > 0) {
              setSelectedBlock(cols[0].blocks[0]);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch colleges:', e);
      }

      // 2. Hydrate from PWA Offline Vault (Passes, QR code, Menu) immediately
      try {
        const cachedVaultStr = localStorage.getItem('shms_offline_vault');
        if (cachedVaultStr) {
          const vault = JSON.parse(cachedVaultStr);
          if (vault.passes) setPasses(vault.passes);
          if (vault.complaints) setComplaints(vault.complaints);
          if (vault.menuData) setMenuData(vault.menuData);
          if (vault.notices) setNotices(vault.notices);
          setOfflineVaultStats({
            cachedAt: vault.cachedAt,
            passCount: vault.passes?.length || 0
          });
        }
      } catch (e) {
        console.warn('PWA offline vault hydration warning:', e);
      }

      // 2b. Restore user language preference
      try {
        const savedLang = localStorage.getItem('shms_lang') as Language;
        if (savedLang === 'en' || savedLang === 'hi') {
          setLang(savedLang);
        }
      } catch {}

      // 3. Check localStorage for active student session
      try {
        const savedUserStr = localStorage.getItem('shms_resident_user');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.token) {
            setUser(parsed);
            loadProfileIntoEditState(parsed);
            fetchData(parsed.token, parsed.id);
          }
        }
      } catch (e) {
        console.error('Resident session restore error:', e);
      }

      // 4. Fetch manager profile, gallery, and calendar for student app
      try {
        const [mgrRes, galRes, calRes] = await Promise.all([
          fetch(`${API_BASE}/manager-profile`),
          fetch(`${API_BASE}/gallery`),
          fetch(`${API_BASE}/calendar`)
        ]);
        if (mgrRes.ok) {
          const m = await mgrRes.json();
          setManagerProfile(m.profile || m);
        }
        if (galRes.ok) {
          const g = await galRes.json();
          if (g.items) setGalleryItems(g.items);
        }
        if (calRes.ok) {
          const c = await calRes.json();
          if (c.events) setCalendarEvents(c.events);
        }
      } catch (e) {
        console.warn('Initial data fetch warning:', e);
      }
    }
    init();

    // 3. Setup Socket.io for real-time siren, pass, admission approval, menu, gallery, calendar & manager profile updates
    const socket = io(SOCKET_URL);
    socket.on('emergency:triggered', (data) => {
      console.log('Real-time SOS Siren received:', data);
    });

    socket.on('student:approved', (approvedData) => {
      console.log('🎉 Student Admission Approved by Warden:', approvedData);
      setUser((curr) => {
        if (curr && (curr.id === approvedData.studentId || curr.email === approvedData.email)) {
          const updated: ResidentUser = {
            ...curr,
            status: 'ACTIVE',
            room: approvedData.roomNumber || curr.room,
            block: approvedData.block || curr.block,
            approvalNote: approvedData.notes
          };
          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
          if (updated.token && updated.id) {
            fetchData(updated.token, updated.id);
          }
          return updated;
        }
        return curr;
      });
    });

    socket.on('student:rejected', (data) => {
      console.log('Admission request declined by warden:', data);
      setUser((curr) => {
        if (curr && (curr.id === data.studentId || curr.email === data.email)) {
          const updated: ResidentUser = {
            ...curr,
            status: 'REJECTED',
            approvalNote: data.reason
          };
          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
          return updated;
        }
        return curr;
      });
    });

    socket.on('menu:updated', (payload) => {
      console.log('🍽️ Mess menu updated by warden:', payload);
      fetch(`${API_BASE}/menu`).then((r) => r.json()).then((d) => setMenuData(d));
    });

    socket.on('gallery:updated', () => {
      console.log('📸 College gallery updated by controller');
      fetch(`${API_BASE}/gallery`).then((r) => r.json()).then((d) => {
        if (d.items) setGalleryItems(d.items);
      }).catch(console.error);
    });

    socket.on('calendar:updated', () => {
      console.log('📅 College calendar updated by controller');
      fetch(`${API_BASE}/calendar`).then((r) => r.json()).then((d) => {
        if (d.events) setCalendarEvents(d.events);
      }).catch(console.error);
    });

    socket.on('manager:updated', (mgr) => {
      console.log('🛡️ Manager profile updated by controller:', mgr);
      if (mgr) setManagerProfile(mgr);
    });

    socket.on('notice:published', (notice) => {
      console.log('📢 New notice from warden:', notice);
      setNotices((prev) => [notice, ...prev]);
    });

    socket.on('pass:update', () => {
      if (user?.token && user?.id) fetchData(user.token, user.id);
    });
    socket.on('complaint:update', () => {
      if (user?.token && user?.id) fetchData(user.token, user.id);
    });

    // 4. Register PWA Offline-First Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 5. PWA Install Prompt & Online/Offline Network Detectors
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      socket.disconnect();
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Real-time verification status check for student waiting screen
  async function checkApprovalStatus() {
    if (!user) return;
    setStatusChecking(true);
    setStatusCheckMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/check-status?userId=${user.id}&email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ACTIVE') {
          const updated: ResidentUser = {
            ...user,
            status: 'ACTIVE',
            room: data.roomNumber || user.room,
            block: data.blockName || user.block,
            approvalNote: data.approvalNote
          };
          setUser(updated);
          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
          if (updated.token) {
            fetchData(updated.token, updated.id);
          }
        } else if (data.status === 'REJECTED') {
          const updated: ResidentUser = {
            ...user,
            status: 'REJECTED',
            approvalNote: data.approvalNote
          };
          setUser(updated);
          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
        } else {
          setStatusCheckMsg('Your request is still in queue awaiting Chief Warden review.');
          setTimeout(() => setStatusCheckMsg(''), 3500);
        }
      }
    } catch (err) {
      console.error('Check status error:', err);
    } finally {
      setStatusChecking(false);
    }
  }


  function loadProfileIntoEditState(u: ResidentUser) {
    setEditName(u.name || '');
    setEditPhone(u.phone || '');
    setEditAvatar(u.avatar || AVATAR_PRESETS[0]);
    setEditRoom(u.room || '101');
    setEditBlock(u.block || 'Block A');
    setEditCourse(u.course || 'B.Tech Computer Science');
    setEditYear(u.year || '3rd Year');
    setEditBloodGroup(u.bloodGroup || 'B+');
    setEditParentName(u.parentName || 'Rajesh Sharma');
    setEditParentPhone(u.parentPhone || '+91 98000 11111');
    setEditEmergencyContact(u.emergencyContact || '+91 98765 43210');
    setEditDietaryPreference(u.dietaryPreference || 'Vegetarian');
    setEditAddress(u.address || 'Flat 402, Green Avenue, Campus Town');
  }

  async function fetchData(token: string, residentId: string) {
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [cmpRes, passRes, notRes, menuRes, billRes, visRes, vehRes, pollRes, mgrRes, galRes, calRes] = await Promise.all([
        fetch(`${API_BASE}/complaints?residentId=${residentId}`, { headers }),
        fetch(`${API_BASE}/passes?residentId=${residentId}`, { headers }),
        fetch(`${API_BASE}/notices`),
        fetch(`${API_BASE}/menu`),
        fetch(`${API_BASE}/billing?residentId=${residentId}`, { headers }),
        fetch(`${API_BASE}/visitors?residentId=${residentId}`, { headers }),
        fetch(`${API_BASE}/vehicles?residentId=${residentId}`, { headers }),
        fetch(`${API_BASE}/notices/polls`, { headers }),
        fetch(`${API_BASE}/manager-profile`),
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/calendar`)
      ]);

      const freshComplaints = cmpRes.ok ? await cmpRes.json() : [];
      const freshPasses = passRes.ok ? await passRes.json() : [];
      const freshNotices = notRes.ok ? await notRes.json() : [];
      const freshMenu = menuRes.ok ? await menuRes.json() : null;

      if (cmpRes.ok) setComplaints(freshComplaints);
      if (passRes.ok) setPasses(freshPasses);
      if (notRes.ok) setNotices(freshNotices);
      if (menuRes.ok) setMenuData(freshMenu);
      if (billRes.ok) setBills(await billRes.json());
      if (visRes.ok) setVisitors(await visRes.json());
      if (vehRes.ok) setVehicles(await vehRes.json());
      if (pollRes.ok) setPolls(await pollRes.json());
      if (mgrRes.ok) {
        const m = await mgrRes.json();
        setManagerProfile(m.profile || m);
      }
      if (galRes.ok) {
        const galData = await galRes.json();
        if (galData.items) setGalleryItems(galData.items);
      }
      if (calRes.ok) {
        const calData = await calRes.json();
        if (calData.events) setCalendarEvents(calData.events);
      }

      // Save to PWA Offline Vault for instant zero-network access
      if (typeof window !== 'undefined') {
        const vaultPayload = {
          passes: freshPasses,
          complaints: freshComplaints,
          notices: freshNotices,
          menuData: freshMenu,
          cachedAt: new Date().toISOString()
        };
        localStorage.setItem('shms_offline_vault', JSON.stringify(vaultPayload));
        setOfflineVaultStats({
          cachedAt: vaultPayload.cachedAt,
          passCount: freshPasses.length
        });
      }
    } catch (err) {
      console.warn('[PWA] Network offline / unreachable, restoring from Offline Vault:', err);
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('shms_offline_vault');
          if (cached) {
            const vault = JSON.parse(cached);
            if (vault.passes) setPasses(vault.passes);
            if (vault.complaints) setComplaints(vault.complaints);
            if (vault.notices) setNotices(vault.notices);
            if (vault.menuData) setMenuData(vault.menuData);
            setOfflineVaultStats({
              cachedAt: vault.cachedAt,
              passCount: vault.passes?.length || 0
            });
          }
        } catch (e) {
          console.error('Failed to restore from offline vault:', e);
        }
      }
    }
  }

  async function handleLikeGalleryItem(id: string) {
    try {
      const res = await fetch(`${API_BASE}/gallery/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGalleryItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, likes: data.likes ?? data.likesCount, likesCount: data.likesCount ?? data.likes }
              : item
          )
        );
      }
    } catch (e) {
      console.error('Failed to like gallery activity:', e);
    }
  }

  // Student Login Handler
  async function handleLogin(email: string) {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: loginPassword || 'student123' })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Authentication failed');
        setLoginLoading(false);
        return;
      }

      const p = data.user.residentProfile;
      const residentObj: ResidentUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '+91 99000 00000',
        room: p?.roomNumber || '101',
        block: p?.blockName || 'Block A',
        avatar: data.user.avatarUrl || AVATAR_PRESETS[0],
        tenantId: data.user.tenantId,
        tenantName: data.user.tenantName || 'Campus Residence',
        tenantCode: data.user.tenantCode || 'CAMPUS',
        token: data.token,
        status: data.user.status || 'ACTIVE',
        approvalNote: p?.approvalNote || null,
        studentId: p?.studentId || 'STU-2026-089',
        course: p?.course || 'B.Tech Computer Science',
        year: p?.year || '3rd Year',
        bloodGroup: p?.bloodGroup || 'B+',
        parentName: p?.parentName || 'Rajesh Sharma',
        parentPhone: p?.parentPhone || '+91 98000 11111',
        emergencyContact: p?.emergencyContact || '+91 98765 43210',
        dietaryPreference: 'Vegetarian',
        address: 'Hostel Residency Block, Campus Town'
      };

      setUser(residentObj);
      loadProfileIntoEditState(residentObj);
      localStorage.setItem('shms_resident_user', JSON.stringify(residentObj));
      if (residentObj.status === 'ACTIVE') {
        fetchData(data.token, data.user.id);
      }
    } catch (err) {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  }

  // Student Enrollment Handler
  async function handleEnrollStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName || !studentEmail) {
      setEnrollError('Full Name and Email Address are required');
      return;
    }
    if (confirmPassword && studentPassword && confirmPassword !== studentPassword) {
      setEnrollError('Passwords do not match. Please verify your password.');
      return;
    }
    setEnrollLoading(true);
    setEnrollError('');
    try {
      const activeCode = collegeCodeInput?.trim() || (colleges.length > 0 ? colleges[0].code : 'APEX-2026');
      const matchingCollege = colleges.find((c) =>
        c.code?.toLowerCase() === activeCode.toLowerCase() ||
        c.id === selectedCollegeId
      ) || (colleges.length > 0 ? colleges[0] : null);
      const collegeIdToUse = matchingCollege ? matchingCollege.id : selectedCollegeId;

      const res = await fetch(`${API_BASE}/auth/register-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId: collegeIdToUse,
          collegeCode: activeCode || matchingCollege?.code,
          name: studentName,
          email: studentEmail,
          password: studentPassword || 'student123',
          phone: studentPhone || '+91 99000 00000',
          studentId: studentRoll || `STU-${Date.now().toString().slice(-4)}`,
          roomNumber: studentRoom || '101',
          blockName: selectedBlock || 'Block A',
          course: course || (selectedRole === 'FACULTY' ? 'Faculty Member' : selectedRole === 'STAFF' ? 'Administrative Staff' : 'B.Tech Engineering'),
          parentName: parentName || 'Campus Administration',
          parentPhone: parentPhone || '+91 98000 11111'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setEnrollError(data.error || 'Enrollment failed');
        setEnrollLoading(false);
        return;
      }
      const p = data.user.residentProfile;
      const residentObj: ResidentUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '+91 99000 00000',
        room: p?.roomNumber || studentRoom || '101',
        block: p?.blockName || selectedBlock || 'Block A',
        avatar: data.user.avatarUrl || AVATAR_PRESETS[1],
        tenantId: data.user.tenantId,
        tenantName: data.user.tenantName || matchingCollege?.name || 'Campus Residence',
        tenantCode: data.user.tenantCode || collegeCodeInput || 'CAMPUS',
        token: data.token,
        status: data.user.status || 'PENDING_APPROVAL',
        approvalNote: p?.approvalNote || null,
        studentId: p?.studentId || studentRoll || 'STU-2026-089',
        course: p?.course || course || 'B.Tech Computer Science',
        year: p?.year || '1st Year',
        bloodGroup: p?.bloodGroup || 'O+',
        parentName: p?.parentName || parentName || 'Parent / Guardian',
        parentPhone: p?.parentPhone || parentPhone || '+91 98000 11111',
        emergencyContact: parentPhone || '+91 98765 43210',
        dietaryPreference: 'Vegetarian',
        address: 'Campus Hostel Residence'
      };
      setUser(residentObj);
      loadProfileIntoEditState(residentObj);
      localStorage.setItem('shms_resident_user', JSON.stringify(residentObj));
      if (residentObj.status === 'ACTIVE') {
        fetchData(data.token, data.user.id);
      }
    } catch (err) {
      setEnrollError('Failed to connect to enrollment server');
    } finally {
      setEnrollLoading(false);
    }
  }


  // Logout Handler
  function handleLogout() {
    localStorage.removeItem('shms_resident_user');
    setUser(null);
    setComplaints([]);
    setPasses([]);
    setBills([]);
    setVisitors([]);
    setVehicles([]);
  }

  // 1-Step Direct Camera / Avatar Upload Handler (works instantly on mobile & desktop)
  async function handleDirectAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) return;

        // Immediate responsive UI update
        setEditAvatar(dataUrl);
        if (user) {
          const updatedUser: ResidentUser = { ...user, avatar: dataUrl };
          setUser(updatedUser);
          try {
            localStorage.setItem('shms_resident_user', JSON.stringify(updatedUser));
          } catch {}
        }
        try {
          localStorage.setItem('shms_student_avatar', dataUrl);
        } catch {}

        setProfileSuccessMsg('Photo updated! Saving to server...');

        // Direct upload to server
        const permanentUrl = await uploadFileDirectly(file);
        if (permanentUrl && permanentUrl !== dataUrl) {
          setEditAvatar(permanentUrl);
          if (user) {
            const finalUser: ResidentUser = { ...user, avatar: permanentUrl };
            setUser(finalUser);
            try {
              localStorage.setItem('shms_resident_user', JSON.stringify(finalUser));
            } catch {}
          }
          try {
            localStorage.setItem('shms_student_avatar', permanentUrl);
          } catch {}

          if (user?.token) {
            try {
              await fetch(`${API_BASE}/residents/profile`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ avatarUrl: permanentUrl })
              });
            } catch {}
          }
        }
        setProfileSuccessMsg('✓ Profile photo uploaded and updated successfully!');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Direct photo upload error:', err);
      setProfileSuccessMsg('Photo saved for your session!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  // Profile Picture Upload Handler inside Edit Modal
  async function handleModalAvatarFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setProfileSuccessMsg('Uploading photo...');
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) return;

        setEditAvatar(dataUrl);
        if (user) {
          const updatedUser: ResidentUser = { ...user, avatar: dataUrl };
          setUser(updatedUser);
          try {
            localStorage.setItem('shms_resident_user', JSON.stringify(updatedUser));
          } catch {}
        }
        try {
          localStorage.setItem('shms_student_avatar', dataUrl);
        } catch {}

        const permanentUrl = await uploadFileDirectly(file);
        if (permanentUrl && permanentUrl !== dataUrl) {
          setEditAvatar(permanentUrl);
          if (user) {
            const finalUser: ResidentUser = { ...user, avatar: permanentUrl };
            setUser(finalUser);
            try {
              localStorage.setItem('shms_resident_user', JSON.stringify(finalUser));
            } catch {}
          }
          try {
            localStorage.setItem('shms_student_avatar', permanentUrl);
          } catch {}
        }
        setProfileSuccessMsg('✓ Photo uploaded and updated successfully!');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Modal photo read error:', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  // Save Profile Handler (PUT /api/residents/profile)
  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileSuccessMsg('');
    try {
      await fetch(`${API_BASE}/residents/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          avatarUrl: editAvatar,
          roomNumber: editRoom,
          blockName: editBlock,
          course: editCourse,
          year: editYear,
          bloodGroup: editBloodGroup,
          parentName: editParentName,
          parentPhone: editParentPhone,
          emergencyContact: editEmergencyContact
        })
      });

      const updatedUserObj: ResidentUser = {
        ...user,
        name: editName,
        phone: editPhone,
        avatar: editAvatar,
        room: editRoom,
        block: editBlock,
        course: editCourse,
        year: editYear,
        bloodGroup: editBloodGroup,
        parentName: editParentName,
        parentPhone: editParentPhone,
        emergencyContact: editEmergencyContact,
        dietaryPreference: editDietaryPreference,
        address: editAddress
      };

      setUser(updatedUserObj);
      localStorage.setItem('shms_resident_user', JSON.stringify(updatedUserObj));
      setProfileSuccessMsg('Profile and photo saved successfully!');
      setTimeout(() => {
        setShowEditProfileModal(false);
        setProfileSuccessMsg('');
      }, 1200);
    } catch (err) {
      console.error('Save profile error:', err);
      const updatedUserObj: ResidentUser = {
        ...user,
        name: editName,
        phone: editPhone,
        avatar: editAvatar,
        room: editRoom,
        block: editBlock,
        course: editCourse,
        year: editYear,
        bloodGroup: editBloodGroup,
        parentName: editParentName,
        parentPhone: editParentPhone,
        emergencyContact: editEmergencyContact,
        dietaryPreference: editDietaryPreference,
        address: editAddress
      };
      setUser(updatedUserObj);
      localStorage.setItem('shms_resident_user', JSON.stringify(updatedUserObj));
      setProfileSuccessMsg('Profile saved locally!');
      setTimeout(() => {
        setShowEditProfileModal(false);
        setProfileSuccessMsg('');
      }, 1200);
    } finally {
      setSavingProfile(false);
    }
  }

  // Voice Note Recording Simulator & Media Handler
  function toggleVoiceRecording() {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      setComplaintVoiceUrl('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
    } else {
      setIsRecordingVoice(true);
      setVoiceRecordingSeconds(0);
      setComplaintVoiceUrl(null);
      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  }

  // Complaint Photo Upload Handler (Supports ANY photo format directly)
  async function handleComplaintPhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const localPreview = URL.createObjectURL(file);
      setComplaintPhotoUrl(localPreview);

      const uploadedUrl = await uploadFileDirectly(file);
      setComplaintPhotoUrl(uploadedUrl);
    } catch (err) {
      console.error('Complaint photo error:', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  // Complaint Video Upload Handler (Supports ANY video format directly)
  async function handleComplaintVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setComplaintVideoName(`${file.name} (${sizeMb} MB) - Uploading...`);
    try {
      const localPreview = URL.createObjectURL(file);
      setComplaintVideoUrl(localPreview);

      const uploadedUrl = await uploadFileDirectly(file);
      setComplaintVideoUrl(uploadedUrl);
      setComplaintVideoName(`${file.name} (${sizeMb} MB) ✓ Ready`);
    } catch (err) {
      console.error('Complaint video error:', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  // Multi-Format Complaint Submission
  async function submitComplaint() {
    if (!user?.token) return;
    setSubmittingComplaint(true);
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          category: selectedComplaintCategory,
          title: complaintTitle || `${selectedComplaintCategory.replace('_', ' ')} Service Request`,
          description: complaintDesc || 'Issue reported by student resident with evidence attached.',
          priority: 'HIGH',
          isAnonymous: isAnonymousComplaint,
          photoUrl: complaintPhotoUrl,
          voiceUrl: complaintVoiceUrl,
          videoUrl: complaintVideoUrl
        })
      });

      if (res.ok) {
        playCuteSuccessSound();
        setShowComplaintModal(false);
        setComplaintTitle('');
        setComplaintDesc('');
        setComplaintPhotoUrl(null);
        setComplaintVideoUrl(null);
        setComplaintVideoName(null);
        setComplaintVoiceUrl(null);
        setVoiceRecordingSeconds(0);
        fetchData(user.token, user.id);
        setActiveTab('COMPLAINTS');
      }
    } catch (err) {
      console.error('Submit complaint error:', err);
    } finally {
      setSubmittingComplaint(false);
    }
  }

  // SOS Trigger Action
  async function triggerEmergency(type: string) {
    if (!user?.token) return;
    try {
      setSosStatus('SENDING');
      const res = await fetch(`${API_BASE}/emergency/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          emergencyType: type,
          locationDetails: `Room ${user.room}, ${user.block}`,
          gpsCoords: '28.4744° N, 77.5040° E'
        })
      });
      if (res.ok) {
        setSosStatus('SENT');
        setTimeout(() => {
          setShowSosModal(false);
          setSosStatus(null);
        }, 3000);
      }
    } catch (err) {
      setSosStatus('ERROR');
    }
  }

  // Pass Request Handler
  async function submitPassRequest() {
    if (!user?.token) return;
    try {
      const now = new Date();
      const till = new Date(now.getTime() + Number(passHours) * 60 * 60 * 1000);

      const res = await fetch(`${API_BASE}/passes/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          passType,
          reason: passReason,
          destination: passDestination,
          validFrom: now.toISOString(),
          validTill: till.toISOString()
        })
      });
      if (res.ok) {
        setShowPassModal(false);
        fetchData(user.token, user.id);
        setActiveTab('PASSES');
      }
    } catch (err) {
      console.error('Request pass error:', err);
    }
  }

  // Pre-approve Visitor
  async function submitVisitor() {
    if (!user?.token || !visitorName) return;
    try {
      const res = await fetch(`${API_BASE}/visitors/pre-approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          visitorName,
          visitorPhone,
          purpose: visitorPurpose || 'Personal Visit'
        })
      });
      if (res.ok) {
        setShowVisitorModal(false);
        setVisitorName('');
        setVisitorPhone('');
        fetchData(user.token, user.id);
      }
    } catch (err) {
      console.error('Visitor error:', err);
    }
  }

  // Register Vehicle
  async function submitVehicle() {
    if (!user?.token || !licensePlate) return;
    try {
      const res = await fetch(`${API_BASE}/vehicles/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          vehicleType,
          licensePlate,
          model: vehicleModel || 'Vehicle'
        })
      });
      if (res.ok) {
        setShowVehicleModal(false);
        setLicensePlate('');
        setVehicleModel('');
        fetchData(user.token, user.id);
      }
    } catch (err) {
      console.error('Vehicle error:', err);
    }
  }

  // Submit Feedback Rating
  async function submitRating() {
    if (!showRatingModal || !user?.token) return;
    try {
      await fetch(`${API_BASE}/complaints/${showRatingModal}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ rating: ratingVal, ratingComment: ratingText })
      });
      setShowRatingModal(null);
      setRatingText('');
      fetchData(user.token, user.id);
    } catch (err) {
      console.error('Rating error:', err);
    }
  }

  // Meal RSVP Toggle
  async function toggleMealRsvp(meal: 'BREAKFAST' | 'LUNCH' | 'DINNER') {
    if (meal === 'BREAKFAST') setIsEatingBreakfast(!isEatingBreakfast);
    if (meal === 'LUNCH') setIsEatingLunch(!isEatingLunch);
    if (meal === 'DINNER') setIsEatingDinner(!isEatingDinner);

    if (user?.token) {
      await fetch(`${API_BASE}/menu/eating-today`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          mealType: meal,
          isEating: meal === 'BREAKFAST' ? !isEatingBreakfast : meal === 'LUNCH' ? !isEatingLunch : !isEatingDinner
        })
      });
    }
  }

  // Submit Meal Rating
  function handleMealRatingSubmit() {
    setMealRatedSuccess(true);
    setTimeout(() => {
      setMealRatedSuccess(false);
      setMealFeedbackMsg('');
    }, 2500);
  }

  // Active pass for turnstile
  const activePass = passes.find((p) => p.status === 'APPROVED' || p.status === 'ACTIVE');
  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId);
  const availableBlocks = selectedCollege?.blocks || [];

  // -------------------------------------------------------------
  // SCREEN 1: PUBLIC LOGIN / ENROLLMENT (WHEN NOT AUTHENTICATED)
  // -------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25">
              SH
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm tracking-tight text-white">SmartHostel Resident</span>
                <span className="text-[10px] bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Student Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Digital Turnstile • Grievances • Mess Feasts • 24/7 SOS</p>
            </div>
          </div>

          <a
            href={process.env.NEXT_PUBLIC_ADMIN_WEB_URL || 'http://localhost:3000'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 flex items-center space-x-1.5 transition"
          >
            <span>Campus Admin</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </a>
        </header>

        {/* Portal Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-xl w-full z-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open for All Universities & Colleges • Public Student Portal</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Resident Student Portal
              </h1>
              <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
                Sign in with your campus account or register with your college to access digital gate passes, audio/video grievance tracking, and daily festival mess meals.
              </p>
            </div>

            {/* Auth Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl backdrop-blur-xl">
              {/* Tab Switcher */}
              <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => { setAuthTab('LOGIN'); setLoginError(''); setEnrollError(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
                    authTab === 'LOGIN'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Student Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('ENROLL'); setLoginError(''); setEnrollError(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
                    authTab === 'ENROLL'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Join Your College Hostel</span>
                </button>
              </div>

              {/* TAB 1: LOGIN */}
              {authTab === 'LOGIN' && (
                <div className="space-y-5">
                  {loginError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!loginEmail) {
                        setLoginError('Please enter your email');
                        return;
                      }
                      handleLogin(loginEmail);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Registered Student Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul.sharma@campus.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-xs disabled:opacity-50 cursor-pointer"
                    >
                      {loginLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Enter Resident App</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* 1-Click Demo Resident Logins */}
                  <div className="pt-5 border-t border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                      Quick 1-Click Demo Residents
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleLogin('rahul.sharma@campus.edu')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-left transition cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            Room A-204
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                        </div>
                        <p className="text-xs font-bold text-white mt-1.5">Rahul Sharma</p>
                        <p className="text-[10px] text-slate-400 truncate">Apex Institute • B.Tech CS</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLogin('priya.patel@campus.edu')}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 rounded-2xl text-left transition cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                            Room G-102
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition" />
                        </div>
                        <p className="text-xs font-bold text-white mt-1.5">Priya Patel</p>
                        <p className="text-[10px] text-slate-400 truncate">Apex Institute • MBBS</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENROLL */}
              {authTab === 'ENROLL' && (
                <form onSubmit={handleEnrollStudent} className="space-y-4 text-xs">
                  {enrollError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{enrollError}</span>
                    </div>
                  )}

                  {/* College Code & College Selector */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">
                          College / Campus Code *
                        </label>
                        <span className="text-[10px] text-blue-400 font-semibold">e.g. APEX-2026</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Enter College Code (e.g. APEX-2026)"
                          value={collegeCodeInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCollegeCodeInput(val);
                            const matched = colleges.find(
                              (c) => c.code.toLowerCase() === val.trim().toLowerCase()
                            );
                            if (matched) {
                              setSelectedCollegeId(matched.id);
                              if (matched.blocks && matched.blocks.length > 0) {
                                setSelectedBlock(matched.blocks[0]);
                              }
                            }
                          }}
                          className="w-full bg-slate-950 border border-blue-500/50 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono font-bold tracking-wider"
                        />
                        {colleges.some((c) => c.code.toLowerCase() === collegeCodeInput.trim().toLowerCase()) && (
                          <span className="absolute right-3 top-2.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ✓ College Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Or select from registered institutions:
                      </label>
                      <select
                        value={selectedCollegeId}
                        onChange={(e) => {
                          const cId = e.target.value;
                          setSelectedCollegeId(cId);
                          const chosen = colleges.find((c) => c.id === cId);
                          if (chosen) {
                            setCollegeCodeInput(chosen.code);
                            if (chosen.blocks && chosen.blocks.length > 0) {
                              setSelectedBlock(chosen.blocks[0]);
                            }
                          }
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        {colleges.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code}) - {c.address}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center space-x-2 text-[10px] text-blue-300">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>
                        Entering your college code links your account directly to your institution's Warden Admin Portal for instant live approval.
                      </span>
                    </div>
                  </div>


                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Gupta"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Student ID / Roll No
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026-CS-042"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Select Block
                      </label>
                      <select
                        value={selectedBlock}
                        onChange={(e) => setSelectedBlock(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        {availableBlocks.map((b: string) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Hostel Room Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 204 or B-12"
                        value={studentRoom}
                        onChange={(e) => setStudentRoom(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav@campus.edu"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Student Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+91 99000 00000"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Parent / Guardian Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mr. R.K. Gupta"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Parent Emergency Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+91 98000 11111"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={enrollLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 text-xs disabled:opacity-50 mt-2 cursor-pointer"
                  >
                    {enrollLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Complete Enrollment & Enter Hostel</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 1.5: PENDING WARDEN ADMISSION APPROVAL (WAITING ROOM)
  // -------------------------------------------------------------
  if (user && user.status === 'PENDING_APPROVAL') {
    return (
      <div className="min-h-screen bg-slate-900/50 flex justify-center selection:bg-amber-500 selection:text-slate-950">
        <div className="w-full max-w-md min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6 shadow-2xl relative border-x border-slate-800/80 justify-between">
          <div className="space-y-6 pt-4">
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
                  SH
                </div>
                <div>
                  <h2 className="text-xs font-black tracking-tight text-white">{user.tenantName}</h2>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Code: {user.tenantCode}</span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Pending Approval
              </span>
            </div>

            {/* Radar / Waiting Animation Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-amber-400 opacity-30" />
                <span className="animate-pulse absolute inline-flex h-12 w-12 rounded-full bg-amber-500/40" />
                <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg relative z-10">
                  <Clock className="w-7 h-7" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-white tracking-tight">Admission Verification in Progress</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your admission request has been dispatched in real time to the Chief Warden Office of <strong className="text-slate-200">{user.tenantName}</strong>.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-slate-500 text-[11px]">Resident Name</span>
                  <strong className="text-white">{user.name}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-slate-500 text-[11px]">Assigned Room</span>
                  <span className="text-amber-400 font-semibold">{user.room} ({user.block})</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-slate-500 text-[11px]">Roll Number</span>
                  <span className="text-slate-300 font-mono">{user.studentId || 'Under Verification'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">College Code</span>
                  <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-amber-500/30">
                    {user.tenantCode}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 text-left flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated WebSocket sync is listening:</strong> The instant the Campus Warden clicks <em>[Approve & Admit]</em> on their admin portal, this screen will automatically unlock right before your eyes!
                </span>
              </div>
            </div>

            {statusCheckMsg && (
              <div className="p-3 bg-slate-900 border border-slate-800 text-xs text-amber-300 rounded-xl text-center">
                {statusCheckMsg}
              </div>
            )}

            <button
              type="button"
              disabled={statusChecking}
              onClick={checkApprovalStatus}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold py-3 rounded-2xl border border-slate-700 text-xs flex items-center justify-center space-x-2 transition cursor-pointer shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${statusChecking ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
              <span>{statusChecking ? 'Checking Warden Portal...' : 'Check Approval Status Now'}</span>
            </button>
          </div>

          <div className="pt-6 border-t border-slate-900">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Use Different Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 1.6: REJECTED ADMISSION SCREEN
  // -------------------------------------------------------------
  if (user && user.status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-slate-900/50 flex justify-center selection:bg-rose-500 selection:text-white">
        <div className="w-full max-w-md min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6 shadow-2xl relative border-x border-slate-800/80 justify-between">
          <div className="space-y-6 pt-8 text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-3xl mx-auto flex items-center justify-center text-rose-500 shadow-xl">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">Admission Request Not Approved</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your registration for <strong>{user.tenantName}</strong> could not be verified by the campus warden.
              </p>
            </div>

            <div className="bg-rose-950/20 border border-rose-500/30 p-4 rounded-2xl text-left text-xs space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Warden Office Feedback:</span>
              <p className="text-rose-200">{user.approvalNote || 'Information mismatch with college ERP records. Please visit the hostel warden office in person.'}</p>
            </div>
          </div>

          <div className="space-y-2 pt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl text-xs shadow-lg transition cursor-pointer"
            >
              Try Again with Correct Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: LOGGED IN STUDENT APP WITH MODERN ATTRACTIVE UI
  // -------------------------------------------------------------
  return (

    <div className="min-h-screen bg-slate-900/50 flex justify-center selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 shadow-2xl relative border-x border-slate-800/80">
        {/* Hidden file input for 1-Click direct camera upload from header or profile */}
        <input
          ref={directCameraInputRef}
          type="file"
          accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.heic,.heif,.avif"
          onChange={handleDirectAvatarUpload}
          className="hidden"
        />

      {/* 1. TOP HEADER / APP BAR */}
      <header className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white px-4 pt-5 pb-6 rounded-b-[2rem] shadow-2xl relative overflow-hidden border-b border-indigo-500/30">
        {/* Glow backdrop decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          {/* Avatar & Student Name */}
          <div className="flex items-center space-x-3.5">
            {/* Clickable Profile Photo with instant native file picker */}
            <label
              htmlFor="direct-header-avatar-upload"
              className="relative group cursor-pointer block shrink-0"
              title="Click to take or upload profile photo"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
                alt={user.name}
                className="w-13 h-13 rounded-2xl border-2 border-white/80 object-cover shadow-xl group-hover:scale-105 transition"
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-slate-900 shadow-md group-hover:bg-blue-500 pointer-events-none"
                title="Change Photo"
              >
                <Camera className="w-2.5 h-2.5" />
              </div>
              <input
                id="direct-header-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleDirectAvatarUpload}
                className="sr-only"
              />
            </label>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center space-x-1.5">
                  <span>{user.name}</span>
                </h1>
                <span className="bg-emerald-500/25 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30 shadow-sm flex items-center space-x-1">
                  <CheckCircle className="w-2.5 h-2.5 inline" />
                  <span>Verified</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-blue-100 font-medium">
                <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 flex items-center space-x-1 font-bold">
                  <Building className="w-3 h-3 text-blue-300" />
                  <span>{user.tenantName}</span>
                </span>
                <span className="bg-blue-500/25 px-2 py-0.5 rounded-md border border-blue-400/30 font-semibold text-blue-200">
                  Room {user.room} • {user.block}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Buttons: Language Toggle, PWA App, 2G Mode, SMS Fallback, Edit Profile, Sign Out */}
          <div className="flex items-center space-x-1.5">
            {/* 1-Tap Language Toggle: English / Hindi */}
            <button
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Hindi (हिन्दी में बदलें)' : 'Switch to English'}
              className="px-2 py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-200 border border-amber-500/40 rounded-xl text-[11px] font-black transition flex items-center space-x-1 cursor-pointer shadow-sm active:scale-95"
            >
              <span className="text-[12px]">🌐</span>
              <span>{t.langToggle}</span>
            </button>
            <button
              onClick={handleInstallApp}
              title={isAppInstalled ? 'Hostel App Installed' : 'Install App on Phone Home Screen'}
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                isAppInstalled
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400 shadow-md'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PWA</span>
              <span>{isAppInstalled ? '✓' : 'App'}</span>
            </button>

            <button
              onClick={() => setIsLowDataMode(!isLowDataMode)}
              title="Toggle 2G Low-Data Mode for Weak Wi-Fi"
              className={`px-2 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                isLowDataMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isLowDataMode ? 'text-emerald-400' : 'text-slate-300'}`} />
              <span className="hidden sm:inline">2G</span>
              <span>{isLowDataMode ? 'ON' : '2G'}</span>
            </button>

            <button
              onClick={() => setShowSmsFallbackModal(true)}
              title="Keypad SMS Mode (No Smartphone / Internet Required)"
              className="px-2 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-xl border border-amber-500/30 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">SMS</span>
            </button>

            <button
              onClick={() => playCuteNotificationSound()}
              title="Test cute notification sound ✨"
              className="px-2 py-1.5 bg-pink-500/25 text-pink-200 hover:bg-pink-500/35 rounded-xl border border-pink-400/40 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <span>🔔</span>
              <span className="hidden sm:inline">Cute Sound</span>
            </button>

            <button
              onClick={() => setShowEditProfileModal(true)}
              title="Edit Student Profile & Picture"
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md transition border border-white/15 flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-200" />
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out / Switch Student"
              className="p-1.5 bg-white/10 hover:bg-red-500/30 text-white rounded-xl backdrop-blur-md transition border border-white/15 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Profile Update Confirmation Toast */}
        {profileSuccessMsg && (
          <div className="mt-2.5 bg-emerald-950/90 border border-emerald-500/60 rounded-xl p-2.5 flex items-center space-x-2 text-[11px] text-emerald-200 shadow-lg animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{profileSuccessMsg}</span>
          </div>
        )}

        {/* PWA Offline Mode Active Banner */}
        {isOffline && (
          <div className="mt-2.5 bg-amber-950/80 border border-amber-500/60 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-amber-200 shadow-lg animate-in fade-in">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <div>
                <strong className="text-white block font-bold">⚡ Offline Mode (Zero Internet Active)</strong>
                <span className="text-[10px] text-amber-300/90">
                  Showing cached turnstile QR & hostel vault. Passes & numeric codes remain fully functional.
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPwaInstallModal(true)}
              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
            >
              Vault Status
            </button>
          </div>
        )}

        {/* PWA 1-Click Install Banner when browser offers install */}
        {isInstallable && !isAppInstalled && (
          <div className="mt-2.5 bg-gradient-to-r from-blue-950/90 to-indigo-950/90 border border-blue-500/40 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-blue-100 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Install Resident App on Phone</strong>
                <span className="text-[10px] text-blue-300">Fast 1-tap home screen access with offline gate pass</span>
              </div>
            </div>
            <button
              onClick={handleInstallApp}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer shrink-0"
            >
              Install
            </button>
          </div>
        )}

        {/* 2G Low-Data Mode Active Banner */}
        {isLowDataMode && (
          <div className="mt-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2 flex items-center justify-between text-[11px] text-emerald-200">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span><strong>2G Low-Data Mode:</strong> Sub-40KB payloads, zero media loading, instant offline cache.</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-300 font-bold">
              34ms RTT
            </span>
          </div>
        )}

        {/* Urgent Live Notice Ticker */}
        {notices.length > 0 && (
          <div className="mt-3 bg-slate-950/60 backdrop-blur-xl rounded-xl p-2.5 flex items-center space-x-2 text-xs border border-white/10 overflow-hidden shadow-inner">
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded-md text-[10px] shrink-0 tracking-wider animate-pulse">
              ANNOUNCEMENT
            </span>
            <div className="truncate text-blue-100 font-medium">
              {notices[0]?.title}
            </div>
          </div>
        )}
      </header>

      {/* 2. ACTIVE STATUS BANNERS & PASS CARD */}
      <div className="px-4 -mt-3 space-y-2.5 z-10">
        {/* Approved Turnstile Pass */}
        {activePass && (
          <div
            onClick={() =>
              setShowQrModal({
                title: `${activePass.passType.replace('_', ' ')} Turnstile QR`,
                qrValue: activePass.qrCodeToken,
                subtitle: `Valid till ${new Date(activePass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Show at gate turnstile`
              })
            }
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer hover:from-emerald-500 hover:to-teal-600 transition border border-emerald-400/30"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black tracking-wider uppercase text-emerald-100">
                  {activePass.status === 'ACTIVE' ? t.outOnPass : t.gatePassActive}
                </div>
                <div className="text-xs font-bold text-white">
                  {t.tapToScan}
                </div>
                <div className="text-[10px] text-emerald-200">
                  {t.validTill} {new Date(activePass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Campus Landmark & Overview Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-800 bg-slate-900/90 group">
              <div className="relative h-44 md:h-56 w-full overflow-hidden">
                <img
                  src="/images/rec-campus-overview.jpg"
                  alt="Raajdhani Engineering College [REC] Bhubaneswar Campus"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-4 md:p-5">
                  <div className="text-white space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      CAMPUS HEADQUARTERS & RESIDENCE
                    </span>
                    <h3 className="text-base md:text-lg font-black tracking-tight">
                      Raajdhani Engineering College [REC], Bhubaneswar
                    </h3>
                    <p className="text-xs text-slate-300 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Near Mancheswar Railway Station, Mancheswar Railway Colony, Bhubaneswar, Odisha 751017</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px] font-medium">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Hostel Block A & B</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Central Academic Block</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Health Center Bay 5</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open('https://maps.google.com/?q=Raajdhani+Engineering+College+Bhubaneswar', '_blank')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center space-x-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>
                  <button
                    onClick={() => window.open('https://rec.ac.in', '_blank')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                  >
                    College Info
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-white/20 px-2.5 py-1.5 rounded-xl font-bold text-xs text-white">
              <span>{t.showQr}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Dues Alert Banner if any */}
        {bills.some((b) => b.dueAmount > 0) && (
          <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 p-2.5 rounded-2xl flex items-center justify-between text-xs backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">
                {t.duesPending} ₹{bills.find((b) => b.dueAmount > 0)?.dueAmount.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('PROFILE')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1 rounded-xl shadow-md transition cursor-pointer"
            >
              {t.payUpi}
            </button>
          </div>
        )}
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <main className="flex-1 px-4 pt-4 pb-8 overflow-y-auto">
        {/* ========================================================= */}
        {/* TAB: HOME                                                 */}
        {/* ========================================================= */}
        {activeTab === 'HOME' && (
          <div className="space-y-5">
            {/* Campus Panoramic Welcome Banner */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 min-h-[140px] md:min-h-[160px] flex items-center bg-[#07478a]">
              {/* Campus Background Image */}
              <img
                src="/images/rec-campus-overview.jpg"
                alt="Raajdhani Engineering College Campus"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Smooth Blue Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#034a94] via-[#085aa8]/90 via-35% md:via-45% to-transparent" />

              {/* Banner Content */}
              <div className="relative z-10 w-full p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase text-blue-200 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REC Main Campus • Bhubaneswar</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    Welcome to CampusHelper
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100 font-medium">
                    Raajdhani Engineering College • Smart Resident & Hostel Portal
                  </p>
                </div>

                {/* Floating Campus Badge */}
                <div className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/50 text-slate-800 shadow-lg self-start sm:self-auto shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 pr-1 text-left">
                    <p className="text-xs font-black text-slate-900 leading-tight">
                      Raajdhani Engineering College
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Bhubaneswar, Odisha
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Analogy 2: Single Banking App Replacing 5 Physical Office Visits */}
            <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/30 rounded-3xl p-3.5 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-1 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Building className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-black uppercase text-blue-300 tracking-wider">
                    {t.hubTitle}
                  </span>
                </div>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  {t.zeroQueues}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                {t.hubDescription}
              </p>
              <div className="grid grid-cols-5 gap-1.5 pt-1 text-center text-[9px] font-bold text-slate-400">
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  <span className="block text-white">🏢 {t.hubWarden}</span>
                  <span className="text-[8px] text-emerald-400">Outpasses</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  <span className="block text-white">🔧 {t.hubWorks}</span>
                  <span className="text-[8px] text-blue-400">Tickets</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  <span className="block text-white">💳 {t.hubCashier}</span>
                  <span className="text-[8px] text-amber-400">Receipts</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  <span className="block text-white">🛡️ {t.hubGate}</span>
                  <span className="text-[8px] text-purple-400">Turnstile</span>
                </div>
                <div className="bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
                  <span className="block text-white">📢 {t.hubNotices}</span>
                  <span className="text-[8px] text-pink-400">Broadcast</span>
                </div>
              </div>
            </div>

            {/* Chief Warden & Administrative Manager Desk Card */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 shadow-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.wardenDeskTitle}</span>
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{managerProfile?.status || t.activeOnCampus}</span>
                </span>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="relative shrink-0">
                  <img
                    src={managerProfile?.photoUrl || managerProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'}
                    alt={managerProfile?.name || 'Chief Warden'}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-slate-900">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-white truncate">
                    {managerProfile?.name || 'Dr. Arthur Pendelton'}
                  </h4>
                  <p className="text-[11px] text-indigo-300 font-medium truncate">
                    {managerProfile?.title || managerProfile?.designation || 'Chief Campus Warden & Student Affairs'}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{managerProfile?.officeRoom || 'Admin Block A, Room 104'}</span>
                  </p>
                </div>
              </div>

              {(managerProfile?.statusNote || managerProfile?.announcement) && (
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-300 leading-snug">
                  <span className="text-indigo-400 font-semibold">{t.deskNote} </span>
                  {managerProfile.statusNote || managerProfile.announcement}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">{t.visitingHours}</span>
                  <span className="text-white font-bold truncate block">{managerProfile?.visitingHours || '4:00 PM - 7:00 PM'}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-slate-400 block text-[9px]">{t.directInquiry}</span>
                    <span className="text-indigo-300 font-bold truncate block">{managerProfile?.emergencyDirectLine || managerProfile?.phone || '+91 98765 43210'}</span>
                  </div>
                  <a
                    href={`tel:${managerProfile?.emergencyDirectLine || managerProfile?.phone || '+919876543210'}`}
                    className="p-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 rounded-lg transition shrink-0 ml-1"
                    title="Direct Call Desk"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Targeted WhatsApp-Style Broadcast Notice with Read Acknowledgment */}
            {notices.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 bg-red-500/20 text-red-400 rounded-lg">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      Official Notice & Read Receipt
                    </h3>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                    🎯 {notices[0]?.targetAudience || 'ALL_STUDENTS'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{notices[0]?.title}</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">{notices[0]?.content}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-500">From: {notices[0]?.authorName || 'Chief Warden'}</span>
                  <button
                    onClick={() => handleAcknowledgeNotice(notices[0]?.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                      acknowledgedNotices[notices[0]?.id]
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{acknowledgedNotices[notices[0]?.id] ? '✓ Read & Acknowledged' : 'Mark Read & Acknowledge'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Quick Campus Actions</span>
                </h2>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Instant Redressal
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {/* 1. Raise Complaint */}
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionGrievance}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionGrievanceSub}</span>
                </button>

                {/* 2. Gate Pass */}
                <button
                  onClick={() => {
                    setPassType('GATE_PASS');
                    setShowPassModal(true);
                  }}
                  className="bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionGatePass}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionGatePassSub}</span>
                </button>

                {/* 3. Leave Request */}
                <button
                  onClick={() => {
                    setPassType('LEAVE');
                    setShowPassModal(true);
                  }}
                  className="bg-slate-900/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionLeave}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionLeaveSub}</span>
                </button>

                {/* 4. Mess Menu */}
                <button
                  onClick={() => setActiveTab('MENU')}
                  className="bg-slate-900/80 hover:bg-orange-950/60 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-orange-600/20 text-orange-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionMessMenu}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionMessMenuSub}</span>
                </button>

                {/* 5. Pre-Approve Visitor */}
                <button
                  onClick={() => setShowVisitorModal(true)}
                  className="bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionVisitors}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionVisitorsSub}</span>
                </button>

                {/* 6. Vehicle Registration */}
                <button
                  onClick={() => setShowVehicleModal(true)}
                  className="bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Car className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionVehicle}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionVehicleSub}</span>
                </button>

                {/* 7. Emergency Contacts */}
                <button
                  onClick={() => setShowDirectoryModal(true)}
                  className="bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-sky-600/20 text-sky-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionHelpDesk}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionHelpDeskSub}</span>
                </button>

                {/* 8. Campus Polls & Feedback */}
                <button
                  onClick={() => setShowCommunityModal(true)}
                  className="bg-slate-900/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-rose-600/20 text-rose-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionSuggestion}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionSuggestionSub}</span>
                </button>

                {/* 9. College Gallery */}
                <button
                  onClick={() => setActiveTab('GALLERY')}
                  className="bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionGallery}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionGallerySub}</span>
                </button>

                {/* 10. College Calendar */}
                <button
                  onClick={() => setActiveTab('CALENDAR')}
                  className="bg-slate-900/80 hover:bg-violet-950/60 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition active:scale-95 shadow-md group cursor-pointer"
                >
                  <div className="w-11 h-11 bg-violet-600/20 text-violet-400 rounded-2xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition shadow-inner">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200">{t.actionCalendar}</span>
                  <span className="text-[9px] text-slate-500 font-medium">{t.actionCalendarSub}</span>
                </button>
              </div>
            </div>

            {/* USER'S EXACT SPECIFIED GATE PASS TICKET */}
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm font-black text-white tracking-wide uppercase">Gate Pass</h3>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: ✅ Approved
                </span>
              </div>

              <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-white">Subham Pradhan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Phone:</span>
                  <span className="font-bold text-sky-400 font-mono">{user?.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Father Phone:</span>
                  <span className="font-bold text-emerald-400 font-mono">+91 94370 88990</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mother Phone:</span>
                  <span className="font-bold text-emerald-400 font-mono">+91 94371 67890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hostel:</span>
                  <span className="font-bold text-white">Hostel A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Room:</span>
                  <span className="font-bold text-white">A-204</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="font-bold text-blue-300">Home Visit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Out:</span>
                  <span className="font-bold text-emerald-400">05 Oct, 10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Return:</span>
                  <span className="font-bold text-amber-400">06 Oct, 06:00 PM</span>
                </div>
                <div className="border-t border-slate-800/80 pt-2 flex justify-between">
                  <span className="text-slate-400">Warden:</span>
                  <span className="font-bold text-emerald-400">Approved ✅</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security:</span>
                  <span className="font-bold text-sky-400">Verify at Gate</span>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowQrModal({
                    title: 'Gate Pass QR Code',
                    qrValue: 'PASS-HOME-REC-A204-SUBHAM-05OCT',
                    subtitle: 'Subham Pradhan (Student Phone: +91 98765 43210 • Parent Phone: +91 94370 88990) • Hostel A (A-204)'
                  })
                }
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>[Show QR Gate Pass]</span>
              </button>
            </div>

            {/* Today's Mess Highlights Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border border-orange-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-2xl shadow-md">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
                        {t.todaysMenu}
                      </h3>
                      <span className="text-[9px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                        {menuData?.today?.day || (lang === 'hi' ? 'आज' : 'Today')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {t.mealBreakfast} • {t.mealLunch} • {t.mealSnacks} • {t.mealDinner}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('MENU')}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center space-x-1 cursor-pointer"
                >
                  <span>{t.fullWeek}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4 Meals Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Breakfast */}
                <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-orange-500/20 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-amber-400 flex items-center space-x-1">
                      <Coffee className="w-3 h-3 inline" />
                      <span>{t.mealBreakfast.toUpperCase()}</span>
                    </span>
                    <button
                      onClick={() => toggleMealRsvp('BREAKFAST')}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition cursor-pointer ${
                        isEatingBreakfast ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isEatingBreakfast ? (lang === 'hi' ? '✓ खाएंगे' : '✓ Attending') : (lang === 'hi' ? 'छोड़ेंगे' : 'Skipping')}
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    {menuData?.today?.meals?.BREAKFAST || 'Aloo Paratha, Curd, Boiled Eggs / Milk, Chai'}
                  </p>
                </div>

                {/* Lunch */}
                <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-orange-500/20 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-orange-400 flex items-center space-x-1">
                      <Sun className="w-3 h-3 inline" />
                      <span>{t.mealLunch.toUpperCase()}</span>
                    </span>
                    <button
                      onClick={() => toggleMealRsvp('LUNCH')}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition cursor-pointer ${
                        isEatingLunch ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isEatingLunch ? (lang === 'hi' ? '✓ खाएंगे' : '✓ Attending') : (lang === 'hi' ? 'छोड़ेंगे' : 'Skipping')}
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    {menuData?.today?.meals?.LUNCH || 'Dal Tadka, Shahi Paneer, Jeera Rice, Tawa Roti'}
                  </p>
                </div>

                {/* Snacks */}
                <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-orange-500/20 shadow-sm">
                  <span className="text-[10px] font-black text-sky-400 block mb-1">
                    {t.mealSnacks.toUpperCase()}
                  </span>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    {menuData?.today?.meals?.SNACKS || 'Veg Samosa with Mint Chutney, Adrak Chai'}
                  </p>
                </div>

                {/* Dinner */}
                <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-orange-500/20 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-indigo-400 flex items-center space-x-1">
                      <Moon className="w-3 h-3 inline" />
                      <span>{t.mealDinner.toUpperCase()}</span>
                    </span>
                    <button
                      onClick={() => toggleMealRsvp('DINNER')}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition cursor-pointer ${
                        isEatingDinner ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isEatingDinner ? (lang === 'hi' ? '✓ खाएंगे' : '✓ Attending') : (lang === 'hi' ? 'छोड़ेंगे' : 'Skipping')}
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    {menuData?.today?.meals?.DINNER || 'Rajma Masala, Kashmiri Pulao, Chapati, Gulab Jamun'}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Festival Feast Banner */}
            {menuData?.festivalSpecial && (
              <div
                onClick={() => setActiveTab('MENU')}
                className="bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-pink-900/60 border border-purple-500/40 rounded-3xl p-4 shadow-xl cursor-pointer hover:border-purple-400 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 rounded-xl font-bold shadow-md">
                      ✨
                    </span>
                    <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                      Upcoming Festival Feast & Gala
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-400/30">
                    Grand Buffet
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  {menuData.festivalSpecial.title}
                </h4>
                <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                  {menuData.festivalSpecial.dinnerFeast}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-purple-200 border-t border-purple-500/20 pt-2">
                  <span>{menuData.festivalSpecial.date}</span>
                  <span className="font-bold text-amber-300 flex items-center space-x-1">
                    <span>View Feast Menu</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )}

            {/* Recent Complaints Snippet */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'hi' ? 'मेरी सक्रिय शिकायतें' : 'My Active Grievances'}</span>
                </h3>
                <button
                  onClick={() => setActiveTab('COMPLAINTS')}
                  className="text-[11px] text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  {lang === 'hi' ? 'सभी देखें' : 'View All'} ({complaints.length})
                </button>
              </div>

              {complaints.length === 0 ? (
                <div className="p-5 text-center bg-slate-900/60 border border-slate-800 rounded-3xl text-xs text-slate-400 shadow-sm">
                  {t.noActiveGrievances}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {complaints.slice(0, 2).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setActiveTab('COMPLAINTS')}
                      className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition cursor-pointer shadow-md flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-400 text-xs">
                          {c.category ? c.category[0] : 'C'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[200px]">
                            {c.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Ticket {c.ticketNumber} • SLA: {c.slaHours}h
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          c.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : c.status === 'IN_PROGRESS'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PASSES & LEAVES                                      */}
        {/* ========================================================= */}
        {activeTab === 'PASSES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">{t.passesTitle}</h2>
                <p className="text-xs text-slate-400">{lang === 'hi' ? 'तुरंत गेट पास और अवकाश के लिए आवेदन करें' : 'Apply for instant gate passes and holiday leaves'}</p>
              </div>
              <button
                onClick={() => setShowPassModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.newOutpass}</span>
              </button>
            </div>

            {/* USER'S EXACT SPECIFIED APPROVED GATE PASS TICKET */}
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 shadow-2xl space-y-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-sm font-black text-white tracking-wide uppercase">Gate Pass</h3>
                </div>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: ✅ Approved
                </span>
              </div>

              <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-white">Subham Pradhan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Phone:</span>
                  <span className="font-bold text-sky-400 font-mono">{user?.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Father Phone:</span>
                  <span className="font-bold text-emerald-400 font-mono">+91 94370 88990</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mother Phone:</span>
                  <span className="font-bold text-emerald-400 font-mono">+91 94371 67890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hostel:</span>
                  <span className="font-bold text-white">Hostel A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Room:</span>
                  <span className="font-bold text-white">A-204</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="font-bold text-blue-300">Home Visit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Out:</span>
                  <span className="font-bold text-emerald-400">05 Oct, 10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Return:</span>
                  <span className="font-bold text-amber-400">06 Oct, 06:00 PM</span>
                </div>
                <div className="border-t border-slate-800/80 pt-2 flex justify-between">
                  <span className="text-slate-400">Warden:</span>
                  <span className="font-bold text-emerald-400">Approved ✅</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security:</span>
                  <span className="font-bold text-sky-400">Verify at Gate</span>
                </div>
              </div>

              <button
                onClick={() =>
                  setShowQrModal({
                    title: 'Gate Pass QR Code',
                    qrValue: 'PASS-HOME-REC-A204-SUBHAM-05OCT',
                    subtitle: 'Subham Pradhan (Student Phone: +91 98765 43210 • Parent Phone: +91 94370 88990) • Hostel A (A-204)'
                  })
                }
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>[Show QR Gate Pass]</span>
              </button>
            </div>

            {passes.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800">
                <QrCode className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-semibold">No pass requests created yet</p>
                <button
                  onClick={() => setShowPassModal(true)}
                  className="mt-3 text-xs text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Generate your first gate pass
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {passes.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {p.passType.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {p.destination}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          p.status === 'APPROVED' || p.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : p.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{p.reason}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                      <span>
                        Valid till:{' '}
                        {new Date(p.validTill).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {(p.status === 'APPROVED' || p.status === 'ACTIVE') && (
                        <button
                          onClick={() =>
                            setShowQrModal({
                              title: `${p.passType.replace('_', ' ')} QR Code`,
                              qrValue: p.qrCodeToken,
                              subtitle: `Scan at Turnstile Gate • Pass #${p.passNumber}`
                            })
                          }
                          className="text-emerald-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 inline" />
                          <span>{t.showQr}</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setTrackedOrder({
                          id: p.passNumber,
                          type: 'PASS',
                          passType: p.passType,
                          title: `${p.passType.replace('_', ' ')}: ${p.destination}`,
                          destination: p.destination,
                          status: p.status,
                          qrToken: p.qrCodeToken,
                          offlineCode: p.passNumber?.startsWith('PASS-') ? p.passNumber : 'PASS-749201',
                          createdAt: p.createdAt,
                          validUntil: p.validTill,
                          reason: p.reason
                        });
                        setShowOrderTrackerModal(true);
                      }}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl py-1.5 px-3 flex items-center justify-between text-xs font-bold transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{lang === 'hi' ? 'लाइव ऑर्डर ट्रैकर (पास स्थिति)' : 'Live Order Tracker (Pass Status)'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-200">{lang === 'hi' ? 'ट्रैक करें →' : 'Track →'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: COMPLAINTS & GRIEVANCES (MULTI-FORMAT)               */}
        {/* ========================================================= */}
        {activeTab === 'COMPLAINTS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">{lang === 'hi' ? 'शिकायतें और निवारण' : 'Grievances & Redressal'}</h2>
                <p className="text-xs text-slate-400">{lang === 'hi' ? 'लिखित, वॉइस नोट, फोटो एवं वीडियो प्रमाण' : 'Written, voice note, photo & video evidence'}</p>
              </div>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.raiseNewTicket}</span>
              </button>
            </div>

            {/* Food Delivery Style Live Tracker Analogy Banner */}
            <div className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-500/30 rounded-2xl p-3 shadow-md">
              <span className="text-xs font-bold text-blue-300 block">{t.trackerTitle}</span>
              <p className="text-[11px] text-slate-300 mt-0.5">{t.trackerDesc}</p>
            </div>

            {/* Category Quick Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedComplaintCategory('ALL')}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border shrink-0 transition cursor-pointer ${
                  selectedComplaintCategory === 'ALL'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                All Grievances ({complaints.length})
              </button>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedComplaintCategory(cat.key)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border shrink-0 transition flex items-center space-x-1.5 cursor-pointer ${
                    selectedComplaintCategory === cat.key
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <cat.icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {complaints.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800">
                <Wrench className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-semibold">No complaints registered</p>
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="mt-3 text-xs text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Submit your first issue with photo/voice proof
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {complaints
                  .filter((c) => selectedComplaintCategory === 'ALL' || c.category === selectedComplaintCategory)
                  .map((c) => (
                    <div
                      key={c.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {c.category}
                          </span>
                          <span className="text-xs font-bold text-white font-mono">
                            {c.ticketNumber}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            c.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : c.status === 'IN_PROGRESS'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">{c.title}</h4>
                        <p className="text-xs text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                          {c.description}
                        </p>
                      </div>

                      {/* Display attached photo proof if available */}
                      {c.photoUrl && (
                        <div className="mt-2">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            ATTACHED PHOTO:
                          </span>
                          <img
                            src={c.photoUrl}
                            alt="Complaint proof"
                            className="max-h-40 rounded-xl object-cover border border-slate-700 shadow-md"
                          />
                        </div>
                      )}

                      {/* Display attached video proof if available */}
                      {c.videoUrl && (
                        <div className="mt-2">
                          <span className="text-[10px] font-bold text-purple-400 block mb-1 flex items-center space-x-1">
                            <Video className="w-3.5 h-3.5 inline mr-1" />
                            <span>ATTACHED VIDEO PROOF:</span>
                          </span>
                          <video
                            src={c.videoUrl}
                            controls
                            className="w-full max-h-48 rounded-xl bg-black border border-purple-500/30 object-contain shadow-md"
                          />
                        </div>
                      )}

                      {/* Display attached voice note if available */}
                      {c.voiceUrl && (
                        <div className="mt-2">
                          <span className="text-[10px] font-bold text-emerald-400 block mb-1 flex items-center space-x-1">
                            <Mic className="w-3.5 h-3.5 inline mr-1" />
                            <span>VOICE RECORDING:</span>
                          </span>
                          <audio
                            src={c.voiceUrl}
                            controls
                            className="w-full mt-1"
                          />
                        </div>
                      )}

                      {/* SLA Progress Bar */}
                      <div className="border-t border-slate-800 pt-2.5">
                        <div className="flex items-center justify-between text-[9px] font-black text-slate-500 uppercase tracking-wider">
                          <span className="text-blue-400">RAISED</span>
                          <span className={c.status !== 'RAISED' ? 'text-blue-400' : ''}>ACKNOWLEDGED</span>
                          <span className={c.status === 'IN_PROGRESS' || c.status === 'RESOLVED' ? 'text-blue-400' : ''}>IN PROGRESS</span>
                          <span className={c.status === 'RESOLVED' ? 'text-emerald-400' : ''}>RESOLVED</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              c.status === 'RESOLVED'
                                ? 'w-full bg-emerald-500'
                                : c.status === 'IN_PROGRESS'
                                ? 'w-3/4 bg-amber-500'
                                : c.status === 'ACKNOWLEDGED'
                                ? 'w-1/2 bg-blue-500'
                                : 'w-1/4 bg-blue-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Live Food Delivery App Style Tracker Button */}
                      <button
                        onClick={() => {
                          setTrackedOrder({
                            id: c.ticketNumber,
                            type: 'COMPLAINT',
                            category: c.category,
                            title: c.title,
                            description: c.description,
                            status: c.status,
                            assignedStaff: c.assignedStaffName || (c.category === 'WATER' ? 'Mahendra Singh (Plumbing)' : c.category === 'ELECTRICITY' ? 'Suresh Kumar (Electrical)' : 'Campus Response Specialist'),
                            staffPhone: c.category === 'WATER' ? '+91 98111 00007' : '+91 98111 00006',
                            createdAt: c.createdAt,
                            slaDueAt: c.slaDueAt,
                            slaHours: c.slaHours
                          });
                          setShowOrderTrackerModal(true);
                        }}
                        className="w-full mt-2.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl py-2 px-3 flex items-center justify-between text-xs font-bold transition shadow-sm cursor-pointer"
                      >
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                          <span>Live Service Order Tracker (Swiggy / Zomato Style)</span>
                        </div>
                        <span className="text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-md font-bold">
                          Track Live →
                        </span>
                      </button>

                      {/* Resolved Rating Box */}
                      {c.status === 'RESOLVED' && (
                        <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-xs flex items-center justify-between">
                          <div>
                            <span className="font-bold text-emerald-300 block text-[11px]">
                              Resolved within SLA!
                            </span>
                            {c.rating ? (
                              <div className="flex items-center space-x-1 text-amber-400 text-xs mt-0.5">
                                {'★'.repeat(c.rating)}
                                <span className="text-slate-300 text-[10px] ml-1">
                                  &ldquo;{c.ratingComment || 'Resolved'}&rdquo;
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Feedback pending</span>
                            )}
                          </div>
                          {!c.rating && (
                            <button
                              onClick={() => setShowRatingModal(c.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl shadow-md cursor-pointer"
                            >
                              Rate (1-5★)
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: MESS MENU & SPECIAL FESTIVAL FEASTS                  */}
        {/* ========================================================= */}
        {activeTab === 'MENU' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-white">Campus Mess & Dining</h2>
                <p className="text-xs text-slate-400">Nutritious meals, festival feasts & daily breakfast</p>
              </div>
              <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full">
                FSSAI 5-Star Clean
              </span>
            </div>

            {/* Special Festival Feast Spotlight Card */}
            {menuData?.festivalSpecial && (
              <div className="bg-gradient-to-br from-amber-600/20 via-purple-900/40 to-slate-900 border border-amber-500/40 rounded-3xl p-4.5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-xl font-bold">
                      🎉
                    </span>
                    <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                      Special Festival Feast & Sunday Gala
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Grand Dining Hall
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-white tracking-tight">
                  {menuData.festivalSpecial.title}
                </h3>
                <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                  {menuData.festivalSpecial.occasion} • {menuData.festivalSpecial.date}
                </p>

                <div className="mt-3.5 space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-amber-500/20">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                      Festive Breakfast Special
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {menuData.festivalSpecial.breakfastSpecial}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider block">
                      Grand Lunch Feast
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {menuData.festivalSpecial.lunchSpecial}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-pink-400 uppercase tracking-wider block">
                      Celebration Dinner Buffet
                    </span>
                    <p className="text-xs text-slate-200 font-medium">
                      {menuData.festivalSpecial.dinnerFeast}
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider block mb-1">
                      Live Festive Food Counters
                    </span>
                    <ul className="text-[11px] text-slate-300 space-y-1">
                      {menuData.festivalSpecial.liveCounters?.map((c: string, idx: number) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <span className="text-amber-400">✦</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-emerald-300 font-semibold">
                    ✓ Pure Veg & Jain Preparation Available
                  </span>
                  <button
                    onClick={() => alert('RSVP Confirmed for Festival Gala Feast!')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl shadow-lg transition text-xs cursor-pointer"
                  >
                    Confirm Feast RSVP
                  </button>
                </div>
              </div>
            )}

            {/* Day Selector Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {['TODAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedMenuDay(d)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border shrink-0 transition cursor-pointer ${
                    selectedMenuDay === d
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Menu Day Display */}
            {menuData?.schedule && (
              <div className="space-y-3">
                {Object.entries(menuData.schedule)
                  .filter(([day]) => selectedMenuDay === 'TODAY' ? day === (menuData?.today?.day || 'MONDAY') : day === selectedMenuDay)
                  .map(([day, meals]: any) => (
                    <div key={day} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-white">{day} MENU</span>
                          {menuData?.today?.day === day && (
                            <span className="text-[10px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full">
                              TODAY
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">4 Daily Meals</span>
                      </div>

                      {/* Breakfast */}
                      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Coffee className="w-3.5 h-3.5 inline text-amber-400" />
                            <span>BREAKFAST (07:30 AM – 09:30 AM)</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                            Morning Buffet
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(meals.BREAKFAST || '')
                            .split(',')
                            .map((d) => d.trim())
                            .filter(Boolean)
                            .map((dish, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold"
                              >
                                {dish}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Lunch */}
                      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Sun className="w-3.5 h-3.5 inline text-blue-400" />
                            <span>LUNCH (12:30 PM – 02:30 PM)</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                            Full Buffet
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(meals.LUNCH || '')
                            .split(',')
                            .map((d) => d.trim())
                            .filter(Boolean)
                            .map((dish, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs font-semibold"
                              >
                                {dish}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Evening Snacks */}
                      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 inline text-emerald-400" />
                            <span>EVENING SNACKS (05:00 PM – 06:30 PM)</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            Hot Refreshments
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(meals.SNACKS || '')
                            .split(',')
                            .map((d) => d.trim())
                            .filter(Boolean)
                            .map((dish, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-semibold"
                              >
                                {dish}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Dinner */}
                      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                            <Moon className="w-3.5 h-3.5 inline text-purple-400" />
                            <span>DINNER (08:00 PM – 10:00 PM)</span>
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                            Evening Feast
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(meals.DINNER || '')
                            .split(',')
                            .map((d) => d.trim())
                            .filter(Boolean)
                            .map((dish, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-semibold"
                              >
                                {dish}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Mess Feedback & Rating Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                {t.rateMeals}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.rateDesc}
              </p>

              <div className="flex items-center space-x-2 text-2xl text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setMealRating(s)}
                    className={`transition cursor-pointer ${s <= mealRating ? 'scale-110' : 'opacity-30'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-300 ml-2">
                  {mealRating} of 5 Stars
                </span>
              </div>

              <input
                type="text"
                placeholder={lang === 'hi' ? 'समीक्षा नोट (उदा. समोसा बहुत कुरकुरा था और चाय बढ़िया थी!)' : 'Optional review note (e.g. Samosa was crispy & tea was great!)'}
                value={mealFeedbackMsg}
                onChange={(e) => setMealFeedbackMsg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />

              <button
                onClick={handleMealRatingSubmit}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {mealRatedSuccess ? t.feedbackSuccess : t.submitFeedback}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: GALLERY (ACTIVITIES, VIDEOS, PHOTOS)                 */}
        {/* ========================================================= */}
        {activeTab === 'GALLERY' && (
          <div className="space-y-4">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-4 shadow-xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl">
                    <Camera className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">{t.galleryTitle}</h2>
                    <p className="text-[10px] text-emerald-300">{t.gallerySubtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {galleryItems.length} {t.momentsCount}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex space-x-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none text-[10px]">
                {['ALL', 'CULTURAL', 'SPORTS', 'ACADEMIC', 'HOSTEL_LIFE', 'FESTIVAL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                      galleryFilter === cat
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Feed / Grid */}
            {galleryItems.filter(item => galleryFilter === 'ALL' || item.category === galleryFilter).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-300">{t.noGalleryItems}</p>
                <p className="text-[10px] text-slate-500">{t.noGalleryDesc}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {galleryItems
                  .filter(item => galleryFilter === 'ALL' || item.category === galleryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition"
                    >
                      {/* Media Container */}
                      <div
                        className="relative w-full h-52 bg-slate-950 overflow-hidden cursor-pointer group"
                        onClick={() => setPreviewMediaModal(item)}
                      >
                        {item.mediaType === 'VIDEO' ? (
                          <div className="w-full h-full relative">
                            <video
                              src={item.mediaUrl}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              preload="metadata"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                              <div className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                <Play className="w-5 h-5 ml-0.5 fill-white" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Video className="w-3 h-3 text-emerald-400" />
                              <span>VIDEO</span>
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full relative">
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              loading="lazy"
                            />
                            <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                              <Camera className="w-3 h-3 text-blue-400" />
                              <span>PHOTO</span>
                            </span>
                          </div>
                        )}

                        <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-[9px] font-extrabold px-2.5 py-1 rounded-full text-emerald-300 border border-emerald-500/30">
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="p-3.5 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-extrabold text-xs text-white leading-snug">{item.title}</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.date}</p>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-[11px] text-slate-300 leading-relaxed">{item.description}</p>
                        )}

                        {/* Interactive Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                          <button
                            onClick={() => handleLikeGalleryItem(item.id)}
                            className="flex items-center space-x-1.5 text-rose-400 hover:text-rose-300 transition active:scale-125 cursor-pointer py-1 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20"
                          >
                            <Heart className={`w-4 h-4 ${(item.likesCount || item.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="text-[11px] font-bold">{item.likesCount || item.likes || 0} {t.cheers}</span>
                          </button>

                          <button
                            onClick={() => setPreviewMediaModal(item)}
                            className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{t.openMedia}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: CALENDAR (EXAMS, HOLIDAYS, ACADEMIC EVENTS)          */}
        {/* ========================================================= */}
        {activeTab === 'CALENDAR' && (
          <div className="space-y-4">
            {/* Calendar Header Card */}
            <div className="bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 border border-violet-500/30 rounded-3xl p-4 shadow-xl space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-violet-600/20 text-violet-400 rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">{t.calendarTitle}</h2>
                    <p className="text-[10px] text-violet-300">{t.calendarSubtitle}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-violet-500/20 text-violet-300 font-bold px-2 py-0.5 rounded-full border border-violet-500/30">
                  {calendarEvents.length} {t.eventsCount}
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex space-x-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none text-[10px]">
                {['ALL', 'EXAM', 'HOLIDAY', 'ACADEMIC', 'SPORTS', 'CULTURAL'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCalendarFilter(cat)}
                    className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                      calendarFilter === cat
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Highlights Card (Nearest Event) */}
            {calendarEvents.length > 0 && (
              <div className="bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-slate-900 border border-violet-500/30 rounded-3xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex flex-col items-center justify-center font-bold text-center leading-none shadow-md">
                    <span className="text-[9px] uppercase tracking-tighter">{t.upNext}</span>
                    <span className="text-xs font-black">⚡</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{calendarEvents[0]?.title}</h4>
                    <p className="text-[10px] text-violet-300">{calendarEvents[0]?.date} • {calendarEvents[0]?.venue || t.campusWide}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCalendarEvent(calendarEvents[0])}
                  className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold rounded-xl shadow-md transition cursor-pointer shrink-0"
                >
                  {t.viewDetails}
                </button>
              </div>
            )}

            {/* Event List */}
            {calendarEvents.filter(ev => calendarFilter === 'ALL' || ev.category === calendarFilter).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-300">{t.noCalendarItems}</p>
                <p className="text-[10px] text-slate-500">{t.noCalendarDesc}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {calendarEvents
                  .filter(ev => calendarFilter === 'ALL' || ev.category === calendarFilter)
                  .map((ev) => {
                    const catBadgeColor =
                      ev.category === 'EXAM'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : ev.category === 'HOLIDAY'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : ev.category === 'SPORTS'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedCalendarEvent(ev)}
                        className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-3.5 flex items-center justify-between transition cursor-pointer shadow-md group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Date badge */}
                          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shrink-0 group-hover:border-violet-500/50 transition">
                            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-tighter">
                              {ev.date?.slice(5, 7) ? new Date(ev.date).toLocaleString('default', { month: 'short' }) : 'EVENT'}
                            </span>
                            <span className="text-sm font-black text-white leading-none">
                              {ev.date?.slice(8, 10) || '•'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 mb-0.5">
                              <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${catBadgeColor}`}>
                                {ev.category}
                              </span>
                              {ev.time && (
                                <span className="text-[9px] text-slate-500 flex items-center space-x-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{ev.time}</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-violet-300 transition">
                              {ev.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                              <MapPin className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                              <span className="truncate">{ev.venue || 'Campus Wide'}</span>
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PROFILE & DUES (EXPANDED DETAILS & EDIT ACCESS)       */}
        {/* ========================================================= */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-4">
            {/* Profile Overview Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <label
                    htmlFor="profile-tab-direct-photo-input"
                    className="relative group cursor-pointer block shrink-0"
                    title="Click to take or upload profile photo"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80'}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl border-2 border-blue-500/80 object-cover shadow-xl group-hover:scale-105 transition"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 rounded-full text-white shadow-md hover:bg-blue-500 pointer-events-none"
                      title="Upload Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="profile-tab-direct-photo-input"
                      type="file"
                      accept="image/*"
                      onChange={handleDirectAvatarUpload}
                      className="sr-only"
                    />
                  </label>
                  <div>
                    <h2 className="text-base font-extrabold text-white">{user.name}</h2>
                    <p className="text-xs text-blue-400 font-mono">{user.studentId || 'STU-2026-089'}</p>
                    <p className="text-[11px] text-slate-400">{user.course || 'B.Tech Computer Science'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="profile-tab-direct-photo-input"
                    className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold px-3 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 pointer-events-none" />
                    <span>Upload Photo</span>
                  </label>
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Institution Bar */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Connected Campus Institution
                  </span>
                  <span className="font-extrabold text-white">{user.tenantName}</span>
                </div>
                <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                  {user.tenantCode}
                </span>
              </div>
            </div>

            {/* DEDICATED PHOTO UPLOAD CENTER */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span>Student Profile Photo Center</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Instant Sync
                </span>
              </div>

              {/* Option A: Direct Device File Browser */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-300">
                  Choose Photo File from Device / Computer:
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDirectAvatarUpload}
                  className="block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer bg-slate-900 p-2 rounded-xl border border-slate-800 cursor-pointer"
                />
              </div>

              {/* Option B: Preset Student Avatars */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">
                  Or pick a 1-Click student avatar:
                </span>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Preset"
                      onClick={() => {
                        const updated = { ...user, avatar: p };
                        setUser(updated);
                        setEditAvatar(p);
                        try {
                          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
                          localStorage.setItem('shms_student_avatar', p);
                        } catch {}
                        if (user?.token) {
                          fetch(`${API_BASE}/residents/profile`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${user.token}`
                            },
                            body: JSON.stringify({ avatarUrl: p })
                          }).catch(() => {});
                        }
                        setProfileSuccessMsg('✓ Avatar selected successfully!');
                        setTimeout(() => setProfileSuccessMsg(''), 3000);
                      }}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition border-2 shrink-0 ${
                        user.avatar === p ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Academic & Hostel Allocation Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Hostel & Academic Details</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  KYC Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hostel Block</span>
                  <span className="text-slate-200 font-semibold">{user.block}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Room Number</span>
                  <span className="text-slate-200 font-semibold">Room {user.room}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Degree / Course</span>
                  <span className="text-slate-200 font-semibold">{user.course || 'B.Tech Computer Science'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Academic Year</span>
                  <span className="text-slate-200 font-semibold">{user.year || '3rd Year'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Blood Group</span>
                  <span className="text-rose-400 font-bold">{user.bloodGroup || 'B+'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Dietary Preference</span>
                  <span className="text-emerald-400 font-semibold">{user.dietaryPreference || 'Vegetarian'}</span>
                </div>
              </div>
            </div>

            {/* Emergency & Family Contacts */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-rose-400" />
                  <span>Emergency & Guardian Information</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Parent / Guardian</span>
                  <span className="text-slate-200 font-semibold">{user.parentName || 'Rajesh Sharma'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Parent Phone</span>
                  <span className="text-slate-200 font-semibold">{user.parentPhone || '+91 98000 11111'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Emergency Contact</span>
                  <span className="text-slate-200 font-semibold">{user.emergencyContact || '+91 98765 43210'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Student Mobile</span>
                  <span className="text-slate-200 font-semibold">{user.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Home Permanent Address</span>
                  <span className="text-slate-200 font-medium">{user.address || 'Flat 402, Green Avenue, Campus Town'}</span>
                </div>
              </div>
            </div>

            {/* Academic Qualifications, Government Document Vault & Study Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Academic Qualifications & Document Vault</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Records
                </span>
              </div>

              {/* Education Records */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  🎓 Educational Certificates & Degrees
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-400">Class 10 CBSE</span>
                      <span className="text-[9px] text-emerald-400 font-black">94.2%</span>
                    </div>
                    <p className="font-bold text-white text-xs">Matriculation Certificate</p>
                    <p className="text-[10px] text-slate-500">DAV Public School (CBSE)</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-400">Class 12 CHSE</span>
                      <span className="text-[9px] text-emerald-400 font-black">91.8%</span>
                    </div>
                    <p className="font-bold text-white text-xs">Higher Secondary Science</p>
                    <p className="text-[10px] text-slate-500">BJB Junior College</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400">B.Tech (CSE)</span>
                      <span className="text-[9px] text-emerald-400 font-black">8.95 CGPA</span>
                    </div>
                    <p className="font-bold text-white text-xs">Sem 1 to 4 Transcripts</p>
                    <p className="text-[10px] text-slate-500">Autonomous Degree</p>
                  </div>
                </div>
              </div>

              {/* Government ID Documents Locker */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  🪪 Government Identity Documents (Authenticated Vault)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-400 block">Aadhaar Card</span>
                    <span className="font-mono text-white text-[11px] font-bold">XXXX-4219</span>
                    <span className="text-[9px] text-slate-500 block">UIDAI Verified ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-blue-400 block">PAN Card</span>
                    <span className="font-mono text-white text-[11px] font-bold">ABCDE1234F</span>
                    <span className="text-[9px] text-slate-500 block">Income Tax Dept ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-purple-400 block">Voter ID Card</span>
                    <span className="font-mono text-white text-[11px] font-bold">OD/02/123...</span>
                    <span className="text-[9px] text-slate-500 block">ECI Verified ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-rose-400 block">Birth Cert</span>
                    <span className="font-mono text-white text-[11px] font-bold">BMC/09421</span>
                    <span className="text-[9px] text-slate-500 block">Municipal Corp ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-teal-400 block">Income Certificate</span>
                    <span className="font-mono text-white text-[11px] font-bold">Rs 2,40,000/-</span>
                    <span className="text-[9px] text-slate-500 block">Revenue Tahsildar ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 block">Caste Certificate</span>
                    <span className="font-mono text-white text-[11px] font-bold">SEBC / OBC</span>
                    <span className="text-[9px] text-slate-500 block">Govt Certified ✅</span>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 col-span-2">
                    <span className="text-[10px] font-bold text-sky-400 block">Residence / Domicile</span>
                    <span className="font-mono text-white text-[11px] font-bold">DOM/2026/OD/774012</span>
                    <span className="text-[9px] text-slate-500 block">Permanent Odisha Resident ✅</span>
                  </div>
                </div>
              </div>

              {/* Study & Dev Links */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  🌐 Study & Career Website Profiles
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://linkedin.com/in/subham-pradhan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold hover:bg-blue-600 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>LinkedIn (500+) ↗</span>
                  </a>
                  <a
                    href="https://github.com/subham-pradhan-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold hover:bg-slate-700 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>GitHub (28 Repos) ↗</span>
                  </a>
                  <a
                    href="https://leetcode.com/u/subham_codes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold hover:bg-amber-600 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>LeetCode (300+ Solved) ↗</span>
                  </a>
                  <a
                    href="https://subhampradhan.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold hover:bg-purple-600 hover:text-white transition flex items-center space-x-1"
                  >
                    <span>Portfolio Website ↗</span>
                  </a>
                </div>
              </div>

              {/* Resume & Skills */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-white text-xs block">
                    Subham_Pradhan_Resume_2026.pdf
                  </span>
                  <p className="text-[10px] text-slate-400">Full-Stack Cloud Developer • B.Tech CSE (8.95 CGPA)</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Downloading official student resume PDF...')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>
              </div>
            </div>

            {/* Fee Dues & Payments */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Fee Invoices & Dues</span>
                </span>
              </div>

              {bills.length === 0 ? (
                <p className="text-xs text-slate-400">No pending fee statements</p>
              ) : (
                bills.map((b) => (
                  <div key={b.id} className="border border-slate-800 rounded-2xl p-3.5 bg-slate-950/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{b.title}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          b.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Total: ₹{b.totalAmount.toLocaleString()}</span>
                      <span>Paid: ₹{b.paidAmount.toLocaleString()}</span>
                      <span className="font-bold text-rose-400">
                        Due: ₹{b.dueAmount.toLocaleString()}
                      </span>
                    </div>
                    {b.dueAmount > 0 && (
                      <button
                        onClick={async () => {
                          await fetch(`${API_BASE}/billing/${b.id}/pay`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${user.token}`
                            },
                            body: JSON.stringify({ amount: b.dueAmount, method: 'UPI' })
                          });
                          alert('Payment Confirmed! Digital receipt generated.');
                          fetchData(user.token, user.id);
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 rounded-xl transition text-xs shadow-md cursor-pointer"
                      >
                        Pay Due ₹{b.dueAmount.toLocaleString()} via Instant UPI
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Registered Vehicles */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Car className="w-4 h-4 text-indigo-400" />
                  <span>Campus Parking Pass</span>
                </span>
                <button
                  onClick={() => setShowVehicleModal(true)}
                  className="text-xs text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  + Add Vehicle
                </button>
              </div>

              {vehicles.length === 0 ? (
                <p className="text-xs text-slate-400">No vehicle registered for digital parking sticker</p>
              ) : (
                vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() =>
                      setShowQrModal({
                        title: 'Vehicle Digital Parking Sticker',
                        qrValue: v.digitalPassQr,
                        subtitle: `${v.licensePlate} • ${v.parkingSlot}`
                      })
                    }
                    className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/80 transition"
                  >
                    <div>
                      <span className="font-bold text-white block">{v.licensePlate}</span>
                      <span className="text-[10px] text-slate-400">{v.parkingSlot}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400 font-semibold text-xs">
                      <span>Sticker QR</span>
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* 4. PERSISTENT FLOATING EMERGENCY SOS BUTTON */}
      <button
        onClick={() => setShowSosModal(true)}
        className="fixed bottom-16 right-4 sm:right-[max(1rem,calc(50%-13rem))] z-40 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-black text-xs px-3.5 py-2.5 rounded-full shadow-2xl flex items-center space-x-1.5 animate-pulse border-2 border-white/90 cursor-pointer active:scale-95 transition"
      >
        <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
        <span className="tracking-wider">{t.sosEmergency}</span>
      </button>

      {/* 5. BOTTOM NAVIGATION BAR - SLEEK MOBILE APP RATIO */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 grid grid-cols-7 py-1 px-1 z-30 shadow-2xl">
        <button
          onClick={() => setActiveTab('HOME')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'HOME'
              ? 'bg-blue-600/15 text-blue-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navHome}</span>
        </button>

        <button
          onClick={() => setActiveTab('PASSES')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'PASSES'
              ? 'bg-blue-600/15 text-blue-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navPasses}</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLAINTS')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'COMPLAINTS'
              ? 'bg-blue-600/15 text-blue-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navTickets}</span>
        </button>

        <button
          onClick={() => setActiveTab('GALLERY')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'GALLERY'
              ? 'bg-emerald-500/15 text-emerald-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navGallery}</span>
        </button>

        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'CALENDAR'
              ? 'bg-violet-500/15 text-violet-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navEvents}</span>
        </button>

        <button
          onClick={() => setActiveTab('MENU')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'MENU'
              ? 'bg-orange-500/15 text-orange-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navMenu}</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition cursor-pointer ${
            activeTab === 'PROFILE'
              ? 'bg-blue-600/15 text-blue-400 font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="text-[8px] mt-0.5 tracking-tight font-semibold truncate max-w-[48px]">{t.navProfile}</span>
        </button>
      </nav>

      {/* ========================================================= */}
      {/* MODAL 1: EDIT PROFILE & PHOTO UPLOAD                      */}
      {/* ========================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-extrabold text-sm text-white">Edit Student Profile</h3>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center text-center space-y-2">
              <label
                htmlFor="modal-avatar-file-input"
                className="relative group cursor-pointer block"
                title="Click to choose a new profile photo"
              >
                <img
                  src={editAvatar}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-2xl border-2 border-blue-500 object-cover shadow-xl group-hover:scale-105 transition"
                />
                <div
                  className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition pointer-events-none"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-bold">Upload</span>
                </div>
              </label>

              {/* Direct file input for modal photo upload */}
              <input
                id="modal-avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleModalAvatarFileUpload}
                className="sr-only"
              />

              <div className="flex items-center space-x-2 flex-wrap gap-1.5 justify-center">
                <label
                  htmlFor="modal-avatar-file-input"
                  className="text-xs bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 inline pointer-events-none" />
                  <span>Choose Photo File</span>
                </label>

                {editAvatar !== user.avatar && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!user) return;
                      try {
                        await fetch(`${API_BASE}/residents/profile`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`
                          },
                          body: JSON.stringify({ avatarUrl: editAvatar })
                        });
                        const updated = { ...user, avatar: editAvatar };
                        setUser(updated);
                        try {
                          localStorage.setItem('shms_resident_user', JSON.stringify(updated));
                          localStorage.setItem('shms_student_avatar', editAvatar);
                        } catch {}
                        setProfileSuccessMsg('✓ Photo updated successfully!');
                      } catch {
                        setProfileSuccessMsg('Photo saved for your session!');
                      }
                    }}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl shadow transition cursor-pointer"
                  >
                    ✓ Save Photo Now
                  </button>
                )}
              </div>

              {/* Avatar Preset Selector */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                  Or select a student preset avatar:
                </span>
                <div className="flex items-center space-x-2 justify-center">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <img
                      key={idx}
                      src={p}
                      alt="Preset"
                      onClick={() => {
                        setEditAvatar(p);
                        if (user) {
                          const updated = { ...user, avatar: p };
                          setUser(updated);
                          try {
                            localStorage.setItem('shms_resident_user', JSON.stringify(updated));
                            localStorage.setItem('shms_student_avatar', p);
                          } catch {}
                        }
                      }}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition border-2 ${
                        editAvatar === p ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Hostel Block</label>
                  <input
                    type="text"
                    value={editBlock}
                    onChange={(e) => setEditBlock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Room Number</label>
                  <input
                    type="text"
                    value={editRoom}
                    onChange={(e) => setEditRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Degree / Course</label>
                  <input
                    type="text"
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Blood Group</label>
                  <select
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Dietary Preference</label>
                  <select
                    value={editDietaryPreference}
                    onChange={(e) => setEditDietaryPreference(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {['Vegetarian', 'Eggetarian', 'Non-Vegetarian', 'Jain', 'Vegan'].map((dp) => (
                      <option key={dp} value={dp}>{dp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    value={editParentName}
                    onChange={(e) => setEditParentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Parent Phone Number</label>
                  <input
                    type="text"
                    value={editParentPhone}
                    onChange={(e) => setEditParentPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={editEmergencyContact}
                  onChange={(e) => setEditEmergencyContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Permanent Home Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RAISE COMPLAINT (TEXT, VOICE NOTE, PHOTO, VIDEO) */}
      {/* ========================================================= */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 md:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                <h3 className="font-extrabold text-sm text-white">Raise Grievance Request</h3>
              </div>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Select From 8 Categories */}
            <div>
              <label className="text-[11px] font-black text-slate-300 block mb-2 uppercase tracking-wider">
                Step 1: Select Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COMPLAINT_CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const isSel = selectedComplaintCategory === c.key;
                  return (
                    <button
                      key={c.key}
                      onClick={() => setSelectedComplaintCategory(c.key)}
                      className={`p-2 rounded-2xl border flex flex-col items-center text-center transition cursor-pointer ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-102'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSel ? 'text-white' : c.color}`} />
                      <span className="text-[10px] font-bold leading-tight block">
                        {c.label}
                      </span>
                      <span className={`text-[8px] font-semibold mt-0.5 ${isSel ? 'text-blue-100' : 'text-slate-500'}`}>
                        {c.sla}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: 1-Tap Preset Issue Chips */}
            <div>
              <label className="text-[11px] font-black text-slate-300 block mb-1.5 uppercase tracking-wider">
                Step 2: 1-Tap Quick Issue Template
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(CATEGORY_PRESETS[selectedComplaintCategory] || CATEGORY_PRESETS.OTHER).map((txt) => (
                  <button
                    key={txt}
                    onClick={() => {
                      setComplaintTitle(txt);
                      setComplaintDesc(txt);
                    }}
                    className="text-[10px] bg-slate-950 hover:bg-blue-950/60 text-slate-300 hover:text-blue-300 px-2.5 py-1.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition font-medium text-left cursor-pointer"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Written Title & Description */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Issue Title (or pick template above)"
                value={complaintTitle}
                onChange={(e) => setComplaintTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <textarea
                rows={2}
                placeholder="Detailed description of the issue in your room..."
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Step 3: Multi-Format Attachments (Voice Note, Photo, Video) */}
            <div className="space-y-2.5 border-t border-slate-800 pt-3">
              <label className="text-[11px] font-black text-slate-300 block uppercase tracking-wider">
                Step 3: Attach Media Proof (Voice, Photo, Video)
              </label>

              {/* 1. Voice Note Recording Section */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className={`w-4 h-4 ${isRecordingVoice ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                    <span className="text-xs font-bold text-white">Voice Message</span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition cursor-pointer ${
                      isRecordingVoice
                        ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                        : complaintVoiceUrl
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isRecordingVoice ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop (0:{voiceRecordingSeconds.toString().padStart(2, '0')})</span>
                      </>
                    ) : complaintVoiceUrl ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Re-record</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Record Voice Note</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Voice Visualizer / Playing state */}
                {isRecordingVoice && (
                  <div className="flex items-center space-x-1 justify-center py-2">
                    {[12, 24, 16, 32, 20, 28, 14, 26, 18, 30].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-red-500 rounded-full animate-bounce"
                        style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                    <span className="text-xs font-bold text-red-400 ml-2">Recording voice note...</span>
                  </div>
                )}

                {complaintVoiceUrl && !isRecordingVoice && (
                  <div className="bg-slate-900 p-2 rounded-xl flex items-center justify-between border border-slate-800 text-xs">
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Voice note attached (0:{voiceRecordingSeconds.toString().padStart(2, '0')})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setComplaintVoiceUrl(null)}
                      className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                      title="Delete Voice Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Photo & Video Upload Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {/* Photo Upload */}
                <button
                  type="button"
                  onClick={() => complaintPhotoInputRef.current?.click()}
                  className="bg-slate-950/90 hover:bg-slate-800 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center space-x-2 text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{complaintPhotoUrl ? 'Photo Added ✓' : 'Upload Photo'}</span>
                </button>

                {/* Video Upload */}
                <button
                  type="button"
                  onClick={() => complaintVideoInputRef.current?.click()}
                  className="bg-slate-950/90 hover:bg-slate-800 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center space-x-2 text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>{complaintVideoUrl ? 'Video Added ✓' : 'Upload Video'}</span>
                </button>
              </div>

              <input
                ref={complaintPhotoInputRef}
                type="file"
                accept="image/*,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg,.heic,.heif,.avif"
                onChange={handleComplaintPhotoUpload}
                className="hidden"
              />

              <input
                ref={complaintVideoInputRef}
                type="file"
                accept="video/*,.mp4,.mov,.avi,.mkv,.webm,.3gp,.wmv"
                onChange={handleComplaintVideoUpload}
                className="hidden"
              />

              {/* Previews */}
              {complaintPhotoUrl && (
                <div className="relative inline-block mt-2">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Attached Photo:</span>
                  <img
                    src={complaintPhotoUrl}
                    alt="Photo preview"
                    className="w-24 h-24 rounded-xl object-cover border border-slate-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setComplaintPhotoUrl(null)}
                    className="absolute top-5 right-0 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs shadow-md cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {complaintVideoUrl && (
                <div className="bg-purple-950/40 border border-purple-500/30 p-2.5 rounded-2xl space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs text-purple-200">
                    <div className="flex items-center space-x-2 truncate">
                      <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate font-semibold">{complaintVideoName || 'Video Proof Attached'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setComplaintVideoUrl(null);
                        setComplaintVideoName(null);
                      }}
                      className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <video
                    src={complaintVideoUrl}
                    controls
                    className="w-full max-h-36 rounded-xl object-contain bg-black/80 border border-purple-500/20 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymousComplaint}
                onChange={(e) => setIsAnonymousComplaint(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 bg-slate-950"
              />
              <label htmlFor="anon" className="text-[11px] text-slate-400">
                Submit anonymously (Warden will not see your name)
              </label>
            </div>

            <button
              onClick={submitComplaint}
              disabled={submittingComplaint}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-2xl transition text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {submittingComplaint ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Grievance to Department</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EMERGENCY SOS                                    */}
      {/* ========================================================= */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 text-red-500 font-black text-sm tracking-wide">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span>CONFIRM EMERGENCY SIREN</span>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Broadcasting an emergency alerts Campus Security, Warden, and Admin Desk with your live room location (
              <strong className="text-white">Room {user.room}, {user.block}</strong>).
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => triggerEmergency('MEDICAL')}
                className="bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500 text-red-300 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <HeartPulse className="w-7 h-7 text-red-400 mb-1" />
                <span className="text-xs font-black">Medical</span>
                <span className="text-[9px] text-red-300">Ambulance & 24×7 Vehicle</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEmergency('SECURITY_THREAT')}
                className="bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500 text-purple-300 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <ShieldAlert className="w-7 h-7 text-purple-400 mb-1" />
                <span className="text-xs font-black">Security Threat</span>
                <span className="text-[9px] text-purple-300">Guard QRT Patrol</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEmergency('FIRE')}
                className="bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500 text-amber-300 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <Flame className="w-7 h-7 text-amber-400 mb-1" />
                <span className="text-xs font-black">Fire & Hazard</span>
                <span className="text-[9px] text-amber-300">Evacuation Alarm</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEmergency('WARDEN')}
                className="bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500 text-blue-300 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <Building className="w-7 h-7 text-blue-400 mb-1" />
                <span className="text-xs font-black">Hostel Warden</span>
                <span className="text-[9px] text-blue-300">Urgent Room Crisis</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEmergency('ANTI_RAGGING')}
                className="bg-pink-500/10 hover:bg-pink-500/20 border-2 border-pink-500 text-pink-300 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-7 h-7 text-pink-400 mb-1" />
                <span className="text-xs font-black">Anti-Ragging / Women</span>
                <span className="text-[9px] text-pink-300">Confidential Cell</span>
              </button>

              <button
                type="button"
                onClick={() => triggerEmergency('OTHER')}
                className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-slate-200 p-3 rounded-2xl flex flex-col items-center text-center transition active:scale-95 shadow-md cursor-pointer"
              >
                <AlertTriangle className="w-7 h-7 text-slate-300 mb-1" />
                <span className="text-xs font-black">Other Crisis</span>
                <span className="text-[9px] text-slate-400">Immediate Help</span>
              </button>
            </div>

            {/* Direct Calling Quick Links */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Direct Crisis Helplines (1-Tap Call)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+919437000108"
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-between text-rose-300 border border-slate-700 transition"
                >
                  <span className="font-bold">🚑 Ambulance</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href="tel:+919437088214"
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-between text-blue-300 border border-slate-700 transition"
                >
                  <span className="font-bold">🛡️ Security Gate</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href="tel:+919861022345"
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-between text-amber-300 border border-slate-700 transition"
                >
                  <span className="font-bold">🏠 Chief Warden</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href="tel:112"
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-between text-emerald-300 border border-slate-700 transition"
                >
                  <span className="font-bold">👮 Police 112</span>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {sosStatus === 'SENT' && (
              <div className="bg-emerald-600 text-white p-3 rounded-xl text-center text-xs font-bold animate-pulse">
                🚨 SIREN SENT! Warden & Security Desk Alerted. Help is on the way!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: GATE PASS / LEAVE REQUEST                        */}
      {/* ========================================================= */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-3.5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">
                Apply for {passType === 'GATE_PASS' ? 'Gate Pass' : 'Leave'}
              </h3>
              <button
                onClick={() => setShowPassModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex border border-slate-800 rounded-xl p-1 bg-slate-950">
              <button
                onClick={() => setPassType('GATE_PASS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  passType === 'GATE_PASS' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Gate Pass (Today)
              </button>
              <button
                onClick={() => setPassType('LEAVE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  passType === 'LEAVE' ? 'bg-purple-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Leave (Multi-day)
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Destination</label>
                <input
                  type="text"
                  value={passDestination}
                  onChange={(e) => setPassDestination(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Sector 18 Market or Hometown"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Reason</label>
                <input
                  type="text"
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Buying project stationery"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Duration (Hours / Days)
                </label>
                <select
                  value={passHours}
                  onChange={(e) => setPassHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="2">2 Hours (Auto-Approval eligible)</option>
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours (Full Day)</option>
                  <option value="48">2 Days (Warden Approval)</option>
                  <option value="96">4 Days (Leave to Hometown)</option>
                </select>
              </div>
            </div>

            <button
              onClick={submitPassRequest}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-2xl transition text-xs shadow-md cursor-pointer"
            >
              Generate Turnstile Pass & QR
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: VISITOR PRE-APPROVAL                             */}
      {/* ========================================================= */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-3.5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">Pre-Approve Visitor</h3>
              <button
                onClick={() => setShowVisitorModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Visitor Name</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Ramesh Sharma"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Phone Number</label>
                <input
                  type="text"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Purpose</label>
                <input
                  type="text"
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Family visit / Dropping books"
                />
              </div>
            </div>

            <button
              onClick={submitVisitor}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-2xl transition text-xs shadow-md cursor-pointer"
            >
              Generate Visitor Pass OTP / QR
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 6: VEHICLE REGISTRATION                             */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-3.5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">Register Campus Vehicle</h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="TWO_WHEELER">Two-Wheeler (Motorbike / Scooter)</option>
                  <option value="BICYCLE">Bicycle</option>
                  <option value="FOUR_WHEELER">Car (Requires special parking pass)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">License Plate Number</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. DL-3S-AB-1234"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Model / Make</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Honda Activa 6G"
                />
              </div>
            </div>

            <button
              onClick={submitVehicle}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-2xl transition text-xs shadow-md cursor-pointer"
            >
              Issue Digital Parking Sticker
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 7: QR CODE DISPLAY MODAL                            */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-extrabold text-sm text-white">{showQrModal.title}</h3>

            <div className="bg-white p-4 rounded-2xl border-4 border-slate-800 inline-block shadow-2xl">
              <QRCodeSVG value={showQrModal.qrValue} size={180} />
            </div>

            <div className="text-xs text-slate-300">
              <p className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 py-1 px-2.5 rounded-lg inline-block border border-emerald-500/20">
                {showQrModal.qrValue}
              </p>
              <p className="text-[11px] text-slate-400 mt-1.5">{showQrModal.subtitle}</p>
            </div>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Close QR Pass
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 8: COMPLAINT RESOLUTION RATING MODAL                */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xs rounded-3xl p-5 text-center space-y-3 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-extrabold text-sm text-white">Rate Service Quality</h3>
            <p className="text-xs text-slate-400">Your rating feeds NAAC campus audit analytics</p>

            <div className="flex justify-center space-x-2 text-2xl text-amber-400 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingVal(star)}
                  className={`transition cursor-pointer ${star <= ratingVal ? 'scale-110' : 'opacity-30'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Optional comment (e.g. Fixed quickly!)"
              value={ratingText}
              onChange={(e) => setRatingText(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={submitRating}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 9: CAMPUS DIRECTORY & WARDEN CONTACTS               */}
      {showDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white">Campus Key Contacts Directory</h3>
                <p className="text-[10px] text-slate-400">Direct phone call access to campus authorities & services</p>
              </div>
              <button
                onClick={() => setShowDirectoryModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  role: 'Principal & Director',
                  badge: 'Leadership',
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  name: 'Prof. (Dr.) Vikramaditya Sen, Ph.D.',
                  office: 'Admin Block A (Room 101)',
                  phone: '+91 94370 11223'
                },
                {
                  role: 'Dean (Student Welfare)',
                  badge: 'Deanery',
                  badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                  name: 'Prof. (Dr.) S.K. Mohanty, Ph.D.',
                  office: 'Academic Block A (Room 202)',
                  phone: '+91 94370 22334'
                },
                {
                  role: 'Chief Hostel Warden',
                  badge: 'Hostel',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  name: 'Dr. K.P. Mohapatra',
                  office: 'Hostel Block A Warden Office',
                  phone: '+91 98610 22345'
                },
                {
                  role: 'Campus Security In-Charge',
                  badge: 'Security',
                  badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
                  name: 'Inspector Rajesh Nayak',
                  office: 'Main Gate 1 Security Tower (24x7)',
                  phone: '+91 94370 88214'
                },
                {
                  role: 'Service Member (Maintenance & Mess)',
                  badge: 'Services',
                  badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  name: 'Ranjan Mohanty',
                  office: 'Facility Desk (Electrician, Plumber, Dining)',
                  phone: '+91 99371 44520'
                },
                {
                  role: 'Chief Medical Officer',
                  badge: 'Medical & Emergency',
                  badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  name: 'Dr. Pratima Mishra, MD',
                  office: 'Campus Dispensary & Emergency Clinic (24x7)',
                  phone: '+91 98611 77332'
                }
              ].map((c) => (
                <div key={c.role} className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between text-xs gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                        {c.badge}
                      </span>
                      <span className="font-extrabold text-white text-xs truncate">{c.role}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-300 truncate">{c.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{c.office}</p>
                    <p className="text-xs font-mono font-bold text-amber-300">{c.phone}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition shrink-0 cursor-pointer"
                    title={`Call ${c.name}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Emergency Security Desk:</span>
              <a href="tel:+919437088214" className="text-emerald-400 font-bold hover:underline">
                📞 +91 94370 88214
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 10: SUGGESTION BOX TO DIRECTOR                      */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">Suggestion Box</h3>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Submit ideas directly to the Hostel Director & Chief Warden anonymously.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Can we extend library reading hours till 2 AM during exam week?"
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={async () => {
                if (!suggestionText) return;
                await fetch(`${API_BASE}/compliance/suggestions`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: 'Resident Campus Suggestion',
                    content: suggestionText,
                    isAnonymous: true
                  })
                });
                alert('Suggestion forwarded to Hostel Director & Chief Warden!');
                setSuggestionText('');
                setShowCommunityModal(false);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Submit to Director
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 11: FOOD DELIVERY STYLE LIVE ORDER & TICKET TRACKER */}
      {/* ========================================================= */}
      {showOrderTrackerModal && trackedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Live Order & Request Tracker</h3>
                  <span className="text-[10px] text-slate-400 font-mono">#{trackedOrder.id}</span>
                </div>
              </div>
              <button
                onClick={() => setShowOrderTrackerModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Item Title & Summary */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  {trackedOrder.category || trackedOrder.passType || 'CAMPUS TICKET'}
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                  trackedOrder.status === 'RESOLVED' || trackedOrder.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                }`}>
                  {trackedOrder.status?.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-extrabold text-white text-xs">{trackedOrder.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {trackedOrder.description || trackedOrder.reason || 'Campus Request'}
              </p>
            </div>

            {/* Visual 4-Step Order Tracker Timeline (Swiggy / Zomato / Food Delivery Style) */}
            <div className="space-y-4 pt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Live Journey Tracking
              </span>

              <div className="space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {/* Node 1: Request Placed */}
                <div className="relative">
                  <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black shadow-md">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">1. Order Placed / Submitted</h5>
                    <p className="text-[10px] text-slate-400">
                      Logged into Central Campus Engine • {new Date(trackedOrder.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Node 2: Assigned to Technician / Department */}
                <div className="relative">
                  <div className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                    trackedOrder.status !== 'RAISED'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-blue-600 text-white animate-pulse'
                  }`}>
                    {trackedOrder.status !== 'RAISED' ? '✓' : '2'}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs">
                      2. Auto-Routed & Assigned to Specialist
                    </h5>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-blue-300 block text-[11px]">
                          {trackedOrder.assignedStaff || 'Specialist Technician'}
                        </strong>
                        <span className="text-[10px] text-slate-500">Auto-assigned via Category Routing</span>
                      </div>
                      {trackedOrder.staffPhone && (
                        <a
                          href={`tel:${trackedOrder.staffPhone}`}
                          className="px-2 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Node 3: Technician In-Transit / Processing */}
                <div className="relative">
                  <div className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                    trackedOrder.status === 'RESOLVED' || trackedOrder.status === 'ACTIVE'
                      ? 'bg-emerald-500 text-slate-950'
                      : trackedOrder.status === 'IN_PROGRESS' || trackedOrder.status === 'APPROVED'
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {trackedOrder.status === 'RESOLVED' || trackedOrder.status === 'ACTIVE' ? '✓' : '3'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="font-bold text-white text-xs">3. In Progress (Technician Dispatched)</h5>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                        ETA: ~35 mins
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Technician dispatched with required spares. Arriving at Room {user?.room || user?.residentProfile?.roomNumber || 'A-302'}.
                    </p>
                  </div>
                </div>

                {/* Node 4: Resolved / Closed */}
                <div className="relative">
                  <div className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                    trackedOrder.status === 'RESOLVED'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {trackedOrder.status === 'RESOLVED' ? '✓' : '4'}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">4. Service Completed & Verified</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {trackedOrder.status === 'RESOLVED'
                        ? 'Job marked fixed. Service verified by hostel audit trail.'
                        : 'Final closure confirmation & resident 5-star rating.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Code Fallback Pill */}
            {trackedOrder.offlineCode && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px]">Keypad Fallback Code:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {trackedOrder.offlineCode}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowOrderTrackerModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Close Tracker View
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 12: 2G SMS FALLBACK & FEATURE PHONE GATEPASS MODAL  */}
      {/* ========================================================= */}
      {showSmsFallbackModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-xl">
                  <PhoneCall className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-white">2G & Keypad SMS Fallback</h3>
                  <p className="text-[10px] text-slate-400">Zero Internet / Feature Phone Mode</p>
                </div>
              </div>
              <button
                onClick={() => setShowSmsFallbackModal(false)}
                className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Offline 6-Digit Passcode Card */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 p-4 rounded-2xl border border-amber-500/40 text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Your Offline Turnstile Code
              </span>
              <div className="text-2xl font-black text-white font-mono tracking-widest">
                PASS-749201
              </div>
              <p className="text-[10px] text-slate-400">
                Dictate this 6-digit number to the guard or punch into the turnstile keypad if your phone has no internet or is switched off.
              </p>
            </div>

            {/* SMS Commands Reference */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                SMS Shortcode Instructions (Carrier 56070)
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-amber-300 font-bold">PASS OUT 3HRS</span>
                  <span className="text-slate-400 text-[10px]">Instant 3h Gatepass</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-blue-300 font-bold">STATUS</span>
                  <span className="text-slate-400 text-[10px]">Ticket & Pass Status</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-red-300 font-bold">SOS</span>
                  <span className="text-slate-400 text-[10px]">Emergency Rapid Siren</span>
                </div>
              </div>
            </div>

            {/* Interactive Student SMS Simulator */}
            <div className="border-t border-slate-800 pt-3 space-y-2.5">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider block">
                Test SMS Carrier Gateway Now:
              </span>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={smsTestInput}
                  onChange={(e) => setSmsTestInput(e.target.value)}
                  placeholder="e.g. PASS OUT 3HRS"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleTestStudentSms}
                  disabled={smsTestLoading}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {smsTestLoading ? 'Sending...' : 'Send SMS'}
                </button>
              </div>

              {smsTestReply && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40 text-xs space-y-1 animate-in zoom-in-95">
                  <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Incoming Reply from Campus Shortcode 56070:</span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-200 whitespace-pre-line bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {smsTestReply.replySms}
                  </p>
                  {smsTestReply.offlineCode && (
                    <span className="text-[10px] text-emerald-300 block font-semibold">
                      ✓ Gate pass issued with code: <strong>{smsTestReply.offlineCode}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSmsFallbackModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 13: PWA INSTALLATION & OFFLINE VAULT MODAL              */}
      {/* ============================================================== */}
      {showPwaInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">PWA & Offline Vault</h3>
                  <p className="text-[10px] text-slate-400">Installable Mobile App • Zero-Network Caching</p>
                </div>
              </div>
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Offline Vault Diagnostic Card */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Local Vault Diagnostic
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Network State</span>
                  <span className={`text-xs font-bold ${isOffline ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {isOffline ? '⚡ Offline' : '● Online'}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">App Status</span>
                  <span className="text-xs font-bold text-blue-400">
                    {isAppInstalled ? 'Installed ✓' : 'Web / PWA'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cached Gate Passes:</span>
                  <strong className="text-white">{offlineVaultStats?.passCount || passes.length} Passes (QR + Codes)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Today's Mess Menu:</span>
                  <strong className="text-emerald-400">Cached in Service Worker</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Numbers:</span>
                  <strong className="text-white">Wardens & Guards Saved</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Vault Sync:</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {offlineVaultStats?.cachedAt ? new Date(offlineVaultStats.cachedAt).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Click Install Button or Guide */}
            {isInstallable ? (
              <button
                onClick={handleInstallApp}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-2xl shadow-xl shadow-blue-600/30 text-xs flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install Resident App on Phone Home Screen</span>
              </button>
            ) : (
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  How to Install on Phone:
                </span>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <strong className="text-blue-300 block">🤖 On Android (Chrome / Edge / Samsung Internet):</strong>
                  <p className="text-slate-400">
                    Tap the browser menu <strong>(⋮)</strong> and select <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong>.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                  <strong className="text-blue-300 block">🍎 On iPhone / iPad (Safari):</strong>
                  <p className="text-slate-400">
                    Tap the <strong>Share</strong> button at bottom (square with arrow) and tap <strong>"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (user?.token && user?.id) {
                  fetchData(user.token, user.id);
                }
                setShowPwaInstallModal(false);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Refresh Offline Vault & Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GALLERY MEDIA LIGHTBOX & VIDEO PLAYER              */}
      {/* ========================================================= */}
      {previewMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 space-y-0">
            <div className="p-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">
                {previewMediaModal.category?.replace('_', ' ')}
              </span>
              <button
                onClick={() => setPreviewMediaModal(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
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

            <div className="p-4 space-y-3 bg-slate-900">
              <div>
                <h3 className="font-extrabold text-sm text-white">{previewMediaModal.title}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{previewMediaModal.date}</p>
                {previewMediaModal.description && (
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{previewMediaModal.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleLikeGalleryItem(previewMediaModal.id);
                    setPreviewMediaModal((curr: any) =>
                      curr ? { ...curr, likes: (curr.likes || 0) + 1 } : curr
                    );
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl font-bold text-xs transition cursor-pointer active:scale-110"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{previewMediaModal.likesCount || previewMediaModal.likes || 0} Cheers</span>
                </button>

                <button
                  onClick={() => setPreviewMediaModal(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CALENDAR EVENT DETAILS                             */}
      {/* ========================================================= */}
      {selectedCalendarEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {selectedCalendarEvent.category}
              </span>
              <button
                onClick={() => setSelectedCalendarEvent(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-white">{selectedCalendarEvent.title}</h3>
              {selectedCalendarEvent.description && (
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedCalendarEvent.description}</p>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-violet-400" />
                  <span>Event Date:</span>
                </span>
                <strong className="text-white">{selectedCalendarEvent.date}</strong>
              </div>

              {selectedCalendarEvent.time && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Timing:</span>
                  </span>
                  <strong className="text-white">{selectedCalendarEvent.time}</strong>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Venue:</span>
                </span>
                <strong className="text-white">{selectedCalendarEvent.venue || 'Campus Wide'}</strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedCalendarEvent(null)}
              className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
