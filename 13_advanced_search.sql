-- Create search_configs table
CREATE TABLE IF NOT EXISTS public.search_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filter_key TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    filter_group TEXT NOT NULL,
    filter_type TEXT NOT NULL,
    options_source TEXT DEFAULT 'static',
    is_enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    criteria_json JSONB NOT NULL,
    version TEXT DEFAULT '1.0',
    notifications_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create search_analytics table
CREATE TABLE IF NOT EXISTS public.search_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    query TEXT,
    filters_used JSONB,
    result_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for Advanced Search to properties table
-- Ensure pg_trgm is available for full text search operations
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for fast text search
CREATE INDEX IF NOT EXISTS properties_title_trgm_idx ON public.properties USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_city_trgm_idx ON public.properties USING gin (city gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_project_name_trgm_idx ON public.properties USING gin (project_name gin_trgm_ops);

-- B-Tree indexes for fast exact matches and range scans
CREATE INDEX IF NOT EXISTS properties_price_idx ON public.properties (price);
CREATE INDEX IF NOT EXISTS properties_bhk_idx ON public.properties (bhk);
CREATE INDEX IF NOT EXISTS properties_property_type_idx ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS properties_status_idx ON public.properties (status);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON public.properties (created_at DESC);
CREATE INDEX IF NOT EXISTS properties_furnishing_idx ON public.properties (furnishing);
CREATE INDEX IF NOT EXISTS properties_possession_idx ON public.properties (possession_status);

-- Enable RLS
ALTER TABLE public.search_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Policies for search_configs
CREATE POLICY "Public can view active search_configs" ON public.search_configs
    FOR SELECT TO public USING (is_enabled = true);

CREATE POLICY "Admins can manage search_configs" ON public.search_configs
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies for saved_searches
CREATE POLICY "Users can manage their own saved_searches" ON public.saved_searches
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Policies for search_analytics
CREATE POLICY "Anyone can insert search_analytics" ON public.search_analytics
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view search_analytics" ON public.search_analytics
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Insert seed config data
INSERT INTO public.search_configs (filter_key, display_name, filter_group, filter_type, options_source, display_order, is_featured) VALUES
('propertyType', 'Property Type', 'Primary', 'checkbox', 'db', 1, true),
('transactionType', 'Transaction Type', 'Primary', 'radio', 'static', 2, true),
('postedBy', 'Posted By', 'Primary', 'checkbox', 'static', 3, false),
('price', 'Price Range', 'Price', 'slider', 'static', 4, true),
('bhk', 'BHK', 'Primary', 'checkbox', 'static', 5, true),
('bathrooms', 'Bathrooms', 'Details', 'checkbox', 'static', 6, false),
('furnishing', 'Furnishing', 'Details', 'checkbox', 'static', 7, false),
('possession', 'Possession', 'Details', 'radio', 'static', 8, true),
('amenities', 'Amenities', 'Amenities', 'checkbox', 'db', 9, false),
('lifestyle', 'Lifestyle', 'Lifestyle', 'checkbox', 'static', 10, false),
('hasMedia', 'Media', 'Media', 'checkbox', 'static', 11, false)
ON CONFLICT (filter_key) DO NOTHING;
