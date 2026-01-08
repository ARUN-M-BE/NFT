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
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, PieChart, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { usePolling } from '@/hooks/useGeminiAPI';
import { getAllPrices } from '@/api';
import { Card } from '@/components/Common/Card';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';
import { exportService } from '@/services/exportService';
import { Cell, Pie, PieChart as RechartsPie, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const MotionBox = motion(Box);

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

export const PortfolioPage = () => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { holdings, transactions, addHolding, removeHolding, calculatePortfolioValue, calculateProfitLoss } = usePortfolio();
    const { data: prices, lastUpdated, nextUpdate, refetch } = usePolling(getAllPrices, REFRESH_INTERVALS.PRICES);

    const [formData, setFormData] = useState({ symbol: '', amount: '', price: '' });

    const handleAddHolding = () => {
        if (!formData.symbol || !formData.amount || !formData.price) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        addHolding(formData.symbol.toUpperCase(), formData.amount, formData.price);
        setFormData({ symbol: '', amount: '', price: '' });
        onClose();

        toast({
            title: 'Holding added',
            description: `Added ${formData.amount} ${formData.symbol.toUpperCase()}`,
            status: 'success',
            duration: 3000,
        });
    };

    const portfolioValue = calculatePortfolioValue(prices);
    const { amount: plAmount, percentage: plPercentage } = calculateProfitLoss(prices);

    const pieData = holdings.map((holding, index) => {
        const currentPrice = prices?.find(p => p.pair === holding.symbol)?.price || holding.buyPrice;
        return {
            name: holding.symbol,
            value: holding.amount * parseFloat(currentPrice),
            color: COLORS[index % COLORS.length],
        };
    });

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align='stretch'>
                <HStack justify='space-between' flexWrap='wrap' gap={4}>
                    <Box>
                        <Heading size='xl' className='gradient-text'>Portfolio</Heading>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                            Track your cryptocurrency holdings and performance
                        </Text>
                    </Box>

                    <HStack spacing={2} flexWrap='wrap'>
                        <RefreshIndicator lastUpdated={lastUpdated} nextUpdate={nextUpdate} onRefresh={refetch} />
                        <Button
                            leftIcon={<FileText size={18} />}
                            size='sm'
                            variant='outline'
                            onClick={() => exportService.exportPortfolioPDF({
                                holdings,
                                transactions,
                                metrics: {
                                    totalValue: portfolioValue,
                                    totalPnL: plAmount,
                                    pnlPercentage: plPercentage
                                }
                            })}
                        >
                            Export PDF
                        </Button>
                        <Button
                            leftIcon={<Download size={18} />}
                            size='sm'
                            variant='outline'
                            onClick={() => exportService.exportTransactionsCSV(transactions)}
                        >
                            Export CSV
                        </Button>
                        <Button leftIcon={<Plus size={20} />} colorScheme='brand' onClick={onOpen}>
                            Add Holding
                        </Button>
                    </HStack>
                </HStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Card>
                        <Stat>
                            <StatLabel>Total Portfolio Value</StatLabel>
                            <StatNumber fontSize='3xl'>{formatCurrency(portfolioValue)}</StatNumber>
                            <StatHelpText>Across {holdings.length} holdings</StatHelpText>
                        </Stat>
                    </Card>

                    <Card>
                        <Stat>
                            <StatLabel>Total Profit/Loss</StatLabel>
                            <StatNumber fontSize='3xl' color={plAmount >= 0 ? 'success.500' : 'danger.500'}>
                                {formatCurrency(plAmount)}
                            </StatNumber>
                            <StatHelpText>
                                <StatArrow type={plAmount >= 0 ? 'increase' : 'decrease'} />
                                {formatPercentage(plPercentage)}
                            </StatHelpText>
                        </Stat>
                    </Card>

                    <Card>
                        <Stat>
                            <StatLabel>Holdings</StatLabel>
                            <StatNumber fontSize='3xl'>{holdings.length}</StatNumber>
                            <StatHelpText>{transactions.length} total transactions</StatHelpText>
                        </Stat>
                    </Card>
                </Grid>

                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
                    <Card>
                        <Heading size='md' mb={4}>Holdings</Heading>
                        <Box overflowX='auto'>
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Symbol</Th>
                                        <Th isNumeric>Amount</Th>
                                        <Th isNumeric>Buy Price</Th>
                                        <Th isNumeric>Current Price</Th>
                                        <Th isNumeric>Value</Th>
                                        <Th isNumeric>P&L</Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {holdings.map((holding) => {
                                        const currentPrice = prices?.find(p => p.pair === holding.symbol)?.price || holding.buyPrice;
                                        const value = holding.amount * parseFloat(currentPrice);
                                        const pl = value - (holding.amount * holding.buyPrice);
                                        const plPercent = (pl / (holding.amount * holding.buyPrice)) * 100;

                                        return (
                                            <Tr key={holding.id}>
                                                <Td fontWeight='bold'>{holding.symbol}</Td>
                                                <Td isNumeric>{holding.amount.toFixed(4)}</Td>
                                                <Td isNumeric>{formatCurrency(holding.buyPrice)}</Td>
                                                <Td isNumeric>{formatCurrency(parseFloat(currentPrice))}</Td>
                                                <Td isNumeric>{formatCurrency(value)}</Td>
                                                <Td isNumeric color={pl >= 0 ? 'success.500' : 'danger.500'}>
                                                    {formatCurrency(pl)} ({formatPercentage(plPercent)})
                                                </Td>
                                                <Td>
                                                    <IconButton
                                                        size='sm'
                                                        icon={<Trash2 size={16} />}
                                                        colorScheme='red'
                                                        variant='ghost'
                                                        onClick={() => removeHolding(holding.id)}
                                                    />
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                            {holdings.length === 0 && (
                                <Box textAlign='center' py={8}>
                                    <PieChart size={48} style={{ margin: '0 auto', opacity: 0.3 }} />
                                    <Text mt={4} color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}>
                                        No holdings yet. Add your first holding to get started!
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Card>

                    {holdings.length > 0 && (
                        <Card>
                            <Heading size='md' mb={4}>Allocation</Heading>
                            <ResponsiveContainer width='100%' height={300}>
                                <RechartsPie>
                                    <Pie
                                        data={pieData}
                                        cx='50%'
                                        cy='50%'
                                        labelLine={false}
                                        label={(entry) => `${entry.name}`}
                                        outerRadius={80}
                                        fill='#8884d8'
                                        dataKey='value'
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </RechartsPie>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </Grid>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Holding</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Trading Pair</FormLabel>
                                <Input
                                    placeholder='e.g., BTCUSD'
                                    value={formData.symbol}
                                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <Input
                                    type='number'
                                    step='0.0001'
                                    placeholder='0.0000'
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Buy Price (USD)</FormLabel>
                                <Input
                                    type='number'
                                    step='0.01'
                                    placeholder='0.00'
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </FormControl>

                            <Button colorScheme='brand' width='full' onClick={handleAddHolding}>
                                Add Holding
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
};
