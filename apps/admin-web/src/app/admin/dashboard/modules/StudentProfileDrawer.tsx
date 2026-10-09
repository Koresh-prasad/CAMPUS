'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  GraduationCap,
  Building,
  Phone,
  Mail,
  Calendar,
  FileText,
  Wrench,
  Heart,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  QrCode,
  Download,
  Lock,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export interface ComprehensiveStudentProfile {
  id: string;
  name: string;
  studentId: string;
  rollNumber: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  department: string;
  course: string;
  semester: string;
  cgpa: string;
  attendancePercentage: number;
  hostel: string;
  block: string;
  roomNumber: string;
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'PROBATION';
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  gatePassHistory: {
    passId: string;
    destination: string;
    departure: string;
    returned: string;
    status: string;
  }[];
  serviceRequests: {
    id: string;
    category: string;
    date: string;
    status: string;
  }[];
  medicalHistory: {
    id: string;
    type: string;
    date: string;
    status: string;
    authorizedOnly: boolean;
  }[];
  documents: {
    name: string;
    type: string;
    uploadDate: string;
  }[];
}

interface StudentProfileDrawerProps {
  student: ComprehensiveStudentProfile | null;
  onClose: () => void;
  isAuthorizedMedicalStaff?: boolean;
}

export function StudentProfileDrawer({
  student,
  onClose,
  isAuthorizedMedicalStaff = true,
}: StudentProfileDrawerProps) {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PASSES' | 'SERVICES' | 'MEDICAL' | 'DOCS'>('OVERVIEW');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md overflow-hidden">
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                student.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white truncate">{student.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30">
                  {student.accountStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {student.studentId} • Roll: {student.rollNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-1 overflow-x-auto shrink-0">
          {[
            { id: 'OVERVIEW', label: 'Student ID & Academics', icon: User },
            { id: 'PASSES', label: `Gate Passes (${student.gatePassHistory.length})`, icon: Shield },
            { id: 'SERVICES', label: `Service Req (${student.serviceRequests.length})`, icon: Wrench },
            { id: 'MEDICAL', label: `Medical (${student.medicalHistory.length})`, icon: Heart },
            { id: 'DOCS', label: `Documents (${student.documents.length})`, icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                  isCur
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Digital Student Identity Card */}
              <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white p-5 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden space-y-4">
                <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-sky-400" />
                    <div>
                      <h4 className="text-xs font-black tracking-wider uppercase text-sky-300">
                        RAAJDHANI ENGINEERING COLLEGE
                      </h4>
                      <p className="text-[10px] text-slate-300">Official Student Digital Pass</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-200">
                    VALID: 2023-2027
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-white text-slate-900 font-black text-xl flex items-center justify-center shrink-0 border-2 border-sky-400 shadow-md overflow-hidden">
                    {student.avatarUrl ? (
                      <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                    ) : (
                      student.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="text-base font-extrabold text-white truncate">{student.name}</h3>
                    <p className="text-xs text-sky-300 font-bold">{student.course} ({student.department})</p>
                    <p className="text-[11px] text-slate-300 font-mono">ID: {student.studentId} • Blood: {student.bloodGroup}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Hostel Residence</span>
                    <strong className="text-white">{student.hostel} • Room {student.roomNumber}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Overall Attendance</span>
                    <strong className="text-emerald-400 font-black">{student.attendancePercentage}% Present</strong>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Details */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Academic & Enrollment Profile
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Program & Branch</span>
                    <strong className="text-slate-800">{student.course} ({student.department})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Current Semester</span>
                    <strong className="text-slate-800">{student.semester}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cumulative GPA</span>
                    <strong className="text-slate-800">{student.cgpa} / 10.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Institutional Email</span>
                    <a href={`mailto:${student.email}`} className="text-blue-600 font-bold hover:underline">
                      {student.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Authorized Emergency Contact
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block">{student.emergencyContact.name}</strong>
                    <span className="text-slate-500 text-[11px]">{student.emergencyContact.relation}</span>
                  </div>
                  <a
                    href={`tel:${student.emergencyContact.phone}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{student.emergencyContact.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'PASSES' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Gate Pass History
              </h4>
              {student.gatePassHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No gate passes recorded.</p>
              ) : (
                student.gatePassHistory.map((gp, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700">{gp.passId}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        {gp.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{gp.destination}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Out: {gp.departure}</span>
                      <span>Return: {gp.returned}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'SERVICES' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Hostel Service Requests & Complaints
              </h4>
              {student.serviceRequests.map((sr, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-900 block">{sr.category}</strong>
                    <span className="text-[11px] text-slate-400">{sr.date} • Ticket #{sr.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    {sr.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'MEDICAL' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start space-x-2.5 text-xs text-blue-900">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Medical Confidentiality Guaranteed</strong>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Only authorized medical officers and campus doctors can view treatment diagnosis. Non-medical staff see only bed-rest leave endorsements.
                  </p>
                </div>
              </div>

              {student.medicalHistory.map((med, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{med.type}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                      {med.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Date: {med.date} • ID: {med.id}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'DOCS' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Verified Documents & Attachments
              </h4>
              {student.documents.map((doc, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <strong className="text-slate-900 block">{doc.name}</strong>
                      <span className="text-[11px] text-slate-400">Uploaded {doc.uploadDate}</span>
                    </div>
                  </div>
                  <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer">
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">Raajdhani Engineering College Student Registry</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
export default StudentProfileDrawer;
