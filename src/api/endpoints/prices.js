import geminiClient from '../geminiClient';

/**
 * Get all current prices for all symbols
 * @returns {Promise<Array<Object>>} Array of price objects
 */
export const getAllPrices = async () => {
    try {
        const response = await geminiClient.get('/v1/pricefeed');
        return response.data;
    } catch (error) {
        console.error('Error fetching prices:', error);
        throw error;
    }
};
