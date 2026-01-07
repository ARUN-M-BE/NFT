import {
    Box,
    Grid,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Badge,
    useColorMode,
    useToast,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, TrendingUp, DollarSign, Activity, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useSimulator } from '@/context/SimulatorContext';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { Card } from '@/components/Common/Card';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { formatCurrency, formatPercentage, formatDateTime } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

const MotionBox = motion(Box);

export const SimulatorPage = () => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: onBuyClose } = useDisclosure();
    const {
        balance,
        positions,
        tradeHistory,
        initialBalance,
        buyAsset,
        sellAsset,
        calculatePortfolioValue,
        calculateProfitLoss,
        resetSimulator,
    } = useSimulator();
    const { data: prices, lastUpdated, nextUpdate, refetch } = usePolling(getAllPrices, REFRESH_INTERVALS.PRICES);

    const [buyForm, setBuyForm] = useState({ symbol: '', amount: '', price: '' });

    const portfolioValue = calculatePortfolioValue(prices);
    const { profit, percentage } = calculateProfitLoss(prices);

    const handleBuy = () => {
        if (!buyForm.symbol || !buyForm.amount || !buyForm.price) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        try {
            buyAsset(buyForm.symbol.toUpperCase(), buyForm.amount, buyForm.price);
            setBuyForm({ symbol: '', amount: '', price: '' });
            onBuyClose();

            toast({
                title: 'Order executed',
                description: `Bought ${buyForm.amount} ${buyForm.symbol.toUpperCase()}`,
                status: 'success',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Order failed',
                description: error.message,
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleSell = (positionId) => {
        const position = positions.find(p => p.id === positionId);
        if (!position) return;

        const currentPrice = prices?.find(p => p.pair === position.symbol)?.price || position.entryPrice;
        sellAsset(positionId, parseFloat(currentPrice));

        toast({
            title: 'Position closed',
            description: `Sold ${position.amount} ${position.symbol}`,
            status: 'success',
            duration: 3000,
        });
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the simulator? All positions and history will be cleared.')) {
            resetSimulator();
            toast({
                title: 'Simulator reset',
                description: `Balance reset to ${formatCurrency(initialBalance)}`,
                status: 'info',
                duration: 3000,
            });
        }
    };

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
                            <Play size={32} className='pulse-glow' />
                            <Heading size='xl' className='gradient-text'>Trading Simulator</Heading>
                        </HStack>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} mt={2}>
                            Practice trading with virtual money
                        </Text>
                    </Box>

                    <HStack>
                        <RefreshIndicator lastUpdated={lastUpdated} nextUpdate={nextUpdate} onRefresh={refetch} />
                        <Button leftIcon={<RotateCcw size={20} />} variant='outline' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button leftIcon={<ShoppingCart size={20} />} colorScheme='brand' onClick={onBuyOpen}>
                            Buy
                        </Button>
                    </HStack>
                </HStack>

                <Alert status='info' borderRadius='lg'>
                    <AlertIcon />
                    This is a simulation. No real money is involved. Start with {formatCurrency(initialBalance)} virtual USD.
                </Alert>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                    <Card>
                        <Stat>
                            <StatLabel>Available Balance</StatLabel>
                            <StatNumber fontSize='2xl'>{formatCurrency(balance)}</StatNumber>
                            <StatHelpText>Cash available to trade</StatHelpText>
                        </Stat>
                    </Card>

                    <Card>
                        <Stat>
                            <StatLabel>Portfolio Value</StatLabel>
                            <StatNumber fontSize='2xl'>{formatCurrency(portfolioValue)}</StatNumber>
                            <StatHelpText>{positions.length} open positions</StatHelpText>
                        </Stat>
                    </Card>

                    <Card>
                        <Stat>
                            <StatLabel>Total P&L</StatLabel>
                            <StatNumber fontSize='2xl' color={profit >= 0 ? 'success.500' : 'danger.500'}>
                                {formatCurrency(profit)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type={profit >= 0 ? 'increase' : 'decrease'} />
                                {formatPercentage(percentage)}
                            </StatHelpText>
                        </Stat>
                    </Card>

                    <Card>
                        <Stat>
                            <StatLabel>Total Trades</StatLabel>
                            <StatNumber fontSize='2xl'>{tradeHistory.length}</StatNumber>
                            <StatHelpText>All time</StatHelpText>
                        </Stat>
                    </Card>
                </Grid>

                <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                    <Card>
                        <Heading size='md' mb={4}>Open Positions</Heading>
                        <Box overflowX='auto'>
                            <Table variant='simple' size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th>Symbol</Th>
                                        <Th isNumeric>Amount</Th>
                                        <Th isNumeric>Entry</Th>
                                        <Th isNumeric>Current</Th>
                                        <Th isNumeric>P&L</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {positions.map((position) => {
                                        const currentPrice = prices?.find(p => p.pair === position.symbol)?.price || position.entryPrice;
                                        const value = position.amount * parseFloat(currentPrice);
                                        const pl = value - (position.amount * position.entryPrice);
                                        const plPercent = (pl / (position.amount * position.entryPrice)) * 100;

                                        return (
                                            <Tr key={position.id}>
                                                <Td fontWeight='bold'>{position.symbol}</Td>
                                                <Td isNumeric>{position.amount.toFixed(4)}</Td>
                                                <Td isNumeric>{formatCurrency(position.entryPrice)}</Td>
                                                <Td isNumeric>{formatCurrency(parseFloat(currentPrice))}</Td>
                                                <Td isNumeric color={pl >= 0 ? 'success.500' : 'danger.500'}>
                                                    {formatCurrency(pl)} ({formatPercentage(plPercent)})
                                                </Td>
                                                <Td>
                                                    <Button
                                                        size='xs'
                                                        colorScheme='red'
                                                        onClick={() => handleSell(position.id)}
                                                    >
                                                        Sell
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                            {positions.length === 0 && (
                                <Box textAlign='center' py={8}>
                                    <Activity size={48} style={{ margin: '0 auto', opacity: 0.3 }} />
                                    <Text mt={4} color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}>
                                        No open positions. Click "Buy" to start trading!
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Card>

                    <Card>
                        <Heading size='md' mb={4}>Trade History</Heading>
                        <VStack spacing={2} align='stretch' maxH='400px' overflowY='auto'>
                            {tradeHistory.slice(0, 20).map((trade) => (
                                <Box
                                    key={trade.id}
                                    p={3}
                                    borderRadius='md'
                                    bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'}
                                >
                                    <HStack justify='space-between'>
                                        <HStack>
                                            <Badge colorScheme={trade.type === 'buy' ? 'blue' : 'red'}>
                                                {trade.type.toUpperCase()}
                                            </Badge>
                                            <Text fontWeight='bold'>{trade.symbol}</Text>
                                        </HStack>
                                        <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                            {formatDateTime(new Date(trade.date))}
                                        </Text>
                                    </HStack>
                                    <HStack justify='space-between' mt={2}>
                                        <Text fontSize='sm'>
                                            {trade.amount.toFixed(4)} @ {formatCurrency(trade.price)}
                                        </Text>
                                        {trade.profit !== undefined && (
                                            <Text fontSize='sm' color={trade.profit >= 0 ? 'success.500' : 'danger.500'}>
                                                {formatCurrency(trade.profit)} ({formatPercentage(trade.profitPercentage)})
                                            </Text>
                                        )}
                                    </HStack>
                                </Box>
                            ))}
                            {tradeHistory.length === 0 && (
                                <Box textAlign='center' py={8}>
                                    <TrendingUp size={48} style={{ margin: '0 auto', opacity: 0.3 }} />
                                    <Text mt={4} color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}>
                                        No trades yet
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </Card>
                </Grid>
            </VStack>

            <Modal isOpen={isBuyOpen} onClose={onBuyClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Buy Asset</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Trading Pair</FormLabel>
                                <Input
                                    placeholder='e.g., BTCUSD'
                                    value={buyForm.symbol}
                                    onChange={(e) => setBuyForm({ ...buyForm, symbol: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <Input
                                    type='number'
                                    step='0.0001'
                                    placeholder='0.0000'
                                    value={buyForm.amount}
                                    onChange={(e) => setBuyForm({ ...buyForm, amount: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Price (USD)</FormLabel>
                                <Input
                                    type='number'
                                    step='0.01'
                                    placeholder='0.00'
                                    value={buyForm.price}
                                    onChange={(e) => setBuyForm({ ...buyForm, price: e.target.value })}
                                />
                            </FormControl>

                            <Box w='full' p={3} borderRadius='md' bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}>
                                <HStack justify='space-between'>
                                    <Text fontSize='sm'>Total Cost:</Text>
                                    <Text fontWeight='bold'>
                                        {buyForm.amount && buyForm.price
                                            ? formatCurrency(parseFloat(buyForm.amount) * parseFloat(buyForm.price))
                                            : '$0.00'}
                                    </Text>
                                </HStack>
                                <HStack justify='space-between' mt={2}>
                                    <Text fontSize='sm'>Available Balance:</Text>
                                    <Text fontWeight='bold'>{formatCurrency(balance)}</Text>
                                </HStack>
                            </Box>

                            <Button colorScheme='brand' width='full' onClick={handleBuy}>
                                Execute Buy Order
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
};
