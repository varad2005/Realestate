-- Safely create a PL/pgSQL block to insert properties and their linked locations
DO $$
DECLARE
  v_prop_id UUID;
BEGIN
  -- 1
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Luxury 3 BHK in Koregaon Park', 'Premium apartment with modern amenities.', 25000000, 'Pune', 'apartment', 3, 'approved', 'Fully-Furnished', 1500, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Koregaon Park', 'Lane 5, Koregaon Park');

  -- 2
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Spacious 4 BHK Villa', 'Beautiful villa with private garden.', 45000000, 'Pune', 'villa', 4, 'approved', 'Semi-Furnished', 3000, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Koregaon Park', 'North Main Road');

  -- 3
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Cozy 2 BHK in Viman Nagar', 'Close to airport and IT parks.', 8500000, 'Pune', 'apartment', 2, 'approved', 'Unfurnished', 900, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Viman Nagar', 'Datta Mandir Road');

  -- 4
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Modern 3 BHK Apartment', 'High rise apartment with great views.', 15000000, 'Pune', 'apartment', 3, 'approved', 'Fully-Furnished', 1200, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Viman Nagar', 'Symbiosis Road');

  -- 5
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Studio Apartment for IT Professionals', 'Compact and convenient.', 4500000, 'Pune', 'apartment', 1, 'approved', 'Fully-Furnished', 450, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Viman Nagar', 'VIP Road');

  -- 6
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('IT Park Facing 2 BHK', 'Perfect for software engineers working in Phase 1.', 7500000, 'Pune', 'apartment', 2, 'approved', 'Semi-Furnished', 850, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Hinjewadi', 'Phase 1 Road');

  -- 7
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Premium 3 BHK near Phase 2', 'Luxurious society with clubhouse.', 11000000, 'Pune', 'apartment', 3, 'approved', 'Unfurnished', 1100, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Hinjewadi', 'Phase 2');

  -- 8
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Affordable 1 BHK', 'Great investment opportunity.', 3500000, 'Pune', 'apartment', 1, 'approved', 'Unfurnished', 500, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Hinjewadi', 'Phase 3');

  -- 9
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('4 BHK Penthouse', 'Ultimate luxury in Hinjewadi.', 22000000, 'Pune', 'penthouse', 4, 'approved', 'Fully-Furnished', 2500, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Hinjewadi', 'Hinjewadi Main Road');

  -- 10
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Family 3 BHK in Baner', 'Quiet residential area.', 13500000, 'Pune', 'apartment', 3, 'approved', 'Semi-Furnished', 1300, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Baner', 'Baner Pashan Link Road');

  -- 11
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Luxurious 4 BHK Flat', 'Premium fittings and fixtures.', 19500000, 'Pune', 'apartment', 4, 'approved', 'Fully-Furnished', 1800, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Baner', 'Main Baner Road');

  -- 12
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('2 BHK in Wakad', 'Ideal for small families.', 6500000, 'Pune', 'apartment', 2, 'approved', 'Unfurnished', 800, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Pune', 'Wakad', 'Datta Mandir Road');

  -- 13
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('Sea Facing 3 BHK', 'Beautiful view of the Arabian Sea.', 55000000, 'Mumbai', 'apartment', 3, 'approved', 'Fully-Furnished', 1400, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Mumbai', 'Bandra West', 'Carter Road');

  -- 14
  INSERT INTO public.properties (title, description, price, city, type, bhk, status, furnishing, area_sqft, ownership) 
  VALUES ('2 BHK in Andheri', 'Close to metro station.', 25000000, 'Mumbai', 'apartment', 2, 'approved', 'Semi-Furnished', 900, 'Freehold') RETURNING id INTO v_prop_id;
  INSERT INTO public.locations (property_id, city, locality, address) VALUES (v_prop_id, 'Mumbai', 'Andheri East', 'MIDC Road');

END $$;

-- Notify postgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
