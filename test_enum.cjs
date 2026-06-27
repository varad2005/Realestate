const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://gghbeddckyaphbpbqwye.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetch },
  realtime: { transport: WebSocket }
});

async function run() {
  const propertyId = "b22849e4-ead5-4269-a3ec-f0ef03642731"; // existing test property
  const candidates = ['school', 'School', 'hospital', 'Hospital', 'Landmark', 'transport', 'Transport', 'airport', 'Airport'];
  
  for (const c of candidates) {
    const { error } = await supabase.from('location_advantages').insert({
      property_id: propertyId,
      name: "Test",
      distance: "1",
      type: c
    });
    if (!error) {
      console.log(`✅ Valid ENUM value found: ${c}`);
      return;
    } else {
      console.log(`❌ Failed: ${c} - ${error.message}`);
    }
  }
}
run();
