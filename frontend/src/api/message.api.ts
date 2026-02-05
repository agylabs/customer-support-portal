import apiClient from './client';
import { Message } from '../types';

export const messageApi = {
    getMessages: async (ticketId: string): Promise<{ messages: Message[] }> => {
        const response = await apiClient.get<{ messages: Message[] }>(`/api/tickets/${ticketId}/messages`);
        return response.data;
    },

    createMessage: async (ticketId: string, data: { content: string; type?: string }): Promise<{ message: Message }> => {
        const response = await apiClient.post<{ message: Message }>(`/api/tickets/${ticketId}/messages`, data);
        return response.data;
    },
};
