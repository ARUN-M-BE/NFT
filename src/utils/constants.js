export const REFRESH_INTERVALS = {
    FAST: 10000,      // 10 seconds
    STANDARD: 30000,  // 30 seconds (default)
    SLOW: 60000,      // 60 seconds
    TRADES: 10000, // 10 seconds
    CANDLES: 60000, // 1 minute
};

export const TIMEFRAMES = [
    { label: '1 Minute', value: '1m' },
    { label: '5 Minutes', value: '5m' },
    { label: '15 Minutes', value: '15m' },
    { label: '1 Hour', value: '1hr' },
    { label: '6 Hours', value: '6hr' },
    { label: '1 Day', value: '1day' },
    { label: '7 Days', value: '7day' },
];

export const POPULAR_PAIRS = [
    'BTCUSD',
    'ETHUSD',
    'LTCUSD',
    'BCHUSD',
    'LINKUSD',
    'UNIUSD',
    'AAVEUSD',
    'MATICUSD',
];
