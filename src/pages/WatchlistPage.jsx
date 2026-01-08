import {
    Box,
    Grid,
    Heading,
    Text,
    VStack,
    HStack,
    IconButton,
    Badge,
    useColorMode,
    SimpleGrid,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';
import { usePolling, getAllPrices } from '@/hooks/useGeminiAPI';
import { Card } from '@/components/Common/Card';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

export const WatchlistPage = () => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const { data: prices, lastUpdated, nextUpdate, refetch } = usePolling(getAllPrices, REFRESH_INTERVALS.PRICES);

    const watchlistPrices = prices?.filter(p => watchlist.includes(p.pair)) || [];

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align='stretch'>
                <HStack justify='space-between' flexWrap='wrap' gap={4}>
                    <Box>
                        <HStack>
                            <Star size={32} fill='#faad14' color='#faad14' />
                            <Heading size='xl' className='gradient-text'>Watchlist</Heading>
                        </HStack>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} mt={2}>
                            Your favorite trading pairs at a glance
                        </Text>
                    </Box>

                    <RefreshIndicator lastUpdated={lastUpdated} nextUpdate={nextUpdate} onRefresh={refetch} />
                </HStack>

                {watchlist.length === 0 ? (
                    <Card>
                        <VStack spacing={4} py={12}>
                            <Star size={64} style={{ opacity: 0.2 }} />
                            <Heading size='md' color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}>
                                Your watchlist is empty
                            </Heading>
                            <Text color={colorMode === 'dark' ? 'gray.600' : 'gray.500'}>
                                Click the star icon on any trading pair to add it to your watchlist
                            </Text>
                        </VStack>
                    </Card>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {watchlistPrices.map((item, index) => {
                            const isPositive = parseFloat(item.percentChange24h) > 0;

                            return (
                                <MotionBox
                                    key={item.pair}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card hover>
                                        <VStack align='stretch' spacing={3}>
                                            <HStack justify='space-between'>
                                                <HStack>
                                                    <Text fontSize='xl' fontWeight='bold'>{item.pair}</Text>
                                                    <Badge colorScheme='yellow'>
                                                        <Star size={12} fill='currentColor' />
                                                    </Badge>
                                                </HStack>
                                                <IconButton
                                                    size='sm'
                                                    icon={<X size={16} />}
                                                    variant='ghost'
                                                    colorScheme='red'
                                                    onClick={() => removeFromWatchlist(item.pair)}
                                                />
                                            </HStack>

                                            <Box
                                                cursor='pointer'
                                                onClick={() => navigate(`/trading/${item.pair.toLowerCase()}`)}
                                            >
                                                <HStack justify='space-between' mb={2}>
                                                    <Text fontSize='2xl' fontWeight='bold' color={isPositive ? 'success.500' : 'danger.500'}>
                                                        {formatCurrency(parseFloat(item.price))}
                                                    </Text>
                                                    <PriceBadge change={parseFloat(item.percentChange24h)} />
                                                </HStack>

                                                <HStack spacing={4} fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                                    <HStack>
                                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                        <Text>{formatPercentage(parseFloat(item.percentChange24h))}</Text>
                                                    </HStack>
                                                    <Text>24h</Text>
                                                </HStack>
                                            </Box>
                                        </VStack>
                                    </Card>
                                </MotionBox>
                            );
                        })}
                    </SimpleGrid>
                )}
            </VStack>
        </MotionBox>
    );
};
