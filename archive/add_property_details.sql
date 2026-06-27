-- Add missing columns to properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS floor_number INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS total_floors INT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS facing VARCHAR(50);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_status VARCHAR(50);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_age VARCHAR(50);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS ownership_type VARCHAR(50);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS balconies INT;

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
