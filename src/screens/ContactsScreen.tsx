import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContactItem {
  id: string;
  name: string;
  role: string;
  number: string;
  category: 'Helplines' | 'Municipal Officers' | 'Ward Representatives';
}

export const ContactsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: ContactItem[] = [
    {
      id: 'c1',
      name: 'Sanitation Helpline',
      role: 'Waste & Garbage Collection Complaints',
      number: '1800-345-6789',
      category: 'Helplines',
    },
    {
      id: 'c2',
      name: 'Electricity Board Help',
      role: 'Power Outage & Fuse Repair Support',
      number: '1912',
      category: 'Helplines',
    },
    {
      id: 'c3',
      name: 'Ambulance Service',
      role: 'Municipal Medical Emergency Helpline',
      number: '108',
      category: 'Helplines',
    },
    {
      id: 'c4',
      name: 'Dr. Ramesh Prasad',
      role: 'Chief Ward Sanitary Inspector',
      number: '+919876543210',
      category: 'Municipal Officers',
    },
    {
      id: 'c5',
      name: 'Er. S. K. Nair',
      role: 'Assistant Water Works Engineer',
      number: '+918765432109',
      category: 'Municipal Officers',
    },
    {
      id: 'c6',
      name: 'Mrs. Anjali Sharma',
      role: 'Municipal Grievance Officer',
      number: '+917654321098',
      category: 'Municipal Officers',
    },
    {
      id: 'c7',
      name: 'Dharmendra Singh',
      role: 'Ward 18 Counselor',
      number: '+919988776655',
      category: 'Ward Representatives',
    },
    {
      id: 'c8',
      name: 'Mrs. Geeta Roy',
      role: 'Community Development Lead',
      number: '+918877665544',
      category: 'Ward Representatives',
    },
  ];

  const handleDial = (number: string) => {
    // Strip hyphens and spaces for clean dialer loading
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert(
        'Call Failed',
        'Could not open dialer. Tapping calls is only supported on mobile devices with cell service.'
      );
    });
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.includes(searchQuery);
    return matchesSearch;
  });

  const helplines = filteredContacts.filter((c) => c.category === 'Helplines');
  const officers = filteredContacts.filter((c) => c.category === 'Municipal Officers');
  const reps = filteredContacts.filter((c) => c.category === 'Ward Representatives');

  const renderContactSection = (title: string, list: ContactItem[]) => {
    if (list.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
        {list.map((item) => (
          <View key={item.id} style={styles.contactCard}>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactRole}>{item.role}</Text>
              <Text style={styles.contactNumber}>{item.number}</Text>
            </View>
            <TouchableOpacity
              style={styles.dialButton}
              activeOpacity={0.7}
              onPress={() => handleDial(item.number)}
            >
              <CustomIcon name="phone" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

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

        {/* Sections */}
        {filteredContacts.length > 0 ? (
          <View style={styles.listContainer}>
            {renderContactSection('Emergency & Toll-Free Helplines', helplines)}
            {renderContactSection('Municipal Corporation Officers', officers)}
            {renderContactSection('Ward Representatives', reps)}
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
