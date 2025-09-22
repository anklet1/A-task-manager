
# Smart Task Manager

A modern, full-stack task management application built with React, Node.js, and MongoDB. Smart Task Manager helps users organize and track their daily tasks with an intuitive interface and powerful features.

## 📖 Description

Smart Task Manager is a comprehensive web application that enables users to:
- Create, edit, and delete tasks with rich metadata
- Organize tasks by status (pending, in-progress, completed) and priority (low, medium, high)
- Set due dates and track task completion
- View task statistics and progress
- Secure user authentication and data isolation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Axios** for API calls
- **Date-fns** for date manipulation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

### Testing
- **Jest** for unit testing
- **Supertest** for API testing

### Deployment
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **MongoDB Atlas** for database hosting

## 🚀 Features

### Core Functionality
- ✅ User registration and authentication
- ✅ Create, read, update, and delete tasks
- ✅ Task status management (pending, in-progress, completed)
- ✅ Priority levels (low, medium, high)
- ✅ Due date tracking with overdue detection
- ✅ Task filtering and sorting (including `?status=` on list endpoint)
- ✅ Real-time task statistics

### User Experience
- 📱 Responsive design for all devices
- 🎨 Modern, clean interface with Tailwind CSS
- ⚡ Fast and intuitive task management
- 🔒 Secure user authentication
- 📊 Visual task statistics and progress tracking

## 🏗️ Project Structure

```
smart-task-manager/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/                 # Node.js backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # Express routes
│   ├── middleware/         # Custom middleware
│   ├── tests/              # Jest test files
│   ├── server.js           # Main server file
│   └── package.json
├── docs/                   # Project documentation (reflection, workflows)
│   └── reflection.md
├── package.json            # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   **Backend (.env in backend/ directory):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```
   
   **Frontend (env.example in frontend/ directory):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

### Test Coverage
The project includes comprehensive tests for:
- User authentication (registration, login, token validation)
- Task CRUD operations
- Input validation
- Error handling
- API endpoints

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Task Endpoints
- `GET /api/tasks` - Get all user tasks (protected) — supports `?status=pending|in-progress|completed`
- `GET /api/tasks/:id` - Get single task (protected)
- `POST /api/tasks` - Create new task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)
- `PATCH /api/tasks/:id/status` - Update task status (protected)

### Utility
- `GET /api/health` - Health check endpoint

### Request/Response Examples

**Create Task:**
```json
POST /api/tasks
{
  "title": "Complete project",
  "description": "Finish the Smart Task Manager project",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "...",
    "title": "Complete project",
    "description": "Finish the Smart Task Manager project",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "user": "...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com`
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `NODE_ENV`: production
3. Deploy and get your backend URL

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend environment

## 🔧 Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Code Structure

**Backend Architecture:**
- **Models**: MongoDB schemas with validation
- **Routes**: RESTful API endpoints
- **Middleware**: Authentication and error handling
- **Tests**: Comprehensive API testing

**Frontend Architecture:**
- **Components**: Reusable UI components
- **Contexts**: Global state management (Auth)
- **Types**: TypeScript interfaces
- **Hooks**: Custom React hooks for data fetching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Task categories and tags
- [ ] Team collaboration features
- [ ] Task templates
- [ ] Advanced filtering and search
- [ ] Mobile app (React Native)
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Task analytics and reporting

---

**Built with ❤️ using modern web technologies**

## 🧰 AI Usage and Workflows

This project intentionally leveraged AI assistants throughout the build to accelerate delivery while maintaining code quality.

- **Where AI helped**
  - Scaffolding route logic, validation, and model constraints
  - Proposing error-handling patterns and response shapes
  - Writing and refining Jest + Supertest cases
  - Drafting and iterating on documentation (this README and reflection)
  - Suggesting small refactors (e.g., env-driven config, test-safe server bootstrap)

- **AI-aware actions (evidence)**
  - Updated `GET /api/tasks` to support query filtering (`?status=`) based on test requirements and assistant suggestions
  - Hardened auth middleware to use a default JWT secret during tests (`process.env.JWT_SECRET || 'test-secret'`)
  - Modified `backend/server.js` to avoid listening during tests and to use `MONGODB_URI` from `.env`

- **Commit guidelines (AI-assisted)**
  - Prefer conventional commits; examples:
    - `feat(tasks): add status filter to list endpoint`
    - `fix(auth): default to test jwt secret when env missing`
    - `chore(docs): update readme with ai workflows`
    - `test(api): cover invalid task payloads`
  - Use your IDE assistant (e.g., CodeRabbit/Cursor) to propose concise commit messages referencing scope and intent

- **Suggested workflow**
  1. Use in-IDE AI to scaffold or refine a change
  2. Run tests and let the assistant propose fixes for failures
  3. Ask the assistant to generate a commit message following conventional commit format
  4. Request a quick AI code review before pushing (spotting edge cases, naming, and validation gaps)
  5. Iterate on README/docstrings with assistant suggestions

See `docs/reflection.md` for a 500-word reflection on the AI development process.
