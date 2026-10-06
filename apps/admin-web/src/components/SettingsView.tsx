'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Bell,
  Lock,
  Globe,
  Database,
  Save,
  CheckCircle2,
  Building,
  GraduationCap,
  PhoneCall,
  Mail,
  MapPin,
  Utensils,
  DoorOpen,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState<
    'COLLEGE_INFO' | 'ACADEMIC' | 'INFRASTRUCTURE' | 'CURFEW_RULES' | 'EMERGENCY_CONTACTS' | 'BACKUP_SYSTEM'
  >('COLLEGE_INFO');

  // 1. College Information State
  const [collegeInfo, setCollegeInfo] = useState({
    name: 'Raajdhani Engineering College (Autonomous)',
    code: 'REC-BPUT-048',
    affiliation: 'Biju Patnaik University of Technology (BPUT)',
    aicteApproval: 'F.No. Eastern/1-35118921/2025',
    naacGrade: 'A+ (Score 3.42)',
    address: 'Near Mancheswar Railway Station, Sector A, Zone B, Bhubaneswar, Odisha 751017',
    phone: '+91 674 2751 017',
    email: 'info@rec.ac.in',
    website: 'https://www.rec.ac.in',
  });

  // 2. Academic Settings State
  const [academicTerm, setAcademicTerm] = useState('Autumn Semester 2025-2026');
  const [departments, setDepartments] = useState([
    { name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. S. Mohanty' },
    { name: 'Electronics & Communication', code: 'ECE', hod: 'Dr. R. K. Patra' },
    { name: 'Mechanical Engineering', code: 'ME', hod: 'Dr. B. N. Sahoo' },
    { name: 'Civil Engineering', code: 'CE', hod: 'Dr. P. C. Nayak' },
    { name: 'Electrical & Electronics', code: 'EEE', hod: 'Dr. K. C. Ray' },
  ]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  // 3. Infrastructure State
  const [hostelBlocks, setHostelBlocks] = useState([
    { name: 'Nilgiri Block A (Boys)', capacity: 800, rooms: 200, warden: 'Dr. K. N. Mohapatra' },
    { name: 'Shivalik Block B (Girls)', capacity: 650, rooms: 160, warden: 'Prof. S. Tripathy' },
    { name: 'Aravali Residence (Senior / Faculty)', capacity: 130, rooms: 40, warden: 'Manoj Jena' },
  ]);
  const [campusGates, setCampusGates] = useState([
    { name: 'Main Turnstile Gate 1', type: 'Vehicular & Pedestrian', activeHours: '24x7 Security' },
    { name: 'Gate 2 (Library North)', type: 'Pedestrian Turnstile', activeHours: '06:00 AM - 10:00 PM' },
    { name: 'Service & Logistics Gate 3', type: 'Goods & Deliveries', activeHours: '08:00 AM - 08:00 PM' },
  ]);

  // 4. Curfew & Gate Pass Policy State
  const [curfewTime, setCurfewTime] = useState('21:30');
  const [enableParentOtp, setEnableParentOtp] = useState(true);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState('15');
  const [maxWeeklyDayPasses, setMaxWeeklyDayPasses] = useState('3');
  const [smsParentAlertOnExit, setSmsParentAlertOnExit] = useState(true);

  // 5. Emergency Contacts State
  const [emergencyHotlines, setEmergencyHotlines] = useState([
    { label: 'Campus Ambulance & Health Desk', number: '+91 98610 22334', officer: 'Dr. S. K. Mahapatra' },
    { label: 'Main Security Gate Control Desk', number: '+91 98112 00011', officer: 'Vikram Singh (Chief Security)' },
    { label: 'Chief Hostel Warden Helpline', number: '+91 94371 88921', officer: 'Dr. K. N. Mohapatra' },
    { label: 'Mancheswar Police Station Hotline', number: '112 / +91 674 2580 100', officer: 'Inspector In-Charge' },
    { label: 'Campus Fire & Safety Dispatch', number: '101 / +91 674 2561 101', officer: 'Safety Marshal' },
  ]);

  // 6. Backup & System State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [biometricInterval, setBiometricInterval] = useState('5');
  const [saveToast, setSaveToast] = useState('');

  const handleSave = () => {
    setSaveToast('✓ Settings and campus policies updated successfully!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    setDepartments([...departments, { name: newDeptName, code: newDeptCode.toUpperCase(), hod: 'To be assigned' }]);
    setNewDeptName('');
    setNewDeptCode('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              College Operations & System Configuration
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master settings for institutional identity, academic curriculum, curfew rules, gates, and emergency hotlines.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-500/25 transition cursor-pointer self-start md:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Configuration</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 2. Section Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center space-x-1 overflow-x-auto scrollbar-thin">
        {[
          { id: 'COLLEGE_INFO', label: 'College Identity & Info', icon: Building },
          { id: 'ACADEMIC', label: 'Departments & Semesters', icon: GraduationCap },
          { id: 'INFRASTRUCTURE', label: 'Hostels, Rooms & Gates', icon: DoorOpen },
          { id: 'CURFEW_RULES', label: 'Curfew & Gate Policies', icon: Clock },
          { id: 'EMERGENCY_CONTACTS', label: 'Emergency Hotlines', icon: PhoneCall },
          { id: 'BACKUP_SYSTEM', label: 'System & Backups', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Section Content Panels */}

      {/* SECTION 1: COLLEGE IDENTITY & INFO */}
      {activeSection === 'COLLEGE_INFO' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Institutional Profile & Accreditation
            </h4>
            <p className="text-xs text-slate-500">Official college details shown on student portal, gate passes, and reports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">College / Institution Name</label>
              <input
                type="text"
                value={collegeInfo.name}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Autonomous Registration Code</label>
              <input
                type="text"
                value={collegeInfo.code}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, code: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Affiliated University</label>
              <input
                type="text"
                value={collegeInfo.affiliation}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, affiliation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">AICTE Approval Number</label>
              <input
                type="text"
                value={collegeInfo.aicteApproval}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, aicteApproval: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Website URL</label>
              <input
                type="text"
                value={collegeInfo.website}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, website: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Campus Email</label>
              <input
                type="text"
                value={collegeInfo.email}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">Campus Physical Address</label>
              <input
                type="text"
                value={collegeInfo.address}
                onChange={(e) => setCollegeInfo({ ...collegeInfo, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACADEMIC & DEPARTMENTS */}
      {activeSection === 'ACADEMIC' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Academic Curriculum & Department Setup
              </h4>
              <p className="text-xs text-slate-500">Configure degree programs, active semester cycle, and department heads.</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-600 mr-2">Active Semester Term:</span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                {academicTerm}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-800">Registered Academic Departments</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {departments.map((dept, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-700 font-mono">{dept.code}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Active</span>
                  </div>
                  <h6 className="font-bold text-xs text-slate-900">{dept.name}</h6>
                  <p className="text-[11px] text-slate-500">HOD: <strong className="text-slate-700">{dept.hod}</strong></p>
                </div>
              ))}
            </div>

            {/* Add Dept Form */}
            <form onSubmit={handleAddDept} className="pt-3 flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Department Name (e.g. Chemical Engg)"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs flex-1 min-w-[200px]"
              />
              <input
                type="text"
                placeholder="Code (e.g. CHE)"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-28 uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                + Add Dept
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 3: INFRASTRUCTURE & GATES */}
      {activeSection === 'INFRASTRUCTURE' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Hostel Blocks & Capacity Management
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hostelBlocks.map((b, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900">{b.name}</h5>
                  <div className="text-xs space-y-1 text-slate-600">
                    <p>Total Bed Capacity: <strong className="text-slate-800">{b.capacity} beds</strong></p>
                    <p>Allocated Rooms: <strong className="text-slate-800">{b.rooms} rooms</strong></p>
                    <p>Chief Warden: <strong className="text-slate-800">{b.warden}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Security Gates & Access Points
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campusGates.map((g, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h5 className="font-bold text-xs text-slate-900">{g.name}</h5>
                  <p className="text-xs text-slate-600">Type: <strong>{g.type}</strong></p>
                  <p className="text-[11px] text-emerald-600 font-bold">{g.activeHours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CURFEW & GATE POLICIES */}
      {activeSection === 'CURFEW_RULES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Campus Curfew, Leave & Security Verification Rules
            </h4>
            <p className="text-xs text-slate-500">Automated gate pass cut-off times and parental SMS verification rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Night Gate Curfew Time</label>
              <input
                type="time"
                value={curfewTime}
                onChange={(e) => setCurfewTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm"
              />
              <p className="text-[10px] text-slate-400">Students entering after this time will be logged as OVERDUE and parents notified.</p>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Late Return Grace Period (Minutes)</label>
              <input
                type="number"
                value={gracePeriodMinutes}
                onChange={(e) => setGracePeriodMinutes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
              <p className="text-[10px] text-slate-400">Minutes buffer allowed before auto-escalation to Chief Warden.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Mandatory Parent OTP for Outings</strong>
                <p className="text-[10px] text-slate-400">Requires OTP confirmation sent to parent's registered mobile number.</p>
              </div>
              <input
                type="checkbox"
                checked={enableParentOtp}
                onChange={(e) => setEnableParentOtp(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">SMS Alert to Parents on Gate Exit</strong>
                <p className="text-[10px] text-slate-400">Instant SMS broadcast to guardian upon security turnstile scan.</p>
              </div>
              <input
                type="checkbox"
                checked={smsParentAlertOnExit}
                onChange={(e) => setSmsParentAlertOnExit(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: EMERGENCY HOTLINES */}
      {activeSection === 'EMERGENCY_CONTACTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Emergency Hotlines & Incident Response Desk
            </h4>
            <p className="text-xs text-slate-500">Numbers published to Student Platform and Security Platform for rapid SOS response.</p>
          </div>

          <div className="space-y-2.5">
            {emergencyHotlines.map((c, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <h5 className="font-bold text-slate-900">{c.label}</h5>
                  <p className="text-[10px] text-slate-400">Designated In-Charge: {c.officer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                    {c.number}
                  </span>
                  <a
                    href={`tel:${c.number.replace(/[^0-9+]/g, '')}`}
                    className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: SYSTEM & BACKUPS */}
      {activeSection === 'BACKUP_SYSTEM' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Database Persistence & Campus Synchronization
            </h4>
            <p className="text-xs text-slate-500">Control system state, data sync intervals, and disaster recovery snapshots.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Automated Daily Database Snapshot</strong>
                <p className="text-[10px] text-slate-400">Nightly SQLite database snapshot stored at 02:00 AM.</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Active (Healthy)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Hardware Biometric Polling Rate</strong>
                <p className="text-[10px] text-slate-400">Turnstile synchronization latency with backend.</p>
              </div>
              <select
                value={biometricInterval}
                onChange={(e) => setBiometricInterval(e.target.value)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold"
              >
                <option value="5">Every 5 Seconds (Realtime)</option>
                <option value="15">Every 15 Seconds</option>
                <option value="30">Every 30 Seconds</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Maintenance Lockout Mode</strong>
                <p className="text-[10px] text-slate-400">Temporarily restrict student portal logins during term upgrades.</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
