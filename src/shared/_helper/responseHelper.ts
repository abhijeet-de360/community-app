import { ToastAndroid, Platform, Alert } from 'react-native';
import { localService } from '../_session/local';

const showNativeToast = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Notice', msg);
  }
};

export const errorHandler = async (res: any) => {
  if (res?.status === 401) {
    await localService.clearAll();
  }

  const message = Array.isArray(res?.data?.message)
    ? res.data.message[0]
    : res?.data?.message || res?.message || 'An unexpected error occurred';

  showNativeToast(message);
};

export const successHandler = async (msg: string) => {
  showNativeToast(msg);
};

export const warningHandler = async (msg: string) => {
  showNativeToast(msg);
};
