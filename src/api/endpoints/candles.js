import geminiClient from '../geminiClient';

/**
 * Get candle data (OHLCV) for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @param {string} timeframe - Timeframe (1m, 5m, 15m, 30m, 1hr, 6hr, 1day)
 * @returns {Promise<Array<Array<number>>>} Array of candle arrays [time, open, high, low, close, volume]
 */
export const getCandles = async (symbol, timeframe = '1day') => {
    try {
        const response = await geminiClient.get(`/v2/candles/${symbol.toLowerCase()}/${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching candles for ${symbol}:`, error);
        throw error;
    }
};

/**
 * Get derivative candle data for a symbol
 * @param {string} symbol - Trading symbol (e.g., 'btcusd')
 * @param {string} timeframe - Timeframe (1m, 5m, 15m, 30m, 1hr, 6hr, 1day)
 * @returns {Promise<Array<Array<number>>>} Array of candle arrays
 */
export const getDerivativeCandles = async (symbol, timeframe = '1day') => {
    try {
        const response = await geminiClient.get(`/v2/derivatives/candles/${symbol.toLowerCase()}/${timeframe}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching derivative candles for ${symbol}:`, error);
        throw error;
    }
};
