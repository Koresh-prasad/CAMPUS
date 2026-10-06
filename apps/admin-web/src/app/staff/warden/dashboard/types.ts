export type WardenTab =
  | 'DASHBOARD'
  | 'MY_HOSTEL'
  | 'RESIDENTS'
  | 'ROOMS_BEDS'
  | 'LEAVE_REQUESTS'
  | 'GATE_PASS'
  | 'STUDENT_MOVEMENT'
  | 'VISITORS'
  | 'COMPLAINTS'
  | 'MAINTENANCE'
  | 'NIGHT_ROLL_CALL'
  | 'NOTICES'
  | 'DISCIPLINE_INCIDENTS'
  | 'EMERGENCY'
  | 'REPORTS'
  | 'PROFILE_SETTINGS'
  // Legacy aliases for backward compatibility
  | 'ACCOUNT'
  | 'GATE_PASS_LEAVE'
  | 'CURFEW_ROLL_CALL'
  | 'RESIDENTS_ROOMS'
  | 'HOSTEL_COMPLAINTS'
  | 'MESS_MANAGEMENT'
  | 'DISCIPLINE_WELFARE'
  | 'EMERGENCY_SAFETY'
  | 'NOTICES_NOTIFICATIONS'
  | 'FACILITY_TIMINGS'
  | 'REQUESTS_APPROVALS'
  | 'WARDEN_SERVICES'
  | 'REPORTS_ANALYTICS'
  | 'ACCESSIBILITY';

export type Language = 'EN' | 'HI' | 'OD';

export interface WardenProfile {
  id: string;
  name: string;
  empId: string;
  email: string;
  phone: string;
  designation: string;
  assignedHostel: string;
  assignedBlocks: string[];
  officeRoom: string;
  avatarUrl: string;
  qualification: string;
  experienceYears: number;
  emergencyContact: string;
  dutyShift: string;
  bio: string;
}

export type PassType = 'DAY_PASS' | 'NIGHT_LEAVE' | 'EMERGENCY_PASS' | 'WEEKEND_PASS' | 'LOCAL_OUTING';
export type PassStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'OUT' | 'RETURNED' | 'OVERDUE';
export type ParentConsent = 'CONFIRMED' | 'PENDING' | 'OTP_VERIFIED';

export interface GatePass {
  id: string;
  passNumber: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  blockName: string;
  course: string;
  year: string;
  type: PassType;
  destination: string;
  reason: string;
  departureDate: string;
  departureTime: string;
  expectedReturnDate: string;
  expectedReturnTime: string;
  actualDepartureTime?: string;
  actualReturnTime?: string;
  status: PassStatus;
  rejectionReason?: string;
  parentConsent: ParentConsent;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  pastPassesCount: number;
  qrToken: string;
  isLateNight: boolean;
  overdueMinutes?: number;
  appliedAt: string;
}

export type PresenceStatus = 'IN_HOSTEL' | 'OUT_ON_PASS' | 'ON_LEAVE' | 'OVERDUE';

export interface Resident {
  id: string;
  studentId: string;
  name: string;
  roomNumber: string;
  bedNumber: string;
  blockName: string;
  hostelName: string;
  branch: string;
  year: string;
  phone: string;
  email: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  presenceStatus: PresenceStatus;
  bloodGroup: string;
  avatarUrl: string;
  duesPending: number;
  kycStatus: 'VERIFIED' | 'PENDING';
  emergencyContact: string;
  checkInDate?: string;
  semester?: string;
}

export interface Bed {
  bedNumber: string;
  isOccupied: boolean;
  residentName?: string;
  studentId?: string;
}

export interface Room {
  roomNumber: string;
  blockName: string;
  floor: number;
  capacity: number;
  occupiedCount: number;
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE';
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE' | 'PARTIALLY_OCCUPIED' | 'RESERVED';
  beds: Bed[];
  inventory: {
    fans: number;
    lights: number;
    tables: number;
    chairs: number;
    cupboards: number;
    condition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR';
  };
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentRoom: string;
  requestedRoom: string;
  reason: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  conflictNote?: string;
}

export interface RollCallEntry {
  studentId: string;
  name: string;
  roomNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_PASS' | 'ON_LEAVE';
  remark?: string;
  guardianAlertSent?: boolean;
}

export interface RollCallRecord {
  id: string;
  date: string;
  blockName: string;
  floor: string;
  conductedBy: string;
  timeTaken: string;
  totalResidents: number;
  presentCount: number;
  absentCount: number;
  onPassCount: number;
  entries: RollCallEntry[];
}

export interface CurfewViolation {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  blockName: string;
  date: string;
  expectedTime: string;
  actualEntryTime: string;
  lateMinutes: number;
  reason: string;
  violationCount: number;
  isRepeatViolator: boolean;
  penaltyStatus: 'WARNING_ISSUED' | 'FINE_PENDING' | 'PARENT_CALLED' | 'RESOLVED';
}

export type ComplaintCategory =
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'WIFI_INTERNET'
  | 'CLEANING'
  | 'FURNITURE'
  | 'APPLIANCE'
  | 'WATER'
  | 'ROOM'
  | 'HOSTEL'
  | 'MESS'
  | 'OTHER';

export type ComplaintStatus = 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface HostelComplaint {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentId?: string;
  roomNumber: string;
  blockName: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | 'CRITICAL';
  assignedTo?: string;
  technicianPhone?: string;
  createdAt: string;
  ageDays: number;
  isOverdue: boolean;
  isReopened: boolean;
  isRepeat: boolean;
  isAnonymous: boolean;
  resolutionNotes?: string;
}

export interface MessMenuDay {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  specialItem?: string;
  isHoliday?: boolean;
}

export interface MessFeedback {
  rating: number;
  totalReviews: number;
  cleanlinessScore: number;
  tasteScore: number;
  portionScore: number;
  openQualityComplaints: number;
}

export interface MealChangeRequest {
  id: string;
  studentName: string;
  studentId: string;
  roomNumber: string;
  type: 'SKIP_MEAL' | 'EXTRA_GUEST_MEAL';
  mealDate: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  guestCount?: number;
  status: 'APPROVED' | 'PENDING';
}

export interface VisitorRequest {
  id: string;
  visitorName: string;
  relation: string;
  studentName: string;
  studentRoll: string;
  roomNumber: string;
  phone: string;
  idProof: string;
  entryTime: string;
  exitTime?: string;
  purpose: string;
  status: 'Expected' | 'Checked In' | 'Checked Out' | 'Rejected' | 'PENDING' | 'APPROVED' | 'INSIDE' | 'REJECTED';
  date: string;
  isBlacklisted?: boolean;
  isOvernightStay?: boolean;
  securityOfficer?: string;
}

export interface DisciplinaryRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  incidentDate: string;
  incidentTime?: string;
  location?: string;
  category: 'CURFEW' | 'NOISE' | 'RAGGING_CHECK' | 'PROPERTY_DAMAGE' | 'SMOKING_ALCOHOL' | 'DISPUTE' | 'RULE_VIOLATION' | 'UNAUTHORIZED_VISITOR' | 'HOSTEL_MISCONDUCT' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  evidence?: string;
  reportedBy?: string;
  status?: 'Open' | 'Under Review' | 'Resolved' | 'Escalated' | 'Closed';
  actionTaken: string;
  counsellingNotes?: string;
  guardianInformed: boolean;
  guardianContactedOn?: string;
}

export type EmergencyType = 'MEDICAL_SOS' | 'FIRE_ALARM' | 'PHYSICAL_SECURITY' | 'INFRASTRUCTURE' | 'WATER_LEAK' | 'MEDICAL' | 'SECURITY' | 'FIRE' | 'RAGGING' | 'OTHER';
export type EmergencyStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESPONDING' | 'RESOLVED' | 'ACTIVE';

export interface HostelEmergency {
  id: string;
  type: EmergencyType;
  studentName?: string;
  studentId?: string;
  roomNumber?: string;
  blockName: string;
  timestamp: string;
  status: EmergencyStatus;
  assignedResponder?: 'SECURITY' | 'MEDICAL_DISPATCH' | 'AMBULANCE' | 'FIRE_SAFETY';
  notes: string;
  responseTimeSeconds?: number;
  locationDetails?: string;
  gpsCoords?: string;
  residentPhone?: string;
  parentPhone?: string;
}

export interface HostelNotice {
  id: string;
  title: string;
  content: string;
  category: 'GENERAL' | 'RULES_CURFEW' | 'MESS_UPDATE' | 'MAINTENANCE' | 'EMERGENCY' | 'INSPECTION';
  targetAudience: 'ALL_HOSTEL' | 'BLOCK_A' | 'BLOCK_B' | 'FIRST_YEAR' | 'SPECIFIC_ROOMS' | string;
  priority?: 'Normal' | 'Important' | 'Urgent';
  date: string;
  deadline?: string;
  isActionRequired: boolean;
  deliveredCount: number;
  readCount: number;
  actionDoneCount: number;
  isPinned: boolean;
  smsFallbackSent: boolean;
}

export interface FacilityTiming {
  id: string;
  facilityName: string;
  standardTimings: string;
  isOpen: boolean;
  openedAt?: string;
  closedAt?: string;
  isTemporaryClosed: boolean;
  closureReason?: string;
}

export interface WardenLeave {
  id: string;
  leaveType: 'CASUAL' | 'DUTY' | 'MEDICAL';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  substituteWarden: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface HostelStaff {
  id: string;
  name: string;
  role: 'ASST_WARDEN' | 'CARETAKER' | 'HEAD_COOK' | 'CLEANER' | 'ELECTRICIAN' | 'PLUMBER' | 'SECURITY_GUARD';
  phone: string;
  shift: string;
  status: 'ON_DUTY' | 'OFF_DUTY' | 'LEAVE';
  currentTask?: string;
}

export type MovementStatus = 'PRESENT' | 'OUTSIDE' | 'ON_LEAVE' | 'EXPECTED_RETURN' | 'OVERDUE';

export interface StudentMovementRecord {
  id: string;
  studentId: string;
  name: string;
  photoUrl: string;
  roomNumber: string;
  blockName: string;
  course: string;
  status: MovementStatus;
  purpose: string;
  destination: string;
  exitTime?: string;
  expectedReturnTime?: string;
  actualReturnTime?: string;
  phone: string;
  guardianPhone: string;
  guardianName: string;
  passType?: string;
  overdueMinutes?: number;
}

export interface LeaveRequestItem {
  id: string;
  leaveNumber: string;
  studentId: string;
  studentName: string;
  photoUrl: string;
  hostelName: string;
  blockName: string;
  roomNumber: string;
  leaveType: 'Home Visit' | 'Medical Leave' | 'Academic / Conference' | 'Festival / Vacation' | 'Emergency Leave';
  reason: string;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  guardianConsent: 'CONFIRMED' | 'PENDING' | 'OTP_VERIFIED';
  guardianName: string;
  guardianPhone: string;
  studentPhone: string;
  supportingDocUrl?: string;
}

export interface MaintenanceTicketItem {
  id: string;
  ticketNumber: string;
  studentName?: string;
  studentId?: string;
  roomNumber: string;
  blockName: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'CIVIL' | 'FURNITURE' | 'AC_COOLER' | 'HOUSEKEEPING' | 'OTHER';
  title: string;
  description: string;
  photoUrl?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaDueHours: number;
  isOverdue?: boolean;
}

export interface HostelReportItem {
  id: string;
  name: string;
  category:
    | 'OCCUPANCY'
    | 'RESIDENTS'
    | 'LEAVE'
    | 'GATE_PASS'
    | 'MOVEMENT'
    | 'LATE_RETURN'
    | 'VISITORS'
    | 'COMPLAINTS'
    | 'MAINTENANCE'
    | 'INCIDENTS'
    | 'ROLL_CALL';
  description: string;
  generatedDate: string;
  recordCount: number;
  status: 'READY' | 'GENERATING';
  format: 'PDF' | 'CSV';
}
