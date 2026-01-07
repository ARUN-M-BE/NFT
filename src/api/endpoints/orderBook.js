import geminiClient from '../geminiClient';

/**
 * Get current order book for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @param {number} limit_bids - Optional limit for number of bids
 * @param {number} limit_asks - Optional limit for number of asks
 * @returns {Promise<Object>} Order book with bids and asks
 */
export const getOrderBook = async (symbol, limit_bids = 50, limit_asks = 50) => {
    try {
        const params = {};
        if (limit_bids) params.limit_bids = limit_bids;
        if (limit_asks) params.limit_asks = limit_asks;

        const response = await geminiClient.get(`/v1/book/${symbol.toLowerCase()}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching order book for ${symbol}:`, error);
        throw error;
    }
};
