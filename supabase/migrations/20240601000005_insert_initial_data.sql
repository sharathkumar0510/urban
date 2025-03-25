-- Insert Categories
INSERT INTO categories (name, description, icon) VALUES
('Cleaning Services', 'Professional cleaning services for homes and offices', 'https://api.dicebear.com/7.x/avataaars/svg?seed=cleaning'),
('Plumbing Services', 'Expert plumbing installation, repair and maintenance', 'https://api.dicebear.com/7.x/avataaars/svg?seed=plumbing'),
('Electrician Services', 'Professional electrical installation and repair services', 'https://api.dicebear.com/7.x/avataaars/svg?seed=electrician'),
('Pest Control Services', 'Effective pest control solutions for homes and businesses', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pestcontrol'),
('AC Services', 'Air conditioning installation, maintenance and repair', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ac'),
('Painting Services', 'Professional painting services for interior and exterior', 'https://api.dicebear.com/7.x/avataaars/svg?seed=painting'),
('Carpenter Services', 'Skilled carpentry work for repairs and custom furniture', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carpenter'),
('Home Appliance Repair', 'Repair services for all home appliances', 'https://api.dicebear.com/7.x/avataaars/svg?seed=appliance'),
('Home Security & Automation', 'Modern security and automation solutions for your home', 'https://api.dicebear.com/7.x/avataaars/svg?seed=security');

-- Insert Subcategories for Cleaning Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Home Cleaning', 'Comprehensive cleaning services for residential properties', (SELECT id FROM categories WHERE name = 'Cleaning Services')),
('Office Cleaning', 'Professional cleaning services for commercial spaces', (SELECT id FROM categories WHERE name = 'Cleaning Services')),
('Water Tank Cleaning', 'Thorough cleaning of water storage tanks', (SELECT id FROM categories WHERE name = 'Cleaning Services')),
('Sofa & Carpet Cleaning', 'Deep cleaning services for upholstery and carpets', (SELECT id FROM categories WHERE name = 'Cleaning Services')),
('Car & Vehicle Cleaning', 'Detailed cleaning services for all types of vehicles', (SELECT id FROM categories WHERE name = 'Cleaning Services')),
('Post-Construction Cleaning', 'Cleanup services after construction or renovation work', (SELECT id FROM categories WHERE name = 'Cleaning Services'));

-- Insert Subcategories for Plumbing Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Installation Services', 'Professional installation of plumbing fixtures and appliances', (SELECT id FROM categories WHERE name = 'Plumbing Services')),
('Leakage & Repairs', 'Fixing leaks and repairing plumbing issues', (SELECT id FROM categories WHERE name = 'Plumbing Services')),
('Drainage & Blockage', 'Clearing blocked drains and maintaining drainage systems', (SELECT id FROM categories WHERE name = 'Plumbing Services')),
('Water Supply & Tank Services', 'Services related to water supply systems and storage tanks', (SELECT id FROM categories WHERE name = 'Plumbing Services'));

-- Insert Subcategories for Electrician Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Wiring & Installation', 'Electrical wiring and installation services', (SELECT id FROM categories WHERE name = 'Electrician Services')),
('Appliance Repair & Installation', 'Installation and repair of electrical appliances', (SELECT id FROM categories WHERE name = 'Electrician Services')),
('Home Automation Setup', 'Setting up smart home automation systems', (SELECT id FROM categories WHERE name = 'Electrician Services')),
('Power Backup & Surge Protection', 'Installation of power backup and surge protection systems', (SELECT id FROM categories WHERE name = 'Electrician Services')),
('Electrical Safety Inspection', 'Comprehensive inspection of electrical systems for safety', (SELECT id FROM categories WHERE name = 'Electrician Services'));

-- Insert Subcategories for Pest Control Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Residential Pest Control', 'Pest control services for homes', (SELECT id FROM categories WHERE name = 'Pest Control Services')),
('Commercial Pest Control', 'Pest control solutions for businesses', (SELECT id FROM categories WHERE name = 'Pest Control Services')),
('Termite Treatment', 'Specialized treatment for termite infestations', (SELECT id FROM categories WHERE name = 'Pest Control Services')),
('Mosquito & Bed Bug Treatment', 'Targeted treatment for mosquitoes and bed bugs', (SELECT id FROM categories WHERE name = 'Pest Control Services'));

-- Insert Subcategories for AC Services
INSERT INTO subcategories (name, description, category_id) VALUES
('AC Installation & Uninstallation', 'Professional installation and removal of air conditioners', (SELECT id FROM categories WHERE name = 'AC Services')),
('AC Servicing & Maintenance', 'Regular maintenance and servicing of air conditioning units', (SELECT id FROM categories WHERE name = 'AC Services')),
('AC Repair', 'Repair services for all types of air conditioners', (SELECT id FROM categories WHERE name = 'AC Services'));

-- Insert Subcategories for Painting Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Residential Painting', 'Painting services for homes', (SELECT id FROM categories WHERE name = 'Painting Services')),
('Commercial Painting', 'Painting services for commercial properties', (SELECT id FROM categories WHERE name = 'Painting Services')),
('Custom & Decorative Painting', 'Specialized decorative painting services', (SELECT id FROM categories WHERE name = 'Painting Services'));

-- Insert Subcategories for Carpenter Services
INSERT INTO subcategories (name, description, category_id) VALUES
('Furniture Repair & Assembly', 'Repair and assembly services for furniture', (SELECT id FROM categories WHERE name = 'Carpenter Services')),
('Custom Furniture Making', 'Custom-built furniture according to specifications', (SELECT id FROM categories WHERE name = 'Carpenter Services')),
('Door & Window Repair', 'Repair services for doors and windows', (SELECT id FROM categories WHERE name = 'Carpenter Services'));

-- Insert Subcategories for Home Appliance Repair
INSERT INTO subcategories (name, description, category_id) VALUES
('Kitchen Appliances', 'Repair services for kitchen appliances', (SELECT id FROM categories WHERE name = 'Home Appliance Repair')),
('Laundry & Cleaning Appliances', 'Repair services for laundry and cleaning appliances', (SELECT id FROM categories WHERE name = 'Home Appliance Repair')),
('Refrigerator & Cooling Appliances', 'Repair services for refrigerators and cooling appliances', (SELECT id FROM categories WHERE name = 'Home Appliance Repair'));

-- Insert Subcategories for Home Security & Automation
INSERT INTO subcategories (name, description, category_id) VALUES
('CCTV & Surveillance', 'Installation of CCTV and surveillance systems', (SELECT id FROM categories WHERE name = 'Home Security & Automation')),
('Smart Home Setup', 'Setup of smart home systems and devices', (SELECT id FROM categories WHERE name = 'Home Security & Automation'));

-- Insert Services for Home Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Deep Cleaning', 'Thorough cleaning of all areas including hard-to-reach spots', 149.99, (SELECT id FROM subcategories WHERE name = 'Home Cleaning')),
('General House Cleaning', 'Regular cleaning of living spaces', 99.99, (SELECT id FROM subcategories WHERE name = 'Home Cleaning')),
('Bathroom Cleaning', 'Specialized cleaning for bathrooms', 79.99, (SELECT id FROM subcategories WHERE name = 'Home Cleaning')),
('Kitchen Cleaning', 'Detailed cleaning of kitchen areas', 89.99, (SELECT id FROM subcategories WHERE name = 'Home Cleaning')),
('Balcony Cleaning', 'Cleaning of balcony spaces', 69.99, (SELECT id FROM subcategories WHERE name = 'Home Cleaning'));

-- Insert Services for Office Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Workstation Sanitization', 'Cleaning and sanitizing of work areas', 129.99, (SELECT id FROM subcategories WHERE name = 'Office Cleaning')),
('Floor & Carpet Cleaning', 'Deep cleaning of office floors and carpets', 149.99, (SELECT id FROM subcategories WHERE name = 'Office Cleaning')),
('Conference Room Cleaning', 'Specialized cleaning for meeting spaces', 119.99, (SELECT id FROM subcategories WHERE name = 'Office Cleaning'));

-- Insert Services for Water Tank Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Overhead Tank Cleaning', 'Cleaning of rooftop water storage tanks', 199.99, (SELECT id FROM subcategories WHERE name = 'Water Tank Cleaning')),
('Underground Sump Cleaning', 'Cleaning of underground water storage tanks', 249.99, (SELECT id FROM subcategories WHERE name = 'Water Tank Cleaning'));

-- Insert Services for Sofa & Carpet Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Steam Cleaning', 'Deep cleaning using steam technology', 179.99, (SELECT id FROM subcategories WHERE name = 'Sofa & Carpet Cleaning')),
('Shampooing & Stain Removal', 'Specialized cleaning for tough stains', 159.99, (SELECT id FROM subcategories WHERE name = 'Sofa & Carpet Cleaning'));

-- Insert Services for Car & Vehicle Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Interior & Exterior Cleaning', 'Complete cleaning of vehicle inside and out', 149.99, (SELECT id FROM subcategories WHERE name = 'Car & Vehicle Cleaning')),
('Engine Bay Cleaning', 'Specialized cleaning of vehicle engine compartment', 199.99, (SELECT id FROM subcategories WHERE name = 'Car & Vehicle Cleaning'));

-- Insert Services for Post-Construction Cleaning
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Paint Stain Removal', 'Removal of paint stains from surfaces', 179.99, (SELECT id FROM subcategories WHERE name = 'Post-Construction Cleaning')),
('Debris & Dust Removal', 'Clearing of construction debris and dust', 199.99, (SELECT id FROM subcategories WHERE name = 'Post-Construction Cleaning'));

-- Insert Services for Plumbing Installation Services
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Sink & Tap Installation', 'Professional installation of sinks and taps', 129.99, (SELECT id FROM subcategories WHERE name = 'Installation Services')),
('Shower & Bathtub Installation', 'Installation of shower systems and bathtubs', 199.99, (SELECT id FROM subcategories WHERE name = 'Installation Services')),
('Water Heater Installation', 'Installation of water heating systems', 179.99, (SELECT id FROM subcategories WHERE name = 'Installation Services')),
('Dishwasher/Washing Machine Installation', 'Installation of kitchen and laundry appliances', 149.99, (SELECT id FROM subcategories WHERE name = 'Installation Services'));

-- Insert Services for Plumbing Leakage & Repairs
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Pipe Leakage Fixing', 'Repair of leaking pipes', 119.99, (SELECT id FROM subcategories WHERE name = 'Leakage & Repairs')),
('Faucet & Tap Leakage Repair', 'Fixing leaking faucets and taps', 89.99, (SELECT id FROM subcategories WHERE name = 'Leakage & Repairs')),
('Underground Pipe Repair', 'Repair of underground plumbing systems', 249.99, (SELECT id FROM subcategories WHERE name = 'Leakage & Repairs'));

-- Insert Services for Drainage & Blockage
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Kitchen Drain Cleaning', 'Clearing blocked kitchen drains', 109.99, (SELECT id FROM subcategories WHERE name = 'Drainage & Blockage')),
('Toilet Blockage Fixing', 'Clearing blocked toilets', 119.99, (SELECT id FROM subcategories WHERE name = 'Drainage & Blockage')),
('Gutter Cleaning & Maintenance', 'Cleaning and maintaining roof gutters', 159.99, (SELECT id FROM subcategories WHERE name = 'Drainage & Blockage'));

-- Insert Services for Water Supply & Tank Services
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Borewell Repair', 'Repair of borewell systems', 299.99, (SELECT id FROM subcategories WHERE name = 'Water Supply & Tank Services')),
('Overhead Tank Cleaning', 'Cleaning of rooftop water storage tanks', 199.99, (SELECT id FROM subcategories WHERE name = 'Water Supply & Tank Services')),
('Water Pressure Fixing', 'Resolving water pressure issues', 149.99, (SELECT id FROM subcategories WHERE name = 'Water Supply & Tank Services'));

-- Insert Services for Wiring & Installation
INSERT INTO services (name, description, price, subcategory_id) VALUES
('New Wiring & Rewiring', 'Installation of new electrical wiring or rewiring', 249.99, (SELECT id FROM subcategories WHERE name = 'Wiring & Installation')),
('Switchboard Installation', 'Installation of electrical switchboards', 149.99, (SELECT id FROM subcategories WHERE name = 'Wiring & Installation')),
('Electric Panel Installation', 'Installation of electrical distribution panels', 199.99, (SELECT id FROM subcategories WHERE name = 'Wiring & Installation'));

-- Insert Services for Appliance Repair & Installation
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Fan Installation & Repair', 'Installation and repair of ceiling and wall fans', 119.99, (SELECT id FROM subcategories WHERE name = 'Appliance Repair & Installation')),
('Light Fixture Installation', 'Installation of lighting fixtures', 129.99, (SELECT id FROM subcategories WHERE name = 'Appliance Repair & Installation')),
('Inverter & Battery Setup', 'Installation of power inverters and batteries', 199.99, (SELECT id FROM subcategories WHERE name = 'Appliance Repair & Installation'));

-- Insert Services for Home Automation Setup
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Smart Home Setup', 'Installation of smart home systems', 299.99, (SELECT id FROM subcategories WHERE name = 'Home Automation Setup'));

-- Insert Services for Power Backup & Surge Protection
INSERT INTO services (name, description, price, subcategory_id) VALUES
('UPS & Generator Installation', 'Installation of uninterruptible power supplies and generators', 349.99, (SELECT id FROM subcategories WHERE name = 'Power Backup & Surge Protection')),
('Voltage Stabilizer Installation', 'Installation of voltage stabilizing systems', 179.99, (SELECT id FROM subcategories WHERE name = 'Power Backup & Surge Protection'));

-- Insert Services for Electrical Safety Inspection
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Short Circuit Detection', 'Identification and fixing of short circuits', 149.99, (SELECT id FROM subcategories WHERE name = 'Electrical Safety Inspection')),
('Earthing & Wiring Inspection', 'Inspection of electrical grounding and wiring', 179.99, (SELECT id FROM subcategories WHERE name = 'Electrical Safety Inspection'));

-- Insert Services for Residential Pest Control
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Cockroach Control', 'Treatment for cockroach infestations', 129.99, (SELECT id FROM subcategories WHERE name = 'Residential Pest Control')),
('Ant & Spider Control', 'Treatment for ant and spider infestations', 119.99, (SELECT id FROM subcategories WHERE name = 'Residential Pest Control')),
('Rodent Control', 'Treatment for rodent infestations', 149.99, (SELECT id FROM subcategories WHERE name = 'Residential Pest Control'));

-- Insert Services for Commercial Pest Control
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Office Disinfection', 'Disinfection services for office spaces', 199.99, (SELECT id FROM subcategories WHERE name = 'Commercial Pest Control')),
('Restaurant Pest Control', 'Specialized pest control for food service establishments', 249.99, (SELECT id FROM subcategories WHERE name = 'Commercial Pest Control'));

-- Insert Services for Termite Treatment
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Pre-Construction Termite Treatment', 'Preventive termite treatment before construction', 299.99, (SELECT id FROM subcategories WHERE name = 'Termite Treatment')),
('Post-Construction Termite Treatment', 'Termite treatment for existing structures', 349.99, (SELECT id FROM subcategories WHERE name = 'Termite Treatment'));

-- Insert Services for Mosquito & Bed Bug Treatment
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Fogging Services', 'Outdoor fogging for mosquito control', 149.99, (SELECT id FROM subcategories WHERE name = 'Mosquito & Bed Bug Treatment')),
('Bed Bug Spray Treatment', 'Specialized treatment for bed bug infestations', 179.99, (SELECT id FROM subcategories WHERE name = 'Mosquito & Bed Bug Treatment'));

-- Insert Services for AC Installation & Uninstallation
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Split AC Installation', 'Professional installation of split air conditioners', 199.99, (SELECT id FROM subcategories WHERE name = 'AC Installation & Uninstallation')),
('Window AC Installation', 'Installation of window air conditioning units', 149.99, (SELECT id FROM subcategories WHERE name = 'AC Installation & Uninstallation')),
('AC Removal', 'Professional removal of air conditioning units', 129.99, (SELECT id FROM subcategories WHERE name = 'AC Installation & Uninstallation'));

-- Insert Services for AC Servicing & Maintenance
INSERT INTO services (name, description, price, subcategory_id) VALUES
('General Servicing', 'Regular maintenance of air conditioning units', 129.99, (SELECT id FROM subcategories WHERE name = 'AC Servicing & Maintenance')),
('Deep AC Cleaning', 'Thorough cleaning of air conditioning components', 179.99, (SELECT id FROM subcategories WHERE name = 'AC Servicing & Maintenance'));

-- Insert Services for AC Repair
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Gas Refilling', 'Refilling refrigerant in air conditioning units', 149.99, (SELECT id FROM subcategories WHERE name = 'AC Repair')),
('Cooling Issue Fixing', 'Diagnosing and fixing cooling problems', 169.99, (SELECT id FROM subcategories WHERE name = 'AC Repair')),
('AC Compressor Repair', 'Repair of air conditioner compressors', 249.99, (SELECT id FROM subcategories WHERE name = 'AC Repair'));

-- Insert Services for Residential Painting
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Interior Wall Painting', 'Painting of interior walls', 12.99, (SELECT id FROM subcategories WHERE name = 'Residential Painting')),
('Exterior Wall Painting', 'Painting of exterior walls', 14.99, (SELECT id FROM subcategories WHERE name = 'Residential Painting'));

-- Insert Services for Commercial Painting
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Office Painting', 'Painting services for office spaces', 11.99, (SELECT id FROM subcategories WHERE name = 'Commercial Painting')),
('Factory & Warehouse Painting', 'Painting services for industrial spaces', 10.99, (SELECT id FROM subcategories WHERE name = 'Commercial Painting'));

-- Insert Services for Custom & Decorative Painting
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Texture Painting', 'Application of textured paint finishes', 16.99, (SELECT id FROM subcategories WHERE name = 'Custom & Decorative Painting')),
('Wall Stencil Design', 'Creation of decorative wall patterns using stencils', 18.99, (SELECT id FROM subcategories WHERE name = 'Custom & Decorative Painting'));

-- Insert Services for Furniture Repair & Assembly
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Bed & Sofa Repair', 'Repair services for beds and sofas', 149.99, (SELECT id FROM subcategories WHERE name = 'Furniture Repair & Assembly')),
('Table & Chair Repair', 'Repair services for tables and chairs', 129.99, (SELECT id FROM subcategories WHERE name = 'Furniture Repair & Assembly'));

-- Insert Services for Custom Furniture Making
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Wardrobe & Cabinet Making', 'Custom creation of storage furniture', 499.99, (SELECT id FROM subcategories WHERE name = 'Custom Furniture Making')),
('Wooden Partition Work', 'Creation of custom wooden partitions', 399.99, (SELECT id FROM subcategories WHERE name = 'Custom Furniture Making'));

-- Insert Services for Door & Window Repair
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Lock & Handle Repair', 'Repair of door locks and handles', 99.99, (SELECT id FROM subcategories WHERE name = 'Door & Window Repair')),
('Door Hinge Fixing', 'Repair and replacement of door hinges', 89.99, (SELECT id FROM subcategories WHERE name = 'Door & Window Repair'));

-- Insert Services for Kitchen Appliances
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Microwave Repair', 'Repair services for microwave ovens', 129.99, (SELECT id FROM subcategories WHERE name = 'Kitchen Appliances')),
('Chimney & Hob Repair', 'Repair of kitchen chimneys and hobs', 149.99, (SELECT id FROM subcategories WHERE name = 'Kitchen Appliances'));

-- Insert Services for Laundry & Cleaning Appliances
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Washing Machine Repair', 'Repair services for washing machines', 149.99, (SELECT id FROM subcategories WHERE name = 'Laundry & Cleaning Appliances')),
('Dishwasher Repair', 'Repair services for dishwashers', 139.99, (SELECT id FROM subcategories WHERE name = 'Laundry & Cleaning Appliances'));

-- Insert Services for Refrigerator & Cooling Appliances
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Refrigerator Repair', 'Repair services for refrigerators', 169.99, (SELECT id FROM subcategories WHERE name = 'Refrigerator & Cooling Appliances')),
('Water Dispenser Fixing', 'Repair of water dispensers and coolers', 129.99, (SELECT id FROM subcategories WHERE name = 'Refrigerator & Cooling Appliances'));

-- Insert Services for CCTV & Surveillance
INSERT INTO services (name, description, price, subcategory_id) VALUES
('CCTV Installation', 'Installation of security camera systems', 299.99, (SELECT id FROM subcategories WHERE name = 'CCTV & Surveillance')),
('Video Door Phone Installation', 'Installation of video intercom systems', 249.99, (SELECT id FROM subcategories WHERE name = 'CCTV & Surveillance'));

-- Insert Services for Smart Home Setup
INSERT INTO services (name, description, price, subcategory_id) VALUES
('Smart Lighting', 'Installation of smart lighting systems', 199.99, (SELECT id FROM subcategories WHERE name = 'Smart Home Setup')),
('Home Automation Control', 'Setup of centralized home automation controls', 349.99, (SELECT id FROM subcategories WHERE name = 'Smart Home Setup'));