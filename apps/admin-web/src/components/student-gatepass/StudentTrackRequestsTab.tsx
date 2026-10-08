'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  QrCode,
  RotateCcw,
  Send,
  Building,
  Calendar,
  Compass,
  ArrowRight,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentTrackRequestsTabProps {
  passes: any[];
  lang: StudentLang;
  onOpenShowMyPass: (pass: any) => void;
  onCancelPass: (id: string, reason?: string) => Promise<void>;
  onEscalatePass: (id: string, note?: string) => Promise<void>;
  onReplyInfo: (id: string, reply: string) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
}

export default function StudentTrackRequestsTab({
  passes,
  lang,
  onOpenShowMyPass,
  onCancelPass,
  onEscalatePass,
  onReplyInfo,
  onRefresh,
  loading,
}: StudentTrackRequestsTabProps) {
  const t = passI18n[lang] || passI18n.EN;

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedPassId, setExpandedPassId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredPasses = passes.filter((p) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'OVERDUE') return p.status === 'OVERDUE' || p.isOverdue;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: string, isOverdue: boolean) => {
    if (isOverdue || status === 'OVERDUE') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-rose-600" /> Overdue
        </span>
      );
    }
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Submitted (Under Review)
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-600" /> Under Warden Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Approved
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span> Out on Pass
          </span>
        );
      case 'RETURNED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Returned to Hostel
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
            Cancelled
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const handleCancelClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Cancel this pass request?')) return;
    setActionLoadingId(id);
    try {
      await onCancelPass(id);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleEscalateClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoadingId(id);
    try {
      await onEscalatePass(id, 'Student requested priority escalation');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSendReply = async (id: string) => {
    const text = replyTextMap[id];
    if (!text || !text.trim()) {
      alert('Type a clarification message for the warden.');
      return;
    }
    setActionLoadingId(id);
    try {
      await onReplyInfo(id, text.trim());
      setReplyTextMap({ ...replyTextMap, [id]: '' });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Refresh */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'ACTIVE', 'RETURNED', 'OVERDUE', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Requests' : st}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 self-end sm:self-center"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredPasses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No requests found</p>
            <p className="text-xs text-slate-400 mt-0.5">No passes match the selected filter.</p>
          </div>
        ) : (
          filteredPasses.map((pass) => {
            const isExpanded = expandedPassId === pass.id;
            const history = Array.isArray(pass.history) ? pass.history : [];

            return (
              <div
                key={pass.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
              >
                <div
                  onClick={() => setExpandedPassId(isExpanded ? null : pass.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-400">{pass.passNumber}</span>
                      <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800">
                        {pass.passType}
                      </span>
                      {getStatusBadge(pass.status, pass.isOverdue)}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mt-1">{pass.destination}</h4>
                    <p className="text-xs text-slate-500">Reason: {pass.reason}</p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>Valid: {new Date(pass.validFrom).toLocaleDateString()} {new Date(pass.validFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>→</span>
                      <span>{new Date(pass.validTill).toLocaleDateString()} {new Date(pass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {(pass.status === 'APPROVED' || pass.status === 'ACTIVE') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenShowMyPass(pass);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Show QR</span>
                      </button>
                    )}

                    {pass.status === 'PENDING' && (
                      <>
                        <button
                          disabled={actionLoadingId === pass.id}
                          onClick={(e) => handleEscalateClick(pass.id, e)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition-colors"
                        >
                          Escalate
                        </button>
                        <button
                          disabled={actionLoadingId === pass.id}
                          onClick={(e) => handleCancelClick(pass.id, e)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Status Timeline */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                    {/* Rejection Remarks */}
                    {pass.status === 'REJECTED' && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Rejection Reason from Warden Desk:</span>
                        </div>
                        <p className="text-[11px] text-rose-800 pl-5">
                          {pass.rejectionReason || 'Declined due to college policy or lack of parent note.'}
                        </p>
                      </div>
                    )}

                    {/* Warden Remarks & Reply Box */}
                    {pass.wardenNotes && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 space-y-2">
                        <div className="font-bold flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-purple-600" />
                          <span>Warden Desk Note / Information Needed:</span>
                        </div>
                        <p className="text-[11px] text-purple-800 pl-5">{pass.wardenNotes}</p>

                        <div className="pt-2 flex items-center gap-2 pl-5">
                          <input
                            type="text"
                            placeholder="Type clarification reply for the warden..."
                            value={replyTextMap[pass.id] || ''}
                            onChange={(e) =>
                              setReplyTextMap({ ...replyTextMap, [pass.id]: e.target.value })
                            }
                            className="flex-1 px-3 py-1.5 rounded-xl border border-purple-200 bg-white text-xs"
                          />
                          <button
                            disabled={actionLoadingId === pass.id}
                            onClick={() => handleSendReply(pass.id)}
                            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center gap-1 shadow-xs"
                          >
                            <Send className="w-3 h-3" /> Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Timeline Tracker */}
                    <div className="space-y-2">
                      <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                        Pass Lifecycle &amp; Audit Trail
                      </span>

                      <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-3">
                        {history.length === 0 ? (
                          <div className="text-[11px] text-slate-400">
                            Request created: {new Date(pass.createdAt).toLocaleString()}
                          </div>
                        ) : (
                          history.map((h: any, idx: number) => (
                            <div key={idx} className="space-y-0.5">
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="font-bold text-slate-900">{h.what}</span>
                                <span className="text-slate-500 font-medium">by {h.who}</span>
                                <span className="text-slate-400 font-mono text-[10px]">
                                  ({new Date(h.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                </span>
                              </div>
                              {h.note && <p className="text-[11px] text-slate-500 italic">{h.note}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
