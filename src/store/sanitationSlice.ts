import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface DaySchedule {
  day: string;
  isOff: boolean;
  time: string;
}

export interface ScheduleChange {
  _id?: string;
  id?: string;
  date: string;
  time: string;
  reason?: string;
}

interface SanitationState {
  weeklySchedule: DaySchedule[];
  scheduleChanges: ScheduleChange[];
  wardId?: any;
  loading: boolean;
  error: string | null;
}

const initialState: SanitationState = {
  weeklySchedule: [],
  scheduleChanges: [],
  loading: false,
  error: null,
};

export const sanitationSlice = createSlice({
  name: 'sanitation',
  initialState,
  reducers: {
    setSanitationData(state, { payload }) {
      state.weeklySchedule = payload?.weeklySchedule || [];
      state.scheduleChanges = payload?.scheduleChanges || [];
      state.wardId = payload?.wardId || null;
      state.loading = false;
      state.error = null;
    },
    setSanitationLoading(state, { payload }) {
      state.loading = payload;
    },
    setSanitationError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setSanitationData, setSanitationLoading, setSanitationError } = sanitationSlice.actions;
export default sanitationSlice.reducer;

export function fetchSanitationSchedule(params?: { wardId?: string }) {
  return async function fetchSanitationScheduleThunk(dispatch: any) {
    dispatch(setSanitationLoading(true));
    try {
      const res = await service.getSanitationSchedule(params);
      dispatch(setSanitationData(res.data));
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch sanitation schedule';
      dispatch(setSanitationError(msg));
      throw err;
    }
  };
}
