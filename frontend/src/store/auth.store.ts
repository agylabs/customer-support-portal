import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../api/auth.api';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { user, token } = await authApi.login({ email, password });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
            const { user, token } = await authApi.register({ email, password, name });
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ user, token, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ user: null, token: null });
            return;
        }

        try {
            const { user } = await authApi.getCurrentUser();
            set({ user, token });
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null });
        }
    },
}));
