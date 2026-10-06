'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  AlertTriangle,
  QrCode,
  Shield,
  Phone,
  User,
  Car,
  Package,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Camera,
  HelpCircle,
  Siren,
  Building,
} from 'lucide-react';
import {
  GatePassScanResult,
  SecurityVisitor,
  SecurityVehicle,
  SecurityParcel,
  SecurityIncident,
  SecurityLostFound,
} from './types';

// ===================================================================
// 1. CONFIRM SCAN RESULT MODAL
// ===================================================================
export function ConfirmScanModal({
  scanResult,
  isOpen,
  onClose,
  onConfirmExit,
  onConfirmReturn,
}: {
  scanResult: GatePassScanResult | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: (passId: string) => void;
  onConfirmReturn: (passId: string) => void;
}) {
  if (!isOpen || !scanResult) return null;

  const isValid = scanResult.isValid;
  const isAlreadyOut = scanResult.status === 'ALREADY_OUT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden space-y-0 animate-in zoom-in-95">
        {/* Banner Header */}
        <div
          className={`p-6 text-white flex items-center justify-between ${
            isValid
              ? isAlreadyOut
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700'
              : 'bg-gradient-to-r from-rose-600 to-red-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
              {isValid ? (
                isAlreadyOut ? (
                  <CheckCircle2 className="w-7 h-7 text-white" />
                ) : (
                  <Check className="w-7 h-7 text-white" />
                )
              ) : (
                <XCircle className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isValid
                  ? isAlreadyOut
                    ? '✓ RETURNING RESIDENT VERIFICATION'
                    : '✓ VALID GATE PASS — AUTHORIZED'
                  : '✕ INVALID / EXPIRED / REVOKED PASS'}
              </h3>
              <p className="text-xs text-white/80 font-medium">
                {isValid
                  ? isAlreadyOut
                    ? 'Student is returning to campus. Verify physical entry.'
                    : 'Warden approval verified. Turnstile clearance authorized.'
                  : scanResult.rejectionReason || 'Access Denied. Turnstiles remain locked.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Resident & Pass Details */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Identity Capsule */}
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={scanResult.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
              alt={scanResult.studentName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-base text-slate-900 truncate">
                {scanResult.studentName}
              </h4>
              <p className="font-mono text-xs font-bold text-blue-600">
                {scanResult.studentRoll}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {scanResult.hostel} • {scanResult.roomNumber}
              </p>
            </div>
          </div>

          {/* Verification Matrix */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pass Type</span>
              <span className="font-extrabold text-slate-900">{scanResult.passType.replace('_', ' ')}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Token / Pass ID</span>
              <span className="font-mono font-bold text-slate-900 truncate block">{scanResult.token}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Scheduled Exit</span>
              <span className="font-mono font-bold text-slate-900">{scanResult.exitTime}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Curfew / Return Deadline</span>
              <span className="font-mono font-bold text-emerald-700">{scanResult.expectedReturnTime}</span>
            </div>
          </div>

          {/* Destination & Purpose */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Authorized Destination</span>
            <p className="font-extrabold text-slate-800">{scanResult.destination}</p>
            <p className="text-slate-600 text-[11px]">{scanResult.purpose}</p>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-slate-500 font-medium">Guardian Consent Status:</span>
            <span className="font-black text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              ✓ {scanResult.parentConsent}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer transition"
          >
            Cancel
          </button>

          {isValid && !isAlreadyOut && (
            <button
              onClick={() => {
                onConfirmExit(scanResult.passId);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>[ CONFIRM EXIT ]</span>
            </button>
          )}

          {isValid && isAlreadyOut && (
            <button
              onClick={() => {
                onConfirmReturn(scanResult.passId);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>[ CONFIRM RETURN ]</span>
            </button>
          )}

          {!isValid && (
            <button
              disabled
              className="px-6 py-2.5 rounded-xl bg-slate-300 text-slate-500 font-black text-xs cursor-not-allowed"
            >
              Exit Prohibited
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// 2. REGISTER VISITOR MODAL
// ===================================================================
export function RegisterVisitorModal({
  isOpen,
  onClose,
  onRegister,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (v: Partial<SecurityVisitor>) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<'Aadhaar' | 'Driving License' | 'Voter ID' | 'College ID'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [studentVisited, setStudentVisited] = useState('Subham Pradhan');
  const [studentRoll, setStudentRoll] = useState('REC-2023-CS042');
  const [studentRoom, setStudentRoom] = useState('Room A-204 (Nilgiri)');
  const [purpose, setPurpose] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !purpose) return;

    onRegister({
      name,
      phone,
      idType,
      idNumber: idNumber || 'VERIFIED-ID',
      studentVisited,
      studentRoll,
      studentRoom,
      purpose,
      vehicleNumber,
      entryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Checked In',
      securityOfficer: 'Officer Rajesh Kumar',
      passNumber: `VP-2026-${Math.floor(100 + Math.random() * 900)}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <User className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Register Campus Visitor</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Visitor Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Balakrushna Pradhan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Contact</label>
              <input
                type="tel"
                required
                placeholder="+91 94370 88990"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vehicle Plate (If any)</label>
              <input
                type="text"
                placeholder="OD-02-B-1290"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Govt ID Type</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="College ID">College ID</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">ID Number / Last 4</label>
              <input
                type="text"
                placeholder="XXXX-XXXX-8921"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Student Visited</label>
            <input
              type="text"
              required
              value={studentVisited}
              onChange={(e) => setStudentVisited(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Purpose of Visit</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Parental drop-off of documents & medical items"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Issue Visitor Pass & Check In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 3. LOG VEHICLE MODAL
// ===================================================================
export function LogVehicleModal({
  isOpen,
  onClose,
  onLogVehicle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogVehicle: (v: Partial<SecurityVehicle>) => void;
}) {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<SecurityVehicle['vehicleType']>('Two-Wheeler');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [ownerType, setOwnerType] = useState<SecurityVehicle['ownerType']>('STUDENT');
  const [purpose, setPurpose] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !driverName) return;

    onLogVehicle({
      plateNumber: plateNumber.toUpperCase(),
      vehicleType,
      driverName,
      driverPhone,
      ownerType,
      purpose: purpose || 'Campus Transit',
      entryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      gate: 'Main Vehicle Gate 1',
      securityOfficer: 'Officer Rajesh Kumar',
      status: 'INSIDE',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Car className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm">Log Vehicle Entry</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Plate Number</label>
            <input
              type="text"
              required
              placeholder="e.g. OD-02-AK-4512"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Two-Wheeler">Two-Wheeler</option>
                <option value="Sedan Car">Sedan Car</option>
                <option value="SUV">SUV</option>
                <option value="Campus Shuttle">Campus Shuttle</option>
                <option value="Delivery Van">Delivery Van</option>
                <option value="Ambulance">Ambulance</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Owner Category</label>
              <select
                value={ownerType}
                onChange={(e) => setOwnerType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Faculty / Staff</option>
                <option value="VISITOR">Visitor</option>
                <option value="TRANSIT">Campus Transit</option>
                <option value="DELIVERY">Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Driver Name</label>
              <input
                type="text"
                required
                placeholder="Driver Name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Driver Phone</label>
              <input
                type="tel"
                placeholder="+91..."
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Purpose / Bay Destination</label>
            <input
              type="text"
              placeholder="e.g. Faculty Lot A / Hostel Drop-off"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Log Vehicle Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 4. REGISTER PARCEL MODAL
// ===================================================================
export function RegisterParcelModal({
  isOpen,
  onClose,
  onRegisterParcel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRegisterParcel: (p: Partial<SecurityParcel>) => void;
}) {
  const [company, setCompany] = useState<SecurityParcel['company']>('Amazon');
  const [parcelNumber, setParcelNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [roomOrDept, setRoomOrDept] = useState('');
  const [hostelName, setHostelName] = useState('Nilgiri Block A');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName) return;

    onRegisterParcel({
      company,
      parcelNumber: parcelNumber || `PKG-${Date.now().toString().slice(-6)}`,
      recipientName,
      recipientType: 'STUDENT',
      recipientPhone,
      roomOrDept: roomOrDept || 'Hostel Desk',
      hostelName,
      entryTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting',
      securityOfficer: 'Officer Rajesh Kumar',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-amber-600 to-orange-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Package className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Register Incoming Parcel</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Courier / Service</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="BlueDart">BlueDart</option>
                <option value="DTDC">DTDC</option>
                <option value="India Post">India Post</option>
                <option value="Swiggy/Zomato">Swiggy/Zomato</option>
                <option value="Courier">Other Courier</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Tracking / Parcel ID</label>
              <input
                type="text"
                placeholder="AMZ-IN-889104"
                value={parcelNumber}
                onChange={(e) => setParcelNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Subham Pradhan"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91..."
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Room / Dept</label>
              <input
                type="text"
                placeholder="Room A-204"
                value={roomOrDept}
                onChange={(e) => setRoomOrDept(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Log Parcel & Notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 5. REPORT SECURITY INCIDENT MODAL
// ===================================================================
export function ReportIncidentModal({
  isOpen,
  onClose,
  onReportIncident,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReportIncident: (inc: Partial<SecurityIncident>) => void;
}) {
  const [category, setCategory] = useState<SecurityIncident['category']>('INVALID_PASS');
  const [location, setLocation] = useState('Main Turnstile Gate 1');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    onReportIncident({
      incidentNumber: `SEC-INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location,
      category,
      description,
      reportedBy: 'Officer Rajesh Kumar',
      status: 'Open',
      actionTaken: actionTaken || 'Incident logged, barrier secured, supervisory notification filed.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Report Security Incident</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Incident Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="INVALID_PASS">Invalid / Forged Gate Pass</option>
              <option value="UNAUTHORIZED_ENTRY">Unauthorized Entry Attempt</option>
              <option value="VISITOR_ISSUE">Visitor Disturbance / Refusal</option>
              <option value="PROPERTY_DAMAGE">Property Damage / Turnstile Fault</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Perimeter Activity</option>
              <option value="GATE_ISSUE">Barrier Mechanical / Power Fault</option>
              <option value="OTHER">Other Security Incident</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Incident Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what occurred, persons involved, vehicle plates if any..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Immediate Action Taken</label>
            <input
              type="text"
              placeholder="e.g. Denied entry at turnstile, notified Warden Dr. Mohapatra"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              File Incident Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 6. LOST & FOUND MODAL
// ===================================================================
export function LostFoundModal({
  isOpen,
  onClose,
  onSaveItem,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: Partial<SecurityLostFound>) => void;
}) {
  const [itemType, setItemType] = useState<'LOST' | 'FOUND'>('FOUND');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Main Turnstile Gate');
  const [reportedBy, setReportedBy] = useState('Security Officer');
  const [reportedByPhone, setReportedByPhone] = useState('+91 94370 88214');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;

    onSaveItem({
      itemType,
      itemName,
      description,
      location,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      reportedBy,
      reportedByPhone,
      status: itemType === 'FOUND' ? 'Found' : 'Reported',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Search className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Log Lost or Found Item</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setItemType('FOUND')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                itemType === 'FOUND' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Found Item (Custody at Gate)
            </button>
            <button
              type="button"
              onClick={() => setItemType('LOST')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                itemType === 'LOST' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Lost Item Report
            </button>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Casio Calculator / Student ID / Blue Key bunch"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description / Distinguishing Marks</label>
            <textarea
              rows={2}
              placeholder="Color, model number, stickers, tag label..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Location Found / Lost</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Reported By</label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={reportedByPhone}
                onChange={(e) => setReportedByPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Save to Gate Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 7. SECURITY HELP & SOP MODAL
// ===================================================================
export function SecurityHelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-[#0a192f] to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm">Security Command SOP & Hotlines</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
            <h4 className="font-black text-blue-900">Standard Gate Pass Clearance SOP</h4>
            <p className="text-slate-600 leading-relaxed">
              1. Scan student turnstile QR token or enter pass token manually.
              <br />
              2. Verify student photo, room number, destination, and curfew return time.
              <br />
              3. Click <strong>[ CONFIRM EXIT ]</strong>. The student presence updates immediately to OUTSIDE across Student & Warden desks.
              <br />
              4. When student returns, scan again and click <strong>[ CONFIRM RETURN ]</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
              Emergency Escalation Directory
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Campus Pharmacy & 24x7 Ambulance</p>
                  <p className="text-[10px] text-slate-400">Chief Medical Officer & Trauma Transit</p>
                </div>
                <a href="tel:+919437000108" className="font-mono font-bold text-rose-600">
                  +91 94370 00108
                </a>
              </div>

              <div className="p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Chief Security Officer (CSO)</p>
                  <p className="text-[10px] text-slate-400">Col. A. K. Ray (Perimeter & Rapid Response)</p>
                </div>
                <a href="tel:+919437088214" className="font-mono font-bold text-blue-600">
                  +91 94370 88214
                </a>
              </div>

              <div className="p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Nilgiri Hostel Warden Desk</p>
                  <p className="text-[10px] text-slate-400">Dr. M. Mohapatra (Block A & B Admin)</p>
                </div>
                <a href="tel:+919437088210" className="font-mono font-bold text-emerald-600">
                  +91 94370 88210
                </a>
              </div>

              <div className="p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Subham Pradhan Parent (Father)</p>
                  <p className="text-[10px] text-slate-400">Parental Direct Contact for Room A-204</p>
                </div>
                <a href="tel:+919437088990" className="font-mono font-bold text-indigo-600">
                  +91 94370 88990
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs cursor-pointer"
          >
            Close SOP Guide
          </button>
        </div>
      </div>
    </div>
  );
}
