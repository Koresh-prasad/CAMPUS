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

// Complete 7-Day Indian Campus Mess Schedule
export const DEFAULT_WEEK_SCHEDULE: Record<string, { BREAKFAST: string; LUNCH: string; SNACKS: string; DINNER: string }> = {
  MONDAY: {
    BREAKFAST: 'Aloo Paratha with Curd & Pickle, Boiled Eggs / Banana, Masala Chai & Filter Coffee',
    LUNCH: 'Dal Tadka, Shahi Paneer, Jeera Rice, Tawa Roti, Boondi Raita, Green Salad',
    SNACKS: 'Crispy Veg Samosa with Mint & Tamarind Chutney, Hot Adrak Chai',
    DINNER: 'Rajma Masala, Kashmiri Pulao, Butter Chapati, Roasted Papad, Hot Gulab Jamun'
  },
  TUESDAY: {
    BREAKFAST: 'South Indian Idli & Medu Vada, Coconut Chutney, Hot Sambar, Coffee & Milk',
    LUNCH: 'Punjabi Chole, Steamed Basmati Rice, Bhature / Phulka Roti, Mix Veg Raita, Pickle',
    SNACKS: 'Crispy Bread Pakora with Tomato Chutney, Hot Ginger Tea',
    DINNER: 'Mix Veg Korma, Dal Palak, Steamed Rice, Butter Roti, Rice Kheer'
  },
  WEDNESDAY: {
    BREAKFAST: 'Indori Poha with Sev & Anar, Sprouts Chaat, Boiled Eggs / Fresh Apple, Lemon Tea',
    LUNCH: 'Kadhi Pakora, Steamed Basmati Rice, Aloo Gobi Matar, Phulka Roti, Roasted Papad',
    SNACKS: 'Crispy Veg Cutlets, Sweet & Sour Chutney, Masala Chai',
    DINNER: 'Paneer Butter Masala / Egg Curry, Veg Pulao, Tandoori Roti, Vanilla Ice Cream'
  },
  THURSDAY: {
    BREAKFAST: 'Methi Thepla with Chhundo, Sprouts, Boiled Eggs / Banana, Masala Tea',
    LUNCH: 'Dal Makhani, Bhindi Do Pyaza, Jeera Rice, Phulka Roti, Dahi Salad',
    SNACKS: 'Poha Chivda & Roasted Salted Peanuts, Elaichi Chai / Filter Coffee',
    DINNER: 'Malai Kofta, Kashmiri Dum Aloo, Steamed Basmati Rice, Butter Naan, Moong Dal Halwa'
  },
  FRIDAY: {
    BREAKFAST: 'Crispy Masala Dosa & Upma, Coconut & Tomato Chutney, Sambar, Filter Coffee',
    LUNCH: 'Dum Biryani (Veg & Chicken Counters), Mirchi Ka Salan, Burani Raita, Phulka Roti',
    SNACKS: 'Pyaz & Mix Veg Pakoda, Mint Chutney, Hot Cutting Chai',
    DINNER: 'Matar Paneer, Yellow Moong Dal Fry, Peas Pulao, Tawa Paratha, Bengali Rasgulla'
  },
  SATURDAY: {
    BREAKFAST: 'Puri Bhaji with Suji Halwa, Boiled Eggs / Seasonal Fruits, Masala Chai',
    LUNCH: 'Veg Fried Rice, Hakka Noodles, Veg Manchurian Gravy, Spring Roll, Sweet Corn Soup',
    SNACKS: 'Mumbai Bhelpuri & Sev Puri Counter, Lemon Iced Tea',
    DINNER: 'Dal Maharani, Baingan Bharta, Steamed Basmati Rice, Chapati, Fresh Fruit Custard'
  },
  SUNDAY: {
    BREAKFAST: 'Chole Bhature Special, Medu Vada, Sweet Lassi, Seasonal Cut Fruits',
    LUNCH: 'Grand Sunday Feast: Paneer Tikka Masala, Veg Dum Biryani, Garlic Naan, Boondi Raita, Gulab Jamun',
    SNACKS: 'Special Grilled Cheese Sandwiches, Cold Coffee with Chocolate Ice Cream',
    DINNER: 'Sunday Festive Gala: Shahi Paneer, Kashmiri Pulao, Butter Paratha, Royal Rasmalai'
  }
};

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

// Helper: build full merged schedule
function buildCurrentSchedule(dbItems: any[]) {
  const schedule: Record<string, any> = JSON.parse(JSON.stringify(DEFAULT_WEEK_SCHEDULE));

  // Merge database items if present
  dbItems.forEach((item) => {
    const day = (item.dayOfWeek || '').toUpperCase();
    const meal = (item.mealType || '').toUpperCase();
    if (day && meal) {
      if (!schedule[day]) schedule[day] = {};
      schedule[day][meal] = item.items;
    }
  });

  // Overlay live in-memory overrides
  Object.keys(liveScheduleOverrides).forEach((day) => {
    const upperDay = day.toUpperCase();
    if (!schedule[upperDay]) schedule[upperDay] = {};
    schedule[upperDay] = { ...schedule[upperDay], ...liveScheduleOverrides[day] };
  });

  return schedule;
}

// 1. GET FULL WEEK SCHEDULE + TODAY
router.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.menuItem.findMany();
    const schedule = buildCurrentSchedule(items);

    const daysMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayName = daysMap[new Date().getDay()];

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
    console.error('Failed to fetch mess menu:', error);
    return res.status(500).json({ error: 'Failed to fetch mess menu' });
  }
});

// 2. ADMIN: ADD A SINGLE DISH TO ANY DAY + MEAL (Shows instantly to all students)
router.post('/add-dish', async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, mealType, dishName, specialNote } = req.body;
    if (!dayOfWeek || !mealType || !dishName || !dishName.trim()) {
      return res.status(400).json({ error: 'dayOfWeek, mealType, and dishName are required' });
    }

    const cleanDay = dayOfWeek.toUpperCase();
    const cleanMeal = mealType.toUpperCase();
    const newDish = dishName.trim();

    // Check existing item in DB
    const existing = await prisma.menuItem.findFirst({
      where: { dayOfWeek: cleanDay, mealType: cleanMeal }
    });

    let currentItemsString = '';
    if (existing && existing.items) {
      currentItemsString = existing.items;
    } else if (liveScheduleOverrides[cleanDay]?.[cleanMeal]) {
      currentItemsString = liveScheduleOverrides[cleanDay][cleanMeal];
    } else if (DEFAULT_WEEK_SCHEDULE[cleanDay]?.[cleanMeal as keyof typeof DEFAULT_WEEK_SCHEDULE['MONDAY']]) {
      currentItemsString = DEFAULT_WEEK_SCHEDULE[cleanDay][cleanMeal as keyof typeof DEFAULT_WEEK_SCHEDULE['MONDAY']];
    }

    // Append dish if not duplicate
    const currentList = currentItemsString
      ? currentItemsString.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    if (!currentList.includes(newDish)) {
      currentList.push(newDish);
    }
    const updatedItems = currentList.join(', ');

    // Persist to database
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { items: updatedItems, specialNote: specialNote || existing.specialNote }
      });
    } else {
      await prisma.menuItem.create({
        data: { dayOfWeek: cleanDay, mealType: cleanMeal, items: updatedItems, specialNote }
      });
    }

    // Update in-memory overrides
    if (!liveScheduleOverrides[cleanDay]) {
      liveScheduleOverrides[cleanDay] = {};
    }
    liveScheduleOverrides[cleanDay][cleanMeal] = updatedItems;

    // Broadcast live to all connected student devices
    broadcastMenuUpdate({
      day: cleanDay,
      mealType: cleanMeal,
      dishAdded: newDish,
      updatedItems,
      todayMeals: liveScheduleOverrides[cleanDay],
      updatedAt: new Date().toISOString()
    });

    console.log(`[Mess Menu] Admin added "${newDish}" to ${cleanDay} ${cleanMeal}. Broadcasted to students.`);

    return res.json({
      success: true,
      message: `"${newDish}" added to ${cleanDay} ${cleanMeal} and published live to all students!`,
      dayOfWeek: cleanDay,
      mealType: cleanMeal,
      items: updatedItems
    });
  } catch (error) {
    console.error('Failed to add dish:', error);
    return res.status(500).json({ error: 'Failed to add dish to mess menu' });
  }
});

// 3. ADMIN: REMOVE A DISH FROM A MEAL SLOT
router.post('/remove-dish', async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, mealType, dishName } = req.body;
    if (!dayOfWeek || !mealType || !dishName) {
      return res.status(400).json({ error: 'dayOfWeek, mealType, and dishName are required' });
    }

    const cleanDay = dayOfWeek.toUpperCase();
    const cleanMeal = mealType.toUpperCase();
    const dishToRemove = dishName.trim();

    const existing = await prisma.menuItem.findFirst({
      where: { dayOfWeek: cleanDay, mealType: cleanMeal }
    });

    let currentItemsString = '';
    if (existing && existing.items) {
      currentItemsString = existing.items;
    } else if (liveScheduleOverrides[cleanDay]?.[cleanMeal]) {
      currentItemsString = liveScheduleOverrides[cleanDay][cleanMeal];
    } else if (DEFAULT_WEEK_SCHEDULE[cleanDay]?.[cleanMeal as keyof typeof DEFAULT_WEEK_SCHEDULE['MONDAY']]) {
      currentItemsString = DEFAULT_WEEK_SCHEDULE[cleanDay][cleanMeal as keyof typeof DEFAULT_WEEK_SCHEDULE['MONDAY']];
    }

    const updatedList = currentItemsString
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s && s.toLowerCase() !== dishToRemove.toLowerCase());

    const updatedItems = updatedList.join(', ');

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { items: updatedItems }
      });
    } else {
      await prisma.menuItem.create({
        data: { dayOfWeek: cleanDay, mealType: cleanMeal, items: updatedItems }
      });
    }

    if (!liveScheduleOverrides[cleanDay]) {
      liveScheduleOverrides[cleanDay] = {};
    }
    liveScheduleOverrides[cleanDay][cleanMeal] = updatedItems;

    broadcastMenuUpdate({
      day: cleanDay,
      mealType: cleanMeal,
      dishRemoved: dishToRemove,
      updatedItems,
      todayMeals: liveScheduleOverrides[cleanDay],
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `"${dishToRemove}" removed from ${cleanDay} ${cleanMeal}`,
      dayOfWeek: cleanDay,
      mealType: cleanMeal,
      items: updatedItems
    });
  } catch (error) {
    console.error('Failed to remove dish:', error);
    return res.status(500).json({ error: 'Failed to remove dish' });
  }
});

// 4. ADMIN: UPDATE COMPLETE SLOT (BREAKFAST, LUNCH, SNACKS, OR DINNER)
router.post('/update-slot', async (req: Request, res: Response) => {
  try {
    const { dayOfWeek, mealType, items, specialNote } = req.body;
    if (!dayOfWeek || !mealType || items === undefined) {
      return res.status(400).json({ error: 'dayOfWeek, mealType, and items are required' });
    }

    const cleanDay = dayOfWeek.toUpperCase();
    const cleanMeal = mealType.toUpperCase();
    const cleanItems = items.trim();

    const existing = await prisma.menuItem.findFirst({
      where: { dayOfWeek: cleanDay, mealType: cleanMeal }
    });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { items: cleanItems, specialNote }
      });
    } else {
      await prisma.menuItem.create({
        data: { dayOfWeek: cleanDay, mealType: cleanMeal, items: cleanItems, specialNote }
      });
    }

    if (!liveScheduleOverrides[cleanDay]) {
      liveScheduleOverrides[cleanDay] = {};
    }
    liveScheduleOverrides[cleanDay][cleanMeal] = cleanItems;

    broadcastMenuUpdate({
      day: cleanDay,
      mealType: cleanMeal,
      updatedItems: cleanItems,
      todayMeals: liveScheduleOverrides[cleanDay],
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `${cleanDay} ${cleanMeal} updated and published live!`,
      dayOfWeek: cleanDay,
      mealType: cleanMeal,
      items: cleanItems
    });
  } catch (error) {
    console.error('Failed to update slot:', error);
    return res.status(500).json({ error: 'Failed to update slot' });
  }
});

// 5. ADMIN: UPDATE ENTIRE DAY (BREAKFAST + LUNCH + SNACKS + DINNER)
router.post('/update-today', async (req: Request, res: Response) => {
  try {
    const daysMap = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const todayName = daysMap[new Date().getDay()];
    const targetDay = (req.body.dayOfWeek || todayName).toUpperCase();
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

    if (!liveScheduleOverrides[targetDay]) {
      liveScheduleOverrides[targetDay] = {};
    }

    const mealUpdates: Record<string, string> = {};
    if (breakfast !== undefined) mealUpdates['BREAKFAST'] = breakfast.trim();
    if (lunch !== undefined) mealUpdates['LUNCH'] = lunch.trim();
    if (snacks !== undefined) mealUpdates['SNACKS'] = snacks.trim();
    if (dinner !== undefined) mealUpdates['DINNER'] = dinner.trim();

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
      message: `Mess menu for ${targetDay} updated and broadcast live to all student devices!`,
      todayMeals: liveScheduleOverrides[targetDay],
      festivalSpecial: liveFestivalOverride
    });
  } catch (error) {
    console.error('Update menu error:', error);
    return res.status(500).json({ error: 'Failed to update mess menu' });
  }
});

// 6. ADMIN: RESET ALL 7 DAYS TO RICH CAMPUS DEFAULTS
router.post('/reset-defaults', async (_req: Request, res: Response) => {
  try {
    // Delete custom DB rows
    await prisma.menuItem.deleteMany();

    // Populate fresh rows for all 7 days x 4 meals
    for (const [day, meals] of Object.entries(DEFAULT_WEEK_SCHEDULE)) {
      for (const [mealType, items] of Object.entries(meals)) {
        await prisma.menuItem.create({
          data: { dayOfWeek: day, mealType, items }
        });
      }
    }

    liveScheduleOverrides = {};
    liveFestivalOverride = null;

    broadcastMenuUpdate({
      reset: true,
      updatedAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Mess menu reset to 7-day campus standard for all students!',
      schedule: DEFAULT_WEEK_SCHEDULE
    });
  } catch (error) {
    console.error('Reset menu error:', error);
    return res.status(500).json({ error: 'Failed to reset menu' });
  }
});

// 7. EATING HEADCOUNT TOGGLE (STUDENT RSVP)
router.post('/eating-today', authMiddleware, async (req: Request, res: Response) => {
  const { mealType, isEating } = req.body;
  const key = (mealType?.toLowerCase() || 'dinner') as keyof typeof eatingHeadcount;
  if (eatingHeadcount[key] !== undefined) {
    eatingHeadcount[key] += isEating ? 1 : -1;
  }
  return res.json({ success: true, headcounts: eatingHeadcount });
});

export default router;
