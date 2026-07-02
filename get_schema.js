import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://vguellwkjbbeqvhuexfg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWVsbHdramJiZXF2aHVleGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODk2NzgsImV4cCI6MjA5ODU2NTY3OH0.6lwDLVuBaU1OImf8pciwGoKZ-UpJ3PduMLOcneckLjE');

async function checkDatabase() {
  const { data: properties, error } = await supabase.from('properties').select('*').limit(1);
  if (properties && properties.length > 0) {
    console.log("Properties columns:", Object.keys(properties[0]));
  }
}

checkDatabase();
