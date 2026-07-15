import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';

import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';

// Import core screens
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

// Import tab screens
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { CampaignsScreen } from '../screens/CampaignsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Import quick access / stack screens
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { ComplaintsScreen } from '../screens/ComplaintsScreen';
import { GovSchemesScreen } from '../screens/GovSchemesScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { ElectricityScreen } from '../screens/ElectricityScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';
import { AlertsScreen } from '../screens/AlertsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigation
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home-filled' : 'home';
          } else if (route.name === 'Payments') {
            iconName = focused ? 'payment-filled' : 'payment';
          } else if (route.name === 'Campaigns') {
            iconName = focused ? 'campaign-filled' : 'campaign';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'profile-filled' : 'profile';
          }
          return (
            <View style={focused ? styles.activeTabIconContainer : null}>
              <CustomIcon name={iconName} size={20} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Root App Navigator (Stack Navigator)
export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Core Auth & Main Tabs */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Quick Access Stack Screens */}
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="GovSchemes" component={GovSchemesScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="ElectricityBill" component={ElectricityScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Alerts" component={AlertsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabIconContainer: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
