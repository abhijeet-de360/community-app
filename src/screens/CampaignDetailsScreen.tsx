import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export const CampaignDetailsScreen = ({ route, navigation }: any) => {
  const { campaign } = route.params || {};
  const [isInterested, setIsInterested] = useState(false);

  if (!campaign) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Campaign details could not be loaded.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleToggleInterest = () => {
    setIsInterested(true);
    Alert.alert(
      'Interest Registered',
      `You have registered interest in "${campaign.title}". We will keep you updated about this campaign.`,
      [{ text: 'OK' }]
    );
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
        <Text style={styles.headerTitle}>Campaign Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Campaign Type */}
        <Text style={styles.campaignType}>{campaign.type}</Text>

        {/* Campaign Title */}
        <Text style={styles.campaignTitle}>{campaign.title}</Text>

        <View style={styles.titleDivider} />

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.campaignDesc}>{campaign.description}</Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Event Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & Venue</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <CustomIcon name="calendar" size={16} color={COLORS.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{campaign.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <CustomIcon name="time" size={16} color={COLORS.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{campaign.time}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <CustomIcon name="home" size={16} color={COLORS.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location / Venue</Text>
              <Text style={styles.infoValue}>{campaign.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Coordinator Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organized By</Text>
          <View style={styles.coordinatorBox}>
            <Text style={styles.coordinatorName}>{campaign.organizer}</Text>
            <Text style={styles.coordinatorSub}>{campaign.type} Coordination Committee</Text>
          </View>
        </View>

        {/* Interest Button */}
        <TouchableOpacity
          style={[
            styles.interestBtn,
            isInterested ? styles.interestBtnActive : styles.interestBtnInactive,
          ]}
          activeOpacity={0.8}
          onPress={handleToggleInterest}
          disabled={isInterested}
        >
          <Text
            style={[
              styles.interestBtnText,
              isInterested ? styles.interestBtnTextActive : styles.interestBtnTextInactive,
            ]}
          >
            {isInterested ? 'Interested' : 'Show Interest'}
          </Text>
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
  campaignType: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 16,
    lineHeight: 28,
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  campaignDesc: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  coordinatorBox: {
    backgroundColor: COLORS.greyLight,
    padding: 16,
    borderRadius: 12,
  },
  coordinatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  coordinatorSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  interestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 24,
    borderWidth: 2,
  },
  interestBtnInactive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  interestBtnActive: {
    backgroundColor: COLORS.greyLight,
    borderColor: COLORS.border,
  },
  interestBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  interestBtnTextInactive: {
    color: COLORS.white,
  },
  interestBtnTextActive: {
    color: COLORS.textSecondary,
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
