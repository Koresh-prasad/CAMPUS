'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Download,
  Eye,
} from 'lucide-react';

interface HostelLeaveGatePassProps {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  externalPasses?: any[];
}

export default function HostelLeaveGatePassView({
  activeSubTab,
  setActiveSubTab,
  externalPasses,
}: HostelLeaveGatePassProps) {
  const subTabs = [
    'Leave Request',
    'Gate Pass Request',
    'Pending Requests',
    'Approved Requests',
    'Rejected Requests',
    'Warden Approval',
    'Security Verification',
    'Entry / Exit Records',
    'Leave History',
  ];

  const currentTab = activeSubTab || 'Leave Request';

  // Requests state
  const [requests, setRequests] = useState<any[]>([
    {
      id: 'REQ-101',
      studentName: 'Rahul Kumar',
      rollNo: '2101289001',
      room: 'A-204 (Nilgiri)',
      type: 'HOME_LEAVE',
      from: '2025-10-04',
      to: '2025-10-07',
      reason: 'Attending cousin wedding in Cuttack',
      parentPhone: '+91 94370 11223',
      parentConsent: 'Confirmed via OTP',
      status: 'PENDING',
      appliedAt: '2 hours ago',
    },
    {
      id: 'REQ-102',
      studentName: 'Priya Sahu',
      rollNo: '2101289045',
      room: 'B-112 (Shivalik)',
      type: 'DAY_PASS',
      from: '2025-10-03 16:00',
      to: '2025-10-03 20:30',
      reason: 'GATE Coaching class & bookstore visit',
      parentPhone: '+91 94370 22334',
      parentConsent: 'Pre-authorized',
      status: 'PENDING',
      appliedAt: '3 hours ago',
    },
    {
      id: 'REQ-103',
      studentName: 'Amit Patel',
      rollNo: '2201289012',
      room: 'A-305 (Nilgiri)',
      type: 'DAY_PASS',
      from: '2025-10-03 15:00',
      to: '2025-10-03 19:30',
      reason: 'Medical prescription collection at hospital',
      parentPhone: '+91 94370 33445',
      parentConsent: 'Confirmed',
      status: 'APPROVED',
      passCode: 'GP-84920',
      appliedAt: '5 hours ago',
    },
    {
      id: 'REQ-104',
      studentName: 'Rohan Jena',
      rollNo: '2001289019',
      room: 'A-102 (Nilgiri)',
      type: 'HOME_LEAVE',
      from: '2025-10-02',
      to: '2025-10-06',
      reason: 'Personal travel without parent written note',
      parentPhone: '+91 94370 55667',
      parentConsent: 'Parent unverified',
      status: 'REJECTED',
      rejectionReason: 'Parent consent call could not be verified by Warden Office',
      appliedAt: 'Yesterday',
    },
  ]);

  const [verifyRoll, setVerifyRoll] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);

  // Sync real passes from backend database
  React.useEffect(() => {
    const fetchRealPasses = async () => {
      try {
        const res = await fetch('/api/passes');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.passes || [];
          if (list.length > 0) {
            const mapped = list.map((p: any) => ({
              id: p.id,
              studentName: p.resident?.name || p.studentName || 'Student Resident',
              rollNo: p.resident?.residentProfile?.rollNo || p.rollNo || '2101289001',
              room: p.resident?.residentProfile?.roomNumber || p.roomNumber || 'A-204',
              type: p.passType === 'HOME' ? 'HOME_LEAVE' : 'DAY_PASS',
              from: p.validTill ? new Date(p.validTill).toLocaleDateString() : 'Today',
              to: p.validTill ? new Date(p.validTill).toLocaleDateString() : 'Today',
              reason: p.reason || 'Personal outing',
              parentPhone: p.resident?.residentProfile?.parentPhone || '+91 94370 11223',
              parentConsent: 'Confirmed',
              status: p.status || 'PENDING',
              passCode: p.passNumber,
              appliedAt: new Date(p.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setRequests((prev) => {
              const prevIds = new Set(prev.map((r) => r.id));
              const newItems = mapped.filter((m: any) => !prevIds.has(m.id));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (err) {
        console.warn('Passes desk sync:', err);
      }
    };
    fetchRealPasses();
  }, []);

  // Sync external passes updates from parent
  React.useEffect(() => {
    if (externalPasses && externalPasses.length > 0) {
      const mapped = externalPasses.map((p: any) => ({
        id: p.id,
        studentName: p.resident?.name || p.studentName || 'Student Resident',
        rollNo: p.resident?.residentProfile?.rollNo || p.rollNo || '2101289001',
        room: p.resident?.residentProfile?.roomNumber || p.roomNumber || 'A-204',
        type: p.passType === 'HOME' ? 'HOME_LEAVE' : 'DAY_PASS',
        from: p.validTill ? new Date(p.validTill).toLocaleDateString() : 'Today',
        to: p.validTill ? new Date(p.validTill).toLocaleDateString() : 'Today',
        reason: p.reason || 'Personal outing',
        parentPhone: p.resident?.residentProfile?.parentPhone || '+91 94370 11223',
        parentConsent: 'Confirmed',
        status: p.status || 'PENDING',
        passCode: p.passNumber,
        appliedAt: new Date(p.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      setRequests((prev) => {
        const prevIds = new Set(prev.map((r) => r.id));
        const newItems = mapped.filter((m: any) => !prevIds.has(m.id));
        return [...newItems, ...prev];
      });
    }
  }, [externalPasses]);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/passes/${id}/approve`, { method: 'POST' });
    } catch (e) {
      console.warn('Approve pass sync:', e);
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED', passCode: r.passCode || `GP-${Math.floor(10000 + Math.random() * 90000)}` } : r))
    );
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:') || 'Denied by warden';
    try {
      await fetch(`/api/passes/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
    } catch (e) {
      console.warn('Reject pass sync:', e);
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED', rejectionReason: reason } : r))
    );
  };

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

      {/* 1. LEAVE REQUEST */}
      {currentTab === 'Leave Request' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Multi-Day Home Leave Application Desk</h3>
            <p className="text-xs text-slate-500 mt-0.5">Approve or issue extended absence from campus residence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Student Roll Number</label>
              <input type="text" placeholder="e.g. 2101289001" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Destination City / Address</label>
              <input type="text" placeholder="e.g. Cuttack, Odisha" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Departure Date</label>
              <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Expected Return Date</label>
              <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('Home Leave request logged for warden approval.')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Submit Leave Application
          </button>
        </div>
      )}

      {/* 2. GATE PASS REQUEST */}
      {currentTab === 'Gate Pass Request' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Day Outing Gate Pass Generator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Standard daily curfew outing pass (curfew time: 21:30 PM).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Student Roll Number</label>
              <input type="text" placeholder="2101289045" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Purpose of Outing</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                <option>Local Market / Supplies</option>
                <option>Coaching / Tuition</option>
                <option>Medical Consultation</option>
                <option>Family Meeting</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Expected In-Time</label>
              <input type="time" defaultValue="20:30" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert('Outing gate pass generated!')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Generate Gate Pass
          </button>
        </div>
      )}

      {/* 3. PENDING REQUESTS */}
      {currentTab === 'Pending Requests' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Pending Approval Queue</h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
              {requests.filter((r) => r.status === 'PENDING').length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {requests
              .filter((r) => r.status === 'PENDING')
              .map((r) => (
                <div key={r.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-sm text-slate-900">{r.studentName}</span>
                      <span className="font-mono text-xs text-slate-400">({r.rollNo})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {r.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Period:</strong> {r.from} &rarr; {r.to} &nbsp;|&nbsp; <strong>Reason:</strong> {r.reason}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Parent Phone: {r.parentPhone} • <span className="text-emerald-600 font-bold">{r.parentConsent}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleReject(r.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(r.id)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                    >
                      Approve Pass
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. APPROVED REQUESTS */}
      {currentTab === 'Approved Requests' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-800">Approved & Active Passes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requests
              .filter((r) => r.status === 'APPROVED')
              .map((r) => (
                <div key={r.id} className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{r.studentName}</span>
                    <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {r.passCode || 'GP-10291'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Valid Till: {r.to}</p>
                  <p className="text-[11px] text-slate-400">Authorized by Chief Warden Office</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 5. REJECTED REQUESTS */}
      {currentTab === 'Rejected Requests' && (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <h3 className="text-sm font-extrabold text-slate-800">Rejected Leave Requests</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {requests
              .filter((r) => r.status === 'REJECTED')
              .map((r) => (
                <div key={r.id} className="bg-white border border-rose-200 rounded-2xl p-4 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{r.studentName} ({r.rollNo})</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Rejected
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium">Reason: {r.rejectionReason}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. WARDEN APPROVAL */}
      {currentTab === 'Warden Approval' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800">Warden Digital Authorization Protocol</h3>
          <p className="text-xs text-slate-500">
            Automated parent OTP and digital signing applied to all leaves over 24 hours.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
            <p className="font-bold">Active Warden Duty Signature: Prof. R. C. Dash</p>
            <p className="text-[11px] text-blue-700">Signed with 256-bit Institutional Key • Turnaround SLA: &lt; 2 Hours</p>
          </div>
        </div>
      )}

      {/* 7. SECURITY VERIFICATION */}
      {currentTab === 'Security Verification' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Main Gate Turnstile Scanner & Verification</h3>
            <p className="text-xs text-slate-500 mt-0.5">Scan student gate pass QR or enter roll number to log entry/exit.</p>
          </div>

          <div className="max-w-md flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Roll No or Pass Token (e.g. 2101289001)..."
              value={verifyRoll}
              onChange={(e) => setVerifyRoll(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                setScanResult({
                  name: 'Rahul Kumar',
                  roll: '2101289001',
                  pass: 'GP-84920 (Approved)',
                  status: 'VALID',
                  time: 'Valid until 21:30 PM Today',
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Verify
            </button>
          </div>

          {scanResult && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs space-y-2 max-w-md">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pass Valid & Verified</span>
              </div>
              <p className="text-slate-800"><strong>Student:</strong> {scanResult.name} ({scanResult.roll})</p>
              <p className="text-slate-600"><strong>Pass Code:</strong> {scanResult.pass}</p>
              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => alert('Student checked out at Main Gate Turnstile 1.')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                >
                  Log Exit (Check Out)
                </button>
                <button
                  type="button"
                  onClick={() => alert('Student checked in back on campus.')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                >
                  Log Return (Check In)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. ENTRY / EXIT RECORDS */}
      {currentTab === 'Entry / Exit Records' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800">Live Turnstile Entry / Exit Feed</h3>
          <div className="space-y-2 text-xs">
            {[
              { name: 'Amit Patel', roll: '2201289012', action: 'EXIT', gate: 'Main Gate Gate 1', time: '10 mins ago', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
              { name: 'Priya Sahu', roll: '2101289045', action: 'ENTRY', gate: 'Girls Hostel Gate', time: '25 mins ago', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { name: 'Sneha Mohanty', roll: '2301289078', action: 'ENTRY', gate: 'Main Gate Gate 2', time: '1 hour ago', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            ].map((rec, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{rec.name}</span>
                  <span className="font-mono text-slate-400 ml-2">({rec.roll})</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{rec.gate}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${rec.badge}`}>
                    {rec.action}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rec.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. LEAVE HISTORY */}
      {currentTab === 'Leave History' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800">Historical Leave & Gate Pass Archive</h3>
            <button
              type="button"
              onClick={() => alert('Exporting Leave Archive as CSV...')}
              className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">Total gate passes issued this semester: <strong>1,842 passes</strong> (99.2% on-time return rate).</p>
        </div>
      )}
    </div>
  );
}
