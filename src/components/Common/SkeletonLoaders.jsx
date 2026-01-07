import { Box, Skeleton, SkeletonText, VStack, HStack } from '@chakra-ui/react';

export const PriceCardSkeleton = () => {
    return (
        <Box className='glass-card' p={6}>
            <VStack align='stretch' spacing={3}>
                <HStack justify='space-between'>
                    <Skeleton height='20px' width='80px' />
                    <Skeleton height='24px' width='60px' borderRadius='md' />
                </HStack>
                <Skeleton height='32px' width='120px' />
                <Skeleton height='16px' width='100px' />
            </VStack>
        </Box>
    );
};

export const TableSkeleton = ({ rows = 5 }) => {
    return (
        <VStack spacing={2} align='stretch'>
            {Array.from({ length: rows }).map((_, i) => (
                <HStack key={i} justify='space-between' p={3}>
                    <Skeleton height='16px' width='100px' />
                    <Skeleton height='16px' width='80px' />
                    <Skeleton height='16px' width='60px' />
                </HStack>
            ))}
        </VStack>
    );
};

export const ChartSkeleton = () => {
    return (
        <Box className='glass-card' p={6}>
            <Skeleton height='24px' width='150px' mb={4} />
            <Skeleton height='400px' width='100%' />
        </Box>
    );
};
