# TaskTrack — Weekly To-Do List Mobile Application (MERN Stack)

> Built for the **SDE-1 (MERN Stack)** assignment at **Digiaccel Learning / Altera Institute**.

A modern, responsive, mobile-first To-Do List web application designed to help users organize, schedule, and track tasks grouped dynamically by calendar week (**Monday to Sunday**). Features real-time open vs. completed task progress indicators, smooth mobile swipe-to-delete gestures, debounced search, and clean RESTful API architecture.

---

## 📱 Key Features & Requirements Coverage

### 1. Weekly Organization & Summary Cards
- **Monday–Sunday ISO Week Bucketing:** Tasks are automatically grouped into their corresponding calendar weeks starting on **Monday** and ending on **Sunday**.
- **Task Summary Cards:** Each week displays:
  - Total **Open Tasks** count
  - Total **Completed Tasks** count
  - Visual completion percentage bar
  - Context badge (*Current Week*, *Past Week*, or *Upcoming*)
- **Accordion Expansion:** Tapping/clicking any week card smoothly expands or collapses the task list for that week.

### 2. Task Management (Full CRUD)
- **Create Task:**
  - `Title` *(Mandatory)*
  - `Date & Time` *(Mandatory, with quick-select presets for "Today" & "Tomorrow")*
  - `Description` *(Optional, with expandable read-more)*
  - `Priority` *(Optional: Low, Medium, High)*
  - `Status` *(In Progress / Completed)*
- **Edit Task:** Update any task attribute (title, description, date & time, priority, status).
- **Status Toggle:** One-tap toggle between `In Progress` and `Completed` with optimistic UI updates and strikethrough styling.

### 3. Mobile-First UX & Swipe-to-Delete
- **Swipe Left to Delete:** Native mobile gesture built with Framer Motion — swiping left on a task reveals the red action tray with a Delete button.
- Direct edit and delete buttons are also accessible for mouse/desktop interactions.

### 4. Search Functionality
- Real-time debounced search by keyword across `title` and `description`.
- Direct action shortcuts in search results to view, toggle status, edit, or delete matching tasks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose, RESTful APIs, CORS, Morgan |
| **Database** | MongoDB (indexed on `title`, `description`, `dateTime`, and `status`) |
| **Deployment** | Netlify (Frontend) + Render / Railway (Backend) |

---

## 📂 Project Architecture

```
todo-mern-assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   └── taskController.js  # CRUD, weekly grouping & search controllers
│   │   ├── models/
│   │   │   └── Task.js            # Mongoose Task schema & indexes
│   │   ├── routes/
│   │   │   └── taskRoutes.js      # REST API route definitions
│   │   ├── utils/
│   │   │   ├── dateUtils.js       # Monday-Sunday boundary calculator
│   │   │   └── seed.js            # Sample data seeder
│   │   └── server.js              # Express app setup & middleware
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # App bar, date & search trigger
│   │   │   ├── StatsOverview.jsx  # Productivity metrics banner
│   │   │   ├── WeekCard.jsx       # Weekly summary card & accordion
│   │   │   ├── TaskItem.jsx       # Swipe-to-delete row & status checkbox
│   │   │   ├── TaskModal.jsx      # Create / Edit task form with validation
│   │   │   ├── SearchModal.jsx    # Keyword search overlay & results
│   │   │   └── DeleteConfirmModal.jsx # Delete confirmation dialog
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── utils/
│   │   │   └── dateHelpers.js     # Date formatting & priority helpers
│   │   ├── App.jsx                # Main application state & orchestration
│   │   └── index.css              # Tailwind CSS styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── netlify.toml                   # 1-click Netlify deployment configuration
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

### 1. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Ensure MONGODB_URI=mongodb://127.0.0.1:27017/todo_app_db or your Atlas URI

# Optional: Seed sample tasks across multiple weeks
npm run seed

# Start server
npm run dev
# Backend runs at: http://localhost:5000
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite dev server
npm run dev
# Frontend runs at: http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/tasks/weekly` | Get tasks grouped by Monday–Sunday weeks with metrics |
| `GET` | `/api/tasks` | Get all tasks (supports `?search=...`, `?status=...`, `?priority=...`) |
| `GET` | `/api/tasks/:id` | Get single task by ID |
| `POST` | `/api/tasks` | Create task (`title` and `dateTime` mandatory) |
| `PUT` | `/api/tasks/:id` | Update task attributes |
| `PATCH` | `/api/tasks/:id/status`| Toggle / update task status (`In Progress` ↔ `Completed`) |
| `DELETE`| `/api/tasks/:id` | Delete task by ID |

---

## 🌐 Deployment Instructions

### Frontend (Netlify)
1. Push your repository to GitHub.
2. Log into [Netlify](https://www.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select your GitHub repository:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. In **Site Configuration > Environment Variables**, add:
   - `VITE_API_URL` = `https://your-backend-api.onrender.com/api`
5. Click **Deploy Site**.

### Backend (Render or Railway)
1. Log into [Render](https://render.com/) and create a **New Web Service**.
2. Connect your GitHub repository:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `<Your MongoDB Atlas Connection String>`
4. Deploy and copy your service URL to set in the frontend's `VITE_API_URL`.
