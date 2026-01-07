import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';

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
    const [holdings, setHoldings] = useLocalStorage(`portfolio_${user?.id}`, []);
    const [transactions, setTransactions] = useLocalStorage(`transactions_${user?.id}`, []);

    const addHolding = (symbol, amount, price) => {
        const newHolding = {
            id: Date.now().toString(),
            symbol,
            amount: parseFloat(amount),
            buyPrice: parseFloat(price),
            buyDate: new Date().toISOString(),
        };

        setHoldings([...holdings, newHolding]);

        const transaction = {
            id: Date.now().toString(),
            type: 'buy',
            symbol,
            amount: parseFloat(amount),
            price: parseFloat(price),
            total: parseFloat(amount) * parseFloat(price),
            date: new Date().toISOString(),
        };

        setTransactions([transaction, ...transactions]);
    };

    const removeHolding = (id) => {
        const holding = holdings.find(h => h.id === id);
        if (holding) {
            const transaction = {
                id: Date.now().toString(),
                type: 'sell',
                symbol: holding.symbol,
                amount: holding.amount,
                price: holding.buyPrice,
                total: holding.amount * holding.buyPrice,
                date: new Date().toISOString(),
            };
            setTransactions([transaction, ...transactions]);
        }
        setHoldings(holdings.filter(h => h.id !== id));
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
        addHolding,
        removeHolding,
        calculatePortfolioValue,
        calculateProfitLoss,
    };

    return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};
