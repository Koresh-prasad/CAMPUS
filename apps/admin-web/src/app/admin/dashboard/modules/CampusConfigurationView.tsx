'use client';

import React, { useState } from 'react';
import {
  Building2,
  Building,
  Layers,
  PhoneCall,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  MapPin,
  Settings,
  Mail,
  GraduationCap,
  Wrench,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';

export function CampusConfigurationView() {
  const [activeConfigTab, setActiveConfigTab] = useState<
    'CAMPUS_INFO' | 'HOSTELS' | 'DEPARTMENTS' | 'CATEGORIES' | 'EMERGENCY_CONTACTS'
  >('CAMPUS_INFO');

  // Campus Info State
  const [collegeName, setCollegeName] = useState('Silicon Institute of Technology & Research');
  const [campusCode, setCampusCode] = useState('SIT-BBSR-01');
  const [campusAddress, setCampusAddress] = useState('Silicon Hills, Patia, Bhubaneswar, Odisha 751024');
  const [directorName, setDirectorName] = useState('Dr. J. K. Mahapatra');
  const [supportEmail, setSupportEmail] = useState('campus.operations@silicon.ac.in');
  const [helplinePhone, setHelplinePhone] = useState('+91 674 2725444');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Hostels State
  const [hostels, setHostels] = useState([
    { id: 'H-A', name: 'Hostel Block A (Boys)', capacity: 420, floors: 4, rooms: 140, type: 'BOYS' },
    { id: 'H-B', name: 'Hostel Block B (Boys)', capacity: 420, floors: 4, rooms: 140, type: 'BOYS' },
    { id: 'H-C', name: 'Hostel Block C (Girls)', capacity: 360, floors: 4, rooms: 120, type: 'GIRLS' },
    { id: 'H-M', name: 'International Scholar Residence', capacity: 120, floors: 3, rooms: 40, type: 'CO_ED' }
  ]);

  // Departments State
  const [departments, setDepartments] = useState([
    { code: 'CSE', name: 'Computer Science & Engineering', head: 'Prof. R. Mishra', students: 840 },
    { code: 'ECE', name: 'Electronics & Communication Eng.', head: 'Prof. S. Das', students: 620 },
    { code: 'EE', name: 'Electrical & Electronics Eng.', head: 'Prof. A. Ray', students: 480 },
    { code: 'ME', name: 'Mechanical Engineering', head: 'Prof. P. Nayak', students: 340 },
    { code: 'CIVIL', name: 'Civil & Infrastructure Eng.', head: 'Prof. K. Rout', students: 280 }
  ]);

  // Service Categories State
  const [serviceCategories, setServiceCategories] = useState([
    { id: 'cat-1', name: 'Electrical & Lighting', active: true, slaHours: 4 },
    { id: 'cat-2', name: 'Plumbing & Water Supply', active: true, slaHours: 3 },
    { id: 'cat-3', name: 'Wi-Fi & Internet Connectivity', active: true, slaHours: 2 },
    { id: 'cat-4', name: 'Furniture & Carpentry', active: true, slaHours: 12 },
    { id: 'cat-5', name: 'AC & Fan Maintenance', active: true, slaHours: 6 },
    { id: 'cat-6', name: 'Cleaning & Washroom Hygiene', active: true, slaHours: 2 },
    { id: 'cat-7', name: 'Civil & Masonry Repair', active: true, slaHours: 24 }
  ]);

  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState([
    { role: 'Campus 24x7 Ambulance', name: 'Emergency Vehicle 1', phone: '+91 98765-10801', available: '24 Hours' },
    { role: 'Security Control Room Gate 1', name: 'Chief Security Officer', phone: '+91 98765-10802', available: '24 Hours' },
    { role: 'Campus Health Center', name: 'Dr. S. K. Panda (Resident MO)', phone: '+91 98765-10803', available: '08 AM - 10 PM' },
    { role: 'Women Safety & Anti-Ragging Helpline', name: 'Internal Complaints Cell', phone: '+91 98765-10804', available: '24 Hours' },
    { role: 'Chief Hostel Warden', name: 'Prof. B. Sharma', phone: '+91 98765-10805', available: '24 Hours' },
    { role: 'Infocity Police Station (Local)', name: 'Bhubaneswar Police Desk', phone: '112 / +91 674 2740100', available: '24 Hours' }
  ]);

  const showSaveSuccess = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-900 border border-slate-700/60 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Master Institutional Setup</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">College & Campus Configuration</h2>
          <p className="text-slate-400 text-sm mt-1">
            Hostels, academic buildings, departments, service categories, and emergency directory.
          </p>
        </div>
        <div>
          <button
            onClick={showSaveSuccess}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configurations</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {isSavedToast && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center space-x-3 text-emerald-400 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration parameters updated and synchronized across all portals successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 bg-slate-900 border border-slate-800 p-2 rounded-xl">
        {[
          { id: 'CAMPUS_INFO', label: 'College Info' },
          { id: 'HOSTELS', label: 'Hostels & Blocks' },
          { id: 'DEPARTMENTS', label: 'Academic Departments' },
          { id: 'CATEGORIES', label: 'Service Categories' },
          { id: 'EMERGENCY_CONTACTS', label: 'Emergency Hotlines' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveConfigTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeConfigTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: College Info */}
      {activeConfigTab === 'CAMPUS_INFO' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-400" />
            <span>Institutional Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Institution Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Campus Code / ID</label>
              <input
                type="text"
                value={campusCode}
                onChange={(e) => setCampusCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Campus Street Address</label>
              <input
                type="text"
                value={campusAddress}
                onChange={(e) => setCampusAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Director / Head of Institute</label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">General Operations Helpline</label>
              <input
                type="text"
                value={helplinePhone}
                onChange={(e) => setHelplinePhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hostels */}
      {activeConfigTab === 'HOSTELS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Hostel Blocks & Capacity Configuration</span>
            </h3>
            <span className="text-xs text-slate-400">Total Resident Capacity: 1,320 Beds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hostels.map((hostel) => (
              <div key={hostel.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{hostel.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {hostel.type}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Capacity</span>
                    <span className="font-bold text-white">{hostel.capacity} beds</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Floors</span>
                    <span className="font-bold text-white">{hostel.floors} floors</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Total Rooms</span>
                    <span className="font-bold text-white">{hostel.rooms} rooms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Departments */}
      {activeConfigTab === 'DEPARTMENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Academic Departments</span>
            </h3>
            <span className="text-xs text-slate-400">5 Registered Faculties</span>
          </div>

          <div className="space-y-2">
            {departments.map((dept) => (
              <div
                key={dept.code}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-400">{dept.code}</span>
                    <span className="text-white font-semibold">{dept.name}</span>
                  </div>
                  <p className="text-slate-400 mt-0.5">Head: {dept.head}</p>
                </div>
                <span className="font-bold text-slate-300">{dept.students} Students</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Categories */}
      {activeConfigTab === 'CATEGORIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              <span>Maintenance & Facility Service Categories</span>
            </h3>
            <span className="text-xs text-slate-400">Resolution SLA Rules</span>
          </div>

          <div className="space-y-2">
            {serviceCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-white font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">SLA Target: <strong className="text-blue-400">{cat.slaHours} hours</strong></span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Emergency Contacts */}
      {activeConfigTab === 'EMERGENCY_CONTACTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Campus Emergency Hotline Directory</span>
            </h3>
            <span className="text-xs text-rose-400 font-bold">24x7 Priority Response</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{contact.role}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {contact.available}
                  </span>
                </div>
                <p className="text-slate-400">{contact.name}</p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-slate-500 text-[11px]">Dial Direct:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
