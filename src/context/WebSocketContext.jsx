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
        try {
            // Get WebSocket instance
            const ws = getWebSocketInstance();
            wsRef.current = ws;

            if (!ws) {
                console.error('Failed to initialize WebSocket instance');
                setStatus('failed');
                return;
            }

            // Status change handler
            const unsubscribeStatus = ws.onStatusChange((newStatus) => {
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
                    // Specific toast for failure
                    console.log('WebSocket connection failed - falling back to API');
                }
            });

            // Message handler
            const unsubscribeMessage = ws.onMessage((data) => {
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
            ws.connect();

            // Cleanup
            return () => {
                if (unsubscribeStatus) unsubscribeStatus();
                if (unsubscribeMessage) unsubscribeMessage();
                // Don't disconnect on unmount to maintain connection across route changes
            };
        } catch (error) {
            console.error('WebSocket Context Error:', error);
            setStatus('failed');
        }
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
