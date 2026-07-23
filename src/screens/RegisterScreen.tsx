import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { launchImageLibrary } from 'react-native-image-picker';
import { requestStoragePermission } from '../utils/permissionManager';

const WARD_OPTIONS = [
  'Ward 18 - New Reserve',
  'Ward 18 - Kohima Town',
  'Ward 18 - Cathedral Area',
  'Ward 18 - High School Hill',
  'Ward 18 - Lerie Sector',
];

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [epicNumber, setEpicNumber] = useState('');
  const [ward, setWard] = useState('');
  const [address, setAddress] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [voterCardFront, setVoterCardFront] = useState<string | null>(null);
  const [voterCardBack, setVoterCardBack] = useState<string | null>(null);

  const handlePickPhoto = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery access is required to select a profile photo.');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]?.uri) {
          setProfilePhoto(response.assets[0].uri);
        }
      }
    );
  };

  const handlePickVoterCard = async (side: 'front' | 'back') => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Gallery access is required to select voter card photos.');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]?.uri) {
          if (side === 'front') {
            setVoterCardFront(response.assets[0].uri);
          } else {
            setVoterCardBack(response.assets[0].uri);
          }
        }
      }
    );
  };

  // Focus states for modern visual input highlights
  const [nameFocused, setNameFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);
  const [epicFocused, setEpicFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  const handleRegister = () => {
    if (!profilePhoto) {
      Alert.alert('Validation Error', 'Please upload a profile photo.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!epicNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter your EPIC (Voter ID) number.');
      return;
    }
    if (!voterCardFront) {
      Alert.alert('Validation Error', 'Please upload the front side of your voter card.');
      return;
    }
    if (!voterCardBack) {
      Alert.alert('Validation Error', 'Please upload the back side of your voter card.');
      return;
    }
    if (!ward) {
      Alert.alert('Validation Error', 'Please select your ward/area.');
      return;
    }
    if (!agreed) {
      Alert.alert('Validation Error', 'Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    // Navigate to Pending Screen for profile verification
    navigation.replace('Pending');
  };

  const selectWard = (selected: string) => {
    setWard(selected);
    setShowWardModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Circular Back Button in Left Top Corner */}
        <TouchableOpacity
          style={styles.backButtonCircle}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Intro Title */}
          <Text style={styles.introTitle}>Create Account</Text>
          
          {/* Subtitle */}
          <Text style={styles.sectionSubtitle}>
            Please fill in your details to register as a citizen in Ward 18.
          </Text>

          {/* Profile Photo Selection */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              activeOpacity={0.8}
              onPress={handlePickPhoto}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <CustomIcon name="profile" size={36} color={COLORS.greyMedium} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <CustomIcon
                  name={profilePhoto ? 'create' : 'add'}
                  size={12}
                  color={COLORS.white}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarLabel}>
              {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'} <Text style={{ color: COLORS.danger }}>*</Text>
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              nameFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="profile" size={18} color={nameFocused ? COLORS.primary : COLORS.greyMedium} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>

            {/* Mobile Number */}
            <Text style={styles.label}>Mobile Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              mobileFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="phone" size={18} color={mobileFocused ? COLORS.primary : COLORS.greyMedium} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                onFocus={() => setMobileFocused(true)}
                onBlur={() => setMobileFocused(false)}
              />
            </View>

            {/* EPIC Number */}
            <Text style={styles.label}>EPIC (Voter ID) Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              epicFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="card" size={18} color={epicFocused ? COLORS.primary : COLORS.greyMedium} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. ABC1234567"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="characters"
                value={epicNumber}
                onChangeText={setEpicNumber}
                onFocus={() => setEpicFocused(true)}
                onBlur={() => setEpicFocused(false)}
              />
            </View>

            {/* Voter Card Images (Front & Back) */}
            <Text style={styles.label}>Voter Card Photos (Front & Back) <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={styles.voterCardRow}>
              {/* Front Side */}
              <TouchableOpacity
                style={styles.voterCardContainer}
                activeOpacity={0.8}
                onPress={() => handlePickVoterCard('front')}
              >
                {voterCardFront ? (
                  <View style={styles.voterCardImageContainer}>
                    <Image source={{ uri: voterCardFront }} style={styles.voterCardImage} />
                    <View style={styles.voterCardBadge}>
                      <CustomIcon name="create" size={10} color={COLORS.white} />
                    </View>
                    <Text style={styles.voterCardActiveLabel}>Front Side</Text>
                  </View>
                ) : (
                  <View style={styles.voterCardPlaceholder}>
                    <CustomIcon name="card" size={24} color={COLORS.greyMedium} />
                    <Text style={styles.voterCardPlaceholderTitle}>Front Side</Text>
                    <Text style={styles.voterCardPlaceholderSub}>Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Back Side */}
              <TouchableOpacity
                style={styles.voterCardContainer}
                activeOpacity={0.8}
                onPress={() => handlePickVoterCard('back')}
              >
                {voterCardBack ? (
                  <View style={styles.voterCardImageContainer}>
                    <Image source={{ uri: voterCardBack }} style={styles.voterCardImage} />
                    <View style={styles.voterCardBadge}>
                      <CustomIcon name="create" size={10} color={COLORS.white} />
                    </View>
                    <Text style={styles.voterCardActiveLabel}>Back Side</Text>
                  </View>
                ) : (
                  <View style={styles.voterCardPlaceholder}>
                    <CustomIcon name="card" size={24} color={COLORS.greyMedium} />
                    <Text style={styles.voterCardPlaceholderTitle}>Back Side</Text>
                    <Text style={styles.voterCardPlaceholderSub}>Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Ward Selector */}
            <Text style={styles.label}>Select Ward / Area <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.inputContainer, 
                styles.dropdownTrigger,
                showWardModal && styles.inputContainerFocused
              ]}
              activeOpacity={0.8}
              onPress={() => setShowWardModal(true)}
            >
              <View style={styles.inputIcon}>
                <CustomIcon name="home" size={18} color={showWardModal ? COLORS.primary : COLORS.greyMedium} />
              </View>
              <Text
                style={[
                  styles.dropdownText,
                  !ward && { color: COLORS.textSecondary },
                ]}
              >
                {ward || 'Choose Ward/Area'}
              </Text>
              <View style={styles.chevron}>
                <CustomIcon name="arrow-right" size={14} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>

            {/* Address (Optional) */}
            <Text style={styles.label}>Address (Optional)</Text>
            <View style={[
              styles.inputContainer, 
              styles.textAreaContainer,
              addressFocused && styles.inputContainerFocused
            ]}>
              <View style={[styles.inputIcon, styles.inputIconAddress]}>
                <CustomIcon name="document" size={18} color={addressFocused ? COLORS.primary : COLORS.greyMedium} />
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your physical address"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              onPress={() => setAgreed(!agreed)}
            >
              <View style={[styles.checkboxCircle, agreed && styles.checkboxCircleActive]}>
                {agreed && <CustomIcon name="plus" size={10} color={COLORS.white} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the <Text style={styles.linkSpan}>Terms of Service</Text> and <Text style={styles.linkSpan}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, !agreed && styles.submitButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={!agreed}
            >
              <Text style={styles.submitButtonText}>Submit & Register</Text>
            </TouchableOpacity>

            {/* Login Link text under the button */}
            <View style={styles.registerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modal for Ward Selection styled as Bottom Sheet */}
        <Modal
          visible={showWardModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowWardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalDismissTrigger} 
              activeOpacity={1} 
              onPress={() => setShowWardModal(false)} 
            />
            <View style={styles.modalContent}>
              {/* Bottom Sheet Grab Handle */}
              <View style={styles.modalGrabHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Ward / Area</Text>
                <TouchableOpacity onPress={() => setShowWardModal(false)}>
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={WARD_OPTIONS}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => {
                  const isSelected = ward === item;
                  return (
                    <TouchableOpacity
                      style={[styles.modalItem, isSelected && styles.modalItemActive]}
                      onPress={() => selectWard(item)}
                    >
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>
                        {item}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedTick}>
                          <CustomIcon name="plus" size={10} color={COLORS.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  backButtonCircle: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 10,
    // Soft drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 76, // Generous spacing at the top to clear absolute back button
    paddingBottom: 40,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14, // Modern rounded corners
    backgroundColor: COLORS.white,
    marginBottom: 20,
    paddingLeft: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    // Active glowing shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  inputIcon: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  dropdownTrigger: {
    justifyContent: 'flex-start',
  },
  dropdownText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingHorizontal: 10,
  },
  chevron: {
    position: 'absolute',
    right: 16,
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    marginTop: 6,
  },
  checkboxCircle: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.greyMedium,
    borderRadius: 10, // Circular checkboxes are much cleaner
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxCircleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  linkSpan: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  submitButton: {
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.greyMedium,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalDismissTrigger: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 37, 32, 0.45)', // Semi-transparent matching deep charcoal theme
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28, // Modern rounded sheet
    borderTopRightRadius: 28,
    maxHeight: '65%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalGrabHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1DCD6',
    marginTop: 10,
    marginBottom: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  modalItemActive: {
    backgroundColor: COLORS.secondary, // Mint background for selected
  },
  modalItemText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  modalItemTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  selectedTick: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  inputIconAddress: {
    paddingTop: 4,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greyLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 10,
  },
  voterCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  voterCardContainer: {
    width: '48%',
    height: 120,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  voterCardPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.greyLight,
  },
  voterCardPlaceholderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  voterCardPlaceholderSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  voterCardImageContainer: {
    flex: 1,
    position: 'relative',
  },
  voterCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  voterCardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
  },
  voterCardActiveLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 37, 32, 0.6)',
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
  },
});
