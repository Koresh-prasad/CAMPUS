'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Check,
  X,
  RefreshCw,
  Building,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export type CleaningCategory = 'HOSTEL_ROOM' | 'COMMON_AREA' | 'WASHROOM' | 'WASTE_MGMT';
export type CleaningStatus = 'SCHEDULED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CleaningTask {
  id: string;
  location: string;
  block: string;
  floor: string;
  category: CleaningCategory;
  assignedStaff: string;
  staffPhone: string;
  scheduledTime: string;
  frequency: string;
  status: CleaningStatus;
  checklist: { item: string; done: boolean }[];
  lastInspectedBy?: string;
  rating?: number;
  notes?: string;
}

const INITIAL_CLEANING_TASKS: CleaningTask[] = [
  {
    id: 'CLN-101',
    location: 'Hostel Block A - Floors 1 & 2',
    block: 'Block A',
    floor: 'Floor 1-2',
    category: 'COMMON_AREA',
    assignedStaff: 'Ramesh Kumar',
    staffPhone: '+91 98765-43210',
    scheduledTime: 'Today, 08:00 AM',
    frequency: 'Daily (Morning)',
    status: 'COMPLETED',
    checklist: [
      { item: 'Corridors swept & mopped', done: true },
      { item: 'Stairwell handrails disinfected', done: true },
      { item: 'Floor dustbins emptied', done: true }
    ],
    lastInspectedBy: 'Chief Warden Sharma',
    rating: 5,
    notes: 'Completed ahead of schedule, floor sanitizer replenished.'
  },
  {
    id: 'CLN-102',
    location: 'Hostel Block B - Washrooms Wing 1-4',
    block: 'Block B',
    floor: 'All Floors',
    category: 'WASHROOM',
    assignedStaff: 'Sunita Devi & Team',
    staffPhone: '+91 98765-43211',
    scheduledTime: 'Today, 10:30 AM',
    frequency: 'Twice Daily',
    status: 'IN_PROGRESS',
    checklist: [
      { item: 'Tiles deep chemical scrub', done: true },
      { item: 'Mirror & taps cleaned', done: true },
      { item: 'Soap dispensers refilled', done: false },
      { item: 'Deodorizer sprays installed', done: false }
    ],
    notes: 'Soap refill in progress on 3rd floor.'
  },
  {
    id: 'CLN-103',
    location: 'Central Campus Waste Segregation Yard',
    block: 'Campus Grounds',
    floor: 'Ground',
    category: 'WASTE_MGMT',
    assignedStaff: 'EcoWaste Municipal Contractor',
    staffPhone: '+91 98765-43212',
    scheduledTime: 'Today, 02:00 PM',
    frequency: 'Daily (Afternoon)',
    status: 'ASSIGNED',
    checklist: [
      { item: 'Dry & wet waste compaction', done: false },
      { item: 'Municipal truck clearance', done: false },
      { item: 'Disinfectant lime powder spray', done: false }
    ],
    notes: 'Municipal compactor truck scheduled arrival 02:15 PM.'
  },
  {
    id: 'CLN-104',
    location: 'Hostel Block C - Room 301 to 310 Deep Clean',
    block: 'Block C',
    floor: 'Floor 3',
    category: 'HOSTEL_ROOM',
    assignedStaff: 'Manoj Paswan',
    staffPhone: '+91 98765-43213',
    scheduledTime: 'Tomorrow, 09:00 AM',
    frequency: 'On-Demand / Weekly',
    status: 'SCHEDULED',
    checklist: [
      { item: 'Ceiling cobweb dusting', done: false },
      { item: 'Window glass polishing', done: false },
      { item: 'Under-bed floor disinfectant', done: false }
    ],
    notes: 'Room vacancy cleaning before new resident allocation.'
  },
  {
    id: 'CLN-105',
    location: 'Hostel Block A - Washroom Wing 3 & 4',
    block: 'Block A',
    floor: 'Floor 3-4',
    category: 'WASHROOM',
    assignedStaff: 'Kamla Bai',
    staffPhone: '+91 98765-43214',
    scheduledTime: 'Today, 04:00 PM',
    frequency: 'Twice Daily',
    status: 'SCHEDULED',
    checklist: [
      { item: 'Chemical disinfectant applied', done: false },
      { item: 'Plumbing drainage flushed', done: false },
      { item: 'Sanitizer refills', done: false }
    ]
  }
];

export function CleaningServicesView() {
  const [tasks, setTasks] = useState<CleaningTask[]>(INITIAL_CLEANING_TASKS);
  const [activeTab, setActiveTab] = useState<'ALL' | CleaningCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CleaningTask | null>(null);

  // New task form state
  const [newTaskLocation, setNewTaskLocation] = useState('');
  const [newTaskBlock, setNewTaskBlock] = useState('Block A');
  const [newTaskFloor, setNewTaskFloor] = useState('Floor 1');
  const [newTaskCategory, setNewTaskCategory] = useState<CleaningCategory>('COMMON_AREA');
  const [newTaskStaff, setNewTaskStaff] = useState('Ramesh Kumar');
  const [newTaskPhone, setNewTaskPhone] = useState('+91 98765-43210');
  const [newTaskTime, setNewTaskTime] = useState('Today, 03:00 PM');
  const [newTaskFrequency, setNewTaskFrequency] = useState('Daily (Morning)');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesTab = activeTab === 'ALL' || t.category === activeTab;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedStaff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.block.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const advanceStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        let nextStatus: CleaningStatus = t.status;
        if (t.status === 'SCHEDULED') nextStatus = 'ASSIGNED';
        else if (t.status === 'ASSIGNED') nextStatus = 'IN_PROGRESS';
        else if (t.status === 'IN_PROGRESS') {
          nextStatus = 'COMPLETED';
          // Mark all checklist items done
          return {
            ...t,
            status: nextStatus,
            checklist: t.checklist.map((c) => ({ ...c, done: true })),
            lastInspectedBy: 'Admin Operations'
          };
        }
        return { ...t, status: nextStatus };
      })
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLocation) return;
    const newTask: CleaningTask = {
      id: `CLN-${Math.floor(100 + Math.random() * 900)}`,
      location: newTaskLocation,
      block: newTaskBlock,
      floor: newTaskFloor,
      category: newTaskCategory,
      assignedStaff: newTaskStaff,
      staffPhone: newTaskPhone,
      scheduledTime: newTaskTime,
      frequency: newTaskFrequency,
      status: 'SCHEDULED',
      checklist: [
        { item: 'Sanitation inspection', done: false },
        { item: 'Chemical wash & wipe', done: false },
        { item: 'Waste disposal', done: false }
      ],
      notes: newTaskNotes
    };
    setTasks([newTask, ...tasks]);
    setIsAddModalOpen(false);
    setNewTaskLocation('');
    setNewTaskNotes('');
  };

  const toggleChecklistItem = (taskId: string, index: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newChecklist = [...t.checklist];
        newChecklist[index].done = !newChecklist[index].done;
        return { ...t, checklist: newChecklist };
      })
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => {
        if (!prev) return null;
        const newChecklist = [...prev.checklist];
        newChecklist[index].done = !newChecklist[index].done;
        return { ...prev, checklist: newChecklist };
      });
    }
  };

  const totalSchedules = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completedToday = tasks.filter((t) => t.status === 'COMPLETED').length;
  const wasteTasks = tasks.filter((t) => t.category === 'WASTE_MGMT').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Facilities & Hygiene Management</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cleaning & Sanitation Services</h2>
          <p className="text-slate-400 text-sm mt-1">
            Hostel housekeeping, washroom hygiene schedules, room cleaning, and campus waste management.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/30 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Cleaning</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium">Total Schedules</p>
            <p className="text-2xl font-black text-white mt-1">{totalSchedules}</p>
            <span className="text-[11px] text-slate-400">All campus blocks</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl text-slate-300">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-medium">In Progress</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{inProgressCount}</p>
            <span className="text-[11px] text-amber-500/70">Sweepers active</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-medium">Completed Today</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{completedToday}</p>
            <span className="text-[11px] text-emerald-500/70">Verified sanitized</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-xs font-medium">Waste Clearance</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{wasteTasks}</p>
            <span className="text-[11px] text-blue-500/70">Compactor & yard</span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Trash2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Operations' },
            { id: 'HOSTEL_ROOM', label: 'Hostel Rooms' },
            { id: 'WASHROOM', label: 'Washroom Sanitation' },
            { id: 'COMMON_AREA', label: 'Common Areas' },
            { id: 'WASTE_MGMT', label: 'Waste Management' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search area, staff..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          const isInProgress = task.status === 'IN_PROGRESS';
          const isAssigned = task.status === 'ASSIGNED';

          const statusColor = isDone
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : isInProgress
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
            : isAssigned
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {task.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{task.location}</h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    {task.block} • {task.floor}
                  </span>
                </p>

                {/* Staff & Timing */}
                <div className="mt-3.5 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">Staff / Crew:</span>
                    <span className="font-semibold">{task.assignedStaff}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">Schedule:</span>
                    <span className="font-medium text-slate-300">{task.scheduledTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 text-[11px]">Frequency:</span>
                    <span className="text-emerald-400 font-medium">{task.frequency}</span>
                  </div>
                </div>

                {/* Hygiene Checklist Summary */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-400 mb-1.5">Hygiene Checklist</p>
                  <div className="space-y-1">
                    {task.checklist.map((chk, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistItem(task.id, idx)}
                        className="flex items-center space-x-2 text-[11px] cursor-pointer hover:bg-slate-800/50 p-1 rounded transition"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            chk.done
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {chk.done && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className={chk.done ? 'text-slate-300 line-through' : 'text-slate-300'}>
                          {chk.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {task.notes && (
                  <p className="mt-3 text-[11px] text-slate-400 bg-slate-800/30 p-2 rounded-lg italic">
                    "{task.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  View Details
                </button>

                {!isDone ? (
                  <button
                    onClick={() => advanceStatus(task.id)}
                    className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-emerald-600/20"
                  >
                    <span>
                      {task.status === 'SCHEDULED'
                        ? 'Assign Staff'
                        : task.status === 'ASSIGNED'
                        ? 'Start Task'
                        : 'Mark Done'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Cleaning Tasks Found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your category filter or search query.</p>
        </div>
      )}

      {/* Schedule Cleaning Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Schedule Cleaning Task</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location / Target Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hostel Block B - 3rd Floor Washroom & Corridor"
                  value={newTaskLocation}
                  onChange={(e) => setNewTaskLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Block / Building</label>
                  <select
                    value={newTaskBlock}
                    onChange={(e) => setNewTaskBlock(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Block A">Hostel Block A</option>
                    <option value="Block B">Hostel Block B</option>
                    <option value="Block C">Hostel Block C</option>
                    <option value="Campus Grounds">Campus Grounds</option>
                    <option value="Mess Hall">Mess Complex</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="COMMON_AREA">Common Area</option>
                    <option value="WASHROOM">Washroom Cleaning</option>
                    <option value="HOSTEL_ROOM">Hostel Room</option>
                    <option value="WASTE_MGMT">Waste Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Staff / Crew</label>
                  <input
                    type="text"
                    value={newTaskStaff}
                    onChange={(e) => setNewTaskStaff(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Frequency</label>
                <select
                  value={newTaskFrequency}
                  onChange={(e) => setNewTaskFrequency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Daily (Morning)">Daily (Morning)</option>
                  <option value="Daily (Afternoon)">Daily (Afternoon)</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Weekly Deep Clean">Weekly Deep Clean</option>
                  <option value="On-Demand">On-Demand</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Special instructions, chemicals to use, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Drawer/Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Hygiene Task Audit: {selectedTask.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-800">
                <p className="text-white font-bold text-sm">{selectedTask.location}</p>
                <p className="text-slate-400">
                  {selectedTask.block} • {selectedTask.floor} • {selectedTask.frequency}
                </p>
                <p className="text-slate-300">
                  Assigned Staff: <span className="font-semibold text-white">{selectedTask.assignedStaff}</span> ({selectedTask.staffPhone})
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-300 mb-2">Checklist & Inspection Logs:</p>
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedTask.checklist.map((chk, i) => (
                    <div
                      key={i}
                      onClick={() => toggleChecklistItem(selectedTask.id, i)}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-slate-800/50 p-1.5 rounded transition"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          chk.done
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {chk.done && <Check className="w-3 h-3" />}
                      </div>
                      <span className={chk.done ? 'text-slate-200 line-through' : 'text-slate-300'}>
                        {chk.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTask.lastInspectedBy && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-center justify-between">
                  <span>Inspected & Approved by: {selectedTask.lastInspectedBy}</span>
                  <span className="font-bold">⭐ {selectedTask.rating || 5}/5</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
