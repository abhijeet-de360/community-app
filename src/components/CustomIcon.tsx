import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/colors';

interface CustomIconProps {
  name: string;
  size?: number;
  color?: string;
}

const ICON_MAPPING: Record<string, string> = {
  // Legacy / fallback mappings to outline icons by default
  'home': 'home-outline',
  'home-filled': 'home',
  
  'payment': 'card-outline',
  'payment-filled': 'card',
  'card': 'card-outline',
  'card-filled': 'card',
  
  'complaint': 'alert-circle-outline',
  'issue': 'alert-circle-outline',
  
  'alert': 'notifications-outline',
  'bell': 'notifications-outline',
  
  'contact': 'person-outline',
  'profile': 'person-outline',
  'profile-filled': 'person',
  
  'calendar': 'calendar-outline',
  'schedule': 'calendar-outline',
  
  'phone': 'call-outline',
  'contacts': 'call-outline',
  
  'emergency': 'medical-outline',
  
  'campaign': 'megaphone-outline',
  'campaign-filled': 'megaphone',
  'megaphone': 'megaphone-outline',
  'announcement': 'megaphone-outline',
  
  'schemes': 'business-outline',
  'govt': 'business-outline',
  
  'development': 'bar-chart-outline',
  'chart': 'bar-chart-outline',
  
  'document': 'document-text-outline',
  'documents': 'document-text-outline',
  
  'arrow-left': 'arrow-back-outline',
  'arrow-right': 'arrow-forward-outline',
  'search': 'search-outline',
  'plus': 'add-outline',
};

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  size = 24,
  color = COLORS.primary,
}) => {
  const ioniconName = ICON_MAPPING[name] || name;

  return (
    <View style={styles.container}>
      <Ionicons name={ioniconName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
