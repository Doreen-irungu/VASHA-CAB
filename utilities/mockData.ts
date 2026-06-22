import { Driver, RideHistoryItem, UserProfile, Vehicle } from './types';

// ─────────────────────────────────────────────
//  Mock Vehicles
// ─────────────────────────────────────────────
export const VEHICLES: Vehicle[] = [
  {
    id: 'eco',
    type: 'Eco',
    name: 'Eco Ride',
    batteryPercent: 87,
    rangeKm: 320,
    pricePerKm: 28,
    baseFare: 150,
    image: null,
    description: 'Budget-friendly, excellent range. Perfect for daily commutes.',
    emoji: '🟢',
  },
  {
    id: 'premium',
    type: 'Premium',
    name: 'Premium EV',
    batteryPercent: 95,
    rangeKm: 480,
    pricePerKm: 45,
    baseFare: 250,
    image: null,
    description: 'Premium comfort, longest range. Business class experience.',
    emoji: '⚡',
  },
  {
    id: 'comfort-xl',
    type: 'Comfort XL',
    name: 'Comfort XL',
    batteryPercent: 72,
    rangeKm: 290,
    pricePerKm: 55,
    baseFare: 300,
    image: null,
    description: 'Extra space for groups. Full battery, ultra-smooth ride.',
    emoji: '🔋',
  },
];

// ─────────────────────────────────────────────
//  Mock Drivers
// ─────────────────────────────────────────────
export const MOCK_DRIVER: Driver = {
  id: 'd1',
  name: 'James Mwangi',
  photo: null,
  rating: 4.9,
  totalRides: 1_243,
  plateNumber: 'KDJ 421T',
  vehicleName: 'Tesla Model 3',
  vehicleColor: 'Pearl White',
  phone: '+254712345678',
};

// ─────────────────────────────────────────────
//  Mock Ride History
// ─────────────────────────────────────────────
export const MOCK_HISTORY: RideHistoryItem[] = [
  {
    id: 'r1',
    date: 'Dec 12, 2024',
    from: 'Westlands, Nairobi',
    to: 'JKIA Airport',
    price: 1_850,
    distanceKm: 22.4,
    durationMin: 38,
    co2SavedKg: 4.2,
    driverName: 'James Mwangi',
    driverRating: 5.0,
    vehicleType: 'Premium',
    status: 'completed',
  },
  {
    id: 'r2',
    date: 'Dec 10, 2024',
    from: 'Kilimani',
    to: 'CBD Nairobi',
    price: 620,
    distanceKm: 6.1,
    durationMin: 18,
    co2SavedKg: 1.1,
    driverName: 'Faith Njeri',
    driverRating: 4.8,
    vehicleType: 'Eco',
    status: 'completed',
  },
  {
    id: 'r3',
    date: 'Dec 8, 2024',
    from: 'Karen',
    to: 'Upperhill',
    price: 1_100,
    distanceKm: 14.3,
    durationMin: 27,
    co2SavedKg: 2.7,
    driverName: 'Brian Otieno',
    driverRating: 4.7,
    vehicleType: 'Comfort XL',
    status: 'completed',
  },
  {
    id: 'r4',
    date: 'Dec 5, 2024',
    from: 'Lavington',
    to: 'Two Rivers Mall',
    price: 880,
    distanceKm: 9.8,
    durationMin: 22,
    co2SavedKg: 1.8,
    driverName: 'Alice Wanjiku',
    driverRating: 4.9,
    vehicleType: 'Eco',
    status: 'completed',
  },
  {
    id: 'r5',
    date: 'Dec 3, 2024',
    from: 'Parklands',
    to: 'Gigiri',
    price: 1_250,
    distanceKm: 12.0,
    durationMin: 24,
    co2SavedKg: 2.3,
    driverName: 'John Kamau',
    driverRating: 4.6,
    vehicleType: 'Premium',
    status: 'cancelled',
  },
];

// ─────────────────────────────────────────────
//  Mock User Profile
// ─────────────────────────────────────────────
export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Doreen Wanjiku',
  email: 'doreen@vashacab.com',
  phone: '+254 700 123 456',
  photo: null,
  totalRides: 45,
  rating: 4.9,
  co2SavedKg: 187.5,
  treesEquivalent: 12,
  joinDate: 'March 2024',
  paymentMethods: [
    { id: 'pm1', type: 'mpesa', label: 'M-Pesa · +254 700 123 456', isDefault: true },
    { id: 'pm2', type: 'card', label: 'Visa · · · 4242', isDefault: false },
  ],
};
