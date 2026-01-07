// App constants

export const API_BASE_URL = 'https://api.gemini.com';

export const TIMEFRAMES = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '30m', label: '30 Minutes' },
    { value: '1hr', label: '1 Hour' },
    { value: '6hr', label: '6 Hours' },
    { value: '1day', label: '1 Day' },
];

export const POPULAR_PAIRS = [
    'BTCUSD',
    'ETHUSD',
    'SOLUSD',
    'ADAUSD',
    'DOTUSD',
    'MATICUSD',
    'LINKUSD',
    'UNIUSD',
];

export const CURRENCIES = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CAD',
    'AUD',
];

// Updated refresh intervals - all set to 1 minute (60000ms) as requested
export const REFRESH_INTERVALS = {
    TICKER: 60000,      // 1 minute
    ORDER_BOOK: 60000,  // 1 minute
    TRADES: 60000,      // 1 minute
    PRICES: 60000,      // 1 minute
    CANDLES: 60000,     // 1 minute
};

export const CHART_COLORS = {
    up: '#52c41a',
    down: '#f5222d',
    volume: '#1890ff',
    grid: '#434343',
    text: '#8c8c8c',
};

export const STATUS_COLORS = {
    success: '#52c41a',
    error: '#f5222d',
    warning: '#faad14',
    info: '#1890ff',
};
