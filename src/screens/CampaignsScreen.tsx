import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Campaign {
  id: string;
  title: string;
  type: 'Cleanliness' | 'Health Screening' | 'Health' | 'Awareness' | 'Other';
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

export const CampaignsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const campaigns: Campaign[] = [
    {
      id: 'camp-1',
      title: 'Ward 18 Cleanliness Drive (Swachhta)',
      type: 'Cleanliness',
      date: 'Saturday, July 25, 2026',
      time: '07:30 AM - 10:30 AM',
      location: 'Cathedral Sector Park',
      description: 'Weekly cleaning campaign focusing on plastic segregation and neighborhood clean-up. Hand gloves, garbage bags, and refreshments will be provided to all volunteers.',
      organizer: 'Ward 18 Sanitary Team',
      status: 'Upcoming',
    },
    {
      id: 'camp-2',
      title: 'Free Health Screening Camp',
      type: 'Health',
      date: 'Sunday, July 26, 2026',
      time: '09:00 AM - 02:00 PM',
      location: 'Community Hall, Kohima Town',
      description: 'Basic health diagnostics including blood pressure, sugar screening, and consultation with general physicians and pediatricians. Medicines will be distributed free of cost.',
      organizer: 'Municipal Health Welfare Board',
      status: 'Upcoming',
    },
    {
      id: 'camp-3',
      title: 'Water Segregation & Harvesting Seminar',
      type: 'Awareness',
      date: 'Wednesday, July 29, 2026',
      time: '04:00 PM - 06:00 PM',
      location: 'Ward 18 Recreation Hall',
      description: 'Interactive session to educate citizens on rainwater harvesting setups and domestic water saving methods before the peak monsoon. Technical experts will demonstrate models.',
      organizer: 'Water Works Department',
      status: 'Upcoming',
    },
    {
      id: 'camp-4',
      title: 'Anti-Dengue & Fumigation Drive',
      type: 'Cleanliness',
      date: 'July 15, 2026',
      time: '08:00 AM - 12:00 PM',
      location: 'High School Hill Sector',
      description: 'Intensive fogging operations and clearing water-logging pockets to eradicate mosquito breeding grounds. Health booklets distributed door-to-door.',
      organizer: 'Vector Control Unit',
      status: 'Completed',
    },
  ];

  const types = ['All', 'Cleanliness', 'Health Screening', 'Awareness', 'Other'];

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesType = selectedType === 'All' || camp.type === selectedType;
    const matchesSearch =
      camp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadgeColors = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'Active':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      default:
        return { bg: '#EEEEEE', text: '#616161' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header aligned to other screens */}
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
          {types.map((t) => {
            const isSelected = selectedType === t;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedType(t)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Cards List */}
        <View style={styles.listContainer}>
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((camp) => {
              const statusColors = getStatusBadgeColors(camp.status);
              return (
                <View key={camp.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.typeBadgeContainer}>
                      <Text style={styles.typeText}>{camp.type}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {camp.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{camp.title}</Text>
                  
                  {/* Schedule Snippet */}
                  <View style={styles.scheduleRow}>
                    <CustomIcon name="calendar" size={13} color={COLORS.textSecondary} />
                    <Text style={styles.scheduleText}>{camp.date.split(',')[1]?.trim() || camp.date}</Text>
                    <View style={styles.bulletSeparator} />
                    <CustomIcon name="time" size={13} color={COLORS.textSecondary} />
                    <Text style={styles.scheduleText}>{camp.time.split('-')[0]?.trim() || camp.time}</Text>
                  </View>

                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {camp.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.locationContainer}>
                      <CustomIcon name="home" size={13} color={COLORS.textSecondary} />
                      <Text style={styles.locationText} numberOfLines={1}>
                        {camp.location}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.detailsBtn}
                      onPress={() => navigation.navigate('CampaignDetails', { campaign: camp })}
                    >
                      <Text style={styles.detailsBtnText}>View Details →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No drives or campaigns found matching your query.</Text>
            </View>
          )}
        </View>
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
    paddingBottom: 100, // offset bottom tabs
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
    // Soft shadow
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
  listContainer: {
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    // Soft shadow
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
    paddingVertical: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
