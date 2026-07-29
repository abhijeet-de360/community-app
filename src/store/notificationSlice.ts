import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export type NotificationType =
  | 'Announcement'
  | 'Campaign'
  | 'GovtScheme'
  | 'EmergencyAlert'
  | 'SanitationSchedule'
  | 'ScheduleChange';

export interface INotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  wardId?: any;
  refId?: string;
  isRead: boolean;  // virtual: derived from readBy on the server
  createdAt?: string;
}

interface NotificationState {
  notifications: INotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, { payload }) {
      state.notifications = Array.isArray(payload) ? payload : [];
      state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      state.loading = false;
      state.error = null;
    },
    markOneRead(state, { payload: id }) {
      const n = state.notifications.find((n) => n._id === id);
      if (n && !n.isRead) {
        n.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => { n.isRead = true; });
      state.unreadCount = 0;
    },
    setNotificationLoading(state, { payload }) {
      state.loading = payload;
    },
    setNotificationError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const {
  setNotifications,
  markOneRead,
  markAllRead,
  setNotificationLoading,
  setNotificationError,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// ─── Thunks ──────────────────────────────────────────────────────────────────

export function fetchNotifications(params?: { wardId?: string; userId?: string }) {
  return async function fetchNotificationsThunk(dispatch: any) {
    dispatch(setNotificationLoading(true));
    try {
      const res = await service.getNotifications(params);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      dispatch(setNotifications(data));
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch notifications';
      dispatch(setNotificationError(msg));
    }
  };
}

export function markNotificationRead(id: string, userId: string) {
  return async function markReadThunk(dispatch: any) {
    // Optimistic update immediately
    dispatch(markOneRead(id));
    try {
      await service.markNotificationRead(id, userId);
    } catch (_) {
      // Silently ignore — optimistic update stays
    }
  };
}

export function markAllNotificationsRead(params?: { wardId?: string; userId?: string }) {
  return async function markAllReadThunk(dispatch: any) {
    dispatch(markAllRead());
    try {
      await service.markAllNotificationsRead(params);
    } catch (_) {}
  };
}
