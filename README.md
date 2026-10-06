<<<<<<< HEAD
# Smart Hostel Management System (SHMS)
### Enterprise Digital Transformation Platform for Hostels, PGs & College Campuses

A complete, full-stack, mobile-first Smart Hostel Management System engineered for **100% digital operations**, sub-second emergency response, automated curfew attendance tracking, and institutional NAAC/AICTE accreditation compliance.

---

## 🏛️ System Architecture

```
                               ┌───────────────────────────┐
                               │   SHMS Monorepo Root      │
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
     ┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
     │ apps/resident-web │         │  apps/admin-web   │         │  packages/shared  │
     │ (Next.js 14 PWA)  │         │ (Next.js 14 App)  │         │ (Shared Types,    │
     │ - Mobile-first UX │         │ - Operational &   │         │  Constants, DTOs, │
     │ - 2-3 Tap Actions │         │   Executive KPIs  │         │  Socket Events)   │
     │ - Persistent SOS  │         │ - Live Curfew     │         └───────────────────┘
     │ - QR Gate Passes  │         │   "Who's Out"     │
     └─────────┬─────────┘         └─────────┬─────────┘
               │                             │
               └──────────────┬──────────────┘
                              ▼
                   ┌───────────────────────┐
                   │       apps/api        │
                   │ (Express + TypeScript)│
                   │ - Socket.io Gateway   │
                   │ - Alert Rules Engine  │
                   │ - RBAC Middleware     │
                   │ - Prisma ORM          │
                   └───────────┬───────────┘
                               ▼
                   ┌───────────────────────┐
                   │  Database & Storage   │
                   │ - SQLite (Dev/Local)  │
                   │ - Postgres (Docker)   │
                   │ - Tamper-evident Logs │
                   └───────────────────────┘
```

---

## 🚀 Quick Start

### 1. Launch All Services Simultaneously
Double-click `start-all.bat` or run:
```bash
pnpm run dev
```

### 2. Service Access URLs
| Service | URL | Description |
|---|---|---|
| **Admin Command Center** | [http://localhost:3000](http://localhost:3000) | Executive Dashboard, Curfew "Who's Out" Board, Complaints Kanban, Visitor Overstay Monitor, Turnstile Scanner, NAAC Compliance Dossier |
| **Resident Mobile App** | [http://localhost:3001](http://localhost:3001) | Mobile-first Student/Resident Companion with 2-click complaints, dynamic QR exit passes, persistent SOS button, and mess menu |
| **Backend API & WebSockets** | [http://localhost:4000](http://localhost:4000) | Modular REST endpoints with live Socket.io gateway and background alerting rules engine |

---

## 👥 Demo Pre-Seeded Accounts

The database comes pre-populated with **Apex Institute of Technology** (Nilgiri Boys & Shivalik Girls Hostels):

| Role | Email | Capabilities |
|---|---|---|
| **Warden (Boys)** | `warden.boys@campus.edu` | Pass approvals, complaint assignment, curfew monitoring |
| **Director / Owner** | `director@campus.edu` | Full analytics visibility, NAAC readiness score, emergency escalation |
| **Gate Security** | `security.gate1@campus.edu` | Turnstile barcode scanning, visitor check-in, overstay tracking |
| **Resident Student** | `rahul.sharma@campus.edu` | Self-service passes, 2-click complaints, mess headcount, dues payment |
| **Overdue Resident** | `amit.patel@campus.edu` | Demonstrates real-time curfew breach alert on the admin board |

---

## 🛡️ Core Differentiating Features

### 1. Dedicated Alerting Rules Engine (`/apps/api/src/modules/rules-engine/alertRulesEngine.ts`)
An isolated, testable background service continuously evaluating:
- **Instant SOS Siren**: Broadcsts audio-visual siren banners to all connected admin/security clients with GPS/Room coordinates.
- **Curfew Breach Detection**: Cross-checks gate turnstile scans against expected-in-hostel status; flags late residents in flashing red.
- **Visitor Overstay Monitor**: Automatically flags any visitor remaining on campus beyond permitted duration (default 120 mins).

### 2. Mobile-First Resident App (`/apps/resident-web`)
- **Persistent Floating SOS Button**: Pulsing, always-reachable action button confirming crisis type (Medical, Fire, Threat, Other).
- **2-Click Complaint Raise**: Categorized icons, photo attachment, anonymous toggle, SLA countdown, and 1-5 star feedback.
- **Dynamic QR Passes**: Instant gate passes and multi-day leaves with live QR tokens verified by gate turnstiles.
- **Mess Menu & Attendance**: View today's menu and toggle "Eating Tonight" headcount to prevent kitchen food wastage.

### 3. Executive & Operational Admin Panel (`/apps/admin-web`)
- **Live "Who's Out" Curfew Board**: Real-time visibility into students off campus with 1-click resident/parent calling.
- **Complaints Kanban**: Multi-column SLA tracker with automatic department routing (Plumbing, Electrical, Housekeeping).
- **Gate Turnstile Simulator**: Integrated RFID/QR barcode scanner tool verifying visitor and resident passes with live LED feedback.
- **NAAC / AICTE Accreditation Dossier**: Automated compliance dossier covering Criterion 5.1 (Student Support) & 5.3 (Grievance Redressal).
- **60-Minute Campus Onboarding Wizard**: 5-step rapid setup for new institutions or branches.
=======
# CAMPUSHELPER
A campus/hostel helper platform connecting students with essential services and support
>>>>>>> bac13997c054ded6638943e192b40770e410303a
