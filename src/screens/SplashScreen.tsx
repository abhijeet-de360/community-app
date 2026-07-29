import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Animated, 
  Easing,
  ActivityIndicator,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../theme/colors';
import { localService } from '../shared/_session/local';
import { getProfile } from '../store/authSlice';
import { requestNotificationPermission } from '../shared/_services/notificationService';

export const SplashScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<any>();
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse animation for initializing effect
    const loopPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loopPulse.start();

    // 3. Splash check: fetch profile & check status for redirection
    let isMounted = true;
    const timer = setTimeout(async () => {
      await requestNotificationPermission();
      const token = await localService.get('token');

      if (token || isAuthenticated) {
        try {
          const profileData: any = await dispatch(getProfile());

          if (isMounted) {
            const userStatus = profileData?.status;
            if (userStatus === 'active') {
              navigation.replace('MainTabs');
            } else if (userStatus === 'pending') {
              navigation.replace('Pending');
            } else {
              navigation.replace('Onboarding');
            }
          }
        } catch (err) {
          if (isMounted) {
            navigation.replace('Onboarding');
          }
        }
      } else {
        if (isMounted) {
          navigation.replace('Onboarding');
        }
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      loopPulse.stop();
    };
  }, [navigation, logoOpacity, logoScale, pulseAnim, isAuthenticated, dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Logo Container */}
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: logoOpacity,
            transform: [{ scale: logoScale }] 
          }
        ]}
      >
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.iconText}>🏛️</Text>
        </Animated.View>
        <Text style={styles.title}>Ward 18</Text>
        <Text style={styles.subtitle}>Smart Citizen Portal</Text>
      </Animated.View>

      {/* Initializing Indicator */}
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#FFFFFF" style={styles.spinner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconText: {
    fontSize: 44,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    marginRight: 8,
  },

});
