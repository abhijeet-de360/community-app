import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '../components/Skeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export const DashboardScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { user } = useSelector((state: any) => state.auth);
  const { announcements, loading } = useSelector((state: any) => state.announcement);
  const { unreadCount } = useSelector((state: any) => state.notification);

  const colors = ['#028A3C', '#0F766E', '#1E40AF', '#B45309', '#6B21A8'];

  const handleScroll = (event: any) => {
    const slideSize = CARD_WIDTH + 12;
    const count = Array.isArray(announcements) ? announcements.length : 0;
    if (count === 0) return;
    const index = Math.max(
      0,
      Math.min(
        count - 1,
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
      id: 'campaigns',
      label: 'Campaigns',
      icon: 'campaign',
      targetRoute: 'Campaigns',
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32'
    },
    // {
    //   id: 'report_issue',
    //   label: 'Report an Issue',
    //   icon: 'complaint',
    //   targetRoute: 'Complaints',
    //   iconBg: '#FFF3E0',
    //   iconColor: '#E65100'
    // },
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
        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Profile')}
        >
          {/* Avatar circle */}
          <View style={styles.avatar}>
            {user?.profile ? (
              <Image source={{ uri: user.profile }} style={styles.avatarImage} />
            ) : (
              null
            )}
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.welcomeText}>{getGreeting()},</Text>
            <Text style={styles.wardText}>{user?.name}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notificationBell}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Notifications')}
        >
          <CustomIcon name="bell" size={20} color={COLORS.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Latest Announcement Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Announcement</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('LatestAnnouncements')}
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
            {loading ? (
              <View style={[styles.announcementCard, { backgroundColor: '#F1F5F9', width: CARD_WIDTH, padding: 16 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Skeleton width={70} height={20} borderRadius={6} />
                  <Skeleton width={80} height={16} borderRadius={4} />
                </View>
                <Skeleton width="80%" height={22} borderRadius={6} style={{ marginBottom: 8 }} />
                <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 14 }} />
                <Skeleton width={100} height={18} borderRadius={4} />
              </View>
            ) : Array.isArray(announcements) && announcements.length > 0 ? (
              announcements.map((ann: any, idx: number) => (
                <View key={ann._id || ann.id || idx} style={[styles.announcementCard, { backgroundColor: colors[idx % colors.length], width: CARD_WIDTH }]}>
                  <View style={styles.announcementHeader}>
                    <View style={[styles.announcementBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                      <Text style={styles.announcementBadgeText}>{(ann.category || 'NOTICE').toUpperCase()}</Text>
                    </View>
                    <Text style={styles.announcementTime}>
                      {ann.createdAt ? new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                    </Text>
                  </View>
                  <Text style={styles.announcementTitle}>{ann.title}</Text>
                  <Text style={styles.announcementBody} numberOfLines={2} ellipsizeMode="tail">
                    {ann.description || ann.body || ''}
                  </Text>
                  <TouchableOpacity
                    style={styles.announcementLink}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('LatestAnnouncements')}
                  >
                    <Text style={styles.announcementLinkText}>Read details →</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={[styles.announcementCard, { backgroundColor: '#028A3C', width: CARD_WIDTH }]}>
                <View style={styles.announcementHeader}>
                  <View style={[styles.announcementBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                    <Text style={styles.announcementBadgeText}>INFO</Text>
                  </View>
                </View>
                <Text style={styles.announcementTitle}>No Announcements</Text>
                <Text style={styles.announcementBody}>There are no announcements for your ward right now.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.paginationContainer}>
            {Array.isArray(announcements) && announcements.length > 1 && announcements.map((_, index) => (
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
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
