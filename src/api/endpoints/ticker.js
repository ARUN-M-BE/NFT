import geminiClient from '../geminiClient';

/**
 * Get ticker information for a symbol (V1)
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @returns {Promise<Object>} Ticker data
 */
export const getTicker = async (symbol) => {
    try {
        const response = await geminiClient.get(`/v1/pubticker/${symbol.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ticker for ${symbol}:`, error);
        throw error;
    }
};

/**
 * Get ticker information for a symbol (V2 - Recommended)
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @returns {Promise<Object>} Ticker data with additional fields
 */
export const getTickerV2 = async (symbol) => {
    try {
        const response = await geminiClient.get(`/v2/ticker/${symbol.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ticker V2 for ${symbol}:`, error);
        throw error;
    }
};
