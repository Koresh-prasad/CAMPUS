export type FacultyTab =
  | 'PROFILE'
  | 'ACCOUNT'
  | 'DASHBOARD'
  | 'CLASSES_TIMETABLE'
  | 'ATTENDANCE'
  | 'STUDENTS'
  | 'COURSES_MATERIALS'
  | 'NOTES_VIDEOS'
  | 'ASSIGNMENTS_EVALUATION'
  | 'EXAMS_RESULTS'
  | 'REQUESTS_APPROVALS'
  | 'ISSUES_COMPLAINTS'
  | 'UPDATES_NOTICES'
  | 'CALENDAR'
  | 'SERVICES_LEAVE'
  | 'ACCESSIBILITY';

export type Language = 'EN' | 'HI' | 'OR';

export interface ScheduleSlot {
  id: string;
  code: string;
  name: string;
  batch: string;
  time: string;
  room: string;
  day: string;
  status: 'SCHEDULED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';
  substituteFaculty?: string;
  reason?: string;
}

export interface SyllabusUnit {
  unit: string;
  title: string;
  topics: string[];
  hours: number;
}

export interface Course {
  code: string;
  name: string;
  batch: string;
  semester: string;
  credits: number;
  studentsCount: number;
  syllabusUnits: SyllabusUnit[];
  progressPct: number;
  lecturesCompleted: number;
  totalLectures: number;
}

export interface CounsellingNote {
  id: string;
  date: string;
  category: 'ACADEMIC' | 'PLACEMENT' | 'PERSONAL' | 'ATTENDANCE';
  note: string;
  followUpDate?: string;
}

export interface Student {
  id: string;
  roll: string;
  name: string;
  batch: string;
  cgpa: number;
  attendance: number;
  hostel: string;
  room: string;
  phone: string;
  parentPhone: string;
  email: string;
  avatar: string;
  status: string;
  isMentee?: boolean;
  remarks?: string[];
  counsellingNotes?: CounsellingNote[];
}

export interface AuditHistory {
  date: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  updatedBy: string;
}

export interface AttendanceRecord {
  roll: string;
  name: string;
  batch: string;
  status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE';
  note?: string;
  isMedicalApproved?: boolean;
  auditHistory?: AuditHistory[];
}

export interface Material {
  id: string;
  title: string;
  course: string;
  type: 'PDF' | 'SLIDES' | 'LAB_MANUAL' | 'SOURCE_CODE' | 'LINK' | 'PYQ';
  size: string;
  date: string;
  downloads: number;
  views: number;
  visibility: 'ALL' | 'SEC_A' | 'SEC_B';
  url: string;
  isPYQ?: boolean;
  year?: string;
}

export interface Submission {
  id: string;
  studentRoll: string;
  studentName: string;
  submittedAt: string;
  isLate: boolean;
  marks?: number;
  feedback?: string;
  fileUrl: string;
  similarityScore?: number;
  duplicateWarning?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  batch: string;
  deadline: string;
  maxMarks: number;
  submittedCount: number;
  totalCount: number;
  status: 'ACTIVE' | 'EVALUATED' | 'DRAFT';
  fileUrl?: string;
  submissions: Submission[];
}

export interface ExamDuty {
  id: string;
  examName: string;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
  hall: string;
  role: 'CHIEF_INVIGILATOR' | 'ASSISTANT_INVIGILATOR';
  partnerFaculty: string;
  status: 'UPCOMING' | 'COMPLETED';
}

export interface MarksEntry {
  studentRoll: string;
  studentName: string;
  midSemMarks: number;
  assignmentMarks: number;
  totalInternal: number;
  maxInternal: number;
  status: 'DRAFT' | 'SUBMITTED';
}

export interface StudentRequest {
  id: string;
  studentName: string;
  roll: string;
  type: 'LOR' | 'MEDICAL_LEAVE' | 'ELECTIVE_CHANGE' | 'BONAFIDE';
  title: string;
  details: string;
  appliedDate: string;
  ageingDays: number;
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
  facultyRemark?: string;
}

export interface AcademicIssue {
  id: string;
  category: 'CLASSROOM' | 'LAB_EQUIPMENT' | 'PROJECTOR' | 'WIFI' | 'SOFTWARE';
  location: string;
  title: string;
  description: string;
  photoUrl?: string;
  priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  reportedDate: string;
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'RESOLVED';
  resolutionNote?: string;
  facultyConfirmedFixed?: boolean;
}

export interface CollegeNotice {
  id: string;
  title: string;
  date: string;
  category: 'REC_AUTONOMOUS' | 'BPUT' | 'CSE_DEPT';
  isPinned: boolean;
  isActionRequired: boolean;
  deadline?: string;
  audience: string;
  content: string;
  read: boolean;
  actionCompleted?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'ACADEMIC' | 'HOLIDAY' | 'EXAM' | 'MEETING' | 'FDP';
  description: string;
  location?: string;
}

export interface FacultyLeave {
  id: string;
  category: 'Casual Leave (CL)' | 'Earned Leave (EL)' | 'Duty Leave (OD)' | 'Medical Leave';
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  substituteFaculty: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
}

export interface ResearchPublication {
  id: string;
  title: string;
  journalOrConf: string;
  year: number;
  doi?: string;
  type: 'JOURNAL' | 'CONFERENCE' | 'PATENT' | 'BOOK_CHAPTER';
  citations?: number;
}

export interface EducationRecord {
  id: string;
  degree: string;
  level: string;
  institution: string;
  period: string;
  grade: string;
  specialization?: string;
  status: 'Completed' | 'In Progress';
  details?: string;
}

export type ResourceCategory = 'NOTE' | 'VIDEO' | 'VIDEO_LINK' | 'WEBSITE_LINK';

export interface LearningResource {
  id: string;
  title: string;
  course: string;
  batch?: string;
  unit?: string;
  category: ResourceCategory;
  url: string;
  thumbnail?: string;
  duration?: string;
  fileSize?: string;
  fileType?: string;
  platform?: 'YouTube' | 'NPTEL' | 'Google Drive' | 'Website' | 'Local';
  websiteName?: string;
  description?: string;
  dateAdded: string;
  downloadsCount?: number;
  viewsCount?: number;
}


