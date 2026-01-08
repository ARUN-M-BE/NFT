import { Box, Flex, Text, Tooltip, IconButton, useColorModeValue } from '@chakra-ui/react';
import { RefreshCw } from 'lucide-react';
import { useWebSocket } from '@/context/WebSocketContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ConnectionStatus = () => {
    const { status, isConnected, isConnecting, reconnect, lastUpdate } = useWebSocket();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const getStatusConfig = () => {
        switch (status) {
            case 'connected':
                return {
                    color: '#52c41a',
                    label: 'Connected',
                    description: 'Real-time data streaming',
                    pulse: true,
                };
            case 'connecting':
                return {
                    color: '#faad14',
                    label: 'Connecting',
                    description: 'Establishing connection...',
                    pulse: true,
                };
            case 'disconnected':
                return {
                    color: '#8c8c8c',
                    label: 'Disconnected',
                    description: 'Using polling mode',
                    pulse: false,
                };
            case 'failed':
                return {
                    color: '#f5222d',
                    label: 'Failed',
                    description: 'Connection failed',
                    pulse: false,
                };
            default:
                return {
                    color: '#8c8c8c',
                    label: 'Unknown',
                    description: 'Status unknown',
                    pulse: false,
                };
        }
    };

    const config = getStatusConfig();

    const getTimeSinceUpdate = () => {
        if (!lastUpdate) return null;
        const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m ago`;
    };

    return (
        <Tooltip
            label={
                <Box>
                    <Text fontWeight="bold">{config.label}</Text>
                    <Text fontSize="sm">{config.description}</Text>
                    {lastUpdate && (
                        <Text fontSize="xs" mt={1} opacity={0.8}>
                            Last update: {getTimeSinceUpdate()}
                        </Text>
                    )}
                </Box>
            }
            placement="bottom"
            hasArrow
        >
            <Flex
                align="center"
                gap={2}
                px={3}
                py={1.5}
                borderRadius="lg"
                bg={bgColor}
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'sm',
                }}
            >
                {/* Status Indicator Dot */}
                <Box position="relative">
                    <MotionBox
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={config.color}
                        animate={
                            config.pulse
                                ? {
                                      scale: [1, 1.2, 1],
                                      opacity: [1, 0.8, 1],
                                  }
                                : {}
                        }
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    {config.pulse && (
                        <MotionBox
                            position="absolute"
                            top="50%"
                            left="50%"
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg={config.color}
                            opacity={0.3}
                            animate={{
                                scale: [1, 2, 2],
                                opacity: [0.3, 0, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                            }}
                            style={{
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    )}
                </Box>

                {/* Status Text */}
                <Text fontSize="sm" fontWeight="medium" display={{ base: 'none', md: 'block' }}>
                    {config.label}
                </Text>

                {/* Reconnect Button (only show when disconnected or failed) */}
                {(status === 'disconnected' || status === 'failed') && (
                    <IconButton
                        icon={<RefreshCw size={14} />}
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            reconnect();
                        }}
                        aria-label="Reconnect"
                        _hover={{
                            bg: 'transparent',
                            transform: 'rotate(180deg)',
                        }}
                        transition="transform 0.3s"
                    />
                )}
            </Flex>
        </Tooltip>
    );
};

export default ConnectionStatus;
