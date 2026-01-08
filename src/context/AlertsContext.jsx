import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
    const [alerts, setAlerts] = useState([]);
    const [triggeredAlerts, setTriggeredAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        if (user) {
            loadAlerts();
            subscribeToAlerts();
        } else {
            setAlerts([]);
            setTriggeredAlerts([]);
            setLoading(false);
        }
    }, [user]);

    const loadAlerts = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('price_alerts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const transformedAlerts = data?.map(a => ({
                id: a.id,
                symbol: a.symbol || 'UNKNOWN',
                condition: a.condition,
                targetPrice: parseFloat(a.target_price),
                message: a.message,
                createdAt: a.created_at,
                active: a.is_active,
                triggeredAt: a.triggered_at,
            })) || [];

            setAlerts(transformedAlerts);
            setTriggeredAlerts(transformedAlerts.filter(a => a.triggeredAt).map(a => a.id));
        } catch (error) {
            console.error('Error loading alerts:', error);
            toast({
                title: 'Error loading alerts',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const subscribeToAlerts = () => {
        const channel = supabase
            .channel('alerts_changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'price_alerts',
                filter: `user_id=eq.${user.id}`
            }, () => {
                loadAlerts();
            })
            .subscribe();

        return () => channel.unsubscribe();
    };

    const createAlert = async (symbol, condition, targetPrice, message) => {
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

            // Create alert
            const { error } = await supabase
                .from('price_alerts')
                .insert({
                    user_id: user.id,
                    asset_id: assetId,
                    symbol: symbol.toUpperCase(),
                    target_price: parseFloat(targetPrice),
                    condition,
                    message,
                    is_active: true,
                });

            if (error) throw error;

            await loadAlerts();

            toast({
                title: 'Alert created',
                description: `Alert set for ${symbol.toUpperCase()}`,
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error creating alert:', error);
            toast({
                title: 'Error creating alert',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const deleteAlert = async (id) => {
        try {
            const { error } = await supabase
                .from('price_alerts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await loadAlerts();

            toast({
                title: 'Alert deleted',
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Error deleting alert:', error);
            toast({
                title: 'Error deleting alert',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const toggleAlert = async (id) => {
        try {
            const alert = alerts.find(a => a.id === id);
            if (!alert) return;

            const { error } = await supabase
                .from('price_alerts')
                .update({ is_active: !alert.active })
                .eq('id', id);

            if (error) throw error;

            await loadAlerts();
        } catch (error) {
            console.error('Error toggling alert:', error);
            toast({
                title: 'Error toggling alert',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const checkAlerts = (currentPrices) => {
        if (!currentPrices || alerts.length === 0) return;

        alerts.forEach(alert => {
            if (!alert.active || alert.triggeredAt) return;

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

                // Mark as triggered in database
                supabase
                    .from('price_alerts')
                    .update({
                        is_active: false,
                        triggered_at: new Date().toISOString()
                    })
                    .eq('id', alert.id)
                    .then(() => loadAlerts());

                setTriggeredAlerts([...triggeredAlerts, alert.id]);
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
        loading,
        createAlert,
        deleteAlert,
        toggleAlert,
        checkAlerts,
    };

    return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
};
