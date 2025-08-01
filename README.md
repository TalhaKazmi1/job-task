# TaskFlow - Real-Time Collaborative Task Management System

A modern, responsive task management application built with Next.js, TypeScript, and Tailwind CSS. This admin-only frontend application demonstrates advanced React patterns, authentication, state management, and real-time WebSocket features.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication system (admin-only access)
- Secure login with form validation
- Protected routes and components
- Auto-redirect protection (prevents logged-in users from accessing login page)
- Session persistence with cookies

### 📋 Task Management
- Full CRUD operations for tasks
- Task priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Due date management
- Advanced filtering and search
- Real-time task updates

### 🔄 Real-Time Features
- **Live WebSocket Integration** - Real-time notifications for all task operations
- **Instant Notifications** - Toast notifications for create, update, and delete operations
- **Activity Feed** - Live activity stream showing recent task changes
- **Connection Status** - Visual indicator showing WebSocket connection status
- **Real-Time Dashboard** - Live updates without page refresh

### 🎨 Modern UI/UX
- Responsive design for all devices
- Beautiful animations and transitions
- Clean, professional admin interface
- Loading states and error handling
- Custom modal dialogs (no browser alerts)
- Real-time indicator widget

### 🚀 Performance & Best Practices
- React Query for data fetching and caching
- Context API for state management
- TypeScript for type safety
- Optimized bundle size
- SEO-friendly
- Fallback localStorage system

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API + React Query
- **Real-time**: WebSocket (Mock Implementation)
- **Authentication**: JWT (simulated)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library
- **Mock API**: JSON Server + localStorage fallback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Quick Start (Recommended - No JSON Server Required)

The application works out of the box with localStorage fallback data and full WebSocket functionality:

1. **Clone the repository:**
\`\`\`bash
git clone <repository-url>
cd task-management-frontend
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

4. **Open your browser and navigate to:** http://localhost:3000

5. **Login with admin credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

### Full Setup with JSON Server (Optional)

For a more realistic API experience:

1. Follow steps 1-2 above

2. **Start both JSON server and Next.js:**
\`\`\`bash
# Start both JSON server and Next.js dev server
npm run dev:full

# Or start them separately:
# Terminal 1: JSON Server (Mock API)
npm run json-server

# Terminal 2: Next.js Development Server
npm run dev
\`\`\`

3. **Open your browser and navigate to:**
   - Frontend: http://localhost:3000
   - Mock API: http://localhost:3001

## 🔑 Demo Credentials

**Admin Account (Only Access Level):**
- Email: `admin@example.com`
- Password: `admin123`

> **Note:** This is an admin-only application. Only users with admin role can access the system.

## 📁 Project Structure

\`\`\`bash
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   └── login/         # Admin login page
│   ├── dashboard/         # Dashboard with real-time stats
│   ├── tasks/             # Task management pages
│   ├── profile/           # Admin profile page
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable components
│   ├── DeleteTaskModal.tsx    # Custom delete confirmation modal
│   ├── LoadingSpinner.tsx     # Loading component
│   ├── ProtectedRoute.tsx     # Route protection wrapper
│   ├── RealTimeIndicator.tsx  # WebSocket status indicator
│   └── Sidebar.tsx            # Navigation sidebar
├── contexts/              # React Context providers
│   ├── AuthContext.tsx        # Authentication state
│   ├── TaskContext.tsx        # Task management state
│   └── WebSocketContext.tsx   # Real-time WebSocket state
├── lib/                   # Utility functions and API
│   ├── api.ts                 # API functions with fallback
│   ├── utils.ts               # Utility functions
│   └── websocket.ts           # WebSocket manager
├── __tests__/             # Test files
└── db.json               # Mock database for JSON Server
\`\`\`

## ✨ Key Features Implemented

### Real-Time WebSocket System
- **Live Notifications**: Instant toast notifications for all task operations
- **Activity Feed**: Real-time activity stream showing recent changes
- **Connection Status**: Visual indicator showing WebSocket connection state
- **Mock WebSocket**: Fully functional mock WebSocket implementation for demo

### Authentication System
- **Admin-Only Access**: Restricted to admin users only
- **Auto-Redirect Protection**: Prevents logged-in users from accessing login page
- **Session Persistence**: Maintains login state across browser sessions
- **Secure Route Protection**: All routes protected with role-based access

### Task Management
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Real-Time Updates**: Instant updates across the application
- **Advanced Filtering**: Filter by status, priority, and search terms
- **Custom Modals**: Professional modal dialogs instead of browser alerts
- **Due Date Tracking**: Visual due date management

### State Management
- **React Context**: Global state management for auth, tasks, and WebSocket
- **React Query**: Server state management with caching and optimistic updates
- **localStorage Fallback**: Works offline with local data persistence
- **Error Handling**: Comprehensive error handling and user feedback

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Touch-Friendly**: Optimized for touch interactions
- **Adaptive Layouts**: Responsive grid layouts

## 🧪 Testing

Run the test suite:

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 📜 Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run json-server` - Start JSON Server mock API
- `npm run dev:full` - Start both servers concurrently
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🔌 API Endpoints (Mock)

The JSON Server provides the following endpoints:

- `GET /users` - Get all users (admin only)
- `POST /users` - Create new user
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /events` - Get event logs

## 🌐 Deployment

### Frontend (Vercel - Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy

### Mock API (Railway/Heroku)
1. Deploy JSON Server to your preferred platform
2. Update `API_BASE_URL` in `lib/api.ts`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

\`\`\`env
# Optional: Custom API URL (defaults to localhost:3001)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=true
\`\`\`

### Customization
- **Colors**: Modify `tailwind.config.ts` for custom color schemes
- **API**: Update `lib/api.ts` for different backend integration
- **WebSocket**: Replace mock WebSocket in `lib/websocket.ts` with real implementation

## 🚨 Troubleshooting

### Common Issues

**WebSocket not working:**
- Check browser console for WebSocket logs
- Ensure real-time indicator shows "Connected"
- Try refreshing the page

**Styles not loading:**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`
- Verify Tailwind config includes all content paths

**Login issues:**
- Use exact credentials: `admin@example.com` / `admin123`
- Check browser console for authentication errors
- Clear cookies and try again

**API connection failed:**
- Application automatically falls back to localStorage
- Check if JSON Server is running on port 3001
- Verify no other services are using port 3001

### Debug Mode
Enable debug logging by setting `NEXT_PUBLIC_DEBUG=true` in `.env.local`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new features
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide React** - For the beautiful icon library
- **React Query** - For excellent data fetching and caching

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

For support or questions, please open an issue on GitHub.
