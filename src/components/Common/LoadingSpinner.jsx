import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const LoadingSpinner = ({ message = 'Loading...', size = 'xl' }) => {
    return (
        <VStack spacing={4} py={12}>
            <MotionBox
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.700'
                    color='brand.500'
                    size={size}
                />
            </MotionBox>
            <Text color='gray.400' fontSize='sm'>
                {message}
            </Text>
        </VStack>
    );
};
