-- Create the saved_properties table
CREATE TABLE IF NOT EXISTS public.saved_properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_properties
DROP POLICY IF EXISTS "Users can view their own saved properties" ON public.saved_properties;
CREATE POLICY "Users can view their own saved properties" 
ON public.saved_properties FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save properties" ON public.saved_properties;
CREATE POLICY "Users can save properties" 
ON public.saved_properties FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave properties" ON public.saved_properties;
CREATE POLICY "Users can unsave properties" 
ON public.saved_properties FOR DELETE 
USING (auth.uid() = user_id);

-- Notify postgREST to reload schema
NOTIFY pgrst, 'reload schema';
