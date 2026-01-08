import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
    Box, Grid, Heading, Text, VStack, HStack, Badge, Table, Thead, Tbody, Tr, Th, Td,
    useColorMode, Stat, StatLabel, StatNumber, StatHelpText, IconButton, useToast
} from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';
import { Users, DollarSign, Bell, TrendingUp, Trash2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const AdminDashboard = () => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPortfolioValue: 0,
        activeAlerts: 0,
        totalTransactions: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Get total users
            const { count: userCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            // Get active alerts
            const { count: alertCount } = await supabase
                .from('price_alerts')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            // Get total transactions
            const { count: txCount } = await supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true });

            // Get all users with details
            const { data: usersData } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            setStats({
                totalUsers: userCount || 0,
                activeAlerts: alertCount || 0,
                totalTransactions: txCount || 0,
                totalPortfolioValue: 0
            });

            setUsers(usersData || []);
        } catch (error) {
            console.error('Error loading admin data:', error);
            toast({
                title: 'Error loading data',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase.auth.admin.deleteUser(userId);

            if (error) throw error;

            toast({
                title: 'User deleted',
                status: 'success',
                duration: 3000,
            });

            loadData();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Error deleting user',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    const toggleAdmin = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';

            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            toast({
                title: 'Role updated',
                description: `User is now ${newRole}`,
                status: 'success',
                duration: 3000,
            });

            loadData();
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: 'Error updating role',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    return (
        <VStack spacing={6} align='stretch'>
            {/* Header */}
            <HStack justify='space-between'>
                <Box>
                    <Heading size='xl' className='gradient-text'>Admin Dashboard</Heading>
                    <Text color='gray.400'>Manage users and system data</Text>
                </Box>
                <Badge colorScheme='purple' fontSize='lg' px={4} py={2} borderRadius='full'>
                    <HStack spacing={2}>
                        <Shield size={18} />
                        <Text>ADMIN</Text>
                    </HStack>
                </Badge>
            </HStack>

            {/* Stats Grid */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <Stat>
                            <HStack spacing={4}>
                                <Box p={3} borderRadius='lg' bg='brand.500'>
                                    <Users size={24} color='white' />
                                </Box>
                                <Box>
                                    <StatLabel color='gray.400'>Total Users</StatLabel>
                                    <StatNumber fontSize='2xl'>{stats.totalUsers}</StatNumber>
                                </Box>
                            </HStack>
                        </Stat>
                    </Card>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <Stat>
                            <HStack spacing={4}>
                                <Box p={3} borderRadius='lg' bg='green.500'>
                                    <TrendingUp size={24} color='white' />
                                </Box>
                                <Box>
                                    <StatLabel color='gray.400'>Transactions</StatLabel>
                                    <StatNumber fontSize='2xl'>{stats.totalTransactions}</StatNumber>
                                </Box>
                            </HStack>
                        </Stat>
                    </Card>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <Stat>
                            <HStack spacing={4}>
                                <Box p={3} borderRadius='lg' bg='orange.500'>
                                    <Bell size={24} color='white' />
                                </Box>
                                <Box>
                                    <StatLabel color='gray.400'>Active Alerts</StatLabel>
                                    <StatNumber fontSize='2xl'>{stats.activeAlerts}</StatNumber>
                                </Box>
                            </HStack>
                        </Stat>
                    </Card>
                </MotionBox>

                <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <Stat>
                            <HStack spacing={4}>
                                <Box p={3} borderRadius='lg' bg='purple.500'>
                                    <DollarSign size={24} color='white' />
                                </Box>
                                <Box>
                                    <StatLabel color='gray.400'>Portfolio Value</StatLabel>
                                    <StatNumber fontSize='2xl'>${stats.totalPortfolioValue.toFixed(2)}</StatNumber>
                                </Box>
                            </HStack>
                        </Stat>
                    </Card>
                </MotionBox>
            </Grid>

            {/* Users Table */}
            <Card>
                <VStack align='stretch' spacing={4}>
                    <Heading size='md'>All Users</Heading>
                    <Box overflowX='auto'>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Email</Th>
                                    <Th>Name</Th>
                                    <Th>Role</Th>
                                    <Th>Created</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {users.map(user => (
                                    <Tr key={user.id}>
                                        <Td>{user.email}</Td>
                                        <Td>{user.full_name || '-'}</Td>
                                        <Td>
                                            <Badge colorScheme={user.role === 'admin' ? 'purple' : 'gray'}>
                                                {user.role || 'user'}
                                            </Badge>
                                        </Td>
                                        <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    size='sm'
                                                    icon={<Shield size={16} />}
                                                    onClick={() => toggleAdmin(user.id, user.role)}
                                                    colorScheme={user.role === 'admin' ? 'gray' : 'purple'}
                                                    aria-label='Toggle admin'
                                                    title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                                                />
                                                <IconButton
                                                    size='sm'
                                                    icon={<Trash2 size={16} />}
                                                    onClick={() => deleteUser(user.id)}
                                                    colorScheme='red'
                                                    variant='ghost'
                                                    aria-label='Delete user'
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Card>
        </VStack>
    );
};
