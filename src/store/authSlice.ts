import { createSlice } from "@reduxjs/toolkit";
import { setLoading } from "./loader";
import { localService } from "../shared/_session/local";
import { service } from "../shared/_services/api_service";
import { errorHandler, successHandler } from "../shared/_helper/responseHelper";



const STATUS = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

interface AuthState {
  user: any;
  status: string;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  status: STATUS.IDLE,
  isAuthenticated: false,
  isLoginModalOpen: false
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state: AuthState, { payload }) {
      if (payload.user) {
        state.user = payload.user;
      }
      if (payload.token) {
        localService.set("token", payload.token);
      }
      state.isAuthenticated = true;
    },
    setProfileData(state: AuthState, { payload }) {
      state.user = payload;
      state.isAuthenticated = true;
    },
    updateUserData(state: AuthState, { payload }) {
      if (payload?.result) {
        state.user = payload.result;
      } else if (payload?.user) {
        state.user = payload.user;
      } else if (payload && typeof payload === 'object') {
        state.user = state.user && typeof state.user === 'object' ? Object.assign({}, state.user, payload) : payload;
      }
    },
    updateProfileImage(state: AuthState, { payload }) {
      if (state.user && payload?.profile) {
        (state.user as any).profile = payload.profile;
      }
    },
    setStatus(state: AuthState, { payload }) {
      state.status = payload;
    },
    setPendingStatus(state: AuthState) {
      if (state.user) {
        (state.user as any).status = 'pending';
      }
    },
    setReminderStatus(state: AuthState, { payload }) {
      if (state.user) {
        (state.user as any).reminderEnabled = payload;
      }
    },
    setLogout(state) {
      localService.clearAll();
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoginModalOpen(state, {payload}){
      state.isLoginModalOpen = payload
    }
  },
});

export const { setUserData, setStatus, updateUserData, updateProfileImage, setProfileData, setPendingStatus, setReminderStatus, setLoginModalOpen, setLogout } = authSlice.actions;
export default authSlice.reducer;

//thunks

export function sendOtp(phoneNumber: string) {
  return async function sendOtpThunk(dispatch: any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.sendOtp(phoneNumber);
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      successHandler("OTP sent successfully");
      return res;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(err.response);
      throw err;
    }
  };
}

export function sendRegistrationOtp(phoneNumber: string) {
  return async function sendRegistrationOtpThunk(dispatch: any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.sendRegistrationOtp(phoneNumber);
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      successHandler("Registration OTP sent successfully");
      return res;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(err.response);
      throw err;
    }
  };
}

export function registerUser(formData: FormData) {
  return async function registerUserThunk(dispatch: any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.registerUser(formData);
      dispatch(setUserData(res.data));
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      successHandler("Registered successfully! Verification pending.");
      return res.data;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(err.response);
      throw err;
    }
  };
}

export function verifyOtp(data: any) {
  return async function verifyOtpThunk(dispatch: any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.verifyOtp(data);
      dispatch(setUserData(res.data));
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      successHandler("OTP verified successfully");
      return res.data;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(err.response);
      throw err;
    }
  };
}

export function getProfile() {
  return async function getProfileThunk(dispatch:any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.getProfile();
      dispatch(setProfileData(res.data));
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      return res.data;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      dispatch(setLogout());
      errorHandler(err?.response);
      throw err;
    }
  };
}

export function updateProfile(data: any) {
  return async function updateProfileThunk(dispatch: any) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      const res = await service.updateProfile(data);
      dispatch(updateUserData(res.data));
      dispatch(setPendingStatus());
      dispatch(setStatus(STATUS.IDLE));
      dispatch(setLoading(false));
      successHandler("Profile updated and submitted for re-verification");
      return res.data;
    } catch (err: any) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(err?.response);
      throw err;
    }
  };
};

export function logoutUser(navigate:any) {
  return async function logoutUserThunk(dispatch:any) {
    dispatch(setLogout());
    navigate("/");
    successHandler("Logout successfully.")
  }
};

export function loginModalOpen(data:any){
  return async function loginModalOpenThunbk(dispatch:any){
    dispatch(setLoginModalOpen(data));
  }
}

export function updateReminderToggle(reminderEnabled: boolean) {
  return async function updateReminderToggleThunk(dispatch: any) {
    try {
      const res = await service.updateReminder(reminderEnabled);
      const user = res.data?.result || res.data;
      dispatch(setReminderStatus(user.reminderEnabled ?? reminderEnabled));
      return user;
    } catch (err: any) {
      errorHandler(err?.response);
      throw err;
    }
  };
}