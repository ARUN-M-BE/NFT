import { useState, useEffect } from 'react';
import {
    Box, VStack, HStack, Text, Heading, Avatar, Button,
    SimpleGrid, Badge, useColorMode, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
    Table, Thead, Tbody, Tr, Th, Td, IconButton, Tooltip
} from '@chakra-ui/react';
import { Card } from '@/components/Common/Card';
import { socialService } from '@/services/socialService';
import { useAuth } from '@/context/AuthContext';
import { Users, TrendingUp, Award, Copy, Globe, Twitter, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export const SocialPage = () => {
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    const toast = useToast();
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await socialService.getLeaderboard();
            setLeaderboard(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            setLoading(false);
            // Fallback mock data if DB is empty
            setLeaderboard(mockLeaderboard);
        }
    };

    const handleFollow = async (traderId) => {
        if (!user) {
            toast({ title: 'Please login to follow traders', status: 'warning' });
            return;
        }
        try {
            await socialService.followUser(user.id, traderId);
            toast({ title: 'Followed user!', status: 'success' });
            loadLeaderboard(); // Refresh stats
        } catch (error) {
            toast({ title: 'Error following user', description: error.message, status: 'error' });
        }
    };

    return (
        <Box p={6} className='space-y-6'>
            {/* Hero Section */}
            <Box textAlign='center' mb={8}>
                <Heading
                    size='2xl'
                    mb={4}
                    bgGradient='linear(to-r, #00C6FF, #0072FF)'
                    bgClip='text'
                    letterSpacing='tight'
                >
                    Social Trading Arena
                </Heading>
                <Text fontSize='xl' color='text.secondary' maxW='2xl' mx='auto'>
                    Follow top performing traders, copy their strategies, and earn together.
                </Text>
            </Box>

            <Tabs variant='soft-rounded' colorScheme='blue' align='center'>
                <TabList mb={8}>
                    <Tab><HStack><Trophy size={18} /><Text>Leaderboard</Text></HStack></Tab>
                    <Tab><HStack><Users size={18} /><Text>Following</Text></HStack></Tab>
                    <Tab><HStack><Copy size={18} /><Text>Copy Trading</Text></HStack></Tab>
                </TabList>

                <TabPanels>
                    {/* Leaderboard Tab */}
                    <TabPanel>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {leaderboard.map((trader, index) => (
                                <TraderCard
                                    key={trader.id}
                                    trader={trader}
                                    rank={index + 1}
                                    onFollow={() => handleFollow(trader.id)}
                                    colorMode={colorMode}
                                />
                            ))}
                        </SimpleGrid>
                    </TabPanel>

                    <TabPanel>
                        <Text textAlign='center' color='text.muted'>You are not following anyone yet.</Text>
                    </TabPanel>

                    <TabPanel>
                        <Text textAlign='center' color='text.muted'>Start copying traders from the Leaderboard.</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

const TraderCard = ({ trader, rank, onFollow, colorMode }) => {
    return (
        <MotionCard
            whileHover={{ y: -5 }}
            borderWidth='1px'
            borderColor={rank <= 3 ? 'warning.400' : 'transparent'}
            position='relative'
            overflow='hidden'
        >
            {/* Rank Badge */}
            <Box
                position='absolute'
                top={0}
                right={0}
                bg={rank === 1 ? 'yellow.400' : rank === 2 ? 'gray.300' : rank === 3 ? 'orange.400' : 'transparent'}
                color='black'
                px={3}
                py={1}
                borderBottomLeftRadius='lg'
                fontWeight='bold'
                display={rank <= 3 ? 'block' : 'none'}
            >
                #{rank}
            </Box>

            <VStack spacing={4} align='start'>
                <HStack spacing={4} w='full'>
                    <Avatar size='lg' src={trader.avatar_url} name={trader.username} />
                    <VStack align='start' spacing={0} flex={1}>
                        <Heading size='md'>{trader.username || trader.full_name}</Heading>
                        <HStack spacing={1} color='text.muted'>
                            <Globe size={14} />
                            <Text fontSize='xs'>Global Trader</Text>
                        </HStack>
                    </VStack>
                </HStack>

                <SimpleGrid columns={3} w='full' gap={4} py={2}>
                    <StatBox label='Win Rate' value={`${trader.win_rate}%`} color='green.400' />
                    <StatBox label='Profit' value={`+${trader.total_profit}%`} color='blue.400' />
                    <StatBox label='Followers' value={trader.followers_count} color='purple.400' />
                </SimpleGrid>

                <HStack w='full' spacing={3}>
                    <Button
                        leftIcon={<Users size={18} />}
                        variant='outline'
                        flex={1}
                        onClick={onFollow}
                    >
                        Follow
                    </Button>
                    <Button
                        leftIcon={<Copy size={18} />}
                        colorScheme='blue'
                        flex={1}
                    >
                        Copy
                    </Button>
                </HStack>
            </VStack>
        </MotionCard>
    );
};

const StatBox = ({ label, value, color }) => (
    <VStack spacing={0} bg='whiteAlpha.50' p={2} borderRadius='md'>
        <Text fontSize='xs' color='text.muted'>{label}</Text>
        <Text fontWeight='bold' color={color}>{value}</Text>
    </VStack>
);

// Fallback Mock Data
const mockLeaderboard = [
    { id: '1', username: 'CryptoKing', full_name: 'Alex T', avatar_url: '', win_rate: 85, total_profit: 3240, followers_count: 1205 },
    { id: '2', username: 'SatoshiN', full_name: 'Satoshi N', avatar_url: '', win_rate: 78, total_profit: 2100, followers_count: 890 },
    { id: '3', username: 'ETH_Whale', full_name: 'Vitalik Fan', avatar_url: '', win_rate: 65, total_profit: 1540, followers_count: 650 },
    { id: '4', username: 'MoonWalker', full_name: 'Elon D', avatar_url: '', win_rate: 55, total_profit: 980, followers_count: 420 },
    { id: '5', username: 'DiamondHands', full_name: 'WSB Ape', avatar_url: '', win_rate: 45, total_profit: 450, followers_count: 310 },
];
