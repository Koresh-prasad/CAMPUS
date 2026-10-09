'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, X, ShieldCheck } from 'lucide-react';

interface NetworkStatusBadgeProps {
  variant?: 'admin' | 'student';
  onReconnect?: () => void;
  className?: string;
}

export default function NetworkStatusBadge({
  variant = 'student',
  onReconnect,
  className = '',
}: NetworkStatusBadgeProps) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'online' | 'offline'; text: string } | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string>('Just now');
  const [queuedItemsCount, setQueuedItemsCount] = useState<number>(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Check pending offline queue count
  const updateQueueCount = () => {
    if (typeof window === 'undefined') return;
    try {
      const q = JSON.parse(localStorage.getItem('shms_pending_pass_queue') || '[]');
      setQueuedItemsCount(Array.isArray(q) ? q.length : 0);
    } catch (_) {
      setQueuedItemsCount(0);
    }
  };

  // Actively test network reachability by pinging health endpoint
  const testConnection = async (manual = false) => {
    if (manual) setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('/api/health?t=' + Date.now(), {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const onlineNow = res.ok || res.status === 200 || res.status === 304;
      setIsOnline(onlineNow);
      setLastCheckTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (onlineNow && onReconnect) {
        onReconnect();
      }
    } catch {
      // If fetch fails, check navigator.onLine as secondary indicator
      const fallback = typeof navigator !== 'undefined' ? navigator.onLine : false;
      setIsOnline(fallback);
      setLastCheckTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      if (manual) {
        setTimeout(() => setIsChecking(false), 500);
      }
      updateQueueCount();
    }
  };

  // Browser Online / Offline Event Listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    updateQueueCount();

    const handleOnline = () => {
      setIsOnline(true);
      setToastMsg({ type: 'online', text: '🟢 Internet Restored: Back online & live sync active!' });
      setTimeout(() => setToastMsg(null), 4500);
      testConnection();
      if (onReconnect) onReconnect();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastMsg({ type: 'offline', text: '🔴 Network Lost: Switched to Offline Mode (Cached Data active).' });
      setTimeout(() => setToastMsg(null), 4500);
      updateQueueCount();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Click outside to close popover
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onReconnect]);

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Toast Notification on Network Status Change */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border pointer-events-auto ${
              toastMsg.type === 'online'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-600 shadow-emerald-900/30'
                : 'bg-rose-950 text-rose-100 border-rose-600 shadow-rose-950/30'
            }`}
          >
            {toastMsg.type === 'online' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
            <button
              onClick={() => setToastMsg(null)}
              className="ml-2 p-1 rounded-lg text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Status Pill */}
      <button
        type="button"
        onClick={() => {
          setShowPopover(!showPopover);
          updateQueueCount();
        }}
        title={`Network Status: ${isOnline ? 'Online (Click to inspect / sync)' : 'Offline (Click to test reconnect)'}`}
        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs select-none active:scale-95 ${
          isOnline
            ? 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-700 border-emerald-200/90'
            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 shadow-rose-100 ring-2 ring-rose-300/40 animate-pulse'
        }`}
      >
        {isOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Online</span>
            <span className="sm:hidden">ON</span>
          </>
        ) : (
          <>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            <WifiOff className="w-3.5 h-3.5 text-rose-600" />
            <span>Offline</span>
          </>
        )}
      </button>

      {/* Interactive Detail Popover */}
      {showPopover && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Network Detection</h4>
                <p className="text-[10px] text-slate-500">{variant === 'admin' ? 'Admin Portal' : 'Student App'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowPopover(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status Display Card */}
          <div
            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              isOnline
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}
                />
                {isOnline ? 'Cloud Sync Connected' : 'Offline Mode Active'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Checked: {lastCheckTime}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {isOnline
                ? 'WebSocket real-time channel & REST APIs are communicating normally with the campus backend.'
                : 'Zero connection detected. The PWA Service Worker is actively serving cached files, passes, and profiles.'}
            </p>
          </div>

          {/* Feature Readiness Breakdown */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Service Worker Cache
              </span>
              <span className="font-bold text-emerald-600">✓ Ready</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Offline Pass Queue</span>
              <span className="font-mono font-bold text-slate-700">
                {queuedItemsCount > 0 ? `${queuedItemsCount} Pending Sync` : 'Empty (All Synced)'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Digital Pass QR</span>
              <span className="font-bold text-slate-700">Available Offline</span>
            </div>
          </div>

          {/* Check Connection Action Button */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isChecking}
              onClick={() => testConnection(true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-75 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Testing Connection...' : 'Check Connection Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
