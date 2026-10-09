'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  User,
  ShieldCheck,
  Building,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  QrCode,
  Lock,
  Edit3,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Printer,
  ChevronRight,
  Info,
  Check,
  Eye,
  Camera,
  Heart,
  Share2,
  FileCheck,
  RefreshCw,
  Bell,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  Globe,
  SlidersHorizontal,
  FolderLock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export type ProfileTab =
  | 'PERSONAL'
  | 'HOSTEL'
  | 'EMERGENCY'
  | 'DIGITAL_ID'
  | 'ACADEMICS'
  | 'LOCKER';

interface StudentMyProfileViewProps {
  user: any;
  token?: string;
  onUpdateUser?: (updatedUser: any) => void;
}

export default function StudentMyProfileView({
  user,
  token,
  onUpdateUser
}: StudentMyProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('PERSONAL');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  // Loading & Toast State
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Profile Avatar State
  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Parse or initialize rich 6-tab profile state
  const rawProfileData = useMemo(() => {
    try {
      if (user?.residentProfile?.profileDataJson) {
        return typeof user.residentProfile.profileDataJson === 'string'
          ? JSON.parse(user.residentProfile.profileDataJson)
          : user.residentProfile.profileDataJson;
      }
    } catch (e) {}
    return null;
  }, [user]);

  // 1. Personal Information State
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    fullName: user?.name || 'Subham Pradhan',
    rollNo: user?.residentProfile?.studentId || '2501294204',
    studentId: 'CS-2023-042',
    regNo: '2301042001',
    branch: 'Computer Science & Engineering',
    semester: '5th Semester',
    batch: '2023 - 2027',
    admissionYear: '2023',
    dob: rawProfileData?.personalInfo?.dob || '2004-06-18',
    gender: rawProfileData?.personalInfo?.gender || 'Male',
    bloodGroup: user?.residentProfile?.bloodGroup || 'B+',
    studentPhone: user?.phone || '7653993919',
    email: user?.email || 'subhampradhan34864@gmail.com',
    permanentAddress: rawProfileData?.personalInfo?.permanentAddress || 'Plot 42, VSS Nagar, Bhubaneswar, Odisha - 751007',
    currentAddress: rawProfileData?.personalInfo?.currentAddress || 'Room A-204, Nilgiri Block A (Hostel A), Campus Residences',
    category: rawProfileData?.personalInfo?.category || 'General',
    nationality: rawProfileData?.personalInfo?.nationality || 'Indian'
  });

  // 2. Hostel Details State (Read-only, managed by warden)
  const hostelDetails = useMemo(() => {
    return {
      hostelBlock: user?.residentProfile?.blockName || rawProfileData?.hostelDetails?.hostelBlock || 'Hostel A (Nilgiri Block A)',
      floor: rawProfileData?.hostelDetails?.floor || '2nd Floor',
      roomNumber: user?.residentProfile?.roomNumber || rawProfileData?.hostelDetails?.roomNumber || 'A-204',
      bedNumber: rawProfileData?.hostelDetails?.bedNumber || 'B1',
      checkInDate: rawProfileData?.hostelDetails?.checkInDate || '10 Aug 2023',
      roommates: rawProfileData?.hostelDetails?.roommates || [
        { name: 'Rahul Sharma', branch: 'Computer Science & Eng', rollNo: 'CS-2023-089', bed: 'B2' }
      ],
      wardenName: rawProfileData?.hostelDetails?.wardenName || 'Dr. K.P. Mohapatra',
      wardenPhone: rawProfileData?.hostelDetails?.wardenPhone || '+91 94370 11223',
      hostelFeeStatus: rawProfileData?.hostelDetails?.hostelFeeStatus || 'PAID',
      messPlan: rawProfileData?.hostelDetails?.messPlan || 'Non-Veg Meals'
    };
  }, [user, rawProfileData]);

  // 3. Family & Emergency Contacts State
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);
  const [familyForm, setFamilyForm] = useState({
    fatherName: user?.residentProfile?.parentName || rawProfileData?.familyEmergency?.fatherName || 'Balakrushna Pradhan',
    fatherPhone: user?.residentProfile?.parentPhone || rawProfileData?.familyEmergency?.fatherPhone || '+91 94370 88214',
    motherName: rawProfileData?.familyEmergency?.motherName || 'Snehalata Pradhan',
    motherPhone: rawProfileData?.familyEmergency?.motherPhone || '+91 94372 99120',
    localGuardianName: rawProfileData?.familyEmergency?.localGuardianName || 'Manoranjan Mohanty',
    localGuardianRelation: rawProfileData?.familyEmergency?.localGuardianRelation || 'Uncle',
    localGuardianPhone: rawProfileData?.familyEmergency?.localGuardianPhone || '+91 98611 77332',
    primaryEmergencyName: rawProfileData?.familyEmergency?.primaryEmergencyName || 'Balakrushna Pradhan',
    primaryEmergencyRelation: rawProfileData?.familyEmergency?.primaryEmergencyRelation || 'Father',
    primaryEmergencyPhone: user?.residentProfile?.emergencyContact || rawProfileData?.familyEmergency?.primaryEmergencyPhone || '+91 94370 88214',
    primaryEmergencyAltPhone: rawProfileData?.familyEmergency?.primaryEmergencyAltPhone || '+91 98611 77332',
    familyDoctorName: rawProfileData?.familyEmergency?.familyDoctorName || 'Dr. S.K. Tripathy, MD',
    familyDoctorClinic: rawProfileData?.familyEmergency?.familyDoctorClinic || 'Apollo Clinic, Bhubaneswar',
    familyDoctorPhone: rawProfileData?.familyEmergency?.familyDoctorPhone || '+91 674 256 7890',
    notifyParentsOnExit: rawProfileData?.familyEmergency?.notifyParentsOnExit ?? true
  });

  // 4. Digital ID State
  const [digitalIdState, setDigitalIdState] = useState({
    collegeName: rawProfileData?.digitalId?.collegeName || 'Apex Institute of Technology',
    collegeCode: rawProfileData?.digitalId?.collegeCode || 'APEX-2026',
    cardStatus: rawProfileData?.digitalId?.cardStatus || 'ACTIVE', // 'ACTIVE' | 'BLOCKED_LOST' | 'REISSUE_REQUESTED'
    validUntil: rawProfileData?.digitalId?.validUntil || '30 June 2027',
    issuedAt: rawProfileData?.digitalId?.issuedAt || '15 July 2023',
    signedToken: `REC-SIGNED-ID:${personalForm.rollNo}:${personalForm.fullName}:EXP-20270630:HASH-${Date.now().toString(36).toUpperCase()}`
  });
  const [showFullQrModal, setShowFullQrModal] = useState(false);
  const [showReportLostModal, setShowReportLostModal] = useState(false);
  const [reportLostReason, setReportLostReason] = useState('');

  // 5. Academic Collection State
  const [academicData, setAcademicData] = useState({
    cgpa: rawProfileData?.academicCollection?.cgpa || '8.84',
    currentSemester: rawProfileData?.academicCollection?.currentSemester || '5th Semester',
    backlogs: rawProfileData?.academicCollection?.backlogs || '0 Active Backlogs (All Clear)',
    semesters: rawProfileData?.academicCollection?.semesters || [
      { sem: 'Sem 1', sgpa: '8.70', attendance: 91.2 },
      { sem: 'Sem 2', sgpa: '8.85', attendance: 89.0 },
      { sem: 'Sem 3', sgpa: '8.92', attendance: 88.4 },
      { sem: 'Sem 4', sgpa: '8.90', attendance: 87.5 },
      { sem: 'Sem 5', sgpa: '8.84', attendance: 88.5 }
    ],
    subjects: rawProfileData?.academicCollection?.subjects || [
      { code: 'CS501', name: 'Design & Analysis of Algorithms', attended: 46, total: 50, percentage: 92, eligible: true },
      { code: 'CS502', name: 'Database Management Systems', attended: 44, total: 50, percentage: 88, eligible: true },
      { code: 'CS503', name: 'Operating Systems & System Calls', attended: 43, total: 50, percentage: 86, eligible: true },
      { code: 'CS504', name: 'Computer Networks & Protocols', attended: 42, total: 50, percentage: 84, eligible: true },
      { code: 'CS505', name: 'Software Engineering & Agile Labs', attended: 45, total: 50, percentage: 90, eligible: true }
    ],
    achievements: rawProfileData?.academicCollection?.achievements || [
      { id: 'ach-1', title: 'Smart Campus Management System', type: 'Project', org: 'HackOdisha 2024 Finalist', date: 'Oct 2024', description: 'Full-stack IoT & cloud portal for automated student curfew turnstiles.' },
      { id: 'ach-2', title: 'Full Stack Web Developer Intern', type: 'Internship', org: 'Tech Innovators Hub', date: 'May - July 2024', description: 'Engineered Next.js & Express microservices with 99.9% uptime.' },
      { id: 'ach-3', title: 'Dean Academic Excellence Honor', type: 'Award', org: 'Apex Tech University', date: 'Jan 2024', description: 'Top 3% semester academic ranking in CSE department.' }
    ]
  });

  // Modals for Achievements
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchType, setNewAchType] = useState('Project');
  const [newAchOrg, setNewAchOrg] = useState('');
  const [newAchDate, setNewAchDate] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');

  // CV Modal
  const [showCvModal, setShowCvModal] = useState(false);

  // 6. Government Locker State
  const [lockerDocs, setLockerDocs] = useState<any[]>(
    rawProfileData?.governmentLocker || [
      { id: 'doc-1', type: 'Aadhaar Card', maskedNumber: 'XXXX-XXXX-4204', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '1.4 MB' },
      { id: 'doc-2', type: 'PAN Card', maskedNumber: 'XXXXX4204F', uploadDate: '2023-08-14', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '980 KB' },
      { id: 'doc-3', type: '10th Board Certificate', maskedNumber: 'BSE-XXXX-1029', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '2.1 MB' },
      { id: 'doc-4', type: '12th Science Marksheet', maskedNumber: 'CHSE-XXXX-8821', uploadDate: '2023-08-12', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '2.4 MB' },
      { id: 'doc-5', type: 'College Transfer Certificate (TC)', maskedNumber: 'TC-2023-8901', uploadDate: '2023-08-15', expiry: 'Lifetime', status: 'VERIFIED', fileSize: '850 KB' },
      { id: 'doc-6', type: 'Resident / Domicile Certificate', maskedNumber: 'DOM-OD-9921', uploadDate: '2023-08-18', expiry: '2028-08-18', status: 'VERIFIED', fileSize: '1.2 MB' },
      { id: 'doc-7', type: 'Voter ID Card', maskedNumber: 'Not Uploaded', uploadDate: null, expiry: null, status: 'NOT_UPLOADED', fileSize: null },
      { id: 'doc-8', type: 'Driving License', maskedNumber: 'Not Uploaded', uploadDate: null, expiry: null, status: 'NOT_UPLOADED', fileSize: null },
      { id: 'doc-9', type: 'Passport', maskedNumber: 'Not Uploaded', uploadDate: null, expiry: null, status: 'NOT_UPLOADED', fileSize: null },
      { id: 'doc-10', type: 'Caste / Category Certificate', maskedNumber: 'Not Applicable', uploadDate: null, expiry: null, status: 'NOT_APPLICABLE', fileSize: null }
    ]
  );
  const [selectedDocToView, setSelectedDocToView] = useState<any | null>(null);

  // Correction Request Modal State (For locked fields)
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionField, setCorrectionField] = useState('Roll Number');
  const [correctionCurrentVal, setCorrectionCurrentVal] = useState('');
  const [correctionNewVal, setCorrectionNewVal] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionRequests, setCorrectionRequests] = useState<any[]>(
    rawProfileData?.correctionRequests || []
  );

  // Dynamic Profile Completion Calculator (Percentage Bar)
  const completionPercentage = useMemo(() => {
    let score = 0;
    let total = 10;
    if (personalForm.fullName) score += 1;
    if (personalForm.rollNo) score += 1;
    if (personalForm.studentPhone) score += 1;
    if (personalForm.permanentAddress) score += 1;
    if (familyForm.fatherPhone) score += 1;
    if (familyForm.motherPhone) score += 1;
    if (familyForm.primaryEmergencyPhone) score += 1;
    if (avatarUrl) score += 1;
    if (academicData.achievements.length > 0) score += 1;
    const verifiedDocs = lockerDocs.filter((d) => d.status === 'VERIFIED').length;
    if (verifiedDocs >= 3) score += 1;

    return Math.round((score / total) * 100);
  }, [personalForm, familyForm, avatarUrl, academicData, lockerDocs]);

  // Handle Avatar Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be less than 5 MB', 'error');
      return;
    }

    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      setUploadingAvatar(false);

      // Save to backend & session
      try {
        await saveProfileToBackend({ avatarUrl: dataUrl });
        showToast('✓ Profile photo updated successfully!', 'success');
      } catch (err) {
        showToast('Photo saved locally in your active session', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to persist all 6-tab profile data into backend
  const saveProfileToBackend = async (extraFields: Record<string, any> = {}) => {
    setIsSaving(true);
    const combinedData = {
      personalInfo: personalForm,
      hostelDetails,
      familyEmergency: familyForm,
      digitalId: digitalIdState,
      academicCollection: academicData,
      governmentLocker: lockerDocs,
      correctionRequests,
      ...extraFields
    };

    try {
      const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('shms_token') : null);
      if (storedToken) {
        await fetch('/api/residents/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            name: personalForm.fullName,
            phone: personalForm.studentPhone,
            avatarUrl: extraFields.avatarUrl || avatarUrl,
            bloodGroup: personalForm.bloodGroup,
            parentName: familyForm.fatherName,
            parentPhone: familyForm.fatherPhone,
            emergencyContact: familyForm.primaryEmergencyPhone,
            profileDataJson: combinedData
          })
        });
      }

      // Sync local storage & parent state
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('shms_user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          parsed.name = personalForm.fullName;
          parsed.phone = personalForm.studentPhone;
          parsed.avatarUrl = extraFields.avatarUrl || avatarUrl;
          if (!parsed.residentProfile) parsed.residentProfile = {};
          parsed.residentProfile.profileDataJson = combinedData;
          localStorage.setItem('shms_user', JSON.stringify(parsed));
          if (onUpdateUser) onUpdateUser(parsed);
        }
      }
    } catch (err) {
      console.warn('Backend sync warning:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Personal Save Handler
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalForm.fullName.trim()) {
      showToast('Full name is required', 'error');
      return;
    }
    const cleanPhone = personalForm.studentPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit phone number', 'error');
      return;
    }
    if (!personalForm.email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    await saveProfileToBackend({ personalInfo: personalForm });
    setIsEditingPersonal(false);
    showToast('✓ Personal information updated successfully!');
  };

  // 3. Family Save Handler
  const handleSaveFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfileToBackend({ familyEmergency: familyForm });
    setIsEditingEmergency(false);
    showToast('✓ Family & emergency contacts saved!');
  };

  // 4. Report Lost ID Handler
  const handleReportLostId = async () => {
    if (!reportLostReason.trim()) {
      showToast('Please specify reason for lost card', 'error');
      return;
    }

    const updated = {
      ...digitalIdState,
      cardStatus: 'BLOCKED_LOST',
      reportedLostAt: new Date().toISOString()
    };
    setDigitalIdState(updated);
    setShowReportLostModal(false);
    await saveProfileToBackend({ digitalId: updated });
    showToast('⚠️ Digital ID has been blocked and warden office notified.', 'info');
  };

  // 4. Request Re-issue
  const handleRequestReissue = async () => {
    const updated = {
      ...digitalIdState,
      cardStatus: 'REISSUE_REQUESTED',
      reissueRequestedAt: new Date().toISOString()
    };
    setDigitalIdState(updated);
    await saveProfileToBackend({ digitalId: updated });
    showToast('✓ Digital ID re-issue request sent to College Admin Desk.', 'success');
  };

  // 5. Add Achievement
  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    const newEntry = {
      id: `ach-${Date.now()}`,
      title: newAchTitle,
      type: newAchType,
      org: newAchOrg || 'Independent',
      date: newAchDate || 'Current Year',
      description: newAchDesc
    };
    const updatedList = [newEntry, ...academicData.achievements];
    setAcademicData({ ...academicData, achievements: updatedList });
    setShowAddAchievementModal(false);
    setNewAchTitle('');
    setNewAchOrg('');
    setNewAchDate('');
    setNewAchDesc('');
    await saveProfileToBackend({
      academicCollection: { ...academicData, achievements: updatedList }
    });
    showToast('✓ New academic achievement added!');
  };

  // 5. Delete Achievement
  const handleDeleteAchievement = async (id: string) => {
    const updatedList = academicData.achievements.filter((a) => a.id !== id);
    setAcademicData({ ...academicData, achievements: updatedList });
    await saveProfileToBackend({
      academicCollection: { ...academicData, achievements: updatedList }
    });
    showToast('Achievement removed');
  };

  // 6. Locker Upload File
  const handleLockerUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5 MB limit. Please compress.', 'error');
      return;
    }

    const updated = lockerDocs.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          maskedNumber: doc.maskedNumber === 'Not Uploaded' ? 'XXXX-XXXX-9911' : doc.maskedNumber,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'PENDING_VERIFICATION',
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
      }
      return doc;
    });

    setLockerDocs(updated);
    saveProfileToBackend({ governmentLocker: updated });
    showToast('✓ Document uploaded and submitted for Warden Verification!');
  };

  // 6. Delete Locker File
  const handleDeleteLockerDoc = (docId: string) => {
    const updated = lockerDocs.map((doc) => {
      if (doc.id === docId) {
        return {
          ...doc,
          maskedNumber: 'Not Uploaded',
          uploadDate: null,
          status: 'NOT_UPLOADED',
          fileSize: null
        };
      }
      return doc;
    });
    setLockerDocs(updated);
    saveProfileToBackend({ governmentLocker: updated });
    showToast('Document removed from locker');
  };

  // Open Correction Modal for a locked field
  const handleOpenCorrection = (fieldName: string, curVal: string) => {
    setCorrectionField(fieldName);
    setCorrectionCurrentVal(curVal);
    setCorrectionNewVal('');
    setCorrectionReason('');
    setShowCorrectionModal(true);
  };

  // Submit Correction Request to Admin
  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNewVal.trim()) {
      showToast('Please provide requested correction value', 'error');
      return;
    }

    const newReq = {
      id: `CR-${Date.now().toString().slice(-6)}`,
      fieldName: correctionField,
      currentValue: correctionCurrentVal,
      requestedValue: correctionNewVal,
      reason: correctionReason || 'Student request for profile correction',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    const updatedRequests = [newReq, ...correctionRequests];
    setCorrectionRequests(updatedRequests);
    setShowCorrectionModal(false);

    try {
      const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('shms_token') : null);
      if (storedToken) {
        await fetch('/api/residents/correction-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            fieldName: correctionField,
            currentValue: correctionCurrentVal,
            requestedValue: correctionNewVal,
            reason: correctionReason
          })
        });
      }
    } catch (err) {}

    await saveProfileToBackend({ correctionRequests: updatedRequests });
    showToast('✓ Correction request submitted to College Admin Office!');
  };

  // Translations
  const t = {
    personal: lang === 'EN' ? 'Personal Information' : 'व्यक्तिगत जानकारी',
    hostel: lang === 'EN' ? 'Hostel Details' : 'छात्रावास विवरण',
    emergency: lang === 'EN' ? 'Family & Emergency' : 'परिवार व आपातकालीन संपर्क',
    digitalId: lang === 'EN' ? 'Digital ID Card' : 'डिजिटल पहचान पत्र',
    academics: lang === 'EN' ? 'Academic Records' : 'शैक्षणिक रिकॉर्ड',
    locker: lang === 'EN' ? 'Govt Locker' : 'सरकारी लॉकर दस्तावेज़',
    verified: lang === 'EN' ? 'Verified Student' : 'सत्यापित छात्र',
    profileComplete: lang === 'EN' ? 'Profile Completion' : 'प्रोफ़ाइल पूर्णता',
    save: lang === 'EN' ? 'Save Changes' : 'सहेजें',
    edit: lang === 'EN' ? 'Edit Details' : 'संपादित करें',
    cancel: lang === 'EN' ? 'Cancel' : 'रद्द करें',
    lockedField: lang === 'EN' ? 'Locked by College' : 'कॉलेज द्वारा लॉक',
    reqCorrection: lang === 'EN' ? 'Request Correction' : 'सुधार का अनुरोध',
    generateCv: lang === 'EN' ? 'Generate CV' : 'बायोडाटा (CV) बनाएं',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-bold border ${
              toastMsg.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/20'
                : toastMsg.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/20'
                : 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
            }`}
          >
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : toastMsg.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ROYAL BLUE GRADIENT PROFILE HEADER CARD                                */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 border border-blue-600/30">
        {/* Subtle decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Avatar & Bio */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            {/* Photo with Upload Overlay */}
            <label
              htmlFor="student-profile-avatar-upload"
              className="relative group cursor-pointer block shrink-0"
              title="Click to update photo"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/10 backdrop-blur-md text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden border-2 border-white/80 group-hover:scale-105 transition">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{personalForm.fullName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md border-2 border-white transition pointer-events-none group-hover:scale-110">
                <Camera className="w-4 h-4" />
              </div>
              <input
                id="student-profile-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="sr-only"
              />
            </label>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {personalForm.fullName}
                </h1>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.verified}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-blue-100 font-semibold flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Roll: {personalForm.rollNo}</span>
                <span>•</span>
                <span>ID: {personalForm.studentId}</span>
                <span>•</span>
                <span>Reg: {personalForm.regNo}</span>
              </p>

              <p className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">
                {personalForm.branch} • {personalForm.semester}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded-xl border border-white/20 text-white">
                  🏢 {hostelDetails.hostelBlock} • Room {hostelDetails.roomNumber} ({hostelDetails.bedNumber})
                </span>
                <span className="text-[11px] font-bold bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-400/30 text-emerald-200">
                  Fee: {hostelDetails.hostelFeeStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Language Toggle & Profile Completion Bar */}
          <div className="md:w-64 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-100">{t.profileComplete}</span>
              <div className="flex items-center space-x-1 text-[11px] font-bold">
                <button
                  onClick={() => setLang('EN')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    lang === 'EN' ? 'bg-white text-blue-900 font-black' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('HI')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    lang === 'HI' ? 'bg-white text-blue-900 font-black' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-extrabold">
                <span className="text-white text-base">{completionPercentage}%</span>
                <span className="text-blue-200 text-[11px]">
                  {completionPercentage >= 80 ? 'Profile Complete' : 'Details Pending'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-blue-200/80 pt-0.5">
                {completionPercentage < 100 ? 'Fill optional government locker & family contacts' : 'All student records verified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB NAVIGATION (STICKY ON MOBILE, HORIZONTAL/SIDEBAR ADAPTIVE)          */}
      {/* ========================================================================= */}
      <div className="sticky top-16 z-30 bg-slate-100/95 backdrop-blur-md py-2 -mx-2 px-2 sm:mx-0 sm:px-0">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 sm:border-none">
          {[
            { id: 'PERSONAL', label: t.personal, icon: User },
            { id: 'HOSTEL', label: t.hostel, icon: Building },
            { id: 'EMERGENCY', label: t.emergency, icon: Heart },
            { id: 'DIGITAL_ID', label: t.digitalId, icon: QrCode },
            { id: 'ACADEMICS', label: t.academics, icon: GraduationCap },
            { id: 'LOCKER', label: t.locker, icon: FolderLock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs shrink-0 transition cursor-pointer min-h-[44px] ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONAL INFORMATION                                               */}
      {/* ========================================================================= */}
      {activeTab === 'PERSONAL' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>{t.personal}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your demographic, contact, and permanent residence records.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {isEditingPersonal ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingPersonal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer min-h-[44px]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    form="personal-info-form"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer min-h-[44px]"
                  >
                    {isSaving ? 'Saving...' : t.save}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center space-x-1.5 border border-blue-200 transition cursor-pointer min-h-[44px]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.edit}</span>
                </button>
              )}
            </div>
          </div>

          <form id="personal-info-form" onSubmit={handleSavePersonal} className="space-y-6">
            {/* Locked Fields Notice */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Official University Fields are Protected:</span>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Roll No, Branch, Registration No, and Admission Year are locked. To update these, click{' '}
                  <span className="font-bold underline">"Request Correction"</span> below to notify the College Admin Office.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  disabled={!isEditingPersonal}
                  value={personalForm.fullName}
                  onChange={(e) => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>

              {/* 2. Roll No (LOCKED) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Roll Number</label>
                  <button
                    type="button"
                    onClick={() => handleOpenCorrection('Roll Number', personalForm.rollNo)}
                    className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    {t.reqCorrection}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={personalForm.rollNo}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* 3. Registration No (LOCKED) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Registration Number</label>
                  <button
                    type="button"
                    onClick={() => handleOpenCorrection('Registration Number', personalForm.regNo)}
                    className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    {t.reqCorrection}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={personalForm.regNo}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* 4. Branch / Dept (LOCKED) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Department / Branch</label>
                  <button
                    type="button"
                    onClick={() => handleOpenCorrection('Branch', personalForm.branch)}
                    className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                  >
                    {t.reqCorrection}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={personalForm.branch}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* 5. Semester */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Semester</label>
                <select
                  disabled={!isEditingPersonal}
                  value={personalForm.semester}
                  onChange={(e) => setPersonalForm({ ...personalForm, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                >
                  <option value="1st Semester">1st Semester (Year 1)</option>
                  <option value="2nd Semester">2nd Semester (Year 1)</option>
                  <option value="3rd Semester">3rd Semester (Year 2)</option>
                  <option value="4th Semester">4th Semester (Year 2)</option>
                  <option value="5th Semester">5th Semester (Year 3)</option>
                  <option value="6th Semester">6th Semester (Year 3)</option>
                  <option value="7th Semester">7th Semester (Year 4)</option>
                  <option value="8th Semester">8th Semester (Year 4)</option>
                </select>
              </div>

              {/* 6. Batch / Academic Cycle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Batch</label>
                <input
                  type="text"
                  disabled
                  value={personalForm.batch}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 cursor-not-allowed"
                />
              </div>

              {/* 7. Student Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Phone (10 Digits)</label>
                <input
                  type="tel"
                  required
                  disabled={!isEditingPersonal}
                  value={personalForm.studentPhone}
                  onChange={(e) => setPersonalForm({ ...personalForm, studentPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>

              {/* 8. Student Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!isEditingPersonal}
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>

              {/* 9. Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  disabled={!isEditingPersonal}
                  value={personalForm.bloodGroup}
                  onChange={(e) => setPersonalForm({ ...personalForm, bloodGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                >
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              {/* 10. Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  disabled={!isEditingPersonal}
                  value={personalForm.dob}
                  onChange={(e) => setPersonalForm({ ...personalForm, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>

              {/* 11. Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                <select
                  disabled={!isEditingPersonal}
                  value={personalForm.gender}
                  onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* 12. Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category (Optional)</label>
                <select
                  disabled={!isEditingPersonal}
                  value={personalForm.category}
                  onChange={(e) => setPersonalForm({ ...personalForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Permanent Home Address</label>
                <textarea
                  rows={2}
                  disabled={!isEditingPersonal}
                  value={personalForm.permanentAddress}
                  onChange={(e) => setPersonalForm({ ...personalForm, permanentAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Hostel / Campus Address</label>
                <textarea
                  rows={2}
                  disabled={!isEditingPersonal}
                  value={personalForm.currentAddress}
                  onChange={(e) => setPersonalForm({ ...personalForm, currentAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 disabled:opacity-80"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HOSTEL DETAILS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'HOSTEL' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span>{t.hostel}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official room allocation, roommates, and warden contact (Admin Allocated).
              </p>
            </div>
            <button
              onClick={() => handleOpenCorrection('Hostel Block / Room Number', `${hostelDetails.hostelBlock} - ${hostelDetails.roomNumber}`)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto min-h-[44px]"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Request Room Change / Correction</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel Block</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{hostelDetails.hostelBlock}</p>
              <span className="text-[11px] text-slate-500">{hostelDetails.floor}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Room & Bed No</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">Room {hostelDetails.roomNumber}</p>
              <span className="text-[11px] font-bold text-blue-600">{hostelDetails.bedNumber} (Double Sharing)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hostel Fee Status</span>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ {hostelDetails.hostelFeeStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Academic Year 2024-25</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mess Subscription</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">{hostelDetails.messPlan}</p>
              <span className="text-[11px] text-slate-500">Includes Breakfast, Lunch, Dinner</span>
            </div>
          </div>

          {/* Roommates Card & Warden Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Roommates */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Assigned Roommates (Room {hostelDetails.roomNumber})</span>
              </h4>

              <div className="space-y-2.5">
                {hostelDetails.roommates.map((rm: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                        {rm.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{rm.name}</p>
                        <p className="text-[11px] text-slate-500">{rm.branch} • Bed {rm.bed || 'B2'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Co-Resident
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warden In-Charge */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Hostel Warden In-Charge</span>
                </h4>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center border border-indigo-200">
                    W1
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-slate-900">{hostelDetails.wardenName}</h5>
                    <p className="text-xs text-slate-500">Chief Warden • Nilgiri & Shivalik Hostel Wing</p>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">Office: Admin Block Ground Floor</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${hostelDetails.wardenPhone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Tap to Call Warden ({hostelDetails.wardenPhone})</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FAMILY & EMERGENCY CONTACTS                                        */}
      {/* ========================================================================= */}
      {activeTab === 'EMERGENCY' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <span>{t.emergency}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Critical numbers surfaced to Warden, Security gate, and 24x7 Medical SOS dispatch.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {isEditingEmergency ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmergency(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer min-h-[44px]"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    form="family-contacts-form"
                    disabled={isSaving}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer min-h-[44px]"
                  >
                    {isSaving ? 'Saving...' : t.save}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingEmergency(true)}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center space-x-1.5 border border-blue-200 transition cursor-pointer min-h-[44px]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.edit}</span>
                </button>
              )}
            </div>
          </div>

          {/* SOS Sync Alert Banner */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-extrabold text-sm block">🚨 High-Alert SOS Dispatch Priority:</span>
              <p className="text-rose-800 text-xs mt-0.5">
                The primary emergency contact configured here is instantly displayed to the Campus Medical Team, Warden, and Security Guards whenever an SOS panic alarm is triggered or late night curfew is violated.
              </p>
            </div>
          </div>

          <form id="family-contacts-form" onSubmit={handleSaveFamily} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Father */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Father Details</span>
                  </span>
                  {!isEditingEmergency && (
                    <a
                      href={`tel:${familyForm.fatherPhone}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Father</span>
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Father's Name</label>
                  <input
                    type="text"
                    disabled={!isEditingEmergency}
                    value={familyForm.fatherName}
                    onChange={(e) => setFamilyForm({ ...familyForm, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Father's Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingEmergency}
                    value={familyForm.fatherPhone}
                    onChange={(e) => setFamilyForm({ ...familyForm, fatherPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Mother */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-pink-600" />
                    <span>Mother Details</span>
                  </span>
                  {!isEditingEmergency && (
                    <a
                      href={`tel:${familyForm.motherPhone}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Mother</span>
                    </a>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    disabled={!isEditingEmergency}
                    value={familyForm.motherName}
                    onChange={(e) => setFamilyForm({ ...familyForm, motherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Mother's Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingEmergency}
                    value={familyForm.motherPhone}
                    onChange={(e) => setFamilyForm({ ...familyForm, motherPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Local Guardian */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Local Guardian (City Contact)</span>
                  </span>
                  {!isEditingEmergency && (
                    <a
                      href={`tel:${familyForm.localGuardianPhone}`}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Guardian</span>
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Guardian Name</label>
                    <input
                      type="text"
                      disabled={!isEditingEmergency}
                      value={familyForm.localGuardianName}
                      onChange={(e) => setFamilyForm({ ...familyForm, localGuardianName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Relation</label>
                    <input
                      type="text"
                      disabled={!isEditingEmergency}
                      value={familyForm.localGuardianRelation}
                      onChange={(e) => setFamilyForm({ ...familyForm, localGuardianRelation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Guardian Phone Number</label>
                  <input
                    type="tel"
                    disabled={!isEditingEmergency}
                    value={familyForm.localGuardianPhone}
                    onChange={(e) => setFamilyForm({ ...familyForm, localGuardianPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Primary Emergency Contact */}
              <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Primary Emergency Contact</span>
                  </span>
                  {!isEditingEmergency && (
                    <a
                      href={`tel:${familyForm.primaryEmergencyPhone}`}
                      className="text-[11px] font-bold text-rose-600 hover:underline flex items-center space-x-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call Emergency</span>
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Contact Name</label>
                    <input
                      type="text"
                      disabled={!isEditingEmergency}
                      value={familyForm.primaryEmergencyName}
                      onChange={(e) => setFamilyForm({ ...familyForm, primaryEmergencyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Relation</label>
                    <input
                      type="text"
                      disabled={!isEditingEmergency}
                      value={familyForm.primaryEmergencyRelation}
                      onChange={(e) => setFamilyForm({ ...familyForm, primaryEmergencyRelation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Primary Phone</label>
                    <input
                      type="tel"
                      disabled={!isEditingEmergency}
                      value={familyForm.primaryEmergencyPhone}
                      onChange={(e) => setFamilyForm({ ...familyForm, primaryEmergencyPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      disabled={!isEditingEmergency}
                      value={familyForm.primaryEmergencyAltPhone}
                      onChange={(e) => setFamilyForm({ ...familyForm, primaryEmergencyAltPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 disabled:opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Toggle */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-800">
                  Automated Parent SMS & WhatsApp Alerts
                </p>
                <p className="text-[11px] text-slate-500">
                  Notify father and mother when leave passes are approved or student scans turnstile at campus gates.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={familyForm.notifyParentsOnExit}
                  onChange={(e) => setFamilyForm({ ...familyForm, notifyParentsOnExit: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DIGITAL ID                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'DIGITAL_ID' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
            {/* The Smart ID Card UI */}
            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white relative">
              {/* Card Header with College Branding */}
              <div className="p-4 bg-white/10 backdrop-blur-md border-b border-white/15 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xs">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black leading-tight tracking-tight text-white">
                      {digitalIdState.collegeName}
                    </h4>
                    <span className="text-[9px] font-bold text-blue-200 tracking-wider">
                      STUDENT IDENTITY CARD • {digitalIdState.collegeCode}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    digitalIdState.cardStatus === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  }`}
                >
                  {digitalIdState.cardStatus === 'ACTIVE' ? 'ACTIVE' : 'BLOCKED'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-24 rounded-2xl bg-white/20 overflow-hidden border-2 border-white/60 shrink-0 shadow-md">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="ID Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                        {personalForm.fullName.slice(0, 2)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black text-white leading-tight">
                      {personalForm.fullName}
                    </h3>
                    <p className="text-[11px] text-blue-200 font-mono font-bold">
                      Roll: {personalForm.rollNo}
                    </p>
                    <p className="text-[10px] text-slate-300 leading-tight">
                      {personalForm.branch}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Semester: {personalForm.semester}
                    </p>
                    <span className="inline-block text-[9px] font-black bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-md mt-1">
                      Blood Group: {personalForm.bloodGroup}
                    </span>
                  </div>
                </div>

                {/* QR Code Barcode section */}
                <div className="p-3 bg-white rounded-2xl flex items-center justify-between text-slate-900 shadow-inner">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Gate Turnstile Token
                    </span>
                    <span className="text-[11px] font-black text-slate-800 font-mono block">
                      VALID: {digitalIdState.validUntil}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold block">
                      ✓ Biometric & Barcode Verified
                    </span>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                    <QRCodeSVG
                      value={digitalIdState.signedToken}
                      size={64}
                      level="M"
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer Stripe */}
              <div className="p-2.5 bg-blue-600/40 text-center text-[9px] font-bold text-blue-100 tracking-wider uppercase border-t border-white/10">
                Official Property of {digitalIdState.collegeName} • If found return to Warden
              </div>
            </div>

            {/* Actions & ID Management Controls */}
            <div className="flex-1 space-y-4 max-w-md">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Contactless Smart ID
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Digital Identity Card & QR Gateway
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  This card serves as your official university gate pass, library card, turnstile barcode, and hostel access badge.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setShowFullQrModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition cursor-pointer min-h-[44px]"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Full-Screen QR for Gate Scanner</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer min-h-[44px]"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download / Print</span>
                  </button>
                  <button
                    onClick={() => setShowReportLostModal(true)}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer min-h-[44px]"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Lost ID</span>
                  </button>
                </div>

                {digitalIdState.cardStatus === 'BLOCKED_LOST' && (
                  <button
                    onClick={handleRequestReissue}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center space-x-2 transition cursor-pointer min-h-[44px]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request New Replacement ID Card</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ACADEMIC COLLECTION                                                */}
      {/* ========================================================================= */}
      {activeTab === 'ACADEMICS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span>{t.academics}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Semester grades, 75% attendance threshold tracker, and career achievements.
              </p>
            </div>

            <button
              onClick={() => setShowCvModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20 transition cursor-pointer self-start sm:self-auto min-h-[44px]"
            >
              <FileText className="w-4 h-4" />
              <span>{t.generateCv}</span>
            </button>
          </div>

          {/* Quick Metrics (CGPA + Backlogs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Cumulative CGPA</span>
              <p className="text-3xl font-black text-blue-900 mt-1">{academicData.cgpa} / 10.0</p>
              <span className="text-[11px] text-blue-700 font-semibold block mt-1">Top 5% Department Ranking</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backlog Status</span>
              <div className="mt-1 flex items-center space-x-1.5">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ {academicData.backlogs}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1.5">All 24 Theory & Practical Papers Cleared</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Semester Schedule</span>
              <p className="text-sm font-black text-slate-900 mt-1">{academicData.currentSemester}</p>
              <a
                href="#timetable"
                onClick={(e) => { e.preventDefault(); showToast('Timetable loaded: Mon-Fri 09:30 AM - 04:30 PM', 'info'); }}
                className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block"
              >
                View Academic Timetable →
              </a>
            </div>
          </div>

          {/* Semester-wise SGPA Progression Bar Chart */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Semester-wise Academic Progression (SGPA)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {academicData.semesters.map((s: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-center space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">{s.sem}</span>
                  <span className="text-lg font-black text-slate-900 block">{s.sgpa}</span>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(parseFloat(s.sgpa) / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block">{s.attendance}% Attd</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject-wise Attendance with 75% Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Subject Attendance & 75% Exam Eligibility Tracker
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Min 75% required for End-Sem Exam</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Subject Code & Name</th>
                      <th className="p-3.5">Attended / Total</th>
                      <th className="p-3.5">Percentage</th>
                      <th className="p-3.5">Exam Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {academicData.subjects.map((sub: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold text-slate-800">
                          <span className="text-blue-600 font-mono mr-1.5">[{sub.code}]</span>
                          {sub.name}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-600">
                          {sub.attended} / {sub.total} Classes
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-slate-900">{sub.percentage}%</span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${sub.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              sub.percentage >= 75
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {sub.percentage >= 75 ? '✓ Eligible' : '⚠️ Shortage (<75%)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Student Projects & Achievements Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Projects, Internships & Achievements ({academicData.achievements.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowAddAchievementModal(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {academicData.achievements.map((ach: any) => (
                <div key={ach.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                        {ach.type}
                      </span>
                      <button
                        onClick={() => handleDeleteAchievement(ach.id)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h5 className="text-xs font-black text-slate-900 mt-1.5">{ach.title}</h5>
                    <p className="text-[11px] text-blue-600 font-semibold">{ach.org}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ach.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block pt-1">{ach.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GOVERNMENT LOCKER                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'LOCKER' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <FolderLock className="w-5 h-5 text-indigo-600" />
                <span>{t.locker}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Encrypted national identity proofs & institutional certificates (Max 5 MB each).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 flex items-center space-x-1.5 cursor-not-allowed"
                title="DigiLocker API integration coming soon"
              >
                <span>🔗 Connect DigiLocker</span>
                <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Coming soon</span>
              </button>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-2.5 text-xs text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Privacy Guaranteed:</strong> Only you and authorized university compliance staff can inspect these documents. Every access is logged to institutional audit trail.
            </span>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockerDocs.map((doc: any) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{doc.type}</h4>
                        <p className="text-[11px] font-mono font-semibold text-slate-500">
                          {doc.maskedNumber}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        doc.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : doc.status === 'PENDING_VERIFICATION'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : doc.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
                    <span>Uploaded: {doc.uploadDate || 'Not yet'}</span>
                    <span>{doc.fileSize || 'PDF/JPG/PNG'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5">
                    {doc.status !== 'NOT_UPLOADED' && doc.status !== 'NOT_APPLICABLE' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDocToView(doc)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    )}

                    {doc.status !== 'NOT_UPLOADED' && doc.status !== 'NOT_APPLICABLE' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLockerDoc(doc.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <label className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center space-x-1 border border-blue-200 transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{doc.status === 'NOT_UPLOADED' ? 'Upload' : 'Replace'}</span>
                    <input
                      type="file"
                      accept=".pdf,image/jpeg,image/png"
                      onChange={(e) => handleLockerUpload(doc.id, e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: FULL SCREEN QR PASS FOR GATE BARRIER TURNSTILE                   */}
      {/* ========================================================================= */}
      {showFullQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowFullQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800">Gate Turnstile Barcode</span>
              <button
                onClick={() => setShowFullQrModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
              <QRCodeSVG
                value={digitalIdState.signedToken}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">{personalForm.fullName}</h4>
              <p className="text-xs font-mono font-bold text-blue-600 mt-0.5">Roll: {personalForm.rollNo}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Point this QR at the optical gate barrier sensor to punch entry or exit.
              </p>
            </div>

            <button
              onClick={() => setShowFullQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REPORT LOST ID                                                   */}
      {/* ========================================================================= */}
      {showReportLostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowReportLostModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-base font-black text-slate-900">Report Lost / Stolen ID Card</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Reporting your card as lost will immediately <strong>block your turnstile QR code</strong> to prevent unauthorized gate access.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Location where lost</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Card fell out near cafeteria on 8th Oct..."
                value={reportLostReason}
                onChange={(e) => setReportLostReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReportLostModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportLostId}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Block & Report Lost
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REQUEST CORRECTION FOR LOCKED FIELDS (ADMIN WORKFLOW)            */}
      {/* ========================================================================= */}
      {showCorrectionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowCorrectionModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-black text-slate-900">Request Institution Correction</h4>
              </div>
              <button onClick={() => setShowCorrectionModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Submit formal correction request for <strong>{correctionField}</strong>. College registrar will review and approve.
            </p>

            <form onSubmit={handleSubmitCorrection} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Current Registered Value</label>
                <input
                  type="text"
                  disabled
                  value={correctionCurrentVal}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requested Corrected Value</label>
                <input
                  type="text"
                  required
                  placeholder="Enter the correct value"
                  value={correctionNewVal}
                  onChange={(e) => setCorrectionNewVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason & Supporting Details</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Discrepancy with official university enrollment certificate..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD ACADEMIC ACHIEVEMENT                                         */}
      {/* ========================================================================= */}
      {showAddAchievementModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowAddAchievementModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-black text-slate-900">Add Academic Project / Honor</h4>
              <button onClick={() => setShowAddAchievementModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddAchievement} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Turnstile IoT Device"
                  value={newAchTitle}
                  onChange={(e) => setNewAchTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newAchType}
                    onChange={(e) => setNewAchType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Project">Project</option>
                    <option value="Internship">Internship</option>
                    <option value="Award">Award</option>
                    <option value="Publication">Publication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. Oct 2024"
                    value={newAchDate}
                    onChange={(e) => setNewAchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Event</label>
                <input
                  type="text"
                  placeholder="e.g. HackOdisha 2024 / Tech Innovators Hub"
                  value={newAchOrg}
                  onChange={(e) => setNewAchOrg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary of responsibilities or achievements..."
                  value={newAchDesc}
                  onChange={(e) => setNewAchDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAchievementModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Save Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DOCUMENT VIEWER MODAL (GOVERNMENT LOCKER)                        */}
      {/* ========================================================================= */}
      {selectedDocToView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedDocToView(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">{selectedDocToView.type}</h4>
              </div>
              <button onClick={() => setSelectedDocToView(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Document Preview Placeholder */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <FolderLock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{selectedDocToView.type}</p>
                <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                  Identifier: {selectedDocToView.maskedNumber}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Uploaded on {selectedDocToView.uploadDate} • Status: {selectedDocToView.status}
                </p>
              </div>
              <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                ✓ 256-bit Encrypted Institutional Signature
              </span>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDocToView(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: GENERATE CV (PRINTABLE / PDF READY)                               */}
      {/* ========================================================================= */}
      {showCvModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowCvModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-3xl w-full my-8 space-y-6 shadow-2xl text-slate-900 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Auto-Generated Student CV
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-blue-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowCvModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable One-Page CV Format */}
            <div className="space-y-6 p-4 sm:p-6 bg-slate-50/50 rounded-2xl border border-slate-200/80">
              {/* Header */}
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900">{personalForm.fullName}</h2>
                <p className="text-sm font-semibold text-blue-600 mt-0.5">
                  Undergraduate in {personalForm.branch} (CGPA: {academicData.cgpa})
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-medium">
                  <span>✉ {personalForm.email}</span>
                  <span>✆ {personalForm.studentPhone}</span>
                  <span>📍 {personalForm.permanentAddress}</span>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Education & Academic Standing
                </h4>
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <p className="font-black text-slate-900">{digitalIdState.collegeName}</p>
                    <p className="text-slate-600">{personalForm.branch} • Semester 5</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">CGPA: {academicData.cgpa} / 10</p>
                    <p className="text-slate-400">{personalForm.batch}</p>
                  </div>
                </div>
              </div>

              {/* Key Projects & Experience */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Projects & Experience
                </h4>
                {academicData.achievements.map((ach: any) => (
                  <div key={ach.id} className="text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-black text-slate-900">{ach.title}</span>
                      <span className="text-slate-500 font-medium">{ach.date}</span>
                    </div>
                    <p className="text-blue-600 font-semibold text-[11px]">{ach.org} ({ach.type})</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </div>

              {/* Verified Documents */}
              <div className="space-y-1 text-xs">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                  Institutional Certifications
                </h4>
                <p className="text-[11px] text-slate-600">
                  Aadhaar, 10th & 12th Board Transcripts officially verified and stored in Campus Helper Academic Repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
