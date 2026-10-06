'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Phone,
  Clock,
  AlertTriangle,
  Building,
  UserPlus,
  Shield,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface WardenSecurityProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export default function WardenSecurityView({
  activeSubTab,
  setActiveSubTab,
}: WardenSecurityProps) {
  const subTabs = [
    'Warden Management',
    'Hostel-wise Warden',
    'Security Guard Management',
    'Hostel-wise Security',
    'Phone Numbers',
    'Duty / Shift',
    'Emergency Contact',
  ];

  const currentTab = activeSubTab || 'Warden Management';

  const wardens = [
    {
      id: 'w-1',
      name: 'Prof. Ramesh Chandra Dash',
      role: 'Chief Warden (Boys Hostels)',
      hostel: 'Nilgiri Block A',
      phone: '+91 94370 12001',
      email: 'rcdash@rec.ac.in',
      dutyRoom: 'A-001',
      shift: '08:00 AM - 08:00 PM',
      status: 'On Duty',
    },
    {
      id: 'w-2',
      name: 'Dr. Smita Pattnaik',
      role: 'Chief Warden (Girls Hostels)',
      hostel: 'Shivalik Block B',
      phone: '+91 94370 12002',
      email: 'spattnaik@rec.ac.in',
      dutyRoom: 'B-001',
      shift: '08:00 AM - 08:00 PM',
      status: 'On Duty',
    },
    {
      id: 'w-3',
      name: 'Prof. Manoj Tripathy',
      role: 'Assistant Warden',
      hostel: 'Dhaulagiri Block C',
      phone: '+91 94370 12003',
      email: 'mtripathy@rec.ac.in',
      dutyRoom: 'C-001',
      shift: '02:00 PM - 10:00 PM',
      status: 'On Duty',
    },
    {
      id: 'w-4',
      name: 'Mr. Sunil Pradhan',
      role: 'Hostel Caretaker Supervisor',
      hostel: 'Aravali Residence',
      phone: '+91 94370 12004',
      email: 'spradhan@rec.ac.in',
      dutyRoom: 'AR-01',
      shift: '24 Hours Standby',
      status: 'Available',
    },
  ];

  const securityGuards = [
    { id: 'g-1', name: 'B. K. Nayak', badge: 'SEC-101', post: 'Main Gate — North', shift: 'Morning (06:00 - 14:00)', agency: 'Eagle Security Force', status: 'Active' },
    { id: 'g-2', name: 'Manju Moharana', badge: 'SEC-102', post: 'Girls Hostel Gate', shift: 'Morning (06:00 - 14:00)', agency: 'Eagle Security Force', status: 'Active' },
    { id: 'g-3', name: 'Trilochan Sahu', badge: 'SEC-103', post: 'Boys Hostel Gate', shift: 'Evening (14:00 - 22:00)', agency: 'Eagle Security Force', status: 'Active' },
    { id: 'g-4', name: 'K. C. Mohapatra', badge: 'SEC-104', post: 'Campus Night Patrol', shift: 'Night (22:00 - 06:00)', agency: 'Eagle Security Force', status: 'Scheduled' },
  ];

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

      {/* 1. WARDEN MANAGEMENT */}
      {currentTab === 'Warden Management' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Campus Residence Wardens</h3>
              <p className="text-xs text-slate-500">Official wardens managing residence blocks and safety protocols.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Add New Warden Modal')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
            >
              + Appoint Warden
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wardens.map((w) => (
              <div key={w.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{w.name}</h4>
                      <p className="text-xs text-blue-600 font-bold">{w.role}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {w.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <p><strong>Assigned Block:</strong> {w.hostel}</p>
                  <p><strong>Phone:</strong> {w.phone}</p>
                  <p><strong>Email:</strong> {w.email}</p>
                  <p><strong>Office:</strong> {w.dutyRoom} • <strong>Hours:</strong> {w.shift}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HOSTEL-WISE WARDEN */}
      {currentTab === 'Hostel-wise Warden' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Hostel Building Warden Roster</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {wardens.map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800 text-sm">{w.hostel}</strong>
                  <p className="text-slate-500 mt-0.5">{w.name} ({w.role})</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">{w.phone}</span>
                  <p className="text-[10px] text-slate-400">Office Room: {w.dutyRoom}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SECURITY GUARD MANAGEMENT */}
      {currentTab === 'Security Guard Management' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Campus Security Force Roster</h3>
              <p className="text-xs text-slate-500">18 uniformed security personnel deployed across campus gates.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('New Guard Registration')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
            >
              + Add Security Guard
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {securityGuards.map((g) => (
              <div key={g.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{g.name}</h4>
                    <span className="font-mono text-[10px] text-slate-400">{g.badge} • {g.agency}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {g.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600"><strong>Post:</strong> {g.post}</p>
                <p className="text-[11px] text-slate-400"><strong>Shift:</strong> {g.shift}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HOSTEL-WISE SECURITY */}
      {currentTab === 'Hostel-wise Security' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Security Posts at Hostels</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Nilgiri Boys Gate</strong>
              <p className="text-slate-500 text-[11px] mt-1">2 Guards on duty (Turnstile 1 & 2)</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Shivalik Girls Gate</strong>
              <p className="text-slate-500 text-[11px] mt-1">2 Female guards on duty (Biometric Scanner)</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Campus Boundary Patrol</strong>
              <p className="text-slate-500 text-[11px] mt-1">4 Guards patrolling perimeter</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PHONE NUMBERS */}
      {currentTab === 'Phone Numbers' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Direct Warden & Security Phone Directory</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Campus Security Control Room</strong>
                <p className="text-[10px] text-slate-400">Main Control Desk</p>
              </div>
              <span className="font-bold text-blue-600">+91 674 2751020</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Chief Warden Helpline</strong>
                <p className="text-[10px] text-slate-400">Boys & Girls Residence</p>
              </div>
              <span className="font-bold text-blue-600">+91 94370 12001</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Main Gate Intercom</strong>
                <p className="text-[10px] text-slate-400">Extension 101</p>
              </div>
              <span className="font-bold text-slate-700">Ext: 101</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. DUTY / SHIFT */}
      {currentTab === 'Duty / Shift' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Guard Shift Schedule (24-Hour Coverage)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900">
              <strong className="block text-sm">Morning Shift</strong>
              <p className="text-xs text-blue-700 mt-1">06:00 AM — 02:00 PM</p>
              <p className="text-[10px] text-slate-500 mt-2">6 Guards Deployed</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
              <strong className="block text-sm">Evening Shift</strong>
              <p className="text-xs text-amber-700 mt-1">02:00 PM — 10:00 PM</p>
              <p className="text-[10px] text-slate-500 mt-2">6 Guards Deployed</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900">
              <strong className="block text-sm">Night Shift</strong>
              <p className="text-xs text-purple-700 mt-1">10:00 PM — 06:00 AM</p>
              <p className="text-[10px] text-slate-500 mt-2">6 Guards + K9 Patrol</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. EMERGENCY CONTACT */}
      {currentTab === 'Emergency Contact' && (
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h3>Security Rapid Action Emergency Hotline</h3>
          </div>
          <p className="text-xs text-slate-600">
            For critical security events, gate intrusions, or immediate warden mobilization:
          </p>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-rose-800">24x7 Security Command Center</p>
              <p className="text-xl font-black text-rose-600 mt-0.5">+91 674 2751020 &nbsp;/&nbsp; 112</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Triggering test security alert to Command Room!')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Simulate Emergency Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
