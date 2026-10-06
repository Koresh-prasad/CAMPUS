'use client';

import React, { useState } from 'react';
import {
  Bed,
  Users,
  Building,
  ShieldCheck,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  Wrench,
  DoorOpen,
  UserCheck,
} from 'lucide-react';

interface HostelManagementProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  complaints?: any[];
}

export default function HostelManagementView({
  activeSubTab,
  setActiveSubTab,
  complaints = [],
}: HostelManagementProps) {
  const subTabs = [
    'Hostel List',
    'Hostel-wise Students',
    'Room Management',
    'Room Allocation',
    'Hostel Occupancy',
    'Hostel Warden',
    'Security Guard',
    'Hostel Contact Numbers',
    'Hostel Complaints',
  ];

  const currentTab = activeSubTab || 'Hostel List';
  const [selectedHostel, setSelectedHostel] = useState('Nilgiri Block A');
  const [roomFilter, setRoomFilter] = useState('ALL');

  const hostels = [
    {
      id: 'hostel-1',
      name: 'Nilgiri Block A (Boys)',
      type: 'Boys Residence',
      capacity: 800,
      occupied: 620,
      floors: 4,
      totalRooms: 400,
      warden: 'Prof. Ramesh Chandra Dash',
      phone: '+91 94370 12001',
      status: 'Normal',
      color: 'border-l-blue-600',
    },
    {
      id: 'hostel-2',
      name: 'Shivalik Block B (Girls)',
      type: 'Girls Residence',
      capacity: 650,
      occupied: 510,
      floors: 4,
      totalRooms: 325,
      warden: 'Dr. Smita Pattnaik',
      phone: '+91 94370 12002',
      status: 'Normal',
      color: 'border-l-rose-600',
    },
    {
      id: 'hostel-3',
      name: 'Dhaulagiri Block C (Junior Boys)',
      type: 'Freshers Residence',
      capacity: 350,
      occupied: 280,
      floors: 3,
      totalRooms: 175,
      warden: 'Prof. Manoj Tripathy',
      phone: '+91 94370 12003',
      status: 'Normal',
      color: 'border-l-amber-600',
    },
    {
      id: 'hostel-4',
      name: 'Aravali Executive Residence',
      type: 'Guest & Faculty',
      capacity: 60,
      occupied: 40,
      floors: 2,
      totalRooms: 30,
      warden: 'Mr. Sunil Pradhan',
      phone: '+91 94370 12004',
      status: 'Normal',
      color: 'border-l-purple-600',
    },
  ];

  const rooms = [
    { number: 'A-101', floor: '1st Floor', type: 'Double Sharing', ac: 'Non-AC', occupied: 2, capacity: 2, status: 'Full' },
    { number: 'A-102', floor: '1st Floor', type: 'Double Sharing', ac: 'Non-AC', occupied: 1, capacity: 2, status: 'Available' },
    { number: 'A-103', floor: '1st Floor', type: 'Single Attached', ac: 'AC', occupied: 1, capacity: 1, status: 'Full' },
    { number: 'A-104', floor: '1st Floor', type: 'Triple Sharing', ac: 'Non-AC', occupied: 2, capacity: 3, status: 'Available' },
    { number: 'A-201', floor: '2nd Floor', type: 'Double Sharing', ac: 'AC', occupied: 2, capacity: 2, status: 'Full' },
    { number: 'A-202', floor: '2nd Floor', type: 'Double Sharing', ac: 'AC', occupied: 0, capacity: 2, status: 'Maintenance' },
    { number: 'A-203', floor: '2nd Floor', type: 'Triple Sharing', ac: 'Non-AC', occupied: 3, capacity: 3, status: 'Full' },
    { number: 'A-204', floor: '2nd Floor', type: 'Double Sharing', ac: 'Non-AC', occupied: 1, capacity: 2, status: 'Available' },
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

      {/* 1. HOSTEL LIST */}
      {currentTab === 'Hostel List' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Campus Residence Hostels</h3>
              <p className="text-xs text-slate-500">4 residential buildings with total capacity of 1,860 students.</p>
            </div>
            <button
              type="button"
              onClick={() => alert('New Hostel Registration')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm cursor-pointer"
            >
              + Add Hostel Block
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostels.map((h) => {
              const occupancyPct = Math.round((h.occupied / h.capacity) * 100);
              return (
                <div key={h.id} className={`bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs border-l-4 ${h.color} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{h.name}</h4>
                      <span className="text-[11px] font-bold text-slate-400">{h.type} • {h.floors} Floors</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {h.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-500">Occupancy</span>
                      <span className="text-slate-800 font-bold">{h.occupied} / {h.capacity} beds ({occupancyPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Chief Warden</span>
                      <strong className="text-slate-800 text-[11px] truncate block">{h.warden}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Warden Helpline</span>
                      <strong className="text-slate-800 text-[11px] block">{h.phone}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HOSTEL-WISE STUDENTS */}
      {currentTab === 'Hostel-wise Students' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Hostel Resident Directory</h3>
              <p className="text-xs text-slate-500">View allocated residents by block.</p>
            </div>
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option>Nilgiri Block A</option>
              <option>Shivalik Block B</option>
              <option>Dhaulagiri Block C</option>
              <option>Aravali Executive</option>
            </select>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs text-center py-8">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-2 opacity-80" />
            <h4 className="font-bold text-slate-800 text-sm">Showing Residents for {selectedHostel}</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All 620 active student residents are listed with current biometric gate check-in status.
            </p>
          </div>
        </div>
      )}

      {/* 3. ROOM MANAGEMENT */}
      {currentTab === 'Room Management' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Room Inventory & Maintenance</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Filter:</span>
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="ALL">All Rooms</option>
                <option value="Available">Available Beds</option>
                <option value="Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rooms.map((r, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{r.number}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : r.status === 'Maintenance'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{r.floor} • {r.type}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Beds:</span>
                  <strong className="text-slate-800">{r.occupied} / {r.capacity}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ROOM ALLOCATION */}
      {currentTab === 'Room Allocation' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Hostel Room Allotment Desk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assign incoming student to vacant hostel bed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Select Student Roll No</label>
              <input
                type="text"
                placeholder="e.g. 2401289001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Hostel Block</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option>Nilgiri Block A (Boys)</option>
                <option>Shivalik Block B (Girls)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Available Room & Bed</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option>Room A-102 (Bed 2)</option>
                <option>Room A-104 (Bed 3)</option>
                <option>Room A-204 (Bed 2)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('Student successfully allocated to Room A-102!')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Confirm Bed Allocation
          </button>
        </div>
      )}

      {/* 5. HOSTEL OCCUPANCY */}
      {currentTab === 'Hostel Occupancy' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Real-Time Occupancy Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
              <span className="font-bold text-blue-700">Total Hostels</span>
              <p className="text-xl font-black text-slate-900 mt-1">4 Blocks</p>
            </div>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-700">Occupied Beds</span>
              <p className="text-xl font-black text-slate-900 mt-1">1,450</p>
            </div>
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-700">Vacant Beds</span>
              <p className="text-xl font-black text-slate-900 mt-1">410</p>
            </div>
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
              <span className="font-bold text-purple-700">Overall Rate</span>
              <p className="text-xl font-black text-slate-900 mt-1">78%</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. HOSTEL WARDEN */}
      {currentTab === 'Hostel Warden' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Prof. Ramesh Chandra Dash', block: 'Chief Warden — Nilgiri Block A', phone: '+91 94370 12001', email: 'warden.boys@rec.ac.in', room: 'A-001' },
            { name: 'Dr. Smita Pattnaik', block: 'Chief Warden — Shivalik Block B', phone: '+91 94370 12002', email: 'warden.girls@rec.ac.in', room: 'B-001' },
            { name: 'Prof. Manoj Tripathy', block: 'Assistant Warden — Dhaulagiri Block C', phone: '+91 94370 12003', email: 'warden.c@rec.ac.in', room: 'C-001' },
            { name: 'Mr. Sunil Pradhan', block: 'Hostel Supervisor — Aravali Residence', phone: '+91 94370 12004', email: 'supervisor@rec.ac.in', room: 'AR-01' },
          ].map((w, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {w.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{w.name}</h4>
                  <p className="text-[10px] text-blue-600 font-semibold">{w.block}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <p>Phone: <strong className="text-slate-700">{w.phone}</strong></p>
                <p>Email: <strong className="text-slate-700">{w.email}</strong></p>
                <p>Office Room: <strong className="text-slate-700">{w.room}</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. SECURITY GUARD */}
      {currentTab === 'Security Guard' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Hostel Security Gate Roster</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800">Nilgiri Main Gate</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Guard: B. K. Nayak (Shift A)</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">On Duty</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800">Shivalik Girls Gate</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Guard: Manju Moharana (Shift A)</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">On Duty</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800">Night Patrol Squad</p>
              <p className="text-slate-500 text-[11px] mt-0.5">4 Security guards assigned</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">22:00 - 06:00</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. HOSTEL CONTACT NUMBERS */}
      {currentTab === 'Hostel Contact Numbers' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Hostel Emergency & Helpdesk Directory</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Boys Hostel Control Room</strong>
                <p className="text-[10px] text-slate-400">Available 24x7</p>
              </div>
              <span className="font-bold text-blue-600">+91 674 2751025</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Girls Hostel Control Room</strong>
                <p className="text-[10px] text-slate-400">Available 24x7</p>
              </div>
              <span className="font-bold text-blue-600">+91 674 2751026</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Electrical & Plumbing Maintenance</strong>
                <p className="text-[10px] text-slate-400">08:00 AM - 08:00 PM</p>
              </div>
              <span className="font-bold text-slate-700">+91 94370 33441</span>
            </div>
          </div>
        </div>
      )}

      {/* 9. HOSTEL COMPLAINTS */}
      {currentTab === 'Hostel Complaints' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Hostel Specific Complaints</h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              3 Active Issues
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Geyser not working in Room B-204</span>
                <p className="text-[10px] text-slate-400">Reported 2 hours ago by Priya Sahu</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-full border border-amber-200">
                In Progress
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Wi-Fi Access Point 3rd floor offline</span>
                <p className="text-[10px] text-slate-400">Reported 4 hours ago by Nilgiri Block A</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full border border-blue-200">
                Assigned
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
