'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
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
  Sparkles,
} from 'lucide-react';
import { playCuteNotificationSound } from '../../../../lib/audioSound';

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
  PharmacistProfile,
  StudentMedicineDispenseRecord,
  EmergencyVehicleFleet,
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
  INITIAL_PHARMACIST_PROFILE,
  INITIAL_EMERGENCY_VEHICLE_FLEET,
  INITIAL_STUDENT_DISPENSATIONS,
} from './mockData';

import {
  CreateMedicalRequestModal,
  ConsultationDiagnosisModal,
  ScheduleAppointmentModal,
  AmbulanceReferralModal,
  AddMedicineModal,
  MedicalHelpModal,
  DispenseMedicineModal,
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

  // Student Platform Medical Sync States
  const [pharmacist, setPharmacist] = useState<PharmacistProfile>(INITIAL_PHARMACIST_PROFILE);
  const [dispensations, setDispensations] = useState<StudentMedicineDispenseRecord[]>(INITIAL_STUDENT_DISPENSATIONS);
  const [fleet, setFleet] = useState<EmergencyVehicleFleet>(INITIAL_EMERGENCY_VEHICLE_FLEET);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<'ALL' | 'STUDENT_OTC' | 'PRESCRIPTION' | 'EQUIPMENT'>('ALL');

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

        // 2. Sync from backend medical requests API
        const medRes = await fetch(`${API_BASE}/medical/requests`, { credentials: 'omit' }).catch(() => null);
        if (medRes && medRes.ok) {
          const medData = await medRes.json();
          if (Array.isArray(medData) && medData.length > 0) {
            setRequests((prev) => {
              const ids = new Set(prev.map((r) => r.id || r.ticketNumber));
              const fresh = medData.filter((r: any) => !ids.has(r.id) && !ids.has(r.ticketNumber));
              return [...fresh, ...prev];
            });
          }
        }

        // 3. Sync from backend active emergency API
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

    // 4. Real-Time Socket Gateway for Doctor Console
    const socket = io(API_BASE);
    socket.on('medical:request_created', (data: any) => {
      console.log('💊 Medical alert received in Doctor Dashboard:', data);
      setRequests((prev) => {
        const id = data.id || data.ticketNumber;
        if (prev.some((r) => r.id === id || r.ticketNumber === data.ticketNumber)) return prev;
        return [
          {
            id: id || `med-${Date.now()}`,
            ticketNumber: data.ticketNumber || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            studentName: data.studentName || data.residentName || 'Student Patient',
            studentId: data.studentId || 'REC-STU',
            studentRoll: data.studentRoll || 'REC-2023-CS042',
            studentPhone: data.studentPhone || '+91 98765 43210',
            parentPhone: data.parentPhone || '+91 94370 88990',
            hostel: data.hostel || data.blockName || 'Campus Hostel',
            room: data.room || data.roomNumber || 'Room',
            requestType: (data.urgency === 'EMERGENCY' ? 'Emergency' : 'Doctor Consultation') as MedicalRequestType,
            description: data.description || 'Medical help requested',
            urgency: data.urgency || 'NORMAL',
            dateTime: 'Just now',
            status: 'New',
            attendingStaff: 'Dr. Pratima Mishra, MD',
          },
          ...prev,
        ];
      });
      playCuteNotificationSound();
      setToastMsg(`🚨 New Student Medical Request: ${data.studentName || 'Student'} (${data.room || 'Room'}) - ${data.description || 'Medicine requested'}`);
      setTimeout(() => setToastMsg(''), 10000);
    });

    socket.on('emergency:triggered', (data: any) => {
      console.log('🚨 SOS Alert received in Doctor Dashboard:', data);
      playCuteNotificationSound();
      setRequests((prev) => {
        const id = data.id;
        if (prev.some((r) => r.id === id)) return prev;
        return [
          {
            id: id || `sos-${Date.now()}`,
            ticketNumber: `EM-SOS-${Date.now().toString().slice(-4)}`,
            studentName: data.residentName || 'Student Patient',
            studentId: data.residentId || 'CS2023042',
            studentRoll: 'REC-CS-042',
            studentPhone: data.residentPhone || '+91 98765 43210',
            parentPhone: '+91 94370 88990',
            hostel: data.blockName || 'Nilgiri Block A',
            room: data.roomNumber || 'Room',
            requestType: 'Emergency' as MedicalRequestType,
            description: `🚨 CRITICAL SOS: ${data.notes || 'Emergency dispatched'} at ${data.locationDetails || 'Hostel'}`,
            urgency: 'EMERGENCY',
            dateTime: 'Just now',
            status: 'New',
            attendingStaff: 'Dr. Pratima Mishra, MD',
          },
          ...prev,
        ];
      });
      setToastMsg(`🚨 CRITICAL EMERGENCY SOS: ${data.residentName || 'Student'} (${data.roomNumber || 'Hostel'}) triggered SOS!`);
      setTimeout(() => setToastMsg(''), 12000);
    });

    const interval = setInterval(syncMedicalEmergency, 12000);
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
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
                placeholder="Search requests, medicines..."
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
              { id: 'DASHBOARD', label: 'Overview', icon: Heart, badge: null },
              {
                id: 'MEDICAL_REQUESTS',
                label: 'Student Requests',
                icon: Stethoscope,
                badge: emergencyAlertsCount > 0 ? `${emergencyAlertsCount} SOS` : `${newRequestsCount} New`,
                badgeColor: emergencyAlertsCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-500/20 text-blue-300'
              },
              {
                id: 'INVENTORY',
                label: 'Campus Pharmacy',
                icon: Pill,
                badge: '10 Items',
                badgeColor: 'bg-emerald-500/20 text-emerald-300'
              },
              {
                id: 'AMBULANCE',
                label: '24×7 Ambulance',
                icon: Ambulance,
                badge: 'Gate 1',
                badgeColor: 'bg-rose-500/20 text-rose-300'
              },
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
            <span>Emergency Numbers & Help</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141e33] hover:bg-rose-600/90 transition cursor-pointer border border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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
                <span>Campus Medical & Health Center</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-rose-600 text-xs font-bold font-mono">
                  {activeTab === 'DASHBOARD' && 'Overview'}
                  {activeTab === 'MEDICAL_REQUESTS' && 'Student Requests'}
                  {activeTab === 'EMERGENCY' && 'Emergency Alerts'}
                  {activeTab === 'INVENTORY' && 'Campus Pharmacy'}
                  {activeTab === 'AMBULANCE' && '24×7 Ambulance'}
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
              <span>Call Ambulance</span>
            </button>

            {/* Primary Action Button (+ Register Case) */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Medical Request</span>
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
                        CAMPUS DOCTOR ON DUTY
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
                    <span>+ New Request</span>
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
                    <span>Call Ambulance</span>
                  </button>
                </div>
              </div>

              {/* 2. FOUR PRIMARY METRIC CARDS (EXACTLY AS IN PHOTO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      STUDENT REQUESTS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {newRequestsCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-600 mt-1">
                      <span>{activeCasesCount} Being Treated</span>
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
                      FREE MEDICINES
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {todayAppointmentsCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 mt-1">
                      <span>10 Essential Items In Stock</span>
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
                      24×7 AMBULANCE
                    </span>
                    <p className="text-2xl font-black text-blue-600 tracking-tight mt-1 flex items-center space-x-1.5">
                      <span>{medicalLeavesCount}</span>
                      <Bed className="w-5 h-5 text-blue-600" />
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 mt-1">
                      <span>Ready at Main Gate 1</span>
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
                      EMERGENCY ALERTS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-1">
                      <span className={emergencyAlertsCount > 0 ? 'text-red-600 animate-pulse' : 'text-slate-900'}>
                        {emergencyAlertsCount} Active
                      </span>
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <span>Needs Immediate Help</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* LIVE CAMPUS HEALTHCARE OPERATIONAL READINESS & STUDENT LIFELINE STRIP */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-3xl p-5 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight text-white flex items-center space-x-2">
                        <span>Campus Health Services Status</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                          CONNECTED TO STUDENT APP
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Current status for Campus Pharmacy, 24×7 Ambulance, and Emergency Help Desk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-400">Help Line:</span>
                    <a
                      href="tel:+919861000112"
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-bold text-xs hover:bg-rose-500/30 flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>+91 98610 00112</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lifeline 1: Campus Pharmacy */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-white">Campus Pharmacy</h5>
                          <p className="text-[10px] text-slate-400">{pharmacist.location}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        pharmacist.dutyStatus === 'ON_DUTY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {pharmacist.dutyStatus === 'ON_DUTY' ? '● OPEN NOW' : 'ON BREAK'}
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-slate-300">
                        <span>Pharmacist:</span>
                        <strong className="text-white">{pharmacist.name}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Direct Call:</span>
                        <a href={`tel:${pharmacist.phone}`} className="text-emerald-400 font-mono font-bold hover:underline">
                          {pharmacist.phone}
                        </a>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Free Medicines:</span>
                        <span className="text-emerald-300 font-bold">10 Free Medicines Ready</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setShowDispenseModal(true)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Give Medicine</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('INVENTORY')}
                        className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition cursor-pointer"
                      >
                        View Stock
                      </button>
                    </div>
                  </div>

                  {/* Lifeline 2: 24x7 Ambulance & Hospital Transit */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/40 transition space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                          <Ambulance className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-white">24×7 Campus Ambulance</h5>
                          <p className="text-[10px] text-slate-400">Post: {fleet.standbyPost}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider">
                        ● 24×7 STANDBY
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-slate-300">
                        <span>Vehicle:</span>
                        <strong className="text-white font-mono text-[10px]">{fleet.vehicleNumber}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Driver:</span>
                        <span className="text-white font-bold">{fleet.driverName} ({fleet.driverPhone})</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Nearest Hospital:</span>
                        <span className="text-rose-300 font-bold">KIMS Hospital (12 mins away)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setShowAmbulanceModal(true)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <Ambulance className="w-3.5 h-3.5" />
                        <span>Send Ambulance</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('AMBULANCE')}
                        className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition cursor-pointer"
                      >
                        Ambulance Info
                      </button>
                    </div>
                  </div>

                  {/* Lifeline 3: Emergency Desk & Gate Clearance */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-white">Emergency Help Desk</h5>
                          <p className="text-[10px] text-slate-400">Main Gate & Warden Connected</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase tracking-wider">
                        SYNC ACTIVE
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between text-slate-300">
                        <span>Gate Turnstile:</span>
                        <span className="text-emerald-300 font-bold">Main Gate Opens Instantly</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Hostel Wardens:</span>
                        <span className="text-white">Wardens Alerted Automatically</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Active Alerts:</span>
                        <span className={emergencyAlertsCount > 0 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {emergencyAlertsCount} Emergency Alerts
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setActiveTab('EMERGENCY')}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>View Emergencies</span>
                      </button>
                      <button
                        onClick={() => setShowHelpModal(true)}
                        className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition cursor-pointer"
                      >
                        Emergency Help
                      </button>
                    </div>
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
                          🚨 EMERGENCY ALERT — STUDENT NEEDS IMMEDIATE HELP
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
                      <span>Send Ambulance</span>
                    </button>
                    <button
                      onClick={() => handleResolveEmergency(activeEmergency.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      Mark Done / Solved
                    </button>
                  </div>
                </div>
              )}



              {/* 4. RECENT MEDICAL CASES TABLE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-5 h-5 text-rose-600" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Recent Student Health Requests</h4>
                      <p className="text-xs text-slate-400">Latest requests sent by students from the student app</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('MEDICAL_REQUESTS')}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All Requests</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Ticket #</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Urgency</th>
                        <th className="py-3 px-4">Problem / Sickness</th>
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
                          <span>Give Medicine / Update</span>
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
          {/* TAB 7: CAMPUS PHARMACY & ESSENTIAL OTC DISPENSARY                 */}
          {/* ================================================================= */}
          {activeTab === 'INVENTORY' && (
            <div className="space-y-6">
              {/* 1. CAMPUS PHARMACY DUTY DESK BANNER */}
              <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-emerald-700/40">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md shrink-0">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        CAMPUS PHARMACY
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] font-mono">
                        {pharmacist.registrationNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                        {pharmacist.timings}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                      <span>{pharmacist.name}</span>
                      <span className="text-xs font-medium text-emerald-200">({pharmacist.qualifications})</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-2">
                      <span>📍 {pharmacist.location}</span>
                      <span>•</span>
                      <span>Pharmacist Phone: <strong className="text-emerald-300 font-mono">{pharmacist.phone}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => {
                      const newStatus = pharmacist.dutyStatus === 'ON_DUTY' ? 'ON_BREAK' : 'ON_DUTY';
                      setPharmacist((prev) => ({ ...prev, dutyStatus: newStatus }));
                      triggerToast(`Pharmacist duty status updated to: ${newStatus === 'ON_DUTY' ? 'ON DUTY' : 'ON BREAK'}`);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center space-x-1.5 ${
                      pharmacist.dutyStatus === 'ON_DUTY'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/50 hover:bg-amber-500/30'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                    <span>{pharmacist.dutyStatus === 'ON_DUTY' ? 'Status: ON DUTY' : 'Status: ON BREAK'}</span>
                  </button>

                  <button
                    onClick={() => setShowDispenseModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Give Free Medicine to Student</span>
                  </button>

                  <button
                    onClick={() => setShowAddMedicineModal(true)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Medicine</span>
                  </button>
                </div>
              </div>

              {/* 2. INVENTORY FILTER PILLS & SEARCH */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setInventoryFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      inventoryFilter === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    All Items ({inventory.length})
                  </button>
                  <button
                    onClick={() => setInventoryFilter('STUDENT_OTC')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                      inventoryFilter === 'STUDENT_OTC'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Free Student Medicines (10)</span>
                  </button>
                  <button
                    onClick={() => setInventoryFilter('PRESCRIPTION')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      inventoryFilter === 'PRESCRIPTION'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Other Medicines
                  </button>
                  <button
                    onClick={() => setInventoryFilter('EQUIPMENT')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      inventoryFilter === 'EQUIPMENT'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    First Aid & Kits
                  </button>
                </div>

                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search medicine or indication..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* 3. MEDICINE INVENTORY GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory
                  .filter((item) => {
                    const matchesSearch =
                      !inventorySearch ||
                      item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                      item.category.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                      (item.indication && item.indication.toLowerCase().includes(inventorySearch.toLowerCase()));

                    if (!matchesSearch) return false;

                    if (inventoryFilter === 'STUDENT_OTC') {
                      return item.isOtcStudentEssential;
                    }
                    if (inventoryFilter === 'PRESCRIPTION') {
                      return !item.isOtcStudentEssential && item.category !== 'Clinic Equipment';
                    }
                    if (inventoryFilter === 'EQUIPMENT') {
                      return item.category.includes('Equipment') || item.category.includes('First Aid');
                    }
                    return true;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-3xl p-5 space-y-3 shadow-sm hover:shadow-md transition ${
                        item.isOtcStudentEssential
                          ? 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/10'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-[10px] text-blue-600">{item.code}</span>
                            {item.isOtcStudentEssential && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wide">
                                Free for Students
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1">{item.name}</h4>
                          <span className="text-xs text-slate-500">{item.category} • {item.dosage}</span>
                        </div>
                        {item.isLowStock && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase shrink-0">
                            Low Stock
                          </span>
                        )}
                      </div>

                      {item.indication && (
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                          <strong className="text-slate-800">Indication:</strong> {item.indication}
                        </div>
                      )}

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">In Stock:</span>
                          <span className="font-extrabold text-slate-900">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Low Stock Warning at:</span>
                          <span className="font-bold text-slate-700">{item.minStock} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                          <span>Expiry: <strong className="text-slate-800">{item.expiryDate}</strong></span>
                          <span>Location: {item.location}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        {item.isOtcStudentEssential && (
                          <button
                            onClick={() => setShowDispenseModal(true)}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                          >
                            <Pill className="w-3.5 h-3.5" />
                            <span>Give to Student</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setInventory((prev) =>
                              prev.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 20, isLowStock: false } : i
                              )
                            );
                            triggerToast(`Restocked +20 ${item.unit} of ${item.name}.`);
                          }}
                          className={`${item.isOtcStudentEssential ? 'w-auto px-3' : 'w-full'} py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer`}
                        >
                          + Add 20
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* 4. STUDENT FREE OTC MEDICINE DISPENSATION LOG REGISTER */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">Medicines Given to Students Log</h4>
                      <p className="text-xs text-slate-500">Simple log of all free medicines given out to hostel students</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDispenseModal(true)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Give Medicine to Student</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Slip #</th>
                        <th className="py-3 px-4">Student Name & Roll</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Medicine & Qty</th>
                        <th className="py-3 px-4">How to Take</th>
                        <th className="py-3 px-4">Pharmacist</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Free / Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {dispensations.map((disp) => (
                        <tr key={disp.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-700">{disp.dispenseNumber}</td>
                          <td className="py-3 px-4">
                            <span className="font-extrabold text-slate-900 block">{disp.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{disp.studentRoll}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{disp.hostelRoom}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {disp.quantity} {disp.unit} × {disp.medicineName}
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs">{disp.directions}</td>
                          <td className="py-3 px-4 text-slate-700 font-semibold">{disp.pharmacistName}</td>
                          <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">{disp.dispensedTime}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase">
                              Free
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

          {/* ================================================================= */}
          {/* TAB 8: 24X7 CAMPUS AMBULANCE FLEET & HOSPITAL TRANSIT              */}
          {/* ================================================================= */}
          {activeTab === 'AMBULANCE' && (
            <div className="space-y-6">
              {/* 1. 24x7 CAMPUS EMERGENCY VEHICLE FLEET COMMAND BANNER */}
              <div className="bg-gradient-to-r from-red-700 via-rose-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-red-500/30">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-red-400/40 flex items-center justify-center text-red-300 shadow-md shrink-0">
                    <Ambulance className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        24×7 CAMPUS AMBULANCE
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-red-100 text-[10px] font-mono">
                        {fleet.vehicleNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold">
                        READY AT MAIN GATE 1
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                      <span>Driver: {fleet.driverName}</span>
                      <span className="text-xs font-medium text-red-200">({fleet.driverPhone})</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-2">
                      <span>📍 {fleet.standbyPost}</span>
                      <span>•</span>
                      <span>Vehicle: {fleet.vehicleType}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <a
                    href={`tel:${fleet.driverPhone}`}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Phone className="w-4 h-4 text-emerald-300" />
                    <span>Call Driver Kailash (+91 94370 00108)</span>
                  </a>

                  <button
                    onClick={() => {
                      triggerToast('Security Gate 1 turnstile clearance broadcasted. Boom barrier unlocked.');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Gate 1 Barrier</span>
                  </button>

                  <button
                    onClick={() => setShowAmbulanceModal(true)}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-black text-xs shadow-lg transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Ambulance className="w-4 h-4" />
                    <span>Send Ambulance Now</span>
                  </button>
                </div>
              </div>

              {/* 2. NEAREST TERTIARY HOSPITALS & TRANSIT TIME TILES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">Nearby Hospitals for Emergency</h4>
                    <p className="text-xs text-slate-500">Hospitals near campus with distance, travel time, and emergency phone numbers</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                    3 Network Hospitals
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fleet.nearestHospitals.map((hosp, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md transition space-y-3 ${
                        idx === 0 ? 'border-rose-300 ring-2 ring-rose-500/10' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[9px] font-black uppercase mb-1 inline-block">
                              Main Hospital for Students
                            </span>
                          )}
                          <h5 className="font-extrabold text-sm text-slate-900">{hosp.name}</h5>
                          <span className="text-xs text-slate-400 font-mono">Drive time: ~{hosp.etaMinutes} mins</span>
                        </div>
                        <span className="text-sm font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
                          {hosp.distance}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs flex items-center justify-between">
                        <span className="text-slate-500">Emergency Phone:</span>
                        <a href={`tel:${hosp.phone}`} className="font-mono font-bold text-blue-600 hover:underline">
                          {hosp.phone}
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          setShowAmbulanceModal(true);
                        }}
                        className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs transition cursor-pointer"
                      >
                        Dispatch Patient to {hosp.name.split(' ')[0]}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ACTIVE AMBULANCE DISPATCHES & REFERRAL HISTORY */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900">Ambulance Trips & Hospital Transfers Log</h4>
                  <span className="text-xs text-slate-400">{referrals.length} Total Records</span>
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
                            Mark Trip Done
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Trip Done</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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

      <DispenseMedicineModal
        isOpen={showDispenseModal}
        onClose={() => setShowDispenseModal(false)}
        inventory={inventory}
        onDispense={(newDisp) => {
          // Deduct from inventory
          setInventory((prev) =>
            prev.map((item) =>
              item.name.toLowerCase().includes(newDisp.medicineName?.toLowerCase() || '') ||
              (newDisp.medicineName && item.name.includes(newDisp.medicineName))
                ? {
                    ...item,
                    quantity: Math.max(0, item.quantity - (newDisp.quantity || 1)),
                    isLowStock: Math.max(0, item.quantity - (newDisp.quantity || 1)) <= item.minStock,
                  }
                : item
            )
          );

          const recObj: StudentMedicineDispenseRecord = {
            id: `disp-${Date.now()}`,
            dispenseNumber: newDisp.dispenseNumber || `DISP-2026-${Math.floor(100 + Math.random() * 900)}`,
            studentName: newDisp.studentName || 'Student Resident',
            studentRoll: newDisp.studentRoll || 'REC-2023-CS042',
            hostelRoom: newDisp.hostelRoom || 'Nilgiri A-204',
            medicineName: newDisp.medicineName || 'Paracetamol 650mg (Dolo 650)',
            quantity: newDisp.quantity || 1,
            unit: newDisp.unit || 'Strips',
            dispensedTime: 'Just now',
            pharmacistName: pharmacist.name,
            directions: newDisp.directions || 'As advised after meals',
            isFreeStudentQuota: true,
          };
          setDispensations((prev) => [recObj, ...prev]);
          triggerToast(`Dispensed ${recObj.quantity} ${recObj.unit} of ${recObj.medicineName} to ${recObj.studentName}. Stock updated.`);
        }}
      />
    </div>
  );
}
