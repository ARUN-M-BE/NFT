import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
    Box, VStack, HStack, Heading, Text, Button, useToast, useColorMode,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Tabs, TabList, TabPanels, Tab, TabPanel, Table, Thead, Tbody, Tr, Th, Td,
    Badge, IconButton, useDisclosure
} from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';
import { Eye, Trash2, DollarSign, Star, Bell, TrendingUp } from 'lucide-react';

export const AdminUserData = () => {
    const { colorMode } = useColorMode();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState({
        portfolio: [],
        watchlist: [],
        alerts: [],
        transactions: []
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadUserData = async (userId) => {
        try {
            const [portfolio, watchlist, alerts, transactions] = await Promise.all([
                supabase.from('user_portfolio').select('*').eq('user_id', userId),
                supabase.from('user_watchlist').select('*').eq('user_id', userId),
                supabase.from('price_alerts').select('*').eq('user_id', userId),
                supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
            ]);

            setUserData({
                portfolio: portfolio.data || [],
                watchlist: watchlist.data || [],
                alerts: alerts.data || [],
                transactions: transactions.data || []
            });
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        await loadUserData(user.id);
        onOpen();
    };

    const deletePortfolioItem = async (id) => {
        if (!confirm('Delete this portfolio item?')) return;

        try {
            const { error } = await supabase
                .from('user_portfolio')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({ title: 'Portfolio item deleted', status: 'success', duration: 3000 });
            loadUserData(selectedUser.id);
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
        }
    };

    const deleteWatchlistItem = async (id) => {
        if (!confirm('Delete this watchlist item?')) return;

        try {
            const { error } = await supabase
                .from('user_watchlist')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({ title: 'Watchlist item deleted', status: 'success', duration: 3000 });
            loadUserData(selectedUser.id);
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
        }
    };

    const deleteAlert = async (id) => {
        if (!confirm('Delete this alert?')) return;

        try {
            const { error } = await supabase
                .from('price_alerts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({ title: 'Alert deleted', status: 'success', duration: 3000 });
            loadUserData(selectedUser.id);
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 5000 });
        }
    };

    return (
        <VStack spacing={6} align='stretch'>
            <Heading size='xl' className='gradient-text'>User Data Management</Heading>

            <Card>
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
                                    <IconButton
                                        size='sm'
                                        icon={<Eye size={16} />}
                                        onClick={() => handleViewUser(user)}
                                        colorScheme='brand'
                                        aria-label='View data'
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Card>

            {/* User Data Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
                <ModalOverlay />
                <ModalContent bg={colorMode === 'dark' ? 'bg-secondary' : 'white'}>
                    <ModalHeader>
                        {selectedUser?.full_name || selectedUser?.email}'s Data
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Tabs colorScheme='brand'>
                            <TabList>
                                <Tab><HStack><DollarSign size={16} /><Text>Portfolio ({userData.portfolio.length})</Text></HStack></Tab>
                                <Tab><HStack><Star size={16} /><Text>Watchlist ({userData.watchlist.length})</Text></HStack></Tab>
                                <Tab><HStack><Bell size={16} /><Text>Alerts ({userData.alerts.length})</Text></HStack></Tab>
                                <Tab><HStack><TrendingUp size={16} /><Text>Transactions ({userData.transactions.length})</Text></HStack></Tab>
                            </TabList>

                            <TabPanels>
                                {/* Portfolio Tab */}
                                <TabPanel>
                                    <Table size='sm'>
                                        <Thead>
                                            <Tr>
                                                <Th>Symbol</Th>
                                                <Th>Quantity</Th>
                                                <Th>Avg Buy Price</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {userData.portfolio.map(item => (
                                                <Tr key={item.id}>
                                                    <Td>{item.symbol}</Td>
                                                    <Td>{item.quantity}</Td>
                                                    <Td>${item.average_buy_price}</Td>
                                                    <Td>
                                                        <IconButton
                                                            size='xs'
                                                            icon={<Trash2 size={14} />}
                                                            onClick={() => deletePortfolioItem(item.id)}
                                                            colorScheme='red'
                                                            variant='ghost'
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>

                                {/* Watchlist Tab */}
                                <TabPanel>
                                    <Table size='sm'>
                                        <Thead>
                                            <Tr>
                                                <Th>Symbol</Th>
                                                <Th>Added</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {userData.watchlist.map(item => (
                                                <Tr key={item.id}>
                                                    <Td>{item.symbol}</Td>
                                                    <Td>{new Date(item.created_at).toLocaleDateString()}</Td>
                                                    <Td>
                                                        <IconButton
                                                            size='xs'
                                                            icon={<Trash2 size={14} />}
                                                            onClick={() => deleteWatchlistItem(item.id)}
                                                            colorScheme='red'
                                                            variant='ghost'
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>

                                {/* Alerts Tab */}
                                <TabPanel>
                                    <Table size='sm'>
                                        <Thead>
                                            <Tr>
                                                <Th>Symbol</Th>
                                                <Th>Condition</Th>
                                                <Th>Target Price</Th>
                                                <Th>Status</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {userData.alerts.map(alert => (
                                                <Tr key={alert.id}>
                                                    <Td>{alert.symbol}</Td>
                                                    <Td>{alert.condition}</Td>
                                                    <Td>${alert.target_price}</Td>
                                                    <Td>
                                                        <Badge colorScheme={alert.is_active ? 'green' : 'gray'}>
                                                            {alert.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <IconButton
                                                            size='xs'
                                                            icon={<Trash2 size={14} />}
                                                            onClick={() => deleteAlert(alert.id)}
                                                            colorScheme='red'
                                                            variant='ghost'
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>

                                {/* Transactions Tab */}
                                <TabPanel>
                                    <Table size='sm'>
                                        <Thead>
                                            <Tr>
                                                <Th>Type</Th>
                                                <Th>Symbol</Th>
                                                <Th>Quantity</Th>
                                                <Th>Price</Th>
                                                <Th>Total</Th>
                                                <Th>Date</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {userData.transactions.map(tx => (
                                                <Tr key={tx.id}>
                                                    <Td>
                                                        <Badge colorScheme={tx.type === 'buy' ? 'green' : 'red'}>
                                                            {tx.type}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{tx.symbol}</Td>
                                                    <Td>{tx.quantity}</Td>
                                                    <Td>${tx.price}</Td>
                                                    <Td>${tx.total}</Td>
                                                    <Td>{new Date(tx.created_at).toLocaleDateString()}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
};
