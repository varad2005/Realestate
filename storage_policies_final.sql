-- COMPREHENSIVE STORAGE RLS FIX (FINAL)
-- Ensure buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('property_images', 'property_images', true, null, null),
  ('property-videos', 'property-videos', true, 262144000, '{"video/mp4","video/webm","video/quicktime"}'),
  ('property-360', 'property-360', true, null, null),
  ('addon_services', 'addon_services', true, null, null),
  ('hero_banners', 'hero_banners', true, null, null)
ON CONFLICT (id) DO NOTHING;

-- Clean up ALL previous conflicting policies
DROP POLICY IF EXISTS "Public read access for property_images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload to property_images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for property-videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload to property-videos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access property-360 bucket" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload property-360 bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access addon_services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access addon_services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access hero_banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access hero_banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Read property_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert property_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update property_images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete property_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read property-videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert property-videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update property-videos" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete property-videos" ON storage.objects;
DROP POLICY IF EXISTS "Public Read property-360" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert property-360" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update property-360" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete property-360" ON storage.objects;
DROP POLICY IF EXISTS "Public Read addon_services" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert addon_services" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update addon_services" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete addon_services" ON storage.objects;
DROP POLICY IF EXISTS "Public Read hero_banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert hero_banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update hero_banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete hero_banners" ON storage.objects;


-- ==========================================
-- 1. property_images
-- ==========================================
CREATE POLICY "Public Read property_images" 
ON storage.objects FOR SELECT USING (bucket_id = 'property_images');

CREATE POLICY "Auth Insert property_images" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'property_images' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Update property_images" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'property_images' AND owner = auth.uid());

CREATE POLICY "Auth Delete property_images" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'property_images' AND owner = auth.uid());


-- ==========================================
-- 2. property-videos
-- ==========================================
CREATE POLICY "Public Read property-videos" 
ON storage.objects FOR SELECT USING (bucket_id = 'property-videos');

CREATE POLICY "Auth Insert property-videos" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'property-videos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Update property-videos" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'property-videos' AND owner = auth.uid());

CREATE POLICY "Auth Delete property-videos" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'property-videos' AND owner = auth.uid());


-- ==========================================
-- 3. property-360
-- ==========================================
CREATE POLICY "Public Read property-360" 
ON storage.objects FOR SELECT USING (bucket_id = 'property-360');

CREATE POLICY "Auth Insert property-360" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'property-360' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Auth Update property-360" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'property-360' AND owner = auth.uid());

CREATE POLICY "Auth Delete property-360" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'property-360' AND owner = auth.uid());


-- ==========================================
-- 4. addon_services (Admin level, no strict owner binding for updates)
-- ==========================================
CREATE POLICY "Public Read addon_services" 
ON storage.objects FOR SELECT USING (bucket_id = 'addon_services');

CREATE POLICY "Auth Insert addon_services" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'addon_services');

CREATE POLICY "Auth Update addon_services" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'addon_services');

CREATE POLICY "Auth Delete addon_services" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'addon_services');


-- ==========================================
-- 5. hero_banners (Admin level)
-- ==========================================
CREATE POLICY "Public Read hero_banners" 
ON storage.objects FOR SELECT USING (bucket_id = 'hero_banners');

CREATE POLICY "Auth Insert hero_banners" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'hero_banners');

CREATE POLICY "Auth Update hero_banners" 
ON storage.objects FOR UPDATE TO authenticated 
USING (bucket_id = 'hero_banners');

CREATE POLICY "Auth Delete hero_banners" 
ON storage.objects FOR DELETE TO authenticated 
USING (bucket_id = 'hero_banners');
