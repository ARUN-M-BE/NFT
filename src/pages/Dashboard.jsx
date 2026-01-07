import {
    Box,
    Grid,
    Heading,
    Text,
    HStack,
    VStack,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    useColorMode,
    Container,
    SimpleGrid,
    Flex,
    Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { PriceCardSkeleton } from '@/components/Common/SkeletonLoaders';
import { SplineBackground } from '@/components/Common/SplineBackground';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Zap } from 'lucide-react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const PriceCard = ({ pair, price, change, index }) => {
    const isPositive = parseFloat(change) > 0;
    const { colorMode } = useColorMode();

    return (
        <MotionBox
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -4 }}
        >
            <Card hover className="card-hover">
                <VStack align='stretch' spacing={4}>
                    <HStack justify='space-between'>
                        <VStack align='start' spacing={1}>
                            <Text
                                fontSize='xl'
                                fontWeight='800'
                                bgGradient={isPositive ? 'linear(to-r, success.400, success.600)' : 'linear(to-r, danger.400, danger.600)'}
                                bgClip='text'
                            >
                                {pair}
                            </Text>
                            <Text fontSize='xs' color={colorMode === 'dark' ? 'text-tertiary' : 'gray.500'} fontWeight='600'>
                                GEMINI EXCHANGE
                            </Text>
                        </VStack>
                        <PriceBadge change={parseFloat(change)} />
                    </HStack>

                    <Box
                        p={4}
                        borderRadius='xl'
                        bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'}
                        borderWidth='1px'
                        borderColor={isPositive ? 'success.500' : 'danger.500'}
                        position='relative'
                        overflow='hidden'
                    >
                        <Box
                            position='absolute'
                            top={0}
                            left={0}
                            right={0}
                            bottom={0}
                            bgGradient={isPositive ? 'linear(to-br, success.500, transparent)' : 'linear(to-br, danger.500, transparent)'}
                            opacity={0.1}
                        />
                        <VStack align='stretch' spacing={2} position='relative'>
                            <Text fontSize='xs' fontWeight='700' textTransform='uppercase' letterSpacing='wider' color={colorMode === 'dark' ? 'text-secondary' : 'gray.600'}>
                                Current Price
                            </Text>
                            <Text fontSize='3xl' fontWeight='900' color={isPositive ? 'success.500' : 'danger.500'}>
                                {formatCurrency(parseFloat(price))}
                            </Text>
                            <HStack spacing={2}>
                                <Icon as={isPositive ? TrendingUp : TrendingDown} boxSize={4} />
                                <Text fontSize='sm' fontWeight='700'>
                                    {formatPercentage(parseFloat(change))} (24h)
                                </Text>
                            </HStack>
                        </VStack>
                    </Box>
                </VStack>
            </Card>
        </MotionBox>
    );
};

const PremiumStatCard = ({ title, value, subtitle, icon: IconComponent, color, trend }) => {
    const { colorMode } = useColorMode();

    return (
        <MotionBox
            whileHover={{ scale: 1.03, y: -6 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="stat-card">
                <Flex direction='column' h='full'>
                    <HStack justify='space-between' mb={4}>
                        <Box
                            p={3}
                            borderRadius='xl'
                            bgGradient={`linear(to-br, ${color}.400, ${color}.600)`}
                            boxShadow={`0 8px 20px rgba(${color === 'brand' ? '33, 150, 243' : color === 'success' ? '76, 175, 80' : color === 'danger' ? '244, 67, 54' : '156, 39, 176'}, 0.3)`}
                        >
                            <Icon as={IconComponent} boxSize={6} color='white' />
                        </Box>
                        {trend && (
                            <HStack spacing={1} color={trend > 0 ? 'success.500' : 'danger.500'}>
                                <Icon as={trend > 0 ? TrendingUp : TrendingDown} boxSize={4} />
                                <Text fontSize='sm' fontWeight='700'>
                                    {Math.abs(trend)}%
                                </Text>
                            </HStack>
                        )}
                    </HStack>

                    <VStack align='start' spacing={2} flex={1}>
                        <Text
                            fontSize='xs'
                            fontWeight='700'
                            textTransform='uppercase'
                            letterSpacing='wider'
                            color={colorMode === 'dark' ? 'text-secondary' : 'gray.600'}
                        >
                            {title}
                        </Text>
                        <Text fontSize='4xl' fontWeight='900' lineHeight='1'>
                            {value}
                        </Text>
                        {subtitle && (
                            <Text fontSize='sm' color={colorMode === 'dark' ? 'text-tertiary' : 'gray.500'} fontWeight='600'>
                                {subtitle}
                            </Text>
                        )}
                    </VStack>
                </Flex>
            </Card>
        </MotionBox>
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
                <Container maxW='container.2xl' position='relative' zIndex={1}>
                    <VStack spacing={8} align='stretch'>
                        <Box h='200px' />
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                            {[...Array(8)].map((_, i) => (
                                <PriceCardSkeleton key={i} />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxW='container.2xl'>
                <Card>
                    <Text color='danger.500' fontSize='lg' fontWeight='600'>
                        Error loading market data: {error}
                    </Text>
                </Card>
            </Container>
        );
    }

    const topPrices = prices?.slice(0, 8) || [];
    const totalMarkets = prices?.length || 0;
    const gainers = prices?.filter(p => parseFloat(p.percentChange24h) > 0).length || 0;
    const losers = prices?.filter(p => parseFloat(p.percentChange24h) < 0).length || 0;
    const avgChange = prices?.reduce((sum, p) => sum + parseFloat(p.percentChange24h), 0) / totalMarkets || 0;

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            position='relative'
        >
            <SplineBackground />

            <Container maxW='container.2xl' position='relative' zIndex={1}>
                <VStack spacing={10} align='stretch'>
                    {/* Hero Section */}
                    <MotionBox
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        textAlign='center'
                        py={12}
                    >
                        <VStack spacing={4}>
                            <Heading
                                size='3xl'
                                bgGradient='linear(to-r, brand.400, purple.500, brand.600)'
                                bgClip='text'
                                fontWeight='900'
                                letterSpacing='tight'
                            >
                                Market Intelligence
                            </Heading>
                            <Text
                                fontSize='xl'
                                color={colorMode === 'dark' ? 'text-secondary' : 'gray.600'}
                                fontWeight='600'
                                maxW='2xl'
                            >
                                Real-time cryptocurrency market data powered by Gemini Exchange
                            </Text>
                            <HStack spacing={4} pt={4}>
                                <RefreshIndicator
                                    lastUpdated={lastUpdated}
                                    nextUpdate={nextUpdate}
                                    onRefresh={refetch}
                                />
                            </HStack>
                        </VStack>
                    </MotionBox>

                    {/* Premium Stats Grid */}
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
                        <PremiumStatCard
                            title='Total Markets'
                            value={totalMarkets}
                            subtitle='Trading pairs available'
                            icon={Activity}
                            color='brand'
                            trend={5.2}
                        />
                        <PremiumStatCard
                            title='Gainers Today'
                            value={gainers}
                            subtitle='Positive 24h change'
                            icon={TrendingUp}
                            color='success'
                            trend={12.8}
                        />
                        <PremiumStatCard
                            title='Losers Today'
                            value={losers}
                            subtitle='Negative 24h change'
                            icon={TrendingDown}
                            color='danger'
                            trend={-8.4}
                        />
                        <PremiumStatCard
                            title='Market Trend'
                            value={avgChange > 0 ? '+' + avgChange.toFixed(2) + '%' : avgChange.toFixed(2) + '%'}
                            subtitle='Average 24h change'
                            icon={BarChart3}
                            color='purple'
                            trend={avgChange}
                        />
                    </SimpleGrid>

                    {/* Top Markets Section */}
                    <Box>
                        <MotionBox
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            mb={6}
                        >
                            <HStack spacing={3} mb={2}>
                                <Icon as={Zap} boxSize={6} color='brand.500' />
                                <Heading size='xl' fontWeight='800'>
                                    Top Markets
                                </Heading>
                            </HStack>
                            <Text color={colorMode === 'dark' ? 'text-secondary' : 'gray.600'} fontSize='md' fontWeight='600'>
                                Most popular trading pairs with live price updates
                            </Text>
                        </MotionBox>

                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                            {topPrices.map((item, index) => (
                                <PriceCard
                                    key={item.pair}
                                    pair={item.pair}
                                    price={item.price}
                                    change={item.percentChange24h}
                                    index={index}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>
                </VStack>
            </Container>
        </MotionBox>
    );
};
