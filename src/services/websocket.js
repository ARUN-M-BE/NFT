/**
 * Gemini WebSocket Service
 * Provides real-time market data streaming with auto-reconnect
 */

class GeminiWebSocket {
    constructor() {
        this.ws = null;
        this.subscriptions = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
        this.messageHandlers = [];
        this.statusHandlers = [];
    }

    connect() {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        this.isConnecting = true;
        this.notifyStatus('connecting');

        try {
            // Gemini WebSocket endpoint for market data
            this.ws = new WebSocket('wss://api.gemini.com/v1/marketdata');

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.notifyStatus('connected');

                // Resubscribe to all previous subscriptions
                this.resubscribeAll();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.notifyStatus('error');
            };

            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.isConnecting = false;
                this.notifyStatus('disconnected');
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.isConnecting = false;
            this.notifyStatus('error');
            this.attemptReconnect();
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.subscriptions.clear();
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }

    subscribe(symbol, callback) {
        // Store subscription
        if (!this.subscriptions.has(symbol)) {
            this.subscriptions.set(symbol, []);
        }
        this.subscriptions.get(symbol).push(callback);

        // Send subscription message if connected
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = {
                type: 'subscribe',
                subscriptions: [
                    {
                        name: 'l2',
                        symbols: [symbol],
                    },
                ],
            };
            this.ws.send(JSON.stringify(message));
        }
    }

    unsubscribe(symbol, callback) {
        const callbacks = this.subscriptions.get(symbol);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                this.subscriptions.delete(symbol);
            }
        }
    }

    resubscribeAll() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            return;
        }

        const symbols = Array.from(this.subscriptions.keys());
        if (symbols.length === 0) {
            return;
        }

        const message = {
            type: 'subscribe',
            subscriptions: symbols.map(symbol => ({
                name: 'l2',
                symbols: [symbol],
            })),
        };

        this.ws.send(JSON.stringify(message));
    }

    handleMessage(data) {
        if (data.type === 'update' && data.symbol) {
            const callbacks = this.subscriptions.get(data.symbol);
            if (callbacks) {
                callbacks.forEach(callback => callback(data));
            }
        }

        // Notify all message handlers
        this.messageHandlers.forEach(handler => handler(data));
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('❌ Max reconnect attempts reached');
            this.notifyStatus('failed');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect();
        }, delay);
    }

    onMessage(handler) {
        this.messageHandlers.push(handler);
        return () => {
            const index = this.messageHandlers.indexOf(handler);
            if (index > -1) {
                this.messageHandlers.splice(index, 1);
            }
        };
    }

    onStatusChange(handler) {
        this.statusHandlers.push(handler);
        return () => {
            const index = this.statusHandlers.indexOf(handler);
            if (index > -1) {
                this.statusHandlers.splice(index, 1);
            }
        };
    }

    notifyStatus(status) {
        this.statusHandlers.forEach(handler => handler(status));
    }

    getStatus() {
        if (!this.ws) return 'disconnected';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
                return 'disconnecting';
            case WebSocket.CLOSED:
                return 'disconnected';
            default:
                return 'unknown';
        }
    }
}

// Singleton instance
let wsInstance = null;

export const getWebSocketInstance = () => {
    if (!wsInstance) {
        wsInstance = new GeminiWebSocket();
    }
    return wsInstance;
};

export default GeminiWebSocket;
