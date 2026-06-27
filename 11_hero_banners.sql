-- Create hero_banners table
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    button_text TEXT,
    button_link TEXT,
    image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    badge_text TEXT,
    overlay_opacity NUMERIC DEFAULT 0.3,
    text_alignment TEXT DEFAULT 'center',
    text_color TEXT DEFAULT '#FFFFFF',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active banners
CREATE POLICY "Allow public read access for active banners" ON public.hero_banners
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= now())
        AND (end_date IS NULL OR end_date > now())
    );

-- Allow admins to do all operations
CREATE POLICY "Allow admin full access to banners" ON public.hero_banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_hero_banners_updated_at
BEFORE UPDATE ON public.hero_banners
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for hero banners if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero_banners', 'hero_banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for hero_banners
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'hero_banners' );

CREATE POLICY "Admin Upload Access"
    ON storage.objects FOR INSERT
    WITH CHECK ( 
        bucket_id = 'hero_banners' 
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin Update Access"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'hero_banners'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin Delete Access"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'hero_banners'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Seed initial default banners
INSERT INTO public.hero_banners (title, subtitle, description, button_text, button_link, image_url, overlay_opacity, text_alignment, display_order, is_active)
VALUES 
(
  'Find Your Perfect Home',
  '1,20,000+ Verified Listings',
  'Discover homes across India''s top cities — verified, trusted, effortless.',
  'View Projects',
  '/projects',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  0.3,
  'center',
  0,
  true
),
(
  'Luxury Living Redefined',
  'Premium Properties',
  'Experience the ultimate comfort and elegance with our exclusive luxury listings.',
  'Explore Luxury',
  '/luxury-homes',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  0.4,
  'center',
  1,
  true
),
(
  'Modern Apartments',
  'City Center Locations',
  'Stay close to the action with our carefully curated urban apartments.',
  'Search Now',
  '/buy',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  0.3,
  'center',
  2,
  true
),
(
  'Spacious Villas',
  'Your Private Retreat',
  'Find peace and tranquility in our selection of beautiful standalone villas.',
  'View Villas',
  '/projects',
  'https://images.unsplash.com/photo-1583608205712-bea24409395b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  0.3,
  'center',
  3,
  true
);
