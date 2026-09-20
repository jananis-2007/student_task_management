# 🎓 Student Task Management System

A full-stack college project built with **React (Vite)**, **Node.js (Express)**, and **SQLite**.

Features full-stack Task CRUD operations, academic categories (Assignments, Exams, Projects), priority indicators, completion metrics, and a live SQLite database.

---

## 📁 Project Structure

```text
college_project/
├── backend/                  # Node.js + Express backend
│   ├── data/                 # SQLite database storage directory
│   │   ├── tasks.db          # SQLite database file (auto-created)
│   │   └── .gitkeep          # Preserves folder in Git
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # SQLite connection & auto-table initialization
│   │   ├── routes/
│   │   │   ├── health.js     # Health-check endpoint (/api/health)
│   │   │   └── tasks.js      # Task CRUD REST endpoints (/api/tasks)
│   │   └── server.js         # Express app, middleware, and route mounting
│   ├── .env                  # Local environment configuration
│   ├── .env.example          # Template for environment variables
│   └── package.json          # Backend dependencies (express, cors, sqlite3, etc.)
│
├── frontend/                 # React frontend powered by Vite
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatsBar.jsx  # Academic progress & metrics counter
│   │   │   ├── TaskForm.jsx  # Form to create new tasks with priority & due dates
│   │   │   ├── TaskItem.jsx  # Task card with status toggle and delete button
│   │   │   └── TaskList.jsx  # Task list with status and category filters
│   │   ├── App.jsx           # Main student dashboard & full-stack state management
│   │   ├── index.css         # Modern, clean CSS design system
│   │   └── main.jsx          # React DOM root entry point
│   ├── index.html            # Main HTML document template
│   ├── vite.config.js        # Vite configuration (includes API proxy to :5000)
│   └── package.json          # Frontend dependencies (react, react-dom, vite)
│
├── .gitignore                # Git ignore rules for dependencies, env files, and databases
├── package.json              # Root project orchestration (concurrent runner scripts)
└── README.md                 # Project documentation and setup guide
```

---

## 📋 What Each Important File Does

| File | Purpose |
| :--- | :--- |
| `backend/src/server.js` | Entry point for the Express backend. Configures CORS, JSON parsing, logging, route handlers, and starts the HTTP server. |
| `backend/src/config/db.js` | Connects to SQLite (`tasks.db`), initializes the `tasks` table schema, and exports health query helpers. |
| `backend/src/routes/tasks.js` | Full CRUD REST endpoints: `GET`, `POST`, `PUT`, `DELETE` for tasks. |
| `backend/src/routes/health.js` | Defines `GET /api/health` returning JSON with server uptime and database operational status. |
| `backend/.env` | Stores backend configuration such as `PORT=5000` and `CLIENT_URL=http://localhost:5173`. |
| `frontend/vite.config.js` | Vite bundler configuration with a `/api` dev proxy directing API requests to the backend server. |
| `frontend/src/App.jsx` | Main student dashboard component that syncs tasks with the backend API and handles optimistic UI updates. |
| `frontend/src/components/TaskForm.jsx` | Add task form supporting title, category, priority, due date, and notes. |
| `frontend/src/components/TaskList.jsx` | Filterable list supporting All/Pending/Completed tabs, category dropdown, and search. |
| `frontend/src/components/StatsBar.jsx` | Real-time metric cards showing total, pending, completed, and completion percentage. |
| `frontend/src/index.css` | Modern design system styling using CSS variables, card layouts, responsive grids, and status badges. |
| `package.json` (root) | Root script runner that allows you to start both frontend and backend concurrently with a single command. |
| `.gitignore` | Prevents uploading bulky folders (`node_modules`), secrets (`.env`), and database files (`tasks.db`) to Git. |

---

## 🌐 Backend REST API Endpoints

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Check API & database health | *None* |
| `GET` | `/api/tasks` | Fetch all tasks (supports `?status=...&category=...&search=...`) | *None* |
| `GET` | `/api/tasks/:id` | Fetch a single task by ID | *None* |
| `POST` | `/api/tasks` | Create a new task | `{"title": "Math Lab", "category": "Assignment", "priority": "High", "due_date": "2026-09-25"}` |
| `PUT` | `/api/tasks/:id` | Update task details or toggle status | `{"status": "completed"}` |
| `DELETE` | `/api/tasks/:id` | Delete a task | *None* |

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher (Tested on Node v25)
- **npm**: v9.0.0 or higher

Check your installed versions by running:
```bash
node -v
npm -v
```

---

## 🚀 Setup and Installation

If you are setting this up on a new computer:

### One-Command Setup (Recommended)
From the root directory (`college_project/`), run:
```bash
npm run install:all
```
This automatically installs dependencies for the root, backend, and frontend.

---

## ▶️ How to Run Frontend & Backend

### Option 1: Run Both Together (Recommended)
From the project root directory (`college_project/`):
```bash
npm run dev
```
This command starts both:
- 🔵 **Backend server**: `http://localhost:5000` (with auto-restart via `nodemon`)
- 🟢 **Frontend dev server**: `http://localhost:5173` (with hot module reload via `Vite`)

---

### Option 2: Run in Separate Terminals

#### Terminal 1 — Backend:
```bash
cd backend
npm run dev
```
> Starts Express server on `http://localhost:5000`

#### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```
> Starts Vite React dev server on `http://localhost:5173`

---

## 🩺 System Verification

1. **In the Browser**:
   - Open **`http://localhost:5173`** to use the student dashboard.
   - Try adding a new assignment or project.
   - Click the checkbox to mark a task as completed and observe the metrics bar update!
   - Click the "Backend & SQLite: Online" pill in the header to view live diagnostic health details.

2. **Direct API Verification**:
   - Query tasks via terminal:
     ```bash
     curl http://localhost:5000/api/tasks
     ```
   - Query system health:
     ```bash
     curl http://localhost:5000/api/health
     ```
