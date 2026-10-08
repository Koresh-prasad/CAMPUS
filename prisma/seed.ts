import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SHMS Database Seed...');

  // Clean existing
  await prisma.gateScanLog.deleteMany();
  await prisma.pass.deleteMany();
  await prisma.complaintLog.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.emergencyAlert.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.pollVote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.amenityBooking.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.suggestion.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.residentProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.bed.deleteMany();
  await prisma.room.deleteMany();
  await prisma.block.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.tenant.deleteMany();

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Apex Institute of Technology',
      slug: 'apex-tech',
      code: 'APEX-2026',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150',
      primaryColor: '#2563EB'
    }
  });

  // 2. Hostel
  const hostel = await prisma.hostel.create({
    data: {
      tenantId: tenant.id,
      name: 'Nilgiri & Shivalik Student Residences',
      code: 'NS-RES-01',
      address: 'Knowledge Park III, Greater Noida, Delhi NCR',
      type: 'CO_ED',
      curfewTime: '21:30',
      capacity: 650
    }
  });

  // 3. Blocks
  const blockA = await prisma.block.create({
    data: {
      hostelId: hostel.id,
      name: 'Nilgiri Block A (Boys)',
      floors: 4
    }
  });

  const blockB = await prisma.block.create({
    data: {
      hostelId: hostel.id,
      name: 'Shivalik Block B (Girls)',
      floors: 4
    }
  });

  // 4. Rooms & Beds
  const roomA101 = await prisma.room.create({
    data: {
      blockId: blockA.id,
      roomNumber: 'A-101',
      floor: 1,
      capacity: 2,
      type: 'DOUBLE_SHARING',
      status: 'AVAILABLE'
    }
  });

  const roomA204 = await prisma.room.create({
    data: {
      blockId: blockA.id,
      roomNumber: 'A-204',
      floor: 2,
      capacity: 2,
      type: 'DOUBLE_SHARING',
      status: 'AVAILABLE'
    }
  });

  const roomB102 = await prisma.room.create({
    data: {
      blockId: blockB.id,
      roomNumber: 'B-102',
      floor: 1,
      capacity: 2,
      type: 'DOUBLE_SHARING',
      status: 'AVAILABLE'
    }
  });

  const roomB201 = await prisma.room.create({
    data: {
      blockId: blockB.id,
      roomNumber: 'B-201',
      floor: 2,
      capacity: 2,
      type: 'DOUBLE_SHARING',
      status: 'AVAILABLE'
    }
  });

  // Beds
  await prisma.bed.createMany({
    data: [
      { roomId: roomA101.id, bedNumber: 'B1', isOccupied: true },
      { roomId: roomA101.id, bedNumber: 'B2', isOccupied: false },
      { roomId: roomA204.id, bedNumber: 'B1', isOccupied: true },
      { roomId: roomA204.id, bedNumber: 'B2', isOccupied: true },
      { roomId: roomB102.id, bedNumber: 'B1', isOccupied: true },
      { roomId: roomB102.id, bedNumber: 'B2', isOccupied: false },
      { roomId: roomB201.id, bedNumber: 'B1', isOccupied: true },
      { roomId: roomB201.id, bedNumber: 'B2', isOccupied: false }
    ]
  });

  // 5. Users & Profiles
  // Director
  const director = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Dr. Vikramaditya Sen',
      email: 'director@campus.edu',
      phone: '+91 98111 00001',
      passwordHash: 'dummy_hash',
      role: 'DIRECTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
    }
  });

  // Warden Boys
  const wardenBoys = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Dr. R.K. Sharma',
      email: 'warden.boys@campus.edu',
      phone: '+91 98111 00002',
      passwordHash: 'dummy_hash',
      role: 'WARDEN',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      staffProfile: {
        create: {
          designation: 'Chief Warden (Boys)',
          department: 'ADMIN',
          shift: 'GENERAL'
        }
      }
    }
  });

  // Warden Girls
  const wardenGirls = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Prof. Sunita Rao',
      email: 'warden.girls@campus.edu',
      phone: '+91 98111 00003',
      passwordHash: 'dummy_hash',
      role: 'WARDEN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120',
      staffProfile: {
        create: {
          designation: 'Warden (Girls)',
          department: 'ADMIN',
          shift: 'GENERAL'
        }
      }
    }
  });

  // Security
  const securityGuard = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Rajesh Kumar (Gate 1)',
      email: 'security.gate1@campus.edu',
      phone: '+91 98111 00004',
      passwordHash: 'dummy_hash',
      role: 'SECURITY',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      staffProfile: {
        create: {
          designation: 'Senior Security Supervisor',
          department: 'SECURITY',
          shift: 'NIGHT'
        }
      }
    }
  });

  // Accounts
  const accounts = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Arvind Gupta',
      email: 'accounts@campus.edu',
      phone: '+91 98111 00005',
      passwordHash: 'dummy_hash',
      role: 'ACCOUNTS',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
      staffProfile: {
        create: {
          designation: 'Hostel Finance Officer',
          department: 'ACCOUNTS',
          shift: 'GENERAL'
        }
      }
    }
  });

  // Staff: Electrician
  const electrician = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Suresh Kumar',
      email: 'suresh.elec@campus.edu',
      phone: '+91 98111 00006',
      passwordHash: 'dummy_hash',
      role: 'STAFF',
      staffProfile: {
        create: {
          designation: 'Head Electrician',
          department: 'ELECTRICAL',
          shift: 'DAY'
        }
      }
    }
  });

  // Staff: Plumber
  const plumber = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Mahendra Singh',
      email: 'mahendra.plumb@campus.edu',
      phone: '+91 98111 00007',
      passwordHash: 'dummy_hash',
      role: 'STAFF',
      staffProfile: {
        create: {
          designation: 'Senior Plumber',
          department: 'PLUMBING',
          shift: 'DAY'
        }
      }
    }
  });

  // Student 1: Rahul Sharma (Primary demo student)
  const student1 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@campus.edu',
      phone: '+91 99887 76655',
      passwordHash: 'dummy_hash',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
      residentProfile: {
        create: {
          studentId: 'CS2023-089',
          roomNumber: 'A-204',
          blockName: 'Nilgiri Block A (Boys)',
          bloodGroup: 'B+',
          parentName: 'Mr. Manoj Sharma',
          parentPhone: '+91 94140 12345',
          emergencyContact: '+91 94140 12345',
          idProofNumber: 'AADHAAR-8902-1234',
          course: 'B.Tech Computer Science',
          year: '3rd Year',
          kycComplete: true,
          currentPresence: 'IN_HOSTEL'
        }
      }
    }
  });

  // Student 2: Priya Verma
  const student2 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Priya Verma',
      email: 'priya.verma@campus.edu',
      phone: '+91 99887 76656',
      passwordHash: 'dummy_hash',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      residentProfile: {
        create: {
          studentId: 'EC2024-042',
          roomNumber: 'B-102',
          blockName: 'Shivalik Block B (Girls)',
          bloodGroup: 'O+',
          parentName: 'Mrs. Rekha Verma',
          parentPhone: '+91 94140 54321',
          emergencyContact: '+91 94140 54321',
          course: 'B.Tech Electronics & Comm.',
          year: '2nd Year',
          kycComplete: true,
          currentPresence: 'IN_HOSTEL'
        }
      }
    }
  });

  // Student 3: Amit Patel (OVERDUE CURFEW VIOLATOR FOR DEMO!)
  const student3 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Amit Patel',
      email: 'amit.patel@campus.edu',
      phone: '+91 99887 76657',
      passwordHash: 'dummy_hash',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120',
      residentProfile: {
        create: {
          studentId: 'ME2023-015',
          roomNumber: 'A-101',
          blockName: 'Nilgiri Block A (Boys)',
          bloodGroup: 'A+',
          parentName: 'Mr. Dilip Patel',
          parentPhone: '+91 94140 99887',
          emergencyContact: '+91 94140 99887',
          course: 'B.Tech Mechanical',
          year: '3rd Year',
          kycComplete: true,
          currentPresence: 'OVERDUE',
          lastGateScanAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      }
    }
  });

  // Student 4: Sneha Reddy (OUT ON APPROVED LEAVE)
  const student4 = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@campus.edu',
      phone: '+91 99887 76658',
      passwordHash: 'dummy_hash',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      residentProfile: {
        create: {
          studentId: 'CS2022-004',
          roomNumber: 'B-201',
          blockName: 'Shivalik Block B (Girls)',
          bloodGroup: 'AB+',
          parentName: 'Dr. K.V. Reddy',
          parentPhone: '+91 94140 44556',
          emergencyContact: '+91 94140 44556',
          course: 'B.Tech Computer Science',
          year: '4th Year',
          kycComplete: true,
          currentPresence: 'OUT_ON_LEAVE',
          lastGateScanAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }
  });

  // 6. Passes
  // Approved Gate Pass for Rahul
  await prisma.pass.create({
    data: {
      passNumber: 'PASS-892101',
      passType: 'GATE_PASS',
      residentId: student1.id,
      reason: 'Purchasing project components at Sector 18 electronics market',
      destination: 'Sector 18 Market',
      validFrom: new Date(Date.now() - 30 * 60 * 1000),
      validTill: new Date(Date.now() + 90 * 60 * 1000),
      status: 'APPROVED',
      approvedById: wardenBoys.id,
      approvedByName: wardenBoys.name,
      qrCodeToken: 'QR-PASS-892101-RAHUL'
    }
  });

  // Overdue Pass for Amit Patel (Expired 85 minutes ago!)
  const overduePass = await prisma.pass.create({
    data: {
      passNumber: 'PASS-891942',
      passType: 'GATE_PASS',
      residentId: student3.id,
      reason: 'Dinner with local relatives',
      destination: 'City Center Mall',
      validFrom: new Date(Date.now() - 4 * 60 * 60 * 1000),
      validTill: new Date(Date.now() - 85 * 60 * 1000),
      status: 'EXPIRED',
      isOverdue: true,
      approvedById: wardenBoys.id,
      approvedByName: wardenBoys.name,
      actualExitAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      qrCodeToken: 'QR-PASS-891942-AMIT'
    }
  });

  // Leave pass for Sneha Reddy
  await prisma.pass.create({
    data: {
      passNumber: 'PASS-890520',
      passType: 'LEAVE',
      residentId: student4.id,
      reason: 'Diwali break travel to hometown (Hyderabad)',
      destination: 'Hyderabad, Telangana',
      validFrom: new Date(Date.now() - 24 * 60 * 60 * 1000),
      validTill: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      approvedById: wardenGirls.id,
      approvedByName: wardenGirls.name,
      actualExitAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      qrCodeToken: 'QR-PASS-890520-SNEHA'
    }
  });

  // 7. Complaints
  // Water issue (In Progress)
  await prisma.complaint.create({
    data: {
      ticketNumber: 'CMP-780124',
      title: 'Water pressure very low in 2nd floor bathroom',
      description: 'The geyser supply line has very low pressure since this morning.',
      category: 'WATER',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      residentId: student1.id,
      assignedStaffId: plumber.id,
      slaHours: 4,
      slaDueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      logs: {
        create: [
          { actorName: student1.name, action: 'COMPLAINT_RAISED', note: 'Resident reported low water pressure' },
          { actorName: wardenBoys.name, action: 'ASSIGNED_TO_STAFF', note: 'Assigned to Plumber Mahendra Singh' }
        ]
      }
    }
  });

  // Wi-Fi issue (Raised)
  await prisma.complaint.create({
    data: {
      ticketNumber: 'CMP-780125',
      title: 'Wi-Fi disconnects frequently near Room A-204',
      description: 'Hostel 5GHz AP drops connection every 10 minutes during online lectures.',
      category: 'WIFI',
      priority: 'MEDIUM',
      status: 'RAISED',
      residentId: student1.id,
      slaHours: 6,
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
      logs: {
        create: [
          { actorName: student1.name, action: 'COMPLAINT_RAISED', note: 'Complaint logged for AP troubleshooting' }
        ]
      }
    }
  });

  // Electricity resolved (with 5-star rating)
  await prisma.complaint.create({
    data: {
      ticketNumber: 'CMP-779890',
      title: 'Tube light flickering in Room B-102',
      description: 'Tube light ballast faulty, creating buzzing noise.',
      category: 'ELECTRICITY',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      residentId: student2.id,
      assignedStaffId: electrician.id,
      slaHours: 4,
      slaDueAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      rating: 5,
      ratingComment: 'Fixed within 45 minutes by electrician Suresh! Excellent service.',
      logs: {
        create: [
          { actorName: student2.name, action: 'COMPLAINT_RAISED', note: 'Flickering tube light reported' },
          { actorName: electrician.name, action: 'STATUS_CHANGED_TO_RESOLVED', note: 'Replaced ballast and tube' }
        ]
      }
    }
  });

  // 8. Emergency Alert (Historical resolved for NAAC documentation)
  await prisma.emergencyAlert.create({
    data: {
      emergencyType: 'MEDICAL',
      status: 'RESOLVED',
      residentId: student1.id,
      locationDetails: 'Room A-204, Nilgiri Block A',
      notes: 'Severe allergic reaction to medicine. Campus ambulance dispatched; resident treated at health center and recovered fully.',
      resolvedById: wardenBoys.id,
      resolvedByName: wardenBoys.name,
      resolvedAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
    }
  });

  // 9. Visitors (One valid, one OVERSTAYED)
  // Valid visitor
  await prisma.visitor.create({
    data: {
      visitorName: 'Mr. Manoj Sharma (Father)',
      visitorPhone: '+91 94140 12345',
      residentId: student1.id,
      purpose: 'Dropping winter clothing and semester books',
      expectedDate: new Date().toISOString().split('T')[0],
      expectedTime: '15:00',
      checkInAt: new Date(Date.now() - 45 * 60 * 1000),
      status: 'CHECKED_IN',
      qrPassCode: 'VIS-991201-MANOJ',
      isRegularVisitor: false
    }
  });

  // Overstayed visitor (Checked in 160 minutes ago, overstay limit is 120 mins!)
  await prisma.visitor.create({
    data: {
      visitorName: 'Vikas Electronics Courier',
      visitorPhone: '+91 98222 33445',
      residentId: student3.id,
      purpose: 'Heavy hardware delivery to common lab',
      expectedDate: new Date().toISOString().split('T')[0],
      expectedTime: '13:00',
      checkInAt: new Date(Date.now() - 160 * 60 * 1000),
      status: 'OVERSTAYED',
      qrPassCode: 'VIS-990842-COURIER',
      isRegularVisitor: false
    }
  });

  // 10. Vehicles
  await prisma.vehicle.create({
    data: {
      residentId: student1.id,
      vehicleType: 'TWO_WHEELER',
      licensePlate: 'UP16-BV-4492',
      model: 'Yamaha FZ 150cc',
      parkingSlot: 'Slot P-08 (Nilgiri)',
      digitalPassQr: 'VEH-UP16BV4492-PASS',
      status: 'APPROVED'
    }
  });

  // 11. Notices
  await prisma.notice.createMany({
    data: [
      {
        title: 'Inter-Hostel Sports Championship 2026 Registration Open',
        content: 'Registration for Cricket, Football, Badminton, and Table Tennis is now live. Submit team lists to Hostel Sports Secretary by Friday 5 PM.',
        category: 'EVENT',
        isPinned: true,
        isEmergencyAlert: false,
        authorName: 'Dr. Vikramaditya Sen (Director)',
        targetAudience: 'ALL'
      },
      {
        title: 'Scheduled Water Tank Cleaning & Pipeline Sanitization',
        content: 'Nilgiri Block A overhead tanks will undergo semi-annual sanitization tomorrow between 2:00 PM and 4:30 PM. Backup water supply will be active on ground floor.',
        category: 'MAINTENANCE',
        isPinned: false,
        isEmergencyAlert: false,
        authorName: 'Estate Office',
        targetAudience: 'NILGIRI_BLOCK'
      },
      {
        title: 'Night Curfew & Biometric Gate Pass Rule Reminder',
        content: 'All residents are advised that campus gates close at 21:30 PM sharp. Any resident leaving post 19:00 must possess an active digital gate pass scanned via turnstile.',
        category: 'GENERAL',
        isPinned: false,
        isEmergencyAlert: false,
        authorName: 'Chief Warden',
        targetAudience: 'ALL'
      }
    ]
  });

  // 12. Poll
  const poll = await prisma.poll.create({
    data: {
      question: 'Vote for this Sunday Special Feast Menu:',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      options: {
        create: [
          { text: 'Hyderabadi Dum Biryani (Veg/Chicken) + Raita + Gulab Jamun', votes: 142 },
          { text: 'Paneer Butter Masala + Butter Naan + Dal Makhani + Rasmalai', votes: 118 },
          { text: 'South Indian Thali Special with Masala Dosa & Payasam', votes: 64 }
        ]
      }
    }
  });

  // 13. Weekly Mess Menu
  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  for (const day of weekDays) {
    await prisma.menuItem.createMany({
      data: [
        {
          dayOfWeek: day,
          mealType: 'BREAKFAST',
          items: day === 'SUNDAY' ? 'Masala Dosa, Sambar, Coconut Chutney, Coffee' : 'Poha, Boiled Eggs / Banana, Bread Butter, Masala Chai'
        },
        {
          dayOfWeek: day,
          mealType: 'LUNCH',
          items: day === 'FRIDAY' ? 'Rajma Chawal, Boondi Raita, Chapati, Salad' : 'Dal Makhani, Seasonal Veg, Steamed Rice, Phulka, Curd'
        },
        {
          dayOfWeek: day,
          mealType: 'SNACKS',
          items: 'Crispy Veg Pakoras / Samosa, Green Chutney, Ginger Tea'
        },
        {
          dayOfWeek: day,
          mealType: 'DINNER',
          items: day === 'SUNDAY' ? 'Special Feast (See Poll Results)' : 'Kadhai Paneer, Yellow Dal Tadka, Jeera Rice, Tandoori Roti, Kheer'
        }
      ]
    });
  }

  // 14. Billing
  await prisma.bill.create({
    data: {
      invoiceNumber: 'INV-2026-0901',
      residentId: student1.id,
      title: 'Hostel Fee & Mess Dues - Fall Semester',
      rentAmount: 35000,
      messAmount: 18000,
      electricityAmount: 1500,
      maintenanceAmount: 2000,
      fineAmount: 0,
      totalAmount: 56500,
      paidAmount: 52000,
      dueAmount: 4500,
      status: 'PARTIAL',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      payments: {
        create: {
          amount: 52000,
          transactionRef: 'UPI-HDFC-99281041',
          method: 'UPI',
          status: 'SUCCESS'
        }
      }
    }
  });

  await prisma.bill.create({
    data: {
      invoiceNumber: 'INV-2026-0902',
      residentId: student3.id,
      title: 'Hostel Fee & Mess Dues - Fall Semester',
      rentAmount: 35000,
      messAmount: 18000,
      electricityAmount: 2000,
      maintenanceAmount: 2000,
      fineAmount: 1000,
      totalAmount: 58000,
      paidAmount: 0,
      dueAmount: 58000,
      status: 'OVERDUE',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  });

  // 15. Inventory & Amenities
  await prisma.inventoryItem.createMany({
    data: [
      { name: 'Study Desk & Ergonomic Chair Sets', category: 'FURNITURE', quantity: 320, condition: 'GOOD', location: 'Blocks A & B' },
      { name: 'Commercial 15kg Front-Load Washing Machines', category: 'APPLIANCE', quantity: 12, condition: 'GOOD', location: 'Laundry Bays' },
      { name: 'Stag International Table Tennis Tables', category: 'SPORTS', quantity: 4, condition: 'GOOD', location: 'Recreation Center' },
      { name: 'Cisco Wi-Fi 6 Enterprise Access Points', category: 'IT', quantity: 48, condition: 'GOOD', location: 'Corridors All Floors' }
    ]
  });

  await prisma.amenity.createMany({
    data: [
      { name: 'Hostel Gymnasium & Fitness Suite', type: 'SPORTS_EQUIPMENT', location: 'Ground Floor Nilgiri', rules: 'Open 6 AM - 10 PM' },
      { name: 'Automated Coin/Token Laundry Bay', type: 'LAUNDRY', location: 'Basement Bay 1', rules: 'Book 1 hr slot' },
      { name: '24/7 Air-Conditioned Silent Study Hall', type: 'STUDY_ROOM', location: '1st Floor Center', rules: 'Silence compulsory' },
      { name: 'Guest Suite 101 (Parents Visiting)', type: 'GUEST_ROOM', location: 'Admin Block Wing', rules: 'Max 2 nights per booking' }
    ]
  });

  // 16. NAAC Audit Logs (Traceability demo)
  const auditEntries = [
    { actorId: student1.id, actorRole: 'STUDENT', action: 'RAISE_COMPLAINT', entity: 'COMPLAINT', entityId: 'CMP-780124', details: { category: 'WATER', room: 'A-204' } },
    { actorId: wardenBoys.id, actorRole: 'WARDEN', action: 'ASSIGN_STAFF', entity: 'COMPLAINT', entityId: 'CMP-780124', details: { staffAssigned: 'Mahendra Singh' } },
    { actorId: student1.id, actorRole: 'STUDENT', action: 'REQUEST_PASS', entity: 'PASS', entityId: 'PASS-892101', details: { destination: 'Sector 18 Market', type: 'GATE_PASS' } },
    { actorId: wardenBoys.id, actorRole: 'WARDEN', action: 'APPROVE_PASS', entity: 'PASS', entityId: 'PASS-892101', details: { approvedTill: '20:30' } },
    { actorId: null, actorRole: 'SYSTEM_RULES_ENGINE', action: 'CURFEW_VIOLATION_FLAGGED', entity: 'RESIDENT', entityId: student3.id, details: { resident: 'Amit Patel', minutesOverdue: 85 } },
    { actorId: null, actorRole: 'SYSTEM_RULES_ENGINE', action: 'VISITOR_OVERSTAY_FLAGGED', entity: 'VISITOR', entityId: 'VIS-990842-COURIER', details: { overstayMinutes: 40 } }
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        actorRole: entry.actorRole,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        detailsJson: JSON.stringify(entry.details)
      }
    });
  }

  console.log('✅ SHMS Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
