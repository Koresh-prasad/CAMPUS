import { Router, Request, Response } from 'express';
import { prisma } from '../../prisma';
import { authMiddleware } from '../../middlewares/auth';
import { broadcastMenuUpdate } from '../../socket';

const router = Router();

// Simulated memory store for today's eating headcount
let eatingHeadcount = {
  breakfast: 184,
  lunch: 215,
  snacks: 140,
  dinner: 230
};

// Live dynamic overrides configured by admin / mess manager
let liveScheduleOverrides: Record<string, any> = {};
let liveFestivalOverride: any = null;

router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany();
    
    // Diverse schedule by dayOfWeek
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const defaultSchedule: Record<string, any> = {
      MONDAY: {
        BREAKFAST: 'Aloo Paratha, Curd, Boiled Eggs / Banana, Masala Chai / Filter Coffee',
        LUNCH: 'Dal Tadka, Shahi Paneer, Jeera Rice, Tawa Roti, Green Salad',
        SNACKS: 'Veg Samosa with Mint & Tamarind Chutney, Adrak Chai',
        DINNER: 'Rajma Masala, Kashmiri Pulao, Butter Chapati, Gulab Jamun'
      },
      TUESDAY: {
        BREAKFAST: 'South Indian Idli Sambar, Coconut Chutney, Sprouts Chaat, Coffee / Milk',
        LUNCH: 'Chole Punjabi, Jeera Rice, Bhature / Phulka Roti, Boondi Raita',
        SNACKS: 'Crispy Bread Pakora, Tomato Sauce, Hot Tea',
        DINNER: 'Mix Veg Korma, Dal Palak, Steamed Rice, Roti, Kheer'
      },
      WEDNESDAY: {
        BREAKFAST: 'Indori Poha with Sev, Boiled Eggs / Fresh Fruits, Lemon Tea / Coffee',
        LUNCH: 'Kadhi Pakora, Steamed Basmati Rice, Aloo Gobi Masala, Roti, Papad',
        SNACKS: 'Crispy Veg Cutlets, Green Chutney, Masala Chai',
        DINNER: 'Paneer Butter Masala / Egg Curry, Tandoori Roti, Veg Pulao, Ice Cream'
      },
      THURSDAY: {
        BREAKFAST: 'Methi Thepla, Chhundo Chutney, Boiled Eggs / Milk, Chai',
        LUNCH: 'Dal Makhani, Bhindi Masala, Jeera Rice, Phulka Roti, Salad',
        SNACKS: 'Poha Chivda, Roasted Peanuts, Tea / Coffee',
        DINNER: 'Malai Kofta, Kashmiri Dum Aloo, Butter Naan, Pulao, Moong Dal Halwa'
      },
      FRIDAY: {
        BREAKFAST: 'Crispy Medu Vada, Upma, Coconut Chutney, Sambar, Filter Coffee',
        LUNCH: 'Veg Biryani / Chicken Biryani, Mirchi Ka Salan, Onion Raita, Phulka',
        SNACKS: 'Onion & Mix Veg Pakoda, Green Chutney, Hot Adrak Chai',
        DINNER: 'Matar Paneer, Yellow Dal Fry, Peas Pulao, Tawa Paratha, Rasgulla'
      },
      SATURDAY: {
        BREAKFAST: 'Puri Bhaji with Halwa, Boiled Eggs / Fruits, Masala Tea',
        LUNCH: 'Veg Fried Rice, Hakka Noodles, Manchurian Gravy, Spring Roll, Soup',
        SNACKS: 'Bhelpuri / Sev Puri Counter, Lemon Iced Tea',
        DINNER: 'Dal Maharani, Baingan Bharta, Steamed Basmati Rice, Chapati, Custard'
      },
      SUNDAY: {
        BREAKFAST: 'Chole Bhature Special, Sweet Lassi, Fresh Seasonal Cut Fruits',
        LUNCH: 'Grand Sunday Feast: Paneer Makhani, Dum Biryani, Garlic Naan, Raita',
        SNACKS: 'Special Grilled Sandwiches, Cold Coffee with Ice Cream',
        DINNER: 'Festive Buffet: Shahi Korma, Jeera Rice, Butter Paratha, Rasmalai'
      }
    };

    const schedule: Record<string, any> = { ...defaultSchedule };

    items.forEach((item) => {
      if (!schedule[item.dayOfWeek]) schedule[item.dayOfWeek] = {};
      schedule[item.dayOfWeek][item.mealType] = item.items;
    });

    // Overlay live schedule overrides
    Object.keys(liveScheduleOverrides).forEach((day) => {
      if (!schedule[day]) schedule[day] = {};
      schedule[day] = { ...schedule[day], ...liveScheduleOverrides[day] };
    });

    const daysMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayName = daysMap[new Date().getDay()];

    const defaultFestivalSpecial = {
      title: 'Grand Campus Festive Feast & Gala Buffet',
      occasion: 'Upcoming Festive Celebration & Sunday Gala Banquet',
      date: 'This Sunday Special (7:30 PM - 10:30 PM)',
      breakfastSpecial: 'Chole Bhature with Pindi Chole, Medu Vada, Sweet Lassi & Kesar Halwa',
      lunchSpecial: 'Mughlai Veg Dum Biryani, Dal Makhani, Paneer Lababdar, Butter Naan, Raita & Gulab Jamun',
      dinnerFeast: 'Shahi Paneer Tikka Masala, Kashmiri Pulao, Tandoori Roti, Live Jalebi & Rabri Counter, Premium Ice Cream Buffet',
      liveCounters: [
        'Live Chaat & Pani Puri Counter (4:30 PM - 6:30 PM)',
        'Fresh Tandoor Naan & Roti Station',
        'Ice Cream Sundae & Kulfi Bar'
      ],
      highlights: [
        'FSSAI 5-Star Clean & Hygiene Campus Certified',
        'Special Jain & Sattvik preparation counters available upon request',
        'Festival Music, Ambient Lighting & Special Dining Hall Decor'
      ],
      dietaryNotes: '100% Pure Vegetarian & Halal options clearly separated with dedicated serving stations'
    };

    const festivalSpecial = liveFestivalOverride 
      ? { ...defaultFestivalSpecial, ...liveFestivalOverride } 
      : defaultFestivalSpecial;

    return res.json({
      schedule,
      today: {
        day: todayName,
        meals: schedule[todayName] || schedule['MONDAY'],
        headcounts: eatingHeadcount
      },
      festivalSpecial
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch mess menu' });
  }
});

// Admin endpoint to quickly update today's menu in one click
router.post('/update-today', async (req: Request, res: Response) => {
  try {
    const daysMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayName = daysMap[new Date().getDay()];
    const targetDay = req.body.dayOfWeek || todayName;
    const { 
      breakfast, 
      lunch, 
      snacks, 
      dinner, 
      festivalTitle, 
      festivalBreakfast, 
      festivalLunch, 
      festivalDinner, 
      festivalDate,
      highlights 
    } = req.body;

    // Update in-memory live overrides
    if (!liveScheduleOverrides[targetDay]) {
      liveScheduleOverrides[targetDay] = {};
    }

    const mealUpdates: Record<string, string> = {};
    if (breakfast) mealUpdates['BREAKFAST'] = breakfast;
    if (lunch) mealUpdates['LUNCH'] = lunch;
    if (snacks) mealUpdates['SNACKS'] = snacks;
    if (dinner) mealUpdates['DINNER'] = dinner;

    liveScheduleOverrides[targetDay] = {
      ...liveScheduleOverrides[targetDay],
      ...mealUpdates
    };

    // Persist to database
    for (const [mealType, items] of Object.entries(mealUpdates)) {
      try {
        const existing = await prisma.menuItem.findFirst({
          where: { dayOfWeek: targetDay, mealType }
        });
        if (existing) {
          await prisma.menuItem.update({
            where: { id: existing.id },
            data: { items }
          });
        } else {
          await prisma.menuItem.create({
            data: { dayOfWeek: targetDay, mealType, items }
          });
        }
      } catch (dbErr) {
        console.error('Failed to persist menu item to db:', dbErr);
      }
    }

    if (festivalTitle || festivalDinner || festivalBreakfast || festivalLunch) {
      liveFestivalOverride = {
        title: festivalTitle || 'Special Campus Celebration Feast',
        date: festivalDate || 'Today Special',
        occasion: 'Warden & Mess Committee Special Menu',
        breakfastSpecial: festivalBreakfast || 'Special Festival Breakfast Combo',
        lunchSpecial: festivalLunch || 'Special Royal Lunch Thali',
        dinnerFeast: festivalDinner || 'Grand Feast with Desserts & Live Counter',
        highlights: highlights && Array.isArray(highlights) ? highlights : [
          'Chef special preparation with fresh organic ingredients',
          'Unlimited servings at all counters'
        ]
      };
    }

    // Broadcast live to all connected student devices
    broadcastMenuUpdate({
      day: targetDay,
      todayMeals: liveScheduleOverrides[targetDay],
      festivalSpecial: liveFestivalOverride,
      updatedAt: new Date().toISOString()
    });

    return res.json({ 
      success: true, 
      message: 'Mess menu updated and broadcast live to all student devices!',
      todayMeals: liveScheduleOverrides[targetDay],
      festivalSpecial: liveFestivalOverride
    });
  } catch (error) {
    console.error('Update menu error:', error);
    return res.status(500).json({ error: 'Failed to update today mess menu' });
  }
});

router.put('/update', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, mealType, items, specialNote } = req.body;
    
    // Upsert menuItem
    const existing = await prisma.menuItem.findFirst({
      where: { dayOfWeek, mealType }
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { items, specialNote }
      });
    } else {
      await prisma.menuItem.create({
        data: { dayOfWeek, mealType, items, specialNote }
      });
    }

    return res.json({ success: true, message: 'Menu updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update menu' });
  }
});

router.post('/eating-today', authMiddleware, async (req: Request, res: Response) => {
  const { mealType, isEating } = req.body;
  const key = (mealType?.toLowerCase() || 'dinner') as keyof typeof eatingHeadcount;
  if (eatingHeadcount[key] !== undefined) {
    eatingHeadcount[key] += isEating ? 1 : -1;
  }
  return res.json({ success: true, headcounts: eatingHeadcount });
});

export default router;

