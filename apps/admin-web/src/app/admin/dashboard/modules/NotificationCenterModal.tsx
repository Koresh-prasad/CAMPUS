'use client';

import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ExternalLink,
  Flame,
  Wrench,
  HeartPulse,
  DoorOpen,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export type NotificationCategory = 'RED_URGENT' | 'ORANGE_HIGH' | 'BLUE_NORMAL';

export interface AdminCampusNotification {
  id: string;
  eventType: string; // e.g., 'SOS Alarm', 'Medical Emergency', 'Electricity Breakdown', 'Plumbing Leak', 'Gate Pass Overdue', 'Wi-Fi Outage'
  category: NotificationCategory;
  studentName: string;
  studentId: string;
  location: string;
  hostelRoom: string;
  time: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  currentStatus: string; // 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'RESOLVED'
  requiredAction: string; // e.g., 'Dispatch Medical Team', 'Authorize Electrician', 'Confirm Gate Exit'
  read: boolean;
  targetTab?: string;
  relatedId?: string; // Links directly to SR-1042, GP-8812, etc.
  dateGroup?: 'TODAY' | 'YESTERDAY' | 'EARLIER';
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AdminCampusNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AdminCampusNotification) => void;
}

export function NotificationCenterModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
}: NotificationCenterModalProps) {
  if (!isOpen) return null;

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | NotificationCategory>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    const matchCat = categoryFilter === 'ALL' || n.category === categoryFilter;
    const matchPriority = priorityFilter === 'ALL' || n.priority === priorityFilter;
    const matchDate = dateFilter === 'ALL' || n.dateGroup === dateFilter;
    const matchUnread = !onlyUnread || !n.read;
    const matchSearch =
      n.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.hostelRoom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.requiredAction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchPriority && matchDate && matchUnread && matchSearch;
  });

  const getCategoryTheme = (cat: NotificationCategory) => {
    switch (cat) {
      case 'RED_URGENT':
        return {
          pill: 'bg-rose-500/10 text-rose-700 border-rose-300',
          dot: 'bg-rose-600',
          badgeText: 'RED / URGENT',
          icon: ShieldAlert,
          iconBg: 'bg-rose-600 text-white',
        };
      case 'ORANGE_HIGH':
        return {
          pill: 'bg-amber-500/10 text-amber-700 border-amber-300',
          dot: 'bg-amber-600',
          badgeText: 'ORANGE / HIGH',
          icon: AlertTriangle,
          iconBg: 'bg-amber-500 text-white',
        };
      case 'BLUE_NORMAL':
      default:
        return {
          pill: 'bg-blue-500/10 text-blue-700 border-blue-300',
          dot: 'bg-blue-600',
          badgeText: 'BLUE / NORMAL',
          icon: Info,
          iconBg: 'bg-blue-600 text-white',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-300 flex items-center justify-center relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">Central Operations Notification Center</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    {unreadCount} Unread Alerts
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Every event submitted from the Student Platform automatically routes here in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  categoryFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Categories ({notifications.length})
              </button>
              <button
                onClick={() => setCategoryFilter('RED_URGENT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  categoryFilter === 'RED_URGENT'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-ping mr-0.5" />
                <span>RED / URGENT (SOS & Emergency)</span>
              </button>
              <button
                onClick={() => setCategoryFilter('ORANGE_HIGH')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  categoryFilter === 'ORANGE_HIGH'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <span>ORANGE / HIGH (Electricity & Repairs)</span>
              </button>
              <button
                onClick={() => setCategoryFilter('BLUE_NORMAL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                  categoryFilter === 'BLUE_NORMAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                <span>BLUE / NORMAL (Cleaning & Wi-Fi)</span>
              </button>
            </div>

            <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Unread Only</span>
            </label>
          </div>

          {/* Search & Sub-filters */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student, room, event type or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Dates</option>
                <option value="TODAY">Today</option>
                <option value="YESTERDAY">Yesterday</option>
                <option value="EARLIER">Earlier This Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5] mb-2" />
              <p className="text-sm font-bold text-slate-700">No notifications match your current filter</p>
              <p className="text-xs text-slate-400 mt-0.5">Try resetting the search or category filters.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const theme = getCategoryTheme(notif.category);
              const Icon = theme.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onSelectNotification(notif);
                  }}
                  className={`p-4 rounded-2xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    !notif.read ? 'bg-blue-50/40 hover:bg-blue-50/80 border border-blue-200/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${theme.pill}`}>
                          {theme.badgeText}
                        </span>
                        <strong className="text-xs font-extrabold text-slate-900">{notif.eventType}</strong>
                        <span className="text-[10px] text-slate-400 font-mono font-medium">({notif.time})</span>
                        {!notif.read && (
                          <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[9px] font-bold">
                            NEW
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="font-bold text-slate-800 flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{notif.studentName} ({notif.studentId})</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1 text-slate-600">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{notif.location} • {notif.hostelRoom}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Required Action: <strong className="text-blue-900">{notif.requiredAction}</strong>
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                          Status: {notif.currentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notif.id);
                        onSelectNotification(notif);
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <span>Open Detail Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Notifications are never discarded and remain permanently logged in the audit ledger.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
