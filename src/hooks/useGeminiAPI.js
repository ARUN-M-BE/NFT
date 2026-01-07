import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching data from Gemini API
 * @param {Function} apiFunction - API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to fetch immediately
 * @returns {Object} { data, loading, error, refetch, lastUpdated }
 */
export const useGeminiAPI = (apiFunction, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction();
            setData(result);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, dependencies);

    return { data, loading, error, refetch: fetchData, lastUpdated };
};

/**
 * Hook for polling data at intervals with visual feedback
 * @param {Function} apiFunction - API function to call
 * @param {number} interval - Polling interval in milliseconds (default: 60000ms = 1 minute)
 * @param {Array} dependencies - Dependencies array
 * @returns {Object} { data, loading, error, refetch, lastUpdated, nextUpdate }
 */
export const usePolling = (apiFunction, interval = 60000, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [nextUpdate, setNextUpdate] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const result = await apiFunction();
            setData(result);
            setLoading(false);
            const now = new Date();
            setLastUpdated(now);
            setNextUpdate(new Date(now.getTime() + interval));
        } catch (err) {
            setError(err.message || 'An error occurred');
            setLoading(false);
            console.error('Polling Error:', err);
        }
    }, [apiFunction, interval]);

    useEffect(() => {
        // Initial fetch
        fetchData();

        // Set up polling interval
        const intervalId = setInterval(() => {
            fetchData();
        }, interval);

        return () => clearInterval(intervalId);
    }, [...dependencies, interval]);

    return { data, loading, error, refetch: fetchData, lastUpdated, nextUpdate };
};
