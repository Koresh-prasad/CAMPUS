'use client';

import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  QrCode,
  Search,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Check,
  User,
  Clock,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface GatePassGuardianVerificationTabProps {
  passes: any[];
  onVerifyGuardian: (id: string, type: string) => Promise<void>;
  onSelectPass: (pass: any) => void;
}

export default function GatePassGuardianVerificationTab({
  passes,
  onVerifyGuardian,
  onSelectPass,
}: GatePassGuardianVerificationTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [selectedPassForQR, setSelectedPassForQR] = useState<any | null>(null);

  const filteredPasses = passes.filter((p) => {
    if (filterType === 'VERIFIED' && !p.guardianStatus?.includes('CONFIRMED')) return false;
    if (filterType === 'UNVERIFIED' && p.guardianStatus?.includes('CONFIRMED')) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.residentName?.toLowerCase().includes(q) ||
      p.rollNo?.toLowerCase().includes(q) ||
      p.passNumber?.toLowerCase().includes(q) ||
      p.guardianPhone?.includes(q)
    );
  });

  const handleVerify = async (id: string, type: string) => {
    setVerifyingId(id);
    try {
      await onVerifyGuardian(id, type);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or guardian mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Verification States</option>
            <option value="VERIFIED">Verified / Confirmed Only</option>
            <option value="UNVERIFIED">Awaiting Guardian Consent</option>
          </select>
        </div>
      </div>

      {/* Grid of Guardian Verification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPasses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No Passes Found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredPasses.map((pass) => {
            const isConfirmed = pass.guardianStatus?.includes('CONFIRMED') || pass.status === 'APPROVED';
            return (
              <div
                key={pass.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all hover:shadow-md ${
                  isConfirmed ? 'border-emerald-200' : 'border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{pass.passNumber}</span>
                    <h4 className="font-bold text-sm text-slate-900">{pass.residentName}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {pass.rollNo} • Room {pass.roomNumber}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {isConfirmed ? 'CONSENT VERIFIED' : 'AWAITING CONSENT'}
                  </span>
                </div>

                {/* Guardian Info */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-indigo-600" /> Guardian Phone:
                    </span>
                    <a
                      href={`tel:${pass.guardianPhone || pass.parentPhone}`}
                      className="font-mono font-bold text-indigo-600 hover:underline"
                    >
                      {pass.guardianPhone || pass.parentPhone || '+91 94370 11223'}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Mode:
                    </span>
                    <span className="font-medium text-slate-800">
                      {pass.guardianStatus || 'SMS OTP Dispatched'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Reason: <strong>{pass.reason}</strong> • Destination: <strong>{pass.destination}</strong>
                  </div>
                </div>

                {/* Verification Actions */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={verifyingId === pass.id}
                      onClick={() => handleVerify(pass.id, 'OTP')}
                      className="flex-1 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 border border-emerald-200 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> OTP Verify
                    </button>
                    <button
                      disabled={verifyingId === pass.id}
                      onClick={() => handleVerify(pass.id, 'CALL_LOGGED')}
                      className="flex-1 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1 border border-blue-200 disabled:opacity-50"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Logged
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setSelectedPassForQR(pass)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" /> View QR Token
                    </button>
                    <button
                      onClick={() => onSelectPass(pass)}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Open Full Dossier →
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QR Code Modal */}
      {selectedPassForQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800">Campus Turnstile QR Token</h4>
              <button onClick={() => setSelectedPassForQR(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block mx-auto shadow-inner">
              <QRCodeSVG
                value={selectedPassForQR.qrCodeToken || `QR-${selectedPassForQR.passNumber}`}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <div>
              <div className="font-bold text-sm text-slate-900">{selectedPassForQR.residentName}</div>
              <div className="font-mono text-xs text-slate-500 mt-0.5">{selectedPassForQR.passNumber}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {selectedPassForQR.qrCodeToken || `QR-${selectedPassForQR.passNumber}`}
              </div>
            </div>

            <button
              onClick={() => setSelectedPassForQR(null)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
