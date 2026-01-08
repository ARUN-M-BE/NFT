import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setIsAdmin(data?.role === 'admin');
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            checkAdmin();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return <LoadingSpinner message='Checking permissions...' />;
    }

    if (!user || !isAdmin) {
        return <Navigate to='/' replace />;
    }

    return children;
};
