import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { fetchAnnouncements } from '../store/announcementSlice';
import { AppDispatch, RootState } from '../store/store';
import { Skeleton } from '../components/Skeleton';

export const AnnouncementsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { announcements, loading } = useSelector((state: RootState) => state.announcement);
  const { user } = useSelector((state: RootState) => state.auth);

  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;

  useEffect(() => {
    dispatch(fetchAnnouncements({ wardId }));
  }, [dispatch, wardId]);

  const colors = ['#028A3C', '#0F766E', '#1E40AF', '#B45309', '#6B21A8'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Latest Announcements</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Loading Indicator */}
        {loading ? (
          <View style={styles.listContainer}>
            {[1, 2, 3].map((key) => (
              <View key={key} style={styles.card}>
                <Skeleton height={140} borderRadius={12} style={{ marginBottom: 14 }} />
                <View style={styles.cardHeader}>
                  <Skeleton width={80} height={20} borderRadius={6} />
                  <Skeleton width={90} height={16} borderRadius={4} />
                </View>
                <Skeleton width="75%" height={22} borderRadius={6} style={{ marginBottom: 8 }} />
                <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                <Skeleton width="60%" height={16} borderRadius={4} />
              </View>
            ))}
          </View>
        ) : Array.isArray(announcements) && announcements.length > 0 ? (
          <View style={styles.listContainer}>
            {announcements.map((item: any, idx: number) => (
              <View key={item._id || item.id || idx} style={styles.card}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                ) : null}
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: colors[idx % colors.length] }]}>
                    <Text style={styles.badgeText}>{(item.category || 'NOTICE').toUpperCase()}</Text>
                  </View>
                  <Text style={styles.dateText}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description || item.body || ''}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No announcements found for your ward.</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.background,
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
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
    marginBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 14,
    objectFit: 'cover',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
