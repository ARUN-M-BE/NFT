import { Box, Heading, Text, Grid, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { getFeePromos } from '@/api';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { Card } from '@/components/Common/Card';

const MotionBox = motion(Box);

export const FeePromosPage = () => {
    const { data: promos, loading, error } = useGeminiAPI(getFeePromos);

    if (loading) {
        return <LoadingSpinner message='Loading fee promotions...' />;
    }

    if (error) {
        return (
            <Card>
                <Text color='danger.light'>Error loading fee promotions: {error}</Text>
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
                    <Heading size='xl' mb={2} className='gradient-text'>Fee Promotions</Heading>
                    <Text color='gray.400'>Current trading fee promotions and discounts</Text>
                </Box>

                {promos && promos.length > 0 ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        {promos.map((promo, index) => (
                            <Card key={index}>
                                <Text>{JSON.stringify(promo, null, 2)}</Text>
                            </Card>
                        ))}
                    </Grid>
                ) : (
                    <Card>
                        <Text color='gray.400'>No active fee promotions at this time</Text>
                    </Card>
                )}
            </VStack>
        </MotionBox>
    );
};
