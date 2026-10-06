import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../../middlewares/auth';
import { broadcastCalendarUpdate } from '../../socket';
import fs from 'fs';
import path from 'path';

const router = Router();

export interface CalendarEvent {
  id: string;
  tenantId: string;
  title: string;
  eventType: 'EXAM' | 'HOLIDAY' | 'CULTURAL' | 'SPORTS' | 'ACADEMIC' | 'HOSTEL';
  category?: string;
  startDate: string; // YYYY-MM-DD
  date?: string;
  time?: string;
  endDate: string; // YYYY-MM-DD
  venue: string;
  description: string;
  isHoliday: boolean;
  isMandatory: boolean;
  scheduledBy: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');

const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-001',
    tenantId: 'default',
    title: 'Mid-Term Examinations (All Engineering & Sciences)',
    eventType: 'EXAM',
    startDate: '2026-04-06',
    endDate: '2026-04-14',
    venue: 'Academic Block Exam Halls 101 - 204',
    description: 'Admit cards mandatory. Turnstiles will operate on special exam schedule. Strict silence in hostel wings after 10 PM.',
    isHoliday: false,
    isMandatory: true,
    scheduledBy: 'Dean of Academic Affairs & Chief Warden',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-002',
    tenantId: 'default',
    title: 'Diwali & Autumn Festive Vacation',
    eventType: 'HOLIDAY',
    startDate: '2026-04-20',
    endDate: '2026-04-27',
    venue: 'Campus Closed / Home Leave',
    description: 'Hostel outpass window opens 48 hours prior. Mess will run holiday menu for residents staying back.',
    isHoliday: true,
    isMandatory: false,
    scheduledBy: 'University Registrar',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-003',
    tenantId: 'default',
    title: 'Annual Inter-Hostel Cricket & Badminton League Finals',
    eventType: 'SPORTS',
    startDate: '2026-04-01',
    endDate: '2026-04-03',
    venue: 'Campus Sports Complex & Floodlit Turf',
    description: 'Cheer for your block! Refreshments and live match streaming at the central recreation quadrangle.',
    isHoliday: false,
    isMandatory: false,
    scheduledBy: 'Hostel Sports Committee',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-004',
    tenantId: 'default',
    title: 'Hostel Mess & Facilities Resident General Body Meeting',
    eventType: 'HOSTEL',
    startDate: '2026-04-04',
    endDate: '2026-04-04',
    venue: 'Dining Hall A (8:00 PM)',
    description: 'Monthly student council session to review menu feedback, Wi-Fi upgrades, and laundry schedules with Chief Warden.',
    isHoliday: false,
    isMandatory: false,
    scheduledBy: 'Chief Warden Office',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-005',
    tenantId: 'default',
    title: 'National Tech Symposium & Robotics Hackathon 2026',
    eventType: 'CULTURAL',
    startDate: '2026-05-02',
    endDate: '2026-05-04',
    venue: 'Main University Auditorium & Innovation Labs',
    description: '48-hour hackathon, paper presentations, and venture pitch competition with ₹5 Lakh prize pool.',
    isHoliday: false,
    isMandatory: false,
    scheduledBy: 'Student Technical Council',
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-006',
    tenantId: 'default',
    title: 'Graduation Day & Campus Farewell Gala',
    eventType: 'ACADEMIC',
    startDate: '2026-05-18',
    endDate: '2026-05-18',
    venue: 'Central Convocation Grounds',
    description: 'Honoring the graduating batch of 2026 with Chancellor address and evening banquet buffet.',
    isHoliday: false,
    isMandatory: true,
    scheduledBy: 'Administrative Controller',
    createdAt: new Date().toISOString()
  }
];

function loadCalendar(): CalendarEvent[] {
  try {
    if (fs.existsSync(CALENDAR_FILE)) {
      const data = fs.readFileSync(CALENDAR_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading calendar.json:', err);
  }
  return initialCalendarEvents;
}

function saveCalendar(events: CalendarEvent[]) {
  try {
    fs.writeFileSync(CALENDAR_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving calendar.json:', err);
  }
}

let calendarStore: CalendarEvent[] = loadCalendar();

// GET /api/calendar
router.get('/', (req: Request, res: Response) => {
  try {
    const { type, category } = req.query;
    const filterType = (type || category) as string;
    let events = calendarStore.map((e) => ({
      ...e,
      category: e.category || e.eventType,
      date: e.date || e.startDate,
      time: e.time || 'All Day'
    }));

    if (filterType && filterType !== 'ALL') {
      events = events.filter((e) => e.eventType === filterType || e.category === filterType);
    }
    // Sort by start date ascending
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return res.json({
      success: true,
      events,
      totalCount: events.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve college calendar events' });
  }
});

// POST /api/calendar (Admin/Controller schedules event)
router.post('/', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const {
      title,
      eventType = 'ACADEMIC',
      category,
      startDate,
      date,
      time,
      endDate,
      venue = 'Campus Main',
      description = '',
      isHoliday = false,
      isMandatory = false,
      scheduledBy = 'Controller Desk'
    } = req.body;

    const actualStartDate = startDate || date;
    const actualEventType = ((category || eventType) as string).toUpperCase() as any;

    if (!title || !actualStartDate) {
      return res.status(400).json({ error: 'Event title and start date are required' });
    }

    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      tenantId: 'default',
      title: title.trim(),
      eventType: actualEventType,
      category: actualEventType,
      startDate: actualStartDate,
      date: actualStartDate,
      time: time || 'All Day',
      endDate: endDate || actualStartDate,
      venue: venue.trim(),
      description: description.trim(),
      isHoliday: Boolean(isHoliday || actualEventType === 'HOLIDAY'),
      isMandatory: Boolean(isMandatory || actualEventType === 'EXAM'),
      scheduledBy,
      createdAt: new Date().toISOString()
    };

    calendarStore.push(newEvent);
    saveCalendar(calendarStore);

    // Broadcast live to all connected student screens immediately
    broadcastCalendarUpdate({ action: 'CREATED', event: newEvent });

    return res.json({
      success: true,
      message: 'College event scheduled and broadcast to student resident app',
      event: newEvent
    });
  } catch (err) {
    console.error('Calendar post error:', err);
    return res.status(500).json({ error: 'Failed to schedule calendar event' });
  }
});

// PUT /api/calendar/:id (Controller updates event)
router.put('/:id', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = calendarStore.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existing = calendarStore[index];
    const updated: CalendarEvent = {
      ...existing,
      ...req.body,
      id: existing.id
    };

    calendarStore[index] = updated;
    saveCalendar(calendarStore);

    broadcastCalendarUpdate({ action: 'UPDATED', event: updated });

    return res.json({
      success: true,
      message: 'Event updated and broadcast',
      event: updated
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update calendar event' });
  }
});

// DELETE /api/calendar/:id (Controller removes event)
router.delete('/:id', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exists = calendarStore.find((e) => e.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    calendarStore = calendarStore.filter((e) => e.id !== id);
    saveCalendar(calendarStore);

    // Broadcast live deletion
    broadcastCalendarUpdate({ action: 'DELETED', id });

    return res.json({
      success: true,
      message: 'Calendar event removed'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete calendar event' });
  }
});

export default router;
