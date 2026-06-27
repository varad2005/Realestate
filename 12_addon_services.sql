-- Create addon_services table
CREATE TABLE IF NOT EXISTS public.addon_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    detailed_description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    image_url TEXT,
    base_price NUMERIC NOT NULL,
    tax_percentage NUMERIC DEFAULT 18.0,
    duration_days INTEGER,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create property_addon_orders table
CREATE TABLE IF NOT EXISTS public.property_addon_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    addon_service_id UUID REFERENCES public.addon_services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price_at_purchase NUMERIC NOT NULL,
    total_amount NUMERIC NOT NULL,
    payment_status TEXT DEFAULT 'Pending',
    order_status TEXT DEFAULT 'Pending',
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies for addon_services
ALTER TABLE public.addon_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active services
CREATE POLICY "Public read active addon_services" ON public.addon_services
    FOR SELECT USING (is_active = true);

-- Allow admin full access
CREATE POLICY "Admin full access addon_services" ON public.addon_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- RLS Policies for property_addon_orders
ALTER TABLE public.property_addon_orders ENABLE ROW LEVEL SECURITY;

-- Allow users to see orders for their own properties
CREATE POLICY "Users can view their own property orders" ON public.property_addon_orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = property_addon_orders.property_id
            AND properties.owner_id = auth.uid()
        )
    );

-- Allow users to create orders for their own properties
CREATE POLICY "Users can create orders for their own properties" ON public.property_addon_orders
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = property_addon_orders.property_id
            AND properties.owner_id = auth.uid()
        )
    );

-- Allow admins full access
CREATE POLICY "Admin full access addon_orders" ON public.property_addon_orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Triggers for updated_at
CREATE TRIGGER set_addon_services_updated_at
BEFORE UPDATE ON public.addon_services
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_property_addon_orders_updated_at
BEFORE UPDATE ON public.property_addon_orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Storage bucket for addons
INSERT INTO storage.buckets (id, name, public)
VALUES ('addon_services', 'addon_services', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access addon_services bucket"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'addon_services' );

CREATE POLICY "Admin Upload Access addon_services bucket"
    ON storage.objects FOR INSERT
    WITH CHECK ( 
        bucket_id = 'addon_services' 
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin Update Access addon_services bucket"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'addon_services'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE POLICY "Admin Delete Access addon_services bucket"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'addon_services'
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

-- Add initial services
INSERT INTO public.addon_services (name, slug, short_description, category, base_price, is_featured, is_active)
VALUES 
('Professional Photography', 'professional-photography', 'High-quality photos of your property', 'Media', 1999, true, true),
('Featured Listing', 'featured-listing', 'Appears at the top of search results', 'Visibility', 2999, true, true),
('Drone Tour', 'drone-tour', 'Aerial video of the property and surroundings', 'Media', 4999, false, true),
('Legal Verification', 'legal-verification', 'Complete check of property documents', 'Legal', 1499, false, true);

-- RPC for atomic insertion of property and addons
CREATE OR REPLACE FUNCTION public.create_property_with_addons(
  prop_payload jsonb,
  addon_ids uuid[]
) RETURNS jsonb AS $$
DECLARE
  new_prop_id uuid;
  addon_id uuid;
  addon_price numeric;
  result jsonb;
BEGIN
  -- Insert the property
  INSERT INTO public.properties (
    owner_id, title, city, locality, price, price_num, price_display, description,
    status, property_type, bhk, bathrooms, area_sqft, carpet_area, built_up_area,
    super_built_up_area, furnishing, ownership_type, posted_by_role, floor_number,
    total_floors, facing, possession_status, property_age, balconies, maintenance_charges,
    state, pincode, address, lat, lng, images, videos, primary_video_index,
    amenity_ids, project_details, location_advantages, highlights
  ) VALUES (
    (prop_payload->>'owner_id')::uuid,
    prop_payload->>'title',
    prop_payload->>'city',
    prop_payload->>'locality',
    (prop_payload->>'price')::numeric,
    (prop_payload->>'price_num')::numeric,
    prop_payload->>'price_display',
    prop_payload->>'description',
    prop_payload->>'status',
    prop_payload->>'property_type',
    (prop_payload->>'bhk')::integer,
    (prop_payload->>'bathrooms')::integer,
    (prop_payload->>'area_sqft')::numeric,
    (prop_payload->>'carpet_area')::numeric,
    (prop_payload->>'built_up_area')::numeric,
    (prop_payload->>'super_built_up_area')::numeric,
    prop_payload->>'furnishing',
    prop_payload->>'ownership_type',
    prop_payload->>'posted_by_role',
    (prop_payload->>'floor_number')::integer,
    (prop_payload->>'total_floors')::integer,
    prop_payload->>'facing',
    prop_payload->>'possession_status',
    prop_payload->>'property_age',
    (prop_payload->>'balconies')::integer,
    (prop_payload->>'maintenance_charges')::numeric,
    prop_payload->>'state',
    prop_payload->>'pincode',
    prop_payload->>'address',
    (prop_payload->>'lat')::numeric,
    (prop_payload->>'lng')::numeric,
    (prop_payload->'images')::jsonb,
    (prop_payload->'videos')::jsonb,
    (prop_payload->>'primaryVideoIndex')::integer,
    (SELECT array_agg(x::uuid) FROM jsonb_array_elements_text(prop_payload->'amenity_ids') x),
    (prop_payload->'project_details')::jsonb,
    (prop_payload->'location_advantages')::jsonb,
    (prop_payload->'highlights')::jsonb
  ) RETURNING id INTO new_prop_id;

  -- Insert addons if provided
  IF array_length(addon_ids, 1) > 0 THEN
    FOREACH addon_id IN ARRAY addon_ids
    LOOP
      SELECT base_price + (base_price * tax_percentage / 100) INTO addon_price 
      FROM public.addon_services WHERE id = addon_id AND is_active = true;

      IF addon_price IS NOT NULL THEN
        INSERT INTO public.property_addon_orders (
          property_id, addon_service_id, quantity, price_at_purchase, total_amount, payment_status, order_status
        ) VALUES (
          new_prop_id, addon_id, 1, addon_price, addon_price, 'Pending', 'Pending'
        );
      END IF;
    END LOOP;
  END IF;

  -- Return the new property id and some basic info
  result := jsonb_build_object(
    'id', new_prop_id,
    'title', prop_payload->>'title',
    'price_display', prop_payload->>'price_display',
    'property_type', prop_payload->>'property_type',
    'bhk', (prop_payload->>'bhk')::integer
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
