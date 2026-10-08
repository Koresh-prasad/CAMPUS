'use client';

import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Radio,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Bell,
  Megaphone,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Server,
  Zap,
  X,
  Send
} from 'lucide-react';

export type WifiIssueStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type WifiPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface WifiTicket {
  id: string;
  title: string;
  building: string;
  affectedArea: string;
  reportedBy: string;
  studentRoll?: string;
  priority: WifiPriority;
  status: WifiIssueStatus;
  assignedEngineer?: string;
  accessPointId?: string;
  symptoms: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface NetworkAnnouncement {
  id: string;
  title: string;
  affectedBuildings: string[];
  windowTime: string;
  type: 'SCHEDULED_MAINTENANCE' | 'EMERGENCY_OUTAGE' | 'BANDWIDTH_UPGRADE';
  description: string;
  publishedAt: string;
  active: boolean;
}

const INITIAL_WIFI_TICKETS: WifiTicket[] = [
  {
    id: 'NET-401',
    title: 'Repeated DHCP Disconnects on 5GHz Band',
    building: 'Hostel Block B',
    affectedArea: 'Wing 2, Rooms 201-215',
    reportedBy: 'Kunal Sharma (Resident)',
    studentRoll: '2023CS104',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedEngineer: 'Priya Sharma (Sr. Network Admin)',
    accessPointId: 'AP-HB2-FL2-01',
    symptoms: 'Devices connect but fail to receive gateway IP address. High packet loss.',
    reportedAt: 'Today, 09:15 AM'
  },
  {
    id: 'NET-402',
    title: 'No Signal in Common Study Room',
    building: 'Hostel Block A',
    affectedArea: 'Ground Floor Reading Hall',
    reportedBy: 'Hostel Prefect Aman',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    assignedEngineer: 'Rahul Verma (Network Tech)',
    accessPointId: 'AP-HA-GF-03',
    symptoms: 'AP power LED blinking amber, PoE switch port negotiation failed.',
    reportedAt: 'Today, 10:40 AM'
  },
  {
    id: 'NET-403',
    title: 'Campus Gateway Latency Spike & Packet Drop',
    building: 'Entire Campus',
    affectedArea: 'All Hostels & Central Library',
    reportedBy: 'Automated NOC Monitor',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    assignedEngineer: 'NOC Tier 3 Team (BSNL Fiber)',
    accessPointId: 'CORE-SW-01',
    symptoms: 'Upstream primary fiber uplink jitter > 120ms. Failover secondary active.',
    reportedAt: 'Today, 11:00 AM'
  },
  {
    id: 'NET-404',
    title: 'Slow Speed during Evening Peak Hours',
    building: 'Hostel Block C',
    affectedArea: '4th Floor Corridors',
    reportedBy: 'Sneha Patel',
    studentRoll: '2023EC089',
    priority: 'LOW',
    status: 'RESOLVED',
    assignedEngineer: 'Rahul Verma (Network Tech)',
    accessPointId: 'AP-HC-FL4-02',
    symptoms: 'Re-allocated QoS bandwidth pool from 10 Mbps to 25 Mbps per device.',
    reportedAt: 'Yesterday, 07:30 PM',
    resolvedAt: 'Yesterday, 09:10 PM'
  }
];

const INITIAL_ANNOUNCEMENTS: NetworkAnnouncement[] = [
  {
    id: 'ANN-NET-01',
    title: 'Core Switch Firmware Upgrade & Redundancy Test',
    affectedBuildings: ['Hostel Block A', 'Hostel Block B', 'Hostel Block C'],
    windowTime: 'Tonight 01:00 AM - 03:00 AM',
    type: 'SCHEDULED_MAINTENANCE',
    description:
      'Scheduled maintenance on campus core aggregation switches. Expect intermittent Wi-Fi drops for 15-minute intervals. Backup 4G cellular routers remain active.',
    publishedAt: 'Today, 10:00 AM',
    active: true
  },
  {
    id: 'ANN-NET-02',
    title: 'Fiber Cable Splicing at East Campus Gate',
    affectedBuildings: ['Hostel Block C', 'Mess Hall'],
    windowTime: 'Tomorrow 06:00 AM - 07:30 AM',
    type: 'SCHEDULED_MAINTENANCE',
    description: 'Road widening work requires relocation of secondary optical fiber line.',
    publishedAt: 'Yesterday',
    active: true
  }
];

export function WifiSupportView() {
  const [tickets, setTickets] = useState<WifiTicket[]>(INITIAL_WIFI_TICKETS);
  const [announcements, setAnnouncements] = useState<NetworkAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'ANNOUNCEMENTS' | 'AP_STATUS'>('TICKETS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isNewAnnounceModalOpen, setIsNewAnnounceModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<WifiTicket | null>(null);

  // New ticket state
  const [newTitle, setNewTitle] = useState('');
  const [newBuilding, setNewBuilding] = useState('Hostel Block A');
  const [newArea, setNewArea] = useState('');
  const [newPriority, setNewPriority] = useState<WifiPriority>('MEDIUM');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newEngineer, setNewEngineer] = useState('Rahul Verma (Network Tech)');

  // New announcement state
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceWindow, setAnnounceWindow] = useState('');
  const [announceType, setAnnounceType] = useState<any>('SCHEDULED_MAINTENANCE');
  const [announceDesc, setAnnounceDesc] = useState('');
  const [announceTarget, setAnnounceTarget] = useState('All Hostels');

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.affectedArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArea) return;
    const newTk: WifiTicket = {
      id: `NET-${Math.floor(400 + Math.random() * 500)}`,
      title: newTitle,
      building: newBuilding,
      affectedArea: newArea,
      reportedBy: 'Admin Ops Desk',
      priority: newPriority,
      status: 'ASSIGNED',
      assignedEngineer: newEngineer,
      accessPointId: `AP-${newBuilding.replace(/\s+/g, '').slice(0, 4)}-01`,
      symptoms: newSymptoms || 'Reported connection or speed degradation.',
      reportedAt: 'Just now'
    };
    setTickets([newTk, ...tickets]);
    setIsNewTicketModalOpen(false);
    setNewTitle('');
    setNewArea('');
    setNewSymptoms('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle || !announceWindow) return;
    const newAnn: NetworkAnnouncement = {
      id: `ANN-NET-${Math.floor(10 + Math.random() * 90)}`,
      title: announceTitle,
      affectedBuildings: [announceTarget],
      windowTime: announceWindow,
      type: announceType,
      description: announceDesc,
      publishedAt: 'Just now',
      active: true
    };
    setAnnouncements([newAnn, ...announcements]);
    setIsNewAnnounceModalOpen(false);
    setAnnounceTitle('');
    setAnnounceWindow('');
    setAnnounceDesc('');
  };

  const advanceTicketStatus = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        let next: WifiIssueStatus = t.status;
        if (t.status === 'NEW') next = 'ASSIGNED';
        else if (t.status === 'ASSIGNED') next = 'IN_PROGRESS';
        else if (t.status === 'IN_PROGRESS') {
          return { ...t, status: 'RESOLVED', resolvedAt: 'Just now' };
        }
        return { ...t, status: next };
      })
    );
  };

  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;
  const criticalCount = tickets.filter((t) => t.priority === 'CRITICAL' && t.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4" />
            <span>Campus Network & IT Infrastructure</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Wi-Fi & Internet Support</h2>
          <p className="text-slate-400 text-sm mt-1">
            Campus-wide wireless connectivity tracking, network outage announcements, and technician dispatch.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewAnnounceModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2.5 rounded-xl transition text-xs"
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Broadcast Outage</span>
          </button>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Wi-Fi Issue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium">Network Uptime</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">99.2%</p>
            <span className="text-[11px] text-emerald-500/70">148 / 152 APs Online</span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-blue-400 text-xs font-medium">Active Wi-Fi Issues</p>
            <p className="text-2xl font-black text-white mt-1">{openTicketsCount}</p>
            <span className="text-[11px] text-slate-400">Assigned to engineers</span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Wifi className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-rose-400 text-xs font-medium">Critical Outages</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{criticalCount}</p>
            <span className="text-[11px] text-rose-500/70">High priority dispatch</span>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <WifiOff className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-medium">Maintenance Windows</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{announcements.length}</p>
            <span className="text-[11px] text-amber-500/70">Advisories published</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('TICKETS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'TICKETS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Wi-Fi Issue Tickets ({openTicketsCount})
          </button>
          <button
            onClick={() => setActiveTab('ANNOUNCEMENTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ANNOUNCEMENTS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Outage Advisories ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('AP_STATUS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'AP_STATUS'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Access Point Health
          </button>
        </div>

        {activeTab === 'TICKETS' && (
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, building..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="NEW">New</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Wi-Fi Tickets */}
      {activeTab === 'TICKETS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((t) => {
            const isResolved = t.status === 'RESOLVED';
            const isCritical = t.priority === 'CRITICAL';
            const isHigh = t.priority === 'HIGH';

            return (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {t.id}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isResolved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{t.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-1">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>
                      {t.building} • {t.affectedArea}
                    </span>
                  </p>

                  <div className="mt-3 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Engineer:</span>
                      <span className="font-semibold text-white">{t.assignedEngineer || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Access Point:</span>
                      <span className="font-mono text-[11px] text-blue-400">{t.accessPointId || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400 text-[11px]">Reported:</span>
                      <span className="text-slate-400">{t.reportedAt}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] text-slate-400 bg-slate-800/30 p-2 rounded-lg line-clamp-2">
                    {t.symptoms}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition font-medium"
                  >
                    Diagnostics
                  </button>

                  {!isResolved ? (
                    <button
                      onClick={() => advanceTicketStatus(t.id)}
                      className="flex items-center space-x-1 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-md shadow-blue-600/20"
                    >
                      <span>
                        {t.status === 'NEW'
                          ? 'Assign Tech'
                          : t.status === 'ASSIGNED'
                          ? 'Investigate'
                          : 'Mark Resolved'}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Outage Announcements */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {ann.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">• Window: {ann.windowTime}</span>
                </div>
                <h3 className="text-base font-bold text-white">{ann.title}</h3>
                <p className="text-xs text-slate-300">{ann.description}</p>
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400">
                  <span>Affected Areas:</span>
                  {ann.affectedBuildings.map((b, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Broadcast Active</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Access Point Health */}
      {activeTab === 'AP_STATUS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Campus AP Inventory & Signal Diagnostics</h3>
            <span className="text-xs text-slate-400">Real-time SNMP Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Hostel Block A - Floor 1-4', count: 32, status: '100% Online', latency: '4ms', load: '64%' },
              { name: 'Hostel Block B - Floor 1-4', count: 32, status: '30/32 Online (2 DHCP Issues)', latency: '12ms', load: '82%' },
              { name: 'Hostel Block C - Floor 1-4', count: 28, status: '100% Online', latency: '5ms', load: '45%' },
              { name: 'Central Mess Hall & Dining', count: 8, status: '100% Online', latency: '6ms', load: '90%' },
              { name: 'Academic Blocks & Labs', count: 44, status: '100% Online', latency: '3ms', load: '38%' },
              { name: 'Sports Complex & Security Gate', count: 8, status: '100% Online', latency: '7ms', load: '20%' }
            ].map((node, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{node.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>APs: {node.count} Units</span>
                  <span className="text-blue-400">Latency: {node.latency}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Channel Load: {node.load}</span>
                  <span className="text-emerald-400 font-semibold">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Wi-Fi Issue Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Log Wi-Fi Issue Ticket</h3>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wi-Fi dropping constantly on 2nd floor"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Building</label>
                  <select
                    value={newBuilding}
                    onChange={(e) => setNewBuilding(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hostel Block A">Hostel Block A</option>
                    <option value="Hostel Block B">Hostel Block B</option>
                    <option value="Hostel Block C">Hostel Block C</option>
                    <option value="Central Mess">Central Mess</option>
                    <option value="Library">Library</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical (Outage)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Specific Room / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wing 3, Rooms 301 to 312"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assign Network Tech</label>
                <select
                  value={newEngineer}
                  onChange={(e) => setNewEngineer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Rahul Verma (Network Tech)">Rahul Verma (Network Tech)</option>
                  <option value="Priya Sharma (Sr. Network Admin)">Priya Sharma (Sr. Network Admin)</option>
                  <option value="NOC On-Call Team">NOC On-Call Team</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Symptoms / Diagnostics Note</label>
                <textarea
                  rows={2}
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  placeholder="Signal strength, captive portal errors, speed test results..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  Log & Dispatch Tech
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {isNewAnnounceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Broadcast Network Outage Advisory</h3>
              </div>
              <button
                onClick={() => setIsNewAnnounceModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Advisory Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISP Fiber Maintenance - Temporary Downtime"
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Affected Target</label>
                  <select
                    value={announceTarget}
                    onChange={(e) => setAnnounceTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All Hostels">All Hostels</option>
                    <option value="Hostel Block A">Hostel Block A Only</option>
                    <option value="Hostel Block B">Hostel Block B Only</option>
                    <option value="Hostel Block C">Hostel Block C Only</option>
                    <option value="Entire Campus">Entire Campus</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Maintenance Window *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tonight 11:00 PM - 01:00 AM"
                    value={announceWindow}
                    onChange={(e) => setAnnounceWindow(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Student Advisory</label>
                <textarea
                  rows={3}
                  required
                  value={announceDesc}
                  onChange={(e) => setAnnounceDesc(e.target.value)}
                  placeholder="Explain cause, expected duration, and recommended alternative actions."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAnnounceModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Advisory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Diagnostics Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Diagnostics: {selectedTicket.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl space-y-2 border border-slate-800">
                <p className="text-white font-bold text-sm">{selectedTicket.title}</p>
                <p className="text-slate-400">
                  {selectedTicket.building} • {selectedTicket.affectedArea}
                </p>
                <div className="flex justify-between text-slate-300">
                  <span>Assigned: {selectedTicket.assignedEngineer}</span>
                  <span className="font-mono text-blue-400">{selectedTicket.accessPointId}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <p className="font-semibold text-slate-300">Symptoms & Telemetry Log:</p>
                <p className="text-slate-400 italic">"{selectedTicket.symptoms}"</p>
                <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>Reported by: {selectedTicket.reportedBy}</span>
                  <span>{selectedTicket.reportedAt}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1 text-blue-300 text-[11px]">
                <p className="font-bold">Live Speed Test Diagnostic (Nearest Gateway):</p>
                <p>Ping: 4ms | Downlink: 92.4 Mbps | Uplink: 88.1 Mbps | Packet Loss: 0.0%</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
