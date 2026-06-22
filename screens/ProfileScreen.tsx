/**
 * Screen 7 – Profile
 * Components: Photo · Name · Payment Methods · Achievements
 *             Support · Settings
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
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import { MOCK_USER } from '../utilities/mockData';
import { PaymentMethod } from '../utilities/types';

// ─── Achievement definition ───────────────────
const ACHIEVEMENTS = [
  { id: 'a1', emoji: '🌱', title: 'First Green Ride', desc: 'Took your first EV ride', unlocked: true },
  { id: 'a2', emoji: '🌿', title: 'Eco Warrior', desc: '10 rides completed', unlocked: true },
  { id: 'a3', emoji: '🌳', title: 'Tree Planter', desc: 'Saved 50 kg CO₂', unlocked: true },
  { id: 'a4', emoji: '⚡', title: 'Speed Saver', desc: '25 rides in one month', unlocked: true },
  { id: 'a5', emoji: '🏆', title: 'Champion Rider', desc: '100 total rides', unlocked: false },
  { id: 'a6', emoji: '🌍', title: 'Climate Hero', desc: 'Saved 500 kg CO₂', unlocked: false },
];

const PAYMENT_ICONS: Record<string, string> = {
  mpesa: '📱',
  card: '💳',
  cash: '💵',
};

const ProfileScreen: React.FC = () => {
  const user = MOCK_USER;
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  const menuItems = [
    { icon: '📍', label: 'Saved Addresses', onPress: () => Alert.alert('Saved Addresses', 'Home, Work, Gym') },
    { icon: '🔔', label: 'Notifications', onPress: () => {}, toggle: true, toggleVal: notifications, onToggle: setNotifications },
    { icon: '🌙', label: 'Dark Mode', onPress: () => {}, toggle: true, toggleVal: darkMode, onToggle: setDarkMode },
    { icon: '📡', label: 'Location Sharing', onPress: () => {}, toggle: true, toggleVal: locationSharing, onToggle: setLocationSharing },
    { icon: '🔒', label: 'Privacy & Security', onPress: () => Alert.alert('Privacy', 'Your data is protected') },
    { icon: '💬', label: '24/7 Support', onPress: () => Alert.alert('Support', 'Contact: hello@vashacab.com') },
    { icon: '⭐', label: 'Rate the App', onPress: () => Alert.alert('Rate Us', 'Thank you for your support!') },
    { icon: '📄', label: 'Terms & Privacy Policy', onPress: () => Alert.alert('Terms', 'View full terms at vashacab.com/terms') },
    { icon: '🚪', label: 'Sign Out', onPress: () => Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => {} },
    ]), danger: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Profile Header ── */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primaryMid, '#1a6b44']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Background circles */}
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />

          {/* Avatar */}
          <TouchableOpacity style={styles.avatarWrapper} onPress={() => Alert.alert('Edit Photo', 'Pick a photo from your library')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userSince}>Member since {user.joinDate}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {user.rating} passenger rating</Text>
          </View>
        </LinearGradient>

        {/* ── Stats Row ── */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.totalRides}</Text>
            <Text style={styles.statLabel}>Total Rides</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>{user.co2SavedKg} kg</Text>
            <Text style={styles.statLabel}>CO₂ Saved 🌿</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.treesEquivalent} 🌳</Text>
            <Text style={styles.statLabel}>Trees Equiv.</Text>
          </View>
        </View>

        {/* ── Account Info ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.infoCard}>
            {[
              { label: 'Email', value: user.email, icon: '📧' },
              { label: 'Phone', value: user.phone, icon: '📱' },
            ].map(({ label, value, icon }) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoIcon}>{icon}</Text>
                <View style={styles.infoTextBlock}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Edit', `Edit ${label}`)}>
                  <Text style={styles.editIcon}>›</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ── Payment Methods ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.infoCard}>
            {user.paymentMethods.map((pm: PaymentMethod) => (
              <View key={pm.id} style={styles.paymentRow}>
                <Text style={styles.paymentIcon}>{PAYMENT_ICONS[pm.type]}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentLabel}>{pm.label}</Text>
                  {pm.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Payment', `Managing ${pm.label}`)}>
                  <Text style={styles.editIcon}>›</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPaymentBtn} onPress={() => Alert.alert('Add Payment', 'Add a new payment method')}>
              <Text style={styles.addPaymentText}>+ Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Achievements ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <Text style={styles.sectionSub}>
            {ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} unlocked
          </Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map(a => (
              <View key={a.id} style={[styles.achievementCard, !a.unlocked && styles.achievementLocked]}>
                <Text style={[styles.achievementEmoji, !a.unlocked && { opacity: 0.3 }]}>{a.emoji}</Text>
                <Text style={[styles.achievementTitle, !a.unlocked && styles.lockedText]}>{a.title}</Text>
                <Text style={[styles.achievementDesc, !a.unlocked && styles.lockedText]}>{a.desc}</Text>
                {!a.unlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ── Environmental Impact ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Your Environmental Impact</Text>
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primaryMid]}
            style={styles.impactCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>{user.co2SavedKg} kg</Text>
                <Text style={styles.impactLabel}>CO₂ Saved</Text>
              </View>
              <View style={styles.impactItem}>
                <Text style={styles.impactValue}>= {user.treesEquivalent} 🌳</Text>
                <Text style={styles.impactLabel}>Trees Planted</Text>
              </View>
            </View>
            <Text style={styles.impactDesc}>
              You've avoided {user.co2SavedKg} kg of CO₂ emissions by choosing electric rides.
              That's the equivalent of planting {user.treesEquivalent} trees! 🌍
            </Text>
          </LinearGradient>
        </View>

        {/* ── Settings / Menu ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Support</Text>
          <View style={styles.infoCard}>
            {menuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.menuRow,
                  idx < menuItems.length - 1 && styles.menuRowBorder,
                  item.danger && styles.menuRowDanger,
                ]}
                onPress={item.onPress}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
                {item.toggle ? (
                  <Switch
                    value={item.toggleVal}
                    onValueChange={item.onToggle}
                    trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                ) : (
                  <Text style={styles.menuChevron}>›</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Vasha Cab v1.0.0 · Made with 💚 for a cleaner planet</Text>
          <Text style={styles.footerSub}>hello@vashacab.com · +254 712 345 678</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollContent: { paddingBottom: 80 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(29,185,84,0.12)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,230,118,0.08)',
  },
  avatarWrapper: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 40, color: Colors.white, fontWeight: '800' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDark,
  },
  editBadgeIcon: { fontSize: 13 },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 4,
  },
  userSince: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: Spacing.sm,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    color: Colors.white,
    fontWeight: '700',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: -20,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.strong,
    zIndex: 10,
    marginBottom: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.lightGray },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.black,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
    marginTop: 3,
  },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  infoIcon: { fontSize: 20, marginRight: Spacing.sm },
  infoTextBlock: { flex: 1 },
  infoLabel: { fontSize: FontSizes.xs, color: Colors.midGray },
  infoValue: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.black },
  editBtn: { padding: Spacing.xs },
  editIcon: { fontSize: FontSizes.xl, color: Colors.midGray },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  paymentIcon: { fontSize: 24, marginRight: Spacing.sm },
  paymentInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentLabel: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.black },
  defaultBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultText: { fontSize: FontSizes.xs, color: Colors.primaryMid, fontWeight: '700' },
  addPaymentBtn: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  addPaymentText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '700',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  achievementCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.card,
    position: 'relative',
  },
  achievementLocked: {
    backgroundColor: Colors.offWhite,
  },
  achievementEmoji: { fontSize: 30, marginBottom: 6 },
  achievementTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 3,
  },
  achievementDesc: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
  },
  lockedText: { color: Colors.midGray },
  lockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockIcon: { fontSize: 14 },
  impactCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  impactItem: { alignItems: 'center' },
  impactValue: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.accent,
  },
  impactLabel: {
    fontSize: FontSizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  impactDesc: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  menuRowDanger: {},
  menuIcon: { fontSize: 20, marginRight: Spacing.sm, width: 28, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: FontSizes.sm, fontWeight: '600', color: Colors.black },
  menuLabelDanger: { color: Colors.danger },
  menuChevron: { fontSize: FontSizes.xl, color: Colors.lightGray, fontWeight: '700' },
  footer: {
    alignItems: 'center',
    padding: Spacing.lg,
    paddingTop: 0,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
  },
  footerSub: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    marginTop: 4,
  },
});

export default ProfileScreen;
