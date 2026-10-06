import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocketServer } from './socket';
import { startRulesEngine } from './modules/rules-engine/alertRulesEngine';

// Routers
import authRouter from './modules/auth/auth.router';
import emergencyRouter from './modules/emergency/emergency.router';
import complaintsRouter from './modules/complaints/complaints.router';
import passesRouter from './modules/passes/passes.router';
import visitorsRouter from './modules/visitors/visitors.router';
import vehiclesRouter from './modules/vehicles/vehicles.router';
import billingRouter from './modules/billing/billing.router';
import noticesRouter from './modules/notices/notices.router';
import menuRouter from './modules/menu/menu.router';
import analyticsRouter from './modules/analytics/analytics.router';
import residentsRouter from './modules/residents/residents.router';
import complianceRouter from './modules/compliance/compliance.router';
import inventoryRouter from './modules/inventory/inventory.router';
import turnstileRouter from './modules/turnstile/turnstile.router';
import shopsRouter from './modules/shops/shops.router';
import uploadRouter from './modules/upload/upload.router';
import managerProfileRouter from './modules/manager-profile/managerProfile.router';
import galleryRouter from './modules/gallery/gallery.router';
import calendarRouter from './modules/calendar/calendar.router';
import campusMapRouter from './modules/campus-map/campusMap.router';
import { bootstrapDatabase } from './bootstrap';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Static uploads serving
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize WebSockets
initSocketServer(server);

// Start isolated Alerting Rules Engine
startRulesEngine(20);

// API Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    system: 'Smart Hostel Management System (SHMS)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount modular routers
app.use('/api/auth', authRouter);
app.use('/api/emergency', emergencyRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/passes', passesRouter);
app.use('/api/visitors', visitorsRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/billing', billingRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/menu', menuRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/residents', residentsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/turnstile', turnstileRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/manager-profile', managerProfileRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/campus-map', campusMapRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
  console.log(`===================================================`);
  console.log(`🚀 SHMS Backend API running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket Real-Time Gateway ready`);
  console.log(`🛡️ Rules Engine Active (Curfew & Overstay Monitoring)`);
  console.log(`===================================================`);
  await bootstrapDatabase();
});
