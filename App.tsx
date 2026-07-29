import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { fetchWards } from './src/store/wardSlice';
import { fetchAnnouncements } from './src/store/announcementSlice';
import { fetchSanitationSchedule } from './src/store/sanitationSlice';
import { fetchGovtSchemes } from './src/store/schemeSlice';
import { fetchEmergencyAlerts } from './src/store/emergencySlice';
import { fetchCampaigns } from './src/store/campaignSlice';
import { fetchNotifications } from './src/store/notificationSlice';
import store, { AppDispatch, RootState } from './src/store/store';

function AppMain() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const wardId = typeof user?.wardId === 'object' ? user?.wardId?._id : user?.wardId;
  const userId = user?._id ? String(user._id) : undefined;

  useEffect(() => {
    dispatch(fetchWards());
    dispatch(fetchAnnouncements({ wardId }));
    dispatch(fetchSanitationSchedule({ wardId }));
    dispatch(fetchGovtSchemes({ wardId }));
    dispatch(fetchEmergencyAlerts({ wardId }));
    dispatch(fetchCampaigns({ wardId }));
    dispatch(fetchNotifications({ wardId, userId }));
  }, [dispatch, wardId, userId]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppMain />
    </Provider>
  );
}

export default App;
