import geminiClient from '../geminiClient';

/**
 * Get all available symbols for trading
 * @returns {Promise<Array<string>>} Array of symbol strings
 */
export const getAllPrices = async () => {
    try {
        const response = await geminiClient.get('/v2/all-prices');
        return response.data;
    } catch (error) {
        console.error('Error fetching all prices:', error);
        throw error;
    }
};

