import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchSanitationSchedule } from '../store/sanitationSlice';
import { updateReminderToggle } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { Skeleton } from '../components/Skeleton';

export const ScheduleScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { weeklySchedule, scheduleChanges, loading } = useSelector((state: RootState) => state.sanitation);
  const { user } = useSelector((state: RootState) => state.auth);

  const getTodayDayName = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  const [reminderEnabled, setReminderEnabled] = useState(user?.reminderEnabled || false);
  const [selectedDay, setSelectedDay] = useState(getTodayDayName());
  const [feedbackModal, setFeedbackModal] = useState<{ visible: boolean; title: string; desc: string; type: 'success' | 'disabled' | 'error' }>({
    visible: false,
    title: '',
    desc: '',
    type: 'success',
  });

  useEffect(() => {
    if (user && user.reminderEnabled !== undefined) {
      setReminderEnabled(Boolean(user.reminderEnabled));
    }
  }, [user]);

  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;

  useEffect(() => {
    dispatch(fetchSanitationSchedule({ wardId }));
  }, [dispatch, wardId]);

  const toggleReminder = async (value: boolean) => {
    setReminderEnabled(value);
    try {
      await dispatch(updateReminderToggle(value) as any);
      if (value) {
        setFeedbackModal({
          visible: true,
          title: 'Reminder Enabled',
          desc: 'You will receive a notification 2 hours before scheduled collection times.',
          type: 'success',
        });
      } else {
        setFeedbackModal({
          visible: true,
          title: 'Reminder Disabled',
          desc: 'Collection reminders have been turned off.',
          type: 'disabled',
        });
      }
    } catch (err) {
      setReminderEnabled(!value);
      setFeedbackModal({
        visible: true,
        title: 'Update Failed',
        desc: 'Could not update reminder setting. Please check your connection.',
        type: 'error',
      });
    }
  };

  const daysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Dynamically calculate dates of current week
  const getWeekDates = () => {
    const current = new Date();
    const currentDay = current.getDay(); // 0 = Sun
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(current);
    monday.setDate(current.getDate() + distanceToMonday);

    const mapDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return mapDays.map((dayName, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);

      const found = Array.isArray(weeklySchedule)
        ? weeklySchedule.find((s) => s.day.toLowerCase() === dayName.toLowerCase())
        : null;

      const isOff = found ? found.isOff : false;
      const time = found ? found.time : '08:00 AM';

      return {
        day: dayName,
        active: !isOff,
        time: isOff ? 'N/A' : time,
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
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collection Schedule</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View>
            <Skeleton height={120} borderRadius={24} style={{ marginBottom: 24 }} />
            <Skeleton width={130} height={20} borderRadius={6} style={{ marginBottom: 16 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 }}>
              {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                <Skeleton key={k} width={40} height={65} borderRadius={50} />
              ))}
            </View>
            <Skeleton width={160} height={20} borderRadius={6} style={{ marginBottom: 14 }} />
            <Skeleton height={140} borderRadius={16} style={{ marginBottom: 20 }} />
            <Skeleton height={70} borderRadius={16} />
          </View>
        ) : (
          <>
            {/* Preparation Alert Callout Box */}
            <View style={styles.warningCallout}>
              <Text style={styles.warningText}>
                Keep your waste bins sorted and ready outside <Text style={styles.boldText}>before the scheduled time</Text> on collection days.
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
            <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Collection Details ({selectedDay})</Text>
            <View style={styles.upcomingCard}>
              {scheduleWithDates.find((d) => d.day === selectedDay)?.active ? (
                <View style={styles.upcomingRow}>
                  <View>
                    <Text style={styles.upcomingDay}>{selectedDay}</Text>
                    <Text style={styles.upcomingType}>Waste Collection Scheduled</Text>
                    <Text style={styles.upcomingTime}>
                      {scheduleWithDates.find((d) => d.day === selectedDay)?.time}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: COLORS.secondary }]}>
                    <Text style={{ color: COLORS.primary, fontSize: 10, fontWeight: '800' }}>ACTIVE</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.upcomingRow}>
                  <View>
                    <Text style={styles.upcomingDay}>{selectedDay}</Text>
                    <Text style={styles.upcomingType}>No Collection Scheduled</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={{ color: '#DC2626', fontSize: 10, fontWeight: '800' }}>OFF</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Registered Schedule Adjustments & Overrides */}
            {Array.isArray(scheduleChanges) && scheduleChanges.length > 0 ? (
              <View style={{ marginTop: 24 }}>
                <Text style={styles.sectionTitle}>Registered Schedule Adjustments & Overrides</Text>
                {scheduleChanges.map((change: any, idx: number) => (
                  <View key={change._id || change.id || idx} style={[styles.alterationAlertBox, { marginBottom: 10 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 13, fontWeight: '800', color: '#D84315' }}>
                        📅 {change.date} • {change.time}
                      </Text>
                      <View style={[styles.statusBadge, styles.badgeAltered]}>
                        <Text style={styles.badgeTextAltered}>OVERRIDE</Text>
                      </View>
                    </View>
                    {change.reason ? (
                      <Text style={styles.alterationAlertText}>
                        Reason: {change.reason}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : null}

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
          </>
        )}
      </ScrollView>

      {/* Custom Feedback Modal */}
      <Modal
        visible={feedbackModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFeedbackModal((prev) => ({ ...prev, visible: false }))}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFeedbackModal((prev) => ({ ...prev, visible: false }))}
        >
          <View style={styles.modalContent}>
            <View style={[styles.modalIconBg, (feedbackModal.type === 'disabled' || feedbackModal.type === 'error') ? styles.modalIconBgError : styles.modalIconBgSuccess]}>
              <CustomIcon
                name={feedbackModal.type === 'success' ? 'check' : feedbackModal.type === 'disabled' ? 'bell-off' : 'close'}
                size={22}
                color={(feedbackModal.type === 'disabled' || feedbackModal.type === 'error') ? '#DC2626' : COLORS.primary}
              />
            </View>
            <Text style={styles.modalTitle}>{feedbackModal.title}</Text>
            <Text style={styles.modalDesc}>{feedbackModal.desc}</Text>
            <TouchableOpacity
              style={[styles.modalButton, (feedbackModal.type === 'disabled' || feedbackModal.type === 'error') && { backgroundColor: '#DC2626' }]}
              activeOpacity={0.8}
              onPress={() => setFeedbackModal((prev) => ({ ...prev, visible: false }))}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    fontWeight: '800',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconBgSuccess: {
    backgroundColor: COLORS.secondary,
  },
  modalIconBgError: {
    backgroundColor: '#FEE2E2',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
