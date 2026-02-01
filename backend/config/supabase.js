const { createClient } = require("@supabase/supabase-js");
const fetch = require("node-fetch");
require("dotenv").config();

global.fetch = fetch;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    const { error } = await supabase.from("users").select("count").limit(1);
    if (error && error.code !== "PGRST116") {
      throw new Error(error.message);
    }
    console.log("✓ Database connected successfully");
  } catch (err) {
    console.error("✗ Database connection failed:", err.message);
    throw err;
  }
}

module.exports = { supabase, testConnection };
