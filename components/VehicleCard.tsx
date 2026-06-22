import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { Vehicle } from '../utilities/types';

interface VehicleCardProps {
  vehicle: Vehicle;
  selected?: boolean;
  onSelect?: (vehicle: Vehicle) => void;
  estimatedFare?: number;  // KES
  style?: ViewStyle;
}

// Battery bar colour logic
function batteryColor(pct: number): string {
  if (pct >= 60) return Colors.success;
  if (pct >= 30) return Colors.warning;
  return Colors.danger;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  selected = false,
  onSelect,
  estimatedFare,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect?.(vehicle)}
      style={[
        styles.card,
        selected && styles.cardSelected,
        style,
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>{vehicle.emoji}</Text>
          <View>
            <Text style={styles.vehicleType}>{vehicle.type}</Text>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
          </View>
        </View>

        {/* Price badge */}
        <View style={[styles.priceBadge, selected && styles.priceBadgeSelected]}>
          <Text style={[styles.priceText, selected && styles.priceTextSelected]}>
            KES {vehicle.baseFare}+
          </Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {/* Battery */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Battery</Text>
          <View style={styles.batteryWrapper}>
            <View style={styles.batteryOuter}>
              <View
                style={[
                  styles.batteryInner,
                  {
                    width: `${vehicle.batteryPercent}%` as any,
                    backgroundColor: batteryColor(vehicle.batteryPercent),
                  },
                ]}
              />
            </View>
            <Text style={[styles.statValue, { color: batteryColor(vehicle.batteryPercent) }]}>
              {vehicle.batteryPercent}%
            </Text>
          </View>
        </View>

        {/* Range */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Range</Text>
          <Text style={styles.statValue}>{vehicle.rangeKm} km</Text>
        </View>

        {/* Rate */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Per km</Text>
          <Text style={styles.statValue}>KES {vehicle.pricePerKm}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{vehicle.description}</Text>

      {/* Estimated fare */}
      {estimatedFare !== undefined && (
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Estimated Fare</Text>
          <Text style={styles.fareValue}>KES {estimatedFare.toLocaleString()}</Text>
        </View>
      )}

      {/* Selected indicator */}
      {selected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓ Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.card,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FBF5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emoji: {
    fontSize: 28,
    marginRight: Spacing.xs,
  },
  vehicleType: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.black,
  },
  vehicleName: {
    fontSize: FontSizes.sm,
    color: Colors.midGray,
    marginTop: 2,
  },
  priceBadge: {
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  priceBadgeSelected: {
    backgroundColor: Colors.primary,
  },
  priceText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.darkGray,
  },
  priceTextSelected: {
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.black,
  },
  batteryWrapper: {
    alignItems: 'center',
  },
  batteryOuter: {
    width: 52,
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 3,
  },
  batteryInner: {
    height: '100%',
    borderRadius: Radius.full,
  },
  description: {
    fontSize: FontSizes.sm,
    color: Colors.darkGray,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  fareLabel: {
    fontSize: FontSizes.sm,
    color: Colors.midGray,
  },
  fareValue: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.primary,
  },
  selectedBadge: {
    marginTop: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  selectedBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
});

export default VehicleCard;
