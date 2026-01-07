import { Box, Text, HStack, Badge, useColorMode } from '@chakra-ui/react';
import { Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '@/utils/formatters';

const MotionBox = motion(Box);

export const RefreshIndicator = ({ lastUpdated, nextUpdate, onRefresh }) => {
    const { colorMode } = useColorMode();

    const getTimeUntilNext = () => {
        if (!nextUpdate) return '';
        const diff = nextUpdate - new Date();
        const seconds = Math.floor(diff / 1000);
        if (seconds <= 0) return 'Updating...';
        return `${seconds}s`;
    };

    return (
        <HStack
            spacing={3}
            px={4}
            py={2}
            borderRadius='full'
            bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}
            fontSize='sm'
        >
            <HStack spacing={1}>
                <Clock size={14} />
                <Text color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
                    Updated: {lastUpdated ? formatTime(lastUpdated) : 'Never'}
                </Text>
            </HStack>

            <Badge colorScheme='blue' fontSize='xs'>
                Next: {getTimeUntilNext()}
            </Badge>

            <MotionBox
                as='button'
                onClick={onRefresh}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                cursor='pointer'
            >
                <RefreshCw size={16} />
            </MotionBox>
        </HStack>
    );
};
