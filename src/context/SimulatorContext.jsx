import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const SimulatorContext = createContext();

export const useSimulator = () => {
    const context = useContext(SimulatorContext);
    if (!context) {
        throw new Error('useSimulator must be used within SimulatorProvider');
    }
    return context;
};

const INITIAL_BALANCE = 100000; // $100,000 virtual USD

export const SimulatorProvider = ({ children }) => {
    const { user } = useAuth();
    const [balance, setBalance] = useLocalStorage(`sim_balance_${user?.id}`, INITIAL_BALANCE);
    const [positions, setPositions] = useLocalStorage(`sim_positions_${user?.id}`, []);
    const [tradeHistory, setTradeHistory] = useLocalStorage(`sim_history_${user?.id}`, []);

    const buyAsset = (symbol, amount, price) => {
        const cost = amount * price;

        if (cost > balance) {
            throw new Error('Insufficient balance');
        }

        const newPosition = {
            id: Date.now().toString(),
            symbol,
            amount: parseFloat(amount),
            entryPrice: parseFloat(price),
            entryDate: new Date().toISOString(),
            type: 'long',
        };

        setPositions([...positions, newPosition]);
        setBalance(balance - cost);

        const trade = {
            id: Date.now().toString(),
            type: 'buy',
            symbol,
            amount: parseFloat(amount),
            price: parseFloat(price),
            total: cost,
            date: new Date().toISOString(),
        };

        setTradeHistory([trade, ...tradeHistory]);
    };

    const sellAsset = (positionId, currentPrice) => {
        const position = positions.find(p => p.id === positionId);
        if (!position) return;

        const revenue = position.amount * currentPrice;
        const profit = revenue - (position.amount * position.entryPrice);

        setBalance(balance + revenue);
        setPositions(positions.filter(p => p.id !== positionId));

        const trade = {
            id: Date.now().toString(),
            type: 'sell',
            symbol: position.symbol,
            amount: position.amount,
            price: currentPrice,
            total: revenue,
            profit,
            profitPercentage: (profit / (position.amount * position.entryPrice)) * 100,
            date: new Date().toISOString(),
        };

        setTradeHistory([trade, ...tradeHistory]);
    };

    const calculatePortfolioValue = (currentPrices) => {
        if (!currentPrices || positions.length === 0) return balance;

        const positionsValue = positions.reduce((total, position) => {
            const currentPrice = currentPrices.find(p => p.pair === position.symbol)?.price || position.entryPrice;
            return total + (position.amount * parseFloat(currentPrice));
        }, 0);

        return balance + positionsValue;
    };

    const calculateProfitLoss = (currentPrices) => {
        const currentValue = calculatePortfolioValue(currentPrices);
        const profit = currentValue - INITIAL_BALANCE;
        const percentage = (profit / INITIAL_BALANCE) * 100;

        return { profit, percentage };
    };

    const resetSimulator = () => {
        setBalance(INITIAL_BALANCE);
        setPositions([]);
        setTradeHistory([]);
    };

    const value = {
        balance,
        positions,
        tradeHistory,
        initialBalance: INITIAL_BALANCE,
        buyAsset,
        sellAsset,
        calculatePortfolioValue,
        calculateProfitLoss,
        resetSimulator,
    };

    return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
};
