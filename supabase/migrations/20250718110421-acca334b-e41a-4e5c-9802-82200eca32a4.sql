
-- Add featured and trending columns to properties table
ALTER TABLE public.properties 
ADD COLUMN featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN trending BOOLEAN NOT NULL DEFAULT false;

-- Create indexes for better performance when filtering featured and trending properties
CREATE INDEX idx_properties_featured ON public.properties(featured) WHERE featured = true;
CREATE INDEX idx_properties_trending ON public.properties(trending) WHERE trending = true;

-- Update existing property to be featured and trending for demo purposes
UPDATE public.properties 
SET featured = true, trending = true 
WHERE id = '1daeb402-68d3-460a-a4b5-0b1480cf89e0';
