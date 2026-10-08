import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus Helper - Smart Hostel Management & Student App',
  description: 'Smart Hostel Management System & Student Resident Mobile Platform',
  manifest: '/manifest.json',
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
