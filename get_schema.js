import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://gghbeddckyaphbpbqwye.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaGJlZGRja3lhcGhicGJxd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MjE4MTQsImV4cCI6MjA5NzQ5NzgxNH0.Hfh1whTZvdk265118n0EV0N6RRjP8iPWTb8ByPeC06E');

async function checkDatabase() {
  const { data: properties, error } = await supabase.from('properties').select('*').limit(1);
  if (properties && properties.length > 0) {
    console.log("Properties columns:", Object.keys(properties[0]));
  }
}

checkDatabase();
