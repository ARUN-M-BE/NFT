import { Box, HStack, Text, Icon, Tooltip, useColorMode } from '@chakra-ui/react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWebSocket } from '@/context/WebSocketContext';

const MotionBox = motion(Box);

export const ConnectionStatus = () => {
    const { status, isConnected, lastUpdate, reconnect } = useWebSocket();
    const { colorMode } = useColorMode();

    const getStatusColor = () => {
        switch (status) {
            case 'connected':
                return 'success.500';
            case 'connecting':
                return 'warning.500';
            case 'disconnected':
            case 'failed':
                return 'danger.500';
            default:
                return 'gray.500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'connected':
                return 'Live';
            case 'connecting':
                return 'Connecting...';
            case 'disconnected':
                return 'Offline';
            case 'failed':
                return 'Failed';
            default:
                return 'Unknown';
        }
    };

    const getStatusIcon = () => {
        if (status === 'connecting') {
            return RefreshCw;
        }
        return isConnected ? Wifi : WifiOff;
    };

    const StatusIcon = getStatusIcon();

    return (
        <Tooltip
            label={
                isConnected
                    ? `Real-time streaming active${lastUpdate ? ` • Last update: ${new Date(lastUpdate).toLocaleTimeString()}` : ''}`
                    : 'Click to reconnect'
            }
            placement='bottom'
        >
            <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                cursor={!isConnected ? 'pointer' : 'default'}
                onClick={!isConnected ? reconnect : undefined}
            >
                <HStack
                    spacing={2}
                    px={3}
                    py={2}
                    borderRadius='lg'
                    bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'blackAlpha.50'}
                    borderWidth='1px'
                    borderColor={getStatusColor()}
                    transition='all 0.3s'
                >
                    <MotionBox
                        animate={status === 'connecting' ? { rotate: 360 } : {}}
                        transition={{ duration: 1, repeat: status === 'connecting' ? Infinity : 0, ease: 'linear' }}
                    >
                        <Icon as={StatusIcon} boxSize={4} color={getStatusColor()} />
                    </MotionBox>
                    <Text fontSize='sm' fontWeight='700' color={getStatusColor()}>
                        {getStatusText()}
                    </Text>
                    {isConnected && (
                        <MotionBox
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Box w={2} h={2} borderRadius='full' bg='success.500' />
                        </MotionBox>
                    )}
                </HStack>
            </MotionBox>
        </Tooltip>
    );
};
