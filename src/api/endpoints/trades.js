import geminiClient from '../geminiClient';

/**
 * Get recent trades for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @param {number} since - Optional timestamp to get trades since
 * @param {number} limit_trades - Optional limit for number of trades (max 500)
 * @returns {Promise<Array<Object>>} Array of trade objects
 */
export const getTrades = async (symbol, since = null, limit_trades = 100) => {
    try {
        const params = {};
        if (since) params.since = since;
        if (limit_trades) params.limit_trades = limit_trades;

        const response = await geminiClient.get(`/v1/trades/${symbol.toLowerCase()}`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching trades for ${symbol}:`, error);
        throw error;
    }
};
