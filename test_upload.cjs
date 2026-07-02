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
  const dummyFile = Buffer.from('test image data');
  const { data, error } = await supabase.storage
    .from('bucket_does_not_exist_at_all')
    .upload('test_check.txt', dummyFile, { contentType: 'text/plain' });

  if (error) {
      console.error("Error:", error.message);
  }
}
run();
