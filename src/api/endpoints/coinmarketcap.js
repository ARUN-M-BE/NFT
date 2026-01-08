import axios from 'axios';
import { COINMARKETCAP_API_KEY } from '@/config/api';

/**
 * CoinMarketCap API Client
 * Professional-grade cryptocurrency market data
 * Requires API key - no CORS issues
 */

const coinMarketCapClient = axios.create({
    baseURL: 'https://pro-api.coinmarketcap.com/v1',
    timeout: 10000,
    headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
    },
});

// Add timestamp to prevent caching
coinMarketCapClient.interceptors.request.use(config => {
    config.params = {
        ...config.params,
        _t: Date.now(),
    };
    return config;
});

// Response interceptor for error handling
coinMarketCapClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 401:
                    console.error('CoinMarketCap API: Invalid API key');
                    break;
                case 429:
                    console.error('CoinMarketCap API: Rate limit exceeded');
                    break;
                case 500:
                    console.error('CoinMarketCap API: Server error');
                    break;
                default:
                    console.error('CoinMarketCap API Error:', error.message);
            }
        }
        return Promise.reject(error);
    }
);

export const coinMarketCapEndpoints = {
    listings: '/cryptocurrency/listings/latest',
    quotes: '/cryptocurrency/quotes/latest',
    info: '/cryptocurrency/info',
    globalMetrics: '/global-metrics/quotes/latest',
    map: '/cryptocurrency/map',
    marketPairs: '/cryptocurrency/market-pairs/latest',
};

export const coinMarketCapAPI = {
    /**
     * Get latest cryptocurrency listings
     * @param {number} limit - Number of cryptocurrencies to return (default: 100)
     * @param {string} convert - Currency to convert to (default: USD)
     */
    async getLatestListings(limit = 100, convert = 'USD') {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.listings, {
                params: {
                    limit,
                    convert,
                    sort: 'market_cap',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching latest listings:', error);
            throw error;
        }
    },

    /**
     * Get latest quotes for specific cryptocurrencies
     * @param {string} symbols - Comma-separated symbols (e.g., 'BTC,ETH,USDT')
     * @param {string} convert - Currency to convert to (default: USD)
     */
    async getQuotesLatest(symbols, convert = 'USD') {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.quotes, {
                params: {
                    symbol: symbols,
                    convert,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching quotes for ${symbols}:`, error);
            throw error;
        }
    },

    /**
     * Get cryptocurrency metadata
     * @param {string} symbols - Comma-separated symbols (e.g., 'BTC,ETH')
     */
    async getCryptoInfo(symbols) {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.info, {
                params: {
                    symbol: symbols,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching info for ${symbols}:`, error);
            throw error;
        }
    },

    /**
     * Get global market metrics
     * @param {string} convert - Currency to convert to (default: USD)
     */
    async getGlobalMetrics(convert = 'USD') {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.globalMetrics, {
                params: {
                    convert,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching global metrics:', error);
            throw error;
        }
    },

    /**
     * Get CoinMarketCap ID mapping
     * @param {number} limit - Number of results (default: 5000)
     */
    async getCryptoMap(limit = 5000) {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.map, {
                params: {
                    limit,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto map:', error);
            throw error;
        }
    },

    /**
     * Get market pairs for a cryptocurrency
     * @param {number} id - CoinMarketCap ID
     * @param {number} limit - Number of pairs to return (default: 100)
     */
    async getMarketPairs(id, limit = 100) {
        try {
            const response = await coinMarketCapClient.get(coinMarketCapEndpoints.marketPairs, {
                params: {
                    id,
                    limit,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching market pairs for ID ${id}:`, error);
            throw error;
        }
    },
};

export default coinMarketCapClient;
