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
    Select,
    IconButton,
    Badge,
    Switch,
    useColorMode,
    useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, BellOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAlerts } from '@/context/AlertsContext';
import { usePolling, getAllPrices } from '@/hooks/useGeminiAPI';
import { Card } from '@/components/Common/Card';
import { RefreshIndicator } from '@/components/Common/RefreshIndicator';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { REFRESH_INTERVALS } from '@/utils/constants';

const MotionBox = motion(Box);

export const AlertsPage = () => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { alerts, createAlert, deleteAlert, toggleAlert, checkAlerts } = useAlerts();
    const { data: prices, lastUpdated, nextUpdate, refetch } = usePolling(getAllPrices, REFRESH_INTERVALS.PRICES);

    const [formData, setFormData] = useState({
        symbol: '',
        condition: 'above',
        targetPrice: '',
        message: '',
    });

    // Check alerts whenever prices update
    useEffect(() => {
        if (prices) {
            checkAlerts(prices);
        }
    }, [prices, checkAlerts]);

    const handleCreateAlert = () => {
        if (!formData.symbol || !formData.targetPrice) {
            toast({
                title: 'Missing fields',
                description: 'Please fill in symbol and target price',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        createAlert(formData.symbol.toUpperCase(), formData.condition, formData.targetPrice, formData.message);
        setFormData({ symbol: '', condition: 'above', targetPrice: '', message: '' });
        onClose();

        toast({
            title: 'Alert created',
            description: `You'll be notified when ${formData.symbol.toUpperCase()} goes ${formData.condition} ${formatCurrency(parseFloat(formData.targetPrice))}`,
            status: 'success',
            duration: 5000,
        });
    };

    const activeAlerts = alerts.filter(a => a.active);
    const inactiveAlerts = alerts.filter(a => !a.active);

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
                            <Bell size={32} className='pulse-glow' />
                            <Heading size='xl' className='gradient-text'>Price Alerts</Heading>
                        </HStack>
                        <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'} mt={2}>
                            Get notified when prices hit your targets
                        </Text>
                    </Box>

                    <HStack>
                        <RefreshIndicator lastUpdated={lastUpdated} nextUpdate={nextUpdate} onRefresh={refetch} />
                        <Button leftIcon={<Plus size={20} />} colorScheme='brand' onClick={onOpen}>
                            Create Alert
                        </Button>
                    </HStack>
                </HStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <Card>
                        <HStack spacing={4}>
                            <Box p={3} borderRadius='lg' bg='brand.500' color='white'>
                                <Bell size={24} />
                            </Box>
                            <VStack align='start' spacing={0}>
                                <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                    Active Alerts
                                </Text>
                                <Text fontSize='2xl' fontWeight='bold'>
                                    {activeAlerts.length}
                                </Text>
                            </VStack>
                        </HStack>
                    </Card>

                    <Card>
                        <HStack spacing={4}>
                            <Box p={3} borderRadius='lg' bg='success.500' color='white'>
                                <Bell size={24} />
                            </Box>
                            <VStack align='start' spacing={0}>
                                <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                    Triggered
                                </Text>
                                <Text fontSize='2xl' fontWeight='bold'>
                                    {inactiveAlerts.length}
                                </Text>
                            </VStack>
                        </HStack>
                    </Card>

                    <Card>
                        <HStack spacing={4}>
                            <Box p={3} borderRadius='lg' bg='purple.500' color='white'>
                                <Bell size={24} />
                            </Box>
                            <VStack align='start' spacing={0}>
                                <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                    Total Alerts
                                </Text>
                                <Text fontSize='2xl' fontWeight='bold'>
                                    {alerts.length}
                                </Text>
                            </VStack>
                        </HStack>
                    </Card>
                </Grid>

                {alerts.length === 0 ? (
                    <Card>
                        <VStack spacing={4} py={12}>
                            <Bell size={64} style={{ opacity: 0.2 }} />
                            <Heading size='md' color={colorMode === 'dark' ? 'gray.500' : 'gray.400'}>
                                No alerts yet
                            </Heading>
                            <Text color={colorMode === 'dark' ? 'gray.600' : 'gray.500'}>
                                Create your first price alert to get started
                            </Text>
                        </VStack>
                    </Card>
                ) : (
                    <VStack spacing={4} align='stretch'>
                        {activeAlerts.length > 0 && (
                            <Box>
                                <Heading size='md' mb={4}>Active Alerts</Heading>
                                <VStack spacing={3}>
                                    {activeAlerts.map((alert) => {
                                        const currentPrice = prices?.find(p => p.pair === alert.symbol)?.price;

                                        return (
                                            <Card key={alert.id}>
                                                <HStack justify='space-between'>
                                                    <HStack spacing={4} flex={1}>
                                                        <Box p={2} borderRadius='md' bg='brand.500' color='white'>
                                                            <Bell size={20} />
                                                        </Box>
                                                        <VStack align='start' spacing={1} flex={1}>
                                                            <HStack>
                                                                <Text fontWeight='bold' fontSize='lg'>{alert.symbol}</Text>
                                                                <Badge colorScheme='green'>Active</Badge>
                                                            </HStack>
                                                            <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                                                Alert when price goes {alert.condition} {formatCurrency(alert.targetPrice)}
                                                            </Text>
                                                            {currentPrice && (
                                                                <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.500' : 'gray.500'}>
                                                                    Current: {formatCurrency(parseFloat(currentPrice))}
                                                                </Text>
                                                            )}
                                                            <Text fontSize='xs' color={colorMode === 'dark' ? 'gray.600' : 'gray.400'}>
                                                                Created {formatDateTime(new Date(alert.createdAt))}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>

                                                    <HStack>
                                                        <Switch
                                                            isChecked={alert.active}
                                                            onChange={() => toggleAlert(alert.id)}
                                                            colorScheme='brand'
                                                        />
                                                        <IconButton
                                                            size='sm'
                                                            icon={<Trash2 size={16} />}
                                                            colorScheme='red'
                                                            variant='ghost'
                                                            onClick={() => deleteAlert(alert.id)}
                                                        />
                                                    </HStack>
                                                </HStack>
                                            </Card>
                                        );
                                    })}
                                </VStack>
                            </Box>
                        )}

                        {inactiveAlerts.length > 0 && (
                            <Box>
                                <Heading size='md' mb={4}>Triggered Alerts</Heading>
                                <VStack spacing={3}>
                                    {inactiveAlerts.map((alert) => (
                                        <Card key={alert.id}>
                                            <HStack justify='space-between'>
                                                <HStack spacing={4} flex={1}>
                                                    <Box p={2} borderRadius='md' bg='gray.500' color='white'>
                                                        <BellOff size={20} />
                                                    </Box>
                                                    <VStack align='start' spacing={1} flex={1}>
                                                        <HStack>
                                                            <Text fontWeight='bold' fontSize='lg'>{alert.symbol}</Text>
                                                            <Badge colorScheme='gray'>Triggered</Badge>
                                                        </HStack>
                                                        <Text fontSize='sm' color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                                                            Was set for {alert.condition} {formatCurrency(alert.targetPrice)}
                                                        </Text>
                                                        <Text fontSize='xs' color={colorMode === 'dark' ? 'gray.600' : 'gray.400'}>
                                                            Created {formatDateTime(new Date(alert.createdAt))}
                                                        </Text>
                                                    </VStack>
                                                </HStack>

                                                <IconButton
                                                    size='sm'
                                                    icon={<Trash2 size={16} />}
                                                    colorScheme='red'
                                                    variant='ghost'
                                                    onClick={() => deleteAlert(alert.id)}
                                                />
                                            </HStack>
                                        </Card>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                )}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Price Alert</ModalHeader>
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
                                <FormLabel>Condition</FormLabel>
                                <Select
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                >
                                    <option value='above'>Price goes above</option>
                                    <option value='below'>Price goes below</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Target Price (USD)</FormLabel>
                                <Input
                                    type='number'
                                    step='0.01'
                                    placeholder='0.00'
                                    value={formData.targetPrice}
                                    onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Custom Message (Optional)</FormLabel>
                                <Input
                                    placeholder='e.g., Time to buy!'
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </FormControl>

                            <Button colorScheme='brand' width='full' onClick={handleCreateAlert}>
                                Create Alert
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
};
