-- ==============================================================================
-- PROPERTY POSTING AUDIT FIXES - ADDITIVE SCHEMA UPDATE
-- ==============================================================================

-- 1. Add missing area columns to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS carpet_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS built_up_area NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS super_built_up_area NUMERIC;

-- 2. Add missing location columns to locations
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS state VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS pincode VARCHAR;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS lng NUMERIC;

-- 3. Add missing columns to project_details
ALTER TABLE public.project_details ADD COLUMN IF NOT EXISTS marketing_tagline VARCHAR;

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
