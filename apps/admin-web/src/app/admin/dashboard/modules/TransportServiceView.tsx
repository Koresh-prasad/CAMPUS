'use client';

import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  Phone,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Megaphone,
  UserCheck,
  Shield,
  Activity,
  ArrowRight,
  X,
  Send,
  Navigation,
  Wrench,
  Calendar
} from 'lucide-react';

export interface CampusBus {
  id: string;
  busNumber: string;
  registrationNumber: string;
  routeName: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  currentOccupancy: number;
  status: 'ON_ROUTE' | 'STANDBY' | 'MAINTENANCE' | 'OFF_DUTY';
  currentLocation: string;
  nextStop: string;
  departureTime: string;
  stops: { name: string; time: string }[];
}

export interface TransportAnnouncement {
  id: string;
  title: string;
  routeTarget: string;
  message: string;
  effectiveDate: string;
  type: 'SCHEDULE_CHANGE' | 'SPECIAL_SERVICE' | 'DELAY';
}

const INITIAL_BUSES: CampusBus[] = [
  {
    id: 'BUS-01',
    busNumber: 'Bus #01 (City Express)',
    registrationNumber: 'OD-02-AX-8912',
    routeName: 'Route 1: Master Canteen / Railway Station',
    driverName: 'Suresh Nayak',
    driverPhone: '+91 98765-11001',
    capacity: 52,
    currentOccupancy: 44,
    status: 'ON_ROUTE',
    currentLocation: 'Vani Vihar Square',
    nextStop: 'Acharya Vihar (07:45 AM)',
    departureTime: '07:15 AM & 05:30 PM',
    stops: [
      { name: 'Master Canteen Station', time: '07:15 AM' },
      { name: 'Ram Mandir Square', time: '07:30 AM' },
      { name: 'Vani Vihar Junction', time: '07:40 AM' },
      { name: 'Acharya Vihar', time: '07:45 AM' },
      { name: 'Campus Main Gate', time: '08:15 AM' }
    ]
  },
  {
    id: 'BUS-02',
    busNumber: 'Bus #02 (Khandagiri Metro)',
    registrationNumber: 'OD-02-BC-4419',
    routeName: 'Route 2: Khandagiri & Baramunda Bus Stand',
    driverName: 'Prakash Jena',
    driverPhone: '+91 98765-11002',
    capacity: 52,
    currentOccupancy: 38,
    status: 'ON_ROUTE',
    currentLocation: 'Fire Station Square',
    nextStop: 'Campus Gate 1 (08:20 AM)',
    departureTime: '07:30 AM & 05:45 PM',
    stops: [
      { name: 'Baramunda ISBT', time: '07:30 AM' },
      { name: 'Khandagiri Caves', time: '07:45 AM' },
      { name: 'Fire Station Square', time: '08:00 AM' },
      { name: 'Campus Gate 1', time: '08:20 AM' }
    ]
  },
  {
    id: 'BUS-03',
    busNumber: 'Bus #03 (Infocity Shuttle)',
    registrationNumber: 'OD-02-EZ-1033',
    routeName: 'Route 3: Patia / Infocity / KIIT Road',
    driverName: 'Bikash Mahapatra',
    driverPhone: '+91 98765-11003',
    capacity: 40,
    currentOccupancy: 12,
    status: 'STANDBY',
    currentLocation: 'Campus Transport Yard',
    nextStop: 'Starting from Campus (12:30 PM)',
    departureTime: 'Every 2 Hours (Day Shuttle)',
    stops: [
      { name: 'Campus Transport Hub', time: '12:30 PM' },
      { name: 'Big Bazaar Patia', time: '12:45 PM' },
      { name: 'Infocity Gate 1', time: '01:00 PM' },
      { name: 'Campus Transport Hub', time: '01:25 PM' }
    ]
  },
  {
    id: 'BUS-04',
    busNumber: 'Bus #04 (South Campus Van)',
    registrationNumber: 'OD-02-LM-9901',
    routeName: 'Route 4: Cuttack Link Road Express',
    driverName: 'Dhananjay Behera',
    driverPhone: '+91 98765-11004',
    capacity: 32,
    currentOccupancy: 0,
    status: 'MAINTENANCE',
    currentLocation: 'Campus Garage / Workshop',
    nextStop: 'Under Brake Inspection',
    departureTime: 'Resuming Tomorrow',
    stops: [
      { name: 'Badambadi Bus Stand', time: '06:45 AM' },
      { name: 'Link Road Square', time: '07:05 AM' },
      { name: 'Campus Main Gate', time: '08:00 AM' }
    ]
  }
];

const INITIAL_TRANSPORT_ANNOUNCEMENTS: TransportAnnouncement[] = [
  {
    id: 'TR-ANN-01',
    title: 'Late Evening Exam Shuttle Extended Till 09:30 PM',
    routeTarget: 'All Routes (Special Schedule)',
    message: 'To support midterm exam revisions, daily night shuttle from campus library to city will run an extra trip at 09:30 PM.',
    effectiveDate: 'Valid this entire week',
    type: 'SPECIAL_SERVICE'
  },
  {
    id: 'TR-ANN-02',
    title: 'Route 1 Diversion: Master Canteen via Janpath',
    routeTarget: 'Bus #01 (City Express)',
    message: 'Due to metro construction near Vani Vihar flyover, Bus 1 will take the Rasulgarh bypass road. Expect 10 min delay.',
    effectiveDate: 'Starting Today',
    type: 'DELAY'
  }
];

export function TransportServiceView() {
  const [buses, setBuses] = useState<CampusBus[]>(INITIAL_BUSES);
  const [announcements, setAnnouncements] = useState<TransportAnnouncement[]>(INITIAL_TRANSPORT_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'FLEET' | 'ROUTES' | 'ANNOUNCEMENTS'>('FLEET');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBus, setSelectedBus] = useState<CampusBus | null>(null);
  const [isNewAnnounceOpen, setIsNewAnnounceOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annRoute, setAnnRoute] = useState('All Routes');
  const [annMsg, setAnnMsg] = useState('');
  const [annType, setAnnType] = useState<any>('SPECIAL_SERVICE');

  // Issue state
  const [issueBus, setIssueBus] = useState('Bus #01 (City Express)');
  const [issueDesc, setIssueDesc] = useState('');

  const filteredBuses = buses.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMsg) return;
    const newAnn: TransportAnnouncement = {
      id: `TR-ANN-${Math.floor(10 + Math.random() * 90)}`,
      title: annTitle,
      routeTarget: annRoute,
      message: annMsg,
      effectiveDate: 'Active Immediately',
      type: annType
    };
    setAnnouncements([newAnn, ...announcements]);
    setIsNewAnnounceOpen(false);
    setAnnTitle('');
    setAnnMsg('');
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDesc) return;
    setBuses((prev) =>
      prev.map((b) => {
        if (b.busNumber !== issueBus) return b;
        return {
          ...b,
          status: 'MAINTENANCE',
          nextStop: 'Workshop Inspection Reported'
        };
      })
    );
    setIsReportIssueOpen(false);
    setIssueDesc('');
  };

  const totalFleet = buses.length;
  const onRouteCount = buses.filter((b) => b.status === 'ON_ROUTE').length;
  const standbyCount = buses.filter((b) => b.status === 'STANDBY').length;
  const maintenanceCount = buses.filter((b) => b.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900/40 via-slate-900 to-slate-900 border border-cyan-500/20 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Car className="w-4 h-4" />
            <span>Campus Mobility & Shuttle Logistics</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Transport & Bus Services</h2>
          <p className="text-slate-400 text-sm mt-1">
            Bus fleet tracking, route schedules, pickup stops, passenger occupancy, and travel advisories.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsReportIssueOpen(true)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2.5 rounded-xl transition text-xs"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Report Fleet Issue</span>
          </button>
          <button
            onClick={() => setIsNewAnnounceOpen(true)}
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-600/30 text-xs"
          >
            <Megaphone className="w-4 h-4" />
            <span>Post Travel Advisory</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium">Total Fleet</p>
            <p className="text-2xl font-black text-white mt-1">{totalFleet} Vehicles</p>
            <span className="text-[11px] text-slate-400">Campus buses & vans</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
            <Car className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-emerald-400 text-xs font-medium">Active On Route</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{onRouteCount}</p>
            <span className="text-[11px] text-emerald-500/70">GPS live tracking</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Navigation className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-cyan-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-cyan-400 text-xs font-medium">Standby Shuttles</p>
            <p className="text-2xl font-black text-cyan-400 mt-1">{standbyCount}</p>
            <span className="text-[11px] text-cyan-500/70">Ready at depot</span>
          </div>
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-medium">Under Maintenance</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{maintenanceCount}</p>
            <span className="text-[11px] text-amber-500/70">Workshop servicing</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Wrench className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('FLEET')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'FLEET'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Bus Fleet Status ({buses.length})
          </button>
          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ROUTES'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Route Maps & Pickup Points
          </button>
          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ANNOUNCEMENTS'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Travel Advisories ({announcements.length})
          </button>
        </div>

        {activeTab === 'FLEET' && (
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bus, route, driver..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Status</option>
              <option value="ON_ROUTE">On Route</option>
              <option value="STANDBY">Standby</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        )}
      </div>

      {/* Fleet Cards */}
      {activeTab === 'FLEET' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBuses.map((bus) => {
            const isOnRoute = bus.status === 'ON_ROUTE';
            const isMaintenance = bus.status === 'MAINTENANCE';

            return (
              <div
                key={bus.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                        {bus.registrationNumber}
                      </span>
                      <span className="text-xs text-slate-400">{bus.id}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isOnRoute
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center space-x-1'
                          : isMaintenance
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {isOnRoute && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />}
                      {bus.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{bus.busNumber}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>{bus.routeName}</span>
                  </p>

                  <div className="mt-3.5 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Current Location:</span>
                      <span className="font-semibold text-white">{bus.currentLocation}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Next Stop / ETA:</span>
                      <span className="font-medium text-emerald-400">{bus.nextStop}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Driver & Contact:</span>
                      <span className="text-slate-300">
                        {bus.driverName} ({bus.driverPhone})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400 text-[11px]">Occupancy:</span>
                      <span className="font-bold text-cyan-400">
                        {bus.currentOccupancy} / {bus.capacity} seats ({Math.round((bus.currentOccupancy / bus.capacity) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBus(bus)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                  >
                    <span>View All Stops & Timings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <span className="text-xs text-slate-400 font-medium">Timetable: {bus.departureTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Route Maps Tab */}
      {activeTab === 'ROUTES' && (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{bus.routeName}</h3>
                  <p className="text-xs text-slate-400">{bus.busNumber} • Operated by {bus.driverName}</p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                  {bus.departureTime}
                </span>
              </div>

              {/* Stop Timeline */}
              <div className="relative pl-6 space-y-3 pt-2">
                <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-slate-800" />
                {bus.stops.map((stp, idx) => (
                  <div key={idx} className="relative flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-900 z-10 -ml-[19px]" />
                      <span className="font-medium text-slate-200">{stp.name}</span>
                    </div>
                    <span className="font-mono text-slate-400">{stp.time}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                    {ann.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">• {ann.effectiveDate}</span>
                </div>
                <h3 className="text-base font-bold text-white">{ann.title}</h3>
                <p className="text-xs text-slate-300">{ann.message}</p>
                <p className="text-[11px] text-cyan-400 font-medium">Target: {ann.routeTarget}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold">
                  Broadcasted to Students
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Advisory Modal */}
      {isNewAnnounceOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Post Transport Advisory</h3>
              </div>
              <button
                onClick={() => setIsNewAnnounceOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Heading *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra Evening Bus for Weekend Departure"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Route</label>
                  <select
                    value={annRoute}
                    onChange={(e) => setAnnRoute(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All Routes">All Routes</option>
                    <option value="Route 1: Master Canteen">Route 1: Master Canteen</option>
                    <option value="Route 2: Khandagiri">Route 2: Khandagiri</option>
                    <option value="Route 3: Infocity Shuttle">Route 3: Infocity Shuttle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Advisory Type</label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SPECIAL_SERVICE">Special Service</option>
                    <option value="SCHEDULE_CHANGE">Schedule Change</option>
                    <option value="DELAY">Delay / Route Diversion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Advisory Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of timing adjustments or pickup point alterations..."
                  value={annMsg}
                  onChange={(e) => setAnnMsg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAnnounceOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Fleet Issue Modal */}
      {isReportIssueOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Report Bus / Fleet Issue</h3>
              </div>
              <button
                onClick={() => setIsReportIssueOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Bus *</label>
                <select
                  value={issueBus}
                  onChange={(e) => setIssueBus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.busNumber}>
                      {b.busNumber} ({b.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Engine heating, brake pad sound, AC cooling issue, puncture, etc."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportIssueOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30"
                >
                  Mark Under Maintenance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bus Stop Drawer */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedBus.busNumber}</h3>
                <p className="text-xs text-slate-400">{selectedBus.routeName}</p>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <p>Registration: <span className="font-mono text-cyan-400">{selectedBus.registrationNumber}</span></p>
                <p>Driver: <span className="font-bold text-white">{selectedBus.driverName}</span> ({selectedBus.driverPhone})</p>
                <p>Capacity: {selectedBus.capacity} passengers</p>
              </div>

              <div>
                <p className="font-semibold text-slate-300 mb-2">Detailed Route Stops & Timetable:</p>
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedBus.stops.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-300">
                      <span>{idx + 1}. {s.name}</span>
                      <span className="font-mono text-cyan-400">{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedBus(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
