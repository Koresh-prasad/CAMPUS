'use client';

import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  MessageSquare,
  Wrench,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Paperclip,
  Check,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export interface ServiceDetailItem {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentId: string;
  studentRoll?: string;
  studentPhone?: string;
  studentEmail?: string;
  hostel: string;
  block?: string;
  room: string;
  category: 'Electricity' | 'Plumbing' | 'Cleaning' | 'Wi-Fi / Internet' | 'Furniture' | 'Room Repair' | 'Other Maintenance';
  description: string;
  photoUrl?: string | null;
  videoUrl?: string | null;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTeam: 'Electrical Team' | 'Plumbing Team' | 'Cleaning Team' | 'IT / Network Team' | 'Maintenance Team' | 'Unassigned';
  assignedStaff: string;
  createdTime: string;
  slaHours: number; // e.g. 2 for electricity, 1 for plumbing, 4 for wifi, etc.
  slaDeadline: string;
  slaStatus: 'ON_TRACK' | 'APPROACHING' | 'BREACHED';
  slaMinutesRemaining: number;
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  timeline: {
    status: string;
    timestamp: string;
    note: string;
    actor: string;
  }[];
  internalNotes: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
}

interface ComplaintServiceDetailModalProps {
  item: ServiceDetailItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: ServiceDetailItem['status'], note?: string) => void;
  onAssignStaff: (id: string, team: ServiceDetailItem['assignedTeam'], staffName: string) => void;
  onChangePriority: (id: string, priority: ServiceDetailItem['priority']) => void;
  onAddNote: (id: string, noteText: string) => void;
}

export function ComplaintServiceDetailModal({
  item,
  onClose,
  onUpdateStatus,
  onAssignStaff,
  onChangePriority,
  onAddNote,
}: ComplaintServiceDetailModalProps) {
  if (!item) return null;

  const [noteInput, setNoteInput] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<ServiceDetailItem['assignedTeam']>(item.assignedTeam);
  const [selectedStaff, setSelectedStaff] = useState(item.assignedStaff);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const teamStaffDirectory: Record<string, string[]> = {
    'Electrical Team': ['Er. Dilip Das (Lead Electrician)', 'Rakesh Rout (Wireman)', 'Debasish Swain (Substation)'],
    'Plumbing Team': ['Mahendra Singh (Lead Plumber)', 'Pabitra Nayak (Pipe Fitter)', 'S. Jena (Pump Operator)'],
    'Cleaning Team': ['Sita Majhi (Lead Housekeeping)', 'Ramesh Naik (Floor Incharge)', 'Babuli Muduli (Sanitation)'],
    'IT / Network Team': ['Suresh Kumar (Network Admin)', 'Amit Mohanty (Wi-Fi Tech)', 'Priya Das (System Support)'],
    'Maintenance Team': ['Baidhar Rout (Carpenter)', 'Santosh Kumar (Mason)', 'Bishnu Charan (Fabricator)'],
    'Unassigned': ['Auto-assign next available'],
  };

  const handleSaveAssignment = () => {
    onAssignStaff(item.id, selectedTeam, selectedStaff || 'Assigned Specialist');
    setShowAssignDropdown(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote(item.id, noteInput.trim());
    setNoteInput('');
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'EMERGENCY':
        return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/30';
    }
  };

  const getSlaBadge = () => {
    if (item.status === 'RESOLVED' || item.status === 'CLOSED') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
          ✓ Resolved Within SLA
        </span>
      );
    }
    if (item.slaStatus === 'BREACHED') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold border border-red-300 animate-pulse">
          ⚠️ SLA Breached (+{Math.abs(item.slaMinutesRemaining)}m overdue)
        </span>
      );
    }
    if (item.slaStatus === 'APPROACHING') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-300">
          ⏳ SLA Approaching ({item.slaMinutesRemaining}m left)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
        ⏱️ On Track ({item.slaMinutesRemaining}m left)
      </span>
    );
  };

  const timelineSteps = [
    { key: 'NEW', label: 'Submitted' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_PROGRESS', label: 'Work Started' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.key === item.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center font-black">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-black text-sky-400 uppercase tracking-wider">
                  {item.ticketNumber}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
                {getSlaBadge()}
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                {item.category}: {item.description.slice(0, 50)}...
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 1. Workflow Timeline Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">
              Request Progression Timeline
            </p>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
              <div
                className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-blue-600 -z-0 transition-all duration-300"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (timelineSteps.length - 1)) * 95}%`,
                }}
              />

              {timelineSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition shadow-xs ${
                        isPassed
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1.5 font-bold ${
                        isCurrent
                          ? 'text-blue-700'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Grid Details: Student Info & Problem Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Student Details
                </span>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {item.studentId}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-black text-sm flex items-center justify-center">
                  {item.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.studentName}</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {item.studentRoll || 'REC-2023-CS042'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Hostel & Room</span>
                  <strong className="text-slate-800">{item.hostel} • Room {item.room}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Contact Phone</span>
                  <a
                    href={`tel:${item.studentPhone || '+91 98765 43210'}`}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {item.studentPhone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <a
                  href={`tel:${item.studentPhone || '+91 98765 43210'}`}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Student</span>
                </a>
                <a
                  href={`https://wa.me/${(item.studentPhone || '919876543210').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Message</span>
                </a>
              </div>
            </div>

            {/* SLA & Assignment Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  SLA Target & Team Routing
                </span>
                <span className="text-xs font-bold text-slate-700">
                  Target SLA: {item.slaHours} Hours
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reported Time:</span>
                  <span className="font-bold text-slate-800">{item.createdTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Resolution Deadline:</span>
                  <span className="font-bold text-slate-800">{item.slaDeadline}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Current SLA Status:</span>
                  {getSlaBadge()}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-600">Assigned Team & Technician:</span>
                  <button
                    onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                    className="text-xs text-blue-600 font-extrabold hover:underline cursor-pointer"
                  >
                    {showAssignDropdown ? 'Cancel Reassign' : 'Reassign / Change Staff'}
                  </button>
                </div>

                {!showAssignDropdown ? (
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-blue-950 block">{item.assignedTeam}</strong>
                      <span className="text-[11px] text-blue-700 font-medium">{item.assignedStaff}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
                      {item.status}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-2 animate-in fade-in">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Department</label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => {
                          const t = e.target.value as any;
                          setSelectedTeam(t);
                          setSelectedStaff(teamStaffDirectory[t]?.[0] || 'Technician');
                        }}
                        className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        {Object.keys(teamStaffDirectory).map((team) => (
                          <option key={team} value={team}>{team}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Specialist Staff</label>
                      <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        className="w-full text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        {(teamStaffDirectory[selectedTeam] || []).map((staff) => (
                          <option key={staff} value={staff}>{staff}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAssignment}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Problem Description & Attachment */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Problem Description & Evidence
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-500 font-medium">Priority:</span>
                <select
                  value={item.priority}
                  onChange={(e) => onChangePriority(item.id, e.target.value as any)}
                  className="text-xs font-bold px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="EMERGENCY">EMERGENCY</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
              {item.description}
            </p>

            {item.photoUrl ? (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center space-x-1">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <span>Attached Photo Evidence (from student submission)</span>
                </p>
                <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group cursor-pointer">
                  <img
                    src={item.photoUrl}
                    alt="Problem attachment"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onClick={() => setShowPhotoPreview(true)}
                  />
                  <div
                    onClick={() => setShowPhotoPreview(true)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    Click to enlarge
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">No image attachment uploaded with this request.</p>
            )}
          </div>

          {/* 4. Internal Admin Notes & Activity Log */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Internal Admin Notes ({item.internalNotes?.length || 0})
            </span>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {(!item.internalNotes || item.internalNotes.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No internal notes added yet.</p>
              ) : (
                item.internalNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <strong className="text-slate-700">{note.author}</strong>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mt-1">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddNoteSubmit} className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                placeholder="Add internal note for staff/warden..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!noteInput.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer: Action Workflow Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Current Status: <strong className="text-slate-900">{item.status}</strong>
          </div>

          <div className="flex items-center space-x-2">
            {item.status === 'NEW' && (
              <button
                onClick={() => onUpdateStatus(item.id, 'ASSIGNED', 'Staff dispatched to site')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                Mark as ASSIGNED →
              </button>
            )}

            {item.status === 'ASSIGNED' && (
              <button
                onClick={() => onUpdateStatus(item.id, 'IN_PROGRESS', 'Technician on-site inspecting')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                Mark as IN PROGRESS →
              </button>
            )}

            {item.status === 'IN_PROGRESS' && (
              <button
                onClick={() => onUpdateStatus(item.id, 'RESOLVED', 'Physical repair finished successfully')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                Mark as RESOLVED ✓
              </button>
            )}

            {item.status === 'RESOLVED' && (
              <button
                onClick={() => onUpdateStatus(item.id, 'CLOSED', 'Case verified and closed by admin')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
              >
                Close Ticket Completely
              </button>
            )}

            {item.status !== 'CLOSED' && item.status !== 'RESOLVED' && (
              <button
                onClick={() => onUpdateStatus(item.id, 'RESOLVED', 'Expedited resolution confirmed')}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Quick Resolve
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {showPhotoPreview && item.photoUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowPhotoPreview(false)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-black rounded-2xl overflow-hidden p-2">
            <img src={item.photoUrl} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg" />
            <p className="text-center text-xs text-white/80 mt-2 font-mono">{item.ticketNumber} Attachment</p>
          </div>
        </div>
      )}
    </div>
  );
}
