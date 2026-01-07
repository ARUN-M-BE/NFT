import { Box, Container, Flex, HStack, IconButton, Text, useColorMode, Input, InputGroup, InputLeftElement, Badge, Kbd } from '@chakra-ui/react';
import { Moon, Sun, Search, Bell, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MotionFlex = motion(Flex);

export const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [showCommandPalette, setShowCommandPalette] = useState(false);

    return (
        <MotionFlex
            as='header'
            className='glass-card'
            px={6}
            py={4}
            mb={6}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            position='sticky'
            top={0}
            zIndex={100}
        >
            <Container maxW='container.2xl'>
                <Flex justify='space-between' align='center'>
                    <Flex align='center' gap={4}>
                        <Box className='float-animation'>
                            <Text fontSize='2xl' fontWeight='bold' className='gradient-text'>
                                ₿ ALL Exchange
                            </Text>
                        </Box>
                        <Badge colorScheme='green' fontSize='xs' px={2} py={1} borderRadius='full'>
                            Live
                        </Badge>
                    </Flex>

                    <HStack spacing={4}>
                        <InputGroup maxW='400px' display={{ base: 'none', md: 'block' }}>
                            <InputLeftElement pointerEvents='none'>
                                <Search size={18} color='gray' />
                            </InputLeftElement>
                            <Input
                                placeholder='Search symbols...'
                                bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                                border='1px solid'
                                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                                _hover={{ borderColor: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.300' }}
                                _focus={{
                                    borderColor: 'brand.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
                                }}
                            />
                        </InputGroup>

                        <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                            <Kbd fontSize='sm'>⌘</Kbd>
                            <Kbd fontSize='sm'>K</Kbd>
                        </HStack>

                        <IconButton
                            aria-label='Notifications'
                            icon={<Bell size={20} />}
                            variant='ghost'
                            _hover={{ bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                            position='relative'
                        >
                            <Box
                                position='absolute'
                                top={2}
                                right={2}
                                w={2}
                                h={2}
                                bg='red.500'
                                borderRadius='full'
                            />
                        </IconButton>

                        <IconButton
                            aria-label='Toggle color mode'
                            icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            onClick={toggleColorMode}
                            variant='ghost'
                            _hover={{ bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                            className='pulse-glow'
                        />
                    </HStack>
                </Flex>
            </Container>
        </MotionFlex>
    );
};
