# TaskFlow - Real-Time Collaborative Task Management System

A modern, responsive task management application built with Next.js, TypeScript, and Tailwind CSS. This frontend application demonstrates advanced React patterns, authentication, state management, and real-time features.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication system
- Role-based access control (Admin/User)
- Protected routes and components
- Secure login/registration forms

### 📋 Task Management
- Create, read, update, and delete tasks
- Task assignment to users
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Due date management
- Advanced filtering and search

### 👥 User Management (Admin Only)
- User listing and management
- Role assignment
- User profile management

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful animations and transitions
- Clean, professional interface
- Dark mode support
- Loading states and error handling

### 🚀 Performance & Best Practices
- React Query for data fetching and caching
- Context API for state management
- TypeScript for type safety
- Optimized bundle size
- SEO-friendly

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + React Query
- **Authentication**: JWT (simulated)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Mock API**: JSON Server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Quick Start (No JSON Server Required)

The application works out of the box with localStorage fallback data:

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd task-management-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to: http://localhost:3000

### Full Setup with JSON Server (Optional)

For a more realistic API experience:

1. Follow steps 1-2 above

2. Start both JSON server and Next.js:
\`\`\`bash
# Start both JSON server and Next.js dev server
npm run dev:full

# Or start them separately:
# Terminal 1: JSON Server (Mock API)
npm run json-server

# Terminal 2: Next.js Development Server
npm run dev
\`\`\`

3. Open your browser and navigate to:
   - Frontend: http://localhost:3000
   - Mock API: http://localhost:3001

### Demo Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**User Account:**
- Email: user@example.com  
- Password: user123

## Project Structure

\`\`\`bash
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── tasks/             # Task management pages
│   ├── profile/           # User profile page
│   └── admin/             # Admin-only pages
├── components/            # Reusable components
├── contexts/              # React Context providers
├── lib/                   # Utility functions and API
├── __tests__/             # Test files
└── db.json               # Mock database for JSON Server
\`\`\`

## Key Features Implemented

### Authentication System
- Secure login/registration with form validation
- JWT token simulation with cookies
- Role-based route protection
- Automatic token refresh handling

### Task Management
- Full CRUD operations for tasks
- Real-time updates simulation
- Advanced filtering (status, priority, search)
- Task assignment to users
- Due date tracking

### State Management
- React Context for global state
- React Query for server state and caching
- Optimistic updates for better UX
- Error handling and loading states

### Responsive Design
- Mobile-first approach
- Collapsible sidebar navigation
- Adaptive layouts for all screen sizes
- Touch-friendly interactions

### Performance Optimizations
- Code splitting with Next.js
- Image optimization
- Lazy loading components
- Efficient re-rendering with React.memo

## Testing

Run the test suite:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

## Available Scripts

- \`npm run dev\` - Start Next.js development server
- \`npm run json-server\` - Start JSON Server mock API
- \`npm run dev:full\` - Start both servers concurrently
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm test\` - Run tests
- \`npm run lint\` - Run ESLint

## API Endpoints (Mock)

The JSON Server provides the following endpoints:

- \`GET /users\` - Get all users
- \`POST /users\` - Create new user
- \`GET /tasks\` - Get all tasks
- \`POST /tasks\` - Create new task
- \`PATCH /tasks/:id\` - Update task
- \`DELETE /tasks/:id\` - Delete task
- \`GET /events\` - Get event logs

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: \`npm run build\`
   - Output Directory: \`.next\`
3. Deploy

### Mock API (Railway/Heroku)
1. Deploy JSON Server to your preferred platform
2. Update API_BASE_URL in \`lib/api.ts\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## License

This project is licensed under the MIT License.
