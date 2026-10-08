'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Lock,
  Flame,
  UserCheck,
  Building,
} from 'lucide-react';

export default function GatePassTypesAndRulesTab() {
  const [curfewTime, setCurfewTime] = useState('21:30');
  const [maxPassesPerMonth, setMaxPassesPerMonth] = useState(6);
  const [autoApprovalLowRisk, setAutoApprovalLowRisk] = useState(false);
  const [escalationTimeMinutes, setEscalationTimeMinutes] = useState(120);

  const [blackoutDates, setBlackoutDates] = useState<any[]>([
    { date: '2026-10-15', title: 'Mid-Term Examinations' },
    { date: '2026-11-04', title: 'Annual Techno-Cultural Fest' },
  ]);
  const [newBlackoutDate, setNewBlackoutDate] = useState('');
  const [newBlackoutTitle, setNewBlackoutTitle] = useState('');

  const [passTypes, setPassTypes] = useState<any[]>([
    { id: 'DAY_OUTING', name: 'Day Outing', maxDays: 1, maxHours: 6, requiresGuardian: false, approver: 'WARDEN', active: true },
    { id: 'NIGHT_OUT', name: 'Night Out', maxDays: 1, maxHours: 12, requiresGuardian: true, approver: 'WARDEN', active: true },
    { id: 'WEEKEND', name: 'Weekend Outing', maxDays: 2, maxHours: 48, requiresGuardian: true, approver: 'WARDEN', active: true },
    { id: 'HOME_LEAVE', name: 'Home Leave', maxDays: 7, maxHours: 168, requiresGuardian: true, approver: 'WARDEN', active: true },
    { id: 'MEDICAL_LEAVE', name: 'Medical Leave', maxDays: 14, maxHours: 336, requiresGuardian: true, approver: 'DOCTOR_AND_WARDEN', active: true },
    { id: 'EMERGENCY_LEAVE', name: 'Emergency Leave', maxDays: 3, maxHours: 72, requiresGuardian: false, approver: 'CHIEF_WARDEN', active: true },
    { id: 'ACADEMIC_LEAVE', name: 'Academic / Duty Leave', maxDays: 5, maxHours: 120, requiresGuardian: false, approver: 'FACULTY_AND_WARDEN', active: true },
  ]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/passes/rules');
      if (res.ok) {
        const data = await res.json();
        if (data.curfewTime) setCurfewTime(data.curfewTime);
        if (data.maxPassesPerMonth) setMaxPassesPerMonth(data.maxPassesPerMonth);
        if (typeof data.autoApprovalLowRisk === 'boolean') setAutoApprovalLowRisk(data.autoApprovalLowRisk);
        if (data.escalationTimeMinutes) setEscalationTimeMinutes(data.escalationTimeMinutes);
        if (Array.isArray(data.blackoutDates)) setBlackoutDates(data.blackoutDates);
        if (Array.isArray(data.passTypes)) setPassTypes(data.passTypes);
      }
    } catch (e) {
      console.error('Failed to load rules:', e);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/passes/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curfewTime,
          maxPassesPerMonth,
          autoApprovalLowRisk,
          escalationTimeMinutes,
          blackoutDates,
          passTypes,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save rules');
      }
    } catch (e) {
      alert('Error updating pass policies');
    } finally {
      setSaving(false);
    }
  };

  const addBlackoutDate = () => {
    if (!newBlackoutDate || !newBlackoutTitle.trim()) {
      alert('Provide date and title for the blackout restriction.');
      return;
    }
    setBlackoutDates([...blackoutDates, { date: newBlackoutDate, title: newBlackoutTitle.trim() }]);
    setNewBlackoutDate('');
    setNewBlackoutTitle('');
  };

  const removeBlackoutDate = (index: number) => {
    setBlackoutDates(blackoutDates.filter((_, idx) => idx !== index));
  };

  const togglePassTypeActive = (id: string) => {
    setPassTypes(
      passTypes.map((pt) => (pt.id === id ? { ...pt, active: pt.active === false ? true : false } : pt))
    );
  };

  const updatePassType = (id: string, field: string, val: any) => {
    setPassTypes(
      passTypes.map((pt) => (pt.id === id ? { ...pt, [field]: val } : pt))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" /> Campus Gate Pass & Curfew Rules Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure institutional pass parameters, curfew limits, escalation thresholds, and blackout periods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Policies Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Global Settings & Blackout Dates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Global Gate Settings */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Curfew & Pass Quotas
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Campus Curfew Time (Evening)</label>
                <input
                  type="time"
                  value={curfewTime}
                  onChange={(e) => setCurfewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Students returning after this hour are logged into the Overdue Escalation Ladder.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monthly Pass Quota per Student</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={maxPassesPerMonth}
                  onChange={(e) => setMaxPassesPerMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Exceeding this quota triggers an alert and requires Warden manual waiver.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Warden Escalation Limit (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={1440}
                  value={escalationTimeMinutes}
                  onChange={(e) => setEscalationTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Pending requests unattended beyond this time escalate directly to Chief Warden & Admin.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Auto-Approve Low-Risk Day Outings</div>
                  <div className="text-[11px] text-slate-400">Under 2 hours within city limit during daylight</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoApprovalLowRisk}
                  onChange={(e) => setAutoApprovalLowRisk(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Blackout Dates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" /> Blackout Dates (Exam & Fest Locks)
            </h3>
            <p className="text-xs text-slate-500">
              During blackout dates, regular student outing requests are blocked campus-wide.
            </p>

            <div className="space-y-2">
              {blackoutDates.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs"
                >
                  <div>
                    <div className="font-bold text-rose-900">{item.title}</div>
                    <div className="text-[11px] font-mono text-rose-700">{item.date}</div>
                  </div>
                  <button
                    onClick={() => removeBlackoutDate(idx)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <input
                type="date"
                value={newBlackoutDate}
                onChange={(e) => setNewBlackoutDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Reason (e.g. End Semester Exams)"
                  value={newBlackoutTitle}
                  onChange={(e) => setNewBlackoutTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  onClick={addBlackoutDate}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Pass Types Matrix */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" /> Pass Types & Approval Authorities
              </h3>
              <span className="text-xs font-mono text-slate-400">{passTypes.length} types registered</span>
            </div>

            <div className="space-y-3">
              {passTypes.map((pt) => (
                <div
                  key={pt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    pt.active !== false
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{pt.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 uppercase">({pt.id})</span>
                    </div>

                    <button
                      onClick={() => togglePassTypeActive(pt.id)}
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        pt.active !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {pt.active !== false ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-0.5">
                        Max Duration
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={pt.maxDays || 1}
                          onChange={(e) => updatePassType(pt.id, 'maxDays', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 font-bold"
                        />
                        <span className="text-slate-500 text-[11px]">days</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-0.5">
                        Approval Authority
                      </label>
                      <select
                        value={pt.approver}
                        onChange={(e) => updatePassType(pt.id, 'approver', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-medium"
                      >
                        <option value="WARDEN">Hostel Warden</option>
                        <option value="DOCTOR_AND_WARDEN">Doctor & Warden</option>
                        <option value="CHIEF_WARDEN">Chief Warden</option>
                        <option value="FACULTY_AND_WARDEN">Faculty Advisor & Warden</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-0.5">
                        Guardian Consent
                      </label>
                      <label className="flex items-center gap-2 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pt.requiresGuardian}
                          onChange={(e) => updatePassType(pt.id, 'requiresGuardian', e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-slate-700">Required via OTP/Call</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
