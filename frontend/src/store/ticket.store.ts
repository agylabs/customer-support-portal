import { create } from 'zustand';
import { Ticket } from '../types';
import { ticketApi } from '../api/ticket.api';

interface TicketState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    isLoading: boolean;
    error: string | null;
    fetchTickets: (params?: any) => Promise<void>;
    fetchTicket: (id: string) => Promise<void>;
    createTicket: (data: any) => Promise<Ticket>;
    updateTicket: (id: string, data: any) => Promise<void>;
    deleteTicket: (id: string) => Promise<void>;
    assignTicket: (id: string, agentId: string) => Promise<void>;
}

export const useTicketStore = create<TicketState>((set, get) => ({
    tickets: [],
    currentTicket: null,
    isLoading: false,
    error: null,

    fetchTickets: async (params?: any) => {
        set({ isLoading: true, error: null });
        try {
            const { tickets } = await ticketApi.getTickets(params);
            set({ tickets, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch tickets';
            set({ error: errorMessage, isLoading: false });
        }
    },

    fetchTicket: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const { ticket } = await ticketApi.getTicket(id);
            set({ currentTicket: ticket, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch ticket';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createTicket: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const { ticket } = await ticketApi.createTicket(data);
            set((state) => ({
                tickets: [ticket, ...state.tickets],
                isLoading: false,
            }));
            return ticket;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to create ticket';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    updateTicket: async (id: string, data: any) => {
        set({ isLoading: true, error: null });
        try {
            const { ticket } = await ticketApi.updateTicket(id, data);
            set((state) => ({
                tickets: state.tickets.map((t) => (t.id === id ? ticket : t)),
                currentTicket: state.currentTicket?.id === id ? ticket : state.currentTicket,
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to update ticket';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    deleteTicket: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await ticketApi.deleteTicket(id);
            set((state) => ({
                tickets: state.tickets.filter((t) => t.id !== id),
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to delete ticket';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    assignTicket: async (id: string, agentId: string) => {
        set({ isLoading: true, error: null });
        try {
            const { ticket } = await ticketApi.assignTicket(id, agentId);
            set((state) => ({
                tickets: state.tickets.map((t) => (t.id === id ? ticket : t)),
                currentTicket: state.currentTicket?.id === id ? ticket : state.currentTicket,
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to assign ticket';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },
}));
