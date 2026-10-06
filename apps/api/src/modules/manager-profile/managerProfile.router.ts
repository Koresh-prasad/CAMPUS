import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { optionalAuthMiddleware } from '../../middlewares/auth';
import { broadcastManagerProfileUpdate } from '../../socket';
import fs from 'fs';
import path from 'path';

const router = Router();

// Data persistence file path
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const PROFILE_FILE = path.join(DATA_DIR, 'manager_profile.json');

// Default initial manager profile with photo
const defaultManagerProfile = {
  id: 'manager-chief-01',
  tenantId: 'default',
  name: 'Dr. Arthur Pendelton',
  designation: 'Chief Hostel Warden & Administrative Controller',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  email: 'warden@campushelper.edu',
  phone: '+91 98765 43210',
  officeRoom: 'Administrative Wing A, Ground Floor, Office G-04',
  visitingHours: 'Mon – Fri: 4:30 PM – 7:00 PM | Sat: 10:30 AM – 1:30 PM',
  emergencyDirectLine: '+91 98765 00000 (Ext 104)',
  announcement: 'Hostel Controller Desk is actively open for resident support, medical assistance, and room amenities. For leaves exceeding 3 days, feel free to visit during afternoon hours.',
  status: 'AVAILABLE', // 'AVAILABLE' | 'ON_CAMPUS_ROUNDS' | 'IN_MEETING' | 'OFF_DUTY'
  deskHeading: 'Chief Warden & Administrative Manager Desk',
  deskBadge: 'Executive Command Desk',
  deskSubtitle: 'Live controller profile with photo, office hours, and announcements shown on student apps',
  updatedAt: new Date().toISOString()
};

function loadProfile() {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
      return { ...defaultManagerProfile, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading manager_profile.json:', err);
  }
  return { ...defaultManagerProfile };
}

function saveProfile(profile: any) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving manager_profile.json:', err);
  }
}

let currentProfile = loadProfile();

// GET /api/manager-profile
router.get('/', async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      profile: currentProfile,
      ...currentProfile,
      photoUrl: currentProfile.avatarUrl,
      title: currentProfile.designation,
      statusNote: currentProfile.announcement,
      deskHeading: currentProfile.deskHeading || 'Chief Warden & Administrative Manager Desk',
      deskBadge: currentProfile.deskBadge || 'Executive Command Desk',
      deskSubtitle: currentProfile.deskSubtitle || 'Live controller profile with photo, office hours, and announcements shown on student apps'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load manager profile' });
  }
});

// PUT /api/manager-profile (Admin/Controller update)
router.put('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      name,
      designation,
      title,
      avatarUrl,
      photoUrl,
      email,
      phone,
      officeRoom,
      visitingHours,
      emergencyDirectLine,
      announcement,
      statusNote,
      status,
      deskHeading,
      deskBadge,
      deskSubtitle
    } = req.body;

    currentProfile = {
      ...currentProfile,
      name: name ?? currentProfile.name,
      designation: designation ?? title ?? currentProfile.designation,
      avatarUrl: avatarUrl ?? photoUrl ?? currentProfile.avatarUrl,
      email: email ?? currentProfile.email,
      phone: phone ?? currentProfile.phone,
      officeRoom: officeRoom ?? currentProfile.officeRoom,
      visitingHours: visitingHours ?? currentProfile.visitingHours,
      emergencyDirectLine: emergencyDirectLine ?? currentProfile.emergencyDirectLine,
      announcement: announcement ?? statusNote ?? currentProfile.announcement,
      status: status ?? currentProfile.status,
      deskHeading: deskHeading !== undefined ? deskHeading : (currentProfile.deskHeading || 'Chief Warden & Administrative Manager Desk'),
      deskBadge: deskBadge !== undefined ? deskBadge : (currentProfile.deskBadge || 'Executive Command Desk'),
      deskSubtitle: deskSubtitle !== undefined ? deskSubtitle : (currentProfile.deskSubtitle || 'Live controller profile with photo, office hours, and announcements shown on student apps'),
      updatedAt: new Date().toISOString()
    };

    saveProfile(currentProfile);

    // Also update Warden user in DB if exists
    try {
      const wardenUser = await prisma.user.findFirst({
        where: { role: 'WARDEN' }
      });
      if (wardenUser) {
        await prisma.user.update({
          where: { id: wardenUser.id },
          data: {
            name: currentProfile.name,
            avatarUrl: currentProfile.avatarUrl,
            phone: currentProfile.phone
          }
        });
      }
    } catch {
      // ignore
    }

    const payload = {
      success: true,
      message: 'Manager profile updated and broadcast to all resident devices',
      profile: currentProfile,
      ...currentProfile,
      photoUrl: currentProfile.avatarUrl,
      title: currentProfile.designation,
      statusNote: currentProfile.announcement,
      deskHeading: currentProfile.deskHeading,
      deskBadge: currentProfile.deskBadge,
      deskSubtitle: currentProfile.deskSubtitle
    };

    // Broadcast update via WebSocket to ALL connected student devices & admin screens immediately
    broadcastManagerProfileUpdate(payload);

    return res.json(payload);
  } catch (err) {
    console.error('Update manager profile error:', err);
    return res.status(500).json({ error: 'Failed to update manager profile' });
  }
});

export default router;
