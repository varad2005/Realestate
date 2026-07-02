
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vguellwkjbbeqvhuexfg.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error("Missing SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
  global: { fetch: fetch },
  realtime: { transport: WebSocket }
});

async function runE2ETest() {
  console.log("Starting E2E API Test for Property Posting...");
  
  // 1. We need a valid owner_id. Let's create an anonymous user or use a dummy UUID.
  // Actually, RLS is disabled in 09_master_schema_sync for child tables, but `properties` might have RLS?
  // properties table might require an authenticated user. Wait, the user has been submitting without auth error on properties.
  // The errors were on `price_display` and `area_sqft`.
  // Let's use a dummy uuid:
  const dummyOwnerId = "43f2f2d1-7a1f-4af6-bd41-e04bab4d9d74"; 

  const payload = {
    owner_id: dummyOwnerId,
    title: "E2E Test Property",
    description: "This is a full E2E test to verify schema",
    property_type: "Flat/Apartment",
    bhk: "3",
    bathrooms: "3",
    balconies: "2",
    area_sqft: 1800,
    carpet_area: 1600,
    built_up_area: 1700,
    super_built_up_area: 1800,
    furnishing: "Fully-Furnished",
    ownership_type: "Freehold",
    maintenance_charges: 5000,
    price: "15000000",
    price_num: 15000000,
    price_display: "₹1.5 Cr",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    lat: 18.5204,
    lng: 73.8567,
    locality: "Shivaji Nagar",
    address: "123 Test Street",
    posted_by_role: "owner",
    floor_number: 5,
    total_floors: 10,
    facing: "East",
    possession_status: "Ready to Move",
    property_age: "New Construction",
    amenities: ["Gym", "Pool"],
    location_advantages: [
      { name: "Airport", distance: "5", type: "airport" }
    ],
    highlights: [
      { title: "Park Facing", value: "Yes" }
    ],
    project_details: {
      project_name: "QA Towers",
      builder_name: "QA Builders",
      launch_year: "2023",
      total_units: 100,
      project_area: "5 Acres",
      rera_number: "RERA123",
      possession_date: "2024",
      marketing_tagline: "Quality Assurance",
      description: "Test Project"
    },
    videos: [
      { url: "test.mp4", thumbnail: "thumb.jpg", title: "Walkthrough" }
    ],
    property_images: [
      { url: "img1.jpg", caption: "Front View", is_floor_plan: false }
    ]
  };

  try {
    // 1. Insert Base Property
    console.log("-> Inserting Property...");
    const { data: newProp, error: propError } = await supabase
      .from('properties')
      .insert({
        owner_id: payload.owner_id,
        title: payload.title,
        description: payload.description,
        city: payload.city,
        price: payload.price,
        price_num: payload.price_num,
        price_display: payload.price_display,
        status: 'pending',
        type: 'apartment', // mapped
        property_type: payload.property_type,
        bhk: payload.bhk,
        area_sqft: payload.area_sqft,
        furnishing: payload.furnishing,
        ownership: payload.ownership_type,
        ownership_type: payload.ownership_type,
        posted_by_role: payload.posted_by_role,
        floor_number: payload.floor_number,
        total_floors: payload.total_floors,
        facing: payload.facing,
        possession_status: payload.possession_status,
        property_age: payload.property_age,
        balconies: payload.balconies,
        maintenance_charges: payload.maintenance_charges,
        carpet_area: payload.carpet_area,
        built_up_area: payload.built_up_area,
        super_built_up_area: payload.super_built_up_area,
        bathrooms: payload.bathrooms,
        amenities: payload.amenities
      })
      .select()
      .single();

    if (propError) throw new Error(`Property Insert Failed: ${JSON.stringify(propError)}`);
    console.log(`✅ Property created: ${newProp.id}`);

    const propertyId = newProp.id;

    // 2. Insert Location
    console.log("-> Inserting Location...");
    const { error: locError } = await supabase
      .from('locations')
      .insert({
        property_id: propertyId,
        city: payload.city,
        locality: payload.locality,
        address: payload.address,
        state: payload.state,
        pincode: payload.pincode,
        lat: payload.lat,
        lng: payload.lng
      });
    if (locError) throw new Error(`Location Insert Failed: ${JSON.stringify(locError)}`);
    console.log(`✅ Location inserted`);

    // 3. Insert Images
    if (payload.property_images.length > 0) {
        console.log("-> Inserting Images...");
        const { error: imgError } = await supabase.from('property_images').insert(
            payload.property_images.map((img, idx) => ({
                property_id: propertyId,
                url: img.url,
                caption: img.caption || '',
                is_floor_plan: img.is_floor_plan || false,
                sort_order: idx
            }))
        );
        if (imgError) throw new Error(`Images Insert Failed: ${JSON.stringify(imgError)}`);
        console.log(`✅ Images inserted`);
    }

    // 4. Insert Videos
    if (payload.videos.length > 0) {
        console.log("-> Inserting Videos...");
        const { error: vidError } = await supabase.from('property_videos').insert(
            payload.videos.map((vid, idx) => ({
                property_id: propertyId,
                video_url: vid.url,
                thumbnail_url: vid.thumbnail || null,
                title: vid.title || '',
                sort_order: idx
            }))
        );
        if (vidError) throw new Error(`Videos Insert Failed: ${JSON.stringify(vidError)}`);
        console.log(`✅ Videos inserted`);
    }

    // 5. Insert Project Details
    if (payload.project_details) {
        console.log("-> Inserting Project Details...");
        const { error: projError } = await supabase.from('project_details').insert({
            property_id: propertyId,
            ...payload.project_details
        });
        if (projError) throw new Error(`Project Details Insert Failed: ${JSON.stringify(projError)}`);
        console.log(`✅ Project Details inserted`);
    }

    // 6. Insert Highlights
    if (payload.highlights.length > 0) {
        console.log("-> Inserting Highlights...");
        const { error: highError } = await supabase.from('property_highlights').insert(
            payload.highlights.map(h => ({
                property_id: propertyId,
                title: h.title,
                value: h.value
            }))
        );
        if (highError) throw new Error(`Highlights Insert Failed: ${JSON.stringify(highError)}`);
        console.log(`✅ Highlights inserted`);
    }

    // 7. Insert Location Advantages
    if (payload.location_advantages.length > 0) {
        console.log("-> Inserting Location Advantages...");
        const { error: advError } = await supabase.from('location_advantages').insert(
            payload.location_advantages.map(a => ({
                property_id: propertyId,
                name: a.name,
                distance: a.distance,
                type: a.type
            }))
        );
        if (advError) throw new Error(`Location Advantages Insert Failed: ${JSON.stringify(advError)}`);
        console.log(`✅ Location Advantages inserted`);
    }

    console.log("\n🎉 END-TO-END TRANSACTION SUCCESSFUL!");

  } catch (err) {
    console.error("\n❌ TRANSACTION FAILED:", err.message);
  }
}

runE2ETest();
