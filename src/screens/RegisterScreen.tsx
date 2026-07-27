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
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendRegistrationOtp, registerUser } from '../store/authSlice';
import { fetchWards } from '../store/wardSlice';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { launchImageLibrary } from 'react-native-image-picker';
import { requestStoragePermission } from '../utils/permissionManager';

export const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { wards: wardList, loading: loadingWards } = useSelector((state: any) => state.ward);

  const { status } = useSelector((state: any) => state.auth);
  const isSubmitting = status === 'loading';

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [epicNumber, setEpicNumber] = useState('');
  const [ward, setWard] = useState('');
  const [selectedWardId, setSelectedWardId] = useState('');
  const [address, setAddress] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [voterCardFront, setVoterCardFront] = useState<string | null>(null);
  const [voterCardBack, setVoterCardBack] = useState<string | null>(null);

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = React.useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Inline error state for each input field

  React.useEffect(() => {
    dispatch(fetchWards() as any);
  }, [dispatch]);

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

  // Inline error state for each input field
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    const newErrors: Record<string, string> = {};

    if (!profilePhoto) {
      newErrors.profilePhoto = 'Please upload a profile photo.';
    }
    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!epicNumber.trim()) {
      newErrors.epicNumber = 'Please enter your EPIC (Voter ID) number.';
    }
    if (!voterCardFront) {
      newErrors.voterCardFront = 'Please upload front side of voter card.';
    }
    if (!voterCardBack) {
      newErrors.voterCardBack = 'Please upload back side of voter card.';
    }
    if (!ward) {
      newErrors.ward = 'Please select your ward/area.';
    }
    if (!address.trim()) {
      newErrors.address = 'Please enter your physical address.';
    }
    if (!agreed) {
      newErrors.agreed = 'Please agree to the Terms of Service & Privacy Policy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await dispatch(sendRegistrationOtp(mobile.trim()) as any);
      setShowOtpModal(true);
    } catch (err: any) {
      // Handled by toast error handler
    }
  };

  const handleVerifyRegistrationOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      Alert.alert('Validation Error', 'Please enter 6-digit OTP code.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('phoneNumber', mobile.trim());
    formData.append('otp', fullOtp);
    formData.append('epicNumber', epicNumber.trim());
    if (selectedWardId) {
      formData.append('wardId', selectedWardId);
    }
    formData.append('address', address.trim());

    if (profilePhoto) {
      const filename = profilePhoto.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('profilePhoto', { uri: profilePhoto, name: filename, type } as any);
    }

    if (voterCardFront) {
      const filename = voterCardFront.split('/').pop() || 'front.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('voterCardFront', { uri: voterCardFront, name: filename, type } as any);
    }

    if (voterCardBack) {
      const filename = voterCardBack.split('/').pop() || 'back.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('voterCardBack', { uri: voterCardBack, name: filename, type } as any);
    }

    try {
      const result = await dispatch(registerUser(formData) as any);
      setShowOtpModal(false);

      // Status will be 'pending' as default on registration -> AppNavigator redirects to PendingScreen
      navigation.reset({
        index: 0,
        routes: [{ name: result?.user?.status === 'active' ? 'MainTabs' : 'Pending' }],
      });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
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
            {/* Profile Photo Label */}
            <Text style={styles.avatarLabel}>
              {profilePhoto ? 'Change Profile Photo' : 'Upload Profile Photo'} <Text style={{ color: COLORS.danger }}>*</Text>
            </Text>
            {errors.profilePhoto && <Text style={styles.avatarErrorText}>{errors.profilePhoto}</Text>}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              errors.name && styles.inputContainerError,
              nameFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="profile" size={18} color={errors.name ? COLORS.danger : (nameFocused ? COLORS.primary : COLORS.greyMedium)} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Full Name"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
                value={name}
                onChangeText={(val) => {
                  setName(val);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Mobile Number */}
            <Text style={styles.label}>Mobile Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              errors.mobile && styles.inputContainerError,
              mobileFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="phone" size={18} color={errors.mobile ? COLORS.danger : (mobileFocused ? COLORS.primary : COLORS.greyMedium)} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(val) => {
                  setMobile(val);
                  if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                }}
                onFocus={() => setMobileFocused(true)}
                onBlur={() => setMobileFocused(false)}
              />
            </View>
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

            {/* EPIC Number */}
            <Text style={styles.label}>EPIC (Voter ID) Number <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer,
              errors.epicNumber && styles.inputContainerError,
              epicFocused && styles.inputContainerFocused
            ]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="card" size={18} color={errors.epicNumber ? COLORS.danger : (epicFocused ? COLORS.primary : COLORS.greyMedium)} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. ABC1234567"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="characters"
                value={epicNumber}
                onChangeText={(val) => {
                  setEpicNumber(val);
                  if (errors.epicNumber) setErrors(prev => ({ ...prev, epicNumber: '' }));
                }}
                onFocus={() => setEpicFocused(true)}
                onBlur={() => setEpicFocused(false)}
              />
            </View>
            {errors.epicNumber && <Text style={styles.errorText}>{errors.epicNumber}</Text>}

            {/* Voter Card Images (Front & Back) */}
            <Text style={styles.label}>Voter Card Photos (Front & Back) <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={styles.voterCardRow}>
              {/* Front Side */}
              <TouchableOpacity
                style={[styles.voterCardContainer, errors.voterCardFront && styles.inputContainerError]}
                activeOpacity={0.8}
                onPress={() => {
                  handlePickVoterCard('front');
                  if (errors.voterCardFront) setErrors(prev => ({ ...prev, voterCardFront: '' }));
                }}
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
                    <CustomIcon name="card" size={24} color={errors.voterCardFront ? COLORS.danger : COLORS.greyMedium} />
                    <Text style={styles.voterCardPlaceholderTitle}>Front Side</Text>
                    <Text style={styles.voterCardPlaceholderSub}>Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Back Side */}
              <TouchableOpacity
                style={[styles.voterCardContainer, errors.voterCardBack && styles.inputContainerError]}
                activeOpacity={0.8}
                onPress={() => {
                  handlePickVoterCard('back');
                  if (errors.voterCardBack) setErrors(prev => ({ ...prev, voterCardBack: '' }));
                }}
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
                    <CustomIcon name="card" size={24} color={errors.voterCardBack ? COLORS.danger : COLORS.greyMedium} />
                    <Text style={styles.voterCardPlaceholderTitle}>Back Side</Text>
                    <Text style={styles.voterCardPlaceholderSub}>Tap to upload</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {(errors.voterCardFront || errors.voterCardBack) && (
              <Text style={styles.errorText}>{errors.voterCardFront || errors.voterCardBack}</Text>
            )}

            {/* Ward Selector */}
            <Text style={styles.label}>Select Ward / Area <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.inputContainer, 
                styles.dropdownTrigger,
                errors.ward && styles.inputContainerError,
                showWardModal && styles.inputContainerFocused
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setShowWardModal(true);
                if (errors.ward) setErrors(prev => ({ ...prev, ward: '' }));
              }}
            >
              <View style={styles.inputIcon}>
                <CustomIcon name="home" size={18} color={errors.ward ? COLORS.danger : (showWardModal ? COLORS.primary : COLORS.greyMedium)} />
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
            {errors.ward && <Text style={styles.errorText}>{errors.ward}</Text>}

            {/* Address */}
            <Text style={styles.label}>Address <Text style={{ color: COLORS.danger }}>*</Text></Text>
            <View style={[
              styles.inputContainer, 
              styles.textAreaContainer,
              errors.address && styles.inputContainerError,
              addressFocused && styles.inputContainerFocused
            ]}>
              <View style={[styles.inputIcon, styles.inputIconAddress]}>
                <CustomIcon name="document" size={18} color={errors.address ? COLORS.danger : (addressFocused ? COLORS.primary : COLORS.greyMedium)} />
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your physical address"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="words"
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={(val) => {
                  setAddress(val);
                  if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                }}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </View>
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            {/* Terms & Conditions */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              activeOpacity={0.8}
              onPress={() => {
                setAgreed(!agreed);
                if (errors.agreed) setErrors(prev => ({ ...prev, agreed: '' }));
              }}
            >
              <View style={[styles.checkboxCircle, agreed && styles.checkboxCircleActive, errors.agreed && { borderColor: COLORS.danger }]}>
                {agreed && <CustomIcon name="plus" size={10} color={COLORS.white} />}
              </View>
              <Text style={styles.checkboxLabel}>
                I agree to the <Text style={styles.linkSpan}>Terms of Service</Text> and <Text style={styles.linkSpan}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>
            {errors.agreed && <Text style={styles.errorText}>{errors.agreed}</Text>}

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
                data={wardList}
                keyExtractor={(item, index) => item._id || item.id || String(index)}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => {
                  const displayName = item.fullName || item.name;
                  const itemKey = item._id || item.id || displayName;
                  const isSelected = selectedWardId === itemKey || ward === displayName;
                  return (
                    <TouchableOpacity
                      style={[styles.modalItem, isSelected && styles.modalItemActive]}
                      onPress={() => {
                        setWard(displayName);
                        setSelectedWardId(itemKey);
                        setShowWardModal(false);
                      }}
                    >
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>
                        {displayName}
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

        {/* OTP Verification Modal */}
        <Modal
          visible={showOtpModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowOtpModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalDismissTrigger}
              activeOpacity={1}
              onPress={() => setShowOtpModal(false)}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalGrabHandle} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Verify Mobile Number</Text>
                <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                  <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 18 }}>
                  Enter the 6-digit OTP code sent to <Text style={{ color: COLORS.textPrimary, fontWeight: '700' }}>+91 {mobile}</Text>
                </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(ref) => {
                        otpRefs.current[idx] = ref;
                      }}
                      style={[
                        styles.inputContainer,
                        { width: 46, height: 52, textAlign: 'center', fontSize: 18, fontWeight: 'bold', paddingLeft: 0, marginBottom: 0 },
                        digit !== '' && { borderColor: COLORS.primary },
                        focusedIndex === idx && styles.inputContainerFocused,
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, idx)}
                      onKeyPress={(e) => handleKeyPress(e, idx)}
                      onFocus={() => setFocusedIndex(idx)}
                      onBlur={() => setFocusedIndex(null)}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (isSubmitting || otp.join('').length < 6) && { opacity: 0.5 },
                  ]}
                  activeOpacity={0.8}
                  disabled={isSubmitting || otp.join('').length < 6}
                  onPress={handleVerifyRegistrationOtp}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>Verify & Complete Registration</Text>
                  )}
                </TouchableOpacity>
              </View>
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
  inputContainerError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    marginTop: -14,
    marginBottom: 16,
    marginLeft: 4,
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
    marginBottom: 4,
  },
  avatarErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    marginTop: 4,
    textAlign: 'center',
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
