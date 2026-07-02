const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://vguellwkjbbeqvhuexfg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWVsbHdramJiZXF2aHVleGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODk2NzgsImV4cCI6MjA5ODU2NTY3OH0.6lwDLVuBaU1OImf8pciwGoKZ-UpJ3PduMLOcneckLjE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket },
    global: { fetch: (...args) => fetch(...args) }
});

async function run() {
  // Create a dummy user
  const email = `testuser_${Date.now()}@gmail.com`;
  const password = "password123";
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
  });
  
  if (authError) {
      console.error("Signup failed:", authError.message);
      return;
  }
  console.log("Signed up user:", authData.user?.id);
  
  const dummyFile = Buffer.from('test image data');
  const path = `${authData.user.id}/test_upload_${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage
    .from('property_images')
    .upload(path, dummyFile, { contentType: 'text/plain', upsert: false });

  if (error) {
      console.error("Upload failed with error:", error.message);
  } else {
      console.log("Upload succeeded! File path:", data.path);
  }
}
run();
