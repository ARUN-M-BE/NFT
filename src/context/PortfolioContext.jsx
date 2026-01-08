import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import { useToast } from '@chakra-ui/react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within PortfolioProvider');
    }
    return context;
};

export const PortfolioProvider = ({ children }) => {
    const { user } = useAuth();
    const toast = useToast();
    const [holdings, setHoldings] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load portfolio when user logs in
    useEffect(() => {
        if (user) {
            loadPortfolio();
            subscribeToPortfolio();
        } else {
            setHoldings([]);
            setTransactions([]);
            setLoading(false);
        }
    }, [user]);

    const loadPortfolio = async () => {
        try {
            setLoading(true);

            // Load holdings
            const { data: portfolioData, error: portfolioError } = await supabase
                .from('user_portfolio')
                .select('*')
                .eq('user_id', user.id);

            if (portfolioError) throw portfolioError;

            // Load transactions
            const { data: transactionsData, error: transactionsError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (transactionsError) throw transactionsError;

            // Transform data to match existing format
            const transformedHoldings = portfolioData?.map(h => ({
                id: h.id,
                symbol: h.symbol || 'UNKNOWN',
                amount: parseFloat(h.quantity),
                buyPrice: parseFloat(h.average_buy_price),
                buyDate: h.created_at,
            })) || [];

            const transformedTransactions = transactionsData?.map(t => ({
                id: t.id,
                type: t.type,
                symbol: t.symbol || 'UNKNOWN',
                amount: parseFloat(t.quantity),
                price: parseFloat(t.price),
                total: parseFloat(t.total),
                date: t.created_at,
            })) || [];

            setHoldings(transformedHoldings);
            setTransactions(transformedTransactions);
        } catch (error) {
            console.error('Error loading portfolio:', error);
            toast({
                title: 'Error loading portfolio',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const subscribeToPortfolio = () => {
        const portfolioChannel = supabase
            .channel('portfolio_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'user_portfolio',
                filter: `user_id=eq.${user.id}`
            }, () => {
                loadPortfolio();
            })
            .subscribe();

        const transactionsChannel = supabase
            .channel('transactions_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'transactions',
                filter: `user_id=eq.${user.id}`
            }, () => {
                loadPortfolio();
            })
            .subscribe();

        return () => {
            portfolioChannel.unsubscribe();
            transactionsChannel.unsubscribe();
        };
    };

    const addHolding = async (symbol, amount, price) => {
        try {
            // Get or create crypto asset
            const { data: asset } = await supabase
                .from('crypto_assets')
                .select('id')
                .eq('symbol', symbol.toUpperCase())
                .single();

            let assetId = asset?.id;

            if (!assetId) {
                // Create asset if doesn't exist
                const { data: newAsset, error: assetError } = await supabase
                    .from('crypto_assets')
                    .insert({ symbol: symbol.toUpperCase(), name: symbol })
                    .select()
                    .single();

                if (assetError) throw assetError;
                assetId = newAsset.id;
            }

            // Add to portfolio
            const { error: portfolioError } = await supabase
                .from('user_portfolio')
                .upsert({
                    user_id: user.id,
                    asset_id: assetId,
                    symbol: symbol.toUpperCase(),
                    quantity: parseFloat(amount),
                    average_buy_price: parseFloat(price),
                }, {
                    onConflict: 'user_id,asset_id'
                });

            if (portfolioError) throw portfolioError;

            // Add transaction
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    user_id: user.id,
                    asset_id: assetId,
                    symbol: symbol.toUpperCase(),
                    type: 'buy',
                    quantity: parseFloat(amount),
                    price: parseFloat(price),
                    total: parseFloat(amount) * parseFloat(price),
                });

            if (txError) throw txError;

            await loadPortfolio();

            toast({
                title: 'Holding added',
                description: `Added ${amount} ${symbol.toUpperCase()}`,
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error adding holding:', error);
            toast({
                title: 'Error adding holding',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const removeHolding = async (id) => {
        try {
            const holding = holdings.find(h => h.id === id);
            if (!holding) return;

            // Get asset ID
            const { data: asset } = await supabase
                .from('crypto_assets')
                .select('id')
                .eq('symbol', holding.symbol)
                .single();

            if (asset) {
                // Add sell transaction
                await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        asset_id: asset.id,
                        symbol: holding.symbol,
                        type: 'sell',
                        quantity: holding.amount,
                        price: holding.buyPrice,
                        total: holding.amount * holding.buyPrice,
                    });
            }

            // Remove from portfolio
            const { error } = await supabase
                .from('user_portfolio')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await loadPortfolio();

            toast({
                title: 'Holding removed',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error removing holding:', error);
            toast({
                title: 'Error removing holding',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const calculatePortfolioValue = (currentPrices) => {
        if (!currentPrices || holdings.length === 0) return 0;

        return holdings.reduce((total, holding) => {
            const currentPrice = currentPrices.find(p => p.pair === holding.symbol)?.price || holding.buyPrice;
            return total + (holding.amount * parseFloat(currentPrice));
        }, 0);
    };

    const calculateProfitLoss = (currentPrices) => {
        if (!currentPrices || holdings.length === 0) return { amount: 0, percentage: 0 };

        const currentValue = calculatePortfolioValue(currentPrices);
        const investedValue = holdings.reduce((total, holding) => {
            return total + (holding.amount * holding.buyPrice);
        }, 0);

        const amount = currentValue - investedValue;
        const percentage = investedValue > 0 ? (amount / investedValue) * 100 : 0;

        return { amount, percentage };
    };

    const value = {
        holdings,
        transactions,
        loading,
        addHolding,
        removeHolding,
        calculatePortfolioValue,
        calculateProfitLoss,
    };

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};
