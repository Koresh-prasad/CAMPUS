'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  User,
  Building,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Shield,
  HeartPulse,
  Wrench,
  Camera,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Check,
  X,
  FileText,
  Save,
} from 'lucide-react';

export type TaskTeam =
  | 'Service Team'
  | 'Maintenance Team'
  | 'Warden'
  | 'Security'
  | 'Medical Staff';

export type TaskStatus =
  | 'New'
  | 'Accepted'
  | 'In Progress'
  | 'On Hold'
  | 'Completed'
  | 'Rejected'
  | 'Reassigned'
  | 'Overdue';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface AssignedTask {
  id: string;
  taskId: string;
  title: string;
  category: string;
  team: TaskTeam;
  description: string;
  location: string;
  priority: TaskPriority;
  assignedBy: string;
  assignedStaff: string;
  assignedDate: string;
  dueDate: string;
  status: TaskStatus;
  remarks?: string;
  proofPhotoUrl?: string;
}

export const INITIAL_ASSIGNED_TASKS: AssignedTask[] = [
  {
    id: 'tsk-1',
    taskId: 'TSK-2026-401',
    title: 'Repair Main Bathroom Water Pressure Booster Pump in Block A',
    category: 'Plumbing / Pressure',
    team: 'Service Team',
    description: 'Ground floor secondary impeller cavitation detected; replace gasket seal.',
    location: 'Nilgiri Block A Pump Room',
    priority: 'HIGH',
    assignedBy: 'Admin Manager (Subham Pradhan)',
    assignedStaff: 'Mahendra Singh (Lead Plumber)',
    assignedDate: '08 Oct 2026, 09:00 AM',
    dueDate: 'Today, 02:00 PM',
    status: 'In Progress',
    remarks: 'Disassembled pump casing. Gasket replacement underway.',
  },
  {
    id: 'tsk-2',
    taskId: 'TSK-2026-402',
    title: 'Night Curfew Biometric Verification & Floor Attendance Cross-Check',
    category: 'Hostel Discipline',
    team: 'Warden',
    description: 'Verify 420 resident sign-ins and investigate 3 missing students before 10 PM.',
    location: 'Shivalik Block B Floors 1-4',
    priority: 'HIGH',
    assignedBy: 'Chief Warden Office',
    assignedStaff: 'Dr. Smita Pattnaik (Warden)',
    assignedDate: '08 Oct 2026, 06:00 PM',
    dueDate: 'Today, 10:30 PM',
    status: 'Accepted',
  },
  {
    id: 'tsk-3',
    taskId: 'TSK-2026-403',
    title: 'Guest Vehicle Parking QR Badge Verification at North Gate #1',
    category: 'Access Control',
    team: 'Security',
    description: 'Verify all visitor ID cards, vehicle boot checks, and entry registrations.',
    location: 'Main Campus North Gate',
    priority: 'MEDIUM',
    assignedBy: 'Security Supervisor (Capt. Rao)',
    assignedStaff: 'Havildar B. K. Nayak',
    assignedDate: '08 Oct 2026, 08:00 AM',
    dueDate: 'Today, 04:00 PM',
    status: 'In Progress',
  },
  {
    id: 'tsk-4',
    taskId: 'TSK-2026-404',
    title: 'Follow-up Glucose & Vitals Check for Dehydrated Student in Room 112',
    category: 'Medical Triage',
    team: 'Medical Staff',
    description: 'Student Rahul Verma treated for heat exhaustion; check blood pressure & hydration.',
    location: 'Nilgiri Block A Room 112',
    priority: 'EMERGENCY',
    assignedBy: 'Dr. S. Mohapatra (Health Centre)',
    assignedStaff: 'Nurse Rita Das',
    assignedDate: '08 Oct 2026, 10:30 AM',
    dueDate: 'Today, 11:30 AM',
    status: 'Completed',
    remarks: 'BP normal 120/80. ORS electrolyte administered. Student resting well.',
  },
  {
    id: 'tsk-5',
    taskId: 'TSK-2026-405',
    title: 'Replace Faulty 63A 4-Pole Main Switchboard Breaker',
    category: 'Electrical Maintenance',
    team: 'Maintenance Team',
    description: 'Thermal camera showed 78C hotspot on busbar connection.',
    location: 'Substation Panel B',
    priority: 'HIGH',
    assignedBy: 'Admin Manager',
    assignedStaff: 'Er. Dilip Das',
    assignedDate: '07 Oct 2026, 02:00 PM',
    dueDate: '08 Oct 2026, 09:00 AM',
    status: 'Overdue',
    remarks: 'Waiting for 63A Schneider breaker from Central Store.',
  },
  {
    id: 'tsk-6',
    taskId: 'TSK-2026-406',
    title: 'Restock First-Aid Trauma Kits across All 4 Hostel Offices',
    category: 'Medical Supplies',
    team: 'Medical Staff',
    description: 'Replenish antiseptic lotion, sterile gauze, burn spray, and thermometer.',
    location: 'Hostels A, B, C, D Wardens Desks',
    priority: 'LOW',
    assignedBy: 'Health Centre Admin',
    assignedStaff: 'Pharmacist A. Tripathy',
    assignedDate: '08 Oct 2026, 11:00 AM',
    dueDate: 'Tomorrow, 05:00 PM',
    status: 'New',
  },
];

export function AssignedTasksView() {
  const [tasks, setTasks] = useState<AssignedTask[]>(INITIAL_ASSIGNED_TASKS);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<'ALL' | TaskTeam>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTaskForAction, setActiveTaskForAction] = useState<AssignedTask | null>(null);
  const [actionRemarks, setActionRemarks] = useState('');

  // Create Task form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General Operations');
  const [newTeam, setNewTeam] = useState<TaskTeam>('Service Team');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('Nilgiri Block A');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MEDIUM');
  const [newStaff, setNewStaff] = useState('Mahendra Singh (Lead Plumber)');
  const [newDueDate, setNewDueDate] = useState('Today, 05:00 PM');

  const teams: TaskTeam[] = [
    'Service Team',
    'Maintenance Team',
    'Warden',
    'Security',
    'Medical Staff',
  ];

  const statuses: TaskStatus[] = [
    'New',
    'Accepted',
    'In Progress',
    'On Hold',
    'Completed',
    'Rejected',
    'Reassigned',
    'Overdue',
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    const newTask: AssignedTask = {
      id: `tsk-${Date.now()}`,
      taskId: `TSK-2026-${Math.floor(400 + Math.random() * 500)}`,
      title: newTitle,
      category: newCategory,
      team: newTeam,
      description: newDesc,
      location: newLocation,
      priority: newPriority,
      assignedBy: 'Admin Manager',
      assignedStaff: newStaff,
      assignedDate: 'Just now',
      dueDate: newDueDate,
      status: 'New',
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus, remarks?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              remarks: remarks ? `${t.remarks ? t.remarks + ' | ' : ''}${remarks}` : t.remarks,
            }
          : t
      )
    );
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewLocation('Nilgiri Block A');
  };

  const filteredTasks = tasks.filter((t) => {
    if (teamFilter !== 'ALL' && t.team !== teamFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.taskId.toLowerCase().includes(search.toLowerCase()) &&
      !t.assignedStaff.toLowerCase().includes(search.toLowerCase()) &&
      !t.location.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Operational Task Assignments & Staff Workflow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Central dispatch console for Service, Maintenance, Warden, Security, and Medical personnel.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tasks</p>
          <h4 className="text-xl font-black text-slate-900 mt-0.5">{tasks.length}</h4>
          <p className="text-[10px] text-blue-600 font-bold mt-0.5">Across all 5 units</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">In Progress</p>
          <h4 className="text-xl font-black text-blue-600 mt-0.5">
            {tasks.filter((t) => t.status === 'In Progress' || t.status === 'Accepted').length}
          </h4>
          <p className="text-[10px] text-blue-600 font-bold mt-0.5">Active on ground</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Emergency / Critical</p>
          <h4 className="text-xl font-black text-rose-600 mt-0.5">
            {tasks.filter((t) => t.priority === 'EMERGENCY' || t.status === 'Overdue').length}
          </h4>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Require immediate review</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Completed Today</p>
          <h4 className="text-xl font-black text-emerald-600 mt-0.5">
            {tasks.filter((t) => t.status === 'Completed').length}
          </h4>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified & signed off</p>
        </div>
      </div>

      {/* Team Tabs & Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Teams Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2.5">
          <button
            onClick={() => setTeamFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              teamFilter === 'ALL'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Teams ({tasks.length})
          </button>
          {teams.map((t) => (
            <button
              key={t}
              onClick={() => setTeamFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                teamFilter === t
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t} ({tasks.filter((tk) => tk.team === t).length})
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search task, staff, or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Priority</option>
              <option value="EMERGENCY">Emergency Only</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {filteredTasks.length} Assigned Tasks
          </span>
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3.5">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-purple-300 transition space-y-3"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                    {t.taskId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {t.team}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 font-medium text-[10px]">
                    {t.category}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      t.priority === 'EMERGENCY'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : t.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Location:</strong> {t.location}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 text-[11px] text-slate-500 pt-0.5">
                  <span>
                    Assigned Staff: <strong className="text-slate-800">{t.assignedStaff}</strong>
                  </span>
                  <span>
                    Assigned By: <strong className="text-slate-700">{t.assignedBy}</strong>
                  </span>
                  <span>
                    Due: <strong className="text-rose-600 font-mono">{t.dueDate}</strong>
                  </span>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-1.5 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    t.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : t.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : t.status === 'Overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : t.status === 'On Hold'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {t.status}
                </span>
                <span className="text-[10px] text-slate-400">Assigned: {t.assignedDate}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {t.description}
            </p>

            {t.remarks && (
              <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-[11px] text-purple-900">
                <strong>Staff Remarks:</strong> {t.remarks}
              </div>
            )}

            {/* Staff Actions Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 text-[11px] font-medium">Workflow Actions:</span>

              <div className="flex flex-wrap gap-1.5">
                {t.status === 'New' && (
                  <button
                    onClick={() => handleUpdateStatus(t.id, 'Accepted')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold cursor-pointer"
                  >
                    Accept Task
                  </button>
                )}

                {(t.status === 'Accepted' || t.status === 'New') && (
                  <button
                    onClick={() => handleUpdateStatus(t.id, 'In Progress')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-bold cursor-pointer shadow-xs"
                  >
                    Start Task
                  </button>
                )}

                {t.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'On Hold', 'Paused for spare parts')}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-[10px] font-bold cursor-pointer"
                    >
                      Pause Task
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(t.id, 'Completed', 'Work completed and verified on site')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold cursor-pointer shadow-xs"
                    >
                      Complete Task
                    </button>
                  </>
                )}

                {t.status === 'On Hold' && (
                  <button
                    onClick={() => handleUpdateStatus(t.id, 'In Progress')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold cursor-pointer shadow-xs"
                  >
                    Resume Task
                  </button>
                )}

                <button
                  onClick={() => {
                    const note = prompt('Add remarks or work log notes:');
                    if (note) handleUpdateStatus(t.id, t.status, note);
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold cursor-pointer"
                >
                  Add Remarks
                </button>

                <button
                  onClick={() => {
                    const newStaffName = prompt('Reassign task to staff member:');
                    if (newStaffName) {
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === t.id
                            ? { ...item, assignedStaff: newStaffName, status: 'Reassigned' }
                            : item
                        )
                      );
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-purple-700 text-[10px] font-bold cursor-pointer"
                >
                  Reassign
                </button>

                {t.priority !== 'EMERGENCY' && (
                  <button
                    onClick={() => {
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === t.id
                            ? { ...item, priority: 'EMERGENCY', status: 'In Progress' }
                            : item
                        )
                      );
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold cursor-pointer"
                  >
                    Escalate
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Assign New Task */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col">
            <div className="p-5 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <h3 className="font-extrabold text-sm">Assign New Staff Task</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Task Title / Brief *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect water booster pump & replace pressure gauge"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Operational Team *</label>
                  <select
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {teams.map((tm) => (
                      <option key={tm} value={tm}>
                        {tm}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Task Category</label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Staff Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff}
                    onChange={(e) => setNewStaff(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority SLA *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="LOW">Low (Within 48h)</option>
                    <option value="MEDIUM">Medium (Within 24h)</option>
                    <option value="HIGH">High (Within 6h)</option>
                    <option value="EMERGENCY">🚨 Emergency (Immediate / Within 1h)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Room / Area *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Due Deadline *</label>
                  <input
                    type="text"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail symptoms, required tools, standard safety gear, and steps..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dispatch Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedTasksView;
