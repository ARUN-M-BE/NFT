import {
    Box,
    Container,
    Flex,
    HStack,
    IconButton,
    Text,
    useColorMode,
    Input,
    InputGroup,
    InputLeftElement,
    Badge,
    Icon,
    VStack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Divider,
} from '@chakra-ui/react';
import { Moon, Sun, Search, Bell, Sparkles, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, BarChart3, BookOpen, DollarSign, Percent, Briefcase, Star, Play } from 'lucide-react';

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Markets', path: '/markets', icon: TrendingUp },
    { name: 'Trading', path: '/trading', icon: BarChart3 },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Watchlist', path: '/watchlist', icon: Star },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Simulator', path: '/simulator', icon: Play },
];

export const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <MotionFlex
                as='header'
                className='glass-card'
                px={{ base: 4, md: 6 }}
                py={4}
                mb={8}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                position='sticky'
                top={0}
                zIndex={100}
                borderBottomWidth='1px'
                borderBottomColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100'}
            >
                <Container maxW='container.2xl'>
                    <Flex justify='space-between' align='center'>
                        {/* Left: Logo + Menu Button */}
                        <Flex align='center' gap={3}>
                            {/* Mobile Menu Button */}
                            <IconButton
                                aria-label='Open menu'
                                icon={<Menu size={20} />}
                                onClick={onOpen}
                                variant='ghost'
                                size='md'
                                display={{ base: 'flex', lg: 'none' }}
                                _hover={{
                                    bg: colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
                                }}
                            />

                            {/* Logo */}
                            <MotionBox
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HStack spacing={2}>
                                    <Box
                                        p={2}
                                        borderRadius='xl'
                                        bgGradient='linear(to-br, brand.400, purple.500)'
                                        boxShadow='0 4px 14px rgba(33, 150, 243, 0.4)'
                                        display={{ base: 'none', sm: 'block' }}
                                    >
                                        <Icon as={Sparkles} boxSize={5} color='white' />
                                    </Box>
                                    <VStack align='start' spacing={0}>
                                        <Text
                                            fontSize={{ base: 'lg', md: '2xl' }}
                                            fontWeight='900'
                                            bgGradient='linear(to-r, brand.400, purple.500)'
                                            bgClip='text'
                                            letterSpacing='tight'
                                        >
                                            ALL Exchange
                                        </Text>
                                        <Text fontSize='xs' color={colorMode === 'dark' ? 'text-tertiary' : 'gray.500'} fontWeight='700' display={{ base: 'none', sm: 'block' }}>
                                            PREMIUM TRADING
                                        </Text>
                                    </VStack>
                                </HStack>
                            </MotionBox>

                            <Badge
                                colorScheme='green'
                                fontSize='xs'
                                px={2}
                                py={1}
                                borderRadius='full'
                                fontWeight='700'
                                boxShadow='0 0 10px rgba(76, 175, 80, 0.3)'
                                display={{ base: 'none', md: 'block' }}
                            >
                                ● LIVE
                            </Badge>
                        </Flex>

                        {/* Right: Actions */}
                        <HStack spacing={{ base: 2, md: 4 }}>
                            {/* Search - Desktop Only */}
                            <InputGroup maxW='400px' display={{ base: 'none', lg: 'block' }}>
                                <InputLeftElement pointerEvents='none'>
                                    <Search size={18} color='gray' />
                                </InputLeftElement>
                                <Input
                                    placeholder='Search pairs...'
                                    bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
                                    border='2px solid'
                                    borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200'}
                                    _hover={{
                                        borderColor: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.300',
                                    }}
                                    _focus={{
                                        borderColor: 'brand.500',
                                        boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                                    }}
                                    borderRadius='xl'
                                    fontSize='sm'
                                    fontWeight='600'
                                />
                            </InputGroup>

                            {/* Notification Button */}
                            <IconButton
                                aria-label='Notifications'
                                icon={<Bell size={20} />}
                                variant='ghost'
                                size='lg'
                                borderRadius='xl'
                                _hover={{
                                    bg: colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
                                    transform: 'scale(1.05)',
                                }}
                                position='relative'
                                transition='all 0.2s'
                                display={{ base: 'none', sm: 'flex' }}
                            >
                                <Box
                                    position='absolute'
                                    top={2}
                                    right={2}
                                    w={2.5}
                                    h={2.5}
                                    bg='red.500'
                                    borderRadius='full'
                                    boxShadow='0 0 8px rgba(244, 67, 54, 0.6)'
                                />
                            </IconButton>

                            {/* Theme Toggle */}
                            <IconButton
                                aria-label='Toggle color mode'
                                icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                onClick={toggleColorMode}
                                variant='ghost'
                                size='lg'
                                borderRadius='xl'
                                _hover={{
                                    bg: colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50',
                                    transform: 'scale(1.05)',
                                }}
                                className='pulse-glow'
                                transition='all 0.2s'
                            />
                        </HStack>
                    </Flex>
                </Container>
            </MotionFlex>

            {/* Mobile Drawer Menu */}
            <Drawer isOpen={isOpen} placement='left' onClose={onClose} size='xs'>
                <DrawerOverlay />
                <DrawerContent bg={colorMode === 'dark' ? 'bg-primary' : 'white'}>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                borderRadius='lg'
                                bgGradient='linear(to-br, brand.400, purple.500)'
                            >
                                <Icon as={Sparkles} boxSize={5} color='white' />
                            </Box>
                            <VStack align='start' spacing={0}>
                                <Text fontSize='lg' fontWeight='900' bgGradient='linear(to-r, brand.400, purple.500)' bgClip='text'>
                                    ALL Exchange
                                </Text>
                                <Text fontSize='xs' color='text-tertiary'>PREMIUM TRADING</Text>
                            </VStack>
                        </HStack>
                    </DrawerHeader>

                    <DrawerBody pt={4}>
                        <VStack spacing={2} align='stretch'>
                            {navItems.map((item) => (
                                <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }} onClick={onClose}>
                                    {({ isActive }) => (
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
                                        >
                                            <Icon as={item.icon} boxSize={5} />
                                            <Text fontWeight={isActive ? 'bold' : 'medium'}>{item.name}</Text>
                                        </HStack>
                                    )}
                                </NavLink>
                            ))}

                            <Divider my={4} />
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};
