-- =======================================================
-- 1. ENABLE EXTENSIONS & RLS POLICIES
-- =======================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Allow insert for own user" ON public.users;
CREATE POLICY "Allow insert for own user" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow select for users" ON public.users;
CREATE POLICY "Allow select for users" ON public.users FOR SELECT USING (true);

-- Properties policies
DROP POLICY IF EXISTS "Public can read approved properties" ON public.properties;
CREATE POLICY "Public can read approved properties" ON public.properties FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Owner can manage own properties" ON public.properties;
CREATE POLICY "Owner can manage own properties" ON public.properties FOR ALL USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Admin can manage all" ON public.properties;
CREATE POLICY "Admin can manage all" ON public.properties FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- =======================================================
-- 2. SEED DEMO USERS (auth.users & public.users)
-- =======================================================
-- Note: 'password123' is the password for all seeded users
DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
  dealer_id uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
BEGIN

  -- 1. ADMIN USER
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'admin@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"System Admin","role":"admin"}', now(), now(), 'authenticated', 'authenticated');
  
  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), admin_id, admin_id::text, format('{"sub":"%s","email":"admin@demo.com"}', admin_id::text)::jsonb, 'email', now(), now());

  INSERT INTO public.users (id, name, email, role) VALUES (admin_id, 'System Admin', 'admin@demo.com', 'admin');

  -- 2. DEALER USER
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (dealer_id, '00000000-0000-0000-0000-000000000000', 'dealer@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Premium Dealer","role":"dealer"}', now(), now(), 'authenticated', 'authenticated');

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), dealer_id, dealer_id::text, format('{"sub":"%s","email":"dealer@demo.com"}', dealer_id::text)::jsonb, 'email', now(), now());

  INSERT INTO public.users (id, name, email, role) VALUES (dealer_id, 'Premium Dealer', 'dealer@demo.com', 'dealer');

  -- 3. OWNER USER
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  VALUES (owner_id, '00000000-0000-0000-0000-000000000000', 'owner@demo.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Property Owner","role":"owner"}', now(), now(), 'authenticated', 'authenticated');

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (gen_random_uuid(), owner_id, owner_id::text, format('{"sub":"%s","email":"owner@demo.com"}', owner_id::text)::jsonb, 'email', now(), now());

  INSERT INTO public.users (id, name, email, role) VALUES (owner_id, 'Property Owner', 'owner@demo.com', 'owner');


  -- =======================================================
  -- 3. SEED LOCATIONS
  -- =======================================================
  -- Just using raw inserts for locations, we'll assume they don't exist yet or we can ON CONFLICT DO NOTHING
  INSERT INTO public.locations (city, locality, state) VALUES
    ('Mumbai', 'Bandra West', 'Maharashtra'),
    ('Mumbai', 'Andheri East', 'Maharashtra'),
    ('Delhi', 'Vasant Vihar', 'Delhi'),
    ('Bangalore', 'Indiranagar', 'Karnataka'),
    ('Bangalore', 'Whitefield', 'Karnataka')
  ON CONFLICT DO NOTHING;

  -- =======================================================
  -- 4. SEED PROPERTIES
  -- =======================================================
  -- Inserting 5 realistic properties. We will use the generated dealer_id and owner_id.
  
  -- Property 1 (Dealer)
  WITH p1 AS (
    INSERT INTO public.properties (owner_id, title, description, property_type, price_num, price_display, bhk, area_sqft, furnishing, parking, bathrooms, status)
    VALUES (dealer_id, 'Luxury 4 BHK Villa in Bandra', 'A premium sea-facing villa with modern amenities.', 'villa', 50000000, '₹5 Cr', 4, 3500, 'fully_furnished', '2 Covered', 4, 'approved')
    RETURNING id
  )
  INSERT INTO public.property_images (property_id, url, is_primary)
  SELECT id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', true FROM p1;

  -- Property 2 (Owner)
  WITH p2 AS (
    INSERT INTO public.properties (owner_id, title, description, property_type, price_num, price_display, bhk, area_sqft, furnishing, parking, bathrooms, status)
    VALUES (owner_id, 'Spacious 2 BHK in Indiranagar', 'Well maintained 2 BHK apartment in the heart of the city.', 'apartment', 12000000, '₹1.2 Cr', 2, 1200, 'semi_furnished', '1 Covered', 2, 'approved')
    RETURNING id
  )
  INSERT INTO public.property_images (property_id, url, is_primary)
  SELECT id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', true FROM p2;

  -- Property 3 (Dealer)
  WITH p3 AS (
    INSERT INTO public.properties (owner_id, title, description, property_type, price_num, price_display, bhk, area_sqft, furnishing, parking, bathrooms, status)
    VALUES (dealer_id, 'Modern 3 BHK in Vasant Vihar', 'Brand new construction with premium fittings and smart home features.', 'apartment', 35000000, '₹3.5 Cr', 3, 2100, 'unfurnished', '2 Covered', 3, 'approved')
    RETURNING id
  )
  INSERT INTO public.property_images (property_id, url, is_primary)
  SELECT id, 'https://images.unsplash.com/photo-1502672260266-1c1e52504437?auto=format&fit=crop&w=800&q=80', true FROM p3;

  -- Property 4 (Owner)
  WITH p4 AS (
    INSERT INTO public.properties (owner_id, title, description, property_type, price_num, price_display, bhk, area_sqft, furnishing, parking, bathrooms, status)
    VALUES (owner_id, 'Cozy 1 BHK in Andheri East', 'Perfect for bachelors or young couples. Close to metro.', 'apartment', 8500000, '₹85 Lacs', 1, 650, 'fully_furnished', 'Open', 1, 'approved')
    RETURNING id
  )
  INSERT INTO public.property_images (property_id, url, is_primary)
  SELECT id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', true FROM p4;

  -- Property 5 (Dealer)
  WITH p5 AS (
    INSERT INTO public.properties (owner_id, title, description, property_type, price_num, price_display, bhk, area_sqft, furnishing, parking, bathrooms, status)
    VALUES (dealer_id, 'Premium Plot in Whitefield', 'North-facing residential plot in a gated community.', 'plot', 25000000, '₹2.5 Cr', null, 4000, 'unfurnished', 'None', null, 'approved')
    RETURNING id
  )
  INSERT INTO public.property_images (property_id, url, is_primary)
  SELECT id, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', true FROM p5;

END $$;
