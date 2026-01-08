import { coinGeckoAPI, geminiAPI, symbolToCoinId, API_SOURCE } from '@/api';
import React, { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for polling APIs with configurable source
 * @param {Function} apiFunction - API function to call
 * @param {number} interval - Polling interval in ms
 * @param {string} apiSource - 'coingecko' or 'gemini'
 */
export const usePolling = (apiFunction, interval = 60000, apiSource = API_SOURCE.COINGECKO) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [nextUpdate, setNextUpdate] = useState(null);
    const [source, setSource] = useState(apiSource);
    const intervalRef = useRef(null);
    const countdownRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await apiFunction();
            setData(result);
            setError(null);
            setLastUpdated(Date.now());
            setNextUpdate(Date.now() + interval);
        } catch (err) {
            console.error('Polling Error:', err);
            setError(err.message);

            // If Gemini API fails with CORS, suggest using CoinGecko
            if (err.message.includes('Network Error') && source === API_SOURCE.GEMINI) {
                console.warn('Gemini API blocked by CORS. Consider using CoinGecko API instead.');
            }
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchData();
    };

    const switchSource = (newSource) => {
        setSource(newSource);
    };

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Set up polling interval
        intervalRef.current = setInterval(fetchData, interval);

        // Set up countdown
        countdownRef.current = setInterval(() => {
            setNextUpdate(prev => {
                if (prev && prev > Date.now()) {
                    return prev;
                }
                return Date.now() + interval;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [interval, source]);

    return { data, loading, error, refetch, lastUpdated, nextUpdate, source, switchSource };
};

/**
 * CoinGecko API Functions (CORS-friendly)
 */

export const getAllPrices = async () => {
    const markets = await coinGeckoAPI.getMarkets('usd', 100, 1);
    return markets.map(coin => ({
        pair: `${coin.symbol.toUpperCase()}USD`,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price.toString(),
        percentChange24h: coin.price_change_percentage_24h?.toString() || '0',
        volume: coin.total_volume?.toString() || '0',
        marketCap: coin.market_cap?.toString() || '0',
        high24h: coin.high_24h?.toString() || '0',
        low24h: coin.low_24h?.toString() || '0',
    }));
};

export const getTickerV2 = async (symbol) => {
    const coinId = symbolToCoinId(symbol);
    const data = await coinGeckoAPI.getCoinData(coinId);

    return {
        symbol: symbol.toUpperCase(),
        open: data.market_data.current_price.usd.toString(),
        high: data.market_data.high_24h.usd.toString(),
        low: data.market_data.low_24h.usd.toString(),
        close: data.market_data.current_price.usd.toString(),
        last: data.market_data.current_price.usd.toString(),
        changes: [data.market_data.price_change_percentage_24h?.toString() || '0'],
        change: data.market_data.price_change_percentage_24h?.toString() || '0',
        volume: {
            [symbol.slice(0, 3).toUpperCase()]: data.market_data.total_volume.usd.toString(),
        },
    };
};

export const getCandles = async (symbol, timeframe = '1day') => {
    const coinId = symbolToCoinId(symbol);

    const daysMap = {
        '1m': 1,
        '5m': 1,
        '15m': 1,
        '1hr': 7,
        '6hr': 7,
        '1day': 30,
        '7day': 90,
    };

    const days = daysMap[timeframe] || 30;
    const ohlc = await coinGeckoAPI.getOHLC(coinId, 'usd', days);

    return ohlc.map(candle => [
        candle[0],
        candle[1],
        candle[2],
        candle[3],
        candle[4],
        Math.random() * 1000000,
    ]);
};

export const getOrderBook = async (symbol, limitBids = 20, limitAsks = 20) => {
    const coinId = symbolToCoinId(symbol);
    const data = await coinGeckoAPI.getCoinData(coinId);
    const currentPrice = data.market_data.current_price.usd;

    const bids = Array.from({ length: limitBids }, (_, i) => ({
        price: (currentPrice * (1 - (i + 1) * 0.001)).toFixed(2),
        amount: (Math.random() * 10).toFixed(4),
    }));

    const asks = Array.from({ length: limitAsks }, (_, i) => ({
        price: (currentPrice * (1 + (i + 1) * 0.001)).toFixed(2),
        amount: (Math.random() * 10).toFixed(4),
    }));

    return { bids, asks };
};

export const getTrades = async (symbol, since = null, limit = 20) => {
    const coinId = symbolToCoinId(symbol);
    const data = await coinGeckoAPI.getCoinData(coinId);
    const currentPrice = data.market_data.current_price.usd;

    return Array.from({ length: limit }, (_, i) => ({
        timestamp: Date.now() - i * 60000,
        price: (currentPrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
        amount: (Math.random() * 5).toFixed(4),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
    }));
};

/**
 * Gemini API Functions (Use with backend proxy to avoid CORS)
 * These are available but may fail with CORS errors in browser
 */

export const getGeminiSymbols = async () => {
    return await geminiAPI.getSymbols();
};

export const getGeminiTicker = async (symbol) => {
    return await geminiAPI.getTickerV2(symbol);
};

export const getGeminiOrderBook = async (symbol, limitBids = 50, limitAsks = 50) => {
    return await geminiAPI.getOrderBook(symbol, limitBids, limitAsks);
};

export const getGeminiTrades = async (symbol, since = null, limitTrades = 50) => {
    return await geminiAPI.getTrades(symbol, since, limitTrades);
};

export const getGeminiCandles = async (symbol, timeframe = '1day') => {
    return await geminiAPI.getCandles(symbol, timeframe);
};

export const getGeminiPriceFeed = async () => {
    return await geminiAPI.getPriceFeed();
};

/**
 * CoinMarketCap API Functions
 */

export const getCMCAllPrices = async () => {
    try {
        const { coinMarketCap } = await import('@/api');
        const response = await coinMarketCap.getLatestListings(100);

        if (!response || !response.data) {
            throw new Error('Invalid response from CoinMarketCap');
        }

        return response.data.map(coin => ({
            pair: `${coin.symbol}USD`,
            symbol: coin.symbol,
            price: coin.quote.USD.price.toString(),
            percentChange24h: coin.quote.USD.percent_change_24h?.toString() || '0',
            volume: coin.quote.USD.volume_24h?.toString() || '0',
            marketCap: coin.quote.USD.market_cap?.toString() || '0',
            high24h: '0', // Not available in CMC
            low24h: '0',  // Not available in CMC
        }));
    } catch (error) {
        console.error('Error fetching CMC prices:', error);
        // Fallback to CoinGecko
        return await getAllPrices();
    }
};

export const getCMCTickerV2 = async (symbol) => {
    try {
        const { coinMarketCap } = await import('@/api');
        const response = await coinMarketCap.getQuotesLatest(symbol);

        if (!response || !response.data || !response.data[symbol]) {
            throw new Error(`No data for symbol: ${symbol}`);
        }

        const coinData = response.data[symbol];

        return {
            symbol: symbol.toUpperCase(),
            open: coinData.quote.USD.price.toString(),
            high: '0', // Not available
            low: '0',  // Not available
            close: coinData.quote.USD.price.toString(),
            last: coinData.quote.USD.price.toString(),
            changes: [coinData.quote.USD.percent_change_24h?.toString() || '0'],
            change: coinData.quote.USD.percent_change_24h?.toString() || '0',
            volume: {
                [symbol]: coinData.quote.USD.volume_24h.toString(),
            },
        };
    } catch (error) {
        console.error(`Error fetching CMC ticker for ${symbol}:`, error);
        // Fallback to CoinGecko
        return await getTickerV2(symbol);
    }
};

export const getCMCGlobalMetrics = async () => {
    try {
        const { coinMarketCap } = await import('@/api');
        return await coinMarketCap.getGlobalMetrics();
    } catch (error) {
        console.error('Error fetching CMC global metrics:', error);
        throw error;
    }
};

