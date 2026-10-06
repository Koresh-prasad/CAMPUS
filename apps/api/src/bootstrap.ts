import { prisma } from './prisma';

export async function bootstrapDatabase() {
  try {
    const tenantCount = await prisma.tenant.count();
    if (tenantCount > 0) {
      console.log('✅ Database already populated with tenants.');
      return;
    }

    console.log('🌱 Empty database detected on cloud deploy. Auto-bootstrapping initial campus data...');

    // 1. Create Default College Tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Apex Institute of Technology',
        slug: 'apex-tech',
        code: 'APEX-2026',
        logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150',
        primaryColor: '#2563EB'
      }
    });

    // 2. Create Hostel
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

    await prisma.bed.createMany({
      data: [
        { roomId: roomA101.id, bedNumber: 'B1', isOccupied: true },
        { roomId: roomA101.id, bedNumber: 'B2', isOccupied: false },
        { roomId: roomA204.id, bedNumber: 'B1', isOccupied: true },
        { roomId: roomA204.id, bedNumber: 'B2', isOccupied: true },
        { roomId: roomB102.id, bedNumber: 'B1', isOccupied: true },
        { roomId: roomB102.id, bedNumber: 'B2', isOccupied: false }
      ]
    });

    // 5. Admin Manager
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: 'Campus Admin Manager',
        email: 'admin@rec.edu',
        phone: '+91 98111 00000',
        passwordHash: 'dummy_hash',
        role: 'DIRECTOR',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        staffProfile: {
          create: {
            designation: 'Campus Operations & Administrative Head',
            department: 'ADMINISTRATION',
            shift: 'General'
          }
        }
      }
    });

    // 6. Warden
    await prisma.user.create({
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

    // 7. Security Officer
    await prisma.user.create({
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
            designation: 'Chief Security Officer',
            department: 'SECURITY',
            shift: 'NIGHT'
          }
        }
      }
    });

    // 8. Service Staff
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: 'Mahendra Singh',
        email: 'mahendra.plumb@campus.edu',
        phone: '+91 98111 00007',
        passwordHash: 'dummy_hash',
        role: 'STAFF',
        staffProfile: {
          create: {
            designation: 'Senior Maintenance Lead',
            department: 'SERVICES',
            shift: 'DAY'
          }
        }
      }
    });

    // 9. Medical Officer
    await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: 'Dr. Pratima Mishra, MD',
        email: 'medical.clinic@rec.ac.in',
        phone: '+91 98111 00008',
        passwordHash: 'dummy_hash',
        role: 'STAFF',
        staffProfile: {
          create: {
            designation: 'Campus Chief Medical Officer',
            department: 'HEALTH_CENTER',
            shift: '24x7 Emergency'
          }
        }
      }
    });

    // 10. Demo Student
    await prisma.user.create({
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
            studentId: 'APEX-2024-CS042',
            roomNumber: 'A-204',
            blockName: 'Nilgiri Block A (Boys)',
            bloodGroup: 'B+',
            parentName: 'Manoj Sharma',
            parentPhone: '+91 99887 00001',
            emergencyContact: '+91 99887 00001',
            idProofNumber: 'AADH-8877-9911',
            course: 'B.Tech CSE',
            year: '3rd Year (Sem 6)',
            kycComplete: true,
            currentPresence: 'IN_HOSTEL'
          }
        }
      }
    });

    console.log('✅ Auto-bootstrap completed successfully! All initial campus roles and rooms created.');
  } catch (error) {
    console.error('⚠️ Auto-bootstrap warning:', error);
  }
}
