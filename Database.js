const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

exports.DB = createClient(
    supabaseUrl,
    supabaseAnonKey,
);
  