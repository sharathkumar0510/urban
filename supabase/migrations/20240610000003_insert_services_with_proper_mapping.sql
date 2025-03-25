-- First create a test user in auth.users table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'vendor@example.com', now(), now(), now());
  END IF;
END
$$;

-- Then create the profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'vendor@example.com', 'Vendor Account', 'vendor', now(), now());
  END IF;
END
$$;

-- Then create the vendor profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO public.vendor_profiles (id, business_name, business_logo, business_description, is_verified, avg_rating, total_reviews, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Home Cleaning Experts', 'https://api.dicebear.com/7.x/initials/svg?seed=HCE', 'Professional home cleaning services', true, 4.8, 120, now(), now());
  END IF;
END
$$;

-- Ensure the cleaning category exists
DO $$
DECLARE
  cleaning_category_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'cleaning') THEN
    INSERT INTO public.categories (name, description, icon, image_url, slug, display_order, created_at, updated_at)
    VALUES ('Cleaning', 'Professional cleaning services for your home', '🧹', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 'cleaning', 1, now(), now())
    RETURNING id INTO cleaning_category_id;
  ELSE
    SELECT id INTO cleaning_category_id FROM public.categories WHERE slug = 'cleaning';
  END IF;
  
  -- Ensure subcategories exist
  IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Home Cleaning') THEN
    INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
    VALUES (cleaning_category_id, 'Home Cleaning', 'Regular cleaning services for your home', 'home-cleaning', 1, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Deep Cleaning') THEN
    INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
    VALUES (cleaning_category_id, 'Deep Cleaning', 'Thorough cleaning of your entire home', 'deep-cleaning', 2, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Move-in/out') THEN
    INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
    VALUES (cleaning_category_id, 'Move-in/out', 'Comprehensive cleaning for moving in or out', 'move-in-out', 3, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Carpet Cleaning') THEN
    INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
    VALUES (cleaning_category_id, 'Carpet Cleaning', 'Professional carpet cleaning services', 'carpet-cleaning', 4, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Office Cleaning') THEN
    INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
    VALUES (cleaning_category_id, 'Office Cleaning', 'Professional office cleaning services', 'office-cleaning', 6, now(), now());
  END IF;
END
$$;

-- Insert services with proper mapping
DO $$
DECLARE
  home_cleaning_id UUID;
  deep_cleaning_id UUID;
  move_in_out_id UUID;
  office_cleaning_id UUID;
  carpet_cleaning_id UUID;
  vendor_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Get subcategory IDs
  SELECT id INTO home_cleaning_id FROM public.subcategories WHERE name = 'Home Cleaning';
  SELECT id INTO deep_cleaning_id FROM public.subcategories WHERE name = 'Deep Cleaning';
  SELECT id INTO move_in_out_id FROM public.subcategories WHERE name = 'Move-in/out';
  SELECT id INTO office_cleaning_id FROM public.subcategories WHERE name = 'Office Cleaning';
  SELECT id INTO carpet_cleaning_id FROM public.subcategories WHERE name = 'Carpet Cleaning';
  
  -- Insert services only if subcategories exist and vendor exists
  IF home_cleaning_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000101', 'Standard Home Cleaning', 'Complete cleaning service for your entire home. Our professional cleaners will dust, vacuum, mop, and sanitize all rooms.', 'Professional home cleaning service', 120, 180, true, true, vendor_id, home_cleaning_id, 4.7, 45, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert features for this service
    IF EXISTS (SELECT 1 FROM public.services WHERE id = '00000000-0000-0000-0000-000000000101') THEN
      INSERT INTO public.service_features (service_id, name, description, is_included, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000101', 'Dusting', 'Dusting of all accessible surfaces', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'Vacuuming', 'Vacuuming of all floor surfaces', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'Mopping', 'Mopping of all hard floors', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'Bathroom Cleaning', 'Complete bathroom cleaning and sanitizing', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'Kitchen Cleaning', 'Complete kitchen cleaning including appliances', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert locations for this service
      INSERT INTO public.service_locations (service_id, city, state, zip_code, is_active, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000101', 'San Francisco', 'CA', '94105', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'Oakland', 'CA', '94612', true, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'San Jose', 'CA', '95113', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert images for this service
      INSERT INTO public.service_images (service_id, image_url, display_order, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 0, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80', 1, now(), now()),
      ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1556911220-bda9f7f37446?w=800&q=80', 2, now(), now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  IF deep_cleaning_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000102', 'Deep Cleaning Service', 'Thorough deep cleaning for homes that need extra attention. Includes cleaning inside appliances, behind furniture, and detailed bathroom sanitizing.', 'Thorough deep cleaning service', 200, 300, true, false, vendor_id, deep_cleaning_id, 4.9, 32, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert features for this service
    IF EXISTS (SELECT 1 FROM public.services WHERE id = '00000000-0000-0000-0000-000000000102') THEN
      INSERT INTO public.service_features (service_id, name, description, is_included, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000102', 'Inside Appliances', 'Cleaning inside ovens, refrigerators, etc.', true, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'Behind Furniture', 'Moving and cleaning behind furniture', true, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'Baseboards', 'Detailed cleaning of all baseboards', true, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'Window Cleaning', 'Interior window cleaning', true, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'Cabinet Interiors', 'Cleaning inside cabinets', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert locations for this service
      INSERT INTO public.service_locations (service_id, city, state, zip_code, is_active, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000102', 'San Francisco', 'CA', '94105', true, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'Oakland', 'CA', '94612', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert images for this service
      INSERT INTO public.service_images (service_id, image_url, display_order, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80', 0, now(), now()),
      ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80', 1, now(), now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  IF move_in_out_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000103', 'Move-in/Move-out Cleaning', 'Specialized cleaning service for when you''re moving in or out of a property. We''ll make sure everything is spotless for the next occupants.', 'Cleaning service for moving', 180, 240, true, true, vendor_id, move_in_out_id, 4.6, 28, 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert features for this service
    IF EXISTS (SELECT 1 FROM public.services WHERE id = '00000000-0000-0000-0000-000000000103') THEN
      INSERT INTO public.service_features (service_id, name, description, is_included, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000103', 'Wall Cleaning', 'Cleaning of all walls and removing marks', true, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'Fixture Cleaning', 'Detailed cleaning of all fixtures', true, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'Appliance Cleaning', 'Deep cleaning of all appliances', true, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'Cabinet Cleaning', 'Interior and exterior cabinet cleaning', true, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'Floor Detailing', 'Detailed floor cleaning and polishing', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert locations for this service
      INSERT INTO public.service_locations (service_id, city, state, zip_code, is_active, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000103', 'San Francisco', 'CA', '94105', true, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'San Jose', 'CA', '95113', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert images for this service
      INSERT INTO public.service_images (service_id, image_url, display_order, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80', 0, now(), now()),
      ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 1, now(), now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  IF office_cleaning_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000104', 'Office Cleaning', 'Professional cleaning services for offices and commercial spaces. Keep your workplace clean and healthy for employees and clients.', 'Commercial office cleaning', 150, 120, true, false, vendor_id, office_cleaning_id, 4.8, 19, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert locations for this service
    IF EXISTS (SELECT 1 FROM public.services WHERE id = '00000000-0000-0000-0000-000000000104') THEN
      INSERT INTO public.service_locations (service_id, city, state, zip_code, is_active, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000104', 'San Francisco', 'CA', '94105', true, now(), now()),
      ('00000000-0000-0000-0000-000000000104', 'Oakland', 'CA', '94612', true, now(), now()),
      ('00000000-0000-0000-0000-000000000104', 'San Jose', 'CA', '95113', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert images for this service
      INSERT INTO public.service_images (service_id, image_url, display_order, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', 0, now(), now()),
      ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80', 1, now(), now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  IF carpet_cleaning_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000105', 'Carpet Cleaning', 'Deep carpet cleaning using professional equipment and eco-friendly products. Removes stains, odors, and allergens.', 'Professional carpet cleaning', 100, 90, true, true, vendor_id, carpet_cleaning_id, 4.5, 22, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert locations for this service
    IF EXISTS (SELECT 1 FROM public.services WHERE id = '00000000-0000-0000-0000-000000000105') THEN
      INSERT INTO public.service_locations (service_id, city, state, zip_code, is_active, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000105', 'San Francisco', 'CA', '94105', true, now(), now()),
      ('00000000-0000-0000-0000-000000000105', 'Oakland', 'CA', '94612', true, now(), now())
      ON CONFLICT DO NOTHING;
      
      -- Insert images for this service
      INSERT INTO public.service_images (service_id, image_url, display_order, created_at, updated_at)
      VALUES
      ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80', 0, now(), now()),
      ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1556911073-38141963c9e0?w=800&q=80', 1, now(), now())
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END
$$;