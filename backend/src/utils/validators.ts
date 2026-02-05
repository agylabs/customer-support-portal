import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['ADMIN', 'AGENT', 'CUSTOMER']).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const createTicketSchema = z.object({
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    category: z.string().optional(),
});

export const updateTicketSchema = z.object({
    subject: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const createMessageSchema = z.object({
    content: z.string().min(1, 'Message content is required'),
    type: z.enum(['CUSTOMER', 'AGENT', 'SYSTEM', 'INTERNAL_NOTE']).optional(),
});

export const assignTicketSchema = z.object({
    agentId: z.string().cuid('Invalid agent ID'),
});
