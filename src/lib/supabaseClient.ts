import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your own Supabase project URL and anon key.
// You can find these in your Supabase project's API settings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('Supabase URL is not set. Please create a .env.local file and add NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('Supabase anon key is not set. Please create a .env.local file and add NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
