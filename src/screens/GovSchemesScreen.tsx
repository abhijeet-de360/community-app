import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Scheme {
  id: string;
  title: string;
  category: string;
  badge: 'Active' | 'New' | 'Closing Soon';
  description: string;
  benefits: string;
  eligibility: string;
  portalUrl: string;
  documents?: string;
}

export const GovSchemesScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const schemes: Scheme[] = [
    {
      id: 'sch-1',
      title: 'PM SVANidhi (Street Vendor Loan)',
      category: 'Financial',
      badge: 'Active',
      description: 'Providing micro-credit facility for street vendors to resume their livelihoods post pandemic.',
      benefits: '• Working capital loan of up to ₹10,000.\n• Interest subsidy of 7% per annum on timely repayment.\n• Cashbacks up to ₹1,200/yr on digital transactions.',
      eligibility: '• Active street vendors in urban or rural municipal areas.\n• Possess Certificate of Vending or Identity Card.',
      portalUrl: 'https://pmsvanidhi.mohua.gov.in',
      documents: '• Certificate of Vending / Identity Card\n• Aadhaar Card / Voter ID Card\n• Active Mobile Number linked to Aadhaar\n• Bank Account Passbook (with IFSC)',
    },
    {
      id: 'sch-2',
      title: 'Urban Household Toilet Subsidy',
      category: 'Sanitation',
      badge: 'Active',
      description: 'Financial assistance under Swachh Bharat Abhiyan for constructing private household toilets.',
      benefits: '• Direct Benefit Transfer (DBT) of ₹12,000 in two equal installments.\n• Free technical construction guidelines from municipal engineers.',
      eligibility: '• Urban households lacking safe sanitary toilet facilities.\n• Family income falls below specified municipal threshold.',
      portalUrl: 'https://swachhbharatmission.gov.in',
      documents: '• Aadhaar Card / ID Proof\n• Bank Account Passbook (copy for DBT payment)\n• Photograph of current toilet site\n• Household Income Certificate',
    },
    {
      id: 'sch-3',
      title: 'PMAY-Urban (Affordable Housing)',
      category: 'Housing',
      badge: 'Active',
      description: 'Credit-linked subsidy scheme aiming to make housing affordable for the urban poor.',
      benefits: '• Interest subsidy up to 6.5% on home loans.\n• Subsidy amount up to ₹2.67 Lakhs credited directly to loan account.',
      eligibility: '• Beneficiary family must not own a pucca house anywhere in India.\n• EWS (income up to ₹3L/yr) or LIG (income up to ₹6L/yr).',
      portalUrl: 'https://pmay-urban.gov.in',
      documents: '• Aadhaar Card / PAN Card\n• Income Proof (Salary slip / Form 16 / ITR)\n• Affidavit certifying no pucca house ownership in India\n• Property purchase / loan documents',
    },
    {
      id: 'sch-4',
      title: 'Jal Jeevan Tap Connection',
      category: 'Water Supply',
      badge: 'New',
      description: 'Ensuring safe, piped tap water connection directly to household kitchens.',
      benefits: '• Free installation of functional tap water pipeline.\n• Zero initial connection charges.\n• Regular water quality check updates via ward office.',
      eligibility: '• All urban/suburban homes currently relying on shared community hand pumps or tankers.',
      portalUrl: 'https://jaljeevanmission.gov.in',
      documents: '• Property ownership document (Registry copy)\n• Latest Property Tax payment receipt\n• Aadhaar Card of homeowner\n• Electricity Bill showing active address',
    },
    {
      id: 'sch-5',
      title: 'Senior Citizen Pension Scheme',
      category: 'Financial',
      badge: 'Active',
      description: 'Monthly social security financial support for elderly community citizens.',
      benefits: '• Direct monthly pension of ₹1,000 credited on the 1st of every month.\n• Free medical checkups at state government hospitals.',
      eligibility: '• Age must be 60 years or above.\n• Resident of the state with no active source of private regular income.',
      portalUrl: 'https://nsap.nic.in',
      documents: '• Age Proof (Birth certificate / School certificate / Aadhaar)\n• Income Certificate (verifying no private regular income)\n• Bank Passbook (for pension deposits)\n• Domicile/Residence Certificate',
    },
  ];

  const categories = ['All', 'Financial', 'Sanitation', 'Housing', 'Water Supply'];

  const handleViewDetails = (scheme: Scheme) => {
    navigation.navigate('SchemeDetails', { scheme });
  };

  // Filter schemes by category and search query
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });



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
        <Text style={styles.headerTitle}>Government Schemes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        {/* <View style={styles.introContainer}>
          <Text style={styles.mainTitle}>Welfare Schemes</Text>
          <Text style={styles.subTitle}>
            Explore and apply for active state and municipal schemes launched for your welfare.
          </Text>
        </View> */}

        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <CustomIcon name="search" size={20} color={COLORS.greyMedium} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search schemes, benefits, categories..."
            placeholderTextColor={COLORS.greyMedium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Schemes List */}
        <View style={styles.schemesList}>
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme) => {
              return (
                <View key={scheme.id} style={styles.schemeCard}>
                  {/* Scheme Title (Name) */}
                  <Text style={styles.schemeTitle}>{scheme.title}</Text>

                  {/* Description */}
                  <Text style={styles.schemeDesc} numberOfLines={2}>
                    {scheme.description}
                  </Text>

                  {/* Footer: Category & View Details */}
                  <View style={styles.cardFooter}>
                    <View style={styles.categoryBadgeContainer}>
                      <Text style={styles.schemeCategory}>{scheme.category}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleViewDetails(scheme)}
                      style={styles.viewDetailsBtn}
                    >
                      <Text style={styles.viewDetailsText}>View Details →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active schemes found matching your search.</Text>
            </View>
          )}
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
    marginBottom: 20,
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
  categoriesContainer: {
    marginBottom: 20,
    marginHorizontal: -20, // offset screen padding
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },
  schemesList: {
    marginTop: 10,
  },
  schemeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  schemeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  schemeDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  categoryBadgeContainer: {
    backgroundColor: COLORS.greyLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  schemeCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  viewDetailsBtn: {
    paddingVertical: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Expanded section styles removed in favor of screen navigation
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
