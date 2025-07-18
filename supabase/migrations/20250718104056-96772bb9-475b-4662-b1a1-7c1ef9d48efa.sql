
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view reviews
CREATE POLICY "Anyone can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add index for better performance
CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- Insert dummy reviews for existing properties
INSERT INTO public.reviews (property_id, user_id, user_name, user_avatar, rating, comment, created_at) VALUES
-- Reviews for the current property (1daeb402-68d3-460a-a4b5-0b1480cf89e0)
('1daeb402-68d3-460a-a4b5-0b1480cf89e0', gen_random_uuid(), 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 5, 'Excellent PG with all amenities. The host is very responsive and the location is perfect for my office commute. The food quality is amazing and rooms are well-maintained.', now() - interval '2 weeks'),
('1daeb402-68d3-460a-a4b5-0b1480cf89e0', gen_random_uuid(), 'Rahul Kumar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 4, 'Good facilities and clean rooms. WiFi speed could be better but overall satisfied with the stay. The common areas are well-maintained and the security is excellent.', now() - interval '1 month'),
('1daeb402-68d3-460a-a4b5-0b1480cf89e0', gen_random_uuid(), 'Sneha Patel', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 5, 'Amazing place! Feels like home. The food is delicious and the common areas are well maintained. Maha aunty is very caring and helpful. Highly recommended for working women.', now() - interval '2 months'),
('1daeb402-68d3-460a-a4b5-0b1480cf89e0', gen_random_uuid(), 'Anita Reddy', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 4, 'Nice place with good amenities. The location is convenient and the host is friendly. Only suggestion would be to improve the laundry service timing.', now() - interval '3 months'),
('1daeb402-68d3-460a-a4b5-0b1480cf89e0', gen_random_uuid(), 'Deepika Singh', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face', 5, 'Perfect hostel for working professionals. Clean, safe, and well-located. The food is homely and nutritious. Great community of residents. Worth every penny!', now() - interval '4 months');

-- Update the property rating based on average of reviews
UPDATE public.properties 
SET rating = (
  SELECT ROUND(AVG(rating)::numeric, 1) 
  FROM public.reviews 
  WHERE property_id = '1daeb402-68d3-460a-a4b5-0b1480cf89e0'
) 
WHERE id = '1daeb402-68d3-460a-a4b5-0b1480cf89e0';
