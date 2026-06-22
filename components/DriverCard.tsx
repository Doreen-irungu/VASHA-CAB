import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { Driver } from '../utilities/types';

interface DriverCardProps {
  driver: Driver;
  onCall?: () => void;
  onMessage?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({
  driver,
  onCall,
  onMessage,
  style,
  compact = false,
}) => {
  // Render star rating dots
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={{ color: i < full ? '#FFD600' : Colors.lightGray, fontSize: 12 }}>
          ★
        </Text>,
      );
    }
    return stars;
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact, style]}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {driver.photo ? (
          <Image source={typeof driver.photo === 'string' ? { uri: driver.photo } : driver.photo} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {driver.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {/* Online dot */}
        <View style={styles.onlineDot} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.driverName}>{driver.name}</Text>

        <View style={styles.starsRow}>
          {renderStars(driver.rating)}
          <Text style={styles.ratingText}> {driver.rating.toFixed(1)}</Text>
          {!compact && (
            <Text style={styles.ridesText}> · {driver.totalRides.toLocaleString()} rides</Text>
          )}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>🚗 {driver.plateNumber}</Text>
          </View>
          {!compact && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>⚡ {driver.vehicleName}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action buttons */}
      {(onCall || onMessage) && (
        <View style={styles.actions}>
          {onMessage && (
            <TouchableOpacity style={styles.actionBtn} onPress={onMessage}>
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>
          )}
          {onCall && (
            <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={onCall}>
              <Text style={styles.actionIcon}>📞</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.card,
  },
  cardCompact: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGray,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontSize: FontSizes.xl,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  info: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.darkGray,
    fontWeight: '700',
  },
  ridesText: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: FontSizes.xs,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    backgroundColor: Colors.primaryLight,
  },
  actionIcon: {
    fontSize: 17,
  },
});

export default DriverCard;
