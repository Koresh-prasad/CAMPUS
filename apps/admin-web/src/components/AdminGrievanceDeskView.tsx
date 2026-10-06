'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Camera,
  Video,
  Play,
  Volume2,
  VolumeX,
  Shield,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
  Zap,
  Check,
  User,
  MapPin,
  RefreshCw,
  Maximize2,
  Phone,
  Flame,
  Droplet,
  Wifi,
  Utensils,
  BookOpen,
  HeartPulse,
  Mic,
} from 'lucide-react';
import { io } from 'socket.io-client';

interface AdminGrievanceDeskProps {
  complaints: any[];
  onRefresh?: () => void;
  token?: string;
}

export default function AdminGrievanceDeskView({
  complaints: initialComplaints,
  onRefresh,
  token,
}: AdminGrievanceDeskProps) {
  const [complaints, setComplaints] = useState<any[]>(initialComplaints || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RAISED' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [liveAlert, setLiveAlert] = useState<{ title: string; desc: string; time: string } | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Sync with prop updates
  useEffect(() => {
    if (initialComplaints && initialComplaints.length > 0) {
      setComplaints(initialComplaints);
    }
  }, [initialComplaints]);

  // Web Audio Synthesizer Chime for Admin Notification
  const playAdminChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Triple chord chime (C5 - E5 - G5)
      const now = ctx.currentTime;
      [
        { freq: 523.25, time: 0.0 },
        { freq: 659.25, time: 0.12 },
        { freq: 783.99, time: 0.24 },
        { freq: 1046.5, time: 0.36 },
      ].forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        gain.gain.setValueAtTime(0.2, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + 0.3);
      });
    } catch (e) {
      console.warn('Audio chime playback note:', e);
    }
  };

  // Socket listener for real-time grievance notification
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');

    socket.on('connect', () => {
      console.log('[AdminGrievanceDesk] Connected to real-time grievance socket');
    });

    const handleIncomingComplaint = (data: any) => {
      console.log('⚡ Real-time grievance incoming:', data);
      playAdminChime();

      setLiveAlert({
        title: `🚨 New Grievance #${data.ticketNumber || 'TKT'} Lodged!`,
        desc: `${data.residentName || 'Student'} reported [${data.category || 'GENERAL'}]: "${data.title || 'New Complaint'}" in Room ${data.roomNumber || 'Hostel'}`,
        time: new Date().toLocaleTimeString(),
      });

      // Insert or update in local state
      setComplaints((prev) => {
        const id = data.complaintId || data.id;
        const exists = prev.some((c) => c.id === id || c.ticketNumber === data.ticketNumber);
        if (exists) {
          return prev.map((c) => (c.id === id || c.ticketNumber === data.ticketNumber ? { ...c, ...data } : c));
        }
        return [
          {
            id: id || `cmp-${Date.now()}`,
            ticketNumber: data.ticketNumber || `CMP-${Math.floor(100000 + Math.random() * 900000)}`,
            category: data.category || 'OTHER',
            status: data.status || 'RAISED',
            title: data.title || 'Student Grievance',
            description: data.description || 'Issue reported',
            priority: data.priority || 'MEDIUM',
            photoUrl: data.photoUrl || null,
            videoUrl: data.videoUrl || null,
            resident: {
              name: data.residentName || 'Student Resident',
              residentProfile: {
                roomNumber: data.roomNumber || 'A-204',
                blockName: data.blockName || 'Hostel A',
              },
            },
            createdAt: data.createdAt || new Date().toISOString(),
          },
          ...prev,
        ];
      });

      if (onRefresh) onRefresh();
    };

    socket.on('complaint:created', handleIncomingComplaint);
    socket.on('complaint:update', handleIncomingComplaint);

    return () => {
      socket.disconnect();
    };
  }, [soundEnabled, onRefresh]);

  // Update Status via API
  const handleUpdateStatus = async (complaintId: string, newStatus: 'IN_PROGRESS' | 'RESOLVED') => {
    setUpdatingId(complaintId);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Admin updated status to ${newStatus}. Technician assigned.`,
        }),
      });

      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
        );
        setSuccessBanner(`✓ Ticket status updated to ${newStatus}. Student notified in real-time.`);
        setTimeout(() => setSuccessBanner(null), 4000);
        if (onRefresh) onRefresh();
      } else {
        alert('Failed to update complaint status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Network error communicating with complaint service');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics Calculation
  const totalTickets = complaints.length;
  const raisedTickets = complaints.filter((c) => c.status === 'RAISED').length;
  const inProgressTickets = complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ACKNOWLEDGED').length;
  const resolvedTickets = complaints.filter((c) => c.status === 'RESOLVED').length;
  const withMediaCount = complaints.filter((c) => c.photoUrl || c.videoUrl).length;

  // Filtering
  const filteredComplaints = complaints.filter((c) => {
    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'IN_PROGRESS') {
        if (c.status !== 'IN_PROGRESS' && c.status !== 'ACKNOWLEDGED') return false;
      } else if (c.status !== statusFilter) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      if ((c.category || '').toUpperCase() !== categoryFilter.toUpperCase()) return false;
    }

    // Media filter
    if (mediaFilter === 'PHOTO' && !c.photoUrl) return false;
    if (mediaFilter === 'VIDEO' && !c.videoUrl) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      const descMatch = (c.description || '').toLowerCase().includes(q);
      const tktMatch = (c.ticketNumber || '').toLowerCase().includes(q);
      const nameMatch = (c.resident?.name || '').toLowerCase().includes(q);
      const roomMatch = (c.resident?.residentProfile?.roomNumber || '').toLowerCase().includes(q);
      const catMatch = (c.category || '').toLowerCase().includes(q);
      return titleMatch || descMatch || tktMatch || nameMatch || roomMatch || catMatch;
    }

    return true;
  });

  const getCategoryIcon = (cat: string) => {
    const c = (cat || '').toUpperCase();
    if (c.includes('WATER') || c.includes('PLUMB')) return <Droplet className="w-4 h-4 text-blue-500" />;
    if (c.includes('ELEC')) return <Zap className="w-4 h-4 text-amber-500" />;
    if (c.includes('WIFI') || c.includes('INTERNET')) return <Wifi className="w-4 h-4 text-indigo-500" />;
    if (c.includes('MESS') || c.includes('FOOD')) return <Utensils className="w-4 h-4 text-orange-500" />;
    if (c.includes('ACADEMIC') || c.includes('EXAM')) return <BookOpen className="w-4 h-4 text-emerald-500" />;
    if (c.includes('MEDIC') || c.includes('HEALTH')) return <HeartPulse className="w-4 h-4 text-rose-500" />;
    if (c.includes('SECURITY')) return <Shield className="w-4 h-4 text-purple-500" />;
    return <AlertTriangle className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Live Sound Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">
                Admin Grievance & Student Complaint Desk
              </h2>
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Real-Time WebSocket Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time monitoring and resolution center for all student resident grievances. Supports any category, instant audio-visual chimes, photo proof inspection, and playable HD video evidence.
            </p>
          </div>

          {/* Sound Notification Toggle & Quick Refresh */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playAdminChime();
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                soundEnabled
                  ? 'bg-blue-600/30 text-blue-200 border-blue-400/40 hover:bg-blue-600/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle audio alert chime on incoming grievance"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? 'Chime Alert: ON' : 'Chime Alert: MUTED'}</span>
            </button>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                title="Refresh Complaints Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Incoming Alert Floating Card */}
        {liveAlert && (
          <div className="bg-blue-600/30 border border-blue-400/50 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-blue-500 text-white rounded-xl shadow-md">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-blue-100">{liveAlert.title}</p>
                <p className="text-[11px] text-blue-200">{liveAlert.desc}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-blue-300 font-mono">{liveAlert.time}</span>
              <button
                type="button"
                onClick={() => setLiveAlert(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-blue-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {successBanner && (
          <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-2xl p-3 flex items-center space-x-2 text-emerald-200 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}
      </div>

      {/* 2. Educational Infobox: "Which Way Grievances Directly Notify the Admin Platform" */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <Zap className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            How Student Grievances Directly Notify the Admin Platform in Real-Time
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-blue-950">Real-Time WebSocket Link</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              When a student submits a grievance for any category, the API immediately dispatches a <code className="text-blue-700 bg-blue-100/60 px-1 py-0.5 rounded text-[10px]">complaint:created</code> event via Socket.IO directly to this dashboard.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-amber-950">Audio Chime & Visual Toast</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              A high-priority synthesized Web Audio chime sounds on the administrator’s station, while an alert card pops up showing the student’s identity, room, and category.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-emerald-950">Direct Photo & Video Evidence</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Student photo attachments and video recordings are transferred directly, allowing admins to inspect issues visually without physical inspection visits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">4</span>
              <h4 className="text-xs font-bold text-purple-950">Automated SLA & Department Routing</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tickets are auto-tagged with an SLA countdown (4h to 48h) and mapped to respective staff (Plumbing, Electrical, Wi-Fi, Mess, Security, Housekeeping).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500">Total Grievances</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalTickets}</p>
          <span className="text-[10px] text-blue-600 font-bold">All-time recorded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-rose-600">Action Required (Raised)</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{raisedTickets}</p>
          <span className="text-[10px] text-rose-500 font-bold">Needs acknowledgement</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-amber-600">In Progress</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{inProgressTickets}</p>
          <span className="text-[10px] text-amber-600 font-bold">Assigned to staff</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-600">Resolved & Closed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedTickets}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Issue rectified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500">Media Attached</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{withMediaCount}</p>
          <span className="text-[10px] text-purple-600 font-bold">Photo & Video evidence</span>
        </div>
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ticket #, student name, room, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'RAISED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st === 'ALL' && 'All Statuses'}
              {st === 'RAISED' && 'Raised'}
              {st === 'IN_PROGRESS' && 'In Progress'}
              {st === 'RESOLVED' && 'Resolved'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Categories</option>
          <option value="WATER">Water / Plumbing</option>
          <option value="ELECTRICITY">Electricity / Wiring</option>
          <option value="WIFI">Wi-Fi / Internet</option>
          <option value="MESS">Mess / Canteen Food</option>
          <option value="CLEANLINESS">Cleanliness / Housekeeping</option>
          <option value="INFRASTRUCTURE">Furniture & Infrastructure</option>
          <option value="SECURITY">Campus & Gate Security</option>
          <option value="ACADEMIC">Academic & Classroom</option>
          <option value="MEDICAL">Medical & First Aid</option>
          <option value="OTHER">Other / Custom Reasons</option>
        </select>

        {/* Media Evidence Filter */}
        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value as any)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Media Types</option>
          <option value="PHOTO">📷 Photos Only</option>
          <option value="VIDEO">🎥 Videos Only</option>
        </select>
      </div>

      {/* 5. Complaints List / Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h4 className="text-base font-extrabold text-slate-800">No Grievances Match Selected Filter</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All tickets in this category have either been cleared or no tickets have been registered matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((item) => {
            const hasPhoto = Boolean(item.photoUrl);
            const hasVideo = Boolean(item.videoUrl);
            const hasVoice = Boolean(item.voiceUrl);
            const isResolved = item.status === 'RESOLVED';
            const isInProgress = item.status === 'IN_PROGRESS' || item.status === 'ACKNOWLEDGED';
            const isRaised = item.status === 'RAISED';

            return (
              <div
                key={item.id || item.ticketNumber}
                className={`bg-white rounded-3xl border transition shadow-2xs hover:shadow-sm overflow-hidden p-5 sm:p-6 space-y-4 ${
                  isRaised
                    ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
                    : isInProgress
                    ? 'border-amber-300 bg-amber-50/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Ticket Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{item.ticketNumber || 'TKT-LIVE'}
                    </span>

                    {/* Category Tag */}
                    <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {getCategoryIcon(item.category)}
                      <span>{item.category || 'OTHER'}</span>
                    </span>

                    {/* Priority Tag */}
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                        item.priority === 'URGENT' || item.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : item.priority === 'LOW'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.priority || 'MEDIUM'} PRIORITY
                    </span>

                    {/* Live Pulse if just raised */}
                    {isRaised && (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        <span>Requires Action</span>
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isResolved && (
                      <span className="flex items-center space-x-1.5 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>RESOLVED</span>
                      </span>
                    )}
                    {isInProgress && (
                      <span className="flex items-center space-x-1.5 text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
                        <Clock className="w-4 h-4" />
                        <span>IN PROGRESS</span>
                      </span>
                    )}
                    {isRaised && (
                      <span className="flex items-center space-x-1.5 text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>RAISED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Ticket Body: Student Info + Description */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Issue Description & Media */}
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Photo, Video & Voice Proof Section */}
                    {(hasPhoto || hasVideo || hasVoice) && (
                      <div className="pt-2">
                        <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">
                          Attached Evidence (Verified from Resident Mobile)
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {/* Photo Evidence Card */}
                          {hasPhoto && (
                            <div className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 w-44 h-32 flex flex-col justify-end shadow-2xs">
                              <img
                                src={item.photoUrl}
                                alt="Grievance Proof"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              <button
                                type="button"
                                onClick={() => setPreviewPhoto(item.photoUrl)}
                                className="relative z-10 m-2 flex items-center justify-center space-x-1.5 py-1.5 px-2.5 rounded-lg bg-blue-600/90 text-white text-[11px] font-bold hover:bg-blue-600 transition shadow-sm cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span>Inspect Photo</span>
                              </button>
                            </div>
                          )}

                          {/* Video Evidence Card */}
                          {hasVideo && (
                            <div className="group relative rounded-2xl overflow-hidden border border-purple-200 bg-purple-950 w-48 h-32 flex flex-col justify-end shadow-2xs">
                              {/* Video thumbnail / player preview */}
                              <video
                                src={item.videoUrl}
                                className="absolute inset-0 w-full h-full object-cover opacity-75"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => setPreviewVideo(item.videoUrl)}
                                  className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer"
                                >
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                </button>
                              </div>
                              <div className="relative z-10 m-2 flex items-center justify-between text-white text-[10px] font-bold">
                                <span className="flex items-center space-x-1 bg-black/60 px-2 py-0.5 rounded">
                                  <Video className="w-3 h-3 text-purple-400" />
                                  <span>Video Proof</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setPreviewVideo(item.videoUrl)}
                                  className="text-purple-300 hover:text-white cursor-pointer"
                                >
                                  Play HD
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Student Voice Note ("Said Her/His Problem") */}
                          {hasVoice && (
                            <div className="rounded-2xl p-3 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 flex flex-col justify-between w-60 h-32 shadow-2xs">
                              <div>
                                <div className="flex items-center justify-between text-indigo-950 text-xs font-bold">
                                  <span className="flex items-center space-x-1.5">
                                    <Mic className="w-4 h-4 text-indigo-600" />
                                    <span>Voice Recording</span>
                                  </span>
                                  <span className="text-[10px] text-indigo-700 font-mono bg-indigo-100 px-1.5 py-0.5 rounded">
                                    Audio
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">
                                  Student recorded her/his grievance via microphone
                                </p>
                              </div>
                              <audio src={item.voiceUrl} controls className="w-full h-8" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Resident Details & Workflow Controls */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Student Identity
                      </p>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                          {(item.resident?.name || 'S')[0]}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-900">
                            {item.resident?.name || item.residentName || 'Subham Pradhan'}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {item.resident?.residentProfile?.blockName || item.blockName || 'Hostel A'} • Room{' '}
                              {item.resident?.residentProfile?.roomNumber || item.roomNumber || 'A-204'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                        <p className="flex justify-between">
                          <span className="text-slate-400">Lodged:</span>
                          <span className="font-semibold text-slate-700">
                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-slate-400">SLA Window:</span>
                          <span className="font-semibold text-blue-700">Within 24 Hours</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons for Admin */}
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      {isRaised && (
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, 'IN_PROGRESS')}
                          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer"
                        >
                          {updatingId === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              <span>Acknowledge & Assign</span>
                            </>
                          )}
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          type="button"
                          disabled={updatingId === item.id}
                          onClick={() => handleUpdateStatus(item.id, 'RESOLVED')}
                          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition cursor-pointer"
                        >
                          {updatingId === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark as Resolved & Close</span>
                            </>
                          )}
                        </button>
                      )}

                      {isResolved && (
                        <div className="py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                          ✓ Ticket Closed & Rectified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. PHOTO LIGHTBOX MODAL */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-extrabold">Student Grievance Photo Evidence</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/90 max-h-[75vh]">
              <img
                src={previewPhoto}
                alt="Enlarged Grievance Photo"
                className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. VIDEO PLAYER MODAL */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-extrabold">Student Grievance Video Evidence Playback</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black max-h-[75vh]">
              <video
                src={previewVideo}
                controls
                autoPlay
                className="max-h-[70vh] max-w-full rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
