'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  HelpCircle,
  Phone,
  MessageSquare,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Building,
  User,
  ShieldAlert,
} from 'lucide-react';
import { StudentLang, passI18n } from './studentPassI18n';

interface StudentPassHistoryHelpTabProps {
  passes: any[];
  stats: any;
  studentProfile: any;
  lang: StudentLang;
}

export default function StudentPassHistoryHelpTab({
  passes,
  stats,
  studentProfile,
  lang,
}: StudentPassHistoryHelpTabProps) {
  const t = passI18n[lang] || passI18n.EN;

  const [problemTopic, setProblemTopic] = useState('QR_NOT_SCANNING');
  const [problemDescription, setProblemDescription] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handlePrintHistory = () => {
    window.print();
  };

  const handleReportProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemDescription.trim()) return;
    setReportSuccess(true);
    setProblemDescription('');
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const faqs = [
    {
      q: 'What is the hostel curfew time?',
      a: `Campus evening curfew is strictly at ${stats?.curfewTime || '21:30'} hours. All students out on day pass must scan their return QR at Gate 1 before this time.`,
    },
    {
      q: 'How many gate passes can I use per month?',
      a: `Each resident student is allocated up to ${stats?.monthlyLimit || 6} passes per calendar month. Academic and medical duty leaves do not consume this monthly quota.`,
    },
    {
      q: 'Does my QR pass work without an active internet connection?',
      a: 'Yes. Your active digital QR pass is permanently cached in your phone storage. You can present it at the optical turnstile scanner even with zero mobile data.',
    },
    {
      q: 'What happens if I return late?',
      a: 'A 3-level escalation ladder is triggered. Level 1 triggers an SMS reminder, Level 2 triggers an automated guardian call, and repeat late returners face warden review.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Export */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Pass Ledger &amp; Student Help Desk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full history of outing credentials, quota usage, and institutional regulations
          </p>
        </div>

        <button
          onClick={handlePrintHistory}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Download History as PDF / Print</span>
        </button>
      </div>

      {/* History Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="font-bold text-xs text-slate-800">Complete Pass Log ({passes.length} records)</span>
          <span className="text-xs font-mono text-slate-400">
            Used: {stats?.monthlyUsed ?? 0} / {stats?.monthlyLimit ?? 6}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Pass ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Valid Range</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {passes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No pass history found.
                  </td>
                </tr>
              ) : (
                passes.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.passNumber}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                        {p.passType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-800">{p.destination}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(p.validFrom).toLocaleDateString([], { month: 'short', day: 'numeric' })} →{' '}
                      {new Date(p.validTill).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'APPROVED' || p.status === 'RETURNED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : p.status === 'OVERDUE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help, Problem Reporting & FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report a Problem Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" /> Report a Pass Issue to Admin
          </h4>
          <p className="text-xs text-slate-500">
            Encountered turnstile barcode rejection or unfair pass decline? Submit an inquiry:
          </p>

          {reportSuccess ? (
            <div className="p-4 bg-emerald-50 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inquiry ticket dispatched to Chief Warden and Security Desk!</span>
            </div>
          ) : (
            <form onSubmit={handleReportProblem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                <select
                  value={problemTopic}
                  onChange={(e) => setProblemTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                >
                  <option value="QR_NOT_SCANNING">Optical Turnstile QR Not Scanning</option>
                  <option value="WRONG_REJECTION">Pass Wrongly Rejected by Warden</option>
                  <option value="CURFEW_INCORRECT">Incorrect Overdue / Curfew Strike</option>
                  <option value="EMERGENCY_ISSUE">Medical Emergency Pass Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe what occurred at the gate or pass desk..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" /> Pass Policies &amp; Curfew FAQs
          </h4>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-slate-900">{faq.q}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
