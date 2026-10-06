'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Key,
  Clock,
  Plus,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  MoreVertical,
  Activity,
} from 'lucide-react';

interface AdminOperatorProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  currentUser?: any;
}

export default function AdminOperatorManagementView({
  activeSubTab,
  setActiveSubTab,
  currentUser,
}: AdminOperatorProps) {
  const subTabs = [
    'Admin Profile',
    'Admin Operators',
    'Managers',
    'Add Operator',
    'Assign Role',
    'Permissions',
    'Activity Log',
    'Account Status',
    'Last Login',
  ];

  const currentTab = activeSubTab || 'Admin Profile';

  const [operators, setOperators] = useState([
    {
      id: 'op-1',
      name: currentUser?.name || 'Super Admin',
      email: currentUser?.email || 'admin@rec.ac.in',
      role: 'SUPER_ADMIN',
      status: 'Active',
      lastLogin: 'Just now (10:24 AM)',
      ip: '192.168.1.100',
    },
    {
      id: 'op-2',
      name: 'Prof. Ramesh Chandra Dash',
      email: 'rcdash@rec.ac.in',
      role: 'CHIEF_WARDEN',
      status: 'Active',
      lastLogin: 'Today, 08:30 AM',
      ip: '192.168.1.104',
    },
    {
      id: 'op-3',
      name: 'Dr. Smita Pattnaik',
      email: 'spattnaik@rec.ac.in',
      role: 'CHIEF_WARDEN',
      status: 'Active',
      lastLogin: 'Today, 09:15 AM',
      ip: '192.168.1.108',
    },
    {
      id: 'op-4',
      name: 'Capt. M. R. Mohanty',
      email: 'security@rec.ac.in',
      role: 'SECURITY_OFFICER',
      status: 'Active',
      lastLogin: 'Yesterday, 22:00 PM',
      ip: '192.168.1.112',
    },
    {
      id: 'op-5',
      name: 'Dr. S. K. Mohapatra',
      email: 'medical@rec.ac.in',
      role: 'MEDICAL_OFFICER',
      status: 'Active',
      lastLogin: 'Yesterday, 14:20 PM',
      ip: '192.168.1.115',
    },
  ]);

  const [newOp, setNewOp] = useState({
    name: '',
    email: '',
    role: 'WARDEN',
    password: '',
  });

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-3 bg-white p-3 rounded-2xl shadow-2xs">
        {subTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === tab
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-slate-200/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. ADMIN PROFILE */}
      {currentTab === 'Admin Profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Current Administrator Profile</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center">
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="text-xs space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">{currentUser?.name || 'Campus Administrator'}</h4>
              <p className="text-blue-600 font-bold">{currentUser?.role || 'Super Admin (All Privileges)'}</p>
              <p className="text-slate-500">{currentUser?.email || 'admin@rec.ac.in'}</p>
              <p className="text-slate-400 text-[11px]">Two-Factor Authentication: <strong className="text-emerald-600">Enabled</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN OPERATORS */}
      {currentTab === 'Admin Operators' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Campus Helper Operators & Staff</h3>
              <p className="text-xs text-slate-500">{operators.length} authorized operator accounts.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('Add Operator')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm"
            >
              + Invite Operator
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Operator Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {operators.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-slate-800">{op.name}</td>
                    <td className="p-3 text-slate-500">{op.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {op.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {op.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{op.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MANAGERS */}
      {currentTab === 'Managers' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Operational Branch Managers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Hostel Branch Manager</strong>
              <p className="text-slate-500 mt-1">Prof. R. C. Dash</p>
              <p className="text-blue-600 font-bold mt-1">Full Hostel & Gate Pass Powers</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Security Head Manager</strong>
              <p className="text-slate-500 mt-1">Capt. M. R. Mohanty</p>
              <p className="text-blue-600 font-bold mt-1">Gate Turnstiles & CCTV Roster</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Mess Operations Manager</strong>
              <p className="text-slate-500 mt-1">Mr. B. K. Sahoo</p>
              <p className="text-blue-600 font-bold mt-1">Daily Menu & Dining Hygiene</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD OPERATOR */}
      {currentTab === 'Add Operator' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Add / Invite New Campus Operator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Kumar"
                value={newOp.name}
                onChange={(e) => setNewOp({ ...newOp, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official College Email</label>
              <input
                type="email"
                placeholder="rajesh@rec.ac.in"
                value={newOp.email}
                onChange={(e) => setNewOp({ ...newOp, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Assign Role</label>
              <select
                value={newOp.role}
                onChange={(e) => setNewOp({ ...newOp, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="WARDEN">Hostel Warden</option>
                <option value="SECURITY">Security Officer</option>
                <option value="MEDICAL">Medical Officer</option>
                <option value="ACCOUNTS">Accounts / Finance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Temporary Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newOp.password}
                onChange={(e) => setNewOp({ ...newOp, password: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              alert(`Operator ${newOp.name || 'New User'} invited successfully!`);
              setActiveSubTab('Admin Operators');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
          >
            Send Activation Invitation
          </button>
        </div>
      )}

      {/* 5. ASSIGN ROLE */}
      {currentTab === 'Assign Role' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Role-Based Access Control (RBAC)</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">SUPER_ADMIN</strong>
                <p className="text-slate-500 text-[11px]">Full access to system configurations, operators, and college profiles.</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">All Permissions</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">CHIEF_WARDEN</strong>
                <p className="text-slate-500 text-[11px]">Student admissions, hostel allocations, leave approvals, and curfew management.</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Hostel & Leave</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">SECURITY_OFFICER</strong>
                <p className="text-slate-500 text-[11px]">Gate turnstile scanner, vehicle verification, and emergency alarms.</p>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Gate & Security</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. PERMISSIONS */}
      {currentTab === 'Permissions' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Granular Permission Matrix</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              'Approve Student Overnight Leave',
              'Override Gate Turnstile Lockout',
              'Publish Campus-Wide Official Notices',
              'Update Weekly Mess Menu',
              'Trigger Emergency Broadcast Siren',
              'Export NAAC Compliance Dossiers',
            ].map((perm, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{perm}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. ACTIVITY LOG */}
      {currentTab === 'Activity Log' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Admin & Operator Audit Trail</h3>
          <div className="space-y-2 text-xs">
            {[
              { text: 'Prof. R. C. Dash approved Gate Pass #GP-84920 (Rahul Kumar)', time: '20 mins ago' },
              { text: 'Super Admin updated College Profile contact numbers', time: '1 hour ago' },
              { text: 'Capt. M. R. Mohanty registered new security guard (B. K. Nayak)', time: '3 hours ago' },
              { text: 'Dr. Smita Pattnaik assigned Room B-201 to Sneha Mohanty', time: '5 hours ago' },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <span className="text-slate-800 font-medium">{log.text}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ACCOUNT STATUS */}
      {currentTab === 'Account Status' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Operator Account Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
              <strong className="block text-sm">Active Staff</strong>
              <p className="text-2xl font-black mt-1">5</p>
              <p className="text-[10px] text-emerald-600">All accounts healthy</p>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
              <strong className="block text-sm">Pending Invitations</strong>
              <p className="text-2xl font-black mt-1">0</p>
            </div>
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
              <strong className="block text-sm">Locked / Disabled</strong>
              <p className="text-2xl font-black mt-1">0</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. LAST LOGIN */}
      {currentTab === 'Last Login' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Recent Login Sessions & IP Tracking</h3>
          <div className="space-y-2 text-xs font-mono">
            {operators.map((op) => (
              <div key={op.id} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 font-sans">{op.name}</strong>
                  <span className="text-slate-400 ml-2">({op.email})</span>
                </div>
                <div className="text-right">
                  <span className="text-blue-600 font-bold">{op.ip}</span>
                  <span className="text-slate-400 ml-3">{op.lastLogin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
