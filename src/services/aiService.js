import { GOOGLE_API_KEY } from '@/config/api';

/**
 * Gemini Live API Service (WebSocket)
 * Handles real-time, bidirectional communication with Google's Gemini Live API.
 */
class GeminiWebSocketService {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.messageHandlers = new Set();
        this.baseUrl = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';
        this.model = 'models/gemini-2.0-flash-exp'; // Live API model
    }

    /**
     * Connect to the WebSocket
     */
    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const url = `${this.baseUrl}?key=${GOOGLE_API_KEY}`;
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
            console.log('✅ Gemini Live API Connected');
            this.isConnected = true;
            this.setupSession();
        };

        this.ws.onmessage = (event) => {
            try {
                // The API can send passing Blobs or text
                if (event.data instanceof Blob) {
                    this.handleBlobMessage(event.data);
                } else {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                }
            } catch (error) {
                console.error('Error parsing Gemini message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`🔌 Gemini Live API Disconnected: Code ${event.code}`);
            this.isConnected = false;
        };

        this.ws.onerror = (error) => {
            console.error('❌ Gemini WebSocket Error:', error);
        };
    }

    /**
     * Initialize the session with configuration
     */
    setupSession() {
        const setupMessage = {
            setup: {
                model: this.model,
                generation_config: {
                    temperature: 0.7,
                    max_output_tokens: 1024,
                    response_modalities: ["TEXT"]
                },
                system_instruction: {
                    parts: [{
                        text: "You are a professional crypto market analyst AI. You receive real-time market data and user queries. Provide concise, insightful technical analysis and sentiment breakdown. Be professional but conversational."
                    }]
                }
            }
        };
        this.send(setupMessage);
    }

    /**
     * Handle incoming parsed JSON messages
     */
    handleMessage(data) {
        // Handle Server Content (The actual response text)
        if (data.serverContent?.modelTurn) {
            const parts = data.serverContent.modelTurn.parts;
            if (parts && parts.length > 0) {
                const text = parts.map(p => p.text).join('');
                this.notifyHandlers('content', text);
            }
        }

        // Handle Tool Calls (if we add them later)
        // Handle Turn Complete
        if (data.serverContent?.turnComplete) {
            this.notifyHandlers('turn_complete', null);
        }
    }

    async handleBlobMessage(blob) {
        const text = await blob.text();
        try {
            const data = JSON.parse(text);
            this.handleMessage(data);
        } catch (e) {
            console.error('Error handling blob:', e);
        }
    }

    /**
     * Send text input to the model
     */
    sendText(text) {
        if (!this.isConnected) {
            this.connect();
            // Simple retry logic could be added here, currently relies on UI to wait
            console.warn('Socket not connected, attempting to connect...');
            // Queueing implementing is skipped for brevity in this step
        }

        const message = {
            client_content: {
                turns: [{
                    role: "user",
                    parts: [{ text: text }]
                }],
                turn_complete: true
            }
        };
        this.send(message);
    }

    /**
     * Send Real-time Market Context (as system notifications or "user" context)
     * For Live API, we can feed this as a user turn or tool response.
     * Sending as a user update for context.
     */
    sendContext(contextData) {
        // We send this as a "user" role message to update the context window
        // but with turn_complete=true so the model can process it (or acknowledge it)
        // Ideally, we'd use a tool_response if the model asked for it, but for pushing:
        if (!this.isConnected) return;

        const message = {
            client_content: {
                turns: [{
                    role: "user",
                    parts: [{ text: `[SYSTEM UPDATE] Market Context: ${JSON.stringify(contextData)}` }]
                }],
                turn_complete: true
            }
        };
        this.send(message);
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('Cannot send: WebSocket is not open');
        }
    }

    onMessage(callback) {
        this.messageHandlers.add(callback);
        return () => this.messageHandlers.delete(callback);
    }

    notifyHandlers(type, payload) {
        this.messageHandlers.forEach(handler => handler({ type, payload }));
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Singleton export
export const aiService = new GeminiWebSocketService();
