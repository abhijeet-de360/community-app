import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../store/authSlice';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state: any) => state.auth);
  const isLoading = status === 'loading';

  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = React.useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleGetOtp = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      return;
    }
    setOtp(['', '', '', '', '', '']);
    try {
      await dispatch(sendOtp(mobileNumber) as any);
      setOtpSent(true);
    } catch (error) {
      // Toast handles error notification (e.g. "User not registered. Please register first.")
    }
  };

  const handleLogin = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) return;

    const payload = {
      phoneNumber: mobileNumber,
      otp: fullOtp,
    };

    try {
      const data = await dispatch(verifyOtp(payload) as any);
      const userStatus = data?.user?.status;
      if (userStatus === 'active') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Pending' }],
        });
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next box if digit is typed
    if (text !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Auto-focus previous box on backspace if current box is empty
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Circular Back Button in Left Top Corner */}
        <TouchableOpacity
          style={styles.backButtonCircle}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top graphics mock / Intro */}
          <View style={styles.introContainer}>
            <View style={styles.iconCircle}>
              <CustomIcon name="profile" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.introTitle}>Welcome Back</Text>
            <Text style={styles.introSubtitle}>
              {!otpSent
                ? 'Enter your registered mobile number to login'
                : 'Enter the 6-digit OTP code sent to your mobile'}
            </Text>
          </View>

          {/* Form Fields */}
          {!otpSent ? (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (isLoading || mobileNumber.length < 10) && { opacity: 0.5 },
                ]}
                activeOpacity={0.8}
                disabled={isLoading || mobileNumber.length < 10}
                onPress={handleGetOtp}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Get OTP</Text>
                )}
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Enter OTP</Text>
              <View style={styles.otpGrid}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => {
                      otpRefs.current[idx] = ref;
                    }}
                    style={[
                      styles.otpBox,
                      digit !== '' && styles.otpBoxFilled,
                      focusedIndex === idx && styles.otpBoxFocused,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    onFocus={() => setFocusedIndex(idx)}
                    onBlur={() => setFocusedIndex(null)}
                  />
                ))}
              </View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>Resend OTP in </Text>
                <Text style={styles.timerCountdown}>00:59</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (isLoading || otp.join('').length < 6) && { opacity: 0.5 },
                ]}
                activeOpacity={0.8}
                disabled={isLoading || otp.join('').length < 6}
                onPress={handleLogin}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => setOtpSent(false)}
              >
                <Text style={styles.resendButtonText}>Change Mobile Number</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Footer removed */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  backButtonCircle: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 10,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    height: 54,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    marginBottom: 24,
  },
  countryCode: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.border,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  primaryButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    // Android shadow
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    // Subtle glow shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondary,
    color: COLORS.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  timerCountdown: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
