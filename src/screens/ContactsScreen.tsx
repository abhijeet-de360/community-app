import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchImportantContacts, ContactItem } from '../store/contactsSlice';
import { AppDispatch, RootState } from '../store/store';
import { Skeleton } from '../components/Skeleton';

export const ContactsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, loading } = useSelector((state: RootState) => state.contacts);
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;

  useEffect(() => {
    dispatch(fetchImportantContacts({ wardId }));
  }, [dispatch, wardId]);

  const handleDial = (number: string) => {
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert(
        'Call Failed',
        'Could not open dialer. Tapping calls is only supported on mobile devices with cell service.'
      );
    });
  };

  const filteredContacts = contacts.filter((c) => {
    const name = c.title || '';
    const desc = c.desc || '';
    const no = c.no || '';
    const type = c.type || '';
    const query = searchQuery.toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      no.includes(query) ||
      type.toLowerCase().includes(query)
    );
  });

  // Group contacts by type
  const groupedContacts = filteredContacts.reduce((acc: { [key: string]: ContactItem[] }, item) => {
    const key = item.type ? item.type.toUpperCase() : 'OTHER CONTACTS';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Flat Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Important Contacts</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <CustomIcon name="search" size={20} color={COLORS.greyMedium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts, roles, departments..."
            placeholderTextColor={COLORS.greyMedium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Loading Indicator */}
        {loading ? (
          <View style={styles.listContainer}>
            {[1, 2, 3, 4].map((key) => (
              <View key={key} style={styles.contactCard}>
                <View style={styles.contactDetails}>
                  <Skeleton width="60%" height={18} borderRadius={4} style={{ marginBottom: 6 }} />
                  <Skeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={14} borderRadius={4} />
                </View>
                <Skeleton width={44} height={44} borderRadius={22} />
              </View>
            ))}
          </View>
        ) : Object.keys(groupedContacts).length > 0 ? (
          <View style={styles.listContainer}>
            {Object.entries(groupedContacts).map(([groupTitle, list]) => (
              <View key={groupTitle} style={styles.section}>
                <Text style={styles.sectionHeaderTitle}>{groupTitle}</Text>
                {list.map((item) => (
                  <View key={item._id || item.id || item.no} style={styles.contactCard}>
                    <View style={styles.contactDetails}>
                      <Text style={styles.contactName}>{item.title}</Text>
                      {item.desc ? <Text style={styles.contactRole}>{item.desc}</Text> : null}
                      <Text style={styles.contactNumber}>{item.no}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dialButton}
                      activeOpacity={0.7}
                      onPress={() => handleDial(item.no)}
                    >
                      <CustomIcon name="phone" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts found matching your search.</Text>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 24,
    // Soft shadow
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
    marginTop: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  contactDetails: {
    flex: 1,
    marginRight: 12,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  contactRole: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  contactNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 6,
  },
  dialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
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
