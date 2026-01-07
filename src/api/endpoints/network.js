import geminiClient from '../geminiClient';

/**
 * Get network information for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btc')
 * @returns {Promise<Object>} Network information
 */
export const getNetwork = async (symbol) => {
    try {
        const response = await geminiClient.get(`/v1/network/${symbol.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching network info for ${symbol}:`, error);
        throw error;
    }
};
