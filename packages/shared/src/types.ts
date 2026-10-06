export enum UserRole {
  DIRECTOR = 'DIRECTOR',
  WARDEN = 'WARDEN',
  SECURITY = 'SECURITY',
  ACCOUNTS = 'ACCOUNTS',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

export enum ComplaintCategory {
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  SECURITY = 'SECURITY',
  PARKING = 'PARKING',
  HOUSEKEEPING = 'HOUSEKEEPING',
  CLEANLINESS = 'CLEANLINESS',
  WIFI = 'WIFI',
  MESS_CANTEEN = 'MESS_CANTEEN',
  FURNITURE = 'FURNITURE',
  ROOMMATE = 'ROOMMATE',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER'
}

export enum ComplaintStatus {
  RAISED = 'RAISED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED'
}

export enum PassType {
  GATE_PASS = 'GATE_PASS',
  EXIT_PASS = 'EXIT_PASS',
  LEAVE = 'LEAVE'
}

export enum PassStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  RETURNED = 'RETURNED'
}

export enum EmergencyType {
  MEDICAL = 'MEDICAL',
  FIRE = 'FIRE',
  SECURITY_THREAT = 'SECURITY_THREAT',
  OTHER = 'OTHER'
}

export enum EmergencyStatus {
  ACTIVE = 'ACTIVE',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  FALSE_ALARM = 'FALSE_ALARM'
}

export enum VisitorStatus {
  PRE_APPROVED = 'PRE_APPROVED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  OVERSTAYED = 'OVERSTAYED',
  REJECTED = 'REJECTED'
}

export enum BillStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE'
}

export enum NoticeCategory {
  GENERAL = 'GENERAL',
  ACADEMIC = 'ACADEMIC',
  EMERGENCY = 'EMERGENCY',
  EVENT = 'EVENT',
  MAINTENANCE = 'MAINTENANCE'
}

export enum AmenityType {
  GUEST_ROOM = 'GUEST_ROOM',
  SPORTS_EQUIPMENT = 'SPORTS_EQUIPMENT',
  FUNCTION_HALL = 'FUNCTION_HALL',
  LAUNDRY = 'LAUNDRY',
  STUDY_ROOM = 'STUDY_ROOM'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  tenantId: string;
  hostelId?: string;
  roomNumber?: string;
  blockName?: string;
  bloodGroup?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  idProofNumber?: string;
  kycComplete?: boolean;
}

export interface ComplaintItem {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  residentId: string;
  residentName: string;
  roomNumber: string;
  blockName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  photoUrl?: string;
  isAnonymous: boolean;
  slaHours: number;
  slaDueAt: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  rating?: number;
  ratingComment?: string;
}

export interface PassItem {
  id: string;
  passType: PassType;
  residentId: string;
  residentName: string;
  roomNumber: string;
  blockName: string;
  reason: string;
  destination: string;
  validFrom: string;
  validTill: string;
  status: PassStatus;
  qrCodeToken: string;
  approvedById?: string;
  approvedByName?: string;
  rejectionReason?: string;
  actualExitAt?: string;
  actualReturnAt?: string;
  isOverdue?: boolean;
  createdAt: string;
}

export interface EmergencyAlertItem {
  id: string;
  emergencyType: EmergencyType;
  status: EmergencyStatus;
  residentId: string;
  residentName: string;
  roomNumber: string;
  blockName: string;
  locationDetails?: string;
  gpsCoords?: string;
  notes?: string;
  resolvedById?: string;
  resolvedByName?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface VisitorItem {
  id: string;
  visitorName: string;
  visitorPhone: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  purpose: string;
  expectedDate: string;
  expectedTime: string;
  checkInAt?: string;
  checkOutAt?: string;
  status: VisitorStatus;
  qrPassCode: string;
  isRegularVisitor: boolean;
  overstayMinutes?: number;
  idProofUrl?: string;
}

export interface VehicleItem {
  id: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  vehicleType: 'TWO_WHEELER' | 'FOUR_WHEELER' | 'BICYCLE';
  licensePlate: string;
  model: string;
  parkingSlot?: string;
  digitalPassQr: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  isPinned: boolean;
  isEmergencyAlert: boolean;
  authorName: string;
  targetAudience: string; // e.g. "ALL", "NILGIRI_BLOCK", "FIRST_YEAR"
  createdAt: string;
  expiresAt?: string;
}

export interface PollItem {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  hasVoted?: boolean;
  userVotedOptionId?: string;
  createdAt: string;
  deadline: string;
}

export interface MenuItemSchedule {
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  breakfast: string[];
  lunch: string[];
  snacks: string[];
  dinner: string[];
  specialItem?: string;
}

export interface BillItem {
  id: string;
  residentId: string;
  residentName: string;
  roomNumber: string;
  title: string;
  rentAmount: number;
  messAmount: number;
  electricityAmount: number;
  maintenanceAmount: number;
  fineAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: BillStatus;
  dueDate: string;
  invoiceNumber: string;
  paymentHistory: {
    id: string;
    amount: number;
    transactionRef: string;
    method: string;
    paidAt: string;
  }[];
}

export interface CurfewViolation {
  residentId: string;
  residentName: string;
  roomNumber: string;
  blockName: string;
  phone: string;
  parentPhone?: string;
  lastKnownStatus: 'ON_APPROVED_LEAVE' | 'GATE_PASS_EXPIRED' | 'UNACCOUNTED_ABSENCE';
  passId?: string;
  expectedReturn?: string;
  minutesOverdue: number;
}
