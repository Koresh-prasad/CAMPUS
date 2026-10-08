'use client';

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Shield,
  Key,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Mail,
  Phone,
  Building,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Eye,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export type SystemRole = 'ADMIN_MANAGER' | 'WARDEN' | 'SERVICE' | 'SECURITY' | 'MEDICAL';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  role: SystemRole;
  assignedArea: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  permissions: string[];
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-001',
    name: 'Dr. Alok Verma',
    email: 'admin.manager@campus.edu',
    phone: '+91 98765-00101',
    employeeId: 'ADM-2024-01',
    role: 'ADMIN_MANAGER',
    assignedArea: 'Central Administrative Center',
    status: 'ACTIVE',
    lastLogin: '10 mins ago',
    permissions: ['ALL_PERMISSIONS', 'USER_MANAGEMENT', 'CAMPUS_CONFIG', 'EMERGENCY_OVERRIDE']
  },
  {
    id: 'USR-002',
    name: 'Prof. Ramesh Sharma',
    email: 'warden.blocka@campus.edu',
    phone: '+91 98765-00102',
    employeeId: 'WRD-2024-04',
    role: 'WARDEN',
    assignedArea: 'Hostel Block A (Boys)',
    status: 'ACTIVE',
    lastLogin: '25 mins ago',
    permissions: ['HOSTEL_OPS', 'ROOM_ALLOCATION', 'GATE_PASS_APPROVAL', 'STUDENT_MONITOR']
  },
  {
    id: 'USR-003',
    name: 'Dr. Sunita Sen',
    email: 'warden.blockc@campus.edu',
    phone: '+91 98765-00103',
    employeeId: 'WRD-2024-07',
    role: 'WARDEN',
    assignedArea: 'Hostel Block C (Girls)',
    status: 'ACTIVE',
    lastLogin: '1 hour ago',
    permissions: ['HOSTEL_OPS', 'ROOM_ALLOCATION', 'GATE_PASS_APPROVAL', 'STUDENT_MONITOR']
  },
  {
    id: 'USR-004',
    name: 'Rajesh Nayak',
    email: 'service.lead@campus.edu',
    phone: '+91 98765-00104',
    employeeId: 'SRV-2024-11',
    role: 'SERVICE',
    assignedArea: 'Central Workshop & Facilities',
    status: 'ACTIVE',
    lastLogin: '30 mins ago',
    permissions: ['SERVICE_TICKETS', 'MAINTENANCE_SCHEDULE', 'INVENTORY_DISPATCH', 'CLEANING_OPS']
  },
  {
    id: 'USR-005',
    name: 'Inspector Vikram Singh',
    email: 'security.desk@campus.edu',
    phone: '+91 98765-00105',
    employeeId: 'SEC-2024-02',
    role: 'SECURITY',
    assignedArea: 'Main Gate 1 & Turnstiles',
    status: 'ACTIVE',
    lastLogin: 'Just now',
    permissions: ['GATE_VERIFICATION', 'VISITOR_PASS', 'INCIDENT_RESPONSE', 'SOS_MONITOR']
  },
  {
    id: 'USR-006',
    name: 'Dr. Ananya Ray',
    email: 'medical.officer@campus.edu',
    phone: '+91 98765-00106',
    employeeId: 'MED-2024-09',
    role: 'MEDICAL',
    assignedArea: 'Campus Health Center',
    status: 'ACTIVE',
    lastLogin: '2 hours ago',
    permissions: ['MEDICAL_CONSULTS', 'EMERGENCY_AMBULANCE', 'PHARMACY_STOCK', 'HEALTH_RECORDS']
  }
];

export function UserRoleManagementView() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [resetPassUser, setResetPassUser] = useState<UserAccount | null>(null);
  const [viewPermsUser, setViewPermsUser] = useState<UserAccount | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newRole, setNewRole] = useState<SystemRole>('WARDEN');
  const [newArea, setNewArea] = useState('Hostel Block A');
  const [newPassword, setNewPassword] = useState('Campus@2026');

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.assignedArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    let defaultPerms: string[] = [];
    if (newRole === 'ADMIN_MANAGER') {
      defaultPerms = ['ALL_PERMISSIONS', 'USER_MANAGEMENT', 'CAMPUS_CONFIG'];
    } else if (newRole === 'WARDEN') {
      defaultPerms = ['HOSTEL_OPS', 'ROOM_ALLOCATION', 'GATE_PASS_APPROVAL'];
    } else if (newRole === 'SERVICE') {
      defaultPerms = ['SERVICE_TICKETS', 'MAINTENANCE_SCHEDULE', 'INVENTORY_DISPATCH'];
    } else if (newRole === 'SECURITY') {
      defaultPerms = ['GATE_VERIFICATION', 'VISITOR_PASS', 'INCIDENT_RESPONSE'];
    } else if (newRole === 'MEDICAL') {
      defaultPerms = ['MEDICAL_CONSULTS', 'EMERGENCY_AMBULANCE', 'PHARMACY_STOCK'];
    }

    const newUser: UserAccount = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '+91 98765-00000',
      employeeId: newEmpId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      role: newRole,
      assignedArea: newArea,
      status: 'ACTIVE',
      lastLogin: 'Never',
      permissions: defaultPerms
    };

    setUsers([newUser, ...users]);
    setIsAddUserOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewEmpId('');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...u, status: newStatus };
      })
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetSuccess(true);
    setTimeout(() => {
      setIsResetSuccess(false);
      setResetPassUser(null);
    }, 2000);
  };

  const getRoleBadge = (role: SystemRole) => {
    switch (role) {
      case 'ADMIN_MANAGER':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'WARDEN':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'SERVICE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'SECURITY':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDICAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-900 border border-slate-700/60 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Central Access Governance</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">User Roles & Permissions</h2>
          <p className="text-slate-400 text-sm mt-1">
            Role-based access control for Admin Managers, Wardens, Service staff, Security officers, and Medical teams.
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Staff User</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <p className="text-slate-400 text-[11px] font-medium">Total Staff</p>
          <p className="text-xl font-black text-white mt-0.5">{users.length}</p>
          <span className="text-[10px] text-slate-500">Active accounts</span>
        </div>
        <div className="bg-slate-900 border border-blue-500/20 p-3.5 rounded-xl">
          <p className="text-blue-400 text-[11px] font-medium">Admin Managers</p>
          <p className="text-xl font-black text-blue-400 mt-0.5">
            {users.filter((u) => u.role === 'ADMIN_MANAGER').length}
          </p>
          <span className="text-[10px] text-slate-500">Root control</span>
        </div>
        <div className="bg-slate-900 border border-indigo-500/20 p-3.5 rounded-xl">
          <p className="text-indigo-400 text-[11px] font-medium">Hostel Wardens</p>
          <p className="text-xl font-black text-indigo-400 mt-0.5">
            {users.filter((u) => u.role === 'WARDEN').length}
          </p>
          <span className="text-[10px] text-slate-500">Blocks & leaves</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/20 p-3.5 rounded-xl">
          <p className="text-amber-400 text-[11px] font-medium">Service & Facility</p>
          <p className="text-xl font-black text-amber-400 mt-0.5">
            {users.filter((u) => u.role === 'SERVICE').length}
          </p>
          <span className="text-[10px] text-slate-500">Repairs & stock</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/20 p-3.5 rounded-xl col-span-2 md:col-span-1">
          <p className="text-emerald-400 text-[11px] font-medium">Security & Medical</p>
          <p className="text-xl font-black text-emerald-400 mt-0.5">
            {users.filter((u) => u.role === 'SECURITY' || u.role === 'MEDICAL').length}
          </p>
          <span className="text-[10px] text-slate-500">Gates & clinic</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Roles' },
            { id: 'ADMIN_MANAGER', label: 'Admin Managers' },
            { id: 'WARDEN', label: 'Wardens' },
            { id: 'SERVICE', label: 'Service/Maint' },
            { id: 'SECURITY', label: 'Security' },
            { id: 'MEDICAL', label: 'Medical' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, ID, email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role & Assigned Area</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                const isActive = user.status === 'ACTIVE';

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-slate-400 text-[11px] flex items-center space-x-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{user.email}</span>
                          <span className="text-slate-600">•</span>
                          <span>{user.phone}</span>
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                        <p className="text-slate-400 text-[11px] flex items-center space-x-1">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[180px]">{user.assignedArea}</span>
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">{user.employeeId}</td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{user.lastLogin}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewPermsUser(user)}
                          title="View Permissions"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setResetPassUser(user)}
                          title="Reset Password"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg transition"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          title={isActive ? 'Deactivate User' : 'Activate User'}
                          className={`p-1.5 rounded-lg transition ${
                            isActive
                              ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'
                              : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400'
                          }`}
                        >
                          {isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Provision New Staff Account</h3>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Preeti Panda"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@campus.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765-00000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as SystemRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ADMIN_MANAGER">Admin Manager</option>
                    <option value="WARDEN">Hostel Warden</option>
                    <option value="SERVICE">Service / Maintenance</option>
                    <option value="SECURITY">Security Guard / Officer</option>
                    <option value="MEDICAL">Medical Officer / Staff</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="e.g. WRD-2026-10"
                    value={newEmpId}
                    onChange={(e) => setNewEmpId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assigned Hostel / Location</label>
                <input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="e.g. Hostel Block B, Main Gate, Health Center"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Create & Grant Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Reset Staff Password</h3>
            </div>

            <p className="text-xs text-slate-300">
              Generate a temporary password and send login credentials to{' '}
              <strong className="text-white">{resetPassUser.email}</strong>.
            </p>

            {isResetSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Temporary password sent via SMS & Email!</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">Temporary Password:</p>
                  <p className="font-mono font-bold text-amber-400 text-sm">Pass@Campus2026!</p>
                  <p className="text-[10px] text-slate-500">User will be prompted to change on next login.</p>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetPassUser(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/30"
                  >
                    Confirm Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Permissions Drawer */}
      {viewPermsUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Active Permissions Matrix</h3>
              <button
                onClick={() => setViewPermsUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p className="font-bold text-white text-sm">{viewPermsUser.name}</p>
                <p className="text-slate-400">
                  Role: <span className="text-blue-400 font-bold">{viewPermsUser.role}</span> • {viewPermsUser.assignedArea}
                </p>
              </div>

              <div>
                <p className="font-semibold text-slate-300 mb-2">Granted RBAC Capabilities:</p>
                <div className="space-y-1.5">
                  {viewPermsUser.permissions.map((perm, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-emerald-400 font-mono text-[11px]"
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewPermsUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
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
