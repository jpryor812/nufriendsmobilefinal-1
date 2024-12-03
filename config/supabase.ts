import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://cjmhepjsxklaffursazj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbWhlcGpzeGtsYWZmdXJzYXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTAxOTcsImV4cCI6MjA0ODcyNjE5N30.WbmpqsJzVc6b4tFXQ1bP6peb_d5E0rkI-Jwg1DCN7SI'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
  }
)