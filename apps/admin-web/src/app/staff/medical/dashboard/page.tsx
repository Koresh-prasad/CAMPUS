'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '../../../../components/RoleGuard';
import {
  Heart,
  Activity,
  Plus,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  LogOut,
  RefreshCw,
  Building,
  User,
  ShieldCheck,
  Calendar,
  Pill,
  Thermometer,
  FileText,
  Ambulance,
  Bed,
  Check,
  X,
  Stethoscope,
  Share2,
  Syringe,
  Droplet,
  Sliders,
  Send,
  HelpCircle,
  Bell,
  Download,
  Printer,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award,
  KeyRound,
  CheckCheck,
  MapPin,
  Camera,
} from 'lucide-react';

import {
  MedicalTab,
  MedicalRequestType,
  MedicalUrgency,
  MedicalRequestStatus,
  MedicalRequest,
  MedicalAppointment,
  MedicalVisitRecord,
  MedicalLeaveRecord,
  MedicineInventoryItem,
  AmbulanceReferralRecord,
  MedicalReportItem,
  MedicalOfficerProfile,
} from './types';

import {
  INITIAL_MEDICAL_OFFICER,
  INITIAL_MEDICAL_REQUESTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_VISITS,
  INITIAL_MEDICAL_LEAVES,
  INITIAL_MEDICINE_INVENTORY,
  INITIAL_AMBULANCE_REFERRALS,
  INITIAL_MEDICAL_REPORTS,
} from './mockData';

import {
  CreateMedicalRequestModal,
  ConsultationDiagnosisModal,
  ScheduleAppointmentModal,
  AmbulanceReferralModal,
  AddMedicineModal,
  MedicalHelpModal,
} from './modals';

const API_BASE = '/api';

export default function MedicalDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={['DOCTOR', 'NURSE', 'MEDICAL', 'STAFF', 'DIRECTOR', 'ADMIN']}
      portalTitle="Campus Health & Medical Center"
    >
      {({ user, token, logout }) => (
        <MedicalPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function MedicalPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  // Navigation & Settings
  const [activeTab, setActiveTab] = useState<MedicalTab>('DASHBOARD');
  const [toastMsg, setToastMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Doctor Profile
  const [officer, setOfficer] = useState<MedicalOfficerProfile>(() => {
    if (user?.name) {
      return {
        ...INITIAL_MEDICAL_OFFICER,
        name: user.name,
      };
    }
    return INITIAL_MEDICAL_OFFICER;
  });

  // Core Data States
  const [requests, setRequests] = useState<MedicalRequest[]>(INITIAL_MEDICAL_REQUESTS);
  const [appointments, setAppointments] = useState<MedicalAppointment[]>(INITIAL_APPOINTMENTS);
  const [visits, setVisits] = useState<MedicalVisitRecord[]>(INITIAL_MEDICAL_VISITS);
  const [medicalLeaves, setMedicalLeaves] = useState<MedicalLeaveRecord[]>(INITIAL_MEDICAL_LEAVES);
  const [inventory, setInventory] = useState<MedicineInventoryItem[]>(INITIAL_MEDICINE_INVENTORY);
  const [referrals, setReferrals] = useState<AmbulanceReferralRecord[]>(INITIAL_AMBULANCE_REFERRALS);
  const [reports, setReports] = useState<MedicalReportItem[]>(INITIAL_MEDICAL_REPORTS);

  // Filters & Search
  const [requestTypeFilter, setRequestTypeFilter] = useState<'ALL' | MedicalRequestType>('ALL');
  const [requestSearch, setRequestSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  // Selected Objects for Modals
  const [selectedRequestForConsult, setSelectedRequestForConsult] = useState<MedicalRequest | null>(null);

  // Modals Visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAmbulanceModal, setShowAmbulanceModal] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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

  // Two-way synchronization with Student Platform SOS & Backend Emergency API
  useEffect(() => {
    const syncMedicalEmergency = async () => {
      try {
        // 1. Sync active SOS from localStorage
        const savedSos = localStorage.getItem('shms_active_emergency');
        if (savedSos) {
          try {
            const parsed = JSON.parse(savedSos);
            if (parsed?.id && !requests.some((r) => r.id === parsed.id)) {
              setRequests((prev) => [
                {
                  id: parsed.id,
                  ticketNumber: `EM-SOS-${Date.now().toString().slice(-4)}`,
                  studentName: parsed.studentName || 'Student Resident',
                  studentId: parsed.studentId || 'CS2023042',
                  studentRoll: parsed.studentRoll || 'REC-2023-CS042',
                  studentPhone: parsed.phone || '+91 98765 43210',
                  parentPhone: parsed.parentPhone || '+91 94370 88990',
                  hostel: parsed.hostel || 'Nilgiri Residence (Block A)',
                  room: parsed.room || 'A-204',
                  requestType: 'Emergency',
                  description: `DISTRESS SOS TRIGGERED: ${parsed.notes || 'Immediate medical attention required'} at ${parsed.location || 'Hostel'}`,
                  urgency: 'EMERGENCY',
                  dateTime: parsed.timestamp || 'Just now',
                  status: 'New',
                  attendingStaff: 'Dr. Pratima Mishra, MD',
                },
                ...prev,
              ]);
            }
          } catch (e) {}
        }

        // 2. Sync from backend active emergency API
        const emRes = await fetch(`${API_BASE}/emergency/active`, { credentials: 'omit' }).catch(() => null);
        if (emRes && emRes.ok) {
          const apiAlerts = await emRes.json();
          if (Array.isArray(apiAlerts) && apiAlerts.length > 0) {
            setRequests((prev) => {
              const ids = new Set(prev.map((r) => r.id));
              const fresh = apiAlerts
                .filter((a: any) => !ids.has(a.id))
                .map((a: any) => ({
                  id: a.id,
                  ticketNumber: `EM-SOS-${a.id.slice(0, 5)}`,
                  studentName: a.residentName || 'Student Patient',
                  studentId: a.residentId || 'CS2023042',
                  studentRoll: a.residentId || 'REC-CS-000',
                  studentPhone: a.residentPhone || '+91 98765 43210',
                  parentPhone: a.parentPhone || '+91 94370 88990',
                  hostel: a.blockName || 'Nilgiri Residence',
                  room: a.roomNumber || 'Room',
                  requestType: 'Emergency' as MedicalRequestType,
                  description: a.notes || 'Active SOS alert received via Campus Emergency system',
                  urgency: 'EMERGENCY' as MedicalUrgency,
                  dateTime: 'Just now',
                  status: 'New' as MedicalRequestStatus,
                  attendingStaff: 'Dr. Pratima Mishra, MD',
                }));
              return [...fresh, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn('Medical sync notice:', err);
      }
    };

    syncMedicalEmergency();
    const interval = setInterval(syncMedicalEmergency, 8000);
    return () => clearInterval(interval);
  }, []);

  // Save Consultation Action
  const handleSaveConsultation = (
    reqId: string,
    status: MedicalRequestStatus,
    prescription: string,
    doctorNotes: string,
    medicalLeaveRecommended: boolean,
    leaveDays?: number
  ) => {
    const target = requests.find((r) => r.id === reqId);

    // 1. Update Request
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status,
              prescription,
              doctorNotes,
              medicalLeaveRecommended,
              medicalLeaveDays: leaveDays,
            }
          : r
      )
    );

    // 2. Prepend Visit Record
    if (target) {
      const newVisit: MedicalVisitRecord = {
        id: `vis-${Date.now()}`,
        visitNumber: `OPD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentName: target.studentName,
        studentRoll: target.studentRoll,
        hostel: target.hostel,
        room: target.room,
        visitDate: 'Today',
        visitTime: currentTime || 'Now',
        diagnosis: doctorNotes,
        treatment: prescription,
        prescribedMedicines: prescription.split(',').map((s) => s.trim()),
        attendingDoctor: officer.name,
      };
      setVisits((prev) => [newVisit, ...prev]);

      // 3. If medical leave recommended, issue leave record (protecting privacy)
      if (medicalLeaveRecommended && leaveDays) {
        const newLeave: MedicalLeaveRecord = {
          id: `ml-${Date.now()}`,
          leaveNumber: `MED-LV-2026-${Math.floor(100 + Math.random() * 900)}`,
          studentName: target.studentName,
          studentRoll: target.studentRoll,
          hostel: target.hostel,
          room: target.room,
          startDate: 'Today',
          endDate: `+${leaveDays} days`,
          days: leaveDays,
          operationalReason: `Medical bed rest recommended by Chief Medical Officer (${leaveDays} days).`,
          medicalStatus: 'RECOMMENDED',
          recommendedBy: officer.name,
          wardenNotified: true,
          isFitToResume: false,
        };
        setMedicalLeaves((prev) => [newLeave, ...prev]);
        triggerToast(`Consultation saved. Medical leave recommendation (${leaveDays}d) routed to Hostel Warden.`);
        return;
      }
    }

    triggerToast('Consultation and prescription saved to patient clinical record.');
  };

  // Resolve Emergency Alert Action
  const handleResolveEmergency = async (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'Completed' } : r))
    );
    try {
      localStorage.removeItem('shms_active_emergency');
      await fetch(`${API_BASE}/emergency/${reqId}/resolve`, { method: 'POST' }).catch(() => null);
    } catch (e) {}
    triggerToast('Emergency case marked resolved. Turnstiles and warden notified.');
  };

  // Download Sample CSV Report
  const handleDownloadCsv = (reportName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        `CAMPUSHELPER CLINICAL REPORT: ${reportName}\n` +
          `Generated Date,${currentDate} ${currentTime}\n` +
          `Chief Medical Officer,${officer.name} (${officer.badgeId})\n` +
          `Clinic Bay,${officer.clinicBay}\n\n` +
          `Case ID,Student,Roll No,Hostel,Room,Type,Urgency,Attending Staff,Status\n` +
          requests
            .map(
              (r) =>
                `"${r.ticketNumber}","${r.studentName}","${r.studentRoll}","${r.hostel}","${r.room}","${r.requestType}","${r.urgency}","${r.attendingStaff || 'CMO'}","${r.status}"`
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
  const todayAppointmentsCount = appointments.filter((a) => a.status !== 'COMPLETED').length;
  const activeCasesCount = requests.filter((r) => r.status === 'In Progress' || r.status === 'Accepted').length;
  const emergencyAlertsCount = requests.filter((r) => r.urgency === 'EMERGENCY' && r.status !== 'Completed').length;
  const medicalLeavesCount = medicalLeaves.filter((l) => l.medicalStatus === 'RECOMMENDED' || l.medicalStatus === 'ACTIVE').length;
  const medicineAlertsCount = inventory.filter((i) => i.isLowStock || i.isExpiringSoon).length;
  const ambulanceRequestsCount = referrals.filter((rf) => rf.status === 'DISPATCHED' || rf.status === 'EN_ROUTE').length;

  const primaryPatient = requests.find((r) => r.ticketNumber === 'MR-2026-108') || requests[0];
  const activeEmergency = requests.find((r) => r.urgency === 'EMERGENCY' && r.status !== 'Completed');

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
              <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/25">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-1.5">
                  <span>Campus Helper</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-wider text-rose-400 mt-0.5">
                  MEDICAL SUPER APP • 10 HUBS
                </p>
              </div>
            </div>
          </div>

          {/* Doctor Profile Badge Card (Matching photo style) */}
          <div className="px-3 pt-3">
            <div className="bg-[#141e33] border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
              <div className="relative">
                <img
                  src={officer.avatarUrl}
                  alt={officer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-rose-500/40"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#141e33] absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-xs text-white truncate">{officer.name}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {officer.badgeId} • Chief Doctor
                </p>
                <p className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="truncate">Health Center Bay 1 • Active</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="px-3 pt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medical features..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#141e33] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Navigation Links (10 items matching prompt) */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-290px)] overflow-y-auto custom-scrollbar">
            {[
              { id: 'DASHBOARD', label: 'Home Dashboard', icon: Heart, badge: null },
              { id: 'MEDICAL_REQUESTS', label: 'Medical Requests', icon: Stethoscope, badge: `${newRequestsCount}`, badgeColor: 'bg-blue-500/20 text-blue-300' },
              { id: 'EMERGENCY', label: 'Emergency / SOS', icon: ShieldAlert, badge: emergencyAlertsCount > 0 ? 'ALERT' : null, badgeColor: 'bg-red-500 text-white animate-pulse' },
              { id: 'APPOINTMENTS', label: 'Appointments', icon: Calendar, badge: `${todayAppointmentsCount}`, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
              { id: 'MEDICAL_VISITS', label: 'Medical Visits & OPD', icon: FileText, badge: null },
              { id: 'MEDICAL_LEAVE', label: 'Medical Leave', icon: Bed, badge: `${medicalLeavesCount}`, badgeColor: 'bg-purple-500/20 text-purple-300' },
              { id: 'INVENTORY', label: 'Medicine & Pharmacy', icon: Pill, badge: medicineAlertsCount > 0 ? `${medicineAlertsCount} low` : null, badgeColor: 'bg-amber-500/20 text-amber-300' },
              { id: 'AMBULANCE', label: 'Ambulance & Referrals', icon: Ambulance, badge: '24x7', badgeColor: 'bg-rose-500/20 text-rose-300' },
              { id: 'REPORTS', label: 'Clinical Reports', icon: FileText, badge: '6 Reg', badgeColor: 'bg-slate-700 text-slate-300' },
              { id: 'SETTINGS', label: 'Profile & Settings', icon: Sliders, badge: null },
            ]
              .filter((tab) => !sidebarSearch || tab.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as MedicalTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
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
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>Help & Clinic Protocols</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141e33] hover:bg-rose-600/90 transition cursor-pointer border border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Medical Desk</span>
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
            <span className="text-xl">🩺</span>
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Campus Health & Wellness Center</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-rose-600 text-xs font-bold font-mono">
                  {activeTab === 'DASHBOARD' && 'Clinical Overview'}
                  {activeTab === 'MEDICAL_REQUESTS' && 'Student Medical Intake'}
                  {activeTab === 'EMERGENCY' && 'Emergency Distress & SOS'}
                  {activeTab === 'APPOINTMENTS' && 'Doctor Consultation Slots'}
                  {activeTab === 'MEDICAL_VISITS' && 'Outpatient Clinical Register'}
                  {activeTab === 'MEDICAL_LEAVE' && 'Medical Leave & Recuperation'}
                  {activeTab === 'INVENTORY' && 'Pharmacy Medicine Inventory'}
                  {activeTab === 'AMBULANCE' && '24x7 Ambulance & Hospital Referrals'}
                  {activeTab === 'REPORTS' && 'Epidemiology & Clinical Reports'}
                  {activeTab === 'SETTINGS' && 'Doctor Profile & Clinical Protocols'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Clock & Date Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-mono font-bold text-slate-800">{currentTime || '08:00:00 AM'}</span>
              <span className="text-slate-400">|</span>
              <span className="font-medium text-slate-600">{currentDate}</span>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setActiveTab('EMERGENCY')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition cursor-pointer shadow-xs ${
                emergencyAlertsCount > 0
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS Help</span>
              {emergencyAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-white text-rose-600 rounded-full text-[10px]">
                  {emergencyAlertsCount}
                </span>
              )}
            </button>

            {/* 24x7 Ambulance Quick Trigger */}
            <button
              onClick={() => setShowAmbulanceModal(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black transition cursor-pointer"
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>Ambulance 108</span>
            </button>

            {/* Primary Action Button (+ Register Case) */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Intake Case</span>
            </button>

            {/* Doctor Avatar */}
            <div
              onClick={() => setActiveTab('SETTINGS')}
              className="cursor-pointer group pl-1"
              title="Doctor Profile"
            >
              <img
                src={officer.avatarUrl}
                alt={officer.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-slate-200 group-hover:border-rose-600 transition"
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
          {/* TAB 1: MEDICAL DASHBOARD (MATCHING REFERENCE PHOTO STYLE)         */}
          {/* ================================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* 1. HERO BLUE GRADIENT BANNER (EXACTLY AS IN PHOTO) */}
              <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={officer.avatarUrl}
                      alt={officer.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
                    />
                    <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center absolute -bottom-1 -right-1 text-white shadow-xs">
                      <Stethoscope className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                        CHIEF MEDICAL OFFICER
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                        ID: {officer.badgeId}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Welcome Back, {officer.name}!
                    </h3>
                    <p className="text-xs text-blue-100 font-medium mt-0.5">
                      {officer.qualifications} • {officer.clinicBay}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Intake Patient</span>
                  </button>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Appointment</span>
                  </button>
                  <button
                    onClick={() => setShowAmbulanceModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Dispatch 108</span>
                  </button>
                </div>
              </div>

              {/* 2. FOUR PRIMARY METRIC CARDS (EXACTLY AS IN PHOTO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      NEW MEDICAL REQUESTS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {newRequestsCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-600 mt-1">
                      <span>{activeCasesCount} In Consultation</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      TODAY'S APPOINTMENTS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {todayAppointmentsCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 mt-1">
                      <span>General & Ortho Review</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      MEDICAL LEAVE CASES
                    </span>
                    <p className="text-2xl font-black text-blue-600 tracking-tight mt-1 flex items-center space-x-1.5">
                      <span>{medicalLeavesCount}</span>
                      <Bed className="w-5 h-5 text-blue-600" />
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 mt-1">
                      <span>Hostel Bed Rest Advised</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Bed className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      EMERGENCY SOS RELAY
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-1">
                      <span className={emergencyAlertsCount > 0 ? 'text-red-600 animate-pulse' : 'text-slate-900'}>
                        {emergencyAlertsCount} Active
                      </span>
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <span>24x7 Ambulance Ready</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* ACTIVE EMERGENCY DISTRESS BANNER (IF ANY) */}
              {activeEmergency && (
                <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center animate-bounce shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                          HIGH PRIORITY SOS BEACON
                        </span>
                        <span className="text-xs font-mono text-red-800 font-bold">{activeEmergency.ticketNumber}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-0.5">
                        {activeEmergency.studentName} ({activeEmergency.studentRoll}) — {activeEmergency.hostel} • Room {activeEmergency.room}
                      </h4>
                      <p className="text-xs text-red-800 font-medium">
                        {activeEmergency.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${activeEmergency.studentPhone}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Student</span>
                    </a>
                    <button
                      onClick={() => setShowAmbulanceModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs flex items-center space-x-1.5"
                    >
                      <Ambulance className="w-3.5 h-3.5" />
                      <span>Dispatch Ambulance</span>
                    </button>
                    <button
                      onClick={() => handleResolveEmergency(activeEmergency.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Acknowledge & Resolve
                    </button>
                  </div>
                </div>
              )}

              {/* 3. TWO COLUMNS LAYOUT: LEFT IS PATIENT CONSULTATION CARD & RIGHT IS CLINIC SCHEDULE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Featured Patient Intake Consultation Card (Matching photo style) */}
                <div className="bg-white rounded-3xl p-6 border-2 border-rose-400/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Patient Consultation</h4>
                      <div className="w-16 h-1 bg-rose-600 rounded-full mt-1"></div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black uppercase tracking-wider">
                      {primaryPatient.requestType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <span>Status:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{primaryPatient.status}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold">
                      {primaryPatient.urgency} Urgency
                    </span>
                  </div>

                  {/* Form Table Layout (Matching photo style) */}
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs pt-1 border-t border-slate-100">
                    <div className="text-slate-500 font-semibold">Student Patient:</div>
                    <div className="text-slate-900 font-extrabold text-right">
                      {primaryPatient.studentName}
                    </div>

                    <div className="text-slate-500 font-semibold">Roll Number:</div>
                    <div className="font-mono text-blue-600 font-bold text-right">
                      {primaryPatient.studentRoll}
                    </div>

                    <div className="text-slate-500 font-semibold">Student Contact:</div>
                    <div className="font-mono text-emerald-600 font-bold text-right">
                      {primaryPatient.studentPhone}
                    </div>

                    <div className="text-slate-500 font-semibold">Guardian Phone:</div>
                    <div className="font-mono text-slate-700 text-right">
                      {primaryPatient.parentPhone}
                    </div>

                    <div className="text-slate-500 font-semibold">Hostel & Room:</div>
                    <div className="text-slate-900 font-bold text-right">
                      {primaryPatient.hostel} • Room {primaryPatient.room}
                    </div>

                    <div className="text-slate-500 font-semibold">Chief Complaint:</div>
                    <div className="text-slate-800 font-medium text-right truncate">
                      {primaryPatient.description}
                    </div>

                    {primaryPatient.vitals && (
                      <>
                        <div className="text-slate-500 font-semibold">Clinical Vitals:</div>
                        <div className="font-mono text-rose-700 font-bold text-right">
                          BP: {primaryPatient.vitals.bp} • Temp: {primaryPatient.vitals.temp}
                        </div>
                      </>
                    )}

                    <div className="text-slate-500 font-semibold">Attending Doctor:</div>
                    <div className="text-blue-600 font-extrabold text-right">
                      {primaryPatient.attendingStaff || officer.name}
                    </div>

                    <div className="text-slate-500 font-semibold">Medical Leave:</div>
                    <div className="text-purple-700 font-bold text-right">
                      {primaryPatient.medicalLeaveRecommended
                        ? `Recommended (${primaryPatient.medicalLeaveDays} Days Bed Rest)`
                        : 'Not Required'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedRequestForConsult(primaryPatient);
                        setShowConsultModal(true);
                      }}
                      className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>[ Record Consultation & Prescribe ]</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Today's Clinic Schedule (Matching photo style) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Today's Clinic Doctor Schedule</h4>
                        <p className="text-[11px] text-slate-400">Consultation roster at Health Center Bay 1</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('APPOINTMENTS')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Full Schedule</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-slate-200 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-slate-900">
                            {apt.studentName} ({apt.studentRoll})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              apt.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'IN_CONSULTATION'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {apt.slotTime} • Doctor: <strong className="text-slate-800">{apt.doctorName}</strong>
                        </p>
                        <p className="text-[11px] text-slate-600 italic">{apt.symptoms}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. RECENT MEDICAL CASES TABLE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-5 h-5 text-rose-600" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Live Patient Clinical Intake Feed</h4>
                      <p className="text-xs text-slate-400">Incoming consultations from Student Platform & Hostel clinics</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('MEDICAL_REQUESTS')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All Cases</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Case #</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Urgency</th>
                        <th className="py-3 px-4">Doctor Notes / Symptoms</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {requests.slice(0, 5).map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-rose-600">{req.ticketNumber}</td>
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-slate-900 block">{req.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{req.studentRoll}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {req.hostel} • {req.room}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {req.requestType}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                                req.urgency === 'EMERGENCY'
                                  ? 'bg-red-100 text-red-800 animate-pulse'
                                  : req.urgency === 'HIGH'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {req.urgency}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{req.description}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === 'Completed'
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
                                setSelectedRequestForConsult(req);
                                setShowConsultModal(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                            >
                              Consult
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
          {/* TAB 2: MEDICAL REQUESTS                                           */}
          {/* ================================================================= */}
          {activeTab === 'MEDICAL_REQUESTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {(
                    [
                      'ALL',
                      'Doctor Consultation',
                      'Nurse / First Aid',
                      'Medical Leave',
                      'Emergency',
                      'Ambulance',
                    ] as const
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRequestTypeFilter(type as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        requestTypeFilter === type
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by student, room, or symptoms..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests
                  .filter((r) => {
                    if (requestTypeFilter !== 'ALL' && r.requestType !== requestTypeFilter) return false;
                    if (
                      requestSearch &&
                      !r.studentName.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.studentRoll.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.ticketNumber.toLowerCase().includes(requestSearch.toLowerCase()) &&
                      !r.description.toLowerCase().includes(requestSearch.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((req) => (
                    <div
                      key={req.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 hover:border-rose-300 shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs text-rose-600">{req.ticketNumber}</span>
                            <span className="text-slate-400">•</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                              {req.requestType}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1">{req.studentName} ({req.studentRoll})</h4>
                          <p className="text-xs text-slate-500">
                            {req.hostel} • Room {req.room} • Contact: {req.studentPhone}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            req.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : req.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {req.description}
                      </p>

                      {req.prescription && (
                        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900">
                          <strong>Prescribed:</strong> {req.prescription}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Vitals: <strong className="text-slate-800">{req.vitals?.temp || 'Normal'} | {req.vitals?.bp || '120/80'}</strong>
                        </span>

                        <button
                          onClick={() => {
                            setSelectedRequestForConsult(req);
                            setShowConsultModal(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center space-x-1"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Record Treatment</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: EMERGENCY / SOS                                            */}
          {/* ================================================================= */}
          {activeTab === 'EMERGENCY' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 rounded-3xl p-6 shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/40 text-white flex items-center justify-center animate-pulse shrink-0">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-200">
                      High Priority Medical SOS Dispatch
                    </span>
                    <h3 className="text-xl font-extrabold text-white">Emergency Response Relay</h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      Interconnected with Student SOS, Warden Control, Security Main Gate 1, and 24x7 Ambulance fleet.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAmbulanceModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-rose-700 font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Ambulance className="w-4 h-4 text-rose-600" />
                  <span>Dispatch Ambulance (+91 94370 00108)</span>
                </button>
              </div>

              <div className="space-y-4">
                {requests
                  .filter((r) => r.urgency === 'EMERGENCY' || r.requestType === 'Emergency')
                  .map((em) => (
                    <div
                      key={em.id}
                      className="rounded-3xl border border-red-300 bg-white p-5 space-y-4 shadow-sm ring-2 ring-red-100"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-base text-slate-900">{em.studentName}</h4>
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                                {em.studentRoll}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {em.hostel} • Room {em.room} • Logged at: {em.dateTime}
                            </p>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                          {em.status}
                        </span>
                      </div>

                      <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs space-y-1">
                        <p className="font-bold text-red-900">Symptoms & Clinical Triage:</p>
                        <p className="text-red-800">{em.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`tel:${em.studentPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 font-bold transition flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Student ({em.studentPhone})</span>
                          </a>
                          <a
                            href={`tel:${em.parentPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Guardian</span>
                          </a>
                        </div>

                        {em.status !== 'Completed' && (
                          <button
                            onClick={() => handleResolveEmergency(em.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer"
                          >
                            Resolve Alert & Close Beacon
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: APPOINTMENTS                                               */}
          {/* ================================================================= */}
          {activeTab === 'APPOINTMENTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Clinical Appointment Schedule</h3>
                  <p className="text-xs text-slate-500">
                    Booked OPD consultations with Chief Medical Officer and visiting specialists.
                  </p>
                </div>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Schedule Appointment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-rose-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-[10px] text-rose-600">{apt.appointmentNumber}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{apt.studentName}</h4>
                        <p className="text-xs text-slate-500">{apt.hostel} • Room {apt.room} • {apt.phone}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          apt.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'IN_CONSULTATION'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <p className="text-slate-700">Slot: <strong className="text-slate-900">{apt.slotDate}, {apt.slotTime}</strong></p>
                      <p className="text-slate-500">Doctor: <strong className="text-slate-800">{apt.doctorName}</strong> ({apt.specialty})</p>
                      <p className="text-slate-600 italic pt-1">{apt.symptoms}</p>
                    </div>

                    <div className="flex justify-end pt-1">
                      {apt.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            setAppointments((prev) =>
                              prev.map((a) => (a.id === apt.id ? { ...a, status: 'COMPLETED' } : a))
                            );
                            triggerToast('Appointment marked completed.');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Consultation Done</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: MEDICAL VISITS & OPD REGISTER                              */}
          {/* ================================================================= */}
          {activeTab === 'MEDICAL_VISITS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Outpatient Consultation & Visits Ledger</h3>
                  <p className="text-xs text-slate-500">
                    Clinical record of patient treatments, diagnoses, and pharmacy dispensations.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {visits.map((vis) => (
                  <div
                    key={vis.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-slate-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-rose-600">{vis.visitNumber}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{vis.visitDate} at {vis.visitTime}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                          {vis.studentName} ({vis.studentRoll})
                        </h4>
                        <p className="text-xs text-slate-500">{vis.hostel} • Room {vis.room}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                        Verified OPD
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-2">
                      <p className="text-slate-900 font-bold">Diagnosis: <span className="font-normal text-slate-700">{vis.diagnosis}</span></p>
                      <p className="text-slate-900 font-bold">Treatment: <span className="font-normal text-slate-700">{vis.treatment}</span></p>
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {vis.prescribedMedicines.map((m, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-mono">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Attending: <strong>{vis.attendingDoctor}</strong></span>
                      {vis.followUpDate && <span>Follow-up: <strong>{vis.followUpDate}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: MEDICAL LEAVE (PRIVACY PRESERVED SYNC WITH WARDEN)          */}
          {/* ================================================================= */}
          {activeTab === 'MEDICAL_LEAVE' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Medical Leave & Hostel Bed Rest Workflow</h3>
                  <p className="text-xs text-slate-500">
                    Confidential clinical recommendations: Wardens receive only needed operational dates for attendance.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicalLeaves.map((lv) => (
                  <div
                    key={lv.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 hover:border-purple-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-purple-600">{lv.leaveNumber}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-1">{lv.studentName} ({lv.studentRoll})</h4>
                        <p className="text-xs text-slate-500">{lv.hostel} • Room {lv.room}</p>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          lv.medicalStatus === 'APPROVED_BY_WARDEN'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : lv.medicalStatus === 'RECOMMENDED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lv.medicalStatus}
                      </span>
                    </div>

                    <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 text-xs space-y-1 text-purple-900">
                      <p className="font-bold">Operational Leave Scope:</p>
                      <p>{lv.operationalReason}</p>
                      <p className="font-mono text-[11px] pt-1">
                        Period: {lv.startDate} to {lv.endDate} ({lv.days} Days)
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-slate-500">
                        Recommended By: <strong className="text-slate-800">{lv.recommendedBy}</strong>
                      </span>

                      {!lv.isFitToResume ? (
                        <button
                          onClick={() => {
                            setMedicalLeaves((prev) =>
                              prev.map((l) => (l.id === lv.id ? { ...l, isFitToResume: true } : l))
                            );
                            triggerToast(`Fitness to resume studies issued for ${lv.studentName}.`);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Issue Fitness Certificate
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Fit to Resume</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: PHARMACY INVENTORY                                         */}
          {/* ================================================================= */}
          {activeTab === 'INVENTORY' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Campus Pharmacy Medicine Stock</h3>
                  <p className="text-xs text-slate-500">
                    Essential antipyretics, analgesics, antibiotics, ORS electrolytes, and antiseptic dressings.
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search medicine or category..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => setShowAddMedicineModal(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Medicine</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory
                  .filter((item) =>
                    !inventorySearch ||
                    item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                    item.category.toLowerCase().includes(inventorySearch.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-rose-300 shadow-sm transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono font-bold text-[10px] text-blue-600">{item.code}</span>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{item.name}</h4>
                          <span className="text-xs text-slate-400">{item.category} • {item.dosage}</span>
                        </div>
                        {item.isLowStock && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase">
                            Low Stock
                          </span>
                        )}
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Available:</span>
                          <span className="font-extrabold text-slate-900">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Min Threshold:</span>
                          <span className="font-bold text-slate-700">{item.minStock} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                          <span>Expiry: <strong className="text-slate-800">{item.expiryDate}</strong></span>
                          <span>Location: {item.location}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => {
                            setInventory((prev) =>
                              prev.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 20, isLowStock: false } : i
                              )
                            );
                            triggerToast(`Restocked +20 ${item.unit} of ${item.name}.`);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          + Restock (+20)
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: AMBULANCE & HOSPITAL REFERRALS                              */}
          {/* ================================================================= */}
          {activeTab === 'AMBULANCE' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">24x7 Campus Ambulance & Hospital Referrals</h3>
                  <p className="text-xs text-slate-500">
                    Emergency vehicle logs: AIIMS Bhubaneswar, Capital Hospital, and KIMS referrals.
                  </p>
                </div>
                <button
                  onClick={() => setShowAmbulanceModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Dispatch Ambulance</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-red-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-xs text-red-600">{ref.referralNumber}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{ref.studentName} ({ref.studentRoll})</h4>
                        <p className="text-xs text-slate-500">{ref.hostel} • Room {ref.room}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase">
                        {ref.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <p className="text-slate-800 font-bold">Destination: {ref.destinationHospital}</p>
                      <p className="text-slate-600">Cause: {ref.referralReason}</p>
                      <p className="text-slate-500 font-mono text-[11px] pt-1">
                        Vehicle: {ref.vehicleNumber} • Driver: {ref.driverName} ({ref.driverPhone})
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-slate-400">Dispatch Time: {ref.dispatchTime}</span>
                      {ref.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            setReferrals((prev) =>
                              prev.map((rf) => (rf.id === ref.id ? { ...rf, status: 'COMPLETED' } : rf))
                            );
                            triggerToast('Patient referral trip marked completed.');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Trip Completed</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: REPORTS                                                    */}
          {/* ================================================================= */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Clinical & Health Center Registers</h3>
                  <p className="text-xs text-slate-500">
                    Official CSV downloads and printable registers for campus health center audits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-rose-300 shadow-sm transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{rep.name}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Records: {rep.recordCount} entries
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-rose-700 font-mono text-[10px] font-bold">
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
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
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
          {/* TAB 10: PROFILE & SETTINGS                                        */}
          {/* ================================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-4">
                    <img
                      src={officer.avatarUrl}
                      alt={officer.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-lg text-slate-900">{officer.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-xs font-bold">
                          {officer.badgeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{officer.qualifications}</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{officer.department}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs uppercase tracking-wider">
                    On Duty Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Doctor Direct Line</span>
                    <span className="font-mono text-slate-900 font-bold">{officer.phone}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Consultation Shift</span>
                    <span className="text-slate-900 font-bold">{officer.shift}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Clinic Bay Location</span>
                    <span className="text-slate-900 font-bold">{officer.clinicBay}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Ambulance Control 108</span>
                    <span className="font-mono text-rose-600 font-bold">{officer.ambulanceHelpline}</span>
                  </div>
                </div>
              </div>

              {/* Role Permissions Boundary */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Medical Staff Role Permission Boundary</h4>
                    <p className="text-xs text-slate-500">
                      Standard operational matrix for Healthcare Staff in CampusHelper.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manage clinical consultations & patient triage</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Handle emergency SOS alarms & dispatch 24x7 ambulance</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Issue medical leave recommendations & fitness clearances</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manage pharmacy inventory & dispense medications</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot approve general hostel gate passes (Warden only)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot alter student academic grades or attendance records</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot modify hostel room allocations or bed fees</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot access system-wide Admin management credentials</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. MODALS SUITE                                                     */}
      {/* =================================================================== */}
      <CreateMedicalRequestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRequest={(newR) => {
          const reqObj: MedicalRequest = {
            id: `mr-${Date.now()}`,
            ticketNumber: newR.ticketNumber || `MR-2026-${Math.floor(100 + Math.random() * 900)}`,
            studentName: newR.studentName || 'Student Patient',
            studentId: newR.studentId || 'CS2023042',
            studentRoll: newR.studentRoll || 'REC-2023-CS042',
            studentPhone: newR.studentPhone || '+91 98765 43210',
            parentPhone: newR.parentPhone || '+91 94370 88990',
            hostel: newR.hostel || 'Nilgiri Residence (Block A)',
            room: newR.room || 'A-204',
            requestType: newR.requestType || 'Doctor Consultation',
            description: newR.description || '',
            urgency: newR.urgency || 'MEDIUM',
            vitals: newR.vitals || { bp: '120/80', temp: '98.6°F', spo2: '99%', pulse: '76 bpm' },
            dateTime: 'Just now',
            status: 'New',
            attendingStaff: officer.name,
          };
          setRequests((prev) => [reqObj, ...prev]);
          triggerToast(`Medical request ${reqObj.ticketNumber} registered.`);
        }}
      />

      <ConsultationDiagnosisModal
        request={selectedRequestForConsult}
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        onSaveConsultation={handleSaveConsultation}
      />

      <ScheduleAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSchedule={(newApt) => {
          const aptObj: MedicalAppointment = {
            id: `apt-${Date.now()}`,
            appointmentNumber: newApt.appointmentNumber || `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
            studentName: newApt.studentName || 'Student',
            studentRoll: newApt.studentRoll || 'REC-2023-CS042',
            hostel: newApt.hostel || 'Nilgiri Block A',
            room: newApt.room || 'A-204',
            phone: newApt.phone || '+91 98765 43210',
            doctorName: newApt.doctorName || officer.name,
            specialty: newApt.specialty || 'General Medicine',
            slotTime: newApt.slotTime || '11:00 AM',
            slotDate: newApt.slotDate || 'Today',
            status: 'SCHEDULED',
            symptoms: newApt.symptoms || 'General Checkup',
          };
          setAppointments((prev) => [aptObj, ...prev]);
          triggerToast(`Appointment ${aptObj.appointmentNumber} scheduled.`);
        }}
      />

      <AmbulanceReferralModal
        isOpen={showAmbulanceModal}
        onClose={() => setShowAmbulanceModal(false)}
        onDispatch={(newRef) => {
          const refObj: AmbulanceReferralRecord = {
            id: `ref-${Date.now()}`,
            referralNumber: newRef.referralNumber || `REF-2026-${Math.floor(10 + Math.random() * 90)}`,
            studentName: newRef.studentName || 'Student Patient',
            studentRoll: newRef.studentRoll || 'REC-2023-CS042',
            hostel: newRef.hostel || 'Nilgiri Block A',
            room: newRef.room || 'A-204',
            dispatchTime: newRef.dispatchTime || currentTime || 'Now',
            vehicleNumber: newRef.vehicleNumber || 'OD-02-AMB-108',
            driverName: newRef.driverName || 'Kailash Nayak',
            driverPhone: newRef.driverPhone || '+91 94370 00108',
            destinationHospital: newRef.destinationHospital || 'AIIMS Bhubaneswar Emergency',
            referralReason: newRef.referralReason || 'Acute Emergency',
            accompanyingStaff: newRef.accompanyingStaff || 'Campus Attendant',
            emergencyContactCalled: true,
            status: 'DISPATCHED',
          };
          setReferrals((prev) => [refObj, ...prev]);
          triggerToast(`24x7 Ambulance ${refObj.vehicleNumber} dispatched for ${refObj.studentName}.`);
        }}
      />

      <AddMedicineModal
        isOpen={showAddMedicineModal}
        onClose={() => setShowAddMedicineModal(false)}
        onAddMedicine={(newMed) => {
          const medObj: MedicineInventoryItem = {
            id: `med-${Date.now()}`,
            code: newMed.code || `MED-${Date.now().toString().slice(-5)}`,
            name: newMed.name || 'Medicine',
            category: newMed.category || 'Antipyretic',
            dosage: newMed.dosage || '500mg',
            quantity: newMed.quantity || 50,
            unit: newMed.unit || 'Strips',
            minStock: newMed.minStock || 20,
            expiryDate: newMed.expiryDate || '12/2027',
            isLowStock: (newMed.quantity || 50) <= (newMed.minStock || 20),
            isExpiringSoon: false,
            location: newMed.location || 'Cabinet A',
          };
          setInventory((prev) => [medObj, ...prev]);
          triggerToast(`Medicine ${medObj.name} added to pharmacy inventory.`);
        }}
      />

      <MedicalHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
