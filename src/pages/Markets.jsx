import { useState, useMemo } from 'react';
import { Box, Heading, Text, Input, InputGroup, InputLeftElement, Grid, HStack, VStack, Badge, IconButton, useColorMode } from '@chakra-ui/react';
import { Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePolling } from '@/hooks/useGeminiAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/context/WatchlistContext';
import { getAllPrices } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { formatCurrency } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

const MotionBox = motion(Box);

const MarketRow = ({ pair, price, change, onClick, isInWatchlist, onToggleWatchlist }) => {
    const { colorMode } = useColorMode();
    const isPositive = parseFloat(change) > 0;

    return (
        <Card hover cursor='pointer' position='relative'>
            <Box onClick={onClick}>
                <HStack justify='space-between'>
                    <VStack align='start' spacing={1}>
                        <HStack>
                            <Text fontSize='lg' fontWeight='bold'>{pair}</Text>
                            <IconButton
                                size='xs'
                                icon={<Star size={14} fill={isInWatchlist ? '#faad14' : 'none'} color={isInWatchlist ? '#faad14' : colorMode === 'dark' ? 'gray' : 'gray.600'} />}
                                variant='ghost'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleWatchlist();
                                }}
                                aria-label='Toggle watchlist'
                            />
                        </HStack>
                        <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Gemini</Text>
                    </VStack>

                    <VStack align='end' spacing={1}>
                        <Text fontSize='xl' fontWeight='bold' color={isPositive ? 'success.500' : 'danger.500'}>
                            {formatCurrency(parseFloat(price))}
                        </Text>
                        <PriceBadge change={parseFloat(change)} showIcon={false} />
                    </VStack>
                </HStack>
            </Box>
        </Card>
    );
};

export const Markets = () => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);
    const { isInWatchlist, toggleWatchlist } = useWatchlist();

    const { data: prices, loading, error, lastUpdated, nextUpdate, refetch } = usePolling(
        getAllPrices,
        REFRESH_INTERVALS.PRICES
    );

    const filteredPrices = useMemo(() => {
        if (!prices) return [];
        if (!debouncedSearch) return prices;

        return prices.filter(item =>
            item.pair.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [prices, debouncedSearch]);

    const handleMarketClick = (pair) => {
        navigate(`/trading/${pair.toLowerCase()}`);
    };

    if (loading && !prices) {
        return <LoadingSpinner message='Loading markets...' />;
    }

    if (error) {
        return (
            <Card>
                <Text color='danger.light'>Error loading markets: {error}</Text>
            </Card>
        );
    }

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align='stretch'>
                <HStack justify='space-between' flexWrap='wrap' gap={4}>
                    <Box>
                        <Heading size='xl' mb={2} className='gradient-text'>
                            All Markets
                        </Heading>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>Browse all available trading pairs</Text>
                    </Box>
                    <RefreshIndicator lastUpdated={lastUpdated} nextUpdate={nextUpdate} onRefresh={refetch} />
                </HStack>

                <Card>
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Search size={18} color='gray' />
                        </InputLeftElement>
                        <Input
                            placeholder='Search markets (e.g., BTC, ETH, SOL)...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg='whiteAlpha.100'
                            border='1px solid'
                            borderColor='whiteAlpha.200'
                            _hover={{ borderColor: 'whiteAlpha.300' }}
                            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
                        />
                    </InputGroup>
                </Card>

                <HStack justify='space-between'>
                    <Text color='gray.400'>
                        Showing {filteredPrices.length} of {prices?.length || 0} markets
                    </Text>
                </HStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                    {filteredPrices.map((item, index) => (
                        <MotionBox
                            key={item.pair}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.02 }}
                        >
                            <MarketRow
                                pair={item.pair}
                                price={item.price}
                                change={item.percentChange24h}
                                onClick={() => handleMarketClick(item.pair)}
                                isInWatchlist={isInWatchlist(item.pair)}
                                onToggleWatchlist={() => toggleWatchlist(item.pair)}
                            />
                        </MotionBox>
                    ))}
                </Grid>
            </VStack>
        </MotionBox>
    );
};
