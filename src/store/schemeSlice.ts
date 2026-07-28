import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface GovtSchemeItem {
  _id?: string;
  id?: string;
  schemeId?: string;
  name: string;
  title?: string;
  category: string;
  overview: string;
  description?: string;
  keyBenefits?: string[];
  eligibility?: string[];
  requiredDocuments?: string[];
  applyUrl?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  wardId?: any;
}

interface SchemeState {
  schemes: GovtSchemeItem[];
  loading: boolean;
  error: string | null;
}

const initialState: SchemeState = {
  schemes: [],
  loading: false,
  error: null,
};

export const schemeSlice = createSlice({
  name: 'scheme',
  initialState,
  reducers: {
    setSchemes(state, { payload }) {
      state.schemes = Array.isArray(payload) ? payload : [];
      state.loading = false;
      state.error = null;
    },
    setSchemeLoading(state, { payload }) {
      state.loading = payload;
    },
    setSchemeError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setSchemes, setSchemeLoading, setSchemeError } = schemeSlice.actions;
export default schemeSlice.reducer;

export function fetchGovtSchemes(params?: { wardId?: string; search?: string; category?: string }) {
  return async function fetchGovtSchemesThunk(dispatch: any) {
    dispatch(setSchemeLoading(true));
    try {
      const res = await service.getGovtSchemes(params);
      const data = res.data?.data || res.data || [];
      dispatch(setSchemes(data));
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch government schemes';
      dispatch(setSchemeError(msg));
      throw err;
    }
  };
}
