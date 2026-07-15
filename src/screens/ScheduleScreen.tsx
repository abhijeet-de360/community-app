import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

export const ScheduleScreen = ({ navigation }: any) => {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');

  const toggleReminder = (value: boolean) => {
    setReminderEnabled(value);
    if (value) {
      Alert.alert(
        'Reminder Enabled',
        'You will receive a notification 2 hours before the scheduled collection time.'
      );
    } else {
      Alert.alert('Reminder Disabled', 'Collection reminders have been turned off.');
    }
  };

  const weeklySchedule = [
    { 
      day: 'Monday', 
      active: true, 
      type: 'Organic & Wet Waste', 
      time: '7:30 AM', 
      altered: false 
    },
    { 
      day: 'Tuesday', 
      active: false, 
      type: 'No Collection', 
      time: 'N/A', 
      altered: false 
    },
    { 
      day: 'Wednesday', 
      active: true, 
      type: 'Dry & Recyclables', 
      time: '7:30 AM', 
      altered: false 
    },
    { 
      day: 'Thursday', 
      active: true, 
      type: 'Organic & Wet Waste', 
      time: '8:30 AM', 
      altered: true, 
      originalTime: '7:30 AM',
      reason: 'Delayed by 1 hr this week due to NH-29 construction.'
    },
    { 
      day: 'Friday', 
      active: false, 
      type: 'No Collection', 
      time: 'N/A', 
      altered: false 
    },
    { 
      day: 'Saturday', 
      active: true, 
      type: 'Hazardous & E-Waste', 
      time: '8:00 AM', 
      altered: false 
    },
    { 
      day: 'Sunday', 
      active: false, 
      type: 'No Collection', 
      time: 'N/A', 
      altered: false 
    },
  ];

  // Dynamically calculate dates of the current week (Monday to Sunday)
  const getWeekDates = () => {
    const current = new Date();
    const currentDay = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);
    
    return weeklySchedule.map((item, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      return {
        ...item,
        dateNum: dayDate.getDate(),
      };
    });
  };

  const scheduleWithDates = getWeekDates();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collection Schedule</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Preparation Alert Callout Box */}
        <View style={styles.warningCallout}>
          <Text style={styles.warningText}>
            Keep your waste bins sorted and ready outside before <Text style={styles.boldText}>8:00 AM</Text> on collection days.
          </Text>
          <Text style={styles.warningSubtext}>
            Proper sorting helps our municipal teams process waste efficiently.
          </Text>
        </View>

        {/* Collection Days Horizontal Chips Selector */}
        <Text style={[styles.sectionTitle, styles.selectorTitle]}>Collection Days</Text>
        <View style={styles.daySelectorContainer}>
          {scheduleWithDates.map((item) => {
            const isSelected = selectedDay === item.day;
            return (
              <TouchableOpacity
                key={item.day}
                style={[
                  styles.dayChip,
                  item.active ? styles.dayChipActive : styles.dayChipInactive,
                  isSelected && styles.dayChipSelected
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedDay(item.day)}
              >
                <Text style={[
                  styles.dayChipLabel,
                  item.active ? styles.dayChipTextActive : styles.dayChipTextInactive
                ]}>
                  {item.day.substring(0, 3)}
                </Text>
                <Text style={[
                  styles.dayChipNumber,
                  item.active ? styles.dayChipTextActive : styles.dayChipTextInactive
                ]}>
                  {item.dateNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Collection banner card */}
        <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Upcoming Collection</Text>
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingRow}>
            <View>
              <Text style={styles.upcomingDay}>Tomorrow, Thursday</Text>
              <Text style={styles.upcomingType}>Organic & Wet Waste</Text>
              <Text style={styles.upcomingTime}>8:30 AM (Modified Time)</Text>
            </View>
            <View style={[styles.statusBadge, styles.badgeAltered]}>
              <Text style={styles.badgeTextAltered}>ALTERED</Text>
            </View>
          </View>
          {/* Reschedule Alert Notification message */}
          <View style={styles.alterationAlertBox}>
            <Text style={styles.alterationAlertText}>
              ⚠️ Thursday collection is delayed by 1 hour due to NH-29 construction.
            </Text>
          </View>
        </View>

        {/* Reminder Settings Card */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderRow}>
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>Reminder</Text>
              <Text style={styles.reminderDesc}>Get notified 2 hours before bin collection times</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={toggleReminder}
              trackColor={{ false: '#D1DCD6', true: COLORS.secondary }}
              thumbColor={reminderEnabled ? COLORS.primary : '#FFF'}
            />
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  warningCallout: {
    backgroundColor: COLORS.primary,
    borderRadius: 24, // Premium squircle look
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    // marginBottom: 26,
    // Premium soft elevation shadow matching primary green
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  lottieBackdrop: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.12)', // Subtle glassmorphic glow
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  lottieImage: {
    width: 76,
    height: 76,
  },
  warningText: {
    fontSize: 15,
    color: COLORS.white,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  boldText: {
    fontWeight: '900',
    color: '#A7FFD0', // Glowing neon-mint
  },
  warningSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)', // Semi-transparent subtitle
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  selectorTitle: {
    marginTop: 26,
    marginBottom: 16,
  },
  upcomingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  upcomingDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  upcomingType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  upcomingTime: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAltered: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  badgeTextAltered: {
    color: COLORS.warning,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  alterationAlertBox: {
    backgroundColor: '#FDF4F0',
    borderColor: '#FBE2D5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  alterationAlertText: {
    fontSize: 12,
    color: '#D84315',
    lineHeight: 16,
    fontWeight: '500',
  },
  reminderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 20,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  reminderDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  daySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayChip: {
    flex: 1,
    height: 65, // Expand height to stack day + date number
    marginHorizontal: 3,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayChipActive: {
    backgroundColor: COLORS.primary, // Rich dark green
  },
  dayChipInactive: {
    backgroundColor: '#db4444ff', // Rich dark red for inactive collection
  },
  dayChipSelected: {
    borderColor: '#005e33ff', // Dark outline to indicate selection clearly
    borderWidth: 2.5,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dayChipLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    opacity: 0.9,
  },
  dayChipNumber: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  dayChipTextActive: {
    color: COLORS.white,
  },
  dayChipTextInactive: {
    color: COLORS.white, // White text for red background
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  detailCardAlteredBorder: {
    borderColor: '#FFCC80',
  },
  detailCardInactive: {
    backgroundColor: '#F9FAF9',
    borderColor: COLORS.border,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
    marginBottom: 14,
  },
  detailDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  detailTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  detailTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
  detailInactiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BA8080',
    textTransform: 'uppercase',
  },
  detailBody: {
    width: '100%',
  },
  detailTypeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailTypeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  detailAlteredBox: {
    backgroundColor: '#FFFBEA',
    borderColor: '#FFEAA1',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
  },
  detailAlteredTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8A5D00',
    marginBottom: 2,
  },
  detailAlteredText: {
    fontSize: 12,
    color: '#8A5D00',
    lineHeight: 16,
  },
  detailNoCollectionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  textAltered: {
    color: COLORS.warning,
  },
  textMuted: {
    color: COLORS.greyMedium,
    textDecorationLine: 'line-through',
  },
});
