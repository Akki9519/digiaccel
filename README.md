# To-Do List Mobile App (MERN Stack)

A mobile-responsive To-Do List web application built using the MERN stack (MongoDB, Express, React, Node.js) based on the provided Figma design.

## Features

- **Task Management**: Create, edit, delete, and view tasks with title, description, date & time, and priority (Low, Medium, High).
- **Weekly Organization**: Tasks are organized by week (Monday to Sunday) with dynamic summary counters for open and completed tasks.
- **Progress Tracking**: Visual progress bar tracking completed vs open tasks.
- **Status Toggle**: Mark tasks as In Progress or Completed with custom checkboxes and strikethrough styling.
- **Search**: Search tasks by keywords in real time with quick status and edit/delete actions.
- **Swipe-to-Delete**: Swipe left gesture support on mobile for quick task removal.
- **Figma Design Matching**: Pixel-aligned UI including onboarding, weekly calendar strip, summary cards, and task modal.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, CORS, Morgan
- **Database**: MongoDB (Local or Atlas)

## Project Structure

```
todo-mern-assignment/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/taskController.js
│   │   ├── models/Task.js
│   │   ├── routes/taskRoutes.js
│   │   ├── utils/
│   │   │   ├── dateUtils.js
│   │   │   └── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarStrip.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── SearchScreen.jsx
│   │   │   ├── StatsOverview.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskModal.jsx
│   │   ├── services/api.js
│   │   ├── utils/dateHelpers.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── netlify.toml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Ensure MONGODB_URI points to your MongoDB instance (default: mongodb://127.0.0.1:27017/todo_app_db)

# Optional: Seed sample tasks
npm run seed

# Run backend in development mode
npm run dev
```

Server will start on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```

App will run on `http://localhost:5173`.

## API Endpoints

- `GET /api/tasks` - Get all tasks (supports query params: `search`, `status`, `priority`)
- `GET /api/tasks/weekly` - Get tasks grouped by Monday-Sunday weeks with open/completed counts
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create a new task (body: `title`, `description`, `dateTime`, `startTime`, `endTime`, `priority`, `status`)
- `PUT /api/tasks/:id` - Update an existing task
- `PATCH /api/tasks/:id/status` - Update task status (`In Progress` / `Completed`)
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/health` - Server health check

## Deployment

### Frontend (Netlify)
1. Link repository to Netlify.
2. Build command: `npm run build`, Publish directory: `dist`, Base directory: `frontend`.
3. Set environment variable: `VITE_API_URL` = `<your-backend-api-url>/api`.

### Backend (Render / Railway)
1. Create a Web Service connected to the `backend` directory.
2. Set build command: `npm install`, start command: `npm start`.
3. Set environment variables: `PORT`, `NODE_ENV=production`, `MONGODB_URI`.
