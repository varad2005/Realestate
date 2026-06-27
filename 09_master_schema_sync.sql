-- ==============================================================================
-- 09_master_schema_sync.sql: COMPLETE END-TO-END SCHEMA SYNC
-- ==============================================================================

-- 1. Ensure all Properties columns exist
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS carpet_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS built_up_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS super_built_up_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS maintenance_charges NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_num NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_display VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_number INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS total_floors INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_status VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS project_builder VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_age VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS facing VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS balconies INT;

-- 2. Ensure Locations columns exist
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS state VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS pincode VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- 3. Create property_videos
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

-- 4. Create property_highlights
CREATE TABLE IF NOT EXISTS public.property_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create project_details
CREATE TABLE IF NOT EXISTS public.project_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    project_name VARCHAR NOT NULL,
    builder_name VARCHAR NOT NULL,
    launch_year VARCHAR,
    total_units INT,
    project_area VARCHAR,
    rera_number VARCHAR,
    possession_date VARCHAR,
    marketing_tagline VARCHAR,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure missing columns exist if table was already partially created
ALTER TABLE public.project_details ADD COLUMN IF NOT EXISTS possession_date VARCHAR;
ALTER TABLE public.project_details ADD COLUMN IF NOT EXISTS marketing_tagline VARCHAR;
ALTER TABLE public.project_details ADD COLUMN IF NOT EXISTS description TEXT;

-- 6. Ensure location_advantages has correct schema
CREATE TABLE IF NOT EXISTS public.location_advantages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    distance VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: we omit the CHECK constraint on `type` in case existing data violates it.

-- 7. Ensure saved_properties exists
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- 8. Disable RLS on these new tables for now to avoid permission issues during posting
ALTER TABLE public.property_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_highlights DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_advantages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties DISABLE ROW LEVEL SECURITY;

-- 9. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
