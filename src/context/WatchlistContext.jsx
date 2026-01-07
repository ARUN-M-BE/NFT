import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within WatchlistProvider');
    }
    return context;
};

export const WatchlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useLocalStorage(`watchlist_${user?.id}`, []);

    const addToWatchlist = (symbol) => {
        if (!watchlist.includes(symbol)) {
            setWatchlist([...watchlist, symbol]);
        }
    };

    const removeFromWatchlist = (symbol) => {
        setWatchlist(watchlist.filter(s => s !== symbol));
    };

    const isInWatchlist = (symbol) => {
        return watchlist.includes(symbol);
    };

    const toggleWatchlist = (symbol) => {
        if (isInWatchlist(symbol)) {
            removeFromWatchlist(symbol);
        } else {
            addToWatchlist(symbol);
        }
    };

    const value = {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
    };

    return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};
