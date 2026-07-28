import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './loader';
import authReducer from './authSlice';
import wardReducer from './wardSlice';
import contactsReducer from './contactsSlice';
import announcementReducer from './announcementSlice';
import sanitationReducer from './sanitationSlice';
import schemeReducer from './schemeSlice';
import emergencyReducer from './emergencySlice';
import campaignReducer from './campaignSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    ward: wardReducer,
    contacts: contactsReducer,
    announcement: announcementReducer,
    sanitation: sanitationReducer,
    scheme: schemeReducer,
    emergency: emergencyReducer,
    campaign: campaignReducer,
  },
  devTools: true,
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;