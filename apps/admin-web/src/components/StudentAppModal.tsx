import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  QrCode,
  Globe,
  CheckCircle2,
  Shield,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Utensils,
  Wrench,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StudentAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentAppModal({ isOpen, onClose }: StudentAppModalProps) {
  const [activeTab, setActiveTab] = useState<'APK' | 'PWA' | 'QR' | 'WEB'>('APK');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const studentPortalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/student/dashboard` 
    : 'https://campus-six-gold.vercel.app/student/dashboard';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      alert('To install on Android:\n1. Open this website in Chrome on your Android phone.\n2. Tap the three dots (⋮) in the top-right.\n3. Tap "Install app" or "Add to Home screen".');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(studentPortalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300/30">
                  Android & Mobile App
                </span>
                <span className="text-[11px] font-semibold text-blue-200">v1.2.0 Stable</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Campus Helper — Student App
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-lg mt-1 font-medium">
            Official resident platform for hostel students. Choose to install the Android App on your mobile device or use the web platform.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Student Features Included:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Digital Student ID</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Gate Pass & Leave</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="truncate">Hostel Complaints</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Mess Menu & RSVP</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="truncate">24x7 Emergency SOS</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800">
              <Shield className="w-4 h-4 text-purple-600 shrink-0" />
              <span className="truncate">Warden Circulars</span>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('APK')}
              className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'APK'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Android</span> APK
            </button>
            <button
              onClick={() => setActiveTab('PWA')}
              className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'PWA'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant App</span>
            </button>
            <button
              onClick={() => setActiveTab('QR')}
              className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'QR'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
            <button
              onClick={() => setActiveTab('WEB')}
              className={`py-2 px-2 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'WEB'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Portal</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* 1. ANDROID APK TAB */}
          {activeTab === 'APK' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">CampusHelper-Student.apk</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Android 8.0+ • Size: ~18 MB • Includes offline ID card & instant push alerts
                  </p>
                </div>
                <a
                  href="/downloads/CampusHelper-Student.apk"
                  download="CampusHelper-Student.apk"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/25 transition cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK</span>
                </a>
              </div>

              {/* Install Instructions */}
              <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-white">
                <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>How to install on your Android device:</span>
                </h4>
                <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside pl-1">
                  <li>Click <strong>Download APK</strong> button above to download the file.</li>
                  <li>Open the downloaded file from your notifications or Downloads folder.</li>
                  <li>Tap <strong>Install</strong> (Allow <em>Install unknown apps</em> for Chrome if prompted).</li>
                  <li>Open the app and sign in with your registered student credentials.</li>
                </ol>
              </div>
            </div>
          )}

          {/* 2. INSTANT PWA APP TAB */}
          {activeTab === 'PWA' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Instant Android Web App (Zero APK Warning)</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Installs directly to your Android Home Screen like a native app. Doesn't take phone storage and updates automatically!
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleInstallPWA}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Install to Android Home Screen</span>
                  </button>
                  <a
                    href="/student/dashboard"
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                  >
                    <span>Launch Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700">Quick Manual Install on Android Chrome:</p>
                <p>1. Open this website in Google Chrome on your phone.</p>
                <p>2. Tap the top-right menu (⋮) and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
              </div>
            </div>
          )}

          {/* 3. SCAN QR TAB */}
          {activeTab === 'QR' && (
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0">
                <QRCodeSVG
                  value={studentPortalUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  Mobile QR Launcher
                </span>
                <h4 className="text-base font-extrabold text-slate-900">
                  Scan with your Android Camera
                </h4>
                <p className="text-xs text-slate-600">
                  Point your phone's camera at this QR code to instantly launch the Student App on your mobile browser.
                </p>
                <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleCopyLink}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    {copiedLink ? '✓ Link Copied!' : 'Copy Direct Link'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. WEB PORTAL TAB */}
          {activeTab === 'WEB' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Use in Web Browser (No Download Required)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Students can access their full portal directly on any web browser on laptop, tablet, or phone without installing any app.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href="/student/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  <span>Open Student Web Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-600">256-bit Secure • Campus Student Platform</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
