-- Create leads table for capturing customer inquiries
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_needed TEXT NOT NULL,
  timeline TEXT,
  budget TEXT,
  property_address TEXT,
  project_description TEXT,
  urgency_level TEXT,
  lead_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table for managing service offerings
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_estimate TEXT,
  category TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create users table for admin management
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'owner')) DEFAULT 'manager',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads (public can insert, authenticated users can view)
CREATE POLICY "Anyone can submit leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" 
ON public.leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE user_id = auth.uid()
));

-- RLS Policies for services (public can view, authenticated can manage)
CREATE POLICY "Anyone can view services" 
ON public.services 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can manage services" 
ON public.services 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE user_id = auth.uid()
));

-- RLS Policies for users (authenticated users can view their own data)
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services
INSERT INTO public.services (name, description, price_estimate, category) VALUES
('Emergency Roofing', 'Hurricane damage, leaks, storm repairs', '$300-500', 'Roofing'),
('AC/HVAC Repair', '24/7 emergency cooling services', '$200-400', 'HVAC'),
('Plumbing Emergency', 'Burst pipes, water heater, drain cleaning', '$150-350', 'Plumbing'),
('Electrical Services', 'Panel upgrades, wiring, emergency repairs', '$200-450', 'Electrical'),
('Pool Repair/Service', 'Equipment repair, cleaning, maintenance', '$100-300', 'Pool'),
('Landscaping', 'Tree removal, lawn care, design', '$150-400', 'Landscaping'),
('Home Remodeling', 'Kitchen, bathroom, full renovations', '$500+', 'Remodeling'),
('Professional Cleaning', 'Deep cleaning, move-in/out', '$75-200', 'Cleaning'),
('Windows/Doors', 'Installation, repair, hurricane prep', '$200-500', 'Windows'),
('Solar Installation', 'Panels, battery backup, consultation', '$400+', 'Solar');