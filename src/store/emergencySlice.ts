import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface EmergencyAlertItem {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  datePublished?: string;
  timestamp?: string;
  wardId?: any;
  createdAt?: string;
}

interface EmergencyState {
  alerts: EmergencyAlertItem[];
  loading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  alerts: [],
  loading: false,
  error: null,
};

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setEmergencyAlerts(state, { payload }) {
      state.alerts = Array.isArray(payload) ? payload : [];
      state.loading = false;
      state.error = null;
    },
    setEmergencyLoading(state, { payload }) {
      state.loading = payload;
    },
    setEmergencyError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setEmergencyAlerts, setEmergencyLoading, setEmergencyError } = emergencySlice.actions;
export default emergencySlice.reducer;

export function fetchEmergencyAlerts(params?: { wardId?: string }) {
  return async function fetchEmergencyAlertsThunk(dispatch: any) {
    dispatch(setEmergencyLoading(true));
    try {
      const res = await service.getEmergencyAlerts(params);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setEmergencyAlerts(data));
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch emergency alerts';
      dispatch(setEmergencyError(msg));
      throw err;
    }
  };
}
