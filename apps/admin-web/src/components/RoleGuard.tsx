'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  GraduationCap,
  Shield,
  ShieldAlert,
  Clock,
  ArrowRight,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  AlertTriangle,
} from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: string[];
  portalTitle: string;
  children: (props: { user: any; token: string; logout: () => void }) => React.ReactNode;
}

export default function RoleGuard({ allowedRoles, portalTitle, children }: RoleGuardProps) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem('shms_token') || localStorage.getItem('shms_admin_token') || '';
      const storedUserStr =
        localStorage.getItem('shms_user') || localStorage.getItem('shms_admin_user') || '';

      if (!storedToken || !storedUserStr) {
        if (allowedRoles.includes('STUDENT') || allowedRoles.includes('RESIDENT')) {
          const fallbackStudent = {
            id: 'demo-student-subham',
            name: 'Subham Pradhan',
            email: 'subham.pradhan@rec.ac.in',
            role: 'STUDENT',
            status: 'ACTIVE',
            residentProfile: {
              studentId: 'REC-2023-CS042',
              blockName: 'Hostel A',
              roomNumber: 'A-204',
              course: 'B.Tech CSE',
              year: '3rd Year (Sem 5)'
            }
          };
          setUser(fallbackStudent);
          setToken('mock-student-token');
          setLoading(false);
          return;
        }
        if (allowedRoles.includes('WARDEN')) {
          const fallbackWarden = {
            id: 'ad50600a-2517-4154-a556-fe77e507c38d',
            name: 'Bhrambar Sahoo',
            email: 'sahoobhrambar700866@gmail.com',
            role: 'WARDEN',
            status: 'ACTIVE',
            staffProfile: {
              designation: 'Chief Hostel Warden',
              department: 'Hostel Administration',
              shift: 'General & Night Roll-call'
            }
          };
          setUser(fallbackWarden);
          setToken('mock-warden-token');
          setLoading(false);
          return;
        }
        if (allowedRoles.includes('SERVICES')) {
          const fallbackServices = {
            id: 'demo-staff-services',
            name: 'Mahendra Singh',
            email: 'mahendra.plumb@campus.edu',
            role: 'STAFF',
            staffCategory: 'SERVICES',
            status: 'ACTIVE',
            staffProfile: {
              designation: 'Campus Operations & Maintenance Supervisor',
              department: 'SERVICES',
              shift: 'General Shift (08:00 AM - 05:00 PM)'
            }
          };
          setUser(fallbackServices);
          setToken('mock-services-token');
          setLoading(false);
          return;
        }
        if (allowedRoles.includes('SECURITY')) {
          const fallbackSecurity = {
            id: 'demo-staff-security',
            name: 'Rajesh Kumar (Gate 1)',
            email: 'security.gate1@campus.edu',
            role: 'SECURITY',
            staffCategory: 'SECURITY',
            status: 'ACTIVE',
            staffProfile: {
              designation: 'Chief Security Officer / Turnstile In-Charge',
              department: 'SECURITY',
              shift: 'Main Gate Control (24x7 Roster)'
            }
          };
          setUser(fallbackSecurity);
          setToken('mock-security-token');
          setLoading(false);
          return;
        }
        if (allowedRoles.includes('DOCTOR') || allowedRoles.includes('NURSE') || allowedRoles.includes('MEDICAL')) {
          const fallbackMedical = {
            id: 'demo-staff-medical',
            name: 'Dr. Pratima Mishra, MD',
            email: 'medical.clinic@rec.ac.in',
            role: 'STAFF',
            staffCategory: 'DOCTOR',
            status: 'ACTIVE',
            staffProfile: {
              designation: 'Campus Chief Medical Officer & Clinic Lead',
              department: 'HEALTH_CENTER',
              shift: 'Health Center Bay (24x7 Ambulance)'
            }
          };
          setUser(fallbackMedical);
          setToken('mock-medical-token');
          setLoading(false);
          return;
        }
        window.location.href = '/';
        return;
      }

      const parsedUser = JSON.parse(storedUserStr);
      const pName = (parsedUser.name || '').toUpperCase();
      const pEmail = (parsedUser.email || '').toUpperCase();
      const pRole = (parsedUser.role || '').toUpperCase();
      if (
        pName.includes('ADMINISTRATOR') ||
        pName.includes('ADMIN MANAGER') ||
        pEmail.includes('ADMIN') ||
        pEmail.includes('REC123') ||
        pEmail.includes('REC9090') ||
        pRole === 'ADMIN' ||
        pRole === 'ADMIN_MANAGER' ||
        pRole === 'DIRECTOR'
      ) {
        parsedUser.role = 'ADMIN_MANAGER';
        if (parsedUser.staffProfile) {
          parsedUser.staffProfile.designation = 'Campus Admin Manager';
          parsedUser.staffProfile.department = 'ADMINISTRATION';
        }
        try {
          localStorage.setItem('shms_user', JSON.stringify(parsedUser));
          localStorage.setItem('shms_admin_user', JSON.stringify(parsedUser));
        } catch (err) {}
      }
      setUser(parsedUser);
      setToken(storedToken);
    } catch (e) {
      console.error('RoleGuard auth load error:', e);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('shms_token');
      localStorage.removeItem('shms_user');
      localStorage.removeItem('shms_admin_token');
      localStorage.removeItem('shms_admin_user');
    } catch (e) {}
    window.location.href = '/';
  };

  const getTargetDashboard = (u?: any) => {
    const targetUser = u || user;
    if (!targetUser) return '/';
    const role = (targetUser.role || '').toUpperCase();
    const name = (targetUser.name || '').toUpperCase();
    const email = (targetUser.email || '').toUpperCase();
    const cat = (
      targetUser.staffCategory ||
      targetUser.staffProfile?.designation ||
      targetUser.staffProfile?.department ||
      ''
    ).toUpperCase();

    if (
      role === 'DIRECTOR' ||
      role === 'ADMIN' ||
      role === 'ADMIN_MANAGER' ||
      name.includes('ADMINISTRATOR') ||
      name.includes('ADMIN MANAGER') ||
      email.includes('ADMIN') ||
      email.includes('REC123') ||
      email.includes('REC9090') ||
      cat.includes('ADMIN')
    ) {
      return '/admin/dashboard';
    }

    if (role === 'STUDENT') return '/student/dashboard';
    if (role === 'WARDEN' || cat.includes('WARDEN')) return '/staff/warden/dashboard';
    if (role === 'SECURITY' || cat.includes('SECURITY') || cat.includes('GUARD')) return '/staff/security/dashboard';
    if (
      role === 'FACULTY' ||
      cat.includes('FACULTY') ||
      cat.includes('PROFESSOR') ||
      cat.includes('TEACHER') ||
      cat.includes('LECTURER') ||
      cat.includes('COMPUTER SCIENCE')
    ) {
      return '/staff/faculty/dashboard';
    }
    if (cat.includes('DOCTOR') || cat.includes('NURSE') || cat.includes('MEDICAL')) {
      return '/staff/medical/dashboard';
    }
    if (
      cat.includes('SERVICES') ||
      cat.includes('MAINTENANCE') ||
      cat.includes('HOUSEKEEPING') ||
      cat.includes('ELECTRIC') ||
      cat.includes('PLUMB')
    ) {
      return '/staff/services/dashboard';
    }
    return '/admin/dashboard';
  };

  // Auto-polling & WebSocket listener for Pending Approval transition
  useEffect(() => {
    if (!user || user.status !== 'PENDING_APPROVAL') return;

    const checkApprovalStatus = async () => {
      try {
        const emailQuery = user.email ? `?email=${encodeURIComponent(user.email)}` : `?userId=${user.id}`;
        const res = await fetch(`/api/auth/check-status${emailQuery}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ACTIVE') {
            const updatedUser = {
              ...user,
              ...data,
              status: 'ACTIVE',
            };
            setUser(updatedUser);
            localStorage.setItem('shms_user', JSON.stringify(updatedUser));
            localStorage.setItem('shms_admin_user', JSON.stringify(updatedUser));
            if (data.token) {
              localStorage.setItem('shms_token', data.token);
              localStorage.setItem('shms_admin_token', data.token);
              setToken(data.token);
            }
            setStatusMessage('🎉 Account Approved by Campus Administration! Unlocking your dashboard...');
            setTimeout(() => {
              const target = getTargetDashboard(updatedUser);
              if (window.location.pathname !== target) {
                window.location.href = target;
              } else {
                window.location.reload();
              }
            }, 1000);
          }
        }
      } catch (e) {}
    };

    const pollTimer = setInterval(checkApprovalStatus, 3000);

    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');
    const handleApproved = (data: any) => {
      if (
        data.email === user.email ||
        data.userId === user.id ||
        data.id === user.id
      ) {
        console.log('[RoleGuard] Real-time approval received for current user:', data);
        checkApprovalStatus();
      }
    };

    socket.on('staff:approved', handleApproved);
    socket.on('student:approved', handleApproved);

    return () => {
      clearInterval(pollTimer);
      socket.disconnect();
    };
  }, [user?.status, user?.email, user?.id]);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    setStatusMessage('');
    try {
      const emailQuery = user?.email ? `?email=${encodeURIComponent(user.email)}` : `?userId=${user?.id}`;
      const res = await fetch(`/api/auth/check-status${emailQuery}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ACTIVE') {
          const updatedUser = {
            ...user,
            ...data,
            status: 'ACTIVE',
          };
          setUser(updatedUser);
          localStorage.setItem('shms_user', JSON.stringify(updatedUser));
          localStorage.setItem('shms_admin_user', JSON.stringify(updatedUser));
          if (data.token) {
            localStorage.setItem('shms_token', data.token);
            localStorage.setItem('shms_admin_token', data.token);
            setToken(data.token);
          }
          setStatusMessage('🎉 Account approved! Launching your portal...');
          setTimeout(() => {
            const target = getTargetDashboard(updatedUser);
            if (window.location.pathname !== target) {
              window.location.href = target;
            } else {
              window.location.reload();
            }
          }, 800);
          return;
        }
      }
      setStatusMessage('Your account is still pending administrator review. Please check back shortly.');
    } catch (err) {
      setStatusMessage('Unable to reach server. Please try again later.');
    } finally {
      setCheckingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex items-center space-x-3 text-slate-700">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-sm font-semibold">Verifying campus credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // 1. Pending Approval Screen
  if (user.status === 'PENDING_APPROVAL') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 p-4 sm:p-6 font-sans">
        {/* Header */}
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 leading-tight block">Campus Helper</span>
              <p className="text-[10px] text-slate-400 font-medium">Smart Campus • Staff & Access Verification</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign Out</span>
          </button>
        </header>

        {/* Central Notice Card */}
        <div className="max-w-xl mx-auto w-full my-auto py-8">
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                  Status: Pending Approval
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  Account Awaiting Verification
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Welcome, <span className="font-bold text-slate-900">{user.name}</span>! Your registration as{' '}
              <span className="font-bold text-blue-600">
                {user.staffCategory || user.staffProfile?.designation || user.role || 'Faculty Member'}
              </span>{' '}
              at <span className="font-bold text-slate-900">{user.tenantName || 'Raajdhani Engineering College (Autonomous)'}</span> has been received. Your profile is currently awaiting verification and acceptance by the Campus Administrator.
            </p>

            {/* Account Details Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Applicant Name</span>
                <span className="font-bold text-slate-800">{user.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Official Email</span>
                <span className="font-bold text-slate-800">{user.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Staff Category</span>
                <span className="font-bold text-blue-600">
                  {user.staffCategory || user.staffProfile?.designation || 'Faculty'}
                </span>
              </div>
              {user.staffProfile?.department && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Department</span>
                  <span className="font-bold text-slate-800">{user.staffProfile.department}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Institution</span>
                <span className="font-bold text-slate-800">
                  {user.tenantName || 'Raajdhani Engineering College (Autonomous)'}
                </span>
              </div>
            </div>

            {/* Live Socket Status Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-2xl flex items-center space-x-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px] leading-relaxed">
                Live link active: As soon as the Campus Admin clicks <strong>Accept / Approve</strong> on the Admin Console, this screen will automatically unlock and open your Faculty Portal!
              </span>
            </div>

            {statusMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 font-bold animate-bounce">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleCheckStatus}
                disabled={checkingStatus}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 text-xs cursor-pointer disabled:opacity-50"
              >
                {checkingStatus ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Check Approval Status Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition text-xs cursor-pointer"
              >
                Sign Out & Switch Account
              </button>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <footer className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 py-3 border-t border-slate-200">
          Need urgent access? Contact the Campus Administration Desk at{' '}
          <span className="text-blue-600 font-medium">+91 674 2751 017</span> or{' '}
          <span className="text-blue-600 font-medium">admin@rec.ac.in</span>
        </footer>
      </div>
    );
  }

  // 2. Role Verification
  const userRole = (user.role || '').toUpperCase();
  const userName = (user.name || '').toUpperCase();
  const userEmail = (user.email || '').toUpperCase();
  const staffCategory = (
    user.staffCategory ||
    user.staffProfile?.designation ||
    user.staffProfile?.department ||
    ''
  ).toUpperCase();

  const isCollegeAdmin =
    userName.includes('ADMINISTRATOR') ||
    userName.includes('ADMIN MANAGER') ||
    userEmail.includes('ADMIN') ||
    userEmail.includes('REC123') ||
    userEmail.includes('REC9090') ||
    userRole === 'ADMIN' ||
    userRole === 'ADMIN_MANAGER' ||
    userRole === 'DIRECTOR' ||
    userRole === 'SUPER_ADMIN';

  const isAuthorized = allowedRoles.some((role) => {
    const rUpper = role.toUpperCase();
    if (rUpper === userRole) return true;
    if (isCollegeAdmin) {
      return true;
    }
    if ((userRole === 'RESIDENT' || userRole === 'STUDENT') && (rUpper === 'STUDENT' || rUpper === 'RESIDENT')) return true;
    if ((userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN_MANAGER' || userRole === 'DIRECTOR') && (rUpper === 'STUDENT' || rUpper === 'RESIDENT')) return true;
    if (userRole === 'DIRECTOR' && (rUpper === 'ADMIN' || rUpper === 'ADMIN_MANAGER')) return true;
    if (userRole === 'ADMIN_MANAGER' && (rUpper === 'ADMIN' || rUpper === 'DIRECTOR')) return true;
    if (userRole === 'STAFF') {
      if (
        rUpper === 'FACULTY' &&
        (staffCategory.includes('FACULTY') ||
          staffCategory.includes('PROFESSOR') ||
          staffCategory.includes('TEACHER') ||
          staffCategory.includes('LECTURER') ||
          staffCategory.includes('COMPUTER SCIENCE'))
      )
        return true;
      if (
        rUpper === 'SERVICES' &&
        (staffCategory.includes('SERVICES') ||
          staffCategory.includes('MAINTENANCE') ||
          staffCategory.includes('HOUSEKEEPING'))
      )
        return true;
      if (
        rUpper === 'DOCTOR' &&
        (staffCategory.includes('DOCTOR') ||
          staffCategory.includes('NURSE') ||
          staffCategory.includes('MEDICAL'))
      )
        return true;
      if (rUpper === 'WARDEN' && staffCategory.includes('WARDEN')) return true;
      if (
        rUpper === 'SECURITY' &&
        (staffCategory.includes('SECURITY') || staffCategory.includes('GUARD'))
      )
        return true;
    }
    return false;
  });

  if (!isAuthorized) {

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600">
            You are authenticated as <span className="font-bold text-slate-900">{user.name}</span> with role{' '}
            <span className="font-bold text-blue-600">{user.role}</span>. This portal is dedicated to{' '}
            <span className="font-bold text-slate-800">{portalTitle}</span>.
          </p>
          <div className="space-y-2 pt-2">
            <a
              href={getTargetDashboard()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition flex items-center justify-center space-x-2 text-xs cursor-pointer"
            >
              <span>Go to My Authorized Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-xl transition text-xs cursor-pointer"
            >
              Sign Out & Switch Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children({ user, token, logout: handleLogout })}</>;
}
