# Task Manager Application

A full-stack task management application built with Node.js/Express backend and React frontend.

## Project Structure

```
Task_Manager/
├── backend/          # Express.js server
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── middleware/   # Auth middleware
│   ├── routes/       # API routes
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # React/Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Features

- User authentication (signup/login)
- Task management (create, update, delete, view)
- Project management
- Dashboard with task statistics and distribution
- Role-based access (Admin/Member)
- Task filtering by status and priority
- Notification system

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env` file in backend directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Dashboard Features

- **Total Tasks**: Overview of all tasks
- **Pending Tasks**: Todo + In Progress tasks
- **Completed Tasks**: Finished tasks count
- **Overdue Tasks**: Tasks past due date
- **Task Status Distribution**: Visual pie chart of task statuses
- **Tasks per User**: Admin view of task distribution across team members
- **Recent Working Tasks**: Latest 5 updated tasks
