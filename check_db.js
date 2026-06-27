import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gghbeddckyaphbpbqwye.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaGJlZGRja3lhcGhicGJxd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MjE4MTQsImV4cCI6MjA5NzQ5NzgxNH0.Hfh1whTZvdk265118n0EV0N6RRjP8iPWTb8ByPeC06E';

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
