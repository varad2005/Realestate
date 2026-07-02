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
  const start = 0;
  const end = 99;

  let selectString = `
      id,
      title,
      locations (
        lat,
        lng,
        locality,
        city
      )
    `;

  let query = supabase
      .from('properties')
      .select(selectString)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(start, end);

  const { data, error } = await query;
  
  if (data) {
    const mapProps = data.map(property => ({
      id: property.id,
      lat: Array.isArray(property.locations) ? property.locations[0]?.lat : property.locations?.lat,
      lng: Array.isArray(property.locations) ? property.locations[0]?.lng : property.locations?.lng,
    })).filter(p => p.lat !== undefined && p.lng !== undefined && p.lat !== null && p.lng !== null);
    
    console.log("mapProps count:", mapProps.length);
  }
}

run();
