'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  Flame,
  Ambulance,
  Radio,
  Clock,
  Send,
  AlertTriangle,
  History,
  Shield,
  Building,
  BellRing,
} from 'lucide-react';

interface EmergencyViewProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  activeAlerts?: any[];
}

export default function EmergencyView({
  activeSubTab,
  setActiveSubTab,
  activeAlerts,
}: EmergencyViewProps) {
  const subTabs = [
    'Emergency Contacts',
    'Security',
    'Ambulance',
    'Police',
    'Fire',
    'Medical Emergency',
    'Hostel Emergency',
    'Emergency Broadcast',
    'Emergency Alert History',
  ];

  const currentTab = activeSubTab || 'Emergency Contacts';

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLevel, setBroadcastLevel] = useState('HIGH_ALERT');
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchActiveAlerts = async () => {
      try {
        const res = await fetch('/api/emergency/active');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setLiveAlerts(data);
        }
      } catch (_) {}
    };
    fetchActiveAlerts();
  }, []);

  React.useEffect(() => {
    if (activeAlerts && activeAlerts.length > 0) {
      setLiveAlerts((prev) => {
        const prevIds = new Set(prev.map((a) => a.id));
        const toAdd = activeAlerts.filter((a) => !prevIds.has(a.id));
        return [...toAdd, ...prev];
      });
    }
  }, [activeAlerts]);

  const handleResolveAlert = async (id: string) => {
    try {
      await fetch(`/api/emergency/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', notes: 'Resolved by Admin Security Desk' }),
      });
      setLiveAlerts((prev) => prev.filter((a) => a.id !== id));
      alert('Emergency alert marked as resolved.');
    } catch (_) {
      alert('Failed to resolve alert.');
    }
  };

  const handleBroadcastEmergency = async () => {
    try {
      await fetch('/api/emergency/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyType: broadcastLevel,
          locationDetails: broadcastTitle || 'Campus-Wide Critical Siren',
          notes: broadcastMessage || 'Immediate safety dispatch issued.',
          studentName: 'Campus Admin Control Desk',
        }),
      });
      alert(`Emergency broadcast "${broadcastTitle || 'Alert'}" successfully dispatched across campus!`);
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (_) {
      alert('Broadcast dispatch failed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Live Emergency Incidents Banner */}
      {liveAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-700">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
              <h4 className="text-sm font-black uppercase tracking-wider">
                🚨 Active Emergency Incidents ({liveAlerts.length})
              </h4>
            </div>
            <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">LIVE RADAR</span>
          </div>
          <div className="space-y-2">
            {liveAlerts.map((alt) => (
              <div key={alt.id} className="bg-white p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-black text-rose-900">{alt.emergencyType}: {alt.residentName || 'Student'}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Room: {alt.roomNumber || 'Unknown'} • Block: {alt.blockName || 'Hostel'} • Contact: {alt.residentPhone || alt.parentPhone || 'N/A'}</p>
                  {alt.locationDetails && <p className="text-slate-500 text-[10px]">{alt.locationDetails}</p>}
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleResolveAlert(alt.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-3 bg-white p-3 rounded-2xl shadow-2xs">
        {subTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveSubTab(tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === tab
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/25'
                : 'bg-slate-50 text-slate-600 hover:text-rose-600 hover:bg-rose-50/60 border border-slate-200/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. EMERGENCY CONTACTS */}
      {currentTab === 'Emergency Contacts' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Campus Emergency Speed Dial Directory</h3>
              <p className="text-xs text-slate-500">Instant hotline numbers with 24x7 control room monitoring.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Emergency Lines Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Campus Security', num: '+91 674 2751020', desc: 'Main Gate Control Desk', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: Shield },
              { title: 'Campus Ambulance', num: '+91 94370 12345', desc: 'Stationed on campus', color: 'bg-rose-50 border-rose-200 text-rose-700', icon: Ambulance },
              { title: 'Khandagiri Police', num: '112 / 0674-2471011', desc: 'Local jurisdiction station', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: ShieldAlert },
              { title: 'Bhubaneswar Fire', num: '101 / 0674-2560101', desc: 'Fire & Rescue Service', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Flame },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border ${c.color} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">{c.title}</span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-black text-slate-900">{c.num}</p>
                  <p className="text-[10px] text-slate-500">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SECURITY */}
      {currentTab === 'Security' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Security Control Room Protocols</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <p className="font-bold text-slate-800">Chief Security Officer: Capt. M. R. Mohanty (Retd.)</p>
            <p className="text-slate-600">Direct Command Line: +91 674 2751020 &nbsp;|&nbsp; Mobile: +91 94370 99881</p>
            <p className="text-[11px] text-slate-500">48 CCTV cameras active with AI perimeter motion detection enabled.</p>
          </div>
        </div>
      )}

      {/* 3. AMBULANCE */}
      {currentTab === 'Ambulance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Campus Ambulance Standby</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <strong className="text-rose-900 block text-sm">Ambulance Unit 1 (ALS)</strong>
              <p className="text-slate-600 mt-1">Driver: N. K. Sahoo (+91 94370 12345)</p>
              <p className="text-emerald-700 font-bold mt-2">Status: Parked at Main Porch • Ready</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <strong className="text-blue-900 block text-sm">Ambulance Unit 2 (BLS)</strong>
              <p className="text-slate-600 mt-1">Driver: B. Jena (+91 94370 12346)</p>
              <p className="text-emerald-700 font-bold mt-2">Status: Ready on Standby</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. POLICE */}
      {currentTab === 'Police' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Local Law Enforcement</h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <p className="font-bold text-slate-800">Khandagiri Police Station</p>
            <p className="text-slate-600">Inspector In-Charge: +91 674 2471011</p>
            <p className="text-slate-600">Police PCR Van Patrol Hotline: 112</p>
          </div>
        </div>
      )}

      {/* 5. FIRE */}
      {currentTab === 'Fire' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Fire & Emergency Services</h3>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5">
            <p className="font-bold text-amber-900">Bhubaneswar Fire Station</p>
            <p className="text-amber-700">Toll Free: 101 &nbsp;|&nbsp; Station Officer: 0674-2560101</p>
            <p className="text-[11px] text-slate-500">Annual campus fire safety certificate renewed: Valid till Dec 2025.</p>
          </div>
        </div>
      )}

      {/* 6. MEDICAL EMERGENCY */}
      {currentTab === 'Medical Emergency' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Campus Medical Emergency Protocol</h3>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1.5">
            <p className="font-bold text-rose-900">Dr. S. K. Mohapatra (Priority Line)</p>
            <p className="text-rose-700">+91 94370 44551</p>
            <p className="text-slate-600">Dispensary emergency triage desk manned 24x7.</p>
          </div>
        </div>
      )}

      {/* 7. HOSTEL EMERGENCY */}
      {currentTab === 'Hostel Emergency' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Hostel Night Emergency Contacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Boys Hostel Emergency Line</strong>
              <p className="text-blue-600 font-bold mt-1">+91 94370 12001 (Prof. Dash)</p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <strong className="text-slate-800">Girls Hostel Emergency Line</strong>
              <p className="text-rose-600 font-bold mt-1">+91 94370 12002 (Dr. Pattnaik)</p>
            </div>
          </div>
        </div>
      )}

      {/* 8. EMERGENCY BROADCAST */}
      {currentTab === 'Emergency Broadcast' && (
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-2xs space-y-5">
          <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-base">
            <Radio className="w-5 h-5 animate-pulse" />
            <h3>Campus-Wide Emergency Broadcast System</h3>
          </div>
          <p className="text-xs text-slate-500">
            Sends instantaneous high-priority push notifications and sirens to all student resident and faculty apps.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Severity</label>
              <select
                value={broadcastLevel}
                onChange={(e) => setBroadcastLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="CRITICAL_ALARM">CRITICAL ALARM (Fire / Disaster / Immediate Evacuation)</option>
                <option value="WEATHER_WARNING">WEATHER WARNING (Heavy Cyclone / Heatwave Advisory)</option>
                <option value="SECURITY_NOTICE">SECURITY NOTICE (Campus Curfew / Lockout)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alert Headline</label>
              <input
                type="text"
                placeholder="e.g. Cyclone Alert: All students advised to stay indoors..."
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Detailed Instructions</label>
              <textarea
                rows={3}
                placeholder="Enter mandatory safety instructions and shelter locations..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="button"
              onClick={handleBroadcastEmergency}
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Immediate Emergency Siren</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. EMERGENCY ALERT HISTORY */}
      {currentTab === 'Emergency Alert History' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Past Broadcast Archive</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Severe Rain Warning & Class Suspension</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">Dispatched to all residents on 12 Sep 2025</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded border border-amber-200">
                Weather Advisory
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Annual Campus Fire Drill Successful</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">Conducted across Blocks A & B on 18 Aug 2025</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
                Drill Completed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
