# ⚡ FlowTask — Real-Time Productivity Management System

A full-stack Mini SaaS built with the **MERN + Redux** stack featuring real-time updates via Socket.io.

---

## 🧱 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js + Redux Toolkit          |
| Backend    | Node.js + Express                 |
| Database   | MongoDB (Atlas)                   |
| Realtime   | Socket.io / WebSockets            |
| Auth       | JWT (JSON Web Tokens)             |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
productivity-saas/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Task.js           # Task model with priority logic
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Me
│   │   ├── tasks.js          # CRUD + Socket emit
│   │   └── analytics.js      # Productivity insights
│   ├── server.js             # Express + Socket.io server
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js      # Axios instance + interceptors
    │   │   └── socket.js     # Socket.io client singleton
    │   ├── store/
    │   │   ├── index.js      # Redux store
    │   │   └── slices/
    │   │       ├── authSlice.js   # Auth state
    │   │       └── tasksSlice.js  # Tasks + analytics state
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── Layout/
    │   │   │   ├── AppLayout.jsx
    │   │   │   └── Navbar.jsx
    │   │   └── Tasks/
    │   │       ├── TaskCard.jsx
    │   │       └── TaskModal.jsx
    │   ├── hooks/
    │   │   └── useSocket.js   # Real-time socket hook
    │   ├── pages/
    │   │   ├── Dashboard.jsx  # Analytics + Charts
    │   │   └── Tasks.jsx      # Full task management
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd productivity-saas

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Backend Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/productivity-saas?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_minimum_32_chars
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

## 📡 API Reference

### Auth
| Method | Endpoint             | Body                          | Auth |
|--------|----------------------|-------------------------------|------|
| POST   | `/api/auth/register` | `{name, email, password}`     | No   |
| POST   | `/api/auth/login`    | `{email, password}`           | No   |
| GET    | `/api/auth/me`       | —                             | Yes  |

### Tasks
| Method | Endpoint          | Body                                          | Auth |
|--------|-------------------|-----------------------------------------------|------|
| GET    | `/api/tasks`      | —                                             | Yes  |
| POST   | `/api/tasks`      | `{title, description, category, status, deadline}` | Yes |
| PUT    | `/api/tasks/:id`  | Any task fields                               | Yes  |
| DELETE | `/api/tasks/:id`  | —                                             | Yes  |

### Analytics
| Method | Endpoint          | Auth |
|--------|-------------------|------|
| GET    | `/api/analytics`  | Yes  |

### Socket.io Events
| Event          | Payload     | Direction       |
|----------------|-------------|-----------------|
| `task:created` | Task object | Server → Client |
| `task:updated` | Task object | Server → Client |
| `task:deleted` | `{_id}`     | Server → Client |

---

## 🎨 Features

- 🌑 Dark theme with modern UI
- 📱 Responsive (desktop + mobile)
- ⚡ Real-time updates via WebSockets
- 🔴 Overdue task highlighting
- 🎯 Dynamic priority scoring
- 📊 Interactive charts (Recharts)
- 🔒 JWT authentication
- 🏷️ Category filtering
- 🔍 Task search

---

## 📦 Key Dependencies

**Backend:**
- `express` — HTTP server
- `mongoose` — MongoDB ORM
- `socket.io` — WebSockets
- `jsonwebtoken` — JWT auth
- `bcryptjs` — Password hashing
- `cors` — Cross-origin requests

**Frontend:**
- `react` + `react-dom` — UI
- `@reduxjs/toolkit` + `react-redux` — State management
- `react-router-dom` — Client-side routing
- `axios` — HTTP client
- `socket.io-client` — WebSocket client
- `recharts` — Charts and visualizations
