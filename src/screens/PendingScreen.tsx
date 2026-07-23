import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';

export const PendingScreen = ({ navigation }: any) => {
  const [checking, setChecking] = React.useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for the pending badge
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleCheckStatus = () => {
    setChecking(true);
    // Rotate the check icon
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }).start();

    // Simulate verification update
    setTimeout(() => {
      setChecking(false);
      // For demonstration, navigate to the main dashboard
      navigation.replace('MainTabs');
    }, 1800);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Badge Container */}
        <Animated.View
          style={[
            styles.badgeOuterCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.badgeInnerCircle}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <CustomIcon name="card" size={42} color={COLORS.warning} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Title & Description */}
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.description}>
          Thank you for registering! Your profile and Voter ID document are currently being verified by the Ward 18 administration.
        </Text>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.statusText}>Under Review (usually takes 24 hours)</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.statusDetails}>
            Submitted details: Profile photo, EPIC number, and voter card scans.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.checkButton, checking && styles.checkButtonDisabled]}
          activeOpacity={0.8}
          onPress={handleCheckStatus}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.checkButtonText}>Check Status</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login option */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  badgeOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF2E8', // Light orange background matching warning color theme
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0CC',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  statusCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  statusDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  checkButton: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginBottom: 16,
  },
  checkButtonDisabled: {
    backgroundColor: COLORS.greyMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  backButton: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
});
