import { Box, VStack, HStack, Text, Icon, Flex, useColorMode, Divider } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, BookOpen, DollarSign, Percent, Briefcase, Star, Bell, Play, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const MotionBox = motion(Box);

const navItems = [
    { name: 'Dashboard', path: '/', icon: Home, section: 'main' },
    { name: 'Markets', path: '/markets', icon: TrendingUp, section: 'main' },
    { name: 'Trading', path: '/trading', icon: BarChart3, section: 'main' },
    { name: 'Order Book', path: '/orderbook', icon: BookOpen, section: 'main' },
    { name: 'Funding', path: '/funding', icon: DollarSign, section: 'main' },
    { name: 'Fee Promos', path: '/fee-promos', icon: Percent, section: 'main' },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase, section: 'trading' },
    { name: 'Watchlist', path: '/watchlist', icon: Star, section: 'trading' },
    { name: 'Alerts', path: '/alerts', icon: Bell, section: 'trading' },
    { name: 'Simulator', path: '/simulator', icon: Play, section: 'trading' },
];

export const Sidebar = () => {
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            setIsAdmin(data?.role === 'admin');
        };

        checkAdmin();
    }, [user]);

    const mainItems = navItems.filter(item => item.section === 'main');
    const tradingItems = navItems.filter(item => item.section === 'trading');

    const NavItem = ({ item, isActive }) => (
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
    );

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
            overflowY='auto'
        >
            <VStack spacing={4} align='stretch'>
                <Box>
                    <Text fontSize='xs' fontWeight='bold' color={colorMode === 'dark' ? 'gray.500' : 'gray.400'} mb={2} px={4}>
                        MARKET DATA
                    </Text>
                    <VStack spacing={2} align='stretch'>
                        {mainItems.map((item) => (
                            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                                {({ isActive }) => <NavItem item={item} isActive={isActive} />}
                            </NavLink>
                        ))}
                    </VStack>
                </Box>

                <Divider />

                <Box>
                    <Text fontSize='xs' fontWeight='bold' color={colorMode === 'dark' ? 'gray.500' : 'gray.400'} mb={2} px={4}>
                        TRADING TOOLS
                    </Text>
                    <VStack spacing={2} align='stretch'>
                        {tradingItems.map((item) => (
                            <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                                {({ isActive }) => <NavItem item={item} isActive={isActive} />}
                            </NavLink>
                        ))}
                    </VStack>
                </Box>

                {isAdmin && (
                    <>
                        <Divider />
                        <Box>
                            <Text fontSize='xs' fontWeight='bold' color='purple.400' mb={2} px={4}>
                                ADMIN
                            </Text>
                            <VStack spacing={2} align='stretch'>
                                <NavLink to='/admin' style={{ textDecoration: 'none' }}>
                                    {({ isActive }) => <NavItem item={{ name: 'Dashboard', icon: Shield }} isActive={isActive} />}
                                </NavLink>
                                <NavLink to='/admin/users' style={{ textDecoration: 'none' }}>
                                    {({ isActive }) => <NavItem item={{ name: 'User Data', icon: Users }} isActive={isActive} />}
                                </NavLink>
                            </VStack>
                        </Box>
                    </>
                )}
            </VStack>
        </MotionBox>
    );
};
