import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface WardItem {
  id?: string;
  _id?: string;
  name: string;
  fullName: string;
  wardNumber?: string;
  code?: string;
  description?: string;
  status: 'active' | 'inactive';
}

interface WardState {
  wards: WardItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WardState = {
  wards: [],
  loading: false,
  error: null,
};

export const wardSlice = createSlice({
  name: 'ward',
  initialState,
  reducers: {
    setWards(state, { payload }) {
      state.wards = payload;
      state.loading = false;
      state.error = null;
    },
    setWardLoading(state, { payload }) {
      state.loading = payload;
    },
    setWardError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setWards, setWardLoading, setWardError } = wardSlice.actions;
export default wardSlice.reducer;

// Thunk to fetch all wards
export function fetchWards() {
  return async function fetchWardsThunk(dispatch: any) {
    dispatch(setWardLoading(true));
    try {
      const res = await service.getWards();
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.result || [];
      dispatch(setWards(list));
      return list;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch wards';
      dispatch(setWardError(msg));
      throw err;
    }
  };
}
