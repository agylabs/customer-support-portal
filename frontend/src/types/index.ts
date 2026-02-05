export type UserRole = 'ADMIN' | 'AGENT' | 'CUSTOMER';
export type UserStatus = 'ONLINE' | 'AWAY' | 'OFFLINE';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type MessageType = 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'INTERNAL_NOTE';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    status: UserStatus;
    skills?: string[];
    createdAt: string;
    updatedAt?: string;
}

export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category?: string;
    tags: string[];
    sentiment?: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    customerId: string;
    customer: User;
    assignedAgentId?: string;
    assignedAgent?: User;
    messages?: Message[];
    _count?: {
        messages: number;
    };
}

export interface Message {
    id: string;
    content: string;
    type: MessageType;
    createdAt: string;
    ticketId: string;
    authorId: string;
    author: User;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiError {
    error: string;
    details?: any;
}
