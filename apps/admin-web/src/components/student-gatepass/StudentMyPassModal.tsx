'use client';

import React, { useEffect } from 'react';
import {
  X,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
  Building,
  User,
  Compass,
  WifiOff,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StudentMyPassModalProps {
  pass: any | null;
  studentProfile: any;
  onClose: () => void;
}

export default function StudentMyPassModal({
  pass,
  studentProfile,
  onClose,
}: StudentMyPassModalProps) {
  // Offline persistence: save active pass into localStorage so student can open it with zero internet
  useEffect(() => {
    if (pass) {
      localStorage.setItem('shms_cached_active_pass', JSON.stringify(pass));
    }
  }, [pass]);

  if (!pass) return null;

  const isOut = pass.status === 'ACTIVE' || pass.actualExitAt;
  const isReturned = pass.status === 'RETURNED' || pass.actualReturnAt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Digital Gate Pass Credential</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Turnstile Scannable QR Code */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-dashed border-blue-200 inline-block mx-auto shadow-inner">
          <QRCodeSVG
            value={pass.qrCodeToken || `QR-${pass.passNumber}`}
            size={190}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Pass Code & Token */}
        <div>
          <span className="font-mono text-base font-black text-slate-900 tracking-wider">
            {pass.passNumber}
          </span>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Token: {pass.qrCodeToken || 'TURNSTILE-GATE-TOKEN'}
          </p>
        </div>

        {/* Pass Details Card (Campus Helper Royal Blue & White) */}
        <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs text-left space-y-2 text-slate-700">
          <div className="flex justify-between">
            <span className="font-bold text-slate-500">Resident:</span>
            <span className="font-bold text-slate-900">{pass.residentName || studentProfile?.name || 'Student Resident'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-slate-500">Hostel &amp; Room:</span>
            <span className="font-semibold text-slate-800">{pass.roomNumber || 'A-204'} ({pass.blockName || 'Nilgiri'})</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-slate-500">Pass Type:</span>
            <span className="font-bold text-blue-800">{pass.passType}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-slate-500">Destination:</span>
            <span className="font-semibold text-slate-800">{pass.destination}</span>
          </div>

          <div className="pt-1.5 border-t border-blue-200/60 flex justify-between">
            <span className="font-bold text-slate-500">Expected Return:</span>
            <span className="font-bold text-blue-900 font-mono">
              {new Date(pass.validTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(pass.validTill).toLocaleDateString([], { month: 'short', day: 'numeric' })})
            </span>
          </div>

          {/* Gate Scan Events if logged */}
          {(pass.actualExitAt || pass.actualReturnAt) && (
            <div className="pt-1.5 border-t border-blue-200/60 text-[11px] space-y-1">
              {pass.actualExitAt && (
                <div className="flex justify-between text-slate-600">
                  <span>Gate Exit Time:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {new Date(pass.actualExitAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
              {pass.actualReturnAt && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Gate Return Time:</span>
                  <span className="font-mono">{new Date(pass.actualReturnAt).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Offline Vault Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <WifiOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Offline Ready: Automatically saved to phone vault</span>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
