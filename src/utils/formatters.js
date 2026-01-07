// Utility functions for formatting

export const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined) return '0.00';
    return Number(num).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

export const formatCurrency = (num, currency = 'USD', decimals = 2) => {
    if (num === null || num === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
};

export const formatPercentage = (num, decimals = 2) => {
    if (num === null || num === undefined) return '0.00%';
    const value = Number(num);
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
};

export const formatLargeNumber = (num) => {
    if (num === null || num === undefined) return '0';
    const absNum = Math.abs(num);

    if (absNum >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (absNum >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (absNum >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }

    return num.toFixed(2);
};

export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
};

export const formatSymbol = (symbol) => {
    if (!symbol) return '';
    // Convert BTCUSD to BTC/USD
    const match = symbol.match(/^([A-Z]+)([A-Z]{3,4})$/);
    if (match) {
        return `${match[1]}/${match[2]}`;
    }
    return symbol;
};

export const parseSymbol = (formattedSymbol) => {
    if (!formattedSymbol) return '';
    // Convert BTC/USD to BTCUSD
    return formattedSymbol.replace('/', '');
};

export const getPriceColor = (change) => {
    if (change > 0) return 'success.light';
    if (change < 0) return 'danger.light';
    return 'gray.400';
};

export const getPriceDirection = (change) => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
};

export const truncateAddress = (address, startChars = 6, endChars = 4) => {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};
