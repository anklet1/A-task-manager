

Project Title: Smart Task Manager

## 📖 Description
Smart Task Manager is a web app that helps users organize and track daily tasks.  
Users can create, edit, delete, and mark tasks as complete.  
It is built for individuals who want a clear, simple productivity tool.


## 🛠️ Tech Stack
- **Frontend**: React + Tailwind CSS  
- **Backend**: Node.js + Express  
- **Database**: MongoDB Atlas  
- **Authentication**: JWT  
- **Deployment**: Vercel (frontend), Render (backend)  
- **AI Tools**: OpenAI API for code scaffolding, testing, and documentation


## 🧠 AI Integration Strategy

- **Code generation**: AI will scaffold React components, Express routes, and MongoDB models.  
- **Testing**: AI will generate Jest tests for routes and functions.  
- **Schema-aware generation**: Provide the MongoDB Task schema to AI to generate CRUD queries.  
- **Documentation**: Use AI to draft docstrings, inline comments, and keep README updated.


## 🔍 Review Tooling
- **Tool**: Cursor AI + GitHub PR reviews  
- **Usage**: Generate commit messages, review code for clarity and security.


## 💡 Sample Prompts
1. *"Generate an Express route for creating a new task with title, description, due date, and status."*  
2. *"Write Jest unit tests for the task creation API, covering valid and invalid input."*  

## ✅ Next Steps
- Scaffold React frontend with login and dashboard.  
- Build Express server with MongoDB connection.  
- Add JWT authentication.  
- Deploy MVP with basic create/read tasks.  
