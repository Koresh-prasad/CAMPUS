'use client';

import React from 'react';
import {
  MapPin,
  Wifi,
  Car,
  Dumbbell,
  Shirt,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export default function CampusServicesView() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Campus Facilities & Student Services</h3>
          <p className="text-xs text-slate-500">Live operational status of college amenities, shuttles, and utilities.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>All Services Normal</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Campus Shuttle Buses', icon: Car, desc: '6 buses operating between Campus and Master Canteen / Baramunda', status: 'Active (Next departure 11:00 AM)', color: 'bg-blue-50 text-blue-600' },
          { title: 'High-Speed Wi-Fi Zones', icon: Wifi, desc: 'Wi-Fi 6 coverage across academic blocks, libraries, and hostels (1 Gbps leased line)', status: 'Online (99.98% Uptime)', color: 'bg-indigo-50 text-indigo-600' },
          { title: 'Central Student Gymnasium', icon: Dumbbell, desc: 'Indoor fitness center with cardio and weight training equipment', status: 'Open (06:00 AM - 09:00 PM)', color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Automated Hostel Laundry', icon: Shirt, desc: '12 commercial washer & dryer units in Block A & B basements', status: 'Operational', color: 'bg-purple-50 text-purple-600' },
          { title: 'College Cafeteria & Canteen', icon: Coffee, desc: 'Hygienic snacks, fresh juices, and meals verified by FSSAI standards', status: 'Open (07:30 AM - 10:30 PM)', color: 'bg-amber-50 text-amber-600' },
          { title: 'Central Library & Reading Hall', icon: MapPin, desc: '50,000+ volumes, IEEE digital access, air-conditioned 24x7 reading lounge', status: 'Open 24 Hours', color: 'bg-rose-50 text-rose-600' },
        ].map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-slate-50 border border-slate-100">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">{svc.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{svc.desc}</p>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {svc.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
