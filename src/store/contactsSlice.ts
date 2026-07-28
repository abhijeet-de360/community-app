import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface ContactItem {
  id?: string;
  _id?: string;
  title: string;
  desc?: string;
  no: string;
  type?: string;
  icon?: string;
  wardId?: any;
}

interface ContactsState {
  contacts: ContactItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  contacts: [],
  loading: false,
  error: null,
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts(state, { payload }) {
      state.contacts = Array.isArray(payload) ? payload : payload?.result || [];
      state.loading = false;
      state.error = null;
    },
    setContactsLoading(state, { payload }) {
      state.loading = payload;
    },
    setContactsError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setContacts, setContactsLoading, setContactsError } = contactsSlice.actions;
export default contactsSlice.reducer;

export function fetchImportantContacts(params?: { wardId?: string; search?: string; type?: string }) {
  return async function fetchImportantContactsThunk(dispatch: any) {
    dispatch(setContactsLoading(true));
    try {
      const res = await service.getImportantContacts(params);
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.result || [];
      dispatch(setContacts(list));
      return list;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch important contacts';
      dispatch(setContactsError(msg));
      throw err;
    }
  };
}
