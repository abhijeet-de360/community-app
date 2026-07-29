import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppDispatch, RootState } from '../store/store';
import {
  markNotificationRead,
  markAllNotificationsRead,
  INotificationItem,
  NotificationType,
} from '../store/notificationSlice';
import { Skeleton } from '../components/Skeleton';

// ─── Icon config by type ──────────────────────────────────────────────────────

const getIconConfig = (type: NotificationType) => {
  switch (type) {
    case 'EmergencyAlert':
      return { name: 'emergency', color: '#C62828', bg: '#FFEBEE' };
    case 'Announcement':
      return { name: 'announcement', color: '#1565C0', bg: '#E3F2FD' };
    case 'Campaign':
      return { name: 'campaign', color: '#2E7D32', bg: '#E8F5E9' };
    case 'GovtScheme':
      return { name: 'schemes', color: '#6A1B9A', bg: '#F3E5F5' };
    case 'SanitationSchedule':
    case 'ScheduleChange':
      return { name: 'calendar', color: '#E65100', bg: '#FFF3E0' };
    default:
      return { name: 'bell', color: COLORS.primary, bg: COLORS.secondary };
  }
};

const formatTime = (createdAt?: string) => {
  if (!createdAt) return '';
  const diff = Date.now() - new Date(createdAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <View style={[styles.card, { gap: 8 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: 12 }} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton width="70%" height={16} borderRadius={4} />
        <Skeleton width="100%" height={14} borderRadius={4} />
        <Skeleton width="40%" height={14} borderRadius={4} />
        <Skeleton width={60} height={12} borderRadius={4} style={{ marginTop: 4 }} />
      </View>
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export const NotificationsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notification
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;
  const userId = user?._id ? String(user._id) : undefined;

  const handleMarkOneRead = (item: INotificationItem) => {
    if (!item.isRead && userId) {
      dispatch(markNotificationRead(item._id, userId));
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead({ wardId, userId }));
  };

  const renderItem = ({ item }: { item: INotificationItem }) => {
    const iconConfig = getIconConfig(item.type);
    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.unreadCard]}
        activeOpacity={0.8}
        onPress={() => handleMarkOneRead(item)}
      >
        {/* Icon */}
        <View style={[styles.iconWrapper, { backgroundColor: iconConfig.bg }]}>
          <CustomIcon name={iconConfig.name} size={18} color={iconConfig.color} />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.cardTitle, !item.isRead && styles.unreadTitle]} numberOfLines={2}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardBody} numberOfLines={3}>{item.message}</Text>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>
          Recent Updates{unreadCount > 0 ? ` · ${unreadCount} new` : ''}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(i) => String(i)}
          contentContainerStyle={styles.listContent}
          renderItem={() => <SkeletonRow />}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomIcon name="bell" size={48} color={COLORS.greyMedium} />
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          }
        />
      )}
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
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadCard: {
    borderColor: COLORS.secondary,
    backgroundColor: '#FAFCFB',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    flexShrink: 0,
  },
  cardBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});
