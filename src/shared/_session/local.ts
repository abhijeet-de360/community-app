import AsyncStorage from '@react-native-async-storage/async-storage';

async function set(key: string, value: any): Promise<void> {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`AsyncStorage set error for key "${key}":`, error);
  }
}

async function get(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error(`AsyncStorage get error for key "${key}":`, error);
    return null;
  }
}

async function clear(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`AsyncStorage clear error for key "${key}":`, error);
  }
}

async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('AsyncStorage clearAll error:', error);
  }
}

export const localService = { set, get, clear, clearAll };