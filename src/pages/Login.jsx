import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, VStack, Heading, Text, Input, Button, FormControl,
    FormLabel, useToast, useColorMode, HStack, Divider,
    InputGroup, InputLeftElement, InputRightElement, IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Common/Card';
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

const MotionBox = motion(Box);

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { colorMode } = useColorMode();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast({
                title: 'Login failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Welcome back!',
                description: 'Successfully signed in',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <Box
            minH='100vh'
            display='flex'
            alignItems='center'
            justifyContent='center'
            p={4}
            bg={colorMode === 'dark' ? 'bg-primary' : 'gray.50'}
        >
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                w='full'
                maxW='md'
            >
                <Card>
                    <VStack spacing={6} align='stretch'>
                        {/* Header */}
                        <VStack spacing={2}>
                            <Box
                                p={3}
                                borderRadius='xl'
                                bgGradient='linear(to-br, brand.400, purple.500)'
                                boxShadow='0 4px 14px rgba(33, 150, 243, 0.4)'
                            >
                                <Sparkles size={32} color='white' />
                            </Box>
                            <Heading size='xl' className='gradient-text'>Welcome Back</Heading>
                            <Text color='gray.400'>Sign in to your account</Text>
                        </VStack>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents='none'>
                                            <Mail size={18} color='gray' />
                                        </InputLeftElement>
                                        <Input
                                            type='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder='your@email.com'
                                            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
                                        />
                                    </InputGroup>
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents='none'>
                                            <Lock size={18} color='gray' />
                                        </InputLeftElement>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='••••••••'
                                            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
                                        />
                                        <InputRightElement>
                                            <IconButton
                                                size='sm'
                                                variant='ghost'
                                                icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <Button
                                    type='submit'
                                    colorScheme='brand'
                                    width='full'
                                    size='lg'
                                    isLoading={loading}
                                    leftIcon={<LogIn size={20} />}
                                >
                                    Sign In
                                </Button>

                                <Button
                                    onClick={() => {
                                        setEmail('demo@allexchange.com');
                                        setPassword('demo123456');
                                    }}
                                    variant='outline'
                                    width='full'
                                    size='lg'
                                    colorScheme='purple'
                                >
                                    Use Demo Account
                                </Button>
                            </VStack>
                        </form>

                        <Divider />

                        {/* Demo Credentials Info */}
                        <Box
                            p={3}
                            borderRadius='lg'
                            bg={colorMode === 'dark' ? 'purple.900' : 'purple.50'}
                            borderWidth='1px'
                            borderColor={colorMode === 'dark' ? 'purple.700' : 'purple.200'}
                        >
                            <Text fontSize='sm' fontWeight='bold' mb={1} color={colorMode === 'dark' ? 'purple.200' : 'purple.800'}>
                                Demo Credentials
                            </Text>
                            <Text fontSize='xs' color={colorMode === 'dark' ? 'purple.300' : 'purple.600'}>
                                Email: demo@allexchange.com
                            </Text>
                            <Text fontSize='xs' color={colorMode === 'dark' ? 'purple.300' : 'purple.600'}>
                                Password: demo123456
                            </Text>
                        </Box>

                        {/* Footer Links */}
                        <VStack spacing={2}>
                            <HStack justify='center' spacing={1}>
                                <Text color='gray.400' fontSize='sm'>Don't have an account?</Text>
                                <Link to='/signup'>
                                    <Text color='brand.500' fontWeight='bold' fontSize='sm'>Sign Up</Text>
                                </Link>
                            </HStack>
                            <Link to='/forgot-password'>
                                <Text color='gray.400' fontSize='sm' _hover={{ color: 'brand.500' }}>
                                    Forgot password?
                                </Text>
                            </Link>
                        </VStack>
                    </VStack>
                </Card>
            </MotionBox>
        </Box>
    );
};
