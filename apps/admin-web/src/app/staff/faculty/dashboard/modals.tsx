'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Printer,
  Download,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  Send,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
  MapPin,
  Lock,
  Key,
  Users,
  Award,
  AlertCircle,
  Camera,
  Plus,
  Trash2,
  Edit3,
  GraduationCap,
  Video,
  Link,
  Globe,
  Play,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  Student,
  Assignment,
  Course,
  Material,
  ScheduleSlot,
  FacultyLeave,
  EducationRecord,
  LearningResource,
  ResourceCategory,
} from './types';

// ----------------------------------------------------
// 1. Digital ID Card with QR Modal
// ----------------------------------------------------
export function DigitalIDModal({
  isOpen,
  onClose,
  facultyName,
  facultyDept,
  facultyDesignation,
  facultyEmail,
  facultyPhone,
  avatarUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  facultyName: string;
  facultyDept: string;
  facultyDesignation: string;
  facultyEmail: string;
  facultyPhone: string;
  avatarUrl: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-5 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-white text-blue-800 font-black text-sm flex items-center justify-center mx-auto shadow-md mb-2">
            REC
          </div>
          <h3 className="font-black text-xs uppercase tracking-wider">
            Raajdhani Engineering College
          </h3>
          <p className="text-[10px] text-blue-200 font-semibold tracking-wide">
            (Autonomous) • Affiliated to BPUT, Odisha
          </p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[9px] font-black uppercase tracking-wider">
            Official Faculty ID
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-4 border-blue-100 shadow-md">
            <img src={avatarUrl} alt={facultyName} className="w-full h-full object-cover" />
          </div>

          <div>
            <h4 className="font-black text-base text-slate-900">{facultyName}</h4>
            <p className="text-xs font-bold text-blue-700">{facultyDesignation}</p>
            <p className="text-[11px] text-slate-500 font-medium">{facultyDept}</p>
          </div>

          {/* Metadata pill grid */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Employee ID:</span>
              <span className="font-mono font-bold text-slate-800">REC-FAC-2019-042</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Blood Group:</span>
              <span className="font-bold text-rose-600">O+ (Positive)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Valid Through:</span>
              <span className="font-bold text-slate-800">July 2028</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification:</span>
              <span className="font-bold text-emerald-600">Active & Dean Endorsed ✓</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-inner">
            <QrCode className="w-20 h-20 text-slate-900 mx-auto" />
            <p className="text-[9px] font-mono text-slate-400 mt-1">REC-AUTH-VERIFY-042</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. Change Password Modal
// ----------------------------------------------------
export function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-slate-900">Change Account Password</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newPass !== confPass) {
              alert('New password and confirmation do not match!');
              return;
            }
            onSuccess('Password updated successfully!');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">New Password *</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="At least 8 chars with symbols"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-[11px] space-y-1 border border-amber-200">
            <p className="font-bold">Password Security Checklist:</p>
            <p>• Minimum 8 characters, 1 uppercase, 1 special character</p>
            <p>• Changing your password will invalidate active sessions on other devices</p>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Update Password
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Cancel / Reschedule Class Modal (with automatic student alert)
// ----------------------------------------------------
export function RescheduleClassModal({
  isOpen,
  onClose,
  courses,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSuccess: (msg: string) => void;
}) {
  const [courseCode, setCourseCode] = useState(courses[0]?.code || 'CS-401');
  const [actionType, setActionType] = useState<'RESCHEDULE' | 'CANCEL'>('RESCHEDULE');
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('03:30 PM - 04:30 PM (Extra Tutorial Slot)');
  const [newRoom, setNewRoom] = useState('Hall 302');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Cancel or Reschedule Class</h3>
            <p className="text-[11px] text-slate-400">
              Sends an automatic broadcast notification to enrolled students
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(
              actionType === 'RESCHEDULE'
                ? `✓ Class rescheduled to ${newDate}. Auto SMS & App alert broadcast to students!`
                : `✓ Class cancelled. Alert dispatched to all enrolled batch students!`
            );
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Course & Batch</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.batch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Action Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('RESCHEDULE')}
                className={`py-2 rounded-xl font-bold transition ${
                  actionType === 'RESCHEDULE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Reschedule Class
              </button>
              <button
                type="button"
                onClick={() => setActionType('CANCEL')}
                className={`py-2 rounded-xl font-bold transition ${
                  actionType === 'CANCEL'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel Session
              </button>
            </div>
          </div>

          {actionType === 'RESCHEDULE' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Room / Venue</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option>03:30 PM - 04:30 PM (Extra Tutorial Slot)</option>
                  <option>04:30 PM - 05:30 PM (Remedial Slot)</option>
                  <option>Saturday 10:00 AM - 11:30 AM (Weekend Make-up)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Reason for Change *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Urgent departmental accreditation meeting / University symposium..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-2 text-[11px] text-blue-900">
            <Send className="w-4 h-4 text-blue-600 shrink-0" />
            <p>
              An automated notification will be pushed to the Student Mobile App and registered parent phone desk.
            </p>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              {actionType === 'RESCHEDULE' ? 'Confirm & Notify Students' : 'Cancel & Broadcast Alert'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. Substitute / Adjustment Request Modal
// ----------------------------------------------------
export function SubstituteModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [targetFaculty, setTargetFaculty] = useState('Prof. Rajesh Verma');
  const [mySlot, setMySlot] = useState('Monday 09:00 AM - 10:00 AM (CS-401 Algorithms)');
  const [remark, setRemark] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Request Substitute or Class Adjustment</h3>
            <p className="text-[11px] text-slate-400">
              Request a peer faculty member to handle or exchange your scheduled lecture
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(`✓ Substitute request forwarded to ${targetFaculty} and HOD Desk!`);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">My Lecture to Adjust *</label>
            <select
              value={mySlot}
              onChange={(e) => setMySlot(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>Monday 09:00 AM - 10:00 AM (CS-401 Algorithms - Hall 302)</option>
              <option>Tuesday 02:00 PM - 04:00 PM (CS-401L Algorithms Lab - Coding Lab 1)</option>
              <option>Wednesday 09:00 AM - 10:00 AM (CS-502 Cloud Computing - Seminar Hall 2)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Request Peer Faculty Member *</label>
            <select
              value={targetFaculty}
              onChange={(e) => setTargetFaculty(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>Prof. Rajesh Verma (Assistant Professor, CSE)</option>
              <option>Dr. Debabrata Swain (Associate Professor, CSE)</option>
              <option>Prof. Megha Pattnaik (Assistant Professor, CSE)</option>
              <option>Dr. Ashutosh Mohanty (HOD, Dept. of CSE)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Reason / Note for Substitute</label>
            <textarea
              rows={2}
              required
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. Attending REC Autonomous Academic Council Review. Requesting coverage of Module 3 Bellman-Ford proof."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Send Request to Peer & HOD
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. Classroom & Lab Booking Modal
// ----------------------------------------------------
export function RoomBookingModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [facility, setFacility] = useState('Seminar Hall 1 (Projector & AC)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState('03:30 PM - 05:00 PM');
  const [purpose, setPurpose] = useState('Remedial algorithms problem solving and doubt clearing');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Book Classroom / Teaching Lab</h3>
            <p className="text-[11px] text-slate-400">
              Reserve campus teaching facilities for extra classes or lab sessions
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(`✓ ${facility} reserved for ${date} (${slot})!`);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select Facility *</label>
            <select
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>Seminar Hall 1 (Capacity: 120, Dual 4K Projector & AC)</option>
              <option>Coding Lab 2 - High Performance Workstations (Capacity: 45 PCs)</option>
              <option>AI Research & GPU Server Lab (Block 2)</option>
              <option>Smart Classroom 304 (Touch Display & Lecture Capture)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Booking Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Time Slot *</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option>03:30 PM - 05:00 PM</option>
                <option>05:00 PM - 06:30 PM</option>
                <option>Saturday 09:00 AM - 12:00 PM</option>
                <option>Saturday 01:00 PM - 04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Teaching Purpose *</label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="State the academic purpose (e.g. remedial session, lab test make-up, hackathon mentoring)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Confirm Facility Booking
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. Edit Attendance with Reason Audit Trail Modal
// ----------------------------------------------------
export function EditAttendanceModal({
  isOpen,
  onClose,
  student,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (roll: string, newStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE', reason: string) => void;
}) {
  const [newStatus, setNewStatus] = useState<'PRESENT' | 'ABSENT' | 'ON_LEAVE'>('PRESENT');
  const [reason, setReason] = useState('');

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Edit Attendance Record</h3>
            <p className="text-[11px] text-slate-400">
              Audit trail requires an official reason for any retrospective change
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center space-x-3 text-xs">
          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-black text-slate-900">{student.name}</p>
            <p className="font-mono text-slate-500 font-bold">{student.roll} • {student.batch}</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(student.roll, newStatus, reason);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">New Attendance Status *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNewStatus('PRESENT')}
                className={`py-2 rounded-xl font-bold transition ${
                  newStatus === 'PRESENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => setNewStatus('ABSENT')}
                className={`py-2 rounded-xl font-bold transition ${
                  newStatus === 'ABSENT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Absent
              </button>
              <button
                type="button"
                onClick={() => setNewStatus('ON_LEAVE')}
                className={`py-2 rounded-xl font-bold transition ${
                  newStatus === 'ON_LEAVE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                On Leave
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mandatory Reason for Audit Trail *
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Student submitted stamped medical prescription from campus dispensary / permission slip from Dean."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">Audit Policy Notice:</p>
            <p>
              This modification will be permanently logged with your faculty credentials and timestamp into the REC Autonomous academic audit repository.
            </p>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Save Change & Record in Audit Log
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. Low Attendance Warning Dispatcher Modal
// ----------------------------------------------------
export function LowAttendanceWarningModal({
  isOpen,
  onClose,
  criticalStudents,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  criticalStudents: Student[];
  onSuccess: (msg: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">
                Dispatch Short Attendance Warnings (&lt;75%)
              </h3>
              <p className="text-[11px] text-slate-400">
                Automated SMS & Email notices sent to students and parent desks
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
          {criticalStudents.map((st) => (
            <div
              key={st.id}
              className="p-3 bg-rose-50/60 border border-rose-200 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="font-black text-slate-900">{st.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {st.roll} • Parent: {st.parentPhone}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-mono">
                  {st.attendance}%
                </span>
                <p className="text-[9px] text-rose-600 font-bold mt-0.5">Shortage Warning</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <p className="font-bold text-slate-800">Warning Message Preview:</p>
          <p className="text-[11px] text-slate-600 italic">
            "Dear Parent/Student, Attendance in CS-401 Algorithms is currently below the mandatory 75% REC Autonomous threshold. As per BPUT / REC guidelines, students with &lt;75% attendance are subject to detention from Mid-Term/End-Term exams unless regularized immediately."
          </p>
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => {
              onSuccess(`✓ Short attendance warnings dispatched to ${criticalStudents.length} student and guardian phones!`);
              onClose();
            }}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Warning Alerts to All ({criticalStudents.length})</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 8. Student Counselling & Mentoring Logger Modal
// ----------------------------------------------------
export function CounsellingModal({
  isOpen,
  onClose,
  student,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (note: string, category: 'ACADEMIC' | 'PLACEMENT' | 'PERSONAL' | 'ATTENDANCE') => void;
}) {
  const [category, setCategory] = useState<'ACADEMIC' | 'PLACEMENT' | 'PERSONAL' | 'ATTENDANCE'>('ACADEMIC');
  const [note, setNote] = useState('');

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Record Mentoring & Counselling Note</h3>
            <p className="text-[11px] text-slate-400">
              For student: {student.name} ({student.roll})
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(note, category);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Counselling Category *</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="ACADEMIC">Academic Mentoring (Algorithms, Lab, CGPA)</option>
              <option value="ATTENDANCE">Attendance Counselling & Regularity Advice</option>
              <option value="PLACEMENT">Placement & Career Internship Guidance</option>
              <option value="PERSONAL">Personal Well-being & Hostel Adjustment</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Discussion & Action Points *</label>
            <textarea
              rows={4}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record points discussed, student commitments, and follow-up guidance..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Save Mentoring Log
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 9. Question Paper Secure Upload Modal
// ----------------------------------------------------
export function QuestionPaperModal({
  isOpen,
  onClose,
  courses,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSuccess: (msg: string) => void;
}) {
  const [course, setCourse] = useState(courses[0]?.code || 'CS-401');
  const [examType, setExamType] = useState('Mid-Semester Autonomous Examination (Autumn 2026)');
  const [passcode, setPasscode] = useState('');
  const [fileAttached, setFileAttached] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Confidential Question Paper Vault</h3>
              <p className="text-[11px] text-slate-400">
                Encrypted submission directly to REC Controller of Examinations
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(`✓ Question paper for ${course} submitted securely to Examination Cell!`);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Subject & Course *</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Examination Category</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>Mid-Semester Autonomous Examination (Autumn 2026)</option>
              <option>End-Semester Theory Exam Set A</option>
              <option>End-Semester Theory Exam Set B (Confidential Backup)</option>
              <option>Special Backlog / Re-exam Paper</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Upload Encrypted PDF / Document *</label>
            <div
              onClick={() => setFileAttached(true)}
              className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
                fileAttached
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                  : 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-500'
              }`}
            >
              <Upload className="w-6 h-6 mx-auto mb-1 text-slate-400" />
              {fileAttached ? (
                <span className="font-bold text-xs">✓ REC_QP_CS401_MidSem_SetA_Encrypted.pdf</span>
              ) : (
                <span>Click to attach Question Paper & Scheme of Evaluation (.pdf)</span>
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Decryption Secret Key / Passcode *</label>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Key known only to Exam Controller"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Securely Submit Paper
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 10. Report Academic or Classroom Problem Modal (with photo)
// ----------------------------------------------------
export function ReportIssueModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [category, setCategory] = useState<'CLASSROOM' | 'LAB_EQUIPMENT' | 'PROJECTOR' | 'WIFI' | 'SOFTWARE'>('PROJECTOR');
  const [location, setLocation] = useState('Academic Block 1 • Hall 302');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT' | 'EMERGENCY'>('URGENT');
  const [photoAdded, setPhotoAdded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Report Classroom or Lab Problem</h3>
            <p className="text-[11px] text-slate-400">
              Escalates directly to Campus Infrastructure & IT Helpdesk
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess('✓ Issue ticket logged! IT maintenance team dispatched.');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issue Category *</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="PROJECTOR">Projector / Audio-Visual</option>
                <option value="LAB_EQUIPMENT">Lab Hardware Workstation</option>
                <option value="WIFI">Campus Wi-Fi / LAN</option>
                <option value="SOFTWARE">Software / Compiler License</option>
                <option value="CLASSROOM">Classroom Infrastructure / AC</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e: any) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent (Affects Lectures)</option>
                <option value="EMERGENCY">Emergency (Exam Hall)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Room / Venue Location *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Issue Summary *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Projector HDMI port drops signal intermittently"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
            <textarea
              rows={2}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Explain the failure in detail so technicians bring right tools..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Attach Photo Evidence</label>
            <div
              onClick={() => setPhotoAdded(true)}
              className={`p-3 border border-dashed rounded-xl text-center cursor-pointer transition ${
                photoAdded
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-500'
              }`}
            >
              {photoAdded ? '✓ Photo Attached (evidence_capture.jpg)' : '📷 Click to upload photo of damaged hardware'}
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Submit Ticket to Maintenance
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 11. Broadcast Announcement Modal (with SMS alert option)
// ----------------------------------------------------
export function PostNoticeModal({
  isOpen,
  onClose,
  courses,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSuccess: (msg: string) => void;
}) {
  const [targetBatch, setTargetBatch] = useState('ALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendSMS, setSendSMS] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Broadcast Class Announcement</h3>
            <p className="text-[11px] text-slate-400">Post announcements to student portals & phones</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess(`✓ Announcement published! ${sendSMS ? 'SMS alerts dispatched.' : ''}`);
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Course / Section</label>
            <select
              value={targetBatch}
              onChange={(e) => setTargetBatch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="ALL">All My Enrolled Batches (141 Students)</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.batch})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Announcement Headline *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Extra Doubt Clearing Session this Saturday"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Announcement Body *</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type message clearly with timings and venue..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800">Dispatch SMS Fallback</p>
              <p className="text-[10px] text-slate-500">Send direct SMS alert to student registered numbers</p>
            </div>
            <input
              type="checkbox"
              checked={sendSMS}
              onChange={(e) => setSendSMS(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Publish Announcement
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 12. Apply Faculty Leave Modal (Casual, Duty, Medical)
// ----------------------------------------------------
export function ApplyFacultyLeaveModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [category, setCategory] = useState<'Casual Leave (CL)' | 'Earned Leave (EL)' | 'Duty Leave (OD)' | 'Medical Leave'>('Casual Leave (CL)');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [substitute, setSubstitute] = useState('Prof. Rajesh Verma');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Apply for Faculty Leave</h3>
            <p className="text-[11px] text-slate-400">
              Submitted to Head of Department & Dean for official sanction
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess('✓ Leave application submitted to HOD and Dean!');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Leave Category *</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="Casual Leave (CL)">Casual Leave (CL) — 8 Days Remaining</option>
              <option value="Duty Leave (OD)">Duty Leave / Conference (OD) — 5 Days Remaining</option>
              <option value="Earned Leave (EL)">Earned Leave (EL) — 12 Days Remaining</option>
              <option value="Medical Leave">Medical Leave (Campus Dispensary Verification)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">From Date *</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">To Date *</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Reason for Leave *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State purpose of leave / conference details..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Substitute Class In-Charge *</label>
            <select
              value={substitute}
              onChange={(e) => setSubstitute(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>Prof. Rajesh Verma (Assistant Professor, CSE)</option>
              <option>Dr. Debabrata Swain (Associate Professor, CSE)</option>
              <option>Prof. Megha Pattnaik (Assistant Professor, CSE)</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Submit Application
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 13. Service Certificate & NOC Request Modal
// ----------------------------------------------------
export function NOCRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const [docType, setDocType] = useState('No Objection Certificate (NOC) for Ph.D. Defense');
  const [purpose, setPurpose] = useState('Submitting thesis to BPUT University Examination Board');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-sm text-slate-900">Request NOC / Service Certificate</h3>
            <p className="text-[11px] text-slate-400">
              Dispatched to REC Autonomous Registrar & Principal Desk
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSuccess('✓ Certificate request submitted to Registrar Desk!');
            onClose();
          }}
          className="space-y-3 text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Certificate Type *</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option>No Objection Certificate (NOC) for Ph.D. Defense</option>
              <option>Service Experience Certificate</option>
              <option>Salary & Pay Scale Certificate for Bank Loan</option>
              <option>NOC for Passport & International Visa Application</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Purpose / Submission Authority *</label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="State the organization / authority requesting this document..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
            >
              Submit Request to Registrar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 14. Edit Profile Photo Modal
// ----------------------------------------------------
export function EditProfilePhotoModal({
  isOpen,
  onClose,
  currentPhoto,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string;
  onSave: (newUrl: string) => void;
}) {
  const [photoUrl, setPhotoUrl] = useState(currentPhoto);
  const [inputUrl, setInputUrl] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Sample faculty avatar presets
  const presets = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  ];

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit.');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Update Profile Photo</h3>
              <p className="text-[11px] text-slate-500">Upload a professional faculty portrait</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-blue-500/20 shadow-md bg-slate-100 relative group">
              <img src={photoUrl || currentPhoto} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Preview for ID card & faculty portal</p>
          </div>

          {/* Option A: Upload from Computer */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Upload from Device (PNG / JPG / WEBP)</label>
            <label className="flex items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-4 cursor-pointer bg-blue-50/30 hover:bg-blue-50/60 transition group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center space-y-1">
                <Upload className="w-5 h-5 text-blue-600 mx-auto group-hover:scale-110 transition" />
                <p className="font-bold text-slate-800 text-[11px]">Click to browse image file</p>
                <p className="text-[10px] text-slate-400">Max file size 5MB</p>
              </div>
            </label>
            {uploadError && <p className="text-rose-500 text-[11px]">{uploadError}</p>}
          </div>

          {/* Option B: Enter Direct Image URL */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Or Enter Direct Image URL</label>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (inputUrl.trim()) setPhotoUrl(inputUrl.trim());
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-xl transition"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Option C: Quick Preset Avatars */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Or Choose Preset Faculty Portrait</label>
            <div className="grid grid-cols-6 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(p)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    photoUrl === p ? 'border-blue-600 scale-105 shadow-md ring-2 ring-blue-400' : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <img src={p} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onSave(photoUrl);
                onClose();
              }}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs"
            >
              Save Profile Photo
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 15. Add or Edit Education & Qualifications Modal
// ----------------------------------------------------
export function AddEditEducationModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EducationRecord | null;
  onSave: (record: EducationRecord) => void;
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [degree, setDegree] = useState(initialData?.degree || '');
  const [level, setLevel] = useState(initialData?.level || "Master's Degree");
  const [institution, setInstitution] = useState(initialData?.institution || '');
  const [period, setPeriod] = useState(initialData?.period || '');
  const [grade, setGrade] = useState(initialData?.grade || '');
  const [specialization, setSpecialization] = useState(initialData?.specialization || '');
  const [status, setStatus] = useState<'Completed' | 'In Progress'>(initialData?.status || 'Completed');
  const [details, setDetails] = useState(initialData?.details || '');

  React.useEffect(() => {
    if (initialData) {
      setDegree(initialData.degree || '');
      setLevel(initialData.level || "Master's Degree");
      setInstitution(initialData.institution || '');
      setPeriod(initialData.period || '');
      setGrade(initialData.grade || '');
      setSpecialization(initialData.specialization || '');
      setStatus(initialData.status || 'Completed');
      setDetails(initialData.details || '');
    } else {
      setDegree('');
      setLevel("Master's Degree");
      setInstitution('');
      setPeriod('');
      setGrade('');
      setSpecialization('');
      setStatus('Completed');
      setDetails('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) return;

    onSave({
      id: initialData?.id || `edu-${Date.now()}`,
      degree: degree.trim(),
      level,
      institution: institution.trim(),
      period: period.trim() || '2020 - 2024',
      grade: grade.trim() || 'First Class Distinction',
      specialization: specialization.trim(),
      status,
      details: details.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">
                {isEditing ? 'Edit Academic Qualification' : 'Add New Academic Qualification'}
              </h3>
              <p className="text-[11px] text-slate-500">Record certified university degree & educational credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Degree / Qualification Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ph.D. in Computer Science & Engg, M.Tech in CSE"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Education Level / Category *</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                <option value="Doctoral Research">Doctoral Research (Ph.D.)</option>
                <option value="Post-Doctoral Fellowship">Post-Doctoral Fellowship</option>
                <option value="Master's Degree">Master's Degree (M.Tech / M.S. / MCA)</option>
                <option value="Bachelor's Degree">Bachelor's Degree (B.Tech / B.E. / B.Sc.)</option>
                <option value="Higher Secondary">Higher Secondary (+2 / Intermediate)</option>
                <option value="Diploma / Professional Certification">Diploma / Professional Certification</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Status *</label>
              <div className="flex space-x-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setStatus('Completed')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Completed ✓
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('In Progress')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                    status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  In Progress
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">University / Institute / Board *</label>
              <input
                type="text"
                required
                placeholder="e.g. Indian Institute of Technology Kharagpur (IIT-KGP)"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Year Range / Duration *</label>
              <input
                type="text"
                required
                placeholder="e.g. 2014 - 2016 or 2023 - Present"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Grade / CGPA / Honors</label>
              <input
                type="text"
                placeholder="e.g. 9.42 / 10.0 CGPA, Gold Medalist"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Specialization / Major Discipline</label>
              <input
                type="text"
                placeholder="e.g. Distributed AI, Algorithms Optimization, Cloud Microservices"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Thesis / Project / Research Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary of research thesis, advisor, or capstone accomplishments..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs"
            >
              {isEditing ? 'Update Qualification' : 'Add Qualification'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 16. Add / Edit Learning Resource Modal (Notes, Video, Video Link, Website)
// ----------------------------------------------------
export function AddEditResourceModal({
  isOpen,
  onClose,
  initialData,
  defaultCategory = 'NOTE',
  courses,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LearningResource | null;
  defaultCategory?: ResourceCategory;
  courses: Course[];
  onSave: (resource: LearningResource) => void;
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [category, setCategory] = useState<ResourceCategory>(initialData?.category || defaultCategory);
  const [title, setTitle] = useState(initialData?.title || '');
  const [course, setCourse] = useState(initialData?.course || (courses[0]?.name ? `${courses[0].code} ${courses[0].name}` : 'CS-401 Design & Analysis of Algorithms'));
  const [batch, setBatch] = useState(initialData?.batch || 'B.Tech CSE - 5th Sem (Sec A & B)');
  const [unit, setUnit] = useState(initialData?.unit || 'Unit 1: Fundamentals');
  const [url, setUrl] = useState(initialData?.url || '');
  const [duration, setDuration] = useState(initialData?.duration || '45 mins');
  const [fileSize, setFileSize] = useState(initialData?.fileSize || '3.5 MB');
  const [fileType, setFileType] = useState(initialData?.fileType || 'PDF');
  const [platform, setPlatform] = useState(initialData?.platform || 'YouTube');
  const [websiteName, setWebsiteName] = useState(initialData?.websiteName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [fileName, setFileName] = useState('');

  React.useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setTitle(initialData.title);
      setCourse(initialData.course);
      setBatch(initialData.batch || 'B.Tech CSE - 5th Sem');
      setUnit(initialData.unit || 'Unit 1: Fundamentals');
      setUrl(initialData.url);
      setDuration(initialData.duration || '45 mins');
      setFileSize(initialData.fileSize || '3.5 MB');
      setFileType(initialData.fileType || 'PDF');
      setPlatform(initialData.platform || 'YouTube');
      setWebsiteName(initialData.websiteName || '');
      setDescription(initialData.description || '');
    } else {
      setCategory(defaultCategory);
      setTitle('');
      setUrl('');
      setWebsiteName('');
      setDescription('');
      setFileName('');
    }
  }, [initialData, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileType(ext);
      setUrl(URL.createObjectURL(file));
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let computedUrl = url.trim() || '#';
    let computedThumb = initialData?.thumbnail;

    // Auto generate thumbnail if video link
    if (category === 'VIDEO_LINK') {
      if (platform === 'YouTube' && computedUrl) {
        const match = computedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          computedThumb = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
      }
      if (!computedThumb) {
        computedThumb = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
      }
    } else if (category === 'VIDEO') {
      computedThumb = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600';
    } else if (category === 'WEBSITE_LINK') {
      computedThumb = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600';
    }

    onSave({
      id: initialData?.id || `res-${Date.now()}`,
      title: title.trim(),
      course,
      batch,
      unit: unit.trim(),
      category,
      url: computedUrl,
      thumbnail: computedThumb,
      duration: category === 'VIDEO' || category === 'VIDEO_LINK' ? duration : undefined,
      fileSize: category === 'NOTE' || category === 'VIDEO' ? fileSize : undefined,
      fileType: category === 'NOTE' ? fileType : category === 'VIDEO' ? 'MP4' : 'LINK',
      platform: category === 'VIDEO_LINK' ? platform : category === 'WEBSITE_LINK' ? 'Website' : 'Local',
      websiteName: category === 'WEBSITE_LINK' ? websiteName || 'Reference Website' : undefined,
      description: description.trim(),
      dateAdded: initialData?.dateAdded || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      downloadsCount: initialData?.downloadsCount || 0,
      viewsCount: initialData?.viewsCount || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              {category === 'NOTE' && <FileText className="w-5 h-5" />}
              {category === 'VIDEO' && <Video className="w-5 h-5" />}
              {category === 'VIDEO_LINK' && <Play className="w-5 h-5" />}
              {category === 'WEBSITE_LINK' && <Globe className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">
                {isEditing ? 'Edit Learning Resource' : 'Add New Learning Resource'}
              </h3>
              <p className="text-[11px] text-slate-500">Publish notes, recorded video, YouTube lecture or educational link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Category Tabs */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Resource Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCategory('NOTE')}
                className={`py-2 px-2.5 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 border transition cursor-pointer ${
                  category === 'NOTE'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[10px]">Notes / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('VIDEO')}
                className={`py-2 px-2.5 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 border transition cursor-pointer ${
                  category === 'VIDEO'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span className="text-[10px]">Video Lecture</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('VIDEO_LINK')}
                className={`py-2 px-2.5 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 border transition cursor-pointer ${
                  category === 'VIDEO_LINK'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Play className="w-4 h-4" />
                <span className="text-[10px]">Video Link</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('WEBSITE_LINK')}
                className={`py-2 px-2.5 rounded-xl font-bold flex flex-col items-center justify-center space-y-1 border transition cursor-pointer ${
                  category === 'WEBSITE_LINK'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px]">Website Link</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Resource Title *</label>
            <input
              type="text"
              required
              placeholder={
                category === 'NOTE'
                  ? 'e.g. Unit 3 Dynamic Programming Detailed Lecture Notes'
                  : category === 'VIDEO'
                  ? 'e.g. Lecture 14: Matrix Chain Multiplication Classroom Recording'
                  : category === 'VIDEO_LINK'
                  ? 'e.g. NPTEL IIT Delhi: Bellman-Ford Shortest Path Video'
                  : 'e.g. Visualgo Algorithm Animations or LeetCode DP Practice'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject / Course *</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              >
                {courses.map((c) => (
                  <option key={c.code} value={`${c.code} ${c.name}`}>
                    {c.code} - {c.name}
                  </option>
                ))}
                <option value="CS-502 Cloud Computing & Microservices">CS-502 Cloud Computing & Microservices</option>
                <option value="General CSE Academic Resources">General CSE Academic Resources</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Unit / Syllabus Module</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              >
                <option>Unit 1: Fundamentals & Asymptotic Notation</option>
                <option>Unit 2: Divide-and-Conquer & Greedy</option>
                <option>Unit 3: Dynamic Programming</option>
                <option>Unit 4: Graph Algorithms & Network Flow</option>
                <option>Unit 5: NP-Completeness & Approximation</option>
                <option>Lab Module / Practical Implementation</option>
                <option>Placement & Competitive Coding</option>
              </select>
            </div>
          </div>

          {/* Conditional Inputs Based on Category */}

          {/* 1. If NOTE: File Upload or Document URL */}
          {category === 'NOTE' && (
            <div className="space-y-3 p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Upload Document File (PDF / DOCX / PPTX)</label>
                <label className="flex items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white rounded-xl p-3 cursor-pointer transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="text-center space-y-1">
                    <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                    <p className="font-bold text-slate-800 text-[11px]">
                      {fileName ? `Selected: ${fileName}` : 'Click to select PDF or notes file'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, PPTX, DOCX up to 50MB</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Or Direct Document Link URL</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/... or https://rec.ac.in/notes.pdf"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>
          )}

          {/* 2. If VIDEO: Video Upload or Video URL */}
          {category === 'VIDEO' && (
            <div className="space-y-3 p-3.5 bg-purple-50/40 rounded-2xl border border-purple-100">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Select Recorded Video File (MP4 / WEBM)</label>
                <label className="flex items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-400 bg-white rounded-xl p-3 cursor-pointer transition">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="text-center space-y-1">
                    <Video className="w-5 h-5 text-purple-600 mx-auto" />
                    <p className="font-bold text-slate-800 text-[11px]">
                      {fileName ? `Selected: ${fileName}` : 'Click to browse recorded video file'}
                    </p>
                    <p className="text-[10px] text-slate-400">MP4, WEBM, MKV supported</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Video Stream URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/lecture.mp4"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (e.g. 50 mins)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. If VIDEO_LINK: YouTube / NPTEL / Drive URL */}
          {category === 'VIDEO_LINK' && (
            <div className="space-y-3 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Video Hosting Platform *</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="YouTube">YouTube Lecture</option>
                    <option value="NPTEL">NPTEL Swayam Video</option>
                    <option value="Google Drive">Google Drive Recorded Class</option>
                    <option value="Vimeo">Vimeo / Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Video Duration (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Video Web Link URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Tip: YouTube URLs will automatically generate an embedded player preview for students.
                </p>
              </div>
            </div>
          )}

          {/* 4. If WEBSITE_LINK: External Website Link */}
          {category === 'WEBSITE_LINK' && (
            <div className="space-y-3 p-3.5 bg-emerald-50/40 rounded-2xl border border-emerald-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Website / Portal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GeeksforGeeks, LeetCode, Visualgo"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Website URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://visualgo.net/en or https://www.geeksforgeeks.org/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>
            </div>
          )}

          {/* Description / Instructions */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Instructions & Notes for Students
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Recommended reading before Friday's tutorial session. Focus on Page 4 algorithm trace..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            />
          </div>

          <div className="flex space-x-2 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Update Resource' : 'Publish Resource'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 17. Learning Resource Viewer Modal (Video Player / Embed / Notes)
// ----------------------------------------------------
export function ResourceViewerModal({
  isOpen,
  onClose,
  resource,
}: {
  isOpen: boolean;
  onClose: () => void;
  resource: LearningResource | null;
}) {
  if (!isOpen || !resource) return null;

  // Extract YouTube ID if applicable
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const ytId = resource.category === 'VIDEO_LINK' ? getYouTubeId(resource.url) : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 space-y-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {resource.category.replace('_', ' ')}
            </span>
            <h3 className="font-black text-sm text-slate-900 truncate max-w-md">{resource.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Video Player */}
          {resource.category === 'VIDEO' && (
            <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
              <video
                controls
                autoPlay
                src={resource.url}
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* YouTube Embed Player */}
          {resource.category === 'VIDEO_LINK' && ytId && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-md">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                title={resource.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {/* Video Link non-YouTube fallback */}
          {resource.category === 'VIDEO_LINK' && !ytId && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <Play className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="font-black text-sm text-slate-900">{resource.title}</h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                This video lecture is hosted on {resource.platform || 'an external streaming platform'}.
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs"
              >
                <span>Open Video Stream ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Website Link Preview */}
          {resource.category === 'WEBSITE_LINK' && (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
              <Globe className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  {resource.websiteName || 'Educational Website'}
                </span>
                <h4 className="font-black text-base text-slate-900 mt-1">{resource.title}</h4>
                <p className="text-slate-600 text-xs font-mono mt-0.5">{resource.url}</p>
              </div>
              <p className="text-slate-500 text-xs max-w-md mx-auto">{resource.description}</p>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs"
              >
                <span>Visit {resource.websiteName || 'Website'} ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Note / Document Preview */}
          {resource.category === 'NOTE' && (
            <div className="p-8 text-center bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
              <FileText className="w-12 h-12 text-blue-600 mx-auto" />
              <div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                  {resource.fileType || 'PDF Document'} • {resource.fileSize || '3.5 MB'}
                </span>
                <h4 className="font-black text-base text-slate-900 mt-1">{resource.title}</h4>
                <p className="text-slate-500 text-xs mt-0.5">{resource.course}</p>
              </div>
              <p className="text-slate-600 text-xs max-w-md mx-auto">{resource.description}</p>
              <div className="flex justify-center space-x-2 pt-2">
                <a
                  href={resource.url}
                  download
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File ({resource.fileSize})</span>
                </a>
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-slate-500 text-[11px]">
            <div>
              Course: <strong className="text-slate-800 font-bold">{resource.course}</strong> • Added on {resource.dateAdded}
            </div>
            {resource.viewsCount !== undefined && (
              <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">
                👁️ {resource.viewsCount} Student Views
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


