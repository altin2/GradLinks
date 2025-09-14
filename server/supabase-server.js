process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // add at the very top of your server.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase;