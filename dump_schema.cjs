const fs = require('fs');

const url = "https://gghbeddckyaphbpbqwye.supabase.co/rest/v1/";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaGJlZGRja3lhcGhicGJxd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MjE4MTQsImV4cCI6MjA5NzQ5NzgxNH0.Hfh1whTZvdk265118n0EV0N6RRjP8iPWTb8ByPeC06E";

async function run() {
  const tables = ['properties', 'property_images', 'property_videos', 'property_highlights', 'project_details', 'location_advantages', 'property_amenities', 'locations'];
  for (const t of tables) {
    const res = await fetch(`${url}${t}?select=*&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      console.log(`\nTable: ${t}`);
      console.log(Object.keys(data[0]).join(', '));
    } else {
      console.log(`\nTable: ${t} (Empty - could not determine schema)`);
    }
  }
}
run();
