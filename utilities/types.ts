// ─────────────────────────────────────────────
//  Vasha Cab – Shared Types
// ─────────────────────────────────────────────

export type VehicleType = 'Eco' | 'Premium' | 'Comfort XL';

export interface Vehicle {
  id: string;
  type: VehicleType;
  name: string;
  batteryPercent: number;   // 0-100
  rangeKm: number;
  pricePerKm: number;       // KES
  baseFare: number;         // KES
  image: any;               // require() asset
  description: string;
  emoji: string;
}

export interface Driver {
  id: string;
  name: string;
  photo: any;               // require() asset or uri string
  rating: number;           // e.g. 4.9
  totalRides: number;
  plateNumber: string;
  vehicleName: string;
  vehicleColor: string;
  phone: string;
}

export interface RideHistoryItem {
  id: string;
  date: string;             // display string e.g. "Dec 12, 2024"
  from: string;
  to: string;
  price: number;            // KES
  distanceKm: number;
  durationMin: number;
  co2SavedKg: number;
  driverName: string;
  driverRating: number;
  vehicleType: VehicleType;
  status: 'completed' | 'cancelled';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: any;
  totalRides: number;
  rating: number;
  co2SavedKg: number;
  treesEquivalent: number;
  paymentMethods: PaymentMethod[];
  joinDate: string;
}

export interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card' | 'cash';
  label: string;
  isDefault: boolean;
}

// ── Navigation param lists ──────────────────
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  VehicleSelection: { pickup: string; destination: string; estimatedKm: number };
  LiveTracking: { driver: Driver; vehicle: Vehicle; destination: string };
  RideComplete: { ride: RideHistoryItem };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};
