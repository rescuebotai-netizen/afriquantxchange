import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Use service role key for backend admin tasks, fallback to anon if not provided
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (supabaseServiceKey === process.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ WARNING: Using Anon Key for backend Supabase client. RLS policies will block AI Bot database writes. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
