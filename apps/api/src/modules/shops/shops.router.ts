import { Router, Request, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth';

const router = Router();

// Pre-seeded campus shops
const CAMPUS_SHOPS = [
  {
    id: 'shop_cafe_01',
    name: 'Campus Central Cafeteria & Bakery',
    category: 'FOOD_AND_BEVERAGE',
    location: 'Ground Floor, Student Activity Center',
    openingHours: '7:30 AM - 11:30 PM',
    rating: 4.8,
    menu: [
      { id: 'm1', name: 'Cold Coffee with Ice Cream', price: 60 },
      { id: 'm2', name: 'Grilled Cheese Paneer Sandwich', price: 75 },
      { id: 'm3', name: 'Maggi Hot Masala Bowl', price: 40 },
      { id: 'm4', name: 'Veg Hakka Noodles', price: 80 }
    ]
  },
  {
    id: 'shop_juice_02',
    name: 'Fresh Oasis Juice & Smoothie Bar',
    category: 'BEVERAGES',
    location: 'Near Hostel Gymnasium Wing',
    openingHours: '6:00 AM - 10:00 PM',
    rating: 4.9,
    menu: [
      { id: 'j1', name: 'Fresh Mosambi / Orange Juice', price: 50 },
      { id: 'j2', name: 'Protein Banana Shake', price: 70 },
      { id: 'j3', name: 'Mixed Fruit Salad Bowl', price: 65 }
    ]
  },
  {
    id: 'shop_xerox_03',
    name: 'Apex Stationery & High-Speed Xerox/Printing',
    category: 'ACADEMIC_UTILITY',
    location: 'Nilgiri Block A Basement',
    openingHours: '8:00 AM - 10:00 PM',
    rating: 4.7,
    menu: [
      { id: 'x1', name: 'A4 B&W Printout / Xerox (Per page)', price: 2 },
      { id: 'x2', name: 'Color Project Report Printout (Per page)', price: 10 },
      { id: 'x3', name: 'Spiral Project Binding', price: 35 },
      { id: 'x4', name: 'Engineering Drawing Sheets (Pack of 5)', price: 45 }
    ]
  },
  {
    id: 'shop_laundry_04',
    name: 'QuickWash Express Laundry & Steam Press',
    category: 'LAUNDRY',
    location: 'Hostel Service Bay 2',
    openingHours: '7:00 AM - 9:00 PM',
    rating: 4.6,
    menu: [
      { id: 'l1', name: 'Full Load Wash & Tumble Dry (Up to 6kg)', price: 120 },
      { id: 'l2', name: 'Formal Steam Ironing (Per piece)', price: 15 },
      { id: 'l3', name: 'Winter Jacket / Blanket Dry Cleaning', price: 180 }
    ]
  }
];

// In-memory pre-orders store
const ORDERS: any[] = [
  {
    orderId: 'ORD-9812',
    shopId: 'shop_xerox_03',
    shopName: 'Apex Stationery & Xerox',
    residentName: 'Rahul Sharma',
    roomNumber: 'A-204',
    items: 'Spiral Project Binding + 15 Color Pages',
    totalAmount: 185,
    pickupSlot: 'Today, 5:30 PM',
    status: 'READY_FOR_PICKUP'
  }
];

router.get('/', (_req: Request, res: Response) => {
  return res.json(CAMPUS_SHOPS);
});

router.post('/order', optionalAuthMiddleware, (req: Request, res: Response) => {
  const { shopId, items, pickupSlot } = req.body;
  const shop = CAMPUS_SHOPS.find((s) => s.id === shopId) || CAMPUS_SHOPS[0];

  const newOrder = {
    orderId: `ORD-${Date.now().toString().slice(-4)}`,
    shopId: shop.id,
    shopName: shop.name,
    residentName: req.user?.name || 'Resident (Rahul Sharma)',
    roomNumber: 'A-204',
    items: items || 'Standard Order',
    totalAmount: 120,
    pickupSlot: pickupSlot || 'Within 30 mins',
    status: 'PREPARED'
  };

  ORDERS.unshift(newOrder);
  return res.status(201).json(newOrder);
});

// Vendor POS-lite sales & commission reporting for admin
router.get('/vendor-commissions', (_req: Request, res: Response) => {
  return res.json({
    totalMonthlyVendorSales: 485000,
    hostelCommissionRate: '8%',
    totalCommissionEarned: 38800,
    shops: [
      { shop: 'Campus Central Cafeteria', sales: 240000, commission: 19200, ordersToday: 142 },
      { shop: 'Fresh Oasis Juice Bar', sales: 95000, commission: 7600, ordersToday: 68 },
      { shop: 'Apex Stationery & Xerox', sales: 85000, commission: 6800, ordersToday: 95 },
      { shop: 'QuickWash Express Laundry', sales: 65000, commission: 5200, ordersToday: 38 }
    ]
  });
});

export default router;
