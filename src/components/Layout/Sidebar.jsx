import { Box, VStack, HStack, Text, Icon, Flex, useColorMode } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, BookOpen, DollarSign, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Trading', path: '/trading', icon: BarChart3 },
    { name: 'Order Book', path: '/orderbook', icon: BookOpen },
    { name: 'Funding', path: '/funding', icon: DollarSign },
    { name: 'Fee Promos', path: '/fee-promos', icon: Percent },
];

export const Sidebar = () => {
    const { colorMode } = useColorMode();

    return (
        <MotionBox
            as='aside'
            className='glass-card'
            w='250px'
            h='calc(100vh - 120px)'
            p={4}
            position='sticky'
            top='100px'
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            display={{ base: 'none', lg: 'block' }}
        >
            <VStack spacing={2} align='stretch'>
                {navItems.map((item, index) => (
                    <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                        {({ isActive }) => (
                            <MotionBox
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                <HStack
                                    px={4}
                                    py={3}
                                    borderRadius='lg'
                                    bg={isActive ? 'brand.500' : 'transparent'}
                                    color={isActive ? 'white' : colorMode === 'dark' ? 'gray.400' : 'gray.600'}
                                    _hover={{
                                        bg: isActive ? 'brand.600' : colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
                                        color: isActive ? 'white' : colorMode === 'dark' ? 'white' : 'gray.900',
                                    }}
                                    transition='all 0.2s'
                                    cursor='pointer'
                                    position='relative'
                                >
                                    {isActive && (
                                        <Box
                                            position='absolute'
                                            left={0}
                                            top='50%'
                                            transform='translateY(-50%)'
                                            w={1}
                                            h='60%'
                                            bg='white'
                                            borderRadius='full'
                                        />
                                    )}
                                    <Icon as={item.icon} boxSize={5} />
                                    <Text fontWeight={isActive ? 'bold' : 'medium'}>{item.name}</Text>
                                </HStack>
                            </MotionBox>
                        )}
                    </NavLink>
                ))}
            </VStack>
        </MotionBox>
    );
};
