-- Sunny Seed Data
-- Version: 1.0
-- Date: January 2026

-- ============================================
-- PARTNERS
-- ============================================

INSERT INTO partners (name, email, icon_color) VALUES
  ('Heli', 'heli@automationsflow.com', 'pink'),
  ('Shahar', 'shahar@automationsflow.com', 'blue');

-- ============================================
-- ACCOUNTS
-- ============================================

-- Get partner IDs for reference
WITH partner_ids AS (
  SELECT id, name FROM partners
)
INSERT INTO accounts (name, type, partner_id) VALUES
  ('Business Bank Account', 'Bank_Transfer', NULL),
  ('Heli Business Card', 'Business_Credit', NULL),
  ('Shahar Business Card', 'Business_Credit', NULL),
  ('Heli Private Card', 'Private_Credit', (SELECT id FROM partner_ids WHERE name = 'Heli')),
  ('Shahar Private Card', 'Private_Credit', (SELECT id FROM partner_ids WHERE name = 'Shahar'));

-- ============================================
-- LINES OF BUSINESS
-- ============================================

INSERT INTO lines_of_business (name) VALUES
  ('Retail'),
  ('Legal'),
  ('High-Tech'),
  ('Marketing & Advertising'),
  ('Healthcare'),
  ('Finance & Banking'),
  ('Education'),
  ('Real Estate'),
  ('Manufacturing'),
  ('Hospitality'),
  ('Non-Profit'),
  ('Government'),
  ('Other');

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO categories (name, parent_category, tax_recognition_percent, description) VALUES
-- COGS (Cost of Goods Sold)
('Software Licenses (Production)', 'COGS', 1.0000, 'SaaS tools used directly for client work: n8n, OpenAI, Make, etc.'),
('Subcontractors', 'COGS', 1.0000, 'Freelancers hired for specific client projects'),
('Cloud Infrastructure', 'COGS', 1.0000, 'AWS, GCP, Vercel - production environments'),

-- OPEX (Operating Expenses)
('Marketing & Advertising', 'OPEX', 1.0000, 'Facebook Ads, Google Ads, LinkedIn, content marketing'),
('Professional Services', 'OPEX', 1.0000, 'Accountant, lawyer, business consulting'),
('Office Supplies', 'OPEX', 1.0000, 'Equipment, furniture, stationery'),
('Software Licenses (Internal)', 'OPEX', 1.0000, 'Tools for internal use: Notion, Slack, etc.'),
('Travel & Transportation', 'OPEX', 0.4500, 'Flights, hotels, client meetings - 45% recognized'),
('Car & Fuel', 'OPEX', 0.4500, 'Vehicle expenses - 45% recognized per Israeli tax law'),
('Communication', 'OPEX', 1.0000, 'Phone, internet - when primarily business use'),
('Home Office - Utilities', 'OPEX', 0.2500, 'Electricity, water - 25% recognized'),
('Home Office - Arnona', 'OPEX', 0.2500, 'Property tax - 25% recognized'),
('Personal Training / Coaching', 'OPEX', 1.0000, 'Business coaching, professional development'),
('Refreshments', 'OPEX', 0.8000, 'Coffee, snacks for office - 80% recognized'),
('Insurance', 'OPEX', 1.0000, 'Business insurance, liability'),
('Subscriptions & Memberships', 'OPEX', 1.0000, 'Professional associations, newsletters'),

-- Financial
('Bank Fees', 'Financial', 1.0000, 'Account fees, wire transfer fees'),
('Credit Card Fees', 'Financial', 1.0000, 'Annual fees, transaction fees'),
('Currency Exchange Loss', 'Financial', 1.0000, 'Losses from currency conversion');
