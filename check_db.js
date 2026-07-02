import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vguellwkjbbeqvhuexfg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZndWVsbHdramJiZXF2aHVleGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODk2NzgsImV4cCI6MjA5ODU2NTY3OH0.6lwDLVuBaU1OImf8pciwGoKZ-UpJ3PduMLOcneckLjE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('Connecting to Supabase...');
  try {
    const { data, error, status } = await supabase.from('properties').select('id, title').limit(3);
    
    if (error) {
      console.error('❌ Database connection failed. Error:', error.message);
      return;
    }
    
    console.log(`✅ Database connection successful! (Status: ${status})`);
    console.log(`Found ${data.length} properties:`);
    console.table(data);
  } catch (err) {
    console.error('❌ Unexpected error connecting to the database:', err.message);
  }
}

checkDatabase();
