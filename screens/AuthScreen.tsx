/**
 * Screen 2 – Authentication
 * Components: Login · Registration · Forgot Password
 * Plain text inputs: Email · Password · Phone Number
 */
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utilities/types';
import { Colors, FontSizes, Radius, Shadow, Spacing } from '../utilities/theme';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const { height } = Dimensions.get('window');

type Tab = 'login' | 'register' | 'forgot';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tabIndicator = useRef(new Animated.Value(0)).current;

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setErrors({});
    const toValue = tab === 'login' ? 0 : tab === 'register' ? 1 : 2;
    Animated.spring(tabIndicator, { toValue, useNativeDriver: false }).start();
  };

  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginEmail.trim()) e.loginEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.loginEmail = 'Enter a valid email';
    if (!loginPassword) e.loginPassword = 'Password is required';
    return e;
  };

  const validateRegister = () => {
    const e: Record<string, string> = {};
    if (!regName.trim()) e.regName = 'Name is required';
    if (!regEmail.trim()) e.regEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.regEmail = 'Enter a valid email';
    if (!regPhone.trim()) e.regPhone = 'Phone number is required';
    if (!regPassword) e.regPassword = 'Password is required';
    else if (regPassword.length < 6) e.regPassword = 'Minimum 6 characters';
    if (regPassword !== regConfirm) e.regConfirm = 'Passwords do not match';
    return e;
  };

  const handleLogin = async () => {
    const e = validateLogin();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    // Simulate network call
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleRegister = async () => {
    const e = validateRegister();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Account Created', 'Welcome to Vasha Cab! Please log in.', [
        { text: 'Login', onPress: () => switchTab('login') },
      ]);
    }, 1500);
  };

  const handleForgot = async () => {
    if (!forgotEmail.trim()) {
      setErrors({ forgotEmail: 'Please enter your email' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Reset Link Sent', `A password reset link has been sent to ${forgotEmail}`);
    }, 1200);
  };

  const tabWidth = (100 / 3).toFixed(2) + '%';
  const indicatorLeft = tabIndicator.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0%', `${(100 / 3).toFixed(2)}%`, `${(200 / 3).toFixed(2)}%`],
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />

      {/* Header gradient banner */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primaryMid]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerLogo}>⚡</Text>
        <Text style={styles.headerTitle}>Vasha Cab</Text>
        <Text style={styles.headerSub}>Electric rides, sustainable future</Text>
      </LinearGradient>

      <View style={styles.card}>
        {/* ── Tab Bar ── */}
        <View style={styles.tabBar}>
          <Animated.View style={[styles.tabIndicator, { left: indicatorLeft, width: tabWidth as any }]} />
          {(['login', 'register', 'forgot'] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => switchTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'login' ? 'Login' : tab === 'register' ? 'Register' : 'Forgot'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── LOGIN FORM ── */}
          {activeTab === 'login' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Welcome back 👋</Text>
              <Text style={styles.formSub}>Sign in to your Vasha Cab account</Text>

              <AppInput
                label="Email"
                placeholder="your@email.com"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="📧"
                error={errors.loginEmail}
              />
              <AppInput
                label="Password"
                placeholder="Enter your password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                leftIcon="🔒"
                error={errors.loginPassword}
              />

              <TouchableOpacity onPress={() => switchTab('forgot')} style={styles.forgotLink}>
                <Text style={styles.forgotLinkText}>Forgot password?</Text>
              </TouchableOpacity>

              <AppButton
                label="Sign In"
                onPress={handleLogin}
                loading={loading}
                icon="⚡"
                style={styles.submitBtn}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => switchTab('register')}>
                  <Text style={styles.switchLink}>Create one</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── REGISTER FORM ── */}
          {activeTab === 'register' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Join Vasha Cab 🌿</Text>
              <Text style={styles.formSub}>Create your account and start riding green</Text>

              <AppInput
                label="Full Name"
                placeholder="Doreen Wanjiku"
                value={regName}
                onChangeText={setRegName}
                leftIcon="👤"
                error={errors.regName}
              />
              <AppInput
                label="Email"
                placeholder="your@email.com"
                value={regEmail}
                onChangeText={setRegEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="📧"
                error={errors.regEmail}
              />
              <AppInput
                label="Phone Number"
                placeholder="+254 700 000 000"
                value={regPhone}
                onChangeText={setRegPhone}
                keyboardType="phone-pad"
                leftIcon="📱"
                error={errors.regPhone}
              />
              <AppInput
                label="Password"
                placeholder="Min. 6 characters"
                value={regPassword}
                onChangeText={setRegPassword}
                secureTextEntry
                leftIcon="🔒"
                error={errors.regPassword}
              />
              <AppInput
                label="Confirm Password"
                placeholder="Re-enter password"
                value={regConfirm}
                onChangeText={setRegConfirm}
                secureTextEntry
                leftIcon="🔒"
                error={errors.regConfirm}
              />

              <View style={styles.termsRow}>
                <Text style={styles.termsText}>
                  By registering you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>.
                </Text>
              </View>

              <AppButton
                label="Create Account"
                onPress={handleRegister}
                loading={loading}
                icon="🌿"
                style={styles.submitBtn}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => switchTab('login')}>
                  <Text style={styles.switchLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {activeTab === 'forgot' && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>Reset Password 🔑</Text>
              <Text style={styles.formSub}>
                Enter your email and we'll send you a reset link
              </Text>

              <AppInput
                label="Email"
                placeholder="your@email.com"
                value={forgotEmail}
                onChangeText={setForgotEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="📧"
                error={errors.forgotEmail}
              />

              <AppButton
                label="Send Reset Link"
                onPress={handleForgot}
                loading={loading}
                icon="📨"
                style={styles.submitBtn}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Remembered it? </Text>
                <TouchableOpacity onPress={() => switchTab('login')}>
                  <Text style={styles.switchLink}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 36,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: FontSizes.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.offWhite,
    borderRadius: 0,
    position: 'relative',
    height: 48,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.midGray,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  formScroll: {
    paddingBottom: 40,
  },
  form: {
    padding: Spacing.lg,
  },
  formTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 4,
  },
  formSub: {
    fontSize: FontSizes.sm,
    color: Colors.midGray,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
  },
  forgotLinkText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontSize: FontSizes.sm,
    color: Colors.midGray,
  },
  switchLink: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '700',
  },
  termsRow: {
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  termsText: {
    fontSize: FontSizes.xs,
    color: Colors.midGray,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default AuthScreen;
