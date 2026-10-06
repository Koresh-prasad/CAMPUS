import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHMS Admin & Warden Console - Apex Hostels',
  description: 'Smart Hostel Management System - Enterprise Command Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased selection:bg-blue-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
