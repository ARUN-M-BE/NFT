import geminiClient from '../geminiClient';

/**
 * Get current fee promotions
 * @returns {Promise<Array<Object>>} Array of fee promotion objects
 */
export const getFeePromos = async () => {
    try {
        const response = await geminiClient.get('/v1/feepromos');
        return response.data;
    } catch (error) {
        console.error('Error fetching fee promos:', error);
        throw error;
    }
};
