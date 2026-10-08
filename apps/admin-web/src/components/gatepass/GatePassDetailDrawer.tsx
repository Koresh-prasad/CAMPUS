'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  XCircle,
  Share2,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface GatePassDetailDrawerProps {
  pass: any | null;
  onClose: () => void;
  onApprove: (id: string, notes?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onOverride: (id: string, newStatus: string, reason: string) => Promise<void>;
  onVerifyGuardian?: (id: string, type: string) => Promise<void>;
}

export default function GatePassDetailDrawer({
  pass,
  onClose,
  onApprove,
  onReject,
  onOverride,
  onVerifyGuardian,
}: GatePassDetailDrawerProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showOverrideInput, setShowOverrideInput] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState('APPROVED');
  const [overrideReason, setOverrideReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!pass) return null;

  const handleApproveClick = async () => {
    setSubmitting(true);
    try {
      await onApprove(pass.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    setSubmitting(true);
    try {
      await onReject(pass.id, rejectReason.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverrideClick = async () => {
    if (!overrideReason.trim()) {
      alert('Please enter an administrative justification for this override.');
      return;
    }
    setSubmitting(true);
    try {
      await onOverride(pass.id, overrideStatus, overrideReason.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // Status step index calculation
  const statusSteps = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'ACTIVE', label: 'Out at Gate' },
    { key: 'RETURNED', label: 'Returned In' },
  ];

  const currentStatus = pass.status || 'PENDING';
  const isRejected = currentStatus === 'REJECTED';
  const isOverdue = currentStatus === 'OVERDUE' || pass.isOverdue;
  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              GP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black tracking-tight">{pass.passNumber || 'Pass Details'}</h2>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    isOverdue
                      ? 'bg-rose-500 text-white animate-pulse'
                      : isRejected
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : currentStatus === 'APPROVED'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : currentStatus === 'ACTIVE'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                  }`}
                >
                  {isOverdue ? '🚨 OVERDUE' : currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {pass.passType || 'Day Outing Pass'} • Applied {pass.appliedAt || new Date(pass.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              title="Print Pass"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Status Tracker */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase">
              Live Lifecycle Tracker
            </span>
            <div className="flex items-center justify-between relative">
              {statusSteps.map((step, idx) => {
                const isPassed =
                  currentStatus === 'RETURNED'
                    ? true
                    : currentStatus === 'ACTIVE'
                    ? idx <= 3
                    : currentStatus === 'APPROVED'
                    ? idx <= 2
                    : idx === 0;

                return (
                  <div key={step.key} className="flex flex-col items-center z-1 relative">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isPassed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 mt-1">{step.label}</span>
                  </div>
                );
              })}
            </div>
            {isOverdue && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl font-bold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Student has exceeded valid return time! Escalated to Chief Warden.</span>
              </div>
            )}
            {isRejected && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-xl font-bold">
                Reason for Rejection: {pass.rejectionReason || 'Declined by Warden Office'}
              </div>
            )}
          </div>

          {/* Student Dossier Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Student Resident Profile</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px]">Full Name</span>
                <strong className="text-slate-900 text-xs">{pass.studentName || pass.residentName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Roll Number</span>
                <strong className="text-blue-700 font-mono text-xs">{pass.rollNo || 'REC-CS-042'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Room & Hostel</span>
                <strong className="text-slate-800 text-xs">{pass.roomNumber || pass.room} • {pass.blockName || pass.hostel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Course & Year</span>
                <span className="text-slate-700">{pass.branch || 'B.Tech CSE'} ({pass.year || '3rd Year'})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Student Phone</span>
                <a href={`tel:${pass.studentPhone || '+91 98765 43210'}`} className="text-blue-600 font-semibold hover:underline">
                  {pass.studentPhone || '+91 98765 43210'}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Parent / Guardian Phone</span>
                <a href={`tel:${pass.parentPhone}`} className="text-emerald-700 font-semibold hover:underline">
                  {pass.parentPhone || '+91 94370 11223'}
                </a>
              </div>
            </div>
          </div>

          {/* Pass Itinerary & Destination */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Destination & Time Window</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block font-bold">Destination</span>
                <strong className="text-slate-900 text-xs">{pass.destination || 'City Center, Bhubaneswar'}</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] block font-bold">Purpose / Reason</span>
                <strong className="text-slate-900 text-xs">{pass.reason || 'Personal supplies purchase'}</strong>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Valid Departure</span>
                  <span className="text-slate-800 font-semibold">{pass.validFrom ? new Date(pass.validFrom).toLocaleString() : pass.from || 'Today'}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Curfew Return Deadline</span>
                  <span className="text-slate-800 font-semibold">{pass.validTill ? new Date(pass.validTill).toLocaleString() : pass.to || '21:30 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code & Turnstile Token */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Turnstile QR Verification
              </span>
              <h4 className="text-base font-black tracking-tight">{pass.passCode || pass.passNumber || 'GP-SCAN-READY'}</h4>
              <p className="text-[11px] text-blue-200">
                Security turnstile will scan this QR for automatic gate entry/exit logging.
              </p>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <QRCodeSVG value={pass.qrCodeToken || pass.passNumber || 'GP-VALID'} size={72} />
            </div>
          </div>

          {/* Guardian Consent Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Parent / Guardian Consent Verification</span>
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Verification Status</span>
                <span className="text-emerald-700 font-bold">{pass.guardianStatus || 'Confirmed via Phone Call & SMS'}</span>
              </div>
              {onVerifyGuardian && (
                <button
                  type="button"
                  onClick={() => onVerifyGuardian(pass.id, 'PHONE_CONFIRMED')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Mark Call Verified
                </button>
              )}
            </div>
          </div>

          {/* Admin Override Section */}
          <div className="border border-purple-200 bg-purple-50/50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-900 font-bold">
                <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                <span>Campus Admin Override Desk</span>
              </div>
              <button
                type="button"
                onClick={() => setShowOverrideInput(!showOverrideInput)}
                className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
              >
                {showOverrideInput ? 'Hide Override Controls' : 'Open Admin Override'}
              </button>
            </div>

            {showOverrideInput && (
              <div className="space-y-3 pt-2">
                <p className="text-[11px] text-purple-800">
                  Campus Directors and Chief Administrators can override warden decisions with a recorded audit log reason.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Target Status</label>
                    <select
                      value={overrideStatus}
                      onChange={(e) => setOverrideStatus(e.target.value)}
                      className="w-full p-2 bg-white border border-purple-300 rounded-xl font-bold text-xs"
                    >
                      <option value="APPROVED">Override to APPROVED ✅</option>
                      <option value="REJECTED">Override to REJECTED ❌</option>
                      <option value="CANCELLED">Revoke / CANCELLED ⛔</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-1">Administrative Justification *</label>
                    <input
                      type="text"
                      placeholder="e.g. Approved per Dean of Students instruction"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full p-2 bg-white border border-purple-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleOverrideClick}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  {submitting ? 'Executing Override...' : 'Confirm Administrative Override'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 mt-auto flex items-center justify-between gap-3 sticky bottom-0">
          <div className="flex items-center space-x-2">
            {currentStatus === 'PENDING' && (
              <>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleApproveClick}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Pass</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold rounded-xl text-xs transition cursor-pointer flex items-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </>
            )}

            {currentStatus === 'APPROVED' && (
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pass Approved by {pass.approvedByName || 'Warden Office'}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Rejection input prompt modal overlay */}
        {showRejectInput && (
          <div className="p-4 bg-rose-50 border-t border-rose-200 space-y-2">
            <label className="text-[11px] font-bold text-rose-900 block">Rejection Reason *</label>
            <input
              type="text"
              placeholder="e.g. Parent did not give consent / Academic backlog warning"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 bg-white border border-rose-300 rounded-xl text-xs"
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleRejectClick}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
