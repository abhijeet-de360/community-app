import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppDispatch, RootState } from '../store/store';
import { Skeleton } from '../components/Skeleton';

export const GovSchemesScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { schemes, loading } = useSelector((state: RootState) => state.scheme);
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;

  

  // Dynamically extract categories from loaded schemes
  const rawCategories = Array.isArray(schemes)
    ? Array.from(new Set(schemes.map((s: any) => s.category).filter(Boolean)))
    : [];
  const categories = ['All', ...rawCategories];

  const handleViewDetails = (item: any) => {
    const formattedScheme = {
      ...item,
      title: item.name || item.title || 'Govt Scheme',
      description: item.overview || item.description || '',
      benefits: Array.isArray(item.keyBenefits) ? item.keyBenefits.map((b: string) => `• ${b}`).join('\n') : item.keyBenefits || item.benefits || '',
      eligibility: Array.isArray(item.eligibility) ? item.eligibility.map((e: string) => `• ${e}`).join('\n') : item.eligibility || '',
      documents: Array.isArray(item.requiredDocuments) ? item.requiredDocuments.map((d: string) => `• ${d}`).join('\n') : item.documents || '',
      portalUrl: item.applyUrl || item.portalUrl || 'https://india.gov.in',
      notificationUrl: item.pdfUrl || item.notificationUrl || '',
    };
    navigation.navigate('SchemeDetails', { scheme: formattedScheme });
  };

  // Filter schemes by category and search query in frontend
  const filteredSchemes = (Array.isArray(schemes) ? schemes : []).filter((scheme: any) => {
    const title = scheme.name || scheme.title || '';
    const desc = scheme.overview || scheme.description || '';
    const cat = scheme.category || '';

    const matchesCategory = selectedCategory === 'All' || cat === selectedCategory;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());

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
        {loading ? (
          <View style={styles.schemesList}>
            {[1, 2, 3, 4].map((key) => (
              <View key={key} style={styles.schemeCard}>
                <Skeleton width="75%" height={22} borderRadius={6} style={{ marginBottom: 10 }} />
                <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
                <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 14 }} />
                <View style={styles.cardFooter}>
                  <Skeleton width={80} height={20} borderRadius={6} />
                  <Skeleton width={90} height={16} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.schemesList}>
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((scheme: any, idx: number) => {
                const title = scheme.name || scheme.title || '';
                const desc = scheme.overview || scheme.description || '';
                const cat = scheme.category || 'General';

                return (
                  <View key={scheme._id || scheme.id || idx} style={styles.schemeCard}>
                    {/* Scheme Title (Name) */}
                    <Text style={styles.schemeTitle}>{title}</Text>

                    {/* Description */}
                    <Text style={styles.schemeDesc} numberOfLines={2}>
                      {desc}
                    </Text>

                    {/* Footer: Category & View Details */}
                    <View style={styles.cardFooter}>
                      <View style={styles.categoryBadgeContainer}>
                        <Text style={styles.schemeCategory}>{cat}</Text>
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
                <Text style={styles.emptyText}>No government schemes found.</Text>
              </View>
            )}
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
