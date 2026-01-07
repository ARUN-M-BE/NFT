import geminiClient from '../geminiClient';

/**
 * Get FX rate for a currency
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR')
 * @returns {Promise<Object>} FX rate data
 */
export const getFxRate = async (currency = 'USD') => {
    try {
        const response = await geminiClient.get(`/v1/fxrate/${currency.toUpperCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching FX rate for ${currency}:`, error);
        throw error;
    }
};
