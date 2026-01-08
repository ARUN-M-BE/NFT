import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner message='Checking authentication...' />;
    }

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return children;
};
