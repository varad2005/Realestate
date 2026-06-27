const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://gghbeddckyaphbpbqwye.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaGJlZGRja3lhcGhicGJxd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MjE4MTQsImV4cCI6MjA5NzQ5NzgxNH0.Hfh1whTZvdk265118n0EV0N6RRjP8iPWTb8ByPeC06E";

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
