'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Building,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Check,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  ChevronRight,
  Bell,
  Layers,
} from 'lucide-react';

export type MaintenanceType =
  | 'Electrical'
  | 'Plumbing'
  | 'Water supply'
  | 'Wi-Fi/network'
  | 'AC/Fan'
  | 'Cleaning'
  | 'Lift'
  | 'Civil/Building'
  | 'Other';

export type MaintenanceScheduleStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'Delayed'
  | 'Completed'
  | 'Cancelled';

export interface MaintenanceScheduleRecord {
  id: string;
  title: string;
  type: MaintenanceType;
  assignedTeam: string;
  building: string;
  roomArea: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  expectedImpact: string;
  status: MaintenanceScheduleStatus;
  studentNotified: boolean;
}

export const INITIAL_SCHEDULES: MaintenanceScheduleRecord[] = [
  {
    id: 'sch-1',
    title: 'Nilgiri Block A Solar Water Geyser Electrical Safety Overhaul',
    type: 'Electrical',
    assignedTeam: 'High Voltage Electrical Unit (Er. Dilip)',
    building: 'Nilgiri Residence (Block A)',
    roomArea: 'Rooftop Geyser Banks & 3rd/4th Floor Bathrooms',
    date: '08 Oct 2026',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    description: 'Replacing burnt contactors, inspecting earth pit resistance, and rewiring MCB breakers.',
    expectedImpact: 'Temporary power shutdown for 45 minutes on 4th floor; geyser off until 1 PM.',
    status: 'In Progress',
    studentNotified: true,
  },
  {
    id: 'sch-2',
    title: 'Central RO Water Purification Membrane Flush & TDS Calibrate',
    type: 'Water supply',
    assignedTeam: 'Water Sanitation Plumbers (Mahendra Singh)',
    building: 'All Hostels & Dining Mess',
    roomArea: 'Ground Floor Dispenser Stations A, B, C',
    date: '09 Oct 2026',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    description: 'Quarterly membrane chemical sanitization, UV ballast replacement, and filter renewal.',
    expectedImpact: 'Cold water cooler offline for 2 hours; backup 500L bottled supply provided.',
    status: 'Scheduled',
    studentNotified: true,
  },
  {
    id: 'sch-3',
    title: 'Campus Backbone Core Router Firmware Upgrade & Fiber Splice',
    type: 'Wi-Fi/network',
    assignedTeam: 'Campus IT Infrastructure Team (Suresh K.)',
    building: 'Academic Block 2 & Boys Hostel B',
    roomArea: 'West Wing Corridor Access Points (AP-101 to AP-120)',
    date: '09 Oct 2026',
    startTime: '11:00 PM',
    endTime: '01:30 AM',
    description: 'Deploying IEEE 802.11ax firmware patch and replacing spliced patch cords.',
    expectedImpact: 'Corridor Wi-Fi intermittent; library LAN will remain active.',
    status: 'Scheduled',
    studentNotified: true,
  },
  {
    id: 'sch-4',
    title: 'Hostel Lift Safety Brake & Hydraulic Pressure Testing',
    type: 'Lift',
    assignedTeam: 'Johnson Lifts Annual Maintenance Team',
    building: 'Shivalik Block B (Girls)',
    roomArea: 'Shaft #1 & Machine Room',
    date: '07 Oct 2026',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    description: 'Mandatory quarterly statutory lift load test & emergency battery rescue verification.',
    expectedImpact: 'Lift #1 closed during test; stairs must be used.',
    status: 'Completed',
    studentNotified: true,
  },
  {
    id: 'sch-5',
    title: 'Overhead Rainwater Gutter & Terrace Drainage Deep Cleanse',
    type: 'Cleaning',
    assignedTeam: 'Facility Sweeper & Housekeeping Wing',
    building: 'Dhaulagiri Block C',
    roomArea: 'Terrace & Parapet Drainage Chutes',
    date: '08 Oct 2026',
    startTime: '03:00 PM',
    endTime: '05:00 PM',
    description: 'Clearing seasonal fallen leaves and silt before monsoon showers.',
    expectedImpact: 'Terrace access restricted; no noise inside rooms.',
    status: 'Delayed',
    studentNotified: false,
  },
];

export function MaintenanceScheduleView() {
  const [schedules, setSchedules] = useState<MaintenanceScheduleRecord[]>(INITIAL_SCHEDULES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintenanceScheduleRecord | null>(null);

  // New Schedule form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MaintenanceType>('Electrical');
  const [newTeam, setNewTeam] = useState('Electrical Maintenance Team');
  const [newBuilding, setNewBuilding] = useState('Nilgiri Residence (Block A)');
  const [newArea, setNewArea] = useState('Corridor & Bathrooms');
  const [newDate, setNewDate] = useState('10 Oct 2026');
  const [newStartTime, setNewStartTime] = useState('10:00 AM');
  const [newEndTime, setNewEndTime] = useState('01:00 PM');
  const [newDesc, setNewDesc] = useState('');
  const [newImpact, setNewImpact] = useState('');

  const typesList: MaintenanceType[] = [
    'Electrical',
    'Plumbing',
    'Water supply',
    'Wi-Fi/network',
    'AC/Fan',
    'Cleaning',
    'Lift',
    'Civil/Building',
    'Other',
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const record: MaintenanceScheduleRecord = {
      id: `sch-${Date.now()}`,
      title: newTitle,
      type: newType,
      assignedTeam: newTeam,
      building: newBuilding,
      roomArea: newArea,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      description: newDesc,
      expectedImpact: newImpact || 'Normal service temporarily affected in marked zone.',
      status: 'Scheduled',
      studentNotified: true,
    };

    setSchedules((prev) => [record, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSchedules((prev) =>
      prev.map((s) => (s.id === editingItem.id ? editingItem : s))
    );
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStatus = (id: string, status: MaintenanceScheduleStatus) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewImpact('');
  };

  const filtered = schedules.filter((s) => {
    if (typeFilter !== 'ALL' && s.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (
      search &&
      !s.title.toLowerCase().includes(search.toLowerCase()) &&
      !s.building.toLowerCase().includes(search.toLowerCase()) &&
      !s.assignedTeam.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Campus Maintenance Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Plan, publish, and track preventive repairs, affected facilities, and student impact notices.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Maintenance Schedule</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Schedules</p>
          <h4 className="text-xl font-black text-slate-900 mt-0.5">{schedules.length}</h4>
          <p className="text-[10px] text-blue-600 font-bold mt-0.5">Across all facilities</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">In Progress</p>
          <h4 className="text-xl font-black text-amber-600 mt-0.5">
            {schedules.filter((s) => s.status === 'In Progress').length}
          </h4>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">Technicians on site</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Today/Tomorrow</p>
          <h4 className="text-xl font-black text-indigo-600 mt-0.5">
            {schedules.filter((s) => s.status === 'Scheduled').length}
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Student notices active</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Completed This Week</p>
          <h4 className="text-xl font-black text-emerald-600 mt-0.5">
            {schedules.filter((s) => s.status === 'Completed').length}
          </h4>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">100% verified</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search schedule, building, team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Types</option>
            {typesList.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-xs font-bold text-slate-400">
          Showing {filtered.length} Scheduled Operations
        </span>
      </div>

      {/* Schedules List */}
      <div className="space-y-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition space-y-3"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200/60">
                    {item.type}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    {item.date} • {item.startTime} - {item.endTime}
                  </span>
                  {item.studentNotified && (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px] border border-emerald-200/60 flex items-center space-x-1">
                      <Bell className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Students Notified</span>
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Location:</strong> {item.building} ({item.roomArea})
                </p>
                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Assigned Team:</strong> {item.assignedTeam}
                </p>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-1.5 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : item.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                      : item.status === 'Delayed'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : item.status === 'Cancelled'
                      ? 'bg-slate-100 text-slate-500 border border-slate-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingItem({ ...item })}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    title="Edit Schedule"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Cancel/Delete Schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Impact Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Work Description
                </p>
                <p className="text-xs text-slate-700 mt-1">{item.description}</p>
              </div>
              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
                <p className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Student Impact & Advisory</span>
                </p>
                <p className="text-xs text-amber-900 font-medium mt-1">{item.expectedImpact}</p>
              </div>
            </div>

            {/* Quick Status Control Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 text-[11px]">Quick Status Advance:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['Scheduled', 'In Progress', 'Delayed', 'Completed', 'Cancelled'] as MaintenanceScheduleStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => updateStatus(item.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        item.status === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Maintenance Schedule */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <h3 className="font-extrabold text-sm">Create Maintenance Schedule</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Schedule Title / Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overhead Tank Bleaching & Water Pressure Pump Safety Overhaul"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maintenance Type *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {typesList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Maintenance Team</label>
                  <input
                    type="text"
                    required
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Affected Building / Hostel *</label>
                  <input
                    type="text"
                    required
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Affected Room / Area *</label>
                  <input
                    type="text"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Maintenance Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail exact technical tasks, equipment to be replaced or tested..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-amber-800 block mb-1">
                  Expected Impact on Students / Advisory *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Water supply will be paused from 10 AM to 1 PM. Alternate tanks available."
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  className="w-full p-2.5 bg-amber-50/50 border border-amber-200 rounded-xl font-medium text-amber-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Schedule & Notify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Maintenance Schedule */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-sm">Edit Maintenance Schedule</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {typesList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Building</label>
                  <input
                    type="text"
                    value={editingItem.building}
                    onChange={(e) => setEditingItem({ ...editingItem, building: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room / Area</label>
                  <input
                    type="text"
                    value={editingItem.roomArea}
                    onChange={(e) => setEditingItem({ ...editingItem, roomArea: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expected Impact</label>
                <textarea
                  rows={2}
                  value={editingItem.expectedImpact}
                  onChange={(e) => setEditingItem({ ...editingItem, expectedImpact: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaintenanceScheduleView;
