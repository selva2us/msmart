
import AsyncStorage from '@react-native-async-storage/async-storage';
//import DeviceInfo from 'react-native-device-info';

export const BASE_URL = 'https://testapp-production-ad8c.up.railway.app'; // Replace with your actual API URL

export const getHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken'); // get the latest token
  //const deviceId = DeviceInfo.getUniqueId(); // get device ID

  return {
    accept: '*/*',
    'Content-Type': 'application/json',
    deviceId: "Test123",
    Authorization: token ? `Bearer ${token}` : '', // dynamically set token
  };
};
