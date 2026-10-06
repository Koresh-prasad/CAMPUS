'use client';

import { useEffect } from 'react';

export default function StudentDashboardRedirect() {
  useEffect(() => {
    window.location.href = 'http://localhost:3000/student/dashboard';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <p className="text-sm font-semibold text-slate-600">Opening Student Academic Dashboard...</p>
    </div>
  );
}
