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

const initialState = {
  user: null,
  status: STATUS.IDLE,
  isAuthenticated: false,
  isLoginModalOpen: false
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData(state, { payload }) {
      if (payload.user) {
        state.user = payload.user;
      }
      if (payload.token) {
        localService.set("token", payload.token);
      }
      state.isAuthenticated = true;
    },
    setProfileData(state, { payload }) {
      state.user = payload
    },
    updateUserData(state, { payload }) {
      state.user = payload.result;
    },
    updateProfileImage(state, { payload }) {
      state.user.profile = payload.profile;
    },
    setStatus(state, { payload }) {
      state.status = payload;
    },
    setLogout(state) {
      localService.clearAll();
      state.isAuthenticated = false;
    },
    setLoginModalOpen(state, {payload}){
      state.isLoginModalOpen = payload
    }
  },
});

export const { setUserData, setStatus, updateUserData, updateProfileImage, setProfileData, setLoginModalOpen, setLogout } = authSlice.actions;
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
  return async function getProfileThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      await service.getProfile().then((res) => {
        dispatch(setProfileData(res.data));
        dispatch(setStatus(STATUS.IDLE));
        dispatch(setLoading(false));
      })
        .catch((err) => {
          dispatch(setStatus(STATUS.ERROR));
          dispatch(setLoading(false));
          errorHandler(err.response);
        });
    } catch (error) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(error.response);
    }
  };
}

export function updateProfile(data, setOpen) {
  return async function updateProfileThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    dispatch(setLoading(true));
    try {
      await service.updateProfile(data.name, data.email).then((res) => {
        dispatch(updateUserData(res.data));
        if (data.imageFile) {
          service.uploadImage(data.imageFile).then((res) => {
            dispatch(updateProfileImage(res.data))
            successHandler("Profile updated successfully");
          })
        } else {
          successHandler("Profile updated successfully");
        }
        dispatch(setStatus(STATUS.IDLE));
        dispatch(setLoading(false));
        setOpen(false);
      })
        .catch((err) => {
          dispatch(setStatus(STATUS.ERROR));
          dispatch(setLoading(false));
          errorHandler(err.response);
        });
      setOpen(false);
    } catch (error) {
      dispatch(setStatus(STATUS.ERROR));
      dispatch(setLoading(false));
      errorHandler(error.response);
    }
  };
};

export function logoutUser(navigate) {
  return async function logoutUserThunk(dispatch) {
    dispatch(setLogout());
    navigate("/");
    successHandler("Logout successfully.")
  }
};

export function loginModalOpen(data){
  return async function loginModalOpenThunbk(dispatch){
    dispatch(setLoginModalOpen(data));
  }
}