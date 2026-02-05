import apiClient from './client';
import { AuthResponse, User } from '../types';

export const authApi = {
    register: async (data: { email: string; password: string; name: string; role?: string }): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
        const response = await apiClient.get<{ user: User }>('/api/auth/me');
        return response.data;
    },
};
