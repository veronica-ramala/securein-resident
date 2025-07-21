// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase Key starts with:", SUPABASE_KEY?.substring(0, 10));

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase environment variables are missing. Please check your .env.local file.');
  throw new Error('Supabase URL or Key is missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🔍 TEST: Check if Supabase is connected
async function testConnection() {
  try {
    const { data, error } = await supabase.from('visitor_passes').select('*').limit(1);
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
    } else {
      console.log('✅ Supabase connected. Sample visitor_pass:', data);
    }
  } catch (err) {
    console.log('❌ Supabase error:', err);
  }
}

testConnection();

// Removed testInsert and its invocation as demo data is no longer needed.
