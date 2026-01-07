import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

// Create axios instance with base configuration
const geminiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
geminiClient.interceptors.request.use(
    (config) => {
        // Add timestamp to prevent caching
        config.params = {
            ...config.params,
            _t: Date.now(),
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
geminiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Retry logic for network errors
        if (!error.response && !originalRequest._retry) {
            originalRequest._retry = true;

            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));

            return geminiClient(originalRequest);
        }

        // Handle specific error codes
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 429:
                    console.error('Rate limit exceeded. Please try again later.');
                    break;
                case 500:
                    console.error('Server error. Please try again later.');
                    break;
                case 503:
                    console.error('Service unavailable. Please try again later.');
                    break;
                default:
                    console.error('API Error:', data?.message || error.message);
            }
        }

        return Promise.reject(error);
    }
);

export default geminiClient;
