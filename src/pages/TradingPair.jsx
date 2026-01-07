import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Heading, Text, HStack, VStack, Select, Tabs, TabList, TabPanels, Tab, TabPanel, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getTickerV2, getOrderBook, getTrades, getCandles } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { TradingViewChart } from '@/components/Trading/TradingViewChart';
import { formatCurrency, formatNumber, formatTime } from '@/utils/formatters';
import { REFRESH_INTERVALS, TIMEFRAMES } from '@/utils/constants';

const MotionBox = motion(Box);

const OrderBookView = ({ symbol }) => {
    const { data: orderBook, loading } = usePolling(
        () => getOrderBook(symbol, 20, 20),
        REFRESH_INTERVALS.ORDER_BOOK
    );

    if (loading && !orderBook) return <LoadingSpinner size='md' />;

    return (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <Box>
                <Text fontSize='sm' fontWeight='bold' color='success.light' mb={2}>Bids</Text>
                <VStack spacing={1} align='stretch'>
                    {orderBook?.bids?.slice(0, 10).map((bid, i) => (
                        <HStack key={i} justify='space-between' fontSize='sm'>
                            <Text color='success.light'>{formatCurrency(parseFloat(bid.price))}</Text>
                            <Text color='gray.400'>{formatNumber(parseFloat(bid.amount), 4)}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>

            <Box>
                <Text fontSize='sm' fontWeight='bold' color='danger.light' mb={2}>Asks</Text>
                <VStack spacing={1} align='stretch'>
                    {orderBook?.asks?.slice(0, 10).map((ask, i) => (
                        <HStack key={i} justify='space-between' fontSize='sm'>
                            <Text color='danger.light'>{formatCurrency(parseFloat(ask.price))}</Text>
                            <Text color='gray.400'>{formatNumber(parseFloat(ask.amount), 4)}</Text>
                        </HStack>
                    ))}
                </VStack>
            </Box>
        </Grid>
    );
};

const TradesView = ({ symbol }) => {
    const { data: trades, loading } = usePolling(
        () => getTrades(symbol, null, 20),
        REFRESH_INTERVALS.TRADES
    );

    if (loading && !trades) return <LoadingSpinner size='md' />;

    return (
        <VStack spacing={2} align='stretch'>
            <HStack justify='space-between' fontSize='sm' fontWeight='bold' color='gray.400' pb={2}>
                <Text>Price</Text>
                <Text>Amount</Text>
                <Text display={{ base: 'none', md: 'block' }}>Time</Text>
            </HStack>
            {trades?.map((trade, i) => (
                <HStack key={i} justify='space-between' fontSize='sm'>
                    <Text color={trade.type === 'buy' ? 'success.light' : 'danger.light'}>
                        {formatCurrency(parseFloat(trade.price))}
                    </Text>
                    <Text color='gray.400'>{formatNumber(parseFloat(trade.amount), 4)}</Text>
                    <Text color='gray.500' display={{ base: 'none', md: 'block' }}>{formatTime(trade.timestamp)}</Text>
                </HStack>
            ))}
        </VStack>
    );
};

export const TradingPair = () => {
    const { symbol = 'btcusd' } = useParams();
    const [timeframe, setTimeframe] = useState('1day');

    const { data: ticker, loading: tickerLoading } = usePolling(
        () => getTickerV2(symbol),
        REFRESH_INTERVALS.TICKER
    );

    const { data: candles, loading: candlesLoading } = usePolling(
        () => getCandles(symbol, timeframe),
        REFRESH_INTERVALS.CANDLES
    );

    if (tickerLoading && !ticker) {
        return <LoadingSpinner message='Loading trading data...' />;
    }

    // Format candles for TradingView chart
    const chartData = candles?.map(candle => ({
        time: candle[0], // timestamp
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
    })) || [];

    const change = ticker?.changes?.[0] || ticker?.change || 0;

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxW='container.2xl'>
                <VStack spacing={6} align='stretch'>
                    <Box>
                        <HStack justify='space-between' mb={2} flexWrap='wrap' gap={2}>
                            <Heading size={{ base: 'lg', md: 'xl' }} className='gradient-text'>
                                {symbol.toUpperCase()}
                            </Heading>
                            <PriceBadge change={parseFloat(change)} />
                        </HStack>
                        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4}>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>Last Price</Text>
                                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
                                    {formatCurrency(parseFloat(ticker?.close || ticker?.last || 0))}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>24h High</Text>
                                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold' color='success.light'>
                                    {formatCurrency(parseFloat(ticker?.high || 0))}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>24h Low</Text>
                                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold' color='danger.light'>
                                    {formatCurrency(parseFloat(ticker?.low || 0))}
                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>24h Volume</Text>
                                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
                                    {formatNumber(parseFloat(ticker?.volume?.[symbol.slice(0, 3)] || 0), 2)}
                                </Text>
                            </Box>
                        </Grid>
                    </Box>

                    {/* TradingView Chart */}
                    {candlesLoading && !candles ? (
                        <Card>
                            <LoadingSpinner size='lg' message='Loading chart...' />
                        </Card>
                    ) : (
                        <TradingViewChart symbol={symbol.toUpperCase()} data={chartData} />
                    )}

                    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                        <Card>
                            <Heading size='md' mb={4}>Order Book</Heading>
                            <OrderBookView symbol={symbol} />
                        </Card>

                        <Card>
                            <Heading size='md' mb={4}>Recent Trades</Heading>
                            <TradesView symbol={symbol} />
                        </Card>
                    </Grid>
                </VStack>
            </Container>
        </MotionBox>
    );
};
