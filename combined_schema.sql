-- ==============================================================================
-- 99ACRES INSPIRED PROPERTY POSTING SYSTEM - ADDITIVE SCHEMA UPDATE
-- ==============================================================================

-- 1. Safely add maintenance_charges to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS maintenance_charges NUMERIC;

-- 2. Create amenities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    icon_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create property_amenities join table
CREATE TABLE IF NOT EXISTS public.property_amenities (
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (property_id, amenity_id)
);

-- 4. Ensure property_images has CASCADE (though it usually does)
-- By default foreign keys don't have cascade unless specified. We will try to add it if possible, but safely.
-- (Skipped modifying existing foreign keys to avoid destructive migration, we will rely on client rollback if needed, but we assume ON DELETE CASCADE is already on these per best practices).

-- Pre-seed some common amenities for dealers to choose from
INSERT INTO public.amenities (name, icon_name)
VALUES
  ('Swimming Pool', 'Waves'),
  ('Gymnasium', 'Dumbbell'),
  ('Clubhouse', 'Home'),
  ('24/7 Security', 'Shield'),
  ('Garden', 'TreeDeciduous'),
  ('Reserved Parking', 'Car'),
  ('Kids Play Area', 'Smile'),
  ('Power Backup', 'Zap')
ON CONFLICT (name) DO NOTHING;

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
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
-- ==============================================================================
-- 99ACRES INSPIRED PROPERTY VIDEOS - ADDITIVE SCHEMA UPDATE
-- ==============================================================================
-- This script creates the property_videos table and configures storage.
-- ==============================================================================

-- 1. Create property_videos table
CREATE TABLE IF NOT EXISTS public.property_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    video_url VARCHAR NOT NULL,
    thumbnail_url VARCHAR,
    title VARCHAR,
    duration_seconds INT,
    file_size_mb NUMERIC,
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for property_videos
ALTER TABLE public.property_videos ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read all videos
DROP POLICY IF EXISTS "Public read access for property_videos" ON public.property_videos;
CREATE POLICY "Public read access for property_videos"
ON public.property_videos FOR SELECT USING (true);

-- Policy: Only property owners can manage their videos
-- Note: We check if auth.uid() matches the property's owner_id
DROP POLICY IF EXISTS "Owner can manage property_videos" ON public.property_videos;
CREATE POLICY "Owner can manage property_videos"
ON public.property_videos
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_videos.property_id
        AND properties.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_videos.property_id
        AND properties.owner_id = auth.uid()
    )
);

-- 2. Create storage bucket for property_videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'property-videos', 
    'property-videos', 
    true, 
    262144000, -- 250 MB
    ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to property-videos bucket
DROP POLICY IF EXISTS "Public read access for property-videos bucket" ON storage.objects;
CREATE POLICY "Public read access for property-videos bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-videos');

-- Policy: Allow authenticated users to upload to property-videos bucket
DROP POLICY IF EXISTS "Auth users upload to property-videos bucket" ON storage.objects;
CREATE POLICY "Auth users upload to property-videos bucket" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'property-videos');

-- Policy: Allow authenticated users to update/delete their own video objects
DROP POLICY IF EXISTS "Auth users manage their property-videos" ON storage.objects;
CREATE POLICY "Auth users manage their property-videos"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'property-videos' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'property-videos' AND auth.uid() = owner);

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
