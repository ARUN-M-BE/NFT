-- =====================================================
-- Supabase Database Schema for Crypto Dashboard
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- 2. CRYPTO ASSETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crypto_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  current_price DECIMAL(20, 8),
  market_cap BIGINT,
  volume_24h BIGINT,
  percent_change_24h DECIMAL(10, 2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_crypto_assets_symbol ON public.crypto_assets(symbol);
CREATE INDEX idx_crypto_assets_market_cap ON public.crypto_assets(market_cap DESC);

-- Enable RLS (public read access)
ALTER TABLE public.crypto_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crypto assets" 
  ON public.crypto_assets FOR SELECT 
  TO public 
  USING (true);

-- =====================================================
-- 3. USER PORTFOLIO TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_portfolio (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.crypto_assets ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(20, 8) NOT NULL CHECK (quantity > 0),
  average_buy_price DECIMAL(20, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, asset_id)
);

-- Index
CREATE INDEX idx_user_portfolio_user_id ON public.user_portfolio(user_id);

-- Enable RLS
ALTER TABLE public.user_portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolio" 
  ON public.user_portfolio FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" 
  ON public.user_portfolio FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" 
  ON public.user_portfolio FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio" 
  ON public.user_portfolio FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. USER WATCHLIST TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.crypto_assets ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, asset_id)
);

-- Index
CREATE INDEX idx_user_watchlist_user_id ON public.user_watchlist(user_id);

-- Enable RLS
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist" 
  ON public.user_watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" 
  ON public.user_watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" 
  ON public.user_watchlist FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 5. PRICE ALERTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.crypto_assets ON DELETE CASCADE NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL CHECK (target_price > 0),
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" 
  ON public.price_alerts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" 
  ON public.price_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" 
  ON public.price_alerts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" 
  ON public.price_alerts FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES public.crypto_assets ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  quantity DECIMAL(20, 8) NOT NULL CHECK (quantity > 0),
  price DECIMAL(20, 8) NOT NULL CHECK (price > 0),
  total DECIMAL(20, 8) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_portfolio_updated_at 
  BEFORE UPDATE ON public.user_portfolio 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (Initial crypto assets)
-- =====================================================
INSERT INTO public.crypto_assets (symbol, name) VALUES
  ('BTC', 'Bitcoin'),
  ('ETH', 'Ethereum'),
  ('USDT', 'Tether'),
  ('BNB', 'Binance Coin'),
  ('XRP', 'Ripple'),
  ('ADA', 'Cardano'),
  ('DOGE', 'Dogecoin'),
  ('SOL', 'Solana'),
  ('DOT', 'Polkadot'),
  ('MATIC', 'Polygon'),
  ('LTC', 'Litecoin'),
  ('AVAX', 'Avalanche'),
  ('LINK', 'Chainlink'),
  ('UNI', 'Uniswap'),
  ('ATOM', 'Cosmos')
ON CONFLICT (symbol) DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. All tables have Row Level Security (RLS) enabled
-- 3. Users can only access their own data
-- 4. crypto_assets table is publicly readable
-- 5. Prices will be updated via API calls every 1 minute
