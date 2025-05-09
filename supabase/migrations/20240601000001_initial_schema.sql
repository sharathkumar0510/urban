-- Create profiles table for all users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create vendor profiles table (extends profiles for vendors)
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_description TEXT,
  business_logo TEXT,
  business_website TEXT,
  business_email TEXT,
  business_phone TEXT,
  business_address TEXT,
  business_city TEXT,
  business_state TEXT,
  business_zip_code TEXT,
  tax_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  avg_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  slug TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(category_id, slug)
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  starting_price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  avg_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service features table
CREATE TABLE IF NOT EXISTS public.service_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_included BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service availability table
CREATE TABLE IF NOT EXISTS public.service_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(service_id, day_of_week, start_time, end_time)
);

-- Create service locations table
CREATE TABLE IF NOT EXISTS public.service_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(service_id, city, state, zip_code)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(service_id, user_id, booking_id)
);

-- Create cart table
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(cart_id, service_id, scheduled_date, scheduled_time)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tax rates table
CREATE TABLE IF NOT EXISTS public.tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  rate DECIMAL(5,2) NOT NULL,
  state TEXT,
  city TEXT,
  zip_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'review', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create saved services (favorites) table
CREATE TABLE IF NOT EXISTS public.saved_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, service_id)
);

-- Create service images table
CREATE TABLE IF NOT EXISTS public.service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vendor profiles policies
CREATE POLICY "Vendor profiles are viewable by everyone" ON public.vendor_profiles FOR SELECT USING (true);
CREATE POLICY "Vendors can update their own profile" ON public.vendor_profiles FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert categories" ON public.categories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update categories" ON public.categories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete categories" ON public.categories FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Subcategories policies
CREATE POLICY "Subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert subcategories" ON public.subcategories FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update subcategories" ON public.subcategories FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete subcategories" ON public.subcategories FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Services policies
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Vendors can insert their own services" ON public.services FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Vendors can update their own services" ON public.services FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors can delete their own services" ON public.services FOR DELETE USING (auth.uid() = vendor_id);

-- Service features policies
CREATE POLICY "Service features are viewable by everyone" ON public.service_features FOR SELECT USING (true);
CREATE POLICY "Vendors can insert features for their own services" ON public.service_features FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can update features for their own services" ON public.service_features FOR UPDATE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can delete features for their own services" ON public.service_features FOR DELETE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));

-- Service availability policies
CREATE POLICY "Service availability is viewable by everyone" ON public.service_availability FOR SELECT USING (true);
CREATE POLICY "Vendors can insert availability for their own services" ON public.service_availability FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can update availability for their own services" ON public.service_availability FOR UPDATE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can delete availability for their own services" ON public.service_availability FOR DELETE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));

-- Service locations policies
CREATE POLICY "Service locations are viewable by everyone" ON public.service_locations FOR SELECT USING (true);
CREATE POLICY "Vendors can insert locations for their own services" ON public.service_locations FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can update locations for their own services" ON public.service_locations FOR UPDATE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can delete locations for their own services" ON public.service_locations FOR DELETE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Carts policies
CREATE POLICY "Users can view their own cart" ON public.carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cart" ON public.carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart" ON public.carts FOR DELETE USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert items to their own cart" ON public.cart_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Users can update items in their own cart" ON public.cart_items FOR UPDATE USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete items from their own cart" ON public.cart_items FOR DELETE USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND user_id = auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vendors can view bookings for their services" ON public.bookings FOR SELECT USING (auth.uid() = vendor_id);
CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Vendors can update bookings for their services" ON public.bookings FOR UPDATE USING (auth.uid() = vendor_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tax rates policies
CREATE POLICY "Tax rates are viewable by everyone" ON public.tax_rates FOR SELECT USING (true);
CREATE POLICY "Only admins can insert tax rates" ON public.tax_rates FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update tax rates" ON public.tax_rates FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete tax rates" ON public.tax_rates FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Saved services policies
CREATE POLICY "Users can view their saved services" ON public.saved_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save services" ON public.saved_services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved services" ON public.saved_services FOR DELETE USING (auth.uid() = user_id);

-- Service images policies
CREATE POLICY "Service images are viewable by everyone" ON public.service_images FOR SELECT USING (true);
CREATE POLICY "Vendors can insert images for their own services" ON public.service_images FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can update images for their own services" ON public.service_images FOR UPDATE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));
CREATE POLICY "Vendors can delete images for their own services" ON public.service_images FOR DELETE USING (EXISTS (SELECT 1 FROM public.services WHERE id = service_id AND vendor_id = auth.uid()));

-- Create functions and triggers
-- Function to update service average rating
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.services
  SET 
    avg_rating = (SELECT AVG(rating) FROM public.reviews WHERE service_id = NEW.service_id),
    total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE service_id = NEW.service_id)
  WHERE id = NEW.service_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update service rating when a review is added, updated, or deleted
CREATE TRIGGER update_service_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_service_rating();

-- Function to update vendor average rating
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.vendor_profiles
  SET 
    avg_rating = (SELECT AVG(avg_rating) FROM public.services WHERE vendor_id = NEW.vendor_id AND avg_rating IS NOT NULL),
    total_reviews = (SELECT SUM(total_reviews) FROM public.services WHERE vendor_id = NEW.vendor_id)
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update vendor rating when a service rating is updated
CREATE TRIGGER update_vendor_rating_trigger
AFTER UPDATE OF avg_rating, total_reviews ON public.services
FOR EACH ROW
EXECUTE FUNCTION update_vendor_rating();

-- Function to create a cart for a new user
CREATE OR REPLACE FUNCTION create_cart_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.carts (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a cart when a new user is created
CREATE TRIGGER create_cart_for_new_user_trigger
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION create_cart_for_new_user();

-- Function to handle user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'role', 'customer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Function to handle vendor signup
CREATE OR REPLACE FUNCTION handle_new_vendor()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'vendor' THEN
    INSERT INTO public.vendor_profiles (id, business_name, business_email)
    VALUES (NEW.id, COALESCE(NEW.full_name, 'New Business'), NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle new vendor signup
CREATE TRIGGER on_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION handle_new_vendor();

-- Enable realtime for all tables
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.vendor_profiles;
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.subcategories;
alter publication supabase_realtime add table public.services;
alter publication supabase_realtime add table public.service_features;
alter publication supabase_realtime add table public.service_availability;
alter publication supabase_realtime add table public.service_locations;
alter publication supabase_realtime add table public.reviews;
alter publication supabase_realtime add table public.carts;
alter publication supabase_realtime add table public.cart_items;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.payments;
alter publication supabase_realtime add table public.tax_rates;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.saved_services;
alter publication supabase_realtime add table public.service_images;

-- Insert initial data
-- Insert admin user
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@homeservices.com', 'System Admin', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert categories
INSERT INTO public.categories (name, description, icon, image_url, slug, display_order)
VALUES 
('Cleaning', 'Professional cleaning services for your home', '🧹', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 'cleaning', 1),
('Plumbing', 'Expert plumbing services for your home', '🚿', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', 'plumbing', 2),
('Electrical', 'Professional electrical services', '⚡', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', 'electrical', 3),
('HVAC', 'Heating, ventilation, and air conditioning services', '❄️', 'https://images.unsplash.com/photo-1631545308456-3fda0a33a45a?w=800&q=80', 'hvac', 4),
('Landscaping', 'Professional landscaping and gardening services', '🌱', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', 'landscaping', 5),
('Security', 'Home security and smart lock installation', '🔒', 'https://images.unsplash.com/photo-1558002038-1055e2dae1d7?w=800&q=80', 'security', 6),
('Beauty & Wellness', 'Professional beauty and wellness services', '💆', 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&q=80', 'beauty', 7),
('Home Repairs', 'General home repair and maintenance services', '🔧', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 'home-repairs', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories
INSERT INTO public.subcategories (category_id, name, description, slug, display_order)
VALUES 
-- Cleaning subcategories
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Home Cleaning', 'Regular cleaning services for your home', 'home-cleaning', 1),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Deep Cleaning', 'Thorough cleaning of your entire home', 'deep-cleaning', 2),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Move-in/out', 'Comprehensive cleaning for moving in or out', 'move-in-out', 3),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Carpet Cleaning', 'Professional carpet cleaning services', 'carpet-cleaning', 4),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Window Cleaning', 'Professional window cleaning services', 'window-cleaning', 5),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Office Cleaning', 'Professional cleaning for offices and workspaces', 'office-cleaning', 6),
((SELECT id FROM public.categories WHERE slug = 'cleaning'), 'Post-Construction', 'Cleaning after construction or renovation', 'post-construction', 7),

-- Plumbing subcategories
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Leak Repair', 'Fix leaking pipes and faucets', 'leak-repair', 1),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Drain Cleaning', 'Clear clogged drains and pipes', 'drain-cleaning', 2),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Fixture Installation', 'Install new plumbing fixtures', 'fixture-installation', 3),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Water Heater', 'Water heater installation and repair', 'water-heater', 4),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Toilet Repair', 'Toilet installation and repair services', 'toilet-repair', 5),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Pipe Replacement', 'Replace old or damaged pipes', 'pipe-replacement', 6),
((SELECT id FROM public.categories WHERE slug = 'plumbing'), 'Sump Pump', 'Sump pump installation and repair', 'sump-pump', 7),

-- Electrical subcategories
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Wiring', 'Electrical wiring installation and repair', 'wiring', 1),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Lighting', 'Lighting installation and repair', 'lighting', 2),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Outlets & Switches', 'Install or repair electrical outlets and switches', 'outlets-switches', 3),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Panel Upgrades', 'Electrical panel upgrades and repairs', 'panel-upgrades', 4),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Ceiling Fans', 'Ceiling fan installation and repair', 'ceiling-fans', 5),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Smart Home', 'Smart home device installation', 'smart-home', 6),
((SELECT id FROM public.categories WHERE slug = 'electrical'), 'Troubleshooting', 'Electrical troubleshooting and diagnostics', 'troubleshooting', 7),

-- HVAC subcategories
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Installation', 'HVAC system installation', 'installation', 1),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Maintenance', 'Regular HVAC system maintenance', 'maintenance', 2),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Repair', 'HVAC system repair services', 'repair', 3),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Duct Cleaning', 'Air duct cleaning services', 'duct-cleaning', 4),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Filter Replacement', 'HVAC filter replacement services', 'filter-replacement', 5),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Refrigerant Recharge', 'AC refrigerant recharge services', 'refrigerant-recharge', 6),
((SELECT id FROM public.categories WHERE slug = 'hvac'), 'Smart Thermostat', 'Smart thermostat installation and setup', 'smart-thermostat', 7),

-- Landscaping subcategories
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Lawn Mowing', 'Regular lawn mowing services', 'lawn-mowing', 1),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Garden Design', 'Professional garden design services', 'garden-design', 2),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Tree Trimming', 'Professional tree trimming services', 'tree-trimming', 3),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Irrigation', 'Irrigation system installation and repair', 'irrigation', 4),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Mulching', 'Professional mulching services', 'mulching', 5),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Weed Control', 'Weed control and prevention services', 'weed-control', 6),
((SELECT id FROM public.categories WHERE slug = 'landscaping'), 'Hardscaping', 'Hardscape design and installation', 'hardscaping', 7),

-- Security subcategories
((SELECT id FROM public.categories WHERE slug = 'security'), 'Camera Installation', 'Security camera installation', 'camera-installation', 1),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Smart Lock Installation', 'Smart lock installation and setup', 'smart-lock-installation', 2),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Alarm Systems', 'Home alarm system installation', 'alarm-systems', 3),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Video Doorbells', 'Video doorbell installation and setup', 'video-doorbells', 4),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Motion Sensors', 'Motion sensor installation and setup', 'motion-sensors', 5),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Security Assessment', 'Home security assessment services', 'security-assessment', 6),
((SELECT id FROM public.categories WHERE slug = 'security'), 'Monitoring Setup', 'Security monitoring system setup', 'monitoring-setup', 7),

-- Beauty & Wellness subcategories
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Hair Styling', 'Professional hair styling services', 'hair-styling', 1),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Massage', 'Professional massage therapy services', 'massage', 2),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Nail Care', 'Professional nail care services', 'nail-care', 3),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Facial', 'Professional facial treatments', 'facial', 4),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Spa', 'Professional spa services', 'spa', 5),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Makeup', 'Professional makeup services', 'makeup', 6),
((SELECT id FROM public.categories WHERE slug = 'beauty'), 'Waxing', 'Professional waxing services', 'waxing', 7),

-- Home Repairs subcategories
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Furniture Assembly', 'Furniture assembly services', 'furniture-assembly', 1),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Door & Window', 'Door and window repair services', 'door-window', 2),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Drywall', 'Drywall installation and repair', 'drywall', 3),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Flooring', 'Flooring installation and repair', 'flooring', 4),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'General Repairs', 'General home repair services', 'general-repairs', 5),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Painting', 'Professional painting services', 'painting', 6),
((SELECT id FROM public.categories WHERE slug = 'home-repairs'), 'Carpentry', 'Professional carpentry services', 'carpentry', 7)
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert tax rates
INSERT INTO public.tax_rates (name, description, rate)
VALUES 
('Standard Rate', 'Standard tax rate for most services', 7.25),
('Reduced Rate', 'Reduced tax rate for essential services', 5.00),
('Zero Rate', 'Zero tax rate for exempt services', 0.00)
ON CONFLICT DO NOTHING;
