-- ==============================================================================
-- 99ACRES INSPIRED PROPERTY POSTING SYSTEM - EXTENSIONS
-- ==============================================================================

-- 1. Expand location_advantages
ALTER TABLE public.location_advantages ADD COLUMN IF NOT EXISTS distance_unit VARCHAR DEFAULT 'km';

-- 2. Ensure property_images has sort_order
ALTER TABLE public.property_images ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- 3. Set up storage bucket for property images (if not already existing)
-- NOTE: In Supabase, creating buckets via SQL requires inserting into storage.buckets
-- Ensure the bucket is public so images can be viewed without signed URLs.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property_images', 'property_images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to property_images bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property_images');

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Auth users upload access" ON storage.objects;
CREATE POLICY "Auth users upload access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'property_images');

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
