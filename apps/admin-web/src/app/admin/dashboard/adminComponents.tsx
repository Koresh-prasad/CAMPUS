'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Users,
  UserCheck,
  Shield,
  ShieldAlert,
  Heart,
  Wrench,
  Utensils,
  Calendar,
  PhoneCall,
  User,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Car,
  Package,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Building,
  Save,
  Download,
  Eye,
  Lock,
  Sparkles,
  RefreshCw,
  LogOut,
  Key,
  Flame,
  Check,
  X,
  Radio,
  FileText,
  Bed,
  BookOpen,
  Activity,
  Camera,
  Star,
  Bell,
  ArrowRight,
} from 'lucide-react';
import {
  INITIAL_SECURITY_GATE_PASSES,
  INITIAL_ENTRY_EXIT_LOGS,
  INITIAL_SECURITY_VISITORS,
  INITIAL_SECURITY_VEHICLES,
  INITIAL_SECURITY_PARCELS,
  INITIAL_SECURITY_INCIDENTS,
} from '../../staff/security/dashboard/mockData';
import {
  INITIAL_SERVICE_REQUESTS,
  INITIAL_MAINTENANCE_SCHEDULE,
  INITIAL_SERVICE_INVENTORY,
  INITIAL_STUDENT_NOTIFICATIONS,
} from '../../staff/services/dashboard/mockData';
import {
  ServiceRequest,
  ServiceCategory,
  ServiceStatus,
  StudentNotification,
} from '../../staff/services/dashboard/types';
import {
  CreateServiceTicketModal,
  TrackStatusModal,
} from '../../staff/services/dashboard/modals';
import {
  INITIAL_MEDICAL_REQUESTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_LEAVES,
  INITIAL_MEDICINE_INVENTORY,
  INITIAL_AMBULANCE_REFERRALS,
} from '../../staff/medical/dashboard/mockData';

// =========================================================================
// 1. STAFF & ROLE MANAGEMENT VIEW
// =========================================================================
interface AdminStaffRolesProps {
  staffRoster: any[];
  pendingStaff: any[];
  pendingStudents: any[];
  activeSubTab?: string;
  onApproveStaff: (id: string, name: string) => void;
  onRejectStaff: (id: string, name: string) => void;
  onApproveStudent: (id: string, name: string) => void;
  onRejectStudent: (id: string, name: string) => void;
}

export function AdminStaffRolesView({
  staffRoster: initialRoster,
  pendingStaff,
  pendingStudents,
  activeSubTab,
  onApproveStaff,
  onRejectStaff,
  onApproveStudent,
  onRejectStudent,
}: AdminStaffRolesProps) {
  const [subTab, setSubTab] = useState<'ROSTER' | 'APPROVALS' | 'RBAC'>(
    activeSubTab === 'APPROVALS' ? 'APPROVALS' : 'ROSTER'
  );

  React.useEffect(() => {
    if (activeSubTab === 'APPROVALS') setSubTab('APPROVALS');
  }, [activeSubTab]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [roster, setRoster] = useState<any[]>(initialRoster);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'WARDEN',
    dept: 'Hostel Administration',
    hostel: 'Nilgiri Block A',
    email: '',
    phone: '',
  });

  const filteredRoster = roster.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.dept.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || s.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;
    const item = {
      ...newStaff,
      status: 'ACTIVE',
    };
    setRoster([item, ...roster]);
    setShowAddStaffModal(false);
    setNewStaff({
      name: '',
      role: 'WARDEN',
      dept: 'Hostel Administration',
      hostel: 'Nilgiri Block A',
      email: '',
      phone: '',
    });
  };

  const toggleStaffStatus = (idx: number) => {
    setRoster((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, status: s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* 0. STAFF PLATFORMS COMMAND CENTERS */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-wider border border-blue-400/30">
                Centralized Staff Role Control
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>All 5 Platforms Connected</span>
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-1 tracking-tight">
              Staff Platforms & Operational Command Centers
            </h2>
            <p className="text-xs text-slate-300">
              Admin Manager master access to all campus staff platforms. Switch or open any specialized portal in 1 click.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5 pt-1">
          {/* 1. Warden */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Bed className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  Hostels
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                Warden Platform
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Hostel superintendents, floor care, room allocations, leave & gate pass approvals.
              </p>
            </div>
            <a
              href="/staff/warden/dashboard"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 2. Security */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-400/20">
                  Turnstiles
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                Security Platform
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                QR gate scanner, student check-in/out turnstiles, visitor & vehicle entry logs.
              </p>
            </div>
            <a
              href="/staff/security/dashboard"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3. Services */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
                  Maintenance
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                Service Platform
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Electrical, plumbing, Wi-Fi repairs, housekeeping work orders & staff dispatcher.
              </p>
            </div>
            <a
              href="/staff/services/dashboard"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 4. Medical */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-400/20">
                  Health Care
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                Medical Platform
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Health center dispensary, OPD doctor queue, medical leave approvals & 24x7 ambulance.
              </p>
            </div>
            <a
              href="/staff/medical/dashboard"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 5. Faculty */}
          <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition flex flex-col justify-between space-y-3 group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/20">
                  Academics
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-blue-300 transition">
                Faculty Platform
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">
                Departmental courses, academic mentoring, student consultations & classroom coordination.
              </p>
            </div>
            <a
              href="/staff/faculty/dashboard"
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Subtab Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('ROSTER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              subTab === 'ROSTER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Staff Directory ({roster.length})
          </button>
          <button
            onClick={() => setSubTab('APPROVALS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'APPROVALS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Account Approvals Queue</span>
            {(pendingStaff.length > 0 || pendingStudents.length > 0) && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {pendingStaff.length + pendingStudents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSubTab('RBAC')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              subTab === 'RBAC'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Roles & RBAC Permissions
          </button>
        </div>

        {subTab === 'ROSTER' && (
          <button
            onClick={() => setShowAddStaffModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        )}
      </div>

      {/* 1. ROSTER TAB */}
      {subTab === 'ROSTER' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Campus Staff & Officers Roster</h3>
              <p className="text-xs text-slate-500">
                Manage roles, hostel block assignments, and operational permissions.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="WARDEN">Warden</option>
                <option value="SECURITY">Security</option>
                <option value="SERVICES">Services</option>
                <option value="DOCTOR">Medical / Doctor</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Role Key</th>
                  <th className="py-3 px-4">Department / Assignment</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">Active Staff ID</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[11px]">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <p className="font-semibold">{s.dept}</p>
                      {s.hostel && <p className="text-[10px] text-slate-400">Assigned: {s.hostel}</p>}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <p className="text-slate-700 font-mono text-[11px]">{s.phone}</p>
                      <p className="text-slate-400 text-[10px]">{s.email}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleStaffStatus(i)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          s.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. APPROVALS TAB */}
      {subTab === 'APPROVALS' && (
        <div className="space-y-6">
          {/* Staff Registrations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Staff Account Approval Queue</h3>
                <p className="text-xs text-slate-500">Verify newly registered faculty, wardens, and campus staff.</p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {pendingStaff.length} Awaiting Verification
              </span>
            </div>

            {pendingStaff.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">All staff registrations processed!</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingStaff.map((stf) => (
                  <div key={stf.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{stf.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {stf.category}
                        </span>
                        <span className="text-xs text-slate-400">• {stf.designation}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Email: {stf.email} • Dept: {stf.department} • Applied: {stf.date}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onApproveStaff(stf.id, stf.name)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Approve Account
                      </button>
                      <button
                        onClick={() => onRejectStaff(stf.id, stf.name)}
                        className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student Registrations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Admission Approval Queue</h3>
                <p className="text-xs text-slate-500">Verify student roll numbers and assign hostel rooms.</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {pendingStudents.length} Pending Students
              </span>
            </div>

            {pendingStudents.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No pending student admission requests.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingStudents.map((st) => (
                  <div key={st.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{st.name}</span>
                      <p className="text-xs text-slate-500">
                        Email: {st.email} • ID: {st.residentProfile?.studentId || 'Pending'} • Year: {st.residentProfile?.year || '1st Year'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onApproveStudent(st.id || st.userId, st.name)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Approve Admission
                      </button>
                      <button
                        onClick={() => onRejectStudent(st.id || st.userId, st.name)}
                        className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition cursor-pointer"
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
      )}

      {/* 3. RBAC PERMISSIONS MATRIX */}
      {subTab === 'RBAC' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900">Campus Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-500">Defined permissions and accessible portal interfaces per role.</p>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Role Key</th>
                <th className="py-3 px-4">Role Name</th>
                <th className="py-3 px-4">Authorized Dashboard Route</th>
                <th className="py-3 px-4">Permissions Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { key: 'STUDENT', name: 'Student Resident', route: '/student/dashboard', scope: 'View timetable, attendance, results, apply passes, raise grievances' },
                { key: 'FACULTY', name: 'Faculty Member', route: '/staff/faculty/dashboard', scope: 'Mark attendance, post assignments, review coursework, enter grades' },
                { key: 'WARDEN', name: 'Hostel Warden', route: '/staff/warden/dashboard', scope: 'Hostel occupancy, gate pass approvals, room allocations, curfew roster' },
                { key: 'SERVICES', name: 'Services & Operations', route: '/staff/services/dashboard', scope: 'Maintenance work orders, dining hall menu, hardware inventory' },
                { key: 'SECURITY', name: 'Campus Security', route: '/staff/security/dashboard', scope: 'Turnstile gate scan, visitor passes, vehicle logs, panic SOS alerts' },
                { key: 'DOCTOR', name: 'Medical Staff / Nurse', route: '/staff/medical/dashboard', scope: 'Health center triage, emergency dispatch, dispensary inventory' },
                { key: 'ADMIN_MANAGER', name: 'Admin Manager / Director', route: '/admin/dashboard', scope: 'Full executive control, account approvals, audit logs, campus settings' },
              ].map((r) => (
                <tr key={r.key} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{r.key}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">{r.route}</td>
                  <td className="py-3 px-4 text-slate-600">{r.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Add Staff Member */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Add Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. N. Mohapatra"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="WARDEN">Warden</option>
                    <option value="SECURITY">Security Guard</option>
                    <option value="SERVICES">Services / Maintenance</option>
                    <option value="DOCTOR">Medical / Nurse</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Admin Operator</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Hostel / Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Nilgiri Block A"
                    value={newStaff.hostel}
                    onChange={(e) => setNewStaff({ ...newStaff, hostel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Hostel Administration / Estate"
                  value={newStaff.dept}
                  onChange={(e) => setNewStaff({ ...newStaff, dept: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@rec.edu"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 94370 00000"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. SECURITY MANAGEMENT MONITORING VIEW
// =========================================================================
export function AdminSecurityManagementView() {
  const [secSubTab, setSecSubTab] = useState<'MOVEMENTS' | 'PASSES' | 'VEHICLES' | 'PARCELS' | 'INCIDENTS'>('MOVEMENTS');

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Jump to Security Hub */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">Campus Security Command & Gate Monitoring</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed from Main Gate turnstiles, barrier logs, visitors, and security patrols.
          </p>
        </div>
        <a
          href="/staff/security/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>Launch Security Hub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4 Security Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Students Inside</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">2,342</h4>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">96% of residents on campus</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Students Outside</p>
          <h4 className="text-2xl font-black text-blue-600 mt-1">98</h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Valid QR pass exits</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Overdue Returns</p>
          <h4 className="text-2xl font-black text-rose-600 mt-1">1</h4>
          <p className="text-[10px] text-rose-500 font-semibold mt-0.5">Rohan Jena (Nilgiri A-301)</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Vehicles On Campus</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">42</h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Registered RFID / visitor cars</p>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 shadow-2xs">
        {[
          { id: 'MOVEMENTS', label: 'Live Gate Turnstiles', icon: CheckCircle2 },
          { id: 'PASSES', label: 'Active Gate Passes', icon: FileText },
          { id: 'VEHICLES', label: 'Vehicles Log', icon: Car },
          { id: 'PARCELS', label: 'Parcels & Deliveries', icon: Package },
          { id: 'INCIDENTS', label: 'Security Incidents', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSecSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                secSubTab === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feed Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        {secSubTab === 'MOVEMENTS' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Recent Turnstile Entry & Exit Scans
            </h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_ENTRY_EXIT_LOGS.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-black text-[10px] ${
                        log.direction === 'ENTRY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.direction}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{log.studentName}</p>
                      <p className="text-[10px] text-slate-400">
                        {log.rollNumber} • {log.hostel} ({log.room})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-700">{log.gate}</p>
                    <p className="text-[10px] text-slate-400">{log.timestamp} • Officer: {log.securityOfficer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {secSubTab === 'PASSES' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Active Campus Gate Passes</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_SECURITY_GATE_PASSES.map((pass) => (
                <div key={pass.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-700">{pass.passNumber}</span>
                      <span className="font-bold text-slate-900">{pass.studentName}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          pass.status === 'OUT'
                            ? 'bg-amber-100 text-amber-800'
                            : pass.status === 'OVERDUE'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {pass.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Destination: {pass.destination} • Reason: {pass.reason}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-600">
                    <p>Expected Return: <strong className="text-slate-800">{pass.expectedReturnTime}</strong></p>
                    <p className="text-[10px] text-slate-400">Approved by: {pass.approvedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {secSubTab === 'VEHICLES' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Campus Vehicle Logs</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_SECURITY_VEHICLES.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{v.plateNumber}</span>
                    <span className="text-slate-500 ml-2">({v.vehicleType} - {v.driverName})</span>
                    <p className="text-[10px] text-slate-400">Purpose: {v.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {v.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Entered: {v.entryTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {secSubTab === 'PARCELS' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Student Courier & Parcel Intake</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_SECURITY_PARCELS.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-purple-700">{p.parcelNumber}</span>
                    <span className="font-bold text-slate-900 ml-2">{p.recipientName}</span>
                    <p className="text-[10px] text-slate-400">Courier: {p.company} • Destination: {p.roomOrDept}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {secSubTab === 'INCIDENTS' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Security Incident Log</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_SECURITY_INCIDENTS.map((inc) => (
                <div key={inc.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-rose-600">{inc.incidentNumber}</span>
                      <span className="font-bold text-slate-900">[{inc.category}]</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {inc.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{inc.date} • {inc.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{inc.description}</p>
                  <p className="text-[10px] text-slate-400">Location: {inc.location} • Reported By: {inc.reportedBy}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 3. SERVICE & MAINTENANCE MONITORING VIEW
// =========================================================================
export function AdminServiceMaintenanceView() {
  const [svcSubTab, setSvcSubTab] = useState<'REQUESTS' | 'HISTORY' | 'NOTIFICATIONS' | 'MAINTENANCE' | 'INVENTORY'>('REQUESTS');
  const [requestsList, setRequestsList] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [notifications, setNotifications] = useState<StudentNotification[]>(INITIAL_STUDENT_NOTIFICATIONS);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | ServiceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketForTrack, setSelectedTicketForTrack] = useState<ServiceRequest | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleCreateTicket = (newT: Partial<ServiceRequest>) => {
    const fullTicket: ServiceRequest = {
      id: `sr-${Date.now()}`,
      ticketNumber: newT.ticketNumber || `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: newT.studentName || 'Student Resident',
      studentId: 'CS2023042',
      studentRoll: newT.studentRoll || 'REC-2023-CS042',
      studentPhone: newT.studentPhone || '+91 98765 43210',
      hostel: newT.hostel || 'Nilgiri Residence (Block A)',
      room: newT.room || 'A-204',
      category: newT.category || 'Plumbing',
      title: newT.title || 'Service Work Order',
      description: newT.description || '',
      photoUrl: newT.photoUrl,
      priority: newT.priority || 'MEDIUM',
      assignedStaffName: 'Unassigned (Awaiting Dispatch)',
      status: 'New',
      createdTime: 'Just now',
      updatedTime: 'Just now',
      slaDue: newT.priority === 'CRITICAL' ? 'Within 2 hours' : 'Within 24 hours',
    };

    setRequestsList((prev) => [fullTicket, ...prev]);

    // Also push to student notifications
    const newNotif: StudentNotification = {
      id: `notif-${Date.now()}`,
      ticketId: fullTicket.id,
      ticketNumber: fullTicket.ticketNumber,
      studentName: fullTicket.studentName,
      studentRoll: fullTicket.studentRoll,
      room: fullTicket.room,
      hostel: fullTicket.hostel,
      category: fullTicket.category,
      title: `New ${fullTicket.category} Request: ${fullTicket.title}`,
      message: fullTicket.description,
      photoUrl: fullTicket.photoUrl,
      timestamp: 'Just now',
      read: false,
      priority: fullTicket.priority,
      type: fullTicket.priority === 'CRITICAL' ? 'URGENT' : 'NEW_REQUEST',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateStatus = (ticketId: string, status: ServiceStatus, notes?: string) => {
    setRequestsList((prev) =>
      prev.map((r) =>
        r.id === ticketId
          ? {
              ...r,
              status,
              updatedTime: 'Just now',
              completionNote: notes || r.completionNote,
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Jump to Service Hub */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-900">Campus Facilities, Maintenance & Services</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Live Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Central command for electrical, plumbing, sweeper/cleaning, Internet/Wi-Fi, and furniture maintenance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise Service Request</span>
          </button>
          <a
            href="/admin/service"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>Open Service Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Active Work Orders</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{requestsList.length}</h4>
          <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Across all 6 campus hostels</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Student Notifications</p>
          <h4 className="text-2xl font-black text-rose-600 mt-1">{unreadNotifCount} New</h4>
          <p className="text-[10px] text-rose-500 font-semibold mt-0.5">Live student alerts pending</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Maintenance Tasks</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{INITIAL_MAINTENANCE_SCHEDULE.length}</h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Preventive schedules on track</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Spare Parts Inventory</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">{INITIAL_SERVICE_INVENTORY.length} Items</h4>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Hardware & electrical stores</p>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'REQUESTS', label: 'Service Work Orders' },
            { id: 'HISTORY', label: 'Request History' },
            { id: 'NOTIFICATIONS', label: `Student Notifications (${unreadNotifCount})` },
            { id: 'MAINTENANCE', label: 'Preventive Maintenance' },
            { id: 'INVENTORY', label: 'Hardware & Spare Parts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSvcSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                svcSubTab === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.id === 'NOTIFICATIONS' && <Bell className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Raise Request</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        {/* 1. SERVICE WORK ORDERS */}
        {svcSubTab === 'REQUESTS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {['ALL', 'Electrical', 'Plumbing', 'Cleaning', 'Wi-Fi', 'Furniture', 'Water', 'Room Repair', 'Mess'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Filter student or ticket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {requestsList
                .filter((r) => {
                  if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
                  if (searchQuery && !r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) && !r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  return true;
                })
                .map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {req.ticketNumber}
                        </span>
                        <span className="font-bold text-slate-900">[{req.category}]</span>
                        <span className="font-semibold text-slate-800">{req.title}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            req.priority === 'HIGH' || req.priority === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Student: <strong className="text-slate-800">{req.studentName}</strong> ({req.hostel} - Room {req.room}) • {req.description}
                      </p>

                      {/* Photo indicator if attached */}
                      {req.photoUrl && (
                        <div
                          onClick={() => {
                            setSelectedTicketForTrack(req);
                            setShowTrackModal(true);
                          }}
                          className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer hover:bg-blue-100"
                        >
                          <Camera className="w-3 h-3 text-blue-600" />
                          <span>Photo Attached • Click to View</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {req.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTicketForTrack(req);
                          setShowTrackModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Track Status</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 2. REQUEST HISTORY */}
        {svcSubTab === 'HISTORY' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900">Request History & Audit Log</h4>
                <p className="text-xs text-slate-400">All historical campus repair tickets, completion notes, and resident ratings.</p>
              </div>
              <span className="text-xs font-bold text-slate-500">{requestsList.length} Total Records</span>
            </div>

            <div className="space-y-3">
              {requestsList.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-600 mr-2">{req.ticketNumber}</span>
                      <span className="font-bold text-slate-800">[{req.category}] {req.title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Logged by {req.studentName} ({req.hostel} - Room {req.room}) • {req.createdTime}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {req.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                    {req.description}
                  </p>

                  {req.completionNote && (
                    <div className="p-2 rounded-xl bg-emerald-50 text-[10px] text-emerald-800 font-medium">
                      <strong>Completion Note:</strong> {req.completionNote}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">Technician: {req.assignedStaffName}</span>
                    <button
                      onClick={() => {
                        setSelectedTicketForTrack(req);
                        setShowTrackModal(true);
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Track Full Timeline</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. STUDENT NOTIFICATIONS */}
        {svcSubTab === 'NOTIFICATIONS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900">Student Service Notifications</h4>
                <p className="text-xs text-slate-400">Real-time alerts submitted by students across hostel rooms.</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Mark all as seen
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-2xl border transition text-xs space-y-2 ${
                    !notif.read ? 'bg-blue-50/30 border-blue-200 ring-1 ring-blue-100' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {notif.studentName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900">{notif.studentName}</span>
                          <span className="text-slate-400">({notif.studentRoll})</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[9px] font-bold">
                            {notif.category}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-[11px] mt-0.5">{notif.title}</p>
                        <p className="text-[11px] text-slate-600">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Room {notif.room} • {notif.timestamp}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.timestamp}</span>
                  </div>

                  {notif.photoUrl && (
                    <div className="pl-10">
                      <img src={notif.photoUrl} alt="Issue photo" className="w-20 h-16 rounded-xl object-cover border border-slate-200" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 pl-10">
                    <span className="text-[10px] font-bold text-blue-600">{!notif.read ? '● Unread' : 'Seen'}</span>
                    <button
                      onClick={() => {
                        const found = requestsList.find((r) => r.id === notif.ticketId || r.ticketNumber === notif.ticketNumber);
                        if (found) {
                          setSelectedTicketForTrack(found);
                          setShowTrackModal(true);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[10px] transition cursor-pointer"
                    >
                      Track Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PREVENTIVE MAINTENANCE */}
        {svcSubTab === 'MAINTENANCE' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Preventive Maintenance Schedule</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_MAINTENANCE_SCHEDULE.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{m.title}</p>
                    <p className="text-[10px] text-slate-400">
                      Facility: {m.facility} • Frequency: {m.frequency} • Assigned Team: {m.assignedTeam}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {m.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Scheduled: {m.scheduledTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SPARE PARTS INVENTORY */}
        {svcSubTab === 'INVENTORY' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Spare Parts & Hardware Inventory</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_SERVICE_INVENTORY.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Code: {item.itemCode} • Location: {item.location} • Min Stock: {item.minStock} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.isLowStock ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.quantity} {item.unit} {item.isLowStock ? '(Low Stock)' : ''}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Condition: {item.condition}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals Suite for Admin Service View */}
      <CreateServiceTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTicket={handleCreateTicket}
      />

      <TrackStatusModal
        isOpen={showTrackModal}
        ticket={selectedTicketForTrack}
        onClose={() => setShowTrackModal(false)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export function AdminMedicalManagementView() {
  const [medSubTab, setMedSubTab] = useState<'REQUESTS' | 'MEDICINES' | 'AMBULANCE'>('REQUESTS');
  const [medicalRequests, setMedicalRequests] = useState<any[]>(INITIAL_MEDICAL_REQUESTS);

  // Sync with live backend API & WebSockets
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000';
        const res = await fetch(`${apiOrigin}/api/medical/requests`, { credentials: 'omit' }).catch(() => null);
        if (res && res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            setMedicalRequests((prev) => {
              const prevIds = new Set(prev.map((r) => r.id || r.ticketNumber));
              const fresh = apiData.filter((r: any) => !prevIds.has(r.id) && !prevIds.has(r.ticketNumber));
              return [...fresh, ...prev];
            });
          }
        }
      } catch (e) {
        console.warn('Medical requests fetch notice:', e);
      }
    };

    fetchRequests();

    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');
    socket.on('medical:request_created', (data: any) => {
      console.log('💊 Live medical request received in admin component:', data);
      setMedicalRequests((prev) => {
        const id = data.id || data.ticketNumber;
        if (prev.some((r) => r.id === id || r.ticketNumber === data.ticketNumber)) return prev;
        return [
          {
            id: id || `med-${Date.now()}`,
            ticketNumber: data.ticketNumber || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
            studentName: data.studentName || data.residentName || 'Student Patient',
            studentRoll: data.studentRoll || 'REC-STU',
            hostel: data.hostel || data.blockName || 'Campus Hostel',
            room: data.room || data.roomNumber || 'Room',
            requestType: data.urgency === 'EMERGENCY' ? 'Emergency' : 'Illness',
            urgency: data.urgency || 'NORMAL',
            description: data.description || 'Medical consultation requested',
            status: data.status || 'New',
            dateTime: 'Just now',
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Jump to Medical Hub */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-black text-slate-900">Campus Medical & Health Center</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor student medical requests, emergency alerts, pharmacy medicine stock, and 24x7 ambulance.
          </p>
        </div>
        <a
          href="/staff/medical/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <span>Open Medical Center</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Privacy Guarantee Alert */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-2.5 text-xs text-blue-900">
        <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Medical Privacy Protected (HIPAA / Institutional Standard)</strong>
          <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
            Confidential medical diagnoses and prescriptions remain restricted to the Campus Health Dispensary.
            Administrative views monitor only operational parameters (student status, bed-rest leave dates, ambulance triage).
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Student Requests</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{medicalRequests.length}</h4>
          <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Live student health requests</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Emergency Alerts</p>
          <h4 className="text-2xl font-black text-purple-600 mt-1">{INITIAL_MEDICAL_LEAVES.length}</h4>
          <p className="text-[10px] text-purple-600 font-semibold mt-0.5">CMO certified bed rest</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">24x7 Ambulance</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">Ready</h4>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready at Main Gate 1</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Campus Pharmacy</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{INITIAL_MEDICINE_INVENTORY.length} Medicines</h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">10 free student medicines</p>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 shadow-2xs">
        {[
          { id: 'REQUESTS', label: 'Student Requests' },
          { id: 'MEDICINES', label: 'Campus Pharmacy' },
          { id: 'AMBULANCE', label: '24×7 Ambulance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMedSubTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              medSubTab === tab.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        {medSubTab === 'REQUESTS' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Student Medical Requests</h4>
            <div className="divide-y divide-slate-100">
              {medicalRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{req.studentName}</span>
                      <span className="font-mono text-slate-500">({req.studentRoll})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {req.requestType}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          req.urgency === 'EMERGENCY'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {req.urgency}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Hostel: {req.hostel} ({req.room}) • Complaint: {req.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {req.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{req.dateTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {medSubTab === 'AMBULANCE' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">24×7 Ambulance & Hospital Transfers</h4>
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-rose-900">Campus 24x7 Ambulance Unit 1 (ALS)</p>
                <p className="text-xs text-rose-700 mt-0.5">Registration: OD-02-AMB-108 • Driver: +91 94370 00108</p>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
                Stationed & Ready
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {INITIAL_AMBULANCE_REFERRALS.map((amb) => (
                <div key={amb.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{amb.studentName}</span>
                    <span className="text-slate-500 ml-2">({amb.studentRoll})</span>
                    <p className="text-[10px] text-slate-500">
                      Destination: {amb.destinationHospital} • Driver: {amb.driverName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {amb.referralReason}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{amb.dispatchTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {medSubTab === 'MEDICINES' && (
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Campus Pharmacy Stock (10 Free Student Medicines)</h4>
            <div className="divide-y divide-slate-100">
              {INITIAL_MEDICINE_INVENTORY.map((med) => (
                <div key={med.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{med.name}</span>
                    <span className="text-slate-400 ml-2 font-mono text-[11px]">({med.dosage})</span>
                    <p className="text-[10px] text-slate-400">Category: {med.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{med.quantity} {med.unit}</span>
                    {med.isLowStock && (
                      <span className="ml-2 text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-bold">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 5. VISITOR MANAGEMENT MONITORING VIEW
// =========================================================================
export function AdminVisitorManagementView() {
  const [visitors, setVisitors] = useState(INITIAL_SECURITY_VISITORS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState<{
    name: string;
    phone: string;
    idType: 'Aadhaar' | 'Driving License' | 'Voter ID' | 'Passport' | 'College ID';
    idNumber: string;
    studentVisited: string;
    studentRoll: string;
    studentRoom: string;
    purpose: string;
    vehicleNumber: string;
  }>({
    name: '',
    phone: '',
    idType: 'Aadhaar',
    idNumber: '',
    studentVisited: '',
    studentRoll: '',
    studentRoom: '',
    purpose: '',
    vehicleNumber: '',
  });

  const filtered = visitors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.studentVisited.toLowerCase().includes(search.toLowerCase()) ||
      (v.passNumber && v.passNumber.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCheckout = (id: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Checked Out', exitTime: time } : v))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.name || !newVisitor.studentVisited) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item = {
      ...newVisitor,
      id: `vis-${Date.now()}`,
      entryTime: time,
      status: 'Checked In' as const,
      passNumber: `VP-2026-0${visitors.length + 42}`,
      securityOfficer: 'Officer Rajesh Kumar',
    };
    setVisitors([item, ...visitors]);
    setShowAddModal(false);
    setNewVisitor({
      name: '',
      phone: '',
      idType: 'Aadhaar',
      idNumber: '',
      studentVisited: '',
      studentRoll: '',
      studentRoom: '',
      purpose: '',
      vehicleNumber: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-black text-slate-900">Campus Visitor Registry & Pass Authorization</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor all parents, guest lecturers, service vendors, and official delegates entering campus.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Visitor</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Total Visitors Today</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">{visitors.length}</h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Verified at Main Gate</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Currently On Campus</p>
          <h4 className="text-2xl font-black text-indigo-600 mt-1">
            {visitors.filter((v) => v.status === 'Checked In').length}
          </h4>
          <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">Checked In status</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Checked Out</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-1">
            {visitors.filter((v) => v.status === 'Checked Out').length}
          </h4>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Exited via Main Gate</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase">Vehicles Registered</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">
            {visitors.filter((v) => v.vehicleNumber).length}
          </h4>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Cars / two-wheelers</p>
        </div>
      </div>

      {/* Visitors List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Visitor Records Log</h4>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visitor name or pass..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-56 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Pass #</th>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Student Being Visited</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Entry / Exit</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{v.passNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <p>{v.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{v.phone} • {v.idType}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <p className="font-bold">{v.studentVisited}</p>
                    <p className="text-[10px] text-slate-400">{v.studentRoom}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">{v.purpose}</td>
                  <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">{v.vehicleNumber || 'None (Walk-in)'}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <p>In: {v.entryTime}</p>
                    {v.exitTime && <p className="text-[10px] text-slate-400">Out: {v.exitTime}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'Checked In'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {v.status === 'Checked In' && (
                      <button
                        onClick={() => handleCheckout(v.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
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

      {/* Modal: Register Visitor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Register Campus Visitor</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Verma"
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94370 00000"
                    value={newVisitor.phone}
                    onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ID Proof Type</label>
                  <select
                    value={newVisitor.idType}
                    onChange={(e) => setNewVisitor({ ...newVisitor, idType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Visited</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subham Pradhan"
                    value={newVisitor.studentVisited}
                    onChange={(e) => setNewVisitor({ ...newVisitor, studentVisited: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hostel Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Room A-204"
                    value={newVisitor.studentRoom}
                    onChange={(e) => setNewVisitor({ ...newVisitor, studentRoom: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. REC-2023-CS042"
                  value={newVisitor.studentRoll}
                  onChange={(e) => setNewVisitor({ ...newVisitor, studentRoll: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose of Visit</label>
                <input
                  type="text"
                  placeholder="e.g. Parental visit / document verification"
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vehicle Number (if any)</label>
                <input
                  type="text"
                  placeholder="e.g. OD-02-B-1290"
                  value={newVisitor.vehicleNumber}
                  onChange={(e) => setNewVisitor({ ...newVisitor, vehicleNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 6. MESS MANAGEMENT VIEW
// =========================================================================
export { AdminMessManagementView } from './modules/AdminMessManagementView';

// 7. ACADEMIC & CAMPUS CALENDAR VIEW
// =========================================================================
export function AdminCalendarView() {
  const [filter, setFilter] = useState('ALL');
  const [events, setEvents] = useState([
    { id: 'ev-1', title: 'Tech Fest 2026 – Hackathon & Robotics', date: '02 Oct 2026', category: 'EVENT', venue: 'Main Auditorium', status: 'Upcoming' },
    { id: 'ev-2', title: 'Gandhi Jayanti – Official Campus Holiday', date: '02 Oct 2026', category: 'HOLIDAY', venue: 'Campus Closed', status: 'Holiday' },
    { id: 'ev-3', title: 'Mid-Semester Examinations 2026', date: '12 Oct – 18 Oct 2026', category: 'EXAM', venue: 'Examination Halls 1-6', status: 'Mandatory' },
    { id: 'ev-4', title: 'Annual Cultural Fest "TARANG 2026"', date: '26 Oct – 28 Oct 2026', category: 'EVENT', venue: 'Open Air Amphitheater', status: 'Published' },
    { id: 'ev-5', title: 'Campus Placement Drive – Tier 1 Tech', date: '05 Nov 2026', category: 'PLACEMENT', venue: 'Training & Placement Cell', status: 'Scheduled' },
    { id: 'ev-6', title: 'Biju Patnaik Memorial Football Championship', date: '15 Nov 2026', category: 'SPORTS', venue: 'Central Sports Ground', status: 'Upcoming' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'EVENT',
    venue: '',
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    setEvents([
      { ...newEvent, id: `ev-${Date.now()}`, status: 'Published' },
      ...events,
    ]);
    setShowAddModal(false);
    setNewEvent({ title: '', date: '', category: 'EVENT', venue: '' });
  };

  const filtered = events.filter((e) => filter === 'ALL' || e.category === filter);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900">Academic & Campus Master Calendar</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Published calendar events sync automatically with the Student & Faculty mobile views.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Event</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 shadow-2xs">
        {['ALL', 'EVENT', 'EXAM', 'HOLIDAY', 'PLACEMENT', 'SPORTS'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All Activities' : cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
                {item.category}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {item.status}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.title}</h4>
            <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
              <p className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{item.date}</span>
              </p>
              <p className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.venue}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Add Campus Event / Exam</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Theory Examination 2026"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date / Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 Oct 2026"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="EVENT">Campus Event</option>
                    <option value="EXAM">Examination</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="PLACEMENT">Placement Drive</option>
                    <option value="SPORTS">Sports Championship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Venue / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Central Auditorium / Ground"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 8. CAMPUS CONTACTS DIRECTORY VIEW
// =========================================================================
export function AdminCampusContactsView() {
  const contactsList = [
    { title: 'Office of the Director / Principal', person: 'Prof. (Dr.) A. K. Panda', phone: '+91 674 2751 017', email: 'director@rec.ac.in', category: 'LEADERSHIP' },
    { title: 'Chief Warden (Boys Hostels)', person: 'Prof. Ramesh Chandra Dash', phone: '+91 94370 12001', email: 'warden.boys@rec.ac.in', category: 'HOSTEL' },
    { title: 'Chief Warden (Girls Hostels)', person: 'Dr. Smita Pattnaik', phone: '+91 94370 12002', email: 'warden.girls@rec.ac.in', category: 'HOSTEL' },
    { title: 'Main Gate Security Control Desk', person: 'Officer Rajesh Kumar (SEC-042)', phone: '+91 94370 88214', email: 'security.gate@rec.ac.in', category: 'SECURITY' },
    { title: 'Health Dispensary & Doctor OPD', person: 'Dr. Pratima Mishra, MD', phone: '+91 94370 88219', email: 'health.centre@rec.ac.in', category: 'MEDICAL' },
    { title: '24x7 Campus Ambulance Hotline', person: 'Stationed Porch (OD-02-AMB-108)', phone: '+91 94370 00108', email: 'ambulance@rec.ac.in', category: 'EMERGENCY' },
    { title: 'Campus Facilities & Maintenance Lead', person: 'Mahendra Singh (OPS-108)', phone: '+91 94370 77102', email: 'facilities@rec.ac.in', category: 'SERVICES' },
    { title: 'Central IT & Network Helpdesk', person: 'System Administrator Ray', phone: '+91 674 2751 025', email: 'helpdesk@rec.ac.in', category: 'IT_SUPPORT' },
    { title: 'Khandagiri Police Jurisdiction Desk', person: 'PCR Van Patrol Officer', phone: '112 / 0674-2471011', email: 'police.khandagiri@odisha.gov.in', category: 'EMERGENCY' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-2">
          <PhoneCall className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-black text-slate-900">Official Campus Leadership & Emergency Speed Dial</h3>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified directory synced across the Student Platform, Warden Hub, Security Hub, and Admin Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactsList.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
              {c.category}
            </span>
            <h4 className="font-extrabold text-sm text-slate-900">{c.title}</h4>
            <p className="text-xs text-slate-500">Contact Person: <strong className="text-slate-800">{c.person}</strong></p>
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
              <a
                href={`tel:${c.phone}`}
                className="flex items-center space-x-2 text-blue-600 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{c.phone}</span>
              </a>
              <a
                href={`mailto:${c.email}`}
                className="flex items-center space-x-2 text-slate-500 hover:text-slate-700 truncate"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{c.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 9. ADMIN MY PROFILE VIEW
// =========================================================================
export function AdminMyProfileView({ user, logout }: { user: any; logout: () => void }) {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-slate-900">{user.name || 'Campus Super Administrator'}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                {user.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Executive Management & System Oversight</p>
            <p className="text-xs text-emerald-600 font-bold mt-0.5">
              {user.tenantName || 'Raajdhani Engineering College (Autonomous)'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Official Email</span>
            <p className="font-bold text-slate-900">{user.email || 'admin@rec.ac.in'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Phone Hotline</span>
            <p className="font-bold text-slate-900">+91 674 2751 017</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Admin ID</span>
            <p className="font-bold font-mono text-slate-900">ADM-EXEC-2026-001</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Office Location</span>
            <p className="font-bold text-slate-900">Administrative Block, Level 1</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">Access Scope & Authorizations</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {[
              'Full Campus Oversight',
              'Student Database Access',
              'Warden Gate Pass Monitor',
              'Security Turnstile Audit',
              'Service & Mess Operations',
              'Medical Hub Dispatch Relay',
            ].map((p, i) => (
              <div key={i} className="flex items-center space-x-1.5 text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-mono">Current Session: Encrypted TLS 1.3 • Authenticated</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
