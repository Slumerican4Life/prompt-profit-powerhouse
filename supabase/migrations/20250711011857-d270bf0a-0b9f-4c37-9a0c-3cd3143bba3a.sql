-- Expand the services table with more Florida contractor services
INSERT INTO public.services (name, description, category, price_estimate, active) VALUES
-- Emergency Services
('Emergency Roofing', 'Hurricane damage, storm repairs, emergency leak fixes', 'Emergency', '$500-2000', true),
('Emergency Plumbing', '24/7 burst pipes, water heater, drain backups', 'Emergency', '$200-800', true),
('Emergency Electrical', 'Power outages, electrical fires, safety hazards', 'Emergency', '$300-1000', true),
('Emergency HVAC', 'AC breakdown, heating failure, refrigerant leaks', 'Emergency', '$250-1200', true),
('Hurricane Preparation', 'Board up, generator install, storm shutters', 'Emergency', '$400-1500', true),

-- Home Improvement
('Kitchen Remodeling', 'Complete kitchen renovation and design', 'Home Improvement', '$15000-50000', true),
('Bathroom Remodeling', 'Full bathroom renovation and upgrades', 'Home Improvement', '$8000-25000', true),
('Flooring Installation', 'Hardwood, tile, laminate, carpet installation', 'Home Improvement', '$3-12/sq ft', true),
('Interior Painting', 'Professional interior painting services', 'Home Improvement', '$2-6/sq ft', true),
('Exterior Painting', 'House exterior painting and staining', 'Home Improvement', '$3-8/sq ft', true),
('Drywall Repair', 'Hole repair, texture matching, wall restoration', 'Home Improvement', '$150-500', true),
('Crown Molding', 'Decorative trim and molding installation', 'Home Improvement', '$8-25/linear ft', true),

-- HVAC & Air Quality
('Duct Cleaning', 'Air duct cleaning and sanitization', 'HVAC', '$300-600', true),
('AC Installation', 'New air conditioning system installation', 'HVAC', '$3000-8000', true),
('Heat Pump Service', 'Heat pump repair and maintenance', 'HVAC', '$200-800', true),
('Indoor Air Quality', 'Air purification and filtration systems', 'HVAC', '$500-2000', true),

-- Pool & Outdoor
('Pool Cleaning', 'Weekly pool maintenance and chemical balancing', 'Pool Services', '$100-200/month', true),
('Pool Equipment Repair', 'Pump, filter, heater repair and replacement', 'Pool Services', '$200-1500', true),
('Pool Deck Repair', 'Concrete, tile, and deck restoration', 'Pool Services', '$500-3000', true),
('Landscaping Design', 'Custom landscape design and installation', 'Landscaping', '$2000-15000', true),
('Lawn Care', 'Regular mowing, edging, and maintenance', 'Landscaping', '$50-150/visit', true),
('Tree Removal', 'Safe tree removal and stump grinding', 'Landscaping', '$300-2000', true),
('Irrigation Systems', 'Sprinkler installation and repair', 'Landscaping', '$1500-5000', true),

-- Specialized Health Services
('Head Lice Removal', 'Professional head lice treatment and prevention', 'Healthcare', '$150-300', true),
('Mold Remediation', 'Professional mold removal and prevention', 'Healthcare', '$500-3000', true),
('Pest Control', 'Termite, ant, roach, and pest elimination', 'Healthcare', '$150-500', true),

-- Construction & Repair
('Roof Replacement', 'Complete roof replacement and installation', 'Construction', '$8000-25000', true),
('Roof Repair', 'Shingle replacement, leak repair, maintenance', 'Construction', '$300-1500', true),
('Siding Installation', 'Vinyl, wood, and fiber cement siding', 'Construction', '$8-15/sq ft', true),
('Window Replacement', 'Energy efficient window installation', 'Construction', '$300-800/window', true),
('Door Installation', 'Interior and exterior door replacement', 'Construction', '$200-800/door', true),
('Fence Installation', 'Wood, vinyl, chain link fencing', 'Construction', '$15-40/linear ft', true),
('Deck Building', 'Custom deck construction and repair', 'Construction', '$15-35/sq ft', true),
('Garage Door Repair', 'Garage door and opener service', 'Construction', '$150-600', true),

-- Electrical Services
('Electrical Panel Upgrade', 'Electrical panel replacement and upgrades', 'Electrical', '$1200-3000', true),
('Outlet Installation', 'New electrical outlets and GFCI installation', 'Electrical', '$150-300/outlet', true),
('Ceiling Fan Installation', 'Ceiling fan and light fixture installation', 'Electrical', '$200-500', true),
('Generator Installation', 'Whole house and portable generator setup', 'Electrical', '$3000-8000', true),

-- Plumbing Services  
('Water Heater Installation', 'Tankless and traditional water heater install', 'Plumbing', '$800-2500', true),
('Pipe Repair', 'Leak repair, pipe replacement, repiping', 'Plumbing', '$200-1000', true),
('Toilet Installation', 'Toilet replacement and repair', 'Plumbing', '$200-500', true),
('Garbage Disposal', 'Disposal installation and repair', 'Plumbing', '$150-400', true),
('Water Filtration', 'Whole house water filtration systems', 'Plumbing', '$500-2000', true),

-- Cleaning & Maintenance
('House Cleaning', 'Regular and deep house cleaning services', 'Cleaning', '$100-300', true),
('Pressure Washing', 'House, driveway, and deck pressure washing', 'Cleaning', '$200-600', true),
('Gutter Cleaning', 'Gutter cleaning and maintenance', 'Cleaning', '$150-400', true),
('Carpet Cleaning', 'Professional carpet and upholstery cleaning', 'Cleaning', '$100-400', true);

-- Enable realtime for leads table so dashboard gets live updates
ALTER TABLE public.leads REPLICA IDENTITY FULL;
SELECT cron.schedule('realtime-leads', '*/5 * * * *', 'NOTIFY leads_updated;');