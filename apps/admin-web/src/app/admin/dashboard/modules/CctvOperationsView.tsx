'use client';

import React, { useState } from 'react';
import {
  Camera,
  Video,
  Shield,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  Clock,
  MapPin,
  Building,
  Info,
} from 'lucide-react';

export interface CampusCamera {
  id: string;
  name: string;
  location: string;
  zone: 'Main Gate' | 'Hostel Perimeter' | 'Academic Block' | 'Parking' | 'Library' | 'Dining Hall';
  status: 'ONLINE' | 'OFFLINE';
  ipAddress: string;
  rtspStreamUrl: string;
  resolution: string;
  fps: number;
  lastActiveTime: string;
  motionDetected: boolean;
}

export const INITIAL_CAMERAS: CampusCamera[] = [
  {
    id: 'CAM-01',
    name: 'Main Gate — Entry Barrier & Turnstile A',
    location: 'Campus Main Entrance Gate #1',
    zone: 'Main Gate',
    status: 'ONLINE',
    ipAddress: '192.168.10.101',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/gate1_entry.h264',
    resolution: '4K UltraHD (3840x2160)',
    fps: 30,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: true,
  },
  {
    id: 'CAM-02',
    name: 'Main Gate — Vehicle Exit RFID Lane',
    location: 'Campus Main Entrance Gate #1 Exit',
    zone: 'Main Gate',
    status: 'ONLINE',
    ipAddress: '192.168.10.102',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/gate1_exit.h264',
    resolution: '1080p Full HD (1920x1080)',
    fps: 30,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: false,
  },
  {
    id: 'CAM-03',
    name: 'Nilgiri Boys Hostel Outer Perimeter Yard',
    location: 'Hostel Block A Outer Lawn (Public Walkway)',
    zone: 'Hostel Perimeter',
    status: 'ONLINE',
    ipAddress: '192.168.10.105',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/hostel_a_lawn.h264',
    resolution: '1080p Full HD (1920x1080)',
    fps: 25,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: false,
  },
  {
    id: 'CAM-04',
    name: 'Shivalik Girls Hostel Outer Security Gate',
    location: 'Hostel Block B Outer Guard Booth',
    zone: 'Hostel Perimeter',
    status: 'ONLINE',
    ipAddress: '192.168.10.106',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/hostel_b_outer.h264',
    resolution: '4K UltraHD (3840x2160)',
    fps: 30,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: true,
  },
  {
    id: 'CAM-05',
    name: 'Academic Block 1 — Central Ground Foyer',
    location: 'Academic Complex Atrium (Public Corridor)',
    zone: 'Academic Block',
    status: 'ONLINE',
    ipAddress: '192.168.10.110',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/acad1_atrium.h264',
    resolution: '1080p Full HD (1920x1080)',
    fps: 30,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: true,
  },
  {
    id: 'CAM-06',
    name: 'Central Library Foyer & Turnstile Access',
    location: 'Knowledge Center Entrance',
    zone: 'Library',
    status: 'ONLINE',
    ipAddress: '192.168.10.115',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/lib_foyer.h264',
    resolution: '1080p Full HD (1920x1080)',
    fps: 25,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: false,
  },
  {
    id: 'CAM-07',
    name: 'Central Dining Hall & Food Court Exterior',
    location: 'Mess Complex Outer Promenade',
    zone: 'Dining Hall',
    status: 'ONLINE',
    ipAddress: '192.168.10.120',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/mess_outer.h264',
    resolution: '1080p Full HD (1920x1080)',
    fps: 25,
    lastActiveTime: 'Live (0s latency)',
    motionDetected: false,
  },
  {
    id: 'CAM-08',
    name: 'North Campus Staff & Student Parking Lot',
    location: 'Vehicle Parking Zone C',
    zone: 'Parking',
    status: 'OFFLINE',
    ipAddress: '192.168.10.130',
    rtspStreamUrl: 'rtsp://cctv.campus.internal:554/live/parking_c.h264',
    resolution: '1080p Full HD',
    fps: 0,
    lastActiveTime: 'Offline (Network link maintenance since 08:30 AM)',
    motionDetected: false,
  },
];

export function CctvOperationsView() {
  const [cameras, setCameras] = useState<CampusCamera[]>(INITIAL_CAMERAS);
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [selectedCamera, setSelectedCamera] = useState<CampusCamera>(INITIAL_CAMERAS[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAuthorizedSecurityAdmin, setIsAuthorizedSecurityAdmin] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  const filteredCameras = cameras.filter((cam) => {
    const matchZone = zoneFilter === 'ALL' || cam.zone === zoneFilter;
    const matchSearch =
      cam.name.toLowerCase().includes(search.toLowerCase()) ||
      cam.location.toLowerCase().includes(search.toLowerCase()) ||
      cam.id.toLowerCase().includes(search.toLowerCase());
    return matchZone && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
              Campus Security Surveillance
            </span>
            <span className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>7/8 Feeds Online</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">CCTV Operations & Gate Perimeter Surveillance</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Role-restricted operational video monitoring across authorized campus entryways and public corridors.
          </p>
        </div>

        {/* Security Role Verification Capsule */}
        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center space-x-3 self-start md:self-auto">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Security RBAC: Authorized</span>
              <Lock className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-400">Security / CCTV Operations Access Granted</p>
          </div>
          <button
            onClick={() => setIsAuthorizedSecurityAdmin(!isAuthorizedSecurityAdmin)}
            className="text-[10px] text-blue-400 hover:text-white underline font-bold cursor-pointer"
          >
            {isAuthorizedSecurityAdmin ? 'Simulate Restrict' : 'Authorize'}
          </button>
        </div>
      </div>

      {/* Strict Privacy Protection Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-amber-950">Student Privacy Standard & Statutory Compliance:</strong>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            Surveillance is strictly restricted to authorized public zones (Main Gates, Academic corridors, Open perimeter walkways). 
            Hostel living rooms, restrooms, and residential quarters are strictly prohibited from camera placement. 
            All stream links connect directly to on-premise NVR servers via encrypted internal RTSP/HLS streams.
          </p>
        </div>
      </div>

      {!isAuthorizedSecurityAdmin ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Surveillance Access Restricted</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You do not possess authorized CCTV surveillance clearance. This module is exclusively accessible to the Chief Security Officer and authorized gate superintendents.
          </p>
          <button
            onClick={() => setIsAuthorizedSecurityAdmin(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Grant Security Officer Permission
          </button>
        </div>
      ) : (
        /* Surveillance Workstation */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Monitor (2 cols) */}
          <div className={`lg:col-span-2 space-y-4 ${isFullScreen ? 'fixed inset-0 z-60 bg-slate-950 p-6 flex flex-col justify-between' : ''}`}>
            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col justify-between min-h-[420px]">
              {/* Stream Top Overlay */}
              <div className="p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white z-10">
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span className="px-2 py-0.5 rounded-md bg-red-600/30 border border-red-500/40 text-[10px] font-black uppercase tracking-wider text-red-300">
                    LIVE FEED
                  </span>
                  <span className="text-xs font-extrabold font-mono text-white tracking-wide">
                    {selectedCamera.id} • {selectedCamera.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    title={isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}
                  >
                    {isLiveStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                  >
                    {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Central Video View / Simulated Frame */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                {selectedCamera.status === 'OFFLINE' ? (
                  <div className="text-center p-6 space-y-2">
                    <XCircle className="w-12 h-12 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-black text-slate-400">CAMERA OFFLINE</h4>
                    <p className="text-xs text-slate-500 font-mono">Signal Loss on {selectedCamera.ipAddress}</p>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      Maintenance Ticket Dispatched
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Simulated High-Res CCTV Video Backdrop with Grid */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    <div className="text-center p-8 z-10 space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-sky-400">
                        <Video className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white">{selectedCamera.location}</h4>
                        <p className="text-xs text-slate-400 font-mono">{selectedCamera.rtspStreamUrl}</p>
                        <p className="text-[10px] text-emerald-400 font-bold">
                          Stream Active: {selectedCamera.resolution} @ {selectedCamera.fps} FPS
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 bg-black/60 px-3 py-1 rounded-full border border-white/10 font-mono">
                          NVR Integration Endpoint Ready • Hardware Accelerated
                        </span>
                      </div>
                    </div>

                    {/* Camera Pan Target Crosshairs */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                      <div className="w-48 h-48 border border-white/40 rounded-full" />
                      <div className="absolute w-60 h-[1px] bg-white/30" />
                      <div className="absolute h-60 w-[1px] bg-white/30" />
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Bottom Overlay */}
              <div className="p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-white z-10 text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
                  <span className="text-slate-500">IP: {selectedCamera.ipAddress}</span>
                  {selectedCamera.motionDetected && (
                    <span className="text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                      ⚡ Motion Active
                    </span>
                  )}
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  Campus Security Desk • REC Bhubaneswar
                </div>
              </div>
            </div>

            {/* Quick Stream Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-slate-800">Camera PTZ Controls:</span>
                <span className="text-slate-500">Fixed Focus 4K Lens • Wide Dynamic Range</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer">
                  Snapshot
                </button>
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer">
                  Review 24h Recording
                </button>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition cursor-pointer">
                  Export Log
                </button>
              </div>
            </div>
          </div>

          {/* Camera Directory Sidebar (1 col) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Surveillance Channels ({cameras.length})</h3>
              <p className="text-xs text-slate-500">Select any camera feed to switch live monitor.</p>
            </div>

            {/* Search & Zone Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter cameras by name/location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Campus Zones</option>
                <option value="Main Gate">Main Gate</option>
                <option value="Hostel Perimeter">Hostel Perimeter</option>
                <option value="Academic Block">Academic Block</option>
                <option value="Parking">Parking</option>
                <option value="Library">Library</option>
                <option value="Dining Hall">Dining Hall</option>
              </select>
            </div>

            {/* Cameras List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredCameras.map((cam) => {
                const isSelected = selectedCamera.id === cam.id;
                return (
                  <div
                    key={cam.id}
                    onClick={() => setSelectedCamera(cam)}
                    className={`p-3 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cam.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <strong className="text-xs font-extrabold text-slate-900">{cam.id}</strong>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
                        {cam.zone}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-bold mt-1 line-clamp-1">{cam.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{cam.location}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 mt-2 border-t border-slate-100">
                      <span className="font-mono">{cam.resolution.split(' ')[0]}</span>
                      <span className={cam.status === 'ONLINE' ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {cam.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CctvOperationsView;
