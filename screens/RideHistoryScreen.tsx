/**
 * Screen 6 – Ride History
 * Components: Past Trips · Price · Distance · Duration · CO₂ Saved
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { MOCK_HISTORY, MOCK_USER } from '../utilities/mockData';
import { RideHistoryItem } from '../utilities/types';

const VEHICLE_EMOJI: Record<string, string> = {
  Eco: '🟢',
  Premium: '⚡',
  'Comfort XL': '🔋',
};

const RideHistoryScreen: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<RideHistoryItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filtered = filter === 'all' ? MOCK_HISTORY : MOCK_HISTORY.filter(r => r.status === filter);

  const totalCO2 = MOCK_HISTORY.reduce((sum, r) => sum + r.co2SavedKg, 0);
  const totalKES = MOCK_HISTORY.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.price, 0);
  const totalKm = MOCK_HISTORY.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.distanceKm, 0);

  const renderRideCard = ({ item }: { item: RideHistoryItem }) => (
    <TouchableOpacity
      style={[styles.rideCard, item.status === 'cancelled' && styles.rideCardCancelled]}
      onPress={() => setSelectedRide(item)}
      activeOpacity={0.85}
    >
      {/* Row 1: date + status */}
      <View style={styles.cardTopRow}>
        <Text style={styles.rideDate}>{item.date}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' ? styles.statusCompleted : styles.statusCancelled,
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? '✓ Completed' : '✕ Cancelled'}
          </Text>
        </View>
      </View>

      {/* Row 2: route */}
      <View style={styles.routeRow}>
        <View style={styles.routePoint}>
          <View style={styles.dotGreen} />
          <Text style={styles.routeText} numberOfLines={1}>{item.from}</Text>
        </View>
        <View style={styles.routeArrow}>
          <View style={styles.routeDashedLine} />
          <Text style={styles.routeArrowIcon}>→</Text>
        </View>
        <View style={styles.routePoint}>
          <View style={styles.dotRed} />
          <Text style={styles.routeText} numberOfLines={1}>{item.to}</Text>
        </View>
      </View>

      {/* Row 3: stats */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statChipLabel}>💰</Text>
          <Text style={styles.statChipValue}>KES {item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statChipLabel}>📍</Text>
          <Text style={styles.statChipValue}>{item.distanceKm} km</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statChipLabel}>⏱</Text>
          <Text style={styles.statChipValue}>{item.durationMin} min</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statChipLabel}>🌿</Text>
          <Text style={[styles.statChipValue, { color: Colors.primary }]}>{item.co2SavedKg} kg</Text>
        </View>
      </View>

      {/* Row 4: driver + vehicle type */}
      <View style={styles.cardBottomRow}>
        <Text style={styles.driverLabel}>
          {VEHICLE_EMOJI[item.vehicleType]} {item.vehicleType}
        </Text>
        <Text style={styles.driverName}>👤 {item.driverName} · {'★'.repeat(Math.round(item.driverRating))}</Text>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Ride History</Text>
        <Text style={styles.headerSub}>{MOCK_HISTORY.length} trips · All time</Text>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>KES {totalKES.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Spent</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalKm.toFixed(1)} km</Text>
            <Text style={styles.summaryLabel}>Total Distance</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardGreen]}>
            <Text style={[styles.summaryValue, { color: Colors.accent }]}>{totalCO2.toFixed(1)} kg</Text>
            <Text style={styles.summaryLabel}>CO₂ Saved 🌿</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Filter Tabs ── */}
      <View style={styles.filterRow}>
        {(['all', 'completed', 'cancelled'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f === 'completed' ? '✓ Completed' : '✕ Cancelled'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderRideCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🚗</Text>
            <Text style={styles.emptyText}>No rides found</Text>
          </View>
        }
      />

      {/* ── Ride Detail Modal ── */}
      <Modal
        visible={!!selectedRide}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedRide(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedRide(null)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            {selectedRide && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Trip Details</Text>

                {/* Route */}
                <View style={styles.modalSection}>
                  <View style={styles.modalRouteRow}>
                    <View style={styles.dotGreen} />
                    <Text style={styles.modalRouteText}>{selectedRide.from}</Text>
                  </View>
                  <View style={styles.modalRouteLine} />
                  <View style={styles.modalRouteRow}>
                    <View style={styles.dotRed} />
                    <Text style={styles.modalRouteText}>{selectedRide.to}</Text>
                  </View>
                </View>

                {/* Details grid */}
                <View style={styles.detailGrid}>
                  {[
                    { label: 'Date', value: selectedRide.date },
                    { label: 'Vehicle', value: `${VEHICLE_EMOJI[selectedRide.vehicleType]} ${selectedRide.vehicleType}` },
                    { label: 'Driver', value: selectedRide.driverName },
                    { label: 'Rating', value: `${'★'.repeat(Math.round(selectedRide.driverRating))} ${selectedRide.driverRating}` },
                    { label: 'Distance', value: `${selectedRide.distanceKm} km` },
                    { label: 'Duration', value: `${selectedRide.durationMin} min` },
                    { label: 'CO₂ Saved', value: `${selectedRide.co2SavedKg} kg 🌿`, highlight: true },
                    { label: 'Status', value: selectedRide.status === 'completed' ? '✓ Completed' : '✕ Cancelled' },
                  ].map(({ label, value, highlight }) => (
                    <View key={label} style={styles.detailItem}>
                      <Text style={styles.detailLabel}>{label}</Text>
                      <Text style={[styles.detailValue, highlight && { color: Colors.primary }]}>{value}</Text>
                    </View>
                  ))}
                </View>

                {/* Fare breakdown */}
                <View style={styles.fareCard}>
                  <Text style={styles.fareTitle}>Fare Breakdown</Text>
                  <View style={styles.fareRow}>
                    <Text style={styles.fareKey}>Base fare</Text>
                    <Text style={styles.fareVal}>KES 150</Text>
                  </View>
                  <View style={styles.fareRow}>
                    <Text style={styles.fareKey}>Distance ({selectedRide.distanceKm} km)</Text>
                    <Text style={styles.fareVal}>KES {Math.round(selectedRide.price - 150)}</Text>
                  </View>
                  <View style={styles.fareTotalRow}>
                    <Text style={styles.fareTotalKey}>Total</Text>
                    <Text style={styles.fareTotalVal}>KES {selectedRide.price.toLocaleString()}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedRide(null)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.white,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.md,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  summaryCardGreen: {
    backgroundColor: 'rgba(0,230,118,0.18)',
  },
  summaryValue: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.white,
  },
  summaryLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    gap: Spacing.xs,
    ...Shadow.card,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.darkGray },
  filterTextActive: { color: Colors.white },
  listContent: { padding: Spacing.md, paddingBottom: 80 },
  rideCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  rideCardCancelled: { opacity: 0.7 },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rideDate: { fontSize: FontSizes.sm, color: Colors.midGray, fontWeight: '600' },
  statusBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusCompleted: { backgroundColor: Colors.primaryLight },
  statusCancelled: { backgroundColor: '#FFE0E0' },
  statusText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.darkGray },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  routePoint: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, flexShrink: 0 },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accentRed, flexShrink: 0 },
  routeText: { fontSize: FontSizes.sm, color: Colors.darkGray, flex: 1 },
  routeArrow: { alignItems: 'center', paddingHorizontal: 4 },
  routeDashedLine: {
    width: 16,
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  routeArrowIcon: { fontSize: FontSizes.xs, color: Colors.midGray },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  statChipLabel: { fontSize: 12 },
  statChipValue: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.darkGray },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.xs,
  },
  driverLabel: { fontSize: FontSizes.xs, color: Colors.midGray },
  driverName: { fontSize: FontSizes.xs, color: Colors.midGray },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: FontSizes.md, color: Colors.midGray },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  modalSection: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  modalRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  modalRouteLine: { width: 2, height: 20, backgroundColor: Colors.lightGray, marginLeft: 5 },
  modalRouteText: { fontSize: FontSizes.sm, color: Colors.darkGray, flex: 1 },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  detailItem: {
    width: '48%',
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  detailLabel: { fontSize: FontSizes.xs, color: Colors.midGray, marginBottom: 2 },
  detailValue: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.black },
  fareCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  fareTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.black, marginBottom: Spacing.sm },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  fareKey: { fontSize: FontSizes.sm, color: Colors.darkGray },
  fareVal: { fontSize: FontSizes.sm, fontWeight: '600' },
  fareTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  fareTotalKey: { fontSize: FontSizes.md, fontWeight: '700' },
  fareTotalVal: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.primary },
  closeBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  closeBtnText: { color: Colors.primaryMid, fontWeight: '700', fontSize: FontSizes.md },
});

export default RideHistoryScreen;
