'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Users,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  Building,
  RotateCcw,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface GatePassApprovalsOverridesTabProps {
  pendingPasses: any[];
  allPasses: any[];
  onApprove: (id: string, notes?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onOverride: (id: string, newStatus: string, reason: string) => Promise<void>;
  onBulkAction: (ids: string[], action: 'APPROVE' | 'REJECT' | 'CANCEL', reason?: string) => Promise<void>;
  onReassignWarden: (id: string, wardenName: string) => Promise<void>;
  onSelectPass: (pass: any) => void;
  onOpenHelpdesk: () => void;
  loading: boolean;
}

export default function GatePassApprovalsOverridesTab({
  pendingPasses,
  allPasses,
  onApprove,
  onReject,
  onOverride,
  onBulkAction,
  onReassignWarden,
  onSelectPass,
  onOpenHelpdesk,
  loading,
}: GatePassApprovalsOverridesTabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeQueue, setActiveQueue] = useState<'PENDING' | 'EMERGENCY' | 'ALL_ACTIVE'>('PENDING');

  // Override Modal state
  const [overridePass, setOverridePass] = useState<any | null>(null);
  const [overrideStatus, setOverrideStatus] = useState('APPROVED');
  const [overrideReason, setOverrideReason] = useState('');

  // Reassign Modal state
  const [reassignPass, setReassignPass] = useState<any | null>(null);
  const [targetWarden, setTargetWarden] = useState('Dr. S. K. Sharma (Senior Warden)');

  // Reject with reason state
  const [rejectPass, setRejectPass] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filtering passes for active queue
  const displayPasses =
    activeQueue === 'PENDING'
      ? pendingPasses
      : activeQueue === 'EMERGENCY'
      ? allPasses.filter((p) => p.passType === 'EMERGENCY' || p.passType === 'EMERGENCY_LEAVE' || p.escalationLevel === 'HIGH')
      : allPasses.filter((p) => p.status === 'APPROVED' || p.status === 'ACTIVE');

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === displayPasses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayPasses.map((p) => p.id));
    }
  };

  const handleBulk = async (action: 'APPROVE' | 'REJECT' | 'CANCEL') => {
    if (!selectedIds.length) return;
    const confirmMsg = `Execute bulk ${action} for ${selectedIds.length} requests?`;
    if (!confirm(confirmMsg)) return;

    await onBulkAction(selectedIds, action, `Admin bulk ${action}`);
    setSelectedIds([]);
  };

  const submitOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overridePass) return;
    if (!overrideReason.trim()) {
      alert('Override reason / justification is mandatory.');
      return;
    }
    await onOverride(overridePass.id, overrideStatus, overrideReason);
    setOverridePass(null);
    setOverrideReason('');
  };

  const submitReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignPass) return;
    await onReassignWarden(reassignPass.id, targetWarden);
    setReassignPass(null);
  };

  const submitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectPass) return;
    if (!rejectReason.trim()) {
      alert('Rejection reason is required.');
      return;
    }
    await onReject(rejectPass.id, rejectReason);
    setRejectPass(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900 uppercase">
              Super-Admin Tier
            </span>
            <span className="text-xs text-indigo-200">Hierarchical Control & Emergency Escalation</span>
          </div>
          <h2 className="text-xl font-bold">Warden Decision Overrides & Bulk Operations</h2>
          <p className="text-xs text-indigo-200/90 mt-1 max-w-xl">
            Authorize or overturn warden decisions, handle escalated student queues, reassign across blocks, or issue rapid emergency passes on student behalf.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenHelpdesk}
            className="px-4 py-2 text-xs font-bold bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" /> Help-Desk Issuance
          </button>
        </div>
      </div>

      {/* Queue Switcher and Bulk Actions Toolstrip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveQueue('PENDING')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeQueue === 'PENDING'
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending Queue ({pendingPasses.length})
          </button>

          <button
            onClick={() => setActiveQueue('EMERGENCY')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeQueue === 'EMERGENCY'
                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Emergency & Escalated
          </button>

          <button
            onClick={() => setActiveQueue('ALL_ACTIVE')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeQueue === 'ALL_ACTIVE'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" /> Warden Approved / Revoke
          </button>
        </div>

        {/* Bulk Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              {selectedIds.length} selected:
            </span>
            <button
              onClick={() => handleBulk('APPROVE')}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Bulk Approve
            </button>
            <button
              onClick={() => handleBulk('REJECT')}
              className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              Bulk Reject
            </button>
            <button
              onClick={() => handleBulk('CANCEL')}
              className="px-2.5 py-1 text-xs font-bold bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Bulk Revoke
            </button>
          </div>
        )}
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={displayPasses.length > 0 && selectedIds.length === displayPasses.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3 px-4">Pass / Resident</th>
                <th className="py-3 px-4">Pass Type</th>
                <th className="py-3 px-4">Hostel / Room</th>
                <th className="py-3 px-4">Current Reviewer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions & Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayPasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No requests pending in this queue.
                  </td>
                </tr>
              ) : (
                displayPasses.map((pass) => (
                  <tr key={pass.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(pass.id)}
                        onChange={() => toggleSelect(pass.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{pass.residentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {pass.rollNo} • {pass.passNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{pass.reason}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                        {pass.passType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{pass.roomNumber}</div>
                      <div className="text-[10px] text-slate-400">{pass.blockName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{pass.approvedByName || 'Hostel Warden Desk'}</div>
                      <div className="text-[10px] text-slate-400">Assigned approver</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          pass.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : pass.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : pass.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pass.status}
                      </span>
                      {pass.overriddenByAdmin && (
                        <div className="text-[9px] font-bold text-purple-700 mt-0.5">ADMIN OVERRIDDEN</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                        {pass.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => onApprove(pass.id)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectPass(pass);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setOverridePass(pass);
                            setOverrideStatus(pass.status === 'APPROVED' ? 'REJECTED' : 'APPROVED');
                            setOverrideReason('');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors flex items-center gap-1 border border-purple-200"
                          title="Override Warden Decision"
                        >
                          <ArrowRightLeft className="w-3 h-3" /> Override
                        </button>

                        <button
                          onClick={() => setReassignPass(pass)}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200"
                          title="Reassign to Another Warden"
                        >
                          Reassign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {overridePass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-purple-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-300" />
                <h3 className="font-bold text-sm">Super-Admin Decision Override</h3>
              </div>
              <button onClick={() => setOverridePass(null)} className="text-purple-300 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={submitOverride} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-purple-900">
                <div className="font-bold">{overridePass.residentName} ({overridePass.rollNo})</div>
                <div className="text-[11px] text-purple-700 mt-0.5">
                  Pass: {overridePass.passNumber} • Current Status: <strong>{overridePass.status}</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Override Status</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  <option value="APPROVED">FORCE APPROVE (Super-Admin Override)</option>
                  <option value="REJECTED">FORCE REJECT (Super-Admin Override)</option>
                  <option value="CANCELLED">REVOKE / CANCEL PASS</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Justification / Audit Note <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="State the administrative rationale (e.g. Parental verification confirmed via registrar office)..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverridePass(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-sm"
                >
                  Confirm Override & Record in Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignPass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-slate-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Reassign Pass to Another Warden</h3>
              <button onClick={() => setReassignPass(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={submitReassign} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Transfer review responsibility for <strong>{reassignPass.residentName}</strong> ({reassignPass.passNumber}):
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Target Warden</label>
                <select
                  value={targetWarden}
                  onChange={(e) => setTargetWarden(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Dr. S. K. Sharma (Chief Warden)">Dr. S. K. Sharma (Chief Warden)</option>
                  <option value="Prof. Ananya Roy (Warden Girls Hostel B)">Prof. Ananya Roy (Warden Girls Hostel B)</option>
                  <option value="Dr. Manoj Mishra (Warden Boys Hostel A)">Dr. Manoj Mishra (Warden Boys Hostel A)</option>
                  <option value="Dean of Student Affairs (DOSA)">Dean of Student Affairs (DOSA)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignPass(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                  Reassign Warden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectPass && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-5 py-4 bg-rose-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Reject Gate Pass Request</h3>
              <button onClick={() => setRejectPass(null)} className="text-rose-200 hover:text-white">✕</button>
            </div>
            <form onSubmit={submitReject} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Reject pass for <strong>{rejectPass.residentName}</strong> ({rejectPass.rollNo}). A reason is mandatory:
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Rejection Reason</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for declining pass (e.g. Incomplete parental note, academic schedule conflict)..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectPass(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
