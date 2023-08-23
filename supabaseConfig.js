 
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js' 
import AsyncStorage from '@react-native-async-storage/async-storage';
 

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return AsyncStorage.getItem(key);
  },
  setItem: async(key, value) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async(key) => {
    await AsyncStorage.removeItem(key);
  },
};
 

const supabaseUrl = 'https://yuvybxqtufuikextocdz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dnlieHF0dWZ1aWtleHRvY2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA4MTAyOTUsImV4cCI6MTk5NjM4NjI5NX0.2GR6HHpQ4EqYl_C2Wih29UJnGPI92Vv1hyu62Bal2Kw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})