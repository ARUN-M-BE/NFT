import { Box, Heading, Text, Grid, VStack, Badge, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Card } from '@/components/Common/Card';
import { Percent, TrendingDown } from 'lucide-react';

const MotionBox = motion(Box);

// Mock fee promos data (replace with actual API when available)
const mockPromos = [
    {
        id: 1,
        title: 'New User Promotion',
        description: 'Get 0% trading fees for your first 30 days',
        discount: '100%',
        validUntil: '2024-12-31',
        active: true
    },
    {
        id: 2,
        title: 'High Volume Trader',
        description: 'Trade over $100,000/month and get reduced fees',
        discount: '50%',
        validUntil: '2024-12-31',
        active: true
    },
    {
        id: 3,
        title: 'Maker Fee Discount',
        description: 'Reduced maker fees for limit orders',
        discount: '25%',
        validUntil: 'Ongoing',
        active: true
    }
];

export const FeePromosPage = () => {
    const promos = mockPromos;

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <VStack spacing={6} align='stretch'>
                <Box>
                    <Heading size='xl' mb={2} className='gradient-text'>Fee Promotions</Heading>
                    <Text color='gray.400'>Current trading fee promotions and discounts</Text>
                </Box>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                    {promos.map((promo) => (
                        <MotionBox
                            key={promo.id}
                            whileHover={{ scale: 1.02, y: -4 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card>
                                <VStack align='stretch' spacing={4}>
                                    <HStack justify='space-between'>
                                        <Badge colorScheme='green' fontSize='lg' px={3} py={1}>
                                            {promo.discount} OFF
                                        </Badge>
                                        <Percent size={24} color='#48bb78' />
                                    </HStack>

                                    <Box>
                                        <Text fontSize='xl' fontWeight='bold' mb={2}>
                                            {promo.title}
                                        </Text>
                                        <Text color='gray.400' fontSize='sm'>
                                            {promo.description}
                                        </Text>
                                    </Box>

                                    <HStack justify='space-between' pt={2} borderTop='1px' borderColor='whiteAlpha.200'>
                                        <Text fontSize='xs' color='gray.500'>
                                            Valid until
                                        </Text>
                                        <Text fontSize='sm' fontWeight='semibold'>
                                            {promo.validUntil}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Card>
                        </MotionBox>
                    ))}
                </Grid>

                <Card>
                    <VStack align='start' spacing={3}>
                        <Heading size='md'>Standard Fee Structure</Heading>
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} w='full'>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>Maker Fee</Text>
                                <Text fontSize='2xl' fontWeight='bold'>0.25%</Text>
                            </Box>
                            <Box>
                                <Text fontSize='sm' color='gray.400'>Taker Fee</Text>
                                <Text fontSize='2xl' fontWeight='bold'>0.35%</Text>
                            </Box>
                        </Grid>
                        <Text fontSize='sm' color='gray.500' pt={2}>
                            * Fees may be reduced based on trading volume and active promotions
                        </Text>
                    </VStack>
                </Card>
            </VStack>
        </MotionBox>
    );
};
