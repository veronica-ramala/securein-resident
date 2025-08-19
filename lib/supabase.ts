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

// 🔍 TEST: Check if Supabase can insert data
async function testInsert() {
  try {
    const payload = {
      visitor_name: 'Test Visitor',
      phone_number: '0000000000',
      purpose: 'Testing',
      pass_type: 'vip',
      status: 'active',
      visit_date: '2025-07-18',
      visit_time: new Date().toISOString(),
      visit_end_date: '2025-07-18',
      expiry_time: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      qr_code: ''
    };
    const { data, error } = await supabase
      .from('visitor_passes')
      .insert([payload])
      .select()
      .single();
    if (error) {
      console.log('❌ Supabase insert failed:', error.message, error.details, error.hint);
    } else {
      console.log('✅ Supabase insert succeeded. Inserted data:', data);
    }
  } catch (err) {
    console.log('❌ Supabase insert error:', err);
  }
}

testInsert();
