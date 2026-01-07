import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { getWebSocketInstance } from '@/services/websocket';
import { useToast } from '@chakra-ui/react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [prices, setPrices] = useState({});
    const [status, setStatus] = useState('disconnected');
    const [lastUpdate, setLastUpdate] = useState(null);
    const wsRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        // Get WebSocket instance
        wsRef.current = getWebSocketInstance();

        // Status change handler
        const unsubscribeStatus = wsRef.current.onStatusChange((newStatus) => {
            setStatus(newStatus);

            // Show notifications for important status changes
            if (newStatus === 'connected') {
                toast({
                    title: 'Real-time connected',
                    description: 'Live market data streaming active',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom-right',
                });
            } else if (newStatus === 'failed') {
                toast({
                    title: 'Connection failed',
                    description: 'Falling back to polling mode',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-right',
                });
            }
        });

        // Message handler
        const unsubscribeMessage = wsRef.current.onMessage((data) => {
            if (data.type === 'update' && data.symbol) {
                setPrices(prev => ({
                    ...prev,
                    [data.symbol]: {
                        price: data.price,
                        change: data.change,
                        timestamp: Date.now(),
                    },
                }));
                setLastUpdate(Date.now());
            }
        });

        // Connect
        wsRef.current.connect();

        // Cleanup
        return () => {
            unsubscribeStatus();
            unsubscribeMessage();
            // Don't disconnect on unmount to maintain connection across route changes
        };
    }, [toast]);

    const subscribeToPair = (symbol) => {
        if (wsRef.current) {
            wsRef.current.subscribe(symbol, (data) => {
                setPrices(prev => ({
                    ...prev,
                    [symbol]: {
                        price: data.price,
                        change: data.change,
                        timestamp: Date.now(),
                    },
                }));
            });
        }
    };

    const unsubscribeFromPair = (symbol) => {
        if (wsRef.current) {
            wsRef.current.unsubscribe(symbol);
        }
    };

    const reconnect = () => {
        if (wsRef.current) {
            wsRef.current.disconnect();
            setTimeout(() => {
                wsRef.current.connect();
            }, 1000);
        }
    };

    const value = {
        prices,
        status,
        lastUpdate,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        subscribeToPair,
        unsubscribeFromPair,
        reconnect,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
