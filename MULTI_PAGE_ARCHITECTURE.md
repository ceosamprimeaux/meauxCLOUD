# 🏗️ MeauxCLOUD Multi-Page Application Structure

## 📋 Page Architecture

### **Public Pages** (No Authentication Required)
- `/` - Home (Marketing landing page)
- `/about` - About MeauxCLOUD
- `/contact` - Contact form
- `/portfolio` - Project showcase
- `/team` - Team members
- `/mission` - Mission statement
- `/terms` - Terms and conditions

### **Authentication Pages**
- `/login` - Login with Google OAuth & GitHub OAuth
- `/signup` - User registration
- `/reset-password` - Password reset

### **Protected Dashboard Pages** (Authentication Required)
- `/dashboard` - Overview (your provided HTML)
- `/projects` - Project management
- `/library` - Document library
- `/tasks` - Kanban board for task management

### **Meaux Apps** (Protected)
- `/meauxphoto` - Photo management
- `/meauxdoc` - Document editor
- `/meauxcad` - CAD tools
- `/meauxcloud` - Cloud storage
- `/meauxtalk` - Chat/messaging
- `/meauxmail` - Email client

### **Communication** (Protected)
- `/calendar` - Calendar view
- `/meet` - Video conferencing

### **System** (Protected)
- `/devops` - DevOps console
- `/integrations` - Third-party integrations
- `/settings` - User settings
- `/vault` - Secure vault
- `/audit` - Audit logs

---

## 🎨 Design System

Your provided HTML uses a **MeauxOS Peach/Orange theme** with:
- **Primary**: `#f27a4f` (Peach 500)
- **Secondary**: `#e85d30` (Peach 600)
- **Background**: Gradient from `#fef5f1` to `#faf8f6`
- **Glass morphism** with backdrop blur
- **Soft shadows** and **smooth transitions**

---

## 🔧 Technical Implementation

### **Routing Strategy**
- **Client-side routing** using hash-based navigation (`#/dashboard`)
- **Server-side route handling** for direct URL access
- **Middleware** for authentication checks

### **Authentication Flow**
1. User visits protected route → Redirect to `/login`
2. Login page offers Google OAuth & GitHub OAuth
3. OAuth callback → Create session → Redirect to intended page
4. Session stored in D1 database
5. Middleware checks session on each request

### **State Management**
- **Global state** for user session, current route, dashboard stats
- **API client** for all backend calls
- **Real-time updates** via WebSockets for chat/notifications

---

## 📁 File Structure

```
src/
├── index.ts                    # Main Worker entry
├── router.ts                   # Route definitions
├── middleware/
│   ├── analytics.ts            # Analytics tracking (already created)
│   ├── auth.ts                 # Authentication middleware
│   └── session.ts              # Session management
├── routes/
│   ├── public.ts               # Public pages (/, /about, etc.)
│   ├── auth.ts                 # OAuth handlers
│   ├── dashboard.ts            # Dashboard API endpoints
│   ├── projects.ts             # Projects CRUD
│   ├── tasks.ts                # Tasks/Kanban
│   └── apps.ts                 # Meaux Apps endpoints
├── lib/
│   ├── db.ts                   # D1 helpers
│   ├── session.ts              # Session utilities
│   └── oauth.ts                # OAuth helpers
├── frontend/
│   ├── templates/
│   │   ├── layout.ts           # Base HTML layout
│   │   ├── public/
│   │   │   ├── home.ts         # Homepage
│   │   │   ├── about.ts        # About page
│   │   │   └── ...
│   │   ├── auth/
│   │   │   └── login.ts        # Login page
│   │   └── dashboard/
│   │       ├── overview.ts     # Dashboard (your HTML)
│   │       ├── projects.ts     # Projects page
│   │       ├── tasks.ts        # Kanban board
│   │       └── ...
│   ├── components/
│   │   ├── header.ts           # Topbar component
│   │   ├── sidenav.ts          # Side navigation
│   │   ├── dock.ts             # Bottom dock
│   │   └── sidebar.ts          # Right sidebar
│   └── styles/
│       ├── design-system.css   # Your CSS variables
│       └── components.css      # Component styles
└── types/
    ├── env.d.ts                # Environment types (already created)
    ├── database.d.ts           # Database schema types
    └── api.d.ts                # API response types
```

---

## 🚀 Implementation Phases

### **Phase 1: Core Infrastructure** (Now)
1. ✅ Set up routing system
2. ✅ Create authentication middleware
3. ✅ Implement session management
4. ✅ Build OAuth handlers (Google & GitHub)

### **Phase 2: Public Pages** (30 min)
1. Create homepage with marketing content
2. Build about, contact, portfolio, team, mission, terms pages
3. Implement contact form with Resend email

### **Phase 3: Dashboard Pages** (60 min)
1. Integrate your provided dashboard HTML
2. Build projects page with CRUD operations
3. Create tasks page with Kanban board
4. Implement library page for documents

### **Phase 4: Meaux Apps** (90 min)
1. MeauxPhoto - Image gallery with Cloudflare Images
2. MeauxDoc - Document editor
3. MeauxCAD - CAD viewer
4. MeauxCloud - File browser
5. MeauxTalk - Chat with Durable Objects
6. MeauxMail - Email client with Resend

### **Phase 5: System Pages** (45 min)
1. Calendar integration
2. Meet (video conferencing with SFU)
3. DevOps console
4. Integrations page
5. Settings, Vault, Audit

---

## 🔐 Authentication Implementation

### **Session Schema (D1)**
```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_activity INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **OAuth Flow**
```typescript
// Google OAuth
GET /api/auth/google
  → Redirect to Google OAuth consent
  → Callback to /api/auth/google/callback
  → Create session
  → Redirect to /dashboard

// GitHub OAuth
GET /api/auth/github
  → Redirect to GitHub OAuth consent
  → Callback to /api/auth/github/callback
  → Create session
  → Redirect to /dashboard
```

---

## 📊 API Endpoints

### **Authentication**
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/github/callback` - GitHub OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Check session status

### **Dashboard**
- `GET /api/dashboard/stats` - Dashboard statistics (already implemented)
- `GET /api/dashboard/activities` - Recent activities

### **Projects**
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### **Tasks**
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

---

## 🎯 Next Steps

Ready to build! I'll:
1. Create authentication middleware
2. Build OAuth handlers
3. Create page templates
4. Integrate your dashboard HTML
5. Deploy and test

**Shall I proceed with implementation?**
