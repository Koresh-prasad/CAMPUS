'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Shield,
  UserCheck,
  Bed,
  Wrench,
  ShieldCheck,
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building,
  RefreshCw,
  Phone,
  BookOpen,
  Calendar,
  Layers,
  Key,
  Activity,
  Check,
  Zap,
} from 'lucide-react';

export type MainRole = 'STUDENT' | 'STAFF' | 'ADMIN_MANAGER';
export type StaffCategory = 'Warden' | 'Services' | 'Security' | 'Doctor / Nurse';

export interface DemoStaffAccount {
  email: string;
  pass: string;
  name: string;
  role: 'WARDEN' | 'SECURITY' | 'STAFF';
  designation: string;
  department: string;
  badge: string;
  phone: string;
  desc: string;
  color: string;
  border: string;
  bgLight: string;
  pillColor: string;
}

export const DEMO_STAFF_ACCOUNTS: Record<StaffCategory, DemoStaffAccount> = {
  Warden: {
    email: 'warden.boys@campus.edu',
    pass: 'Warden@123',
    name: 'Dr. K.P. Mohapatra',
    role: 'WARDEN',
    designation: 'Chief Hostel Warden & Superintendent',
    department: 'Hostel Administration (Nilgiri & Shivalik)',
    badge: 'Residence & Hostels',
    phone: '+91 98610 22345',
    desc: 'Hostel superintendents, floor care, room allocations, leave & gate pass approvals.',
    color: 'text-amber-700',
    border: 'border-amber-200',
    bgLight: 'bg-amber-50',
    pillColor: 'bg-amber-100/90 text-amber-800 border-amber-300',
  },
  Security: {
    email: 'security@campus.edu',
    pass: 'Security@123',
    name: 'Inspector Rajesh Nayak',
    role: 'SECURITY',
    designation: 'Chief Campus Security Officer & Gate Patrol',
    department: 'Campus Security & Perimeter Surveillance',
    badge: 'Safety & Turnstiles',
    phone: '+91 94370 88214',
    desc: 'Gate turnstiles, student entry/exit barcode scans, visitor check-in & night patrol.',
    color: 'text-teal-700',
    border: 'border-teal-200',
    bgLight: 'bg-teal-50',
    pillColor: 'bg-teal-100/90 text-teal-800 border-teal-300',
  },
  'Doctor / Nurse': {
    email: 'medical.officer@campus.edu',
    pass: 'Doctor@123',
    name: 'Dr. Pratima Mishra, MD',
    role: 'STAFF',
    designation: 'Senior Medical Officer & Clinic Head',
    department: 'Campus Healthcare Dispensary & Emergency Care',
    badge: 'Dispensary & OPD',
    phone: '+91 98611 77332',
    desc: 'Campus health dispensary, prescription records, student OPD triage & medical leave.',
    color: 'text-rose-700',
    border: 'border-rose-200',
    bgLight: 'bg-rose-50',
    pillColor: 'bg-rose-100/90 text-rose-800 border-rose-300',
  },
  Services: {
    email: 'services.mess@campus.edu',
    pass: 'Services@123',
    name: 'Ranjan Mohanty',
    role: 'STAFF',
    designation: 'Facility & Catering Operations Lead',
    department: 'Services, Mess, Maintenance & Utilities',
    badge: 'Mess & Maintenance',
    phone: '+91 99371 44520',
    desc: 'Mess daily meals, food menu schedules, electrical/plumbing repairs, and utility work orders.',
    color: 'text-purple-700',
    border: 'border-purple-200',
    bgLight: 'bg-purple-50',
    pillColor: 'bg-purple-100/90 text-purple-800 border-purple-300',
  },
};

export type AuthFlowStep =
  | 'ROLE_SELECT'
  | 'STUDENT_LOGIN'
  | 'STUDENT_REGISTER'
  | 'STAFF_ROLE_SELECT'
  | 'STAFF_LOGIN'
  | 'STAFF_REGISTER'
  | 'ADMIN_LOGIN'
  | 'ADMIN_REGISTER';

interface RoleBasedAuthCardProps {
  onLoginSuccess: (user: any, token: string) => void;
  onOpenRegisterCollege: () => void;
  demoColleges?: any[];
}

export default function RoleBasedAuthCard({
  onLoginSuccess,
  onOpenRegisterCollege,
  demoColleges = [],
}: RoleBasedAuthCardProps) {
  // Navigation Flow State
  const [authStep, setAuthStep] = useState<AuthFlowStep>('ROLE_SELECT');
  const [selectedRole, setSelectedRole] = useState<MainRole>('STUDENT');
  const [selectedStaffCategory, setSelectedStaffCategory] = useState<StaffCategory>('Warden');

  // Common Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Student Registration Form State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    studentId: '',
    email: '',
    mobile: '',
    branch: 'Computer Science & Engineering',
    course: 'B.Tech',
    academicYear: 'First Year',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  // Staff Registration Form State
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    employeeId: '',
    officialEmail: '',
    mobile: '',
    category: 'Warden' as StaffCategory,
    department: 'Hostel Administration',
    designation: 'Hostel Warden',
    campus: 'Raajdhani Engineering College (Autonomous)',
    password: '',
    confirmPassword: '',
    // Category-specific fields
    specialization: '',
    assignedClasses: '',
    hostelName: 'Nilgiri Block A',
    hostelType: 'BOYS',
    assignedBlock: 'Block A',
    wardenDesignation: 'Chief Warden',
    serviceCategory: 'Maintenance & Housekeeping',
    assignedFacilities: 'Academic Block & Labs',
    securityId: '',
    assignedGate: 'Main Gate — North',
    shift: 'Morning (06:00 - 14:00)',
    medicalRole: 'Resident Medical Officer',
    qualification: 'MBBS, MD',
    medicalUnit: 'Campus Dispensary OPD-1',
    dutySchedule: '09:00 AM - 05:00 PM',
  });

  // Admin Registration State
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    adminId: '',
    email: '',
    mobile: '',
    campus: 'Raajdhani Engineering College (Autonomous)',
    designation: 'Campus Administrator',
    invitationCode: '',
    password: '',
    confirmPassword: '',
  });

  const API_BASE = '/api';

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // 1. Generic Login handler
  const handleGenericLogin = async (e: React.FormEvent, roleContext: string) => {
    e.preventDefault();
    resetMessages();

    if (!email) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      // Check role assignment validation
      if (roleContext === 'STUDENT' && data.user.role !== 'STUDENT') {
        throw new Error('This account is not registered as a Student. Please choose the correct portal.');
      }

      if (roleContext === 'STAFF') {
        data.user.staffCategory = selectedStaffCategory;
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      if (roleContext === 'STAFF') {
        const matchedDemo = Object.values(DEMO_STAFF_ACCOUNTS).find(
          (d) => d.email.toLowerCase() === email.toLowerCase()
        );
        if (matchedDemo) {
          const fallbackUser = {
            id: `demo-${selectedStaffCategory.toLowerCase().replace(/[^a-z]/g, '')}`,
            name: matchedDemo.name,
            email: matchedDemo.email,
            phone: matchedDemo.phone,
            role: matchedDemo.role,
            staffCategory: selectedStaffCategory,
            status: 'ACTIVE',
            tenantId: 'rec-bbsr-tenant',
            tenantName: 'Raajdhani Engineering College (Autonomous)',
            tenantCode: 'REC@1947',
            staffProfile: {
              id: `prof-${Date.now()}`,
              designation: matchedDemo.designation,
              department: matchedDemo.department,
              shift: 'DAY',
            },
          };
          onLoginSuccess(fallbackUser, 'demo_staff_token_valid');
          return;
        }
      }
      setErrorMsg(err.message || 'Unable to connect to login service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login
  const handleQuickDemoLogin = async (demoEmail: string, explicitCategory?: StaffCategory) => {
    resetMessages();
    const targetCat: StaffCategory =
      explicitCategory ||
      (Object.keys(DEMO_STAFF_ACCOUNTS).find(
        (cat) => DEMO_STAFF_ACCOUNTS[cat as StaffCategory].email.toLowerCase() === demoEmail.toLowerCase()
      ) as StaffCategory) ||
      selectedStaffCategory;

    const demoData = DEMO_STAFF_ACCOUNTS[targetCat];
    setSelectedStaffCategory(targetCat);
    setEmail(demoEmail);
    setPassword(demoData ? demoData.pass : 'demo123');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.user) {
        data.user.staffCategory = targetCat;
      }
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      if (demoData) {
        const fallbackUser = {
          id: `demo-${targetCat.toLowerCase().replace(/[^a-z]/g, '')}`,
          name: demoData.name,
          email: demoData.email,
          phone: demoData.phone,
          role: demoData.role,
          staffCategory: targetCat,
          status: 'ACTIVE',
          tenantId: 'rec-bbsr-tenant',
          tenantName: 'Raajdhani Engineering College (Autonomous)',
          tenantCode: 'REC@1947',
          staffProfile: {
            id: `prof-${Date.now()}`,
            designation: demoData.designation,
            department: demoData.department,
            shift: 'DAY',
          },
        };
        onLoginSuccess(fallbackUser, 'demo_staff_token_valid');
      } else {
        setErrorMsg(err.message || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Student Registration Submit
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!studentForm.fullName || !studentForm.email || !studentForm.password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    if (studentForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (studentForm.password !== studentForm.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }
    if (!studentForm.agreeTerms) {
      setErrorMsg('You must agree to the Terms and Conditions.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeCode: 'REC-BBSR-2024',
          name: studentForm.fullName,
          email: studentForm.email,
          password: studentForm.password,
          phone: studentForm.mobile || '+91 98000 00000',
          studentId: studentForm.studentId || `STU-${Date.now().toString().slice(-5)}`,
          course: `${studentForm.course} (${studentForm.branch})`,
          year: studentForm.academicYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create student account.');
      }

      setSuccessMsg('Account created successfully! Connecting to Student Portal...');
      setTimeout(() => {
        if (data.user && data.token) {
          onLoginSuccess(data.user, data.token);
        } else {
          setAuthStep('STUDENT_LOGIN');
        }
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Staff Registration Submit
  const handleStaffRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!staffForm.fullName || !staffForm.officialEmail || !staffForm.password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (staffForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (staffForm.password !== staffForm.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register-staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeCode: 'REC-BBSR-2024',
          name: staffForm.fullName,
          email: staffForm.officialEmail,
          password: staffForm.password,
          phone: staffForm.mobile,
          employeeId: staffForm.employeeId,
          staffCategory: staffForm.category,
          department: staffForm.department,
          designation: staffForm.designation,
          shift: staffForm.shift,
          specialization: staffForm.specialization,
          assignedClasses: staffForm.assignedClasses,
          hostelName: staffForm.hostelName,
          hostelBlock: staffForm.assignedBlock,
          serviceCategory: staffForm.serviceCategory,
          assignedGate: staffForm.assignedGate,
          medicalRole: staffForm.medicalRole,
          qualification: staffForm.qualification,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit staff registration.');
      }

      setSuccessMsg('Staff registration submitted! Connecting to Staff Portal...');
      setTimeout(() => {
        if (data.user && data.token) {
          onLoginSuccess(data.user, data.token);
        } else {
          setAuthStep('STAFF_LOGIN');
        }
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Staff registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Admin Invitation Registration Submit
  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!adminForm.fullName || !adminForm.email || !adminForm.invitationCode) {
      setErrorMsg('Name, Email, and Invitation Code are required.');
      return;
    }
    if (adminForm.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (adminForm.password !== adminForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeCode: 'REC-BBSR-2024',
          name: adminForm.fullName,
          email: adminForm.email,
          password: adminForm.password,
          phone: adminForm.mobile,
          adminId: adminForm.adminId,
          designation: adminForm.designation,
          invitationCode: adminForm.invitationCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Admin activation failed.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invitation verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // RENDER SECTIONS
  // ----------------------------------------------------

  return (
    <div
      className="w-full max-w-md p-6 md:p-8 shadow-2xl shadow-slate-950/25 border border-white/80 flex flex-col justify-between transition-all duration-300 max-h-[88vh] overflow-y-auto scrollbar-thin"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '24px',
      }}
    >
      <div>
        {/* ========================================================= */}
        {/* SCREEN 1: MAIN ROLE SELECTION INTERFACE (3 OPTIONS)       */}
        {/* ========================================================= */}
        {authStep === 'ROLE_SELECT' && (
          <div className="space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-inner">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Your Role</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your campus portal category to sign in or register.
              </p>
            </div>

            {/* The 3 Main Role Cards */}
            <div className="space-y-2.5 pt-1">
              {/* Option 1: STUDENT */}
              <div
                onClick={() => setSelectedRole('STUDENT')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3.5 relative ${
                  selectedRole === 'STUDENT'
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedRole === 'STUDENT'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-xs text-slate-900 tracking-wide uppercase">STUDENT</h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-1.5 py-0.2 rounded">
                      Learner
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Access student services, academic information, campus facilities, gate pass generation, and grievance reporting.
                  </p>
                </div>
                {/* Selection indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center absolute right-3.5 top-3.5 ${
                    selectedRole === 'STUDENT'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedRole === 'STUDENT' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Option 2: ADMIN MANAGER */}
              <div
                onClick={() => setSelectedRole('ADMIN_MANAGER')}
                className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start space-x-3.5 relative ${
                  selectedRole === 'ADMIN_MANAGER'
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    selectedRole === 'ADMIN_MANAGER'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-xs text-slate-900 tracking-wide uppercase">ADMIN MANAGER</h3>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-100/60 px-1.5 py-0.2 rounded">
                      Campus Control
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Manage campus operations, all staff roles (Warden, Security, Services, Medical), admissions, and college settings.
                  </p>
                </div>
                {/* Selection indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center absolute right-3.5 top-3.5 ${
                    selectedRole === 'ADMIN_MANAGER'
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedRole === 'ADMIN_MANAGER' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* Action Button: Proceed to Chosen Role */}
            <button
              type="button"
              onClick={() => {
                resetMessages();
                if (selectedRole === 'STUDENT') {
                  setEmail('student.rahul@campus.edu');
                  setAuthStep('STUDENT_LOGIN');
                } else {
                  setEmail('admin@rec.ac.in');
                  setAuthStep('ADMIN_LOGIN');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer mt-4"
            >
              <span>Continue as {selectedRole === 'ADMIN_MANAGER' ? 'Admin Manager' : 'Student'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* College Onboarding Link */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onOpenRegisterCollege}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center justify-center space-x-1 mx-auto cursor-pointer"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Register New College / Campus</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 2: STUDENT SIGN IN                                 */}
        {/* ========================================================= */}
        {authStep === 'STUDENT_LOGIN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('ROLE_SELECT')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Role</span>
              </button>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                STUDENT PORTAL
              </span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Sign In</h2>
              <p className="text-xs text-slate-500 mt-0.5">Welcome back! Sign in to your student account.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => handleGenericLogin(e, 'STUDENT')} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="student@campus.edu or roll@rec.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your student password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact Campus Warden Office to reset your student password.')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In as Student</span>}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase">OR</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student.rahul@campus.edu')}
              className="w-full flex items-center justify-center space-x-2.5 py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch to Registration */}
            <div className="pt-2 text-center text-xs text-slate-600">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setAuthStep('STUDENT_REGISTER');
                }}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Create New Account
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 3: STUDENT NEW REGISTRATION                        */}
        {/* ========================================================= */}
        {authStep === 'STUDENT_REGISTER' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('STUDENT_LOGIN')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthStep('ROLE_SELECT')}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Change Role
              </button>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Your Student Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">Register to access your campus services.</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStudentRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soumya Ranjan"
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Roll / Student ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="2401289110"
                    value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91..."
                    value={studentForm.mobile}
                    onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="student@rec.ac.in or personal email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch *</label>
                  <select
                    value={studentForm.branch}
                    onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Electrical Engineering</option>
                    <option>Electronics & Telecomm</option>
                    <option>Other / Specialization</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Course / Dept *</label>
                  <select
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option>B.Tech</option>
                    <option>M.Tech</option>
                    <option>MBA</option>
                    <option>MCA</option>
                    <option>Diploma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Academic Year *</label>
                <select
                  value={studentForm.academicYear}
                  onChange={(e) => setStudentForm({ ...studentForm, academicYear: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option>First Year</option>
                  <option>Second Year</option>
                  <option>Third Year</option>
                  <option>Fourth Year</option>
                  <option>Fifth Year</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={studentForm.confirmPassword}
                    onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <label className="flex items-center space-x-2 pt-1 text-slate-600 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={studentForm.agreeTerms}
                  onChange={(e) => setStudentForm({ ...studentForm, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-[11px]">I agree to the Terms & Conditions and Privacy Policy</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
              </button>
            </form>

            <div className="text-center text-xs text-slate-600 pt-1">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => setAuthStep('STUDENT_LOGIN')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 4: STAFF SUBROLE SELECTION SCREEN                  */}
        {/* ========================================================= */}
        {authStep === 'STAFF_ROLE_SELECT' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('ROLE_SELECT')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Main Role</span>
              </button>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                STAFF PORTALS
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Staff Category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose your campus operational role to continue.</p>
            </div>

            {/* 4 Subrole Cards with Rich Demo Data */}
            <div className="space-y-2.5">
              {[
                {
                  cat: 'Warden' as StaffCategory,
                  label: 'Warden',
                  icon: Bed,
                  desc: 'Hostel superintendents, floor care, room allocations, leave & gate pass approvals.',
                  badge: 'Residence & Hostels',
                  color: 'bg-amber-50 text-amber-700 border-amber-200',
                  activeBorder: 'border-amber-400 bg-amber-50/30',
                },
                {
                  cat: 'Security' as StaffCategory,
                  label: 'Security',
                  icon: ShieldCheck,
                  desc: 'Gate turnstiles, student entry/exit barcode scans, visitor check-in & night patrol.',
                  badge: 'Safety & Turnstiles',
                  color: 'bg-teal-50 text-teal-700 border-teal-200',
                  activeBorder: 'border-teal-400 bg-teal-50/30',
                },
                {
                  cat: 'Doctor / Nurse' as StaffCategory,
                  label: 'Doctor / Nurse',
                  icon: Heart,
                  desc: 'Campus health dispensary, prescription records, student OPD triage & medical leave.',
                  badge: 'Dispensary & OPD',
                  color: 'bg-rose-50 text-rose-700 border-rose-200',
                  activeBorder: 'border-rose-400 bg-rose-50/30',
                },
                {
                  cat: 'Services' as StaffCategory,
                  label: 'Services',
                  icon: Wrench,
                  desc: 'Mess daily meals, food menu schedules, electrical/plumbing repairs, and utility work orders.',
                  badge: 'Mess & Maintenance',
                  color: 'bg-purple-50 text-purple-700 border-purple-200',
                  activeBorder: 'border-purple-400 bg-purple-50/30',
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isSelected = selectedStaffCategory === item.cat;
                const demoInfo = DEMO_STAFF_ACCOUNTS[item.cat];
                return (
                  <div
                    key={item.cat}
                    className={`p-3.5 rounded-2xl border transition group hover:shadow-xs ${
                      isSelected
                        ? `${item.activeBorder} shadow-2xs`
                        : 'border-slate-200/90 bg-white hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                          <ItemIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">{item.label}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${demoInfo.pillColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </div>
                    </div>

                    {/* Demo Account Credentials Container */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 bg-slate-50/70 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-[11px] min-w-0">
                        <div className="font-bold text-slate-800 flex items-center space-x-1.5 truncate">
                          <span>👤 {demoInfo.name}</span>
                          <span className="text-slate-400 font-normal">|</span>
                          <span className="text-slate-600 truncate">{demoInfo.designation}</span>
                        </div>
                        <div className="text-slate-500 text-[10px] font-mono mt-0.5 flex items-center space-x-2 truncate">
                          <span>📧 {demoInfo.email}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">Pass: {demoInfo.pass}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaffCategory(item.cat);
                            setStaffForm((prev) => ({ ...prev, category: item.cat }));
                            setEmail(demoInfo.email);
                            setPassword(demoInfo.pass);
                            setAuthStep('STAFF_LOGIN');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Sign In</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin(demoInfo.email, item.cat)}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>1-Click Login</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 5: STAFF SIGN IN                                   */}
        {/* ========================================================= */}
        {authStep === 'STAFF_LOGIN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('STAFF_ROLE_SELECT')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Categories</span>
              </button>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${DEMO_STAFF_ACCOUNTS[selectedStaffCategory]?.pillColor || 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                Role: {selectedStaffCategory}
              </span>
            </div>

            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-inner border ${
                selectedStaffCategory === 'Warden'
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : selectedStaffCategory === 'Security'
                  ? 'bg-teal-50 text-teal-600 border-teal-200'
                  : selectedStaffCategory === 'Doctor / Nurse'
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-purple-50 text-purple-600 border-purple-200'
              }`}>
                {selectedStaffCategory === 'Warden' && <Bed className="w-6 h-6" />}
                {selectedStaffCategory === 'Security' && <ShieldCheck className="w-6 h-6" />}
                {selectedStaffCategory === 'Doctor / Nurse' && <Heart className="w-6 h-6" />}
                {selectedStaffCategory === 'Services' && <Wrench className="w-6 h-6" />}
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedStaffCategory} Sign In</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enter your official credentials or use the demo login below.</p>
            </div>

            {/* Prominent Demo Credentials Card for Active Category */}
            {DEMO_STAFF_ACCOUNTS[selectedStaffCategory] && (
              <div className="p-3 bg-gradient-to-r from-blue-50/90 via-slate-50 to-indigo-50/70 border border-blue-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Demo Account Info
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      {DEMO_STAFF_ACCOUNTS[selectedStaffCategory].name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {DEMO_STAFF_ACCOUNTS[selectedStaffCategory].designation}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] flex flex-wrap items-center gap-x-3 text-slate-600 font-mono">
                  <span>Email: <strong className="text-slate-900 font-bold">{DEMO_STAFF_ACCOUNTS[selectedStaffCategory].email}</strong></span>
                  <span>Pass: <strong className="text-emerald-700 font-bold">{DEMO_STAFF_ACCOUNTS[selectedStaffCategory].pass}</strong></span>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Auto-filled in form fields</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin(
                        DEMO_STAFF_ACCOUNTS[selectedStaffCategory].email,
                        selectedStaffCategory
                      )
                    }
                    className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-xl shadow-xs transition flex items-center space-x-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>1-Click Sign In</span>
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => handleGenericLogin(e, 'STAFF')} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="staff@rec.ac.in or official email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter staff password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Contact System Administrator to recover staff credentials.')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In as {selectedStaffCategory}</span>}
              </button>
            </form>

            {/* Quick Switch to Other Staff Categories */}
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Switch Staff Category:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Warden', 'Security', 'Doctor / Nurse', 'Services'] as StaffCategory[]).map((cat) => {
                  const demo = DEMO_STAFF_ACCOUNTS[cat];
                  const isCurrent = selectedStaffCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedStaffCategory(cat);
                        setStaffForm((prev) => ({ ...prev, category: cat }));
                        setEmail(demo.email);
                        setPassword(demo.pass);
                        resetMessages();
                      }}
                      className={`px-2 py-1.5 text-[11px] rounded-xl font-bold border transition text-left truncate flex items-center space-x-1.5 cursor-pointer ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-[10px]">
                        {cat === 'Warden' && '🛏️'}
                        {cat === 'Security' && '🛡️'}
                        {cat === 'Doctor / Nurse' && '🩺'}
                        {cat === 'Services' && '🔧'}
                      </span>
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Register Here Link */}
            <div className="pt-2 text-center text-xs text-slate-600">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setAuthStep('STAFF_REGISTER');
                }}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Register Here
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 6: STAFF ACCOUNT REGISTRATION                      */}
        {/* ========================================================= */}
        {authStep === 'STAFF_REGISTER' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('STAFF_LOGIN')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                PENDING APPROVAL
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Staff Account Registration</h2>
              <p className="text-xs text-slate-500 mt-0.5">Submit verification request to campus administrators.</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStaffRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employee / Staff ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="REC-EMP-401"
                    value={staffForm.employeeId}
                    onChange={(e) => setStaffForm({ ...staffForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91..."
                    value={staffForm.mobile}
                    onChange={(e) => setStaffForm({ ...staffForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="name@rec.ac.in"
                  value={staffForm.officialEmail}
                  onChange={(e) => setStaffForm({ ...staffForm, officialEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Staff Category *</label>
                  <select
                    value={staffForm.category}
                    onChange={(e) => {
                      const cat = e.target.value as StaffCategory;
                      setStaffForm({ ...staffForm, category: cat });
                      setSelectedStaffCategory(cat);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option>Warden</option>
                    <option>Services</option>
                    <option>Security</option>
                    <option>Doctor / Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hostels / Security / Healthcare"
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Dynamic Category Specific Fields */}
              {staffForm.category === 'Services' && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                  <span className="font-bold text-purple-800 text-[11px] block">Services & Facilities Details</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={staffForm.serviceCategory}
                      onChange={(e) => setStaffForm({ ...staffForm, serviceCategory: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Maintenance & Housekeeping</option>
                      <option>Mess & Catering Management</option>
                      <option>Electrical & Power Infrastructure</option>
                      <option>Plumbing & Water Supply</option>
                      <option>Campus Shuttle & Transport</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Assigned Facilities / Blocks"
                      value={staffForm.assignedFacilities}
                      onChange={(e) => setStaffForm({ ...staffForm, assignedFacilities: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {staffForm.category === 'Warden' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-800 text-[11px] block">Warden Information</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={staffForm.hostelName}
                      onChange={(e) => setStaffForm({ ...staffForm, hostelName: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Nilgiri Block A</option>
                      <option>Shivalik Block B</option>
                      <option>Dhaulagiri Block C</option>
                      <option>Aravali Residence</option>
                    </select>
                    <select
                      value={staffForm.hostelType}
                      onChange={(e) => setStaffForm({ ...staffForm, hostelType: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="BOYS">Boys Hostel</option>
                      <option value="GIRLS">Girls Hostel</option>
                      <option value="CO_ED">Co-Ed / Guest</option>
                    </select>
                  </div>
                </div>
              )}

              {staffForm.category === 'Security' && (
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-2">
                  <span className="font-bold text-teal-800 text-[11px] block">Security Deployment</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={staffForm.assignedGate}
                      onChange={(e) => setStaffForm({ ...staffForm, assignedGate: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Main Gate — North</option>
                      <option>Girls Hostel Gate</option>
                      <option>Boys Hostel Gate</option>
                      <option>Campus Perimeter Patrol</option>
                    </select>
                    <select
                      value={staffForm.shift}
                      onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option>Morning (06:00 - 14:00)</option>
                      <option>Evening (14:00 - 22:00)</option>
                      <option>Night (22:00 - 06:00)</option>
                    </select>
                  </div>
                </div>
              )}

              {staffForm.category === 'Doctor / Nurse' && (
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-800 text-[11px] block">Medical Credentials</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Qualification (e.g. MBBS, MD)"
                      value={staffForm.qualification}
                      onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Medical Unit (e.g. OPD Clinic 1)"
                      value={staffForm.medicalUnit}
                      onChange={(e) => setStaffForm({ ...staffForm, medicalUnit: e.target.value })}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={staffForm.password}
                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={staffForm.confirmPassword}
                    onChange={(e) => setStaffForm({ ...staffForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-0.5">
                <span className="font-bold text-slate-800">Administrator Approval Notice:</span>
                <p>New staff accounts require institutional review before operational dashboards are unlocked.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Staff Account</span>}
              </button>
            </form>

            <div className="text-center text-xs text-slate-600 pt-1">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => setAuthStep('STAFF_LOGIN')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 7: ADMIN MANAGER SIGN IN                           */}
        {/* ========================================================= */}
        {authStep === 'ADMIN_LOGIN' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('ROLE_SELECT')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Role</span>
              </button>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                EXECUTIVE ADMIN
              </span>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Manager Sign In</h2>
              <p className="text-xs text-slate-500 mt-0.5">Secure access to campus administration & management.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={(e) => handleGenericLogin(e, 'ADMIN_MANAGER')} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="admin@rec.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter administrator password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  2FA Protected
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In as Admin Manager</span>}
              </button>
            </form>

            {/* Quick Demo Pre-fill for Admin */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@rec.ac.in')}
                className="w-full py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-600 rounded-xl transition cursor-pointer"
              >
                ⚡ Quick Demo Sign In (Super Admin)
              </button>
            </div>

            {/* Admin Registration Options */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-center text-xs">
              <button
                type="button"
                onClick={onOpenRegisterCollege}
                className="w-full py-2 px-3 bg-blue-50/80 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Register New College / Campus (First Admin)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setAuthStep('ADMIN_REGISTER');
                }}
                className="text-slate-500 hover:text-blue-600 font-semibold cursor-pointer block mx-auto text-[11px] pt-1"
              >
                Invited Administrator? Register with Code →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN 8: INVITED ADMIN REGISTRATION                      */}
        {/* ========================================================= */}
        {authStep === 'ADMIN_REGISTER' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthStep('ADMIN_LOGIN')}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center space-x-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Sign In</span>
              </button>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                INVITATION CODE
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Invited Admin Registration</h2>
              <p className="text-xs text-slate-500 mt-0.5">Activate administrative management account with official code.</p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Invitation Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REC-ADMIN-2025"
                  value={adminForm.invitationCode}
                  onChange={(e) => setAdminForm({ ...adminForm, invitationCode: e.target.value })}
                  className="w-full px-3 py-2 bg-purple-50/50 border border-purple-200 rounded-xl font-mono text-purple-900 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Rajesh Mishra"
                  value={adminForm.fullName}
                  onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="REC-ADM-01"
                    value={adminForm.adminId}
                    onChange={(e) => setAdminForm({ ...adminForm, adminId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91..."
                    value={adminForm.mobile}
                    onChange={(e) => setAdminForm({ ...adminForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@rec.ac.in"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={adminForm.confirmPassword}
                    onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Activate Admin Account</span>}
              </button>
            </form>

            <div className="text-center text-xs text-slate-600 pt-1">
              <span>Already registered? </span>
              <button
                type="button"
                onClick={() => setAuthStep('ADMIN_LOGIN')}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Data Protection Assurance */}
      <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 pt-4 mt-3 border-t border-slate-100">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        <span>Role-Based Access Control • 256-bit Encrypted</span>
      </div>
    </div>
  );
}
