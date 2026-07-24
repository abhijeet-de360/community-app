import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';

const { width } = Dimensions.get('window');

export const PendingScreen = ({ navigation }: any) => {
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');
  const [copied, setCopied] = useState(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(30)).current;

  // Pulse & Glow animation for badge background
  useEffect(() => {
    // Entrance animation for content cards
    Animated.parallel([
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();

    // Infinite ambient pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 1600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(glowAnim, {
            toValue: 0.85,
            duration: 1600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 1600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ]),
      ])
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [pulseAnim, glowAnim, cardFadeAnim, cardSlideAnim]);

  const handleCheckStatus = () => {
    setChecking(true);
    rotateAnim.setValue(0);

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }).start();

    setTimeout(() => {
      setChecking(false);
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastChecked(`Today at ${timeString}`);

      Alert.alert(
        'Status Checked',
        'Your application is actively under review by Ward 18 Verification Officer. Would you like to proceed to demo dashboard?',
        [
          { text: 'Wait Here', style: 'cancel' },
          {
            text: 'Go to App Demo',
            onPress: () => navigation.replace('MainTabs'),
          },
        ]
      );
    }, 1600);
  };

  const handleCopyRef = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactSupport = () => {
    navigation.navigate('Helpline');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const timelineSteps = [
    {
      id: 1,
      title: 'Registration Submitted',
      subtitle: 'Profile details & documents uploaded',
      status: 'completed',
      time: 'Today, 09:30 AM',
    },
    {
      id: 2,
      title: 'Document & EPIC Verification',
      subtitle: 'Validating EPIC Voter Card & Address Proof',
      status: 'in-progress',
      time: 'Under active review',
    },
    {
      id: 3,
      title: 'Account Full Activation',
      subtitle: 'Full access to civic complaints & local schemes',
      status: 'pending',
      time: 'Final step',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Verification</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Hero Icon */}
        <View style={styles.heroSection}>
          <View style={styles.middleBadgeRing}>
            <View style={styles.innerBadgeContainer}>
              <Video
                source={require('../assets/videos/search-file.mp4')}
                style={styles.videoIcon}
                repeat={true}
                muted={true}
                paused={false}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Header Text */}
        <Text style={styles.mainTitle}>Verification in Progress</Text>
        <Text style={styles.subTitle}>
          Your citizen application has been received and is being verified by Ward 18 officials to ensure authentic neighborhood access.
        </Text>

        <Animated.View
          style={{
            opacity: cardFadeAnim,
            transform: [{ translateY: cardSlideAnim }],
            width: '100%',
          }}
        >
          {/* Ref Number Card */}
          <View style={styles.refCard}>
            <View style={styles.refCardLeft}>
              <Text style={styles.refLabel}>APPLICATION ID</Text>
              <Text style={styles.refValue}>REF-2026-WD18-9842</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyRef}>
              <CustomIcon
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={18}
                color={copied ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.copyBtnText, copied && { color: COLORS.primary }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verification Timeline Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Live Tracking Progress</Text>
            </View>

            <View style={styles.timelineContainer}>
              {timelineSteps.map((step, index) => {
                const isLast = index === timelineSteps.length - 1;
                const isCompleted = step.status === 'completed';
                const isInProgress = step.status === 'in-progress';

                return (
                  <View key={step.id} style={styles.timelineItem}>
                    {/* Left Indicator Column */}
                    <View style={styles.indicatorCol}>
                      <View
                        style={[
                          styles.timelineNode,
                          isCompleted && styles.nodeCompleted,
                          isInProgress && styles.nodeInProgress,
                        ]}
                      >
                        {isCompleted ? (
                          <CustomIcon name="checkmark" size={14} color={COLORS.white} />
                        ) : isInProgress ? (
                          <View style={styles.innerPulseDot} />
                        ) : (
                          <Text style={styles.nodePendingText}>{step.id}</Text>
                        )}
                      </View>

                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            isCompleted && styles.lineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    {/* Step Details Column */}
                    <View style={styles.stepContent}>
                      <View style={styles.stepTitleRow}>
                        <Text
                          style={[
                            styles.stepTitle,
                            isInProgress && { color: COLORS.warning, fontWeight: '700' },
                            isCompleted && { color: COLORS.textPrimary },
                          ]}
                        >
                          {step.title}
                        </Text>
                        {isInProgress && (
                          <View style={styles.activeTag}>
                            <Text style={styles.activeTagText}>Active</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <CustomIcon name="information-circle-outline" size={22} color="#0D9488" />
            <View style={styles.infoBannerTextCol}>
              <Text style={styles.infoBannerTitle}>Estimated Turnaround</Text>
              <Text style={styles.infoBannerBody}>
                Standard verification takes 12–24 business hours. An SMS notification will be sent once approved.
              </Text>
            </View>
          </View>

          {/* Dedicated Support Card */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleContactSupport}
            activeOpacity={0.85}
          >
            <View style={styles.supportIconBox}>
              <CustomIcon name="headset-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.supportTextCol}>
              <Text style={styles.supportTitle}>Need Help with Verification?</Text>
              <Text style={styles.supportSub}>Tap to contact Ward 18 Helpdesk</Text>
            </View>
            <CustomIcon name="chevron-forward-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Fixed Bottom Action Container */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.checkButton, checking && styles.checkButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleCheckStatus}
          disabled={checking}
        >
          {checking ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.white} />
              <Text style={styles.checkButtonText}>  Checking Server...</Text>
            </View>
          ) : (
            <View style={styles.btnContentRow}>
              <CustomIcon name="refresh-outline" size={20} color={COLORS.white} />
              <Text style={styles.checkButtonText}>  Refresh Status</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.replace('Login')}
        >
          <CustomIcon name="arrow-back-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.backButtonText}>  Back to Login</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  outerGlowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  middleBadgeRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBadgeContainer: {
    width: 60,
    height: 60,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifIcon: {
    width: 52,
    height: 52,
  },
  videoIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    overflow: 'hidden',
  },
  statusPill: {
    position: 'absolute',
    bottom: -6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  pulsingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.warning,
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.warning,
    letterSpacing: 0.6,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  refCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  refCardLeft: {
    flex: 1,
  },
  refLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  refValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  indicatorCol: {
    alignItems: 'center',
    marginRight: 14,
    width: 24,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: COLORS.primary,
  },
  nodeInProgress: {
    backgroundColor: '#FFF3EA',
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  innerPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
  },
  nodePendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
    minHeight: 28,
  },
  lineCompleted: {
    backgroundColor: COLORS.primary,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTag: {
    backgroundColor: '#FFF3EA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.warning,
  },
  stepSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  stepTime: {
    fontSize: 11,
    color: COLORS.greyMedium,
    marginTop: 4,
  },
  infoBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 16,
    padding: 14,
  },
  infoBannerTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 2,
  },
  infoBannerBody: {
    fontSize: 12,
    color: '#115E59',
    lineHeight: 17,
  },
  supportCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  supportIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportTextCol: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  supportSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  checkButton: {
    width: '100%',
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
  },
  checkButtonDisabled: {
    backgroundColor: COLORS.greyMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

