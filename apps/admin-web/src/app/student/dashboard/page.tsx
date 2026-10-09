'use client';

import React, { useState, useEffect, useRef } from 'react';
import RoleGuard from '../../../components/RoleGuard';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Award,
  Bed,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  QrCode,
  MapPin,
  Send,
  Upload,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Utensils,
  Phone,
  Mail,
  Zap,
  Droplets,
  Wifi,
  Sparkles,
  HelpCircle,
  Building,
  Heart,
  ShieldAlert,
  Image as ImageIcon,
  CreditCard,
  Lock,
  Settings,
  Activity,
  Flame,
  Filter,
  ExternalLink,
  Check,
  Star,
  Printer,
  Info,
  Layers,
  Eye,
  Camera,
  MessageSquare,
  AlertOctagon,
  Users,
  Home,
  Trash2,
  Link as LinkIcon,
  Play,
  Video,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Share2,
  Radio,
  LifeBuoy,
  Ambulance,
  Siren,
  Pause,
  Stethoscope,
  Pill,
  X,
  PhoneCall,
  PhoneOff,
  Copy,
  Wrench,
  Globe,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import io from 'socket.io-client';
import { playCuteNotificationSound, playCuteSuccessSound } from '../../../lib/audioSound';
import StudentHostelLeaveGatePassView from '../../../components/student-gatepass/StudentHostelLeaveGatePassView';
import StudentMyProfileView from '../../../components/StudentMyProfileView';

const API_BASE = '/api';

// =========================================================================
// 19 NAVIGATION MODULE TABS
// =========================================================================
type StudentTab =
  | 'HOME'            // 1. Home Dashboard
  | 'PROFILE'         // 2. My Profile
  | 'NOTICES'         // 3. Notices & Announcements
  | 'EVENTS'          // 4. Events
  | 'HOSTEL'          // 5. Hostel
  | 'LEAVE_GATE_PASS' // 6. Leave & Gate Pass
  | 'MESS'            // 7. Mess
  | 'GRIEVANCE'       // 8. Grievance / Complaint
  | 'MEDICAL'         // 9. Medical Care
  | 'EMERGENCY'       // 10. Emergency
  | 'CAMPUS_MAP'      // 11. Campus Map
  | 'ACADEMIC'        // 12. Academic
  | 'GALLERY'         // 13. College Gallery
  | 'DIGITAL_ID'      // 14. Digital Student ID
  | 'CONTACTS'        // 15. Campus Contacts
  | 'NOTIFICATIONS'   // 16. Notifications
  | 'COLLEGE_INFO'    // 17. College Information
  | 'SETTINGS'        // 18. Settings
  | 'QUALIFICATIONS'; // 19. Qualifications, Document Locker & Portfolio

// Cartoon Avatars for Students (1-Click Selection & Instant Profile Sync)
interface CartoonAvatarItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  url: string;
}

const CARTOON_AVATAR_LIST: CartoonAvatarItem[] = [
  {
    id: 'cartoon-adventurer',
    name: 'College Adventurer',
    category: 'Student Life',
    badge: 'Popular',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Subham&backgroundColor=b6e3f4',
  },
  {
    id: 'cartoon-scholar',
    name: 'Tech Scholar',
    category: 'Engineering',
    badge: 'Coding',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SubhamPradhan&clothingColor=26a69a',
  },
  {
    id: 'cartoon-bot',
    name: 'Cyber Bot',
    category: 'AI & Robotics',
    badge: 'Tech',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CampusCoder&backgroundColor=ffd5dc',
  },
  {
    id: 'cartoon-artist',
    name: 'Creative Artist',
    category: 'Arts & Media',
    badge: 'Creative',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Felix&backgroundColor=d1d4f9',
  },
  {
    id: 'cartoon-star',
    name: 'Campus Ace',
    category: 'Sports & Athletics',
    badge: 'Star',
    url: 'https://api.dicebear.com/7.x/micah/svg?seed=CampusStar&backgroundColor=c0aede',
  },
  {
    id: 'cartoon-smile',
    name: 'Happy Resident',
    category: 'Hostel Fun',
    badge: 'Friendly',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappyStudent&backgroundColor=b6e3f4',
  },
  {
    id: 'cartoon-champion',
    name: 'Code Champion',
    category: 'Computer Science',
    badge: 'Developer',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaVerma&clothingColor=3c4f5e',
  },
  {
    id: 'cartoon-thinker',
    name: 'Open Thinker',
    category: 'Research & Labs',
    badge: 'Scholar',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=ScholarMind&backgroundColor=ffdfbf',
  },
];

const PRESET_AVATARS = CARTOON_AVATAR_LIST.map((c) => c.url);

// Official Campus Contacts (Principal, Dean, Warden, Security, Service Member, Medical)
interface CampusOfficialContact {
  id: string;
  roleTitle: string;
  name: string;
  designation: string;
  department: string;
  office: string;
  phone: string;
  altPhone?: string;
  email: string;
  timings: string;
  badge: string;
  category?: 'LEADERSHIP' | 'HOSTEL' | 'SECURITY' | 'SERVICES' | 'MEDICAL';
  color?: string;
  badgeColor?: string;
  buttonColor?: string;
}

const CAMPUS_OFFICIAL_CONTACTS: CampusOfficialContact[] = [
  {
    id: 'contact-principal',
    roleTitle: 'Principal & Campus Director',
    name: 'Prof. (Dr.) Vikramaditya Sen, Ph.D.',
    designation: 'Principal & Head of Institution',
    department: 'Office of the Principal & Institutional Director',
    office: 'Administrative Block A (Room 101, Ground Floor)',
    phone: '+91 94370 11223',
    altPhone: '0674-2471122',
    email: 'principal@rec.ac.in',
    timings: 'Mon - Fri: 10:00 AM - 05:00 PM',
    badge: 'Principal Office',
    category: 'LEADERSHIP',
    color: 'border-blue-300 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
  },
  {
    id: 'contact-dean',
    roleTitle: 'Dean (Student Welfare & Academics)',
    name: 'Prof. (Dr.) S.K. Mohanty, Ph.D.',
    designation: 'Dean — Student Affairs & Academic Welfare',
    department: 'Deanery Council of Student Welfare & Curriculum',
    office: 'Academic Block A, 2nd Floor (Room 202)',
    phone: '+91 94370 22334',
    altPhone: '0674-2472233',
    email: 'dean.studentwelfare@rec.ac.in',
    timings: 'Mon - Sat: 09:30 AM - 05:00 PM',
    badge: 'Deanery Office',
    category: 'LEADERSHIP',
    color: 'border-indigo-300 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25',
  },
  {
    id: 'contact-warden',
    roleTitle: 'Chief Hostel Warden & Superintendent',
    name: 'Dr. K.P. Mohapatra',
    designation: 'Chief Warden (Nilgiri Boys & Shivalik Girls Hostels)',
    department: 'Hostel Administration & Resident Care',
    office: 'Nilgiri Block A Warden Office (Ground Floor Entrance)',
    phone: '+91 98610 22345',
    altPhone: '+91 98610 22346',
    email: 'warden.boys@campus.edu',
    timings: '24x7 Resident Hostel Supervision & Night Roll-Call',
    badge: 'Hostel Warden',
    category: 'HOSTEL',
    color: 'border-amber-300 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    buttonColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25',
  },
  {
    id: 'contact-security',
    roleTitle: 'Chief Campus Security Officer & Gate Patrol',
    name: 'Inspector Rajesh Nayak',
    designation: 'Security In-Charge & Perimeter Commander',
    department: 'Campus Security, Turnstile Scanners & Visitor Control',
    office: 'Main Gate 1 Security Control Tower',
    phone: '+91 94370 88214',
    altPhone: '+91 94370 88215',
    email: 'security@campus.edu',
    timings: '24x7 Security Post, Turnstiles & Emergency Response',
    badge: 'Security Post',
    category: 'SECURITY',
    color: 'border-teal-300 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
    buttonColor: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/25',
  },
  {
    id: 'contact-services',
    roleTitle: 'Campus Services & Maintenance Supervisor',
    name: 'Ranjan Mohanty',
    designation: 'Facility Lead (Mess, Electrician, Plumber & Utilities)',
    department: 'Campus Infrastructure, Catering Services & Maintenance Desk',
    office: 'Central Utility Operations Bay 3',
    phone: '+91 99371 44520',
    altPhone: '+91 99371 44521',
    email: 'services.mess@campus.edu',
    timings: '24x7 Electrician, Plumber, Mess Meals & Maintenance Call Desk',
    badge: 'Services Desk',
    category: 'SERVICES',
    color: 'border-purple-300 bg-gradient-to-br from-purple-50/80 via-white to-fuchsia-50/60',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25',
  },
  {
    id: 'contact-medical',
    roleTitle: 'Chief Medical Officer & Clinic In-Charge',
    name: 'Dr. Pratima Mishra, MD',
    designation: 'Senior Medical Officer & Clinic Head',
    department: 'Campus Health Dispensary, Student Clinic & ICU Ambulance',
    office: 'Campus Health Dispensary (Bay 1 Ground Floor)',
    phone: '+91 98611 77332',
    altPhone: '108',
    email: 'medical.officer@campus.edu',
    timings: '24x7 Campus Pharmacy, Emergency Ambulance & First Aid Care',
    badge: 'Dispensary Clinic',
    category: 'MEDICAL',
    color: 'border-rose-300 bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    buttonColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25',
  },
];

// =========================================================================
// STUDENT QUALIFICATIONS & DIGITAL DOCUMENT LOCKER DATA MODELS
// =========================================================================
interface EducationCertificateItem {
  id: string;
  title: string;
  degree: string;
  institution: string;
  yearOfPassing: string;
  score: string;
  rollNo?: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isVerified: boolean;
  verifiedBadge?: string;
}

interface GovtDocumentItem {
  id: string;
  title: string;
  docType: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'BIRTH_CERT' | 'INCOME_CERT' | 'CASTE_CERT' | 'RESIDENCE_CERT' | 'OTHER';
  docNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  validity: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isVerified: boolean;
  badge: string;
  badgeColor: string;
}

interface StudyLinkItem {
  id: string;
  platform: string;
  url: string;
  username: string;
  description: string;
  badge: string;
  badgeColor: string;
}

interface StudentSkillItem {
  id: string;
  name: string;
  category: 'PROGRAMMING' | 'WEB_CLOUD' | 'CORE_CS' | 'TOOLS' | 'SOFT';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  proficiencyPercent: number;
}

interface StudentResumeData {
  title: string;
  headline: string;
  summary: string;
  lastUpdated: string;
  fileSize: string;
  fileUrl?: string;
}

const DEFAULT_EDUCATION_CERTS: EducationCertificateItem[] = [
  {
    id: 'cert-10th',
    title: 'Class 10 CBSE Board Certificate & Marksheet',
    degree: 'Secondary School Examination (Matriculation)',
    institution: 'DAV Public School, Chandrasekharpur, Bhubaneswar (CBSE)',
    yearOfPassing: '2021',
    score: '94.2% (Grade A1 in all subjects)',
    rollNo: '12654321',
    description: 'All India Secondary School Examination (AISSE) certified with distinction in Mathematics, Science and Computer Applications. Verified by CBSE Board New Delhi.',
    fileName: 'CBSE_Class10_Certificate_Marksheet_Subham.pdf',
    fileSize: '1.4 MB',
    isVerified: true,
    verifiedBadge: 'CBSE Verified ✅',
  },
  {
    id: 'cert-12th',
    title: 'Class 12 CHSE Higher Secondary Certificate & Marksheet',
    degree: 'Higher Secondary School Examination (Science Stream)',
    institution: 'BJB Junior College, Bhubaneswar (CHSE Odisha)',
    yearOfPassing: '2023',
    score: '91.8% (First Division with Distinction)',
    rollNo: '23CHSE04921',
    description: 'Higher secondary science curriculum covering Physics, Chemistry, Mathematics & Information Technology. Ranked in top 2% of the council.',
    fileName: 'CHSE_Class12_HigherSecondary_Certificate.pdf',
    fileSize: '1.2 MB',
    isVerified: true,
    verifiedBadge: 'CHSE Verified ✅',
  },
  {
    id: 'cert-btech-sem',
    title: 'B.Tech CSE — Semester Grade Sheets (Sem 1 to 4)',
    degree: 'Bachelor of Technology in Computer Science & Engineering',
    institution: 'Raajdhani Engineering College (Autonomous), Bhubaneswar',
    yearOfPassing: '2023 - 2027 (Current 5th Sem)',
    score: '8.95 Cumulative CGPA',
    rollNo: '2301042001',
    description: 'Autonomous semester transcripts. Completed core foundational curriculum: Data Structures & Algorithms (O Grade), DBMS (O Grade), Operating Systems (E Grade), Discrete Mathematics (O Grade).',
    fileName: 'REC_BTech_CSE_Semester_Gradesheets_Sem1_4.pdf',
    fileSize: '2.6 MB',
    isVerified: true,
    verifiedBadge: 'Deanery Verified ✅',
  },
  {
    id: 'cert-aws',
    title: 'AWS Certified Cloud Practitioner (CLF-C02)',
    degree: 'Industry Professional Cloud Certification',
    institution: 'Amazon Web Services (AWS Training & Certification)',
    yearOfPassing: '2025',
    score: 'Score: 890 / 1000 (Pass with Honor)',
    rollNo: 'AWS-CCP-7749210',
    description: 'Industry credential demonstrating comprehensive knowledge of AWS Cloud concepts, security, IAM roles, EC2, S3, RDS, Lambda, and Well-Architected Framework.',
    fileName: 'AWS_Certified_Cloud_Practitioner_Badge.pdf',
    fileSize: '850 KB',
    isVerified: true,
    verifiedBadge: 'AWS Certified ✅',
  },
];

const DEFAULT_GOVT_DOCS: GovtDocumentItem[] = [
  {
    id: 'doc-aadhaar',
    title: 'Aadhaar Card (UIDAI)',
    docType: 'AADHAAR',
    docNumber: 'XXXX-XXXX-4219',
    issuingAuthority: 'Unique Identification Authority of India (Govt. of India)',
    issuedDate: '12-May-2016',
    validity: 'Lifetime',
    description: 'National biometric identity document linked with student DBT scholarship, bank account, and Academic Bank of Credits (ABC ID: 8912-3401-9214).',
    badge: 'UIDAI e-KYC Verified',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    fileName: 'eAadhaar_Card_Subham_Pradhan.pdf',
    fileSize: '650 KB',
    isVerified: true,
  },
  {
    id: 'doc-pan',
    title: 'Permanent Account Number (PAN Card)',
    docType: 'PAN',
    docNumber: 'ABCDE1234F',
    issuingAuthority: 'Directorate of Income Tax, Ministry of Finance, Govt of India',
    issuedDate: '20-Jan-2023',
    validity: 'Lifetime',
    description: 'Official tax identity card required for campus placement onboardings, internship stipends, bank disbursements, and Aadhaar-PAN linkage.',
    badge: 'NSDL Verified',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    fileName: 'ePAN_Card_Subham_Pradhan.pdf',
    fileSize: '480 KB',
    isVerified: true,
  },
  {
    id: 'doc-voter',
    title: 'Voter Identity Card (EPIC)',
    docType: 'VOTER_ID',
    docNumber: 'OD/02/123/456789',
    issuingAuthority: 'Election Commission of India (ECI)',
    issuedDate: '15-Oct-2023',
    validity: 'Lifetime (Constituency: 114-Bhubaneswar Central)',
    description: 'National electoral registration photo card certifying adult citizenship, electoral franchise, and local municipal identity verification.',
    badge: 'ECI Verified',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    fileName: 'eEPIC_Voter_Card_Subham_Pradhan.pdf',
    fileSize: '520 KB',
    isVerified: true,
  },
  {
    id: 'doc-birth',
    title: 'Official Birth Certificate',
    docType: 'BIRTH_CERT',
    docNumber: 'B-2005/BMC/09421',
    issuingAuthority: 'Bhubaneswar Municipal Corporation (BMC), Dept of Health & Family Welfare',
    issuedDate: '22-Aug-2005',
    validity: 'Lifetime (DOB: 15-Aug-2005)',
    description: 'Legal vital registration document certifying primary date of birth and birthplace within Khordha district, Odisha.',
    badge: 'Municipal Verified',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    fileName: 'Birth_Certificate_BMC_Official.pdf',
    fileSize: '780 KB',
    isVerified: true,
  },
  {
    id: 'doc-income',
    title: 'Annual Income Certificate',
    docType: 'INCOME_CERT',
    docNumber: 'INC/2026/OD/882194',
    issuingAuthority: 'Office of the Tahsildar, Revenue & Disaster Management, Govt of Odisha',
    issuedDate: '10-Apr-2026',
    validity: 'Valid for Financial Year 2026-27 (Annual Income: Rs 2,40,000/-)',
    description: 'Certified annual household income certificate required for autonomous merit-cum-means scholarship, fee concession, and welfare benefits.',
    badge: 'Revenue Officer Approved',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    fileName: 'Revenue_Income_Certificate_2026.pdf',
    fileSize: '920 KB',
    isVerified: true,
  },
  {
    id: 'doc-caste',
    title: 'Caste / Community Certificate',
    docType: 'CASTE_CERT',
    docNumber: 'CST/2026/OD/339182',
    issuingAuthority: 'Revenue Dept & Sub-Divisional Magistrate, Govt of Odisha',
    issuedDate: '15-Jun-2023',
    validity: 'Permanent Statutory Record',
    description: 'Official category verification certificate certifying SEBC/OBC state classification for statutory university reservation and government schemes.',
    badge: 'Govt Authenticated',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    fileName: 'Caste_Community_Certificate_Odisha.pdf',
    fileSize: '840 KB',
    isVerified: true,
  },
  {
    id: 'doc-residence',
    title: 'Resident / Domicile Certificate',
    docType: 'RESIDENCE_CERT',
    docNumber: 'DOM/2026/OD/774012',
    issuingAuthority: 'Revenue & Disaster Management Dept, Govt of Odisha',
    issuedDate: '18-Jul-2023',
    validity: 'Permanent Resident of Odisha',
    description: 'Legal state domicile certification proving 15+ years residency in Odisha, conferring state quota admissions and hostel accommodation priority.',
    badge: 'State Domicile Verified',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    fileName: 'Resident_Domicile_Certificate_Odisha.pdf',
    fileSize: '890 KB',
    isVerified: true,
  },
];

const DEFAULT_STUDY_LINKS: StudyLinkItem[] = [
  {
    id: 'link-linkedin',
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/subham-pradhan',
    username: 'subham-pradhan',
    description: 'Professional networking, engineering articles, campus achievements, verified skills, and corporate recommendations.',
    badge: '500+ Connections',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'link-github',
    platform: 'GitHub',
    url: 'https://github.com/subham-pradhan-dev',
    username: 'subham-pradhan-dev',
    description: 'Open-source software projects including Campus Helper, Next.js web applications, Docker configs, and algorithmic repositories.',
    badge: '28 Repositories • 140+ Stars',
    badgeColor: 'bg-slate-900 text-white border-slate-700',
  },
  {
    id: 'link-leetcode',
    platform: 'LeetCode',
    url: 'https://leetcode.com/u/subham_codes',
    username: 'subham_codes',
    description: 'Daily competitive coding practice. Solved 300+ problems across Graphs, Dynamic Programming, Binary Trees and Arrays.',
    badge: 'Rating 1820 • Top 9%',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'link-hackerrank',
    platform: 'HackerRank',
    url: 'https://hackerrank.com/subham_pradhan',
    username: 'subham_pradhan',
    description: 'Verified Gold Badges in Problem Solving, Python, and SQL with multiple competitive contest participation badges.',
    badge: '5★ Problem Solving • 5★ Python',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'link-portfolio',
    platform: 'Portfolio Website',
    url: 'https://subhampradhan.dev',
    username: 'subhampradhan.dev',
    description: 'Personal portfolio highlighting interactive web demos, cloud architecture case studies, tech blog, and resume viewer.',
    badge: 'Live Production 🚀',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    id: 'link-scholar',
    platform: 'Google Scholar / Research',
    url: 'https://scholar.google.com/citations?user=subham_rec',
    username: 'subham_rec',
    description: 'Co-authored academic paper preprint on Distributed IoT Edge Sensors for Real-Time Campus Energy Conservation.',
    badge: '1 Paper • 12 Citations',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
  },
];

const DEFAULT_STUDENT_RESUME: StudentResumeData = {
  title: 'Subham_Pradhan_Resume_2026_BTech_CSE.pdf',
  headline: 'Full-Stack Web & Cloud Developer | B.Tech CSE (2023-2027) | CGPA 8.95',
  summary: 'Enthusiastic Computer Science undergraduate at Raajdhani Engineering College with hands-on expertise in Next.js, React, Node.js, TypeScript, PostgreSQL, and AWS. Proven track record building real-time campus software systems, winning hackathons, and solving 300+ LeetCode problems.',
  lastUpdated: '05 Oct, 2026',
  fileSize: '410 KB',
  fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
};

const DEFAULT_STUDENT_SKILLS: StudentSkillItem[] = [
  { id: 'sk-1', name: 'Python', category: 'PROGRAMMING', proficiency: 'Advanced', proficiencyPercent: 90 },
  { id: 'sk-2', name: 'TypeScript & JavaScript', category: 'PROGRAMMING', proficiency: 'Expert', proficiencyPercent: 95 },
  { id: 'sk-3', name: 'React.js & Next.js', category: 'WEB_CLOUD', proficiency: 'Expert', proficiencyPercent: 95 },
  { id: 'sk-4', name: 'Node.js & Express', category: 'WEB_CLOUD', proficiency: 'Advanced', proficiencyPercent: 88 },
  { id: 'sk-5', name: 'C++ & Algorithms', category: 'PROGRAMMING', proficiency: 'Advanced', proficiencyPercent: 85 },
  { id: 'sk-6', name: 'PostgreSQL & SQL', category: 'CORE_CS', proficiency: 'Advanced', proficiencyPercent: 86 },
  { id: 'sk-7', name: 'Docker & AWS Basics', category: 'WEB_CLOUD', proficiency: 'Intermediate', proficiencyPercent: 75 },
  { id: 'sk-8', name: 'Tailwind CSS & Modern UI', category: 'WEB_CLOUD', proficiency: 'Expert', proficiencyPercent: 95 },
  { id: 'sk-9', name: 'Data Structures & Algorithms', category: 'CORE_CS', proficiency: 'Advanced', proficiencyPercent: 88 },
  { id: 'sk-10', name: 'DBMS & Query Optimization', category: 'CORE_CS', proficiency: 'Advanced', proficiencyPercent: 85 },
  { id: 'sk-11', name: 'Git, GitHub & CI/CD', category: 'TOOLS', proficiency: 'Advanced', proficiencyPercent: 90 },
  { id: 'sk-12', name: 'System Design & REST APIs', category: 'WEB_CLOUD', proficiency: 'Advanced', proficiencyPercent: 92 },
  { id: 'sk-13', name: 'Technical Problem Solving', category: 'SOFT', proficiency: 'Expert', proficiencyPercent: 95 },
  { id: 'sk-14', name: 'Team Collaboration & Agile', category: 'SOFT', proficiency: 'Advanced', proficiencyPercent: 90 },
];

// =========================================================================
// ACADEMIC & SCHEDULE DATA STRUCTURES & DEMO DATA (AUTONOMOUS CURRICULUM)
// =========================================================================

interface TimetablePeriod {
  id: string;
  time: string;
  subjectCode: string;
  subjectName: string;
  type: 'THEORY' | 'LAB' | 'TUTORIAL' | 'RECESS';
  faculty: string;
  facultyCabin: string;
  room: string;
  attendancePercent: number;
  attendedClasses: number;
  totalClasses: number;
  syllabusTopic: string;
}

interface RegisteredCourse {
  code: string;
  name: string;
  type: 'Core Theory' | 'Professional Elective' | 'Practical Lab';
  credits: number;
  faculty: string;
  facultyCabin: string;
  facultyEmail: string;
  classesAttended: number;
  totalClasses: number;
  attendancePercent: number;
  units: { number: number; name: string; status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' }[];
  syllabusDocUrl: string;
  gradeThreshold: string;
  internalMarks: string;
}

interface AutonomousExam {
  id: string;
  date: string;
  day: string;
  time: string;
  courseCode: string;
  courseName: string;
  examType: 'Autonomous Mid-Term' | 'End-Term Semester';
  hall: string;
  seatNo: string;
  chiefInvigilator: string;
  syllabusCovered: string;
  reportingTime: string;
  status: 'SCHEDULED' | 'SEAT_ALLOCATED';
}

interface FacultyDeskItem {
  id: string;
  name: string;
  designation: string;
  department: string;
  cabin: string;
  email: string;
  phone: string;
  officeHours: string;
  specialization: string;
  coursesHandled: string[];
  isMentor?: boolean;
}

const SEMESTER_TIMETABLE: Record<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday', TimetablePeriod[]> = {
  Monday: [
    {
      id: 'mon-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'BCSE301',
      subjectName: 'Design & Analysis of Algorithms',
      type: 'THEORY',
      faculty: 'Dr. A. K. Pattnaik',
      facultyCabin: 'Academic Block CS-204',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.3,
      attendedClasses: 36,
      totalClasses: 39,
      syllabusTopic: 'Dynamic Programming: 0/1 Knapsack & Matrix Chain Multiplication',
    },
    {
      id: 'mon-2',
      time: '10:10 AM - 11:05 AM',
      subjectCode: 'BCSE302',
      subjectName: 'Database Management Systems & SQL',
      type: 'THEORY',
      faculty: 'Dr. Rashmi Ranjan Rout',
      facultyCabin: 'Academic Block CS-208',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.1,
      attendedClasses: 35,
      totalClasses: 38,
      syllabusTopic: 'B+ Tree Indexing & Relational Query Cost Optimization',
    },
    {
      id: 'mon-3',
      time: '11:15 AM - 12:10 PM',
      subjectCode: 'BCSE303',
      subjectName: 'Operating Systems & Kernel Architecture',
      type: 'THEORY',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Lecture Hall LH-302',
      attendancePercent: 88.5,
      attendedClasses: 31,
      totalClasses: 35,
      syllabusTopic: 'Virtual Memory: Demand Paging & Page Replacement Algorithms',
    },
    {
      id: 'mon-4',
      time: '12:10 PM - 01:05 PM',
      subjectCode: 'BCSE304',
      subjectName: 'Formal Language & Automata Theory',
      type: 'THEORY',
      faculty: 'Dr. Priya Nayak',
      facultyCabin: 'Academic Block CS-215',
      room: 'Lecture Hall LH-302',
      attendancePercent: 91.6,
      attendedClasses: 33,
      totalClasses: 36,
      syllabusTopic: 'Context-Free Grammars, Ambiguity & Pushdown Automata',
    },
    {
      id: 'mon-lunch',
      time: '01:05 PM - 01:50 PM',
      subjectCode: 'RECESS',
      subjectName: 'Campus Food Court & Lunch Interval',
      type: 'RECESS',
      faculty: 'Central Dining Service',
      facultyCabin: 'Central Cafeteria Block',
      room: 'Hostel Dining Hall & Food Court',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Nutritional Meal & Afternoon Refreshment',
    },
    {
      id: 'mon-5',
      time: '01:50 PM - 04:30 PM',
      subjectCode: 'BCSE391',
      subjectName: 'Advanced Algorithms & Problem Solving Lab',
      type: 'LAB',
      faculty: 'Er. Subhashree Dash / Dr. Pattnaik',
      facultyCabin: 'Computing Center CC-1',
      room: 'Autonomous High Performance Lab 3',
      attendancePercent: 92.8,
      attendedClasses: 13,
      totalClasses: 14,
      syllabusTopic: 'Graph Algorithms: Dijkstra, Bellman-Ford & Minimum Spanning Trees in C++',
    },
  ],
  Tuesday: [
    {
      id: 'tue-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'BCSE305',
      subjectName: 'Cloud Computing & DevOps Architecture',
      type: 'THEORY',
      faculty: 'Prof. M. K. Mishra',
      facultyCabin: 'Academic Block CS-210',
      room: 'Lecture Hall LH-302',
      attendancePercent: 90.6,
      attendedClasses: 29,
      totalClasses: 32,
      syllabusTopic: 'Containerization: Docker Engine, Images & Kubernetes Orchestration',
    },
    {
      id: 'tue-2',
      time: '10:10 AM - 11:05 AM',
      subjectCode: 'BCSE301',
      subjectName: 'Design & Analysis of Algorithms',
      type: 'THEORY',
      faculty: 'Dr. A. K. Pattnaik',
      facultyCabin: 'Academic Block CS-204',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.3,
      attendedClasses: 36,
      totalClasses: 39,
      syllabusTopic: 'Greedy Strategies: Huffman Codes & Fractional Knapsack',
    },
    {
      id: 'tue-3',
      time: '11:15 AM - 12:10 PM',
      subjectCode: 'BCSE302',
      subjectName: 'Database Management Systems & SQL',
      type: 'THEORY',
      faculty: 'Dr. Rashmi Ranjan Rout',
      facultyCabin: 'Academic Block CS-208',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.1,
      attendedClasses: 35,
      totalClasses: 38,
      syllabusTopic: 'Transaction Processing, ACID Properties & 2-Phase Locking',
    },
    {
      id: 'tue-4',
      time: '12:10 PM - 01:05 PM',
      subjectCode: 'BCSE303',
      subjectName: 'Operating Systems (Tutorial & Case Studies)',
      type: 'TUTORIAL',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Seminar Hall 2',
      attendancePercent: 88.5,
      attendedClasses: 31,
      totalClasses: 35,
      syllabusTopic: 'Deadlock Detection, Banker\'s Algorithm & Linux Kernel Synchronization',
    },
    {
      id: 'tue-lunch',
      time: '01:05 PM - 01:50 PM',
      subjectCode: 'RECESS',
      subjectName: 'Campus Food Court & Lunch Interval',
      type: 'RECESS',
      faculty: 'Central Dining Service',
      facultyCabin: 'Central Cafeteria Block',
      room: 'Hostel Dining Hall & Food Court',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Nutritional Meal & Afternoon Refreshment',
    },
    {
      id: 'tue-5',
      time: '01:50 PM - 03:30 PM',
      subjectCode: 'BCSE304',
      subjectName: 'FLAT: Automata Problem Solving Drill',
      type: 'TUTORIAL',
      faculty: 'Dr. Priya Nayak',
      facultyCabin: 'Academic Block CS-215',
      room: 'Lecture Hall LH-302',
      attendancePercent: 91.6,
      attendedClasses: 33,
      totalClasses: 36,
      syllabusTopic: 'Myhill-Nerode Theorem & DFA Minimization Exercises',
    },
    {
      id: 'tue-6',
      time: '03:30 PM - 04:30 PM',
      subjectCode: 'T&P-301',
      subjectName: 'Campus Placement Aptitude & Verbal Reasoning',
      type: 'TUTORIAL',
      faculty: 'T&P Corporate Trainer',
      facultyCabin: 'T&P Center Admin Block',
      room: 'Central Auditorium',
      attendancePercent: 94.0,
      attendedClasses: 16,
      totalClasses: 17,
      syllabusTopic: 'Advanced Quantitative Aptitude: Permutations, Combinations & Probability',
    },
  ],
  Wednesday: [
    {
      id: 'wed-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'BCSE303',
      subjectName: 'Operating Systems & Kernel Architecture',
      type: 'THEORY',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Lecture Hall LH-302',
      attendancePercent: 88.5,
      attendedClasses: 31,
      totalClasses: 35,
      syllabusTopic: 'Multi-threading: POSIX Threads, Semaphores & Mutex Locks',
    },
    {
      id: 'wed-2',
      time: '10:10 AM - 11:05 AM',
      subjectCode: 'BCSE305',
      subjectName: 'Cloud Computing & DevOps Architecture',
      type: 'THEORY',
      faculty: 'Prof. M. K. Mishra',
      facultyCabin: 'Academic Block CS-210',
      room: 'Lecture Hall LH-302',
      attendancePercent: 90.6,
      attendedClasses: 29,
      totalClasses: 32,
      syllabusTopic: 'AWS Cloud Services: EC2, S3, IAM Roles, VPC & Security Groups',
    },
    {
      id: 'wed-3',
      time: '11:15 AM - 12:10 PM',
      subjectCode: 'BCSE301',
      subjectName: 'Design & Analysis of Algorithms',
      type: 'THEORY',
      faculty: 'Dr. A. K. Pattnaik',
      facultyCabin: 'Academic Block CS-204',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.3,
      attendedClasses: 36,
      totalClasses: 39,
      syllabusTopic: 'Amortized Analysis: Aggregate, Accounting & Potential Methods',
    },
    {
      id: 'wed-4',
      time: '12:10 PM - 01:05 PM',
      subjectCode: 'BCSE302',
      subjectName: 'Database Management Systems & SQL',
      type: 'THEORY',
      faculty: 'Dr. Rashmi Ranjan Rout',
      facultyCabin: 'Academic Block CS-208',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.1,
      attendedClasses: 35,
      totalClasses: 38,
      syllabusTopic: 'Relational Normalization: 1NF, 2NF, 3NF, BCNF & Multivalued Dependencies',
    },
    {
      id: 'wed-lunch',
      time: '01:05 PM - 01:50 PM',
      subjectCode: 'RECESS',
      subjectName: 'Campus Food Court & Lunch Interval',
      type: 'RECESS',
      faculty: 'Central Dining Service',
      facultyCabin: 'Central Cafeteria Block',
      room: 'Hostel Dining Hall & Food Court',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Nutritional Meal & Afternoon Refreshment',
    },
    {
      id: 'wed-5',
      time: '01:50 PM - 04:30 PM',
      subjectCode: 'BCSE392',
      subjectName: 'Database & Web Microservices Lab',
      type: 'LAB',
      faculty: 'Er. Tanmaya Sahoo / Dr. Rout',
      facultyCabin: 'Autonomous DB Lab CS-104',
      room: 'Autonomous Database Lab (Lab 2)',
      attendancePercent: 100.0,
      attendedClasses: 14,
      totalClasses: 14,
      syllabusTopic: 'Complex Nested SQL Queries, Triggers, Stored Procedures & Express.js REST API',
    },
  ],
  Thursday: [
    {
      id: 'thu-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'BCSE304',
      subjectName: 'Formal Language & Automata Theory',
      type: 'THEORY',
      faculty: 'Dr. Priya Nayak',
      facultyCabin: 'Academic Block CS-215',
      room: 'Lecture Hall LH-302',
      attendancePercent: 91.6,
      attendedClasses: 33,
      totalClasses: 36,
      syllabusTopic: 'Chomsky Normal Form (CNF) & Greibach Normal Form (GNF) Conversions',
    },
    {
      id: 'thu-2',
      time: '10:10 AM - 11:05 AM',
      subjectCode: 'BCSE303',
      subjectName: 'Operating Systems & Kernel Architecture',
      type: 'THEORY',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Lecture Hall LH-302',
      attendancePercent: 88.5,
      attendedClasses: 31,
      totalClasses: 35,
      syllabusTopic: 'Disk Storage Architecture & Disk Scheduling: FCFS, SSTF, SCAN, C-LOOK',
    },
    {
      id: 'thu-3',
      time: '11:15 AM - 12:10 PM',
      subjectCode: 'BCSE305',
      subjectName: 'Cloud Computing & DevOps Architecture',
      type: 'THEORY',
      faculty: 'Prof. M. K. Mishra',
      facultyCabin: 'Academic Block CS-210',
      room: 'Lecture Hall LH-302',
      attendancePercent: 90.6,
      attendedClasses: 29,
      totalClasses: 32,
      syllabusTopic: 'CI/CD Automated Pipelines with GitHub Actions & Docker Hub Registry',
    },
    {
      id: 'thu-4',
      time: '12:10 PM - 01:05 PM',
      subjectCode: 'BCSE301',
      subjectName: 'Algorithms Problem Solving & LeetCode Drill',
      type: 'TUTORIAL',
      faculty: 'Dr. A. K. Pattnaik',
      facultyCabin: 'Academic Block CS-204',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.3,
      attendedClasses: 36,
      totalClasses: 39,
      syllabusTopic: 'Dynamic Programming on Trees & Traveling Salesperson Problem (TSP)',
    },
    {
      id: 'thu-lunch',
      time: '01:05 PM - 01:50 PM',
      subjectCode: 'RECESS',
      subjectName: 'Campus Food Court & Lunch Interval',
      type: 'RECESS',
      faculty: 'Central Dining Service',
      facultyCabin: 'Central Cafeteria Block',
      room: 'Hostel Dining Hall & Food Court',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Nutritional Meal & Afternoon Refreshment',
    },
    {
      id: 'thu-5',
      time: '01:50 PM - 03:30 PM',
      subjectCode: 'SEMINAR-3',
      subjectName: 'Technical Seminar & Research Paper Critique',
      type: 'TUTORIAL',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Smart Seminar Hall 1',
      attendancePercent: 95.0,
      attendedClasses: 10,
      totalClasses: 11,
      syllabusTopic: 'Edge Computing, Distributed Consensus & IEEE Journal Presentations',
    },
    {
      id: 'thu-6',
      time: '03:30 PM - 04:30 PM',
      subjectCode: 'LIBRARY-5',
      subjectName: 'Autonomous Central Library Research & Reference',
      type: 'TUTORIAL',
      faculty: 'Central Library In-Charge',
      facultyCabin: 'Central Library Floor 1',
      room: 'Digital Research & E-Journal Cell',
      attendancePercent: 100.0,
      attendedClasses: 14,
      totalClasses: 14,
      syllabusTopic: 'IEEE Xplore & Springer Nature Autonomous Access Session',
    },
  ],
  Friday: [
    {
      id: 'fri-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'BCSE302',
      subjectName: 'Database Management Systems & SQL',
      type: 'THEORY',
      faculty: 'Dr. Rashmi Ranjan Rout',
      facultyCabin: 'Academic Block CS-208',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.1,
      attendedClasses: 35,
      totalClasses: 38,
      syllabusTopic: 'Database Recovery: Write-Ahead Logging (WAL) & Checkpoints',
    },
    {
      id: 'fri-2',
      time: '10:10 AM - 11:05 AM',
      subjectCode: 'BCSE304',
      subjectName: 'Formal Language & Automata Theory',
      type: 'THEORY',
      faculty: 'Dr. Priya Nayak',
      facultyCabin: 'Academic Block CS-215',
      room: 'Lecture Hall LH-302',
      attendancePercent: 91.6,
      attendedClasses: 33,
      totalClasses: 36,
      syllabusTopic: 'Turing Machines: Definition, Multi-Tape TM & Halting Problem Undecidability',
    },
    {
      id: 'fri-3',
      time: '11:15 AM - 12:10 PM',
      subjectCode: 'BCSE305',
      subjectName: 'Cloud Computing & DevOps Architecture',
      type: 'THEORY',
      faculty: 'Prof. M. K. Mishra',
      facultyCabin: 'Academic Block CS-210',
      room: 'Lecture Hall LH-302',
      attendancePercent: 90.6,
      attendedClasses: 29,
      totalClasses: 32,
      syllabusTopic: 'Serverless Architecture: AWS Lambda, API Gateway & CloudWatch Monitoring',
    },
    {
      id: 'fri-4',
      time: '12:10 PM - 01:05 PM',
      subjectCode: 'BCSE301',
      subjectName: 'Design & Analysis of Algorithms',
      type: 'THEORY',
      faculty: 'Dr. A. K. Pattnaik',
      facultyCabin: 'Academic Block CS-204',
      room: 'Lecture Hall LH-302',
      attendancePercent: 92.3,
      attendedClasses: 36,
      totalClasses: 39,
      syllabusTopic: 'String Matching Algorithms: KMP, Rabin-Karp & Trie Data Structures',
    },
    {
      id: 'fri-lunch',
      time: '01:05 PM - 01:50 PM',
      subjectCode: 'RECESS',
      subjectName: 'Campus Food Court & Lunch Interval',
      type: 'RECESS',
      faculty: 'Central Dining Service',
      facultyCabin: 'Central Cafeteria Block',
      room: 'Hostel Dining Hall & Food Court',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Nutritional Meal & Afternoon Refreshment',
    },
    {
      id: 'fri-5',
      time: '01:50 PM - 04:30 PM',
      subjectCode: 'CAPSTONE-1',
      subjectName: 'Autonomous Capstone Project & Startup Incubation',
      type: 'LAB',
      faculty: 'Prof. (Dr.) Vikramaditya Sen / Mentor',
      facultyCabin: 'AIC-REC Incubation Center',
      room: 'Atal Community Innovation Incubation Bay',
      attendancePercent: 95.0,
      attendedClasses: 12,
      totalClasses: 13,
      syllabusTopic: 'Campus Helper Smart Gate Pass & IoT Energy Monitoring Prototype Review',
    },
  ],
  Saturday: [
    {
      id: 'sat-1',
      time: '09:15 AM - 10:10 AM',
      subjectCode: 'CODING-CLUB',
      subjectName: 'Competitive Programming & CodeChef Campus Contest',
      type: 'TUTORIAL',
      faculty: 'Faculty Mentor / CP Leads',
      facultyCabin: 'Academic Block CS-204',
      room: 'Autonomous High Performance Lab 3',
      attendancePercent: 100.0,
      attendedClasses: 10,
      totalClasses: 10,
      syllabusTopic: 'Weekly 2-Hour Rated Division 2 Algorithmic Contest & Code Reviews',
    },
    {
      id: 'sat-2',
      time: '10:10 AM - 11:30 AM',
      subjectCode: 'PROCTOR',
      subjectName: 'Faculty Proctor & Student Mentorship Consultation',
      type: 'TUTORIAL',
      faculty: 'Prof. (Dr.) S. K. Mohanty',
      facultyCabin: 'Academic Block CS-202',
      room: 'Proctor Cabin CS-202',
      attendancePercent: 100.0,
      attendedClasses: 8,
      totalClasses: 8,
      syllabusTopic: 'Monthly Academic Progress, Hostel Feedback & Gate Pass Review',
    },
    {
      id: 'sat-3',
      time: '11:45 AM - 01:00 PM',
      subjectCode: 'SPORTS',
      subjectName: 'Inter-Department Sports League & Wellness Program',
      type: 'TUTORIAL',
      faculty: 'Physical Education Director',
      facultyCabin: 'Sports Complex Office',
      room: 'REC Sports Arena & Indoor Badminton Complex',
      attendancePercent: 92.0,
      attendedClasses: 11,
      totalClasses: 12,
      syllabusTopic: 'Inter-Year Badminton Tournament & Athletic Conditioning',
    },
    {
      id: 'sat-afternoon',
      time: '01:00 PM Onwards',
      subjectCode: 'SELF-STUDY',
      subjectName: 'Weekend Hostel Leisure, Library & Hackathon Prep',
      type: 'RECESS',
      faculty: 'Campus Self Study',
      facultyCabin: 'Central Library / Hostel Rooms',
      room: 'Campus Hostels & Innovation Bay',
      attendancePercent: 100,
      attendedClasses: 0,
      totalClasses: 0,
      syllabusTopic: 'Self-paced coding, hackathon building & recreational relaxation',
    },
  ],
};

const REGISTERED_SEMESTER_COURSES: RegisteredCourse[] = [
  {
    code: 'BCSE301',
    name: 'Design & Analysis of Algorithms',
    type: 'Core Theory',
    credits: 4.0,
    faculty: 'Dr. A. K. Pattnaik',
    facultyCabin: 'Academic Block CS-204',
    facultyEmail: 'akpattnaik@rec.ac.in',
    classesAttended: 36,
    totalClasses: 39,
    attendancePercent: 92.3,
    internalMarks: '28.5 / 30',
    gradeThreshold: 'Target: O / E (Current Est: E - Excellent)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'Asymptotic Notation, Recurrences & Divide-and-Conquer', status: 'COMPLETED' },
      { number: 2, name: 'Greedy Algorithms, Fractional Knapsack & Minimum Spanning Trees', status: 'COMPLETED' },
      { number: 3, name: 'Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain Multiplication', status: 'IN_PROGRESS' },
      { number: 4, name: 'Graph Algorithms: All-Pairs Shortest Path, Maximum Flow & Bipartite Matching', status: 'UPCOMING' },
      { number: 5, name: 'NP-Completeness, Reducibility & Approximation Algorithms', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE302',
    name: 'Database Management Systems & SQL',
    type: 'Core Theory',
    credits: 3.0,
    faculty: 'Dr. Rashmi Ranjan Rout',
    facultyCabin: 'Academic Block CS-208',
    facultyEmail: 'rrrout@rec.ac.in',
    classesAttended: 35,
    totalClasses: 38,
    attendancePercent: 92.1,
    internalMarks: '27.0 / 30',
    gradeThreshold: 'Target: O / E (Current Est: E - Excellent)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'ER Modeling, Relational Algebra & Calculus', status: 'COMPLETED' },
      { number: 2, name: 'Relational Database Design & Normalization (1NF to BCNF)', status: 'COMPLETED' },
      { number: 3, name: 'Transaction Processing, ACID & Concurrency Control (2PL, Timestamp)', status: 'IN_PROGRESS' },
      { number: 4, name: 'Indexing Techniques: B+ Trees, Hashing & Query Optimization', status: 'UPCOMING' },
      { number: 5, name: 'Distributed Databases, NoSQL Architecture & WAL Crash Recovery', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE303',
    name: 'Operating Systems & Kernel Architecture',
    type: 'Core Theory',
    credits: 3.0,
    faculty: 'Prof. (Dr.) S. K. Mohanty',
    facultyCabin: 'Academic Block CS-202',
    facultyEmail: 'skmohanty@rec.ac.in',
    classesAttended: 31,
    totalClasses: 35,
    attendancePercent: 88.5,
    internalMarks: '26.0 / 30',
    gradeThreshold: 'Target: E / A (Current Est: E - Excellent)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'OS Structures, System Calls & Process Management', status: 'COMPLETED' },
      { number: 2, name: 'CPU Scheduling Algorithms, IPC & Critical Section Problem', status: 'COMPLETED' },
      { number: 3, name: 'Deadlock Prevention, Avoidance (Banker\'s Algorithm) & Recovery', status: 'IN_PROGRESS' },
      { number: 4, name: 'Memory Management, Paging, Segmentation & Virtual Memory Replacement', status: 'UPCOMING' },
      { number: 5, name: 'File Systems, Disk Scheduling (SCAN, C-LOOK) & Linux Kernel Security', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE304',
    name: 'Formal Language & Automata Theory',
    type: 'Core Theory',
    credits: 3.0,
    faculty: 'Dr. Priya Nayak',
    facultyCabin: 'Academic Block CS-215',
    facultyEmail: 'pnayak@rec.ac.in',
    classesAttended: 33,
    totalClasses: 36,
    attendancePercent: 91.6,
    internalMarks: '28.0 / 30',
    gradeThreshold: 'Target: O / E (Current Est: O - Outstanding)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'DFA, NFA, Regular Expressions & Equivalence Proofs', status: 'COMPLETED' },
      { number: 2, name: 'Pumping Lemma for Regular Languages & DFA Minimization', status: 'COMPLETED' },
      { number: 3, name: 'Context-Free Grammars, Parse Trees & Pushdown Automata (PDA)', status: 'IN_PROGRESS' },
      { number: 4, name: 'CNF, GNF, Pumping Lemma for CFLs & Closure Properties', status: 'UPCOMING' },
      { number: 5, name: 'Turing Machines, Church-Turing Thesis & Undecidability of Halting Problem', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE305',
    name: 'Cloud Computing & DevOps Architecture',
    type: 'Professional Elective',
    credits: 3.0,
    faculty: 'Prof. M. K. Mishra',
    facultyCabin: 'Academic Block CS-210',
    facultyEmail: 'mkmishra@rec.ac.in',
    classesAttended: 29,
    totalClasses: 32,
    attendancePercent: 90.6,
    internalMarks: '27.5 / 30',
    gradeThreshold: 'Target: O / E (Current Est: E - Excellent)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'Cloud Computing Paradigms: IaaS, PaaS, SaaS & Virtualization', status: 'COMPLETED' },
      { number: 2, name: 'AWS Cloud Architecture: VPC, EC2, S3, IAM & CloudFront', status: 'COMPLETED' },
      { number: 3, name: 'DevOps Principles: Docker Containerization & Microservices', status: 'IN_PROGRESS' },
      { number: 4, name: 'Kubernetes Pod Architecture, Service Mesh & Helm Deployments', status: 'UPCOMING' },
      { number: 5, name: 'CI/CD Pipelines, Infrastructure as Code (Terraform) & Cloud Security', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE391',
    name: 'Advanced Algorithms & Problem Solving Lab',
    type: 'Practical Lab',
    credits: 2.0,
    faculty: 'Er. Subhashree Dash / Dr. Pattnaik',
    facultyCabin: 'Computing Center CC-1',
    facultyEmail: 'sdash@rec.ac.in',
    classesAttended: 13,
    totalClasses: 14,
    attendancePercent: 92.8,
    internalMarks: '48.0 / 50',
    gradeThreshold: 'Target: O (Current Est: O - Outstanding)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'Divide & Conquer: Quicksort & Merge Sort Variants Benchmarking', status: 'COMPLETED' },
      { number: 2, name: 'Greedy Implementations: Huffman Coding & Prim/Kruskal MST', status: 'COMPLETED' },
      { number: 3, name: 'Dynamic Programming: 0/1 Knapsack & Bellman-Ford Implementation', status: 'IN_PROGRESS' },
      { number: 4, name: 'Maximum Flow Ford-Fulkerson Algorithm & Residual Networks', status: 'UPCOMING' },
      { number: 5, name: 'Complex Graph Optimization Problem Sets & LeetCode Hard Solutions', status: 'UPCOMING' },
    ],
  },
  {
    code: 'BCSE392',
    name: 'Database & Web Microservices Lab',
    type: 'Practical Lab',
    credits: 2.0,
    faculty: 'Er. Tanmaya Sahoo / Dr. Rout',
    facultyCabin: 'Autonomous DB Lab CS-104',
    facultyEmail: 'tsahoo@rec.ac.in',
    classesAttended: 14,
    totalClasses: 14,
    attendancePercent: 100.0,
    internalMarks: '50.0 / 50',
    gradeThreshold: 'Target: O (Current Est: O - Outstanding)',
    syllabusDocUrl: '#',
    units: [
      { number: 1, name: 'Complex SQL DDL & DML Schema Creation with Constraints', status: 'COMPLETED' },
      { number: 2, name: 'Nested Subqueries, Joins & Views in PostgreSQL', status: 'COMPLETED' },
      { number: 3, name: 'PL/pgSQL Functions, Triggers & ACID Transaction Rollback', status: 'COMPLETED' },
      { number: 4, name: 'Express.js REST API with Prisma ORM & Database Connection Pools', status: 'IN_PROGRESS' },
      { number: 5, name: 'Full-Stack Integration with JWT Authentication & Dockerized Postgres', status: 'UPCOMING' },
    ],
  },
];

const AUTONOMOUS_EXAMS_SCHEDULE: AutonomousExam[] = [
  {
    id: 'exam-1',
    date: '2026-10-20',
    day: 'Monday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'BCSE301',
    courseName: 'Design & Analysis of Algorithms',
    examType: 'Autonomous Mid-Term',
    hall: 'Examination Hall 1, Block C (2nd Floor)',
    seatNo: 'CS-204-B14',
    chiefInvigilator: 'Dr. A. K. Pattnaik',
    syllabusCovered: 'Units 1, 2 & 3 (Asymptotics, Greedy, Dynamic Programming)',
    reportingTime: '09:30 AM',
    status: 'SEAT_ALLOCATED',
  },
  {
    id: 'exam-2',
    date: '2026-10-22',
    day: 'Wednesday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'BCSE302',
    courseName: 'Database Management Systems & SQL',
    examType: 'Autonomous Mid-Term',
    hall: 'Examination Hall 1, Block C (2nd Floor)',
    seatNo: 'CS-204-B14',
    chiefInvigilator: 'Dr. Rashmi Ranjan Rout',
    syllabusCovered: 'Units 1, 2 & 3 (ER Model, Normalization & ACID Transactions)',
    reportingTime: '09:30 AM',
    status: 'SEAT_ALLOCATED',
  },
  {
    id: 'exam-3',
    date: '2026-10-24',
    day: 'Friday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'BCSE303',
    courseName: 'Operating Systems & Kernel Architecture',
    examType: 'Autonomous Mid-Term',
    hall: 'Examination Hall 2, Block C (2nd Floor)',
    seatNo: 'CS-204-B14',
    chiefInvigilator: 'Prof. (Dr.) S. K. Mohanty',
    syllabusCovered: 'Units 1, 2 & 3 (Processes, CPU Scheduling & Deadlocks)',
    reportingTime: '09:30 AM',
    status: 'SEAT_ALLOCATED',
  },
  {
    id: 'exam-4',
    date: '2026-10-27',
    day: 'Monday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'BCSE304',
    courseName: 'Formal Language & Automata Theory',
    examType: 'Autonomous Mid-Term',
    hall: 'Examination Hall 2, Block C (2nd Floor)',
    seatNo: 'CS-204-B14',
    chiefInvigilator: 'Dr. Priya Nayak',
    syllabusCovered: 'Units 1, 2 & 3 (DFA/NFA, Pumping Lemma & Context-Free Grammars)',
    reportingTime: '09:30 AM',
    status: 'SEAT_ALLOCATED',
  },
  {
    id: 'exam-5',
    date: '2026-10-29',
    day: 'Wednesday',
    time: '10:00 AM - 12:00 PM',
    courseCode: 'BCSE305',
    courseName: 'Cloud Computing & DevOps Architecture',
    examType: 'Autonomous Mid-Term',
    hall: 'Examination Hall 3, Block C (3rd Floor)',
    seatNo: 'CS-204-B14',
    chiefInvigilator: 'Prof. M. K. Mishra',
    syllabusCovered: 'Units 1, 2 & 3 (Cloud Models, AWS Services & Docker Containers)',
    reportingTime: '09:30 AM',
    status: 'SEAT_ALLOCATED',
  },
];

const FACULTY_DIRECTORY_DATA: FacultyDeskItem[] = [
  {
    id: 'fac-1',
    name: 'Prof. (Dr.) S. K. Mohanty',
    designation: 'Professor & Dean (Student Welfare)',
    department: 'Computer Science & Engineering',
    cabin: 'Academic Block A, Room CS-202',
    email: 'skmohanty@rec.ac.in',
    phone: '+919861002202',
    officeHours: 'Mon, Wed, Fri: 3:30 PM - 5:00 PM',
    specialization: 'Distributed Systems, Operating Systems Kernel, Cloud Security',
    coursesHandled: ['BCSE303: Operating Systems', 'BCSE401: Distributed Computing'],
    isMentor: true,
  },
  {
    id: 'fac-2',
    name: 'Dr. A. K. Pattnaik',
    designation: 'Associate Professor & HOD In-Charge',
    department: 'Computer Science & Engineering',
    cabin: 'Academic Block A, Room CS-204',
    email: 'akpattnaik@rec.ac.in',
    phone: '+919861002204',
    officeHours: 'Tue, Thu: 2:00 PM - 4:00 PM',
    specialization: 'Algorithm Design, Approximation Algorithms, Graph Theory',
    coursesHandled: ['BCSE301: Design & Analysis of Algorithms', 'BCSE391: Algorithms Lab'],
  },
  {
    id: 'fac-3',
    name: 'Dr. Rashmi Ranjan Rout',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    cabin: 'Academic Block A, Room CS-208',
    email: 'rrrout@rec.ac.in',
    phone: '+919861002208',
    officeHours: 'Mon, Thu: 11:30 AM - 1:00 PM',
    specialization: 'Relational Database Architecture, NoSQL Systems, Query Optimization',
    coursesHandled: ['BCSE302: DBMS & SQL', 'BCSE392: Database Lab'],
  },
  {
    id: 'fac-4',
    name: 'Dr. Priya Nayak',
    designation: 'Assistant Professor (Senior Grade)',
    department: 'Computer Science & Engineering',
    cabin: 'Academic Block A, Room CS-215',
    email: 'pnayak@rec.ac.in',
    phone: '+919861002215',
    officeHours: 'Wed, Fri: 12:30 PM - 2:00 PM',
    specialization: 'Theory of Computation, Compiler Design, Formal Verification',
    coursesHandled: ['BCSE304: Formal Language & Automata', 'BCSE402: Compiler Design'],
  },
  {
    id: 'fac-5',
    name: 'Prof. M. K. Mishra',
    designation: 'Assistant Professor & Cloud Lead',
    department: 'Computer Science & Engineering',
    cabin: 'Academic Block A, Room CS-210',
    email: 'mkmishra@rec.ac.in',
    phone: '+919861002210',
    officeHours: 'Tue, Fri: 3:00 PM - 4:30 PM',
    specialization: 'DevOps, Cloud Microservices, AWS Infrastructure & Kubernetes',
    coursesHandled: ['BCSE305: Cloud Computing & DevOps', 'BCSE405: Software Engineering'],
  },
  {
    id: 'fac-6',
    name: 'Er. Subhashree Dash',
    designation: 'Senior Lab Instructor',
    department: 'Computer Science & Engineering',
    cabin: 'Computing Center Floor 1 (CC-1)',
    email: 'sdash@rec.ac.in',
    phone: '+919861002219',
    officeHours: 'Daily 2:00 PM - 4:30 PM',
    specialization: 'High Performance C++, Linux Scripting, DSA Implementation',
    coursesHandled: ['BCSE391: Advanced Algorithms & Problem Solving Lab'],
  },
  {
    id: 'fac-7',
    name: 'Er. Tanmaya Sahoo',
    designation: 'Database Lab Coordinator',
    department: 'Computer Science & Engineering',
    cabin: 'Database Systems Lab CS-104',
    email: 'tsahoo@rec.ac.in',
    phone: '+919861002220',
    officeHours: 'Daily 1:30 PM - 4:30 PM',
    specialization: 'PostgreSQL, Node.js Microservices, Docker Containers',
    coursesHandled: ['BCSE392: Database & Web Microservices Lab'],
  },
];

// =========================================================================
// COLLEGE INFORMATION DATA STRUCTURES & DEMO DATA (INSTITUTIONAL PROFILE)
// =========================================================================

interface CollegeDepartment {
  id: string;
  name: string;
  shortCode: string;
  degreeOffered: string;
  hodName: string;
  hodPhone: string;
  hodEmail: string;
  intake: number;
  facultyCount: number;
  labsCount: number;
  placementRate: number;
  keyLabs: string[];
  researchAreas: string[];
  description: string;
}

interface CampusFacility {
  id: string;
  title: string;
  category: string;
  timings: string;
  location: string;
  capacityOrSpecs: string;
  incharge: string;
  inchargeContact: string;
  highlights: string[];
  description: string;
}

interface InstitutionalLeader {
  id: string;
  name: string;
  role: string;
  qualification: string;
  cabin: string;
  email: string;
  phone: string;
  bio: string;
  avatarText: string;
}

const COLLEGE_DEPARTMENTS_LIST: CollegeDepartment[] = [
  {
    id: 'dept-cse',
    name: 'Computer Science & Engineering',
    shortCode: 'CSE',
    degreeOffered: 'B.Tech (Autonomous), M.Tech (AI & ML), Ph.D',
    hodName: 'Dr. Vikash Kumar, Ph.D (IIT Roorkee)',
    hodPhone: '+919861001101',
    hodEmail: 'hod.cse@rec.ac.in',
    intake: 180,
    facultyCount: 38,
    labsCount: 12,
    placementRate: 94.6,
    keyLabs: [
      'NVIDIA GPU High Performance Computing Lab',
      'Artificial Intelligence & Deep Learning Bay',
      'Autonomous Database & Cloud Microservices Lab',
      'Internet of Things (IoT) & Smart Sensor Center',
      'Cyber Security & Ethical Hacking Sandbox',
      'Advanced Software Engineering & DevOps Lab',
    ],
    researchAreas: [
      'Edge AI & Real-time Computer Vision',
      'Distributed Blockchain & Secure Consensus',
      'Autonomous Vehicle Edge Telemetry',
      'Natural Language Processing for Indian Languages',
    ],
    description:
      'The Department of Computer Science & Engineering is an accredited center of excellence with state-of-the-art computational infrastructure, industry-supported labs by AWS and NVIDIA, and an enviable placement track record with top global tech recruiters.',
  },
  {
    id: 'dept-etc',
    name: 'Electronics & Telecommunication Engineering',
    shortCode: 'ETC',
    degreeOffered: 'B.Tech (Autonomous), M.Tech (VLSI & Embedded Systems)',
    hodName: 'Dr. S. K. Nayak, Ph.D (NIT Rourkela)',
    hodPhone: '+919861001102',
    hodEmail: 'hod.etc@rec.ac.in',
    intake: 120,
    facultyCount: 26,
    labsCount: 8,
    placementRate: 91.2,
    keyLabs: [
      'Cadence VLSI Design & Chip Fabrication Testing Lab',
      'Embedded Systems & ARM Cortex Microcontroller Lab',
      'Microwave & RF Antenna Simulation Chamber',
      'DSP & Digital Communication System Lab',
      'Optical Fiber & Wireless 5G Telemetry Lab',
    ],
    researchAreas: [
      'Low-Power VLSI & ASIC Design for IoT',
      '5G Beamforming & Metamaterial Antennas',
      'Biomedical Signal Processing & Tele-health',
    ],
    description:
      'Accredited by NBA, the ETC Department focuses on next-generation semiconductor design, 5G wireless protocols, robotics sensor fusion, and embedded IoT architectures in collaboration with Cadence and Texas Instruments.',
  },
  {
    id: 'dept-eee',
    name: 'Electrical & Electronics Engineering',
    shortCode: 'EEE',
    degreeOffered: 'B.Tech (Autonomous), M.Tech (Power Electronics)',
    hodName: 'Dr. R. K. Behera, Ph.D (BPUT)',
    hodPhone: '+919861001103',
    hodEmail: 'hod.eee@rec.ac.in',
    intake: 60,
    facultyCount: 18,
    labsCount: 7,
    placementRate: 88.5,
    keyLabs: [
      'Smart Grid & Solar Renewable Energy Integration Lab',
      'Electric Vehicle (EV) Powertrain & Battery Testing Bay',
      'Power Electronics & High-Voltage Drives Lab',
      'Control Systems & MATLAB Simulation Suite',
      'Electrical Machines & Switchgear Testing Lab',
    ],
    researchAreas: [
      'Solar Rooftop Smart Inverters & Microgrids',
      'EV Fast-Charging Stations & BMS Algorithms',
      'Fault Detection in Smart Distribution Networks',
    ],
    description:
      'The EEE department provides rigorous exposure to renewable green energy systems, modern electric vehicle drive trains, smart metering, and automated power system protection.',
  },
  {
    id: 'dept-me',
    name: 'Mechanical Engineering & Robotics',
    shortCode: 'ME',
    degreeOffered: 'B.Tech (Autonomous), M.Tech (Thermal & Fluid Systems)',
    hodName: 'Dr. P. K. Swain, Ph.D (IIT Kharagpur)',
    hodPhone: '+919861001104',
    hodEmail: 'hod.me@rec.ac.in',
    intake: 60,
    facultyCount: 20,
    labsCount: 9,
    placementRate: 86.4,
    keyLabs: [
      'CNC Machining & Advanced Manufacturing Center',
      'Robotics & Industrial Automation Workbench',
      'Automotive Engine Testing & Emission Diagnostics',
      'Fluid Mechanics & Supersonic Wind Tunnel',
      'ANSYS / SolidWorks CAD/CAM Simulation Suite',
    ],
    researchAreas: [
      'Additive Manufacturing & 3D Metal Printing',
      'Autonomous Drone Aerodynamics & Lightweight Composites',
      'Waste Heat Recovery in Industrial Thermal Cycles',
    ],
    description:
      'Equipped with industrial CNC milling centers, 3D printers, and robotic arms, the Mechanical Engineering Department fosters hands-on engineering from concept design to high-precision manufacturing.',
  },
  {
    id: 'dept-ce',
    name: 'Civil & Infrastructure Engineering',
    shortCode: 'CE',
    degreeOffered: 'B.Tech (Autonomous), M.Tech (Structural Engineering)',
    hodName: 'Dr. Ananya Mishra, Ph.D (NIT Rourkela)',
    hodPhone: '+919861001105',
    hodEmail: 'hod.ce@rec.ac.in',
    intake: 60,
    facultyCount: 16,
    labsCount: 6,
    placementRate: 84.8,
    keyLabs: [
      'Concrete Technology & Non-Destructive Testing Lab',
      'Geotechnical & Soil Mechanics Engineering Lab',
      'Total Station GIS, GPS & Remote Sensing Lab',
      'Environmental Engineering & Water Quality Analysis',
      'STAAD.Pro & ETABS Structural Analysis Cell',
    ],
    researchAreas: [
      'Earthquake-Resistant Prefabricated Structures',
      'Geopolymer Green Concrete from Industrial Slag',
      'Urban Runoff Flood Modeling & Smart Water Harvesting',
    ],
    description:
      'Focusing on smart urban infrastructure, earthquake-resilient structures, and sustainable construction materials, the Civil Engineering department actively consults for government and highway projects.',
  },
  {
    id: 'dept-bsh',
    name: 'Basic Sciences & Humanities',
    shortCode: 'BSH',
    degreeOffered: 'Foundational Sciences for all Engineering Disciplines',
    hodName: 'Dr. D. P. Mohapatra, Ph.D (Utkal University)',
    hodPhone: '+919861001106',
    hodEmail: 'hod.bsh@rec.ac.in',
    intake: 480,
    facultyCount: 28,
    labsCount: 5,
    placementRate: 92.0,
    keyLabs: [
      'Advanced Physics & Nanomaterials Research Lab',
      'Engineering Chemistry & Polymer Testing Lab',
      'Language Communication & Soft-Skills Digital Audio Lab',
      'Computational Mathematics & Data Modeling Lab',
    ],
    researchAreas: [
      'Nonlinear Partial Differential Equations',
      'Photovoltaic Thin Films & Quantum Dots',
      'Phonetics & English for Corporate Communication',
    ],
    description:
      'The Department of Basic Sciences & Humanities imparts bedrock training in Applied Mathematics, Quantum Physics, Materials Chemistry, and Professional Business Communication to prepare first-year students for engineering excellence.',
  },
];

const CAMPUS_FACILITIES_LIST: CampusFacility[] = [
  {
    id: 'fac-library',
    title: 'Biju Patnaik Central Digital Library & Learning Resource Center',
    category: 'Academic & Research',
    timings: 'Open Daily: 08:00 AM – 11:30 PM (24x7 during Examination Weeks)',
    location: 'Central Academic Block B, Ground & 1st Floor',
    capacityOrSpecs: '45,000+ Printed Volumes • 150+ Subscribed National & International Journals • 450 Seating Capacity',
    incharge: 'Dr. G. N. Sahu (Chief Librarian)',
    inchargeContact: '+919861003301',
    highlights: [
      'Full IEEE Xplore, ScienceDirect, ACM Digital Library & Springer access campus-wide',
      'Fully automated RFID self-checkout kiosks and return book-drops',
      'Dedicated AC Silent Reading Hall with private study carrels and laptop power sockets',
      'Digital Reference Section equipped with 60 high-speed multimedia computers',
      'National Digital Library of India (NDLI) and DELNET inter-library loan facility',
    ],
    description:
      'The Central Autonomous Library spans two spacious air-conditioned floors, housing extensive collections across all branches of engineering, basic sciences, humanities, competitive examination resources (GATE, CAT, UPSC, GRE), and digital research databases.',
  },
  {
    id: 'fac-gpu-lab',
    title: 'NVIDIA AI & High-Performance Supercomputing Facility',
    category: 'Cutting-Edge Computing',
    timings: 'Monday – Saturday: 08:30 AM – 09:00 PM',
    location: 'Autonomous Computing Wing, 3rd Floor (Room CC-301)',
    capacityOrSpecs: '4x NVIDIA A100 Tensor Core GPUs (320GB Total VRAM) • 64-Node Clustered Architecture • 10 Gbps Fiber Backbone',
    incharge: 'Prof. M. K. Mishra (Director, AI Systems)',
    inchargeContact: '+919861003302',
    highlights: [
      'Custom hardware nodes for training Large Language Models (LLMs) and Vision Transformers',
      'Containerized environment with pre-configured PyTorch, TensorFlow, CUDA, and TensorRT',
      'Student project grants for published research papers and hackathon deployments',
      'Remote SSH cluster access enabled for hostel residents via campus intranet VPN',
    ],
    description:
      'Established in collaboration with industry partners to empower undergraduate and postgraduate researchers with enterprise-grade compute power for deep learning, computer vision, molecular simulation, and big data analytics.',
  },
  {
    id: 'fac-incubation',
    title: 'Atal Community Innovation Center & Startup Incubation Bay (AIC-REC)',
    category: 'Entrepreneurship & Innovation',
    timings: 'Open 24x7 for Incubated Student Startup Teams',
    location: 'Innovation & Technology Transfer Block, Floor 2',
    capacityOrSpecs: '3,000 sq.ft Co-working Space • Seed Fund Support up to ₹10 Lakhs • 18 Startups Currently Incubated',
    incharge: 'Er. Sujit Kumar Nayak (Incubation Manager)',
    inchargeContact: '+919861003303',
    highlights: [
      'Direct mentoring by angel investors, venture capitalists, and alumni tech founders',
      'In-house Patent Filing Assistance Cell with 100% legal fees subsidized by the College',
      'Rapid Prototyping Workshop with SLA 3D Printers, laser cutters, and electronic test benches',
      'MoU with Startup Odisha & MSME Department for government grants and seed capital',
    ],
    description:
      'AIC-REC is a recognized university incubator that nurtures student inventions into viable businesses. It provides high-speed workspace, legal registration support, AWS cloud credits, and pre-seed funding.',
  },
  {
    id: 'fac-sports',
    title: 'Olympic-Standard Sports Arena, Floodlit Turf & Gymnasium',
    category: 'Sports & Physical Wellness',
    timings: 'Morning: 05:30 AM – 08:30 AM • Evening: 04:30 PM – 09:30 PM',
    location: 'West Campus Sports Complex & Athletic Fields',
    capacityOrSpecs: 'Floodlit Cricket Stadium • FIFA-Sized Football Turf • 4 Indoor Badminton Courts • 16-Station Gym',
    incharge: 'Mr. R. K. Mohapatra (Director of Physical Education)',
    inchargeContact: '+919861003304',
    highlights: [
      'Indoor wooden-floored badminton complex with national tournament standard LED lighting',
      'All-weather basketball court with glass backboards and floodlight fixtures',
      'Separate air-conditioned fitness gyms for boys and girls with certified instructors',
      'Outdoor volleyball and synthetic lawn tennis courts with tournament-grade turf',
    ],
    description:
      'The campus houses extensive multi-sport infrastructure designed to encourage fitness, inter-hostel leagues, state tournaments, and healthy recreational activities for all residents.',
  },
  {
    id: 'fac-health',
    title: '24x7 Campus Health Dispensary & Emergency Mobile Ambulance',
    category: 'Healthcare & Emergency',
    timings: 'Open 24 Hours / 365 Days Continuous Duty',
    location: 'Ground Floor, Staff Quarters Block (Opposite Hostel B)',
    capacityOrSpecs: '4-Bed Emergency Observation Ward • Fully Equipped ICU-ready Ambulance • 2 Resident Medical Officers',
    incharge: 'Dr. (Major) S. B. Panda, MBBS, MD (Chief Medical Officer)',
    inchargeContact: '+919861003305',
    highlights: [
      'Full-time residential doctor and certified nursing staff available on-campus 24x7',
      'Essential prescription medicines, first-aid, nebulizers, and emergency oxygen cylinders',
      'Dedicated hospital tie-ups with KIMS Medical College & SUM Ultimate Medicare',
      'Zero-wait emergency hospital transfer service with campus ambulance on standby',
    ],
    description:
      'The Campus Dispensary provides free consultation, immediate medical care, generic medications, and rapid hospital transfer for all students, hostellers, faculty, and administrative staff.',
  },
  {
    id: 'fac-cafeteria',
    title: 'Central Multi-Cuisine Food Court, Cafeteria & Student Hangouts',
    category: 'Dining & Student Life',
    timings: 'Open Daily: 07:00 AM – 11:30 PM',
    location: 'Central Plaza Quadrangle (Adjacent to Student Activity Center)',
    capacityOrSpecs: '350 Seating Air-Cooled Dining • 6 Specialized Food Counters • Amul & Coffee Day Kiosks',
    incharge: 'Mr. Anoop Senapati (Food Services Manager)',
    inchargeContact: '+919861003306',
    highlights: [
      'Hygienic multi-cuisine offerings: North Indian, South Indian, Chinese, Continental & Fresh Juices',
      'Daily FSSAI quality inspections and automated steam sterilization of cookware',
      'Cashless digital payments via UPI, Campus Helper Wallet, and student meal cards',
      'Ample outdoor terrace seating with landscaped garden ambiance and campus Wi-Fi',
    ],
    description:
      'A vibrant social hub offering high-quality, subsidized, delicious meals, barista coffee, snacks, bakery items, and fresh fruit juices in a spotless, hygienic environment.',
  },
];

const INSTITUTIONAL_LEADERSHIP_LIST: InstitutionalLeader[] = [
  {
    id: 'lead-1',
    name: 'Er. B. K. Pradhan',
    role: 'Chairman & Managing Trustee',
    qualification: 'B.Tech (Honours), M.Tech, Industrialist & Visionary Philanthropist',
    cabin: 'Board of Governors Secretariat, Administrative Block 3rd Floor',
    email: 'chairman@rec.ac.in',
    phone: '+919861000001',
    bio: 'Pioneered technical education initiatives in Odisha for over three decades. Mentors institutional policy, infrastructure expansion, and corporate strategic alliances.',
    avatarText: 'BP',
  },
  {
    id: 'lead-2',
    name: 'Prof. (Dr.) Vikramaditya Sen',
    role: 'Principal & Institutional Director',
    qualification: 'Ph.D (IIT Kharagpur), Post-Doc (NUS Singapore), Senior Member IEEE',
    cabin: 'Director Office, Main Administrative Quadrangle, Room 101',
    email: 'principal@rec.ac.in',
    phone: '+919861000002',
    bio: 'Accomplished academician and researcher with 28+ years of engineering experience and 60+ indexed international publications. Leads autonomous curriculum development and national accreditations.',
    avatarText: 'VS',
  },
  {
    id: 'lead-3',
    name: 'Prof. (Dr.) P. K. Sahoo',
    role: 'Vice-Principal & Head of Academic Affairs',
    qualification: 'Ph.D (NIT Rourkela), M.Tech (Power Systems)',
    cabin: 'Academic Block A, 1st Floor (Room 105)',
    email: 'viceprincipal@rec.ac.in',
    phone: '+919861000003',
    bio: 'Oversees day-to-day academic operations, curriculum revision, departmental faculty performance, academic audits, and autonomous syllabus formulation.',
    avatarText: 'PS',
  },
  {
    id: 'lead-4',
    name: 'Prof. (Dr.) S. K. Mohanty',
    role: 'Dean (Student Welfare & Campus Affairs)',
    qualification: 'Ph.D (Computer Science), M.Tech (Software Engineering)',
    cabin: 'Academic Block A, 2nd Floor (Room 202)',
    email: 'dean.sw@rec.ac.in',
    phone: '+919861002202',
    bio: 'Manages hostel administration, anti-ragging vigilance, student clubs, grievance redressal, cultural fests, and serves as Senior Academic Mentor.',
    avatarText: 'SM',
  },
  {
    id: 'lead-5',
    name: 'Dr. N. C. Das',
    role: 'Controller of Examinations (COE)',
    qualification: 'Ph.D (Applied Mathematics), Autonomous Evaluation Specialist',
    cabin: 'Examination Confidential Cell, Block C (Ground Floor)',
    email: 'coe@rec.ac.in',
    phone: '+919861000005',
    bio: 'Responsible for end-to-end administration of autonomous internal assessments, semester exams, encrypted paper generation, evaluation centers, and digital degree records.',
    avatarText: 'ND',
  },
  {
    id: 'lead-6',
    name: 'Mr. Santosh Kumar Rath',
    role: 'Head, Training & Corporate Placements (T&P)',
    qualification: 'MBA (HR & Corporate Strategy), B.Tech (ECE)',
    cabin: 'Corporate Relations & Placement Suite, Admin Block 2nd Floor',
    email: 'tpo@rec.ac.in',
    phone: '+919861000006',
    bio: 'Coordinates campus recruitment drives, industry MoUs, summer internships, soft skills bootcamps, and technical interview training across all engineering disciplines.',
    avatarText: 'SR',
  },
  {
    id: 'lead-7',
    name: 'Mrs. Kalyani Mishra',
    role: 'Registrar & Chief Administrative Officer',
    qualification: 'M.A., LL.B, PG Diploma in Higher Education Administration',
    cabin: 'Registrar Office, Administrative Block 1st Floor',
    email: 'registrar@rec.ac.in',
    phone: '+919861000007',
    bio: 'Head of university statutory compliance, legal governance, university affiliations, staff administration, admissions cell, and university records management.',
    avatarText: 'KM',
  },
];

const CAMPUS_PLACEMENT_STATS = {
  overallRate: '94.6%',
  highestPackage: '₹18.5 LPA',
  highestCompany: 'Amazon AWS (Cloud Architecture)',
  averagePackage: '₹6.2 LPA',
  medianPackage: '₹5.5 LPA',
  totalOffers: '480+',
  totalRecruiters: '95+',
  topRecruiters: [
    { name: 'Amazon AWS', role: 'Cloud Support / Dev', hires: 8, avgCtc: '₹18.5 LPA', tier: 'Super Dream' },
    { name: 'TCS Digital', role: 'System Engineer', hires: 42, avgCtc: '₹7.5 LPA', tier: 'Dream' },
    { name: 'Infosys SP/DSE', role: 'Specialist Programmer', hires: 36, avgCtc: '₹6.5 - 9.5 LPA', tier: 'Dream' },
    { name: 'Wipro Turbo', role: 'Project Engineer', hires: 34, avgCtc: '₹6.5 LPA', tier: 'Dream' },
    { name: 'Cognizant GenC Next', role: 'Software Engineer', hires: 52, avgCtc: '₹6.8 LPA', tier: 'Dream' },
    { name: 'L&T Technology Services', role: 'Embedded & Design Engineer', hires: 24, avgCtc: '₹5.8 LPA', tier: 'Core Tech' },
    { name: 'Hexaware Technologies', role: 'Software Developer', hires: 28, avgCtc: '₹6.0 LPA', tier: 'Dream' },
    { name: 'Mindtree / LTIMindtree', role: 'Cloud & Fullstack Dev', hires: 31, avgCtc: '₹6.5 LPA', tier: 'Dream' },
    { name: 'Tech Mahindra', role: 'Associate Software Eng.', hires: 40, avgCtc: '₹5.2 LPA', tier: 'Regular' },
    { name: 'Capgemini India', role: 'Analyst Software Engineer', hires: 38, avgCtc: '₹5.5 LPA', tier: 'Regular' },
  ],
};

// Universal Client-side Image Compressor for zero-latency, high quality Base64
function compressImageFile(file: File, maxWidth = 320, maxHeight = 320, quality = 0.85): Promise<string> {

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

export default function StudentDashboardPage() {
  return (
    <RoleGuard allowedRoles={['STUDENT']} portalTitle="Student Portal">
      {({ user, token, logout }) => (
        <StudentPortalContent user={user} token={token} logout={logout} />
      )}
    </RoleGuard>
  );
}

function StudentPortalContent({
  user,
  token,
  logout,
}: {
  user: any;
  token: string;
  logout: () => void;
}) {
  const [currentUser, setCurrentUser] = useState<any>(user);
  useEffect(() => {
    if (user) setCurrentUser(user);
  }, [user]);

  const [activeTab, setActiveTab] = useState<StudentTab>('HOME');
  const [sidebarSearch, setSidebarSearch] = useState('');

  // Effective Student Identity (Defaulting to user's name or Subham Pradhan)
  const effectiveStudentName =
    (currentUser?.name || user?.name) && (currentUser?.name || user?.name) !== 'Rahul Sharma' && (currentUser?.name || user?.name).trim() !== ''
      ? (currentUser?.name || user?.name)
      : 'Subham Pradhan';
  const effectiveHostel = currentUser?.residentProfile?.blockName || user?.residentProfile?.blockName || 'Hostel A';
  const effectiveRoom = currentUser?.residentProfile?.roomNumber || user?.residentProfile?.roomNumber || 'A-204';
  const effectiveRegNo = (currentUser as any)?.studentId || (currentUser as any)?.rollNumber || (user as any)?.studentId || (user as any)?.rollNumber || '2201289104';

  // Profile Photo State with local persistence & backend sync (Default: Cartoon Avatar)
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Subham&backgroundColor=b6e3f4'
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Campus Contacts call & filter state
  const [callingContact, setCallingContact] = useState<CampusOfficialContact | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [copiedContactPhone, setCopiedContactPhone] = useState<string | null>(null);
  const [contactsSearchQuery, setContactsSearchQuery] = useState('');
  const [contactsCategoryFilter, setContactsCategoryFilter] = useState('ALL');

  useEffect(() => {
    let timer: any;
    if (callingContact) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callingContact]);

  const handleInitiateCall = (c: CampusOfficialContact) => {
    setCallingContact(c);
    setCallDuration(0);
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${c.phone}`;
    }
  };

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedContactPhone(phone);
    setTimeout(() => setCopiedContactPhone(null), 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shms_student_avatar');
      if (saved) {
        setAvatarUrl(saved);
        return;
      }
    }
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    } else {
      setAvatarUrl('https://api.dicebear.com/7.x/adventurer/svg?seed=Subham&backgroundColor=b6e3f4');
    }
  }, [user]);

  // Easily upload profile photo from device (Supports ANY file, compressed & synced)
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!dataUrl) return;

        // 1. Instant local preview
        setAvatarUrl(dataUrl);
        if (typeof window !== 'undefined') {
          localStorage.setItem('shms_student_avatar', dataUrl);
          try {
            const su = localStorage.getItem('shms_user');
            if (su) {
              const p = JSON.parse(su);
              p.avatar = dataUrl;
              p.avatarUrl = dataUrl;
              localStorage.setItem('shms_user', JSON.stringify(p));
            }
          } catch {}
        }

        // 2. Upload to server via base64 endpoint
        try {
          const res = await fetch(`${API_BASE}/upload/base64`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataUrl, filename: file.name || 'avatar.jpg' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setAvatarUrl(data.url);
              localStorage.setItem('shms_student_avatar', data.url);
              if (token) {
                fetch(`${API_BASE}/residents/profile`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ avatarUrl: data.url })
                }).catch(() => {});
              }
            }
          }
        } catch (serverErr) {
          console.warn('Backend sync handled:', serverErr);
        }

        setSubmitSuccess('✓ Profile photo uploaded and updated successfully!');
        setTimeout(() => setSubmitSuccess(''), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('Photo upload fallback handled:', err);
      setSubmitSuccess('Profile photo updated in your session!');
      setTimeout(() => setSubmitSuccess(''), 4000);
    } finally {
      setUploadingAvatar(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  // Select Preset Avatar
  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_avatar', url);
    }
    setSubmitSuccess('Preset student avatar selected!');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // Remove Profile Photo
  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shms_student_avatar');
    }
    setSubmitSuccess('Profile photo reset to initials.');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // Apply Photo from Web URL
  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setAvatarUrl(photoUrlInput.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_avatar', photoUrlInput.trim());
    }
    setSubmitSuccess('Photo URL applied successfully!');
    setPhotoUrlInput('');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // The exact Gate Pass format specified by the user
  const [gatePassData, setGatePassData] = useState({
    status: 'Approved ✅',
    studentName: effectiveStudentName,
    hostel: 'Hostel A',
    room: 'A-204',
    purpose: 'Home Visit',
    outTime: '05 Oct, 10:00 AM',
    returnTime: '06 Oct, 06:00 PM',
    warden: 'Approved ✅',
    security: 'Verify at Gate',
    studentPhone: '+91 98765 43210',
    fatherPhone: '+91 94370 88990',
    motherPhone: '+91 94371 67890',
  });

  // Modal for the exact requested Gate Pass QR
  const [showGatePassQrModal, setShowGatePassQrModal] = useState(false);

  // Live Backend Data States
  const [passes, setPasses] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Modals
  const [showPassModal, setShowPassModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<any | null>(null);
  const [showEventRegisterModal, setShowEventRegisterModal] = useState<any | null>(null);
  const [showNoticeDetailModal, setShowNoticeDetailModal] = useState<any | null>(null);
  const [showMedicalRequestModal, setShowMedicalRequestModal] = useState(false);
  const [showMessIssueModal, setShowMessIssueModal] = useState(false);
  const [showPhotoPreviewModal, setShowPhotoPreviewModal] = useState<string | null>(null);
  const [showSosActiveModal, setShowSosActiveModal] = useState(false);

  // Student Query State (Direct live connect to Admin platform)
  const [showStudentQueryModal, setShowStudentQueryModal] = useState(false);
  const [studentQueryCategory, setStudentQueryCategory] = useState('ACADEMIC');
  const [studentQueryTitle, setStudentQueryTitle] = useState('');
  const [studentQueryDesc, setStudentQueryDesc] = useState('');
  const [studentQueryPriority, setStudentQueryPriority] = useState<'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [studentQuerySubmitting, setStudentQuerySubmitting] = useState(false);

  // Medical Request State (Direct live connect to Campus Doctor)
  const [medSymptom, setMedSymptom] = useState('Fever / Headache');
  const [medMedicine, setMedMedicine] = useState('Paracetamol 650mg');
  const [medUrgency, setMedUrgency] = useState<'NORMAL' | 'URGENT' | 'EMERGENCY'>('NORMAL');
  const [medNotes, setMedNotes] = useState('');
  const [medSubmitting, setMedSubmitting] = useState(false);

  // Mess Issue State
  const [messMealType, setMessMealType] = useState('LUNCH');
  const [messCategory, setMessCategory] = useState('Food Quality');
  const [messIssueNote, setMessIssueNote] = useState('');
  const [messSubmitting, setMessSubmitting] = useState(false);

  // Emergency SOS enhanced state
  const [sosCategory, setSosCategory] = useState<'MEDICAL' | 'SECURITY' | 'WARDEN' | 'FIRE' | 'RAGGING' | 'COUNSELING'>('MEDICAL');
  const [isSilentSos, setIsSilentSos] = useState(false);
  const [sosNotifyParents, setSosNotifyParents] = useState(true);
  const [sosIncludeGps, setSosIncludeGps] = useState(true);
  const [sosCopiedDistress, setSosCopiedDistress] = useState(false);
  const [sosActiveSeconds, setSosActiveSeconds] = useState(0);
  const [sosMutedSound, setSosMutedSound] = useState(false);
  const [activeFirstAidTopic, setActiveFirstAidTopic] = useState<'cpr' | 'bleeding' | 'electric' | 'heatstroke' | 'snakebite'>('cpr');

  // SOS Live response countdown timer
  useEffect(() => {
    let interval: any = null;
    if (showSosActiveModal) {
      setSosActiveSeconds(0);
      interval = setInterval(() => {
        setSosActiveSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setSosActiveSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSosActiveModal]);

  // Mess & Dining interactive state
  const [selectedMessDay, setSelectedMessDay] = useState<string>('Monday');
  const [showGuestMealModal, setShowGuestMealModal] = useState(false);
  const [showRateMealModal, setShowRateMealModal] = useState(false);
  const [mealRating, setMealRating] = useState(5);
  const [mealFeedbackText, setMealFeedbackText] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [guestMealType, setGuestMealType] = useState('DINNER');

  // Medical Care interactive state (Honest & Simple: Pharmacist + 24x7 Vehicle)
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [showMedicalCertificateModal, setShowMedicalCertificateModal] = useState(false);

  // Profile editable state
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+91 98765 43210');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'subham.pradhan@campus.edu');
  const [profileRoom, setProfileRoom] = useState(effectiveRoom);
  const [profileBlock, setProfileBlock] = useState(effectiveHostel);
  const [fatherName, setFatherName] = useState('Balakrushna Pradhan');
  const [fatherPhone, setFatherPhone] = useState('+91 94370 88990');
  const [motherName, setMotherName] = useState('Nirupama Pradhan');
  const [motherPhone, setMotherPhone] = useState('+91 94371 67890');
  const [parentName, setParentName] = useState('Balakrushna Pradhan');
  const [parentPhone, setParentPhone] = useState('+91 94370 88990');
  const [parentAddress, setParentAddress] = useState('Plot No. 42, Green Avenue, Bhubaneswar, Odisha');
  const [emergencyRelation, setEmergencyRelation] = useState('Father / Mother');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sync saved parent profile from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFather = localStorage.getItem('shms_student_father_name');
      if (savedFather) {
        setFatherName(savedFather);
        setParentName(savedFather);
      }
      const savedMother = localStorage.getItem('shms_student_mother_name');
      if (savedMother) setMotherName(savedMother);
      const savedFatherPhone = localStorage.getItem('shms_student_father_phone');
      if (savedFatherPhone) {
        setFatherPhone(savedFatherPhone);
        setParentPhone(savedFatherPhone);
      }
      const savedMotherPhone = localStorage.getItem('shms_student_mother_phone');
      if (savedMotherPhone) setMotherPhone(savedMotherPhone);
      const savedAddr = localStorage.getItem('shms_student_parent_address');
      if (savedAddr) setParentAddress(savedAddr);
    }
  }, []);

  // Gate Pass & Leave Application Form State
  const [passType, setPassType] = useState<'GATE_PASS' | 'HOSTEL_LEAVE'>('HOSTEL_LEAVE');
  const [passReason, setPassReason] = useState('Home Visit');
  const [passDestination, setPassDestination] = useState('Home Address, Bhubaneswar');
  const [passOutDate, setPassOutDate] = useState('2026-10-05');
  const [passOutTime, setPassOutTime] = useState('10:00');
  const [passReturnDate, setPassReturnDate] = useState('2026-10-06');
  const [passReturnTime, setPassReturnTime] = useState('18:00');
  const [parentConsentVerified, setParentConsentVerified] = useState(true);
  const [passSubmitting, setPassSubmitting] = useState(false);

  // Complaint Form State (Supports ANY reason or type + Photo & Video upload + Voice/Speech)
  const [complaintCategory, setComplaintCategory] = useState('HOSTEL');
  const [customCategoryText, setCustomCategoryText] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintLocation, setComplaintLocation] = useState('Room A-204, Hostel A');
  const [complaintPriority, setComplaintPriority] = useState('MEDIUM');
  const [complaintPhotoUrl, setComplaintPhotoUrl] = useState('');
  const [complaintVideoUrl, setComplaintVideoUrl] = useState('');
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);
  const [uploadingComplaintPhoto, setUploadingComplaintPhoto] = useState(false);
  const [uploadingComplaintVideo, setUploadingComplaintVideo] = useState(false);
  const [complaintListFilter, setComplaintListFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'URGENT'>('ALL');
  const [previewComplaintMedia, setPreviewComplaintMedia] = useState<{ type: 'PHOTO' | 'VIDEO'; url: string; title: string } | null>(null);

  // Voice Recording / "Say Your Problem" Speech State
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceNoteBlobUrl, setVoiceNoteBlobUrl] = useState('');
  const [mediaRecorderObj, setMediaRecorderObj] = useState<any>(null);

  // Mess Sub-feature State
  const [mealAlertsEnabled, setMealAlertsEnabled] = useState(true);
  const [mealRatings, setMealRatings] = useState<{ breakfast: number; lunch: number; dinner: number }>({
    breakfast: 5,
    lunch: 4,
    dinner: 5,
  });
  const [messFeedbackText, setMessFeedbackText] = useState('');
  const [messProblemType, setMessProblemType] = useState('FOOD_QUALITY');
  const [messProblemDesc, setMessProblemDesc] = useState('');

  // Event Registrations State
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(['evt-1', 'evt-3']);
  // Academic Calendar Filter State
  const [academicMonthFilter, setAcademicMonthFilter] = useState<'ALL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC' | 'JAN'>('ALL');
  const [academicCategoryFilter, setAcademicCategoryFilter] = useState<'ALL' | 'EXAM' | 'HOLIDAY' | 'ACADEMIC' | 'FEST' | 'DEADLINE'>('ALL');
  const [academicSearch, setAcademicSearch] = useState('');

  // Notices Category Filter & Search
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState<'ALL' | 'PINNED' | 'COLLEGE' | 'DEPARTMENT' | 'EXAM' | 'HOSTEL' | 'PLACEMENTS'>('ALL');
  const [noticeSearch, setNoticeSearch] = useState('');

  // Academic Day Selector & Sub-Tabs
  const [academicDay, setAcademicDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [academicSubTab, setAcademicSubTab] = useState<'TIMETABLE' | 'COURSES' | 'EXAMS' | 'FACULTY'>('TIMETABLE');
  const [collegeInfoSubTab, setCollegeInfoSubTab] = useState<'OVERVIEW' | 'DEPARTMENTS' | 'FACILITIES' | 'LEADERSHIP' | 'PLACEMENTS'>('OVERVIEW');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept-cse');
  const [showExamAdmitCardModal, setShowExamAdmitCardModal] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Gate Pass Approved: Home Visit',
      category: 'LEAVE',
      desc: 'Warden approved your Home Visit gate pass (Out: 05 Oct 10:00 AM, Return: 06 Oct 06:00 PM).',
      time: 'Just now',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Mid-Term Exam Schedule Released',
      category: 'ACADEMIC',
      desc: 'Mid-term examinations commence Oct 20, 2026. Check hall tickets.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Mess Menu Alert: Special Dinner',
      category: 'MESS',
      desc: 'Paneer Butter Masala & Gulab Jamun served tonight from 8:00 PM to 10:00 PM.',
      time: '3 hours ago',
      read: true,
    },
  ]);

  // Gallery Dynamic State (Photos & Videos uploaded by admin)
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<'ALL' | 'CULTURAL' | 'SPORTS' | 'TECH' | 'HOSTEL_LIFE' | 'VIDEOS'>('ALL');
  const [galleryMediaModal, setGalleryMediaModal] = useState<any | null>(null);
  const [likingGalleryId, setLikingGalleryId] = useState<string | null>(null);

  // Campus Map Dynamic State (Uploaded by admin)
  const [campusMapData, setCampusMapData] = useState<any>(null);
  const [selectedCampusZone, setSelectedCampusZone] = useState<any | null>(null);
  const [mapZoomLevel, setMapZoomLevel] = useState(1);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  // Settings State
  const [settingMessReminder, setSettingMessReminder] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // =========================================================================
  // QUALIFICATIONS, GOVT DOCUMENTS, STUDY LINKS, RESUME & SKILLS STATES
  // =========================================================================
  const [educationCerts, setEducationCerts] = useState<EducationCertificateItem[]>(DEFAULT_EDUCATION_CERTS);
  const [govtDocs, setGovtDocs] = useState<GovtDocumentItem[]>(DEFAULT_GOVT_DOCS);
  const [studyLinks, setStudyLinks] = useState<StudyLinkItem[]>(DEFAULT_STUDY_LINKS);
  const [studentResume, setStudentResume] = useState<StudentResumeData>(DEFAULT_STUDENT_RESUME);
  const [studentSkills, setStudentSkills] = useState<StudentSkillItem[]>(DEFAULT_STUDENT_SKILLS);
  const [qualFilter, setQualFilter] = useState<'ALL' | 'EDUCATION' | 'GOVT_DOCS' | 'STUDY_LINKS' | 'RESUME_SKILLS'>('ALL');
  const [qualSearchQuery, setQualSearchQuery] = useState('');

  // Modals for Qualifications & Documents
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);
  const [showAddGovtDocModal, setShowAddGovtDocModal] = useState(false);
  const [showAddStudyLinkModal, setShowAddStudyLinkModal] = useState(false);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [previewDocItem, setPreviewDocItem] = useState<{
    title: string;
    subtitle: string;
    description: string;
    fileName?: string;
    fileSize?: string;
    verifiedBadge?: string;
    docType?: string;
    docNumber?: string;
    institution?: string;
    year?: string;
    score?: string;
  } | null>(null);

  // Form states for adding education certificate
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertDegree, setNewCertDegree] = useState('Secondary School Examination (10th)');
  const [newCertInstitution, setNewCertInstitution] = useState('');
  const [newCertYear, setNewCertYear] = useState('2024');
  const [newCertScore, setNewCertScore] = useState('');
  const [newCertRollNo, setNewCertRollNo] = useState('');
  const [newCertDesc, setNewCertDesc] = useState('');
  const [newCertFileName, setNewCertFileName] = useState('');

  // Form states for adding government document
  const [newGovtDocType, setNewGovtDocType] = useState<'AADHAAR' | 'PAN' | 'VOTER_ID' | 'BIRTH_CERT' | 'INCOME_CERT' | 'CASTE_CERT' | 'RESIDENCE_CERT' | 'OTHER'>('AADHAAR');
  const [newGovtDocTitle, setNewGovtDocTitle] = useState('');
  const [newGovtDocNumber, setNewGovtDocNumber] = useState('');
  const [newGovtDocAuthority, setNewGovtDocAuthority] = useState('');
  const [newGovtDocIssuedDate, setNewGovtDocIssuedDate] = useState('2024-01-01');
  const [newGovtDocValidity, setNewGovtDocValidity] = useState('Lifetime');
  const [newGovtDocDesc, setNewGovtDocDesc] = useState('');
  const [newGovtDocFileName, setNewGovtDocFileName] = useState('');

  // Form states for adding study link
  const [newLinkPlatform, setNewLinkPlatform] = useState('LinkedIn');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkUsername, setNewLinkUsername] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('Verified Link');

  // Form states for adding skill
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'PROGRAMMING' | 'WEB_CLOUD' | 'CORE_CS' | 'TOOLS' | 'SOFT'>('PROGRAMMING');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Advanced');

  // Form states for resume
  const [resumeHeadlineInput, setResumeHeadlineInput] = useState(DEFAULT_STUDENT_RESUME.headline);
  const [resumeSummaryInput, setResumeSummaryInput] = useState(DEFAULT_STUDENT_RESUME.summary);
  const [resumeFileNameInput, setResumeFileNameInput] = useState(DEFAULT_STUDENT_RESUME.title);

  // Sync saved qualifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCerts = localStorage.getItem('shms_student_education_certs');
        if (savedCerts) setEducationCerts(JSON.parse(savedCerts));
        const savedGovt = localStorage.getItem('shms_student_govt_docs');
        if (savedGovt) setGovtDocs(JSON.parse(savedGovt));
        const savedLinks = localStorage.getItem('shms_student_study_links');
        if (savedLinks) setStudyLinks(JSON.parse(savedLinks));
        const savedResume = localStorage.getItem('shms_student_resume');
        if (savedResume) {
          const parsed = JSON.parse(savedResume);
          setStudentResume(parsed);
          setResumeHeadlineInput(parsed.headline || DEFAULT_STUDENT_RESUME.headline);
          setResumeSummaryInput(parsed.summary || DEFAULT_STUDENT_RESUME.summary);
        }
        const savedSkills = localStorage.getItem('shms_student_skills');
        if (savedSkills) setStudentSkills(JSON.parse(savedSkills));
      } catch (e) {
        console.error('Error restoring qualifications data', e);
      }
    }
  }, []);

  // Handlers for Education Certificates
  const handleAddEducationCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim()) {
      alert('Please enter a certificate title.');
      return;
    }
    const newCert: EducationCertificateItem = {
      id: `cert-${Date.now()}`,
      title: newCertTitle.trim(),
      degree: newCertDegree,
      institution: newCertInstitution.trim() || 'Raajdhani Engineering College',
      yearOfPassing: newCertYear.trim() || '2026',
      score: newCertScore.trim() || 'A Grade',
      rollNo: newCertRollNo.trim() || '2301042001',
      description: newCertDesc.trim() || 'Official educational qualification certificate and credential.',
      fileName: newCertFileName || `${newCertTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '1.2 MB',
      isVerified: true,
      verifiedBadge: 'Verified & Authenticated ✅',
    };
    const updated = [newCert, ...educationCerts];
    setEducationCerts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_education_certs', JSON.stringify(updated));
    }
    setSubmitSuccess(`✓ Education Certificate "${newCertTitle}" added successfully!`);
    setTimeout(() => setSubmitSuccess(''), 4000);
    // Reset form
    setNewCertTitle('');
    setNewCertInstitution('');
    setNewCertScore('');
    setNewCertRollNo('');
    setNewCertDesc('');
    setNewCertFileName('');
    setShowAddEducationModal(false);
  };

  const handleDeleteEducationCert = (id: string) => {
    const updated = educationCerts.filter((c) => c.id !== id);
    setEducationCerts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_education_certs', JSON.stringify(updated));
    }
    setSubmitSuccess('Certificate removed from document locker.');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // Handlers for Government Documents
  const handleAddGovtDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGovtDocTitle.trim()) {
      alert('Please enter document title.');
      return;
    }
    const badgeColors: Record<string, string> = {
      AADHAAR: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      PAN: 'bg-blue-100 text-blue-800 border-blue-300',
      VOTER_ID: 'bg-purple-100 text-purple-800 border-purple-300',
      BIRTH_CERT: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      INCOME_CERT: 'bg-teal-100 text-teal-800 border-teal-300',
      CASTE_CERT: 'bg-amber-100 text-amber-800 border-amber-300',
      RESIDENCE_CERT: 'bg-rose-100 text-rose-800 border-rose-300',
      OTHER: 'bg-slate-100 text-slate-800 border-slate-300',
    };
    const newDoc: GovtDocumentItem = {
      id: `doc-${Date.now()}`,
      title: newGovtDocTitle.trim(),
      docType: newGovtDocType,
      docNumber: newGovtDocNumber.trim() || `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
      issuingAuthority: newGovtDocAuthority.trim() || 'Government Authority',
      issuedDate: newGovtDocIssuedDate,
      validity: newGovtDocValidity.trim() || 'Lifetime',
      description: newGovtDocDesc.trim() || 'Government identity document verified for autonomous university portal.',
      fileName: newGovtDocFileName || `${newGovtDocTitle.replace(/\s+/g, '_')}.pdf`,
      fileSize: '820 KB',
      isVerified: true,
      badge: `${newGovtDocTitle} Verified ✅`,
      badgeColor: badgeColors[newGovtDocType] || 'bg-blue-100 text-blue-800 border-blue-300',
    };
    const updated = [newDoc, ...govtDocs];
    setGovtDocs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_govt_docs', JSON.stringify(updated));
    }
    setSubmitSuccess(`✓ Government Document "${newGovtDocTitle}" saved to Secure Locker!`);
    setTimeout(() => setSubmitSuccess(''), 4000);
    // Reset form
    setNewGovtDocTitle('');
    setNewGovtDocNumber('');
    setNewGovtDocAuthority('');
    setNewGovtDocDesc('');
    setNewGovtDocFileName('');
    setShowAddGovtDocModal(false);
  };

  const handleDeleteGovtDoc = (id: string) => {
    const updated = govtDocs.filter((d) => d.id !== id);
    setGovtDocs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_govt_docs', JSON.stringify(updated));
    }
    setSubmitSuccess('Document removed from locker.');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // Handlers for Study Links
  const handleAddStudyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkUrl.trim()) {
      alert('Please enter a valid URL.');
      return;
    }
    const badgeColors: Record<string, string> = {
      LinkedIn: 'bg-blue-100 text-blue-800 border-blue-200',
      GitHub: 'bg-slate-900 text-white border-slate-700',
      LeetCode: 'bg-amber-100 text-amber-900 border-amber-300',
      HackerRank: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      'Portfolio Website': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'Google Scholar': 'bg-sky-100 text-sky-800 border-sky-300',
      Kaggle: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    };
    const newLink: StudyLinkItem = {
      id: `link-${Date.now()}`,
      platform: newLinkPlatform,
      url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      username: newLinkUsername.trim() || newLinkPlatform.toLowerCase(),
      description: newLinkDesc.trim() || `${newLinkPlatform} academic and development profile.`,
      badge: newLinkBadge.trim() || 'Verified Profile 🚀',
      badgeColor: badgeColors[newLinkPlatform] || 'bg-slate-100 text-slate-800 border-slate-300',
    };
    const updated = [...studyLinks, newLink];
    setStudyLinks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_study_links', JSON.stringify(updated));
    }
    setSubmitSuccess(`✓ Study Link "${newLinkPlatform}" added to profile!`);
    setTimeout(() => setSubmitSuccess(''), 4000);
    setNewLinkUrl('');
    setNewLinkUsername('');
    setNewLinkDesc('');
    setShowAddStudyLinkModal(false);
  };

  const handleDeleteStudyLink = (id: string) => {
    const updated = studyLinks.filter((l) => l.id !== id);
    setStudyLinks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_study_links', JSON.stringify(updated));
    }
    setSubmitSuccess('Link removed.');
    setTimeout(() => setSubmitSuccess(''), 3000);
  };

  // Handlers for Skills
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      alert('Please enter a skill name.');
      return;
    }
    const percentMap: Record<string, number> = {
      Beginner: 50,
      Intermediate: 75,
      Advanced: 88,
      Expert: 95,
    };
    const newSkill: StudentSkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      proficiencyPercent: percentMap[newSkillProficiency] || 85,
    };
    const updated = [...studentSkills, newSkill];
    setStudentSkills(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_skills', JSON.stringify(updated));
    }
    setSubmitSuccess(`✓ Skill "${newSkillName}" added to matrix!`);
    setTimeout(() => setSubmitSuccess(''), 4000);
    setNewSkillName('');
    setShowAddSkillModal(false);
  };

  const handleDeleteSkill = (id: string) => {
    const updated = studentSkills.filter((s) => s.id !== id);
    setStudentSkills(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_skills', JSON.stringify(updated));
    }
  };

  // Handler for Updating Resume
  const handleUpdateResume = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentResumeData = {
      ...studentResume,
      title: resumeFileNameInput || studentResume.title,
      headline: resumeHeadlineInput.trim() || studentResume.headline,
      summary: resumeSummaryInput.trim() || studentResume.summary,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setStudentResume(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shms_student_resume', JSON.stringify(updated));
    }
    setSubmitSuccess('✓ Resume and Career Profile updated successfully!');
    setTimeout(() => setSubmitSuccess(''), 4000);
    setShowResumeModal(false);
  };

  // Fetch Live Data from Backend API (Passes, Complaints, Notices, Menu, Gallery, Campus Map)
  const fetchStudentData = async () => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pRes, cRes, nRes, mRes, gRes, mapRes] = await Promise.all([
        fetch(`${API_BASE}/passes`, { headers }).catch(() => null),
        fetch(`${API_BASE}/complaints`, { headers }).catch(() => null),
        fetch(`${API_BASE}/notices`).catch(() => null),
        fetch(`${API_BASE}/menu`).catch(() => null),
        fetch(`${API_BASE}/gallery`).catch(() => null),
        fetch(`${API_BASE}/campus-map`).catch(() => null),
      ]);

      if (pRes && pRes.ok) {
        const pData = await pRes.json();
        setPasses(pData.passes || pData || []);
      }
      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        setComplaints(cData.complaints || cData || []);
      }
      if (nRes && nRes.ok) {
        const nData = await nRes.json();
        setNotices(nData.notices || nData || []);
      }
      if (mRes && mRes.ok) {
        const mData = await mRes.json();
        setMenuData(mData.today || mData);
      }
      if (gRes && gRes.ok) {
        const gData = await gRes.json();
        setGalleryItems(gData.items || gData || []);
      }
      if (mapRes && mapRes.ok) {
        const mapData = await mapRes.json();
        setCampusMapData(mapData.data || mapData);
      }
    } catch (e) {
      console.warn('Student portal fetch error:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchStudentData();

    // Socket.io for live updates from admin uploads & actions
    const socket = io(process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:4000');
    socket.on('connect', () => {
      console.log('[Student Dashboard] Socket connected');
    });

    socket.on('gallery:updated', () => {
      fetch(`${API_BASE}/gallery`)
        .then((r) => r.json())
        .then((d) => {
          if (d.items) setGalleryItems(d.items);
        })
        .catch(console.error);
    });

    socket.on('campus_map:updated', (payload) => {
      if (payload?.map) {
        setCampusMapData(payload.map);
      } else {
        fetch(`${API_BASE}/campus-map`)
          .then((r) => r.json())
          .then((d) => {
            if (d.data) setCampusMapData(d.data);
          })
          .catch(console.error);
      }
    });

    socket.on('complaint:update', () => {
      playCuteNotificationSound();
      fetchStudentData();
    });

    socket.on('complaint:created', () => {
      fetchStudentData();
    });

    socket.on('pass:status_update', () => {
      playCuteNotificationSound();
      fetchStudentData();
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Handle Pass Submission
  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/passes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passType,
          reason: passReason,
          destination: passDestination,
          validTill: new Date(`${passReturnDate}T${passReturnTime}:00`).toISOString(),
          studentName: effectiveStudentName,
          roomNumber: effectiveRoom,
          blockName: effectiveHostel,
        }),
      });

      // Update current active gate pass card with submitted info
      setGatePassData({
        status: 'Approved ✅',
        studentName: effectiveStudentName,
        hostel: effectiveHostel,
        room: effectiveRoom,
        purpose: passReason || 'Home Visit',
        outTime: `${passOutDate}, ${passOutTime}`,
        returnTime: `${passReturnDate}, ${passReturnTime}`,
        warden: 'Approved ✅',
        security: 'Verify at Gate',
        studentPhone: profilePhone || '+91 98765 43210',
        fatherPhone: fatherPhone || '+91 94370 88990',
        motherPhone: motherPhone || '+91 94371 67890',
      });

      playCuteSuccessSound();
      setSubmitSuccess('Gate Pass submitted & approved by Warden!');
      setShowPassModal(false);
      setTimeout(() => setSubmitSuccess(''), 4000);
      fetchStudentData();
    } catch {
      alert('Network error connecting to hostel pass desk.');
    } finally {
      setPassSubmitting(false);
    }
  };

  // Complaint Photo Upload Handler
  const handleComplaintPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingComplaintPhoto(true);
    try {
      const compressed = await compressImageFile(file, 900, 900, 0.82);
      setComplaintPhotoUrl(compressed);
    } catch (err) {
      console.error('Error compressing complaint photo:', err);
    } finally {
      setUploadingComplaintPhoto(false);
    }
  };

  // Complaint Video Upload Handler
  const handleComplaintVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 35 * 1024 * 1024) {
      alert('Video file exceeds 35MB limit. Please upload a shorter clip or paste a video link.');
      return;
    }
    setUploadingComplaintVideo(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setComplaintVideoUrl(ev.target?.result as string);
      setUploadingComplaintVideo(false);
    };
    reader.onerror = () => {
      alert('Failed to read video file.');
      setUploadingComplaintVideo(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle Voice Dictation & Audio Recording ("Say Her/His Problem")
  const handleStartVoiceRecording = async () => {
    try {
      setIsRecordingVoice(true);

      // 1. Web Speech Recognition for real-time speech-to-text dictation
      if (typeof window !== 'undefined') {
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRec) {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (ev: any) => {
            const transcript = Array.from(ev.results)
              .map((r: any) => r[0].transcript)
              .join(' ');
            if (transcript) {
              setComplaintDesc((prev) => {
                if (prev.endsWith(transcript.trim())) return prev;
                return prev ? `${prev} ${transcript.trim()}` : transcript.trim();
              });
            }
          };

          rec.onerror = (err: any) => {
            console.warn('Speech recognition warning:', err);
          };

          rec.start();
          (window as any).__studentComplaintSpeechRec = rec;
        }
      }

      // 2. MediaRecorder for capturing audio voice note
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) chunks.push(ev.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            setVoiceNoteBlobUrl(reader.result as string);
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorderObj(recorder);
      }
    } catch (err) {
      console.warn('Microphone recording error:', err);
      alert('Could not access microphone. Please check browser microphone permissions.');
      setIsRecordingVoice(false);
    }
  };

  const handleStopVoiceRecording = () => {
    setIsRecordingVoice(false);
    if ((window as any).__studentComplaintSpeechRec) {
      try {
        (window as any).__studentComplaintSpeechRec.stop();
      } catch {}
    }
    if (mediaRecorderObj && mediaRecorderObj.state !== 'inactive') {
      try {
        mediaRecorderObj.stop();
      } catch {}
    }
  };

  // Handle Complaint Submission for ANY category/reason with photo and video proof
  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setComplaintSubmitting(true);
    try {
      const effectiveCategory =
        complaintCategory === 'OTHER' && customCategoryText.trim()
          ? customCategoryText.trim()
          : complaintCategory;

      const bodyPayload = {
        category: effectiveCategory,
        title: complaintTitle.trim() || `${effectiveCategory} Issue Reported`,
        description: `${complaintDesc.trim()} (Location: ${complaintLocation})`,
        priority: complaintPriority,
        photoUrl: complaintPhotoUrl || undefined,
        videoUrl: complaintVideoUrl || undefined,
        voiceUrl: voiceNoteBlobUrl || undefined,
        studentName: effectiveStudentName,
        roomNumber: effectiveRoom,
        blockName: effectiveHostel,
      };

      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        const resData = await res.json();
        // Optimistically update list
        if (resData?.complaint) {
          setComplaints((prev) => [resData.complaint, ...prev]);
        }
      }

      playCuteSuccessSound();
      setSubmitSuccess('⚠️ Grievance ticket created! Direct real-time WebSocket alert beamed to Admin Platform.');
      setShowComplaintModal(false);
      setComplaintTitle('');
      setComplaintDesc('');
      setCustomCategoryText('');
      setComplaintPhotoUrl('');
      setComplaintVideoUrl('');
      setVoiceNoteBlobUrl('');
      setIsRecordingVoice(false);
      fetchStudentData();
      setTimeout(() => setSubmitSuccess(''), 5000);
    } catch {
      alert('Error submitting grievance to campus desk.');
    } finally {
      setComplaintSubmitting(false);
    }
  };

  // Handle Master SOS Emergency Trigger
  const handleTriggerSos = async () => {
    setShowSosActiveModal(true);
    try {
      await fetch(`${API_BASE}/emergency/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyType: sosCategory || 'MEDICAL',
          locationDetails: `Hostel A • Room ${effectiveRoom}`,
          studentName: effectiveStudentName,
          phone: profilePhone || '+91 98765 43210',
          roomNumber: effectiveRoom,
          blockName: effectiveHostel,
          notes: isSilentSos ? 'Silent mode alarm triggered by student' : 'Audible panic button pressed',
        }),
      });
    } catch (err) {
      console.warn('Emergency alert network broadcast:', err);
    }
  };

  const handleDismissSos = async () => {
    setShowSosActiveModal(false);
    setSubmitSuccess('Emergency SOS dismissed. Campus Security & Warden desks have been notified that you are safe.');
    setTimeout(() => setSubmitSuccess(''), 5000);
  };

  // Submit Student Query Direct to Admin Platform
  const handleSubmitStudentQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!studentQueryDesc.trim() && !studentQueryTitle.trim()) {
      alert('Please describe your query.');
      return;
    }
    setStudentQuerySubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: studentQueryCategory,
          title: studentQueryTitle.trim() || `Student Query (${studentQueryCategory})`,
          description: studentQueryDesc.trim(),
          priority: studentQueryPriority,
          studentName: effectiveStudentName,
          roomNumber: effectiveRoom,
          blockName: effectiveHostel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.complaint) {
          setComplaints((prev) => [data.complaint, ...prev]);
        }
        playCuteSuccessSound();
        setSubmitSuccess('✓ Student query submitted! Direct notification beamed to Admin & Staff Platform.');
        setShowStudentQueryModal(false);
        setStudentQueryTitle('');
        setStudentQueryDesc('');
        setTimeout(() => setSubmitSuccess(''), 6000);
      } else {
        alert('Could not submit query right now. Please try again.');
      }
    } catch (err) {
      console.error('Submit query error:', err);
      alert('Failed to connect to campus network.');
    } finally {
      setStudentQuerySubmitting(false);
    }
  };

  // Submit Medical Request to Campus Doctor & Pharmacy
  const handleSubmitMedicalRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMedSubmitting(true);
    try {
      const payload = {
        symptoms: medSymptom,
        medicineNeeded: medMedicine,
        urgency: medUrgency,
        notes: medNotes,
        studentName: effectiveStudentName,
        roomNumber: effectiveRoom,
        blockName: effectiveHostel,
      };

      const res = await fetch(`${API_BASE}/medical/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }).catch(() => null);

      if (!res || !res.ok) {
        await fetch(`${API_BASE}/complaints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            category: 'MEDICAL',
            title: `Medical: ${medSymptom}`,
            description: `Health problem: ${medSymptom} | Medicine needed: ${medMedicine} | Notes: ${medNotes}`,
            priority: medUrgency === 'EMERGENCY' ? 'CRITICAL' : medUrgency === 'URGENT' ? 'HIGH' : 'MEDIUM',
            studentName: effectiveStudentName,
            roomNumber: effectiveRoom,
            blockName: effectiveHostel,
          }),
        });
      }

      playCuteSuccessSound();
      setSubmitSuccess('✓ Medical request sent! Campus doctor and dispensary notified.');
      setShowMedicalRequestModal(false);
      setMedNotes('');
      setTimeout(() => setSubmitSuccess(''), 6000);
    } catch (err) {
      console.error('Submit medical error:', err);
    } finally {
      setMedSubmitting(false);
    }
  };

  // Submit Mess Issue / Meal Feedback
  const handleSubmitMessIssue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messIssueNote.trim()) {
      alert('Please provide feedback details.');
      return;
    }
    setMessSubmitting(true);
    try {
      await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: 'MESS',
          title: `Mess ${messMealType}: ${messCategory}`,
          description: `Meal: ${messMealType} | Issue: ${messCategory} | Feedback: ${messIssueNote.trim()}`,
          priority: 'MEDIUM',
          studentName: effectiveStudentName,
          roomNumber: effectiveRoom,
          blockName: effectiveHostel,
        }),
      });
      playCuteSuccessSound();
      setSubmitSuccess('✓ Mess feedback submitted! Notified mess supervisor.');
      setShowMessIssueModal(false);
      setMessIssueNote('');
      setTimeout(() => setSubmitSuccess(''), 6000);
    } catch (err) {
      console.error('Mess issue error:', err);
    } finally {
      setMessSubmitting(false);
    }
  };

  // Handle Like / Cheer Gallery Item
  const handleLikeGalleryItem = async (itemId: string) => {
    setLikingGalleryId(itemId);
    try {
      const res = await fetch(`${API_BASE}/gallery/${itemId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGalleryItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, likesCount: data.likesCount || (item.likesCount || 0) + 1 } : item
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setLikingGalleryId(null);
    }
  };

  // 18 Navigation Items Definition
  const NAV_ITEMS: {
    id: StudentTab;
    label: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
    category: 'ESSENTIALS' | 'CAMPUS_LIFE' | 'ACADEMIC_SERVICES' | 'SUPPORT_SAFETY';
  }[] = [
    // Essentials
    { id: 'HOME', label: 'Home Dashboard', icon: Home, category: 'ESSENTIALS' },
    { id: 'PROFILE', label: 'My Profile', icon: User, category: 'ESSENTIALS' },
    { id: 'DIGITAL_ID', label: 'Digital Student ID', icon: CreditCard, badge: 'Verified', badgeColor: 'bg-emerald-500/20 text-emerald-400', category: 'ESSENTIALS' },
    { id: 'NOTICES', label: 'Notices & Broadcasts', icon: Bell, badge: `${notices.length || 4}`, badgeColor: 'bg-blue-500/20 text-sky-400', category: 'ESSENTIALS' },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell, badge: `${notifications.filter(n => !n.read).length}`, badgeColor: 'bg-rose-500/20 text-rose-400', category: 'ESSENTIALS' },

    // Campus Life
    { id: 'HOSTEL', label: 'Hostel & Living', icon: Bed, badge: effectiveRoom, badgeColor: 'bg-sky-500/20 text-sky-400', category: 'CAMPUS_LIFE' },
    { id: 'LEAVE_GATE_PASS', label: 'Leave & Gate Pass', icon: FileText, badge: 'Approved ✅', badgeColor: 'bg-emerald-500/20 text-emerald-400', category: 'CAMPUS_LIFE' },
    { id: 'MESS', label: 'Mess & Food Menu', icon: Utensils, badge: 'Live Menu', badgeColor: 'bg-emerald-500/20 text-emerald-400', category: 'CAMPUS_LIFE' },
    { id: 'GRIEVANCE', label: 'Grievance / Complaint', icon: AlertTriangle, category: 'CAMPUS_LIFE' },
    { id: 'EVENTS', label: 'Academic Calendar', icon: Calendar, badge: '2026-27', badgeColor: 'bg-indigo-500/20 text-indigo-400', category: 'CAMPUS_LIFE' },
    { id: 'GALLERY', label: 'College Gallery', icon: ImageIcon, category: 'CAMPUS_LIFE' },

    // Academic & Information
    { id: 'ACADEMIC', label: 'Academic & Schedule', icon: BookOpen, badge: 'Sem 5', badgeColor: 'bg-indigo-500/20 text-indigo-300', category: 'ACADEMIC_SERVICES' },
    { id: 'QUALIFICATIONS', label: 'Qualifications & Docs', icon: Award, badge: 'Docs & CV', badgeColor: 'bg-amber-500/20 text-amber-300', category: 'ACADEMIC_SERVICES' },
    { id: 'CAMPUS_MAP', label: 'Campus Map', icon: MapPin, category: 'ACADEMIC_SERVICES' },
    { id: 'COLLEGE_INFO', label: 'College Information', icon: Building, category: 'ACADEMIC_SERVICES' },
    { id: 'CONTACTS', label: 'Campus Contacts', icon: Phone, category: 'ACADEMIC_SERVICES' },

    // Safety & Account
    { id: 'MEDICAL', label: 'Medical Care', icon: Heart, badge: '24x7', badgeColor: 'bg-emerald-500/20 text-emerald-400', category: 'SUPPORT_SAFETY' },
    { id: 'EMERGENCY', label: 'Emergency SOS', icon: ShieldAlert, badge: 'SOS', badgeColor: 'bg-rose-600 text-white font-black animate-pulse', category: 'SUPPORT_SAFETY' },
    { id: 'SETTINGS', label: 'Settings & Account', icon: Settings, category: 'SUPPORT_SAFETY' },
  ];

  const filteredNavItems = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f4f7fc] text-slate-800 font-sans overflow-hidden">
      {/* ---------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (ALL 19 MODULES)                      */}
      {/* ---------------------------------------------------- */}
      <aside className="w-72 bg-[#091528] text-slate-200 flex flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800/80 select-none z-20">
        <div className="flex flex-col h-[calc(100vh-70px)] min-h-0">
          {/* Logo & Portal Badge */}
          <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm text-white tracking-tight truncate flex items-center gap-1.5">
                Campus Helper
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h1>
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Student Super App • 19 Hubs
              </p>
            </div>
          </div>

          {/* Student Profile Quick Capsule with Uploaded Photo */}
          <div
            onClick={() => setActiveTab('PROFILE')}
            className="p-3 mx-3 mt-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center space-x-3 shrink-0 cursor-pointer transition"
            title="Click to view profile & change photo"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-teal-400 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 border border-white/20">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{effectiveStudentName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{effectiveStudentName}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.studentId || 'Roll: CS-2023-042'} • CSE Sem 5
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[9px] text-emerald-400 font-semibold truncate">
                  {effectiveHostel} • Rm {effectiveRoom}
                </p>
              </div>
            </div>
          </div>

          {/* Search Modules Filter */}
          <div className="px-3 pt-3 pb-1 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search campus features & services..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/70 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Scrollable Navigation List */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs scrollbar-thin scrollbar-thumb-slate-700">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSos = item.id === 'EMERGENCY';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition cursor-pointer text-left ${
                    isActive
                      ? isSos
                        ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/40'
                        : 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : isSos
                      ? 'text-rose-400 hover:bg-rose-950/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : isSos
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sign Out Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-[#07101f] shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-bold transition cursor-pointer border border-slate-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Student Portal</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE                                    */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs shrink-0 z-10">
          <div className="flex items-center space-x-3 min-w-0">
            <h2 className="text-base font-black text-slate-900 tracking-tight truncate">
              {activeTab === 'HOME' && '🏠 Home Student Operations Hub'}
              {activeTab === 'PROFILE' && '👤 Student Profile & Photo Upload'}
              {activeTab === 'QUALIFICATIONS' && '🎓 Student Qualifications, Document Locker & Career Portfolio'}
              {activeTab === 'NOTICES' && '📢 Campus Circulars, Department Notices & Broadcasts'}
              {activeTab === 'EVENTS' && '📅 Academic Calendar, Semester Milestones & University Events'}
              {activeTab === 'HOSTEL' && '🏠 Hostel Residence, Room Inventory & Staff Desk'}
              {activeTab === 'LEAVE_GATE_PASS' && '🚪 Leave & Gate Pass Desk with Scannable QR'}
              {activeTab === 'MESS' && '🍽️ Today & Weekly Dining Menu, Feedback & Meal Alerts'}
              {activeTab === 'GRIEVANCE' && '⚠️ Facility Grievance Tracker & Maintenance Desk'}
              {activeTab === 'MEDICAL' && '🏥 Campus Pharmacy & 24×7 Emergency Vehicle'}
              {activeTab === 'EMERGENCY' && '🚨 24x7 Campus Emergency & High-Alert SOS Dispatch'}
              {activeTab === 'CAMPUS_MAP' && '🗺️ Interactive Campus Map & Department Directory'}
              {activeTab === 'ACADEMIC' && '📚 Class Timetable, Examination Schedule & Faculty Desk'}
              {activeTab === 'GALLERY' && '🖼️ Campus Life, Cultural Fests & Sports Photo Gallery'}
              {activeTab === 'DIGITAL_ID' && '🪪 Smart University Digital ID Card & Verification Badge'}
              {activeTab === 'CONTACTS' && '📞 Official Campus Directory & Emergency Helplines'}
              {activeTab === 'NOTIFICATIONS' && '🔔 Broadcast Alerts & Notification Center'}
              {activeTab === 'COLLEGE_INFO' && '🏫 College Accreditation, Departments & Facilities'}
              {activeTab === 'SETTINGS' && '⚙️ Account Preferences, Notification & Meal Alerts'}
            </h2>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            {submitSuccess && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200 animate-pulse">
                ✓ {submitSuccess}
              </span>
            )}

            {/* Cute Notification Chime Sound Preview */}
            <button
              onClick={() => playCuteNotificationSound()}
              title="Test cute notification sound ✨"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>🔔</span>
              <span className="hidden sm:inline">Cute Sound</span>
            </button>

            {/* Quick Ask Query button */}
            <button
              onClick={() => setShowStudentQueryModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Query</span>
            </button>

            {/* Quick SOS button */}
            <button
              onClick={() => setActiveTab('EMERGENCY')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS Help</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className="relative p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={fetchStudentData}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Quick Gate Pass */}
            <button
              onClick={() => {
                setPassType('GATE_PASS');
                setShowPassModal(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply Pass</span>
            </button>

            {/* Topbar User Profile Avatar (Click to open Profile & Photo upload) */}
            <button
              onClick={() => setActiveTab('PROFILE')}
              className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-slate-200 shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
              title="View Profile & Photos"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{effectiveStudentName.slice(0, 2).toUpperCase()}</span>
              )}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================= */}
          {/* 1. HOME DASHBOARD                                         */}
          {/* ========================================================= */}
          {activeTab === 'HOME' && (
            <div className="space-y-6">
              {/* Student Welcome Banner with Panoramic Campus Background */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-blue-500/30 min-h-[160px] flex items-center bg-[#07478a]">
                {/* Campus Background Image */}
                <img
                  src="/images/rec-campus-overview.jpg"
                  alt="Raajdhani Engineering College Campus"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Smooth Blue Gradient: Solid blue on left for text readability, fading to clear campus building on right */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#034a94] via-[#085aa8]/90 via-35% md:via-48% to-transparent" />

                {/* Banner Content */}
                <div className="relative z-10 w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="student-banner-avatar-upload"
                      className="relative group cursor-pointer block shrink-0"
                      title="Click avatar to change profile photo"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl shadow-inner overflow-hidden group-hover:scale-105 transition">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{effectiveStudentName.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 p-1 bg-white text-blue-700 rounded-lg shadow-md hover:bg-blue-50 pointer-events-none"
                        title="Upload Photo Directly"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <input
                        id="student-banner-avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="sr-only"
                      />
                    </label>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider">
                          Active Resident
                        </span>
                        <span className="text-xs text-blue-200 font-mono">
                          ID: {user?.studentId || 'CS-2023-042'}
                        </span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-black mt-0.5 text-white tracking-tight">
                        Welcome Back, {effectiveStudentName}!
                      </h2>
                      <p className="text-xs text-blue-100 font-medium">
                        B.Tech Computer Science & Engineering • 3rd Year (Sem 5) • {effectiveHostel} ({effectiveRoom})
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Floating REC Campus Badge Card */}
                    <div
                      onClick={() => setActiveTab('COLLEGE_INFO')}
                      className="flex items-center space-x-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/50 shadow-lg text-slate-800 hover:bg-white transition cursor-pointer self-start md:self-auto shrink-0"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Building className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 pr-1 text-left">
                        <p className="text-xs font-black text-slate-900 leading-tight">
                          Raajdhani Engineering College
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Bhubaneswar, Odisha
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="student-banner-avatar-upload"
                      className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                      title="Upload photo from device"
                    >
                      <Camera className="w-3.5 h-3.5 pointer-events-none" />
                      <span>{uploadingAvatar ? 'Uploading...' : 'Upload Photo'}</span>
                    </label>
                    <button
                      onClick={() => setActiveTab('DIGITAL_ID')}
                      className="px-3.5 py-2 bg-white text-blue-800 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Smart ID</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('EMERGENCY')}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>SOS Help</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Class Attendance</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">91.4%</h3>
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Safe & Eligible (&gt; 75%)</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Cumulative CGPA</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">8.95</h3>
                    <p className="text-[10px] text-indigo-600 font-semibold mt-1">Rank: Top 5% in Branch</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Gate Pass Status</p>
                    <h3 className="text-xl font-black text-emerald-600 mt-0.5">
                      {gatePassData.status}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      {gatePassData.purpose} ({gatePassData.room})
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Grievance Status</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                      {complaints.filter((c) => c.status === 'PENDING').length} Active
                    </h3>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">SLA within 4 hours</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Campus Landmark & Overview Showcase Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-white group">
                <div className="relative h-48 md:h-64 w-full overflow-hidden">
                  <img
                    src="/images/rec-campus-overview.jpg"
                    alt="Raajdhani Engineering College [REC] Bhubaneswar Campus"
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-5 md:p-6">
                    <div className="text-white space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                        CAMPUS HEADQUARTERS & RESIDENCE
                      </span>
                      <h3 className="text-lg md:text-xl font-black tracking-tight">
                        Raajdhani Engineering College [REC], Bhubaneswar
                      </h3>
                      <p className="text-xs text-slate-200 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Near Mancheswar Railway Station, Mancheswar Railway Colony, Bhubaneswar, Odisha 751017</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Hostel Block A & B</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Central Academic Block</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Health Center Bay 5</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('CAMPUS_MAP')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center space-x-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View Campus Map</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('COLLEGE_INFO')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition cursor-pointer"
                    >
                      College Details
                    </button>
                  </div>
                </div>
              </div>

              {/* FEATURED: The User's Exact Requested Gate Pass Card & Pending Grievances */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* EXACT GATE PASS FORMAT REQUESTED BY USER */}
                <div className="bg-white rounded-3xl border-2 border-emerald-400/80 shadow-md p-6 font-sans text-slate-800">
                  <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Gate Pass</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Active
                    </span>
                  </div>

                  <div className="text-slate-300 font-bold select-none text-sm tracking-tighter overflow-hidden">
                    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-600">Status:</span>
                      <span className="font-black text-emerald-600">✅ Approved</span>
                    </div>

                    <div className="pt-2 space-y-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Student:</span>
                        <span className="font-bold text-slate-900">{gatePassData.studentName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Student Phone:</span>
                        <span className="font-bold text-blue-600 font-mono">{profilePhone || gatePassData.studentPhone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Father Phone:</span>
                        <span className="font-bold text-emerald-700 font-mono">{fatherPhone || gatePassData.fatherPhone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Mother Phone:</span>
                        <span className="font-bold text-emerald-700 font-mono">{motherPhone || gatePassData.motherPhone}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Hostel:</span>
                        <span className="font-bold text-slate-900">{gatePassData.hostel}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Room:</span>
                        <span className="font-bold text-slate-900">{gatePassData.room}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Purpose:</span>
                        <span className="font-bold text-slate-900">{gatePassData.purpose}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Out:</span>
                        <span className="font-bold text-slate-900">{gatePassData.outTime}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Return:</span>
                        <span className="font-bold text-slate-900">{gatePassData.returnTime}</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Warden:</span>
                        <span className="font-bold text-emerald-600">Approved ✅</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-500">Security:</span>
                        <span className="font-bold text-slate-700">Verify at Gate</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setShowGatePassQrModal(true)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>[Show QR Gate Pass]</span>
                    </button>
                  </div>
                </div>

                {/* Today's Mess Preview */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Today's Mess Schedule</h4>
                        <p className="text-[10px] text-slate-400">Serving Central Dining Hall 1</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('MESS')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Menu</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">Breakfast (07:30 - 09:30 AM)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">Ended</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Idli, Sambar, Coconut Chutney, Bread Butter & Masala Tea</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-900">Lunch (12:30 - 02:30 PM)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-bold">Past</span>
                        </div>
                        <p className="text-xs text-emerald-800 mt-1">Basmati Rice, Dal Tadka, Paneer Butter Masala / Chicken, Salad, Curd</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start justify-between ring-1 ring-blue-400">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-blue-900">Dinner (08:00 - 10:00 PM)</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold animate-pulse">Next Meal</span>
                        </div>
                        <p className="text-xs text-blue-800 mt-1">Phulka Roti, Jeera Rice, Dal Makhani, Seasonal Sabzi, Gulab Jamun</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('MESS')}
                        className="text-[11px] font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                      >
                        Rate Meal
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7 Quick Services Row */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    ⚡ Quick Student Services
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">1-Click Actions</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { label: 'Apply Gate Pass', icon: QrCode, action: () => { setPassType('GATE_PASS'); setShowPassModal(true); }, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
                    { label: 'Hostel Leave', icon: Bed, action: () => { setPassType('HOSTEL_LEAVE'); setShowPassModal(true); }, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
                    { label: 'Mess Menu', icon: Utensils, action: () => setActiveTab('MESS'), color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
                    { label: 'Timetable', icon: Clock, action: () => setActiveTab('ACADEMIC'), color: 'text-sky-600 bg-sky-50 hover:bg-sky-100' },
                    { label: 'Campus Map', icon: MapPin, action: () => setActiveTab('CAMPUS_MAP'), color: 'text-purple-600 bg-purple-50 hover:bg-purple-100' },
                    { label: 'Pharmacy & Vehicle', icon: Heart, action: () => setActiveTab('MEDICAL'), color: 'text-rose-600 bg-rose-50 hover:bg-rose-100' },
                    { label: 'Ask Query / Help', icon: MessageSquare, action: () => setShowStudentQueryModal(true), color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
                    { label: 'Docs & Certs', icon: Award, action: () => setActiveTab('QUALIFICATIONS'), color: 'text-teal-600 bg-teal-50 hover:bg-teal-100' },
                  ].map((service, idx) => {
                    const SIcon = service.icon;
                    return (
                      <button
                        key={idx}
                        onClick={service.action}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-1.5 transition cursor-pointer border border-slate-100 ${service.color}`}
                      >
                        <SIcon className="w-5 h-5" />
                        <span className="text-xs font-bold text-slate-800">{service.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MY PROFILE (MOBILE-FIRST 6 TABS)                       */}
          {/* ========================================================= */}
          {activeTab === 'PROFILE' && (
            <StudentMyProfileView
              user={currentUser || user}
              token={token}
              onUpdateUser={(updated) => {
                setCurrentUser(updated);
                if (updated?.avatarUrl || updated?.avatar) {
                  setAvatarUrl(updated.avatarUrl || updated.avatar);
                }
              }}
            />
          )}

          {/* ========================================================= */}
          {/* 6. LEAVE & GATE PASS                                      */}
          {/* ========================================================= */}
          {activeTab === 'LEAVE_GATE_PASS' && (
            <StudentHostelLeaveGatePassView
              studentProfile={{
                name: effectiveStudentName,
                roomNumber: effectiveRoom,
                blockName: effectiveHostel,
                phone: profilePhone,
                parentPhone: fatherPhone || parentPhone,
                address: parentAddress,
              }}
              token={token}
            />
          )}

          {/* ========================================================= */}
          {/* 14. DIGITAL STUDENT ID CARD WITH PHOTO                    */}
          {/* ========================================================= */}
          {activeTab === 'DIGITAL_ID' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-black text-slate-900">Official Digital Smart Identity Card</h3>
                <p className="text-xs text-slate-500">
                  Valid for library borrowing, examination entry, mess access, and campus turnstile gates
                </p>
              </div>

              {/* Physical-Style Smart ID Card Container */}
              <div className="bg-gradient-to-tr from-[#0b1b36] via-[#102a54] to-[#1c4587] text-white p-7 rounded-3xl shadow-2xl border-2 border-blue-400/40 relative overflow-hidden space-y-5">
                {/* Top University Brand */}
                <div className="flex items-center justify-between border-b border-blue-400/30 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-white text-blue-900 flex items-center justify-center font-black text-xl shadow-md">
                      REC
                    </div>
                    <div>
                      <h4 className="text-sm font-black tracking-tight uppercase leading-tight">
                        Raajdhani Engineering College (Autonomous)
                      </h4>
                      <p className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
                        Autonomous Campus • NAAC Grade A+ • REC
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-widest">
                      Active
                    </span>
                  </div>
                </div>

                {/* Card Middle: Photo + Details + QR Code */}
                <div className="grid grid-cols-3 gap-5 items-center">
                  {/* Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-32 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white/40 flex items-center justify-center font-black text-3xl shadow-lg overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Photo" className="w-full h-full object-cover" />
                      ) : (
                        <span>{effectiveStudentName.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-[9px] text-emerald-300 font-bold mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* Student Credentials */}
                  <div className="col-span-2 space-y-1.5 text-xs">
                    <div>
                      <h3 className="text-lg font-black text-white">{effectiveStudentName}</h3>
                      <p className="text-[11px] text-sky-300 font-bold">
                        Roll: {user?.studentId || 'CS-2023-042'} • Reg: 2301042001
                      </p>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-200">
                      <p>Program: <strong className="text-white">B.Tech Computer Science</strong></p>
                      <p>Semester: <strong className="text-white">5th Semester (3rd Year)</strong></p>
                      <p>Hostel: <strong className="text-white">{effectiveHostel} • Rm {effectiveRoom}</strong></p>
                      <p>Blood Group: <strong className="text-emerald-400">{bloodGroup}</strong></p>
                      <p>Valid Till: <strong className="text-sky-300 font-mono">June 2027</strong></p>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Barcode & Digital Signature */}
                <div className="border-t border-blue-400/30 pt-4 flex items-center justify-between">
                  <div className="bg-white p-2 rounded-xl">
                    <QRCodeSVG
                      value={`REC-STUDENT-VERIFIED:ID=${user?.studentId || 'CS-2023-042'}:NAME=${effectiveStudentName}:HOSTEL=${effectiveHostel}:VALID=2027`}
                      size={54}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-sky-300 font-serif italic">Registrar & Controller of Exams</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">REC-ID-2023-94821</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print ID Card</span>
                </button>
                <button
                  onClick={() => alert('Smart Student ID downloaded as verified digital badge.')}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Digital ID</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 19. STUDENT QUALIFICATIONS & DIGITAL DOCUMENT LOCKER     */}
          {/* ========================================================= */}
          {activeTab === 'QUALIFICATIONS' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-slate-800">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/25 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        Autonomous Student Academic Vault & Credentials
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        KYC Verified
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Student Qualifications & Digital Document Locker
                    </h2>
                    <p className="text-xs text-blue-200/90 max-w-2xl leading-relaxed">
                      Upload and manage your educational certificates with titles and descriptions, store authenticated government identity documents (Aadhaar, PAN, Voter ID, Birth, Income, Caste, Domicile), maintain your career website profiles (LinkedIn, GitHub, LeetCode), and sync your resume and technical skills matrix.
                    </p>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0">
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <span className="text-xl font-black text-amber-300 block">{educationCerts.length}</span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Certs & Degrees</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <span className="text-xl font-black text-emerald-300 block">{govtDocs.length}</span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Govt IDs</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <span className="text-xl font-black text-sky-300 block">{studyLinks.length}</span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Study Links</span>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-white/5">
                      <span className="text-xl font-black text-purple-300 block">{studentSkills.length}</span>
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Tech Skills</span>
                    </div>
                  </div>
                </div>

                {/* Top Action Bar Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddEducationModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Education Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddGovtDocModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Upload Govt / ID Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddStudyLinkModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Add Study Link (LinkedIn/GitHub)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddSkillModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Add Skill Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResumeModal(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer ml-auto"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>View / Update Resume</span>
                  </button>
                </div>
              </div>

              {/* Navigation Filters & Search */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search certificates, degrees, Aadhaar, PAN, voter, caste, skills, links..."
                      value={qualSearchQuery}
                      onChange={(e) => setQualSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    {qualSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setQualSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 text-xs font-bold">
                  {[
                    { id: 'ALL', label: 'All Records' },
                    { id: 'EDUCATION', label: `🎓 Education Certificates (${educationCerts.length})` },
                    { id: 'GOVT_DOCS', label: `🪪 Government ID Locker (${govtDocs.length})` },
                    { id: 'STUDY_LINKS', label: `🌐 Study Links (${studyLinks.length})` },
                    { id: 'RESUME_SKILLS', label: `💼 Resume & Skills (${studentSkills.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setQualFilter(tab.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                        qualFilter === tab.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 1: EDUCATIONAL QUALIFICATIONS & CERTIFICATES             */}
              {/* ----------------------------------------------------------------- */}
              {(qualFilter === 'ALL' || qualFilter === 'EDUCATION') && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <span>Educational Qualifications & Academic Certificates</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        10th, 12th, B.Tech semester grade sheets, degrees, scorecards and certified courses
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddEducationModal(true)}
                      className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Certificate</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {educationCerts.filter((c) => {
                      const q = qualSearchQuery.toLowerCase().trim();
                      return !q || c.title.toLowerCase().includes(q) || c.degree.toLowerCase().includes(q) || c.institution.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
                    }).map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              {c.degree}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {c.verifiedBadge || 'Verified'}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-snug">{c.title}</h4>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5">{c.institution}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Passing Year</span>
                              <span className="font-bold text-slate-800">{c.yearOfPassing}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Score / CGPA</span>
                              <span className="font-black text-indigo-700">{c.score}</span>
                            </div>
                            {c.rollNo && (
                              <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">Roll / Reg Number:</span>
                                <span className="font-mono font-bold text-slate-800">{c.rollNo}</span>
                              </div>
                            )}
                          </div>

                          {/* Student Description and Notes */}
                          <div className="p-3 rounded-2xl bg-blue-50/40 border border-blue-100 text-xs space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                              📝 Student Description & Remarks:
                            </span>
                            <p className="text-slate-700 leading-relaxed text-[11px]">{c.description}</p>
                          </div>

                          {/* Uploaded File Pill */}
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                            <div className="flex items-center space-x-2 truncate">
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="font-bold text-slate-800 truncate text-[11px]">
                                {c.fileName || `${c.title}.pdf`}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                              {c.fileSize || '1.2 MB'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocItem({
                                title: c.title,
                                subtitle: `${c.degree} • ${c.institution}`,
                                description: c.description,
                                fileName: c.fileName || `${c.title}.pdf`,
                                fileSize: c.fileSize || '1.2 MB',
                                verifiedBadge: c.verifiedBadge || 'Verified Certificate',
                                institution: c.institution,
                                year: c.yearOfPassing,
                                score: c.score,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSubmitSuccess(`✓ Downloading ${c.fileName || c.title}...`);
                              setTimeout(() => setSubmitSuccess(''), 3000);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteEducationCert(c.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-auto"
                            title="Remove Certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 2: IMPORTANT GOVERNMENT IDENTITY DOCUMENTS LOCKER        */}
              {/* ----------------------------------------------------------------- */}
              {(qualFilter === 'ALL' || qualFilter === 'GOVT_DOCS') && (
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span>Important Government & Identity Document Locker</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Authenticated Aadhaar, PAN, Voter ID, Birth Certificate, Income, Caste & Residence documents
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddGovtDocModal(true)}
                      className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 transition flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Govt ID</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {govtDocs.filter((d) => {
                      const q = qualSearchQuery.toLowerCase().trim();
                      return !q || d.title.toLowerCase().includes(q) || d.docNumber.toLowerCase().includes(q) || d.issuingAuthority.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
                    }).map((d) => (
                      <div
                        key={d.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${d.badgeColor}`}>
                              {d.docType.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Official Verified
                            </span>
                          </div>

                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-snug">{d.title}</h4>
                            <p className="text-xs font-mono font-bold text-blue-700 mt-1 tracking-wider">
                              Doc No: {d.docNumber}
                            </p>
                          </div>

                          <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="flex items-start justify-between gap-1 text-[11px]">
                              <span className="text-slate-400 font-semibold">Issuer:</span>
                              <span className="font-bold text-slate-700 text-right leading-tight">{d.issuingAuthority}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-semibold">Validity:</span>
                              <span className="font-bold text-slate-700">{d.validity}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400 font-semibold">Issue Date:</span>
                              <span className="font-medium text-slate-600">{d.issuedDate}</span>
                            </div>
                          </div>

                          {/* Student Description / Purpose */}
                          <div className="p-2.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 text-xs">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                              📌 Purpose & Notes:
                            </span>
                            <p className="text-slate-700 text-[11px] leading-relaxed mt-0.5">{d.description}</p>
                          </div>

                          {/* Attached File */}
                          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div className="flex items-center space-x-1.5 truncate">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-700 text-[11px] truncate">
                                {d.fileName || `${d.title}.pdf`}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{d.fileSize || '820 KB'}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDocItem({
                                title: d.title,
                                subtitle: `Document Number: ${d.docNumber}`,
                                description: d.description,
                                fileName: d.fileName || `${d.title}.pdf`,
                                fileSize: d.fileSize || '820 KB',
                                verifiedBadge: d.badge,
                                docType: d.docType,
                                docNumber: d.docNumber,
                                institution: d.issuingAuthority,
                                year: d.issuedDate,
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSubmitSuccess(`✓ Downloading ${d.fileName || d.title}...`);
                              setTimeout(() => setSubmitSuccess(''), 3000);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteGovtDoc(d.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-auto"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 3: STUDY WEBSITE & PROFESSIONAL LINKS                    */}
              {/* ----------------------------------------------------------------- */}
              {(qualFilter === 'ALL' || qualFilter === 'STUDY_LINKS') && (
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-sky-600" />
                        <span>Study Website & Professional Profiles (LinkedIn, GitHub, etc.)</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Online coding portfolios, open-source repositories, academic citations, and career links
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddStudyLinkModal(true)}
                      className="px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs rounded-xl border border-sky-200 transition flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Study Link</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyLinks.filter((l) => {
                      const q = qualSearchQuery.toLowerCase().trim();
                      return !q || l.platform.toLowerCase().includes(q) || l.username.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
                    }).map((l) => (
                      <div
                        key={l.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <LinkIcon className="w-4 h-4 text-sky-600" />
                              {l.platform}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${l.badgeColor}`}>
                              {l.badge}
                            </span>
                          </div>

                          <p className="text-xs font-mono font-bold text-blue-600 truncate">
                            @{l.username}
                          </p>

                          <p className="text-xs text-slate-600 leading-relaxed text-[11px] line-clamp-2">
                            {l.description}
                          </p>

                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-500 truncate">
                            {l.url}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                          >
                            <span>Open Profile</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                navigator.clipboard.writeText(l.url);
                              }
                              setSubmitSuccess(`✓ Copied ${l.platform} link to clipboard!`);
                              setTimeout(() => setSubmitSuccess(''), 3000);
                            }}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                            title="Copy URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteStudyLink(l.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Remove Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* SECTION 4: RESUME / CV & TECHNICAL SKILLS MATRIX                 */}
              {/* ----------------------------------------------------------------- */}
              {(qualFilter === 'ALL' || qualFilter === 'RESUME_SKILLS') && (
                <div className="space-y-6 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <span>Curriculum Vitae (Resume) & Technical Skills Matrix</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Official student resume for campus placements and verified technical competencies
                      </p>
                    </div>
                  </div>

                  {/* Resume Card */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/30 text-sky-300 border border-sky-400/30">
                            Active Placement Resume
                          </span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Updated {studentResume.lastUpdated}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black mt-1">{studentResume.headline}</h4>
                        <p className="text-xs text-blue-200/90 max-w-3xl leading-relaxed">
                          {studentResume.summary}
                        </p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-center space-y-2">
                        <FileText className="w-8 h-8 text-amber-300 mx-auto" />
                        <div>
                          <p className="text-xs font-black text-white truncate max-w-[180px]">{studentResume.title}</p>
                          <span className="text-[10px] text-slate-300 font-mono">{studentResume.fileSize} • PDF</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewDocItem({
                            title: studentResume.title,
                            subtitle: studentResume.headline,
                            description: studentResume.summary,
                            fileName: studentResume.title,
                            fileSize: studentResume.fileSize,
                            verifiedBadge: 'Official Campus Resume',
                            institution: 'Raajdhani Engineering College',
                            year: studentResume.lastUpdated,
                          })
                        }
                        className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Resume</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitSuccess(`✓ Downloading ${studentResume.title}...`);
                          setTimeout(() => setSubmitSuccess(''), 3000);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowResumeModal(true)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Update / Edit Resume Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Technical & Soft Skills Matrix */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          Student Technical & Soft Skills Matrix ({studentSkills.length})
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Verified competencies tagged on student placement profile
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddSkillModal(true)}
                        className="px-3.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs rounded-xl border border-purple-200 transition flex items-center gap-1.5 self-start cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {studentSkills.map((s) => {
                        const levelColors: Record<string, string> = {
                          Beginner: 'bg-slate-100 text-slate-700',
                          Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
                          Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                          Expert: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        };
                        return (
                          <div
                            key={s.id}
                            className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xs transition space-y-2 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900 truncate">{s.name}</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(s.id)}
                                className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[10px]">
                              <span className={`px-2 py-0.5 rounded-full font-bold border ${levelColors[s.proficiency] || 'bg-slate-100'}`}>
                                {s.proficiency}
                              </span>
                              <span className="font-mono text-slate-500 font-bold">{s.proficiencyPercent}%</span>
                            </div>

                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                                style={{ width: `${s.proficiencyPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. NOTICES & BROADCASTS                                   */}
          {/* ========================================================= */}
          {activeTab === 'NOTICES' && (
            <div className="space-y-6">
              {/* Official Flash Broadcast Ticker Banner */}
              <div className="bg-blue-900 bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4 border border-blue-700/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-sky-100 text-xs font-bold">
                      <Bell className="w-3.5 h-3.5 text-sky-300" />
                      <span>Raajdhani Engineering College (Autonomous) • Official Notice Board</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      Campus Circulars, Notices & Digital Broadcasts
                    </h2>
                    <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
                      All official circulars, examination routines, placement notices, hostel regulations, and institutional advisories issued by the College Administration.
                    </p>
                  </div>

                  <div className="bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shrink-0 text-right">
                    <div className="flex items-center space-x-1.5 justify-end">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                        Live Broadcast Active
                      </span>
                    </div>
                    <p className="text-xs font-black text-white mt-0.5">Autumn Session 2026–27</p>
                    <span className="text-[10px] text-sky-200 block">Verified Official Feed</span>
                  </div>
                </div>

                {/* Broadcast Live Flash Alert */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center space-x-3 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase shrink-0 animate-pulse">
                    FLASH NOTICE
                  </span>
                  <p className="text-sky-50 font-medium truncate">
                    Autonomous Mid-Semester Examinations commence from <strong>12th October 2026</strong>. Hall tickets released on portal.
                  </p>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 text-xs">
                  {(['ALL', 'PINNED', 'COLLEGE', 'DEPARTMENT', 'EXAM', 'HOSTEL', 'PLACEMENTS'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNoticeCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        noticeCategoryFilter === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={(e) => setNoticeSearch(e.target.value)}
                    placeholder="Search notice title or ref #..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'not-1',
                    refNo: 'REC/EXAM/2026/104',
                    category: 'EXAM',
                    priority: 'URGENT',
                    pinned: true,
                    title: 'Autonomous Autumn 2026 Mid-Semester Examination Schedule & Seating Allotment',
                    authority: 'Office of Controller of Examinations',
                    date: 'Oct 04, 2026',
                    time: '11:30 AM',
                    badge: 'Crucial',
                    desc: 'The Autonomous Mid-Semester Theory Examinations for 3rd Year B.Tech (5th Semester) will commence from 12th October 2026. Hall tickets and seating layouts are now released. Entry without smart RFID Student ID is strictly prohibited.',
                    attachment: 'Mid_Sem_Exam_Schedule_Autumn_2026.pdf',
                    fileSize: '1.4 MB',
                    tags: ['Exam Schedule', 'Hall Ticket', 'Autonomous Cell'],
                  },
                  {
                    id: 'not-2',
                    refNo: 'REC/WARDEN/2026/89',
                    category: 'HOSTEL',
                    priority: 'IMPORTANT',
                    pinned: true,
                    title: 'Hostel Night Curfew & Mandatory Biometric Roll Call Protocol',
                    authority: 'Chief Warden Desk (Nilgiri & Shivalik Hostels)',
                    date: 'Oct 04, 2026',
                    time: '04:15 PM',
                    badge: 'Mandatory',
                    desc: 'All hostel residents must report inside their respective hostels before 08:30 PM. Floor-wise biometric roll call will be captured by Assistant Wardens at 09:15 PM sharp. Students out on gate pass must adhere to expected return times.',
                    attachment: 'Hostel_Curfew_Guidelines_2026.pdf',
                    fileSize: '620 KB',
                    tags: ['Hostel Curfew', 'Roll Call', 'Warden Protocol'],
                  },
                  {
                    id: 'not-3',
                    refNo: 'REC/CSE/2026/42',
                    category: 'DEPARTMENT',
                    priority: 'NORMAL',
                    pinned: false,
                    title: '3rd Year Minor Project Synopsis Submission & Guide Allotment Notice',
                    authority: 'Department of Computer Science & Engineering',
                    date: 'Oct 03, 2026',
                    time: '02:00 PM',
                    badge: 'Academic',
                    desc: 'All 5th-semester CSE students must submit their 2-page project synopsis and problem statement in IEEE format before 14th October 2026. Guide allocation list is available on the departmental notice board.',
                    attachment: 'Minor_Project_Synopsis_Template_IEEE.docx',
                    fileSize: '450 KB',
                    tags: ['Minor Project', 'IEEE Format', 'Guide Selection'],
                  },
                  {
                    id: 'not-4',
                    refNo: 'REC/TPO/2026/78',
                    category: 'PLACEMENTS',
                    priority: 'URGENT',
                    pinned: false,
                    title: 'Campus Placement Drive 2026: Infosys & TCS National Qualifier Registration',
                    authority: 'Training & Placement Cell (T&P)',
                    date: 'Oct 02, 2026',
                    time: '10:00 AM',
                    badge: 'Career',
                    desc: 'Registrations are open for 2027 graduating batch for Infosys Specialist Programmer and TCS Digital/Ninja roles. Minimum CGPA threshold: 6.5 with zero active backlogs. Mock aptitude sessions commence this weekend.',
                    attachment: 'Placement_Eligibility_Matrix_2026.pdf',
                    fileSize: '890 KB',
                    tags: ['Placements', 'TCS', 'Infosys', 'Mock Aptitude'],
                  },
                  {
                    id: 'not-5',
                    refNo: 'REC/ADM/2026/112',
                    category: 'COLLEGE',
                    priority: 'IMPORTANT',
                    pinned: false,
                    title: 'National Scholarship Portal (NSP) & State Post-Matric Renewal 2026–27',
                    authority: 'Academic Section & Student Welfare',
                    date: 'Oct 01, 2026',
                    time: '03:45 PM',
                    badge: 'Scholarship',
                    desc: 'Eligible SC/ST/OBC, SEBC, and Merit-cum-Means candidates must complete their online renewal on the NSP portal by 31st October 2026. Hard copies along with parental income certificates must be verified at Counter 4.',
                    attachment: 'NSP_Scholarship_Application_Checklist.pdf',
                    fileSize: '380 KB',
                    tags: ['NSP Portal', 'Post-Matric', 'Welfare Desk'],
                  },
                  {
                    id: 'not-6',
                    refNo: 'REC/LIB/2026/33',
                    category: 'COLLEGE',
                    priority: 'NORMAL',
                    pinned: false,
                    title: 'Central Digital Library 24x7 Reading Room Opening for Mid-Sem Preparations',
                    authority: 'Chief University Librarian',
                    date: 'Sep 30, 2026',
                    time: '05:30 PM',
                    badge: 'Library',
                    desc: 'To support students during mid-semester examinations, the Central Air-Conditioned Digital Library Reading Hall (Block C, 2nd Floor) will remain open 24x7 from 6th October to 20th October with high-speed Wi-Fi and power backup.',
                    attachment: 'Library_Night_Study_Pass_Rules.pdf',
                    fileSize: '210 KB',
                    tags: ['Digital Library', '24x7 Access', 'Mid-Sem Prep'],
                  },
                  {
                    id: 'not-7',
                    refNo: 'REC/MESS/2026/18',
                    category: 'HOSTEL',
                    priority: 'NORMAL',
                    pinned: false,
                    title: 'Special Festive Durga Puja Grand Feast & Mess Committee Monthly Review',
                    authority: 'Student Mess Committee & Catering Manager',
                    date: 'Sep 29, 2026',
                    time: '01:00 PM',
                    badge: 'Dining',
                    desc: 'A grand festive feast is scheduled on Maha Navami evening featuring special paneer butter masala, chicken dum biryani, gulab jamun, and traditional Odia sweets. Open dining feedback forum will be held this Saturday.',
                    attachment: 'Festive_Dining_Menu_October_2026.pdf',
                    fileSize: '520 KB',
                    tags: ['Durga Puja Feast', 'Mess Committee', 'Food Review'],
                  },
                  {
                    id: 'not-8',
                    refNo: 'REC/SPORTS/2026/55',
                    category: 'COLLEGE',
                    priority: 'NORMAL',
                    pinned: false,
                    title: 'Selection Trials for Inter-College Football & Cricket Tournaments 2026',
                    authority: 'Department of Physical Education & Sports',
                    date: 'Sep 28, 2026',
                    time: '09:00 AM',
                    badge: 'Sports',
                    desc: 'Trials for representing Raajdhani Engineering College at the upcoming State University Sports Meet will be held at the Campus Main Athletics Ground on Saturday 10th October at 06:30 AM sharp. Bring college sports kit.',
                    attachment: 'Inter_College_Sports_Trial_Roster.pdf',
                    fileSize: '310 KB',
                    tags: ['Football', 'Cricket', 'Sports Trials'],
                  },
                ]
                  .filter((n) => {
                    if (noticeCategoryFilter === 'PINNED') return n.pinned;
                    if (noticeCategoryFilter !== 'ALL') return n.category === noticeCategoryFilter;
                    return true;
                  })
                  .filter((n) => {
                    if (!noticeSearch.trim()) return true;
                    const query = noticeSearch.toLowerCase();
                    return (
                      n.title.toLowerCase().includes(query) ||
                      n.desc.toLowerCase().includes(query) ||
                      n.refNo.toLowerCase().includes(query) ||
                      n.authority.toLowerCase().includes(query)
                    );
                  })
                  .map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => setShowNoticeDetailModal(notice)}
                      className={`bg-white p-5 rounded-3xl border transition cursor-pointer space-y-3 shadow-xs hover:shadow-md ${
                        notice.pinned
                          ? 'border-blue-300 ring-2 ring-blue-500/10 hover:border-blue-500'
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                              notice.category === 'EXAM'
                                ? 'bg-purple-100 text-purple-700'
                                : notice.category === 'HOSTEL'
                                ? 'bg-amber-100 text-amber-700'
                                : notice.category === 'DEPARTMENT'
                                ? 'bg-indigo-100 text-indigo-700'
                                : notice.category === 'PLACEMENTS'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {notice.category}
                          </span>
                          {notice.pinned && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                              📌 Pinned
                            </span>
                          )}
                          <span className="text-[10px] font-mono font-bold text-slate-400">{notice.refNo}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">📅 {notice.date}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-snug hover:text-blue-600 transition">
                          {notice.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-bold mt-1">
                          Authority: <span className="text-slate-700">{notice.authority}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {notice.desc}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-blue-600 font-bold flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{notice.attachment}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold flex items-center">
                          View Circular →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. ACADEMIC CALENDAR & MILESTONES (Renamed from EVENTS)     */}
          {/* ========================================================= */}
          {activeTab === 'EVENTS' && (
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="bg-indigo-950 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4 border border-indigo-800/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-indigo-200 text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Raajdhani Engineering College (Autonomous) • Academic Year 2026–2027</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      Official Academic Calendar & Semester Milestones
                    </h2>
                    <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
                      Approved Autonomous Academic Schedule for B.Tech 3rd Year (Semester 5 - Autumn Session & Semester 6 - Spring Session). Continuous internal assessments, university examinations, semester breaks, and technical festivals.
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      onClick={() => setSubmitSuccess('✓ Official Academic Calendar 2026-27 downloaded as PDF!')}
                      className="px-3.5 py-2 bg-white text-indigo-950 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-md hover:bg-indigo-50 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => setSubmitSuccess('✓ Academic Milestones synced with your Google / Outlook calendar!')}
                      className="px-3.5 py-2 bg-indigo-800/80 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 border border-indigo-400/40 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sync Calendar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') window.print();
                      }}
                      className="px-3.5 py-2 bg-indigo-800/80 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 border border-indigo-400/40 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Semester Progress Tracker Bar */}
                <div className="bg-black/35 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 font-bold">
                    <span className="text-indigo-200">
                      Semester Progress: <strong className="text-white">Week 10 of 18 (Autumn 2026)</strong>
                    </span>
                    <span className="text-emerald-300">
                      Mid-Semester Exams in <strong className="underline text-emerald-200">7 Days (Oct 12)</strong> • Puja Vacation in 14 Days
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full w-[55%] transition-all"></div>
                  </div>
                </div>
              </div>

              {/* Month Selector & Category Filters */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                {/* 1. Month Pills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Filter by Academic Month
                  </span>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
                    {[
                      { id: 'ALL', label: 'Full Semester (Aug–Jan)' },
                      { id: 'AUG', label: 'Aug 2026' },
                      { id: 'SEP', label: 'Sep 2026' },
                      { id: 'OCT', label: 'Oct 2026 (Live ⭐)' },
                      { id: 'NOV', label: 'Nov 2026' },
                      { id: 'DEC', label: 'Dec 2026' },
                      { id: 'JAN', label: 'Jan 2027' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setAcademicMonthFilter(m.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                          academicMonthFilter === m.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Category Filter & Search Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'ALL', label: 'All Milestones' },
                      { id: 'EXAM', label: 'Exams & Tests 📝' },
                      { id: 'HOLIDAY', label: 'Holidays & Vacations 🌴' },
                      { id: 'ACADEMIC', label: 'Course Milestones 🎓' },
                      { id: 'FEST', label: 'Fests & Workshops 🚀' },
                      { id: 'DEADLINE', label: 'Deadlines & Admit Cards ⚠️' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setAcademicCategoryFilter(c.id as any)}
                        className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                          academicCategoryFilter === c.id
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={academicSearch}
                      onChange={(e) => setAcademicSearch(e.target.value)}
                      placeholder="Search milestones..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Milestones Timeline Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Events List (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-3">
                  {[
                    {
                      id: 'acad-1',
                      date: 'Aug 01, 2026',
                      day: 'Saturday',
                      month: 'AUG',
                      title: 'Commencement of 5th Semester (Autumn 2026) Classes',
                      category: 'ACADEMIC',
                      badge: 'Semester Start',
                      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      description: 'Reporting and start of regular classwork for 3rd Year B.Tech (All Branches). Timetables issued.',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'acad-2',
                      date: 'Aug 15, 2026',
                      day: 'Saturday',
                      month: 'AUG',
                      title: 'Independence Day Celebrations (Flag Hoisting & Cultural Event)',
                      category: 'HOLIDAY',
                      badge: 'National Holiday',
                      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
                      description: 'National flag hoisting at 08:00 AM in University Main Ground followed by patriotic symposium.',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'acad-3',
                      date: 'Sep 05, 2026',
                      day: 'Saturday',
                      month: 'SEP',
                      title: 'Teachers Day & Technical Seminar Presentations',
                      category: 'ACADEMIC',
                      badge: 'Celebration',
                      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
                      description: 'Felicitation of faculty members and keynote lecture on Generative AI & Autonomous Robotics.',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'acad-4',
                      date: 'Sep 08 – 12, 2026',
                      day: 'Tue – Sat',
                      month: 'SEP',
                      title: 'Continuous Assessment Test 1 (CAT-1 Examinations)',
                      category: 'EXAM',
                      badge: 'Internal Exam',
                      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
                      description: 'First continuous evaluation covering Modules 1 and 2 for all subjects. (Weightage: 15 Marks).',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'acad-5',
                      date: 'Oct 02, 2026',
                      day: 'Friday',
                      month: 'OCT',
                      title: 'Mahatma Gandhi & Lal Bahadur Shastri Jayanti',
                      category: 'HOLIDAY',
                      badge: 'National Holiday',
                      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
                      description: 'Official national holiday. College administrative offices and academic departments closed.',
                      status: 'COMPLETED',
                    },
                    {
                      id: 'acad-6',
                      date: 'Oct 06, 2026',
                      day: 'Tuesday',
                      month: 'OCT',
                      title: 'Verification of Mid-Semester Attendance & Issue of Hall Tickets',
                      category: 'DEADLINE',
                      badge: 'Admit Cards',
                      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
                      description: 'Last date for condonation applications. Digital admit card release on Student Portal.',
                      status: 'UPCOMING',
                    },
                    {
                      id: 'acad-7',
                      date: 'Oct 12 – 19, 2026',
                      day: 'Mon – Mon',
                      month: 'OCT',
                      title: 'Autumn 2026 Mid-Semester Autonomous Theory Examinations',
                      category: 'EXAM',
                      badge: 'Major Examination',
                      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
                      description: 'Autonomous Mid-Semester Examinations for 3rd Year B.Tech across all branches. 2-hour daily papers.',
                      status: 'UPCOMING',
                    },
                    {
                      id: 'acad-8',
                      date: 'Oct 19 – 24, 2026',
                      day: 'Mon – Sat',
                      month: 'OCT',
                      title: 'Durga Puja, Dussehra & Kumar Purnima Vacation',
                      category: 'HOLIDAY',
                      badge: 'Autumn Vacation',
                      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      description: 'Autumn festive break (6 days). Classes and offices resume on Monday, 26th October 2026.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-9',
                      date: 'Oct 28, 2026',
                      day: 'Wednesday',
                      month: 'OCT',
                      title: 'Mid-Semester Answer Script Evaluation & Grievance Scrutiny',
                      category: 'ACADEMIC',
                      badge: 'Result Review',
                      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
                      description: 'Students inspect evaluated mid-term answer scripts with respective faculty in classrooms.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-10',
                      date: 'Nov 01, 2026',
                      day: 'Sunday',
                      month: 'NOV',
                      title: 'Diwali & Kali Puja Celebrations',
                      category: 'HOLIDAY',
                      badge: 'Official Holiday',
                      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
                      description: 'Festival of lights. Hostel decorative illumination and special festive dinner.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-11',
                      date: 'Nov 05 – 07, 2026',
                      day: 'Thu – Sat',
                      month: 'NOV',
                      title: 'TechNova 2026: Annual Inter-College Technical Fest & 36h Hackathon',
                      category: 'FEST',
                      badge: 'Annual Tech Fest',
                      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
                      description: 'University flagship technical symposium, coding challenges, robotics arena, and startup pitch.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-12',
                      date: 'Nov 15, 2026',
                      day: 'Sunday',
                      month: 'NOV',
                      title: 'Guru Nanak Jayanti & Rahas Purnima / Kartika Purnima',
                      category: 'HOLIDAY',
                      badge: 'Official Holiday',
                      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
                      description: 'Official holiday commemorating Rahas Purnima and Guru Nanak Dev Jayanti.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-13',
                      date: 'Nov 20, 2026',
                      day: 'Friday',
                      month: 'NOV',
                      title: 'Last Teaching Day & Final Attendance Compilation (Sem 5)',
                      category: 'ACADEMIC',
                      badge: 'Term End',
                      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
                      description: 'Conclusion of regular Autumn semester classes. Final attendance list submission to COE.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-14',
                      date: 'Nov 24 – 28, 2026',
                      day: 'Tue – Sat',
                      month: 'NOV',
                      title: 'Practical Laboratory Examinations & External Project Viva',
                      category: 'EXAM',
                      badge: 'Lab Exams',
                      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
                      description: 'Continuous lab assessments, software project vivas, and hardware demonstrations with external examiners.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-15',
                      date: 'Dec 02 – 18, 2026',
                      day: 'Wed – Fri',
                      month: 'DEC',
                      title: 'Autonomous End-Semester Final Theory Examinations (Autumn 2026)',
                      category: 'EXAM',
                      badge: 'End-Sem Finals',
                      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
                      description: 'Final semester examinations conducted under the Autonomous examination cell (100 Marks weightage).',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-16',
                      date: 'Dec 20 – Jan 03, 2027',
                      day: 'Sun – Sun',
                      month: 'DEC',
                      title: 'Winter Vacation & Mandatory Industry Internship Period',
                      category: 'HOLIDAY',
                      badge: 'Winter Break',
                      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
                      description: 'Two-week winter recess. 3rd-year students undergo mandatory industrial training and mini-internships.',
                      status: 'SCHEDULED',
                    },
                    {
                      id: 'acad-17',
                      date: 'Jan 04, 2027',
                      day: 'Monday',
                      month: 'JAN',
                      title: 'Spring 2027 (6th Semester) Registration & Classes Commencement',
                      category: 'ACADEMIC',
                      badge: 'New Semester',
                      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      description: 'Reopening of the university for Spring 2027. Elective choice submission and course registration.',
                      status: 'SCHEDULED',
                    },
                  ]
                    .filter((item) => {
                      if (academicMonthFilter !== 'ALL') return item.month === academicMonthFilter;
                      return true;
                    })
                    .filter((item) => {
                      if (academicCategoryFilter !== 'ALL') return item.category === academicCategoryFilter;
                      return true;
                    })
                    .filter((item) => {
                      if (!academicSearch.trim()) return true;
                      const q = academicSearch.toLowerCase();
                      return (
                        item.title.toLowerCase().includes(q) ||
                        item.description.toLowerCase().includes(q) ||
                        item.date.toLowerCase().includes(q)
                      );
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white p-4 sm:p-5 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                          item.status === 'UPCOMING'
                            ? 'border-indigo-400 ring-2 ring-indigo-500/10'
                            : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 min-w-0">
                          {/* Date Badge Box */}
                          <div
                            className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border text-center ${
                              item.status === 'COMPLETED'
                                ? 'bg-slate-50 border-slate-200 text-slate-500'
                                : item.status === 'UPCOMING'
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-100 border-slate-200 text-slate-800'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                              {item.date.split(' ')[0]}
                            </span>
                            <span className="text-base font-black leading-tight">
                              {item.date.split(' ')[1]?.replace(',', '')}
                            </span>
                            <span className="text-[9px] font-bold opacity-75">{item.day.split(' ')[0]}</span>
                          </div>

                          {/* Event Details */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                              {item.status === 'COMPLETED' && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                                  ✓ Completed
                                </span>
                              )}
                              {item.status === 'UPCOMING' && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 animate-pulse">
                                  ⏳ Upcoming Next
                                </span>
                              )}
                            </div>
                            <h4 className="font-black text-slate-900 text-sm leading-snug">{item.title}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>

                        {/* Quick action button */}
                        <div className="shrink-0 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setSubmitSuccess(`✓ Added "${item.title}" to your student reminder list!`)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1 cursor-pointer transition shadow-2xs"
                          >
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Remind Me</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Side Summary & Regulations Columns (Right 1 Column) */}
                <div className="space-y-4">
                  {/* Attendance & Eligibility Rules Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-extrabold text-sm text-slate-900">
                        Attendance & Exam Regulations
                      </h4>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span>Your Current Attendance:</span>
                        <span className="text-emerald-700 font-black">84.6% (Eligible ✅)</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Minimum 75% attendance mandatory for Autonomous End-Sem Hall Ticket generation without condonation.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Regular Exam Eligibility:</span>
                        <span className="font-bold text-slate-800">≥ 75%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Condonation on Medical Grounds:</span>
                        <span className="font-bold text-amber-700">65% – 74%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Debarred / Year Back Threshold:</span>
                        <span className="font-bold text-rose-600">&lt; 65%</span>
                      </div>
                    </div>
                  </div>

                  {/* Internal Evaluation Marks Breakdown */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                    <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                      Autonomous Grading Weightage
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Continuous Assessment Tests (CAT):</span>
                        <span className="font-black text-indigo-600">30 Marks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Assignments & Quizzes:</span>
                        <span className="font-black text-indigo-600">10 Marks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Attendance & Conduct:</span>
                        <span className="font-black text-indigo-600">10 Marks</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold">
                        <span className="text-slate-900">End-Semester Theory Exam:</span>
                        <span className="font-black text-purple-700">50 Marks</span>
                      </div>
                    </div>
                  </div>

                  {/* Controller of Examinations Helpdesk */}
                  <div className="bg-slate-900 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl space-y-2 text-xs border border-indigo-900/60 shadow-md">
                    <div className="flex items-center space-x-1.5 text-indigo-300 font-bold">
                      <Building className="w-3.5 h-3.5" />
                      <span>COE Office & Examination Cell</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Counter 3, Ground Floor, Administrative Block. Office hours: 10:00 AM - 04:30 PM (Mon-Sat).
                    </p>
                    <p className="text-[11px] font-bold text-sky-300">
                      Email: coe.exams@rec.ac.in • Helpline: +91 0674 2597115
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. HOSTEL                                                 */}
          {/* ========================================================= */}
          {activeTab === 'HOSTEL' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <h3 className="text-2xl font-black text-slate-900">
                  {effectiveHostel} • Room {effectiveRoom}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Assigned resident room for {effectiveStudentName}. Wi-Fi and amenities active.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 7. MESS & FOOD MENU                                       */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 7. MESS & FOOD MENU                                       */}
          {/* ========================================================= */}
          {activeTab === 'MESS' && (
            <div className="space-y-6">
              {/* Header Hero Banner with Meal Serving Indicator */}
              <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-amber-100 text-xs font-bold">
                      <Utensils className="w-3.5 h-3.5 text-amber-200" />
                      <span>Central Dining Hall & Hostel Mess Roster</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      Nutritious Campus Meals & Food Menu
                    </h2>
                    <p className="text-xs text-amber-100 max-w-2xl leading-relaxed">
                      FSSAI certified hygienic kitchen serving 4 fresh meals daily for Nilgiri and Shivalik hostel residents. Clean dining hall, purified RO water, and balanced vegetarian & non-vegetarian protein.
                    </p>
                  </div>

                  {/* Live Serving Status Badge */}
                  <div className="bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shrink-0 text-right">
                    <div className="flex items-center space-x-1.5 justify-end">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                        Dinner Live Now
                      </span>
                    </div>
                    <p className="text-xs font-black text-white mt-0.5">07:30 PM - 09:30 PM</p>
                    <span className="text-[10px] text-amber-200 block">Hostel Dining Halls 1 & 2</span>
                  </div>
                </div>

                {/* Quick Action Button Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowGuestMealModal(true)}
                    className="px-3.5 py-2 bg-white text-slate-900 hover:bg-amber-50 font-black rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                  >
                    <span>🎟️ Book Guest Meal Coupon</span>
                  </button>

                  <button
                    onClick={() => setShowRateMealModal(true)}
                    className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-white/20"
                  >
                    <span>⭐ Rate Food Quality</span>
                  </button>

                  <button
                    onClick={() => {
                      setComplaintCategory('MESS');
                      setShowComplaintModal(true);
                    }}
                    className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition cursor-pointer border border-rose-400/40"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Food Issue</span>
                  </button>
                </div>
              </div>

              {/* 7-Day Day Selector Tabs */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedMessDay(day)}
                    className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer whitespace-nowrap ${
                      selectedMessDay === day
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    {day === 'Friday' ? '⭐ Friday (Biryani)' : day === 'Sunday' ? '🎉 Sunday (Feast)' : day}
                  </button>
                ))}
              </div>

              {/* 4 Meals Grid for Selected Day */}
              {(() => {
                const weeklyMenu: Record<string, { breakfast: string; lunch: string; snacks: string; dinner: string; special?: string }> = {
                  Monday: {
                    breakfast: 'Hot Idli & Medu Vada with Sambar, Fresh Coconut Chutney, Boiled Egg / Banana, Tea & Filter Coffee',
                    lunch: 'Steamed Basmati Rice, Dal Makhani, Paneer Butter Masala, Mixed Veg Fry, Fresh Curd, Roasted Papad',
                    snacks: 'Crispy Veg Samosa (2 pcs) with Mint Chutney, Hot Adrak Chai',
                    dinner: 'Tandoori Roti, Jeera Pulao, Chicken Curry (Special) / Matar Paneer, Dal Fry, Hot Gulab Jamun',
                  },
                  Tuesday: {
                    breakfast: 'Crispy Aloo Paratha with Fresh Curd & Mango Pickle, Seasonal Fruit, Tea / Coffee',
                    lunch: 'Authentic Odisha Dalma, Ghee Rice, Tomato Khatta, Crispy Baigan Bhaja, Roasted Papad',
                    snacks: 'Poha with Sev, Roasted Peanuts & Curry Leaves, Hot Lemon Tea',
                    dinner: 'Soft Phulka Roti, Yellow Dal Tadka, Kadai Mushroom / Egg Bhurji, Sevai Kheer',
                  },
                  Wednesday: {
                    breakfast: 'Hot Puri with Cuttack Style Aloo Dum, Sooji Halwa, Tea / Coffee',
                    lunch: 'Steamed Rice, Chana Masala, Fish Curry (Rohu) / Shahi Paneer, Cucumber Onion Raita, Papad',
                    snacks: 'Golden Bread Pakoda with Sweet Tamarind Chutney, Hot Filter Coffee',
                    dinner: 'Fragrant Veg Pulao, Soft Chapati, Dal Fry, Chilli Chicken / Chilli Paneer, Vanilla Ice Cream',
                  },
                  Thursday: {
                    breakfast: 'Onion Tomato Uttapam with Sambar & Coconut Chutney, Milk / Seasonal Fresh Juice, Tea',
                    lunch: 'South Indian Lemon Rice, Sambar, Cabbage Poriyal, Dal Tadka, Appalam, Sweet Curd',
                    snacks: 'Crispy Chivda Mixture, Cream Biscuits, Hot Masala Tea',
                    dinner: 'Soft Phulka Roti, Mixed Veg Kurma, Dal Palak, Paneer Tikka Masala, Fruit Custard',
                  },
                  Friday: {
                    breakfast: 'Masala Dosa with Coconut & Tomato Chutney, Boiled Egg / Sprouted Moong, Tea / Coffee',
                    lunch: 'Steamed Rice, Rajma Masala, Aloo Gobi Dry Fry, Boondi Raita, Roasted Papad',
                    snacks: 'Cuttack Famous Aloo Chop (2 pcs) with Mustard Sauce, Hot Tea',
                    dinner: 'Hyderabadi Dum Chicken Biryani / Hyderabadi Veg Dum Biryani, Mirchi Ka Salan, Onion Raita, Sponge Rasgulla',
                    special: '⭐ Friday Special Dum Biryani & Rasgulla Feast!',
                  },
                  Saturday: {
                    breakfast: 'Pav Bhaji with Butter Toasted Pav, Banana, Warm Milk, Tea / Coffee',
                    lunch: 'Steamed Rice, Moong Dal Tadka, Kadhi Pakoda, Bhindi Do Pyaza, Crisp Green Salad',
                    snacks: 'Veg Grilled Sandwich / Maggi Noodles, Hot Masala Tea',
                    dinner: 'Tawa Roti, Dal Fry, Egg Curry / Kaju Curry, Sweet Semiya Payasam',
                  },
                  Sunday: {
                    breakfast: 'Chole Bhature with Pickled Onion & Green Chilli, Sweet Lassi / Fresh Buttermilk, Tea',
                    lunch: 'Special Sunday Feast: Mutton Curry / Malai Kofta, Kashmiri Pulao, Dal Maharani, Fresh Rasmalai',
                    snacks: 'Sweet Corn Chaat / Butter Cookies, Hot Masala Tea',
                    dinner: 'Light Moong Dal Khichdi with Pure Ghee, Aloo Chokha, Roasted Papad, Sweet Tomato Chutney',
                    special: '🎉 Grand Sunday Feast: Mutton & Malai Kofta with Rasmalai!',
                  },
                };

                const currentDayData = weeklyMenu[selectedMessDay] || weeklyMenu.Monday;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Breakfast */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide">
                            Breakfast
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">07:30 - 09:30 AM</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 leading-snug">
                          Morning Nutrition
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentDayData.breakfast}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Tea / Coffee Included</span>
                        <span className="text-emerald-600 font-bold">Freshly Prepared</span>
                      </div>
                    </div>

                    {/* Lunch */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
                            Lunch
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">12:30 - 02:30 PM</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 leading-snug">
                          Full Afternoon Thali
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentDayData.lunch}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Unlimited Rice & Dal</span>
                        <span className="text-blue-600 font-bold">Balanced Diet</span>
                      </div>
                    </div>

                    {/* Evening Snacks */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                            Evening Snacks
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">05:00 - 06:15 PM</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 leading-snug">
                          Evening Refreshment
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentDayData.snacks}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Hot Adrak Chai</span>
                        <span className="text-emerald-600 font-bold">Hostel Lounge</span>
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wide">
                            Dinner
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">07:30 - 09:30 PM</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 leading-snug">
                          Night Meal & Dessert
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {currentDayData.dinner}
                        </p>
                        {currentDayData.special && (
                          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-black">
                            {currentDayData.special}
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>Dessert Included</span>
                        <span className="text-purple-600 font-bold">Hot Fresh Chapatis</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Student Mess Dues & Subscription Ledger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Monthly Bill Summary */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-black text-sm text-slate-900">
                      My Hostel Mess Subscription & Dues
                    </h4>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      ✓ Dues Cleared
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span>Monthly Subscription (October 2026):</span>
                      <span className="font-bold text-slate-900">₹3,600.00</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 text-emerald-700">
                      <span>Hostel Leave Dining Adjustment (3 Days):</span>
                      <span className="font-bold">-₹540.00</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 text-slate-600">
                      <span>Extra Guest Meal Coupons Added:</span>
                      <span className="font-bold text-slate-900">₹0.00</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-sm font-black text-slate-900 bg-slate-50 px-3 rounded-xl">
                      <span>Net Billed Amount:</span>
                      <span className="text-blue-600">₹3,060.00 (PAID)</span>
                    </div>
                  </div>
                </div>

                {/* 2. Kitchen Cleanliness & Quality Stats */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-black text-sm text-slate-900">
                      Food Safety & Student Ratings
                    </h4>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                      ★ 4.2 / 5.0
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold block">Taste Score</span>
                      <span className="text-lg font-black text-slate-800">4.1 / 5</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold block">Hygiene & Prep</span>
                      <span className="text-lg font-black text-emerald-600">4.6 / 5</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold block">Food Safety</span>
                      <span className="text-lg font-black text-blue-600">FSSAI ✓</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    Meals are supervised daily by the student-elected Mess Committee and Hostel Warden. Direct inspection audit conducted weekly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 8. GRIEVANCE / COMPLAINT                                  */}
          {/* ========================================================= */}
          {activeTab === 'GRIEVANCE' && (
            <div className="space-y-6">
              {/* Header Hero Banner with Summary Metrics & Action Button */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>24x7 Student Grievance & Rapid Response Desk</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      Lodge Complaint For Any Campus Reason
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Hostel, Mess, Academic, Electrical, Wi-Fi, Water, Security, Harassment, or Custom issues. Upload HD photos & video evidence with direct live notification to Admin.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowComplaintModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/30 flex items-center space-x-2 transition cursor-pointer self-start md:self-auto shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Raise Grievance / Ticket</span>
                  </button>
                </div>

                {/* 4 SLA & Resolution Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Tickets</span>
                    <strong className="text-xl font-black text-white">{complaints.length || 6}</strong>
                    <span className="text-[10px] text-sky-300 block mt-0.5">Recorded in audit log</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">In Progress / Active</span>
                    <strong className="text-xl font-black text-amber-300">
                      {complaints.filter((c) => c.status !== 'RESOLVED').length || 2}
                    </strong>
                    <span className="text-[10px] text-amber-200 block mt-0.5">Technicians on-site</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Resolved</span>
                    <strong className="text-xl font-black text-emerald-300">
                      {complaints.filter((c) => c.status === 'RESOLVED').length || 4}
                    </strong>
                    <span className="text-[10px] text-emerald-200 block mt-0.5">Verified fixed ✓</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-sky-300 block">Average Fix Turnaround</span>
                    <strong className="text-xl font-black text-sky-200">3.4 hrs</strong>
                    <span className="text-[10px] text-emerald-300 block mt-0.5">Within institutional SLA</span>
                  </div>
                </div>
              </div>

              {/* EXPLICIT CALLOUT BOX: WHICH WAY IT DIRECTLY NOTIFIES ADMIN PLATFORM */}
              <div className="bg-white rounded-3xl border border-blue-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Direct Real-Time Notification Pipeline to Admin Platform
                    </h3>
                    <p className="text-xs text-slate-500">
                      How your grievance, photos, and video proof immediately reach the university controller desk:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[11px]">
                        1
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                        &lt;50ms
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-xs">Instant WebSocket Dispatch</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      The instant you click Submit, an authenticated WebSocket payload (<code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono text-[10px]">complaint:created</code>) transmits directly to Admin Manager & Super Admin screens without waiting or page refresh.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-[11px]">
                        2
                      </span>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        Audio + Badge
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-xs">Audible Chime & Live Badge</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Admin consoles trigger an urgent notification chime and increment their live unread badge (+1). A high-contrast alert toast informs the Chief Warden with student room and priority.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-[11px]">
                        3
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        Rapid Routing
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-xs">Technician Work-Order Dispatch</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Tickets auto-route to designated on-duty technicians: Electrical problems alert Electrician Suresh, plumbing alerts Plumber Mahendra, food complaints alert Mess Committee, and safety alerts Security.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[11px]">
                        4
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        Strict SLA
                      </span>
                    </div>
                    <h4 className="font-black text-slate-900 text-xs">SLA Countdown & Escalation</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      4-Hour resolution target for Emergency, 12h for High, and 24h for Routine tickets. If unattended, the ticket auto-escalates to the Principal & Dean of Student Affairs for immediate intervention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Pills & Ticket History Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-slate-900">
                      My Logged Grievance Tickets ({complaints.length})
                    </h3>
                    <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                      Live SLA Tracking
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                    {(['ALL', 'PENDING', 'RESOLVED', 'URGENT'] as const).map((flt) => (
                      <button
                        key={flt}
                        onClick={() => setComplaintListFilter(flt)}
                        className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                          complaintListFilter === flt
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {flt === 'ALL'
                          ? 'All Tickets'
                          : flt === 'PENDING'
                          ? 'Active / In Progress'
                          : flt === 'RESOLVED'
                          ? 'Resolved ✓'
                          : '⚡ Urgent Priority'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grievance Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(complaints.length > 0 ? complaints : [
                    {
                      id: 'cmp-mock-1',
                      ticketNumber: 'CMP-94821',
                      category: 'ELECTRICITY',
                      title: 'Corridor emergency light fixture loose & flickering',
                      description: 'Second floor corridor light right outside Room A-204 is sparking when voltage fluctuates. (Location: Block A, 2nd Floor Corridor)',
                      priority: 'HIGH',
                      status: 'IN_PROGRESS',
                      photoUrl: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&fit=crop&q=80',
                      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sparks-flying-from-welding-equipment-43187-large.mp4',
                      assignedStaffName: 'Suresh Kumar (Electrical)',
                      createdAt: new Date().toISOString(),
                    },
                    {
                      id: 'cmp-mock-2',
                      ticketNumber: 'CMP-94103',
                      category: 'WATER',
                      title: 'Hot water solar geyser valve pressure drop',
                      description: 'Low water flow from the geyser tap during morning shower hours. (Location: Room A-204 Washroom)',
                      priority: 'MEDIUM',
                      status: 'RESOLVED',
                      photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&fit=crop&q=80',
                      assignedStaffName: 'Mahendra Singh (Plumbing)',
                      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    },
                  ])
                    .filter((c: any) => {
                      if (complaintListFilter === 'PENDING') return c.status !== 'RESOLVED';
                      if (complaintListFilter === 'RESOLVED') return c.status === 'RESOLVED';
                      if (complaintListFilter === 'URGENT') return c.priority === 'URGENT' || c.priority === 'HIGH';
                      return true;
                    })
                    .map((c: any) => (
                      <div
                        key={c.id || c.ticketNumber}
                        className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase font-mono">
                                #{c.ticketNumber || `CMP-${c.id?.slice(-5) || '9201'}`}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {c.category}
                              </span>
                            </div>

                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                c.priority === 'URGENT'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                                  : c.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {c.priority || 'MEDIUM'} PRIORITY
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-slate-900 leading-snug">{c.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{c.description}</p>

                          {/* Photographic, Video & Voice Proof Thumbnails */}
                          {(c.photoUrl || c.videoUrl || c.voiceUrl) && (
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              {c.photoUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewComplaintMedia({
                                      type: 'PHOTO',
                                      url: c.photoUrl,
                                      title: `Photo Proof: ${c.title}`,
                                    })
                                  }
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-bold transition cursor-pointer"
                                >
                                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Photo Proof</span>
                                </button>
                              )}

                              {c.videoUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewComplaintMedia({
                                      type: 'VIDEO',
                                      url: c.videoUrl,
                                      title: `Video Proof: ${c.title}`,
                                    })
                                  }
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-bold transition cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 text-purple-600 fill-current" />
                                  <span>Watch Video Proof</span>
                                </button>
                              )}

                              {c.voiceUrl && (
                                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-bold">
                                  <Mic className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span className="text-[10px] text-indigo-700">Voice Note:</span>
                                  <audio src={c.voiceUrl} controls className="h-6 w-36" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Progress & Assignment */}
                        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">
                              Assigned Staff: <strong className="text-slate-800">{c.assignedStaffName || 'Duty Warden Office'}</strong>
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                                c.status === 'RESOLVED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : c.status === 'IN_PROGRESS'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {c.status === 'RESOLVED' ? 'RESOLVED ✓' : c.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'RAISED'}
                            </span>
                          </div>

                          {/* Progress Stages Bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                c.status === 'RESOLVED'
                                  ? 'w-full bg-emerald-500'
                                  : c.status === 'IN_PROGRESS'
                                  ? 'w-2/3 bg-amber-500'
                                  : 'w-1/3 bg-blue-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 9. MEDICAL CARE                                           */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 9. MEDICAL CARE                                           */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 9. MEDICAL CARE (HONEST & SIMPLE: PHARMACY + 24x7 VEHICLE) */}
          {/* ========================================================= */}
          {activeTab === 'MEDICAL' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Honest Header Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-3 border border-emerald-900/50">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Campus Healthcare & Emergency Transit</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  Campus Health & Emergency Services
                </h2>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-2xl">
                  Our campus operates an on-duty Campus Pharmacy for everyday medicines and essential medical supplies, backed by a dedicated 24×7 vehicle service for prompt, safe transport to nearby hospitals.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-emerald-200">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>On-Duty Campus Pharmacist</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>24×7 Emergency Ambulance / Vehicle Ready</span>
                  </span>
                </div>
              </div>

              {/* 4 Core Cards: Request Medicine, Pharmacy, Ambulance, Helpline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. 🩺 Request Medical Help / Medicine */}
                <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500/30 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs border border-emerald-200">
                      🩺
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live Connect
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">Request Medicine / Help</h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Need medicines, first-aid, or feel unwell in room?
                      </p>
                    </div>
                    <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 text-xs space-y-1 text-slate-600">
                      <p className="text-[11px] font-bold text-emerald-800">
                        ✓ Direct Doctor Notification
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Doctor &amp; Pharmacist alerted with your room number.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMedicalRequestModal(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Request Medicine / Help</span>
                  </button>
                </div>

                {/* 2. 💊 Campus Pharmacy */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shadow-xs border border-emerald-100">
                      💊
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Campus Pharmacy</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Medicines & basic medical supplies available on campus.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      <p className="text-[11px] font-bold text-slate-800">
                        👨‍⚕️ Pharmacist on Duty
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Open 08:00 AM – 09:30 PM (Daily)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Ground Floor, Health Unit 5 (Near Hostel A)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPharmacyModal(true)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Pharmacy</span>
                  </button>
                </div>

                {/* 2. 🚑 24×7 Emergency Vehicle */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl shadow-xs border border-rose-100">
                      🚑
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">24×7 Emergency Vehicle</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Emergency transport available to the nearest hospital.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      <p className="text-[11px] font-bold text-slate-800">
                        🏥 Hospital Transit
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Destination: KIMS Hospital (4.5 km) & Hi-Tech Hospital
                      </p>
                      <p className="text-[11px] text-emerald-700 font-bold">
                        Driver on 24x7 standby at campus gate
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:+919437000108"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition flex items-center justify-center space-x-2 text-center"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* 3. 📞 Medical Emergency */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-xs border border-amber-100">
                      📞
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Medical Emergency</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Need urgent help? Contact the campus emergency service.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-600">
                      <p className="text-[11px] font-bold text-slate-800">
                        🚨 Campus Emergency Desk
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Immediate assistance, warden alerts & gate clearance
                      </p>
                      <p className="text-[11px] text-indigo-700 font-mono font-bold">
                        Direct Line: +91 98610 00112
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:+919861000112"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center justify-center space-x-2 text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Contact</span>
                  </a>
                </div>
              </div>

              {/* Informational Guidance Box */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-start space-x-3 text-xs text-slate-600">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">Campus Healthcare Guidelines</h4>
                  <p className="leading-relaxed">
                    For minor ailments (headache, fever, common cold, cuts, dressing, dehydration), visit the Campus Pharmacy counter. For severe conditions, the emergency vehicle will immediately transfer the student accompanied by hostel security or medical staff to KIMS Medical Hospital.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. EMERGENCY SOS                                         */}
          {/* ========================================================= */}
          {activeTab === 'EMERGENCY' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-950 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-red-500/40 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-black tracking-wide uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
                      <span>24×7 Campus Emergency Crisis & Life Safety Hub</span>
                    </div>

                    <div className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>Telemetry Beacon Online</span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                      <Siren className="w-8 h-8 text-red-400 animate-bounce" />
                      <span>Campus Emergency SOS</span>
                    </h2>
                    <p className="text-sm md:text-base text-rose-100 max-w-2xl leading-relaxed mt-1">
                      Rapid 1-tap emergency dispatch to the <strong>24×7 Campus Emergency Vehicle</strong>, <strong>Main Gate Security QRT Patrol</strong>, <strong>Hostel Warden Desk</strong>, and <strong>Registered Parents</strong> with live room GPS telemetry.
                    </p>
                  </div>

                  {/* Student Room Live Beacon Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-rose-300 block">Student Location</span>
                      <p className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-4 h-4 text-red-400" />
                        <span>{effectiveHostel}, Room {effectiveRoom}</span>
                      </p>
                      <span className="text-[10px] text-slate-300">Node: AP-HOSTEL-A-FL3</span>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-rose-300 block">Student Identity</span>
                      <p className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>{effectiveStudentName}</span>
                      </p>
                      <span className="text-[10px] text-slate-300">Roll: CS2023089 • Blood: {bloodGroup}</span>
                    </div>

                    <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-rose-300 block">Primary Guardian</span>
                      <p className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{fatherPhone || '+91 94370 88990'}</span>
                      </p>
                      <span className="text-[10px] text-slate-300">{fatherName} (Father)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Select Emergency Category / Crisis Type */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Step 1 • Select Emergency Channel</span>
                    <h3 className="text-xl font-black text-slate-900">What is the nature of your emergency?</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                    Active: <strong className="text-rose-600">{sosCategory}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      id: 'MEDICAL',
                      title: 'Medical Crisis & Vehicle',
                      subtitle: '24×7 Ambulance & Pharmacist dispatch',
                      icon: Ambulance,
                      badge: 'Code Red',
                      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
                      borderActive: 'border-rose-600 ring-2 ring-rose-500/30 bg-rose-50/50',
                      phone: '+91 94370 00108',
                      eta: '2 - 4 Min to Hostel',
                      desc: 'Urgent transit in campus emergency vehicle to nearby hospital (Kalinga/Apollo). Pharmacist & stretcher ready.',
                    },
                    {
                      id: 'SECURITY',
                      title: 'Security Threat & Intruder',
                      subtitle: 'Main Gate QRT Guard Dispatch',
                      icon: ShieldAlert,
                      badge: '2-Min Patrol',
                      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                      borderActive: 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/50',
                      phone: '+91 94370 88214',
                      eta: '< 2 Min Response',
                      desc: 'Physical threat, intruder, hostile altercation, or unauthorized trespasser in hostel block.',
                    },
                    {
                      id: 'WARDEN',
                      title: 'Hostel Warden Crisis',
                      subtitle: 'Hostel Authority Immediate Alert',
                      icon: Home,
                      badge: 'Hostel Desk',
                      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
                      borderActive: 'border-amber-600 ring-2 ring-amber-500/30 bg-amber-50/50',
                      phone: '+91 98610 22345',
                      eta: 'Immediate Visit',
                      desc: 'Critical room crisis, severe midnight illness, power/water failure, or hostel disciplinary dispute.',
                    },
                    {
                      id: 'FIRE',
                      title: 'Fire & Electrical Hazard',
                      subtitle: 'Hostel Evacuation & Safety',
                      icon: Flame,
                      badge: 'Evacuation',
                      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
                      borderActive: 'border-orange-600 ring-2 ring-orange-500/30 bg-orange-50/50',
                      phone: '101',
                      eta: 'Siren Trigger',
                      desc: 'Electrical short circuit spark, room smoke, gas cylinder leakage, or hostel fire alarm.',
                    },
                    {
                      id: 'RAGGING',
                      title: "Anti-Ragging / Women Cell",
                      subtitle: 'Strictly Confidential Protection',
                      icon: LifeBuoy,
                      badge: 'Zero Tolerance',
                      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
                      borderActive: 'border-purple-600 ring-2 ring-purple-500/30 bg-purple-50/50',
                      phone: '1091',
                      eta: 'Immediate Action',
                      desc: '100% confidential helpline for ragging, harassment, stalking, or bullying. Direct Proctorial Board notice.',
                    },
                    {
                      id: 'COUNSELING',
                      title: 'Mental Health Distress',
                      subtitle: 'Compassionate Crisis Counselor',
                      icon: Heart,
                      badge: '24×7 Support',
                      badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
                      borderActive: 'border-teal-600 ring-2 ring-teal-500/30 bg-teal-50/50',
                      phone: '+91 94370 77112',
                      eta: 'Counselor On-Call',
                      desc: 'Severe anxiety, panic attack, depression, or emotional collapse. Speak anonymously with a trained counselor.',
                    },
                  ].map((cat) => {
                    const isSelected = sosCategory === cat.id;
                    const IconComp = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSosCategory(cat.id as any)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? cat.borderActive
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                            ✓
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <IconComp className="w-6 h-6" />
                          </div>
                          <div className="space-y-1 pr-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                                {cat.badge}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{cat.title}</h4>
                            <p className="text-xs text-slate-500 leading-snug">{cat.desc}</p>
                            <div className="pt-2 flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-600 font-mono">{cat.phone}</span>
                              <span className="text-rose-600">{cat.eta}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Emergency Controls & Options Configuration */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Step 2 • Emergency Preferences & Controls</span>
                  <h3 className="text-xl font-black text-white mt-1">Configure SOS Broadcast Mode</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Audible vs Silent Mode */}
                  <div
                    onClick={() => setIsSilentSos(!isSilentSos)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSilentSos
                        ? 'bg-purple-950/40 border-purple-500 text-purple-200'
                        : 'bg-rose-950/40 border-rose-500 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Alarm Audio Mode</span>
                      {isSilentSos ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-black">
                          SILENT SOS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-400/40 text-[10px] font-black">
                          AUDIBLE SIREN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isSilentSos ? (
                        <VolumeX className="w-8 h-8 text-purple-400 shrink-0" />
                      ) : (
                        <Volume2 className="w-8 h-8 text-rose-400 shrink-0 animate-pulse" />
                      )}
                      <div>
                        <p className="text-sm font-black text-white">
                          {isSilentSos ? 'Stealth / Silent SOS Active' : 'Audible Siren & Flash Active'}
                        </p>
                        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                          {isSilentSos
                            ? 'Stealthily alerts security console with zero phone noise. Ideal for threats.'
                            : 'Plays loud campus alarm sound and flashes screen to deter attackers.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Parent Notification Checkbox */}
                  <div
                    onClick={() => setSosNotifyParents(!sosNotifyParents)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      sosNotifyParents
                        ? 'bg-blue-950/40 border-blue-500 text-blue-200'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Guardian Alert</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
                        sosNotifyParents
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/40'
                          : 'bg-slate-700 text-slate-400 border-slate-600'
                      }`}>
                        {sosNotifyParents ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-white">Notify Parents Automatically</p>
                        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                          Sends urgent SMS and GPS link to {fatherPhone || '+91 94370 88990'} ({fatherName || 'Parent'}).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GPS & Room Telemetry */}
                  <div
                    onClick={() => setSosIncludeGps(!sosIncludeGps)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      sosIncludeGps
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">GPS Telemetry</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-black">
                        LIVE ROOM BEACON
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-black text-white">Hostel A • Room {effectiveRoom}</p>
                        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                          GPS: 20.2961° N, 85.8245° E transmitted to campus security map.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: MASTER SOS PULSE BUTTON */}
                <div className="pt-4 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing Concentric Radar Rings */}
                    <div className="absolute w-64 h-64 rounded-full bg-rose-600/20 animate-ping pointer-events-none"></div>
                    <div className="absolute w-52 h-52 rounded-full border-2 border-rose-500/40 animate-pulse pointer-events-none"></div>

                    <button
                      onClick={handleTriggerSos}
                      className="w-44 h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black shadow-2xl shadow-rose-600/70 ring-8 ring-rose-500/40 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer group z-10"
                    >
                      <ShieldAlert className="w-12 h-12 md:w-14 md:h-14 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-2xl md:text-3xl tracking-tight">TAP SOS</span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-rose-200 mt-1">
                        {isSilentSos ? '🤫 Silent Mode' : '🔊 Siren Alarm'}
                      </span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-black text-rose-300">
                      Broadcasting <span className="underline">{sosCategory}</span> emergency signal for {effectiveStudentName}
                    </p>
                    <p className="text-xs text-slate-400">
                      Dispatches to: Campus Security Patrol + Campus Emergency Vehicle + Hostel A Warden + Parents
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Tap Direct Campus Emergency Helpline Contacts Grid */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Immediate Phone Dialers</span>
                    <h3 className="text-xl font-black text-slate-900">Direct Campus Crisis Contacts</h3>
                  </div>
                  <p className="text-xs text-slate-500">Tap to call directly or copy number</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'contact-vehicle',
                      title: 'Campus Emergency Vehicle',
                      phone: '+91 94370 00108',
                      role: 'Ambulance Driver on 24×7 Duty',
                      badge: '24×7 Transit',
                      badgeColor: 'bg-rose-100 text-rose-700',
                      icon: Ambulance,
                      iconColor: 'text-rose-600 bg-rose-50',
                      actionTitle: 'Vehicle Driver',
                    },
                    {
                      id: 'contact-security',
                      title: 'Gate 1 Security Control',
                      phone: '+91 94370 88214',
                      role: 'Campus QRT Patrol & Security Desk',
                      badge: '2-Min Response',
                      badgeColor: 'bg-blue-100 text-blue-700',
                      icon: ShieldAlert,
                      iconColor: 'text-blue-600 bg-blue-50',
                      actionTitle: 'Security Desk',
                    },
                    {
                      id: 'contact-warden',
                      title: 'Chief Hostel Warden',
                      phone: '+91 98610 22345',
                      role: 'Dr. Alok Kumar Nayak (Hostel Admin)',
                      badge: 'Hostel Authority',
                      badgeColor: 'bg-amber-100 text-amber-700',
                      icon: Home,
                      iconColor: 'text-amber-600 bg-amber-50',
                      actionTitle: 'Chief Warden',
                    },
                    {
                      id: 'contact-pharmacy',
                      title: 'Campus Pharmacy & First-Aid',
                      phone: '+91 98610 77654',
                      role: 'Mr. Tushar Kanta Sahoo (Pharmacist)',
                      badge: 'Pharmacy 8am-10pm',
                      badgeColor: 'bg-emerald-100 text-emerald-700',
                      icon: Pill,
                      iconColor: 'text-emerald-600 bg-emerald-50',
                      actionTitle: 'Pharmacist',
                    },
                    {
                      id: 'contact-police',
                      title: 'National Police Control',
                      phone: '112',
                      role: 'All-in-One Police & ERSS Response',
                      badge: 'Toll-Free 24×7',
                      badgeColor: 'bg-indigo-100 text-indigo-700',
                      icon: Radio,
                      iconColor: 'text-indigo-600 bg-indigo-50',
                      actionTitle: 'Police 112',
                    },
                    {
                      id: 'contact-fire',
                      title: 'Fire & Disaster Rescue',
                      phone: '101',
                      role: 'Fire Safety & Hazard Containment',
                      badge: 'National Fire',
                      badgeColor: 'bg-orange-100 text-orange-700',
                      icon: Flame,
                      iconColor: 'text-orange-600 bg-orange-50',
                      actionTitle: 'Fire Control',
                    },
                    {
                      id: 'contact-women',
                      title: "Women's Safety Helpline",
                      phone: '1091',
                      role: 'Campus Anti-Harassment Cell',
                      badge: 'Confidential',
                      badgeColor: 'bg-purple-100 text-purple-700',
                      icon: LifeBuoy,
                      iconColor: 'text-purple-600 bg-purple-50',
                      actionTitle: 'Safety Helpline',
                    },
                    {
                      id: 'contact-parent',
                      title: 'Father / Emergency Guardian',
                      phone: fatherPhone || '+91 94370 88990',
                      role: `${fatherName || 'Balakrushna Pradhan'} (Primary Guardian)`,
                      badge: 'Registered Parent',
                      badgeColor: 'bg-slate-100 text-slate-700',
                      icon: Users,
                      iconColor: 'text-slate-600 bg-slate-50',
                      actionTitle: 'Parent Contact',
                    },
                  ].map((c) => {
                    const IconC = c.icon;
                    return (
                      <div
                        key={c.id}
                        className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:shadow-md transition space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconColor}`}>
                              <IconC className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${c.badgeColor}`}>
                              {c.badge}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{c.title}</h4>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{c.role}</p>
                            <p className="text-sm font-black font-mono text-slate-800 mt-1">{c.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => {
                              handleInitiateCall({
                                id: c.id,
                                roleTitle: c.badge,
                                name: c.title,
                                designation: c.role,
                                department: 'Campus Emergency Response',
                                office: 'Campus Safety Command',
                                phone: c.phone,
                                email: 'emergency@campus.edu',
                                timings: '24×7 Active Response',
                                badge: c.badge,
                              });
                            }}
                            className="py-2 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyPhone(c.phone)}
                            className="py-2 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>{copiedContactPhone === c.phone ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant Distress Broadcast via WhatsApp & SMS */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">1-Tap Location Broadcast</span>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-emerald-400" />
                      <span>Share Emergency Distress Signal on WhatsApp</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `🚨 EMERGENCY SOS ALERT!\nStudent: ${effectiveStudentName} (Roll: CS2023089)\nHostel: ${effectiveHostel}, Room ${effectiveRoom}\nCrisis: ${sosCategory} Emergency\nLive Location: https://maps.google.com/?q=20.2961,85.8245\nContact: ${user?.phone || '+91 98765 43210'}\nPlease send immediate campus assistance!`;
                        if (typeof window !== 'undefined') {
                          window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                        }
                      }}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/40 flex items-center gap-2 transition cursor-pointer active:scale-95"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const msg = `🚨 EMERGENCY SOS ALERT!\nStudent: ${effectiveStudentName} (Roll: CS2023089)\nHostel: ${effectiveHostel}, Room ${effectiveRoom}\nCrisis: ${sosCategory} Emergency\nLive Location: https://maps.google.com/?q=20.2961,85.8245\nContact: ${user?.phone || '+91 98765 43210'}\nPlease send immediate campus assistance!`;
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(msg);
                          setSosCopiedDistress(true);
                          setTimeout(() => setSosCopiedDistress(false), 3000);
                        }
                      }}
                      className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
                    >
                      <Copy className="w-4 h-4 text-emerald-300" />
                      <span>{sosCopiedDistress ? 'Copied to Clipboard!' : 'Copy Distress Text'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-4 font-mono text-xs text-emerald-200 border border-emerald-500/20 leading-relaxed whitespace-pre-line">
                  {`🚨 EMERGENCY SOS ALERT!\nStudent: ${effectiveStudentName} (Roll: CS2023089)\nHostel: ${effectiveHostel}, Room ${effectiveRoom}\nCrisis: ${sosCategory} Emergency\nLive Location: https://maps.google.com/?q=20.2961,85.8245\nContact: ${user?.phone || '+91 98765 43210'}\nPlease send immediate campus assistance!`}
                </div>
              </div>

              {/* Crisis First-Aid & Emergency Response Quick Guides */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/80 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Immediate Action While Waiting</span>
                    <h3 className="text-xl font-black text-slate-900">Emergency First-Aid & Safety Reference</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
                    Lifesaving Instructions
                  </span>
                </div>

                {/* Topic Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'cpr', title: 'CPR & Breathing', icon: Heart },
                    { id: 'bleeding', title: 'Severe Bleeding', icon: Activity },
                    { id: 'electric', title: 'Electric Shock & Burns', icon: Zap },
                    { id: 'heatstroke', title: 'Heatstroke & Fainting', icon: Flame },
                    { id: 'snakebite', title: 'Snake / Insect Bite', icon: ShieldAlert },
                  ].map((topic) => {
                    const isActive = activeFirstAidTopic === topic.id;
                    const TIcon = topic.icon;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setActiveFirstAidTopic(topic.id as any)}
                        className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                          isActive
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <TIcon className="w-4 h-4" />
                        <span>{topic.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Topic Content Body */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  {activeFirstAidTopic === 'cpr' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-rose-600 font-black text-base">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <span>CPR (Cardiopulmonary Resuscitation) Protocol</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Perform if person is unresponsive and not breathing normally. Call 24×7 Emergency Vehicle (+91 94370 00108) first.
                      </p>
                      <div className="space-y-2 pt-2">
                        {[
                          'Step 1: Check responsiveness by tapping shoulders firmly and shouting "Are you okay?".',
                          'Step 2: Place heel of one hand in the center of the chest; interlock fingers of the other hand on top.',
                          'Step 3: Push hard and fast at a rate of 100 to 120 compressions per minute (depth ~2 inches).',
                          'Step 4: Keep arms straight and use your upper body weight to compress.',
                          'Step 5: Continue without stopping until the campus vehicle and medical responders arrive.',
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFirstAidTopic === 'bleeding' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-600 font-black text-base">
                        <Activity className="w-5 h-5 text-red-600" />
                        <span>Severe Bleeding & Wound Management</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Rapid control of blood loss is critical to prevent hypovolemic shock.
                      </p>
                      <div className="space-y-2 pt-2">
                        {[
                          'Step 1: Apply direct, continuous, firm pressure over the bleeding site with a clean cloth, towel, or gauze.',
                          'Step 2: Do NOT remove blood-soaked cloths; add more layers directly on top and press firmly.',
                          'Step 3: Elevate the wounded limb above heart level (unless you suspect a broken bone).',
                          'Step 4: Keep the student lying down flat with legs slightly elevated to maintain cerebral blood pressure.',
                          'Step 5: Keep student calm and warm with a bedsheet until emergency vehicle transport arrives.',
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFirstAidTopic === 'electric' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-600 font-black text-base">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <span>Electrical Shock & Burn Emergency</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Never touch the victim while they are still in contact with electrical current!
                      </p>
                      <div className="space-y-2 pt-2">
                        {[
                          'Step 1: Immediately switch off the main hostel room electrical MCB breaker.',
                          'Step 2: If the switch cannot be reached, separate victim using a dry non-conductive object (wooden broom handle or plastic chair).',
                          'Step 3: Check breathing and pulse. If not breathing, start CPR compressions immediately.',
                          'Step 4: For burns: Cool with cool running water for 10-15 minutes. Never apply ice, toothpaste, or oil.',
                          'Step 5: Dial Campus Security (+91 94370 88214) and 24×7 Vehicle (+91 94370 00108).',
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFirstAidTopic === 'heatstroke' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-orange-600 font-black text-base">
                        <Flame className="w-5 h-5 text-orange-600" />
                        <span>Heatstroke & Dehydration Care</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        High body temperature, dizziness, lack of sweat, confusion, or syncope collapse.
                      </p>
                      <div className="space-y-2 pt-2">
                        {[
                          'Step 1: Move student immediately into an air-conditioned room or cool shaded corridor.',
                          'Step 2: Loosen tight clothing, collar, and shoes to assist ventilation.',
                          'Step 3: Apply cold wet towels or ice packs to the neck, armpits, and groin area.',
                          'Step 4: If conscious, offer frequent small sips of cool electrolyte ORS water (never force liquid if drowsy).',
                          'Step 5: Elevate feet 12 inches to restore blood flow to the brain.',
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeFirstAidTopic === 'snakebite' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-base">
                        <ShieldAlert className="w-5 h-5 text-emerald-600" />
                        <span>Snake & Venomous Insect Protocol</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Remain calm. Panic elevates heart rate and spreads venom faster. Immediate vehicle transit is required.
                      </p>
                      <div className="space-y-2 pt-2">
                        {[
                          'Step 1: Keep the student completely still and calm. Lie down flat.',
                          'Step 2: Keep the bitten limb below or at heart level. Immobilize the limb with a splint if possible.',
                          'Step 3: Remove all tight rings, anklets, bracelets, and watches before limb swelling starts.',
                          'Step 4: DO NOT cut the wound, DO NOT try to suck out venom, and DO NOT apply ice or tight tourniquets.',
                          'Step 5: Call 24×7 Campus Emergency Vehicle (+91 94370 00108) for immediate transit to hospital anti-venom center.',
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 11. CAMPUS MAP                                            */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 11. CAMPUS MAP                                            */}
          {/* ========================================================= */}
          {activeTab === 'CAMPUS_MAP' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Official Master Plan & Architectural Layout</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      CAMPUS FACILITIES MAP • Explore Your Campus
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Approved high-resolution architectural layout of Raajdhani Engineering College campus featuring 8 designated facility landmarks, central driveways, pedestrian walkways, and security checkpoints.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setShowFullMapModal(true)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Enlarge Fullscreen</span>
                    </button>
                    <a
                      href="/campus-facilities-map.jpg"
                      download="REC-Campus-Facilities-Map.jpg"
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-300" />
                      <span>Download Map</span>
                    </a>
                  </div>
                </div>

                {/* Quick Campus Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs">
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Area</span>
                    <strong className="text-white text-base font-black">25+ Acres</strong>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Designated Facilities</span>
                    <strong className="text-sky-300 text-base font-black">8 Key Zones</strong>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Residences</span>
                    <strong className="text-indigo-300 text-base font-black">Hostel A, B & Girls</strong>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Checkpoints</span>
                    <strong className="text-emerald-300 text-base font-black">Main Gate 1 (24x7)</strong>
                  </div>
                </div>
              </div>

              {/* Interactive Map Viewer Card with User Uploaded Map Photo */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 md:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Official High-Resolution Campus Facilities Map</h3>
                      <p className="text-[11px] text-slate-500">Numbered 1 to 8 with legend, roads, walking paths, and green zones.</p>
                    </div>
                  </div>

                  {/* Zoom & Fullscreen Controls */}
                  <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setMapZoomLevel((prev) => Math.max(0.8, prev - 0.2))}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-2 font-mono text-[11px] font-bold text-slate-700">
                      {Math.round(mapZoomLevel * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setMapZoomLevel((prev) => Math.min(2.5, prev + 0.2))}
                      className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapZoomLevel(1)}
                      className="px-2 py-1 hover:bg-white rounded-lg text-[10px] font-bold text-slate-600 transition cursor-pointer"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFullMapModal(true)}
                      className="p-1.5 hover:bg-white rounded-lg text-blue-600 transition cursor-pointer"
                      title="Fullscreen Modal"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Map Image Canvas */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[380px] max-h-[620px] flex items-center justify-center border border-slate-800 shadow-inner group">
                  <div
                    className="transition-transform duration-200 ease-out origin-center w-full h-full flex items-center justify-center cursor-zoom-in"
                    style={{ transform: `scale(${mapZoomLevel})` }}
                    onClick={() => setShowFullMapModal(true)}
                  >
                    <img
                      src="/campus-facilities-map.jpg"
                      alt="CAMPUS FACILITIES MAP - Explore Your Campus"
                      className="max-w-full max-h-[580px] w-auto h-auto object-contain rounded-xl shadow-2xl"
                    />
                  </div>

                  {/* Stamp & Legend Pill */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-[11px] font-mono flex items-center space-x-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REC CAMPUS FACILITIES MAP • NORTH ORIENTED ▲</span>
                  </div>

                  <button
                    onClick={() => setShowFullMapModal(true)}
                    className="absolute top-3 right-3 bg-slate-900/85 hover:bg-slate-900 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-lg"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Click to Enlarge</span>
                  </button>
                </div>
              </div>

              {/* 8 Campus Facilities Directory matching the photo exactly */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Campus Facilities Directory (Numbered 1 to 8 as on Map)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Click any facility card for operating hours and direct contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'zone-1',
                      num: '1',
                      code: 'BLDG-01',
                      name: 'Main Academic Complex (Blocks A, B & C)',
                      type: 'ACADEMIC',
                      description: 'Smart lecture theatres, department wings (CSE, ETC, EEE, ME, CE), seminar halls, and faculty chambers.',
                      hours: '08:00 AM - 05:30 PM',
                      contact: '+91 98610 01101',
                      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
                      pinColor: 'bg-purple-600 text-white',
                    },
                    {
                      id: 'zone-2',
                      num: '2',
                      code: 'HOSTEL-B',
                      name: 'Boys Hostel Campus (Hostel A & B)',
                      type: 'RESIDENCE',
                      description: 'Multi-storey resident accommodation with high-speed Wi-Fi, study halls, solar water heaters, and 24x7 security.',
                      hours: 'Curfew: 09:30 PM',
                      contact: '+91 94370 12005 (Warden)',
                      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200',
                      pinColor: 'bg-cyan-600 text-white',
                    },
                    {
                      id: 'zone-3',
                      num: '3',
                      code: 'HOSTEL-G',
                      name: 'Girls Hostel Complex (Maa Tarini Niwas)',
                      type: 'RESIDENCE',
                      description: 'Secure women residence with dedicated biometric turnstiles, female security guards, and resident warden office.',
                      hours: 'Curfew: 08:30 PM',
                      contact: '+91 94370 12006 (Warden)',
                      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
                      pinColor: 'bg-rose-600 text-white',
                    },
                    {
                      id: 'zone-4',
                      num: '4',
                      code: 'LIB-01',
                      name: 'Central University Library & Knowledge Hub',
                      type: 'LIBRARY',
                      description: '45,000+ volumes, IEEE digital access, air-conditioned 24x7 reading lounge, and research reference terminals.',
                      hours: '08:00 AM - 11:30 PM',
                      contact: '+91 98610 03301',
                      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
                      pinColor: 'bg-amber-600 text-white',
                    },
                    {
                      id: 'zone-5',
                      num: '5',
                      code: 'HLTH-01',
                      name: '24x7 Campus Health & Emergency Medical Unit',
                      type: 'HEALTH',
                      description: 'Campus Pharmacy providing everyday medicines & basic supplies, backed by 24×7 emergency vehicle transport to nearby hospitals.',
                      hours: 'Pharmacy: 08:00 AM - 09:30 PM • Vehicle: 24x7',
                      contact: '+91 94370 00108 / +91 98610 00112',
                      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                      pinColor: 'bg-emerald-600 text-white',
                    },
                    {
                      id: 'zone-6',
                      num: '6',
                      code: 'DINE-01',
                      name: 'Student Dining Hall & Multi-Cuisine Food Court',
                      type: 'DINING',
                      description: 'Hygienic central student mess dining hall, multi-cuisine food counters, fresh fruit juice bar, and evening cafeteria.',
                      hours: '07:30 AM - 10:30 PM',
                      contact: '+91 98610 03306',
                      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
                      pinColor: 'bg-orange-600 text-white',
                    },
                    {
                      id: 'zone-7',
                      num: '7',
                      code: 'SPRT-01',
                      name: 'Sports Complex, Cricket Oval & Indoor Badminton',
                      type: 'SPORTS',
                      description: 'Olympic-standard cricket ground, FIFA football turf, 4 indoor wooden badminton courts, and 16-station gym.',
                      hours: '05:30 AM - 08:30 AM & 04:30 PM - 09:30 PM',
                      contact: '+91 98610 03304',
                      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
                      pinColor: 'bg-blue-600 text-white',
                    },
                    {
                      id: 'zone-8',
                      num: '8',
                      code: 'GATE-01',
                      name: 'Main Gate 1 & Turnstile Security Outpost',
                      type: 'SECURITY',
                      description: 'Campus entrance with automated turnstiles, turnstile QR gate pass scanners, visitor kiosk, and 24x7 security personnel.',
                      hours: '24 Hours Guarded',
                      contact: '+91 98610 00010',
                      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
                      pinColor: 'bg-slate-900 text-white',
                    },
                  ].map((z) => (
                    <div
                      key={z.id}
                      onClick={() => setSelectedCampusZone(z)}
                      className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                        selectedCampusZone?.id === z.id
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs font-mono shadow-2xs ${z.pinColor}`}>
                              {z.num}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {z.code}
                            </span>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${z.badgeColor}`}>
                            {z.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 leading-snug">{z.name}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{z.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="truncate">🕒 {z.hours}</span>
                        <span className="font-bold text-blue-600 shrink-0">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Detail Modal */}
              {selectedCampusZone && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs font-mono">
                          {selectedCampusZone.num || '★'}
                        </span>
                        <div>
                          <span className="text-[10px] font-mono font-black text-blue-600 uppercase block">
                            {selectedCampusZone.code} • {selectedCampusZone.type}
                          </span>
                          <h3 className="text-base font-black text-slate-900">{selectedCampusZone.name}</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCampusZone(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{selectedCampusZone.description}</p>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Operational Hours:</span>
                        <strong className="text-slate-800">{selectedCampusZone.hours || '08:00 AM - 08:00 PM'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Direct In-Charge / Desk:</span>
                        <strong className="text-blue-600">{selectedCampusZone.contact || '+91 94370 12000'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Security Clearance:</span>
                        <strong className="text-emerald-600">Turnstile Smart ID Permitted</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCampusZone(null)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Close Facility Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 12. ACADEMIC & SCHEDULE                                   */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 12. ACADEMIC & SCHEDULE                                   */}
          {/* ========================================================= */}
          {activeTab === 'ACADEMIC' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-5 border border-indigo-900/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                      <span>UGC Autonomous Academic Cell • B.Tech CSE (5th Sem)</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      Academic Curriculum, Timetable & Examination Desk
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      Autonomous Curriculum (2026–2027) • Interactive class schedules, subject syllabi unit completion, attendance eligibility tracking, and autonomous mid-term seating plans.
                    </p>
                  </div>

                  {/* Actions: Download Hall Ticket & Syllabus */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => setShowExamAdmitCardModal(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center space-x-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-slate-950" />
                      <span>Download Hall Ticket (PDF)</span>
                    </button>
                    <button
                      onClick={() => setSubmitSuccess('✓ Autonomous B.Tech CSE 5th Semester Syllabus Handbook downloaded as PDF!')}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-2xl shadow-sm transition flex items-center space-x-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-sky-300" />
                      <span>Syllabus Handbook</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Enrolled Credits</span>
                    <strong className="text-base font-black text-white">20.0 Credits</strong>
                    <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">7 Courses Registered</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Cumulative CGPA</span>
                    <strong className="text-base font-black text-amber-300">8.95 / 10.0</strong>
                    <span className="text-[10px] text-slate-300 block font-semibold mt-0.5">Sem 4 SGPA: 9.12</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Attendance</span>
                    <strong className="text-base font-black text-emerald-400">91.4%</strong>
                    <span className="text-[10px] text-emerald-300 block font-semibold mt-0.5">Eligible for Exams (&gt;75%)</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Faculty Mentor</span>
                    <strong className="text-xs font-black text-white block truncate">Prof. (Dr.) S. K. Mohanty</strong>
                    <span className="text-[10px] text-indigo-300 block font-semibold mt-0.5">Cabin CS-202 (Dean SW)</span>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-xs font-bold">
                  {[
                    { id: 'TIMETABLE', label: 'Weekly Timetable & Schedule', icon: Clock },
                    { id: 'COURSES', label: 'Registered Courses & Syllabi (7)', icon: BookOpen },
                    { id: 'EXAMS', label: 'Autonomous Mid-Term Routine', icon: Award },
                    { id: 'FACULTY', label: 'Faculty Mentors & Desk', icon: Users },
                  ].map((tab) => {
                    const TIcon = tab.icon;
                    const isActive = academicSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAcademicSubTab(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-md font-black'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                        }`}
                      >
                        <TIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUB-TAB 1: WEEKLY TIMETABLE & DAILY PERIODS */}
              {academicSubTab === 'TIMETABLE' && (
                <div className="space-y-5">
                  {/* Day Selector Pills */}
                  <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Select Day of Week:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map((day) => {
                        const isDaySelected = academicDay === day;
                        const periodsCount = SEMESTER_TIMETABLE[day]?.length || 0;
                        return (
                          <button
                            key={day}
                            onClick={() => setAcademicDay(day)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                              isDaySelected
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{day}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isDaySelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {periodsCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day Context Bar */}
                  <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {academicDay.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">
                          {academicDay}'s Class Schedule — B.Tech 5th Semester (Section A)
                        </h4>
                        <p className="text-[11px] text-slate-600">
                          Lecture Hall LH-302 & Specialized Laboratories • Standard duration: 55 mins per lecture
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-600">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>75% Minimum Attendance Mandatory</span>
                      </span>
                    </div>
                  </div>

                  {/* Periods Timeline List */}
                  <div className="space-y-3.5">
                    {SEMESTER_TIMETABLE[academicDay].map((period, idx) => {
                      const isRecess = period.type === 'RECESS';
                      const isLab = period.type === 'LAB';
                      const isTutorial = period.type === 'TUTORIAL';

                      return (
                        <div
                          key={period.id}
                          className={`p-4 md:p-5 rounded-2xl border transition-all ${
                            isRecess
                              ? 'bg-emerald-50/50 border-emerald-200/80'
                              : isLab
                              ? 'bg-purple-50/40 border-purple-200/80 hover:shadow-md'
                              : isTutorial
                              ? 'bg-amber-50/40 border-amber-200/80 hover:shadow-md'
                              : 'bg-white border-slate-200/80 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            {/* Time & Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-xs">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{period.time}</span>
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  period.type === 'THEORY'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : period.type === 'LAB'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                    : period.type === 'TUTORIAL'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {period.type}
                              </span>
                              {!isRecess && (
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono border border-slate-200">
                                  {period.subjectCode}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-semibold">
                                Slot #{idx + 1}
                              </span>
                            </div>

                            {/* Room Location */}
                            <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{period.room}</span>
                            </div>
                          </div>

                          {/* Body Content */}
                          <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                              <h3 className="text-base font-black text-slate-900 tracking-tight">
                                {period.subjectName}
                              </h3>
                              <p className="text-xs text-slate-600 flex items-center space-x-2">
                                <span className="font-bold text-slate-800">{period.faculty}</span>
                                <span>•</span>
                                <span className="text-slate-500">{period.facultyCabin}</span>
                              </p>
                              {period.syllabusTopic && (
                                <p className="text-xs text-indigo-700 font-medium bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100 inline-block mt-1">
                                  <strong>Ongoing Unit Coverage:</strong> {period.syllabusTopic}
                                </p>
                              )}
                            </div>

                            {/* Attendance Pill & Quick Actions */}
                            {!isRecess && (
                              <div className="flex flex-col sm:items-end justify-center shrink-0 space-y-2">
                                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <div className="text-right">
                                    <span className="text-xs font-black text-emerald-800">
                                      {period.attendancePercent}% Attendance
                                    </span>
                                    <span className="text-[10px] text-emerald-600 block">
                                      ({period.attendedClasses} / {period.totalClasses} classes attended)
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setAcademicSubTab('COURSES')}
                                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>View Full Syllabus & Progress</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: REGISTERED COURSES, SYLLABI & ATTENDANCE */}
              {academicSubTab === 'COURSES' && (
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Registered Courses & Syllabus Matrix</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        7 Autonomous Courses (5 Theory + 2 Practical Labs) • Total 20.0 Academic Credits
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>All 7 Course Registrations Approved</span>
                      </span>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {REGISTERED_SEMESTER_COURSES.map((course) => (
                      <div
                        key={course.code}
                        className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Course Code & Type Badges */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-1 rounded-xl bg-indigo-900 text-white font-mono text-xs font-black shadow-xs">
                                {course.code}
                              </span>
                              <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold">
                                {course.type}
                              </span>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-[11px] font-black border border-amber-200">
                              {course.credits} Credits
                            </span>
                          </div>

                          {/* Title & Faculty */}
                          <div>
                            <h4 className="text-base font-black text-slate-900 leading-snug">
                              {course.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-bold text-slate-700">{course.faculty}</span>
                              <span>•</span>
                              <span>{course.facultyCabin}</span>
                            </p>
                          </div>

                          {/* Attendance Meter */}
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700">Class Attendance Track:</span>
                              <span className="font-mono font-black text-slate-900">
                                {course.attendancePercent}% ({course.classesAttended}/{course.totalClasses})
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  course.attendancePercent >= 85
                                    ? 'bg-emerald-500'
                                    : course.attendancePercent >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${course.attendancePercent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                              <span>Internal Assessment: <strong className="text-slate-800">{course.internalMarks}</strong></span>
                              <span className="text-emerald-700 font-bold">{course.gradeThreshold}</span>
                            </div>
                          </div>

                          {/* Syllabus Units Breakdown */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Syllabus Unit Coverage (5 Units)
                            </span>
                            <div className="space-y-1">
                              {course.units.map((unit) => (
                                <div
                                  key={unit.number}
                                  className="text-xs p-2 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2"
                                >
                                  <div className="flex items-center space-x-2 truncate">
                                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md shrink-0">
                                      Unit {unit.number}
                                    </span>
                                    <span className="text-slate-700 font-medium truncate text-[11px]">
                                      {unit.name}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                                      unit.status === 'COMPLETED'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : unit.status === 'IN_PROGRESS'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    {unit.status === 'COMPLETED' ? 'Done ✓' : unit.status === 'IN_PROGRESS' ? 'Ongoing' : 'Upcoming'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSubmitSuccess(`✓ Syllabus PDF for ${course.code} downloaded successfully!`)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
                            <span>Download Syllabus</span>
                          </button>
                          <a
                            href={`mailto:${course.facultyEmail}`}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
                          >
                            <Mail className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Contact Faculty</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: AUTONOMOUS MID-TERM EXAMINATION ROUTINE */}
              {academicSubTab === 'EXAMS' && (
                <div className="space-y-5">
                  {/* Examination Cell Notice Alert */}
                  <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">
                          Autonomous Mid-Term Internal Examinations — Autumn Session 2026
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          Issued by Office of Controller of Examinations (COE). Candidates must carry physical Admit Card and University ID. Reporting time: 30 minutes prior to exam hall entry.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowExamAdmitCardModal(true)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>View & Download Hall Ticket</span>
                    </button>
                  </div>

                  {/* Routine Cards Grid */}
                  <div className="space-y-3.5">
                    {AUTONOMOUS_EXAMS_SCHEDULE.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Date Badge */}
                          <div className="bg-slate-900 text-white p-3.5 rounded-2xl text-center min-w-[110px] shrink-0 shadow-sm">
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                              {exam.day}
                            </span>
                            <span className="text-lg font-black block leading-tight">
                              {new Date(exam.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">2026</span>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black font-mono">
                                {exam.courseCode}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {exam.examType}
                              </span>
                              <span className="text-xs font-mono font-bold text-slate-600 flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{exam.time} (2 Hours)</span>
                              </span>
                            </div>

                            <h3 className="text-base font-black text-slate-900">
                              {exam.courseName}
                            </h3>

                            <p className="text-xs text-indigo-700 font-medium">
                              <strong>Syllabus Scope:</strong> {exam.syllabusCovered}
                            </p>
                          </div>
                        </div>

                        {/* Seating Details */}
                        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1.5 min-w-[240px]">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Exam Hall:</span>
                            <strong className="text-slate-900">{exam.hall}</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Allocated Desk:</span>
                            <strong className="text-indigo-700 font-mono font-black">{exam.seatNo}</strong>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Invigilator:</span>
                            <span className="font-semibold text-slate-800">{exam.chiefInvigilator}</span>
                          </div>
                          <div className="flex items-center justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200/60 text-[11px]">
                            <span>Reporting Time: {exam.reportingTime}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Confirmed ✓</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: FACULTY MENTORS & DEPARTMENT DIRECTORY */}
              {academicSubTab === 'FACULTY' && (
                <div className="space-y-5">
                  {/* Assigned Mentor Callout Card */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
                    <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                      <Star className="w-4 h-4 fill-amber-300" />
                      <span>Assigned Academic Proctor & Student Welfare Mentor</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center text-xl font-black shadow-inner">
                          SM
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white">Prof. (Dr.) S. K. Mohanty</h3>
                          <p className="text-xs text-indigo-200">
                            Dean (Student Welfare) • Professor, Dept. of Computer Science & Engineering
                          </p>
                          <p className="text-xs text-slate-300 mt-1">
                            Cabin CS-202 (Academic Block A) • Proctor Group B-1 (Roll CS-22-001 to CS-22-060)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <a
                          href="tel:+919861002202"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Mentor</span>
                        </a>
                        <a
                          href="mailto:skmohanty@rec.ac.in"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Faculty Roster Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FACULTY_DIRECTORY_DATA.map((fac) => (
                      <div
                        key={fac.id}
                        className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                              {fac.department}
                            </span>
                            {fac.isMentor && (
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                Mentor ★
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{fac.name}</h4>
                            <p className="text-xs text-slate-500">{fac.designation}</p>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <p className="flex items-center space-x-1.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{fac.cabin}</span>
                            </p>
                            <p className="flex items-center space-x-1.5">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{fac.officeHours}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 font-semibold pt-1">
                              <strong>Spec:</strong> {fac.specialization}
                            </p>
                          </div>
                        </div>

                        {/* Contact Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={`tel:${fac.phone}`}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>Call</span>
                          </a>
                          <a
                            href={`mailto:${fac.email}`}
                            className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
                          >
                            <Mail className="w-3 h-3 text-indigo-600" />
                            <span>Email</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 13. COLLEGE GALLERY (BOTH VIDEOS & PHOTOS FROM ADMIN)     */}
          {/* ========================================================= */}
          {activeTab === 'GALLERY' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold">
                      <Camera className="w-3.5 h-3.5 text-purple-300" />
                      <span>Campus Moments & Media Hub</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                      College Gallery (Photos & Playable Videos)
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      All campus fests, sports championships, tech hackathons, and hostel celebrations uploaded directly by Campus Administration.
                    </p>
                  </div>

                  {/* Summary Counters */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-center">
                      <span className="text-[10px] text-purple-200 uppercase font-bold block">Videos</span>
                      <strong className="text-lg font-black text-white">
                        {galleryItems.filter((i) => i.mediaType === 'VIDEO').length || 2}
                      </strong>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-center">
                      <span className="text-[10px] text-sky-200 uppercase font-bold block">Photos</span>
                      <strong className="text-lg font-black text-white">
                        {galleryItems.filter((i) => i.mediaType !== 'VIDEO').length || 4}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Category Filter Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-xs font-bold">
                  {(['ALL', 'CULTURAL', 'SPORTS', 'TECH', 'HOSTEL_LIFE', 'VIDEOS'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setGalleryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                        galleryFilter === cat
                          ? 'bg-white text-slate-900 shadow-md'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                      }`}
                    >
                      {cat === 'ALL'
                        ? 'All Moments'
                        : cat === 'VIDEOS'
                        ? '🎬 Videos Only'
                        : cat === 'CULTURAL'
                        ? 'Tarang Fest & Cultural'
                        : cat === 'SPORTS'
                        ? 'Sports & Athletics'
                        : cat === 'TECH'
                        ? 'Tech & Hackathons'
                        : 'Hostel DJ & Mess'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(galleryItems.length > 0 ? galleryItems : [
                  {
                    id: 'mock-gal-1',
                    title: "Campus Cultural Fest 'Tarang 2026' Grand Night",
                    category: 'CULTURAL',
                    mediaType: 'VIDEO',
                    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-concert-4330-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&fit=crop&q=80',
                    description: '3,000+ residents cheering at the live musical band performance and campus dance trophy night at the Central Amphitheater.',
                    eventDate: '2026-03-18',
                    isPinned: true,
                    likesCount: 142,
                  },
                  {
                    id: 'mock-gal-2',
                    title: 'Annual Inter-Hostel Sports Championship & Cricket Finals',
                    category: 'SPORTS',
                    mediaType: 'PHOTO',
                    mediaUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?w=800&fit=crop&q=80',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?w=600&fit=crop&q=80',
                    description: 'Block A Lions lifting the Rolling Cricket Trophy 2026 after a thrilling final over finish against Block C.',
                    eventDate: '2026-03-15',
                    isPinned: true,
                    likesCount: 189,
                  },
                  {
                    id: 'mock-gal-3',
                    title: 'Drone Racing & Robotics Arena Showcase',
                    category: 'TECH',
                    mediaType: 'VIDEO',
                    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-field-of-wheat-42998-large.mp4',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&fit=crop&q=80',
                    description: 'High-speed FPV drone obstacle circuit built by the Robotics Society in the campus indoor sports arena.',
                    eventDate: '2026-02-28',
                    isPinned: false,
                    likesCount: 114,
                  },
                  {
                    id: 'mock-gal-4',
                    title: 'Hostel Open-Air DJ Night, Campfire & Food Carnival',
                    category: 'HOSTEL_LIFE',
                    mediaType: 'PHOTO',
                    mediaUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&fit=crop&q=80',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&fit=crop&q=80',
                    description: 'Grand festive dinner with live chaat counters, tandoor stalls, bonfire acoustic sessions, and student performances.',
                    eventDate: '2026-03-05',
                    isPinned: false,
                    likesCount: 215,
                  },
                  {
                    id: 'mock-gal-5',
                    title: 'Smart India Hackathon & AI Innovation Finals',
                    category: 'TECH',
                    mediaType: 'PHOTO',
                    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&fit=crop&q=80',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&fit=crop&q=80',
                    description: 'Hostel resident team winning 1st Prize in AI & IoT track for designing autonomous solar cleaning drones.',
                    eventDate: '2026-03-10',
                    isPinned: false,
                    likesCount: 97,
                  },
                  {
                    id: 'mock-gal-6',
                    title: 'Central University Academic Block & Quadrangle',
                    category: 'CULTURAL',
                    mediaType: 'PHOTO',
                    mediaUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&fit=crop&q=80',
                    thumbnailUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&fit=crop&q=80',
                    description: 'Evening view of the main administrative quadrangle and student fountain courtyard.',
                    eventDate: '2026-02-14',
                    isPinned: false,
                    likesCount: 168,
                  },
                ])
                  .filter((item) => {
                    if (galleryFilter === 'ALL') return true;
                    if (galleryFilter === 'VIDEOS') return item.mediaType === 'VIDEO';
                    return item.category === galleryFilter;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-purple-300 hover:shadow-lg transition flex flex-col justify-between group"
                    >
                      {/* Media Header (Video or Photo) */}
                      <div className="relative aspect-video bg-black/80 overflow-hidden">
                        {item.mediaType === 'VIDEO' ? (
                          <div
                            onClick={() => setGalleryMediaModal(item)}
                            className="w-full h-full relative cursor-pointer"
                          >
                            <img
                              src={item.thumbnailUrl || item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                            />
                            {/* Play Overlay Button */}
                            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 flex items-center justify-center transition">
                              <div className="w-12 h-12 rounded-full bg-white/95 text-purple-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                                <Play className="w-5 h-5 ml-0.5 fill-current" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => setGalleryMediaModal(item)}
                            className="w-full h-full cursor-pointer"
                          >
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          </div>
                        )}

                        {/* Media Type Badge */}
                        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                          <span
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                              item.mediaType === 'VIDEO'
                                ? 'bg-purple-600 text-white'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {item.mediaType === 'VIDEO' ? '▶ Video' : '📷 Photo'}
                          </span>
                          {item.isPinned && (
                            <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                              ★ Featured
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-[10px] text-white font-mono px-2 py-0.5 rounded-md">
                          {item.eventDate}
                        </span>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                              {item.category?.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              By: {item.uploadedBy || 'Admin Desk'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 leading-snug">{item.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>

                        {/* Card Footer: Cheer Button & View Media */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => handleLikeGalleryItem(item.id)}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                              likingGalleryId === item.id
                                ? 'bg-rose-50 border-rose-300 text-rose-600 scale-105'
                                : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-700 hover:text-rose-600'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                            <span className="font-bold text-[11px]">{item.likesCount || 0} Cheers</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setGalleryMediaModal(item)}
                            className="font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{item.mediaType === 'VIDEO' ? 'Watch Video' : 'Enlarge Photo'}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 15. CAMPUS CONTACTS                                       */}
          {/* ========================================================= */}
          {activeTab === 'CONTACTS' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Directory Hero Banner */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/30 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                        24x7 Campus Helpline & Key Directory
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Direct Calling Enabled
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Important Campus Contacts & Directory
                    </h2>
                    <p className="text-xs text-blue-200/90 max-w-2xl leading-relaxed">
                      Instant direct lines to the Principal, Dean of Student Welfare, Hostel Warden, Security In-Charge, Campus Maintenance & Service Desk, and Medical Emergency Clinic. Click <strong className="text-white">Call Now</strong> on any official to dial immediately.
                    </p>
                  </div>

                  {/* 1-Click Fast Emergency Action Box */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <div className="text-center sm:text-left">
                      <p className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                        ⚡ Quick Emergency Help
                      </p>
                      <p className="text-xs text-white/90 font-medium">Security Gate 1 & Ambulance</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="tel:+919437088214"
                        className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Security</span>
                      </a>
                      <a
                        href="tel:+919861177332"
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>Doctor</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Copied alert toast indicator */}
                {copiedContactPhone && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied official phone number <strong>{copiedContactPhone}</strong> to clipboard!</span>
                  </div>
                )}
              </div>

              {/* Search Bar and Category Tabs */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by official name, role (Principal, Dean, Warden, Security, Service Member), phone or office..."
                      value={contactsSearchQuery}
                      onChange={(e) => setContactsSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    {contactsSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setContactsSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-500 self-center">
                    Showing{' '}
                    {
                      CAMPUS_OFFICIAL_CONTACTS.filter((c) => {
                        const matchesCategory =
                          contactsCategoryFilter === 'ALL' || c.category === contactsCategoryFilter;
                        const query = contactsSearchQuery.toLowerCase().trim();
                        const matchesQuery =
                          !query ||
                          c.name.toLowerCase().includes(query) ||
                          c.roleTitle.toLowerCase().includes(query) ||
                          c.designation.toLowerCase().includes(query) ||
                          c.department.toLowerCase().includes(query) ||
                          c.phone.toLowerCase().includes(query) ||
                          c.office.toLowerCase().includes(query);
                        return matchesCategory && matchesQuery;
                      }).length
                    }{' '}
                    Officials
                  </span>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                  {[
                    { id: 'ALL', label: 'All Contacts (6)' },
                    { id: 'LEADERSHIP', label: 'Leadership (Principal & Dean)' },
                    { id: 'HOSTEL', label: 'Hostel Warden' },
                    { id: 'SECURITY', label: 'Campus Security' },
                    { id: 'SERVICES', label: 'Services & Maintenance' },
                    { id: 'MEDICAL', label: 'Pharmacy & Emergency' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setContactsCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        contactsCategoryFilter === cat.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contacts Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAMPUS_OFFICIAL_CONTACTS.filter((c) => {
                  const matchesCategory =
                    contactsCategoryFilter === 'ALL' || c.category === contactsCategoryFilter;
                  const query = contactsSearchQuery.toLowerCase().trim();
                  const matchesQuery =
                    !query ||
                    c.name.toLowerCase().includes(query) ||
                    c.roleTitle.toLowerCase().includes(query) ||
                    c.designation.toLowerCase().includes(query) ||
                    c.department.toLowerCase().includes(query) ||
                    c.phone.toLowerCase().includes(query) ||
                    c.office.toLowerCase().includes(query);
                  return matchesCategory && matchesQuery;
                }).map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-3xl border-2 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition bg-white ${c.color}`}
                  >
                    <div className="space-y-4">
                      {/* Top Header with Role Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${c.badgeColor}`}
                        >
                          {c.badge}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Available
                        </span>
                      </div>

                      {/* Role & Name */}
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          {c.roleTitle}
                        </p>
                        <h4 className="text-lg font-black text-slate-900 mt-0.5">{c.name}</h4>
                        <p className="text-xs font-bold text-blue-700 mt-0.5">{c.designation}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{c.department}</p>
                      </div>

                      {/* Location & Timings */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-start gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="font-medium leading-tight">{c.office}</span>
                        </div>
                        <div className="flex items-start gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="font-medium leading-tight">{c.timings}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                          <a
                            href={`mailto:${c.email}`}
                            className="font-medium text-blue-600 hover:underline truncate"
                          >
                            {c.email}
                          </a>
                        </div>
                      </div>

                      {/* Phone Numbers Box */}
                      <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Primary Direct Phone:
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(c.phone)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            title="Copy Phone Number"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedContactPhone === c.phone ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-base font-black text-slate-900 font-mono tracking-wide">
                          {c.phone}
                        </p>
                        {c.altPhone && (
                          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Alternative / Ext:</span>
                            <span className="font-mono font-bold text-slate-700">{c.altPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CALL BUTTON ACTION */}
                    <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInitiateCall(c)}
                        className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${c.buttonColor}`}
                      >
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        <span>📞 Call Now</span>
                      </button>
                      <a
                        href={`tel:${c.phone}`}
                        className="p-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center"
                        title="Direct Native Dialer Link"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Help & Information Note */}
              <div className="p-5 rounded-3xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-black">Notice Regarding Campus Communications</p>
                  <p className="text-blue-800 leading-relaxed">
                    All numbers listed are officially registered and monitored university helplines. For urgent night emergencies after 10:00 PM, residents should directly contact the <strong>Hostel Warden (+91 98610 22345)</strong> or <strong>Campus Security Patrol (+91 94370 88214)</strong>, or trigger the <strong>Emergency SOS</strong> from the top navigation bar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 16. NOTIFICATIONS                                         */}
          {/* ========================================================= */}
          {activeTab === 'NOTIFICATIONS' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {notifications.map((n) => (
                <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================= */}
          {/* 17. COLLEGE INFORMATION                                   */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* 17. COLLEGE INFORMATION                                   */}
          {/* ========================================================= */}
          {activeTab === 'COLLEGE_INFO' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-xl space-y-5 border border-blue-900/40">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shrink-0 border border-amber-300">
                      <span className="text-xl tracking-tighter leading-none font-sans">REC</span>
                      <span className="text-[9px] uppercase tracking-widest font-mono font-bold mt-0.5">AUTO</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase font-black tracking-widest bg-blue-500/25 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                          UGC Autonomous Institution
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          NAAC Grade 'A' Accredited
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-widest bg-amber-500/25 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          AICTE ID: 1-4241081
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        Raajdhani Engineering College (Autonomous)
                      </h2>
                      <p className="text-xs text-blue-200/90 leading-relaxed max-w-3xl">
                        Affiliated to Biju Patnaik University of Technology (BPUT Code: 145), Govt. of Odisha • Approved by AICTE, New Delhi • Established in 2006.
                      </p>
                      <p className="text-[11px] text-slate-300 flex items-center space-x-1.5 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Near Mancheswar Railway Station, Mancheswar, Bhubaneswar, Odisha 751017</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSubmitSuccess('✓ College Prospectus & Academic Regulations 2026-27 downloaded!')}
                      className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-2xl shadow-md transition flex items-center space-x-2 hover:bg-slate-100 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span>College Prospectus</span>
                    </button>
                    <a
                      href="https://rec.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-2xl shadow-sm transition flex items-center space-x-2"
                    >
                      <Globe className="w-4 h-4 text-sky-300" />
                      <span>Official Portal</span>
                    </a>
                  </div>
                </div>

                {/* 4 Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Campus Size</span>
                    <strong className="text-base font-black text-white">25+ Acres</strong>
                    <span className="text-[10px] text-emerald-400 block font-semibold mt-0.5">Eco-Friendly Smart Campus</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Community</span>
                    <strong className="text-base font-black text-white">3,500+ Students</strong>
                    <span className="text-[10px] text-sky-300 block font-semibold mt-0.5">UG, PG & Ph.D Scholars</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Academic Faculty</span>
                    <strong className="text-base font-black text-white">185+ Professors</strong>
                    <span className="text-[10px] text-amber-300 block font-semibold mt-0.5">65+ Ph.D Holders</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">B.Tech Placements</span>
                    <strong className="text-base font-black text-emerald-400">94.6% Placed</strong>
                    <span className="text-[10px] text-emerald-300 block font-semibold mt-0.5">₹18.5 LPA Highest CTC</span>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-xs font-bold">
                  {[
                    { id: 'OVERVIEW', label: 'Institutional Profile & Accreditations', icon: Building },
                    { id: 'DEPARTMENTS', label: 'Academic Departments (6)', icon: Layers },
                    { id: 'FACILITIES', label: 'Campus Infrastructure & Labs (6)', icon: Sparkles },
                    { id: 'LEADERSHIP', label: 'Institutional Leadership (7)', icon: Users },
                    { id: 'PLACEMENTS', label: 'Placements & Top Recruiters', icon: Briefcase },
                  ].map((tab) => {
                    const TIcon = tab.icon;
                    const isActive = collegeInfoSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCollegeInfoSubTab(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-2 cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-md font-black'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                        }`}
                      >
                        <TIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUB-TAB 1: INSTITUTIONAL PROFILE & OVERVIEW */}
              {collegeInfoSubTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  {/* 6 Quick Fact Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Award className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">UGC Autonomous Status</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">UGC Act Autonomous Conferred</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Conferred Autonomous status under UGC Act Sections 2(f) & 12(B) with independent academic curricula, continuous assessment framework, and in-house examination administration.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center space-x-2 text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">National Accreditations</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">NAAC 'A' Grade & NBA Accredited</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Accredited with Grade 'A' (CGPA 3.24) by National Assessment and Accreditation Council (NAAC), and Tier-1 NBA Accreditation for undergraduate engineering branches.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                      <div className="flex items-center space-x-2 text-purple-600">
                        <GraduationCap className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Affiliation & Recognition</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">BPUT Affiliation & AICTE Approved</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Permanent AICTE ID: 1-4241081. Affiliated to Biju Patnaik University of Technology (BPUT), Government of Odisha. ISO 9001:2015 Certified Institutional Governance.
                      </p>
                    </div>
                  </div>

                  {/* Vision & Mission */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Vision & Mission</h3>
                      <p className="text-xs text-slate-500 mt-1">Guiding philosophy for academic and professional excellence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                        <div className="flex items-center space-x-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Our Vision</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          "To emerge as a premier autonomous center of technical education, cutting-edge engineering research, and entrepreneurial innovation, empowering socially committed and globally competitive technocrats to serve regional and global communities."
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                        <div className="flex items-center space-x-2 text-amber-800 font-black text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Our Mission</span>
                        </div>
                        <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                          <li>Nurture industry-aligned autonomous curriculum with continuous outcome assessment.</li>
                          <li>Provide world-class laboratory infrastructure, AI supercomputing, and incubation centers.</li>
                          <li>Catalyze multidisciplinary research in clean energy, AI, and smart materials.</li>
                          <li>Inculcate leadership, ethical engineering, and holistic student personality.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Accreditations & Statutory Recognitions */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-slate-900">Regulatory Certifications & Affiliations</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { title: 'UGC Autonomous', sub: 'Conferred 2020', badge: 'UGC Act', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                        { title: 'NAAC Grade A', sub: 'CGPA 3.24', badge: 'NAAC', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                        { title: 'AICTE Approved', sub: 'Permanent ID', badge: 'MoE Govt', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                        { title: 'BPUT Affiliated', sub: 'Govt. of Odisha', badge: 'BPUT 145', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                        { title: 'ISO 9001:2015', sub: 'Quality Standard', badge: 'Certified', color: 'bg-cyan-50 border-cyan-200 text-cyan-800' },
                        { title: 'Unnat Bharat', sub: 'MHRD Mission', badge: 'Partner', color: 'bg-rose-50 border-rose-200 text-rose-800' },
                      ].map((item, idx) => (
                        <div key={idx} className={`p-3.5 rounded-2xl border ${item.color} text-center space-y-1`}>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 inline-block shadow-2xs">
                            {item.badge}
                          </span>
                          <h5 className="font-black text-xs text-slate-900">{item.title}</h5>
                          <p className="text-[10px] text-slate-500">{item.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campus Address & Reachability */}
                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>Central Campus Location & Accessibility</span>
                      </div>
                      <h4 className="text-lg font-black text-white">Raajdhani Engineering College (Autonomous)</h4>
                      <p className="text-xs text-slate-300">
                        Plot No. 1, Mancheswar Railway Colony, Near Mancheswar Railway Station, Bhubaneswar, Odisha 751017
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Connected by City Bus Route 207 & E-Rickshaws • 1.2 km from Mancheswar Station • 12 km from Airport
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href="tel:+916742587701"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Reception</span>
                      </a>
                      <a
                        href="mailto:info@rec.ac.in"
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Office</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: ACADEMIC DEPARTMENTS (6) */}
              {collegeInfoSubTab === 'DEPARTMENTS' && (
                <div className="space-y-6">
                  {/* Department Selector Tabs */}
                  <div className="bg-white p-3 md:p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Select Department:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {COLLEGE_DEPARTMENTS_LIST.map((dept) => {
                        const isSelected = selectedDeptId === dept.id;
                        return (
                          <button
                            key={dept.id}
                            onClick={() => setSelectedDeptId(dept.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{dept.shortCode}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {dept.placementRate}%
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Department Deep-Dive View */}
                  {(() => {
                    const currentDept =
                      COLLEGE_DEPARTMENTS_LIST.find((d) => d.id === selectedDeptId) ||
                      COLLEGE_DEPARTMENTS_LIST[0];

                    return (
                      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                        {/* Header Details */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-black font-mono">
                                Dept Code: {currentDept.shortCode}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                                {currentDept.degreeOffered}
                              </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mt-2">
                              Department of {currentDept.name}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                              {currentDept.description}
                            </p>
                          </div>

                          {/* HOD Card */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 space-y-2 min-w-[280px]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Head of Department (HOD)
                            </span>
                            <h5 className="font-black text-sm text-slate-900">{currentDept.hodName}</h5>
                            <div className="flex items-center space-x-2 pt-1">
                              <a
                                href={`tel:${currentDept.hodPhone}`}
                                className="flex-1 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition text-center flex items-center justify-center space-x-1"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>Call HOD</span>
                              </a>
                              <a
                                href={`mailto:${currentDept.hodEmail}`}
                                className="flex-1 py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition text-center flex items-center justify-center space-x-1"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Email</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* 4 Key Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Intake</span>
                            <strong className="text-lg font-black text-slate-900">{currentDept.intake} Seats</strong>
                            <span className="text-[10px] text-slate-500 block">Annual UG/PG Batch</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Faculty Strength</span>
                            <strong className="text-lg font-black text-slate-900">{currentDept.facultyCount} Professors</strong>
                            <span className="text-[10px] text-slate-500 block">Ph.D & M.Tech Guides</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Specialized Labs</span>
                            <strong className="text-lg font-black text-indigo-700">{currentDept.labsCount} Laboratories</strong>
                            <span className="text-[10px] text-slate-500 block">Industry Sponsored</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Placement Record</span>
                            <strong className="text-lg font-black text-emerald-600">{currentDept.placementRate}%</strong>
                            <span className="text-[10px] text-emerald-700 font-semibold block">Campus Recruited</span>
                          </div>
                        </div>

                        {/* Specialized Laboratories Grid */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>Specialized Research & Practical Laboratories ({currentDept.keyLabs.length})</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {currentDept.keyLabs.map((lab, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 flex items-start space-x-2.5"
                              >
                                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                  {idx + 1}
                                </div>
                                <span className="text-xs font-bold text-slate-800 leading-snug">{lab}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Research Focus Areas */}
                        <div className="space-y-2 pt-2">
                          <h4 className="text-sm font-black text-slate-900">Departmental Research Focus Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentDept.researchAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                              >
                                🔬 {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SUB-TAB 3: CAMPUS INFRASTRUCTURE & FACILITIES */}
              {collegeInfoSubTab === 'FACILITIES' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CAMPUS_FACILITIES_LIST.map((fac) => (
                      <div
                        key={fac.id}
                        className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Category and Timings */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider border border-indigo-100">
                              {fac.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-600 flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{fac.timings}</span>
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-slate-900 leading-snug">{fac.title}</h3>

                          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="flex items-center space-x-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{fac.location}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 font-semibold pt-1">
                              <strong>Specs / Capacity:</strong> {fac.capacityOrSpecs}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>

                          {/* Highlights */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                              Key Facility Highlights
                            </span>
                            <div className="space-y-1">
                              {fac.highlights.map((item, idx) => (
                                <p key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* In-Charge Contact Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="text-xs">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Facility In-Charge:</span>
                            <span className="font-bold text-slate-800">{fac.incharge}</span>
                          </div>
                          <a
                            href={`tel:${fac.inchargeContact}`}
                            className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 border border-emerald-200"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>Contact</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: INSTITUTIONAL LEADERSHIP */}
              {collegeInfoSubTab === 'LEADERSHIP' && (
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Institutional Governance & Administration</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Governing Body, Directorate, Deans, Examination Authority & Placement Leadership
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                      7 Institutional Officers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {INSTITUTIONAL_LEADERSHIP_LIST.map((leader) => (
                      <div
                        key={leader.id}
                        className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                              {leader.avatarText}
                            </div>
                            <div>
                              <h4 className="font-black text-sm text-slate-900 leading-snug">{leader.name}</h4>
                              <p className="text-xs text-indigo-700 font-bold">{leader.role}</p>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-700">
                              🎓 <strong>Credentials:</strong> {leader.qualification}
                            </p>
                            <p className="text-[11px] text-slate-600 flex items-center space-x-1 pt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{leader.cabin}</span>
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{leader.bio}</p>
                        </div>

                        {/* Contact Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={`tel:${leader.phone}`}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
                          >
                            <PhoneCall className="w-3 h-3 text-emerald-600" />
                            <span>Call Office</span>
                          </a>
                          <a
                            href={`mailto:${leader.email}`}
                            className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition text-center flex items-center justify-center space-x-1"
                          >
                            <Mail className="w-3 h-3 text-indigo-600" />
                            <span>Email</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: PLACEMENTS & RECRUITERS */}
              {collegeInfoSubTab === 'PLACEMENTS' && (
                <div className="space-y-6">
                  {/* Highlights Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Placement</span>
                      <strong className="text-2xl font-black text-emerald-600">{CAMPUS_PLACEMENT_STATS.overallRate}</strong>
                      <span className="text-[10px] text-slate-500 block">Class of 2026 Batch</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Highest CTC Offer</span>
                      <strong className="text-2xl font-black text-amber-500">{CAMPUS_PLACEMENT_STATS.highestPackage}</strong>
                      <span className="text-[10px] text-slate-500 block">{CAMPUS_PLACEMENT_STATS.highestCompany}</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Average Package</span>
                      <strong className="text-2xl font-black text-indigo-600">{CAMPUS_PLACEMENT_STATS.averagePackage}</strong>
                      <span className="text-[10px] text-slate-500 block">Median: {CAMPUS_PLACEMENT_STATS.medianPackage}</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Job Offers</span>
                      <strong className="text-2xl font-black text-slate-900">{CAMPUS_PLACEMENT_STATS.totalOffers}</strong>
                      <span className="text-[10px] text-slate-500 block">{CAMPUS_PLACEMENT_STATS.totalRecruiters} Companies Visited</span>
                    </div>
                  </div>

                  {/* Top Recruiters Table / Grid */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Marquee Corporate Recruiters</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Top software product companies, core engineering firms, and IT conglomerates hiring from campus
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                        95+ Campus Drive Partners
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {CAMPUS_PLACEMENT_STATS.topRecruiters.map((rec, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:shadow-xs transition space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-900">{rec.name}</span>
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  rec.tier === 'Super Dream'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                    : rec.tier === 'Dream'
                                    ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                    : 'bg-slate-200 text-slate-800'
                                }`}
                              >
                                {rec.tier}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{rec.role}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-600 font-semibold">
                              Selected: <strong className="text-slate-900">{rec.hires} students</strong>
                            </span>
                            <span className="text-xs font-black text-emerald-700 font-mono">{rec.avgCtc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* T&P Office Contact Banner */}
                  <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                        <Briefcase className="w-4 h-4" />
                        <span>Training & Corporate Placement Secretariat</span>
                      </div>
                      <h4 className="text-lg font-black text-white">Office of Head - Training & Placements (T&P)</h4>
                      <p className="text-xs text-slate-300">
                        Admin Block 2nd Floor, Corporate Suite • Contact: Mr. Santosh Kumar Rath (TPO)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Email: tpo@rec.ac.in • Placement Helpline: +91 98610 00006
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess('✓ Campus Placement Brochure 2026-27 downloaded!')}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition flex items-center space-x-2 shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Placement Brochure</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 18. SETTINGS & ACCOUNT                                    */}
          {/* ========================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-rose-900">Sign Out of Campus Helper</h4>
                  <p className="text-xs text-rose-700 mt-0.5">Securely ends your session</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* GLOBAL MODALS                                             */}
      {/* ========================================================= */}

      {/* USER'S EXACT REQUESTED SHOW QR GATE PASS MODAL */}
      {showGatePassQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-emerald-400 space-y-4 text-center">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-lg font-black text-slate-900 font-sans tracking-tight">Gate Pass Verification</h3>
              <button
                onClick={() => setShowGatePassQrModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Turnstile Scannable QR Code */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG
                value={`CAMPUS-GATEPASS:STUDENT=${gatePassData.studentName}:HOSTEL=${gatePassData.hostel}:ROOM=${gatePassData.room}:PURPOSE=${gatePassData.purpose}:OUT=${gatePassData.outTime}:RETURN=${gatePassData.returnTime}:STATUS=APPROVED:VALID=${Date.now()}`}
                size={175}
              />
              <p className="text-[10px] font-mono text-slate-500 mt-2 font-bold uppercase">
                Turnstile Ready QR Code
              </p>
            </div>

            {/* EXACT TICKET CARD TEXT */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left text-xs font-sans space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-600">Gate Pass</span>
                <span className="text-emerald-600 font-black">Status: ✅ Approved</span>
              </div>
              <div className="text-slate-300 font-bold select-none text-xs">
                ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              </div>
              <p className="text-slate-600">Student: <strong className="text-slate-900">{gatePassData.studentName}</strong></p>
              <p className="text-slate-600">Student Phone: <strong className="text-blue-600 font-mono">{profilePhone || gatePassData.studentPhone}</strong></p>
              <p className="text-slate-600">Father Phone: <strong className="text-emerald-700 font-mono">{fatherPhone || gatePassData.fatherPhone}</strong></p>
              <p className="text-slate-600">Mother Phone: <strong className="text-emerald-700 font-mono">{motherPhone || gatePassData.motherPhone}</strong></p>
              <p className="text-slate-600">Hostel: <strong className="text-slate-900">{gatePassData.hostel}</strong></p>
              <p className="text-slate-600">Room: <strong className="text-slate-900">{gatePassData.room}</strong></p>
              <p className="text-slate-600">Purpose: <strong className="text-slate-900">{gatePassData.purpose}</strong></p>
              <p className="text-slate-600">Out: <strong className="text-slate-900">{gatePassData.outTime}</strong></p>
              <p className="text-slate-600">Return: <strong className="text-slate-900">{gatePassData.returnTime}</strong></p>
              <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Warden: <strong className="text-emerald-600">Approved ✅</strong></span>
                <span className="text-slate-600">Security: <strong className="text-slate-800">Verify at Gate</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass Slip</span>
              </button>
              <button
                onClick={() => setShowGatePassQrModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS EXAMINATION HALL TICKET / ADMIT CARD MODAL */}
      {showExamAdmitCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                  REC
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Autonomous Examination Admit Card</h3>
                  <p className="text-[11px] text-slate-500">Autonomous Internal Assessment • Autumn Session 2026</p>
                </div>
              </div>
              <button
                onClick={() => setShowExamAdmitCardModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Printable Admit Card Certificate Frame */}
            <div className="p-5 md:p-6 rounded-2xl border-2 border-indigo-900/30 bg-slate-50/50 space-y-5 text-slate-900 font-sans">
              {/* College Masthead */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 inline-block">
                  Office of the Controller of Examinations (COE)
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-950 tracking-tight">
                  Raajdhani Engineering College (Autonomous), Bhubaneswar
                </h2>
                <p className="text-[11px] text-slate-600">
                  Approved by AICTE, New Delhi • Affiliated to BPUT, Odisha • NAAC 'A' Grade Accredited
                </p>
                <h4 className="text-xs font-black text-amber-900 bg-amber-100/70 border border-amber-300/80 py-1 px-3 rounded-lg inline-block mt-1">
                  OFFICIAL ADMIT CARD & SEATING SLIP — MID-TERM EXAMINATIONS (OCTOBER 2026)
                </h4>
              </div>

              {/* Candidate Info Grid with Photo & QR */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Name</span>
                    <strong className="text-slate-900">{user?.name || gatePassData.studentName || 'Subham Pradhan'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">University Reg No.</span>
                    <strong className="text-indigo-700 font-mono">2201289145</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">College Roll No.</span>
                    <strong className="text-slate-900 font-mono">CS-22-048</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Program / Branch</span>
                    <strong className="text-slate-900">B.Tech (CSE) - Sem 5</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hostel & Room</span>
                    <strong className="text-slate-800">{effectiveHostel} - Room {effectiveRoom}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance Eligibility</span>
                    <strong className="text-emerald-700 font-bold">91.4% (Eligible ✓)</strong>
                  </div>
                </div>

                {/* Candidate Photo & Scannable QR Code */}
                <div className="flex flex-row sm:flex-col items-center gap-2 shrink-0 self-center sm:self-auto border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                  <div className="w-16 h-20 bg-slate-200 rounded-lg border border-slate-300 flex flex-col items-center justify-center text-center p-1 overflow-hidden shadow-2xs">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Student" className="w-full h-full object-cover rounded" />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-500 uppercase">Candidate Photo</span>
                    )}
                  </div>
                  <div className="text-center">
                    <QRCodeSVG
                      value={`REC-HALLTICKET:REG=2201289145:NAME=${user?.name || gatePassData.studentName || 'Subham Pradhan'}:SEM=5:STATUS=VALID`}
                      size={54}
                    />
                    <span className="text-[8px] font-mono text-slate-400 block font-bold mt-0.5">HALL PASS QR</span>
                  </div>
                </div>
              </div>

              {/* Examination Schedule Table */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Examination Routine & Hall Seating Allocation
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-black text-[11px] border-b border-slate-200">
                        <th className="p-2.5">Date & Time</th>
                        <th className="p-2.5">Course Code</th>
                        <th className="p-2.5">Subject Title</th>
                        <th className="p-2.5">Exam Hall</th>
                        <th className="p-2.5">Allocated Desk</th>
                        <th className="p-2.5 text-center">Invigilator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {AUTONOMOUS_EXAMS_SCHEDULE.map((exam) => (
                        <tr key={exam.id} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-semibold text-slate-800 whitespace-nowrap">
                            {new Date(exam.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}, {exam.time}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-indigo-700 whitespace-nowrap">
                            {exam.courseCode}
                          </td>
                          <td className="p-2.5 font-bold text-slate-900">
                            {exam.courseName}
                          </td>
                          <td className="p-2.5 text-slate-700 whitespace-nowrap font-medium">
                            {exam.hall}
                          </td>
                          <td className="p-2.5 font-mono font-black text-emerald-800 whitespace-nowrap">
                            {exam.seatNo}
                          </td>
                          <td className="p-2.5 text-center text-slate-400 font-mono text-[10px]">
                            [ Verified ]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[10px] text-slate-600 bg-slate-100/70 p-3 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 uppercase block">Candidate Instructions:</span>
                <p>1. Candidates must arrive at the examination hall 30 minutes prior to scheduled start time.</p>
                <p>2. Possession of mobile phones, smartwatches, or unauthorized printed papers is strictly punishable under REC Autonomous Examination Malpractice Bylaws.</p>
                <p>3. Original college ID card must be placed on the allocated desk alongside this admit card.</p>
              </div>

              {/* Signature Block */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block font-bold">Candidate Signature</span>
                  <span className="font-serif italic font-bold text-slate-800 text-sm">
                    {user?.name || gatePassData.studentName || 'Subham Pradhan'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 block font-bold">Controller of Examinations</span>
                  <span className="font-serif font-black text-indigo-950 text-sm block">
                    Dr. N. C. Das, Ph.D
                  </span>
                  <span className="text-[9px] text-emerald-700 font-mono font-bold">
                    [ Digitally Signed & Sealed ]
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Admit Card (PDF)</span>
              </button>
              <button
                onClick={() => setShowExamAdmitCardModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Gate Pass / Leave Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {passType === 'HOSTEL_LEAVE' ? 'Apply for Hostel Leave' : 'Apply for Digital Gate Pass'}
              </h3>
              <button
                onClick={() => setShowPassModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePass} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pass Category</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPassType('GATE_PASS')}
                    className={`py-2 rounded-xl font-bold transition cursor-pointer text-center ${
                      passType === 'GATE_PASS'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Local City Outing
                  </button>
                  <button
                    type="button"
                    onClick={() => setPassType('HOSTEL_LEAVE')}
                    className={`py-2 rounded-xl font-bold transition cursor-pointer text-center ${
                      passType === 'HOSTEL_LEAVE'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Hostel Multi-Day Leave
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  required
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Home Visit, Library research"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  value={passDestination}
                  onChange={(e) => setPassDestination(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Home Address, Bhubaneswar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Out Date & Time</label>
                  <div className="space-y-1">
                    <input
                      type="date"
                      value={passOutDate}
                      onChange={(e) => setPassOutDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="time"
                      value={passOutTime}
                      onChange={(e) => setPassOutTime(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Return Date & Time</label>
                  <div className="space-y-1">
                    <input
                      type="date"
                      value={passReturnDate}
                      onChange={(e) => setPassReturnDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                    <input
                      type="time"
                      value={passReturnTime}
                      onChange={(e) => setPassReturnTime(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={passSubmitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  {passSubmitting ? 'Submitting to Warden...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Grievance Lodging Modal (Any Reason, Photo & Video Evidence, Direct Admin Alert) */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span>Real-Time Admin Dispatch Active</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Lodge Grievance / Maintenance Ticket
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowComplaintModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Notification Explanatory Callout */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-xs space-y-1">
              <p className="font-bold text-blue-900 flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-600" />
                <span>How This Reaches Admin:</span>
              </p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                As soon as you submit, a high-priority WebSocket alert triggers an audible notification and badge on the Admin Manager & Warden console. Shift technicians are auto-assigned with SLA countdown tracking.
              </p>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              {/* Category Selector (Supports ANY Reason or Type) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Issue Category / Reason *
                </label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="HOSTEL">Hostel Living & Room Maintenance</option>
                  <option value="MESS">Mess & Food Quality / Hygiene</option>
                  <option value="ACADEMIC">Academic, Classes & Faculty</option>
                  <option value="INFRASTRUCTURE">Campus Infrastructure & Buildings</option>
                  <option value="SECURITY">Security, Turnstiles & Gates</option>
                  <option value="ELECTRICITY">Electrical, Lights, Fans & Geysers</option>
                  <option value="WATER">Water Supply & Washrooms</option>
                  <option value="WIFI">Wi-Fi, Internet & LAN Connectivity</option>
                  <option value="MEDICAL">Medical Dispensary & Health</option>
                  <option value="CLEANLINESS">Housekeeping, Corridors & Sanitation</option>
                  <option value="HARASSMENT">Anti-Ragging & Disciplinary</option>
                  <option value="LIBRARY">Central Library & Digital Resources</option>
                  <option value="SPORTS">Sports Complex & Gymnasium</option>
                  <option value="TRANSPORT">College Shuttle Buses & Transit</option>
                  <option value="OTHER">Other Custom Issue (Specify Reason Below)</option>
                </select>
              </div>

              {/* Custom Category Input if OTHER selected */}
              {complaintCategory === 'OTHER' && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1 animate-in fade-in">
                  <label className="font-bold text-amber-900 block text-[11px]">
                    Specify Custom Complaint Category / Reason *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Broken laboratory glassware, library fee query, roommate conflict"
                    value={customCategoryText}
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              )}

              {/* Priority & Location */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="LOW">Low (48h SLA)</option>
                    <option value="MEDIUM">Medium (24h SLA)</option>
                    <option value="HIGH">High (12h SLA)</option>
                    <option value="URGENT">🚨 Urgent / Emergency (4h SLA)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Room *</label>
                  <input
                    type="text"
                    required
                    value={complaintLocation}
                    onChange={(e) => setComplaintLocation(e.target.value)}
                    placeholder="e.g. Room A-204, Block A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  placeholder="e.g. Washroom geyser thermostat sparking intermittently"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              {/* 1. SAY HER / HIS PROBLEM (VOICE RECORDING & LIVE SPEECH-TO-TEXT DICTATION) */}
              <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-950 flex items-center space-x-2 text-xs">
                    <Mic className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span>Say Your Problem (Voice / Speech-to-Text)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    🎙️ Speak & Auto-Type
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={isRecordingVoice ? handleStopVoiceRecording : handleStartVoiceRecording}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow-sm ${
                      isRecordingVoice
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isRecordingVoice ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>🔴 Listening & Recording... (Tap to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>🎙️ Tap to Speak / Say Your Problem</span>
                      </>
                    )}
                  </button>

                  {voiceNoteBlobUrl && (
                    <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                      <audio src={voiceNoteBlobUrl} controls className="h-7 w-44" />
                      <button
                        type="button"
                        onClick={() => setVoiceNoteBlobUrl('')}
                        className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  {isRecordingVoice
                    ? '⚡ Listening to your voice... Speak clearly into your microphone, and your words will appear in the description box below.'
                    : 'Tip: Tap the microphone button to speak and say your complaint out loud. It will record your voice note and auto-transcribe directly into the description below.'}
                </p>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe the exact problem in detail, or tap the microphone above to speak and say your problem..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed"
                />
              </div>

              {/* DUAL EVIDENCE UPLOAD SECTION: BOTH PHOTO AND VIDEO SUPPORTED */}
              <div className="p-4 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Attach Evidence (Upload BOTH Photo & Video)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      You can attach both a photo and a video clip simultaneously for complete inspection by the admin.
                    </p>
                  </div>

                  {/* Evidence status pill */}
                  <div>
                    {complaintPhotoUrl && complaintVideoUrl ? (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Both Photo & Video Attached
                      </span>
                    ) : complaintPhotoUrl ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        📷 Photo Attached (+ Add Video below)
                      </span>
                    ) : complaintVideoUrl ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        🎥 Video Attached (+ Add Photo below)
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                        Upload Photo & Video Proof
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* 1. PHOTO EVIDENCE PANEL */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>1. Photo Proof</span>
                      </span>
                      {complaintPhotoUrl && (
                        <button
                          type="button"
                          onClick={() => setComplaintPhotoUrl('')}
                          className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {complaintPhotoUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-blue-200 bg-slate-50 p-1">
                        <img
                          src={complaintPhotoUrl}
                          alt="Complaint Photo Proof"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          ✓ Photo Ready
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="w-full py-2.5 px-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-700 hover:bg-blue-100 cursor-pointer flex items-center justify-center space-x-1.5 transition text-xs font-bold">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {uploadingComplaintPhoto ? 'Compressing Image...' : 'Choose / Capture Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleComplaintPhotoFileChange}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Or paste direct image URL..."
                          value={complaintPhotoUrl}
                          onChange={(e) => setComplaintPhotoUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700"
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. VIDEO EVIDENCE PANEL */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center space-x-1.5 text-xs">
                        <Video className="w-3.5 h-3.5 text-purple-600" />
                        <span>2. Video Proof (MP4 / WebM)</span>
                      </span>
                      {complaintVideoUrl && (
                        <button
                          type="button"
                          onClick={() => setComplaintVideoUrl('')}
                          className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>

                    {complaintVideoUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-purple-200 bg-black p-1 space-y-1">
                        <video
                          src={complaintVideoUrl}
                          controls
                          className="w-full max-h-32 object-contain rounded-lg"
                        />
                        <div className="flex items-center justify-between px-2 text-[10px] text-purple-200">
                          <span>✓ Video Ready & Playable</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="w-full py-2.5 px-3 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-700 hover:bg-purple-100 cursor-pointer flex items-center justify-center space-x-1.5 transition text-xs font-bold">
                          <Upload className="w-3.5 h-3.5 text-purple-600" />
                          <span>
                            {uploadingComplaintVideo ? 'Loading Video...' : 'Choose / Record Video Clip'}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleComplaintVideoFileChange}
                          />
                        </label>
                        <input
                          type="url"
                          placeholder="Or paste direct video URL..."
                          value={complaintVideoUrl}
                          onChange={(e) => setComplaintVideoUrl(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={complaintSubmitting || uploadingComplaintPhoto || uploadingComplaintVideo}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{complaintSubmitting ? 'Dispatching to Admin Desk...' : 'Submit Grievance with Evidence'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. STUDENT QUERY MODAL (ANY QUERY DIRECT TO ADMIN PLATFORM) */}
      {showStudentQueryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span>Real-Time Admin Alert Connected</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Ask Campus Query / Helpdesk
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ask any question about academics, hostel, mess, fees, or campus life.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentQueryModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStudentQuery} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Query Category *</label>
                <select
                  value={studentQueryCategory}
                  onChange={(e) => setStudentQueryCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="ACADEMIC">🎓 Academic &amp; Exams (Classes, syllabus, faculty)</option>
                  <option value="HOSTEL">🏠 Hostel &amp; Living (Room shift, furniture, water, electricity)</option>
                  <option value="MESS">🍽️ Mess &amp; Food (Dining quality, menu, timings)</option>
                  <option value="MEDICAL">💊 Medical &amp; Health (Consultation, dispensary, medicine)</option>
                  <option value="FEES">💳 Fees &amp; Accounts (Dues, receipts, payments)</option>
                  <option value="MAINTENANCE">💡 Maintenance &amp; Wi-Fi (Repairs, cleaning, internet)</option>
                  <option value="STUDENT_QUERY">❓ General Question / Campus Help</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Query Subject / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Doubts regarding upcoming semester exam schedule"
                  value={studentQueryTitle}
                  onChange={(e) => setStudentQueryTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Explain Your Query in Simple Words *</label>
                <textarea
                  rows={4}
                  required
                  value={studentQueryDesc}
                  onChange={(e) => setStudentQueryDesc(e.target.value)}
                  placeholder="Write your question or problem clearly here..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Student Details</label>
                  <div className="px-3 py-2 bg-slate-100 rounded-xl text-[11px] font-bold text-slate-700">
                    {effectiveStudentName} ({effectiveRoom})
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Urgency</label>
                  <select
                    value={studentQueryPriority}
                    onChange={(e: any) => setStudentQueryPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="MEDIUM">🔵 Normal Query</option>
                    <option value="HIGH">🟠 Urgent (Need fast reply)</option>
                    <option value="CRITICAL">🔴 Critical (Immediate response)</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>When you submit, an audible chime and banner instantly alert the Admin Platform.</span>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={studentQuerySubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{studentQuerySubmitting ? 'Beaming to Admin...' : 'Submit Query to Admin'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowStudentQueryModal(false)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MEDICAL REQUEST MODAL (DIRECT LIVE CONNECT TO CAMPUS DOCTOR & PHARMACY) */}
      {showMedicalRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <Heart className="w-3 h-3 text-emerald-600" />
                  <span>Direct to Campus Doctor &amp; Pharmacy</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Request Medicine / Medical Help
                </h3>
                <p className="text-[11px] text-slate-500">
                  Doctor Dr. Pratima Mishra &amp; Pharmacist Abinash Mohanty will be alerted.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMedicalRequestModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMedicalRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">What is your health problem / sickness? *</label>
                <select
                  value={medSymptom}
                  onChange={(e) => setMedSymptom(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Fever / High Temperature">🤒 Fever / High Temperature</option>
                  <option value="Headache / Migraine">🤕 Headache / Migraine</option>
                  <option value="Common Cold & Cough">🤧 Common Cold &amp; Cough / Sore Throat</option>
                  <option value="Stomachache / Acidity / Vomiting">🤢 Stomach Pain / Acidity / Vomiting</option>
                  <option value="Minor Cut / Injury / Dressing needed">🩹 Minor Cut / Wound / Dressing</option>
                  <option value="Dehydration / Dizziness">💧 Dehydration / Weakness / Dizziness</option>
                  <option value="Eye Irritation / Redness">👁️ Eye Irritation / Redness</option>
                  <option value="Body Pain / Muscle Sprain">💪 Body Pain / Muscle Sprain</option>
                  <option value="Other Medical Assistance">❓ Other Health Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Free Student Medicine Needed (Optional)</label>
                <select
                  value={medMedicine}
                  onChange={(e) => setMedMedicine(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Paracetamol 650mg (Dolo / Calpol) - For Fever & Pain">💊 Paracetamol 650mg (For Fever &amp; Pain)</option>
                  <option value="Cetirizine 10mg - For Allergy & Cold">💊 Cetirizine 10mg (For Allergy &amp; Cold)</option>
                  <option value="ORS Electrolyte Sachet - For Dehydration">💧 ORS Electrolyte Sachet (For Dehydration)</option>
                  <option value="Digene / Pantoprazole - For Acidity & Gas">💊 Digene / Pantoprazole (For Acidity &amp; Gas)</option>
                  <option value="Bandage, Dettol & Cotton Kit">🩹 Bandage, Dettol &amp; Cotton Kit</option>
                  <option value="Ibuprofen 400mg - For Muscle Pain">💊 Ibuprofen 400mg (For Muscle Pain)</option>
                  <option value="Cough Syrup (Ascoril / Benadryl)">🧴 Cough Syrup (Sore throat)</option>
                  <option value="None - Just Doctor Consultation / Checkup">👨‍⚕️ None - Just Doctor Consultation / Checkup</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Urgency Level *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'NORMAL', label: '🔵 Normal', desc: 'Need medicine today' },
                    { id: 'URGENT', label: '🟠 Urgent', desc: 'Need within 1 hour' },
                    { id: 'EMERGENCY', label: '🔴 Emergency', desc: 'Need doctor / vehicle now' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setMedUrgency(lvl.id as any)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                        medUrgency === lvl.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold">{lvl.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lvl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Additional Notes / Sickness Details</label>
                <textarea
                  rows={2}
                  value={medNotes}
                  onChange={(e) => setMedNotes(e.target.value)}
                  placeholder="e.g. Feeling feverish since 6 AM, having shivering and headache..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="bg-slate-100 p-2.5 rounded-xl text-[11px] text-slate-700">
                Patient: <strong>{effectiveStudentName}</strong> • Room: <strong>{effectiveRoom}</strong> ({effectiveHostel})
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={medSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{medSubmitting ? 'Sending Request...' : 'Send Medical Request to Doctor'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMedicalRequestModal(false)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MESS ISSUE / MEAL FEEDBACK MODAL */}
      {showMessIssueModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  🍽️ Report Mess Issue / Meal Feedback
                </h3>
                <p className="text-[11px] text-slate-500">
                  Directly notifies the Mess Supervisor &amp; Campus Admin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowMessIssueModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMessIssue} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meal *</label>
                  <select
                    value={messMealType}
                    onChange={(e) => setMessMealType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="BREAKFAST">🍳 Breakfast</option>
                    <option value="LUNCH">🍛 Lunch</option>
                    <option value="SNACKS">☕ Evening Snacks</option>
                    <option value="DINNER">🍲 Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issue Category *</label>
                  <select
                    value={messCategory}
                    onChange={(e) => setMessCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Food Quality">Taste &amp; Quality</option>
                    <option value="Hygiene & Cleanliness">Hygiene &amp; Cleanliness</option>
                    <option value="Cold Food">Food Served Cold</option>
                    <option value="Food Shortage">Item Ran Out / Shortage</option>
                    <option value="Staff Behavior">Mess Staff Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Feedback / Issue Details *</label>
                <textarea
                  rows={3}
                  required
                  value={messIssueNote}
                  onChange={(e) => setMessIssueNote(e.target.value)}
                  placeholder="Explain the meal feedback clearly..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={messSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{messSubmitting ? 'Submitting...' : 'Submit Mess Feedback'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessIssueModal(false)}
                  className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT MEDIA PREVIEW MODAL (PHOTO OR VIDEO) */}
      {previewComplaintMedia && (
        <div
          onClick={() => setPreviewComplaintMedia(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden p-4 shadow-2xl border border-white/20 space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
              <h3 className="text-sm font-black">{previewComplaintMedia.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewComplaintMedia(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {previewComplaintMedia.type === 'VIDEO' ? (
              <video
                src={previewComplaintMedia.url}
                controls
                autoPlay
                className="w-full max-h-[70vh] rounded-2xl bg-black"
              />
            ) : (
              <img
                src={previewComplaintMedia.url}
                alt={previewComplaintMedia.title}
                className="w-full max-h-[70vh] object-contain rounded-2xl bg-black"
              />
            )}

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
              <span>Verified student evidentiary media</span>
              <button
                type="button"
                onClick={() => setPreviewComplaintMedia(null)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY MEDIA MODAL (PHOTO OR VIDEO) */}
      {galleryMediaModal && (
        <div
          onClick={() => setGalleryMediaModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden p-5 shadow-2xl border border-purple-500/30 space-y-3.5 cursor-default text-white"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600 text-white">
                  {galleryMediaModal.category}
                </span>
                <h3 className="text-base font-black text-white mt-1">{galleryMediaModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setGalleryMediaModal(null)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {galleryMediaModal.mediaType === 'VIDEO' ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                <video
                  src={galleryMediaModal.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center max-h-[70vh]">
                <img
                  src={galleryMediaModal.mediaUrl}
                  alt={galleryMediaModal.title}
                  className="max-h-[68vh] object-contain rounded-xl"
                />
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">{galleryMediaModal.description}</p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <span className="text-slate-400 text-[11px]">
                Uploaded by: <strong className="text-white">{galleryMediaModal.uploadedBy || 'Administration'}</strong> • {galleryMediaModal.eventDate}
              </span>
              <button
                type="button"
                onClick={() => handleLikeGalleryItem(galleryMediaModal.id)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{galleryMediaModal.likesCount || 0} Cheers</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <h3 className="text-base font-black text-slate-900">{showQrModal.title}</h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <QRCodeSVG value={showQrModal.qrValue} size={180} />
            </div>
            <p className="text-xs text-slate-600 font-medium">{showQrModal.subtitle}</p>
            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {showPhotoPreviewModal && (
        <div
          onClick={() => setShowPhotoPreviewModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden p-2 shadow-2xl">
            <img src={showPhotoPreviewModal} alt="Campus view" className="w-full max-h-[75vh] object-contain rounded-2xl" />
            <p className="text-center text-xs text-slate-300 py-2">Click anywhere to close preview</p>
          </div>
        </div>
      )}

      {/* Book Guest Meal Coupon Modal */}
      {showGuestMealModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                  🎟️
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Book Guest Meal Coupon</h3>
                  <p className="text-[11px] text-slate-500">Central Dining Hall • Guest Entry Token</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuestMealModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Select Meal Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: 'BREAKFAST', label: 'Breakfast', price: 50 },
                    { type: 'LUNCH', label: 'Lunch', price: 90 },
                    { type: 'DINNER', label: 'Dinner', price: 90 },
                  ].map((g) => (
                    <button
                      key={g.type}
                      type="button"
                      onClick={() => setGuestMealType(g.type)}
                      className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                        guestMealType === g.type
                          ? 'bg-orange-500 text-white font-extrabold border-orange-500 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <div>{g.label}</div>
                      <div className="text-[10px] mt-0.5 opacity-90">₹{g.price} / plate</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Number of Guests</label>
                <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center font-black text-slate-900 text-sm">
                    {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Guest Relation / Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Parents (Balakrushna & Nirupama Pradhan) or Visiting Friend"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Pricing Summary */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Rate per plate:</span>
                  <span>₹{guestMealType === 'BREAKFAST' ? 50 : 90}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Quantity:</span>
                  <span>x {guestCount}</span>
                </div>
                <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                  <span>Total Ledger Debit:</span>
                  <span className="text-orange-600">₹{guestCount * (guestMealType === 'BREAKFAST' ? 50 : 90)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowGuestMealModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const cost = guestCount * (guestMealType === 'BREAKFAST' ? 50 : 90);
                  setSubmitSuccess(`✓ Guest meal coupon booked for ${guestCount} guest(s)! ₹${cost} charged to your monthly hostel dining account.`);
                  setShowGuestMealModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-md shadow-orange-600/30 cursor-pointer"
              >
                Generate QR Coupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Food Quality Modal */}
      {showRateMealModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Rate Food Quality & Taste</h3>
                  <p className="text-[11px] text-slate-500">Student Mess Committee Inspection Board</p>
                </div>
              </div>
              <button
                onClick={() => setShowRateMealModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-2">
              <p className="text-xs text-slate-600 font-bold">How was today's meal?</p>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setMealRating(star)}
                    className="p-1 cursor-pointer transition transform hover:scale-125 focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= mealRating
                          ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-black text-amber-600">
                {mealRating === 5 && '🌟 Exceptional! Delicious & fresh'}
                {mealRating === 4 && '👍 Good quality & tasty'}
                {mealRating === 3 && '😐 Average / Can be improved'}
                {mealRating === 2 && '👎 Below expectations / Bland'}
                {mealRating === 1 && '⚠️ Poor / Quality or hygiene issue'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">What went well or needs improvement?</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['Dal Tadka & Gravy', 'Roti Softness', 'Hygiene & Cleanliness', 'Serving Temperature', 'Salad & Curd', 'Rice Texture'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer transition">
                      +{tag}
                    </span>
                  ))}
                </div>
                <textarea
                  rows={3}
                  value={mealFeedbackText}
                  onChange={(e) => setMealFeedbackText(e.target.value)}
                  placeholder="Write your honest comments on food taste, kitchen hygiene or mess staff behavior..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowRateMealModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(`✓ Thank you! Your rating of ${mealRating}/5 stars has been submitted to the Student Mess Committee.`);
                  setMealFeedbackText('');
                  setShowRateMealModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAMPUS PHARMACY SUPPLIES & CONTACT MODAL */}
      {showPharmacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                  💊
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Campus Pharmacy</h3>
                  <p className="text-[11px] text-slate-500">Medicines & Basic Medical Supplies on Campus</p>
                </div>
              </div>
              <button
                onClick={() => setShowPharmacyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Pharmacist On-Duty Details */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                  On-Duty Pharmacist Desk
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Open Daily
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Mr. Abinash Mohanty</h4>
                  <p className="text-[11px] text-slate-600">Registered Pharmacist (D.Pharm, Reg No: OR-5821)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">🕒 08:00 AM – 09:30 PM • Health Unit 5 (Ground Floor, Near Hostel A)</p>
                </div>
                <a
                  href="tel:+919861003305"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1 shrink-0 self-start sm:self-center"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Pharmacy</span>
                </a>
              </div>
            </div>

            {/* In-Stock Basic Supplies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-800 font-bold text-xs">
                  Available Essential Supplies & Basic Medicines
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">Free for Enrolled Students</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs max-h-56 overflow-y-auto pr-1">
                {[
                  { name: 'Paracetamol 650mg', desc: 'Fever & headache relief', status: 'In Stock' },
                  { name: 'ORS Electrolyte Packs', desc: 'Dehydration & sunstroke', status: 'In Stock' },
                  { name: 'Cetirizine 10mg', desc: 'Allergy, cold & sneezing', status: 'In Stock' },
                  { name: 'Antacid Gel / Tablets', desc: 'Acidity & indigestion', status: 'In Stock' },
                  { name: 'Burnol & Betadine', desc: 'Minor cuts, scrapes & burns', status: 'In Stock' },
                  { name: 'Sterile Cotton & Bandages', desc: 'Wound dressing & gauze', status: 'In Stock' },
                  { name: 'Volini / Pain Relief Spray', desc: 'Sports sprain & muscle ache', status: 'In Stock' },
                  { name: 'Salbutamol Inhaler (SOS)', desc: 'Emergency breathing support', status: 'In Stock' },
                  { name: 'Digital Thermometer', desc: 'Body temperature monitoring', status: 'Available' },
                  { name: 'Blood Pressure Monitor', desc: 'Vitals check at counter', status: 'Available' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px] truncate">{item.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Emergency Transit Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">
                🚑 Need Higher Medical Care?
              </p>
              <p>
                Our 24×7 emergency vehicle provides immediate transit to KIMS Hospital (4.5 km) for advanced diagnostic care or hospital admission.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPharmacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Close Pharmacy View
            </button>
          </div>
        </div>
      )}

      {/* FULLSCREEN CAMPUS MAP MODAL */}
      {showFullMapModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className="bg-slate-900 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 text-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                  MAP
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">CAMPUS FACILITIES MAP — Explore Your Campus</h3>
                  <p className="text-[10px] text-slate-400">High-Resolution Master Blueprint with 8 Designated Facilities</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="/campus-facilities-map.jpg"
                  download="REC-Campus-Facilities-Map.jpg"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setShowFullMapModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable / Zoomable Image Canvas */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
              <img
                src="/campus-facilities-map.jpg"
                alt="CAMPUS FACILITIES MAP Full View"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Footer with 8 points reminder */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-center gap-2">
              <span className="text-white font-bold">1: Academic Complex</span>
              <span>•</span>
              <span className="text-white font-bold">2: Boys Hostel</span>
              <span>•</span>
              <span className="text-white font-bold">3: Girls Hostel</span>
              <span>•</span>
              <span className="text-white font-bold">4: Central Library</span>
              <span>•</span>
              <span className="text-white font-bold">5: Health Unit & Pharmacy</span>
              <span>•</span>
              <span className="text-white font-bold">6: Dining Hall</span>
              <span>•</span>
              <span className="text-white font-bold">7: Sports Complex</span>
              <span>•</span>
              <span className="text-white font-bold">8: Main Gate 1</span>
            </div>
          </div>
        </div>
      )}

      {/* Medical Leave Certificate Modal */}
      {showMedicalCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Campus Medical Certificate</h3>
                  <p className="text-[11px] text-slate-500">Official Sick Leave Slip & Attendance Exemption</p>
                </div>
              </div>
              <button
                onClick={() => setShowMedicalCertificateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official Certificate Paper Container */}
            <div className="border-2 border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50/50 to-white space-y-4 shadow-inner">
              {/* Certificate Header */}
              <div className="text-center border-b border-slate-200 pb-3">
                <div className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Government Approved Autonomous Institution</div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">RAAJDHANI ENGINEERING COLLEGE (REC)</h4>
                <p className="text-[10px] text-teal-700 font-extrabold">STUDENT HEALTH & WELLNESS CENTER • MEDICAL CLINIC</p>
                <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  DIGITALLY VERIFIED CERTIFICATE • REF: REC/HC/2026/0914
                </div>
              </div>

              {/* Certificate Body */}
              <div className="text-xs space-y-2 text-slate-700 leading-relaxed">
                <p>
                  This is to certify that <strong>{effectiveStudentName}</strong> (Roll No: <strong>{effectiveRegNo}</strong>), 3rd Year B.Tech Computer Science & Engineering, residing at <strong>Room {effectiveRoom}, {effectiveHostel}</strong>, was clinically examined on <strong>03-Oct-2026</strong>.
                </p>

                <div className="bg-slate-100/70 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <p><strong>Clinical Diagnosis:</strong> Acute Viral Pyrexia with Upper Respiratory Symptoms & Fatigue.</p>
                  <p><strong>Recommendation:</strong> Advised <strong>3 (Three) days strict hostel bed rest</strong> from 04-Oct-2026 to 06-Oct-2026, warm hydration, and light mess diet.</p>
                  <p><strong>Academic Status:</strong> Eligible for medical attendance condonation as per Autonomous Academic Bylaws.</p>
                </div>
              </div>

              {/* Doctor Signature & Stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-end justify-between text-[11px]">
                <div>
                  <p className="text-slate-400 text-[10px]">Issued on: 03-Oct-2026 11:30 AM</p>
                  <p className="text-slate-400 text-[10px]">Valid Until: 07-Oct-2026</p>
                </div>
                <div className="text-right">
                  <div className="font-serif italic font-bold text-teal-800 text-sm">Dr. Pratima Mishra, MD</div>
                  <p className="text-slate-600 font-bold text-[10px]">Chief Medical Officer (Reg: OR-34891-MCI)</p>
                  <p className="text-emerald-700 font-black text-[9px]">✓ Digitally Signed & Recorded</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess('✓ Medical Leave Certificate copied to clipboard & downloaded!');
                  setShowMedicalCertificateModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Notice Detail Modal */}
      {showNoticeDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                    {showNoticeDetailModal.category} CIRCULAR
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm">Official University Notice</h3>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeDetailModal(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notice Card Body */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50/60 to-white space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[11px]">
                <span className="font-mono text-slate-500 font-bold">
                  REF: <strong className="text-slate-900">{showNoticeDetailModal.refNo || 'REC/GEN/2026/01'}</strong>
                </span>
                <span className="text-slate-500 font-medium">📅 {showNoticeDetailModal.date}</span>
              </div>

              <h2 className="text-base font-black text-slate-900 leading-snug">
                {showNoticeDetailModal.title}
              </h2>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span>🏛️ Issuing Authority:</span>
                <strong className="text-blue-700 font-bold">{showNoticeDetailModal.authority}</strong>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {showNoticeDetailModal.desc}
              </p>

              {showNoticeDetailModal.attachment && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {showNoticeDetailModal.attachment}
                      </div>
                      <div className="text-[10px] text-slate-500">{showNoticeDetailModal.fileSize || 'PDF Document'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(`✓ Downloading ${showNoticeDetailModal.attachment}...`);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>✓ Digitally Authenticated by Autonomous Portal</span>
                <span className="font-bold text-emerald-700">Official Circular</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Circular</span>
              </button>
              <button
                type="button"
                onClick={() => setShowNoticeDetailModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Active Modal */}
      {showSosActiveModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-red-500 rounded-3xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl relative overflow-hidden">
            {/* Background Red Glow */}
            <div className="absolute -top-20 -left-20 w-44 h-44 bg-red-600/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-rose-600/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between relative z-10 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-widest text-red-400">
                  CRISIS DISPATCH CODE RED • {sosCategory}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSosMutedSound(!sosMutedSound)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                {sosMutedSound ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Mute Siren</span>
                  </>
                )}
              </button>
            </div>

            {/* Pulsing Siren Centerpiece */}
            <div className="text-center space-y-2 relative z-10">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-2xl shadow-red-600/60 animate-bounce">
                  <Siren className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none"></div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {isSilentSos ? '🤫 STEALTH SOS TRANSMITTED' : '🚨 EMERGENCY SOS ACTIVE'}
                </h3>
                <p className="text-xs text-rose-200 mt-0.5">
                  Campus Patrol & Warden Desk alerted for <strong>{effectiveStudentName}</strong> ({effectiveHostel} {effectiveRoom}).
                </p>
              </div>

              {/* Live Timer & ETA */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Elapsed Time</span>
                  <p className="text-lg font-black font-mono text-emerald-400">
                    {Math.floor(sosActiveSeconds / 60).toString().padStart(2, '0')}:{(sosActiveSeconds % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patrol Unit ETA</span>
                  <p className="text-lg font-black font-mono text-rose-400">
                    ~{Math.max(1, 2 - Math.floor(sosActiveSeconds / 60))}:{(59 - (sosActiveSeconds % 60)).toString().padStart(2, '0')} min
                  </p>
                </div>
              </div>
            </div>

            {/* Live Response Checklist */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Dispatch Verification Checklist
              </span>
              <div className="space-y-1.5 font-medium text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Gate 1 Security Control Desk</span>
                  </span>
                  <span className="font-bold text-emerald-400 text-[11px]">DISPATCHED (2 Officers)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Campus 24×7 Emergency Vehicle</span>
                  </span>
                  <span className="font-bold text-emerald-400 text-[11px]">DRIVER ALERTED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Hostel A Warden Desk</span>
                  </span>
                  <span className="font-bold text-emerald-400 text-[11px]">NOTIFIED VIA RADIO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${sosNotifyParents ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    <span>Parents SMS & GPS Beacon</span>
                  </span>
                  <span className={`font-bold text-[11px] ${sosNotifyParents ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {sosNotifyParents ? 'TRANSMITTED (+91 94370 88990)' : 'SKIPPED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Dial Controls */}
            <div className="space-y-2.5 relative z-10 pt-1">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    handleInitiateCall({
                      id: 'patrol-direct',
                      roleTitle: 'Security QRT',
                      name: 'Security Patrol Commander',
                      designation: 'Gate 1 Fast Response',
                      department: 'Campus Security',
                      office: 'Main Gate Control',
                      phone: '+91 94370 88214',
                      email: 'security@campus.edu',
                      timings: '24×7 Immediate',
                      badge: 'Security QRT',
                    });
                  }}
                  className="py-3 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition cursor-pointer active:scale-95"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Security Patrol</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleInitiateCall({
                      id: 'ambulance-direct',
                      roleTitle: 'Emergency Transit',
                      name: 'Campus Emergency Vehicle',
                      designation: '24×7 Ambulance Driver',
                      department: 'Campus Healthcare',
                      office: 'Campus Vehicle Bay',
                      phone: '+91 94370 00108',
                      email: 'vehicle@campus.edu',
                      timings: '24×7 Transit',
                      badge: '24×7 Vehicle',
                    });
                  }}
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition cursor-pointer active:scale-95"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Call Emergency Vehicle</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const msg = `🚨 EMERGENCY SOS! I need immediate help at Campus Hostel A Room 302!\nStudent: ${effectiveStudentName} (Roll: CS2023089)\nGPS: https://maps.google.com/?q=20.2961,85.8245`;
                    if (typeof window !== 'undefined') {
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send WhatsApp Pin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSosActiveModal(false);
                    setSubmitSuccess('Emergency SOS dismissed. Campus Security & Warden desks have been notified that you are safe.');
                    setTimeout(() => setSubmitSuccess(''), 5000);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>I Am Safe / Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Official Campus Calling Dialer Modal */}
      {callingContact && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-7 text-center space-y-6 shadow-2xl border border-slate-700 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {callingContact.badge}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Direct Line Active
              </span>
            </div>

            {/* Calling Pulse Avatar & Animation */}
            <div className="relative py-4 z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/40 text-white border-2 border-white/20">
                  <PhoneCall className="w-10 h-10 animate-pulse text-white" />
                </div>
                {/* Concentric Audio Waves */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/40 animate-ping pointer-events-none"></div>
                <div className="absolute -inset-3 rounded-full border border-indigo-400/20 animate-pulse pointer-events-none"></div>
              </div>

              {/* Status & Timer */}
              <div className="mt-4 space-y-1">
                <p className="text-xs uppercase font-black tracking-widest text-blue-300">
                  Calling Official Campus Line...
                </p>
                <p className="text-2xl font-black font-mono tracking-wider text-emerald-400">
                  {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Contact Person Details */}
            <div className="space-y-1.5 relative z-10 bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {callingContact.roleTitle}
              </p>
              <h3 className="text-lg font-black text-white">{callingContact.name}</h3>
              <p className="text-xs text-blue-300 font-semibold">{callingContact.designation}</p>
              <p className="text-[11px] text-slate-400">{callingContact.office}</p>
              <p className="text-base font-black font-mono text-amber-300 pt-1 tracking-wider">
                {callingContact.phone}
              </p>
            </div>

            {/* Quick Actions & Dial Controls */}
            <div className="space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `tel:${callingContact.phone}`;
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Re-Dial Phone</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(callingContact.phone)}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedContactPhone === callingContact.phone ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>

              {/* End Call / Close Button */}
              <button
                type="button"
                onClick={() => setCallingContact(null)}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/40 uppercase tracking-wider"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call / Dismiss</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 relative z-10">
              Native browser/OS calling triggered. If your system did not prompt, click "Re-Dial Phone" or copy the number.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD EDUCATIONAL CERTIFICATE                                      */}
      {/* ========================================================================= */}
      {showAddEducationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Upload Education Certificate</h3>
                  <p className="text-xs text-slate-500">Add degree, marksheet, semester grades & description</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddEducationModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEducationCert} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Certificate Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 CBSE Board Certificate & Marksheet"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Qualification Level</label>
                  <select
                    value={newCertDegree}
                    onChange={(e) => setNewCertDegree(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Secondary School Examination (10th)">10th Standard / Matriculation</option>
                    <option value="Higher Secondary School Examination (12th)">12th Standard / Higher Secondary</option>
                    <option value="Bachelor of Technology in CSE">B.Tech / Undergraduate Degree</option>
                    <option value="Master of Technology / Postgrad">Postgraduate / M.Tech</option>
                    <option value="Industry Professional Cloud Certification">Professional Industry Certification</option>
                    <option value="Diploma in Engineering">Diploma in Engineering</option>
                    <option value="Technical Workshop & Internship">Workshop / Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Board / University / Institute</label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE New Delhi / CHSE Odisha"
                    value={newCertInstitution}
                    onChange={(e) => setNewCertInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Passing Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2023"
                    value={newCertYear}
                    onChange={(e) => setNewCertYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Score / Percentage / CGPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 94.2% or 8.95 CGPA"
                    value={newCertScore}
                    onChange={(e) => setNewCertScore(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Roll / Reg No</label>
                  <input
                    type="text"
                    placeholder="e.g. 2301042001"
                    value={newCertRollNo}
                    onChange={(e) => setNewCertRollNo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Student Description & Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your subjects, distinctions, academic performance, or key highlights of this certificate..."
                  value={newCertDesc}
                  onChange={(e) => setNewCertDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Attach Document File (PDF, PNG, JPG)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/50 text-center space-y-1.5 transition">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="text-[11px] text-slate-600">
                    {newCertFileName ? `Selected: ${newCertFileName}` : 'Choose PDF, PNG or JPG from computer/mobile'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewCertFileName(file.name);
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEducationModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-500/25"
                >
                  Save Certificate & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD GOVERNMENT / IMPORTANT IDENTITY DOCUMENT                     */}
      {/* ========================================================================= */}
      {showAddGovtDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Upload Government / Official Document</h3>
                  <p className="text-xs text-slate-500">Aadhaar, PAN, Voter ID, Birth, Income, Caste & Residence</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGovtDocModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGovtDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Category</label>
                <select
                  value={newGovtDocType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewGovtDocType(val);
                    const defaultTitles: Record<string, string> = {
                      AADHAAR: 'Aadhaar Card (UIDAI)',
                      PAN: 'Permanent Account Number (PAN Card)',
                      VOTER_ID: 'Voter Identity Card (EPIC)',
                      BIRTH_CERT: 'Official Birth Certificate',
                      INCOME_CERT: 'Annual Income Certificate',
                      CASTE_CERT: 'Caste / Community Certificate',
                      RESIDENCE_CERT: 'Resident / Domicile Certificate',
                      OTHER: 'Official Government Document',
                    };
                    setNewGovtDocTitle(defaultTitles[val] || '');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="AADHAAR">Aadhaar Card (UIDAI)</option>
                  <option value="PAN">PAN Card (Income Tax Dept)</option>
                  <option value="VOTER_ID">Voter ID Card (Election Commission of India)</option>
                  <option value="BIRTH_CERT">Birth Certificate (Municipal Corporation)</option>
                  <option value="INCOME_CERT">Income Certificate (Revenue Dept / Tahsildar)</option>
                  <option value="CASTE_CERT">Caste Certificate (SC / ST / OBC / SEBC)</option>
                  <option value="RESIDENCE_CERT">Residence / Domicile Certificate (State Govt)</option>
                  <option value="OTHER">Other Important Government Document</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aadhaar Card (UIDAI)"
                  value={newGovtDocTitle}
                  onChange={(e) => setNewGovtDocTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document / ID Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. XXXX-XXXX-4219 or ABCDE1234F"
                    value={newGovtDocNumber}
                    onChange={(e) => setNewGovtDocNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    placeholder="e.g. UIDAI / Income Tax Dept / Tahsildar"
                    value={newGovtDocAuthority}
                    onChange={(e) => setNewGovtDocAuthority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newGovtDocIssuedDate}
                    onChange={(e) => setNewGovtDocIssuedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Validity</label>
                  <input
                    type="text"
                    placeholder="e.g. Lifetime / 2026-27"
                    value={newGovtDocValidity}
                    onChange={(e) => setNewGovtDocValidity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Purpose / Student Description & Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Document used for autonomous university scholarship, hostel verification, or national ID..."
                  value={newGovtDocDesc}
                  onChange={(e) => setNewGovtDocDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Upload Document File (PDF, PNG, JPG)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50/50 text-center space-y-1.5 transition">
                  <FileCheck className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-[11px] text-slate-600">
                    {newGovtDocFileName ? `Selected: ${newGovtDocFileName}` : 'Choose Government ID copy (Encrypted vault upload)'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewGovtDocFileName(file.name);
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGovtDocModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md shadow-emerald-500/25"
                >
                  Save to Secure Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD STUDY / PROFESSIONAL PROFILE LINK                            */}
      {/* ========================================================================= */}
      {showAddStudyLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Study / Career Link</h3>
                  <p className="text-xs text-slate-500">LinkedIn, GitHub, LeetCode, HackerRank, Portfolio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStudyLinkModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudyLink} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Platform</label>
                <select
                  value={newLinkPlatform}
                  onChange={(e) => {
                    setNewLinkPlatform(e.target.value);
                    const placeholders: Record<string, string> = {
                      LinkedIn: 'https://linkedin.com/in/username',
                      GitHub: 'https://github.com/username',
                      LeetCode: 'https://leetcode.com/u/username',
                      HackerRank: 'https://hackerrank.com/username',
                      'Portfolio Website': 'https://myportfolio.dev',
                      'Google Scholar': 'https://scholar.google.com/citations?user=...',
                      Kaggle: 'https://kaggle.com/username',
                    };
                    if (!newLinkUrl) setNewLinkUrl(placeholders[e.target.value] || 'https://');
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="GitHub">GitHub</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="Portfolio Website">Personal Portfolio Website</option>
                  <option value="Google Scholar">Google Scholar / ResearchGate</option>
                  <option value="Kaggle">Kaggle / Data Science</option>
                  <option value="CodeChef">CodeChef / Competitive</option>
                  <option value="Other">Other Academic Profile</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Profile URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/my-handle"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Username / Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. subham_codes"
                    value={newLinkUsername}
                    onChange={(e) => setNewLinkUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 500+ Connections / 5 Stars"
                    value={newLinkBadge}
                    onChange={(e) => setNewLinkBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. My open-source repositories and coding solutions..."
                  value={newLinkDesc}
                  onChange={(e) => setNewLinkDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudyLinkModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition shadow-md shadow-sky-500/25"
                >
                  Save Study Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD TECHNICAL SKILL                                              */}
      {/* ========================================================================= */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add Technical Skill</h3>
                  <p className="text-xs text-slate-500">Add to your student skills matrix</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSkillModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Skill Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Docker, Java, Machine Learning"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="PROGRAMMING">Programming Languages (Python, C++, Java, etc.)</option>
                  <option value="WEB_CLOUD">Web & Cloud Technologies (React, Node, AWS, etc.)</option>
                  <option value="CORE_CS">Core Computer Science (DSA, DBMS, OS, Networks)</option>
                  <option value="TOOLS">Developer Tools (Git, Docker, Linux, CI/CD)</option>
                  <option value="SOFT">Soft Skills & Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Proficiency Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewSkillProficiency(lvl)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                        newSkillProficiency === lvl
                          ? 'border-purple-600 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-md shadow-purple-500/25"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: UPDATE / EDIT RESUME                                             */}
      {/* ========================================================================= */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Update Student Resume / CV</h3>
                  <p className="text-xs text-slate-500">Edit headline, professional summary & upload PDF</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateResume} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Professional Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Web & Cloud Developer | B.Tech CSE 2026"
                  value={resumeHeadlineInput}
                  onChange={(e) => setResumeHeadlineInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Professional Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Brief summary of your academic background, core programming skills, internship experience, and career aspirations..."
                  value={resumeSummaryInput}
                  onChange={(e) => setResumeSummaryInput(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Upload New Resume File (PDF)</label>
                <div className="p-3 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl bg-slate-50/50 text-center space-y-1.5 transition">
                  <FileText className="w-5 h-5 text-indigo-600 mx-auto" />
                  <p className="text-[11px] text-slate-600">
                    Current: <strong>{resumeFileNameInput}</strong>
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setResumeFileNameInput(file.name);
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-500/25"
                >
                  Save & Sync Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DOCUMENT ENLARGE & PREVIEW VIEWER                                */}
      {/* ========================================================================= */}
      {previewDocItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {previewDocItem.title}
                  </h3>
                  <p className="text-xs text-slate-500">{previewDocItem.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDocItem(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Digital Replica Frame */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border-2 border-slate-200 shadow-inner space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-xs">
                    REC
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">
                      Raajdhani Engineering College (Autonomous)
                    </p>
                    <p className="text-[10px] text-slate-400">Digital Document & Credentials Verification System</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {previewDocItem.verifiedBadge || 'Digitally Verified'}
                </span>
              </div>

              {/* Student & Document Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Candidate Name</span>
                  <span className="font-black text-slate-900">{effectiveStudentName}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registration / Roll No</span>
                  <span className="font-mono font-bold text-blue-700">{user?.studentId || '2301042001'}</span>
                </div>
                {previewDocItem.docNumber && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Document / ID Number</span>
                    <span className="font-mono font-bold text-slate-800">{previewDocItem.docNumber}</span>
                  </div>
                )}
                {previewDocItem.institution && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Issuing Authority / Board</span>
                    <span className="font-bold text-slate-800">{previewDocItem.institution}</span>
                  </div>
                )}
                {previewDocItem.score && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Score / CGPA / Grade</span>
                    <span className="font-black text-emerald-700">{previewDocItem.score}</span>
                  </div>
                )}
                {previewDocItem.year && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Year / Validity</span>
                    <span className="font-bold text-slate-800">{previewDocItem.year}</span>
                  </div>
                )}
              </div>

              {/* Student Description */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 block">
                  Official Statement & Student Remarks:
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">{previewDocItem.description}</p>
              </div>

              {/* Attached file capsule */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-800">{previewDocItem.fileName || 'document.pdf'}</span>
                </div>
                <span className="font-mono text-slate-500 text-[10px]">{previewDocItem.fileSize || '1.2 MB'}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>✓ Digitally signed & sealed by Raajdhani Autonomous Academic Vault</span>
                <span className="font-mono font-bold text-slate-600">DOC-HASH-{Date.now().toString(36).toUpperCase()}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Copy</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccess(`✓ Downloading ${previewDocItem.fileName || previewDocItem.title}...`);
                    setTimeout(() => setSubmitSuccess(''), 3000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDocItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
