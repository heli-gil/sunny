-- Sunny Database Schema
-- Version: 1.0
-- Date: January 2026

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE account_type AS ENUM (
  'Business_Credit',
  'Private_Credit',
  'Bank_Transfer'
);

CREATE TYPE parent_category AS ENUM ('COGS', 'OPEX', 'Financial');

CREATE TYPE currency_code AS ENUM ('ILS', 'USD', 'EUR', 'GBP');

CREATE TYPE beneficiary_type AS ENUM ('Business', 'Heli', 'Shahar');

CREATE TYPE invoice_status AS ENUM ('Draft', 'Sent', 'Overdue', 'Paid');

CREATE TYPE client_status AS ENUM ('Active', 'Inactive');

CREATE TYPE withdrawal_method AS ENUM ('Bank_Transfer', 'Cash', 'Check');

CREATE TYPE audit_action AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- ============================================
-- TABLES
-- ============================================

-- Partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  icon_color VARCHAR(20) NOT NULL, -- 'pink' for Heli, 'blue' for Shahar
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts (Payment Methods) table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type account_type NOT NULL,
  partner_id UUID REFERENCES partners(id), -- NULL for business accounts
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  parent_category parent_category NOT NULL,
  tax_recognition_percent DECIMAL(5,4) NOT NULL DEFAULT 1.0000, -- 1.0 = 100%
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lines of Business table
CREATE TABLE lines_of_business (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  contact_info TEXT,
  lob_id UUID REFERENCES lines_of_business(id),
  status client_status DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions (Expenses) table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  supplier_name VARCHAR(200) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency currency_code NOT NULL DEFAULT 'ILS',
  exchange_rate_to_ils DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
  amount_ils DECIMAL(12,2) GENERATED ALWAYS AS (amount * exchange_rate_to_ils) STORED,
  category_id UUID NOT NULL REFERENCES categories(id),
  account_id UUID NOT NULL REFERENCES accounts(id),
  beneficiary beneficiary_type NOT NULL DEFAULT 'Business',
  applied_tax_percent DECIMAL(5,4) NOT NULL, -- Copied from category, can be overridden
  client_id UUID REFERENCES clients(id), -- Optional: for direct project expenses
  invoice_url TEXT, -- Link to Google Drive
  notes TEXT,
  created_by UUID REFERENCES partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Invoices (Receivables) table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id),
  description TEXT, -- Project/service description
  amount DECIMAL(12,2) NOT NULL,
  currency currency_code NOT NULL DEFAULT 'ILS',
  exchange_rate_to_ils DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
  amount_ils DECIMAL(12,2) GENERATED ALWAYS AS (amount * exchange_rate_to_ils) STORED,
  includes_vat BOOLEAN DEFAULT true,
  vat_rate DECIMAL(5,4) DEFAULT 0.1800, -- 18% Israel VAT
  date_issued DATE NOT NULL,
  due_date DATE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'Draft',
  date_paid DATE, -- When actually paid
  heli_split_percent DECIMAL(5,2) DEFAULT 50.00,
  shahar_split_percent DECIMAL(5,2) DEFAULT 50.00,
  invoice_url TEXT, -- Link to Google Drive
  notes TEXT,
  created_by UUID REFERENCES partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT split_sum_check CHECK (heli_split_percent + shahar_split_percent = 100)
);

-- Withdrawals (Partner Salary Draws) table
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  method withdrawal_method NOT NULL DEFAULT 'Bank_Transfer',
  notes TEXT,
  created_by UUID REFERENCES partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Exchange Rates (Cache) table
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  currency currency_code NOT NULL,
  rate_to_ils DECIMAL(10,4) NOT NULL,
  source VARCHAR(50) DEFAULT 'exchangerate-api',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(date, currency)
);

-- Audit Log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  action audit_action NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES partners(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Transactions indexes
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_beneficiary ON transactions(beneficiary);
CREATE INDEX idx_transactions_year ON transactions(EXTRACT(YEAR FROM date));

-- Invoices indexes
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_year ON invoices(EXTRACT(YEAR FROM date_issued));

-- Withdrawals indexes
CREATE INDEX idx_withdrawals_partner ON withdrawals(partner_id);
CREATE INDEX idx_withdrawals_date ON withdrawals(date DESC);

-- Exchange rates index
CREATE INDEX idx_exchange_rates_date ON exchange_rates(date DESC);

-- Audit log indexes
CREATE INDEX idx_audit_log_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_date ON audit_log(changed_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function: Audit log trigger
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user from context (set by API)
  current_user_id := current_setting('app.current_user_id', true)::UUID;

  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), current_user_id);
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user_id);
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'CREATE', to_jsonb(NEW), current_user_id);
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: Check overdue invoices
CREATE OR REPLACE FUNCTION check_overdue_invoices()
RETURNS void AS $$
BEGIN
  UPDATE invoices
  SET status = 'Overdue', updated_at = NOW()
  WHERE status = 'Sent'
    AND due_date < CURRENT_DATE
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- updated_at triggers
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lines_of_business_updated_at BEFORE UPDATE ON lines_of_business
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawals_updated_at BEFORE UPDATE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_withdrawals AFTER INSERT OR UPDATE OR DELETE ON withdrawals
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_clients AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lines_of_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all data
CREATE POLICY "Authenticated users can read partners" ON partners
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read accounts" ON accounts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read categories" ON categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read lines_of_business" ON lines_of_business
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read clients" ON clients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read transactions" ON transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read invoices" ON invoices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read withdrawals" ON withdrawals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read exchange_rates" ON exchange_rates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read audit_log" ON audit_log
  FOR SELECT TO authenticated USING (true);

-- Policy: Allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can insert transactions" ON transactions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions" ON transactions
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete transactions" ON transactions
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert invoices" ON invoices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update invoices" ON invoices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete invoices" ON invoices
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert clients" ON clients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert withdrawals" ON withdrawals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update withdrawals" ON withdrawals
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete withdrawals" ON withdrawals
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert accounts" ON accounts
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update accounts" ON accounts
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert lines_of_business" ON lines_of_business
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update lines_of_business" ON lines_of_business
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert exchange_rates" ON exchange_rates
  FOR INSERT TO authenticated WITH CHECK (true);
