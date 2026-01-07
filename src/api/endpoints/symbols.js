import geminiClient from '../geminiClient';

/**
 * Get all available symbols for trading
 * @returns {Promise<Array<string>>} Array of symbol strings
 */
export const getSymbols = async () => {
    try {
        const response = await geminiClient.get('/v1/symbols');
        return response.data;
    } catch (error) {
        console.error('Error fetching symbols:', error);
        throw error;
    }
};

/**
 * Get detailed information about a specific symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @returns {Promise<Object>} Symbol details
 */
export const getSymbolDetails = async (symbol) => {
    try {
        const response = await geminiClient.get(`/v1/symbols/details/${symbol.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching symbol details for ${symbol}:`, error);
        throw error;
    }
};
