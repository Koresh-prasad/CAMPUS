'use client';

import React, { useState } from 'react';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Search,
  User,
  ArrowRight,
  MapPin,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
  DoorOpen,
  LogOut,
  LogIn,
} from 'lucide-react';

export interface GatePassRecord {
  id: string;
  passNumber: string;
  studentName: string;
  studentId: string;
  studentPhoto?: string;
  hostel: string;
  room: string;
  purpose: string;
  destination: string;
  approvedBy: string; // e.g. "Prof. R. C. Dash (Warden)"
  departureTime: string;
  returnTime: string;
  status: 'APPROVED' | 'EXITED' | 'RETURNED' | 'EXPIRED' | 'REJECTED';
  exitRecordedAt?: string;
  returnRecordedAt?: string;
}

export const INITIAL_GATE_PASSES: GatePassRecord[] = [
  {
    id: 'pass-1',
    passNumber: 'GP-2026-8812',
    studentName: 'Subham Pradhan',
    studentId: 'CS2023042',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hostel: 'Nilgiri Block A',
    room: 'Room 204',
    purpose: 'Weekend Home Visit to Cuttack',
    destination: 'Cuttack, Odisha',
    approvedBy: 'Prof. Ramesh Chandra Dash (Chief Warden)',
    departureTime: 'Today, 04:30 PM',
    returnTime: 'Sunday, 08:00 PM',
    status: 'APPROVED',
  },
  {
    id: 'pass-2',
    passNumber: 'GP-2026-8813',
    studentName: 'Ananya Pattnaik',
    studentId: 'EC2023018',
    studentPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hostel: 'Shivalik Block B',
    room: 'Room 312',
    purpose: 'Medical Consultation at AIIMS BBSR',
    destination: 'AIIMS Bhubaneswar',
    approvedBy: 'Dr. Snehalata Mohanty (Warden)',
    departureTime: 'Today, 10:00 AM',
    returnTime: 'Today, 02:00 PM',
    status: 'EXITED',
    exitRecordedAt: 'Today, 10:05 AM via Gate #1',
  },
  {
    id: 'pass-3',
    passNumber: 'GP-2026-8814',
    studentName: 'Rohan Verma',
    studentId: 'ME2022089',
    studentPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hostel: 'Dhaulagiri Block C',
    room: 'Room 118',
    purpose: 'Procuring Robotics Hardware Components',
    destination: 'Saheed Nagar Electronics Market',
    approvedBy: 'Prof. B. N. Sahoo (Warden)',
    departureTime: 'Today, 01:00 PM',
    returnTime: 'Today, 06:00 PM',
    status: 'RETURNED',
    exitRecordedAt: 'Today, 01:10 PM',
    returnRecordedAt: 'Today, 05:40 PM',
  },
];

export function SecurityGatePassScannerView() {
  const [passes, setPasses] = useState<GatePassRecord[]>(INITIAL_GATE_PASSES);
  const [inputCode, setInputCode] = useState('');
  const [scannedPass, setScannedPass] = useState<GatePassRecord | null>(null);
  const [scanMessage, setScanMessage] = useState<{ type: 'SUCCESS' | 'ERROR' | 'INFO'; text: string } | null>(null);
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  const handleScanOrSubmit = (codeToSearch: string) => {
    const trimmed = codeToSearch.trim();
    if (!trimmed) return;

    const found = passes.find(
      (p) =>
        p.passNumber.toLowerCase() === trimmed.toLowerCase() ||
        p.studentId.toLowerCase() === trimmed.toLowerCase()
    );

    if (found) {
      setScannedPass(found);
      setScanMessage({
        type: 'SUCCESS',
        text: `✓ Valid Gate Pass #${found.passNumber} Verified. Approved by ${found.approvedBy}`,
      });
    } else {
      setScannedPass(null);
      setScanMessage({
        type: 'ERROR',
        text: `❌ No active approved pass found for "${trimmed}". Security cannot authorize unapproved exit.`,
      });
    }
  };

  const handleConfirmExit = () => {
    if (!scannedPass) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated: GatePassRecord = {
      ...scannedPass,
      status: 'EXITED',
      exitRecordedAt: `Today, ${nowTime} via Turnstile Gate 1`,
    };

    setPasses((prev) => prev.map((p) => (p.id === scannedPass.id ? updated : p)));
    setScannedPass(updated);
    setScanMessage({
      type: 'SUCCESS',
      text: `🚪 EXIT RECORDED for ${scannedPass.studentName}. Turnstile gate unlocked.`,
    });
  };

  const handleConfirmReturn = () => {
    if (!scannedPass) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated: GatePassRecord = {
      ...scannedPass,
      status: 'RETURNED',
      returnRecordedAt: `Today, ${nowTime} via Turnstile Gate 1`,
    };

    setPasses((prev) => prev.map((p) => (p.id === scannedPass.id ? updated : p)));
    setScannedPass(updated);
    setScanMessage({
      type: 'SUCCESS',
      text: `🏫 RETURN RECORDED for ${scannedPass.studentName}. Student logged back inside campus.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30">
              Campus Security Gate Control
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Turnstiles & Barriers Online</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">SCAN & VERIFY STUDENT GATE PASS</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Security verification station. Security officers scan student QR passes to record authorized exits and returns.
          </p>
        </div>

        {/* Security Rule Badge */}
        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center space-x-2.5 text-xs">
          <Shield className="w-5 h-5 text-teal-400 shrink-0" />
          <div className="text-left">
            <strong className="text-white block font-bold">Read-Only Pass Verification</strong>
            <span className="text-[10px] text-slate-400">Pass approvals are strictly restricted to Wardens & Admin</span>
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scanner Station (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
                <ScanLine className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-900">SCAN GATE PASS</h3>
              <p className="text-xs text-slate-500">
                Hold student mobile QR code in front of scanner or enter Pass Number.
              </p>
            </div>

            {/* Quick Demo Pre-set Buttons */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Quick Scan Simulation:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {passes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setInputCode(p.passNumber);
                      handleScanOrSubmit(p.passNumber);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Scan {p.passNumber} ({p.studentName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleScanOrSubmit(inputCode);
              }}
              className="space-y-3"
            >
              <div className="relative">
                <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Pass ID e.g. GP-2026-8812 or Student ID..."
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Verify Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('');
                    setScannedPass(null);
                    setScanMessage(null);
                  }}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
                  title="Reset scanner"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Status Alert Banner */}
            {scanMessage && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-bold animate-in fade-in ${
                  scanMessage.type === 'SUCCESS'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {scanMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scan Result & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {scannedPass ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={scannedPass.studentPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={scannedPass.studentName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {scannedPass.passNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          scannedPass.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : scannedPass.status === 'EXITED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {scannedPass.status}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">{scannedPass.studentName}</h3>
                    <p className="text-xs text-slate-500 font-medium">Student ID: {scannedPass.studentId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Authorized By</span>
                  <span className="text-xs font-bold text-slate-800">{scannedPass.approvedBy}</span>
                </div>
              </div>

              {/* Pass Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hostel & Room</span>
                  <strong className="text-slate-800">{scannedPass.hostel} • {scannedPass.room}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination</span>
                  <strong className="text-slate-800">{scannedPass.destination}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Departure Schedule</span>
                  <strong className="text-slate-800">{scannedPass.departureTime}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Return</span>
                  <strong className="text-slate-800">{scannedPass.returnTime}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
                <span className="text-[10px] text-blue-700 font-extrabold uppercase block">Approved Purpose</span>
                <p className="text-blue-950 font-medium mt-0.5">{scannedPass.purpose}</p>
              </div>

              {/* Movement History */}
              <div className="space-y-1.5 text-xs">
                {scannedPass.exitRecordedAt && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center space-x-1.5 text-amber-700">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit Timestamp:</span>
                    </span>
                    <span className="font-mono">{scannedPass.exitRecordedAt}</span>
                  </div>
                )}

                {scannedPass.returnRecordedAt && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700">
                    <span className="font-bold flex items-center space-x-1.5 text-emerald-700">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Return Timestamp:</span>
                    </span>
                    <span className="font-mono">{scannedPass.returnRecordedAt}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Security Gate Officer */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {scannedPass.status === 'APPROVED' && (
                  <button
                    onClick={handleConfirmExit}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>APPROVED — CONFIRM EXIT</span>
                  </button>
                )}

                {scannedPass.status === 'EXITED' && (
                  <button
                    onClick={handleConfirmReturn}
                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black transition shadow-md shadow-blue-600/25 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span>RETURN RECORDED (STUDENT BACK)</span>
                  </button>
                )}

                {scannedPass.status === 'RETURNED' && (
                  <div className="w-full p-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold text-center">
                    ✓ PASS CYCLE COMPLETED: Both Exit and Return Recorded Successfully
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
              <QrCode className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
              <h4 className="text-sm font-black text-slate-700">Awaiting Gate Pass Scan</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Once a QR code is scanned or Pass ID entered on the left station, student photo, approval status and exit actions will appear here instantly.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Movement Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Recent Turnstile Entry / Exit Logs</h3>
            <p className="text-xs text-slate-500">Live gate movements recorded at Main Campus Barrier #1</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">Total Movements: {passes.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-4">Pass Number</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Hostel / Room</th>
                <th className="py-3 px-4">Approved By</th>
                <th className="py-3 px-4">Exit Recorded</th>
                <th className="py-3 px-4">Return Recorded</th>
                <th className="py-3 px-4 text-center">Pass Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passes.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{p.passNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.studentName} ({p.studentId})</td>
                  <td className="py-3 px-4 text-slate-600">{p.hostel} • {p.room}</td>
                  <td className="py-3 px-4 text-slate-600">{p.approvedBy}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{p.exitRecordedAt || '—'}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{p.returnRecordedAt || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        p.status === 'APPROVED'
                          ? 'bg-amber-100 text-amber-800'
                          : p.status === 'EXITED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default SecurityGatePassScannerView;
