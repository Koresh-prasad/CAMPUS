export type ServiceTab =
  | 'DASHBOARD'
  | 'SERVICE_REQUESTS'
  | 'REQUEST_HISTORY'
  | 'NOTIFICATIONS'
  | 'MAINTENANCE'
  | 'ASSIGNED_TASKS'
  | 'COMPLAINTS'
  | 'INVENTORY'
  | 'REPORTS'
  | 'SETTINGS';

export type ServiceCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Cleaning'
  | 'Sweeper / Cleaning'
  | 'Sweeper'
  | 'Wi-Fi'
  | 'Internet / Wi-Fi'
  | 'Water'
  | 'Furniture'
  | 'Room Repair'
  | 'Hostel'
  | 'Mess'
  | 'Other';

export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ServiceStatus =
  | 'New'
  | 'Assigned'
  | 'Accepted'
  | 'In Progress'
  | 'Resolved'
  | 'Student Confirmed'
  | 'Closed';

export interface ServiceTimelineStep {
  step: string;
  status: 'PENDING' | 'CURRENT' | 'COMPLETED';
  timestamp: string;
  note?: string;
  actor?: string;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  studentName: string;
  studentId: string;
  studentRoll: string;
  studentPhone: string;
  hostel: string;
  room: string;
  category: ServiceCategory;
  title: string;
  description: string;
  photoUrl?: string;
  priority: ServicePriority;
  assignedStaffId?: string;
  assignedStaffName: string;
  status: ServiceStatus;
  createdTime: string;
  updatedTime: string;
  slaDue: string;
  completionNote?: string;
  completionPhotoUrl?: string;
  studentFeedback?: string;
  rating?: number;
  timeline?: ServiceTimelineStep[];
}

export interface StudentNotification {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  studentName: string;
  studentRoll: string;
  room: string;
  hostel?: string;
  category: ServiceCategory;
  title: string;
  message: string;
  photoUrl?: string;
  timestamp: string;
  read: boolean;
  priority?: ServicePriority;
  type: 'NEW_REQUEST' | 'FEEDBACK' | 'URGENT' | 'STATUS_CONFIRMATION';
}

export interface MaintenanceScheduleItem {
  id: string;
  title: string;
  facility: string;
  category: ServiceCategory;
  scheduledTime: string;
  assignedTeam: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ServiceInventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: ServiceCategory;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  condition: 'GOOD' | 'FAIR' | 'REPAIR_NEEDED';
  lastRestocked: string;
  isLowStock: boolean;
}

export interface ServiceReportItem {
  id: string;
  name: string;
  category: string;
  recordCount: number;
  description: string;
  generatedDate: string;
  format: 'PDF' | 'CSV';
}

export interface ServiceStaffProfile {
  name: string;
  badgeId: string;
  designation: string;
  department: string;
  phone: string;
  shift: string;
  assignedZone: string;
  emergencyHelpline: string;
  avatarUrl: string;
}
