import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createTicketSchema, updateTicketSchema, assignTicketSchema } from '../utils/validators';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Generate unique ticket number
async function generateTicketNumber(): Promise<string> {
    const count = await prisma.ticket.count();
    return `TKT-${(count + 1).toString().padStart(4, '0')}`;
}

export async function getTickets(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { status, priority, assignedToMe } = req.query;

        let where: any = {};

        // Role-based filtering
        if (req.user.role === 'CUSTOMER') {
            where.customerId = req.user.userId;
        } else if (req.user.role === 'AGENT') {
            if (assignedToMe === 'true') {
                where.assignedAgentId = req.user.userId;
            }
            // Agents can see all tickets, but typically filter to assigned ones
        }
        // Admins can see all tickets

        // Apply filters
        if (status) {
            where.status = status;
        }
        if (priority) {
            where.priority = priority;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                assignedAgent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: { messages: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ tickets });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                assignedAgent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                        skills: true,
                    },
                },
                messages: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                                role: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        // Authorization check
        if (req.user.role === 'CUSTOMER' && ticket.customerId !== req.user.userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        res.json({ ticket });
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const validatedData = createTicketSchema.parse(req.body);

        const ticketNumber = await generateTicketNumber();

        const ticket = await prisma.ticket.create({
            data: {
                ticketNumber,
                subject: validatedData.subject,
                description: validatedData.description,
                priority: validatedData.priority || 'MEDIUM',
                category: validatedData.category,
                customerId: req.user.userId,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        // Create initial message with the description
        await prisma.message.create({
            data: {
                content: validatedData.description,
                type: 'CUSTOMER',
                ticketId: ticket.id,
                authorId: req.user.userId,
            },
        });

        res.status(201).json({ ticket });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const validatedData = updateTicketSchema.parse(req.body);

        // Check if ticket exists and user has permission
        const existingTicket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!existingTicket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        // Customers can only update their own tickets and only certain fields
        if (req.user.role === 'CUSTOMER' && existingTicket.customerId !== req.user.userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const updateData: any = {};

        if (validatedData.subject) updateData.subject = validatedData.subject;
        if (validatedData.description) updateData.description = validatedData.description;
        if (validatedData.category) updateData.category = validatedData.category;
        if (validatedData.tags) updateData.tags = validatedData.tags;

        // Only agents and admins can update status and priority
        if (req.user.role !== 'CUSTOMER') {
            if (validatedData.status) updateData.status = validatedData.status;
            if (validatedData.priority) updateData.priority = validatedData.priority;

            // Set resolvedAt when status changes to RESOLVED or CLOSED
            if (validatedData.status === 'RESOLVED' || validatedData.status === 'CLOSED') {
                if (!existingTicket.resolvedAt) {
                    updateData.resolvedAt = new Date();
                }
            }
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data: updateData,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                assignedAgent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        res.json({ ticket });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function deleteTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
            return;
        }

        // Only admins or the ticket creator can delete
        if (req.user.role !== 'ADMIN' && ticket.customerId !== req.user.userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        await prisma.ticket.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete ticket error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function assignTicket(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { id } = req.params;
        const validatedData = assignTicketSchema.parse(req.body);

        // Verify agent exists and has AGENT or ADMIN role
        const agent = await prisma.user.findUnique({
            where: { id: validatedData.agentId },
        });

        if (!agent || (agent.role !== 'AGENT' && agent.role !== 'ADMIN')) {
            res.status(400).json({ error: 'Invalid agent ID' });
            return;
        }

        const ticket = await prisma.ticket.update({
            where: { id },
            data: {
                assignedAgentId: validatedData.agentId,
                status: 'IN_PROGRESS',
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                assignedAgent: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        res.json({ ticket });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        console.error('Assign ticket error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
