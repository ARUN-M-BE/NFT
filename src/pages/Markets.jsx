import { useState, useMemo } from 'react';
import { Box, Heading, Text, Input, InputGroup, InputLeftElement, Grid, HStack, VStack, Badge } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePolling } from '@/hooks/useGeminiAPI';
import { useDebounce } from '@/hooks/useDebounce';
import { getAllPrices } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';
import { PriceBadge } from '@/components/Common/PriceBadge';
import { formatCurrency } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

const MotionBox = motion(Box);

const MarketRow = ({ pair, price, change, onClick }) => {
    const isPositive = parseFloat(change) > 0;

    return (
        <Card hover onClick={onClick} cursor='pointer'>
            <HStack justify='space-between'>
                <VStack align='start' spacing={1}>
                    <Text fontSize='lg' fontWeight='bold'>{pair}</Text>
                    <Text fontSize='sm' color='gray.400'>Gemini</Text>
                </VStack>

                <VStack align='end' spacing={1}>
                    <Text fontSize='xl' fontWeight='bold' color={isPositive ? 'success.light' : 'danger.light'}>
                        {formatCurrency(parseFloat(price))}
                    </Text>
                    <PriceBadge change={parseFloat(change)} showIcon={false} />
                </VStack>
            </HStack>
        </Card>
    );
};

export const Markets = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);

    const { data: prices, loading, error } = usePolling(
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
                <Box>
                    <Heading size='xl' mb={2} className='gradient-text'>
                        All Markets
                    </Heading>
                    <Text color='gray.400'>Browse all available trading pairs</Text>
                </Box>

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
                            />
                        </MotionBox>
                    ))}
                </Grid>
            </VStack>
        </MotionBox>
    );
};
