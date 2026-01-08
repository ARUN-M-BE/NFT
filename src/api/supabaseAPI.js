import { supabase } from '@/lib/supabaseClient'
import { getAllPrices as getCoinGeckoPrices } from '@/hooks/useGeminiAPI'

/**
 * Supabase API for crypto dashboard
 * Combines Supabase backend with live CoinGecko price data
 */

export const supabaseAPI = {
    /**
     * Get all crypto assets with latest prices
     * Fetches from CoinGecko and caches in Supabase
     */
    async getAllAssets() {
        try {
            // Fetch live prices from CoinGecko
            const livePrices = await getCoinGeckoPrices()

            // Return live data (Supabase caching can be added later)
            return livePrices
        } catch (error) {
            console.error('Error fetching assets:', error)
            throw error
        }
    },

    /**
     * Get user portfolio
     */
    async getUserPortfolio(userId) {
        const { data, error } = await supabase
            .from('user_portfolio')
            .select(`
        *,
        crypto_assets (
          symbol,
          name,
          current_price
        )
      `)
            .eq('user_id', userId)

        if (error) throw error
        return data
    },

    /**
     * Get user watchlist
     */
    async getUserWatchlist(userId) {
        const { data, error } = await supabase
            .from('user_watchlist')
            .select(`
        *,
        crypto_assets (*)
      `)
            .eq('user_id', userId)

        if (error) throw error
        return data
    },

    /**
     * Add asset to watchlist
     */
    async addToWatchlist(userId, symbol) {
        // First, ensure the asset exists in crypto_assets
        const { data: asset } = await supabase
            .from('crypto_assets')
            .select('id')
            .eq('symbol', symbol.toUpperCase())
            .single()

        if (!asset) {
            throw new Error('Asset not found')
        }

        const { data, error } = await supabase
            .from('user_watchlist')
            .insert({
                user_id: userId,
                asset_id: asset.id
            })
            .select()

        if (error) throw error
        return data
    },

    /**
     * Remove from watchlist
     */
    async removeFromWatchlist(userId, assetId) {
        const { error } = await supabase
            .from('user_watchlist')
            .delete()
            .eq('user_id', userId)
            .eq('asset_id', assetId)

        if (error) throw error
    },

    /**
     * Create price alert
     */
    async createAlert(userId, symbol, targetPrice, condition) {
        const { data: asset } = await supabase
            .from('crypto_assets')
            .select('id')
            .eq('symbol', symbol.toUpperCase())
            .single()

        if (!asset) {
            throw new Error('Asset not found')
        }

        const { data, error } = await supabase
            .from('price_alerts')
            .insert({
                user_id: userId,
                asset_id: asset.id,
                target_price: targetPrice,
                condition: condition,
                is_active: true
            })
            .select()

        if (error) throw error
        return data
    },

    /**
     * Get user alerts
     */
    async getUserAlerts(userId) {
        const { data, error } = await supabase
            .from('price_alerts')
            .select(`
        *,
        crypto_assets (
          symbol,
          name,
          current_price
        )
      `)
            .eq('user_id', userId)
            .eq('is_active', true)

        if (error) throw error
        return data
    },

    /**
     * Add transaction
     */
    async addTransaction(userId, symbol, type, quantity, price) {
        const { data: asset } = await supabase
            .from('crypto_assets')
            .select('id')
            .eq('symbol', symbol.toUpperCase())
            .single()

        if (!asset) {
            throw new Error('Asset not found')
        }

        const total = quantity * price

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: userId,
                asset_id: asset.id,
                type: type,
                quantity: quantity,
                price: price,
                total: total
            })
            .select()

        if (error) throw error
        return data
    },

    /**
     * Get user transactions
     */
    async getUserTransactions(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
        *,
        crypto_assets (
          symbol,
          name
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    /**
     * Update crypto asset prices (called by price update service)
     */
    async updateAssetPrices(pricesData) {
        const updates = pricesData.map(price => ({
            symbol: price.symbol || price.pair.replace('USD', ''),
            current_price: parseFloat(price.price),
            percent_change_24h: parseFloat(price.percentChange24h || 0),
            volume_24h: parseFloat(price.volume || 0),
            market_cap: parseFloat(price.marketCap || 0),
            last_updated: new Date().toISOString()
        }))

        const { data, error } = await supabase
            .from('crypto_assets')
            .upsert(updates, { onConflict: 'symbol' })

        if (error) throw error
        return data
    }
}

export default supabaseAPI
