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
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

const MotionBox = motion(Box);

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const { colorMode } = useColorMode();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast({
                title: 'Invalid password',
                description: 'Password must be at least 6 characters',
                status: 'error',
                duration: 5000,
            });
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            toast({
                title: 'Signup failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Account created!',
                description: 'Please check your email to verify your account',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            navigate('/login');
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
                            <Heading size='xl' className='gradient-text'>Create Account</Heading>
                            <Text color='gray.400'>Join ALL Exchange today</Text>
                        </VStack>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Full Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents='none'>
                                            <User size={18} color='gray' />
                                        </InputLeftElement>
                                        <Input
                                            type='text'
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder='John Doe'
                                            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
                                        />
                                    </InputGroup>
                                </FormControl>

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
                                    <Text fontSize='xs' color='gray.500' mt={1}>
                                        Must be at least 6 characters
                                    </Text>
                                </FormControl>

                                <Button
                                    type='submit'
                                    colorScheme='brand'
                                    width='full'
                                    size='lg'
                                    isLoading={loading}
                                    leftIcon={<UserPlus size={20} />}
                                >
                                    Create Account
                                </Button>
                            </VStack>
                        </form>

                        <Divider />

                        {/* Footer Links */}
                        <HStack justify='center' spacing={1}>
                            <Text color='gray.400' fontSize='sm'>Already have an account?</Text>
                            <Link to='/login'>
                                <Text color='brand.500' fontWeight='bold' fontSize='sm'>Sign In</Text>
                            </Link>
                        </HStack>
                    </VStack>
                </Card>
            </MotionBox>
        </Box>
    );
};
