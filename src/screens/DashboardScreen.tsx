import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export const DashboardScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const announcements = [
    {
      id: 'ann-1',
      badge: 'NOTICE',
      time: 'Today at 7:00 AM',
      title: 'Cleanliness Drive this Saturday',
      body: "Join us for Ward 18's weekly cleanliness drive focusing on plastic segregation and neighborhood clean-up.",
      bgColor: '#028A3C',
      badgeColor: 'rgba(255, 255, 255, 0.2)',
      // fds
      // dfsd
      targetRoute: 'CampaignDetails',
      params: {
        campaign: {
          id: 'camp-1',
          title: 'Ward 18 Cleanliness Drive (Swachhta)',
          type: 'Cleanliness' as const,
          date: 'Saturday, July 25, 2026',
          time: '07:30 AM - 10:30 AM',
          location: 'Cathedral Sector Park',
          description: 'Weekly cleaning campaign focusing on plastic segregation and neighborhood clean-up. Hand gloves, garbage bags, and refreshments will be provided to all volunteers.',
          organizer: 'Ward 18 Sanitary Team',
          status: 'Upcoming' as const,
        }
      }
    },
    {
      id: 'ann-2',
      badge: 'HEALTH CAMP',
      time: 'Yesterday',
      title: 'Free Health Screening Sunday',
      body: 'Basic diagnostics, sugar/BP tests, and consultation with pediatricians and general physicians. Medicines free of cost.',
      bgColor: '#0F766E',
      badgeColor: 'rgba(255, 255, 255, 0.2)',
      targetRoute: 'CampaignDetails',
      params: {
        campaign: {
          id: 'camp-2',
          title: 'Free Health Screening Camp',
          type: 'Health' as const,
          date: 'Sunday, July 26, 2026',
          time: '09:00 AM - 02:00 PM',
          location: 'Community Hall, Kohima Town',
          description: 'Basic health diagnostics including blood pressure, sugar screening, and consultation with general physicians and pediatricians. Medicines will be distributed free of cost.',
          organizer: 'Municipal Health Welfare Board',
          status: 'Upcoming' as const,
        }
      }
    },
    {
      id: 'ann-3',
      badge: 'SEMINAR',
      time: '2 days ago',
      title: 'Water Harvesting Workshop',
      body: 'Learn how to set up rainwater harvesting and domestic water-saving systems before the peak monsoon season.',
      bgColor: '#1E40AF',
      badgeColor: 'rgba(255, 255, 255, 0.2)',
      targetRoute: 'CampaignDetails',
      params: {
        campaign: {
          id: 'camp-3',
          title: 'Water Segregation & Harvesting Seminar',
          type: 'Awareness' as const,
          date: 'Wednesday, July 29, 2026',
          time: '04:00 PM - 06:00 PM',
          location: 'Ward 18 Recreation Hall',
          description: 'Interactive session to educate citizens on rainwater harvesting setups and domestic water saving methods before the peak monsoon. Technical experts will demonstrate models.',
          organizer: 'Water Works Department',
          status: 'Upcoming' as const,
        }
      }
    },
    {
      id: 'ann-4',
      badge: 'MAINTENANCE',
      time: '3 days ago',
      title: 'Zone B Water Pipeline Repair',
      body: 'Urgent repairs scheduled on Tuesday, July 21st. Water supply will be suspended in Zone B from 10 AM to 2 PM.',
      bgColor: '#B45309',
      badgeColor: 'rgba(255, 255, 255, 0.2)',
      targetRoute: 'Schedule',
      params: {}
    }
  ];

  const handleScroll = (event: any) => {
    const slideSize = CARD_WIDTH + 12;
    const index = Math.max(
      0,
      Math.min(
        announcements.length - 1,
        Math.round(event.nativeEvent.contentOffset.x / slideSize)
      )
    );
    setActiveIndex(index);
  };

  // Get time-based greeting for a modern, personalized touch
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick access items grid definition with custom premium colors
  const gridItems = [
    {
      id: 'san_schedule',
      label: 'Sanitation Schedule',
      icon: 'calendar',
      targetRoute: 'Schedule',
      iconBg: '#E3F2FD',
      iconColor: '#1565C0'
    },
    {
      id: 'report_issue',
      label: 'Report an Issue',
      icon: 'complaint',
      targetRoute: 'Complaints',
      iconBg: '#FFF3E0',
      iconColor: '#E65100'
    },
    {
      id: 'gov_schemes',
      label: 'Govt Schemes',
      icon: 'schemes',
      targetRoute: 'Schemes',
      iconBg: '#F3E5F5',
      iconColor: '#6A1B9A'
    },
    {
      id: 'contacts',
      label: 'Important Contacts',
      icon: 'contacts',
      targetRoute: 'Contacts',
      iconBg: '#E0F7FA',
      iconColor: '#00838F'
    },
    {
      id: 'electricity_bill',
      label: 'Pay Electricity Bill',
      icon: 'flash',
      targetRoute: 'ElectricityBill',
      iconBg: '#FFF9C4',
      iconColor: '#F57F17'
    },
    {
      id: 'emergency',
      label: 'Emergency Help',
      icon: 'emergency',
      targetRoute: 'Emergency',
      iconBg: '#FFEBEE',
      iconColor: '#C62828'
    },
  ];

  const handleGridTap = (item: typeof gridItems[0]) => {
    navigation.navigate(item.targetRoute);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header Card */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {/* Avatar circle */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DS</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.welcomeText}>{getGreeting()},</Text>
            <Text style={styles.wardText}>Dharmedra Singh</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationBell}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Notifications')}
        >
          <CustomIcon name="bell" size={20} color={COLORS.textPrimary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Latest Announcement Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Announcement</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Campaigns')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announcementContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            contentContainerStyle={styles.announcementScrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {announcements.map((ann) => (
              <View key={ann.id} style={[styles.announcementCard, { backgroundColor: ann.bgColor, width: CARD_WIDTH }]}>
                <View style={styles.announcementHeader}>
                  <View style={[styles.announcementBadge, { backgroundColor: ann.badgeColor }]}>
                    <Text style={styles.announcementBadgeText}>{ann.badge}</Text>
                  </View>
                  <Text style={styles.announcementTime}>{ann.time}</Text>
                </View>
                <Text style={styles.announcementTitle}>{ann.title}</Text>
                <Text style={styles.announcementBody} numberOfLines={2} ellipsizeMode="tail">
                  {ann.body}
                </Text>
                <TouchableOpacity
                  style={styles.announcementLink}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(ann.targetRoute, ann.params)}
                >
                  <Text style={styles.announcementLinkText}>Read details →</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.paginationContainer}>
            {announcements.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Access Section */}
        <Text style={[styles.sectionTitle, styles.quickAccessHeader]}>Quick Access</Text>

        <View style={styles.gridContainer}>
          {gridItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              activeOpacity={0.65}
              onPress={() => handleGridTap(item)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                <CustomIcon name={item.icon} size={22} color={item.iconColor} />
              </View>
              <Text style={styles.gridLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Water Supply Info Card */}
        {/* <View style={styles.waterCard}>
          <View style={styles.infoTitleRow}>
            <Text style={styles.infoTitle}>💧 Water Supply Schedule</Text>
          </View>
          <Text style={styles.infoBody}>
            Water supply for Ward 18 is active every Tuesday, Thursday, and Saturday from 6:00 AM to 8:30 AM. Please store water responsibly.
          </Text>
        </View> */}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  notificationBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  announcementContainer: {
    marginHorizontal: -20,
    marginBottom: 8,
  },
  announcementScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  announcementCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginRight: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Sleek semi-transparent glassmorphic look
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  announcementBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  announcementTime: {
    color: COLORS.white,
    fontSize: 11,
    opacity: 0.8,
  },
  announcementTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  announcementBody: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.9,
    marginBottom: 14,
  },
  announcementLink: {
    alignSelf: 'flex-start',
  },
  announcementLinkText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  quickAccessHeader: {
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -4,
    marginBottom: 22,
  },
  gridItem: {
    width: (width - 64) / 3,
    marginHorizontal: 4,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14, // Modern rounded square instead of boring circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 2,
  },
  waterCard: {
    backgroundColor: '#F6FAFD', // Soft water blue
    borderColor: '#E1F5FE',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3', // Vibrant water blue
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  infoBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});
