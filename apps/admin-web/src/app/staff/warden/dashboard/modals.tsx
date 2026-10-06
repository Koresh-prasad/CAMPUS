'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Key,
  Lock,
  Phone,
  Building,
  User,
  Clock,
  Calendar,
  Send,
  MessageSquare,
  FileText,
  Share2,
  Bell,
  Bed,
  PhoneCall,
  Flame,
  Check,
  Users,
  ShieldAlert,
  Wrench,
  AlertCircle,
  Info,
  ArrowRight,
  Eye,
  UserCheck,
  Megaphone,
  Siren,
  Download,
  Printer,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  WardenProfile,
  GatePass,
  HostelComplaint,
  RoomChangeRequest,
  HostelNotice,
  FacilityTiming,
  WardenLeave,
  HostelStaff,
  Resident,
  Room,
  DisciplinaryRecord,
  MaintenanceTicketItem,
  LeaveRequestItem,
} from './types';

// ============================================================================
// 1. EDIT PROFILE & PHOTO MODAL
// ============================================================================
export function EditProfileModal({
  profile,
  isOpen,
  onClose,
  onSave,
}: {
  profile: WardenProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: WardenProfile) => void;
}) {
  const [formData, setFormData] = useState<WardenProfile>({ ...profile });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Edit Warden Profile</h3>
              <p className="text-xs text-slate-500">Update contact info, photo, qualifications, and hostel office details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Mobile Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Designation</label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Office Room</label>
              <input
                type="text"
                value={formData.officeRoom}
                onChange={(e) => setFormData({ ...formData, officeRoom: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Profile Photo URL</label>
            <div className="flex items-center space-x-3">
              <img
                src={formData.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120'}
                alt="Avatar Preview"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Qualification & Education</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Emergency Contact Phone</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Warden Bio / Student Welfare Statement</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex items-center justify-end space-x-3 bg-slate-50/60 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. DIGITAL ID CARD MODAL WITH QR
// ============================================================================
export function DigitalIdCardModal({
  profile,
  isOpen,
  onClose,
}: {
  profile: WardenProfile;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Card Header with Navy Gradient */}
        <div className="bg-gradient-to-r from-[#0a192f] via-slate-900 to-[#1e3a8a] p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-300 tracking-wider uppercase">
                Raajdhani Engineering College
              </p>
              <h4 className="text-xs font-black text-white">Hostel Administration ID</h4>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-4">
          <div className="relative inline-block">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160'}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-white shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✓
            </span>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900">{profile.name}</h3>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{profile.designation}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
              {profile.empId}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-left space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Assigned:</span>
              <span className="font-bold text-slate-800">{profile.assignedHostel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Blocks:</span>
              <span className="font-bold text-slate-800">{profile.assignedBlocks.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Office:</span>
              <span className="font-bold text-slate-800">{profile.officeRoom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Phone:</span>
              <span className="font-bold text-slate-800">{profile.phone}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-2xs">
            <QRCodeSVG
              value={`REC-HOSTEL-WARDEN:${profile.empId}:${profile.name}:${profile.email}`}
              size={110}
            />
            <p className="text-[9px] font-mono text-slate-400 mt-1.5 font-bold">SCAN FOR REAL-TIME CREDENTIALS</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Autonomous Campus 2026-27</span>
          <button
            onClick={() => window.print()}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Print Card
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. CHANGE PASSWORD MODAL
// ============================================================================
export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) {
      setError('Please fill in all password fields.');
      return;
    }
    if (newPass.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('New password and confirmation do not match.');
      return;
    }
    setError('');
    onSuccess('Password updated successfully. Please use your new password next time you sign in.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Change Password</h3>
              <p className="text-xs text-slate-500">Secure your campus warden account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">New Password (min 8 chars)</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-xs cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 4. GATE PASS ACTION MODAL (APPROVE / REJECT WITH REASON / QR)
// ============================================================================
export function PassActionModal({
  pass,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onSendGuardianAlert,
}: {
  pass: GatePass | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (passId: string) => void;
  onReject: (passId: string, reason: string) => void;
  onSendGuardianAlert: (studentName: string, phone: string) => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              GP
            </span>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{pass.passNumber}</h3>
              <p className="text-[11px] text-slate-500 font-medium">Applied {pass.appliedAt}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Student Capsule */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{pass.studentName}</h4>
              <p className="text-slate-500 text-[11px]">
                {pass.studentId} • Room {pass.roomNumber}, {pass.blockName}
              </p>
              <p className="text-blue-700 font-semibold text-[11px] mt-0.5">{pass.course} ({pass.year})</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 rounded-lg bg-blue-600 text-white font-mono text-[10px] font-bold block">
                {pass.pastPassesCount} Past Passes
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Good Conduct</span>
            </div>
          </div>

          {/* Pass Details */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase">Pass Category</span>
              <p className="font-black text-slate-900 mt-0.5">{pass.type.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase">Destination</span>
              <p className="font-black text-slate-900 mt-0.5 truncate">{pass.destination}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase">Departure Time</span>
              <p className="font-bold text-slate-800 mt-0.5">{pass.departureDate} at {pass.departureTime}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[10px] uppercase">Expected Return</span>
              <p className="font-bold text-slate-800 mt-0.5">{pass.expectedReturnDate} by {pass.expectedReturnTime}</p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-bold text-[10px] uppercase">Stated Reason</span>
            <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 font-medium mt-1 leading-relaxed">
              "{pass.reason}"
            </p>
          </div>

          {/* Parent Guardian Verification Strip */}
          <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-slate-900 text-[11px]">Guardian: {pass.parentName}</p>
                <p className="text-slate-500 text-[10px] font-mono">{pass.parentPhone}</p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                pass.parentConsent === 'CONFIRMED' || pass.parentConsent === 'OTP_VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {pass.parentConsent === 'OTP_VERIFIED' ? '✓ OTP Verified' : pass.parentConsent}
            </span>
          </div>

          {/* QR Code Preview for Approved Passes */}
          {pass.status === 'APPROVED' && (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center space-y-2">
              <p className="text-[11px] font-black text-emerald-800 uppercase tracking-wider">
                Digital Turnstile Barcode
              </p>
              <div className="inline-block p-2 bg-white rounded-xl shadow-xs border border-emerald-100">
                <QRCodeSVG value={pass.qrToken} size={100} />
              </div>
              <p className="text-[10px] font-mono text-emerald-700">Token: {pass.qrToken}</p>
            </div>
          )}

          {/* Rejection Reason Form */}
          {showRejectInput && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <label className="block text-[11px] font-bold text-rose-800">
                Reason for Pass Rejection (will be SMS/App notified to student):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Unscheduled lab class, parent consent pending, curfew violation warning..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReject(pass.id, rejectReason || 'Administrative reason');
                    onClose();
                  }}
                  className="px-3.5 py-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <button
            type="button"
            onClick={() => onSendGuardianAlert(pass.studentName, pass.parentPhone)}
            className="px-3 py-2 rounded-xl text-blue-700 hover:bg-blue-100 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call Guardian</span>
          </button>

          {pass.status === 'PENDING' && !showRejectInput && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
              >
                Reject Pass
              </button>
              <button
                type="button"
                onClick={() => {
                  onApprove(pass.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Generate QR</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. ROLL CALL QUICK MARK MODAL
// ============================================================================
export function RollCallModal({
  isOpen,
  onClose,
  blockName,
  residents,
  onSaveRollCall,
}: {
  isOpen: boolean;
  onClose: () => void;
  blockName: string;
  residents: Array<{ studentId: string; name: string; roomNumber: string; status: 'PRESENT' | 'ABSENT' | 'ON_PASS' }>;
  onSaveRollCall: (records: any[]) => void;
}) {
  const [entries, setEntries] = useState(residents);

  if (!isOpen) return null;

  const handleToggleStatus = (studentId: string, newStatus: 'PRESENT' | 'ABSENT' | 'ON_PASS') => {
    setEntries((prev) =>
      prev.map((e) => (e.studentId === studentId ? { ...e, status: newStatus } : e))
    );
  };

  const presentCount = entries.filter((e) => e.status === 'PRESENT').length;
  const absentCount = entries.filter((e) => e.status === 'ABSENT').length;
  const onPassCount = entries.filter((e) => e.status === 'ON_PASS').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h3 className="font-extrabold text-base">Night Roll Call: {blockName}</h3>
            <p className="text-xs text-slate-300">
              Curfew 09:30 PM • Rapid Touch Marking • Total {entries.length} Residents
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Counter Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100 border-b border-slate-200 text-center text-xs font-bold">
          <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
            <span className="text-lg font-black block">{presentCount}</span>
            <span>Present in Room</span>
          </div>
          <div className="bg-rose-100 text-rose-800 p-2 rounded-xl">
            <span className="text-lg font-black block">{absentCount}</span>
            <span>Absent / Unaccounted</span>
          </div>
          <div className="bg-blue-100 text-blue-800 p-2 rounded-xl">
            <span className="text-lg font-black block">{onPassCount}</span>
            <span>On Approved Pass</span>
          </div>
        </div>

        {/* Student Roll List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {entries.map((entry) => (
            <div key={entry.studentId} className="pt-2 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-bold text-slate-800">
                    Room {entry.roomNumber}
                  </span>
                  <span className="font-black text-xs text-slate-900">{entry.name}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{entry.studentId}</p>
              </div>

              {/* Status Toggle Buttons */}
              <div className="flex items-center space-x-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(entry.studentId, 'PRESENT')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    entry.status === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(entry.studentId, 'ABSENT')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    entry.status === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Absent
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(entry.studentId, 'ON_PASS')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    entry.status === 'ON_PASS'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  On Pass
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <p className="text-[11px] text-slate-500 font-medium">
            Absent alerts automatically ping parents if left unverified.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSaveRollCall(entries);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              Submit Roll Call Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. ASSIGN COMPLAINT MODAL
// ============================================================================
export function AssignComplaintModal({
  complaint,
  isOpen,
  onClose,
  staffList,
  onAssign,
}: {
  complaint: HostelComplaint | null;
  isOpen: boolean;
  onClose: () => void;
  staffList: HostelStaff[];
  onAssign: (complaintId: string, technicianName: string, notes: string) => void;
}) {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Assign Maintenance Staff</h3>
            <p className="text-xs text-slate-500">{complaint.ticketNumber} • {complaint.category}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
          <p className="font-extrabold text-slate-900">{complaint.title}</p>
          <p className="text-slate-500">{complaint.description}</p>
          <p className="text-blue-600 font-bold pt-1">
            Location: Room {complaint.roomNumber}, {complaint.blockName}
          </p>
        </div>

        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Select Duty Technician</label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Choose on-duty staff member --</option>
              {staffList.map((s) => (
                <option key={s.id} value={`${s.name} (${s.role})`}>
                  {s.name} - {s.role} ({s.shift})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Instruction / Target Time</label>
            <input
              type="text"
              placeholder="e.g. Bring replacement tap valve, resolve within 2 hours"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!selectedStaff) return;
              onAssign(complaint.id, selectedStaff, notes);
              onClose();
            }}
            disabled={!selectedStaff}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Dispatch Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 7. EMERGENCY SOS HOSTEL BROADCAST MODAL
// ============================================================================
export function EmergencyBroadcastModal({
  isOpen,
  onClose,
  onBroadcast,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (type: string, message: string, soundAlarm: boolean) => void;
}) {
  const [alertType, setAlertType] = useState('FIRE_ALARM');
  const [message, setMessage] = useState('Attention all residents: Evacuate Nilgiri Block A calmly via emergency stairs to the front cricket ground assembly area.');
  const [soundAlarm, setSoundAlarm] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-rose-500 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-black text-rose-900 text-base">Hostel Emergency Broadcast</h3>
              <p className="text-xs text-rose-600">Immediate Siren & Mobile Notification to All Residents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Emergency Category</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 font-bold"
            >
              <option value="FIRE_ALARM">🔥 Fire Alarm & Immediate Evacuation</option>
              <option value="MEDICAL_SOS">🚑 Critical Medical Team Dispatch</option>
              <option value="WEATHER_ALERT">⛈️ Severe Cyclone / Lightning Warning</option>
              <option value="CAMPUS_LOCKDOWN">🚨 Gate Security Lockdown</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Broadcast Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <label className="flex items-center space-x-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={soundAlarm}
              onChange={(e) => setSoundAlarm(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-xs text-slate-700 font-bold">Trigger audio alarm sound on connected devices</span>
          </label>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onBroadcast(alertType, message, soundAlarm);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center space-x-1.5"
          >
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            <span>Sound Emergency Broadcast</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. CREATE HOSTEL NOTICE MODAL
// ============================================================================
export function CreateNoticeModal({
  isOpen,
  onClose,
  onPublish,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (notice: Partial<HostelNotice>) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'GENERAL' | 'RULES_CURFEW' | 'MESS_UPDATE' | 'MAINTENANCE' | 'EMERGENCY' | 'INSPECTION'>('RULES_CURFEW');
  const [targetAudience, setTargetAudience] = useState<'ALL_HOSTEL' | 'BLOCK_A' | 'BLOCK_B' | 'FIRST_YEAR' | 'SPECIFIC_ROOMS'>('ALL_HOSTEL');
  const [deadline, setDeadline] = useState('');
  const [isActionRequired, setIsActionRequired] = useState(false);
  const [smsFallback, setSmsFallback] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Publish Hostel Circular / Notice</h3>
              <p className="text-xs text-slate-500">Notify students with read tracking and SMS fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Notice Headline / Subject</label>
            <input
              type="text"
              placeholder="e.g. Mandatory Room Hygiene Inspection on Saturday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="RULES_CURFEW">Curfew & Discipline</option>
                <option value="MESS_UPDATE">Mess & Dining</option>
                <option value="MAINTENANCE">Maintenance & Repairs</option>
                <option value="INSPECTION">Hostel Inspection</option>
                <option value="GENERAL">General Notice</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="ALL_HOSTEL">All Nilgiri Residents (450)</option>
                <option value="BLOCK_A">Block A Only (220)</option>
                <option value="BLOCK_B">Block B Only (230)</option>
                <option value="FIRST_YEAR">First-Year Wing Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Detailed Notice Body</label>
            <textarea
              rows={4}
              placeholder="Provide exact guidelines, timings, room numbers, and instructions..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActionRequired}
                onChange={(e) => setIsActionRequired(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">Requires Student Action / Confirmation</span>
            </label>

            {isActionRequired && (
              <div className="pl-6">
                <label className="block text-[11px] text-slate-500 mb-1">Compliance Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. 2026-10-10, 06:00 PM"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={smsFallback}
                onChange={(e) => setSmsFallback(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Send SMS fallback to students without active app notifications
              </span>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!title || !content) return;
              onPublish({
                title,
                content,
                category,
                targetAudience,
                deadline,
                isActionRequired,
                smsFallbackSent: smsFallback,
                isPinned: true,
              });
              onClose();
            }}
            disabled={!title || !content}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Post Notice
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. HELPDESK FILE REQUEST ON BEHALF OF STUDENT
// ============================================================================
export function HelpdeskFileRequestModal({
  isOpen,
  onClose,
  onSubmitRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (reqData: any) => void;
}) {
  const [studentRoll, setStudentRoll] = useState('');
  const [reqType, setReqType] = useState('GATE_PASS');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Warden Helpdesk Request</h3>
              <p className="text-xs text-slate-500">File a pass or service request for a student</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Student Roll / Registration ID</label>
            <input
              type="text"
              placeholder="e.g. REC-2023-CS042"
              value={studentRoll}
              onChange={(e) => setStudentRoll(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Request Type</label>
            <select
              value={reqType}
              onChange={(e) => setReqType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="GATE_PASS">Emergency Day / Outing Pass</option>
              <option value="NIGHT_LEAVE">Urgent Night Leave (Home)</option>
              <option value="ROOM_CHANGE">Room Change Application</option>
              <option value="NO_DUES">Vacate & No-Dues Clearance</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Destination / Details</label>
            <input
              type="text"
              placeholder="Destination address or room number"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Warden Note & Reason</label>
            <textarea
              rows={3}
              placeholder="Special circumstance, medical memo, or verbal guardian approval..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!studentRoll || !reason) return;
              onSubmitRequest({ studentRoll, reqType, destination, reason });
              onClose();
            }}
            disabled={!studentRoll || !reason}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Generate Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. APPLY WARDEN LEAVE MODAL
// ============================================================================
export function ApplyWardenLeaveModal({
  isOpen,
  onClose,
  onSubmitLeave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLeave: (leaveData: Partial<WardenLeave>) => void;
}) {
  const [leaveType, setLeaveType] = useState<'CASUAL' | 'DUTY' | 'MEDICAL'>('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [substituteWarden, setSubstituteWarden] = useState('Prof. Ramesh Chandra Dash (Chief Warden)');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Apply Warden Leave</h3>
              <p className="text-xs text-slate-500">Notify Admin & Handover Evening Roll-call Duty</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-semibold text-slate-700">
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="CASUAL">Casual Leave (Balance: 8 Days)</option>
              <option value="DUTY">Official Duty / University Summit (Balance: 5 Days)</option>
              <option value="MEDICAL">Medical Leave (Balance: 12 Days)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Substitute Warden for Roll-call</label>
            <input
              type="text"
              value={substituteWarden}
              onChange={(e) => setSubstituteWarden(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Leave Reason / Handover Note</label>
            <textarea
              rows={3}
              placeholder="State reason and key items for the interim warden..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!startDate || !endDate || !reason) return;
              onSubmitLeave({
                leaveType,
                startDate,
                endDate,
                days: 2,
                reason,
                substituteWarden,
                status: 'PENDING',
              });
              onClose();
            }}
            disabled={!startDate || !endDate || !reason}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Submit Leave Application
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 11. STUDENT PROFILE DRAWER / MODAL (Requirement 10)
// ============================================================================
export function StudentProfileDrawer({
  resident,
  isOpen,
  onClose,
  onAction,
}: {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (actionType: 'PASS' | 'LEAVE' | 'COMPLAINT' | 'MOVEMENT') => void;
}) {
  if (!isOpen || !resident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center space-x-3">
            <img
              src={resident.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Subham&backgroundColor=b6e3f4'}
              alt={resident.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{resident.name}</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {resident.studentId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {resident.branch} • {resident.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Hostel Room</span>
              <p className="text-sm font-black text-slate-800 mt-0.5">
                {resident.roomNumber} ({resident.bedNumber})
              </p>
              <span className="text-[10px] text-slate-500">{resident.blockName}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Presence</span>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                resident.presenceStatus === 'IN_HOSTEL'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : resident.presenceStatus === 'OVERDUE'
                  ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}>
                {resident.presenceStatus === 'IN_HOSTEL' ? 'PRESENT IN HOSTEL' : resident.presenceStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Blood Group</span>
              <p className="text-sm font-black text-rose-600 mt-0.5">{resident.bloodGroup || 'B+'}</p>
              <span className="text-[10px] text-slate-500">Recorded for Emergency</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">KYC Verification</span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ✓ VERIFIED
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>Contact & Guardian Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Student Mobile</span>
                <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{resident.phone}</p>
                <a href={`tel:${resident.phone}`} className="text-[10px] text-indigo-600 hover:underline">
                  Call Student Direct
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Official Student Email</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{resident.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Registered Guardian</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{resident.guardianName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Guardian Mobile</span>
                <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{resident.guardianPhone}</p>
                <a href={`tel:${resident.guardianPhone}`} className="text-[10px] text-indigo-600 hover:underline">
                  Call Guardian
                </a>
              </div>
            </div>
          </div>

          {/* Hostel Residency Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Hostel Living & Roommates</span>
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hostel Complex:</span>
                <span className="font-bold text-slate-800">{resident.hostelName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Block & Room:</span>
                <span className="font-bold text-slate-800">{resident.blockName}, Room {resident.roomNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Assigned Bed:</span>
                <span className="font-bold text-slate-800">{resident.bedNumber}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Check-in Date:</span>
                <span className="font-bold text-slate-800">{resident.checkInDate || '01 Aug 2023'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Roommate(s):</span>
                <span className="font-bold text-slate-800">Sanjay Mishra (REC-2023-CS045)</span>
              </div>
            </div>
          </div>

          {/* Restricted Medical Info Notice (Requirement 10) */}
          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-900 leading-relaxed">
              <strong>Medical Data Privacy Protection:</strong> Full clinical medical records and health prescriptions are restricted to Campus Medical Officers. Blood Group is logged for emergency hospital transport protocols.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-b-3xl">
          <div className="flex gap-2">
            <button
              onClick={() => onAction && onAction('PASS')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs"
            >
              Gate Passes
            </button>
            <button
              onClick={() => onAction && onAction('LEAVE')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs"
            >
              Leaves
            </button>
            <button
              onClick={() => onAction && onAction('COMPLAINT')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs"
            >
              Complaints
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 12. GATE PASS SECURE QR MODAL (Requirement 13)
// ============================================================================
export function GatePassQrModal({
  pass,
  isOpen,
  onClose,
}: {
  pass: GatePass | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !pass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Secure Turnstile QR</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">{pass.studentName}</h3>
          <p className="text-xs text-slate-500">
            {pass.studentId} • Room {pass.roomNumber} ({pass.blockName})
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 inline-block mx-auto shadow-inner">
          <QRCodeSVG value={pass.qrToken || `PASS-${pass.id}`} size={160} level="H" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-600 block bg-slate-100 py-1 px-3 rounded-lg">
            {pass.qrToken}
          </span>
          <p className="text-xs font-semibold text-slate-600">
            Out: <strong>{pass.departureTime}</strong> • Return: <strong>{pass.expectedReturnTime}</strong>
          </p>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="flex-1 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
          >
            Print Pass
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 13. RECORD DISCIPLINE / INCIDENT MODAL (Requirement 20)
// ============================================================================
export function CreateIncidentModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (incident: any) => void;
}) {
  const [studentName, setStudentName] = useState('Subham Pradhan');
  const [studentId, setStudentId] = useState('REC-2023-CS042');
  const [roomNumber, setRoomNumber] = useState('A-204');
  const [location, setLocation] = useState('Nilgiri Block A, Corridor Floor 2');
  const [category, setCategory] = useState<any>('CURFEW');
  const [severity, setSeverity] = useState<any>('LOW');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [guardianInformed, setGuardianInformed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Record Hostel Incident</h3>
              <p className="text-xs text-slate-500">Document discipline violations with full audit history</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Student ID / Roll</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Incident Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="CURFEW">Late Return / Curfew Violation</option>
                <option value="NOISE">Noise Disturbance / Silent Study Hours</option>
                <option value="PROPERTY_DAMAGE">Hostel Property Damage</option>
                <option value="UNAUTHORIZED_VISITOR">Unauthorized Visitor in Room</option>
                <option value="DISPUTE">Roommate / Resident Dispute</option>
                <option value="RAGGING_CHECK">Ragging Check / Surveillance Note</option>
                <option value="OTHER">Other Misconduct</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="LOW">Low (First Verbal Warning)</option>
                <option value="MEDIUM">Medium (Written Warning)</option>
                <option value="HIGH">High (Parent Meeting / Fine)</option>
                <option value="CRITICAL">Critical (Proctorial Committee Escalation)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Incident Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Detailed Incident Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, witness accounts, and physical evidence observed..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
            />
          </div>

          <div>
            <label className="block text-slate-500 mb-1 font-bold">Action Taken / Resolution</label>
            <input
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="e.g. Verbal warning recorded; undertaking signed; parent briefed."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={guardianInformed}
              onChange={(e) => setGuardianInformed(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span className="text-xs text-slate-700">Guardian / Parents have been notified via phone</span>
          </label>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 rounded-b-3xl">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!description) return;
              onSubmit({
                studentName,
                studentId,
                roomNumber,
                location,
                category,
                severity,
                description,
                actionTaken: actionTaken || 'Under Review',
                guardianInformed,
                incidentDate: new Date().toISOString().split('T')[0],
              });
              onClose();
            }}
            disabled={!description}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs disabled:opacity-50"
          >
            Save Incident Record
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 14. CONFIRMATION DIALOG MODAL (Requirement 6, 11, 31)
// ============================================================================
export function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
          isDanger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
        }`}>
          {isDanger ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
        </div>

        <div>
          <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white transition shadow-sm cursor-pointer ${
              isDanger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 15. HELP & SUPPORT MODAL (Bottom Sidebar)
// ============================================================================
export function HelpSupportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Warden Support & SOPs</h3>
              <p className="text-xs text-slate-500">Hostel administration guidelines and emergency directories</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
              Campus Emergency Escalation Hotlines
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Gate 1 Security Control</span>
                <span className="font-black text-slate-800 font-mono">+91 94370 88214</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">24×7 Campus Emergency Vehicle</span>
                <span className="font-black text-rose-600 font-mono">+91 94370 00108</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Dean Student Welfare</span>
                <span className="font-black text-slate-800 font-mono">+91 98610 33441</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">Proctorial Board Cell</span>
                <span className="font-black text-slate-800 font-mono">+91 98610 99999</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-indigo-600">
              Hostel Standard Operating Procedures (SOP)
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">1. Night Curfew Protocol (09:30 PM)</p>
                <p className="text-[11px] mt-0.5">Gates strictly lock at 21:30. Students arriving past 21:30 require verification. If late by over 30 mins, mark Overdue and check guardian contact.</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">2. Night Roll Call Execution</p>
                <p className="text-[11px] mt-0.5">Conduct roll call between 21:00 and 22:00. Mark each resident as Present, Outside on Pass, on Leave, or Absent/Unverified.</p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">3. Emergency SOS Response</p>
                <p className="text-[11px] mt-0.5">Immediately acknowledge active SOS, dispatch security QRT and emergency vehicle to the student room beacon.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
