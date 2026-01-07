import { Box, Grid, Heading, Text, HStack, VStack, Stat, StatLabel, StatNumber, StatHelpText, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { PriceCardSkeleton } from '@/components/Common/SkeletonLoaders';
import { SplineBackground } from '@/components/Common/SplineBackground';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const MotionBox = motion(Box);

const PriceCard = ({ pair, price, change }) => {
    const isPositive = parseFloat(change) > 0;
    const { colorMode } = useColorMode();

    return (
        <Card hover>
            <VStack align='stretch' spacing={3}>
                <HStack justify='space-between'>
                    <Text
                        fontSize='lg'
                        fontWeight='bold'
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {pair}
                    </Text>
                    <PriceBadge change={parseFloat(change)} />
                </HStack>

                <Stat>
                    <StatLabel color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                        Current Price
                    </StatLabel>
                    <StatNumber fontSize='2xl' color={isPositive ? 'success.500' : 'danger.500'}>
                        {formatCurrency(parseFloat(price))}
                    </StatNumber>
                    <StatHelpText>
                        <HStack spacing={1}>
                            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <Text>{formatPercentage(parseFloat(change))}</Text>
                        </HStack>
                    </StatHelpText>
                </Stat>
            </VStack>
        </Card>
    );
};

const StatsCard = ({ title, value, icon: Icon, color }) => {
    const { colorMode } = useColorMode();

    return (
        <Card>
            <HStack spacing={4}>
                <Box
                    p={3}
                    borderRadius='lg'
                    bg={`${color}.500`}
                    color='white'
                    className='pulse-glow'
                >
                    <Icon size={24} />
                </Box>
                <VStack align='start' spacing={0}>
                    <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                        {title}
                    </Text>
                    <Text fontSize='2xl' fontWeight='bold'>
                        {value}
                    </Text>
                </VStack>
            </HStack>
        </Card>
    );
};

export const Dashboard = () => {
    const { colorMode } = useColorMode();
    const { data: prices, loading, error, refetch, lastUpdated, nextUpdate } = usePolling(
        getAllPrices,
        REFRESH_INTERVALS.PRICES
    );

    if (loading && !prices) {
        return (
            <Box position='relative'>
                <SplineBackground />
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={6}>
                    {[...Array(8)].map((_, i) => (
                        <PriceCardSkeleton key={i} />
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return (
            <Card>
                <Text color='danger.500'>Error loading market data: {error}</Text>
            </Card>
        );
    }

    const topPrices = prices?.slice(0, 8) || [];
    const totalMarkets = prices?.length || 0;
    const gainers = prices?.filter(p => parseFloat(p.percentChange24h) > 0).length || 0;
    const losers = prices?.filter(p => parseFloat(p.percentChange24h) < 0).length || 0;

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            position='relative'
        >
            <SplineBackground />

            <VStack spacing={6} align='stretch' position='relative' zIndex={1}>
                <HStack justify='space-between' flexWrap='wrap' gap={4}>
                    <Box>
                        <Heading size='xl' mb={2} className='gradient-text'>
                            Market Overview
                        </Heading>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                            Real-time cryptocurrency market data from Gemini Exchange
                        </Text>
                    </Box>

                    <RefreshIndicator
                        lastUpdated={lastUpdated}
                        nextUpdate={nextUpdate}
                        onRefresh={refetch}
                    />
                </HStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                    <StatsCard
                        title='Total Markets'
                        value={totalMarkets}
                        icon={Activity}
                        color='brand'
                    />
                    <StatsCard
                        title='Gainers'
                        value={gainers}
                        icon={TrendingUp}
                        color='success'
                    />
                    <StatsCard
                        title='Losers'
                        value={losers}
                        icon={TrendingDown}
                        color='danger'
                    />
                    <StatsCard
                        title='Auto-Refresh'
                        value='1 min'
                        icon={DollarSign}
                        color='purple'
                    />
                </Grid>

                <Box>
                    <Heading size='md' mb={4}>Top Markets</Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                        {topPrices.map((item, index) => (
                            <MotionBox
                                key={item.pair}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <PriceCard
                                    pair={item.pair}
                                    price={item.price}
                                    change={item.percentChange24h}
                                />
                            </MotionBox>
                        ))}
                    </Grid>
                </Box>
            </VStack>
        </MotionBox>
    );
};
