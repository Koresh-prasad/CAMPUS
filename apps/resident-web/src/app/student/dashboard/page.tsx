'use client';

import { useEffect } from 'react';

export default function StudentDashboardRedirect() {
  useEffect(() => {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_WEB_URL || 'http://localhost:3000';
    window.location.href = `${adminUrl.replace(/\/$/, '')}/student/dashboard`;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <p className="text-sm font-semibold text-slate-600">Opening Student Academic Dashboard...</p>
    </div>
  );
}
