
-- Add host_phone column to properties table
ALTER TABLE public.properties 
ADD COLUMN host_phone TEXT;

-- Update existing properties with dummy phone numbers
UPDATE public.properties 
SET host_phone = CASE 
  WHEN host_name = 'Rajesh Kumar' THEN '+91 98765 43210'
  WHEN host_name = 'Priya Sharma' THEN '+91 87654 32109'
  WHEN host_name = 'Amit Patel' THEN '+91 76543 21098'
  WHEN host_name = 'Sneha Reddy' THEN '+91 99887 76655'
  WHEN host_name = 'Mahesh Kumar' THEN '+91 88776 65544'
  WHEN host_name = 'Divya Gowda' THEN '+91 77665 54433'
  WHEN host_name = 'Ravi Kumar' THEN '+91 66554 43322'
  WHEN host_name = 'Shalini Gupta' THEN '+91 55443 32211'
  WHEN host_name = 'Vikram Singh' THEN '+91 44332 21100'
  WHEN host_name = 'Deepika Sharma' THEN '+91 33221 10099'
  ELSE '+91 90000 00000'
END;
