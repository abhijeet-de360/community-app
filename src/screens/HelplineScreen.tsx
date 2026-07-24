import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';

export const HelplineScreen = ({ navigation }: any) => {
  const helplineContacts = [
    {
      id: 'h1',
      title: 'Ward 18 Helpline',
      subtitle: 'Official support for profile verification & citizen queries',
      number: '1800-425-1818',
      email: 'support@ward18.gov.in',
      tag: 'Official Support',
      icon: 'headset-outline',
      accentColor: COLORS.primary,
    },
  ];

  const faqs = [
    {
      q: 'How long does EPIC document verification take?',
      a: 'Standard verification takes between 12 to 24 business hours after submission. Our team validates EPIC data directly with municipal databases.',
    },
    {
      q: 'What if my verification document is rejected?',
      a: 'If any discrepancy is found, you will receive an SMS specifying the issue along with a link to re-upload your document.',
    },
    {
      q: 'Can I visit the Ward 18 Municipal Office in person?',
      a: 'Yes, Ward 18 Civic Help Centre (Counter 4) is open Monday to Saturday from 9:00 AM to 5:00 PM.',
    },
  ];

  const handleCall = (number: string) => {
    const cleanNumber = number.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert(
        'Call Support',
        `Dial ${number} on your phone to connect with Ward 18 Helpdesk.`
      );
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Email Support', `Send an email to: ${email}`);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Standard Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <CustomIcon name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helpline & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Callout */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroIconBox}>
              <CustomIcon name="headset-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.heroTextCol}>
              <Text style={styles.heroTitle}>Ward 18 Assistance Desk</Text>
              <Text style={styles.heroSubtitle}>We are here to assist with your verification</Text>
            </View>
          </View>
          <View style={styles.heroStatusRow}>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>DESK OPERATIONAL</Text>
            </View>
            <Text style={styles.hoursText}>Mon - Sat • 9 AM - 5 PM</Text>
          </View>
        </View>

        {/* Contact Cards Section */}
        <Text style={styles.sectionHeader}>Official Helpline Contact</Text>

        {helplineContacts.map((item) => (
          <View key={item.id} style={styles.contactCard}>
            <View style={styles.cardTopRow}>
              <View
                style={[
                  styles.contactIconBg,
                  { backgroundColor: `${item.accentColor}15` },
                ]}
              >
                <CustomIcon name={item.icon} size={22} color={item.accentColor} />
              </View>
              <View style={styles.contactTextCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.contactTitle}>{item.title}</Text>
                  <View style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
              </View>
            </View>

            <View style={styles.cardActionRow}>
              <TouchableOpacity
                style={styles.callButton}
                activeOpacity={0.8}
                onPress={() => handleCall(item.number)}
              >
                <CustomIcon name="phone" size={16} color={COLORS.white} />
                <Text style={styles.callButtonText}> Call {item.number}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.emailButton}
                activeOpacity={0.7}
                onPress={() => handleEmail(item.email)}
              >
                <CustomIcon name="mail-outline" size={16} color={COLORS.primary} />
                <Text style={styles.emailButtonText}> Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* FAQ Section */}
        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <View style={styles.faqCard}>
          {faqs.map((faq, idx) => (
            <View
              key={idx}
              style={[
                styles.faqItem,
                idx < faqs.length - 1 && styles.faqItemBorder,
              ]}
            >
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>

        {/* Office Location Banner */}
        <View style={styles.locationCard}>
          <CustomIcon name="location-outline" size={24} color={COLORS.primary} />
          <View style={styles.locationTextCol}>
            <Text style={styles.locationTitle}>Ward 18 Municipal Civic Centre</Text>
            <Text style={styles.locationSub}>
              Counter 4, Ground Floor, Sector 3 Community Complex, Main Road.
            </Text>
          </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroTextCol: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  heroSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  hoursText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  contactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  tagPill: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  contactSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  callButton: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  emailButton: {
    paddingHorizontal: 16,
    height: 42,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  faqItem: {
    paddingVertical: 10,
  },
  faqItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  locationTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  locationSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});
