/**
 * Screen 3 – Home Screen
 * Components: Pickup Input · Destination Input · Map · Book Button
 *             Vehicle Cards · Fare Estimation · CO₂ Saved
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList, Vehicle } from '../utilities/types';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { MOCK_USER, VEHICLES } from '../utilities/mockData';
import VehicleCard from '../components/VehicleCard';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

const { width } = Dimensions.get('window');

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Helper: estimate fare
function estimateFare(vehicle: Vehicle, km: number): number {
  return Math.round(vehicle.baseFare + vehicle.pricePerKm * km);
}

// Helper: estimate CO2 saved
function co2Saved(km: number): number {
  // avg petrol car emits ~192 g CO2/km, EV ~0g
  return parseFloat((km * 0.192).toFixed(1));
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(VEHICLES[0]);
  const [showVehicles, setShowVehicles] = useState(false);

  // Simulated distance (would come from Maps API in prod)
  const estimatedKm = 12.5;
  const fare = estimateFare(selectedVehicle, estimatedKm);
  const savedCO2 = co2Saved(estimatedKm);

  const mapAnim = useRef(new Animated.Value(0)).current;
  const vehiclesAnim = useRef(new Animated.Value(0)).current;

  const handleBook = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert('Missing Info', 'Please enter both pickup and destination locations.');
      return;
    }
    navigation.navigate('VehicleSelection', {
      pickup,
      destination,
      estimatedKm,
    });
  };

  const toggleVehicles = () => {
    setShowVehicles(!showVehicles);
    Animated.spring(vehiclesAnim, {
      toValue: showVehicles ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Top Header ── */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primaryMid]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.userName}>{MOCK_USER.name.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* CO₂ savings banner */}
        <View style={styles.co2Banner}>
          <Text style={styles.co2BannerText}>
            🌿 You've saved{' '}
            <Text style={styles.co2BannerValue}>{MOCK_USER.co2SavedKg} kg</Text> CO₂ this year!
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Booking Card ── */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>📍 Book a Ride</Text>

          {/* Pickup */}
          <AppInput
            label="Pickup Location"
            placeholder="Where are you?"
            value={pickup}
            onChangeText={setPickup}
            leftIcon="🟢"
          />

          {/* Vertical connector dot */}
          <View style={styles.connector}>
            <View style={styles.connectorLine} />
            <TouchableOpacity style={styles.swapBtn} onPress={() => {
              const tmp = pickup;
              setPickup(destination);
              setDestination(tmp);
            }}>
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* Destination */}
          <AppInput
            label="Destination"
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
            leftIcon="🔴"
          />
        </View>

        {/* ── Map Placeholder ── */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#1a4a34', '#0f3522']}
            style={styles.mapGradient}
          >
            {/* Simulated map grid */}
            <View style={styles.mapGrid}>
              {Array(5).fill(null).map((_, r) =>
                Array(5).fill(null).map((__, c) => (
                  <View key={`${r}-${c}`} style={styles.mapCell} />
                ))
              )}
            </View>
            <View style={styles.mapCenter}>
              <Text style={styles.mapIcon}>🗺️</Text>
              <Text style={styles.mapLabel}>Live Map</Text>
              <Text style={styles.mapSubLabel}>Google Maps integration ready</Text>
            </View>
            {/* Route line */}
            <View style={styles.mapRouteLine} />
            {/* Pickup pin */}
            <View style={[styles.mapPin, styles.mapPinGreen]}>
              <Text style={styles.mapPinText}>A</Text>
            </View>
            {/* Dest pin */}
            <View style={[styles.mapPin, styles.mapPinRed, { right: 60, top: 50 }]}>
              <Text style={styles.mapPinText}>B</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Fare & CO₂ Estimation ── */}
        <View style={styles.estimateRow}>
          <View style={styles.estimateCard}>
            <Text style={styles.estimateLabel}>Estimated Fare</Text>
            <Text style={styles.estimateValue}>KES {fare.toLocaleString()}</Text>
            <Text style={styles.estimateKm}>{estimatedKm} km</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.estimateCard}>
            <Text style={styles.estimateLabel}>CO₂ Saved</Text>
            <Text style={[styles.estimateValue, { color: Colors.primary }]}>
              {savedCO2} kg
            </Text>
            <Text style={styles.estimateKm}>vs petrol car 🌿</Text>
          </View>
        </View>

        {/* ── Vehicle Cards ── */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={toggleVehicles}>
            <Text style={styles.sectionTitle}>🚗 Choose Your Ride</Text>
            <Text style={styles.sectionToggle}>{showVehicles ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {/* Always show selected vehicle card */}
          <VehicleCard
            vehicle={selectedVehicle}
            selected
            onSelect={setSelectedVehicle}
            estimatedFare={fare}
          />

          {showVehicles && VEHICLES.filter(v => v.id !== selectedVehicle.id).map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              selected={false}
              onSelect={(veh) => {
                setSelectedVehicle(veh);
                setShowVehicles(false);
              }}
              estimatedFare={estimateFare(v, estimatedKm)}
            />
          ))}

          {!showVehicles && (
            <TouchableOpacity style={styles.changeRideBtn} onPress={toggleVehicles}>
              <Text style={styles.changeRideText}>Change vehicle type ▼</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Book Button ── */}
        <AppButton
          label={`Book ${selectedVehicle.type} – KES ${fare.toLocaleString()}`}
          onPress={handleBook}
          icon="⚡"
          style={styles.bookBtn}
        />

        {/* Footer promo */}
        <View style={styles.promoRow}>
          <Text style={styles.promoText}>🌍 No surge pricing · 3-5 min pickup · Zero emissions</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.65)',
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: { fontSize: 22 },
  co2Banner: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  co2BannerText: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  co2BannerValue: {
    color: Colors.accent,
    fontWeight: '800',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 28,
    marginBottom: -4,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.lightGray,
    marginLeft: 9,
  },
  swapBtn: {
    marginLeft: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIcon: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  mapContainer: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    height: 180,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  mapGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGrid: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  mapCell: {
    width: width / 5,
    height: 36,
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },
  mapCenter: { alignItems: 'center', zIndex: 2 },
  mapIcon: { fontSize: 36, marginBottom: 4 },
  mapLabel: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.white,
  },
  mapSubLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  mapRouteLine: {
    position: 'absolute',
    width: '55%',
    height: 2,
    backgroundColor: Colors.accent,
    opacity: 0.7,
    transform: [{ rotate: '20deg' }],
  },
  mapPin: {
    position: 'absolute',
    left: 60,
    bottom: 40,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  mapPinGreen: { backgroundColor: Colors.primary },
  mapPinRed: { backgroundColor: Colors.accentRed },
  mapPinText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '800',
  },
  estimateRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
  },
  estimateCard: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.lightGray,
  },
  estimateLabel: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  estimateValue: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.black,
  },
  estimateKm: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
  },
  sectionToggle: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '700',
  },
  changeRideBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  changeRideText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  bookBtn: {
    marginBottom: Spacing.sm,
  },
  promoRow: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  promoText: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
  },
});

export default HomeScreen;
