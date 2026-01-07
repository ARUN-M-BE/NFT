import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    const login = async (email, password) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: '1',
                    email,
                    name: email.split('@')[0],
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    createdAt: new Date().toISOString(),
                };
                setUser(mockUser);
                resolve(mockUser);
            }, 1000);
        });
    };

    const signup = async (email, password, name) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: Date.now().toString(),
                    email,
                    name,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    createdAt: new Date().toISOString(),
                };
                setUser(mockUser);
                resolve(mockUser);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
