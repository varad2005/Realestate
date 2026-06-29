-- ============================================================
-- 14_virtual_tours.sql
-- 360° Property Virtual Tour System
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create property_virtual_tours table
CREATE TABLE IF NOT EXISTS public.property_virtual_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  panorama_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT NOT NULL DEFAULT 'Virtual Tour',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by property
CREATE INDEX IF NOT EXISTS idx_virtual_tours_property_id
  ON public.property_virtual_tours(property_id);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_virtual_tours_sort_order
  ON public.property_virtual_tours(property_id, sort_order);

-- 2. Create virtual_tour_analytics table
CREATE TABLE IF NOT EXISTS public.virtual_tour_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.property_virtual_tours(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('tour_open', 'scene_switch', 'tour_close')),
  scene_title TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_tour_analytics_property_id
  ON public.virtual_tour_analytics(property_id);
CREATE INDEX IF NOT EXISTS idx_tour_analytics_tour_id
  ON public.virtual_tour_analytics(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_analytics_event_type
  ON public.virtual_tour_analytics(event_type);

-- 3. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_virtual_tour_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_virtual_tour_timestamp
  BEFORE UPDATE ON public.property_virtual_tours
  FOR EACH ROW EXECUTE FUNCTION public.update_virtual_tour_updated_at();

-- 4. RLS Policies for property_virtual_tours
ALTER TABLE public.property_virtual_tours ENABLE ROW LEVEL SECURITY;

-- Public can view all tours (for buyers)
CREATE POLICY "Anyone can view virtual tours"
  ON public.property_virtual_tours
  FOR SELECT
  USING (true);

-- Only the property owner can insert tours
CREATE POLICY "Property owner can insert tours"
  ON public.property_virtual_tours
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_virtual_tours.property_id
        AND properties.owner_id = auth.uid()
    )
  );

-- Only the property owner can update tours
CREATE POLICY "Property owner can update tours"
  ON public.property_virtual_tours
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_virtual_tours.property_id
        AND properties.owner_id = auth.uid()
    )
  );

-- Only the property owner or admin can delete tours
CREATE POLICY "Property owner or admin can delete tours"
  ON public.property_virtual_tours
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = property_virtual_tours.property_id
        AND properties.owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
  );

-- 5. RLS Policies for virtual_tour_analytics
ALTER TABLE public.virtual_tour_analytics ENABLE ROW LEVEL SECURITY;

-- Anyone can insert analytics events (track views)
CREATE POLICY "Anyone can insert analytics"
  ON public.virtual_tour_analytics
  FOR INSERT
  WITH CHECK (true);

-- Only admins and property owners can read analytics
CREATE POLICY "Owners and admins can read analytics"
  ON public.virtual_tour_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'owner', 'dealer')
    )
  );

-- 6. Create the property-360 storage bucket
-- NOTE: Run this separately if the storage bucket creation via SQL is not supported.
-- Instead, create it manually in Supabase Dashboard > Storage > New Bucket:
--   Name: property-360
--   Public: YES
-- Then add storage policies below via Dashboard > Storage > Policies.

-- If your Supabase version supports it, run:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-360',
  'property-360',
  true,
  52428800, -- 50 MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload 360 images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'property-360'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view 360 images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-360');

CREATE POLICY "Owners can delete their 360 images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'property-360'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Done! ✓
-- Verify with:
-- SELECT * FROM public.property_virtual_tours LIMIT 1;
-- SELECT * FROM public.virtual_tour_analytics LIMIT 1;
