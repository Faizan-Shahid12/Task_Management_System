# MERN Stack Task Management Application

A full-stack task management application built with MongoDB, Express.js, React, and Node.js.

## Features

### Core Functionality
- **User Authentication System**
  - User registration with email and password
  - Secure login/logout functionality
  - JWT token-based authentication
  - Protected routes requiring authentication

- **Task Management Features**
  - Create new tasks with title, description, due date, and priority level
  - View all tasks in a clean, organized interface
  - Edit existing tasks
  - Delete tasks
  - Mark tasks as completed/incomplete
  - Filter tasks by status (completed/pending) and priority

- **User Interface**
  - Responsive design that works on desktop and mobile
  - Clean, intuitive user interface
  - Loading states for async operations
  - Error handling and user feedback messages
  - Form validation on both frontend and backend

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- React Router for navigation
- Context API for state management
- Axios for HTTP requests
- CSS3 with responsive design

### Backend
- Node.js with Express.js
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS configuration
- RESTful API design

### Database
- Simulated in-memory database (easily replaceable with MongoDB)
- User and Task schemas with proper relationships

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Task Routes
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update specific task
- `DELETE /api/tasks/:id` - Delete specific task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion status

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd task-manager-mern
   \`\`\`

2. **Install dependencies for both client and server**
   \`\`\`bash
   npm run install-deps
   \`\`\`

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   \`\`\`env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-here
   CLIENT_URL=http://localhost:3000
   \`\`\`

4. **Start the development servers**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   This will start both the Express server (port 5000) and React client (port 3000) concurrently.

### Alternative: Start servers separately

**Start the backend server:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Start the frontend client:**
\`\`\`bash
cd client
npm start
\`\`\`

## Project Structure

\`\`\`
task-manager-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Context providers
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Styles
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/             # API routes
│   ├── config/             # Database configuration
│   ├── server.js           # Server entry point
│   └── package.json
├── package.json            # Root package.json
└── README.md
\`\`\`

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Create tasks** with title, description, due date, and priority
3. **View and manage tasks** in the dashboard
4. **Filter tasks** by status (all/pending/completed) and priority
5. **Edit or delete tasks** as needed
6. **Mark tasks as complete** when finished

## Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data

## Database Schema

### User Schema
\`\`\`javascript
{
  id: Number,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
\`\`\`

### Task Schema
\`\`\`javascript
{
  id: Number,
  title: String,
  description: String,
  dueDate: Date,
  priority: String (low/medium/high),
  completed: Boolean,
  userId: Number,
  createdAt: Date
}
\`\`\`

## Development Notes

- The current implementation uses in-memory storage for demonstration purposes
- To use MongoDB, replace the database configuration in `server/config/database.js`
- All API endpoints include proper error handling and validation
- The frontend includes loading states and error messages for better UX

## Future Enhancements

- MongoDB integration
- Task categories/tags
- Search functionality
- Email notifications
- Task sharing between users
- Data export features
- Unit tests
- Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
