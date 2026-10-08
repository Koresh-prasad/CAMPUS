'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Calendar,
  Clock,
  Compass,
  Phone,
  Paperclip,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Save,
  Send,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentGatePassApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: any;
  passesRemaining: number;
  curfewTime: string;
  lang: StudentLang;
  onSuccess: () => void;
}

export default function StudentGatePassApplyModal({
  isOpen,
  onClose,
  studentProfile,
  passesRemaining,
  curfewTime,
  lang,
  onSuccess,
}: StudentGatePassApplyModalProps) {
  const t = passI18n[lang] || passI18n.EN;

  const [passType, setPassType] = useState('DAY_OUTING');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [outDate, setOutDate] = useState('');
  const [outTime, setOutTime] = useState('16:00');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('20:30');
  const [isEmergency, setIsEmergency] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ruleWarning, setRuleWarning] = useState<string | null>(null);

  // Initialize dates and autofill profile data
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setOutDate(today);
    setReturnDate(today);

    if (studentProfile) {
      setStudentContact(studentProfile.phone || '+91 98765 43210');
      setGuardianPhone(studentProfile.parentPhone || studentProfile.fatherPhone || '+91 94370 11223');
    }

    // Load saved draft if present
    const draft = localStorage.getItem('shms_gatepass_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.destination) setDestination(parsed.destination);
        if (parsed.reason) setReason(parsed.reason);
        if (parsed.passType) setPassType(parsed.passType);
      } catch (_) {}
    }
  }, [studentProfile]);

  // Live rule checking
  useEffect(() => {
    let warning: string | null = null;
    if (returnTime > (curfewTime || '21:30') && passType === 'DAY_OUTING') {
      warning = `Expected return time (${returnTime}) is after hostel curfew (${curfewTime || '21:30'}). A Night Out or Leave pass is required.`;
    }
    if (passesRemaining <= 0 && !isEmergency) {
      warning = 'Monthly pass quota has been reached. This request will require special Warden waiver.';
    }
    setRuleWarning(warning);
  }, [returnTime, curfewTime, passType, passesRemaining, isEmergency]);

  if (!isOpen) return null;

  // Compress and attach file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachments([...attachments, { name: file.name, data: base64, size: file.size }]);
      setUploadingDoc(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'shms_gatepass_draft',
      JSON.stringify({ passType, destination, reason, outTime, returnTime })
    );
    alert('Draft saved locally on this device!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !reason.trim()) {
      alert('Destination and Reason are required.');
      return;
    }

    setSubmitting(true);
    const clientRequestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const payload = {
      clientRequestId,
      passType: isEmergency ? 'EMERGENCY_LEAVE' : passType,
      destination: destination.trim(),
      reason: reason.trim(),
      guardianPhone,
      studentName: studentProfile?.name || 'Student Resident',
      roomNumber: studentProfile?.roomNumber || 'A-204',
      blockName: studentProfile?.blockName || 'Nilgiri (Block A)',
      validFrom: new Date(`${outDate}T${outTime}:00`).toISOString(),
      validTill: new Date(`${returnDate}T${returnTime}:00`).toISOString(),
      isEmergency,
      attachments,
    };

    try {
      // Check if online or offline
      if (!navigator.onLine) {
        // Enqueue offline request into localStorage
        const queue = JSON.parse(localStorage.getItem('shms_pending_pass_queue') || '[]');
        queue.push(payload);
        localStorage.setItem('shms_pending_pass_queue', JSON.stringify(queue));
        localStorage.removeItem('shms_gatepass_draft');
        alert('Offline: Your request is saved in the device queue and will be submitted automatically once network returns!');
        onSuccess();
        onClose();
        return;
      }

      const res = await fetch('/api/passes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.removeItem('shms_gatepass_draft');
        alert('Gate Pass submitted to Hostel Warden desk successfully!');
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit gate pass request');
      }
    } catch (err) {
      // Network drop: store in offline queue
      const queue = JSON.parse(localStorage.getItem('shms_pending_pass_queue') || '[]');
      queue.push(payload);
      localStorage.setItem('shms_pending_pass_queue', JSON.stringify(queue));
      alert('Network error: Request safely stored in device offline queue!');
      onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">{t.applyGatePass}</h3>
              <p className="text-xs text-slate-400">Turnstile Outing Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Banner if rules violated */}
        {ruleWarning && (
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pass Rule Notice:</p>
              <p className="text-[11px] text-amber-800 mt-0.5">{ruleWarning}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Pass Type Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pass Type</label>
            <select
              value={passType}
              onChange={(e) => setPassType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800"
            >
              <option value="DAY_OUTING">Day Outing (Under 6 hours)</option>
              <option value="NIGHT_OUT">Night Out (Return next morning)</option>
              <option value="WEEKEND">Weekend Outing (Max 2 days)</option>
              <option value="HOME_LEAVE">Home Visit (Parental consent required)</option>
              <option value="MEDICAL">Medical Visit / Hospital</option>
              <option value="ACADEMIC">Academic / Coaching Visit</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Destination Place <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Canteen Bookstore, Sector 18"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Purpose / Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="Reason for outing..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Out & Return Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Out Date & Time</label>
              <div className="space-y-1">
                <input
                  type="date"
                  value={outDate}
                  onChange={(e) => setOutDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                <input
                  type="time"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Return Date & Time</label>
              <div className="space-y-1">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Auto-filled Guardian Contact */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Guardian Phone (Auto-filled):
              </span>
              <span className="font-mono font-bold text-slate-800">{guardianPhone}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              SMS notification and consent confirmation will be requested automatically upon departure.
            </p>
          </div>

          {/* Document Upload */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Attach Supporting Proof (Optional)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {attachments.length > 0 && (
              <div className="mt-1.5 text-[11px] text-emerald-600 font-medium">
                ✓ {attachments.length} document attached
              </div>
            )}
          </div>

          {/* Emergency Priority Flag */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Mark as Emergency Priority
              </span>
            </label>
            <span className="text-[10px] text-slate-400">Escalates directly to Chief Warden</span>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>

            <div className="flex items-center gap-2">
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
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit to Warden'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
