# Customer Support Portal - AI-Powered Enterprise Support System

## Overview

An enterprise-grade customer support portal that demonstrates Google Antigravity's ability to build complex, AI-enhanced web applications. This application showcases intelligent ticket management, automated triage, real-time collaboration, and comprehensive analytics.

## Purpose

This demo highlights Antigravity's capabilities in:
- **Full-Stack Development**: Complete application from database to UI
- **AI Integration**: Natural incorporation of AI features throughout the user experience
- **Enterprise Patterns**: Authentication, authorization, real-time updates, and scalability
- **Modern UX**: Beautiful, responsive interface with premium design aesthetics
- **Production Ready**: Best practices, error handling, and deployment configuration

## Use Case

A modern customer support platform for enterprises to:
- Manage customer inquiries across multiple channels
- Automatically triage and route tickets using AI
- Provide agents with intelligent response suggestions
- Track performance metrics and customer satisfaction
- Enable real-time collaboration between support agents

---

## Technical Architecture

### Architecture Pattern
**Monolithic Full-Stack Application** with clear separation of concerns:
- **Frontend**: React-based SPA with modern UI components
- **Backend**: Node.js/Express API server
- **Database**: PostgreSQL for relational data
- **Real-time**: WebSocket connections for live updates
- **AI Services**: Integration with Google AI APIs (Gemini)
- **Authentication**: JWT-based auth with role-based access control

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │  Ticket View │  │   Chat UI    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│              (Authentication & Routing)                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Ticket     │  │     User     │  │   Analytics  │
│   Service    │  │   Service    │  │   Service    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Tickets  │  │ Messages │  │Analytics │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    AI Services Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Triage AI  │  │  Sentiment   │  │   Response   │      │
│  │  (Gemini)    │  │  Analysis    │  │  Suggestions │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand (lightweight, modern)
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Vanilla CSS with CSS Variables (modern, flexible)
- **Real-time**: Socket.io client
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **Validation**: Zod
- **API Documentation**: OpenAPI/Swagger

### Database
- **Primary**: PostgreSQL 15+
- **Schema Management**: Prisma Migrations
- **Caching**: Redis (for sessions and real-time data)

### AI Integration
- **Primary AI**: Google Gemini API
- **Use Cases**:
  - Ticket classification and routing
  - Sentiment analysis
  - Response generation
  - Knowledge base search
  - Automated tagging

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Deployment**: Google Cloud Run
- **CI/CD**: GitHub Actions
- **Monitoring**: Google Cloud Monitoring
- **Secrets**: Google Secret Manager

---

## Key Features

### 1. **Intelligent Ticket Management**
- **AI-Powered Triage**: Automatic categorization and priority assignment
- **Smart Routing**: Route tickets to the best-suited agent based on expertise
- **Bulk Operations**: Handle multiple tickets efficiently
- **Custom Fields**: Flexible ticket metadata
- **SLA Tracking**: Monitor response and resolution times

### 2. **Multi-Channel Support**
- Email integration
- Live chat widget
- Web form submissions
- API for third-party integrations

### 3. **Real-Time Collaboration**
- Live ticket updates across all connected clients
- Agent presence indicators
- Internal notes and @mentions
- Ticket assignment notifications
- Real-time chat between agents and customers

### 4. **AI-Enhanced Agent Experience**
- **Response Suggestions**: AI-generated reply recommendations
- **Sentiment Analysis**: Real-time customer emotion detection
- **Knowledge Base Search**: Semantic search for relevant articles
- **Auto-Tagging**: Intelligent ticket categorization
- **Similar Tickets**: Find related issues and solutions

### 5. **Comprehensive Analytics**
- Performance dashboards
- Agent productivity metrics
- Customer satisfaction scores (CSAT)
- Response time analytics
- Ticket volume trends
- AI accuracy metrics

### 6. **User Management**
- Role-based access control (Admin, Agent, Customer)
- Team management
- Skill-based routing
- Agent availability status
- Permission management

---

## Data Models

### Core Entities

#### User
```typescript
{
  id: string
  email: string
  name: string
  role: 'admin' | 'agent' | 'customer'
  avatar?: string
  status: 'online' | 'away' | 'offline'
  skills?: string[]  // For agents
  createdAt: Date
  updatedAt: Date
}
```

#### Ticket
```typescript
{
  id: string
  ticketNumber: string  // e.g., "TKT-1234"
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  tags: string[]
  customerId: string
  assignedAgentId?: string
  aiSuggestions?: {
    category: string
    priority: string
    suggestedAgent?: string
    confidence: number
  }
  sentiment?: 'positive' | 'neutral' | 'negative'
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}
```

#### Message
```typescript
{
  id: string
  ticketId: string
  authorId: string
  content: string
  type: 'customer' | 'agent' | 'system' | 'internal_note'
  attachments?: Attachment[]
  aiGenerated: boolean
  createdAt: Date
}
```

#### Analytics
```typescript
{
  id: string
  date: Date
  ticketsCreated: number
  ticketsResolved: number
  averageResponseTime: number
  averageResolutionTime: number
  csatScore: number
  agentMetrics: {
    agentId: string
    ticketsHandled: number
    avgResponseTime: number
    csatScore: number
  }[]
}
```

---

## AI Integration Points

### 1. **Ticket Triage (On Creation)**
```typescript
// When a new ticket is created
const aiAnalysis = await analyzeTicket({
  subject: ticket.subject,
  description: ticket.description
})

// Returns:
{
  suggestedCategory: "Technical Issue",
  suggestedPriority: "high",
  suggestedAgent: "agent-123",
  tags: ["login", "authentication", "urgent"],
  sentiment: "frustrated",
  confidence: 0.89
}
```

### 2. **Response Suggestions (Real-time)**
```typescript
// As agent views a ticket
const suggestions = await generateResponseSuggestions({
  ticketHistory: messages,
  ticketContext: ticket,
  knowledgeBase: relevantArticles
})

// Returns multiple response options
[
  {
    response: "I understand you're having trouble...",
    tone: "empathetic",
    confidence: 0.92
  },
  {
    response: "Let me help you resolve this...",
    tone: "professional",
    confidence: 0.87
  }
]
```

### 3. **Sentiment Analysis (Continuous)**
```typescript
// On each customer message
const sentiment = await analyzeSentiment(message.content)

// Updates ticket sentiment score
// Alerts supervisor if sentiment drops significantly
```

### 4. **Knowledge Base Search**
```typescript
// Semantic search for relevant articles
const articles = await searchKnowledgeBase({
  query: ticket.description,
  category: ticket.category,
  limit: 5
})
```

---

## User Roles & Permissions

### Customer
- Create and view own tickets
- Send messages on own tickets
- View ticket history
- Rate support interactions

### Agent
- View assigned tickets
- Respond to tickets
- Update ticket status and priority
- Add internal notes
- Access AI suggestions
- View team performance

### Admin
- All agent permissions
- Manage users and teams
- Configure AI settings
- View all analytics
- Manage knowledge base
- System configuration

---

## UI/UX Highlights

### Design Principles
- **Modern & Clean**: Minimalist interface with focus on functionality
- **Dark Mode**: Full dark mode support with smooth transitions
- **Responsive**: Mobile-first design, works on all devices
- **Accessible**: WCAG 2.1 AA compliance
- **Fast**: Optimistic UI updates, skeleton loaders

### Key Screens

1. **Dashboard**: Overview with key metrics and recent activity
2. **Ticket List**: Filterable, sortable table with bulk actions
3. **Ticket Detail**: Full conversation view with AI suggestions panel
4. **Analytics**: Interactive charts and performance metrics
5. **Settings**: User preferences and system configuration

### Visual Features
- Smooth animations and transitions
- Real-time status indicators
- Toast notifications for important events
- Keyboard shortcuts for power users
- Drag-and-drop file uploads

---

## Development Roadmap

### Phase 1: Core Functionality (MVP)
- [ ] User authentication and authorization
- [ ] Basic ticket CRUD operations
- [ ] Simple messaging system
- [ ] Agent assignment
- [ ] Basic dashboard

### Phase 2: AI Integration
- [ ] AI-powered ticket triage
- [ ] Sentiment analysis
- [ ] Response suggestions
- [ ] Auto-tagging

### Phase 3: Real-Time Features
- [ ] WebSocket integration
- [ ] Live ticket updates
- [ ] Agent presence
- [ ] Real-time notifications

### Phase 4: Analytics & Reporting
- [ ] Performance dashboards
- [ ] Agent metrics
- [ ] Customer satisfaction tracking
- [ ] Export capabilities

### Phase 5: Advanced Features
- [ ] Knowledge base integration
- [ ] Multi-channel support
- [ ] Automated workflows
- [ ] Advanced AI features

---

## Deployment Architecture

### Local Development
```bash
docker-compose up
# Runs: PostgreSQL, Redis, API Server, Frontend Dev Server
```

### Production (Google Cloud Run)
- **Frontend**: Static build served via Cloud Run
- **Backend API**: Containerized Node.js app on Cloud Run
- **Database**: Cloud SQL (PostgreSQL)
- **Cache**: Cloud Memorystore (Redis)
- **AI**: Vertex AI / Gemini API
- **Storage**: Cloud Storage for attachments

### Environment Variables
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
GEMINI_API_KEY=...
FRONTEND_URL=https://...
```

---

## Success Metrics

This demo will be considered successful if it demonstrates:
- ✅ **Speed**: Built from scratch to deployment in minimal time
- ✅ **Quality**: Production-ready code with best practices
- ✅ **AI Value**: Clear, practical AI integration that adds real value
- ✅ **UX Excellence**: Beautiful, intuitive interface
- ✅ **Completeness**: End-to-end functionality including deployment

---

## Repository Information

- **Repository Name**: `customer-support-portal`
- **Organization**: `agylabs`
- **Visibility**: Public
- **License**: MIT
- **Topics**: `antigravity-demo`, `ai-support`, `customer-service`, `react`, `nodejs`, `gemini-ai`

---

*This demo is part of the Google Antigravity demonstration ecosystem, showcasing AI-powered application development.*
