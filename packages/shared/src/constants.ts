export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  EMERGENCY_TRIGGERED: 'emergency:triggered',
  EMERGENCY_RESOLVED: 'emergency:resolved',
  CURFEW_ALERT: 'curfew:alert',
  VISITOR_OVERSTAY_ALERT: 'visitor:overstay',
  PASS_STATUS_UPDATE: 'pass:update',
  COMPLAINT_UPDATE: 'complaint:update',
  NOTICE_PUBLISHED: 'notice:published',
  GATE_SCAN_EVENT: 'gate:scan'
} as const;

export const DEFAULT_CURFEW_TIME = '21:30'; // 9:30 PM

export const SLA_HOURS_BY_CATEGORY = {
  WATER: 4,
  ELECTRICITY: 4,
  SECURITY: 1,
  PARKING: 24,
  HOUSEKEEPING: 8,
  CLEANLINESS: 8,
  WIFI: 6,
  MESS_CANTEEN: 4,
  FURNITURE: 48,
  ROOMMATE: 24,
  SPORTS: 48,
  OTHER: 24
} as const;

export const EMERGENCY_CONTACTS = [
  { role: 'Campus Security Desk', name: 'Chief Security Officer', phone: '+91 98765 43210' },
  { role: 'Hostel Warden (Boys)', name: 'Dr. R.K. Sharma', phone: '+91 98765 43211' },
  { role: 'Hostel Warden (Girls)', name: 'Prof. Sunita Rao', phone: '+91 98765 43212' },
  { role: 'Campus Health Center', name: 'Dr. Alok Verma (Resident Doctor)', phone: '+91 98765 43213' },
  { role: 'Local Police Station', name: 'Sector 62 Station', phone: '100 / 0120-2400100' },
  { role: 'Fire Emergency', name: 'District Fire Service', phone: '101' },
  { role: 'Ambulance & Trauma', name: 'City Hospital Emergency', phone: '108' }
];
