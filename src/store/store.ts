import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './loader';
import authReducer from './authSlice';
import wardReducer from './wardSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    ward: wardReducer,
  },
  devTools: true,
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;