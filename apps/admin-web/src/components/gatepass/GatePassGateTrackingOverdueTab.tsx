'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Phone,
  Search,
  RefreshCw,
  QrCode,
  BellRing,
  Send,
  Building,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface GatePassGateTrackingOverdueTabProps {
  onSendReminder: (id: string) => Promise<void>;
  onSelectPass: (pass: any) => void;
}

export default function GatePassGateTrackingOverdueTab({
  onSendReminder,
  onSelectPass,
}: GatePassGateTrackingOverdueTabProps) {
  const [ladder, setLadder] = useState<{
    totalOverdue: number;
    level1: any[];
    level2: any[];
    level3: any[];
    repeatOffenders: any[];
  }>({
    totalOverdue: 0,
    level1: [],
    level2: [],
    level3: [],
    repeatOffenders: [],
  });

  const [gateLogs, setGateLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanToken, setScanToken] = useState('');
  const [scanType, setScanType] = useState<'EXIT' | 'ENTRY'>('EXIT');
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ladderRes, logsRes] = await Promise.all([
        fetch('/api/passes/overdue-ladder'),
        fetch('/api/passes/gate-logs'),
      ]);

      if (ladderRes.ok) {
        const ladderData = await ladderRes.json();
        setLadder(ladderData);
      }
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setGateLogs(logsData);
      }
    } catch (e) {
      console.error('Failed to load gate tracking data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanToken.trim()) return;
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch('/api/passes/scan-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCodeToken: scanToken.trim(),
          scanType,
          guardName: 'Main Campus Gate Security Post 1',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setScanMessage(`Success: ${data.message} (${data.presence})`);
        setScanToken('');
        fetchData();
      } else {
        setScanMessage(`Scan Failed: ${data.error || 'Invalid token'}`);
      }
    } catch (e) {
      setScanMessage('Failed to connect to gate turnstile controller.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Turnstile Scan Simulator Bar */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Gate Turnstile Reader Integration
              </span>
            </div>
            <h3 className="font-bold text-sm">Security Guard Turnstile Scanner (RFID / QR)</h3>
          </div>

          <form onSubmit={handleSimulateScan} className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-800 text-white border border-slate-700 font-semibold"
            >
              <option value="EXIT">GATE EXIT (Out)</option>
              <option value="ENTRY">GATE ENTRY (Return)</option>
            </select>

            <input
              type="text"
              placeholder="Paste QR Code Token (e.g. QR-PASS-102...)"
              value={scanToken}
              onChange={(e) => setScanToken(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-800 text-white border border-slate-700 placeholder-slate-400 w-56 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />

            <button
              type="submit"
              disabled={scanning}
              className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded-xl transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap"
            >
              {scanning ? 'Scanning...' : 'Scan Pass'}
            </button>
          </form>
        </div>

        {scanMessage && (
          <div className="mt-3 p-2.5 rounded-xl text-xs font-medium bg-slate-800 border border-slate-700 text-emerald-300">
            {scanMessage}
          </div>
        )}
      </div>

      {/* Overdue Escalation Ladder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-base font-bold text-slate-800">
              Late Return & Overdue Escalation Ladder
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
              {ladder.totalOverdue} Flagged Overdue
            </span>
          </div>

          <button
            onClick={fetchData}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Level 1: Under 1 Hour */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" /> Level 1: &lt; 1 Hour Overdue
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                {ladder.level1.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Automated SMS advisory dispatched to student mobile.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {ladder.level1.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">No students in Level 1</div>
              ) : (
                ladder.level1.map((item) => (
                  <div key={item.id} className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{item.studentName}</span>
                      <span className="text-amber-700 font-mono">+{item.minutesOverdue}m</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{item.rollNo} • Room {item.room}</div>
                    <button
                      onClick={() => onSendReminder(item.id)}
                      className="w-full mt-1 py-1 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <BellRing className="w-3 h-3" /> Send Reminder SMS
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Level 2: 1 - 3 Hours */}
          <div className="bg-white rounded-2xl border border-orange-300 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-orange-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                <AlertTriangle className="w-4 h-4 text-orange-600" /> Level 2: 1 - 3 Hours Overdue
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-mono">
                {ladder.level2.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Guardian telephone call alert triggered; Warden on alert.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {ladder.level2.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">No students in Level 2</div>
              ) : (
                ladder.level2.map((item) => (
                  <div key={item.id} className="p-2.5 bg-orange-50/70 rounded-xl border border-orange-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{item.studentName}</span>
                      <span className="text-orange-700 font-mono font-bold">+{item.minutesOverdue}m</span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>{item.rollNo}</span>
                      <a href={`tel:${item.parentPhone}`} className="text-indigo-600 font-bold hover:underline">
                        Call Parent
                      </a>
                    </div>
                    <button
                      onClick={() => onSendReminder(item.id)}
                      className="w-full mt-1 py-1 text-[11px] font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Trigger Warden Callout
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Level 3: > 3 Hours or Overnight */}
          <div className="bg-white rounded-2xl border border-rose-300 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Level 3: &gt; 3 Hours (Critical)
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono">
                {ladder.level3.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Chief Security Officer notified; Campus patrol dispatch.
            </p>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {ladder.level3.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">No critical overdue passes</div>
              ) : (
                ladder.level3.map((item) => (
                  <div key={item.id} className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-rose-950">
                      <span>{item.studentName}</span>
                      <span className="text-rose-700 font-mono font-bold">+{item.minutesOverdue}m</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Room {item.room} ({item.block}) • Destination: {item.destination}
                    </div>
                    <div className="pt-1 flex gap-1.5">
                      <button
                        onClick={() => alert(`Patrol vehicle dispatched to destination: ${item.destination}`)}
                        className="flex-1 py-1 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                      >
                        Dispatch Patrol
                      </button>
                      <button
                        onClick={() => onSendReminder(item.id)}
                        className="flex-1 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                      >
                        Urgent Broadcast
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Repeat Late Returners & Gate In/Out Log Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repeat Offenders (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" /> Repeat Late Returners
          </h4>
          <p className="text-xs text-slate-500">
            Students with 3+ curfew violations flagged for disciplinary hearing.
          </p>

          <div className="divide-y divide-slate-100">
            {ladder.repeatOffenders?.map((student, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{student.studentName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {student.rollNo} • Room {student.room}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{student.lastLate}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 font-mono">
                    {student.lateCount} strikes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Entry / Exit Log (8 cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Recent Turnstile Scan Logs (Gate Security)
            </h4>
            <span className="text-xs font-mono text-slate-400">{gateLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {gateLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No gate turnstile logs recorded yet.</div>
            ) : (
              gateLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.scanType === 'EXIT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.scanType}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{log.personName}</div>
                      <div className="text-[10px] text-slate-400">
                        {log.notes || 'Verified pass'} • {log.guardName}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
