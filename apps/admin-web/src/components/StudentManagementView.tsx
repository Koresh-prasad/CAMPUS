'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Download,
  Building,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Phone,
  Mail,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  Eye,
  RefreshCw,
  X,
  FileText,
  Clock,
  Wrench,
  Heart,
  Calendar,
  Printer,
  ShieldAlert,
  Send,
  AlertCircle,
  Check,
  DoorOpen,
  Award,
  BookOpen,
  ExternalLink,
  Briefcase,
  FileCheck,
  FolderLock,
  Edit3,
} from 'lucide-react';

interface StudentManagementProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  residents: any[];
  pendingStudents?: any[];
  onApproveStudent?: (id: string, name: string) => void;
  onRejectStudent?: (id: string, name: string) => void;
  onRefresh?: () => void;
  token?: string;
}

export default function StudentManagementView({
  activeSubTab,
  setActiveSubTab,
  residents,
  pendingStudents = [],
  onApproveStudent,
  onRejectStudent,
  onRefresh,
  token,
}: StudentManagementProps) {
  const subTabs = [
    'Student Profiles',
    'Admission Requests',
    'Department / Year',
    'Roll Number',
    'Hostel Allocation',
    'Account Status',
  ];

  const currentTab = activeSubTab || 'Student Profiles';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedHostel, setSelectedHostel] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Student Detail Drawer State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [drawerTab, setDrawerTab] = useState<
    'OVERVIEW' | 'CORRECTIONS' | 'ACADEMICS' | 'DOCUMENTS' | 'LEAVE' | 'GATE_PASS' | 'COMPLAINTS' | 'SERVICES'
  >('OVERVIEW');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);

  // Parse rich 6-tab profile JSON for selected student
  const profileData = React.useMemo(() => {
    if (!selectedStudent?.profileDataJson) return null;
    if (typeof selectedStudent.profileDataJson === 'object') return selectedStudent.profileDataJson;
    try {
      return JSON.parse(selectedStudent.profileDataJson);
    } catch (e) {
      return null;
    }
  }, [selectedStudent]);

  const pendingCorrectionsList = React.useMemo(() => {
    return profileData?.correctionRequests?.filter((r: any) => r.status === 'PENDING') || [];
  }, [profileData]);

  const handleReviewCorrection = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!selectedStudent) return;
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch(`/api/residents/${selectedStudent.id}/correction-request/${requestId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          status,
          adminNote: reviewNote.trim() || (status === 'APPROVED' ? 'Approved by campus administrator' : 'Rejected after review')
        })
      });

      if (res.ok) {
        const data = await res.json();
        setActionSuccessMsg(`Correction request marked as ${status}!`);
        setTimeout(() => setActionSuccessMsg(''), 4000);
        setReviewNote('');
        if (data.profileDataJson) {
          setSelectedStudent((prev: any) => ({
            ...prev,
            profileDataJson: data.profileDataJson
          }));
        }
        onRefresh?.();
      } else {
        const err = await res.json();
        setReviewError(err.error || 'Failed to update correction request');
      }
    } catch (err: any) {
      setReviewError(err.message || 'Network error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    dept: 'Computer Science',
    year: '1st Year',
    hostel: 'Nilgiri Block A',
    room: 'A-204',
    phone: '',
    email: '',
    parentPhone: '',
  });

  // Mock Students fallback if residents list is empty
  const [mockStudents, setMockStudents] = useState<any[]>([
    {
      id: 'std-1',
      name: 'Rahul Kumar',
      rollNo: '2101289001',
      dept: 'Computer Science & Engineering',
      course: 'B.Tech',
      year: '3rd Year',
      semester: '6th Semester',
      hostel: 'Nilgiri Block A',
      blockName: 'Nilgiri Block A',
      room: 'A-204',
      status: 'ACTIVE',
      phone: '+91 98765 43210',
      email: 'rahul.kumar@rec.ac.in',
      parentName: 'B. K. Kumar',
      parentRelation: 'Father',
      parentPhone: '+91 94370 11223',
      guardianAddress: 'Plot 41, Sailashree Vihar, Bhubaneswar',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
      kyc: 'Verified',
      presence: 'IN_HOSTEL',
      cgpa: '8.74',
      bloodGroup: 'B+',
      leaveHistory: [
        {
          id: 'LV-8921',
          type: 'Weekend Home Visit',
          from: '2025-09-26',
          to: '2025-09-29',
          reason: 'Family visit in Cuttack',
          status: 'APPROVED',
          approvedBy: 'Chief Warden Mohapatra',
          returnStatus: 'RETURNED_ON_TIME',
        },
        {
          id: 'LV-8412',
          type: 'Medical Leave',
          from: '2025-09-12',
          to: '2025-09-15',
          reason: 'Dental surgery & recuperation',
          status: 'APPROVED',
          approvedBy: 'Dr. Mahapatra (Medical)',
          returnStatus: 'RETURNED_ON_TIME',
        },
        {
          id: 'LV-7901',
          type: 'Day Outing',
          from: '2025-08-30',
          to: '2025-08-30',
          reason: 'Academic book purchase at Master Canteen',
          status: 'APPROVED',
          approvedBy: 'Warden Sharma',
          returnStatus: 'RETURNED_ON_TIME',
        },
      ],
      gatePassHistory: [
        {
          id: 'GP-9011',
          passType: 'Day Pass',
          outTime: '2025-09-26 16:30',
          inTime: '2025-09-26 20:45',
          gate: 'Main Turnstile Gate 1',
          guard: 'Vikram Singh (Security)',
          status: 'COMPLETED',
        },
        {
          id: 'GP-8842',
          passType: 'Weekend Pass',
          outTime: '2025-09-19 18:00',
          inTime: '2025-09-21 20:15',
          gate: 'Main Turnstile Gate 1',
          guard: 'R. K. Jena (Security)',
          status: 'COMPLETED',
        },
        {
          id: 'GP-7910',
          passType: 'Academic Field Pass',
          outTime: '2025-09-10 10:00',
          inTime: '2025-09-10 17:30',
          gate: 'Gate 2 (Library North)',
          guard: 'Sunil Pradhan',
          status: 'COMPLETED',
        },
      ],
      complaintHistory: [
        {
          id: 'CMP-40192',
          category: 'Electrical',
          title: 'Study lamp socket short circuit',
          date: '2025-09-22',
          status: 'RESOLVED',
          priority: 'HIGH',
          resolvedDate: '2025-09-23 11:30 AM',
          feedback: 'Confirmed fixed by student',
        },
        {
          id: 'CMP-39108',
          category: 'Wi-Fi / Internet',
          title: 'Low signal strength on 2nd floor corridor',
          date: '2025-09-08',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          resolvedDate: '2025-09-09 04:00 PM',
          feedback: 'AP rebooted & signal amplified',
        },
      ],
      serviceHistory: [
        {
          id: 'SRV-1029',
          type: 'Plumbing',
          description: 'Water tap washer replacement in Room washroom',
          status: 'COMPLETED',
          date: '2025-09-15',
          technician: 'Manoj Jena (Plumber)',
        },
        {
          id: 'SRV-0982',
          type: 'Carpentry',
          description: 'Study table drawer hinge repair',
          status: 'COMPLETED',
          date: '2025-08-28',
          technician: 'Prakash Sahoo (Carpenter)',
        },
      ],
    },
    {
      id: 'std-2',
      name: 'Priya Sahu',
      rollNo: '2101289045',
      dept: 'Electronics & Telecommunication',
      course: 'B.Tech',
      year: '3rd Year',
      semester: '6th Semester',
      hostel: 'Shivalik Block B',
      blockName: 'Shivalik Block B',
      room: 'B-112',
      status: 'ACTIVE',
      phone: '+91 98765 43211',
      email: 'priya.sahu@rec.ac.in',
      parentName: 'R. K. Sahu',
      parentRelation: 'Father',
      parentPhone: '+91 94370 22334',
      guardianAddress: 'District Berhampur, Ganjam, Odisha',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      kyc: 'Verified',
      presence: 'IN_HOSTEL',
      cgpa: '9.12',
      bloodGroup: 'O+',
      leaveHistory: [
        {
          id: 'LV-8850',
          type: 'Weekend Home Visit',
          from: '2025-09-20',
          to: '2025-09-22',
          reason: 'Family visit',
          status: 'APPROVED',
          approvedBy: 'Warden Sharma',
          returnStatus: 'RETURNED_ON_TIME',
        },
      ],
      gatePassHistory: [
        {
          id: 'GP-8990',
          passType: 'Day Pass',
          outTime: '2025-09-27 15:00',
          inTime: '2025-09-27 19:30',
          gate: 'Main Turnstile Gate 1',
          guard: 'Vikram Singh',
          status: 'COMPLETED',
        },
      ],
      complaintHistory: [
        {
          id: 'CMP-40112',
          category: 'Mess / Food',
          title: 'Special diet request for fast day',
          date: '2025-09-18',
          status: 'RESOLVED',
          priority: 'LOW',
          resolvedDate: '2025-09-19',
          feedback: 'Accommodated by Mess supervisor',
        },
      ],
      serviceHistory: [
        {
          id: 'SRV-1011',
          type: 'Electrical',
          description: 'Tube light flickers at night',
          status: 'COMPLETED',
          date: '2025-09-10',
          technician: 'K. C. Jena (Electrician)',
        },
      ],
    },
    {
      id: 'std-3',
      name: 'Amit Patel',
      rollNo: '2201289012',
      dept: 'Mechanical Engineering',
      course: 'B.Tech',
      year: '2nd Year',
      semester: '4th Semester',
      hostel: 'Nilgiri Block A',
      blockName: 'Nilgiri Block A',
      room: 'A-305',
      status: 'ACTIVE',
      phone: '+91 98765 43212',
      email: 'amit.patel@rec.ac.in',
      parentName: 'Sunil Patel',
      parentRelation: 'Father',
      parentPhone: '+91 94370 33445',
      guardianAddress: 'Rourkela Sector 4, Sundargarh, Odisha',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      kyc: 'Verified',
      presence: 'OUT_PERMITTED',
      cgpa: '8.10',
      bloodGroup: 'A+',
      leaveHistory: [
        {
          id: 'LV-8995',
          type: 'Day Outing',
          from: '2025-09-30',
          to: '2025-09-30',
          reason: 'CAD Project workshop seminar',
          status: 'APPROVED',
          approvedBy: 'Chief Warden Mohapatra',
          returnStatus: 'EXPECTED_BY_21:00',
        },
      ],
      gatePassHistory: [
        {
          id: 'GP-9120',
          passType: 'Day Pass',
          outTime: '2025-09-30 14:15',
          inTime: null,
          gate: 'Main Turnstile Gate 1',
          guard: 'Vikram Singh',
          status: 'ACTIVE_OUTSIDE',
        },
      ],
      complaintHistory: [],
      serviceHistory: [],
    },
    {
      id: 'std-4',
      name: 'Sneha Mohanty',
      rollNo: '2301289078',
      dept: 'Civil Engineering',
      course: 'B.Tech',
      year: '1st Year',
      semester: '2nd Semester',
      hostel: 'Shivalik Block B',
      blockName: 'Shivalik Block B',
      room: 'B-201',
      status: 'ACTIVE',
      phone: '+91 98765 43213',
      email: 'sneha.mohanty@rec.ac.in',
      parentName: 'Dr. P. C. Mohanty',
      parentRelation: 'Father',
      parentPhone: '+91 94370 44556',
      guardianAddress: 'CDA Sector 9, Cuttack',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      kyc: 'Verified',
      presence: 'IN_HOSTEL',
      cgpa: '8.95',
      bloodGroup: 'AB+',
      leaveHistory: [],
      gatePassHistory: [],
      complaintHistory: [],
      serviceHistory: [],
    },
    {
      id: 'std-5',
      name: 'Rohan Jena',
      rollNo: '2001289019',
      dept: 'Electrical Engineering',
      course: 'B.Tech',
      year: '4th Year',
      semester: '8th Semester',
      hostel: 'Nilgiri Block A',
      blockName: 'Nilgiri Block A',
      room: 'A-102',
      status: 'SUSPENDED',
      phone: '+91 98765 43214',
      email: 'rohan.jena@rec.ac.in',
      parentName: 'K. K. Jena',
      parentRelation: 'Father',
      parentPhone: '+91 94370 55667',
      guardianAddress: 'Puri Town, Odisha',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      kyc: 'Pending',
      presence: 'OVERDUE',
      cgpa: '7.45',
      bloodGroup: 'B-',
      leaveHistory: [
        {
          id: 'LV-8801',
          type: 'Day Pass',
          from: '2025-09-25',
          to: '2025-09-25',
          reason: 'Personal errand',
          status: 'APPROVED',
          approvedBy: 'Warden Sharma',
          returnStatus: 'OVERDUE_CURFEW_BREACH',
        },
      ],
      gatePassHistory: [
        {
          id: 'GP-8899',
          passType: 'Day Pass',
          outTime: '2025-09-25 17:00',
          inTime: '2025-09-25 22:45',
          gate: 'Main Gate 1',
          guard: 'Security Station',
          status: 'FLAGGED_LATE_ENTRY',
        },
      ],
      complaintHistory: [
        {
          id: 'CMP-38910',
          category: 'Discipline',
          title: 'Late entry curfew explanation submitted',
          date: '2025-09-26',
          status: 'PENDING_WARDEN_REVIEW',
          priority: 'HIGH',
          resolvedDate: null,
          feedback: 'Notice issued to parents',
        },
      ],
      serviceHistory: [],
    },
    {
      id: 'std-6',
      name: 'Anjali Das',
      rollNo: '2101289088',
      dept: 'Computer Science & Engineering',
      course: 'B.Tech',
      year: '3rd Year',
      semester: '6th Semester',
      hostel: 'Shivalik Block B',
      blockName: 'Shivalik Block B',
      room: 'B-310',
      status: 'ACTIVE',
      phone: '+91 98765 43215',
      email: 'anjali.das@rec.ac.in',
      parentName: 'H. N. Das',
      parentRelation: 'Father',
      parentPhone: '+91 94370 66778',
      guardianAddress: 'Baramunda, Bhubaneswar',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      kyc: 'Verified',
      presence: 'IN_HOSTEL',
      cgpa: '8.82',
      bloodGroup: 'O-',
      leaveHistory: [],
      gatePassHistory: [],
      complaintHistory: [],
      serviceHistory: [],
    },
  ]);

  const studentList = residents && residents.length > 0 ? residents : mockStudents;

  const filtered = studentList.filter((s) => {
    const matchSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNo || s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.room || s.roomNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'ALL' || (s.dept || '').includes(selectedDept);
    return matchSearch && matchDept;
  });

  // Toggle Account Status for Selected Student
  const handleToggleAccountStatus = (studentId: string) => {
    const current = selectedStudent?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setMockStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: current } : s))
    );
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({ ...selectedStudent, status: current });
    }
    setActionSuccessMsg(`Account status updated to ${current}`);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Open rich dossier print view
  const handlePrintDossier = (student: any) => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-3 bg-white p-3 rounded-2xl shadow-2xs">
        {subTabs.map((tab) => {
          const isAdmissionTab = tab === 'Admission Requests';
          const count = pendingStudents.length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                currentTab === tab
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70'
              }`}
            >
              <span>{tab}</span>
              {isAdmissionTab && count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                    currentTab === tab
                      ? 'bg-white text-blue-600'
                      : 'bg-amber-500 text-white animate-pulse'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Prominent Pending Admissions Notification Banner */}
      {pendingStudents.length > 0 && currentTab !== 'Admission Requests' && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-amber-400/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                {pendingStudents.length} New Student Admission Request{pendingStudents.length > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-[11px] text-slate-500">
                Students have completed registration and are waiting for your approval to enter the student resident portal.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSubTab('Admission Requests')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-sm shrink-0 flex items-center space-x-1.5"
          >
            <span>Review & Admit Students ({pendingStudents.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ADMISSION REQUESTS TAB */}
      {currentTab === 'Admission Requests' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-slate-800">New Student Admission Requests</h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {pendingStudents.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Verify identity, approve admission, and allocate rooms. Once approved, the student resident app unlocks in real-time.
              </p>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Requests</span>
              </button>
            )}
          </div>

          {pendingStudents.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">All Student Admission Requests Processed</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                There are no pending admission requests. When new students register on their mobile or web portal, their request will appear here with live notification alerts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingStudents.map((st: any) => {
                const sId = st.id || st.userId;
                return (
                  <div
                    key={sId || st.email}
                    className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={st.avatarUrl || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{st.name}</h4>
                          <p className="text-xs text-blue-600 font-mono font-bold">
                            Roll / ID: {st.studentId || st.residentProfile?.studentId || 'Under Verification'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">{st.email}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        Pending Admission
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Course & Department</span>
                        <p className="font-bold text-slate-800 truncate">{st.course || st.residentProfile?.course || 'Engineering'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Academic Year</span>
                        <p className="font-bold text-slate-800">{st.year || st.residentProfile?.year || '1st Year'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Requested Hostel & Room</span>
                        <p className="font-bold text-slate-800">
                          {st.blockName || st.residentProfile?.blockName || 'Block A'} • Room {st.roomNumber || st.residentProfile?.roomNumber || '101'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Guardian Contact</span>
                        <p className="font-bold text-slate-800 truncate">{st.parentPhone || st.phone || '+91 98000 00000'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">
                        College: <strong className="text-slate-700">{st.tenantName || 'REC Campus'}</strong>
                      </span>
                      <div className="flex items-center space-x-2">
                        {onRejectStudent && (
                          <button
                            type="button"
                            onClick={() => onRejectStudent(sId, st.name)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        {onApproveStudent && (
                          <button
                            type="button"
                            onClick={() => onApproveStudent(sId, st.name)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/25 cursor-pointer flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Admit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 1. STUDENT PROFILES TAB */}
      {currentTab === 'Student Profiles' && (
        <div className="space-y-5">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Student Directory & Profiles</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total enrolled students: <span className="font-bold text-blue-600">{studentList.length}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, roll number, room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-64"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold border-b border-slate-200/80">
                  <tr>
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Roll / Reg Number</th>
                    <th className="p-3.5">Department & Year</th>
                    <th className="p-3.5">Hostel & Room</th>
                    <th className="p-3.5">Presence Status</th>
                    <th className="p-3.5">Account Status</th>
                    <th className="p-3.5">Parent Contact</th>
                    <th className="p-3.5">KYC Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={s.avatar || s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.phone || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs font-semibold text-slate-700">
                        {s.rollNo || s.studentId}
                      </td>
                      <td className="p-3.5">
                        <p className="font-semibold text-slate-800">{s.dept || 'Engineering'}</p>
                        <p className="text-[10px] text-slate-400">{s.year || '3rd Year'}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">{s.room || s.roomNumber || 'Room N/A'}</span>
                        <p className="text-[10px] text-slate-500">{s.hostel || s.blockName || 'Nilgiri A'}</p>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.presence === 'IN_HOSTEL' || s.currentPresence === 'IN_HOSTEL'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.presence === 'OVERDUE' || s.currentPresence === 'OVERDUE'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {(s.presence || s.currentPresence || 'IN_HOSTEL').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {s.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {s.parentPhone || '+91 94370 00000'}
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>{s.kyc || 'Verified'}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(s);
                            setDrawerTab('OVERVIEW');
                          }}
                          className="px-3 py-1.5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs transition cursor-pointer shadow-xs shadow-blue-600/20 flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPARTMENT / YEAR TAB */}
      {currentTab === 'Department / Year' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-800 mb-1">Academic Department Distribution</h3>
            <p className="text-xs text-slate-500">Student enrollment and faculty ratio across active engineering branches.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Computer Science & Engineering', code: 'CSE', count: 840, hod: 'Dr. M. K. Rath', faculty: 34, color: 'border-l-blue-600' },
              { name: 'Mechanical Engineering', code: 'ME', count: 420, hod: 'Prof. R. C. Dash', faculty: 22, color: 'border-l-emerald-600' },
              { name: 'Civil Engineering', code: 'CE', count: 360, hod: 'Dr. S. K. Nayak', faculty: 18, color: 'border-l-amber-600' },
              { name: 'Electrical Engineering', code: 'EE', count: 480, hod: 'Prof. P. Samal', faculty: 24, color: 'border-l-purple-600' },
              { name: 'Electronics & Telecomm', code: 'ETC', count: 385, hod: 'Dr. A. Behera', faculty: 20, color: 'border-l-rose-600' },
            ].map((dept, i) => (
              <div key={i} className={`bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs border-l-4 ${dept.color}`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {dept.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{dept.count} Students</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-2">{dept.name}</h4>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>HOD: <strong className="text-slate-700">{dept.hod}</strong></span>
                  <span>Faculty: <strong className="text-slate-700">{dept.faculty}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Year-wise Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h4 className="text-sm font-bold text-slate-800 mb-4">Batch Year Progression</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { year: '1st Year (2024 Batch)', count: '650 Students', activePass: '98% on campus', bg: 'bg-blue-50/70 text-blue-700' },
                { year: '2nd Year (2023 Batch)', count: '620 Students', activePass: '95% on campus', bg: 'bg-emerald-50/70 text-emerald-700' },
                { year: '3rd Year (2022 Batch)', count: '615 Students', activePass: '92% on campus', bg: 'bg-purple-50/70 text-purple-700' },
                { year: '4th Year (2021 Batch)', count: '600 Students', activePass: '88% on campus (Internships)', bg: 'bg-amber-50/70 text-amber-700' },
              ].map((yr, i) => (
                <div key={i} className={`p-4 rounded-xl border border-slate-200/70 ${yr.bg}`}>
                  <p className="font-bold text-xs">{yr.year}</p>
                  <p className="text-lg font-black text-slate-900 mt-1">{yr.count}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{yr.activePass}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ROLL NUMBER LOOKUP TAB */}
      {currentTab === 'Roll Number' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">University Roll Number Verification</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quick search by BPUT University Registration Number or College Roll ID.</p>
          </div>

          <div className="max-w-md flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. 2101289001..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                const found = studentList.find(
                  (s) => (s.rollNo || s.studentId || '').includes(searchTerm)
                );
                if (found) {
                  setSelectedStudent(found);
                } else {
                  alert(`No student record found with Roll Number matching "${searchTerm}"`);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Verify & View
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Registered Roll Numbers (Click to view deep dossier)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-600">
              {studentList.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900">{s.rollNo || s.studentId}</span>
                  <span className="text-[10px] text-slate-500">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. HOSTEL ALLOCATION TAB */}
      {currentTab === 'Hostel Allocation' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Hostel Bed Allocation Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage room allotments, vacate requests, and block transfers.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              + Allot New Bed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Nilgiri Block A (Boys)</span>
                <span className="text-xs font-bold text-blue-600">620 / 800</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '77.5%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">180 beds available</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Shivalik Block B (Girls)</span>
                <span className="text-xs font-bold text-emerald-600">510 / 650</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '78.4%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">140 beds available</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">Aravali Residence</span>
                <span className="text-xs font-bold text-purple-600">107 / 130</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82.3%' }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">23 rooms available</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACCOUNT STATUS TAB */}
      {currentTab === 'Account Status' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Account Access & Disciplinary Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">Control active student portal login credentials, disciplinary suspensions, and clearance status.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <p className="text-xs font-bold">Active Accounts</p>
              <p className="text-xl font-black mt-1">2,450</p>
              <p className="text-[10px] text-emerald-600">Full Portal Access</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <p className="text-xs font-bold">Fee Pending Verification</p>
              <p className="text-xl font-black mt-1">23</p>
              <p className="text-[10px] text-amber-600">Grace period active</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <p className="text-xs font-bold">Suspended Accounts</p>
              <p className="text-xl font-black mt-1">12</p>
              <p className="text-[10px] text-rose-600">Disciplinary review</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800">
              <p className="text-xs font-bold">Graduated / Alumni</p>
              <p className="text-xl font-black mt-1">540</p>
              <p className="text-[10px] text-blue-600">Read-only archives</p>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Student Account Status List</h4>
            <div className="space-y-2">
              {studentList.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name} ({s.rollNo || s.studentId})</p>
                      <p className="text-[10px] text-slate-500">{s.dept} • {s.room || s.roomNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.status || 'ACTIVE'}
                    </span>
                    <button
                      onClick={() => handleToggleAccountStatus(s.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        s.status === 'ACTIVE'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="text-xs px-2.5 py-1 rounded-lg font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    >
                      View Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STUDENT DEEP DOSSIER & HISTORY DRAWER (SLIDE-OVER MODAL)  */}
      {/* ========================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-[#0a192f] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3.5">
                <img
                  src={selectedStudent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt=""
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-black text-white">{selectedStudent.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedStudent.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {selectedStudent.status || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 font-mono font-medium">
                    Roll: {selectedStudent.rollNo || selectedStudent.studentId || 'N/A'} • {selectedStudent.dept || 'Engineering'}
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Hostel: {selectedStudent.hostel || selectedStudent.blockName || 'Nilgiri A'} • Room {selectedStudent.room || selectedStudent.roomNumber || 'A-204'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePrintDossier(selectedStudent)}
                  title="Print Dossier"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success Toast */}
            {actionSuccessMsg && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Quick Metrics & Account Toggle Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Presence</span>
                  <span
                    className={`font-black text-xs ${
                      selectedStudent.presence === 'IN_HOSTEL'
                        ? 'text-emerald-700'
                        : selectedStudent.presence === 'OVERDUE'
                        ? 'text-rose-700 animate-pulse'
                        : 'text-amber-700'
                    }`}
                  >
                    {(selectedStudent.presence || 'IN_HOSTEL').replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">CGPA</span>
                  <span className="font-black text-slate-800">{selectedStudent.cgpa || '8.50'}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Blood Group</span>
                  <span className="font-black text-slate-800">{selectedStudent.bloodGroup || 'B+'}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Leaves Taken</span>
                  <span className="font-black text-blue-600">
                    {selectedStudent.leaveHistory ? selectedStudent.leaveHistory.length : 3}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${selectedStudent.parentPhone || '+919437000000'}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center space-x-1 border border-blue-200 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Guardian</span>
                </a>
                <button
                  onClick={() => handleToggleAccountStatus(selectedStudent.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center space-x-1 ${
                    selectedStudent.status === 'ACTIVE'
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {selectedStudent.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{selectedStudent.status === 'ACTIVE' ? 'Suspend Portal' : 'Activate Portal'}</span>
                </button>
              </div>
            </div>

            {/* Deep History Tabs Nav */}
            <div className="flex border-b border-slate-200 px-5 pt-3 bg-white shrink-0 overflow-x-auto text-xs font-bold text-slate-600 gap-1">
              <button
                onClick={() => setDrawerTab('OVERVIEW')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'OVERVIEW'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <span>Profile & Contacts</span>
              </button>
              <button
                onClick={() => setDrawerTab('CORRECTIONS')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'CORRECTIONS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Correction Requests</span>
                {pendingCorrectionsList.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black animate-pulse">
                    {pendingCorrectionsList.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDrawerTab('ACADEMICS')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'ACADEMICS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academics</span>
              </button>
              <button
                onClick={() => setDrawerTab('DOCUMENTS')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'DOCUMENTS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <FolderLock className="w-3.5 h-3.5" />
                <span>Govt Locker</span>
              </button>
              <button
                onClick={() => setDrawerTab('LEAVE')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'LEAVE'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Leaves ({selectedStudent.leaveHistory?.length || 3})</span>
              </button>
              <button
                onClick={() => setDrawerTab('GATE_PASS')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'GATE_PASS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Gate Pass ({selectedStudent.gatePassHistory?.length || 3})</span>
              </button>
              <button
                onClick={() => setDrawerTab('COMPLAINTS')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'COMPLAINTS'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Complaints ({selectedStudent.complaintHistory?.length || 2})</span>
              </button>
              <button
                onClick={() => setDrawerTab('SERVICES')}
                className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center space-x-1.5 ${
                  drawerTab === 'SERVICES'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Services ({selectedStudent.serviceHistory?.length || 2})</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
              {/* TAB 1: OVERVIEW & CONTACTS */}
              {drawerTab === 'OVERVIEW' && (
                <div className="space-y-4">
                  {/* Pending Corrections Alert */}
                  {pendingCorrectionsList.length > 0 && (
                    <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-amber-950">
                            {pendingCorrectionsList.length} Profile Correction Request{pendingCorrectionsList.length > 1 ? 's' : ''} Awaiting Review
                          </p>
                          <p className="text-[11px] text-amber-800">
                            Student has formally requested modifications to locked official records.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDrawerTab('CORRECTIONS')}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                      >
                        Review Requests
                      </button>
                    </div>
                  )}

                  {/* Academic & University Enrollment Details */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Academic & Enrollment Details</span>
                      <span className="text-[10px] text-blue-600 font-bold font-mono">
                        Batch: {profileData?.personalInfo?.batch || '2023 - 2027'}
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Course / Program</span>
                        <p className="font-bold text-slate-800">{selectedStudent.course || profileData?.personalInfo?.branch || 'B.Tech'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Department / Branch</span>
                        <p className="font-bold text-slate-800">{profileData?.personalInfo?.branch || selectedStudent.dept || 'Computer Science & Engineering'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Current Semester</span>
                        <p className="font-bold text-slate-800">
                          {profileData?.personalInfo?.semester || selectedStudent.semester || '5th Semester'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">University Roll No</span>
                        <p className="font-bold font-mono text-blue-700">
                          {profileData?.personalInfo?.rollNo || selectedStudent.rollNo || selectedStudent.studentId || '2501294204'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Registration No</span>
                        <p className="font-bold font-mono text-slate-700">
                          {profileData?.personalInfo?.regNo || '2301042001'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Admission Year</span>
                        <p className="font-bold text-slate-800">{profileData?.personalInfo?.admissionYear || '2023'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Demographics & Addresses */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Personal Demographics & Identity
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Date of Birth</span>
                        <p className="font-bold text-slate-800">{profileData?.personalInfo?.dob || '18-Jun-2004'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Gender</span>
                        <p className="font-bold text-slate-800">{profileData?.personalInfo?.gender || 'Male'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Blood Group</span>
                        <p className="font-bold text-rose-600">{profileData?.personalInfo?.bloodGroup || selectedStudent.bloodGroup || 'B+'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Category & Nationality</span>
                        <p className="font-bold text-slate-800">
                          {profileData?.personalInfo?.category || 'General'} • {profileData?.personalInfo?.nationality || 'Indian'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block">Official Student Email</span>
                        <p className="font-bold text-blue-700 truncate">
                          {profileData?.personalInfo?.email || selectedStudent.email || 'subhampradhan34864@gmail.com'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block">Student Contact Mobile</span>
                        <p className="font-bold text-slate-800 font-mono">
                          {profileData?.personalInfo?.studentPhone || selectedStudent.phone || '+91 7653993919'}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-4">
                        <span className="text-[10px] text-slate-400 font-bold block">Permanent Residential Address</span>
                        <p className="font-medium text-slate-700">
                          {profileData?.personalInfo?.permanentAddress || selectedStudent.guardianAddress || 'Plot 42, VSS Nagar, Bhubaneswar, Odisha - 751007'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hostel & Room Allocation with Roommates & Fee Status */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Hostel Allocation & Resident Services
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Fee: {profileData?.hostelDetails?.hostelFeeStatus || 'PAID'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          {profileData?.hostelDetails?.messPlan || 'Non-Veg Meals'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Hostel Block</span>
                        <p className="font-bold text-slate-800">{profileData?.hostelDetails?.hostelBlock || selectedStudent.hostel || selectedStudent.blockName || 'Hostel A (Nilgiri Block A)'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Floor & Room</span>
                        <p className="font-bold text-blue-700">
                          {profileData?.hostelDetails?.floor || '2nd Floor'} • Rm {profileData?.hostelDetails?.roomNumber || selectedStudent.room || selectedStudent.roomNumber || 'A-204'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Allotted Bed</span>
                        <p className="font-bold text-slate-800">Bed {profileData?.hostelDetails?.bedNumber || 'B1'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Check-in Date</span>
                        <p className="font-bold text-slate-800">{profileData?.hostelDetails?.checkInDate || '10 Aug 2023'}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Assigned Chief Hostel Warden</span>
                          <p className="font-bold text-slate-900 text-xs">{profileData?.hostelDetails?.wardenName || 'Dr. K.P. Mohapatra'}</p>
                        </div>
                        <a
                          href={`tel:${profileData?.hostelDetails?.wardenPhone || '+919437011223'}`}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3 text-blue-600" />
                          <span>Call Warden</span>
                        </a>
                      </div>
                      {/* Roommates */}
                      {profileData?.hostelDetails?.roommates && profileData.hostelDetails.roommates.length > 0 && (
                        <div className="col-span-2 sm:col-span-4 space-y-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-bold block">Allocated Roommates</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {profileData.hostelDetails.roommates.map((rm, idx) => (
                              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-slate-900">{rm.name}</p>
                                  <p className="text-[10px] text-slate-500">{rm.branch} • Bed {rm.bed}</p>
                                </div>
                                <span className="text-[10px] font-mono text-blue-600 font-bold">{rm.rollNo}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Family & Emergency Contacts */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Family & Emergency Contacts</span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-emerald-600" />
                        Active in Campus SOS Dispatch
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">👨‍👦 Father's Name</span>
                          <p className="font-bold text-slate-900">{profileData?.familyEmergency?.fatherName || selectedStudent.parentName || 'Balakrushna Pradhan'}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{profileData?.familyEmergency?.fatherPhone || selectedStudent.parentPhone || '+91 94370 88214'}</p>
                        </div>
                        <a
                          href={`tel:${profileData?.familyEmergency?.fatherPhone || selectedStudent.parentPhone || '+919437088214'}`}
                          className="p-2 bg-white hover:bg-slate-100 text-blue-600 rounded-lg border border-slate-200 shadow-2xs"
                          title="Call Father"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">👩‍👦 Mother's Name</span>
                          <p className="font-bold text-slate-900">{profileData?.familyEmergency?.motherName || 'Snehalata Pradhan'}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{profileData?.familyEmergency?.motherPhone || '+91 94372 99120'}</p>
                        </div>
                        <a
                          href={`tel:${profileData?.familyEmergency?.motherPhone || '+919437299120'}`}
                          className="p-2 bg-white hover:bg-slate-100 text-blue-600 rounded-lg border border-slate-200 shadow-2xs"
                          title="Call Mother"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">🏡 Local Guardian</span>
                          <p className="font-bold text-slate-900">
                            {profileData?.familyEmergency?.localGuardianName || 'Manoranjan Mohanty'} ({profileData?.familyEmergency?.localGuardianRelation || 'Uncle'})
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{profileData?.familyEmergency?.localGuardianPhone || '+91 98611 77332'}</p>
                        </div>
                        <a
                          href={`tel:${profileData?.familyEmergency?.localGuardianPhone || '+919861177332'}`}
                          className="p-2 bg-white hover:bg-slate-100 text-blue-600 rounded-lg border border-slate-200 shadow-2xs"
                          title="Call Local Guardian"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-rose-600 font-black block">🚨 Primary SOS Contact</span>
                          <p className="font-bold text-slate-900">
                            {profileData?.familyEmergency?.primaryEmergencyName || 'Balakrushna Pradhan'} ({profileData?.familyEmergency?.primaryEmergencyRelation || 'Father'})
                          </p>
                          <p className="text-[11px] text-slate-700 font-mono font-bold">{profileData?.familyEmergency?.primaryEmergencyPhone || '+91 94370 88214'}</p>
                        </div>
                        <a
                          href={`tel:${profileData?.familyEmergency?.primaryEmergencyPhone || '+919437088214'}`}
                          className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs"
                          title="Call Primary Emergency Contact"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {profileData?.familyEmergency?.familyDoctorName && (
                        <div className="col-span-1 sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block">🩺 Family Doctor & Clinic</span>
                            <p className="font-bold text-slate-900">
                              {profileData.familyEmergency.familyDoctorName} • {profileData.familyEmergency.familyDoctorClinic || 'Family Clinic'}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">{profileData.familyEmergency.familyDoctorPhone}</p>
                          </div>
                          <a
                            href={`tel:${profileData.familyEmergency.familyDoctorPhone}`}
                            className="p-2 bg-white hover:bg-slate-100 text-blue-600 rounded-lg border border-slate-200 shadow-2xs"
                            title="Call Doctor"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CORRECTION REQUESTS REVIEW */}
              {drawerTab === 'CORRECTIONS' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Student Profile Correction Requests
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Review and approve modifications to locked student records (Roll No, Branch, Room).
                      </p>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {profileData?.correctionRequests?.length || 0} Request{profileData?.correctionRequests?.length !== 1 ? 's' : ''} on file
                    </span>
                  </div>

                  {reviewError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {(!profileData?.correctionRequests || profileData.correctionRequests.length === 0) ? (
                    <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-bold text-slate-700">No Correction Requests Pending</p>
                      <p className="text-[11px] text-slate-400">This student has not submitted any profile alteration requests.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {profileData.correctionRequests.map((req) => (
                        <div
                          key={req.id}
                          className={`p-4 rounded-2xl border transition space-y-3 ${
                            req.status === 'PENDING'
                              ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                              : req.status === 'APPROVED'
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-black text-xs text-slate-900 uppercase tracking-wide">
                                Field: {req.field}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">#{req.id}</span>
                            </div>
                            <span
                              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                req.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : req.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold block">Current Value in Record</span>
                              <p className="font-bold text-slate-700 line-through">{req.currentValue || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-[10px] text-blue-600 font-black block">Requested New Value</span>
                              <p className="font-black text-blue-700">{req.requestedValue || 'N/A'}</p>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-bold block">Student Justification / Reason:</span>
                              <p className="font-medium text-slate-800 text-xs mt-0.5">{req.reason}</p>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                Submitted: {new Date(req.submittedAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {req.status === 'PENDING' ? (
                            <div className="pt-2 space-y-2 border-t border-slate-200/80">
                              <input
                                type="text"
                                placeholder="Add an admin note / review remarks (optional)..."
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400"
                              />
                              <div className="flex items-center justify-end space-x-2 pt-1">
                                <button
                                  type="button"
                                  disabled={reviewSubmitting}
                                  onClick={() => handleReviewCorrection(req.id, 'REJECTED')}
                                  className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                                >
                                  Reject Request
                                </button>
                                <button
                                  type="button"
                                  disabled={reviewSubmitting}
                                  onClick={() => handleReviewCorrection(req.id, 'APPROVED')}
                                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{reviewSubmitting ? 'Processing...' : 'Approve & Update Field'}</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 bg-white/70 rounded-xl border border-slate-200 text-xs space-y-0.5">
                              <p className="text-[11px] text-slate-700 font-bold">
                                Admin Note: <span className="font-normal">{req.adminNote || 'No notes added'}</span>
                              </p>
                              {req.reviewedAt && (
                                <p className="text-[10px] text-slate-400">Reviewed on: {new Date(req.reviewedAt).toLocaleString()}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ACADEMIC COLLECTION & PERFORMANCE */}
              {drawerTab === 'ACADEMICS' && (
                <div className="space-y-4">
                  {/* Top Academic Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cumulative CGPA</span>
                      <p className="text-2xl font-black text-blue-600 mt-0.5">{profileData?.academicCollection?.cgpa || '8.84'}</p>
                      <span className="text-[10px] text-emerald-600 font-bold">Top 5% of Batch</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Backlogs</span>
                      <p className="text-2xl font-black text-emerald-600 mt-0.5">0</p>
                      <span className="text-[10px] text-emerald-700 font-bold">All Clear</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Semester</span>
                      <p className="text-2xl font-black text-slate-900 mt-0.5">5th Sem</p>
                      <span className="text-[10px] text-slate-500 font-bold">3rd Academic Year</span>
                    </div>
                  </div>

                  {/* Subject-Wise Attendance & Eligibility */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Subject Attendance & 75% Exam Eligibility</span>
                      <span className="text-[10px] text-slate-500 font-bold">Autonomous Rule: Minimum 75% Required</span>
                    </h4>
                    <div className="space-y-2">
                      {(profileData?.academicCollection?.subjects || [
                        { code: 'CS501', name: 'Design & Analysis of Algorithms', attended: 46, total: 50, percentage: 92, eligible: true },
                        { code: 'CS502', name: 'Database Management Systems', attended: 44, total: 50, percentage: 88, eligible: true },
                        { code: 'CS503', name: 'Operating Systems & System Calls', attended: 43, total: 50, percentage: 86, eligible: true },
                        { code: 'CS504', name: 'Computer Networks & Protocols', attended: 42, total: 50, percentage: 84, eligible: true },
                        { code: 'CS505', name: 'Software Engineering & Agile Labs', attended: 45, total: 50, percentage: 90, eligible: true }
                      ]).map((sub, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold font-mono text-blue-600 text-[11px]">{sub.code}</span>
                            <h5 className="font-bold text-slate-900 text-xs mt-0.5">{sub.name}</h5>
                            <p className="text-[10px] text-slate-400">Classes: {sub.attended} / {sub.total} attended</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900">{sub.percentage}%</span>
                            <div>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                                sub.percentage >= 75
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}>
                                {sub.percentage >= 75 ? '✓ Exam Eligible' : '⚠️ Shortage'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements, Projects & Internships */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Student Projects, Internships & Achievements
                    </h4>
                    <div className="space-y-2">
                      {(profileData?.academicCollection?.achievements || [
                        { id: 'ach-1', title: 'Smart Campus Management System', type: 'Project', org: 'HackOdisha Finalist', date: 'Oct 2024', description: 'Full-stack IoT & cloud portal for automated turnstiles.' },
                        { id: 'ach-2', title: 'Full Stack Web Developer Intern', type: 'Internship', org: 'Tech Innovators Hub', date: 'May - July 2024', description: 'Engineered Next.js & Express microservices with 99.9% uptime.' },
                        { id: 'ach-3', title: 'Dean Academic Excellence Honor', type: 'Award', org: 'Apex Tech University', date: 'Jan 2024', description: 'Top 3% semester academic ranking in CSE department.' }
                      ]).map((ach) => (
                        <div key={ach.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <h5 className="font-black text-slate-900">{ach.title}</h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              {ach.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{ach.description}</p>
                          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span>{ach.org}</span>
                            <span>{ach.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: GOVERNMENT LOCKER & VERIFICATION */}
              {drawerTab === 'DOCUMENTS' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <FolderLock className="w-4 h-4 text-blue-600" />
                        <span>Government Locker Documents</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Official statutory credentials, certificates, and ID proofs. Encrypted storage.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      🔒 Audit Logged
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(profileData?.governmentLocker || [
                      { id: 'doc-1', type: 'Aadhaar Card', maskedNumber: 'XXXX-XXXX-4204', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '1.4 MB' },
                      { id: 'doc-2', type: 'PAN Card', maskedNumber: 'XXXXX4204F', uploadDate: '2023-08-14', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '980 KB' },
                      { id: 'doc-3', type: '10th Board Certificate', maskedNumber: 'BSE-XXXX-1029', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '2.1 MB' },
                      { id: 'doc-4', type: '12th Science Marksheet', maskedNumber: 'CHSE-XXXX-8821', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '2.4 MB' },
                      { id: 'doc-5', type: 'College Transfer Certificate (TC)', maskedNumber: 'TC-2023-8901', uploadDate: '2023-08-15', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '850 KB' },
                      { id: 'doc-6', type: 'Resident / Domicile Certificate', maskedNumber: 'DOM-OD-9921', uploadDate: '2023-08-18', expiry: '2028-08-18', status: 'VERIFIED', fileSize: '1.2 MB' },
                    ]).map((doc) => (
                      <div key={doc.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-slate-900 truncate">{doc.type}</h5>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                            doc.status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : doc.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Doc ID: <span className="font-bold text-slate-700">{doc.maskedNumber}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                          <span>Uploaded: {doc.uploadDate || 'N/A'}</span>
                          <button
                            type="button"
                            onClick={() => setViewingDoc(doc)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Doc</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* TAB 2: LEAVE HISTORY */}
              {drawerTab === 'LEAVE' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Leave Records & Approvals
                    </h4>
                    <span className="text-[11px] text-slate-400">Total leaves: {selectedStudent.leaveHistory?.length || 3}</span>
                  </div>

                  {(selectedStudent.leaveHistory || [
                    {
                      id: 'LV-8921',
                      type: 'Weekend Home Visit',
                      from: '2025-09-26',
                      to: '2025-09-29',
                      reason: 'Family visit in Cuttack',
                      status: 'APPROVED',
                      approvedBy: 'Chief Warden Mohapatra',
                      returnStatus: 'RETURNED_ON_TIME',
                    },
                    {
                      id: 'LV-8412',
                      type: 'Medical Leave',
                      from: '2025-09-12',
                      to: '2025-09-15',
                      reason: 'Dental surgery & recuperation',
                      status: 'APPROVED',
                      approvedBy: 'Dr. Mahapatra (Medical)',
                      returnStatus: 'RETURNED_ON_TIME',
                    },
                  ]).map((lv: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-700 font-mono">{lv.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            lv.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {lv.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{lv.type}</h5>
                      <p className="text-[11px] text-slate-600">Reason: {lv.reason}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Duration: <strong className="text-slate-700">{lv.from}</strong> to <strong className="text-slate-700">{lv.to}</strong></span>
                        <span>Approved By: <strong className="text-slate-700">{lv.approvedBy}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: GATE PASS HISTORY */}
              {drawerTab === 'GATE_PASS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Gate-Pass Movements & QR Scans
                    </h4>
                    <span className="text-[11px] text-slate-400">Total gate passes: {selectedStudent.gatePassHistory?.length || 3}</span>
                  </div>

                  {(selectedStudent.gatePassHistory || [
                    {
                      id: 'GP-9011',
                      passType: 'Day Pass',
                      outTime: '2025-09-26 16:30',
                      inTime: '2025-09-26 20:45',
                      gate: 'Main Turnstile Gate 1',
                      guard: 'Vikram Singh (Security)',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'GP-8842',
                      passType: 'Weekend Pass',
                      outTime: '2025-09-19 18:00',
                      inTime: '2025-09-21 20:15',
                      gate: 'Main Turnstile Gate 1',
                      guard: 'R. K. Jena (Security)',
                      status: 'COMPLETED',
                    },
                  ]).map((gp: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-700 font-mono">{gp.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            gp.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : gp.status === 'ACTIVE_OUTSIDE'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {gp.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{gp.passType}</h5>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Out Time</span>
                          <strong>{gp.outTime || 'N/A'}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Return Time</span>
                          <strong>{gp.inTime || 'Still Outside'}</strong>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Gate: <strong className="text-slate-700">{gp.gate}</strong></span>
                        <span>Security: <strong className="text-slate-700">{gp.guard}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: COMPLAINTS / GRIEVANCES */}
              {drawerTab === 'COMPLAINTS' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Complaints & Grievances Lodged
                    </h4>
                    <span className="text-[11px] text-slate-400">Total tickets: {selectedStudent.complaintHistory?.length || 2}</span>
                  </div>

                  {(selectedStudent.complaintHistory || [
                    {
                      id: 'CMP-40192',
                      category: 'Electrical',
                      title: 'Study lamp socket short circuit',
                      date: '2025-09-22',
                      status: 'RESOLVED',
                      priority: 'HIGH',
                      resolvedDate: '2025-09-23 11:30 AM',
                      feedback: 'Confirmed fixed by student',
                    },
                  ]).map((cmp: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-700 font-mono">{cmp.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cmp.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {cmp.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{cmp.title}</h5>
                      <p className="text-[11px] text-slate-500">Category: {cmp.category} • Priority: {cmp.priority}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Lodged: <strong className="text-slate-700">{cmp.date}</strong></span>
                        <span>Resolved: <strong className="text-slate-700">{cmp.resolvedDate || 'In Progress'}</strong></span>
                      </div>
                    </div>
                  ))}
                  {(!selectedStudent.complaintHistory || selectedStudent.complaintHistory.length === 0) && (
                    <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                      No complaints lodged by this student.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: SERVICE REQUESTS */}
              {drawerTab === 'SERVICES' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Room Maintenance & Service Orders
                    </h4>
                    <span className="text-[11px] text-slate-400">Total orders: {selectedStudent.serviceHistory?.length || 2}</span>
                  </div>

                  {(selectedStudent.serviceHistory || [
                    {
                      id: 'SRV-1029',
                      type: 'Plumbing',
                      description: 'Water tap washer replacement in Room washroom',
                      status: 'COMPLETED',
                      date: '2025-09-15',
                      technician: 'Manoj Jena (Plumber)',
                    },
                  ]).map((srv: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-purple-700 font-mono">{srv.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {srv.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{srv.type} Service</h5>
                      <p className="text-[11px] text-slate-600">{srv.description}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Date: <strong className="text-slate-700">{srv.date}</strong></span>
                        <span>Technician: <strong className="text-slate-700">{srv.technician}</strong></span>
                      </div>
                    </div>
                  ))}
                  {(!selectedStudent.serviceHistory || selectedStudent.serviceHistory.length === 0) && (
                    <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                      No room maintenance orders on file.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FolderLock className="w-5 h-5 text-blue-600" />
                <h4 className="font-extrabold text-base text-slate-800">{viewingDoc.type}</h4>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Document Identifier</span>
                <span className="font-mono font-bold text-slate-800">{viewingDoc.maskedNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Verification Status</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  viewingDoc.status === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {viewingDoc.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Uploaded On</span>
                <span className="font-bold text-slate-700">{viewingDoc.uploadDate || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Encrypted File Size</span>
                <span className="font-bold text-slate-700">{viewingDoc.fileSize || '1.2 MB'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 text-center space-y-2">
              <FileCheck className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Official Government Verified Document</p>
              <p className="text-[11px] text-slate-500">
                This document is cryptographically verified against state registries and secured with institutional role-based access control.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-base text-slate-800">Add New Student Profile</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2 space-y-1">
                <label className="font-bold text-slate-700">Full Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Soumya Ranjan"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Roll / Reg Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2401289110"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Department</label>
                <select
                  value={newStudent.dept}
                  onChange={(e) => setNewStudent({ ...newStudent, dept: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Computer Science</option>
                  <option>Mechanical Engg</option>
                  <option>Civil Engg</option>
                  <option>Electrical Engg</option>
                  <option>Electronics & Telecomm</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Hostel Block</label>
                <select
                  value={newStudent.hostel}
                  onChange={(e) => setNewStudent({ ...newStudent, hostel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option>Nilgiri Block A</option>
                  <option>Shivalik Block B</option>
                  <option>Aravali Residence</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Room Number</label>
                <input
                  type="text"
                  placeholder="e.g. A-204"
                  value={newStudent.room}
                  onChange={(e) => setNewStudent({ ...newStudent, room: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Student Phone</label>
                <input
                  type="text"
                  placeholder="+91..."
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Parent Phone</label>
                <input
                  type="text"
                  placeholder="+91..."
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const created = {
                    id: `std-${Date.now()}`,
                    name: newStudent.name || 'New Student',
                    rollNo: newStudent.rollNo || '2401289999',
                    dept: newStudent.dept,
                    course: 'B.Tech',
                    year: newStudent.year,
                    semester: '1st Semester',
                    hostel: newStudent.hostel,
                    room: newStudent.room,
                    status: 'ACTIVE',
                    phone: newStudent.phone || '+91 98000 00000',
                    email: `${(newStudent.name || 'student').toLowerCase().replace(/\s+/g, '.')}@rec.ac.in`,
                    parentPhone: newStudent.parentPhone || '+91 94000 00000',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                    kyc: 'Verified',
                    presence: 'IN_HOSTEL',
                    leaveHistory: [],
                    gatePassHistory: [],
                    complaintHistory: [],
                    serviceHistory: [],
                  };
                  setMockStudents([created, ...mockStudents]);
                  setSelectedStudent(created);
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
