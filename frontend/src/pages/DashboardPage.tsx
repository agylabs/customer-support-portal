import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { useTicketStore } from '../store/ticket.store';
import { Ticket, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { tickets, fetchTickets } = useTicketStore();

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === 'OPEN').length,
        inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p className="text-secondary">Welcome back, {user?.name}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-icon-primary">
                        <Ticket size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Tickets</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-warning">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Open</div>
                        <div className="stat-value">{stats.open}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-info">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">In Progress</div>
                        <div className="stat-value">{stats.inProgress}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon stat-icon-success">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Resolved</div>
                        <div className="stat-value">{stats.resolved}</div>
                    </div>
                </div>
            </div>

            <div className="recent-tickets">
                <h2>Recent Tickets</h2>
                <div className="ticket-list">
                    {tickets.slice(0, 5).map((ticket) => (
                        <a key={ticket.id} href={`/tickets/${ticket.id}`} className="ticket-item">
                            <div className="ticket-item-header">
                                <span className="ticket-number">{ticket.ticketNumber}</span>
                                <span className={`badge badge-${getStatusColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="ticket-item-title">{ticket.subject}</div>
                            <div className="ticket-item-meta">
                                <span>{ticket.customer.name}</span>
                                <span>•</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'OPEN':
            return 'warning';
        case 'IN_PROGRESS':
            return 'info';
        case 'RESOLVED':
        case 'CLOSED':
            return 'success';
        default:
            return 'neutral';
    }
}
