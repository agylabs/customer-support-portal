import apiClient from './client';
import { Ticket } from '../types';

export const ticketApi = {
    getTickets: async (params?: { status?: string; priority?: string; assignedToMe?: boolean }): Promise<{ tickets: Ticket[] }> => {
        const response = await apiClient.get<{ tickets: Ticket[] }>('/api/tickets', { params });
        return response.data;
    },

    getTicket: async (id: string): Promise<{ ticket: Ticket }> => {
        const response = await apiClient.get<{ ticket: Ticket }>(`/api/tickets/${id}`);
        return response.data;
    },

    createTicket: async (data: { subject: string; description: string; priority?: string; category?: string }): Promise<{ ticket: Ticket }> => {
        const response = await apiClient.post<{ ticket: Ticket }>('/api/tickets', data);
        return response.data;
    },

    updateTicket: async (id: string, data: Partial<Ticket>): Promise<{ ticket: Ticket }> => {
        const response = await apiClient.patch<{ ticket: Ticket }>(`/api/tickets/${id}`, data);
        return response.data;
    },

    deleteTicket: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/tickets/${id}`);
    },

    assignTicket: async (id: string, agentId: string): Promise<{ ticket: Ticket }> => {
        const response = await apiClient.post<{ ticket: Ticket }>(`/api/tickets/${id}/assign`, { agentId });
        return response.data;
    },
};
