'use client';

import React, { useState } from 'react';
import {
  Users,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  X,
  Save,
  Trash2,
  Lock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface WardenRecord {
  id: string;
  name: string;
  empId: string;
  phone: string;
  email: string;
  assignedHostel: string;
  status: 'ACTIVE' | 'INACTIVE';
  shift: string;
  responsibilities: string[];
  joinedDate: string;
  roomAllocatedCount: number;
}

export const INITIAL_WARDENS: WardenRecord[] = [
  {
    id: 'w-1',
    name: 'Prof. Ramesh Chandra Dash',
    empId: 'REC-WAR-101',
    phone: '+91 94370 12001',
    email: 'rc.dash@rec.ac.in',
    assignedHostel: 'Nilgiri Block A (Boys)',
    status: 'ACTIVE',
    shift: 'General & Night Supervision',
    responsibilities: [
      'Room & Bed Allocation',
      'Leave & Gate Pass Authorization',
      'Discipline & Floor Safety',
      'Emergency First Response',
    ],
    joinedDate: '15 Jul 2021',
    roomAllocatedCount: 400,
  },
  {
    id: 'w-2',
    name: 'Dr. Smita Pattnaik',
    empId: 'REC-WAR-102',
    phone: '+91 94370 12002',
    email: 's.pattnaik@rec.ac.in',
    assignedHostel: 'Shivalik Block B (Girls)',
    status: 'ACTIVE',
    shift: 'General & Evening Supervision',
    responsibilities: [
      'Female Resident Welfare',
      'Night Curfew Enforcement',
      'Parent Communication Desk',
      'Health & Wellness Monitoring',
    ],
    joinedDate: '10 Aug 2022',
    roomAllocatedCount: 325,
  },
  {
    id: 'w-3',
    name: 'Prof. Manoj Tripathy',
    empId: 'REC-WAR-103',
    phone: '+91 94370 12003',
    email: 'm.tripathy@rec.ac.in',
    assignedHostel: 'Dhaulagiri Block C (Junior Boys)',
    status: 'ACTIVE',
    shift: 'Morning & Evening Care',
    responsibilities: [
      'Fresher Anti-Ragging Cell',
      'Hostel Asset Maintenance Liaison',
      'Mess Quality Oversight',
      'Daily Roll Call Verification',
    ],
    joinedDate: '01 Dec 2023',
    roomAllocatedCount: 175,
  },
  {
    id: 'w-4',
    name: 'Mr. Sunil Pradhan',
    empId: 'REC-WAR-104',
    phone: '+91 94370 12004',
    email: 'sunil.pradhan@rec.ac.in',
    assignedHostel: 'Aravali Executive Residence',
    status: 'INACTIVE',
    shift: 'Rotational',
    responsibilities: [
      'Faculty & Guest Suite Logistics',
      'Facility Safety & Inventory Check',
    ],
    joinedDate: '05 Jan 2024',
    roomAllocatedCount: 30,
  },
];

export function WardenManagementView() {
  const router = useRouter();
  const [wardens, setWardens] = useState<WardenRecord[]>(INITIAL_WARDENS);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWarden, setEditingWarden] = useState<WardenRecord | null>(null);
  const [viewingWarden, setViewingWarden] = useState<WardenRecord | null>(null);

  // New Warden form state
  const [formName, setFormName] = useState('');
  const [formEmpId, setFormEmpId] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formHostel, setFormHostel] = useState('Nilgiri Block A (Boys)');
  const [formShift, setFormShift] = useState('General Supervision');

  const hostelsList = [
    'Nilgiri Block A (Boys)',
    'Shivalik Block B (Girls)',
    'Dhaulagiri Block C (Junior Boys)',
    'Aravali Executive Residence',
    'Himalaya Block D (Girls)',
  ];

  const handleCreateWarden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmpId) return;

    const newRecord: WardenRecord = {
      id: `w-${Date.now()}`,
      name: formName,
      empId: formEmpId,
      phone: formPhone || '+91 94370 00000',
      email: formEmail || `${formEmpId.toLowerCase()}@rec.ac.in`,
      assignedHostel: formHostel,
      status: 'ACTIVE',
      shift: formShift,
      responsibilities: [
        'Hostel Management & Student Welfare',
        'Leave & Gate Pass Approvals',
        'Floor Safety Supervision',
      ],
      joinedDate: 'Today',
      roomAllocatedCount: 200,
    };

    setWardens((prev) => [newRecord, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateWarden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarden) return;

    setWardens((prev) =>
      prev.map((w) => (w.id === editingWarden.id ? editingWarden : w))
    );
    setEditingWarden(null);
  };

  const toggleStatus = (id: string) => {
    setWardens((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : w
      )
    );
  };

  const resetForm = () => {
    setFormName('');
    setFormEmpId('');
    setFormPhone('');
    setFormEmail('');
    setFormHostel('Nilgiri Block A (Boys)');
    setFormShift('General Supervision');
  };

  const filteredWardens = wardens.filter((w) => {
    if (hostelFilter !== 'ALL' && w.assignedHostel !== hostelFilter) return false;
    if (statusFilter !== 'ALL' && w.status !== statusFilter) return false;
    if (
      search &&
      !w.name.toLowerCase().includes(search.toLowerCase()) &&
      !w.empId.toLowerCase().includes(search.toLowerCase()) &&
      !w.assignedHostel.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Warden Management & Hostel Superintendents
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized administration of chief wardens, hostel allocations, and duty rosters.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Warden</span>
          </button>
          <button
            onClick={() => router.push('/admin/warden')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Launch Warden Platform</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Wardens</p>
          <h4 className="text-xl font-black text-slate-900 mt-0.5">{wardens.length}</h4>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
            {wardens.filter((w) => w.status === 'ACTIVE').length} Active on duty
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Hostel Coverage</p>
          <h4 className="text-xl font-black text-blue-600 mt-0.5">100%</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">All 4 active blocks assigned</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Managed Rooms</p>
          <h4 className="text-xl font-black text-indigo-600 mt-0.5">930 Rooms</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Under warden care</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Emergency Helpline</p>
          <h4 className="text-xl font-black text-rose-600 mt-0.5">24x7</h4>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Immediate escalation active</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by name, ID, or hostel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Hostels</option>
            {hostelsList.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-400">
          Showing {filteredWardens.length} Wardens
        </span>
      </div>

      {/* Wardens Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWardens.map((warden) => (
          <div
            key={warden.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm border border-emerald-200/60">
                    {warden.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                      {warden.name}
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                      {warden.empId} • Joined {warden.joinedDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    warden.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {warden.status}
                </span>
              </div>

              {/* Details Capsule */}
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Assigned Hostel:</span>
                  <span className="font-bold text-slate-900 text-right">{warden.assignedHostel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Duty Shift:</span>
                  <span className="font-bold text-slate-800">{warden.shift}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Contact Phone:</span>
                  <span className="font-mono font-bold text-blue-600">{warden.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-medium text-slate-700">{warden.email}</span>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Assigned Responsibilities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {warden.responsibilities.map((r, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50/80 text-emerald-800 text-[10px] font-semibold border border-emerald-200/50"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => toggleStatus(warden.id)}
                className={`text-[11px] font-bold cursor-pointer transition ${
                  warden.status === 'ACTIVE'
                    ? 'text-rose-600 hover:text-rose-700'
                    : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                {warden.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
              </button>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setViewingWarden(warden)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1 cursor-pointer transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setEditingWarden({ ...warden })}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center space-x-1 cursor-pointer transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Warden */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <h3 className="font-extrabold text-sm">Add New Hostel Warden</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateWarden} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. / Dr. Full Name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. REC-WAR-105"
                    value={formEmpId}
                    onChange={(e) => setFormEmpId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 94370 XXXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="warden@rec.ac.in"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assign Hostel</label>
                  <select
                    value={formHostel}
                    onChange={(e) => setFormHostel(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {hostelsList.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duty Shift</label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="General Supervision">General Supervision</option>
                    <option value="Night & Emergency Shift">Night & Emergency Shift</option>
                    <option value="Evening Resident Care">Evening Resident Care</option>
                    <option value="Rotational Duty">Rotational Duty</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Warden</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Warden */}
      {editingWarden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Edit Warden Profile & Assignments</h3>
              <button onClick={() => setEditingWarden(null)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleUpdateWarden} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingWarden.name}
                    onChange={(e) => setEditingWarden({ ...editingWarden, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    disabled
                    value={editingWarden.empId}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Hostel</label>
                  <select
                    value={editingWarden.assignedHostel}
                    onChange={(e) => setEditingWarden({ ...editingWarden, assignedHostel: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {hostelsList.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duty Shift</label>
                  <input
                    type="text"
                    value={editingWarden.shift}
                    onChange={(e) => setEditingWarden({ ...editingWarden, shift: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingWarden.phone}
                    onChange={(e) => setEditingWarden({ ...editingWarden, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingWarden.email}
                    onChange={(e) => setEditingWarden({ ...editingWarden, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingWarden(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Warden Profile Drawer */}
      {viewingWarden && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm">Warden Profile Dossier</h3>
              <button onClick={() => setViewingWarden(null)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-base">
                  {viewingWarden.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">{viewingWarden.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{viewingWarden.empId} • Joined {viewingWarden.joinedDate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Hostel Jurisdiction</p>
                <div className="p-3 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hostel:</span>
                    <span className="font-bold text-slate-900">{viewingWarden.assignedHostel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Supervised Rooms:</span>
                    <span className="font-bold text-indigo-600">{viewingWarden.roomAllocatedCount} Rooms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shift Schedule:</span>
                    <span className="font-bold text-slate-800">{viewingWarden.shift}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Assigned Responsibilities</p>
                <ul className="space-y-1.5 pl-2">
                  {viewingWarden.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-center space-x-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                <button
                  onClick={() => {
                    setViewingWarden(null);
                    router.push('/admin/warden');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Open Dedicated Warden Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewingWarden(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WardenManagementView;
