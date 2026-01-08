// Google API Configuration
export const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyC97S3jv1i61h5fxlNkj8kCNH9EIrXofLM';

// Currency Layer API Configuration
export const CURRENCY_API_KEY = import.meta.env.VITE_CURRENCY_API_KEY || '8a1cf3f4846bbd1edb965f899768b4d9';
export const CURRENCY_API_URL = import.meta.env.VITE_CURRENCY_API_URL || 'https://api.apilayer.com/currency_data/live';

// Gemini API Configuration
export const GEMINI_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.gemini.com/v1';
export const REFRESH_INTERVAL = parseInt(import.meta.env.VITE_REFRESH_INTERVAL || '30000'); // 30 seconds

// CoinMarketCap API Configuration
export const COINMARKETCAP_API_KEY = import.meta.env.VITE_COINMARKETCAP_API_KEY || '';
export const COINMARKETCAP_API_BASE_URL = 'https://pro-api.coinmarketcap.com';

// API Keys
export const API_KEYS = {
    google: GOOGLE_API_KEY,
    currency: CURRENCY_API_KEY,
    coinmarketcap: COINMARKETCAP_API_KEY,
};

// API URLs
export const API_URLS = {
    gemini: GEMINI_API_BASE_URL,
    currency: CURRENCY_API_URL,
    coinmarketcap: COINMARKETCAP_API_BASE_URL,
};
