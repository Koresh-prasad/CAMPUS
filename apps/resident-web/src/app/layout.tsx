import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHMS Resident App - Apex Hostels',
  description: 'Smart Hostel Management System - Resident Companion (Offline Ready)',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  themeColor: '#0f172a',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SmartHostel'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SmartHostel" />
      </head>
      <body className="bg-slate-900 text-slate-100 antialiased selection:bg-blue-500 selection:text-white pb-20 sm:pb-0">
        <div className="max-w-md mx-auto min-h-screen bg-slate-900 shadow-2xl relative flex flex-col border-x border-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
