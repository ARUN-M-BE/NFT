import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Heading, Text, HStack, VStack, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getTickerV2, getOrderBook, getTrades, getCandles } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { formatCurrency, formatNumber, formatTime } from '@/utils/formatters';
import { REFRESH_INTERVALS, TIMEFRAMES } from '@/utils/constants';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MotionBox = motion(Box);

const OrderBookView = ({ symbol }) => {
    const { data: orderBook, loading } = usePolling(
        () => getOrderBook(symbol, 20, 20),
        REFRESH_INTERVALS.ORDER_BOOK
    );

    if (loading && !orderBook) return <LoadingSpinner size='md' />;

    return (
        <Grid templateColumns='repeat(2, 1fr)' gap={4}>
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
                <Text>Time</Text>
            </HStack>
            {trades?.map((trade, i) => (
                <HStack key={i} justify='space-between' fontSize='sm'>
                    <Text color={trade.type === 'buy' ? 'success.light' : 'danger.light'}>
                        {formatCurrency(parseFloat(trade.price))}
                    </Text>
                    <Text color='gray.400'>{formatNumber(parseFloat(trade.amount), 4)}</Text>
                    <Text color='gray.500'>{formatTime(trade.timestamp)}</Text>
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

    const chartData = candles?.slice(-50).map(candle => ({
        time: new Date(candle[0]).toLocaleDateString(),
        price: parseFloat(candle[4]), // close price
        volume: parseFloat(candle[5]),
    })) || [];

    const change = ticker?.changes?.[0] || ticker?.change || 0;

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align='stretch'>
                <Box>
                    <HStack justify='space-between' mb={2}>
                        <Heading size='xl' className='gradient-text'>
                            {symbol.toUpperCase()}
                        </Heading>
                        <PriceBadge change={parseFloat(change)} />
                    </HStack>
                    <HStack spacing={6}>
                        <Box>
                            <Text fontSize='sm' color='gray.400'>Last Price</Text>
                            <Text fontSize='3xl' fontWeight='bold'>
                                {formatCurrency(parseFloat(ticker?.close || ticker?.last || 0))}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize='sm' color='gray.400'>24h High</Text>
                            <Text fontSize='lg' fontWeight='bold' color='success.light'>
                                {formatCurrency(parseFloat(ticker?.high || 0))}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize='sm' color='gray.400'>24h Low</Text>
                            <Text fontSize='lg' fontWeight='bold' color='danger.light'>
                                {formatCurrency(parseFloat(ticker?.low || 0))}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize='sm' color='gray.400'>24h Volume</Text>
                            <Text fontSize='lg' fontWeight='bold'>
                                {formatNumber(parseFloat(ticker?.volume?.[symbol.slice(0, 3)] || 0), 2)}
                            </Text>
                        </Box>
                    </HStack>
                </Box>

                <Card>
                    <HStack justify='space-between' mb={4}>
                        <Heading size='md'>Price Chart</Heading>
                        <Select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            maxW='200px'
                            bg='whiteAlpha.100'
                        >
                            {TIMEFRAMES.map(tf => (
                                <option key={tf.value} value={tf.value}>{tf.label}</option>
                            ))}
                        </Select>
                    </HStack>

                    {candlesLoading && !candles ? (
                        <LoadingSpinner size='md' />
                    ) : (
                        <ResponsiveContainer width='100%' height={400}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id='colorPrice' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor='#1890ff' stopOpacity={0.8} />
                                        <stop offset='95%' stopColor='#1890ff' stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray='3 3' stroke='#434343' />
                                <XAxis dataKey='time' stroke='#8c8c8c' />
                                <YAxis stroke='#8c8c8c' />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #434343' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Area type='monotone' dataKey='price' stroke='#1890ff' fillOpacity={1} fill='url(#colorPrice)' />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </Card>

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
        </MotionBox>
    );
};
