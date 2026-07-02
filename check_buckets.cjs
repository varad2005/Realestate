const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://vguellwkjbbeqvhuexfg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWVsbHdramJiZXF2aHVleGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODk2NzgsImV4cCI6MjA5ODU2NTY3OH0.6lwDLVuBaU1OImf8pciwGoKZ-UpJ3PduMLOcneckLjE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket },
    global: { fetch: (...args) => fetch(...args) }
});

async function run() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error fetching buckets:", error);
  } else {
    console.log("Buckets found:");
    if (buckets && buckets.length > 0) {
      buckets.forEach(b => console.log(`- ${b.name} (Public: ${b.public})`));
    } else {
      console.log("No buckets found in this project.");
    }
  }
}
run();
