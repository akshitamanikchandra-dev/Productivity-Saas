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

---

## 🌐 Deployment

### Backend → Render.com (Web Service)

1. Go to [render.com](https://render.com) and click **New** → **Web Service**.
2. Connect your GitHub repository **Productivity-Saas**.
3. Configure the settings:
   - **Name:** `productivity-saas-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add the following **Environment Variables**:
   - `MONGO_URI` → `mongodb://ak:ak123@ac-ns31soa-shard-00-00.kcfozfu.mongodb.net:27017/productivity?ssl=true&authSource=admin&retryWrites=true&w=majority` (or your new Atlas URI)
   - `JWT_SECRET` → A strong random key (e.g. `your_super_secret_jwt_key`)
   - `CLIENT_URL` → Your Render frontend URL (e.g. `https://productivity-saas-frontend.onrender.com` - update this after deploying the frontend)
   - `NODE_ENV` → `production`
5. Click **Create Web Service** and copy the generated URL after deployment.

### Frontend → Render.com (Static Site)

1. Go to [render.com](https://render.com) and click **New** → **Static Site**.
2. Connect your GitHub repository **Productivity-Saas**.
3. Configure the settings:
   - **Name:** `productivity-saas-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_URL` → Your Backend URL + `/api` (e.g. `https://productivity-saas-backend.onrender.com/api`)
   - `VITE_SOCKET_URL` → Your Backend URL (e.g. `https://productivity-saas-backend.onrender.com`)
5. Click **Create Static Site**!

> ⚠️ **Important:** Once your frontend static site is deployed, make sure to copy its URL, go back to your backend Web Service settings on Render, and update the `CLIENT_URL` variable to this new Render frontend URL.


---

## ✅ Modules Completed

### Module 1 — Authentication & Core Task System ✅
- JWT-based Register/Login
- Protected routes (frontend + backend)
- Full CRUD for tasks
- Redux manages Auth state + Task state
- All data persisted in MongoDB

### Module 2 — Smart Task Prioritization Engine ✅
- Dynamic priority score algorithm:
  - Overdue → score 10000+ (highest)
  - Near deadline → higher score (max 1000)
  - Tie-breaker → earlier created task first
- Tasks always sorted by priority
- Priority updates automatically (no manual refresh)
- Overdue tasks highlighted in red

### Module 3 — Real-Time Task Updates ✅
- Socket.io WebSocket connection
- Task create/update/delete events broadcast instantly
- Multiple users see updates in real-time
- No page refresh required
- Updates reflect within 1 second

### Module 4 — Productivity Insights & Analytics ✅
- Total / Completed / Pending / In Progress / Overdue counts
- Tasks completed today
- Category-wise distribution (bar chart)
- Status distribution (pie chart)
- Most active category
- Completion rate percentage
- Dashboard updates in real-time

---

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
