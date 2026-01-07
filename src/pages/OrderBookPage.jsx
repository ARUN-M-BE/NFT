import { Box, Heading, Text } from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';

export const OrderBookPage = () => {
    return (
        <Box>
            <Heading size='xl' mb={4} className='gradient-text'>Order Book</Heading>
            <Card>
                <Text>Full order book view coming soon...</Text>
            </Card>
        </Box>
    );
};
