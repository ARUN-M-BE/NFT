import axios from 'axios';

/**
 * Gemini Exchange API Client
 * Note: Has CORS restrictions - use with backend proxy or for specific features
 */

const geminiClient = axios.create({
    baseURL: 'https://api.gemini.com/v1',
    timeout: 10000,
});

// Add timestamp to prevent caching
geminiClient.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        _t: Date.now(),
    };
    return config;
});

export const geminiAPI = {
    /**
     * Get all available symbols
     */
    async getSymbols() {
        try {
            const response = await geminiClient.get('/symbols');
            return response.data;
        } catch (error) {
            console.error('Error fetching symbols:', error);
            throw error;
        }
    },

    /**
     * Get ticker data (v2)
     */
    async getTickerV2(symbol) {
        try {
            const response = await geminiClient.get(`/pubticker/${symbol}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ticker for ${symbol}:`, error);
            throw error;
        }
    },

    /**
     * Get order book
     */
    async getOrderBook(symbol, limitBids = 50, limitAsks = 50) {
        try {
            const response = await geminiClient.get(`/book/${symbol}`, {
                params: {
                    limit_bids: limitBids,
                    limit_asks: limitAsks,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching order book for ${symbol}:`, error);
            throw error;
        }
    },

    /**
     * Get recent trades
     */
    async getTrades(symbol, since = null, limitTrades = 50) {
        try {
            const params = { limit_trades: limitTrades };
            if (since) params.since = since;

            const response = await geminiClient.get(`/trades/${symbol}`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error fetching trades for ${symbol}:`, error);
            throw error;
        }
    },

    /**
     * Get candles/OHLC data
     */
    async getCandles(symbol, timeframe = '1day') {
        try {
            const response = await geminiClient.get(`/v2/candles/${symbol}/${timeframe}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching candles for ${symbol}:`, error);
            throw error;
        }
    },

    async getAllPrices() {
        try {
            const response = await geminiClient.get('v1/all-prices');
            return response.data;
        } catch (error) {
            console.error('Error fetching all prices:', error);
            throw error;
        }
    },

    async getCandle(symbol, timeframe = '1minute') {
        try {
            const response = await geminiClient.get(`/v2/candles/${symbol}/${timeframe}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching candles for ${symbol}:`, error);
            throw error;
        }
    },

    /**
     * Get price feed
     */
    async getPriceFeed() {
        try {
            const response = await geminiClient.get('/pricefeed');
            return response.data;
        } catch (error) {
            console.error('Error fetching price feed:', error);
            throw error;
        }
    },
};

/**
 * CoinGecko API Client
 * Free, CORS-friendly cryptocurrency API
 * No API key required for basic usage
 */

const coinGeckoClient = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
});

// Add timestamp to prevent caching
coinGeckoClient.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        _t: Date.now(),
    };
    return config;
});

export const coinGeckoAPI = {
    /**
     * Get list of all supported coins
     */
    async getCoinsList() {
        try {
            const response = await coinGeckoClient.get('/coins/list');
            return response.data;
        } catch (error) {
            console.error('Error fetching coins list:', error);
            throw error;
        }
    },

    /**
     * Get market data for multiple coins
     */
    async getMarkets(vsCurrency = 'usd', perPage = 100, page = 1) {
        try {
            const response = await coinGeckoClient.get('/coins/markets', {
                params: {
                    vs_currency: vsCurrency,
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page,
                    sparkline: false,
                    price_change_percentage: '24h',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching markets:', error);
            throw error;
        }
    },

    /**
     * Get detailed coin data
     */
    async getCoinData(coinId) {
        try {
            const response = await coinGeckoClient.get(`/coins/${coinId}`, {
                params: {
                    localization: false,
                    tickers: true,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data for ${coinId}:`, error);
            throw error;
        }
    },

    /**
     * Get historical market data (OHLC)
     */
    async getOHLC(coinId, vsCurrency = 'usd', days = 7) {
        try {
            const response = await coinGeckoClient.get(`/coins/${coinId}/ohlc`, {
                params: {
                    vs_currency: vsCurrency,
                    days,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching OHLC for ${coinId}:`, error);
            throw error;
        }
    },

    /**
     * Get price chart data
     */
    async getMarketChart(coinId, vsCurrency = 'usd', days = 7) {
        try {
            const response = await coinGeckoClient.get(`/coins/${coinId}/market_chart`, {
                params: {
                    vs_currency: vsCurrency,
                    days,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching market chart for ${coinId}:`, error);
            throw error;
        }
    },

    /**
     * Search for coins
     */
    async searchCoins(query) {
        try {
            const response = await coinGeckoClient.get('/search', {
                params: { query },
            });
            return response.data.coins;
        } catch (error) {
            console.error('Error searching coins:', error);
            throw error;
        }
    },

    /**
     * Get trending coins
     */
    async getTrending() {
        try {
            const response = await coinGeckoClient.get('/search/trending');
            return response.data.coins;
        } catch (error) {
            console.error('Error fetching trending coins:', error);
            throw error;
        }
    },

    /**
     * Get global cryptocurrency data
     */
    async getGlobal() {
        try {
            const response = await coinGeckoClient.get('/global');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching global data:', error);
            throw error;
        }
    },
};

// Coin ID mapping (common symbols to CoinGecko IDs)
export const COIN_ID_MAP = {
    btc: 'bitcoin',
    eth: 'ethereum',
    usdt: 'tether',
    bnb: 'binancecoin',
    xrp: 'ripple',
    ada: 'cardano',
    doge: 'dogecoin',
    sol: 'solana',
    dot: 'polkadot',
    matic: 'matic-network',
    ltc: 'litecoin',
    avax: 'avalanche-2',
    link: 'chainlink',
    uni: 'uniswap',
    atom: 'cosmos',
};

/**
 * Convert symbol to CoinGecko ID
 */
export const symbolToCoinId = (symbol) => {
    const normalized = symbol.toLowerCase().replace('usd', '');
    return COIN_ID_MAP[normalized] || normalized;
};

/**
 * API Source Selection
 * Use CoinGecko for main pages (no CORS issues)
 * Use Gemini for advanced features (with backend proxy if needed)
 */
export const API_SOURCE = {
    COINGECKO: 'coingecko',
    GEMINI: 'gemini',
};

export default {
    gemini: geminiAPI,
    coinGecko: coinGeckoAPI,
    symbolToCoinId,
    COIN_ID_MAP,
    API_SOURCE,
};
