import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useToast } from '@chakra-ui/react';

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
    const toast = useToast();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadWatchlist();
            subscribeToWatchlist();
        } else {
            setWatchlist([]);
            setLoading(false);
        }
    }, [user]);

    const loadWatchlist = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('user_watchlist')
                .select('symbol')
                .eq('user_id', user.id);

            if (error) throw error;

            setWatchlist(data?.map(item => item.symbol) || []);
        } catch (error) {
            console.error('Error loading watchlist:', error);
            toast({
                title: 'Error loading watchlist',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const subscribeToWatchlist = () => {
        const channel = supabase
            .channel('watchlist_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'user_watchlist',
                filter: `user_id=eq.${user.id}`
            }, () => {
                loadWatchlist();
            })
            .subscribe();

        return () => channel.unsubscribe();
    };

    const addToWatchlist = async (symbol) => {
        try {
            // Get or create crypto asset
            const { data: asset } = await supabase
                .from('crypto_assets')
                .select('id')
                .eq('symbol', symbol.toUpperCase())
                .single();

            let assetId = asset?.id;

            if (!assetId) {
                const { data: newAsset, error: assetError } = await supabase
                    .from('crypto_assets')
                    .insert({ symbol: symbol.toUpperCase(), name: symbol })
                    .select()
                    .single();

                if (assetError) throw assetError;
                assetId = newAsset.id;
            }

            // Add to watchlist
            const { error } = await supabase
                .from('user_watchlist')
                .insert({
                    user_id: user.id,
                    asset_id: assetId,
                    symbol: symbol.toUpperCase(),
                });

            if (error) throw error;

            await loadWatchlist();

            toast({
                title: 'Added to watchlist',
                description: `${symbol.toUpperCase()} added to your watchlist`,
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            toast({
                title: 'Error adding to watchlist',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const removeFromWatchlist = async (symbol) => {
        try {
            const { error } = await supabase
                .from('user_watchlist')
                .delete()
                .eq('user_id', user.id)
                .eq('symbol', symbol.toUpperCase());

            if (error) throw error;

            await loadWatchlist();

            toast({
                title: 'Removed from watchlist',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            toast({
                title: 'Error removing from watchlist',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const isInWatchlist = (symbol) => {
        return watchlist.includes(symbol.toUpperCase());
    };

    const value = {
        watchlist,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
    };

    return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};
