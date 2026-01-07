import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { useToast } from '@chakra-ui/react';

const AlertsContext = createContext();

export const useAlerts = () => {
    const context = useContext(AlertsContext);
    if (!context) {
        throw new Error('useAlerts must be used within AlertsProvider');
    }
    return context;
};

export const AlertsProvider = ({ children }) => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useLocalStorage(`alerts_${user?.id}`, []);
    const [triggeredAlerts, setTriggeredAlerts] = useLocalStorage(`triggered_alerts_${user?.id}`, []);
    const toast = useToast();

    const createAlert = (symbol, condition, targetPrice, message) => {
        const newAlert = {
            id: Date.now().toString(),
            symbol,
            condition, // 'above' or 'below'
            targetPrice: parseFloat(targetPrice),
            message,
            createdAt: new Date().toISOString(),
            active: true,
        };
        setAlerts([...alerts, newAlert]);
        return newAlert;
    };

    const deleteAlert = (id) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    const toggleAlert = (id) => {
        setAlerts(alerts.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
        ));
    };

    const checkAlerts = (currentPrices) => {
        if (!currentPrices || alerts.length === 0) return;

        alerts.forEach(alert => {
            if (!alert.active) return;

            const price = currentPrices.find(p => p.pair === alert.symbol);
            if (!price) return;

            const currentPrice = parseFloat(price.price);
            let triggered = false;

            if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
                triggered = true;
            } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
                triggered = true;
            }

            if (triggered && !triggeredAlerts.includes(alert.id)) {
                // Show notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Price Alert Triggered!', {
                        body: alert.message || `${alert.symbol} is now ${alert.condition} ${alert.targetPrice}`,
                        icon: '/favicon.ico',
                    });
                }

                // Show toast
                toast({
                    title: 'Price Alert!',
                    description: alert.message || `${alert.symbol} is now ${alert.condition} ${alert.targetPrice}`,
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    position: 'top-right',
                });

                // Mark as triggered
                setTriggeredAlerts([...triggeredAlerts, alert.id]);

                // Deactivate alert
                toggleAlert(alert.id);
            }
        });
    };

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const value = {
        alerts,
        triggeredAlerts,
        createAlert,
        deleteAlert,
        toggleAlert,
        checkAlerts,
    };

    return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
};
