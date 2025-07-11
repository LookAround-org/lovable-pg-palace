
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price_single INTEGER NOT NULL,
  price_double INTEGER NOT NULL,
  price_triple INTEGER NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'PG/Hostel',
  sharing_type TEXT NOT NULL DEFAULT 'shared',
  move_in TEXT NOT NULL DEFAULT 'Immediate',
  amenities TEXT[],
  images TEXT[],
  available BOOLEAN NOT NULL DEFAULT true,
  views INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1),
  host_name TEXT NOT NULL,
  host_avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Anyone can view available properties" 
  ON public.properties 
  FOR SELECT 
  USING (available = true);

CREATE POLICY "Hosts can view their own properties" 
  ON public.properties 
  FOR SELECT 
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create their own properties" 
  ON public.properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  USING (auth.uid() = host_id);

-- Insert some dummy data
INSERT INTO public.properties (
  host_id, title, description, location, price_single, price_double, price_triple,
  amenities, images, host_name, host_avatar, rating
) VALUES 
(
  gen_random_uuid(),
  'Modern PG in Koramangala',
  'Fully furnished PG with modern amenities. Perfect for working professionals and students.',
  'Koramangala, Bangalore',
  15000, 12000, 10000,
  ARRAY['WiFi', 'AC', 'Laundry', 'Meals', 'Security'],
  ARRAY['https://images.unsplash.com/photo-1649972904349-6e44c42644a7', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'],
  'Rajesh Kumar',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  4.5
),
(
  gen_random_uuid(),
  'Comfortable Hostel in BTM Layout',
  'Budget-friendly hostel with all basic amenities. Great location with easy access to public transport.',
  'BTM Layout, Bangalore',
  12000, 9000, 7500,
  ARRAY['WiFi', 'Meals', 'Security', 'Common Area'],
  ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'],
  'Priya Singh',
  'https://images.unsplash.com/photo-1494790108755-2616b2d8b1c2?w=150',
  4.2
),
(
  gen_random_uuid(),
  'Premium PG in Electronic City',
  'Luxury PG accommodation with premium facilities. Ideal for IT professionals.',
  'Electronic City, Bangalore',
  18000, 15000, 13000,
  ARRAY['WiFi', 'AC', 'Gym', 'Meals', 'Housekeeping', 'Security'],
  ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'],
  'Amit Patel',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  4.8
);
