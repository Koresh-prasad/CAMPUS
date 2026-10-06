'use client';

import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function NotificationsView() {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Gate Pass Approval Requested',
      message: 'Rahul Kumar (2101289001, Block A) applied for Home Leave.',
      time: '15 mins ago',
      type: 'LEAVE',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'New Maintenance Grievance #GRV-129',
      message: 'Geyser heating issue reported in Room B-204 (Shivalik Girls).',
      time: '1 hour ago',
      type: 'GRIEVANCE',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Emergency Drill Completed',
      message: 'Quarterly hostel fire alarm and evacuation test recorded with zero anomalies.',
      time: '4 hours ago',
      type: 'SAFETY',
      unread: false,
    },
    {
      id: 'notif-4',
      title: 'Biometric Turnstiles Online',
      message: 'Main Gate and Girls Hostel turnstiles synced 1,842 student scans today.',
      time: '6 hours ago',
      type: 'SYSTEM',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Campus Helper Notifications</h3>
          <p className="text-xs text-slate-500">Live operational alerts, gate pass submissions, and system events.</p>
        </div>
        <button
          type="button"
          onClick={() => alert('All notifications marked as read.')}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-xl hover:bg-blue-100 transition cursor-pointer"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition flex items-start space-x-3.5 ${
              n.unread
                ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                : 'bg-white border-slate-200/80 shadow-2xs'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
