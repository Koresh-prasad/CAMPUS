'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Building,
  Stethoscope,
  Briefcase,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Share2,
  Send,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentLeaveApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: any;
  lang: StudentLang;
  onSuccess: () => void;
}

export default function StudentLeaveApplyModal({
  isOpen,
  onClose,
  studentProfile,
  lang,
  onSuccess,
}: StudentLeaveApplyModalProps) {
  const t = passI18n[lang] || passI18n.EN;

  const [leaveCategory, setLeaveCategory] = useState<'HOME' | 'MEDICAL' | 'ACADEMIC' | 'PERSONAL' | 'EVENT'>('HOME');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isVacatingRoom, setIsVacatingRoom] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0];
    setFromDate(today);
    setToDate(nextWeek);

    if (studentProfile?.address) {
      setDestination(studentProfile.address);
    } else {
      setDestination('Home Town Address');
    }
  }, [studentProfile]);

  if (!isOpen) return null;

  // Calculate day count
  const dayCount = (() => {
    if (!fromDate || !toDate) return 1;
    const diff = (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24);
    return Math.max(1, Math.ceil(diff));
  })();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachments([...attachments, { name: file.name, data: base64, size: file.size }]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) {
      alert('Destination and reason are mandatory.');
      return;
    }

    setSubmitting(true);
    const clientRequestId = `LEAVE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const passTypeMap: Record<string, string> = {
      HOME: 'HOME_LEAVE',
      MEDICAL: 'MEDICAL_LEAVE',
      ACADEMIC: 'ACADEMIC_LEAVE',
      PERSONAL: 'HOME_LEAVE',
      EVENT: 'ACADEMIC_LEAVE',
    };

    const payload = {
      clientRequestId,
      passType: passTypeMap[leaveCategory] || 'HOME_LEAVE',
      leaveCategory,
      destination: destination.trim(),
      reason: `${reason.trim()}${isVacatingRoom ? ' [TEMPORARY ROOM VACATION REQUESTED]' : ''}`,
      studentName: studentProfile?.name || 'Student Resident',
      roomNumber: studentProfile?.roomNumber || 'A-204',
      blockName: studentProfile?.blockName || 'Nilgiri (Block A)',
      validFrom: new Date(`${fromDate}T08:00:00`).toISOString(),
      validTill: new Date(`${toDate}T20:00:00`).toISOString(),
      attachments,
    };

    try {
      const res = await fetch('/api/passes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Hostel multi-day leave application submitted successfully!');
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit leave');
      }
    } catch {
      alert('Network error connecting to hostel office.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">{t.applyLeave}</h3>
              <p className="text-xs text-slate-400">Multi-Day Hostel Leave & Attendance Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Academic Attendance Benefit Banner */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <Share2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">ERP Academic Attendance Benefit:</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Approved medical and academic duty leaves automatically sync with your academic department timetable for attendance waiver.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Category Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Leave Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLeaveCategory('HOME')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  leaveCategory === 'HOME'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" /> Home Visit
              </button>

              <button
                type="button"
                onClick={() => setLeaveCategory('MEDICAL')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  leaveCategory === 'MEDICAL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> Medical
              </button>

              <button
                type="button"
                onClick={() => setLeaveCategory('ACADEMIC')}
                className={`py-2 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  leaveCategory === 'ACADEMIC'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Academic
              </button>
            </div>
          </div>

          {/* Date Range & Duration Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">From Date</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">To Date</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-slate-600">
            <span>Total Duration Requested:</span>
            <span className="font-bold text-indigo-700 font-mono text-sm">
              {dayCount} {dayCount === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Destination */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Destination Address / Home Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Full address where student will be residing during leave..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Detailed Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State clear reasons (e.g. Attending sibling wedding, doctor recommended rest)..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Medical Certificate / Document Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Attach Certificate / Invitation / Train Ticket
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {attachments.length > 0 && (
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                ✓ Document attached ({attachments[0].name})
              </div>
            )}
          </div>

          {/* Room Vacate Toggle */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-bold text-slate-800">Temporary Room Vacation</span>
                <p className="text-[11px] text-slate-400">Check if leaving for more than 15 days or semester break</p>
              </div>
              <input
                type="checkbox"
                checked={isVacatingRoom}
                onChange={(e) => setIsVacatingRoom(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Apply Hostel Leave'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
