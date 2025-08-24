import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,  
  process.env.REACT_APP_ANON_KEY,   
  {
    auth: {
      persistSession: true,    // saves session (access + refresh tokens) in localStorage
      autoRefreshToken: true,  // automatically refreshes access tokens when they expire
    },
  }
)

export default supabase
