import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export const SchemeDetailsScreen = ({ route, navigation }: any) => {
  const { scheme } = route.params || {};

  if (!scheme) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Scheme details could not be loaded.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleApply = async () => {
    const url = scheme.portalUrl;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open the portal: ${url}`);
      }
    } catch {
      Alert.alert('Error', 'An error occurred while trying to open the portal.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Flat Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scheme Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Category Info */}
        <Text style={styles.schemeCategory}>{scheme.category}</Text>

        {/* Scheme Title */}
        <Text style={styles.schemeTitle}>{scheme.title}</Text>
        
        <View style={styles.titleDivider} />

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.schemeDesc}>{scheme.description}</Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Benefits Section */}
        <View style={styles.section}>
          <View style={styles.cardHeaderRow}>
            <CustomIcon name="gift-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitleIconText}>Key Benefits</Text>
          </View>
          <Text style={styles.sectionText}>{scheme.benefits}</Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Eligibility Section */}
        <View style={styles.section}>
          <View style={styles.cardHeaderRow}>
            <CustomIcon name="checkmark-circle-outline" size={20} color={COLORS.warning} />
            <Text style={styles.sectionTitleIconText}>Eligibility Criteria</Text>
          </View>
          <Text style={styles.sectionText}>{scheme.eligibility}</Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Required Documents Section */}
        <View style={styles.section}>
          <View style={styles.cardHeaderRow}>
            <CustomIcon name="document" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitleIconText}>Required Documents</Text>
          </View>
          <Text style={styles.sectionText}>
            {scheme.documents || '• Aadhaar Card\n• Address Proof\n• Income Certificate'}
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Official Portal Notice */}
        <View style={styles.portalContainer}>
          <Text style={styles.portalLabel}>Official Online Portal</Text>
          <Text style={styles.portalUrl}>{scheme.portalUrl}</Text>
        </View>

        {/* Apply Primary Button */}
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.8}
          onPress={handleApply}
        >
          <Text style={styles.applyBtnText}>Apply Online</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  schemeCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  schemeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 16,
    lineHeight: 32,
  },
  titleDivider: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: 60,
    borderRadius: 1,
    marginBottom: 8,
  },
  section: {
    paddingVertical: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  sectionTitleIconText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  schemeDesc: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  sectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  portalContainer: {
    backgroundColor: COLORS.greyLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
  },
  portalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  portalUrl: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
