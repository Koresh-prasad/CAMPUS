'use client';

import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface GatePassHelpdeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GatePassHelpdeskModal({
  isOpen,
  onClose,
  onSuccess,
}: GatePassHelpdeskModalProps) {
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [roomNumber, setRoomNumber] = useState('A-204');
  const [blockName, setBlockName] = useState('Nilgiri (Block A)');
  const [passType, setPassType] = useState('DAY_OUTING');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [validTillHours, setValidTillHours] = useState('4');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) {
      alert('Destination and Reason are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/passes/helpdesk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rollNo: rollNo.trim() || 'REC-CS-042',
          studentName: studentName.trim() || 'Student Resident',
          roomNumber,
          blockName,
          passType,
          destination: destination.trim(),
          reason: reason.trim(),
          validTillHours: Number(validTillHours),
          notes,
        }),
      });

      if (res.ok) {
        alert('Gate Pass created and approved successfully via Helpdesk Mode!');
        onSuccess();
        onClose();
      } else {
        alert('Failed to create pass via helpdesk. Please check inputs.');
      }
    } catch (err) {
      console.error('Helpdesk pass creation error:', err);
      alert('Network error connecting to gate pass desk.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight">Helpdesk On-Behalf Pass Issuance</h3>
              <p className="text-[11px] text-blue-100">Create &amp; immediately approve a gate pass for a student</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student Roll Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2101289001"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Kumar"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hostel Block</label>
              <select
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Nilgiri (Block A)">Nilgiri (Block A)</option>
                <option value="Shivalik (Block B)">Shivalik (Block B)</option>
                <option value="Dhaulagiri (Block C)">Dhaulagiri (Block C)</option>
                <option value="Aravali (Girls Block)">Aravali (Girls Block)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Room Number</label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pass Category *</label>
              <select
                value={passType}
                onChange={(e) => setPassType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="DAY_OUTING">Day Outing (Curfew 21:30)</option>
                <option value="NIGHT_OUT">Night Out (Guardian Verified)</option>
                <option value="WEEKEND">Weekend Pass (48 Hours)</option>
                <option value="HOME_LEAVE">Home Leave (Multi-Day)</option>
                <option value="MEDICAL_LEAVE">Medical / Doctor Visit</option>
                <option value="EMERGENCY_LEAVE">Emergency Pass</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Valid Duration (Hours)</label>
              <select
                value={validTillHours}
                onChange={(e) => setValidTillHours(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="2">2 Hours Outing</option>
                <option value="4">4 Hours Outing</option>
                <option value="6">6 Hours Outing</option>
                <option value="12">12 Hours (Night Out)</option>
                <option value="48">48 Hours (Weekend)</option>
                <option value="120">5 Days (Home Leave)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Destination Address / Place *</label>
            <input
              type="text"
              required
              placeholder="e.g. Apollo Hospital, Cuttack Road / Master Canteen Market"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Purpose / Reason *</label>
            <input
              type="text"
              required
              placeholder="e.g. Medical checkup / Family visit / Book purchase"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Administrative Notes (Audit Log)</label>
            <input
              type="text"
              placeholder="e.g. Issued on verbal request by Dean / Parent called warden"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer shadow-md flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Generating...' : 'Issue & Approve Pass'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
