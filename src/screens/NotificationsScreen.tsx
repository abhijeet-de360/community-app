import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'success' | 'info' | 'alert';
  read: boolean;
}

export const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Water Connection Approved',
      body: 'Your pipeline installation request under Jal Jeevan Mission has been approved. Ward technicians will visit on Tuesday.',
      time: '2 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: 'n2',
      title: 'Complaints Update - Garbage Pile',
      body: 'The garbage pile complaint filed for Ward 18 market has been marked as In Progress. Cleaning crew has been dispatched.',
      time: '5 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: 'n3',
      title: 'Property Sanitation Tax Reminder',
      body: 'Sanitation fees for the current quarter are due by July 31. Avoid late fees by paying online in the Payments tab.',
      time: '1 day ago',
      type: 'alert',
      read: true,
    },
    {
      id: 'n4',
      title: 'Welcome to Community App!',
      body: 'Your account has been successfully verified. Explore schemes, file ward complaints, and stay informed.',
      time: '3 days ago',
      type: 'success',
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle-outline', color: COLORS.primary, bg: COLORS.secondary };
      case 'alert':
        return { name: 'emergency', color: COLORS.danger, bg: '#FFEBEE' };
      default:
        return { name: 'profile', color: '#1565C0', bg: '#E3F2FD' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Flat Header same as others */}
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

      {/* Mark all as read section */}
      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>Recent Updates</Text>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const iconConfig = getIconConfig(item.type);
          return (
            <TouchableOpacity
              style={[styles.notificationCard, !item.read && styles.unreadCard]}
              activeOpacity={0.8}
              onPress={() => toggleRead(item.id)}
            >
              {/* Type Indicator Icon */}
              <View style={[styles.iconWrapper, { backgroundColor: iconConfig.bg }]}>
                <CustomIcon name={iconConfig.name} size={18} color={iconConfig.color} />
              </View>

              {/* Text Context */}
              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text style={[styles.cardTitle, !item.read && styles.unreadText]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardBody} numberOfLines={3}>
                  {item.body}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomIcon name="bell" size={48} color={COLORS.greyMedium} />
            <Text style={styles.emptyText}>You have no notifications at this time.</Text>
          </View>
        }
      />
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
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // Soft shadow
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
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
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
