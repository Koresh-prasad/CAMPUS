'use client';

import React, { useState, useEffect } from 'react';
import RoleGuard from '../../../../components/RoleGuard';
import {
  Shield,
  QrCode,
  Users,
  Car,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  RefreshCw,
  LogOut,
  Phone,
  ScanLine,
  ShieldAlert,
  Flame,
  Check,
  X,
  Lock,
  Unlock,
  Radio,
  Camera,
  Eye,
  Sliders,
  Bell,
  FileText,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  MapPin,
  Building,
  UserCheck,
  UserX,
  Volume2,
  VolumeX,
  HelpCircle,
  Activity,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Filter,
  CheckCheck,
  Sparkles,
  Award,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import {
  SecurityTab,
  GatePassScanResult,
  SecurityGatePass,
  StudentEntryExitLog,
  SecurityVisitor,
  SecurityVehicle,
  SecurityParcel,
  SecurityIncident,
  SecurityEmergency,
  SecurityLostFound,
  SecurityGateLog,
  SecurityReportItem,
  SecurityOfficerProfile,
} from './types';

import {
  INITIAL_SECURITY_OFFICER,
  INITIAL_SECURITY_GATE_PASSES,
  INITIAL_ENTRY_EXIT_LOGS,
  INITIAL_SECURITY_VISITORS,
  INITIAL_SECURITY_VEHICLES,
  INITIAL_SECURITY_PARCELS,
  INITIAL_SECURITY_INCIDENTS,
  INITIAL_SECURITY_EMERGENCIES,
  INITIAL_LOST_FOUND,
  INITIAL_GATE_LOGS,
  INITIAL_SECURITY_REPORTS,
} from './mockData';

import {
  ConfirmScanModal,
  RegisterVisitorModal,
  LogVehicleModal,
  RegisterParcelModal,
  ReportIncidentModal,
  LostFoundModal,
  SecurityHelpModal,
} from './modals';

const API_BASE = '/api';

export default function SecurityDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={['SECURITY', 'STAFF', 'DIRECTOR', 'ADMIN']}
      portalTitle="Campus Gate Security Hub"
    >
      {({ user, token, logout }) => (
        <SecurityPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function SecurityPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  // Navigation & Settings
  const [activeTab, setActiveTab] = useState<SecurityTab>('DASHBOARD');
  const [toastMsg, setToastMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [audioBeep, setAudioBeep] = useState(true);
  const [gateSecurityMode, setGateSecurityMode] = useState<'NORMAL' | 'STRICT' | 'CURFEW' | 'LOCKDOWN'>('NORMAL');
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Officer Profile
  const [officer, setOfficer] = useState<SecurityOfficerProfile>(() => {
    if (user?.name) {
      return {
        ...INITIAL_SECURITY_OFFICER,
        name: user.name,
      };
    }
    return INITIAL_SECURITY_OFFICER;
  });

  // Core Data States
  const [passes, setPasses] = useState<SecurityGatePass[]>(INITIAL_SECURITY_GATE_PASSES);
  const [entryExitLogs, setEntryExitLogs] = useState<StudentEntryExitLog[]>(INITIAL_ENTRY_EXIT_LOGS);
  const [visitors, setVisitors] = useState<SecurityVisitor[]>(INITIAL_SECURITY_VISITORS);
  const [vehicles, setVehicles] = useState<SecurityVehicle[]>(INITIAL_SECURITY_VEHICLES);
  const [parcels, setParcels] = useState<SecurityParcel[]>(INITIAL_SECURITY_PARCELS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_SECURITY_INCIDENTS);
  const [emergencies, setEmergencies] = useState<SecurityEmergency[]>(INITIAL_SECURITY_EMERGENCIES);
  const [lostFound, setLostFound] = useState<SecurityLostFound[]>(INITIAL_LOST_FOUND);
  const [gateLogs, setGateLogs] = useState<SecurityGateLog[]>(INITIAL_GATE_LOGS);
  const [reports, setReports] = useState<SecurityReportItem[]>(INITIAL_SECURITY_REPORTS);

  // Scanner States
  const [scanInput, setScanInput] = useState('');
  const [activeScanResult, setActiveScanResult] = useState<GatePassScanResult | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [scannerCameraMode, setScannerCameraMode] = useState(false);

  // Modals Visibility
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showLostFoundModal, setShowLostFoundModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Filter States
  const [passFilter, setPassFilter] = useState<'ALL' | 'APPROVED' | 'OUT' | 'OVERDUE' | 'RETURNED'>('ALL');
  const [passSearch, setPassSearch] = useState('');
  const [movementFilter, setMovementFilter] = useState<'ALL' | 'EXIT' | 'ENTRY' | 'FLAGGED'>('ALL');
  const [movementSearch, setMovementSearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState<'ALL' | 'Checked In' | 'Checked Out' | 'Expected'>('ALL');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<'ALL' | 'INSIDE' | 'EXITED'>('ALL');
  const [parcelFilter, setParcelFilter] = useState<'ALL' | 'Waiting' | 'Collected' | 'Returned'>('ALL');
  const [gateLogSearch, setGateLogSearch] = useState('');

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

  // Sound play helper for gate scans
  const playScanBeep = (type: 'VALID' | 'INVALID') => {
    if (!audioBeep) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'VALID') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {}
  };

  // Two-way synchronization with Student Platform & Warden Platform
  useEffect(() => {
    const syncData = async () => {
      try {
        // 1. Sync SOS emergencies from localStorage
        const savedSos = localStorage.getItem('shms_active_emergency');
        if (savedSos) {
          try {
            const parsed = JSON.parse(savedSos);
            if (parsed?.id && !emergencies.some((e) => e.id === parsed.id)) {
              setEmergencies((prev) => [
                {
                  id: parsed.id,
                  studentName: parsed.studentName || 'Student Resident',
                  studentRoll: parsed.studentRoll || 'REC-2023-CS042',
                  studentId: parsed.studentId || 'CS2023042',
                  hostel: parsed.hostel || 'Nilgiri Residence (Block A)',
                  room: parsed.room || 'A-204',
                  phone: parsed.phone || '+91 98765 43210',
                  parentPhone: parsed.parentPhone || '+91 94370 88990',
                  emergencyType: parsed.type || 'MEDICAL',
                  timestamp: parsed.timestamp || 'Just now',
                  locationDetails: parsed.location || 'Hostel Campus',
                  notes: parsed.notes || 'Emergency SOS triggered from Mobile/Web desk',
                  status: 'ACTIVE',
                },
                ...prev,
              ]);
            }
          } catch (e) {}
        }

        // 2. Fetch active emergencies from backend
        const emRes = await fetch(`${API_BASE}/emergency/active`, { credentials: 'omit' }).catch(() => null);
        if (emRes && emRes.ok) {
          const apiAlerts = await emRes.json();
          if (Array.isArray(apiAlerts) && apiAlerts.length > 0) {
            setEmergencies((prev) => {
              const ids = new Set(prev.map((e) => e.id));
              const fresh = apiAlerts
                .filter((a: any) => !ids.has(a.id))
                .map((a: any) => ({
                  id: a.id,
                  studentName: a.residentName || 'Student',
                  studentRoll: a.residentId || 'REC-STUDENT',
                  studentId: a.residentId,
                  hostel: a.blockName || 'Hostel',
                  room: a.roomNumber || 'Room',
                  phone: a.residentPhone || '+91 98765 43210',
                  parentPhone: a.parentPhone || '+91 94370 88990',
                  emergencyType: (a.emergencyType || 'MEDICAL') as any,
                  timestamp: new Date(a.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  locationDetails: a.locationDetails || 'Campus Perimeter',
                  notes: a.notes || 'Live SOS',
                  status: a.status || 'ACTIVE',
                }));
              return [...fresh, ...prev];
            });
          }
        }

        // 3. Sync approved passes from backend
        const passRes = await fetch(`${API_BASE}/passes?status=APPROVED`, { credentials: 'omit' }).catch(() => null);
        if (passRes && passRes.ok) {
          const pData = await passRes.json();
          const apiPasses = pData.passes || pData;
          if (Array.isArray(apiPasses) && apiPasses.length > 0) {
            setPasses((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              const fresh = apiPasses
                .filter((p: any) => !ids.has(p.id))
                .map((p: any) => ({
                  id: p.id,
                  passNumber: p.passNumber,
                  studentId: p.residentId,
                  studentName: p.residentName || 'Student Resident',
                  studentRoll: p.residentId || 'REC-CS-000',
                  photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
                  hostel: p.blockName || 'Nilgiri Residence (Block A)',
                  roomNumber: p.roomNumber || 'A-101',
                  phone: '+91 98765 43210',
                  guardianPhone: '+91 94370 88990',
                  passType: (p.passType || 'DAY_PASS') as any,
                  destination: p.destination || 'Campus Perimeter',
                  reason: p.reason || 'Personal errand',
                  approvedBy: p.approvedByName || 'Hostel Warden',
                  validDate: 'Today',
                  expectedExitTime: new Date(p.validFrom).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  expectedReturnTime: new Date(p.validTill).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                  status: (p.status === 'APPROVED' ? 'APPROVED' : 'OUT') as SecurityGatePass['status'],
                  qrToken: p.qrCodeToken || `REC-PASS-${p.id}`,
                  parentConsent: 'CONFIRMED' as const,
                }));
              return [...fresh, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn('Security Hub background synchronization notice:', err);
      }
    };

    syncData();
    const interval = setInterval(syncData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Verification Logic for QR Pass
  const verifyPassToken = (rawToken: string): GatePassScanResult => {
    const cleanToken = rawToken.trim().toUpperCase();
    const matchedPass = passes.find(
      (p) => p.qrToken.toUpperCase() === cleanToken || p.passNumber.toUpperCase() === cleanToken || p.studentRoll.toUpperCase() === cleanToken
    );

    if (!matchedPass) {
      return {
        token: cleanToken,
        isValid: false,
        canConfirmExit: false,
        canConfirmReturn: false,
        status: 'INVALID',
        message: 'Invalid / Unrecognized Gate Pass. No active record matches this token.',
        passId: '',
        studentId: '',
        studentName: 'Unrecognized Bearer',
        studentRoll: 'N/A',
        photoUrl: '',
        hostel: 'N/A',
        roomNumber: 'N/A',
        purpose: 'N/A',
        destination: 'N/A',
        exitTime: 'N/A',
        expectedReturnTime: 'N/A',
        parentConsent: 'UNKNOWN',
        passType: 'N/A',
        scanTimestamp: currentTime || new Date().toLocaleTimeString('en-IN'),
        rejectionReason: 'Token signature mismatch. Verification failed at Main Turnstile.',
      };
    }

    if (matchedPass.status === 'REJECTED') {
      return {
        token: cleanToken,
        isValid: false,
        canConfirmExit: false,
        canConfirmReturn: false,
        status: 'REVOKED',
        message: 'This pass was REJECTED or REVOKED by the Hostel Warden.',
        passId: matchedPass.id,
        studentId: matchedPass.studentId,
        studentName: matchedPass.studentName,
        studentRoll: matchedPass.studentRoll,
        photoUrl: matchedPass.photoUrl,
        hostel: matchedPass.hostel,
        roomNumber: matchedPass.roomNumber,
        purpose: matchedPass.reason,
        destination: matchedPass.destination,
        exitTime: matchedPass.expectedExitTime,
        expectedReturnTime: matchedPass.expectedReturnTime,
        parentConsent: matchedPass.parentConsent,
        passType: matchedPass.passType,
        scanTimestamp: currentTime || new Date().toLocaleTimeString('en-IN'),
        rejectionReason: 'Pass rejected by Warden. Exit prohibited.',
      };
    }

    if (matchedPass.status === 'OUT' || matchedPass.status === 'OVERDUE') {
      return {
        token: cleanToken,
        isValid: true,
        canConfirmExit: false,
        canConfirmReturn: true,
        status: 'ALREADY_OUT',
        message: 'Resident is currently OUTSIDE campus. Scan to confirm return entry.',
        passId: matchedPass.id,
        studentId: matchedPass.studentId,
        studentName: matchedPass.studentName,
        studentRoll: matchedPass.studentRoll,
        photoUrl: matchedPass.photoUrl,
        hostel: matchedPass.hostel,
        roomNumber: matchedPass.roomNumber,
        purpose: matchedPass.reason,
        destination: matchedPass.destination,
        exitTime: matchedPass.actualExitTime || matchedPass.expectedExitTime,
        expectedReturnTime: matchedPass.expectedReturnTime,
        actualExitTime: matchedPass.actualExitTime || '04:35 PM',
        parentConsent: matchedPass.parentConsent,
        passType: matchedPass.passType,
        scanTimestamp: currentTime || new Date().toLocaleTimeString('en-IN'),
      };
    }

    if (matchedPass.status === 'RETURNED') {
      return {
        token: cleanToken,
        isValid: false,
        canConfirmExit: false,
        canConfirmReturn: false,
        status: 'EXPIRED',
        message: 'Pass has already been completed and returned. A new gate pass is required for departure.',
        passId: matchedPass.id,
        studentId: matchedPass.studentId,
        studentName: matchedPass.studentName,
        studentRoll: matchedPass.studentRoll,
        photoUrl: matchedPass.photoUrl,
        hostel: matchedPass.hostel,
        roomNumber: matchedPass.roomNumber,
        purpose: matchedPass.reason,
        destination: matchedPass.destination,
        exitTime: matchedPass.expectedExitTime,
        expectedReturnTime: matchedPass.expectedReturnTime,
        parentConsent: matchedPass.parentConsent,
        passType: matchedPass.passType,
        scanTimestamp: currentTime || new Date().toLocaleTimeString('en-IN'),
        rejectionReason: 'Completed pass reuse detected.',
      };
    }

    // Approved Pass - Valid for Departure
    return {
      token: cleanToken,
      isValid: true,
      canConfirmExit: true,
      canConfirmReturn: false,
      status: 'VALID',
      message: '✓ VALID APPROVED GATE PASS — Warden Clearance Verified.',
      passId: matchedPass.id,
      studentId: matchedPass.studentId,
      studentName: matchedPass.studentName,
      studentRoll: matchedPass.studentRoll,
      photoUrl: matchedPass.photoUrl,
      hostel: matchedPass.hostel,
      roomNumber: matchedPass.roomNumber,
      purpose: matchedPass.reason,
      destination: matchedPass.destination,
      exitTime: matchedPass.expectedExitTime,
      expectedReturnTime: matchedPass.expectedReturnTime,
      parentConsent: matchedPass.parentConsent,
      passType: matchedPass.passType,
      scanTimestamp: currentTime || new Date().toLocaleTimeString('en-IN'),
    };
  };

  const handleExecuteScan = (tokenToScan?: string) => {
    const raw = tokenToScan || scanInput;
    if (!raw.trim()) return;

    const result = verifyPassToken(raw);
    setActiveScanResult(result);
    playScanBeep(result.isValid ? 'VALID' : 'INVALID');
    setShowConfirmModal(true);
  };

  // Confirm Exit Action
  const handleConfirmExit = async (passId: string) => {
    const nowTime = currentTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const targetPass = passes.find((p) => p.id === passId);

    // 1. Update Pass locally
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'OUT',
              actualExitTime: nowTime,
            }
          : p
      )
    );

    // 2. Prepend Student Entry/Exit Log
    if (targetPass) {
      const newLog: StudentEntryExitLog = {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        studentId: targetPass.studentId,
        studentName: targetPass.studentName,
        rollNumber: targetPass.studentRoll,
        photoUrl: targetPass.photoUrl,
        hostel: targetPass.hostel,
        room: targetPass.roomNumber,
        gate: officer.gatePost.split('(')[0].trim(),
        direction: 'EXIT',
        securityOfficer: officer.name,
        passId: targetPass.passNumber,
        status: 'AUTHORIZED',
      };
      setEntryExitLogs((prev) => [newLog, ...prev]);

      // Prepend Gate Log
      const newGateLog: SecurityGateLog = {
        id: `gl-${Date.now()}`,
        timestamp: nowTime,
        personName: targetPass.studentName,
        category: 'STUDENT',
        direction: 'EXIT',
        gate: officer.gatePost.split('(')[0].trim(),
        passOrVisitorId: targetPass.passNumber,
        securityOfficer: officer.name,
        status: 'GRANTED',
      };
      setGateLogs((prev) => [newGateLog, ...prev]);
    }

    // 3. Two-way synchronization with Student Platform (localStorage)
    try {
      if (targetPass) {
        const studentPassCard = {
          status: 'Outside Campus 🚶',
          studentName: targetPass.studentName,
          rollNumber: targetPass.studentRoll,
          hostel: targetPass.hostel,
          room: targetPass.roomNumber,
          purpose: targetPass.reason,
          outTime: `${targetPass.validDate}, ${nowTime}`,
          returnTime: targetPass.expectedReturnTime,
          qrToken: targetPass.qrToken,
          warden: 'Approved ✅',
          security: `Exit Confirmed (${nowTime} by ${officer.name})`,
          studentPhone: targetPass.phone,
          fatherPhone: targetPass.guardianPhone,
        };
        localStorage.setItem('shms_gate_pass_data', JSON.stringify(studentPassCard));

        const existing = localStorage.getItem('shms_student_passes');
        if (existing) {
          let passList = JSON.parse(existing);
          passList = passList.map((p: any) =>
            p.id === passId || p.qrToken === targetPass.qrToken ? { ...p, status: 'OUT', actualExitAt: nowTime } : p
          );
          localStorage.setItem('shms_student_passes', JSON.stringify(passList));
        }
      }
    } catch (e) {
      console.warn('Sync to student storage notice:', e);
    }

    // 4. Backend API integration: POST /api/passes/scan-gate
    try {
      if (targetPass) {
        await fetch(`${API_BASE}/passes/scan-gate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrCodeToken: targetPass.qrToken,
            scanType: 'EXIT',
            guardName: officer.name,
          }),
        });
      }
    } catch (e) {
      console.warn('Backend scan-gate API call notice:', e);
    }

    triggerToast(`✓ Exit Confirmed for ${targetPass?.studentName || 'Resident'}. Turnstile gate unlocked.`);
    setScanInput('');
  };

  // Confirm Return Action
  const handleConfirmReturn = async (passId: string) => {
    const nowTime = currentTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const targetPass = passes.find((p) => p.id === passId);

    // 1. Update Pass locally
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              status: 'RETURNED',
              actualReturnTime: nowTime,
            }
          : p
      )
    );

    // 2. Prepend Student Entry/Exit Log
    if (targetPass) {
      const newLog: StudentEntryExitLog = {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        studentId: targetPass.studentId,
        studentName: targetPass.studentName,
        rollNumber: targetPass.studentRoll,
        photoUrl: targetPass.photoUrl,
        hostel: targetPass.hostel,
        room: targetPass.roomNumber,
        gate: officer.gatePost.split('(')[0].trim(),
        direction: 'ENTRY',
        securityOfficer: officer.name,
        passId: targetPass.passNumber,
        status: 'AUTHORIZED',
      };
      setEntryExitLogs((prev) => [newLog, ...prev]);

      // Prepend Gate Log
      const newGateLog: SecurityGateLog = {
        id: `gl-${Date.now()}`,
        timestamp: nowTime,
        personName: targetPass.studentName,
        category: 'STUDENT',
        direction: 'ENTRY',
        gate: officer.gatePost.split('(')[0].trim(),
        passOrVisitorId: targetPass.passNumber,
        securityOfficer: officer.name,
        status: 'GRANTED',
      };
      setGateLogs((prev) => [newGateLog, ...prev]);
    }

    // 3. Two-way synchronization with Student Platform (localStorage)
    try {
      if (targetPass) {
        const studentPassCard = {
          status: 'Returned & In Hostel 🏠',
          studentName: targetPass.studentName,
          rollNumber: targetPass.studentRoll,
          hostel: targetPass.hostel,
          room: targetPass.roomNumber,
          purpose: targetPass.reason,
          outTime: targetPass.actualExitTime || targetPass.expectedExitTime,
          returnTime: `Returned at ${nowTime}`,
          qrToken: targetPass.qrToken,
          warden: 'Approved ✅',
          security: `Return Verified (${nowTime} by ${officer.name})`,
          studentPhone: targetPass.phone,
          fatherPhone: targetPass.guardianPhone,
        };
        localStorage.setItem('shms_gate_pass_data', JSON.stringify(studentPassCard));

        const existing = localStorage.getItem('shms_student_passes');
        if (existing) {
          let passList = JSON.parse(existing);
          passList = passList.map((p: any) =>
            p.id === passId || p.qrToken === targetPass.qrToken ? { ...p, status: 'RETURNED', actualReturnAt: nowTime } : p
          );
          localStorage.setItem('shms_student_passes', JSON.stringify(passList));
        }
      }
    } catch (e) {
      console.warn('Sync to student storage notice:', e);
    }

    // 4. Backend API integration: POST /api/passes/scan-gate
    try {
      if (targetPass) {
        await fetch(`${API_BASE}/passes/scan-gate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrCodeToken: targetPass.qrToken,
            scanType: 'ENTRY',
            guardName: officer.name,
          }),
        });
      }
    } catch (e) {
      console.warn('Backend scan-gate API call notice:', e);
    }

    triggerToast(`✓ Return Verified for ${targetPass?.studentName || 'Resident'}. Status set to PRESENT in hostel.`);
    setScanInput('');
  };

  // Visitor Check Out
  const handleCheckOutVisitor = (visId: string) => {
    const outTime = currentTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === visId
          ? {
              ...v,
              exitTime: outTime,
              status: 'Checked Out',
            }
          : v
      )
    );

    const vis = visitors.find((v) => v.id === visId);
    if (vis) {
      setGateLogs((prev) => [
        {
          id: `gl-${Date.now()}`,
          timestamp: outTime,
          personName: `${vis.name} (Visitor)`,
          category: 'VISITOR',
          direction: 'EXIT',
          gate: officer.gatePost.split('(')[0].trim(),
          passOrVisitorId: vis.passNumber || 'VP-TEMP',
          securityOfficer: officer.name,
          status: 'GRANTED',
        },
        ...prev,
      ]);
    }

    triggerToast('Visitor departure recorded. Gate badge surrendered.');
  };

  // Vehicle Exit
  const handleMarkVehicleExit = (vehId: string) => {
    const outTime = currentTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehId
          ? {
              ...v,
              exitTime: outTime,
              status: 'EXITED',
            }
          : v
      )
    );

    const veh = vehicles.find((v) => v.id === vehId);
    if (veh) {
      setGateLogs((prev) => [
        {
          id: `gl-${Date.now()}`,
          timestamp: outTime,
          personName: `${veh.plateNumber} (${veh.driverName})`,
          category: 'VEHICLE',
          direction: 'EXIT',
          gate: 'Main Vehicle Barrier',
          passOrVisitorId: veh.plateNumber,
          securityOfficer: officer.name,
          status: 'GRANTED',
        },
        ...prev,
      ]);
    }

    triggerToast(`Vehicle ${veh?.plateNumber || ''} cleared for departure.`);
  };

  // Parcel Status Update
  const handleMarkParcelCollected = (parcelId: string) => {
    const colTime = currentTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setParcels((prev) =>
      prev.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              status: 'Collected',
              collectionTime: colTime,
            }
          : p
      )
    );
    triggerToast('Parcel handed over to recipient. Gate delivery registry updated.');
  };

  // Resolve Emergency Alert
  const handleResolveEmergency = async (emId: string) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === emId ? { ...e, status: 'RESOLVED' } : e))
    );
    try {
      localStorage.removeItem('shms_active_emergency');
      await fetch(`${API_BASE}/emergency/${emId}/resolve`, { method: 'POST' }).catch(() => null);
    } catch (e) {}
    triggerToast('Emergency incident marked resolved. Escalation logs archived.');
  };

  // Download Sample CSV Report
  const handleDownloadCsv = (reportName: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        `CAMPUSHELPER SECURITY REGISTER REPORT: ${reportName}\n` +
          `Generated Date,${currentDate} ${currentTime}\n` +
          `Security Officer,${officer.name} (${officer.badgeId})\n` +
          `Gate Post,${officer.gatePost}\n\n` +
          `Timestamp,Entity Name,ID/Roll,Category,Direction,Status,Gate,Officer\n` +
          gateLogs
            .map(
              (l) =>
                `"${l.timestamp}","${l.personName}","${l.passOrVisitorId}","${l.category}","${l.direction}","${l.status}","${l.gate}","${l.securityOfficer}"`
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
  const insideCampusCount = 497;
  const outsideCampusCount = passes.filter((p) => p.status === 'OUT' || p.status === 'OVERDUE').length + 18;
  const todayExitsCount = entryExitLogs.filter((l) => l.direction === 'EXIT').length;
  const todayReturnsCount = entryExitLogs.filter((l) => l.direction === 'ENTRY').length;
  const activeGatePassesCount = passes.filter((p) => p.status === 'APPROVED' || p.status === 'OUT').length;
  const expectedReturnsCount = passes.filter((p) => p.status === 'OUT').length;
  const overdueReturnsCount = passes.filter((p) => p.status === 'OVERDUE').length;
  const visitorsTodayCount = visitors.length;
  const vehiclesInsideCount = vehicles.filter((v) => v.status === 'INSIDE').length;
  const openIncidentsCount = incidents.filter((i) => i.status === 'Open' || i.status === 'Under Review').length;
  const activeEmergenciesCount = emergencies.filter((e) => e.status === 'ACTIVE' || e.status === 'INVESTIGATING').length;

  const overdueList = passes.filter((p) => p.status === 'OVERDUE');

  // Featured sample pass for the photo-like Gate Pass display card
  const primaryDisplayPass = passes.find((p) => p.studentRoll === 'REC-2023-CS042') || passes[0];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      {/* =================================================================== */}
      {/* 1. LEFT SIDEBAR: PURE DARK / BLACK (EXACTLY AS REQUESTED & IN PHOTO) */}
      {/* =================================================================== */}
      <aside className="w-64 bg-[#0d1527] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none text-slate-100 z-20 shadow-xl">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/70 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-1.5">
                  <span>Campus Helper</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-400 mt-0.5">
                  SECURITY SUPER APP • 13 HUBS
                </p>
              </div>
            </div>
          </div>

          {/* Officer Profile Badge Card in Sidebar (Matching the photo) */}
          <div className="px-3 pt-3">
            <div className="bg-[#141e33] border border-slate-800 rounded-2xl p-2.5 flex items-center space-x-3">
              <div className="relative">
                <img
                  src={officer.avatarUrl}
                  alt={officer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-blue-500/40"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#141e33] absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-xs text-white truncate">{officer.name}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  {officer.badgeId} • Shift In-Charge
                </p>
                <p className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="truncate">Main Gate 1 • Turnstiles</span>
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Search Bar (Matching the photo) */}
          <div className="px-3 pt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campus features & services..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#141e33] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Navigation Links (13 items, pill active state like the photo) */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-290px)] overflow-y-auto custom-scrollbar">
            {[
              { id: 'DASHBOARD', label: 'Home Dashboard', icon: Shield, badge: null },
              { id: 'QR_SCANNER', label: 'QR Gate Scanner', icon: QrCode, badge: 'Fast Gate', badgeColor: 'bg-blue-500/20 text-blue-300' },
              { id: 'GATE_PASSES', label: 'Gate Passes', icon: FileText, badge: `${activeGatePassesCount}`, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
              { id: 'ENTRY_EXIT', label: 'Student Entry / Exit', icon: ArrowRight, badge: null },
              { id: 'VISITORS', label: 'Visitors', icon: Users, badge: `${visitors.filter((v) => v.status === 'Checked In').length} in`, badgeColor: 'bg-purple-500/20 text-purple-300' },
              { id: 'VEHICLES', label: 'Vehicles', icon: Car, badge: `${vehiclesInsideCount} in`, badgeColor: 'bg-slate-700 text-slate-300' },
              { id: 'PARCELS', label: 'Parcels & Deliveries', icon: Package, badge: `${parcels.filter((p) => p.status === 'Waiting').length}`, badgeColor: 'bg-amber-500/20 text-amber-300' },
              { id: 'INCIDENTS', label: 'Security Incidents', icon: AlertTriangle, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : null, badgeColor: 'bg-rose-500/20 text-rose-300' },
              { id: 'EMERGENCY', label: 'Emergency / SOS', icon: ShieldAlert, badge: activeEmergenciesCount > 0 ? 'ALERT' : null, badgeColor: 'bg-red-500 text-white animate-pulse' },
              { id: 'LOST_FOUND', label: 'Lost & Found', icon: Search, badge: `${lostFound.filter((l) => l.status === 'Found').length}`, badgeColor: 'bg-slate-700 text-slate-300' },
              { id: 'GATE_LOGS', label: 'Gate Logs', icon: Clock, badge: null },
              { id: 'REPORTS', label: 'Reports', icon: FileText, badge: '9 Reg', badgeColor: 'bg-slate-700 text-slate-300' },
              { id: 'SETTINGS', label: 'Profile & Settings', icon: Sliders, badge: null },
            ]
              .filter((tab) => !sidebarSearch || tab.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SecurityTab)}
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

        {/* Bottom Actions: Help & Logout (Matching photo style) */}
        <div className="p-3 border-t border-slate-800/80 space-y-1.5 bg-[#0b1220]">
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/70 transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Help & Gate SOPs</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#141e33] hover:bg-rose-600/90 transition cursor-pointer border border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Security Desk</span>
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* 2. MAIN CONTENT AREA: CRISP WHITE / LIGHT THEME (EXACTLY AS PHOTO) */}
      {/* =================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] text-slate-800 overflow-hidden">
        {/* Top Header Navbar (Pure White, Matching Photo Style) */}
        <header className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Gate Operations Hub</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-blue-600 text-xs font-bold font-mono">
                  {activeTab === 'DASHBOARD' && 'Dashboard Overview'}
                  {activeTab === 'QR_SCANNER' && 'Live Turnstile Scanner'}
                  {activeTab === 'GATE_PASSES' && 'Student Gate Passes'}
                  {activeTab === 'ENTRY_EXIT' && 'Turnstile Movement Feed'}
                  {activeTab === 'VISITORS' && 'Visitor Management'}
                  {activeTab === 'VEHICLES' && 'Vehicle Movement'}
                  {activeTab === 'PARCELS' && 'Parcels & Deliveries'}
                  {activeTab === 'INCIDENTS' && 'Security Incidents'}
                  {activeTab === 'EMERGENCY' && 'Emergency Distress Beacon'}
                  {activeTab === 'LOST_FOUND' && 'Lost & Found'}
                  {activeTab === 'GATE_LOGS' && 'Audit Gate Logs'}
                  {activeTab === 'REPORTS' && 'Security Registers'}
                  {activeTab === 'SETTINGS' && 'Gate Settings & Profile'}
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

            {/* Emergency SOS Button (Matching Photo) */}
            <button
              onClick={() => setActiveTab('EMERGENCY')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition cursor-pointer shadow-xs ${
                activeEmergenciesCount > 0
                  ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS Help</span>
              {activeEmergenciesCount > 0 && (
                <span className="px-1.5 py-0.2 bg-white text-rose-600 rounded-full text-[10px]">
                  {activeEmergenciesCount}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('INCIDENTS')}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Incidents / Alerts"
            >
              <Bell className="w-4 h-4" />
              {openIncidentsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5"></span>
              )}
            </button>

            {/* Refresh Sync */}
            <button
              onClick={() => triggerToast('Synchronizing turnstile and gate data with campus cloud...')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Sync Gate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Primary Action Button (+ Register Visitor / Fast Scan) */}
            <button
              onClick={() => setActiveTab('QR_SCANNER')}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Fast Scan</span>
            </button>

            {/* Officer Avatar */}
            <div
              onClick={() => setActiveTab('SETTINGS')}
              className="cursor-pointer group pl-1"
              title="Security Profile"
            >
              <img
                src={officer.avatarUrl}
                alt={officer.name}
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
          {/* TAB 1: SECURITY DASHBOARD (MATCHING THE PHOTO'S COMPOSITION) */}
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
                    <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center absolute -bottom-1 -right-1 text-white shadow-xs">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                        ACTIVE ON DUTY
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                        ID: {officer.badgeId}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      Welcome Back, {officer.name}!
                    </h3>
                    <p className="text-xs text-blue-100 font-medium mt-0.5">
                      Senior Security In-Charge • {officer.gatePost} • Shift: {officer.shift}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <button
                    onClick={() => setActiveTab('QR_SCANNER')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Optical Scanner</span>
                  </button>
                  <button
                    onClick={() => setShowVisitorModal(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span>Register Visitor</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('EMERGENCY')}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Flame className="w-4 h-4" />
                    <span>SOS Help</span>
                  </button>
                </div>
              </div>

              {/* 2. FOUR PRIMARY METRIC CARDS (EXACTLY AS IN PHOTO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      STUDENTS INSIDE CAMPUS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {insideCampusCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <span>✓ Verified & Inside Hostel (95.6%)</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      STUDENTS OUTSIDE
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                      {outsideCampusCount}
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-600 mt-1">
                      <span>Out on Warden Approved Pass</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      ACTIVE GATE PASSES
                    </span>
                    <p className="text-2xl font-black text-emerald-600 tracking-tight mt-1 flex items-center space-x-1.5">
                      <span>APPROVED</span>
                      <Check className="w-5 h-5 text-emerald-600" />
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 mt-1">
                      <span>Today: {todayExitsCount} Exits, {todayReturnsCount} Returns</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      OVERDUE RETURNS
                    </span>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-1">
                      <span className={overdueReturnsCount > 0 ? 'text-amber-600' : 'text-slate-900'}>
                        {overdueReturnsCount} Active
                      </span>
                    </p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-amber-600 mt-1">
                      <span>Verification Required</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* 3. TWO COLUMNS LAYOUT: LEFT IS GATE PASS CARD (LIKE PHOTO) & RIGHT IS GATE SCHEDULE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Exact Photo-Style Gate Pass Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">Gate Pass</h4>
                      <div className="w-16 h-1 bg-blue-600 rounded-full mt-1"></div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider">
                      ACTIVE
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                    <span>Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </span>
                  </div>

                  {/* Form Table Layout (Matching photo) */}
                  <div className="grid grid-cols-2 gap-y-2.5 text-xs pt-1 border-t border-slate-100">
                    <div className="text-slate-500 font-semibold">Student:</div>
                    <div className="text-slate-900 font-extrabold text-right">
                      {primaryDisplayPass.studentName}
                    </div>

                    <div className="text-slate-500 font-semibold">Roll Number:</div>
                    <div className="font-mono text-blue-600 font-bold text-right">
                      {primaryDisplayPass.studentRoll}
                    </div>

                    <div className="text-slate-500 font-semibold">Student Phone:</div>
                    <div className="font-mono text-blue-600 font-bold text-right">
                      {primaryDisplayPass.phone}
                    </div>

                    <div className="text-slate-500 font-semibold">Father Phone:</div>
                    <div className="font-mono text-emerald-600 font-bold text-right">
                      {primaryDisplayPass.guardianPhone}
                    </div>

                    <div className="text-slate-500 font-semibold">Hostel:</div>
                    <div className="text-slate-900 font-bold text-right">
                      {primaryDisplayPass.hostel}
                    </div>

                    <div className="text-slate-500 font-semibold">Room:</div>
                    <div className="text-slate-900 font-bold text-right">
                      {primaryDisplayPass.roomNumber}
                    </div>

                    <div className="text-slate-500 font-semibold">Purpose:</div>
                    <div className="text-slate-800 font-medium text-right truncate">
                      {primaryDisplayPass.reason}
                    </div>

                    <div className="text-slate-500 font-semibold">Approved Out:</div>
                    <div className="font-mono text-slate-800 font-medium text-right">
                      {primaryDisplayPass.validDate}, {primaryDisplayPass.expectedExitTime}
                    </div>

                    <div className="text-slate-500 font-semibold">Curfew Return:</div>
                    <div className="font-mono text-slate-900 font-bold text-right">
                      {primaryDisplayPass.expectedReturnTime}
                    </div>

                    <div className="text-slate-500 font-semibold">Warden Clearance:</div>
                    <div className="text-emerald-600 font-extrabold text-right flex items-center justify-end space-x-1">
                      <span>Approved</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>

                    <div className="text-slate-500 font-semibold">Security Gate:</div>
                    <div className="text-blue-600 font-bold text-right">
                      {officer.gatePost.split('(')[0].trim()}
                    </div>
                  </div>

                  {/* Primary Photo-Style Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setScanInput(primaryDisplayPass.qrToken);
                        handleExecuteScan(primaryDisplayPass.qrToken);
                      }}
                      className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>[ Show QR Gate Pass / Confirm Exit ]</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Gate & Turnstile Schedule (Like Today's Mess Schedule in photo) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Today's Gate Schedule</h4>
                        <p className="text-[11px] text-slate-400">Serving Main Perimeter Turnstiles & Barrier 1</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('GATE_LOGS')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Full Activity</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Schedule Block 1 */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-slate-800">
                            Morning Movement (06:00 - 02:00 PM)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-bold">
                            Ended
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Shift handover verified. 24 morning student departures, 12 visitor entries cleared.
                      </p>
                    </div>

                    {/* Schedule Block 2 */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-slate-800">
                            Evening Peak Outing (02:00 - 08:00 PM)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-bold">
                            Active Now
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-800 font-medium">
                        High turnstile traffic. 48 student outings verified, 6 courier deliveries registered.
                      </p>
                    </div>

                    {/* Schedule Block 3 */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                      <div className="space-y-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-slate-800">
                            Night Curfew & Roll Call (09:30 PM - 06:00 AM)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-800 text-[10px] font-bold">
                            Next Shift
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Perimeter gates locked. All exits restricted to approved warden emergency slips.
                        </p>
                      </div>
                      <button
                        onClick={() => triggerToast('Night curfew barrier schedule activated.')}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs border border-blue-200 shadow-xs cursor-pointer shrink-0"
                      >
                        Lock Gate Barrier
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. OVERDUE RETURN BANNER SECTION */}
              {overdueList.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                          <span>Overdue Return Monitor</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-black uppercase">
                            Verification Required
                          </span>
                        </h4>
                        <p className="text-xs text-slate-600">
                          Return overdue — verification required. Please check with resident or hostel warden before escalating.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('GATE_PASSES')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      View All Passes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {overdueList.map((pass) => (
                      <div
                        key={pass.id}
                        className="p-4 rounded-2xl bg-white border border-rose-200 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={pass.photoUrl}
                            alt={pass.studentName}
                            className="w-12 h-12 rounded-xl object-cover border border-rose-200"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-black text-sm text-slate-900">{pass.studentName}</h5>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-bold">
                                {pass.studentRoll}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {pass.hostel} • Room {pass.roomNumber}
                            </p>
                            <p className="text-[11px] text-rose-600 font-bold mt-0.5">
                              Expected: {pass.expectedReturnTime} (Late by ~195 mins)
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-1.5 shrink-0">
                          <a
                            href={`tel:${pass.phone}`}
                            className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-[11px] text-center transition border border-blue-200"
                          >
                            Call Student
                          </a>
                          <a
                            href={`tel:${pass.guardianPhone}`}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] text-center transition"
                          >
                            Call Guardian
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. LIVE STUDENT TURNSTILE ACTIVITY TABLE */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Live Turnstile Movement Log
                      </h4>
                      <p className="text-xs text-slate-400">Real-time gate barrier clearance feed</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('ENTRY_EXIT')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View All Movements</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Direction</th>
                        <th className="py-3 px-4">Gate</th>
                        <th className="py-3 px-4">Pass ID</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {entryExitLogs.slice(0, 5).map((log) => {
                        const isExit = log.direction === 'EXIT';
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono text-slate-600">{log.timestamp}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={log.photoUrl}
                                  alt={log.studentName}
                                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                />
                                <div>
                                  <span className="font-extrabold text-slate-900 block">{log.studentName}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{log.rollNumber}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {log.hostel} • {log.room}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                                  isExit ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {log.direction}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{log.gate}</td>
                            <td className="py-3 px-4 font-mono text-blue-600 font-bold">{log.passId}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                {log.status}
                              </span>
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

          {/* ================================================================= */}
          {/* TAB 2: QR GATE SCANNER (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'QR_SCANNER' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Turnstile QR Gate Pass Scanner</h3>
                      <p className="text-xs text-slate-500">
                        Scan resident QR tokens or input pass credentials for instant gate clearance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAudioBeep(!audioBeep)}
                      className={`p-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                        audioBeep
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {audioBeep ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      <span className="hidden sm:inline">{audioBeep ? 'Sound ON' : 'Sound OFF'}</span>
                    </button>
                    <button
                      onClick={() => setScannerCameraMode(!scannerCameraMode)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                        scannerCameraMode
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      <span>{scannerCameraMode ? 'Camera Active' : 'Enable Camera'}</span>
                    </button>
                  </div>
                </div>

                {scannerCameraMode && (
                  <div className="my-5 relative rounded-2xl bg-slate-900 border-2 border-dashed border-blue-500/50 h-52 flex flex-col items-center justify-center overflow-hidden">
                    <div className="w-40 h-40 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center animate-pulse">
                      <span className="w-full h-0.5 bg-emerald-400 absolute top-1/2 left-0 animate-ping"></span>
                      <ScanLine className="w-12 h-12 text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-200 mt-2">
                      Align QR Code within the turnstile optical targeting frame
                    </p>
                  </div>
                )}

                <div className="mt-5 space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Scan or type QR token (e.g. REC-PASS-SUBHAM-0891 or REC-2023-CS042)..."
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleExecuteScan()}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-mono font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <QrCode className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    </div>
                    <button
                      onClick={() => handleExecuteScan()}
                      className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify Now</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      ⚡ Quick 1-Tap Scan Simulation Tokens:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setScanInput('REC-PASS-SUBHAM-0891');
                          handleExecuteScan('REC-PASS-SUBHAM-0891');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                      >
                        <span>Subham Pradhan (Approved Outing)</span>
                      </button>
                      <button
                        onClick={() => {
                          setScanInput('REC-PASS-AMAN-4921');
                          handleExecuteScan('REC-PASS-AMAN-4921');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                      >
                        <span>Aman Verma (Currently Outside)</span>
                      </button>
                      <button
                        onClick={() => {
                          setScanInput('REC-PASS-MITHUN-0888');
                          handleExecuteScan('REC-PASS-MITHUN-0888');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                      >
                        <span>Mithun Sahoo (Day Pass)</span>
                      </button>
                      <button
                        onClick={() => {
                          setScanInput('REC-PASS-ROHAN-0885');
                          handleExecuteScan('REC-PASS-ROHAN-0885');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                      >
                        <span>Rohan Jena (Overdue Curfew)</span>
                      </button>
                      <button
                        onClick={() => {
                          setScanInput('REC-PASS-INVALID-9999');
                          handleExecuteScan('REC-PASS-INVALID-9999');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 text-xs font-mono font-bold transition cursor-pointer shadow-xs"
                      >
                        <span>Unrecognized / Revoked Pass</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {activeScanResult && (
                <div
                  className={`rounded-3xl border p-6 space-y-4 shadow-sm bg-white ${
                    activeScanResult.isValid
                      ? activeScanResult.status === 'ALREADY_OUT'
                        ? 'border-blue-300'
                        : 'border-emerald-300'
                      : 'border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {activeScanResult.isValid ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-600" />
                      )}
                      <div>
                        <h4 className="font-black text-base text-slate-900">
                          {activeScanResult.isValid
                            ? activeScanResult.status === 'ALREADY_OUT'
                              ? '✓ RETURNING RESIDENT VERIFICATION'
                              : '✓ VALID GATE PASS'
                            : '✕ INVALID / EXPIRED / REVOKED PASS'}
                        </h4>
                        <p
                          className={`text-xs font-bold ${
                            activeScanResult.isValid ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {activeScanResult.message}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowConfirmModal(true)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer"
                    >
                      Open Full Slip Modal
                    </button>
                  </div>

                  {activeScanResult.isValid && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={activeScanResult.photoUrl}
                          alt={activeScanResult.studentName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-extrabold text-base text-slate-900">{activeScanResult.studentName}</h5>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                              {activeScanResult.studentRoll}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {activeScanResult.hostel} • Room {activeScanResult.roomNumber}
                          </p>
                          <p className="text-xs text-slate-700 font-medium mt-1">
                            Purpose: <span className="text-slate-900 font-bold">{activeScanResult.purpose}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end space-y-1 text-xs">
                        <p className="text-slate-500">
                          Pass Type: <span className="font-bold text-slate-900">{activeScanResult.passType}</span>
                        </p>
                        <p className="text-slate-500">
                          Expected Return:{' '}
                          <span className="font-mono font-bold text-amber-700">
                            {activeScanResult.expectedReturnTime}
                          </span>
                        </p>
                        <div className="pt-2 flex gap-2">
                          {activeScanResult.canConfirmExit && (
                            <button
                              onClick={() => handleConfirmExit(activeScanResult.passId)}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                            >
                              <Check className="w-4 h-4" />
                              <span>[ CONFIRM EXIT ]</span>
                            </button>
                          )}
                          {activeScanResult.canConfirmReturn && (
                            <button
                              onClick={() => handleConfirmReturn(activeScanResult.passId)}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>[ CONFIRM RETURN ]</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: GATE PASSES (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'GATE_PASSES' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {(['ALL', 'APPROVED', 'OUT', 'OVERDUE', 'RETURNED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setPassFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        passFilter === st
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'All Passes' : st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search by student, roll, or pass ID..."
                    value={passSearch}
                    onChange={(e) => setPassSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passes
                  .filter((p) => {
                    if (passFilter !== 'ALL' && p.status !== passFilter) return false;
                    if (
                      passSearch &&
                      !p.studentName.toLowerCase().includes(passSearch.toLowerCase()) &&
                      !p.studentRoll.toLowerCase().includes(passSearch.toLowerCase()) &&
                      !p.passNumber.toLowerCase().includes(passSearch.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((pass) => {
                    const isOverdue = pass.status === 'OVERDUE';
                    const isOut = pass.status === 'OUT';
                    const isApproved = pass.status === 'APPROVED';

                    return (
                      <div
                        key={pass.id}
                        className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-blue-300 shadow-sm transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3.5">
                            <img
                              src={pass.photoUrl}
                              alt={pass.studentName}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-extrabold text-sm text-slate-900">{pass.studentName}</h4>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                                  {pass.studentRoll}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">
                                {pass.hostel} • Room {pass.roomNumber}
                              </p>
                              <span className="text-[11px] text-blue-600 font-bold font-mono">
                                Pass #{pass.passNumber}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isOverdue
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : isOut
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {pass.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Purpose</span>
                            <span className="text-slate-800 font-medium truncate block">{pass.reason}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Destination</span>
                            <span className="text-slate-800 font-medium truncate block">{pass.destination}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Approved Departure</span>
                            <span className="text-slate-800 font-mono font-medium">{pass.expectedExitTime}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Curfew Return</span>
                            <span className={`font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                              {pass.expectedReturnTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Parent Consent: {pass.parentConsent}</span>
                          </div>

                          <button
                            onClick={() => {
                              setScanInput(pass.qrToken);
                              handleExecuteScan(pass.qrToken);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center space-x-1.5"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Scan & Verify</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: STUDENT ENTRY / EXIT (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'ENTRY_EXIT' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  {(['ALL', 'EXIT', 'ENTRY'] as const).map((dir) => (
                    <button
                      key={dir}
                      onClick={() => setMovementFilter(dir)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        movementFilter === dir
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {dir === 'ALL' ? 'All Movements' : dir === 'EXIT' ? 'Exits Only' : 'Entries Only'}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search movement records..."
                    value={movementSearch}
                    onChange={(e) => setMovementSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-4">Hostel / Room</th>
                        <th className="py-3 px-4">Direction</th>
                        <th className="py-3 px-4">Gate</th>
                        <th className="py-3 px-4">Pass ID</th>
                        <th className="py-3 px-4">Security Officer</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {entryExitLogs
                        .filter((log) => {
                          if (movementFilter !== 'ALL' && log.direction !== movementFilter) return false;
                          if (
                            movementSearch &&
                            !log.studentName.toLowerCase().includes(movementSearch.toLowerCase()) &&
                            !log.rollNumber.toLowerCase().includes(movementSearch.toLowerCase())
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((log) => {
                          const isExit = log.direction === 'EXIT';
                          return (
                            <tr key={log.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono text-slate-600">{log.timestamp}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2.5">
                                  <img
                                    src={log.photoUrl}
                                    alt={log.studentName}
                                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                                  />
                                  <div>
                                    <span className="font-extrabold text-slate-900 block">{log.studentName}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{log.rollNumber}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                {log.hostel} • {log.room}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                                    isExit ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {log.direction}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{log.gate}</td>
                              <td className="py-3 px-4 font-mono text-blue-600 font-bold">{log.passId}</td>
                              <td className="py-3 px-4 text-slate-500">{log.securityOfficer}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                  {log.status}
                                </span>
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

          {/* ================================================================= */}
          {/* TAB 5: VISITORS (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'VISITORS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  {(['ALL', 'Checked In', 'Checked Out', 'Expected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setVisitorFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        visitorFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'All Visitors' : st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <input
                      type="text"
                      placeholder="Search visitor or student..."
                      value={visitorSearch}
                      onChange={(e) => setVisitorSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    onClick={() => setShowVisitorModal(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register Visitor</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visitors
                  .filter((v) => {
                    if (visitorFilter !== 'ALL' && v.status !== visitorFilter) return false;
                    if (
                      visitorSearch &&
                      !v.name.toLowerCase().includes(visitorSearch.toLowerCase()) &&
                      !v.studentVisited.toLowerCase().includes(visitorSearch.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((vis) => {
                    const isInside = vis.status === 'Checked In';
                    return (
                      <div
                        key={vis.id}
                        className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 hover:border-blue-300 shadow-sm transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-sm text-slate-900">{vis.name}</h4>
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                                {vis.passNumber || 'VP-TEMP'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {vis.phone} • {vis.idType} ({vis.idNumber})
                            </p>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isInside
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {vis.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                          <p className="text-slate-700">
                            Visiting:{' '}
                            <span className="font-bold text-slate-900">
                              {vis.studentVisited} ({vis.studentRoll})
                            </span>{' '}
                            - {vis.studentRoom}
                          </p>
                          <p className="text-slate-500">
                            Purpose: <span className="text-slate-700 font-medium">{vis.purpose}</span>
                          </p>
                          {vis.vehicleNumber && (
                            <p className="text-slate-500 font-mono text-[11px]">
                              Vehicle: <span className="text-indigo-600 font-bold">{vis.vehicleNumber}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-500 text-[11px]">
                            In: <span className="font-mono text-slate-800 font-bold">{vis.entryTime}</span>
                            {vis.exitTime && (
                              <span>
                                {' '}
                                | Out: <span className="font-mono text-slate-600">{vis.exitTime}</span>
                              </span>
                            )}
                          </span>

                          {isInside && (
                            <button
                              onClick={() => handleCheckOutVisitor(vis.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
                            >
                              Check Out Visitor
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: VEHICLES (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'VEHICLES' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  {(['ALL', 'INSIDE', 'EXITED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setVehicleFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        vehicleFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'All Vehicles' : st === 'INSIDE' ? 'Currently Inside' : 'Exited'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowVehicleModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Vehicle Entry</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles
                  .filter((v) => (vehicleFilter === 'ALL' ? true : v.status === vehicleFilter))
                  .map((veh) => {
                    const isInside = veh.status === 'INSIDE';
                    return (
                      <div
                        key={veh.id}
                        className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-blue-300 shadow-sm transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-black text-base text-slate-900 tracking-wider">
                              {veh.plateNumber}
                            </span>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {veh.vehicleType} • {veh.ownerType}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isInside ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {veh.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                          <p className="text-slate-700 font-medium">
                            Driver: <span className="text-slate-900 font-bold">{veh.driverName}</span> ({veh.driverPhone})
                          </p>
                          <p className="text-slate-500">
                            Purpose: <span className="text-slate-700">{veh.purpose}</span>
                          </p>
                          <p className="text-slate-500 text-[11px] font-mono">
                            In: {veh.entryTime} {veh.exitTime ? `| Out: ${veh.exitTime}` : ''}
                          </p>
                        </div>

                        {isInside && (
                          <button
                            onClick={() => handleMarkVehicleExit(veh.id)}
                            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                          >
                            Clear Vehicle for Exit
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: PARCELS & DELIVERIES (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'PARCELS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  {(['ALL', 'Waiting', 'Collected', 'Returned'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setParcelFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        parcelFilter === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'ALL' ? 'All Deliveries' : st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowParcelModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Parcel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parcels
                  .filter((p) => (parcelFilter === 'ALL' ? true : p.status === parcelFilter))
                  .map((parcel) => {
                    const isWaiting = parcel.status === 'Waiting';
                    return (
                      <div
                        key={parcel.id}
                        className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-amber-300 shadow-sm transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-extrabold text-sm text-slate-900 block">{parcel.company}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{parcel.parcelNumber}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isWaiting ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {parcel.status}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                          <p className="text-slate-900 font-bold">{parcel.recipientName}</p>
                          <p className="text-slate-600">
                            {parcel.roomOrDept} {parcel.hostelName ? `• ${parcel.hostelName}` : ''}
                          </p>
                          <p className="text-slate-500 font-mono text-[11px]">
                            Contact: {parcel.recipientPhone}
                          </p>
                          <p className="text-slate-400 text-[10px] pt-1">Logged at: {parcel.entryTime}</p>
                        </div>

                        {isWaiting && (
                          <button
                            onClick={() => handleMarkParcelCollected(parcel.id)}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            Mark Collected by Recipient
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: SECURITY INCIDENTS (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'INCIDENTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Security Breaches & Gate Incidents</h3>
                  <p className="text-xs text-slate-500">
                    Logged unauthorized entries, invalid pass attempts, and turnstile alerts.
                  </p>
                </div>
                <button
                  onClick={() => setShowIncidentModal(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report Incident</span>
                </button>
              </div>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-rose-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-xs text-blue-600">{inc.incidentNumber}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-xs text-slate-900">{inc.category.replace('_', ' ')}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {inc.date} at {inc.time} • Location: <span className="text-slate-800 font-bold">{inc.location}</span>
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase">
                        {inc.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-2">
                      <p className="text-slate-700">{inc.description}</p>
                      <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800">Action Taken: </span>
                        {inc.actionTaken}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Reported by: {inc.reportedBy}</span>
                      {inc.status === 'Open' && (
                        <button
                          onClick={() => {
                            setIncidents((prev) =>
                              prev.map((i) => (i.id === inc.id ? { ...i, status: 'Resolved' } : i))
                            );
                            triggerToast('Incident resolved.');
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: EMERGENCY / SOS (LIGHT THEME) */}
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
                      Campus Gate Emergency SOS Relay
                    </span>
                    <h3 className="text-xl font-extrabold text-white">Emergency Coordination & Quick Dispatch</h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      Direct integration with Student Platform SOS triggers and Warden Emergency response network.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:+919437000108"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-rose-700 font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span>Ambulance (+91 94370 00108)</span>
                  </a>
                  <a
                    href="tel:+919437088210"
                    className="px-4 py-2.5 rounded-xl bg-rose-700/60 hover:bg-rose-700 text-white font-bold text-xs border border-white/20 transition cursor-pointer flex items-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Chief Warden</span>
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                {emergencies.map((em) => {
                  const isActive = em.status === 'ACTIVE' || em.status === 'INVESTIGATING';
                  return (
                    <div
                      key={em.id}
                      className={`rounded-3xl border p-5 space-y-4 transition bg-white shadow-sm ${
                        isActive ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                              isActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-extrabold text-base text-slate-900">{em.studentName}</h4>
                              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono text-[10px] font-bold">
                                {em.studentRoll}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {em.hostel} • Room {em.room} • {em.locationDetails}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {em.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>Emergency Type: <strong className="text-rose-700">{em.emergencyType}</strong></span>
                          <span className="font-mono">{em.timestamp}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{em.notes}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <a
                            href={`tel:${em.phone}`}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 font-bold transition flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call Student ({em.phone})</span>
                          </a>
                          <a
                            href={`tel:${em.parentPhone}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Parent Contact</span>
                          </a>
                        </div>

                        {isActive && (
                          <button
                            onClick={() => handleResolveEmergency(em.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer"
                          >
                            Resolve Alert & Close Beacon
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 10: LOST & FOUND (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'LOST_FOUND' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Gate Custody Lost & Found Registry</h3>
                  <p className="text-xs text-slate-500">
                    Articles retained at security desk or reported lost near campus perimeter.
                  </p>
                </div>
                <button
                  onClick={() => setShowLostFoundModal(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lostFound.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 hover:border-teal-300 shadow-sm transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            item.itemType === 'FOUND'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block">{item.itemName}</span>
                          <span className="text-[10px] text-slate-500">{item.location}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.status === 'Found'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Reported by: {item.reportedBy}</span>
                      <span className="font-mono">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 11: GATE LOGS (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'GATE_LOGS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Consolidated Gate Audit Log</h3>
                  <p className="text-xs text-slate-500">
                    Non-deletable immutable ledger of all campus perimeter transactions.
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search gate logs..."
                    value={gateLogSearch}
                    onChange={(e) => setGateLogSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Entity / Person</th>
                        <th className="py-3 px-4">Direction</th>
                        <th className="py-3 px-4">Gate</th>
                        <th className="py-3 px-4">Ref / Pass</th>
                        <th className="py-3 px-4">Security Officer</th>
                        <th className="py-3 px-4">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {gateLogs
                        .filter((l) => {
                          if (
                            gateLogSearch &&
                            !l.personName.toLowerCase().includes(gateLogSearch.toLowerCase()) &&
                            !l.passOrVisitorId.toLowerCase().includes(gateLogSearch.toLowerCase())
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((l) => {
                          const isExit = l.direction === 'EXIT';
                          return (
                            <tr key={l.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4 font-mono text-slate-600">{l.timestamp}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                                  {l.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-extrabold text-slate-900">{l.personName}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                                    isExit ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {l.direction}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{l.gate}</td>
                              <td className="py-3 px-4 font-mono text-blue-600 font-bold">{l.passOrVisitorId}</td>
                              <td className="py-3 px-4 text-slate-500">{l.securityOfficer}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                  {l.status}
                                </span>
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

          {/* ================================================================= */}
          {/* TAB 12: REPORTS (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'REPORTS' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Security & Gate Registers</h3>
                  <p className="text-xs text-slate-500">
                    Official CSV downloads and printable registers for campus security audits.
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
          {/* TAB 13: PROFILE & SETTINGS (LIGHT THEME) */}
          {/* ================================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-center space-x-4">
                    <img
                      src={officer.avatarUrl}
                      alt={officer.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-black text-lg text-slate-900">{officer.name}</h3>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                          {officer.badgeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{officer.designation}</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{officer.gatePost}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs uppercase tracking-wider">
                    On Duty Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Contact Phone</span>
                    <span className="font-mono text-slate-900 font-bold">{officer.phone}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Assigned Shift</span>
                    <span className="text-slate-900 font-bold">{officer.shift}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Chief Security Officer</span>
                    <span className="text-slate-900 font-bold">{officer.supervisorName}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Control Room Helpline</span>
                    <span className="font-mono text-rose-600 font-bold">{officer.emergencyContact}</span>
                  </div>
                </div>
              </div>

              {/* Gate Security Mode Configuration */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Gate Security Posture & Operation Mode</h4>
                    <p className="text-xs text-slate-500">
                      Configure gate barriers and turnstile scanning protocols according to campus directives.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    {
                      id: 'NORMAL',
                      label: 'Normal Gate Operations',
                      desc: 'Standard QR pass scanning for student outings and visitor slips.',
                    },
                    {
                      id: 'STRICT',
                      label: 'Strict Inspection Mode',
                      desc: 'All bags, delivery vehicles, and trunks subject to mandatory search.',
                    },
                    {
                      id: 'CURFEW',
                      label: 'Night Curfew Mode (09:30 PM)',
                      desc: 'Turnstile exits locked. Night passes require Warden authorization.',
                    },
                    {
                      id: 'LOCKDOWN',
                      label: 'Campus High Alert / Lockdown',
                      desc: 'Emergency security lockdown. Turnstiles and barriers sealed.',
                    },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() => {
                        setGateSecurityMode(mode.id as any);
                        triggerToast(`Gate operation mode updated to: ${mode.label}`);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        gateSecurityMode === mode.id
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-900">{mode.label}</span>
                        {gateSecurityMode === mode.id && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500">{mode.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Permissions Boundary */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2.5">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Security Role Permission Boundary</h4>
                    <p className="text-xs text-slate-500">
                      Standard operational matrix for Gate Security Staff in CampusHelper.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Scan & verify approved student gate passes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Record student departures (EXIT) & arrivals (RETURN)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Register campus visitors & issue physical gate passes</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Log vehicle movements & courier delivery parcels</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot approve gate passes or leave (Warden only)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot reallocate hostel rooms or beds (Warden only)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot modify student academic or personal records</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center space-x-2.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Cannot issue disciplinary fines or punishments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* 3. MODALS SUITE */}
      {/* =================================================================== */}
      <ConfirmScanModal
        scanResult={activeScanResult}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirmExit={handleConfirmExit}
        onConfirmReturn={handleConfirmReturn}
      />

      <RegisterVisitorModal
        isOpen={showVisitorModal}
        onClose={() => setShowVisitorModal(false)}
        onRegister={(newVis) => {
          const visObj: SecurityVisitor = {
            id: `vis-${Date.now()}`,
            name: newVis.name || 'Visitor',
            phone: newVis.phone || '',
            idType: (newVis.idType || 'Aadhaar') as any,
            idNumber: newVis.idNumber || 'VERIFIED',
            studentVisited: newVis.studentVisited || '',
            studentRoll: newVis.studentRoll || '',
            studentRoom: newVis.studentRoom || '',
            purpose: newVis.purpose || 'Visit',
            entryTime: newVis.entryTime || currentTime || 'Now',
            securityOfficer: officer.name,
            vehicleNumber: newVis.vehicleNumber,
            status: 'Checked In',
            passNumber: newVis.passNumber || `VP-2026-${Math.floor(100 + Math.random() * 900)}`,
          };
          setVisitors((prev) => [visObj, ...prev]);

          setGateLogs((prev) => [
            {
              id: `gl-${Date.now()}`,
              timestamp: visObj.entryTime,
              personName: `${visObj.name} (Visitor)`,
              category: 'VISITOR',
              direction: 'ENTRY',
              gate: officer.gatePost.split('(')[0].trim(),
              passOrVisitorId: visObj.passNumber || 'VP-TEMP',
              securityOfficer: officer.name,
              status: 'GRANTED',
            },
            ...prev,
          ]);

          triggerToast(`Visitor Pass ${visObj.passNumber} issued. Entry logged.`);
        }}
      />

      <LogVehicleModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onLogVehicle={(newVeh) => {
          const vehObj: SecurityVehicle = {
            id: `veh-${Date.now()}`,
            plateNumber: newVeh.plateNumber || 'OD-00-XX-0000',
            vehicleType: (newVeh.vehicleType || 'Two-Wheeler') as any,
            driverName: newVeh.driverName || 'Driver',
            driverPhone: newVeh.driverPhone || '',
            ownerType: (newVeh.ownerType || 'VISITOR') as any,
            purpose: newVeh.purpose || 'Campus Entry',
            entryTime: newVeh.entryTime || currentTime || 'Now',
            gate: 'Main Vehicle Barrier',
            securityOfficer: officer.name,
            status: 'INSIDE',
          };
          setVehicles((prev) => [vehObj, ...prev]);

          setGateLogs((prev) => [
            {
              id: `gl-${Date.now()}`,
              timestamp: vehObj.entryTime,
              personName: `${vehObj.plateNumber} (${vehObj.driverName})`,
              category: 'VEHICLE',
              direction: 'ENTRY',
              gate: 'Main Vehicle Barrier',
              passOrVisitorId: vehObj.plateNumber,
              securityOfficer: officer.name,
              status: 'GRANTED',
            },
            ...prev,
          ]);

          triggerToast(`Vehicle ${vehObj.plateNumber} logged into campus.`);
        }}
      />

      <RegisterParcelModal
        isOpen={showParcelModal}
        onClose={() => setShowParcelModal(false)}
        onRegisterParcel={(newP) => {
          const parcelObj: SecurityParcel = {
            id: `pkg-${Date.now()}`,
            company: (newP.company || 'Amazon') as any,
            parcelNumber: newP.parcelNumber || `AMZ-${Date.now().toString().slice(-6)}`,
            recipientName: newP.recipientName || 'Student',
            recipientType: 'STUDENT',
            recipientPhone: newP.recipientPhone || '',
            roomOrDept: newP.roomOrDept || 'Hostel Desk',
            hostelName: newP.hostelName || 'Nilgiri Block A',
            entryTime: newP.entryTime || currentTime || 'Now',
            status: 'Waiting',
            securityOfficer: officer.name,
          };
          setParcels((prev) => [parcelObj, ...prev]);
          triggerToast(`Parcel ${parcelObj.parcelNumber} received from ${parcelObj.company}.`);
        }}
      />

      <ReportIncidentModal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        onReportIncident={(newInc) => {
          const incObj: SecurityIncident = {
            id: `inc-${Date.now()}`,
            incidentNumber: newInc.incidentNumber || `SEC-INC-2026-${Math.floor(100 + Math.random() * 900)}`,
            date: 'Today',
            time: newInc.time || currentTime || 'Now',
            location: newInc.location || officer.gatePost,
            category: (newInc.category || 'OTHER') as any,
            description: newInc.description || '',
            reportedBy: officer.name,
            status: 'Open',
            actionTaken: newInc.actionTaken || 'Logged at gate desk, warden notified.',
          };
          setIncidents((prev) => [incObj, ...prev]);
          triggerToast(`Security incident ${incObj.incidentNumber} filed.`);
        }}
      />

      <LostFoundModal
        isOpen={showLostFoundModal}
        onClose={() => setShowLostFoundModal(false)}
        onSaveItem={(newItem) => {
          const lfObj: SecurityLostFound = {
            id: `lf-${Date.now()}`,
            itemType: (newItem.itemType || 'FOUND') as any,
            itemName: newItem.itemName || 'Item',
            description: newItem.description || '',
            location: newItem.location || 'Main Gate Turnstile',
            date: 'Today',
            time: newItem.time || currentTime || 'Now',
            reportedBy: newItem.reportedBy || officer.name,
            reportedByPhone: newItem.reportedByPhone || officer.phone,
            status: newItem.itemType === 'FOUND' ? 'Found' : 'Reported',
          };
          setLostFound((prev) => [lfObj, ...prev]);
          triggerToast(`Item "${lfObj.itemName}" recorded in Gate Custody.`);
        }}
      />

      <SecurityHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
