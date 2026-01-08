import { supabase } from '@/lib/supabaseClient';

export const socialService = {
    /**
     * Get Leaderboard Data
     * Fetches top traders sorted by profit
     */
    async getLeaderboard(period = 'all_time') {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
        id, username, full_name, avatar_url, 
        total_profit, win_rate, total_trades, followers_count
      `)
            .eq('is_public', true)
            .order('total_profit', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data;
    },

    /**
     * Get User Profile
     */
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Follow a user
     */
    async followUser(followerId, followingId) {
        const { data, error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                following_id: followingId
            });

        if (error) throw error;
        return data;
    },

    /**
     * Check if following
     */
    async checkIsFollowing(followerId, followingId) {
        const { data, error } = await supabase
            .from('follows')
            .select('is_copying')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
        return data;
    },

    /**
     * Enable Copy Trading
     */
    async startCopying(followerId, followingId, amount) {
        const { data, error } = await supabase
            .from('follows')
            .update({
                is_copying: true,
                copy_amount: amount
            })
            .eq('follower_id', followerId)
            .eq('following_id', followingId);

        if (error) throw error;
        return data;
    }
};
