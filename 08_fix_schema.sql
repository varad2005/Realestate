-- ==============================================================================
-- 08_fix_schema.sql: SCHEMA FIXES FOR PROPERTY POSTING SYSTEM
-- ==============================================================================

-- 1. Add missing area columns to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS carpet_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS built_up_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS super_built_up_area NUMERIC;

-- 2. Add missing maintenance_charges and price columns
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS maintenance_charges NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_num NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_display VARCHAR;

-- 3. Add missing location columns to locations
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS state VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS pincode VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- 4. Add missing columns to project_details
ALTER TABLE public.project_details ADD COLUMN IF NOT EXISTS marketing_tagline VARCHAR;

-- 5. Create missing saved_properties table
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- Enable RLS on saved_properties
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors on re-run
DROP POLICY IF EXISTS "Users can view their own saved properties" ON public.saved_properties;
DROP POLICY IF EXISTS "Users can insert their own saved properties" ON public.saved_properties;
DROP POLICY IF EXISTS "Users can delete their own saved properties" ON public.saved_properties;

-- Create policies for saved_properties
CREATE POLICY "Users can view their own saved properties" 
    ON public.saved_properties FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved properties" 
    ON public.saved_properties FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved properties" 
    ON public.saved_properties FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
