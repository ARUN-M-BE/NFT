-- =====================================================
-- Migration: Add symbol columns to existing tables
-- Run this AFTER the initial schema has been created
-- =====================================================

-- Add symbol column to user_portfolio (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_portfolio' AND column_name = 'symbol'
    ) THEN
        ALTER TABLE public.user_portfolio ADD COLUMN symbol TEXT NOT NULL DEFAULT 'UNKNOWN';
        -- Update existing rows with symbol from crypto_assets
        UPDATE public.user_portfolio p
        SET symbol = ca.symbol
        FROM public.crypto_assets ca
        WHERE p.asset_id = ca.id;
    END IF;
END $$;

-- Add symbol column to user_watchlist (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_watchlist' AND column_name = 'symbol'
    ) THEN
        ALTER TABLE public.user_watchlist ADD COLUMN symbol TEXT NOT NULL DEFAULT 'UNKNOWN';
        -- Update existing rows with symbol from crypto_assets
        UPDATE public.user_watchlist w
        SET symbol = ca.symbol
        FROM public.crypto_assets ca
        WHERE w.asset_id = ca.id;
    END IF;
END $$;

-- Add symbol column to price_alerts (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'price_alerts' AND column_name = 'symbol'
    ) THEN
        ALTER TABLE public.price_alerts ADD COLUMN symbol TEXT NOT NULL DEFAULT 'UNKNOWN';
        -- Update existing rows with symbol from crypto_assets
        UPDATE public.price_alerts a
        SET symbol = ca.symbol
        FROM public.crypto_assets ca
        WHERE a.asset_id = ca.id;
    END IF;
END $$;

-- Add symbol column to transactions (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'symbol'
    ) THEN
        ALTER TABLE public.transactions ADD COLUMN symbol TEXT NOT NULL DEFAULT 'UNKNOWN';
        -- Update existing rows with symbol from crypto_assets
        UPDATE public.transactions t
        SET symbol = ca.symbol
        FROM public.crypto_assets ca
        WHERE t.asset_id = ca.id;
    END IF;
END $$;

-- Verify the migration
SELECT 
    'user_portfolio' as table_name,
    COUNT(*) as rows_with_symbol
FROM public.user_portfolio
WHERE symbol IS NOT NULL
UNION ALL
SELECT 
    'user_watchlist',
    COUNT(*)
FROM public.user_watchlist
WHERE symbol IS NOT NULL
UNION ALL
SELECT 
    'price_alerts',
    COUNT(*)
FROM public.price_alerts
WHERE symbol IS NOT NULL
UNION ALL
SELECT 
    'transactions',
    COUNT(*)
FROM public.transactions
WHERE symbol IS NOT NULL;

-- Success message
SELECT 'Migration completed successfully! Symbol columns added to all tables.' as status;
