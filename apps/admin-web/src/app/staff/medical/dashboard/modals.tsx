'use client';

import React, { useState } from 'react';
import {
  X,
  Check,
  Heart,
  Stethoscope,
  AlertTriangle,
  Clock,
  User,
  Pill,
  Ambulance,
  FileText,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Phone,
  Building,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import {
  MedicalRequest,
  MedicalRequestType,
  MedicalUrgency,
  MedicalRequestStatus,
  MedicalAppointment,
  MedicalLeaveRecord,
  MedicineInventoryItem,
  AmbulanceReferralRecord,
} from './types';

// ===================================================================
// 1. CREATE MEDICAL REQUEST MODAL
// ===================================================================
export function CreateMedicalRequestModal({
  isOpen,
  onClose,
  onCreateRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateRequest: (req: Partial<MedicalRequest>) => void;
}) {
  const [studentName, setStudentName] = useState('Subham Pradhan');
  const [studentRoll, setStudentRoll] = useState('REC-2023-CS042');
  const [hostel, setHostel] = useState('Nilgiri Residence (Block A)');
  const [room, setRoom] = useState('A-204');
  const [requestType, setRequestType] = useState<MedicalRequestType>('Doctor Consultation');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<MedicalUrgency>('MEDIUM');
  const [bp, setBp] = useState('120/80');
  const [temp, setTemp] = useState('98.6°F');
  const [spo2, setSpo2] = useState('99%');
  const [pulse, setPulse] = useState('76 bpm');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    onCreateRequest({
      ticketNumber: `MR-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName,
      studentId: 'CS2023042',
      studentRoll,
      studentPhone: '+91 98765 43210',
      parentPhone: '+91 94370 88990',
      hostel,
      room,
      requestType,
      description,
      urgency,
      vitals: { bp, temp, spo2, pulse },
      dateTime: 'Just now',
      status: 'New',
      attendingStaff: 'Dr. Pratima Mishra, MD',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Heart className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Register Campus Medical Request</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student Patient</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hostel</label>
              <input
                type="text"
                required
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Room Number</label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Doctor Consultation">Doctor Consultation</option>
                <option value="Nurse / First Aid">Nurse / First Aid</option>
                <option value="Medical Leave">Medical Leave Recommendation</option>
                <option value="Emergency">Emergency Triage</option>
                <option value="Ambulance">24x7 Ambulance Request</option>
                <option value="Other">Other Clinical Service</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Triage Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="LOW">Low (Routine Checkup)</option>
                <option value="MEDIUM">Medium (Mild symptoms)</option>
                <option value="HIGH">High (High fever / Intense pain)</option>
                <option value="EMERGENCY">Emergency (Immediate doctor dispatch)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Vitals (Optional at intake)</label>
            <div className="grid grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="BP: 120/80"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center"
              />
              <input
                type="text"
                placeholder="Temp: 98.6°F"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center"
              />
              <input
                type="text"
                placeholder="SpO2: 99%"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center"
              />
              <input
                type="text"
                placeholder="Pulse: 74 bpm"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-center"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Chief Symptoms & Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe symptoms, duration, fever temperature, allergies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Register Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 2. CONSULTATION & DIAGNOSIS MODAL
// ===================================================================
export function ConsultationDiagnosisModal({
  request,
  isOpen,
  onClose,
  onSaveConsultation,
}: {
  request: MedicalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveConsultation: (
    reqId: string,
    status: MedicalRequestStatus,
    prescription: string,
    doctorNotes: string,
    medicalLeaveRecommended: boolean,
    leaveDays?: number
  ) => void;
}) {
  const [prescription, setPrescription] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [leaveRecommended, setLeaveRecommended] = useState(false);
  const [leaveDays, setLeaveDays] = useState(2);

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConsultation(
      request.id,
      'Completed',
      prescription || 'Symptomatic medication prescribed at pharmacy',
      doctorNotes || 'Consultation complete. Patient advised rest and fluid intake.',
      leaveRecommended,
      leaveRecommended ? leaveDays : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Stethoscope className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-extrabold text-sm">Record Medical Consultation</h3>
              <p className="text-[11px] text-blue-200">{request.studentName} ({request.studentRoll})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900">{request.hostel} • Room {request.room}</p>
            <p className="text-slate-600">{request.description}</p>
            {request.vitals && (
              <p className="font-mono text-[11px] text-blue-700 font-bold mt-1">
                BP: {request.vitals.bp || '120/80'} | Temp: {request.vitals.temp || '98.6°F'} | SpO2: {request.vitals.spo2 || '99%'} | Pulse: {request.vitals.pulse || '76'}
              </p>
            )}
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Prescription & Medications</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Tab Dolo 650mg TDS x 3d, Tab Levocetirizine 5mg HS, ORS sachets"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Clinical Observations & Doctor Notes</label>
            <textarea
              required
              rows={2}
              placeholder="Diagnosis details, clinical assessment, dietary recommendations..."
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          {/* Medical Leave Recommendation Toggle */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveRecommended}
                onChange={(e) => setLeaveRecommended(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="font-bold text-slate-900">
                Recommend Hostel Bed Rest / Medical Leave to Warden
              </span>
            </label>

            {leaveRecommended && (
              <div className="flex items-center space-x-3 pt-1">
                <span className="text-slate-600">Recommended Duration:</span>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-20 p-2 bg-white border border-slate-200 rounded-xl font-bold text-center"
                />
                <span className="text-slate-600 font-bold">Days</span>
                <span className="text-[10px] text-slate-400 italic">
                  (Only operational dates synced with Warden; diagnosis remains confidential)
                </span>
              </div>
            )}
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
              Save Consultation & Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 3. SCHEDULE APPOINTMENT MODAL
// ===================================================================
export function ScheduleAppointmentModal({
  isOpen,
  onClose,
  onSchedule,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (apt: Partial<MedicalAppointment>) => void;
}) {
  const [studentName, setStudentName] = useState('Subham Pradhan');
  const [studentRoll, setStudentRoll] = useState('REC-2023-CS042');
  const [hostel, setHostel] = useState('Nilgiri Block A');
  const [room, setRoom] = useState('A-204');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [doctorName, setDoctorName] = useState('Dr. Pratima Mishra, MD');
  const [slotTime, setSlotTime] = useState('11:00 AM');
  const [slotDate, setSlotDate] = useState('Today');
  const [symptoms, setSymptoms] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      appointmentNumber: `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentName,
      studentRoll,
      hostel,
      room,
      phone,
      doctorName,
      specialty: 'General Medicine & Clinical Triage',
      slotTime,
      slotDate,
      status: 'SCHEDULED',
      symptoms: symptoms || 'General Medical Consultation',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Schedule Clinical Appointment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student Patient</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Doctor</label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Dr. Pratima Mishra, MD">Dr. Pratima Mishra, MD (CMO)</option>
                <option value="Dr. K. C. Mohanty (Consultant Ortho)">Dr. K. C. Mohanty (Ortho)</option>
                <option value="Nurse Snehalata Sahoo (First Aid)">Nurse Snehalata Sahoo (First Aid)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Slot Time</label>
              <select
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Symptoms / Purpose</label>
            <input
              type="text"
              required
              placeholder="e.g. Follow-up fever check / Blood pressure review"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 4. DISPATCH 24x7 AMBULANCE & REFERRAL MODAL
// ===================================================================
export function AmbulanceReferralModal({
  isOpen,
  onClose,
  onDispatch,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDispatch: (ref: Partial<AmbulanceReferralRecord>) => void;
}) {
  const [studentName, setStudentName] = useState('Pritam Mohanty');
  const [studentRoll, setStudentRoll] = useState('REC-2023-CS044');
  const [hostel, setHostel] = useState('Nilgiri Block A');
  const [room, setRoom] = useState('A-210');
  const [destinationHospital, setDestinationHospital] = useState('AIIMS Bhubaneswar Emergency Surgical Wing');
  const [referralReason, setReferralReason] = useState('Acute abdominal emergency / surgical assessment');
  const [accompanyingStaff, setAccompanyingStaff] = useState('Nurse Staff & Campus Attendant');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDispatch({
      referralNumber: `REF-2026-${Math.floor(10 + Math.random() * 90)}`,
      studentName,
      studentRoll,
      hostel,
      room,
      dispatchTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      vehicleNumber: 'OD-02-AMB-108 (Campus 24x7 Ambulance)',
      driverName: 'Kailash Nayak',
      driverPhone: '+91 94370 00108',
      destinationHospital,
      referralReason,
      accompanyingStaff,
      emergencyContactCalled: true,
      status: 'DISPATCHED',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ambulance className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Dispatch 24x7 Emergency Ambulance</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Student</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Roll / Room</label>
              <input
                type="text"
                required
                value={`${studentRoll} (${room})`}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Destination Referral Hospital</label>
            <select
              value={destinationHospital}
              onChange={(e) => setDestinationHospital(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="AIIMS Bhubaneswar Emergency Surgical Wing">AIIMS Bhubaneswar Emergency (4.2 km)</option>
              <option value="Capital Hospital (Trauma & Ortho Care)">Capital Hospital Trauma Center (6.5 km)</option>
              <option value="KIMS Super Specialty Hospital">KIMS Medical College & Hospital (8.0 km)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Referral Reason (Operational cause)</label>
            <input
              type="text"
              required
              value={referralReason}
              onChange={(e) => setReferralReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="bg-red-50 p-3 rounded-2xl border border-red-200 space-y-1">
            <p className="font-bold text-red-900">Vehicle: OD-02-AMB-108 (Campus Vehicle)</p>
            <p className="font-mono text-red-800 text-[11px]">Driver: Kailash Nayak (+91 94370 00108)</p>
            <p className="text-red-700 text-[10px]">Turnstile Gate 1 will automatically be alerted for barrier clearance.</p>
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
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Dispatch Ambulance Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 5. ADD MEDICINE INVENTORY MODAL
// ===================================================================
export function AddMedicineModal({
  isOpen,
  onClose,
  onAddMedicine,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (item: Partial<MedicineInventoryItem>) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MedicineInventoryItem['category']>('Antipyretic');
  const [dosage, setDosage] = useState('650mg Tab');
  const [quantity, setQuantity] = useState(50);
  const [minStock, setMinStock] = useState(20);
  const [expiryDate, setExpiryDate] = useState('12/2027');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddMedicine({
      code: `MED-${Date.now().toString().slice(-5)}`,
      name,
      category,
      dosage,
      quantity,
      unit: 'Strips',
      minStock,
      expiryDate,
      isLowStock: quantity <= minStock,
      isExpiringSoon: false,
      location: 'Pharmacy Cabinet A',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="w-5 h-5 text-white" />
            <h3 className="font-extrabold text-sm">Add Pharmacy Medicine Stock</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Medicine Commercial Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Paracetamol (Dolo 650mg)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Antipyretic">Antipyretic (Fever)</option>
                <option value="Analgesic">Analgesic (Pain)</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antihistamine">Antihistamine (Allergy)</option>
                <option value="Electrolyte">Electrolyte / ORS</option>
                <option value="First Aid">First Aid / Antiseptic</option>
                <option value="Ointment">Topical Ointment</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dosage Form</label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantity</label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Threshold</label>
              <input
                type="number"
                min={1}
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
            >
              Add to Pharmacy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ===================================================================
// 6. MEDICAL HELP & DIRECTORY MODAL
// ===================================================================
export function MedicalHelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-extrabold text-sm">Medical Center Protocols & Directory</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 cursor-pointer">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl space-y-1">
            <h4 className="font-extrabold text-red-900 text-xs">24x7 Emergency Escalation Protocol</h4>
            <p className="text-red-800">
              1. <strong>Severe Trauma / Chest Pain / Unconsciousness:</strong> Call 24x7 Ambulance driver immediately (+91 94370 00108).<br />
              2. <strong>Notify Main Gate Security:</strong> Fast clearance at Gate 1 turnstile barrier.<br />
              3. <strong>Notify Hostel Warden:</strong> Inform for guardian contact & attendance excuse.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-900">Emergency Telephone Contacts</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Campus 24x7 Ambulance</p>
                <p className="font-mono text-rose-600 font-bold">+91 94370 00108</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Chief Medical Officer</p>
                <p className="font-mono text-blue-600 font-bold">+91 94370 88219</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">AIIMS Bhubaneswar Emergency</p>
                <p className="font-mono text-slate-800 font-bold">0674-2476789</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Hostel Warden Control</p>
                <p className="font-mono text-slate-800 font-bold">+91 94370 88210</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-600 space-y-1">
            <h4 className="font-extrabold text-slate-900">Medical Privacy Compliance</h4>
            <p>• Only necessary operational dates and fitness status are shared with Hostel Wardens.</p>
            <p>• Detailed diagnosis, clinical notes, and private prescriptions remain strictly confidential within the Medical Center.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
