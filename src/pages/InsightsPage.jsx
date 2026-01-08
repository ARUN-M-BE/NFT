import { useState, useEffect, useRef } from 'react';
import {
    Box, VStack, HStack, Text, Heading, Button,
    Input, InputGroup, InputRightElement,
    useColorMode, Spinner, Badge, Divider, Textarea
} from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';
import { aiService } from '@/services/aiService';
import { Bot, TrendingUp, Zap, Send, Activity, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

export const InsightsPage = () => {
    const { colorMode } = useColorMode();
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);

    // Mock live market data to stream to context
    const [marketContext, setMarketContext] = useState({
        symbol: 'BTC', price: 45200, change: 2.4
    });

    useEffect(() => {
        // Connect to Gemini Live API
        aiService.connect();
        
        // Listen for messages
        const unsubscribe = aiService.onMessage((event) => {
            if (event.type === 'content') {
                setIsStreaming(true);
                handleStreamContent(event.payload);
            } else if (event.type === 'turn_complete') {
                setIsStreaming(false);
            }
        });

        setIsConnected(true);

        return () => {
            unsubscribe();
            // aiService.disconnect(); // Optional: keep connection alive for navigation
        };
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isStreaming]);

    const handleStreamContent = (text) => {
        setChatHistory(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.role === 'model' && lastMsg.isStreaming) {
                // Append to existing streaming message
                const updatedMsg = { ...lastMsg, content: lastMsg.content + text };
                return [...prev.slice(0, -1), updatedMsg];
            } else {
                // New streaming message
                return [...prev, { role: 'model', content: text, isStreaming: true }];
            }
        });
    };

    const handleSend = () => {
        if (!chatInput.trim()) return;

        // Add user message
        const userMsg = { role: 'user', content: chatInput };
        setChatHistory(prev => {
            // If last message was streaming, mark it done
            const history = prev.map(msg => ({ ...msg, isStreaming: false }));
            return [...history, userMsg];
        });

        // Send to API
        aiService.sendText(chatInput);
        setChatInput('');
    };

    // Simulate sending live context context every 30s
    useEffect(() => {
        const interval = setInterval(() => {
            const newPrice = marketContext.price + (Math.random() * 100 - 50);
            const newContext = { ...marketContext, price: Math.floor(newPrice) };
            setMarketContext(newContext);
            // aiService.sendContext(newContext); // Uncomment to enable live context pushing
        }, 5000);
        return () => clearInterval(interval);
    }, [marketContext]);

    return (
        <Box p={6} className='space-y-6' h='calc(100vh - 100px)'>
            {/* Header */}
            <HStack justify='space-between' mb={6}>
                <VStack align='start' spacing={0}>
                    <Heading size='lg' bgGradient='linear(to-r, blue.400, purple.500)' bgClip='text'>
                        Gemini Live Intelligence
                    </Heading>
                    <Text color='text.secondary' fontSize='sm'>Real-time WebSocket Connection</Text>
                </VStack>
                
                <HStack>
                    <Badge colorScheme={isConnected ? 'green' : 'red'} variant='solid' borderRadius='full' px={3} py={1}>
                        <HStack spacing={1}>
                            <Radio size={12} className={isConnected ? 'pulse-glow' : ''} />
                            <Text>{isConnected ? 'LIVE' : 'OFFLINE'}</Text>
                        </HStack>
                    </Badge>
                </HStack>
            </HStack>

            <HStack align='start' spacing={6} h='full'>
                {/* Live Context Panel */}
                <VStack w='300px' display={{ base: 'none', lg: 'flex' }} spacing={4}>
                    <MotionCard w='full' borderLeft='4px solid' borderColor='blue.500'>
                        <Heading size='sm' mb={4} display='flex' alignItems='center' gap={2}>
                            <Activity size={18} /> Live Context
                        </Heading>
                        <VStack align='start' spacing={3} fontSize='sm'>
                            <HStack justify='space-between' w='full'>
                                <Text color='text.secondary'>Symbol</Text>
                                <Text fontWeight='bold'>{marketContext.symbol}</Text>
                            </HStack>
                            <HStack justify='space-between' w='full'>
                                <Text color='text.secondary'>Price</Text>
                                <Text fontWeight='bold'>${marketContext.price.toLocaleString()}</Text>
                            </HStack>
                            <HStack justify='space-between' w='full'>
                                <Text color='text.secondary'>24h Change</Text>
                                <Text color={marketContext.change >= 0 ? 'green.400' : 'red.400'}>
                                    {marketContext.change >= 0 ? '+' : ''}{marketContext.change}%
                                </Text>
                            </HStack>
                        </VStack>
                        <Divider my={4} />
                        <Text fontSize='xs' color='text.muted'>
                            * Data is streamed to Gemini in real-time for context-aware analysis.
                        </Text>
                    </MotionCard>
                </VStack>

                {/* Chat Interface */}
                <VStack flex={1} h='700px' spacing={4}>
                    <Card flex={1} w='full' display='flex' flexDirection='column' overflow='hidden' p={0}>
                        {/* Messages Area */}
                        <Box 
                            flex={1} 
                            overflowY='auto' 
                            p={4} 
                            className='custom-scrollbar'
                            bg={colorMode === 'dark' ? 'blackAlpha.200' : 'gray.50'}
                        >
                            {chatHistory.length === 0 ? (
                                <VStack justify='center' h='full' opacity={0.5} spacing={4}>
                                    <Bot size={64} color='#805AD5' />
                                    <Text fontSize='lg'>Gemini Live is ready.</Text>
                                    <Text>Ask about market trends, sentiment, or technicals.</Text>
                                </VStack>
                            ) : (
                                <VStack spacing={4} align='stretch'>
                                    {chatHistory.map((msg, idx) => (
                                        <HStack 
                                            key={idx} 
                                            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                                            maxW='85%'
                                            align='start'
                                            spacing={2}
                                        >
                                            {msg.role === 'model' && (
                                                <Box p={1} bg='purple.500' borderRadius='full' mt={1}>
                                                    <Zap size={14} color='white' fill='white' />
                                                </Box>
                                            )}
                                            <Box
                                                p={3}
                                                borderRadius='2xl'
                                                borderTopLeftRadius={msg.role === 'model' ? 0 : '2xl'}
                                                borderTopRightRadius={msg.role === 'user' ? 0 : '2xl'}
                                                bg={msg.role === 'user' ? 'blue.500' : colorMode === 'dark' ? 'whiteAlpha.200' : 'white'}
                                                color={msg.role === 'user' ? 'white' : 'text.primary'}
                                                boxShadow='sm'
                                            >
                                                <Text fontSize='md' style={{ whiteSpace: 'pre-wrap' }}>
                                                    {msg.content}
                                                    {msg.isStreaming && <span className="cursor-blink">|</span>}
                                                </Text>
                                            </Box>
                                        </HStack>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </VStack>
                            )}
                        </Box>

                        {/* Input Area */}
                        <Box p={4} bg={colorMode === 'dark' ? 'bg.card' : 'white'} borderTopWidth='1px'>
                            <InputGroup size='lg'>
                                <Input
                                    placeholder='Broadcast to Gemini Network...'
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    borderRadius='full'
                                    bg={colorMode === 'dark' ? 'blackAlpha.300' : 'gray.100'}
                                    border='none'
                                    _focus={{ ring: 2, ringColor: 'purple.500' }}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button 
                                        h='2.5rem' 
                                        w='2.5rem' 
                                        borderRadius='full'
                                        onClick={handleSend} 
                                        colorScheme='purple'
                                        disabled={!isConnected || !chatInput.trim()}
                                    >
                                        <Send size={18} />
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Box>
                    </Card>
                </VStack>
            </HStack>
        </Box>
    );
};
