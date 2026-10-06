import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../../middlewares/auth';
import { broadcastCampusMapUpdate } from '../../socket';
import fs from 'fs';
import path from 'path';

const router = Router();

export interface CampusZone {
  id: string;
  name: string;
  category: 'ACADEMIC' | 'HOSTEL' | 'MEDICAL' | 'SPORTS' | 'DINING' | 'GATE' | 'ADMIN';
  description: string;
  timings?: string;
  contact?: string;
  locationCode?: string;
}

export interface CampusMapData {
  id: string;
  campusName: string;
  location: string;
  mapImageUrl: string;
  description: string;
  lastUpdated: string;
  updatedBy: string;
  zones: CampusZone[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const CAMPUS_MAP_FILE = path.join(DATA_DIR, 'campus-map.json');

const initialCampusMap: CampusMapData = {
  id: 'rec-campus-map-master',
  campusName: 'Raajdhani Engineering College (Autonomous)',
  location: 'Near Mancheswar Railway Station, Bhubaneswar, Odisha 751017',
  mapImageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=85',
  description: 'Official master zoning layout and navigation blueprint of REC Autonomous Campus, covering 25 acres of academic, residential, sports, and emergency facilities.',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'Chief Administrator & Estate Officer',
  zones: [
    {
      id: 'zone-1',
      name: 'Main Academic Complex (Blocks A, B & C)',
      category: 'ACADEMIC',
      locationCode: 'BLDG-ACAD-01',
      description: 'Department of Computer Science, Electronics, Mechanical, Civil & Smart Lecture Theatres.',
      timings: '08:00 AM - 06:00 PM',
      contact: '+91 (0674) 259-7123'
    },
    {
      id: 'zone-2',
      name: 'Boys Hostel Campus (Hostel A & B)',
      category: 'HOSTEL',
      locationCode: 'HOSTEL-BOYS',
      description: 'Hostel A (Senior Residency) and Hostel B (Junior Residency) with 24x7 Wi-Fi & Turnstile Access.',
      timings: '24 Hours (Curfew 09:30 PM)',
      contact: '+91 94370 12345 (Chief Warden)'
    },
    {
      id: 'zone-3',
      name: 'Girls Hostel Complex (Maa Tarini Niwas)',
      category: 'HOSTEL',
      locationCode: 'HOSTEL-GIRLS',
      description: 'Secure multi-storey female student residency with in-house recreation hall, gym, and CCTV boundary.',
      timings: '24 Hours (Curfew 09:00 PM)',
      contact: '+91 94370 67890 (Lady Warden)'
    },
    {
      id: 'zone-4',
      name: 'Central University Library & Knowledge Hub',
      category: 'ACADEMIC',
      locationCode: 'LIB-CENTRAL',
      description: 'Air-conditioned 3-floor library with 45,000+ volumes, IEEE digital journal stations, and discussion pods.',
      timings: '08:00 AM - 10:00 PM',
      contact: '+91 (0674) 259-7125'
    },
    {
      id: 'zone-5',
      name: '24x7 Campus Health & Emergency Medical Unit',
      category: 'MEDICAL',
      locationCode: 'MED-OPD-01',
      description: 'Resident Doctor OPD, emergency first aid trauma bay, critical care dispensary, and 24x7 ambulance ramp.',
      timings: '24 Hours Immediate Response',
      contact: '+91 98765 43210 (Medical Officer)'
    },
    {
      id: 'zone-6',
      name: 'Student Dining Hall & Multi-Cuisine Food Court',
      category: 'DINING',
      locationCode: 'MESS-CENTRAL',
      description: 'State-of-the-art hygienic dining hall serving 4 meals daily, plus Nescafe kiosk and night tuck shop.',
      timings: '07:30 AM - 10:00 PM',
      contact: '+91 (0674) 259-7128'
    },
    {
      id: 'zone-7',
      name: 'Sports Complex, Cricket Oval & Indoor Badminton',
      category: 'SPORTS',
      locationCode: 'SPORTS-ARENA',
      description: 'Floodlit cricket ground, basketball court, Olympic table tennis hall, and modern fitness gymnasium.',
      timings: '05:30 AM - 08:30 PM',
      contact: '+91 94370 88990 (Sports Secretary)'
    },
    {
      id: 'zone-8',
      name: 'Main Gate 1 & Turnstile Security Outpost',
      category: 'GATE',
      locationCode: 'GATE-01-NH16',
      description: 'Primary optical QR turnstile gate pass verification, visitor biometric kiosk, and security guard control.',
      timings: '24x7 Armed Guard Station',
      contact: '+91 94370 12345 (Gate Desk)'
    }
  ]
};

function loadCampusMap(): CampusMapData {
  try {
    if (fs.existsSync(CAMPUS_MAP_FILE)) {
      const data = fs.readFileSync(CAMPUS_MAP_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && parsed.mapImageUrl) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading campus-map.json:', err);
  }
  return initialCampusMap;
}

function saveCampusMap(data: CampusMapData) {
  try {
    fs.writeFileSync(CAMPUS_MAP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving campus-map.json:', err);
  }
}

let campusMapStore: CampusMapData = loadCampusMap();

// GET /api/campus-map: Fetch current official campus map
router.get('/', (_req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: campusMapStore
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve campus map' });
  }
});

// POST /api/campus-map: Admin uploads / updates campus map
router.post('/', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const {
      campusName,
      location,
      mapImageUrl,
      description,
      updatedBy = 'Admin Controller',
      zones
    } = req.body;

    if (!mapImageUrl) {
      return res.status(400).json({ error: 'Map Image URL is required' });
    }

    campusMapStore = {
      id: campusMapStore.id || 'rec-campus-map-master',
      campusName: campusName?.trim() || campusMapStore.campusName,
      location: location?.trim() || campusMapStore.location,
      mapImageUrl: mapImageUrl.trim(),
      description: description?.trim() || campusMapStore.description,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || 'Campus Administrator',
      zones: Array.isArray(zones) && zones.length > 0 ? zones : campusMapStore.zones
    };

    saveCampusMap(campusMapStore);
    broadcastCampusMapUpdate(campusMapStore);

    return res.json({
      success: true,
      message: 'Campus map updated successfully and published to student platform',
      data: campusMapStore
    });
  } catch (err) {
    console.error('Update campus map error:', err);
    return res.status(500).json({ error: 'Failed to update campus map' });
  }
});

export default router;
