export type SecurityTab =
  | 'DASHBOARD'
  | 'QR_SCANNER'
  | 'GATE_PASSES'
  | 'ENTRY_EXIT'
  | 'VISITORS'
  | 'VEHICLES'
  | 'PARCELS'
  | 'INCIDENTS'
  | 'EMERGENCY'
  | 'LOST_FOUND'
  | 'GATE_LOGS'
  | 'REPORTS'
  | 'SETTINGS';

export interface GatePassScanResult {
  token: string;
  isValid: boolean;
  canConfirmExit: boolean;
  canConfirmReturn: boolean;
  status: 'VALID' | 'INVALID' | 'EXPIRED' | 'REVOKED' | 'PENDING' | 'ALREADY_OUT';
  message: string;
  passId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  photoUrl: string;
  hostel: string;
  roomNumber: string;
  purpose: string;
  destination: string;
  exitTime: string;
  expectedReturnTime: string;
  actualExitTime?: string;
  parentConsent: string;
  passType: string;
  rejectionReason?: string;
  scanTimestamp: string;
}

export interface SecurityGatePass {
  id: string;
  passNumber: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  photoUrl: string;
  hostel: string;
  roomNumber: string;
  phone: string;
  guardianPhone: string;
  passType: 'DAY_PASS' | 'NIGHT_LEAVE' | 'WEEKEND_PASS' | 'EMERGENCY_PASS' | 'LOCAL_OUTING';
  destination: string;
  reason: string;
  approvedBy: string;
  validDate: string;
  expectedExitTime: string;
  expectedReturnTime: string;
  actualExitTime?: string;
  actualReturnTime?: string;
  status: 'APPROVED' | 'OUT' | 'RETURNED' | 'OVERDUE' | 'REJECTED' | 'PENDING';
  qrToken: string;
  parentConsent: 'CONFIRMED' | 'PENDING' | 'OTP_VERIFIED';
}

export interface StudentEntryExitLog {
  id: string;
  timestamp: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  photoUrl: string;
  hostel: string;
  room: string;
  gate: string;
  direction: 'EXIT' | 'ENTRY';
  securityOfficer: string;
  passId: string;
  status: 'AUTHORIZED' | 'OVERDUE_ENTRY' | 'FLAGGED';
}

export interface SecurityVisitor {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  idType: 'Aadhaar' | 'Driving License' | 'Voter ID' | 'Passport' | 'College ID';
  idNumber: string;
  studentVisited: string;
  studentRoll: string;
  studentRoom: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  securityOfficer: string;
  vehicleNumber?: string;
  status: 'Expected' | 'Checked In' | 'Checked Out' | 'Rejected';
  passNumber?: string;
}

export interface SecurityVehicle {
  id: string;
  plateNumber: string;
  vehicleType: 'Two-Wheeler' | 'Sedan Car' | 'SUV' | 'Campus Shuttle' | 'Delivery Van' | 'Ambulance' | 'Auto / Cab';
  driverName: string;
  driverPhone: string;
  ownerType: 'STUDENT' | 'STAFF' | 'VISITOR' | 'TRANSIT' | 'DELIVERY';
  purpose: string;
  entryTime: string;
  exitTime?: string;
  gate: string;
  securityOfficer: string;
  status: 'INSIDE' | 'EXITED';
}

export interface SecurityParcel {
  id: string;
  company: 'Amazon' | 'Flipkart' | 'BlueDart' | 'DTDC' | 'India Post' | 'Swiggy/Zomato' | 'Courier' | 'Other';
  parcelNumber: string;
  recipientName: string;
  recipientType: 'STUDENT' | 'STAFF';
  recipientPhone: string;
  roomOrDept: string;
  hostelName?: string;
  entryTime: string;
  collectionTime?: string;
  status: 'Received' | 'Waiting' | 'Collected' | 'Returned';
  securityOfficer: string;
}

export interface SecurityIncident {
  id: string;
  incidentNumber: string;
  date: string;
  time: string;
  location: string;
  category:
    | 'UNAUTHORIZED_ENTRY'
    | 'INVALID_PASS'
    | 'VISITOR_ISSUE'
    | 'PROPERTY_DAMAGE'
    | 'SUSPICIOUS_ACTIVITY'
    | 'LOST_ITEM'
    | 'GATE_ISSUE'
    | 'OTHER';
  description: string;
  evidencePhotoUrl?: string;
  reportedBy: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Escalated' | 'Closed';
  actionTaken: string;
}

export interface SecurityEmergency {
  id: string;
  studentName: string;
  studentRoll: string;
  studentId: string;
  hostel: string;
  room: string;
  phone: string;
  parentPhone: string;
  emergencyType: 'MEDICAL' | 'SECURITY' | 'FIRE' | 'RAGGING' | 'OTHER';
  timestamp: string;
  locationDetails: string;
  notes: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
}

export interface SecurityLostFound {
  id: string;
  itemType: 'LOST' | 'FOUND';
  itemName: string;
  description: string;
  location: string;
  date: string;
  time: string;
  photoUrl?: string;
  reportedBy: string;
  reportedByPhone: string;
  status: 'Reported' | 'Found' | 'Under Verification' | 'Claimed' | 'Returned' | 'Closed';
  claimedBy?: string;
  claimedDate?: string;
}

export interface SecurityGateLog {
  id: string;
  timestamp: string;
  personName: string;
  category: 'STUDENT' | 'VISITOR' | 'STAFF' | 'VEHICLE' | 'DELIVERY';
  direction: 'ENTRY' | 'EXIT';
  gate: string;
  passOrVisitorId: string;
  securityOfficer: string;
  status: 'GRANTED' | 'DENIED' | 'OVERDUE';
}

export interface SecurityReportItem {
  id: string;
  name: string;
  category:
    | 'DAILY_ENTRY'
    | 'DAILY_EXIT'
    | 'GATE_PASS'
    | 'VISITORS'
    | 'OVERDUE_RETURNS'
    | 'VEHICLES'
    | 'INCIDENTS'
    | 'EMERGENCY'
    | 'GATE_ACTIVITY';
  recordCount: number;
  description: string;
  generatedDate: string;
  format: 'PDF' | 'CSV';
}

export interface SecurityOfficerProfile {
  name: string;
  badgeId: string;
  designation: string;
  gatePost: string;
  phone: string;
  shift: string;
  emergencyContact: string;
  supervisorName: string;
  avatarUrl: string;
}
