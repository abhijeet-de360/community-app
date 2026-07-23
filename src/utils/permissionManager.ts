import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Checks if the gallery/storage permission is granted.
 */
export const checkStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const apiLevel = parseInt(Platform.Version.toString(), 10);
    if (apiLevel >= 33) {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );
    } else {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
    }
  } catch (err) {
    console.warn('Error checking storage permission:', err);
    return false;
  }
};

/**
 * Requests the gallery/storage permission.
 */
export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  try {
    const apiLevel = parseInt(Platform.Version.toString(), 10);
    const isLevel33OrAbove = apiLevel >= 33;
    const permissionToRequest = isLevel33OrAbove
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    // Check first
    const hasPermission = await checkStoragePermission();
    if (hasPermission) return true;

    // Request permission
    const granted = await PermissionsAndroid.request(permissionToRequest, {
      title: 'Gallery Access Permission',
      message: 'This app needs access to your gallery to upload profile photos and voter card documents.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Error requesting storage permission:', err);
    return false;
  }
};
