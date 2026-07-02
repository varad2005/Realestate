const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = "https://vguellwkjbbeqvhuexfg.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: { fetch },
  realtime: { transport: WebSocket }
});

async function verifyE2E() {
  console.log("=== VERIFY E2E: Fetching last E2E test property ===\n");

  // 1. Find the test property
  const { data: props, error: propsErr } = await supabase
    .from('properties')
    .select('*')
    .eq('title', 'E2E Test Property')
    .order('created_at', { ascending: false })
    .limit(1);

  if (propsErr || !props?.length) {
    console.error("Could not find E2E test property:", propsErr);
    return;
  }

  const prop = props[0];
  const id = prop.id;
  console.log(`✅ Found property: ${id}`);
  console.log(`   title: ${prop.title}`);
  console.log(`   status: ${prop.status}`);
  console.log(`   city: ${prop.city}`);
  console.log(`   price: ${prop.price}`);
  console.log(`   price_num: ${prop.price_num}`);
  console.log(`   price_display: ${prop.price_display}`);
  console.log(`   property_type: ${prop.property_type}`);
  console.log(`   type (enum): ${prop.type}`);
  console.log(`   bhk: ${prop.bhk}`);
  console.log(`   bathrooms: ${prop.bathrooms}`);
  console.log(`   balconies: ${prop.balconies}`);
  console.log(`   area_sqft: ${prop.area_sqft}`);
  console.log(`   carpet_area: ${prop.carpet_area}`);
  console.log(`   built_up_area: ${prop.built_up_area}`);
  console.log(`   super_built_up_area: ${prop.super_built_up_area}`);
  console.log(`   furnishing: ${prop.furnishing}`);
  console.log(`   ownership: ${prop.ownership}`);
  console.log(`   ownership_type: ${prop.ownership_type}`);
  console.log(`   floor_number: ${prop.floor_number}`);
  console.log(`   floor: ${prop.floor}`);
  console.log(`   total_floors: ${prop.total_floors}`);
  console.log(`   facing: ${prop.facing}`);
  console.log(`   possession_status: ${prop.possession_status}`);
  console.log(`   property_age: ${prop.property_age}`);
  console.log(`   posted_by_role: ${prop.posted_by_role}`);
  console.log(`   maintenance_charges: ${prop.maintenance_charges}`);

  // 2. Fetch location
  const { data: loc } = await supabase
    .from('locations')
    .select('*')
    .eq('property_id', id)
    .single();
  console.log('\n--- LOCATION ---');
  if (loc) {
    console.log(`   city: ${loc.city}`);
    console.log(`   locality: ${loc.locality}`);
    console.log(`   state: ${loc.state}`);
    console.log(`   pincode: ${loc.pincode}`);
    console.log(`   lat: ${loc.lat}`);
    console.log(`   lng: ${loc.lng}`);
    console.log(`   address: ${loc.address}`);
  } else {
    console.log("❌ Location NOT found");
  }

  // 3. Fetch images
  const { data: imgs } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', id);
  console.log('\n--- IMAGES ---');
  if (imgs?.length) {
    imgs.forEach(img => {
      console.log(`   url: ${img.url}, is_floor_plan: ${img.is_floor_plan}, sort_order: ${img.sort_order}`);
      // Check for the old is_primary field
      if ('is_primary' in img) {
        console.log(`   ⚠️  has is_primary field: ${img.is_primary}`);
      }
    });
  } else {
    console.log("   (no images or not visible due to RLS)");
  }

  // 4. Fetch highlights
  const { data: highlights } = await supabase
    .from('property_highlights')
    .select('*')
    .eq('property_id', id);
  console.log('\n--- HIGHLIGHTS ---');
  if (highlights?.length) {
    highlights.forEach(h => console.log(`   title: ${h.title}, value: ${h.value}`));
  } else {
    console.log("   (none or not visible)");
  }

  // 5. Fetch project_details
  const { data: proj } = await supabase
    .from('project_details')
    .select('*')
    .eq('property_id', id)
    .single();
  console.log('\n--- PROJECT DETAILS ---');
  if (proj) {
    console.log(`   project_name: ${proj.project_name}`);
    console.log(`   builder_name: ${proj.builder_name}`);
    console.log(`   rera_number: ${proj.rera_number}`);
    console.log(`   marketing_tagline: ${proj.marketing_tagline}`);
  } else {
    console.log("   (none)");
  }

  // 6. Fetch location_advantages
  const { data: advs } = await supabase
    .from('location_advantages')
    .select('*')
    .eq('property_id', id);
  console.log('\n--- LOCATION ADVANTAGES ---');
  if (advs?.length) {
    advs.forEach(a => console.log(`   name: ${a.name}, distance: ${a.distance}, type: ${a.type}, distance_unit: ${a.distance_unit}`));
  } else {
    console.log("   (none or not visible)");
  }

  // 7. Now do the full getPropertyById-style fetch (simulating the UI)
  console.log('\n--- FULL JOIN FETCH (simulating getPropertyById) ---');
  const { data: full, error: fullErr } = await supabase
    .from('properties')
    .select(`
      *,
      locations ( city, locality, address, state, pincode, lat, lng ),
      property_images ( id, url ),
      property_videos ( id, video_url, thumbnail_url, title, is_primary ),
      property_amenities ( amenities ( id, name, icon_name ) ),
      project_details ( id, project_name, builder_name, launch_year, possession_date, total_units, project_area, rera_number, marketing_tagline, description ),
      location_advantages ( id, name, distance, type ),
      property_highlights ( id, title, value )
    `)
    .eq('id', id)
    .single();

  if (fullErr) {
    console.error("❌ Full join fetch error:", JSON.stringify(fullErr));
  } else {
    console.log("✅ Full join fetch succeeded");
    const loc2 = Array.isArray(full.locations) ? full.locations[0] : full.locations;
    console.log(`   location.state: ${loc2?.state}`);
    console.log(`   location.pincode: ${loc2?.pincode}`);
    console.log(`   images count: ${full.property_images?.length}`);
    console.log(`   videos count: ${full.property_videos?.length}`);
    console.log(`   highlights count: ${full.property_highlights?.length}`);
    console.log(`   location_advantages count: ${full.location_advantages?.length}`);
    console.log(`   project_details: ${full.project_details ? 'present' : 'none'}`);

    // Check highlights structure
    if (full.property_highlights?.length) {
      const hl = full.property_highlights[0];
      console.log(`   highlights[0]: id=${hl.id}, title=${hl.title}, value=${hl.value}`);
    }
  }

  // 8. Check legacy field conflicts
  console.log('\n--- LEGACY FIELD AUDIT ---');
  console.log(`   floor column: ${prop.floor} (should be null if we only sent floor_number)`);
  console.log(`   floor_number column: ${prop.floor_number} (should be 5)`);
  console.log(`   type (enum): ${prop.type} (legacy enum)`);
  console.log(`   property_type (text): ${prop.property_type} (source of truth)`);
  console.log(`   ownership (legacy): ${prop.ownership}`);
  console.log(`   ownership_type (source of truth): ${prop.ownership_type}`);

  // 9. Delete test property to clean up
  console.log('\n--- CLEANUP ---');
  const { error: delErr } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  if (delErr) {
    console.log("⚠️ Could not delete test property (may need auth):", delErr.message);
  } else {
    console.log("✅ Test property cleaned up");
  }

  console.log('\n=== VERIFICATION COMPLETE ===');
}

verifyE2E().catch(console.error);
