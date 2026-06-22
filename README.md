# ⚡ Vasha Cab
### Premium Electric Vehicle Ride-Sharing App

> *Zero Emissions · Pure Luxury · Built with React Native & Expo*

---

## 📱 Overview

Vasha Cab is a modern, Uber-style ride-sharing mobile app built exclusively for **electric vehicles**. Every ride is zero-emission, transparently priced, and environmentally tracked. The app is currently a **fully functional frontend prototype** — all screens, navigation, animations, and UI are complete and ready for backend integration.

---

## 🎨 Screenshots & Screens

| Screen | Description |
|---|---|
| **1. Splash Screen** | Animated ⚡ logo, app name, loading dots — auto navigates after 3s |
| **2. Authentication** | Login, Register, Forgot Password with full form validation |
| **3. Home** | Pickup/destination inputs, map, vehicle cards, fare estimate, CO₂ saved |
| **4. Vehicle Selection** | Eco / Premium / Comfort XL cards with battery, range, price breakdown |
| **5. Live Tracking** | Animated driver marker, ETA countdown, SOS button, share ride |
| **6. Ride History** | Past trips with price, distance, duration, CO₂ saved, receipt modal |
| **7. Profile** | Photo, name, payment methods, achievements, settings, environmental impact |

---

## 🗂️ Project Structure

```
VashaCab/
├── App.tsx                          ← App entry point
├── app.json                         ← Expo configuration
├── package.json                     ← Dependencies
├── tsconfig.json                    ← TypeScript config
├── babel.config.js                  ← Babel config
│
└── src/
    ├── screens/
    │   ├── SplashScreen.tsx         ← Screen 1
    │   ├── AuthScreen.tsx           ← Screen 2
    │   ├── HomeScreen.tsx           ← Screen 3
    │   ├── VehicleSelectionScreen.tsx ← Screen 4
    │   ├── LiveTrackingScreen.tsx   ← Screen 5
    │   ├── RideHistoryScreen.tsx    ← Screen 6
    │   └── ProfileScreen.tsx        ← Screen 7
    │
    ├── navigation/
    │   ├── RootNavigator.tsx        ← Stack navigator (all screens)
    │   └── BottomTabNavigator.tsx   ← Bottom tab (Home, History, Profile)
    │
    ├── components/
    │   ├── VehicleCard.tsx          ← Reusable: name, battery%, range, price
    │   ├── DriverCard.tsx           ← Reusable: photo, name, rating, plate number
    │   ├── AppButton.tsx            ← Reusable: primary, outline, ghost, danger
    │   └── AppInput.tsx             ← Reusable: text input with validation
    │
    └── utilities/
        ├── theme.ts                 ← Colors, fonts, spacing, shadows
        ├── types.ts                 ← TypeScript interfaces & nav param lists
        └── mockData.ts              ← Fake data (vehicles, driver, history, user)
```

---

## 🚀 Technology Stack

| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile development (iOS & Android) |
| **Expo SDK 51** | Streamlined build, preview and deployment |
| **TypeScript** | Type safety across all components |
| **React Navigation v6** | Stack + Bottom Tab navigation |
| **Expo Linear Gradient** | Gradient backgrounds and UI elements |
| **Expo Vector Icons** | Icon library |
| **React Native Maps** | Map integration (ready for Google Maps API) |
| **React Native Safe Area** | Safe area handling for all devices |

---

## 🧩 Reusable Components

### `VehicleCard`
Displays an EV vehicle option with:
- Vehicle type (Eco / Premium / Comfort XL)
- Battery percentage with colour-coded bar (green/yellow/red)
- Range in km
- Price per km + base fare
- Estimated fare for current trip
- Selected state with green border highlight

### `DriverCard`
Displays an assigned driver with:
- Avatar / initials placeholder
- Name, star rating, total rides
- License plate number
- Call and message action buttons
- Online status dot

### `AppButton`
Four variants:
- `primary` — green gradient, main actions
- `outline` — transparent with green border
- `ghost` — text only
- `danger` — red, destructive actions

### `AppInput`
Text input with:
- Label, placeholder, left icon
- Inline error messages
- Password show/hide toggle
- Focus highlight state

---

## 🎨 Design System

### Colour Palette
| Name | Hex | Usage |
|---|---|---|
| Primary | `#1DB954` | Buttons, accents, active states |
| Primary Dark | `#0D3B2E` | Splash background, headers |
| Primary Mid | `#145A38` | Gradient midpoint |
| Accent | `#00E676` | Electric green highlights |
| Accent Red | `#FF3B30` | SOS button, alerts |
| Accent Yellow | `#FFD600` | Battery warning indicator |
| White | `#FFFFFF` | Cards, backgrounds |
| Off White | `#F7FAF8` | Screen backgrounds |

### Typography
- Font sizes from `xs (11)` to `hero (38)`
- All weights from regular to black (900)
- Letter spacing applied to labels and titles

---

## 📲 User Journey

```
Open App
    ↓
Splash Screen (3 seconds, animated)
    ↓
Authentication (Login / Register / Forgot Password)
    ↓
Home Screen (Enter pickup + destination)
    ↓
Vehicle Selection (Choose Eco / Premium / Comfort XL)
    ↓
Live Tracking (Watch driver arrive in real time)
    ↓
Ride Complete → Rate Driver
    ↓
Ride History (View past trips + CO₂ impact)
    ↓
Profile (Stats, achievements, settings)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed → [nodejs.org](https://nodejs.org)
- Expo Go app on your phone → available on Play Store / App Store

### Installation

**1. Navigate to the project folder:**
```bash
cd C:\Users\BEST\Desktop\doreen\VashaCab
```

**2. Install dependencies:**
```bash
npm install --legacy-peer-deps
```

**3. Start the development server:**
```bash
npx expo start
```

**4. Scan the QR code** with Expo Go on your phone.

> ⚠️ Your phone and computer must be on the same WiFi network.

---

## 🌍 Deployment Options

### Option 1 — Expo Share Link (phone preview)
```bash
npx expo login
npx expo publish
```
Generates a shareable `exp.host/@yourname/vasha-cab` link.

### Option 2 — Web App (browser link)
```bash
npx expo export --platform web
```
Upload the `dist` folder to [vercel.com](https://vercel.com) for a free live URL.

### Option 3 — Android APK (install on phone)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Option 4 — Google Play Store (public launch)
```bash
eas build --platform android --profile production
eas submit --platform android
```
Requires a one-time $25 Google Play developer fee.

---

## 🔌 Backend Integration (Phase 2)

The app is frontend-only. All data is currently mocked. To make it fully functional, the following backend services need to be connected:

| Feature | Technology Needed |
|---|---|
| User authentication | Node.js + JWT + PostgreSQL |
| Real-time driver tracking | Socket.io + GPS |
| Maps & routing | Google Maps API |
| Driver matching algorithm | Node.js + PostGIS |
| Payment processing | M-Pesa Daraja API / Stripe |
| Push notifications | Expo Notifications + Firebase |
| Ride history storage | PostgreSQL database |

---

## 🚗 Vehicle Types

| Type | Emoji | Base Fare | Per km | Range | Best For |
|---|---|---|---|---|---|
| Eco | 🟢 | KES 150 | KES 28 | 320 km | Daily commutes |
| Premium | ⚡ | KES 250 | KES 45 | 480 km | Business travel |
| Comfort XL | 🔋 | KES 300 | KES 55 | 290 km | Groups, luggage |

---

## 🏆 Achievements System

| Achievement | Requirement | Status |
|---|---|---|
| 🌱 First Green Ride | Take your first EV ride | Unlocked |
| 🌿 Eco Warrior | Complete 10 rides | Unlocked |
| 🌳 Tree Planter | Save 50 kg CO₂ | Unlocked |
| ⚡ Speed Saver | 25 rides in one month | Unlocked |
| 🏆 Champion Rider | 100 total rides | Locked |
| 🌍 Climate Hero | Save 500 kg CO₂ | Locked |

---

## 🔒 Safety Features

- **SOS Button** — visible on live tracking screen, triggers emergency alert
- **Share Ride** — send live trip link to friends or family
- **Driver Verification** — plate number and photo shown before every ride
- **Rating System** — passengers rate drivers after every trip

---

## 📊 Mock Data

All data is defined in `src/utilities/mockData.ts`:

- **3 vehicles** — Eco, Premium, Comfort XL with realistic specs
- **1 mock driver** — James Mwangi, 4.9★, 1,243 rides, Tesla Model 3
- **5 ride history entries** — completed and cancelled trips
- **1 user profile** — Doreen Wanjiku, 45 rides, 187.5 kg CO₂ saved

---

## 📄 License

MIT License — free to use and modify.

---

## 👤 Author

Built by **Doreen Wanjiku**
- App: Vasha Cab
- Email: doreen@vashacab.com
- Version: 1.0.0

---

## 🌿 Vision

*"Vasha Cab is building the future of sustainable urban mobility — one electric ride at a time."*

**Every ride saves the planet. ⚡🌍**
