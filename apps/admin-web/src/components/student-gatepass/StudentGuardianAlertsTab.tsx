'use client';

import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  Send,
  BellRing,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentGuardianAlertsTabProps {
  passes: any[];
  activePass: any | null;
  stats: any;
  studentProfile: any;
  lang: StudentLang;
  onExtendReturn: (id: string, newTime: string, reason: string) => Promise<void>;
  onLateExplanation: (id: string, note: string) => Promise<void>;
}

export default function StudentGuardianAlertsTab({
  passes,
  activePass,
  stats,
  studentProfile,
  lang,
  onExtendReturn,
  onLateExplanation,
}: StudentGuardianAlertsTabProps) {
  const t = passI18n[lang] || passI18n.EN;

  const [requestedExtensionTime, setRequestedExtensionTime] = useState('22:00');
  const [extensionReason, setExtensionReason] = useState('');
  const [lateNote, setLateNote] = useState('');
  const [submittingExtension, setSubmittingExtension] = useState(false);
  const [submittingLateNote, setSubmittingLateNote] = useState(false);

  const isOverdue = stats?.isOverdue || false;
  const overdueMinutes = stats?.overdueMinutes || 0;

  const handleExtensionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePass) {
      alert('No active out-pass found to extend.');
      return;
    }
    if (!extensionReason.trim()) {
      alert('State a reason for requesting return extension.');
      return;
    }

    setSubmittingExtension(true);
    try {
      await onExtendReturn(activePass.id, requestedExtensionTime, extensionReason.trim());
      setExtensionReason('');
      alert('Return extension request submitted to Warden Control Room!');
    } finally {
      setSubmittingExtension(false);
    }
  };

  const handleLateExplanationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePass) {
      alert('No active pass found.');
      return;
    }
    if (!lateNote.trim()) {
      alert('Type your explanation for the warden.');
      return;
    }

    setSubmittingLateNote(true);
    try {
      await onLateExplanation(activePass.id, lateNote.trim());
      setLateNote('');
      alert('Late return explanation recorded for Warden review.');
    } finally {
      setSubmittingLateNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overdue Alert Banner if student is overdue */}
      {isOverdue && (
        <div className="p-5 bg-rose-600 text-white rounded-2xl shadow-md border border-rose-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>{t.returnOverdue} (+{overdueMinutes} mins)</span>
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping"></span>
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                Hostel curfew has passed. Your location is logged, and the Warden desk has been alerted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Guardian Status & Return Extension */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guardian Confirmation Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" /> Parental / Guardian Notification Status
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Active Sync
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Registered Guardian Mobile:</span>
              <span className="font-bold font-mono text-slate-900">
                {studentProfile?.parentPhone || studentProfile?.fatherPhone || '+91 94370 11223'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Consent Mechanism:</span>
              <span className="font-bold text-blue-700">Automated SMS &amp; OTP Portal</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Turnstile Scan Alerts:</span>
              <span className="font-bold text-emerald-600">SMS on Exit &amp; Return Enabled</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-blue-900">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>SMS Fallback for Students without Smartphones:</span>
            </p>
            <span>
              If you or your parents do not have mobile data, our system sends plain SMS notifications containing your pass code (#PASS-...) and curfew alerts.
            </span>
          </div>
        </div>

        {/* Return Time Extension Request */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> {t.extendReturn}
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Pre-Curfew Only</span>
          </div>

          {activePass ? (
            <form onSubmit={handleExtensionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Requested Extended Return Time
                </label>
                <input
                  type="time"
                  required
                  value={requestedExtensionTime}
                  onChange={(e) => setRequestedExtensionTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Delay</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Heavy traffic / delayed train / extended hospital consult..."
                  value={extensionReason}
                  onChange={(e) => setExtensionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingExtension}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingExtension ? 'Submitting...' : 'Send Extension Request to Warden'}</span>
              </button>
            </form>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs">No active pass currently outside campus gates to extend.</p>
            </div>
          )}
        </div>
      </div>

      {/* Late Return Explanation Box if Overdue */}
      {isOverdue && activePass && (
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-600" /> {t.sendLateNote}
          </h4>
          <p className="text-xs text-slate-500">
            Submit a formal explanation note directly to the Warden control room for your curfew delay to prevent disciplinary strikes.
          </p>

          <form onSubmit={handleLateExplanationSubmit} className="space-y-3 text-xs">
            <textarea
              required
              rows={3}
              placeholder="Explain the circumstance causing your late arrival back to campus..."
              value={lateNote}
              onChange={(e) => setLateNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingLateNote}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                {submittingLateNote ? 'Sending...' : 'Submit Explanation to Warden Desk'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
