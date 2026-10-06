'use client';

import React, { useState } from 'react';
import {
  Heart,
  Phone,
  Clock,
  AlertTriangle,
  Building,
  User,
  Plus,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Ambulance,
} from 'lucide-react';

interface MedicalCareProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
}

export default function MedicalCareView({
  activeSubTab,
  setActiveSubTab,
}: MedicalCareProps) {
  const subTabs = [
    'College Medical Center',
    'Doctor Details',
    'Nurse / Medical Staff',
    'Medical Contact Number',
    'Medical Hours',
    'Student Medical Assistance',
    'Medical Emergency Request',
    'Nearby Hospital Information',
  ];

  const currentTab = activeSubTab || 'College Medical Center';

  const doctors = [
    {
      name: 'Dr. S. K. Mohapatra',
      qual: 'MBBS, MD (Medicine)',
      designation: 'Senior Medical Officer',
      hours: '10:00 AM — 02:00 PM (Mon-Sat)',
      phone: '+91 94370 44551',
      room: 'Dispensary OPD-1',
      status: 'On Duty',
    },
    {
      name: 'Dr. Ananya Mishra',
      qual: 'MBBS, DGO',
      designation: 'Resident Campus Physician',
      hours: '04:00 PM — 08:00 PM (Daily)',
      phone: '+91 94370 44552',
      room: 'Dispensary OPD-2',
      status: 'Available on Call',
    },
  ];

  const nearbyHospitals = [
    {
      name: 'AIIMS Bhubaneswar',
      dist: '4.2 km',
      type: 'Apex Government Super Specialty',
      emergency: '+91 674 2476789',
      ambulance: '108 / 102',
      address: 'Sijua, Patrapada, Bhubaneswar',
    },
    {
      name: 'IMS & SUM Hospital',
      dist: '2.8 km',
      type: 'NABH Accredited Multi-Specialty',
      emergency: '+91 674 2386292',
      ambulance: '+91 94370 88990',
      address: 'K8 Kalinga Nagar, Bhubaneswar',
    },
    {
      name: 'KIMS Hospital',
      dist: '7.5 km',
      type: 'Super Specialty Trauma Center',
      emergency: '+91 674 2725555',
      ambulance: '+91 674 2725566',
      address: 'KIIT Road, Patia, Bhubaneswar',
    },
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

      {/* 1. COLLEGE MEDICAL CENTER */}
      {currentTab === 'College Medical Center' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-base font-extrabold text-slate-800">Raajdhani Health Center & Dispensary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Equipped with 8 observation beds, oxygen support, first aid station, and 24x7 ambulance standby.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">
              <span className="font-bold">Observation Beds</span>
              <p className="text-2xl font-black text-slate-900 mt-1">6 / 8</p>
              <p className="text-[10px] text-emerald-600">2 Beds Occupied</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-800">
              <span className="font-bold">Campus Ambulances</span>
              <p className="text-2xl font-black text-slate-900 mt-1">2 Ready</p>
              <p className="text-[10px] text-blue-600">Stationed at Gate 1</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-800">
              <span className="font-bold">Pharmacy Stock</span>
              <p className="text-2xl font-black text-slate-900 mt-1">98%</p>
              <p className="text-[10px] text-purple-600">Essential meds stocked</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800">
              <span className="font-bold">Triage Consultations</span>
              <p className="text-2xl font-black text-slate-900 mt-1">14</p>
              <p className="text-[10px] text-amber-600">Students treated today</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DOCTOR DETAILS */}
      {currentTab === 'Doctor Details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doc, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                  <p className="text-xs text-rose-600 font-bold">{doc.qual}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p><strong>Designation:</strong> {doc.designation}</p>
                <p><strong>OPD Timings:</strong> {doc.hours}</p>
                <p><strong>Phone:</strong> {doc.phone}</p>
                <p><strong>Consultation Room:</strong> {doc.room}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. NURSE / MEDICAL STAFF */}
      {currentTab === 'Nurse / Medical Staff' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Registered Nursing & Paramedical Staff</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Nurse Sarita Das (GNM)</strong>
              <p className="text-slate-500 text-[11px] mt-0.5">Shift: Day (08:00 AM - 04:00 PM)</p>
              <p className="text-blue-600 font-bold mt-1">+91 94370 77881</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Nurse Rita Mohanty (B.Sc Nursing)</strong>
              <p className="text-slate-500 text-[11px] mt-0.5">Shift: Night (04:00 PM - 12:00 AM)</p>
              <p className="text-blue-600 font-bold mt-1">+91 94370 77882</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Prabhat Kumar (Pharmacist)</strong>
              <p className="text-slate-500 text-[11px] mt-0.5">Dispensary Store Manager</p>
              <p className="text-blue-600 font-bold mt-1">+91 94370 77883</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MEDICAL CONTACT NUMBER */}
      {currentTab === 'Medical Contact Number' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-slate-800 mb-2">Medical Dispensary & Ambulance Hotlines</h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Campus Dispensary Reception</strong>
                <p className="text-[10px] text-slate-400">Direct Landline</p>
              </div>
              <span className="font-bold text-rose-600">+91 674 2751030</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Campus Ambulance Hotline (24x7)</strong>
                <p className="text-[10px] text-slate-400">Immediate Driver Dispatch</p>
              </div>
              <span className="font-bold text-rose-600">+91 94370 12345</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MEDICAL HOURS */}
      {currentTab === 'Medical Hours' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Dispensary Operating Hours</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-800">General OPD Consultations</strong>
              <p className="text-slate-600 mt-1">Monday through Saturday</p>
              <p className="text-blue-600 font-bold mt-2">09:00 AM — 08:00 PM</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <strong className="text-rose-800">Emergency & Ambulance Triage</strong>
              <p className="text-rose-600 mt-1">All days including holidays</p>
              <p className="text-rose-700 font-bold mt-2">24 Hours / 7 Days</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. STUDENT MEDICAL ASSISTANCE */}
      {currentTab === 'Student Medical Assistance' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Today's Clinic Visits & Prescriptions</h3>
            <button
              type="button"
              onClick={() => alert('New Medical Log Entry')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
            >
              + Log Student Visit
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Kunal Swain (2201289055)', ailment: 'Viral Fever & Dehydration', treatment: 'Paracetamol + ORS, Bed Rest prescribed', time: '1 hour ago' },
              { name: 'Deepika Sahoo (2301289022)', ailment: 'Sprained Ankle (Basketball)', treatment: 'Crepe bandage + Analgesic gel applied', time: '3 hours ago' },
            ].map((v, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-slate-800">{v.name}</strong>
                  <p className="text-slate-500 text-[11px] mt-0.5">{v.ailment}</p>
                  <p className="text-emerald-700 text-[10px] mt-0.5">{v.treatment}</p>
                </div>
                <span className="text-[10px] text-slate-400">{v.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. MEDICAL EMERGENCY REQUEST */}
      {currentTab === 'Medical Emergency Request' && (
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h3>Urgent Hospital Ambulance Dispatch</h3>
          </div>
          <p className="text-xs text-slate-600">
            Mobilize college ambulance or request city emergency unit for immediate trauma transfer:
          </p>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-rose-800">Campus Ambulance 1 (Driver: N. K. Sahoo)</p>
              <p className="text-xl font-black text-rose-600 mt-0.5">+91 94370 12345</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Ambulance 1 dispatched to hostel porch!')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Dispatch Ambulance
            </button>
          </div>
        </div>
      )}

      {/* 8. NEARBY HOSPITAL INFORMATION */}
      {currentTab === 'Nearby Hospital Information' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-800">Partner & Nearby Emergency Hospitals</h3>
            <p className="text-xs text-slate-500">Tier-1 medical facilities within a 15-minute radius of REC campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyHospitals.map((h, i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">{h.name}</h4>
                  <span className="font-bold text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {h.dist}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{h.type}</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>Emergency: <strong className="text-slate-800">{h.emergency}</strong></p>
                  <p>Ambulance: <strong className="text-rose-600">{h.ambulance}</strong></p>
                  <p className="text-[10px] text-slate-400 mt-1">{h.address}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
