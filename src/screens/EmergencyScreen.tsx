import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EmergencyAlertItem {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
}

export const EmergencyScreen = ({ navigation }: any) => {
  const [isAdminFormVisible, setIsAdminFormVisible] = useState(false);

  // Initial mock alerts list
  const [alerts, setAlerts] = useState<EmergencyAlertItem[]>([
    {
      id: 'alt-1',
      title: 'Flash Flood Warning - Ward 18',
      severity: 'Critical',
      message: 'Heavy rain has caused extreme water logging near NH-29. Residents are advised to stay indoors and avoid low-lying underpasses.',
      timestamp: '10 mins ago',
    },
    {
      id: 'alt-2',
      title: 'High Voltage Power Grid Maintenance',
      severity: 'Warning',
      message: 'Scheduled maintenance work at the primary substation. Power supply will be shut down in Sectors C & D from 1:00 PM to 4:00 PM.',
      timestamp: '2 hours ago',
    },
  ]);

  // Admin form state
  const [adminTitle, setAdminTitle] = useState('');
  const [adminSeverity, setAdminSeverity] = useState<'Critical' | 'Warning' | 'Info'>('Critical');
  const [adminMessage, setAdminMessage] = useState('');

  const handleCreateAlert = () => {
    if (!adminTitle.trim()) {
      Alert.alert('Error', 'Please enter an alert title.');
      return;
    }
    if (!adminMessage.trim()) {
      Alert.alert('Error', 'Please enter alert details/message.');
      return;
    }

    const newAlert: EmergencyAlertItem = {
      id: `alt-${Math.floor(100 + Math.random() * 900)}`,
      title: adminTitle.trim(),
      severity: adminSeverity,
      message: adminMessage.trim(),
      timestamp: 'Just now',
    };

    setAlerts([newAlert, ...alerts]);

    Alert.alert(
      'Alert Published',
      'The emergency alert has been broadcasted and is now visible on the citizens dashboard.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form fields
            setAdminTitle('');
            setAdminSeverity('Critical');
            setAdminMessage('');
            // Hide modal
            setIsAdminFormVisible(false);
          },
        },
      ]
    );
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          bg: '#FFEBEE',
          border: '#FFCDD2',
          text: '#C62828',
          indicator: '#EF5350',
        };
      case 'Warning':
        return {
          bg: '#FFF3E0',
          border: '#FFE0B2',
          text: '#E65100',
          indicator: '#FFA726',
        };
      default:
        return {
          bg: '#E3F2FD',
          border: '#BBDEFB',
          text: '#1565C0',
          indicator: '#42A5F5',
        };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Flat Header same as other screens */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Center</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Alerts Feed */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {alerts.length > 0 ? (
          alerts.map((item) => {
            const stylesSeverity = getSeverityStyle(item.severity);
            return (
              <View
                key={item.id}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: stylesSeverity.bg,
                    borderColor: stylesSeverity.border,
                  },
                ]}
              >
                <View style={styles.alertHeaderRow}>
                  <View style={styles.severityIndicatorContainer}>
                    <View
                      style={[
                        styles.severityDot,
                        { backgroundColor: stylesSeverity.indicator },
                      ]}
                    />
                    <Text style={[styles.severityLabel, { color: stylesSeverity.text }]}>
                      {item.severity} Alert
                    </Text>
                  </View>
                  <Text style={styles.timestampText}>{item.timestamp}</Text>
                </View>

                <Text style={[styles.alertTitle, { color: stylesSeverity.text }]}>
                  {item.title}
                </Text>
                <Text style={styles.alertMessage}>{item.message}</Text>

              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <CustomIcon name="checkmark-circle-outline" size={48} color={COLORS.primary} />
            <Text style={styles.emptyText}>All Clear! No active emergency alerts at this time.</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button for admin alert creation */}
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.85}
        onPress={() => setIsAdminFormVisible(true)}
      >
        <CustomIcon name="megaphone" size={24} color={COLORS.white} />
      </TouchableOpacity>

      {/* Broadcast Form Bottom Sheet Modal */}
      <Modal
        visible={isAdminFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAdminFormVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.formTitle}>Broadcast Emergency Warning</Text>
              <TouchableOpacity onPress={() => setIsAdminFormVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formSubtitle}>
                Alerts published here will immediately broadcast to all citizen dashboards.
              </Text>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alert Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Landslide Road Blockage NH-29"
                  placeholderTextColor={COLORS.greyMedium}
                  value={adminTitle}
                  onChangeText={setAdminTitle}
                />
              </View>

              {/* Severity Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Severity Level</Text>
                <View style={styles.severitySelectorContainer}>
                  {(['Critical', 'Warning', 'Info'] as const).map((level) => {
                    const isSelected = adminSeverity === level;
                    
                    let activeChipStyle = styles.chipInfoActive;
                    let activeTextStyle = styles.textInfoActive;
                    
                    if (level === 'Critical') {
                      activeChipStyle = styles.chipCriticalActive;
                      activeTextStyle = styles.textCriticalActive;
                    } else if (level === 'Warning') {
                      activeChipStyle = styles.chipWarningActive;
                      activeTextStyle = styles.textWarningActive;
                    }

                    return (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.severityChip,
                          isSelected && activeChipStyle,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setAdminSeverity(level)}
                      >
                        <Text
                          style={[
                            styles.severityChipText,
                            isSelected && activeTextStyle,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Description Message */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Detailed Message & Instructions</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Avoid NH-29 bypass road due to active landslide. Use Alternate Main Bazar route instead..."
                  placeholderTextColor={COLORS.greyMedium}
                  multiline
                  numberOfLines={4}
                  value={adminMessage}
                  onChangeText={setAdminMessage}
                />
              </View>
              {/* Publish Action */}
              <TouchableOpacity
                style={styles.publishBtn}
                activeOpacity={0.8}
                onPress={handleCreateAlert}
              >
                <Text style={styles.publishBtnText}>Publish Broadcast</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  alertCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  severityLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  timestampText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  alertMessage: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 12,
  },
  alertFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 8,
  },
  issuerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  issuerName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  modalCloseText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    padding: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: COLORS.greyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  severitySelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: COLORS.greyLight,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  severityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  publishBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  chipCriticalActive: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
  },
  chipWarningActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#E65100',
  },
  chipInfoActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1565C0',
  },
  textCriticalActive: {
    color: '#C62828',
    fontWeight: '800',
  },
  textWarningActive: {
    color: '#E65100',
    fontWeight: '800',
  },
  textInfoActive: {
    color: '#1565C0',
    fontWeight: '800',
  },
});
