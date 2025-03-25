-- Add more services for each subcategory

-- First ensure we have the vendor profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000002') THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000002', 'plumber@example.com', now(), now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000002') THEN
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000002', 'plumber@example.com', 'Plumbing Expert', 'vendor', now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = '00000000-0000-0000-0000-000000000002') THEN
    INSERT INTO public.vendor_profiles (id, business_name, business_logo, business_description, is_verified, avg_rating, total_reviews, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000002', 'Expert Plumbers', 'https://api.dicebear.com/7.x/initials/svg?seed=EP', 'Professional plumbing services for residential and commercial properties', true, 4.7, 98, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000003') THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000003', 'electrician@example.com', now(), now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000003') THEN
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000003', 'electrician@example.com', 'Electrical Solutions', 'vendor', now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = '00000000-0000-0000-0000-000000000003') THEN
    INSERT INTO public.vendor_profiles (id, business_name, business_logo, business_description, is_verified, avg_rating, total_reviews, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000003', 'Electrical Solutions', 'https://api.dicebear.com/7.x/initials/svg?seed=ES', 'Professional electrical services for all your needs', true, 4.9, 112, now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000004') THEN
    INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000004', 'hvac@example.com', now(), now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000004') THEN
    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000004', 'hvac@example.com', 'Cool Air HVAC', 'vendor', now(), now());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = '00000000-0000-0000-0000-000000000004') THEN
    INSERT INTO public.vendor_profiles (id, business_name, business_logo, business_description, is_verified, avg_rating, total_reviews, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000004', 'Cool Air HVAC', 'https://api.dicebear.com/7.x/initials/svg?seed=CA', 'Professional HVAC services for residential and commercial properties', true, 4.6, 87, now(), now());
  END IF;
END
$$;

-- Add more services for Plumbing category
DO $$
DECLARE
  leak_repair_id UUID;
  drain_cleaning_id UUID;
  fixture_installation_id UUID;
  water_heater_id UUID;
  toilet_repair_id UUID;
  vendor_id UUID := '00000000-0000-0000-0000-000000000002';
BEGIN
  -- Get subcategory IDs for Plumbing
  SELECT id INTO leak_repair_id FROM public.subcategories WHERE name = 'Leak Repair';
  SELECT id INTO drain_cleaning_id FROM public.subcategories WHERE name = 'Drain Cleaning';
  SELECT id INTO fixture_installation_id FROM public.subcategories WHERE name = 'Fixture Installation';
  SELECT id INTO water_heater_id FROM public.subcategories WHERE name = 'Water Heater';
  SELECT id INTO toilet_repair_id FROM public.subcategories WHERE name = 'Toilet Repair';
  
  -- Insert services for Leak Repair
  IF leak_repair_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000201', 'Emergency Leak Repair', 'Fast response for emergency water leaks. Our expert plumbers will identify and fix the source of the leak quickly to prevent water damage.', 'Emergency service for water leaks', 150, 120, true, true, vendor_id, leak_repair_id, 4.8, 42, 'https://images.unsplash.com/photo-1585704032915-c3400305e979?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000202', 'Pipe Leak Detection & Repair', 'Professional leak detection using advanced equipment to find hidden leaks in your walls, floors, or foundation. Includes repair of the damaged pipe.', 'Find and fix hidden pipe leaks', 180, 150, true, false, vendor_id, leak_repair_id, 4.7, 36, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000203', 'Faucet Leak Repair', 'Fix dripping faucets and leaking fixtures. Includes inspection, parts replacement, and testing to ensure the leak is completely resolved.', 'Stop dripping faucets and fixtures', 90, 60, true, false, vendor_id, leak_repair_id, 4.9, 28, 'https://images.unsplash.com/photo-1585704032915-c3400305e979?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Drain Cleaning
  IF drain_cleaning_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000204', 'Complete Drain Cleaning', 'Professional drain cleaning service for all drains in your home. Includes kitchen, bathroom, and floor drains using professional-grade equipment.', 'Clean all drains in your home', 200, 180, true, true, vendor_id, drain_cleaning_id, 4.6, 39, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000205', 'Kitchen Drain Unclogging', 'Specialized service for kitchen sink drains. We remove food debris, grease, and other blockages that cause slow draining or complete clogs.', 'Fix slow or clogged kitchen drains', 120, 90, true, false, vendor_id, drain_cleaning_id, 4.8, 31, 'https://images.unsplash.com/photo-1556911220-bda9f7f37446?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000206', 'Bathroom Drain Cleaning', 'Clear hair, soap scum, and other blockages from bathroom sinks, showers, and tubs. Includes preventative treatment to reduce future clogs.', 'Unclog bathroom drains', 110, 90, true, false, vendor_id, drain_cleaning_id, 4.7, 27, 'https://images.unsplash.com/photo-1584622650111-993a426bcf0c?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Fixture Installation
  IF fixture_installation_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000207', 'Faucet Installation', 'Professional installation of new kitchen or bathroom faucets. Includes removal of old fixture, installation of new one, and testing for proper function.', 'Install new kitchen or bathroom faucets', 130, 90, true, true, vendor_id, fixture_installation_id, 4.9, 45, 'https://images.unsplash.com/photo-1584622650111-993a426bcf0c?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000208', 'Shower Installation', 'Complete shower installation service. Includes removal of old shower, installation of new shower system, and testing for proper function and leaks.', 'Install new shower systems', 250, 240, true, false, vendor_id, fixture_installation_id, 4.8, 32, 'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000209', 'Sink Installation', 'Professional installation of kitchen or bathroom sinks. Includes removal of old sink, installation of new one, and connection to existing plumbing.', 'Install new sinks', 180, 120, true, false, vendor_id, fixture_installation_id, 4.7, 29, 'https://images.unsplash.com/photo-1613849925594-415a32298f54?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

-- Add more services for Electrical category
DO $$
DECLARE
  wiring_id UUID;
  lighting_id UUID;
  outlets_switches_id UUID;
  panel_upgrades_id UUID;
  ceiling_fans_id UUID;
  vendor_id UUID := '00000000-0000-0000-0000-000000000003';
BEGIN
  -- Get subcategory IDs for Electrical
  SELECT id INTO wiring_id FROM public.subcategories WHERE name = 'Wiring';
  SELECT id INTO lighting_id FROM public.subcategories WHERE name = 'Lighting';
  SELECT id INTO outlets_switches_id FROM public.subcategories WHERE name = 'Outlets & Switches';
  SELECT id INTO panel_upgrades_id FROM public.subcategories WHERE name = 'Panel Upgrades';
  SELECT id INTO ceiling_fans_id FROM public.subcategories WHERE name = 'Ceiling Fans';
  
  -- Insert services for Wiring
  IF wiring_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000301', 'Home Rewiring', 'Complete home rewiring service for older homes. Replace outdated or dangerous wiring with modern, safe electrical systems that meet current codes.', 'Update old or dangerous wiring', 1200, 960, true, true, vendor_id, wiring_id, 4.9, 38, 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000302', 'New Circuit Installation', 'Install new electrical circuits for appliances, home additions, or to reduce load on existing circuits. Includes all wiring, breakers, and connections.', 'Add new electrical circuits', 350, 240, true, false, vendor_id, wiring_id, 4.8, 29, 'https://images.unsplash.com/photo-1558177633-e35f4a4b09cc?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000303', 'Wiring Repair', 'Fix damaged or faulty wiring that causes shorts, power outages, or electrical hazards. Includes diagnosis, repair, and testing for safety.', 'Fix damaged or faulty wiring', 200, 180, true, false, vendor_id, wiring_id, 4.7, 32, 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Lighting
  IF lighting_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000304', 'Light Fixture Installation', 'Professional installation of new light fixtures. Includes removal of old fixtures, installation of new ones, and testing for proper function.', 'Install new light fixtures', 120, 90, true, true, vendor_id, lighting_id, 4.9, 47, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000305', 'Recessed Lighting Installation', 'Install recessed lighting in ceilings for a clean, modern look. Includes cutting holes, installing fixtures, and connecting to electrical system.', 'Install recessed ceiling lights', 280, 240, true, false, vendor_id, lighting_id, 4.8, 35, 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000306', 'Outdoor Lighting Installation', 'Install outdoor lighting for security, aesthetics, or functionality. Includes pathway lights, floodlights, or decorative lighting with weather-resistant wiring.', 'Install outdoor lighting systems', 220, 180, true, false, vendor_id, lighting_id, 4.7, 28, 'https://images.unsplash.com/photo-1595514535415-dae8970c1333?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Outlets & Switches
  IF outlets_switches_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000307', 'Outlet Installation', 'Install new electrical outlets in your home. Includes cutting openings, installing boxes, wiring, and testing for proper function and safety.', 'Add new electrical outlets', 110, 60, true, true, vendor_id, outlets_switches_id, 4.8, 41, 'https://images.unsplash.com/photo-1558177633-e35f4a4b09cc?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000308', 'GFCI Outlet Installation', 'Install ground fault circuit interrupter outlets in kitchens, bathrooms, and outdoor areas for enhanced safety against electrical shocks.', 'Install safety outlets for wet areas', 130, 60, true, false, vendor_id, outlets_switches_id, 4.9, 36, 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000309', 'Smart Switch Installation', 'Install smart switches that can be controlled via app or voice commands. Includes removal of old switches, installation of new ones, and setup.', 'Install app-controlled light switches', 150, 90, true, false, vendor_id, outlets_switches_id, 4.7, 32, 'https://images.unsplash.com/photo-1558177633-e35f4a4b09cc?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

-- Add more services for HVAC category
DO $$
DECLARE
  installation_id UUID;
  maintenance_id UUID;
  repair_id UUID;
  duct_cleaning_id UUID;
  filter_replacement_id UUID;
  vendor_id UUID := '00000000-0000-0000-0000-000000000004';
BEGIN
  -- Get subcategory IDs for HVAC
  SELECT id INTO installation_id FROM public.subcategories WHERE name = 'Installation';
  SELECT id INTO maintenance_id FROM public.subcategories WHERE name = 'Maintenance';
  SELECT id INTO repair_id FROM public.subcategories WHERE name = 'Repair';
  SELECT id INTO duct_cleaning_id FROM public.subcategories WHERE name = 'Duct Cleaning';
  SELECT id INTO filter_replacement_id FROM public.subcategories WHERE name = 'Filter Replacement';
  
  -- Insert services for Installation
  IF installation_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000401', 'Central AC Installation', 'Complete installation of a new central air conditioning system. Includes removal of old unit, installation of new one, and connection to existing ductwork.', 'Install new central AC system', 3500, 480, true, true, vendor_id, installation_id, 4.8, 36, 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000402', 'Furnace Installation', 'Professional installation of a new furnace. Includes removal of old unit, installation of new one, and connection to existing ductwork and gas lines.', 'Install new heating furnace', 2800, 420, true, false, vendor_id, installation_id, 4.7, 29, 'https://images.unsplash.com/photo-1581788604067-769a11325b0d?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000403', 'Mini-Split AC Installation', 'Install a ductless mini-split air conditioning system. Perfect for homes without existing ductwork or for adding cooling to specific rooms.', 'Install ductless AC system', 1800, 360, true, false, vendor_id, installation_id, 4.9, 32, 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Maintenance
  IF maintenance_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000404', 'AC Tune-Up', 'Comprehensive maintenance service for your air conditioning system. Includes cleaning, inspection, and minor adjustments to ensure efficient operation.', 'Maintain your AC for peak efficiency', 150, 120, true, true, vendor_id, maintenance_id, 4.8, 42, 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000405', 'Furnace Maintenance', 'Complete maintenance service for your heating system. Includes cleaning, inspection, and adjustments to ensure safe and efficient operation.', 'Prepare your furnace for winter', 140, 120, true, false, vendor_id, maintenance_id, 4.7, 38, 'https://images.unsplash.com/photo-1581788604067-769a11325b0d?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000406', 'HVAC System Inspection', 'Thorough inspection of your entire HVAC system. Identifies potential issues before they become major problems and ensures safe operation.', 'Comprehensive HVAC system check', 120, 90, true, false, vendor_id, maintenance_id, 4.9, 35, 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  -- Insert services for Repair
  IF repair_id IS NOT NULL AND EXISTS (SELECT 1 FROM public.vendor_profiles WHERE id = vendor_id) THEN
    INSERT INTO public.services (id, name, description, short_description, starting_price, duration, is_active, is_featured, vendor_id, subcategory_id, avg_rating, total_reviews, image_url, created_at, updated_at)
    VALUES 
    ('00000000-0000-0000-0000-000000000407', 'AC Repair', 'Professional repair service for air conditioning systems. Includes diagnosis, repair of the issue, and testing to ensure proper function.', 'Fix your broken AC unit', 180, 120, true, true, vendor_id, repair_id, 4.8, 47, 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000408', 'Furnace Repair', 'Expert repair service for heating systems. Includes diagnosis, repair of the issue, and testing to ensure safe and proper function.', 'Fix your heating system', 190, 120, true, false, vendor_id, repair_id, 4.7, 41, 'https://images.unsplash.com/photo-1581788604067-769a11325b0d?w=800&q=80', now(), now()),
    ('00000000-0000-0000-0000-000000000409', 'Thermostat Repair', 'Fix issues with your thermostat or replace it with a new one. Includes diagnosis, repair or replacement, and programming of new thermostats.', 'Fix or replace your thermostat', 110, 60, true, false, vendor_id, repair_id, 4.9, 38, 'https://images.unsplash.com/photo-1567769541495-338ee9356d57?w=800&q=80', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;