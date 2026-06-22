/**
 * Screen 4 – Vehicle Selection / Card
 * Types: Eco · Premium · Comfort XL
 * Each card: Battery% · Range · Vehicle Image · Price
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Vehicle } from '../utilities/types';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { MOCK_DRIVER, VEHICLES } from '../utilities/mockData';
import VehicleCard from '../components/VehicleCard';
import DriverCard from '../components/DriverCard';
import AppButton from '../components/AppButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'VehicleSelection'>;
  route: RouteProp<RootStackParamList, 'VehicleSelection'>;
};

function estimateFare(v: Vehicle, km: number) {
  return Math.round(v.baseFare + v.pricePerKm * km);
}

const VehicleSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { pickup, destination, estimatedKm } = route.params;
  const [selected, setSelected] = useState<Vehicle>(VEHICLES[0]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fare = estimateFare(selected, estimatedKm);
  const eta = Math.ceil(estimatedKm / 0.45); // rough ETA in minutes

  const handleConfirm = () => {
    setBookingLoading(true);
    // Simulate driver assignment
    setTimeout(() => {
      setBookingLoading(false);
      navigation.navigate('LiveTracking', {
        driver: MOCK_DRIVER,
        vehicle: selected,
        destination,
      });
    }, 1800);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primaryMid]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your EV</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* ── Trip summary bar ── */}
      <View style={styles.tripBar}>
        <View style={styles.tripPoint}>
          <View style={styles.tripDotGreen} />
          <Text style={styles.tripText} numberOfLines={1}>{pickup}</Text>
        </View>
        <View style={styles.tripArrow}>
          <Text style={styles.tripArrowText}>→</Text>
        </View>
        <View style={styles.tripPoint}>
          <View style={styles.tripDotRed} />
          <Text style={styles.tripText} numberOfLines={1}>{destination}</Text>
        </View>
        <View style={styles.tripDistance}>
          <Text style={styles.tripDistText}>{estimatedKm} km</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Vehicle Cards ── */}
        <Text style={styles.sectionLabel}>Available EVs near you</Text>

        {VEHICLES.map((v) => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            selected={selected.id === v.id}
            onSelect={setSelected}
            estimatedFare={estimateFare(v, estimatedKm)}
          />
        ))}

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>Your Driver</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Driver Card (preview, will be assigned) ── */}
        <View style={styles.driverSection}>
          <DriverCard
            driver={MOCK_DRIVER}
            onCall={() => Alert.alert('Calling', `Calling ${MOCK_DRIVER.name}...`)}
            onMessage={() => Alert.alert('Message', `Messaging ${MOCK_DRIVER.name}...`)}
          />
          <Text style={styles.driverNote}>
            ✅ Background checked · 4.9★ · 1,243 rides
          </Text>
        </View>

        {/* ── Fare Breakdown ── */}
        <View style={styles.fareBreakdown}>
          <Text style={styles.fareTitle}>Fare Breakdown</Text>
          <View style={styles.fareRow}>
            <Text style={styles.fareKey}>Base fare</Text>
            <Text style={styles.fareVal}>KES {selected.baseFare}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareKey}>Distance ({estimatedKm} km × KES {selected.pricePerKm})</Text>
            <Text style={styles.fareVal}>KES {Math.round(selected.pricePerKm * estimatedKm)}</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareKey}>Environmental fee</Text>
            <Text style={[styles.fareVal, { color: Colors.primary }]}>FREE 🌿</Text>
          </View>
          <View style={styles.fareTotalRow}>
            <Text style={styles.fareTotalKey}>Total</Text>
            <Text style={styles.fareTotalVal}>KES {fare.toLocaleString()}</Text>
          </View>
        </View>

        {/* ── ETA info ── */}
        <View style={styles.etaRow}>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>Pickup ETA</Text>
            <Text style={styles.etaValue}>~{Math.ceil(Math.random() * 3) + 2} min</Text>
          </View>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>Trip Duration</Text>
            <Text style={styles.etaValue}>~{eta} min</Text>
          </View>
          <View style={styles.etaItem}>
            <Text style={styles.etaLabel}>CO₂ Saved</Text>
            <Text style={[styles.etaValue, { color: Colors.primary }]}>
              {(estimatedKm * 0.192).toFixed(1)} kg
            </Text>
          </View>
        </View>

        {/* ── Confirm Button ── */}
        <AppButton
          label={`Confirm ${selected.type} – KES ${fare.toLocaleString()}`}
          onPress={handleConfirm}
          loading={bookingLoading}
          icon="⚡"
        />

        <AppButton
          label="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={{ marginTop: Spacing.sm }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.white,
  },
  tripBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    ...Shadow.card,
  },
  tripPoint: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  tripDotGreen: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary,
  },
  tripDotRed: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accentRed,
  },
  tripText: { fontSize: FontSizes.xs, color: Colors.darkGray, flex: 1 },
  tripArrow: { paddingHorizontal: Spacing.xs },
  tripArrowText: { color: Colors.midGray, fontWeight: '700' },
  tripDistance: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tripDistText: { fontSize: FontSizes.xs, color: Colors.primaryMid, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.md, paddingBottom: 80 },
  sectionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.midGray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.lightGray },
  dividerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.midGray,
    fontWeight: '600',
    marginHorizontal: Spacing.sm,
  },
  driverSection: {
    marginBottom: Spacing.md,
  },
  driverNote: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  fareBreakdown: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  fareTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  fareKey: { fontSize: FontSizes.sm, color: Colors.darkGray },
  fareVal: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.black },
  fareTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  fareTotalKey: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.black },
  fareTotalVal: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.primary },
  etaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
    justifyContent: 'space-around',
  },
  etaItem: { alignItems: 'center' },
  etaLabel: { fontSize: FontSizes.xs, color: Colors.midGray, marginBottom: 4 },
  etaValue: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.black },
});

export default VehicleSelectionScreen;
