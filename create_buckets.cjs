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
  const buckets = ['property_images', 'property-videos', 'property-360', 'addon_services', 'hero_banners'];
  for (let b of buckets) {
      const { data, error } = await supabase.storage.createBucket(b, { public: true });
      if (error) {
          console.error(`Failed to create ${b}:`, error.message);
      } else {
          console.log(`Created bucket: ${b}`);
      }
  }
}
run();
