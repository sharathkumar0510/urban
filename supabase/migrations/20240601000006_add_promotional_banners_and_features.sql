-- Create promotional banners table
CREATE TABLE IF NOT EXISTS public.promotional_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create value propositions table
CREATE TABLE IF NOT EXISTS public.value_propositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.value_propositions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Promotional banners are viewable by everyone" ON public.promotional_banners FOR SELECT USING (true);
CREATE POLICY "Only admins can insert promotional banners" ON public.promotional_banners FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update promotional banners" ON public.promotional_banners FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete promotional banners" ON public.promotional_banners FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Value propositions are viewable by everyone" ON public.value_propositions FOR SELECT USING (true);
CREATE POLICY "Only admins can insert value propositions" ON public.value_propositions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can update value propositions" ON public.value_propositions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete value propositions" ON public.value_propositions FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Enable realtime
alter publication supabase_realtime add table public.promotional_banners;
alter publication supabase_realtime add table public.value_propositions;

-- Insert promotional banners
INSERT INTO public.promotional_banners (title, description, image_url, cta_text, cta_link, display_order)
VALUES 
('Get 20% Off Your First Cleaning', 'Professional home cleaning services starting at just $89', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', 'Book Now', '/services/cleaning', 1),
('Emergency Plumbing Services', 'Available 24/7 - Qualified plumbers at your door in 60 minutes or less', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', 'Book Now', '/services/plumbing', 2),
('Electrical Safety Inspection', 'Ensure your home is safe with our comprehensive electrical inspection', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', 'Book Now', '/services/electrical', 3);

-- Insert value propositions
INSERT INTO public.value_propositions (title, description, icon, display_order)
VALUES 
('Vetted Professionals', 'Every service provider undergoes thorough background checks and skill verification', 'CheckCircle2', 1),
('Quality Guarantee', 'Not satisfied? We''ll send another professional to make it right at no extra cost', 'Shield', 2),
('Secure Payments', 'Your payment is held securely until you''re completely satisfied with the service', 'CreditCard', 3);