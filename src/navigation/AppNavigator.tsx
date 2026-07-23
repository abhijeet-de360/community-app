import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, TouchableOpacity, Text, Animated } from 'react-native';

import { COLORS } from '../theme/colors';
import { CustomIcon } from '../components/CustomIcon';

// Import core screens
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PendingScreen } from '../screens/PendingScreen';

// Import tab screens
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { CampaignsScreen } from '../screens/CampaignsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Import quick access / stack screens
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { ComplaintsScreen } from '../screens/ComplaintsScreen';
import { GovSchemesScreen } from '../screens/GovSchemesScreen';
import { SchemeDetailsScreen } from '../screens/SchemeDetailsScreen';
import { WebDocViewerScreen } from '../screens/WebDocViewerScreen';
import { CampaignDetailsScreen } from '../screens/CampaignDetailsScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { ElectricityScreen } from '../screens/ElectricityScreen';
import { EmergencyScreen } from '../screens/EmergencyScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, navigation }: any) => {
  const [layouts, setLayouts] = React.useState<{[key: number]: { x: number, width: number }}>({});
  const animLeft = React.useRef(new Animated.Value(0)).current;
  const animWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const layout = layouts[state.index];
    if (layout) {
      Animated.parallel([
        Animated.spring(animLeft, {
          toValue: layout.x,
          useNativeDriver: false,
          tension: 30,
          friction: 9.5,
        }),
        Animated.spring(animWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 30,
          friction: 9.5,
        })
      ]).start();
    }
  }, [state.index, layouts, animLeft, animWidth]);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {/* Sliding background pill */}
        {Object.keys(layouts).length >= state.routes.length && (
          <Animated.View
            style={[
              styles.activePillBackground,
              {
                left: animLeft,
                width: animWidth,
              }
            ]}
          />
        )}

        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          let iconName = 'home';
          let label = route.name;

          if (route.name === 'Home') {
            iconName = isFocused ? 'home-filled' : 'home';
            label = 'Home';
          } else if (route.name === 'Schemes') {
            iconName = 'schemes';
            label = 'Schemes';
          } else if (route.name === 'Campaigns') {
            iconName = isFocused ? 'campaign-filled' : 'campaign';
            label = 'Campaigns';
          } else if (route.name === 'Profile') {
            iconName = isFocused ? 'profile-filled' : 'profile';
            label = 'Profile';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.8}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                setLayouts((prev) => ({
                  ...prev,
                  [index]: { x, width },
                }));
              }}
              style={styles.tabItem}
            >
              <CustomIcon
                name={iconName}
                size={20}
                color={isFocused ? COLORS.primary : 'rgba(255, 255, 255, 0.75)'}
              />
              {isFocused && (
                <Text style={styles.tabItemLabel}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Bottom Tab Navigation
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Schemes" component={GovSchemesScreen} />
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
      <Stack.Screen name="Pending" component={PendingScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {/* Quick Access Stack Screens */}
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="GovSchemes" component={GovSchemesScreen} />
      <Stack.Screen name="SchemeDetails" component={SchemeDetailsScreen} />
      <Stack.Screen name="WebDocViewer" component={WebDocViewerScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="ElectricityBill" component={ElectricityScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    height: 40,
    zIndex: 2, // render above the sliding background pill
  },
  activePillBackground: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    zIndex: 1, // render behind icons and text
  },
  tabItemLabel: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 12,
    marginLeft: 6,
  },
});
