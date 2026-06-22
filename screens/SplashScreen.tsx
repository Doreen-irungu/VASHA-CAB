/**
 * Screen 1 – Splash Screen
 * Components: Logo · App Name · Loading Animation
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utilities/types';
import { Colors, FontSizes, Spacing } from '../utilities/theme';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dotScale1 = useRef(new Animated.Value(0.6)).current;
  const dotScale2 = useRef(new Animated.Value(0.6)).current;
  const dotScale3 = useRef(new Animated.Value(0.6)).current;

  // Bolt rotation
  const boltRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // ── 1. Logo pop-in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // ── 2. Title fade-up (delay 400ms)
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 500,
        delay: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // ── 3. Tagline fade in (delay 700ms)
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 700,
      useNativeDriver: true,
    }).start();

    // ── 4. Loading dots
    const pulseDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.6, duration: 300, useNativeDriver: true }),
        ]),
      ).start();

    pulseDot(dotScale1, 900);
    pulseDot(dotScale2, 1050);
    pulseDot(dotScale3, 1200);

    // ── 5. Navigate to Auth after 3s
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primaryMid, '#1a6b44']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.6, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Background decorative circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* ── Logo ── */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      >
        {/* EV bolt icon */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoBolt}>⚡</Text>
        </View>
        {/* EV leaf accent */}
        <View style={styles.leafBadge}>
          <Text style={styles.leafEmoji}>🌿</Text>
        </View>
      </Animated.View>

      {/* ── App Name ── */}
      <Animated.Text
        style={[
          styles.appName,
          { opacity: titleOpacity, transform: [{ translateY: titleY }] },
        ]}
      >
        Vasha Cab
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Zero Emissions · Pure Luxury ⚡
      </Animated.Text>

      {/* ── Loading Animation (3 dots) ── */}
      <View style={styles.dotsRow}>
        {[dotScale1, dotScale2, dotScale3].map((anim, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, { transform: [{ scale: anim }] }]}
          />
        ))}
      </View>

      {/* Bottom badge */}
      <Text style={styles.eco}>🌍 Every ride saves the planet</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(29,185,84,0.12)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0,230,118,0.08)',
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBolt: {
    fontSize: 58,
  },
  leafBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  leafEmoji: {
    fontSize: 18,
  },
  appName: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: FontSizes.md,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
    marginBottom: Spacing.xxl,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  eco: {
    position: 'absolute',
    bottom: Spacing.xl,
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },
});

export default SplashScreen;
