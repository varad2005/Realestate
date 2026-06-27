const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://gghbeddckyaphbpbqwye.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: { fetch },
  realtime: { transport: WebSocket }
});

async function checkLatestSubmission() {
  console.log("=== Checking Latest Property Submissions ===\n");

  // Fetch last 5 properties ordered by creation time
  const { data: props, error } = await supabase
    .from('properties')
    .select(`
      id, title, status, city, price, price_num, price_display,
      property_type, bhk, bathrooms, balconies, area_sqft,
      furnishing, ownership_type, floor_number, total_floors,
      facing, possession_status, property_age, posted_by_role,
      maintenance_charges, description, created_at,
      locations ( city, locality, state, pincode, lat, lng, address ),
      property_images ( url, is_floor_plan, sort_order ),
      property_videos ( video_url, title ),
      property_highlights ( title, value ),
      property_amenities ( amenities ( name ) )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ Error fetching properties:", JSON.stringify(error));
    return;
  }

  if (!props || props.length === 0) {
    console.log("❌ No properties found at all.");
    return;
  }

  console.log(`Found ${props.length} most recent properties:\n`);

  props.forEach((prop, idx) => {
    const loc = Array.isArray(prop.locations) ? prop.locations[0] : prop.locations;
    console.log(`--- Property #${idx + 1} ---`);
    console.log(`  id:               ${prop.id}`);
    console.log(`  created_at:       ${prop.created_at}`);
    console.log(`  title:            ${prop.title}`);
    console.log(`  status:           ${prop.status}`);
    console.log(`  property_type:    ${prop.property_type}`);
    console.log(`  city:             ${prop.city}`);
    console.log(`  price:            ${prop.price}`);
    console.log(`  price_display:    ${prop.price_display}`);
    console.log(`  bhk:              ${prop.bhk}`);
    console.log(`  bathrooms:        ${prop.bathrooms}`);
    console.log(`  balconies:        ${prop.balconies}`);
    console.log(`  area_sqft:        ${prop.area_sqft}`);
    console.log(`  furnishing:       ${prop.furnishing}`);
    console.log(`  ownership_type:   ${prop.ownership_type}`);
    console.log(`  floor_number:     ${prop.floor_number}`);
    console.log(`  total_floors:     ${prop.total_floors}`);
    console.log(`  facing:           ${prop.facing}`);
    console.log(`  possession_status:${prop.possession_status}`);
    console.log(`  property_age:     ${prop.property_age}`);
    console.log(`  posted_by_role:   ${prop.posted_by_role}`);
    console.log(`  maintenance:      ${prop.maintenance_charges}`);
    console.log(`  description:      ${prop.description ? prop.description.substring(0, 60) + '...' : 'null'}`);
    console.log(`  location:         locality=${loc?.locality}, city=${loc?.city}, state=${loc?.state}, pincode=${loc?.pincode}`);
    console.log(`  images:           ${prop.property_images?.length || 0}`);
    console.log(`  videos:           ${prop.property_videos?.length || 0}`);
    console.log(`  highlights:       ${prop.property_highlights?.length || 0} → ${JSON.stringify(prop.property_highlights?.map(h => h.title))}`);
    console.log(`  amenities:        ${prop.property_amenities?.length || 0}`);
    console.log('');
  });

  // Check if the most recent has all required fields
  const latest = props[0];
  const loc = Array.isArray(latest.locations) ? latest.locations[0] : latest.locations;

  console.log("=== VALIDATION: Most Recent Property ===");
  const checks = [
    { field: 'title', ok: !!latest.title },
    { field: 'status', ok: !!latest.status },
    { field: 'price', ok: !!latest.price },
    { field: 'locality (NOT NULL)', ok: !!loc?.locality },
    { field: 'property_type', ok: !!latest.property_type },
    { field: 'posted_by_role', ok: !!latest.posted_by_role },
    { field: 'ownership_type', ok: !!latest.ownership_type },
  ];

  let allPassed = true;
  checks.forEach(c => {
    const icon = c.ok ? '✅' : '❌';
    if (!c.ok) allPassed = false;
    console.log(`  ${icon} ${c.field}`);
  });

  console.log(allPassed
    ? '\n🎉 Latest property is VALID — all required fields present.'
    : '\n⚠️  Some required fields are missing from the latest property.'
  );
}

checkLatestSubmission().catch(console.error);
