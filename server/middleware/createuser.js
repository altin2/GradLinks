const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();
function createUserSupabase(token) {
    const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return createClient(
    supabaseUrl,
    supabaseKey, 
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      },
    }
  );
}
module.exports = {createUserSupabase}