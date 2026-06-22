/**
 * Screen 5 – Live Tracking
 * Components: Google Map · Driver Marker · Driver Info · ETA
 *             SOS Button · Share Ride
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  Platform,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../utilities/types';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import DriverCard from '../components/DriverCard';
import AppButton from '../components/AppButton';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LiveTracking'>;
  route: RouteProp<RootStackParamList, 'LiveTracking'>;
};

const LiveTrackingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { driver, vehicle, destination } = route.params;

  const [etaSeconds, setEtaSeconds] = useState(312); // ~5 min
  const [phase, setPhase] = useState<'pickup' | 'onRoute' | 'arrived'>('pickup');
  const [expanded, setExpanded] = useState(false);

  // Pulsing driver dot animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Driver position animation
  const driverX = useRef(new Animated.Value(width * 0.35)).current;
  const driverY = useRef(new Animated.Value(height * 0.38)).current;

  // Progress bar animation
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ).start();

    // Driver moves toward pickup
    Animated.timing(driverX, {
      toValue: width * 0.5,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // ETA countdown
    const interval = setInterval(() => {
      setEtaSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase('onRoute');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 312_000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, []);

  // Phase advances
  useEffect(() => {
    if (phase === 'onRoute') {
      setTimeout(() => setPhase('arrived'), 12_000);
    }
    if (phase === 'arrived') {
      Alert.alert(
        '🎉 You\'ve Arrived!',
        `Welcome to ${destination}. Please rate your driver.`,
        [{ text: 'Rate Ride', onPress: () => navigation.popToTop() }],
      );
    }
  }, [phase]);

  const etaMin = Math.floor(etaSeconds / 60);
  const etaSec = etaSeconds % 60;

  const handleSOS = () => {
    Alert.alert(
      '🚨 SOS Emergency',
      'This will alert local emergency services and share your live location. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'CALL NOW', style: 'destructive', onPress: () => Alert.alert('Calling emergency services...') },
      ],
    );
  };

  const handleShare = () => {
    Alert.alert('Share Ride', 'Live ride link copied! Share with friends or family to track your ride.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ── Simulated Map ── */}
      <LinearGradient
        colors={['#1a4a34', '#0f3522', '#082b1a']}
        style={styles.mapArea}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Grid overlay */}
        <View style={styles.mapGrid}>
          {Array(8).fill(null).map((_, r) =>
            Array(6).fill(null).map((__, c) => (
              <View key={`${r}-${c}`} style={styles.mapCell} />
            ))
          )}
        </View>

        {/* "Roads" */}
        <View style={[styles.road, { top: '35%', width: '100%', left: 0 }]} />
        <View style={[styles.road, { top: '60%', width: '100%', left: 0 }]} />
        <View style={[styles.road, { left: '30%', height: '100%', top: 0, width: 3 }]} />
        <View style={[styles.road, { left: '65%', height: '100%', top: 0, width: 3 }]} />

        {/* Route line */}
        <View style={styles.routeLine} />

        {/* Destination Pin */}
        <View style={styles.destPin}>
          <Text style={styles.destPinIcon}>📍</Text>
          <Text style={styles.destLabel}>{destination}</Text>
        </View>

        {/* Your location pin */}
        <View style={styles.yourPin}>
          <Text style={styles.yourPinText}>You</Text>
          <View style={styles.yourPinDot} />
        </View>

        {/* Driver animated marker */}
        <Animated.View style={[styles.driverMarker, { left: driverX, top: driverY }]}>
          {/* Pulse ring */}
          <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
          <View style={styles.driverDot}>
            <Text style={styles.driverDotIcon}>⚡</Text>
          </View>
          <Text style={styles.driverMarkerLabel}>{driver.name.split(' ')[0]}</Text>
        </Animated.View>

        {/* Top bar */}
        <View style={styles.mapTopBar}>
          <TouchableOpacity style={styles.mapBackBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.mapBackIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.phasePill}>
            <Text style={styles.phaseText}>
              {phase === 'pickup' ? '🚗 Driver on the way' : phase === 'onRoute' ? '🛣️ En route' : '✅ Arrived'}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        {/* Battery & Energy overlay */}
        <View style={styles.vehicleOverlay}>
          <Text style={styles.vehicleOverlayText}>⚡ {vehicle.batteryPercent}% · {vehicle.rangeKm} km range</Text>
        </View>
      </LinearGradient>

      {/* ── Bottom Sheet ── */}
      <View style={[styles.bottomSheet, expanded && styles.bottomSheetExpanded]}>
        {/* Handle */}
        <TouchableOpacity style={styles.handle} onPress={() => setExpanded(!expanded)}>
          <View style={styles.handleBar} />
        </TouchableOpacity>

        {/* ETA Row */}
        <View style={styles.etaRow}>
          <View style={styles.etaBlock}>
            <Text style={styles.etaLabel}>
              {phase === 'pickup' ? 'Arriving in' : phase === 'onRoute' ? 'ETA' : 'Arrived!'}
            </Text>
            <Text style={styles.etaTime}>
              {phase === 'arrived' ? '🎉' : `${etaMin}:${etaSec.toString().padStart(2, '0')}`}
            </Text>
          </View>

          <Animated.View style={styles.progressBarWrapper}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </Animated.View>

          {/* SOS Button */}
          <TouchableOpacity style={styles.sosBtn} onPress={handleSOS}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Driver Card */}
        <DriverCard
          driver={driver}
          compact
          onCall={() => Alert.alert('Calling', `Calling ${driver.name}...`)}
          onMessage={() => Alert.alert('Message', `Opening chat with ${driver.name}...`)}
          style={styles.driverCard}
        />

        {/* Vehicle stats */}
        <View style={styles.vehicleStats}>
          <View style={styles.vehicleStat}>
            <Text style={styles.vehicleStatIcon}>⚡</Text>
            <Text style={styles.vehicleStatLabel}>Battery</Text>
            <Text style={styles.vehicleStatValue}>{vehicle.batteryPercent}%</Text>
          </View>
          <View style={styles.vehicleStat}>
            <Text style={styles.vehicleStatIcon}>📡</Text>
            <Text style={styles.vehicleStatLabel}>Range</Text>
            <Text style={styles.vehicleStatValue}>{vehicle.rangeKm} km</Text>
          </View>
          <View style={styles.vehicleStat}>
            <Text style={styles.vehicleStatIcon}>🌿</Text>
            <Text style={styles.vehicleStatLabel}>Mode</Text>
            <Text style={styles.vehicleStatValue}>Eco</Text>
          </View>
          <View style={styles.vehicleStat}>
            <Text style={styles.vehicleStatIcon}>🚗</Text>
            <Text style={styles.vehicleStatLabel}>Plate</Text>
            <Text style={styles.vehicleStatValue}>{driver.plateNumber}</Text>
          </View>
        </View>

        {/* Share Ride full button */}
        <AppButton
          label="Share Ride with Friends"
          onPress={handleShare}
          variant="outline"
          icon="↗"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryDark },
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    opacity: 0.12,
  },
  mapCell: {
    width: width / 6,
    height: height / 8,
    borderWidth: 0.5,
    borderColor: Colors.primary,
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.07)',
    height: 3,
  },
  routeLine: {
    position: 'absolute',
    left: width * 0.25,
    top: height * 0.22,
    width: width * 0.55,
    height: 3,
    backgroundColor: Colors.accent,
    opacity: 0.7,
    borderRadius: 2,
    transform: [{ rotate: '18deg' }],
  },
  destPin: {
    position: 'absolute',
    right: 60,
    top: height * 0.12,
    alignItems: 'center',
  },
  destPinIcon: { fontSize: 28 },
  destLabel: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
  yourPin: {
    position: 'absolute',
    left: 50,
    bottom: height * 0.06,
    alignItems: 'center',
  },
  yourPinText: { fontSize: FontSizes.xs, color: Colors.white, fontWeight: '700' },
  yourPinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.info,
    borderWidth: 2,
    borderColor: Colors.white,
    marginTop: 2,
  },
  driverMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(29,185,84,0.25)',
  },
  driverDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadow.card,
  },
  driverDotIcon: { fontSize: 18 },
  driverMarkerLabel: {
    fontSize: FontSizes.xs,
    color: Colors.white,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  mapTopBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 32,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBackIcon: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  phasePill: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  phaseText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700' },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: { color: Colors.white, fontSize: 18, fontWeight: '700' },
  vehicleOverlay: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vehicleOverlayText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.md,
    paddingBottom: 24,
    ...Shadow.strong,
  },
  bottomSheetExpanded: {
    maxHeight: '65%',
  },
  handle: { alignItems: 'center', marginBottom: Spacing.sm },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  etaBlock: { alignItems: 'flex-start', minWidth: 80 },
  etaLabel: { fontSize: FontSizes.xs, color: Colors.midGray },
  etaTime: { fontSize: FontSizes.xxl, fontWeight: '900', color: Colors.black },
  progressBarWrapper: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  sosBtn: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    ...Shadow.card,
  },
  sosText: { color: Colors.white, fontWeight: '900', fontSize: FontSizes.sm, letterSpacing: 1 },
  driverCard: {
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  vehicleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.offWhite,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  vehicleStat: { alignItems: 'center' },
  vehicleStatIcon: { fontSize: 18, marginBottom: 2 },
  vehicleStatLabel: { fontSize: FontSizes.xs, color: Colors.midGray },
  vehicleStatValue: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.black, marginTop: 2 },
});

export default LiveTrackingScreen;
