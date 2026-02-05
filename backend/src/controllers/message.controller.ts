import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createMessageSchema } from '../utils/validators';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { ticketId } = req.params;

        // Verify ticket exists and user has access
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
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

        const messages = await prisma.message.findMany({
            where: { ticketId },
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
        });

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function createMessage(req: AuthRequest, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { ticketId } = req.params;
        const validatedData = createMessageSchema.parse(req.body);

        // Verify ticket exists and user has access
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
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

        // Determine message type based on user role
        let messageType = validatedData.type;
        if (!messageType) {
            messageType = req.user.role === 'CUSTOMER' ? 'CUSTOMER' : 'AGENT';
        }

        const message = await prisma.message.create({
            data: {
                content: validatedData.content,
                type: messageType,
                ticketId,
                authorId: req.user.userId,
            },
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
        });

        // Update ticket's updatedAt timestamp
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() },
        });

        res.status(201).json({ message });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        console.error('Create message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
