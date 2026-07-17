import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';

interface ComplaintItem {
  id: string;
  category: string;
  location: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Cancelled';
  date: string;
}

// Native launchImageLibrary will be used to select photos

export const ComplaintsScreen = ({ navigation }: any) => {
  // State for form
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  // State for reported complaints list
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
    {
      id: 'COM-9824',
      category: 'Street Light',
      location: 'Ward 18, near Central Park',
      description: 'Street lamp is flickering and completely dark at night.',
      status: 'In Progress',
      date: 'July 15, 2026',
    },
    {
      id: 'COM-9781',
      category: 'Garbage Dump',
      location: 'Main Bazar Road, Opp. SBI Bank',
      description: 'Large pile of plastic and organic waste accumulated near the corner.',
      status: 'Resolved',
      date: 'July 12, 2026',
    },
  ]);

  // Repeated/Common complaint categories definition
  const categories = [
    {
      id: 'water',
      label: 'Water Logging',
      image: require('../../assets/graphics/water.png'),
      iconColor: '#006064',
      bgColor: '#E0F7FA',
    },
    {
      id: 'electricity',
      label: 'No Electricity',
      image: require('../../assets/graphics/electricity.png'),
      iconColor: '#E65100',
      bgColor: '#FFF9C4',
    },
    {
      id: 'garbage',
      label: 'Garbage Dump',
      image: require('../../assets/graphics/garbage.png'),
      iconColor: '#6A1B9A',
      bgColor: '#F3E5F5',
    },
    {
      id: 'light',
      label: 'Street Light',
      image: require('../../assets/graphics/street-light.png'),
      iconColor: '#BF360C',
      bgColor: '#FFE0B2',
    },
    {
      id: 'road',
      label: 'Road Damage',
      image: require('../../assets/graphics/road.png'),
      iconColor: '#C62828',
      bgColor: '#FFEBEE',
    },
    {
      id: 'other',
      label: 'Other Issues',
      icon: 'ellipsis-horizontal',
      iconColor: '#1B5E20',
      bgColor: '#E8F5E9',
    },
  ];

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category first.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please specify the location or landmark.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a brief description.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network submission delay
    setTimeout(() => {
      const newId = `COM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newComplaint: ComplaintItem = {
        id: newId,
        category: selectedCategory,
        location: location.trim(),
        description: description.trim(),
        status: 'Pending',
        date: 'Today',
      };

      setComplaints([newComplaint, ...complaints]);
      setIsSubmitting(false);

      Alert.alert(
        'Complaint Filed Successfully',
        `Your complaint for "${selectedCategory}" has been logged under ID ${newId}. Our ward officer will verify it soon.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form fields
              setSelectedCategory(null);
              setLocation('');
              setDescription('');
              setSelectedFile(null);
            },
          },
        ]
      );
    }, 1500);
  };

  const handleUploadPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedFile({
            name: asset.fileName || 'photo.jpg',
            size: asset.fileSize
              ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB`
              : 'Unknown Size',
            uri: asset.uri,
          });
        }
      }
    );
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      'Cancel Complaint',
      'Are you sure you want to cancel this complaint?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setComplaints(prevComplaints =>
              prevComplaints.map(item =>
                item.id === id ? { ...item, status: 'Cancelled' } : item
              )
            );
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'In Progress':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'Cancelled':
        return { bg: '#F5F5F5', text: '#757575' };
      default:
        return { bg: '#FFF3E0', text: '#E65100' };
    }
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
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Title Section */}
          <View style={styles.introContainer}>
            <Text style={styles.mainTitle}>Community Complaints</Text>
            <Text style={styles.subTitle}>
              Select a category to report local municipal issues instantly.
            </Text>
          </View>

          {/* Grid Categories */}
          <View style={styles.gridContainer}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.label;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.gridCard,
                    { backgroundColor: cat.bgColor },
                    isSelected && styles.gridCardSelected,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedCategory(cat.label)}
                >
                  <View style={styles.iconCircle}>
                    {cat.image ? (
                      <Image source={cat.image} style={styles.iconImage} resizeMode="contain" />
                    ) : (
                      <CustomIcon name={cat.icon || ''} size={22} color={cat.iconColor} />
                    )}
                  </View>
                  <Text style={[styles.cardLabel, { color: COLORS.textPrimary }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Active Complaint Filing Form */}
          {selectedCategory && (
            <View style={styles.formCard}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Report: {selectedCategory}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedCategory(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location / Nearest Landmark</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Near Park Lane Metro Gate 2"
                  placeholderTextColor={COLORS.greyMedium}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Describe the issue</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Provide details about the issue (e.g. leaking water pipe for last 3 days)..."
                  placeholderTextColor={COLORS.greyMedium}
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Photo Upload Area */}
              {selectedFile ? (
                <View style={styles.selectedFileContainer}>
                  <Image source={{ uri: selectedFile.uri }} style={styles.selectedFileThumbnail} resizeMode="cover" />
                  <View style={styles.selectedFileDetails}>
                    <Text style={styles.selectedFileName} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text style={styles.selectedFileSize}>{selectedFile.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeFileBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedFile(null);
                    }}
                  >
                    <Text style={styles.removeFileText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.photoButton}
                  activeOpacity={0.8}
                  onPress={handleUploadPhoto}
                >
                  <CustomIcon
                    name="camera"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.photoText}>
                    Upload Photo (Optional)
                  </Text>
                </TouchableOpacity>
              )}

              {/* Submit Action */}
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.8}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Complaint</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Recent Reports List */}
          <View style={styles.historyContainer}>
            <Text style={styles.sectionHeaderTitle}>Recent Filed Issues</Text>
            {complaints.map((item) => {
              const statusStyle = getStatusColor(item.status);
              return (
                <View key={item.id} style={styles.complaintCard}>
                  <View style={styles.complaintCardHeader}>
                    <Text style={styles.complaintCategory}>{item.category}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.complaintLocation}>📍 {item.location}</Text>
                  <Text style={styles.complaintDesc}>{item.description}</Text>
                  <View style={styles.complaintFooter}>
                    <View>
                      <Text style={styles.complaintId}>{item.id}</Text>
                      <Text style={styles.complaintDate}>{item.date}</Text>
                    </View>
                    {item.status === 'Pending' && (
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => handleCancel(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  introContainer: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: '31%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    // Premium soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  gridCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.greyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
    marginBottom: 18,
    borderStyle: 'dashed',
  },
  photoButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderStyle: 'solid',
  },
  photoText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  photoTextActive: {
    color: '#2E7D32',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  historyContainer: {
    marginTop: 10,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  complaintCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  complaintCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintCategory: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  complaintLocation: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  complaintDesc: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    paddingTop: 8,
  },
  complaintId: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.greyMedium,
  },
  complaintDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    padding: 12,
    marginBottom: 18,
    marginTop: 6,
  },
  selectedFileThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedFileDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  selectedFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  selectedFileSize: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 1,
  },
  removeFileBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  removeFileText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C62828',
    textTransform: 'uppercase',
  },
});
