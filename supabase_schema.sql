-- Supabase Schema for NXG Intelligence Platform
-- Paste this entire file into the Supabase SQL Editor and click "Run"

-- ==========================================
-- 1. Custom Types (Enums)
-- ==========================================
CREATE TYPE user_role AS ENUM ('admin', 'investor', 'company');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'trade', 'payout', 'investment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE order_side AS ENUM ('buy', 'sell');
CREATE TYPE order_type AS ENUM ('market', 'limit', 'stop');
CREATE TYPE order_status AS ENUM ('open', 'filled', 'cancelled', 'rejected');
CREATE TYPE asset_type AS ENUM ('stock', 'crypto', 'forex', 'private_equity', 'bond');

-- ==========================================
-- 2. Tables
-- ==========================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role user_role DEFAULT 'investor',
    full_name TEXT,
    avatar_url TEXT,
    kyc_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies (for company onboarding/profiles)
CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    name TEXT NOT NULL,
    registration_number TEXT,
    jurisdiction TEXT,
    sector TEXT,
    mission TEXT,
    tier_classification TEXT,
    risk_profile TEXT,
    growth_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets (multi-currency support)
CREATE TABLE wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    currency TEXT NOT NULL, -- e.g., 'USD', 'NGN', 'USDC'
    balance NUMERIC DEFAULT 0.00,
    yield_rate NUMERIC DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, currency)
);

-- Transactions (Activity Center & Payouts)
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id) NOT NULL,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    type transaction_type NOT NULL,
    amount NUMERIC NOT NULL,
    status transaction_status DEFAULT 'pending',
    reference TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (Marketplace, Stocks, Forex)
CREATE TABLE assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type asset_type NOT NULL,
    current_price NUMERIC NOT NULL,
    price_change_24h NUMERIC DEFAULT 0,
    volume_24h NUMERIC DEFAULT 0,
    market_cap NUMERIC,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders (Trading Engine)
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    asset_id UUID REFERENCES assets(id) NOT NULL,
    side order_side NOT NULL,
    type order_type NOT NULL,
    quantity NUMERIC NOT NULL,
    price NUMERIC, -- Null for market orders
    status order_status DEFAULT 'open',
    filled_quantity NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Items
CREATE TABLE portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) NOT NULL,
    asset_id UUID REFERENCES assets(id) NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    average_buy_price NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, asset_id)
);

-- Audit Logs (Admin Panel & Compliance)
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    ip_address TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. Row Level Security (RLS) Policies
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Users can manage their own company" ON companies FOR ALL USING (profile_id = auth.uid());

-- Wallets Policies
CREATE POLICY "Users can view their own wallets" ON wallets FOR SELECT USING (profile_id = auth.uid());

-- Transactions Policies
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Assets Policies
CREATE POLICY "Anyone can view active assets" ON assets FOR SELECT USING (is_active = true);

-- Orders Policies
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update their own open orders" ON orders FOR UPDATE USING (profile_id = auth.uid() AND status = 'open');

-- Portfolio Policies
CREATE POLICY "Users can view their own portfolio" ON portfolio_items FOR SELECT USING (profile_id = auth.uid());

-- Audit Logs Policies
CREATE POLICY "Only admins can view audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 4. Functions and Triggers
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile and default wallet on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create the user profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  
  -- Auto-create default USD wallet for new user
  INSERT INTO public.wallets (profile_id, currency, balance)
  VALUES (new.id, 'USD', 0.00);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. Real-time Setup
-- ==========================================
-- Enable real-time for specific tables so the frontend can subscribe to changes via WebSockets

BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE assets, orders, transactions, wallets, portfolio_items;
