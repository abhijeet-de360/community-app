import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from '../store/store';
import { Skeleton } from '../components/Skeleton';
import { ICampaign } from '../store/campaignSlice';

const CAMPAIGN_TYPES = ['All', 'Cleanliness', 'Health Screening', 'Awareness', 'Other'] as const;

const getStatusBadgeColors = (status: string) => {
  switch (status) {
    case 'Upcoming': return { bg: '#E3F2FD', text: '#1565C0' };
    case 'Active':   return { bg: '#E8F5E9', text: '#2E7D32' };
    case 'Expired':  return { bg: '#FFF3E0', text: '#E65100' };
    default:         return { bg: '#EEEEEE', text: '#616161' };
  }
};

const CampaignCard = ({ camp, navigation }: { camp: ICampaign; navigation: any }) => {
  const statusColors = getStatusBadgeColors(camp.status);
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeBadgeContainer}>
          <Text style={styles.typeText}>{camp.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.text }]}>{camp.status}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{camp.title}</Text>

      <View style={styles.scheduleRow}>
        <CustomIcon name="calendar" size={13} color={COLORS.textSecondary} />
        <Text style={styles.scheduleText}>{camp.date}</Text>
        <View style={styles.bulletSeparator} />
        <CustomIcon name="schedule" size={13} color={COLORS.textSecondary} />
        <Text style={styles.scheduleText}>{camp.time?.split('-')[0]?.trim() || camp.time}</Text>
      </View>

      <Text style={styles.cardDesc} numberOfLines={2}>{camp.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.locationContainer}>
          <CustomIcon name="home" size={13} color={COLORS.textSecondary} />
          <Text style={styles.locationText} numberOfLines={1}>{camp.venue}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.detailsBtn}
          onPress={() => navigation.navigate('CampaignDetails', { campaign: { ...camp, location: camp.venue } })}
        >
          <Text style={styles.detailsBtnText}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SkeletonCard = () => (
  <View style={[styles.card, { gap: 10 }]}>
    <View style={styles.cardHeader}>
      <Skeleton width={80} height={20} borderRadius={6} />
      <Skeleton width={70} height={20} borderRadius={6} />
    </View>
    <Skeleton width="80%" height={22} borderRadius={6} />
    <Skeleton width={160} height={16} borderRadius={4} />
    <Skeleton width="100%" height={16} borderRadius={4} />
    <Skeleton width="60%" height={16} borderRadius={4} />
    <View style={styles.cardFooter}>
      <Skeleton width={120} height={16} borderRadius={4} />
      <Skeleton width={80} height={16} borderRadius={4} />
    </View>
  </View>
);

export const CampaignsScreen = ({ navigation }: any) => {
  const { campaigns, loading } = useSelector((state: RootState) => state.campaign);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Frontend filter
  const filtered = campaigns.filter((c) => {
    const matchType = selectedType === 'All' || c.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.venue?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Group by type
  const grouped = filtered.reduce<Record<string, ICampaign[]>>((acc, c) => {
    const key = c.type || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped).sort();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ward Campaigns</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <CustomIcon name="search" size={20} color={COLORS.greyMedium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search campaigns, venue, topic..."
            placeholderTextColor={COLORS.greyMedium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CAMPAIGN_TYPES.map((t) => {
            const isSelected = selectedType === t;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                activeOpacity={0.8}
                onPress={() => setSelectedType(t)}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Content */}
        {loading ? (
          <View>
            {[1, 2, 3].map((k) => <SkeletonCard key={k} />)}
          </View>
        ) : groupKeys.length > 0 ? (
          groupKeys.map((type) => (
            <View key={type}>
              {/* Group Header */}
              <View style={styles.groupHeader}>
                <View style={styles.groupHeaderLine} />
                <Text style={styles.groupHeaderText}>{type}</Text>
                <View style={styles.groupHeaderLine} />
              </View>
              {grouped[type].map((camp) => (
                <CampaignCard
                  key={camp._id || camp.campaignId}
                  camp={camp}
                  navigation={navigation}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <CustomIcon name="megaphone" size={40} color={COLORS.greyMedium} />
            <Text style={styles.emptyText}>No campaigns found matching your query.</Text>
          </View>
        )}
      </ScrollView>
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
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  groupHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  groupHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadgeContainer: {
    backgroundColor: COLORS.greyLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  bulletSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.greyMedium,
    marginHorizontal: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    paddingTop: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsBtn: {
    paddingVertical: 4,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
