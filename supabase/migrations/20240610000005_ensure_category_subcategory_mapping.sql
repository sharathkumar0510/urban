-- Ensure categories exist for plumbing, electrical, and HVAC
DO $$
BEGIN
  -- Plumbing category
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'plumbing') THEN
    INSERT INTO public.categories (name, description, icon, image_url, slug, display_order, created_at, updated_at)
    VALUES ('Plumbing', 'Professional plumbing services for your home', '🚿', 'https://images.unsplash.com/photo-1585704032915-c3400305e979?w=800&q=80', 'plumbing', 2, now(), now());
  END IF;
  
  -- Electrical category
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'electrical') THEN
    INSERT INTO public.categories (name, description, icon, image_url, slug, display_order, created_at, updated_at)
    VALUES ('Electrical', 'Professional electrical services for your home', '⚡', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', 'electrical', 3, now(), now());
  END IF;
  
  -- HVAC category
  IF NOT EXISTS (SELECT 1 FROM public.categories WHERE slug = 'hvac') THEN
    INSERT INTO public.categories (name, description, icon, image_url, slug, display_order, created_at, updated_at)
    VALUES ('AC Services', 'Professional HVAC services for your home', '❄️', 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', 'hvac', 4, now(), now());
  END IF;
END
$$;

-- Ensure subcategories exist for plumbing
DO $$
DECLARE
  plumbing_category_id UUID;
BEGIN
  SELECT id INTO plumbing_category_id FROM public.categories WHERE slug = 'plumbing';
  
  IF plumbing_category_id IS NOT NULL THEN
    -- Plumbing subcategories
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Leak Repair' AND category_id = plumbing_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (plumbing_category_id, 'Leak Repair', 'Fix leaking pipes and faucets', 'leak-repair', 1, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Drain Cleaning' AND category_id = plumbing_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (plumbing_category_id, 'Drain Cleaning', 'Clear clogged drains and pipes', 'drain-cleaning', 2, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Fixture Installation' AND category_id = plumbing_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (plumbing_category_id, 'Fixture Installation', 'Install new plumbing fixtures', 'fixture-installation', 3, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Water Heater' AND category_id = plumbing_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (plumbing_category_id, 'Water Heater', 'Water heater installation and repair', 'water-heater', 4, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Toilet Repair' AND category_id = plumbing_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (plumbing_category_id, 'Toilet Repair', 'Fix toilet issues and installation', 'toilet-repair', 5, now(), now());
    END IF;
  END IF;
END
$$;

-- Ensure subcategories exist for electrical
DO $$
DECLARE
  electrical_category_id UUID;
BEGIN
  SELECT id INTO electrical_category_id FROM public.categories WHERE slug = 'electrical';
  
  IF electrical_category_id IS NOT NULL THEN
    -- Electrical subcategories
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Wiring' AND category_id = electrical_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (electrical_category_id, 'Wiring', 'Electrical wiring installation and repair', 'wiring', 1, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Lighting' AND category_id = electrical_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (electrical_category_id, 'Lighting', 'Light fixture installation and repair', 'lighting', 2, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Outlets & Switches' AND category_id = electrical_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (electrical_category_id, 'Outlets & Switches', 'Install or repair electrical outlets and switches', 'outlets-switches', 3, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Panel Upgrades' AND category_id = electrical_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (electrical_category_id, 'Panel Upgrades', 'Electrical panel upgrades and repairs', 'panel-upgrades', 4, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Ceiling Fans' AND category_id = electrical_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (electrical_category_id, 'Ceiling Fans', 'Ceiling fan installation and repair', 'ceiling-fans', 5, now(), now());
    END IF;
  END IF;
END
$$;

-- Ensure subcategories exist for HVAC
DO $$
DECLARE
  hvac_category_id UUID;
BEGIN
  SELECT id INTO hvac_category_id FROM public.categories WHERE slug = 'hvac';
  
  IF hvac_category_id IS NOT NULL THEN
    -- HVAC subcategories
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Installation' AND category_id = hvac_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (hvac_category_id, 'Installation', 'HVAC system installation', 'installation', 1, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Maintenance' AND category_id = hvac_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (hvac_category_id, 'Maintenance', 'Regular HVAC system maintenance', 'maintenance', 2, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Repair' AND category_id = hvac_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (hvac_category_id, 'Repair', 'HVAC system repairs', 'repair', 3, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Duct Cleaning' AND category_id = hvac_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (hvac_category_id, 'Duct Cleaning', 'Clean air ducts for better air quality', 'duct-cleaning', 4, now(), now());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM public.subcategories WHERE name = 'Filter Replacement' AND category_id = hvac_category_id) THEN
      INSERT INTO public.subcategories (category_id, name, description, slug, display_order, created_at, updated_at)
      VALUES (hvac_category_id, 'Filter Replacement', 'Replace HVAC filters', 'filter-replacement', 5, now(), now());
    END IF;
  END IF;
END
$$;

-- Update existing services to ensure they have the correct category and subcategory mapping
DO $$
DECLARE
  plumbing_category_id UUID;
  electrical_category_id UUID;
  hvac_category_id UUID;
BEGIN
  SELECT id INTO plumbing_category_id FROM public.categories WHERE slug = 'plumbing';
  SELECT id INTO electrical_category_id FROM public.categories WHERE slug = 'electrical';
  SELECT id INTO hvac_category_id FROM public.categories WHERE slug = 'hvac';
  
  -- Update plumbing services
  UPDATE public.subcategories 
  SET category_id = plumbing_category_id
  WHERE name IN ('Leak Repair', 'Drain Cleaning', 'Fixture Installation', 'Water Heater', 'Toilet Repair')
  AND category_id IS NULL;
  
  -- Update electrical services
  UPDATE public.subcategories 
  SET category_id = electrical_category_id
  WHERE name IN ('Wiring', 'Lighting', 'Outlets & Switches', 'Panel Upgrades', 'Ceiling Fans')
  AND category_id IS NULL;
  
  -- Update HVAC services
  UPDATE public.subcategories 
  SET category_id = hvac_category_id
  WHERE name IN ('Installation', 'Maintenance', 'Repair', 'Duct Cleaning', 'Filter Replacement')
  AND category_id IS NULL;
END
$$;