import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import {
    Box, VStack, HStack, Heading, Text, Input, Button, Avatar,
    FormControl, FormLabel, useToast, useColorMode, Grid, Stat,
    StatLabel, StatNumber, StatHelpText, Divider
} from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';
import { User, Mail, Calendar, Edit2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const UserProfile = () => {
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    const toast = useToast();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        holdings: 0,
        watchlist: 0,
        alerts: 0,
        transactions: 0
    });

    useEffect(() => {
        if (user) {
            loadProfile();
            loadStats();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            setProfile(data);
            setFullName(data?.full_name || '');
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const [holdings, watchlist, alerts, transactions] = await Promise.all([
                supabase.from('user_portfolio').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('user_watchlist').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('price_alerts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            ]);

            setStats({
                holdings: holdings.count || 0,
                watchlist: watchlist.count || 0,
                alerts: alerts.count || 0,
                transactions: transactions.count || 0
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (error) throw error;

            toast({
                title: 'Profile updated',
                status: 'success',
                duration: 3000,
            });

            setEditing(false);
            loadProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error updating profile',
                description: error.message,
                status: 'error',
                duration: 5000,
            });
        }
    };

    if (loading) return <Text>Loading...</Text>;

    return (
        <VStack spacing={6} align='stretch'>
            <Heading size='xl' className='gradient-text'>My Profile</Heading>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                <Card>
                    <Stat>
                        <StatLabel>Holdings</StatLabel>
                        <StatNumber>{stats.holdings}</StatNumber>
                        <StatHelpText>Portfolio items</StatHelpText>
                    </Stat>
                </Card>
                <Card>
                    <Stat>
                        <StatLabel>Watchlist</StatLabel>
                        <StatNumber>{stats.watchlist}</StatNumber>
                        <StatHelpText>Tracked assets</StatHelpText>
                    </Stat>
                </Card>
                <Card>
                    <Stat>
                        <StatLabel>Alerts</StatLabel>
                        <StatNumber>{stats.alerts}</StatNumber>
                        <StatHelpText>Price alerts</StatHelpText>
                    </Stat>
                </Card>
                <Card>
                    <Stat>
                        <StatLabel>Transactions</StatLabel>
                        <StatNumber>{stats.transactions}</StatNumber>
                        <StatHelpText>Total trades</StatHelpText>
                    </Stat>
                </Card>
            </Grid>

            <Card>
                <VStack spacing={6} align='stretch'>
                    <HStack justify='space-between'>
                        <Heading size='md'>Profile Information</Heading>
                        <Button
                            leftIcon={editing ? <Save size={18} /> : <Edit2 size={18} />}
                            onClick={() => editing ? handleSave() : setEditing(true)}
                            colorScheme='brand'
                            size='sm'
                        >
                            {editing ? 'Save' : 'Edit'}
                        </Button>
                    </HStack>

                    <Divider />

                    <HStack spacing={6}>
                        <Avatar size='xl' name={profile?.full_name || profile?.email} />
                        <VStack align='start' spacing={4} flex={1}>
                            <FormControl>
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    isDisabled={!editing}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input value={profile?.email} isDisabled />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Role</FormLabel>
                                <Input value={profile?.role || 'user'} isDisabled />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Member Since</FormLabel>
                                <Input
                                    value={new Date(profile?.created_at).toLocaleDateString()}
                                    isDisabled
                                />
                            </FormControl>
                        </VStack>
                    </HStack>
                </VStack>
            </Card>
        </VStack>
    );
};
