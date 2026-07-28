import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface AnnouncementItem {
  id?: string;
  _id?: string;
  announcementId?: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  wardId?: any;
}

interface AnnouncementState {
  announcements: AnnouncementItem[];
  latestAnnouncement: AnnouncementItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnnouncementState = {
  announcements: [],
  latestAnnouncement: null,
  loading: false,
  error: null,
};

export const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    setAnnouncements(state, { payload }) {
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.announcements)
        ? payload.announcements
        : Array.isArray(payload?.result)
        ? payload.result
        : [];
      state.announcements = list;
      state.latestAnnouncement = list.length > 0 ? list[0] : null;
      state.loading = false;
      state.error = null;
    },
    setAnnouncementLoading(state, { payload }) {
      state.loading = payload;
    },
    setAnnouncementError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setAnnouncements, setAnnouncementLoading, setAnnouncementError } = announcementSlice.actions;
export default announcementSlice.reducer;

export function fetchAnnouncements(params?: { wardId?: string; search?: string; category?: string; page?: number; limit?: number }) {
  return async function fetchAnnouncementsThunk(dispatch: any) {
    dispatch(setAnnouncementLoading(true));
    try {
      const res = await service.getAnnouncements(params);
      const data = res.data?.data || res.data;
      dispatch(setAnnouncements(data));
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch announcements';
      dispatch(setAnnouncementError(msg));
      throw err;
    }
  };
}
