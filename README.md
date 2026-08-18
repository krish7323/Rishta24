# RISHTA24 (रिश्ता २४)
### *“Har Rishta, Ek Nayi Shuruaat”*

A production-ready matrimonial application built with modern architecture:
- **Mobile Application**: React Native (Expo) + TypeScript + React Navigation + Zustand + Custom Rose/Gold Design System
- **Backend API Server**: Node.js + Express + TypeScript + MongoDB + Socket.IO + JWT Authentication + Razorpay Integration
- **Admin Control Center**: React + Vite + TypeScript + TailwindCSS + Recharts

---

## 🌹 Design Language & Aesthetics
RISHTA24 reproduces the reference matrimonial aesthetic:
- **Primary Brand Color**: Rose Pink (`#D62F5B`), Dark Pink (`#B92349`), Light Rose Background (`#FFF9FA`), Soft Rose Surface (`#FCEEF2`)
- **Accent**: Royal Gold (`#D9A441`) for VIP badges & premium tiers
- **Typography**: Editorial Serif for brand headings & Sans-Serif for high legibility
- **Card Styling**: Rounded cards (24px radius), tinted soft rose shadows, clean surfaces
- **Bottom Navigation**: 5 tab items with rose active states and icons

---

## 📁 Repository Structure

```
rista 24/
├── server/                 # Node.js + Express + MongoDB + Socket.IO Backend
│   ├── src/
│   │   ├── config/         # Environment, MongoDB & Subscription constants
│   │   ├── controllers/    # 15+ Controllers (Auth, Profile, Search, Match, Chat, etc.)
│   │   ├── middlewares/    # JWT Auth, RBAC, Zod validation, Audit logger, Uploads
│   │   ├── models/         # 17 Mongoose Entities (User, Profile, Match, Chat, etc.)
│   │   ├── routes/         # Modular REST API endpoints
│   │   ├── seed/           # Seeder engine with pre-populated realistic profiles
│   │   ├── services/       # Compatibility scoring engine, Razorpay, Notifications
│   │   ├── socket/         # Real-time Socket.IO chat handler
│   │   └── server.ts       # Main server bootstrap
│   └── package.json
│
├── mobile/                 # React Native / Expo Mobile Application
│   ├── src/
│   │   ├── components/     # Reusable design system (Cards, Badges, Chat bubbles, Modals)
│   │   ├── navigation/     # Root Stack, Auth Stack, Bottom Tab Navigator
│   │   ├── screens/        # 25+ Full screens (Home, Search, Matches, Chat, Profile, etc.)
│   │   ├── services/       # Axios API client & Socket.IO client
│   │   ├── store/          # Zustand state management stores
│   │   └── theme/          # Color tokens, typography, spacing, dimensions
│   ├── App.tsx             # Mobile entrypoint
│   └── package.json
│
└── admin/                  # React + Vite Admin Portal
    ├── src/
    │   ├── components/     # Admin layout with sidebar navigation
    │   ├── pages/          # Dashboard, Users, Verifications, Reports, Payments, Support, Logs
    │   ├── services/       # Admin API client
    │   ├── store/          # Admin auth state store
    │   └── App.tsx         # Admin router
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend API Server
```bash
cd server
npm install
# Seed the database with demo matrimonial profiles, mutual matches & admin
npm run seed
# Start backend server (runs on port 5000)
npm run dev
```

### 2. Start the Mobile Client
```bash
cd mobile
npm install
npm start
# Press 'w' for web preview, 'a' for Android emulator, 'i' for iOS simulator, or scan QR code on Expo Go app.
```

### 3. Start the Admin Dashboard
```bash
cd admin
npm install
npm run dev
# Open http://localhost:5173 to access the Admin Control Center
```

---

## 🔑 Preloaded Demo Accounts

| Account Role | Email / Username | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@rishta24.test` | `AdminSecure2026!` | Access to Admin Portal (metrics, verifications, bans, tickets) |
| **Demo Member** | `demo@rishta24.test` | `Password123!` | Pre-filled profile with mutual matches, incoming interests & active chat |
| **Pre-populated Profiles** | *Aarav Sharma, Ananya Iyer, Rohan Verma, Priya Patel, etc.* | `Password123!` | Realistic Indian profiles across tech, medicine, finance & business |

---

## 🛠️ Key Features Built & Tested

1. **Multi-Factor Compatibility Matching Algorithm**:
   - Weighted score across 7 vectors: Age (15%), Religion/Caste (20%), Location (15%), Education/Career (15%), Family Background (10%), Lifestyle/Diet (15%), Profile Completeness (10%).
2. **Real-Time 1-on-1 Chat via Socket.IO**:
   - Private conversation rooms, live typing indicators, image attachments, unread message badges, read receipts.
3. **VIP Premium & Razorpay Payments**:
   - 3 membership tiers (Monthly ₹1,499, Quarterly ₹3,499, Yearly ₹7,999).
   - Razorpay order generation & HMAC-SHA256 signature verification.
4. **Govt ID & Photo Verification Desk**:
   - Aadhaar/Passport document inspection with 1-click Verified Badge issuance.
5. **Safety Center, Report & Block System**:
   - 24/7 moderation queue, account suspension/bans, harassment reporting.
6. **10-Step Profile Wizard**:
   - Guided onboarding with progressive completion tracking.
7. **Complete Admin Portal**:
   - Overview metrics, user dossier viewer, moderation queue, transaction logs, support ticketing desk, and immutable audit logs.
