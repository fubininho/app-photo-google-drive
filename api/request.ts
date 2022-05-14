import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const googleApi = axios.create({
  baseURL: 'https://photoslibrary.googleapis.com/v1'
})

googleApi.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('google_access_token');
    const expo_client_id = await AsyncStorage.getItem('expo_client_id');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers.Authorization = `Bearer ${expo_client_id}`;
    }
    config.headers['Content-Type'] ='application/json';
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export {googleApi};