import geminiClient from '../geminiClient';

/**
 * Get funding amount for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @returns {Promise<Object>} Funding amount data
 */
export const getFundingAmount = async (symbol) => {
    try {
        const response = await geminiClient.get(`/v1/fundingamount/${symbol.toLowerCase()}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching funding amount for ${symbol}:`, error);
        throw error;
    }
};

/**
 * Get funding amount report file
 * @param {string} timestamp - Optional timestamp
 * @returns {Promise<Object>} Funding report data
 */
export const getFundingReport = async (timestamp = null) => {
    try {
        const params = {};
        if (timestamp) params.timestamp = timestamp;

        const response = await geminiClient.get('/v1/fundingamountreport', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching funding report:', error);
        throw error;
    }
};
