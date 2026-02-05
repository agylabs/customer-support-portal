# Customer Support Portal

An enterprise-grade AI-powered customer support portal built with React, Node.js, and PostgreSQL.

## Features

- 🎫 **Intelligent Ticket Management** - Create, track, and manage support tickets
- 💬 **Real-time Messaging** - Communicate with customers in real-time
- 👥 **Role-based Access Control** - Admin, Agent, and Customer roles
- 📊 **Analytics Dashboard** - Track performance metrics and trends
- 🤖 **AI Integration** - Powered by Google Gemini for smart triage and suggestions
- 🎨 **Modern UI** - Beautiful, responsive interface with dark mode support

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for fast development
- Zustand for state management
- React Router for navigation
- Vanilla CSS with modern design system

### Backend
- Node.js + Express + TypeScript
- Prisma ORM with PostgreSQL
- JWT authentication
- RESTful API architecture

### Database
- PostgreSQL 15+
- Redis for caching

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agylabs/customer-support-portal.git
   cd customer-support-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:3001
   - Frontend on http://localhost:5173

### Default Users

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Agent Account:**
- Email: `agent@example.com`
- Password: `password123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `password123`

## Project Structure

```
customer-support-portal/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, etc.
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── index.ts        # App entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # App entry point
│   └── package.json
├── docker-compose.yml      # Local development services
└── package.json           # Workspace root
```

## Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run clean` - Clean all node_modules and build artifacts

### Backend
- `npm run dev` - Start backend in watch mode
- `npm run build` - Build backend for production
- `npm run start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Documentation

The API follows RESTful conventions and is available at `http://localhost:3001/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tickets
- `GET /api/tickets` - List tickets (with filters)
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Messages
- `GET /api/tickets/:ticketId/messages` - Get ticket messages
- `POST /api/tickets/:ticketId/messages` - Send message

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user

## Deployment

### Docker Build

```bash
# Build backend
cd backend
docker build -t customer-support-backend .

# Build frontend
cd frontend
docker build -t customer-support-frontend .
```

### Google Cloud Run

The application is configured for deployment to Google Cloud Run. See the deployment workflow in `.github/workflows/deploy.yml`

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass and code follows style guidelines
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Google Antigravity
