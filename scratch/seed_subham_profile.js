const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const subhamProfileData = {
  personalInfo: {
    fullName: 'Subham Pradhan',
    rollNo: '2501294204',
    studentId: 'CS-2023-042',
    regNo: '2301042001',
    branch: 'Computer Science & Engineering',
    semester: '5th Semester',
    batch: '2023 - 2027',
    admissionYear: '2023',
    dob: '2004-06-18',
    gender: 'Male',
    bloodGroup: 'B+',
    studentPhone: '7653993919',
    email: 'subhampradhan34864@gmail.com',
    permanentAddress: 'Plot 42, VSS Nagar, Bhubaneswar, Odisha - 751007',
    currentAddress: 'Room A-204, Nilgiri Block A (Hostel A), Campus Residences',
    category: 'General',
    nationality: 'Indian'
  },
  hostelDetails: {
    hostelBlock: 'Hostel A (Nilgiri Block A)',
    floor: '2nd Floor',
    roomNumber: 'A-204',
    bedNumber: 'B1',
    checkInDate: '2023-08-10',
    roommates: [
      { name: 'Rahul Sharma', branch: 'Computer Science & Eng', rollNo: 'CS-2023-089', bed: 'B2' }
    ],
    wardenName: 'Dr. K.P. Mohapatra',
    wardenPhone: '+91 94370 11223',
    hostelFeeStatus: 'PAID',
    messPlan: 'Non-Veg Meals'
  },
  familyEmergency: {
    fatherName: 'Balakrushna Pradhan',
    fatherPhone: '+91 94370 88214',
    motherName: 'Snehalata Pradhan',
    motherPhone: '+91 94372 99120',
    localGuardianName: 'Manoranjan Mohanty',
    localGuardianRelation: 'Uncle',
    localGuardianPhone: '+91 98611 77332',
    primaryEmergencyName: 'Balakrushna Pradhan',
    primaryEmergencyRelation: 'Father',
    primaryEmergencyPhone: '+91 94370 88214',
    primaryEmergencyAltPhone: '+91 98611 77332',
    familyDoctorName: 'Dr. S.K. Tripathy, MD',
    familyDoctorClinic: 'Apollo Clinic, Bhubaneswar',
    familyDoctorPhone: '+91 674 256 7890',
    notifyParentsOnExit: true
  },
  digitalId: {
    collegeName: 'Apex Institute of Technology',
    collegeCode: 'APEX-2026',
    cardStatus: 'ACTIVE',
    validUntil: '30 June 2027',
    issuedAt: '15 July 2023',
    signedToken: 'REC-SIGNED-ID:2501294204:SUBHAM:EXP-20270630:HASH-8F29A',
    verifiedBadge: true
  },
  academicCollection: {
    cgpa: '8.84',
    currentSemester: '5th Semester',
    backlogs: '0 Active Backlogs (All Clear)',
    semesters: [
      { sem: 'Sem 1', sgpa: '8.70', attendance: 91.2 },
      { sem: 'Sem 2', sgpa: '8.85', attendance: 89.0 },
      { sem: 'Sem 3', sgpa: '8.92', attendance: 88.4 },
      { sem: 'Sem 4', sgpa: '8.90', attendance: 87.5 },
      { sem: 'Sem 5', sgpa: '8.84', attendance: 88.5 }
    ],
    subjects: [
      { code: 'CS501', name: 'Design & Analysis of Algorithms', attended: 46, total: 50, percentage: 92, eligible: true },
      { code: 'CS502', name: 'Database Management Systems', attended: 44, total: 50, percentage: 88, eligible: true },
      { code: 'CS503', name: 'Operating Systems & System Calls', attended: 43, total: 50, percentage: 86, eligible: true },
      { code: 'CS504', name: 'Computer Networks & Protocols', attended: 42, total: 50, percentage: 84, eligible: true },
      { code: 'CS505', name: 'Software Engineering & Agile Labs', attended: 45, total: 50, percentage: 90, eligible: true }
    ],
    achievements: [
      { id: 'ach-1', title: 'Smart Campus Management System', type: 'Project', org: 'HackOdisha 2024 Finalist', date: 'Oct 2024', description: 'Full-stack IoT & cloud portal for automated student curfew turnstiles.' },
      { id: 'ach-2', title: 'Full Stack Web Developer Intern', type: 'Internship', org: 'Tech Innovators Hub', date: 'May - July 2024', description: 'Engineered Next.js & Express microservices with 99.9% uptime.' },
      { id: 'ach-3', title: 'Dean Academic Excellence Honor', type: 'Award', org: 'Apex Tech University', date: 'Jan 2024', description: 'Top 3% semester academic ranking in CSE department.' }
    ]
  },
  governmentLocker: [
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
  ],
  correctionRequests: []
};

const jsonStr = JSON.stringify(subhamProfileData);
const dbPaths = [
  path.resolve('prisma/dev.db'),
  path.resolve('apps/api/prisma/dev.db')
];

for (const p of dbPaths) {
  if (fs.existsSync(p)) {
    const db = new DatabaseSync(p);
    const user = db.prepare('SELECT id FROM User WHERE email = ?').get('subhampradhan34864@gmail.com');
    if (user) {
      db.prepare(`
        UPDATE ResidentProfile 
        SET roomNumber = 'A-204',
            blockName = 'Hostel A',
            course = 'B.Tech (CSE)',
            year = '3rd Year (Sem 5)',
            bloodGroup = 'B+',
            parentName = 'Balakrushna Pradhan',
            parentPhone = '+91 94370 88214',
            emergencyContact = '+91 94370 88214',
            profileDataJson = ?
        WHERE userId = ?
      `).run(jsonStr, user.id);
      console.log('Successfully seeded Subham Pradhan rich profile into:', p);
    }
    db.close();
  }
}
