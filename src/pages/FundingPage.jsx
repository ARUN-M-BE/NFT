import { Box, Heading, Text } from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';

export const FundingPage = () => {
    return (
        <Box>
            <Heading size='xl' mb={4} className='gradient-text'>Funding Rates</Heading>
            <Card>
                <Text>Funding rates and history coming soon...</Text>
            </Card>
        </Box>
    );
};
