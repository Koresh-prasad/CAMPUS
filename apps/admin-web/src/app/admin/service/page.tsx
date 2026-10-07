'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Wrench } from 'lucide-react';
import ServicesDashboardPage from '../../staff/services/dashboard/page';

export default function AdminServiceRoutePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-[#0B132B] text-white px-5 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 shrink-0 z-50 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-white">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white">Service Platform</span>
            <span className="text-slate-400 mx-2">•</span>
            <span className="text-amber-400 font-medium">Maintenance & Facilities Support (Admin Manager Mode)</span>
          </div>
        </div>
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Manager</span>
        </Link>
      </div>
      <div className="flex-1">
        <ServicesDashboardPage />
      </div>
    </div>
  );
}
