-- Drop the strict ENUM constraint on location_advantages type column
-- This fixes the "invalid input value for enum advantage_type" error
ALTER TABLE public.location_advantages ALTER COLUMN type TYPE VARCHAR USING type::varchar;
NOTIFY pgrst, 'reload schema';
