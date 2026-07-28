import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector } from 'react-redux';
import { setLogout, setPendingStatus, updateProfile } from '../store/authSlice';

const DEFAULT_WARD_OPTIONS = [
  'Ward 18 - New Reserve',
  'Ward 18 - Kohima Town',
  'Ward 18 - Cathedral Area',
  'Ward 18 - High School Hill',
  'Ward 18 - Lerie Sector',
];

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { wards } = useSelector((state: any) => state.ward);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profile || null);
  const [name, setName] = useState(user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''));
  const [ward, setWard] = useState<string>('');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [address, setAddress] = useState(user?.address || '');

  const mobile = user?.phoneNumber || user?.phone || 'N/A';
  const epicNumber = user?.epicNumber || user?.epicNo || 'N/A';

  const wardItems = Array.isArray(wards) && wards.length > 0 ? wards : DEFAULT_WARD_OPTIONS;

  React.useEffect(() => {
    if (user) {
      if (user.name || user.firstName) {
        setName(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim());
      }
      if (user.address) {
        setAddress(user.address);
      }
      if (user.profile) {
        setProfilePhoto(user.profile);
      }
      if (user.wardId) {
        const id = typeof user.wardId === 'object' ? (user.wardId._id || user.wardId.id) : user.wardId;
        setSelectedWardId(id);
        if (typeof user.wardId === 'object' && (user.wardId.fullName || user.wardId.name)) {
          setWard(user.wardId.fullName || user.wardId.name);
        } else if (Array.isArray(wards) && wards.length > 0) {
          const matched = wards.find((w: any) => (w._id || w.id) === id);
          if (matched) {
            setWard(matched.fullName || matched.name);
          }
        }
      }
    }
  }, [user, wards]);
  
  const [showWardModal, setShowWardModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);

  const handlePickPhoto = () => {
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

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }
    setShowUpdateModal(true);
  };

  const confirmUpdateProfile = async () => {
    setShowUpdateModal(false);
    try {
      await dispatch(updateProfile({ name, address, wardId: selectedWardId }) as any);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Pending' }],
      });
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const selectWardItem = (item: any) => {
    if (typeof item === 'object') {
      setWard(item.fullName || item.name);
      setSelectedWardId(item._id || item.id);
    } else {
      setWard(item);
    }
    setShowWardModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(setLogout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const selectWard = (selected: string) => {
    setWard(selected);
    setShowWardModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Flat Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
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
                  <CustomIcon name="profile" size={42} color={COLORS.greyMedium} />
                </View>
              )}
              <View style={styles.avatarBadge}>
                <CustomIcon name="create" size={12} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={styles.profileNameText}>{name || 'Citizen'}</Text>
            <Text style={styles.profileSubText}>Ward 18 Resident</Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>
            {/* Full Name (Editable) */}
            <Text style={styles.label}>Full Name</Text>
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

            {/* Mobile Number (Read-Only) */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Mobile Number</Text>
            </View>
            <View style={[styles.inputContainer, styles.readOnlyInputContainer]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="phone" size={18} color={COLORS.greyMedium} />
              </View>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={mobile}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            {/* Voter ID EPIC (Read-Only) */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>Voter ID Card (EPIC)</Text>
            </View>
            <View style={[styles.inputContainer, styles.readOnlyInputContainer]}>
              <View style={styles.inputIcon}>
                <CustomIcon name="document" size={18} color={COLORS.greyMedium} />
              </View>
              <TextInput
                style={[styles.input, styles.readOnlyInput]}
                value={epicNumber}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>

            {/* Ward (Editable Selector) */}
            <Text style={styles.label}>Registered Ward Sector</Text>
            <TouchableOpacity
              style={[styles.inputContainer, styles.selectorContainer]}
              activeOpacity={0.8}
              onPress={() => setShowWardModal(true)}
            >
              <View style={styles.inputIcon}>
                <CustomIcon name="home" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.selectorText}>{ward || 'Select Registered Ward'}</Text>
              <View style={styles.chevronWrapper}>
                <CustomIcon name="chevron-down" size={16} color={COLORS.greyMedium} />
              </View>
            </TouchableOpacity>

            {/* Address (Editable) */}
            <Text style={styles.label}>Physical Address</Text>
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
                placeholder="Enter physical address"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                value={address}
                onChangeText={setAddress}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </View>

            {/* Update Profile Button */}
            <TouchableOpacity
              style={styles.updateButton}
              activeOpacity={0.8}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={() => setShowLogoutModal(true)}
            >
              <Text style={styles.logoutButtonText}>Logout Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Ward Selector Bottom Sheet Modal */}
      <Modal
        visible={showWardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWardModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalDismissTrigger}
          activeOpacity={1}
          onPress={() => setShowWardModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalGrabHandle} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Ward Sector</Text>
                <TouchableOpacity onPress={() => setShowWardModal(false)}>
                  <Text style={styles.closeText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={wardItems}
                keyExtractor={(item: any) => typeof item === 'object' ? (item._id || item.id) : item}
                contentContainerStyle={styles.modalList}
                renderItem={({ item }) => {
                  const label = typeof item === 'object' ? (item.fullName || item.name) : item;
                  const itemId = typeof item === 'object' ? (item._id || item.id) : item;
                  const isActive = ward === label || selectedWardId === itemId;
                  return (
                    <TouchableOpacity
                      style={[styles.modalItem, isActive && styles.modalItemActive]}
                      onPress={() => selectWardItem(item)}
                    >
                      <Text style={[styles.modalItemText, isActive && styles.modalItemTextActive]}>
                        {label}
                      </Text>
                      {isActive && (
                        <View style={styles.selectedTick}>
                          <CustomIcon name="checkmark" size={12} color={COLORS.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Soft Logout Confirmation Dialog Modal */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <TouchableOpacity
            style={styles.dialogDismissTrigger}
            activeOpacity={1}
            onPress={() => setShowLogoutModal(false)}
          />
          <View style={styles.dialogContainer}>
            <View style={styles.dialogIconBadge}>
              <CustomIcon name="log-out" size={24} color={COLORS.danger} />
            </View>
            <Text style={styles.dialogTitle}>Log Out?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to log out from Ward 18 Community Notification App?
            </Text>
            <View style={styles.dialogActionRow}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogCancelButton]}
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogConfirmButton]}
                activeOpacity={0.8}
                onPress={confirmLogout}
              >
                <Text style={styles.dialogConfirmText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Update Profile Confirmation Dialog Modal */}
      <Modal
        visible={showUpdateModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <TouchableOpacity
            style={styles.dialogDismissTrigger}
            activeOpacity={1}
            onPress={() => setShowUpdateModal(false)}
          />
          <View style={styles.dialogContainer}>
            <View style={[styles.dialogIconBadge, { backgroundColor: '#E8F5E9' }]}>
              <CustomIcon name="create" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.dialogTitle}>Update Profile?</Text>
            <Text style={styles.dialogMessage}>
              Updating your profile details will send your account for verification again. Are you sure you want to update?
            </Text>
            <View style={styles.dialogActionRow}>
              <TouchableOpacity
                style={[styles.dialogButton, styles.dialogCancelButton]}
                activeOpacity={0.8}
                onPress={() => setShowUpdateModal(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, { backgroundColor: COLORS.primary }]}
                activeOpacity={0.8}
                onPress={confirmUpdateProfile}
              >
                <Text style={styles.dialogConfirmText}>Confirm & Send</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 56,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // accommodate bottom tab navigator offset
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.greyLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  profileSubText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  form: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  readOnlyInputContainer: {
    backgroundColor: COLORS.greyLight,
    borderColor: COLORS.border,
  },
  inputIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  inputIconAddress: {
    paddingTop: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  readOnlyInput: {
    color: COLORS.textSecondary,
  },
  selectorContainer: {
    justifyContent: 'flex-start',
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  chevronWrapper: {
    padding: 4,
  },
  textAreaContainer: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  updateButton: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    // Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  updateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  logoutButton: {
    height: 50,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    backgroundColor: COLORS.white,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.danger,
  },
  modalDismissTrigger: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 37, 32, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '65%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
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
    backgroundColor: COLORS.secondary,
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
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogDismissTrigger: {
    ...StyleSheet.absoluteFill,
  },
  dialogContainer: {
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
  dialogIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDE8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  dialogMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  dialogActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dialogButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogCancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dialogCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dialogConfirmButton: {
    backgroundColor: COLORS.danger,
  },
  dialogConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});
