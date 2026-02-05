import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useTicketStore } from '../store/ticket.store';
import { Plus, Filter } from 'lucide-react';
import './TicketListPage.css';

export default function TicketListPage() {
    const { user } = useAuthStore();
    const { tickets, fetchTickets, createTicket, isLoading } = useTicketStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchTickets({ status: filterStatus || undefined });
    }, [fetchTickets, filterStatus]);

    const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await createTicket({
                subject: formData.get('subject') as string,
                description: formData.get('description') as string,
                priority: formData.get('priority') as string,
            });
            setShowCreateModal(false);
            e.currentTarget.reset();
        } catch (error) {
            // Error handled by store
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Tickets</h1>
                    <p className="text-secondary">Manage and track support tickets</p>
                </div>
                <div className="flex gap-md">
                    <select
                        className="form-select filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    {user?.role === 'CUSTOMER' && (
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} />
                            New Ticket
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="empty-state">
                    <p>No tickets found</p>
                </div>
            ) : (
                <div className="tickets-grid">
                    {tickets.map((ticket) => (
                        <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="ticket-card">
                            <div className="ticket-card-header">
                                <span className="ticket-number">{ticket.ticketNumber}</span>
                                <span className={`badge badge-${getStatusColor(ticket.status)}`}>
                                    {ticket.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h3 className="ticket-card-title">{ticket.subject}</h3>
                            <p className="ticket-card-description">{ticket.description}</p>
                            <div className="ticket-card-footer">
                                <div className="ticket-card-meta">
                                    <span className={`badge badge-${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                    <span className="text-secondary">{ticket._count?.messages || 0} messages</span>
                                </div>
                                <span className="text-secondary text-sm">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Ticket</h2>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-input"
                                        placeholder="Brief description of your issue"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        placeholder="Provide detailed information about your issue"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select name="priority" className="form-select">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? <div className="spinner" /> : 'Create Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'URGENT':
            return 'error';
        case 'HIGH':
            return 'warning';
        case 'MEDIUM':
            return 'info';
        case 'LOW':
            return 'neutral';
        default:
            return 'neutral';
    }
}
