-- ==============================================================================
-- 99ACRES INSPIRED PROPERTY DETAILS - ADDITIVE SCHEMA UPDATE
-- ==============================================================================
-- IMPORTANT: This script only adds new columns and tables. 
-- It does NOT drop existing tables or destructively modify columns.
-- ==============================================================================

-- 1. Safely add missing columns to the `properties` table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_number INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS total_floors INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_status VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS project_builder VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_age VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS facing VARCHAR;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS balconies INT;

-- 2. Create the `property_highlights` table
CREATE TABLE IF NOT EXISTS public.property_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the `project_details` table
CREATE TABLE IF NOT EXISTS public.project_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    project_name VARCHAR NOT NULL,
    builder_name VARCHAR NOT NULL,
    launch_year VARCHAR,
    total_units INT,
    project_area VARCHAR,
    rera_number VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create the `location_advantages` table (if missing or missing standard columns)
CREATE TABLE IF NOT EXISTS public.location_advantages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    distance VARCHAR NOT NULL,
    type VARCHAR NOT NULL CHECK (type IN ('school', 'hospital', 'transport', 'mall', 'park', 'metro', 'it_park', 'highway', 'airport')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: No RLS policies are applied to these tables here to avoid breaking existing access.
-- If RLS is enabled globally, consider adding SELECT policies below:
-- ALTER TABLE public.property_highlights ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read highlights" ON public.property_highlights FOR SELECT USING (true);
-- ALTER TABLE public.project_details ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read project details" ON public.project_details FOR SELECT USING (true);
-- ALTER TABLE public.location_advantages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read location advantages" ON public.location_advantages FOR SELECT USING (true);
