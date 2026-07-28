import { createSlice } from '@reduxjs/toolkit';
import { service } from '../shared/_services/api_service';

export interface ICampaign {
  _id?: string;
  campaignId?: string;
  title: string;
  type: 'Cleanliness' | 'Health Screening' | 'Awareness' | 'Other';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  interestedCitizensCount?: number;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Expired';
  wardId?: any;
  createdAt?: string;
}

interface CampaignState {
  campaigns: ICampaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaigns(state, { payload }) {
      state.campaigns = Array.isArray(payload) ? payload : [];
      state.loading = false;
      state.error = null;
    },
    setCampaignLoading(state, { payload }) {
      state.loading = payload;
    },
    setCampaignError(state, { payload }) {
      state.error = payload;
      state.loading = false;
    },
  },
});

export const { setCampaigns, setCampaignLoading, setCampaignError } = campaignSlice.actions;
export default campaignSlice.reducer;

export function fetchCampaigns(params?: { wardId?: string }) {
  return async function fetchCampaignsThunk(dispatch: any) {
    dispatch(setCampaignLoading(true));
    try {
      const res = await service.getCampaigns(params);
      const data = Array.isArray(res.data) ? res.data : res.data?.campaigns || res.data?.data || [];
      dispatch(setCampaigns(data));
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch campaigns';
      dispatch(setCampaignError(msg));
      throw err;
    }
  };
}
