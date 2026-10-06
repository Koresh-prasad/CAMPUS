// TODO: Connect these hackathon metrics to backend API endpoints when available.
// Endpoint ideas:
// - GET /api/admin/metrics/complaints-ageing
// - GET /api/admin/metrics/staff-workload
// - GET /api/admin/metrics/notice-delivery

export interface ComplaintAgeingItem {
  range: string;
  count: number;
  color: string;
  isCritical?: boolean;
}

export interface RepeatIssueItem {
  title: string;
  category: string;
  occurrences: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface StaffWorkloadItem {
  name: string;
  role: string;
  department: string;
  openTickets: number;
  resolvedTickets: number;
  status: 'optimal' | 'busy' | 'overloaded';
}

export interface NoticeDeliveryStat {
  title: string;
  sentDate: string;
  delivered: number; // percentage
  read: number;      // percentage
  actionDone: number;// percentage
}

export interface HackathonDashboardData {
  complaintAgeing: ComplaintAgeingItem[];
  repeatIssues: RepeatIssueItem[];
  avgResolutionHours: number;
  avgResolutionTrend: string; // e.g. "-18% faster"
  staffWorkload: StaffWorkloadItem[];
  noticeDelivery: NoticeDeliveryStat[];
  collegeInfo: {
    name: string;
    shortName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    website: string;
    image: string;
  };
  quickStats: {
    hostels: number;
    departments: number;
    totalRooms: number;
    wardenCount: number;
    securityCount: number;
    medicalStaffCount: number;
  };
  systemStatus: {
    server: 'Online' | 'Offline';
    database: 'Connected' | 'Disconnected';
    services: 'All Services Running' | 'Degraded';
  };
}

export const DASHBOARD_MOCK: HackathonDashboardData = {
  // TODO: connect API endpoint GET /api/analytics/complaints-ageing
  complaintAgeing: [
    { range: '0 - 2 Days', count: 14, color: 'bg-emerald-500' },
    { range: '3 - 7 Days', count: 7, color: 'bg-amber-500' },
    { range: '7+ Days', count: 3, color: 'bg-rose-500', isCritical: true },
  ],

  // TODO: connect API endpoint GET /api/analytics/repeat-issues
  repeatIssues: [
    { title: 'Wi-Fi connectivity drop in Block B (2nd floor)', category: 'IT Infrastructure', occurrences: 18, trend: 'up' },
    { title: 'Hot water supply disruption in North Wing', category: 'Hostel Maintenance', occurrences: 12, trend: 'down' },
    { title: 'Mess dinner token scanner delay', category: 'Food & Mess', occurrences: 9, trend: 'neutral' },
  ],

  // TODO: connect API endpoint GET /api/analytics/resolution-time
  avgResolutionHours: 14.5,
  avgResolutionTrend: '-22% vs last month',

  // TODO: connect API endpoint GET /api/analytics/staff-workload
  staffWorkload: [
    { name: 'Dr. S. K. Mahapatra', role: 'Chief Warden', department: 'Hostel Admin', openTickets: 4, resolvedTickets: 28, status: 'optimal' },
    { name: 'Er. Rajesh Panda', role: 'IT Lead', department: 'Network & Tech', openTickets: 9, resolvedTickets: 42, status: 'busy' },
    { name: 'Nalini Behera', role: 'Estate Supervisor', department: 'Facilities', openTickets: 12, resolvedTickets: 31, status: 'overloaded' },
    { name: 'Sister Rita Das', role: 'Head Nurse', department: 'Health Center', openTickets: 2, resolvedTickets: 56, status: 'optimal' },
  ],

  // TODO: connect API endpoint GET /api/analytics/notice-delivery
  noticeDelivery: [
    { title: 'Mid-Term Exam Schedule Nov 2026', sentDate: '28 Sep', delivered: 99.4, read: 87.2, actionDone: 74.0 },
    { title: 'Hostel Curfew & Safety Protocol Updates', sentDate: '26 Sep', delivered: 98.8, read: 92.5, actionDone: 88.0 },
    { title: 'Mandatory Blood Donation Camp Registration', sentDate: '24 Sep', delivered: 97.5, read: 64.3, actionDone: 42.1 },
  ],

  // College metadata
  collegeInfo: {
    name: 'Raajdhani Engineering College (Autonomous)',
    shortName: 'REC Bhubaneswar',
    address: 'Near Mancheswar Railway Station, Mancheswar Railway Colony',
    city: 'Bhubaneswar, Odisha 751017',
    phone: '+91 674 2751 017',
    email: 'info@rec.ac.in',
    website: 'www.rec.ac.in',
    image: '/images/rec-building.jpg',
  },

  // Quick stats
  quickStats: {
    hostels: 6,
    departments: 12,
    totalRooms: 1580,
    wardenCount: 6,
    securityCount: 18,
    medicalStaffCount: 4,
  },

  // System status
  systemStatus: {
    server: 'Online',
    database: 'Connected',
    services: 'All Services Running',
  },
};
