-- Script to create missing storage buckets and their RLS policies

-- 1. Create property_images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to property_images bucket
DROP POLICY IF EXISTS "Public read access for property_images bucket" ON storage.objects;
CREATE POLICY "Public read access for property_images bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property_images');

-- Policy: Allow authenticated users to upload to property_images bucket
DROP POLICY IF EXISTS "Auth users upload to property_images bucket" ON storage.objects;
CREATE POLICY "Auth users upload to property_images bucket" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'property_images');


-- 2. Create property-videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('property-videos', 'property-videos', true, 52428800, '{"video/mp4","video/webm","video/quicktime"}')
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for property-videos bucket" ON storage.objects;
CREATE POLICY "Public read access for property-videos bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-videos');

DROP POLICY IF EXISTS "Auth users upload to property-videos bucket" ON storage.objects;
CREATE POLICY "Auth users upload to property-videos bucket" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'property-videos');


-- 3. Create property-360 bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-360', 'property-360', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access property-360 bucket" ON storage.objects;
CREATE POLICY "Public Access property-360 bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-360' );

DROP POLICY IF EXISTS "Auth Upload property-360 bucket" ON storage.objects;
CREATE POLICY "Auth Upload property-360 bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'property-360' );


-- 4. Create addon_services bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('addon_services', 'addon_services', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access addon_services bucket" ON storage.objects;
CREATE POLICY "Public Access addon_services bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'addon_services' );

DROP POLICY IF EXISTS "Admin Upload Access addon_services bucket" ON storage.objects;
CREATE POLICY "Admin Upload Access addon_services bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'addon_services' );


-- 5. Create hero_banners bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero_banners', 'hero_banners', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access hero_banners bucket" ON storage.objects;
CREATE POLICY "Public Access hero_banners bucket"
ON storage.objects FOR SELECT
USING ( bucket_id = 'hero_banners' );

DROP POLICY IF EXISTS "Admin Upload Access hero_banners bucket" ON storage.objects;
CREATE POLICY "Admin Upload Access hero_banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hero_banners' );
