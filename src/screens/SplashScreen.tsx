import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Image, Animated } from 'react-native';
import { COLORS } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { requestStoragePermission } from '../utils/permissionManager';

const { height } = Dimensions.get('window');

const slides = [
  {
    title: "Smart Citizen Portal",
    description: "Access municipal updates and stay connected with your ward community services."
  },
  {
    title: "Instant Bill Payments",
    description: "Pay sanitation fees, utility bills, and local taxes directly from your mobile phone securely."
  },
  {
    title: "Quick Issue Reporting",
    description: "Spotted a pothole, garbage dump, or broken streetlight? Report it directly to ward officials with photos."
  }
];

export const SplashScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    // Request permission on app startup / splash screen
    requestStoragePermission();

    // Setup interval to switch slides every 3.5 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    // Run animation when currentSlide changes
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {isFocused && <StatusBar hidden={true} />}

      {/* Top Header Logo */}
      <View style={[styles.header, { marginTop: insets.top + 30 }]}>
        <Text style={styles.headerText}>WARD 18</Text>
        <Text style={styles.headerSubtitle}>Citizen Services</Text>
      </View>

      {/* Center Illustration Frame */}
      <View style={styles.centerContainer}>
        <View style={styles.illustrationCard}>
          <Image
            source={require('../assets/images/splash_skyline.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bottom Sheet Card */}
      <View style={[styles.bottomCard, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
        </Animated.View>

        {/* Onboarding Indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.dotActive : styles.dotInactive
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.secondaryButtonText}>
            New resident? <Text style={styles.signUpText}>Create an account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  illustrationCard: {
    width: '100%',
    height: height * 0.32,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  bottomCard: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 18,
    backgroundColor: COLORS.white,
  },
  dotInactive: {
    width: 6,
    backgroundColor: COLORS.border,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: '500',
  },
  signUpText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
