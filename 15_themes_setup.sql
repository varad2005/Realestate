-- Create themes table
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_name TEXT NOT NULL,
    primary_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    accent_color TEXT NOT NULL,
    background_color TEXT NOT NULL,
    surface_color TEXT NOT NULL,
    card_color TEXT NOT NULL,
    navbar_color TEXT NOT NULL,
    footer_color TEXT NOT NULL,
    text_color TEXT NOT NULL,
    muted_color TEXT NOT NULL,
    border_color TEXT NOT NULL,
    gradient_start TEXT NOT NULL,
    gradient_end TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to themes
CREATE POLICY "Allow public read access to themes" ON public.themes
    FOR SELECT USING (true);

-- Allow admins to update themes
CREATE POLICY "Allow admins to update themes" ON public.themes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Allow admins to insert themes" ON public.themes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Allow admins to delete themes" ON public.themes
    FOR DELETE USING (
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
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS on_themes_updated ON public.themes;
CREATE TRIGGER on_themes_updated
    BEFORE UPDATE ON public.themes
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Enable realtime for themes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.themes;

-- Seed Data

-- Theme 1: Emerald Luxury (Active)
INSERT INTO public.themes (
    theme_name, primary_color, secondary_color, accent_color, 
    background_color, surface_color, card_color, navbar_color, footer_color, 
    text_color, muted_color, border_color, gradient_start, gradient_end, is_active
) VALUES (
    'Emerald Luxury', '#0F7C6E', '#18B29A', '#FFD166', 
    '#F5FBF8', '#ECF8F5', '#FFFFFF', 'rgba(10,35,32,.82)', '#062F2A', 
    '#1A1A1A', '#6B7280', '#D9ECE6', '#0F7C6E', '#18B29A', true
) ON CONFLICT DO NOTHING;

-- Theme 2: Royal Blue
INSERT INTO public.themes (
    theme_name, primary_color, secondary_color, accent_color, 
    background_color, surface_color, card_color, navbar_color, footer_color, 
    text_color, muted_color, border_color, gradient_start, gradient_end, is_active
) VALUES (
    'Royal Blue', '#1E40AF', '#3B82F6', '#F59E0B', 
    '#F4F8FF', '#EEF5FF', '#FFFFFF', 'rgba(18,28,63,.82)', '#172554', 
    '#1A1A1A', '#6B7280', '#DCE7FF', '#1E40AF', '#3B82F6', false
) ON CONFLICT DO NOTHING;

-- Theme 3: Celebration Gold
INSERT INTO public.themes (
    theme_name, primary_color, secondary_color, accent_color, 
    background_color, surface_color, card_color, navbar_color, footer_color, 
    text_color, muted_color, border_color, gradient_start, gradient_end, is_active
) VALUES (
    'Celebration Gold', '#8B1E3F', '#E63946', '#F4C430', 
    '#FFF8F0', '#FFF3E6', '#FFFFFF', '#531B2E', '#3A1021', 
    '#2A2A2A', '#6B7280', '#F2DEC4', '#8B1E3F', '#E63946', false
) ON CONFLICT DO NOTHING;
