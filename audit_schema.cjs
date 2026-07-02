const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://vguellwkjbbeqvhuexfg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWVsbHdramJiZXF2aHVleGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODk2NzgsImV4cCI6MjA5ODU2NTY3OH0.6lwDLVuBaU1OImf8pciwGoKZ-UpJ3PduMLOcneckLjE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const tables = [
  'users', 'properties', 'locations', 'property_images', 'property_videos',
  'project_details', 'property_highlights', 'location_advantages',
  'amenities', 'property_amenities', 'saved_properties'
];

async function run() {
  const results = {};
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      results[t] = { error: error.message, code: error.code };
    } else if (data && data.length > 0) {
      results[t] = { columns: Object.keys(data[0]), sample: data[0] };
    } else {
      // Table exists but empty - try insert with null to trigger error revealing columns
      results[t] = { columns: 'EMPTY_TABLE', note: 'Table exists but has no rows' };
    }
  }
  console.log(JSON.stringify(results, null, 2));
}
run();
