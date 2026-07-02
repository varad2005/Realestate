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
  const OLD_PROJECT = "gghbeddckyaphbpbqwye";
  
  // Fix property images
  let { data: images } = await supabase.from('property_images').select('id, url');
  let oldImageUrls = images?.filter(img => img.url?.includes(OLD_PROJECT)) || [];
  console.log(`property_images with old URL: ${oldImageUrls.length}`);
  
  for (let img of oldImageUrls) {
      const newUrl = img.url.replace(OLD_PROJECT, "vguellwkjbbeqvhuexfg");
      await supabase.from('property_images').update({ url: newUrl }).eq('id', img.id);
      console.log(`Updated image ${img.id}`);
  }

  // Fix property videos
  let { data: videos } = await supabase.from('property_videos').select('id, video_url, thumbnail_url');
  let oldVideoUrls = videos?.filter(v => v.video_url?.includes(OLD_PROJECT) || v.thumbnail_url?.includes(OLD_PROJECT)) || [];
  console.log(`property_videos with old URL: ${oldVideoUrls.length}`);
  
  for (let vid of oldVideoUrls) {
      let updates = {};
      if (vid.video_url?.includes(OLD_PROJECT)) updates.video_url = vid.video_url.replace(OLD_PROJECT, "vguellwkjbbeqvhuexfg");
      if (vid.thumbnail_url?.includes(OLD_PROJECT)) updates.thumbnail_url = vid.thumbnail_url.replace(OLD_PROJECT, "vguellwkjbbeqvhuexfg");
      await supabase.from('property_videos').update(updates).eq('id', vid.id);
      console.log(`Updated video ${vid.id}`);
  }
}
run();
