import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../../middlewares/auth';
import { broadcastGalleryUpdate } from '../../socket';
import fs from 'fs';
import path from 'path';

const router = Router();

export interface GalleryItem {
  id: string;
  tenantId: string;
  title: string;
  category: 'CULTURAL' | 'SPORTS' | 'TECH' | 'HOSTEL_LIFE' | 'ACTIVITIES' | 'ACADEMIC';
  mediaType: 'PHOTO' | 'VIDEO';
  mediaUrl: string;
  thumbnailUrl?: string;
  description: string;
  eventDate: string;
  isPinned: boolean;
  likesCount: number;
  uploadedBy: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gallery-001',
    tenantId: 'default',
    title: "Campus Cultural Fest 'Tarang 2026' Grand Night",
    category: 'CULTURAL',
    mediaType: 'VIDEO',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-concert-4330-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    description: '3,000+ residents cheering at the live musical band performance and campus dance trophy night at the Central Amphitheater.',
    eventDate: '2026-03-18',
    isPinned: true,
    likesCount: 142,
    uploadedBy: 'Chief Warden & Cultural Secretary',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'gallery-002',
    tenantId: 'default',
    title: 'Annual Inter-Hostel Sports Championship & Cricket Finals',
    category: 'SPORTS',
    mediaType: 'PHOTO',
    mediaUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?auto=format&fit=crop&w=600&q=80',
    description: 'Block A Lions lifting the Rolling Cricket Trophy 2026 after a thrilling final over finish against Block C.',
    eventDate: '2026-03-15',
    isPinned: true,
    likesCount: 189,
    uploadedBy: 'Hostel Sports Committee',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'gallery-003',
    tenantId: 'default',
    title: 'Smart India Hackathon & AI Innovation Finals',
    category: 'TECH',
    mediaType: 'PHOTO',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    description: 'Hostel resident team winning 1st Prize in AI & IoT track for designing autonomous solar cleaning drones.',
    eventDate: '2026-03-10',
    isPinned: false,
    likesCount: 97,
    uploadedBy: 'Tech Club Head',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'gallery-004',
    tenantId: 'default',
    title: 'Hostel Open-Air DJ Night, Campfire & Food Carnival',
    category: 'HOSTEL_LIFE',
    mediaType: 'PHOTO',
    mediaUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80',
    description: 'Grand festive dinner with live chaat counters, tandoor stalls, bonfire acoustic sessions, and student performances.',
    eventDate: '2026-03-05',
    isPinned: false,
    likesCount: 215,
    uploadedBy: 'Mess & Recreation Committee',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 'gallery-005',
    tenantId: 'default',
    title: 'Drone Racing & Robotics Arena Showcase',
    category: 'TECH',
    mediaType: 'VIDEO',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-field-of-wheat-42998-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    description: 'High-speed FPV drone obstacle circuit built by the Robotics Society in the campus indoor sports arena.',
    eventDate: '2026-02-28',
    isPinned: false,
    likesCount: 114,
    uploadedBy: 'Robotics Wing',
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
  },
  {
    id: 'gallery-006',
    tenantId: 'default',
    title: 'Inter-College Football Derby Championship',
    category: 'SPORTS',
    mediaType: 'PHOTO',
    mediaUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    description: 'Campus team qualifying for the State Inter-University Finals under floodlights at the Main Football Ground.',
    eventDate: '2026-02-20',
    isPinned: false,
    likesCount: 168,
    uploadedBy: 'Sports Secretary',
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString()
  }
];

function loadGallery(): GalleryItem[] {
  try {
    if (fs.existsSync(GALLERY_FILE)) {
      const data = fs.readFileSync(GALLERY_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading gallery.json:', err);
  }
  return initialGalleryItems;
}

function saveGallery(items: GalleryItem[]) {
  try {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving gallery.json:', err);
  }
}

let galleryStore: GalleryItem[] = loadGallery();

// GET /api/gallery
router.get('/', (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let items = [...galleryStore];
    if (category && category !== 'ALL') {
      items = items.filter((item) => item.category === category);
    }
    // Sort: pinned first, then newer event dates or created dates
    items.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return res.json({
      success: true,
      items,
      totalCount: items.length
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve college gallery items' });
  }
});

// POST /api/gallery (Admin/Controller adds activity, photo or video)
router.post('/', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const {
      title,
      category = 'ACTIVITIES',
      mediaType = 'PHOTO',
      mediaUrl,
      thumbnailUrl,
      description = '',
      eventDate = new Date().toISOString().split('T')[0],
      isPinned = false,
      uploadedBy = 'Admin Controller'
    } = req.body;

    if (!title || !mediaUrl) {
      return res.status(400).json({ error: 'Title and Media URL are required' });
    }

    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      tenantId: 'default',
      title: title.trim(),
      category,
      mediaType,
      mediaUrl,
      thumbnailUrl: thumbnailUrl || mediaUrl,
      description: description.trim(),
      eventDate,
      isPinned: Boolean(isPinned),
      likesCount: 0,
      uploadedBy,
      createdAt: new Date().toISOString()
    };

    galleryStore.unshift(newItem);
    saveGallery(galleryStore);

    // Broadcast live to all connected student screens
    broadcastGalleryUpdate({ action: 'CREATED', item: newItem });

    return res.json({
      success: true,
      message: 'Campus activity added to gallery and broadcast to student resident app',
      item: newItem
    });
  } catch (err) {
    console.error('Gallery post error:', err);
    return res.status(500).json({ error: 'Failed to add gallery activity' });
  }
});

// DELETE /api/gallery/:id (Controller removes activity)
router.delete('/:id', optionalAuthMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exists = galleryStore.find((g) => g.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    galleryStore = galleryStore.filter((g) => g.id !== id);
    saveGallery(galleryStore);

    // Broadcast live deletion
    broadcastGalleryUpdate({ action: 'DELETED', id });

    return res.json({
      success: true,
      message: 'Gallery activity removed'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

// POST /api/gallery/:id/like (Student cheers/likes activity)
router.post('/:id/like', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = galleryStore.find((g) => g.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    item.likesCount = (item.likesCount || 0) + 1;
    saveGallery(galleryStore);

    broadcastGalleryUpdate({ action: 'LIKED', id, likesCount: item.likesCount });

    return res.json({
      success: true,
      likesCount: item.likesCount,
      likes: item.likesCount
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to like gallery item' });
  }
});

export default router;
