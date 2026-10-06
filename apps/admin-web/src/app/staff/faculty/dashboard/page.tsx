'use client';

import React, { useState, useMemo, useRef } from 'react';
import RoleGuard from '../../../../components/RoleGuard';
import {
  Home,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  FileText,
  Award,
  Users,
  Clock,
  Plus,
  Search,
  Upload,
  Send,
  LogOut,
  Bell,
  RefreshCw,
  Building,
  User,
  Settings,
  MessageSquare,
  AlertTriangle,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Filter,
  Download,
  ExternalLink,
  Printer,
  Eye,
  Camera,
  Check,
  ChevronRight,
  ShieldCheck,
  Layers,
  Megaphone,
  BarChart3,
  CheckSquare,
  HelpCircle,
  FileCheck,
  Sparkles,
  Info,
  Globe,
  Key,
  Lock,
  Moon,
  Sun,
  Type,
  QrCode,
  Wifi,
  AlertCircle,
  FileSpreadsheet,
  Bookmark,
  FileSignature,
  History,
  MessageCircle,
  ArrowRight,
  Share2,
  Copy,
  FilePlus,
  ChevronDown,
  CheckCheck,
  Sliders,
  Smartphone,
  Briefcase,
  GraduationCap,
  X,
  Edit3,
  Save,
  Video,
  Play,
  Link,
} from 'lucide-react';

import {
  FacultyTab,
  Language,
  Course,
  ScheduleSlot,
  Student,
  AttendanceRecord,
  Material,
  Assignment,
  ExamDuty,
  MarksEntry,
  StudentRequest,
  AcademicIssue,
  CollegeNotice,
  CalendarEvent,
  FacultyLeave,
  ResearchPublication,
  EducationRecord,
  LearningResource,
  ResourceCategory,
} from './types';

import {
  INITIAL_COURSES,
  INITIAL_SCHEDULE,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAM_DUTIES,
  INITIAL_MARKS_ENTRIES,
  INITIAL_STUDENT_REQUESTS,
  INITIAL_ACADEMIC_ISSUES,
  INITIAL_NOTICES,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_FACULTY_LEAVES,
  INITIAL_PUBLICATIONS,
  INITIAL_EDUCATION,
  INITIAL_RESOURCES,
} from './mockData';

import {
  DigitalIDModal,
  ChangePasswordModal,
  RescheduleClassModal,
  SubstituteModal,
  RoomBookingModal,
  EditAttendanceModal,
  LowAttendanceWarningModal,
  CounsellingModal,
  QuestionPaperModal,
  ReportIssueModal,
  PostNoticeModal,
  ApplyFacultyLeaveModal,
  NOCRequestModal,
  EditProfilePhotoModal,
  AddEditEducationModal,
  AddEditResourceModal,
  ResourceViewerModal,
} from './modals';

export default function FacultyDashboardPage() {
  return (
    <RoleGuard allowedRoles={['STAFF', 'FACULTY']} portalTitle="Faculty Academic Portal">
      {({ user, token, logout }) => (
        <FacultyPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function FacultyPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  // Navigation & Theme States
  const [activeTab, setActiveTab] = useState<FacultyTab>('DASHBOARD');
  const [language, setLanguage] = useState<Language>('EN');
  const [isLargeText, setIsLargeText] = useState(false);
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Top Bar Search & Menus
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalDropdown, setShowGlobalDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState('');

  // Effective faculty info
  const [facultyName, setFacultyName] = useState(user?.name || 'Prof. Sujata Panda');
  const [facultyEmail, setFacultyEmail] = useState(user?.email || 'sujatapanda890@gmail.com');
  const [facultyPhone, setFacultyPhone] = useState(user?.phone || '+91 77519 98874');
  const facultyDept = user?.staffProfile?.department || 'Computer Science & Engineering (CSE)';
  const facultyDesignation = user?.staffProfile?.designation || 'Assistant Professor';
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240'
  );

  // My Profile Feature States
  const [profileSubTab, setProfileSubTab] = useState<'PERSONAL' | 'QUALIFICATIONS' | 'CABIN' | 'ID_CARD' | 'SECURITY'>('PERSONAL');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profAltPhone, setProfAltPhone] = useState('+91 94370 12345');
  const [profEmergency, setProfEmergency] = useState('+91 94370 12345 (Mr. R. K. Panda - Spouse)');
  const [profBloodGroup, setProfBloodGroup] = useState('O+ (Positive)');
  const [profGender, setProfGender] = useState('Female');
  const [profDOB, setProfDOB] = useState('14 May 1988');
  const [profAddress, setProfAddress] = useState('Plot 142, Sailashree Vihar, Chandrasekharpur, Bhubaneswar, Odisha - 751021');
  const [profCabin, setProfCabin] = useState('Academic Block 2, Room 314');
  const [profHours, setProfHours] = useState('Mon, Wed, Fri (03:30 PM - 05:00 PM)');
  const [profSpecialization, setProfSpecialization] = useState(
    'Algorithms Optimization, Cloud Microservices, Distributed AI, Graph Analytics'
  );
  const [profQualification, setProfQualification] = useState(
    'M.Tech in CSE (IIT Kharagpur), Ph.D. Fellow (BPUT), B.Tech CSE (Honours)'
  );
  const [profBio, setProfBio] = useState(
    'Assistant Professor in CSE at Raajdhani Engineering College (Autonomous) with 7+ years of teaching experience. Passionate about algorithm design, graph neural networks, and mentoring student innovators in hackathons.'
  );

  // Dynamic Education & Profile State
  const [educationList, setEducationList] = useState<EducationRecord[]>(INITIAL_EDUCATION);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [eduModalState, setEduModalState] = useState<{ isOpen: boolean; data?: EducationRecord | null }>({
    isOpen: false,
    data: null,
  });

  // Social & Academic Research Profiles
  const [profScholarUrl, setProfScholarUrl] = useState('https://scholar.google.com/citations?user=REC_SPANDA_2019');
  const [profLinkedInUrl, setProfLinkedInUrl] = useState('https://linkedin.com/in/dr-sunita-panda-rec');
  const [profOrcidId, setProfOrcidId] = useState('0000-0002-1825-0097');
  const [profResearchGate, setProfResearchGate] = useState('https://researchgate.net/profile/Sunita-Panda-8');

  // Specialization Tags
  const [specializationTags, setSpecializationTags] = useState<string[]>([
    'Design & Analysis of Algorithms',
    'Distributed Graph Neural Networks',
    'Edge Computing Optimization',
    'Cloud Microservices Architecture',
    'Distributed Transaction Consensus',
  ]);
  const [newSpecTag, setNewSpecTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setAvatarUrl(ev.target.result);
          triggerSuccess('✓ Profile photo updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Datasets
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>(INITIAL_SCHEDULE);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [materials, setMaterials] = useState<Material[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [examDuties, setExamDuties] = useState<ExamDuty[]>(INITIAL_EXAM_DUTIES);
  const [marksEntries, setMarksEntries] = useState<MarksEntry[]>(INITIAL_MARKS_ENTRIES);
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>(INITIAL_STUDENT_REQUESTS);
  const [academicIssues, setAcademicIssues] = useState<AcademicIssue[]>(INITIAL_ACADEMIC_ISSUES);
  const [notices, setNotices] = useState<CollegeNotice[]>(INITIAL_NOTICES);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [facultyLeaves, setFacultyLeaves] = useState<FacultyLeave[]>(INITIAL_FACULTY_LEAVES);
  const [publications, setPublications] = useState<ResearchPublication[]>(INITIAL_PUBLICATIONS);

  // Learning Resources (Notes, Videos, Video Links, Website Links)
  const [resources, setResources] = useState<LearningResource[]>(INITIAL_RESOURCES);
  const [resourceFilterCategory, setResourceFilterCategory] = useState<'ALL' | ResourceCategory>('ALL');
  const [resourceFilterCourse, setResourceFilterCourse] = useState<string>('ALL');
  const [resourceSearch, setResourceSearch] = useState<string>('');
  const [showAddResourceModal, setShowAddResourceModal] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const [defaultResourceCategory, setDefaultResourceCategory] = useState<ResourceCategory>('NOTE');
  const [viewingResource, setViewingResource] = useState<LearningResource | null>(null);

  // Modals visibility state
  const [showDigitalID, setShowDigitalID] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showRescheduleClass, setShowRescheduleClass] = useState(false);
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [showRoomBooking, setShowRoomBooking] = useState(false);
  const [showAuditEdit, setShowAuditEdit] = useState<Student | null>(null);
  const [showLowAttendanceWarning, setShowLowAttendanceWarning] = useState(false);
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<Student | null>(null);
  const [showCounselling, setShowCounselling] = useState<Student | null>(null);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [showPostNotice, setShowPostNotice] = useState(false);
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [showNOCRequest, setShowNOCRequest] = useState(false);

  // Attendance sub-filters
  const [selectedCourseForAtt, setSelectedCourseForAtt] = useState('CS-401');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Timetable view mode
  const [timetableView, setTimetableView] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  // New Material Upload modal inline state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMatTitle, setNewMatTitle] = useState('');
  const [newMatCourse, setNewMatCourse] = useState('CS-401');
  const [newMatType, setNewMatType] = useState<'PDF' | 'SLIDES' | 'LAB_MANUAL' | 'PYQ'>('PDF');

  // New Assignment Modal inline state
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCourse, setNewAsgCourse] = useState('CS-401');
  const [newAsgDate, setNewAsgDate] = useState('2026-10-15');
  const [newAsgMarks, setNewAsgMarks] = useState(50);

  // Assignment Grading modal
  const [gradingModalAsg, setGradingModalAsg] = useState<Assignment | null>(null);

  // Toast feedback helper
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  // Helper toggle attendance
  const toggleAttendanceStatus = (roll: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.roll !== roll) return rec;
        const next = rec.status === 'PRESENT' ? 'ABSENT' : rec.status === 'ABSENT' ? 'ON_LEAVE' : 'PRESENT';
        return { ...rec, status: next };
      })
    );
  };

  const markAllAttendance = (target: 'PRESENT' | 'ABSENT') => {
    setAttendanceRecords((prev) => prev.map((rec) => ({ ...rec, status: target })));
    triggerSuccess(`✓ All students marked ${target} for CS-401 session!`);
  };

  // Audit edit attendance save
  const handleAuditSave = (roll: string, newStatus: 'PRESENT' | 'ABSENT' | 'ON_LEAVE', reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.roll !== roll) return rec;
        const history = rec.auditHistory || [];
        return {
          ...rec,
          status: newStatus,
          auditHistory: [
            {
              date: new Date().toLocaleString(),
              previousStatus: rec.status,
              newStatus,
              reason,
              updatedBy: facultyName,
            },
            ...history,
          ],
        };
      })
    );
    triggerSuccess(`✓ Attendance updated for ${roll} and permanently logged in audit trail!`);
  };

  // Add counselling note
  const handleSaveCounselling = (note: string, category: 'ACADEMIC' | 'PLACEMENT' | 'PERSONAL' | 'ATTENDANCE') => {
    if (!showCounselling) return;
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id !== showCounselling.id) return st;
        const notes = st.counsellingNotes || [];
        return {
          ...st,
          counsellingNotes: [
            {
              id: `cn-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
              category,
              note,
            },
            ...notes,
          ],
        };
      })
    );
    triggerSuccess(`✓ Mentoring & counselling note recorded for ${showCounselling.name}!`);
  };

  // Resolve issue toggle
  const handleToggleIssueFixed = (id: string, fixed: boolean) => {
    setAcademicIssues((prev) =>
      prev.map((iss) =>
        iss.id === id ? { ...iss, facultyConfirmedFixed: fixed, status: fixed ? 'RESOLVED' : 'IN_PROGRESS' } : iss
      )
    );
    triggerSuccess(fixed ? '✓ Issue verified & marked Fixed!' : '⚠️ Issue reopened & re-escalated to Campus IT!');
  };

  // Global search match filter
  const globalResults = useMemo(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const res: { category: string; title: string; subtitle: string; tab: FacultyTab }[] = [];

    // Search profile / credentials
    if ('profile'.includes(q) || 'qualification'.includes(q) || 'id card'.includes(q) || 'cabin'.includes(q)) {
      res.push({ category: 'Profile', title: 'My Faculty Profile', subtitle: 'Personal, qualifications, cabin & ID card', tab: 'PROFILE' });
    }

    // Search students
    students.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q)) {
        res.push({ category: 'Student', title: s.name, subtitle: `${s.roll} • ${s.batch}`, tab: 'STUDENTS' });
      }
    });

    // Search courses
    courses.forEach((c) => {
      if (c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
        res.push({ category: 'Course', title: c.code, subtitle: c.name, tab: 'COURSES_MATERIALS' });
      }
    });

    // Search notices
    notices.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
        res.push({ category: 'Notice', title: n.title, subtitle: n.category, tab: 'UPDATES_NOTICES' });
      }
    });

    // Search assignments
    assignments.forEach((a) => {
      if (a.title.toLowerCase().includes(q)) {
        res.push({ category: 'Assignment', title: a.title, subtitle: `Due: ${a.deadline}`, tab: 'ASSIGNMENTS_EVALUATION' });
      }
    });

    // Search notes & video learning resources
    resources.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q) ||
        (r.websiteName && r.websiteName.toLowerCase().includes(q))
      ) {
        res.push({
          category: r.category === 'NOTE' ? 'Notes' : r.category === 'VIDEO' ? 'Video' : r.category === 'VIDEO_LINK' ? 'Video Link' : 'Website',
          title: r.title,
          subtitle: `${r.course} • ${r.category.replace('_', ' ')}`,
          tab: 'NOTES_VIDEOS',
        });
      }
    });

    return res.slice(0, 8);
  }, [globalSearch, students, courses, notices, assignments, resources]);

  // Critical attendance students (<75%)
  const criticalStudents = useMemo(() => students.filter((s) => s.attendance < 75), [students]);

  // Unread notifications count
  const unreadNotifsCount = notices.filter((n) => !n.read).length;

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden bg-slate-50 text-slate-800 ${
        isLargeText ? 'text-base' : 'text-xs'
      }`}
    >
      {/* ========================================================= */}
      {/* 1. FIXED VERTICAL SIDEBAR (~280px)                        */}
      {/* Sleek Dark Navy UI (#091528) - ONLY element that is black */}
      {/* ========================================================= */}
      <aside className="w-72 bg-[#091528] text-slate-200 flex flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800/80 select-none z-20">
        <div className="flex flex-col h-[calc(100vh-70px)] min-h-0">
          {/* Logo & Portal Badge */}
          <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm text-white tracking-tight truncate flex items-center gap-1.5">
                Campus Helper
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h1>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Faculty Super App • 14 Hubs
              </p>
            </div>
          </div>

          {/* Faculty Profile Quick Capsule */}
          <div
            onClick={() => setActiveTab('PROFILE')}
            className="p-3 mx-3 mt-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center space-x-3 shrink-0 cursor-pointer transition"
            title="Click to view My Profile"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-teal-400 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 border border-white/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{facultyName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{facultyName}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {facultyDesignation} • CSE
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[9px] text-emerald-400 font-semibold truncate">
                  Raajdhani Engg College (Autonomous)
                </p>
              </div>
            </div>
          </div>

          {/* Search Modules Filter */}
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty modules..."
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Scrollable Navigation List (14 Modules exactly) */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs scrollbar-thin scrollbar-thumb-slate-700">
            {[
              { id: 'DASHBOARD' as FacultyTab, label: 'Dashboard', icon: Home },
              {
                id: 'CLASSES_TIMETABLE' as FacultyTab,
                label: 'Classes & Timetable',
                icon: Clock,
                badge: `${schedule.length}`,
                badgeColor: 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30',
              },
              {
                id: 'ATTENDANCE' as FacultyTab,
                label: 'Attendance',
                icon: CheckSquare,
                badge: criticalStudents.length > 0 ? `${criticalStudents.length} Alert` : '',
                badgeColor: 'bg-rose-500 text-white',
              },
              {
                id: 'STUDENTS' as FacultyTab,
                label: 'Students',
                icon: Users,
                badge: `${students.length}`,
                badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
              },
              {
                id: 'COURSES_MATERIALS' as FacultyTab,
                label: 'Courses & Study Material',
                icon: BookOpen,
                badge: `${courses.length} Courses`,
                badgeColor: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              },
              {
                id: 'NOTES_VIDEOS' as FacultyTab,
                label: 'Notes & Video Lectures',
                icon: Video,
                badge: `${resources.length}`,
                badgeColor: 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
              },
              {
                id: 'ASSIGNMENTS_EVALUATION' as FacultyTab,
                label: 'Assignments & Evaluation',
                icon: Layers,
                badge: `${assignments.length}`,
                badgeColor: 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
              },
              {
                id: 'EXAMS_RESULTS' as FacultyTab,
                label: 'Exams & Results',
                icon: Award,
                badge: `${examDuties.length} Duties`,
                badgeColor: 'bg-sky-400/20 text-sky-300 border border-sky-400/30',
              },
              {
                id: 'REQUESTS_APPROVALS' as FacultyTab,
                label: 'Requests & Approvals',
                icon: FileCheck,
                badge: `${studentRequests.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'SUBMITTED').length}`,
                badgeColor: 'bg-amber-500 text-slate-900 font-bold',
              },
              {
                id: 'ISSUES_COMPLAINTS' as FacultyTab,
                label: 'Issues & Complaints',
                icon: AlertTriangle,
                badge: `${academicIssues.filter((i) => i.status !== 'RESOLVED').length}`,
                badgeColor: 'bg-rose-400/20 text-rose-300 border border-rose-400/30',
              },
              {
                id: 'UPDATES_NOTICES' as FacultyTab,
                label: 'College Updates & Notices',
                icon: Megaphone,
                badge: `${notices.length}`,
                badgeColor: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
              },
              { id: 'CALENDAR' as FacultyTab, label: 'College Calendar', icon: Calendar },
              {
                id: 'SERVICES_LEAVE' as FacultyTab,
                label: 'Faculty Services & Leave',
                icon: Briefcase,
                badge: 'CL: 8',
                badgeColor: 'bg-teal-400/20 text-teal-300 border border-teal-400/30',
              },
              {
                id: 'PROFILE' as FacultyTab,
                label: 'My Profile',
                icon: User,
                badge: 'Verified ✓',
                badgeColor: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
              },
              { id: 'ACCESSIBILITY' as FacultyTab, label: 'Accessibility & Settings', icon: Settings },
            ]
              .filter((item) => item.label.toLowerCase().includes(sidebarFilter.toLowerCase()))
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || (item.id === 'PROFILE' && activeTab === 'ACCOUNT');
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="p-3 border-t border-slate-800/80 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-xl transition cursor-pointer text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN VIEWPORT & TOP NAVBAR                             */}
      {/* Crisp Pure White with Colorful Accents - NEVER Black      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 bg-white shadow-2xs shrink-0 z-30">
          {/* Left Brand Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-slate-900 leading-tight">
                {language === 'EN' && 'Raajdhani Engineering College (Autonomous)'}
                {language === 'HI' && 'राजधानी इंजीनियरिंग कॉलेज (स्वायत्त)'}
                {language === 'OR' && 'ରାଜଧାନୀ ଇଞ୍ଜିନିୟରିଂ କଲେଜ (ସ୍ୱୟଂଶାସିତ)'}
              </h2>
              <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">
                Bhubaneswar, Odisha • BPUT Affiliated • NAAC Accredited
              </p>
            </div>
          </div>

          {/* Middle: Global Search Bar */}
          <div className="relative flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setShowGlobalDropdown(true)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowGlobalDropdown(true);
                }}
                placeholder="Global search: profile, classes, students, notices, materials..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {globalSearch && (
                <button
                  onClick={() => {
                    setGlobalSearch('');
                    setShowGlobalDropdown(false);
                  }}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Global Search Dropdown */}
            {showGlobalDropdown && globalResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Search Results ({globalResults.length})
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {globalResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setActiveTab(res.tab);
                        setShowGlobalDropdown(false);
                        setGlobalSearch('');
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-2">
                          {res.category}
                        </span>
                        <span className="font-bold text-slate-900">{res.title}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{res.subtitle}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Control Strip */}
          <div className="flex items-center space-x-2.5">
            {/* Feedback Toast Banner */}
            {successMsg && (
              <span className="hidden lg:inline-flex text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200 animate-pulse">
                {successMsg}
              </span>
            )}

            {/* Language Toggle Pill: EN / हिन्दी / ଓଡ଼ିଆ */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'EN' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('HI')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'HI' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('OR')}
                className={`px-2 py-1 rounded-lg transition ${
                  language === 'OR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            {/* Notifications Bell with Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                title="Notifications & University Circulars"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white flex items-center justify-center text-[8px] text-white font-bold"></span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-black text-xs text-slate-900">
                      Notifications ({notices.length})
                    </span>
                    <button
                      onClick={() => {
                        setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
                        triggerSuccess('✓ All notifications marked read!');
                      }}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveTab('UPDATES_NOTICES');
                          setShowNotifMenu(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 cursor-pointer space-y-1 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-600">{n.category}</span>
                          <span className="text-[9px] text-slate-400">{n.date}</span>
                        </div>
                        <p className="font-bold text-slate-800 line-clamp-1">{n.title}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('UPDATES_NOTICES');
                      setShowNotifMenu(false);
                    }}
                    className="w-full py-1.5 text-center text-[11px] font-bold text-blue-600 hover:bg-blue-50 rounded-xl"
                  >
                    View All Circulars & Announcements →
                  </button>
                </div>
              )}
            </div>

            {/* Profile Menu Trigger Capsule */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{facultyName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-xs text-slate-800">
                  {facultyName.split(' ')[1] || facultyName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Menu Popover Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl mb-2">
                    <p className="font-black text-slate-900">{facultyName}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{facultyDesignation} • CSE</p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ✓ Dean Verified Active
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('PROFILE');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <span>My Profile & Qualifications</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDigitalID(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Digital Faculty ID Card (QR)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowChangePass(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-purple-600" />
                    <span>Change Password</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => setIsLargeText(!isLargeText)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-indigo-600" />
                      <span>Large Text Mode</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{isLargeText ? 'ON' : 'OFF'}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================= */}
          {/* 1. MY PROFILE & ACCOUNT HUB (COMPREHENSIVE FEATURES)      */}
          {/* ========================================================= */}
          {(activeTab === 'PROFILE' || activeTab === 'ACCOUNT') && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Profile Main Header Card */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                  {/* Interactive Avatar with Upload Trigger */}
                  <div className="relative group shrink-0">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-100 shadow-md bg-slate-100">
                      <img src={avatarUrl} alt={facultyName} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setShowPhotoModal(true)}
                        className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Upload or Change Photo"
                      >
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Change</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPhotoModal(true)}
                      className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1 cursor-pointer w-full text-center"
                    >
                      <Camera className="w-3 h-3 inline" />
                      <span>Edit Photo</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl md:text-2xl font-black text-slate-900">{facultyName}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                        Dean Verified Active ✓
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">
                      {facultyDesignation} • {facultyDept}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Faculty ID: <strong className="font-mono text-slate-800 font-bold">REC-FAC-2019-042</strong> • Joined 15 July 2019
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Raajdhani Engineering College (Autonomous), Bhubaneswar
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowDigitalID(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5 transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>View Digital ID Card</span>
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5 transition"
                  >
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span>{isEditingProfile ? 'Done Editing' : 'Edit Profile'}</span>
                  </button>
                  <button
                    onClick={() => setShowChangePass(true)}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5 transition"
                  >
                    <Key className="w-4 h-4 text-purple-600" />
                    <span>Security</span>
                  </button>
                </div>
              </div>

              {/* Profile Feature Sub-Tabs Selector */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setProfileSubTab('PERSONAL')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    profileSubTab === 'PERSONAL'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personal Details & Bio</span>
                </button>

                <button
                  onClick={() => setProfileSubTab('QUALIFICATIONS')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    profileSubTab === 'QUALIFICATIONS'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Qualifications (${educationList.length})</span>
                </button>

                <button
                  onClick={() => setProfileSubTab('CABIN')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    profileSubTab === 'CABIN'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Cabin & Office Hours</span>
                </button>

                <button
                  onClick={() => setProfileSubTab('ID_CARD')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    profileSubTab === 'ID_CARD'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Digital Faculty ID Card</span>
                </button>

                <button
                  onClick={() => setProfileSubTab('SECURITY')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    profileSubTab === 'SECURITY'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security & Login Sessions</span>
                </button>
              </div>

              {/* Sub-Tab 1: Personal Details & Bio (Full editable info) */}
              {profileSubTab === 'PERSONAL' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-black text-base text-slate-900">Personal Information & Profile Details</h3>
                        <p className="text-xs text-slate-500">Official faculty record maintained with REC Academic Registry</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowPhotoModal(true)}
                          className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerSuccess('✓ Personal & Academic profile details saved successfully!');
                            setIsEditingProfile(false);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          value={facultyName}
                          onChange={(e) => setFacultyName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Employee Registration Code</label>
                        <input
                          type="text"
                          readOnly
                          value="REC-FAC-2019-042"
                          className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Official University Email</label>
                        <input
                          type="email"
                          value={facultyEmail}
                          onChange={(e) => setFacultyEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Primary Mobile Phone</label>
                        <input
                          type="text"
                          value={facultyPhone}
                          onChange={(e) => setFacultyPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Alternate Phone Number</label>
                        <input
                          type="text"
                          value={profAltPhone}
                          onChange={(e) => setProfAltPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Emergency Contact Person & Phone</label>
                        <input
                          type="text"
                          value={profEmergency}
                          onChange={(e) => setProfEmergency(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                        <input
                          type="text"
                          value={profBloodGroup}
                          onChange={(e) => setProfBloodGroup(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Gender / DOB</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={profGender}
                            onChange={(e) => setProfGender(e.target.value)}
                            className="w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={profDOB}
                            onChange={(e) => setProfDOB(e.target.value)}
                            className="w-1/2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-xs">Residential Address</label>
                      <textarea
                        rows={2}
                        value={profAddress}
                        onChange={(e) => setProfAddress(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1 text-xs">Academic Bio & Teaching Statement</label>
                      <textarea
                        rows={3}
                        value={profBio}
                        onChange={(e) => setProfBio(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Areas of Specialization Tags */}
                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      <label className="font-bold text-slate-700 block text-xs">
                        Areas of Teaching Specialization & Research Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {specializationTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => setSpecializationTags(prev => prev.filter((_, i) => i !== idx))}
                              className="text-blue-400 hover:text-rose-600 transition"
                              title="Remove tag"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2 pt-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Add new research interest or specialization..."
                          value={newSpecTag}
                          onChange={(e) => setNewSpecTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newSpecTag.trim()) {
                              e.preventDefault();
                              if (!specializationTags.includes(newSpecTag.trim())) {
                                setSpecializationTags([...specializationTags, newSpecTag.trim()]);
                                setNewSpecTag('');
                              }
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newSpecTag.trim() && !specializationTags.includes(newSpecTag.trim())) {
                              setSpecializationTags([...specializationTags, newSpecTag.trim()]);
                              setNewSpecTag('');
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Social & Academic Research Profiles */}
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <h4 className="font-bold text-slate-800 text-xs">Academic & Research Identity Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1">Google Scholar Profile URL</label>
                          <input
                            type="url"
                            value={profScholarUrl}
                            onChange={(e) => setProfScholarUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-blue-600"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1">LinkedIn Profile</label>
                          <input
                            type="url"
                            value={profLinkedInUrl}
                            onChange={(e) => setProfLinkedInUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-blue-600"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1">ORCID Digital Identifier</label>
                          <input
                            type="text"
                            value={profOrcidId}
                            onChange={(e) => setProfOrcidId(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-emerald-600 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 font-bold block mb-1">ResearchGate Profile</label>
                          <input
                            type="url"
                            value={profResearchGate}
                            onChange={(e) => setProfResearchGate(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-teal-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 2: Qualifications & Academic Credentials (Dynamic List + Add Degree Option) */}
              {profileSubTab === 'QUALIFICATIONS' && (
                <div className="space-y-6">
                  {/* Degrees Timeline Card */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                          <span>Academic Degrees & Education Credentials ({educationList.length})</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Certified degrees, university honors, and doctoral research credentials
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setEduModalState({ isOpen: true, data: null })}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition self-start sm:self-auto"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Academic Qualification</span>
                      </button>
                    </div>

                    {/* Qualifications Cards List */}
                    <div className="space-y-4 text-xs">
                      {educationList.map((edu) => (
                        <div
                          key={edu.id}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200 transition space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                  {edu.level}
                                </span>
                                {edu.status === 'Completed' ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1">
                                    <span>Completed ✓</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex items-center space-x-1">
                                    <span>In Progress</span>
                                  </span>
                                )}
                              </div>
                              <h4 className="font-black text-sm text-slate-900">{edu.degree}</h4>
                              <p className="text-slate-600 font-medium">
                                {edu.institution} • <strong className="text-slate-800">{edu.period}</strong>
                              </p>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEduModalState({ isOpen: true, data: edu })}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                                title="Edit Qualification"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove "${edu.degree}" from your educational credentials?`)) {
                                    setEducationList(prev => prev.filter(e => e.id !== edu.id));
                                    triggerSuccess('✓ Academic qualification removed from credentials.');
                                  }
                                }}
                                className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                                title="Delete Qualification"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                            {edu.grade && (
                              <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                                Grade / Score: <strong>{edu.grade}</strong>
                              </span>
                            )}
                            {edu.specialization && (
                              <span className="text-[11px] text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                                Major: <strong>{edu.specialization}</strong>
                              </span>
                            )}
                          </div>

                          {edu.details && (
                            <p className="text-[11px] text-slate-500 italic bg-white/70 p-2.5 rounded-xl border border-slate-200/50">
                              {edu.details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications & Industry Credentials */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span>Professional Certifications & Memberships</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt('Enter Certificate / Membership title:');
                          if (title) {
                            triggerSuccess(`✓ Added "${title}" to professional credentials!`);
                          }
                        }}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs cursor-pointer transition"
                      >
                        + Add Certificate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p className="font-bold text-slate-900">NPTEL Elite Gold: Advanced Algorithms</p>
                        <p className="text-slate-500">Ministry of Education, Govt of India • Top 1% Rank</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p className="font-bold text-slate-900">AWS Certified Solutions Architect (Associate)</p>
                        <p className="text-slate-500">Amazon Web Services • Cloud Infrastructure & Containers</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p className="font-bold text-slate-900">Senior Member, IEEE Computer Society</p>
                        <p className="text-slate-500">Membership No: 94821034 • Odisha Section</p>
                      </div>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <p className="font-bold text-slate-900">Life Member, Computer Society of India (CSI)</p>
                        <p className="text-slate-500">Bhubaneswar Chapter • Academic Mentor</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: Cabin Office & Consultation Hours */}
              {profileSubTab === 'CABIN' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <span>Cabin Office, Consultation & Campus Intercom</span>
                      </h3>
                      <p className="text-xs text-slate-500">Physical workplace in Academic Block 2</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerSuccess('✓ Cabin office details saved!')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Office Hours</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Cabin Location *</label>
                      <input
                        type="text"
                        value={profCabin}
                        onChange={(e) => setProfCabin(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Student Consultation Hours *</label>
                      <input
                        type="text"
                        value={profHours}
                        onChange={(e) => setProfHours(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Campus Internal Intercom Extension</label>
                      <input
                        type="text"
                        readOnly
                        value="Extension: 3144"
                        className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Department Administrative Head (HOD)</label>
                      <input
                        type="text"
                        readOnly
                        value="Dr. Ashutosh Mohanty (HOD, Dept. of CSE)"
                        className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1">
                    <p className="font-bold">Student Guidance Policy:</p>
                    <p>
                      Students can walk into Cabin Room 314 during scheduled consultation hours without prior appointment for doubt clearing and project guidance.
                    </p>
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Digital Faculty ID Card Preview */}
              {profileSubTab === 'ID_CARD' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-center">
                  <div className="max-w-sm mx-auto bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl shadow-xl overflow-hidden text-center border border-slate-200">
                    <div className="p-5 text-center">
                      <div className="w-10 h-10 rounded-xl bg-white text-blue-900 font-black text-sm flex items-center justify-center mx-auto shadow-md mb-2">
                        REC
                      </div>
                      <h4 className="font-black text-xs uppercase tracking-wider">Raajdhani Engineering College</h4>
                      <p className="text-[10px] text-blue-200 font-semibold tracking-wide">(Autonomous) • Affiliated to BPUT</p>
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[9px] font-black uppercase tracking-wider">
                        Official Faculty ID
                      </span>
                    </div>

                    <div className="bg-white p-6 text-slate-800 space-y-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto border-4 border-blue-100 shadow-md">
                        <img src={avatarUrl} alt={facultyName} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <h4 className="font-black text-base text-slate-900">{facultyName}</h4>
                        <p className="text-xs font-bold text-blue-700">{facultyDesignation}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{facultyDept}</p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Employee ID:</span>
                          <span className="font-mono font-bold text-slate-900">REC-FAC-2019-042</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Blood Group:</span>
                          <span className="font-bold text-rose-600">{profBloodGroup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Validity:</span>
                          <span className="font-bold text-slate-800">July 2028</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-inner">
                        <QrCode className="w-24 h-24 text-slate-900 mx-auto" />
                        <p className="text-[9px] font-mono text-slate-400 mt-1">REC-AUTH-VERIFY-042</p>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print ID Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerSuccess('✓ Faculty Digital ID Card downloaded as PDF!')}
                          className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer flex items-center space-x-1.5 transition"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Tab 5: Security, 2FA & Active Sessions */}
              {profileSubTab === 'SECURITY' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-black text-base text-slate-900 flex items-center space-x-2">
                        <Lock className="w-5 h-5 text-purple-600" />
                        <span>Account Security & Login Protection</span>
                      </h3>
                      <p className="text-xs text-slate-500">Manage password, two-factor authentication, and login sessions</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowChangePass(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                        <p className="text-slate-500">Requires OTP sent to {facultyPhone} for logins from new devices</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        Active & Enabled ✓
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">Active Login Sessions</h4>
                        <p className="text-slate-500">2 Devices currently authenticated with your faculty account</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerSuccess('✓ Remote sessions terminated on other devices.')}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 cursor-pointer transition"
                      >
                        Terminate Other Sessions
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">💻</span>
                          <div>
                            <p className="font-bold text-slate-900">Windows PC • Chrome 129 (Bhubaneswar)</p>
                            <p className="text-[10px] text-emerald-600 font-bold">Current Active Session • IP: 103.112.45.10</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Online Now</span>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">📱</span>
                          <div>
                            <p className="font-bold text-slate-900">REC Faculty Mobile App • Android 14</p>
                            <p className="text-[10px] text-slate-500">OnePlus 11 • Last active Today at 08:30 AM</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Trusted Device</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. DASHBOARD HUB                                          */}
          {/* ========================================================= */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 md:p-8 shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider border border-white/20 inline-block">
                      Department of Computer Science & Engineering
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      Welcome Back, {facultyName}!
                    </h2>
                    <p className="text-xs md:text-sm text-blue-100 max-w-xl">
                      Manage course rosters, mark lecture attendance, publish coursework materials, and address academic student grievances.
                    </p>
                    <p className="text-[11px] text-sky-200 pt-1 flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>Next Lecture: 11:30 AM • Coding Lab 1 (CS-401L Algorithms Lab)</span>
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right self-start md:self-auto space-y-1 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-sky-200 tracking-wider">Institution Code</p>
                    <h4 className="font-black text-xl text-white">REC-BBSR (Autonomous)</h4>
                    <p className="text-[10px] text-blue-100 font-semibold">Affiliated to BPUT, Odisha</p>
                  </div>
                </div>
              </div>

              {/* Attendance Not Yet Marked Alert Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black shrink-0">
                    <AlertTriangle className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-amber-900">
                      Attendance Pending for CS-401 Algorithms Lecture (Batch A)
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Official REC policy requires class roll call submission within 30 minutes of lecture end.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('ATTENDANCE')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition cursor-pointer self-start sm:self-auto shrink-0"
                >
                  Mark Attendance Now →
                </button>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('ATTENDANCE')}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center space-x-3 hover:border-blue-500 hover:shadow-xs transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Mark Attendance</p>
                    <p className="text-[10px] text-slate-400">Roll call & bulk mark</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowRescheduleClass(true)}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center space-x-3 hover:border-blue-500 hover:shadow-xs transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Cancel / Reschedule</p>
                    <p className="text-[10px] text-slate-400">Auto alert students</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowPostNotice(true)}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center space-x-3 hover:border-blue-500 hover:shadow-xs transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Post Announcement</p>
                    <p className="text-[10px] text-slate-400">Class & SMS notice</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setDefaultResourceCategory('NOTE');
                    setShowAddResourceModal(true);
                  }}
                  className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center space-x-3 hover:border-blue-500 hover:shadow-xs transition text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">Add Notes / Video / Link</p>
                    <p className="text-[10px] text-slate-400">PDFs, videos & links</p>
                  </div>
                </button>
              </div>

              {/* 6 Key Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      Enrolled
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">141</h3>
                  <p className="text-xs font-bold text-slate-500">Students Taught</p>
                  <p className="text-[10px] text-slate-400 mt-1">Across 3 batches</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Avg Rate
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">89.4%</h3>
                  <p className="text-xs font-bold text-slate-500">Class Attendance</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 2.1% this week</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      Today
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">3</h3>
                  <p className="text-xs font-bold text-slate-500">Lectures / Labs</p>
                  <p className="text-[10px] text-purple-600 font-semibold mt-1">Hall 302 & Lab 1</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{assignments.length}</h3>
                  <p className="text-xs font-bold text-slate-500">Assignments & Notes</p>
                  <p className="text-[10px] text-indigo-600 font-semibold mt-1">Published coursework</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Syllabus
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">67%</h3>
                  <p className="text-xs font-bold text-slate-500">Curriculum Progress</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">On track for Mid-Sem</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      Requests
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    {studentRequests.filter((r) => r.status === 'SUBMITTED' || r.status === 'IN_PROGRESS').length}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">Pending Approvals</p>
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">LORs & Academic slips</p>
                </div>
              </div>

              {/* Two Column Section: Today's Schedule & Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card: Today's Teaching Schedule */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Today's Teaching Schedule</h3>
                        <p className="text-[11px] text-slate-400">Classroom & Lab Sessions for Today</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('CLASSES_TIMETABLE')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View Timetable →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {schedule.slice(0, 3).map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between hover:bg-blue-50/40 transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">
                              {s.code}
                            </span>
                            <span className="text-xs font-black text-slate-900">{s.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {s.batch} • {s.room}
                          </p>
                          <p className="text-[10px] text-blue-600 font-bold flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{s.time}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => {
                              setSelectedCourseForAtt(s.code);
                              setActiveTab('ATTENDANCE');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                          >
                            Mark Attendance
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Student Requests & Approvals Assigned to Me */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">Student Requests Assigned to Me</h3>
                        <p className="text-[11px] text-slate-400">LORs, Academic Slips & Clearances</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('REQUESTS_APPROVALS')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All ({studentRequests.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {studentRequests.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-black text-xs text-slate-900">{r.studentName}</span>
                            <span className="text-[10px] text-slate-500 ml-2">({r.roll})</span>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                            Ageing: {r.ageingDays} Days
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold line-clamp-1">{r.title}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-amber-200/40">
                          <span className="text-[10px] text-slate-400">Status: {r.status}</span>
                          <button
                            onClick={() => setActiveTab('REQUESTS_APPROVALS')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Review & Endorse →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. CLASSES & TIMETABLE HUB                                */}
          {/* ========================================================= */}
          {activeTab === 'CLASSES_TIMETABLE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Classes & Timetable Hub</h3>
                  <p className="text-xs text-slate-500">
                    Daily & weekly schedule, classroom bookings, and class adjustment requests
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowRescheduleClass(true)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reschedule Class</span>
                  </button>
                  <button
                    onClick={() => setShowSubstitute(true)}
                    className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Substitute Request</span>
                  </button>
                  <button
                    onClick={() => setShowRoomBooking(true)}
                    className="px-3.5 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Book Room / Lab</span>
                  </button>
                </div>
              </div>

              {/* View Switcher: Daily vs Weekly */}
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setTimetableView('DAILY')}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    timetableView === 'DAILY'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Daily Schedule View
                </button>
                <button
                  onClick={() => setTimetableView('WEEKLY')}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    timetableView === 'WEEKLY'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Weekly Master Timetable
                </button>
              </div>

              {/* Schedule Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {slot.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {slot.day}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-slate-900">{slot.name}</h4>
                      <p className="text-[11px] text-slate-500">{slot.batch}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl text-xs space-y-1">
                      <p className="text-slate-700 font-bold flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{slot.time}</span>
                      </p>
                      <p className="text-slate-500 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.room}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-600">Status: {slot.status}</span>
                      <button
                        onClick={() => {
                          setSelectedCourseForAtt(slot.code);
                          setActiveTab('ATTENDANCE');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Roll Call →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class History Log */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>Recent Class Delivery & Lecture Log</span>
                  </h4>
                  <span className="text-xs text-slate-400">Total 28 Lectures Delivered this Semester</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Date & Slot</th>
                        <th className="py-2.5 px-3">Course & Batch</th>
                        <th className="py-2.5 px-3">Topic Covered</th>
                        <th className="py-2.5 px-3 text-center">Attendance %</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-3 font-medium">04 Oct • 09:00 AM</td>
                        <td className="py-3 px-3 font-bold">CS-401 • Sec A</td>
                        <td className="py-3 px-3">Dynamic Programming - Matrix Chain Multiplication Recurrence</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">92.6% (63/68)</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">Logged ✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-3 font-medium">03 Oct • 02:00 PM</td>
                        <td className="py-3 px-3 font-bold">CS-401L • Lab B</td>
                        <td className="py-3 px-3">Lab Module 2: Kruskal Algorithm implementation with Disjoint Sets</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">88.2% (30/34)</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">Logged ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. ATTENDANCE HUB                                         */}
          {/* ========================================================= */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Attendance Register & Reports</h3>
                  <p className="text-xs text-slate-500">
                    Live roll-call, edit with audit reason, and shortage warnings (&lt;75%)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowLowAttendanceWarning(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Send Short Attendance Warnings ({criticalStudents.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Attendance exported to CSV successfully!');
                    }}
                    className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Controls Strip: Course, Date, Bulk Actions */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Select Course</label>
                    <select
                      value={selectedCourseForAtt}
                      onChange={(e) => setSelectedCourseForAtt(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      {courses.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Session Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => markAllAttendance('PRESENT')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAllAttendance('ABSENT')}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 cursor-pointer"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Roll Number</th>
                      <th className="py-3 px-4">Current Aggregate</th>
                      <th className="py-3 px-4 text-center">Session Status</th>
                      <th className="py-3 px-4 text-right">Audit & Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceRecords.map((rec) => {
                      const stObj = students.find((s) => s.roll === rec.roll);
                      const isLow = (stObj?.attendance || 100) < 75;
                      return (
                        <tr key={rec.roll} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">{rec.name}</span>
                            {rec.isMedicalApproved && (
                              <span className="ml-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                Medical Exemption
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">{rec.roll}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                                isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {stObj?.attendance || 90}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleAttendanceStatus(rec.roll)}
                              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                                rec.status === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : rec.status === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-amber-500 text-white shadow-xs'
                              }`}
                            >
                              {rec.status}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setShowAuditEdit(stObj || null)}
                              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                            >
                              Edit with Audit Reason →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. STUDENTS HUB                                           */}
          {/* ========================================================= */}
          {activeTab === 'STUDENTS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Enrolled Students & Mentees</h3>
                  <p className="text-xs text-slate-500">
                    Profiles, CGPA trends, counselling logs, and guardian communication desk
                  </p>
                </div>
              </div>

              {/* Students Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center space-x-3.5">
                      <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{st.name}</h4>
                        <p className="text-[10px] font-mono text-slate-500 font-bold">{st.roll}</p>
                        <p className="text-[10px] text-slate-400">{st.batch}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400">CGPA</span>
                        <p className="font-black text-slate-900 text-sm">{st.cgpa}</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400">Attendance</span>
                        <p
                          className={`font-black text-sm ${
                            st.attendance < 75 ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {st.attendance}%
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setSelectedStudentProfile(st)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        View Profile →
                      </button>
                      <button
                        onClick={() => setShowCounselling(st)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg hover:bg-blue-100 cursor-pointer"
                      >
                        + Add Mentoring Note
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. COURSES & STUDY MATERIAL HUB                          */}
          {/* ========================================================= */}
          {activeTab === 'COURSES_MATERIALS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Courses & Study Material</h3>
                  <p className="text-xs text-slate-500">
                    Syllabus units, lesson progress, uploaded notes, slides, and Previous Year Papers (PYQs)
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Study Material / PYQ</span>
                </button>
              </div>

              {/* Course Syllabus Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {courses.map((c) => (
                  <div
                    key={c.code}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{c.credits} Credits</span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-500">{c.batch}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Curriculum Progress</span>
                        <span className="font-bold text-blue-600">{c.progressPct}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${c.progressPct}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {c.lecturesCompleted} of {c.totalLectures} Lectures Delivered
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uploaded Materials & PYQ Library */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Uploaded Courseware & Previous Year Papers (PYQ)</span>
                  </h4>
                  <span className="text-xs text-slate-400">{materials.length} Documents Available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            {m.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">{m.course}</span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{m.title}</h5>
                        <p className="text-[10px] text-slate-400">
                          {m.size} • Uploaded {m.date} • {m.downloads} Downloads
                        </p>
                      </div>
                      <button
                        onClick={() => triggerSuccess(`✓ Initiated download of ${m.title}!`)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6B. NOTES & VIDEO LECTURES HUB                            */}
          {/* ========================================================= */}
          {activeTab === 'NOTES_VIDEOS' && (
            <div className="space-y-6">
              {/* Hub Header & Action Strip */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-xs">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                        Notes & Video Lectures Hub
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Publish lecture notes, video recordings, YouTube/NPTEL links, and educational websites
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Add Buttons Group */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultResourceCategory('NOTE');
                      setEditingResource(null);
                      setShowAddResourceModal(true);
                    }}
                    className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-blue-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>+ Add Notes (PDF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDefaultResourceCategory('VIDEO');
                      setEditingResource(null);
                      setShowAddResourceModal(true);
                    }}
                    className="px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-purple-200"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>+ Add Video Lecture</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDefaultResourceCategory('VIDEO_LINK');
                      setEditingResource(null);
                      setShowAddResourceModal(true);
                    }}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-rose-200"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>+ Add Video Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDefaultResourceCategory('WEBSITE_LINK');
                      setEditingResource(null);
                      setShowAddResourceModal(true);
                    }}
                    className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-emerald-200"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>+ Add Website Link</span>
                  </button>
                </div>
              </div>

              {/* Filtering Strip */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Category Filter Pills */}
                <div className="flex items-center space-x-2 overflow-x-auto text-xs font-bold pb-1 md:pb-0 scrollbar-none">
                  {[
                    { id: 'ALL', label: 'All Resources', count: resources.length },
                    { id: 'NOTE', label: '📄 Lecture Notes', count: resources.filter((r) => r.category === 'NOTE').length },
                    { id: 'VIDEO', label: '🎥 Recorded Videos', count: resources.filter((r) => r.category === 'VIDEO').length },
                    { id: 'VIDEO_LINK', label: '🔗 Video Links', count: resources.filter((r) => r.category === 'VIDEO_LINK').length },
                    { id: 'WEBSITE_LINK', label: '🌐 Websites & Links', count: resources.filter((r) => r.category === 'WEBSITE_LINK').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setResourceFilterCategory(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap ${
                        resourceFilterCategory === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Course Filter & Search */}
                <div className="flex items-center space-x-2 text-xs shrink-0">
                  <select
                    value={resourceFilterCourse}
                    onChange={(e) => setResourceFilterCourse(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Subjects & Courses</option>
                    {courses.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.name})
                      </option>
                    ))}
                    <option value="CS-502">CS-502 Cloud Computing</option>
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search title, topic, platform..."
                      value={resourceSearch}
                      onChange={(e) => setResourceSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
                    />
                  </div>
                </div>
              </div>

              {/* Resource Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources
                  .filter((r) => {
                    const matchCat = resourceFilterCategory === 'ALL' || r.category === resourceFilterCategory;
                    const matchCourse =
                      resourceFilterCourse === 'ALL' ||
                      r.course.toLowerCase().includes(resourceFilterCourse.toLowerCase());
                    const matchSearch =
                      !resourceSearch.trim() ||
                      r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                      r.course.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                      (r.description && r.description.toLowerCase().includes(resourceSearch.toLowerCase())) ||
                      (r.websiteName && r.websiteName.toLowerCase().includes(resourceSearch.toLowerCase()));
                    return matchCat && matchCourse && matchSearch;
                  })
                  .map((r) => (
                    <div
                      key={r.id}
                      className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Visual Media Header Preview */}
                        {(r.category === 'VIDEO' || r.category === 'VIDEO_LINK') && (
                          <div
                            onClick={() => setViewingResource(r)}
                            className="relative aspect-video bg-slate-900 group cursor-pointer overflow-hidden"
                          >
                            <img
                              src={r.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                              alt={r.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                              </div>
                            </div>

                            {/* Duration Badge */}
                            {r.duration && (
                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-bold">
                                {r.duration}
                              </span>
                            )}

                            {/* Platform Badge */}
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1">
                              {r.category === 'VIDEO' ? <span>🎥 Recorded Class</span> : <span>🔗 {r.platform || 'Video Link'}</span>}
                            </span>
                          </div>
                        )}

                        {r.category === 'NOTE' && (
                          <div className="p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border-b border-blue-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                                  {r.fileType || 'PDF Notes'}
                                </span>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.fileSize || '2.4 MB'}</p>
                              </div>
                            </div>
                            {r.downloadsCount !== undefined && (
                              <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                                📥 {r.downloadsCount} Downloads
                              </span>
                            )}
                          </div>
                        )}

                        {r.category === 'WEBSITE_LINK' && (
                          <div className="p-4 bg-gradient-to-br from-emerald-50/70 to-teal-50/50 border-b border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                                  {r.websiteName || 'Website Link'}
                                </span>
                                <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[140px] mt-0.5">
                                  {r.url.replace(/^https?:\/\//, '')}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
                              🌐 Educational Web
                            </span>
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-5 space-y-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {r.course.split(' ')[0]}
                            </span>
                            {r.unit && (
                              <span className="text-[10px] text-slate-500 font-medium truncate max-w-[160px]">
                                {r.unit}
                              </span>
                            )}
                          </div>

                          <h4 className="font-black text-sm text-slate-900 leading-snug line-clamp-2">
                            {r.title}
                          </h4>

                          {r.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {r.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer & Action Bar */}
                      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-3xl text-xs">
                        <div className="flex items-center space-x-1.5">
                          {r.category === 'NOTE' && (
                            <button
                              type="button"
                              onClick={() => triggerSuccess(`✓ Downloaded "${r.title}" PDF!`)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center space-x-1 shadow-xs cursor-pointer transition text-[11px]"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          )}

                          {(r.category === 'VIDEO' || r.category === 'VIDEO_LINK') && (
                            <button
                              type="button"
                              onClick={() => setViewingResource(r)}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center space-x-1 shadow-xs cursor-pointer transition text-[11px]"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Watch Video</span>
                            </button>
                          )}

                          {r.category === 'WEBSITE_LINK' && (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center space-x-1 shadow-xs cursor-pointer transition text-[11px]"
                            >
                              <span>Visit Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingResource(r);
                              setDefaultResourceCategory(r.category);
                              setShowAddResourceModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition"
                            title="Edit Resource"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove resource "${r.title}"?`)) {
                                setResources((prev) => prev.filter((item) => item.id !== r.id));
                                triggerSuccess(`✓ Removed "${r.title}" from resources.`);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Empty State */}
              {resources.filter((r) => {
                const matchCat = resourceFilterCategory === 'ALL' || r.category === resourceFilterCategory;
                const matchCourse =
                  resourceFilterCourse === 'ALL' || r.course.toLowerCase().includes(resourceFilterCourse.toLowerCase());
                const matchSearch =
                  !resourceSearch.trim() ||
                  r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
                  r.course.toLowerCase().includes(resourceSearch.toLowerCase());
                return matchCat && matchCourse && matchSearch;
              }).length === 0 && (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Video className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-base text-slate-800">No Learning Resources Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No notes, videos, or website links match your current search and filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResourceFilterCategory('ALL');
                      setResourceFilterCourse('ALL');
                      setResourceSearch('');
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. ASSIGNMENTS & EVALUATION HUB                           */}
          {/* ========================================================= */}
          {activeTab === 'ASSIGNMENTS_EVALUATION' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Assignments & Evaluation</h3>
                  <p className="text-xs text-slate-500">
                    Publish homework, grade student submissions, and inspect duplicate similarity flags
                  </p>
                </div>
                <button
                  onClick={() => setShowNewAsgModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Assignment</span>
                </button>
              </div>

              {/* Assignment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {asg.course}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">Max: {asg.maxMarks} Marks</span>
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-slate-900">{asg.title}</h4>
                      <p className="text-[11px] text-slate-500">{asg.batch}</p>
                      <p className="text-[10px] text-rose-600 font-bold mt-1">Due: {asg.deadline}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400">Submissions:</span>
                        <p className="font-bold text-slate-900">
                          {asg.submittedCount} / {asg.totalCount} Students
                        </p>
                      </div>
                      <button
                        onClick={() => setGradingModalAsg(asg)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                      >
                        Grade & Publish →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. EXAMS & RESULTS HUB                                    */}
          {/* ========================================================= */}
          {activeTab === 'EXAMS_RESULTS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Exams & Results Central</h3>
                  <p className="text-xs text-slate-500">
                    Exam duties roster, secure question paper vault, and internal marks spreadsheet
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQuestionPaper(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Upload Confidential QP</span>
                  </button>
                </div>
              </div>

              {/* Invigilation Duty Roster */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>My Assigned Invigilation Roster (Mid-Sem & End-Sem)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {examDuties.map((duty) => (
                    <div
                      key={duty.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">{duty.courseCode}</span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {duty.role === 'CHIEF_INVIGILATOR' ? 'Chief Invigilator' : 'Assistant Invigilator'}
                        </span>
                      </div>
                      <p className="font-black text-slate-900">{duty.courseName}</p>
                      <p className="text-slate-500">{duty.examName}</p>
                      <div className="pt-1 text-[11px] text-slate-600 space-y-0.5">
                        <p>📅 {duty.date} ({duty.time})</p>
                        <p>📍 {duty.hall}</p>
                        <p>🤝 Co-Invigilator: {duty.partnerFaculty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Marks Spreadsheet View */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900">
                      Enter Internal & Continuous Evaluation Marks
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Mid-Semester (30 Marks) + Assignments (20 Marks) = Total (50 Marks)
                    </p>
                  </div>
                  <button
                    onClick={() => triggerSuccess('✓ Internal marks saved and submitted to REC Examination Cell!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Submit Marks to Exam Cell
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Roll Number</th>
                        <th className="py-2.5 px-3 text-center">Mid-Sem (/30)</th>
                        <th className="py-2.5 px-3 text-center">Assignment (/20)</th>
                        <th className="py-2.5 px-3 text-center">Total (/50)</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {marksEntries.map((m, idx) => (
                        <tr key={m.studentRoll}>
                          <td className="py-3 px-3 font-bold text-slate-900">{m.studentName}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{m.studentRoll}</td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              defaultValue={m.midSemMarks}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              defaultValue={m.assignmentMarks}
                              className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-black text-blue-600">{m.totalInternal}</td>
                          <td className="py-3 px-3 text-right font-bold text-emerald-600">{m.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. REQUESTS & APPROVALS HUB                               */}
          {/* ========================================================= */}
          {activeTab === 'REQUESTS_APPROVALS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Requests & Approvals Central</h3>
                  <p className="text-xs text-slate-500">
                    Letters of Recommendation (LOR), student academic leaves, and elective change endorsements
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {studentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-sm text-slate-900">{req.studentName}</span>
                        <span className="text-xs font-mono text-slate-500 font-bold">({req.roll})</span>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {req.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                        Ageing: {req.ageingDays} Days
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">{req.title}</h4>
                    <p className="text-xs text-slate-600">{req.details}</p>

                    {req.facultyRemark && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                        <strong>My Remark:</strong> {req.facultyRemark}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-400">Status: {req.status}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setStudentRequests((prev) =>
                              prev.map((r) => (r.id === req.id ? { ...r, status: 'APPROVED' } : r))
                            );
                            triggerSuccess(`✓ Request for ${req.studentName} endorsed & approved!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                        >
                          Approve & Sign
                        </button>
                        <button
                          onClick={() => {
                            setStudentRequests((prev) =>
                              prev.map((r) => (r.id === req.id ? { ...r, status: 'REJECTED' } : r))
                            );
                            triggerSuccess(`✓ Request for ${req.studentName} declined.`);
                          }}
                          className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. ACADEMIC ISSUES & COMPLAINTS HUB                      */}
          {/* ========================================================= */}
          {activeTab === 'ISSUES_COMPLAINTS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Academic & Infrastructure Issues</h3>
                  <p className="text-xs text-slate-500">
                    Report problems with photo, track resolution status, and verify fixes
                  </p>
                </div>
                <button
                  onClick={() => setShowReportIssue(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report Problem with Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {academicIssues.map((iss) => (
                  <div
                    key={iss.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                        {iss.category}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          iss.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900">{iss.title}</h4>
                    <p className="text-slate-500 font-medium">📍 {iss.location}</p>
                    <p className="text-slate-600">{iss.description}</p>

                    {iss.resolutionNote && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                        <strong>Technician Note:</strong> {iss.resolutionNote}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">Reported {iss.reportedDate}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleIssueFixed(iss.id, true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                        >
                          Confirm Fixed ✓
                        </button>
                        <button
                          onClick={() => handleToggleIssueFixed(iss.id, false)}
                          className="px-3 py-1.5 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl font-bold cursor-pointer"
                        >
                          Not Fixed (Reopen)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. COLLEGE UPDATES & NOTICES HUB                         */}
          {/* ========================================================= */}
          {activeTab === 'UPDATES_NOTICES' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">College News & University Circulars</h3>
                  <p className="text-xs text-slate-500">
                    Autonomous notifications, BPUT updates, and class broadcast announcements
                  </p>
                </div>
                <button
                  onClick={() => setShowPostNotice(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Post Class Announcement</span>
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {n.isPinned && (
                          <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                            📌 Pinned
                          </span>
                        )}
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                      </div>
                      <span className="text-slate-400">{n.date}</span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900">{n.title}</h4>
                    <p className="text-slate-600">{n.content}</p>

                    {n.isActionRequired && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-amber-900">
                          ⚠️ Action Required by: {n.deadline}
                        </span>
                        <button
                          onClick={() => {
                            setNotices((prev) =>
                              prev.map((not) => (not.id === n.id ? { ...not, actionCompleted: true } : not))
                            );
                            triggerSuccess('✓ Action recorded as completed!');
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 12. COLLEGE CALENDAR HUB                                  */}
          {/* ========================================================= */}
          {activeTab === 'CALENDAR' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Academic Calendar & Events</h3>
                  <p className="text-xs text-slate-500">
                    Semester dates, holidays, faculty development programs, and exam duty schedules
                  </p>
                </div>
                <button
                  onClick={() => triggerSuccess('✓ Academic schedule synced to personal Google Calendar / iCal!')}
                  className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sync to My Calendar</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calendarEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {evt.category}
                      </span>
                      <span className="font-mono text-slate-400 font-bold">{evt.date}</span>
                    </div>
                    <h4 className="font-black text-sm text-slate-900">{evt.title}</h4>
                    <p className="text-slate-600">{evt.description}</p>
                    {evt.location && <p className="text-[11px] text-slate-400 font-medium">📍 {evt.location}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 13. FACULTY SERVICES & LEAVE HUB                          */}
          {/* ========================================================= */}
          {activeTab === 'SERVICES_LEAVE' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Faculty Services & Payroll</h3>
                  <p className="text-xs text-slate-500">
                    Apply leave, payslip downloads, NOC requests, biometric attendance, and publications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApplyLeave(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Apply Faculty Leave</span>
                  </button>
                  <button
                    onClick={() => setShowNOCRequest(true)}
                    className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Request NOC / Service Certificate
                  </button>
                </div>
              </div>

              {/* Leave Balance Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400">Casual Leave (CL)</span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">8 Days</h4>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Remaining in 2026</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400">Duty Leave (OD)</span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">5 Days</h4>
                  <p className="text-[10px] text-blue-600 font-bold mt-1">For conferences/FDP</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400">Earned Leave (EL)</span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">12 Days</h4>
                  <p className="text-[10px] text-purple-600 font-bold mt-1">Accumulated</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
                  <span className="text-slate-400">Biometric Attendance</span>
                  <h4 className="text-xl font-black text-slate-900 mt-1">98.2%</h4>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">Biometric punch clean</p>
                </div>
              </div>

              {/* Payslip & Payroll Downloads */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Salary Slips & Tax Documentation Library</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">September 2026 Payslip</p>
                      <p className="text-[10px] text-slate-400">Credited on 30 Sep 2026</p>
                    </div>
                    <button
                      onClick={() => triggerSuccess('✓ Downloaded September 2026 Payslip PDF!')}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">August 2026 Payslip</p>
                      <p className="text-[10px] text-slate-400">Credited on 31 Aug 2026</p>
                    </div>
                    <button
                      onClick={() => triggerSuccess('✓ Downloaded August 2026 Payslip PDF!')}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Form 16 & TDS Statement</p>
                      <p className="text-[10px] text-slate-400">Assessment Year 2026-27</p>
                    </div>
                    <button
                      onClick={() => triggerSuccess('✓ Downloaded Form 16 PDF!')}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Research Publications & Patents */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-black text-sm text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Research Publications & Intellectual Property</span>
                </h4>
                <div className="space-y-3 text-xs">
                  {publications.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                          {p.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{p.year}</span>
                      </div>
                      <p className="font-black text-slate-900">{p.title}</p>
                      <p className="text-[11px] text-slate-500">{p.journalOrConf}</p>
                      {p.doi && <p className="text-[10px] text-blue-600 font-mono">DOI: {p.doi}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 14. ACCESSIBILITY & SETTINGS HUB                          */}
          {/* ========================================================= */}
          {activeTab === 'ACCESSIBILITY' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Accessibility & Device Preferences</h3>
                  <p className="text-xs text-slate-500">
                    Configure low-bandwidth mode, offline attendance sync, and notification channels
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Low-Bandwidth Lite Mode</h4>
                      <p className="text-slate-500">Optimizes campus portal for slow 2G/3G Wi-Fi speeds</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isLiteMode}
                      onChange={(e) => {
                        setIsLiteMode(e.target.checked);
                        triggerSuccess(e.target.checked ? '✓ Low-bandwidth mode enabled' : '✓ Normal mode restored');
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Offline Attendance Local Cache</h4>
                      <p className="text-slate-500">
                        Allows roll-call when classroom has no Wi-Fi, automatically syncs when network is detected
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={isOfflineMode}
                      onChange={(e) => {
                        setIsOfflineMode(e.target.checked);
                        triggerSuccess(e.target.checked ? '✓ Offline sync cache activated' : '✓ Direct online mode active');
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">SMS Notification Fallback</h4>
                      <p className="text-slate-500">
                        Dispatches SMS directly to your phone ({facultyPhone}) for urgent exam & HOD notices
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Authenticated via Secure College JWT Gateway</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl cursor-pointer"
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. MODAL DIALOGS                                          */}
      {/* ========================================================= */}
      <DigitalIDModal
        isOpen={showDigitalID}
        onClose={() => setShowDigitalID(false)}
        facultyName={facultyName}
        facultyDept={facultyDept}
        facultyDesignation={facultyDesignation}
        facultyEmail={facultyEmail}
        facultyPhone={facultyPhone}
        avatarUrl={avatarUrl}
      />

      <ChangePasswordModal
        isOpen={showChangePass}
        onClose={() => setShowChangePass(false)}
        onSuccess={triggerSuccess}
      />

      <RescheduleClassModal
        isOpen={showRescheduleClass}
        onClose={() => setShowRescheduleClass(false)}
        courses={courses}
        onSuccess={triggerSuccess}
      />

      <SubstituteModal
        isOpen={showSubstitute}
        onClose={() => setShowSubstitute(false)}
        onSuccess={triggerSuccess}
      />

      <RoomBookingModal
        isOpen={showRoomBooking}
        onClose={() => setShowRoomBooking(false)}
        onSuccess={triggerSuccess}
      />

      <EditAttendanceModal
        isOpen={!!showAuditEdit}
        onClose={() => setShowAuditEdit(null)}
        student={showAuditEdit}
        onSave={handleAuditSave}
      />

      <LowAttendanceWarningModal
        isOpen={showLowAttendanceWarning}
        onClose={() => setShowLowAttendanceWarning(false)}
        criticalStudents={criticalStudents}
        onSuccess={triggerSuccess}
      />

      <CounsellingModal
        isOpen={!!showCounselling}
        onClose={() => setShowCounselling(null)}
        student={showCounselling}
        onSave={handleSaveCounselling}
      />

      <QuestionPaperModal
        isOpen={showQuestionPaper}
        onClose={() => setShowQuestionPaper(false)}
        courses={courses}
        onSuccess={triggerSuccess}
      />

      <ReportIssueModal
        isOpen={showReportIssue}
        onClose={() => setShowReportIssue(false)}
        onSuccess={triggerSuccess}
      />

      <PostNoticeModal
        isOpen={showPostNotice}
        onClose={() => setShowPostNotice(false)}
        courses={courses}
        onSuccess={triggerSuccess}
      />

      <ApplyFacultyLeaveModal
        isOpen={showApplyLeave}
        onClose={() => setShowApplyLeave(false)}
        onSuccess={triggerSuccess}
      />

      <NOCRequestModal
        isOpen={showNOCRequest}
        onClose={() => setShowNOCRequest(false)}
        onSuccess={triggerSuccess}
      />

      {/* Edit Profile Photo Modal */}
      <EditProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhoto={avatarUrl}
        onSave={(newUrl) => {
          setAvatarUrl(newUrl);
          triggerSuccess('✓ Profile photo updated successfully!');
        }}
      />

      {/* Add or Edit Academic Qualification Modal */}
      <AddEditEducationModal
        isOpen={eduModalState.isOpen}
        onClose={() => setEduModalState({ isOpen: false, data: null })}
        initialData={eduModalState.data}
        onSave={(rec) => {
          if (eduModalState.data) {
            setEducationList((prev) => prev.map((e) => (e.id === rec.id ? rec : e)));
            triggerSuccess('✓ Academic qualification updated successfully!');
          } else {
            setEducationList((prev) => [rec, ...prev]);
            triggerSuccess('✓ New qualification added to educational credentials!');
          }
        }}
      />

      {/* Edit Profile Photo Modal */}
      <EditProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhoto={avatarUrl}
        onSave={(newUrl) => {
          setAvatarUrl(newUrl);
          triggerSuccess('✓ Profile photo updated successfully!');
        }}
      />

      {/* Add / Edit Learning Resource Modal */}
      <AddEditResourceModal
        isOpen={showAddResourceModal}
        onClose={() => {
          setShowAddResourceModal(false);
          setEditingResource(null);
        }}
        initialData={editingResource}
        defaultCategory={defaultResourceCategory}
        courses={courses}
        onSave={(rec) => {
          if (editingResource) {
            setResources((prev) => prev.map((r) => (r.id === rec.id ? rec : r)));
            triggerSuccess(`✓ Updated "${rec.title}" successfully!`);
          } else {
            setResources((prev) => [rec, ...prev]);
            triggerSuccess(`✓ Published "${rec.title}" for students!`);
          }
        }}
      />

      {/* Learning Resource Viewer Modal (Video Player / Embed / Notes) */}
      <ResourceViewerModal
        isOpen={!!viewingResource}
        onClose={() => setViewingResource(null)}
        resource={viewingResource}
      />

      {/* Student Profile Quick View Modal */}
      {selectedStudentProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Student Academic Profile</h3>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <img
                src={selectedStudentProfile.avatar}
                alt={selectedStudentProfile.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h4 className="font-black text-base text-slate-900">{selectedStudentProfile.name}</h4>
                <p className="font-mono text-xs text-slate-500 font-bold">{selectedStudentProfile.roll}</p>
                <p className="text-xs text-slate-400">{selectedStudentProfile.batch}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Cumulative GPA:</span>
                <span className="font-bold text-slate-900">{selectedStudentProfile.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attendance Rate:</span>
                <span
                  className={`font-bold ${
                    selectedStudentProfile.attendance < 75 ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {selectedStudentProfile.attendance}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hostel Residence:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudentProfile.hostel} ({selectedStudentProfile.room})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guardian Contact:</span>
                <span className="font-mono font-bold text-blue-600">{selectedStudentProfile.parentPhone}</span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 text-xs">
              <a
                href={`tel:${selectedStudentProfile.parentPhone}`}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-md cursor-pointer"
              >
                Call Parent Desk
              </a>
              <button
                onClick={() => setSelectedStudentProfile(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-black text-sm text-slate-900">Upload Study Material / PYQ</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMaterials((prev) => [
                  {
                    id: `mat-${Date.now()}`,
                    title: newMatTitle,
                    course: newMatCourse,
                    type: newMatType,
                    size: '2.8 MB',
                    date: 'Today',
                    downloads: 0,
                    views: 0,
                    visibility: 'ALL',
                    url: '#',
                  },
                  ...prev,
                ]);
                setShowUploadModal(false);
                setNewMatTitle('');
                triggerSuccess('✓ Study material published to student portal!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newMatCourse}
                  onChange={(e) => setNewMatCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Title / Topic *</label>
                <input
                  type="text"
                  required
                  value={newMatTitle}
                  onChange={(e) => setNewMatTitle(e.target.value)}
                  placeholder="e.g. Unit 3 Dynamic Programming Lecture Handout"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Material Category</label>
                <select
                  value={newMatType}
                  onChange={(e: any) => setNewMatType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="PDF">Lecture Notes PDF</option>
                  <option value="SLIDES">Presentation Slides</option>
                  <option value="LAB_MANUAL">Lab Manual / Test Cases</option>
                  <option value="PYQ">Previous Year Autonomous Question Paper</option>
                </select>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Upload & Share
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAsgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-black text-sm text-slate-900">Create New Coursework Assignment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAssignments((prev) => [
                  {
                    id: `asg-${Date.now()}`,
                    title: newAsgTitle,
                    course: newAsgCourse,
                    batch: 'CSE Year 3 (Sec A)',
                    deadline: newAsgDate,
                    maxMarks: Number(newAsgMarks),
                    submittedCount: 0,
                    totalCount: 68,
                    status: 'ACTIVE',
                    submissions: [],
                  },
                  ...prev,
                ]);
                setShowNewAsgModal(false);
                setNewAsgTitle('');
                triggerSuccess('✓ Assignment created and published to students!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <select
                  value={newAsgCourse}
                  onChange={(e) => setNewAsgCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  placeholder="e.g. Assignment 3: Greedy Huffman Coding & MST"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newAsgDate}
                    onChange={(e) => setNewAsgDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={newAsgMarks}
                    onChange={(e) => setNewAsgMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAsgModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assignment Grading & Duplicate Flag Modal */}
      {gradingModalAsg && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                  {gradingModalAsg.course}
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">{gradingModalAsg.title}</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">Max: {gradingModalAsg.maxMarks} Marks</span>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
              {students.slice(0, 4).map((st, i) => {
                const sub = gradingModalAsg.submissions.find((s) => s.studentRoll === st.roll);
                const hasDuplicateWarning = sub?.duplicateWarning;
                return (
                  <div key={st.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{st.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{st.roll}</p>
                      {hasDuplicateWarning && (
                        <span className="inline-block mt-0.5 text-[9px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          ⚠️ 82% Code Similarity Detected!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        defaultValue={sub?.marks || gradingModalAsg.maxMarks - i * 3}
                        className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-center font-bold"
                      />
                      <span className="text-slate-400">/ {gradingModalAsg.maxMarks}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex space-x-2 text-xs">
              <button
                onClick={() => {
                  setGradingModalAsg(null);
                  triggerSuccess('✓ Grades published to student gradebooks!');
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Save & Publish Grades
              </button>
              <button
                onClick={() => setGradingModalAsg(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
