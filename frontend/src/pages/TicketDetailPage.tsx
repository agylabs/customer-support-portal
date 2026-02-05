import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useTicketStore } from '../store/ticket.store';
import { messageApi } from '../api/message.api';
import { ArrowLeft, Send } from 'lucide-react';
import { Message } from '../types';
import './TicketDetailPage.css';

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { currentTicket, fetchTicket, updateTicket, isLoading } = useTicketStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTicket(id);
            loadMessages();
        }
    }, [id, fetchTicket]);

    const loadMessages = async () => {
        if (!id) return;
        try {
            const { messages: msgs } = await messageApi.getMessages(id);
            setMessages(msgs);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !id) return;

        setSending(true);
        try {
            const { message } = await messageApi.createMessage(id, { content: newMessage });
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (status: string) => {
        if (!id) return;
        try {
            await updateTicket(id, { status });
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (isLoading || !currentTicket) {
        return (
            <div className="page">
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading ticket...</p>
                </div>
            </div>
        );
    }

    const canUpdateStatus = user?.role === 'AGENT' || user?.role === 'ADMIN';

    return (
        <div className="page">
            <div className="ticket-detail-header">
                <button className="btn btn-secondary" onClick={() => navigate('/tickets')}>
                    <ArrowLeft size={18} />
                    Back to Tickets
                </button>
                {canUpdateStatus && (
                    <select
                        className="form-select"
                        value={currentTicket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="PENDING">Pending</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                )}
            </div>

            <div className="ticket-detail-content">
                <div className="ticket-info-card">
                    <div className="ticket-info-header">
                        <div>
                            <span className="ticket-number">{currentTicket.ticketNumber}</span>
                            <h1>{currentTicket.subject}</h1>
                        </div>
                        <div className="ticket-badges">
                            <span className={`badge badge-${getStatusColor(currentTicket.status)}`}>
                                {currentTicket.status.replace('_', ' ')}
                            </span>
                            <span className={`badge badge-${getPriorityColor(currentTicket.priority)}`}>
                                {currentTicket.priority}
                            </span>
                        </div>
                    </div>
                    <div className="ticket-meta-grid">
                        <div className="ticket-meta-item">
                            <span className="ticket-meta-label">Customer</span>
                            <span className="ticket-meta-value">{currentTicket.customer.name}</span>
                        </div>
                        <div className="ticket-meta-item">
                            <span className="ticket-meta-label">Created</span>
                            <span className="ticket-meta-value">
                                {new Date(currentTicket.createdAt).toLocaleString()}
                            </span>
                        </div>
                        {currentTicket.assignedAgent && (
                            <div className="ticket-meta-item">
                                <span className="ticket-meta-label">Assigned To</span>
                                <span className="ticket-meta-value">{currentTicket.assignedAgent.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="messages-container">
                    <h2>Conversation</h2>
                    <div className="messages-list">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.author.id === user?.id ? 'message-own' : 'message-other'}`}
                            >
                                <div className="message-avatar">
                                    {message.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="message-author">{message.author.name}</span>
                                        <span className="message-role badge badge-neutral">
                                            {message.author.role}
                                        </span>
                                        <span className="message-time">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="message-text">{message.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="message-input-form">
                        <textarea
                            className="form-textarea message-textarea"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            rows={3}
                        />
                        <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                            {sending ? <div className="spinner" /> : <><Send size={18} /> Send</>}
                        </button>
                    </form>
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
