export type MedicalTab =
  | 'DASHBOARD'
  | 'MEDICAL_REQUESTS'
  | 'EMERGENCY'
  | 'APPOINTMENTS'
  | 'MEDICAL_VISITS'
  | 'MEDICAL_LEAVE'
  | 'INVENTORY'
  | 'AMBULANCE'
  | 'REPORTS'
  | 'SETTINGS';

export type MedicalRequestType =
  | 'Doctor Consultation'
  | 'Nurse / First Aid'
  | 'Medical Leave'
  | 'Emergency'
  | 'Ambulance'
  | 'Other';

export type MedicalUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type MedicalRequestStatus =
  | 'New'
  | 'Accepted'
  | 'In Progress'
  | 'Completed'
  | 'Closed';

export interface MedicalRequest {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentId: string;
  studentRoll: string;
  studentPhone: string;
  parentPhone: string;
  hostel: string;
  room: string;
  requestType: MedicalRequestType;
  description: string;
  urgency: MedicalUrgency;
  vitals?: {
    bp?: string;
    temp?: string;
    spo2?: string;
    pulse?: string;
  };
  dateTime: string;
  status: MedicalRequestStatus;
  attendingStaff?: string;
  prescription?: string;
  doctorNotes?: string;
  medicalLeaveRecommended?: boolean;
  medicalLeaveDays?: number;
}

export interface MedicalAppointment {
  id: string;
  appointmentNumber: string;
  studentName: string;
  studentRoll: string;
  hostel: string;
  room: string;
  phone: string;
  doctorName: string;
  specialty: string;
  slotTime: string;
  slotDate: string;
  status: 'SCHEDULED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
}

export interface MedicalVisitRecord {
  id: string;
  visitNumber: string;
  studentName: string;
  studentRoll: string;
  hostel: string;
  room: string;
  visitDate: string;
  visitTime: string;
  diagnosis: string;
  treatment: string;
  prescribedMedicines: string[];
  followUpDate?: string;
  attendingDoctor: string;
}

export interface MedicalLeaveRecord {
  id: string;
  leaveNumber: string;
  studentName: string;
  studentRoll: string;
  hostel: string;
  room: string;
  startDate: string;
  endDate: string;
  days: number;
  operationalReason: string; // Exposes only necessary summary (e.g. "Viral Recuperation - Bed Rest Recommended")
  medicalStatus: 'RECOMMENDED' | 'APPROVED_BY_WARDEN' | 'ACTIVE' | 'EXPIRED' | 'REJECTED';
  recommendedBy: string;
  wardenNotified: boolean;
  isFitToResume: boolean;
}

export interface MedicineInventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Analgesic' | 'Antibiotic' | 'Antihistamine' | 'Antipyretic' | 'Ointment' | 'First Aid' | 'Electrolyte';
  dosage: string;
  quantity: number;
  unit: string;
  minStock: number;
  expiryDate: string;
  isLowStock: boolean;
  isExpiringSoon: boolean;
  location: string;
}

export interface AmbulanceReferralRecord {
  id: string;
  referralNumber: string;
  studentName: string;
  studentRoll: string;
  hostel: string;
  room: string;
  dispatchTime: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  destinationHospital: string;
  referralReason: string; // High-level operational cause (e.g. "Acute Abdominal Colic for Ultrasound")
  accompanyingStaff: string;
  emergencyContactCalled: boolean;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ADMITTED' | 'DISCHARGED' | 'COMPLETED';
}

export interface MedicalReportItem {
  id: string;
  name: string;
  category: string;
  recordCount: number;
  description: string;
  generatedDate: string;
  format: 'PDF' | 'CSV';
}

export interface MedicalOfficerProfile {
  name: string;
  badgeId: string;
  designation: string;
  qualifications: string;
  department: string;
  phone: string;
  ambulanceHelpline: string;
  shift: string;
  clinicBay: string;
  avatarUrl: string;
}
