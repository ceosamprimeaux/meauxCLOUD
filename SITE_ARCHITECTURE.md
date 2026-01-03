# 🏗️ MeauxCLOUD Site Architecture & Routing

## 📊 Current Site Analysis

Based on analysis of: https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html#/dashboard

---

## 🎨 Site Overview

**MeauxCLOUD** is a unified operating system for modern nonprofits, featuring:

- **Claymorphic Design** - Soft, modern UI with peach/orange theme
- **SPA Architecture** - Client-side routing with hash-based navigation
- **Multi-Module System** - Projects, Library, Tasks, and specialized apps
- **Real-time Features** - Group calls, AI assistant, live streaming
- **Enterprise Tools** - Dev console, integrations, vault, audit logs

---

## 🗺️ Current Navigation Structure

### Top Bar (Header)
- **Brand**: MeauxCLOUD Logo + "MeauxAbility Nonprofit" dropdown
- **Search**: Quick search (⌘K shortcut)
- **Notifications**: Bell icon with badge (4 notifications)
- **User Avatar**: "AU" with dropdown menu

### Sidebar Navigation

#### **Main Navigation**
1. **Projects** (`/projects`)
   - Project management and tracking
   - Data route: `data-route="/projects"`

2. **Library** (`/library`)
   - Asset library and media management
   - Data route: `data-route="/library"`

3. **Tasks** (`/tasks`)
   - Task management and tracking
   - Data route: `data-route="/tasks"`

#### **Meaux Apps**
4. **MeauxPHOTO** (`/meauxphoto`)
   - Photo editing and management
   - Data route: `data-route="/meauxphoto"`

5. **MeauxDOC** (`/meauxdoc`)
   - Document management
   - Data route: `data-route="/meauxdoc"`

6. **MeauxCAD** (`/meauxcad`)
   - CAD design tools
   - Data route: `data-route="/meauxcad"`

7. **MeauxCloud** (`/meauxcloud`)
   - Cloud storage and services
   - Data route: `data-route="/meauxcloud"`

#### **MeauxChat**
8. **Talk** (`/chat/talk`)
   - Real-time chat/communication
   - Data route: `data-route="/chat/talk"`

9. **Mail** (`/chat/mail`)
   - Email management
   - Data route: `data-route="/chat/mail"`

10. **Calendar** (`/chat/calendar`)
    - Calendar and scheduling
    - Data route: `data-route="/chat/calendar"`

11. **Meet** (`/chat/meet`)
    - Video meetings (group calls)
    - Data route: `data-route="/chat/meet"`

#### **MediaKit**
12. **Dev Console** (`/dev-console`)
    - Developer tools and console
    - Data route: `data-route="/dev-console"`

13. **Integrations** (`/integrations`)
    - Third-party integrations
    - Data route: `data-route="/integrations"`

#### **Account**
14. **Settings** (no route - dropdown/modal)
    - User and system settings
    - Badge: "NEW"

15. **Vault** (`/vault`)
    - Secure storage/secrets management
    - Data route: `data-route="/vault"`

16. **Audit** (`/audit`)
    - Audit logs and activity tracking
    - Data route: `data-route="/audit"`

---

## 🛣️ Complete Route Structure

### Currently Implemented Routes

```javascript
// Router configuration (from dashboard.html)
const router = {
    routes: {
        '/dashboard': renderDashboard,  // ✅ Implemented
        // Other routes need implementation
    }
}
```

### Suggested Complete Route Map

#### **Core Routes**
```
/ (root)
├── /dashboard                    ✅ Implemented
│   ├── Stats cards (D1 connected)
│   ├── Group Call widget
│   ├── AI Assistant widget
│   └── Live Command Center
│
├── /projects                     ⚠️ Needs implementation
│   ├── List view
│   ├── Create project
│   ├── Project detail (/projects/:id)
│   └── Project settings
│
├── /library                      ⚠️ Needs implementation
│   ├── Media gallery
│   ├── Upload assets
│   ├── Asset detail (/library/:id)
│   └── Collections
│
└── /tasks                        ⚠️ Needs implementation
    ├── Task board
    ├── Create task
    ├── Task detail (/tasks/:id)
    └── Task filters
```

#### **Meaux Apps Routes**
```
/meauxphoto                       ⚠️ Needs implementation
├── Photo gallery
├── Photo editor
└── Photo settings

/meauxdoc                         ⚠️ Needs implementation
├── Document list
├── Document editor
└── Document sharing

/meauxcad                         ⚠️ Needs implementation
├── CAD workspace
├── Design tools
└── Export options

/meauxcloud                       ⚠️ Needs implementation
├── Cloud storage
├── File browser
└── Sync settings
```

#### **Communication Routes**
```
/chat/talk                        ⚠️ Needs implementation
├── Chat rooms
├── Direct messages
└── Chat settings

/chat/mail                        ⚠️ Needs implementation
├── Inbox
├── Compose
└── Email settings

/chat/calendar                    ⚠️ Needs implementation
├── Calendar view
├── Create event
└── Calendar settings

/chat/meet                        ⚠️ Needs implementation
├── Group call (SFU)
├── Meeting history
└── Meeting settings
```

#### **Admin/Dev Routes**
```
/dev-console                      ⚠️ Needs implementation
├── SQL console
├── API explorer
├── Logs viewer
└── System status

/integrations                     ⚠️ Needs implementation
├── Available integrations
├── Connected services
└── Integration settings

/vault                            ⚠️ Needs implementation
├── Secrets management
├── API keys
└── Security settings

/audit                            ⚠️ Needs implementation
├── Activity logs
├── User actions
└── System events
```

---

## 🎯 Current Implementation Status

### ✅ Fully Implemented
- **Dashboard** (`/dashboard`)
  - Stats cards (connected to D1)
  - Group Call widget (WebRTC + SFU)
  - AI Assistant (Gemini integration)
  - Live Command Center (Cloudflare Stream)

### ⚠️ Partially Implemented
- **Router** - Basic routing structure exists
- **Navigation** - All nav items defined, but routes not implemented
- **API Client** - Endpoints defined but not all used

### ❌ Not Implemented
- All other routes (projects, library, tasks, etc.)
- Route handlers for navigation items
- Page components for each route

---

## 🔧 Router Implementation

### Current Router (dashboard.html)
```javascript
const router = {
    routes: {
        '/dashboard': renderDashboard,
        // Only dashboard is implemented
    },
    
    navigate(path) {
        if (this.routes[path]) {
            this.routes[path]();
        } else {
            renderPlaceholder(path);
        }
        window.history.pushState({}, '', '#' + path);
    }
}
```

### Suggested Router Enhancement
```javascript
const router = {
    routes: {
        '/dashboard': renderDashboard,
        '/projects': renderProjects,
        '/library': renderLibrary,
        '/tasks': renderTasks,
        '/meauxphoto': renderMeauxPhoto,
        '/meauxdoc': renderMeauxDoc,
        '/meauxcad': renderMeauxCAD,
        '/meauxcloud': renderMeauxCloud,
        '/chat/talk': renderChatTalk,
        '/chat/mail': renderChatMail,
        '/chat/calendar': renderCalendar,
        '/chat/meet': renderGroupCall,
        '/dev-console': renderDevConsole,
        '/integrations': renderIntegrations,
        '/vault': renderVault,
        '/audit': renderAudit,
    },
    
    navigate(path) {
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.route === path) {
                item.classList.add('active');
            }
        });
        
        // Render route
        if (this.routes[path]) {
            this.routes[path]();
        } else {
            renderPlaceholder(path);
        }
        
        // Update URL
        window.history.pushState({}, '', '#' + path);
    }
}
```

---

## 📱 Page Components Needed

### 1. Projects Page (`/projects`)
```javascript
function renderProjects() {
    const content = getMainContent();
    content.innerHTML = `
        <div style="padding: 32px;">
            <h1>Projects</h1>
            <div class="projects-grid">
                <!-- Project cards -->
            </div>
        </div>
    `;
}
```

### 2. Library Page (`/library`)
```javascript
function renderLibrary() {
    const content = getMainContent();
    content.innerHTML = `
        <div style="padding: 32px;">
            <h1>Library</h1>
            <div class="media-gallery">
                <!-- Media grid -->
            </div>
        </div>
    `;
}
```

### 3. Tasks Page (`/tasks`)
```javascript
function renderTasks() {
    const content = getMainContent();
    content.innerHTML = `
        <div style="padding: 32px;">
            <h1>Tasks</h1>
            <div class="task-board">
                <!-- Kanban board -->
            </div>
        </div>
    `;
}
```

### 4. Group Call Page (`/chat/meet`)
```javascript
function renderGroupCall() {
    const content = getMainContent();
    content.innerHTML = `
        <div style="padding: 32px;">
            <h1>Group Call</h1>
            <!-- Full-screen call interface -->
        </div>
    `;
}
```

### 5. Dev Console (`/dev-console`)
```javascript
function renderDevConsole() {
    const content = getMainContent();
    content.innerHTML = `
        <div style="padding: 32px;">
            <h1>Dev Console</h1>
            <!-- SQL console, API explorer, logs -->
        </div>
    `;
}
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Peach/Orange (`#f27a4f`, `#e85d30`)
- **Background**: Warm white (`#faf8f6`)
- **Surface**: White with transparency
- **Text**: Gray scale (`#1f2937` to `#9ca3af`)

### Components
- **Claymorphic Cards** - Soft shadows, rounded corners
- **Glass Panels** - Backdrop blur, transparency
- **Icon Buttons** - Circular, hover effects
- **Nav Items** - Active states, hover effects

### Layout
- **Topbar**: 72px height
- **Sidebar**: 260px width
- **Main Content**: Flexible, scrollable
- **Dock**: 72px height (bottom controls)

---

## 🔌 API Endpoints

### Currently Used
- `/api/dashboard/stats` - Dashboard statistics
- `/api/sfu/session` - Group call session creation
- `/api/turn/credentials` - TURN server credentials
- `/api/google/proxy` - Google AI (Gemini) proxy

### Available (Not Yet Used)
- `/api/meshy/generate` - 3D model generation
- `/api/cloudconvert/jobs` - File conversion
- `/api/email/send` - Email sending
- `/api/chat/messages` - Chat messages
- `/api/chat/send` - Send chat message
- `/api/sql/execute` - SQL execution
- `/api/images/list` - Cloudflare Images list

---

## 📋 Implementation Priority

### Phase 1: Core Pages (High Priority)
1. ✅ Dashboard - **DONE**
2. ⚠️ Projects - **NEXT**
3. ⚠️ Tasks - **NEXT**
4. ⚠️ Library - **NEXT**

### Phase 2: Communication (Medium Priority)
5. ⚠️ Group Call (`/chat/meet`) - Full page
6. ⚠️ Chat (`/chat/talk`)
7. ⚠️ Mail (`/chat/mail`)
8. ⚠️ Calendar (`/chat/calendar`)

### Phase 3: Apps (Medium Priority)
9. ⚠️ MeauxPHOTO
10. ⚠️ MeauxDOC
11. ⚠️ MeauxCAD
12. ⚠️ MeauxCloud

### Phase 4: Admin/Dev (Lower Priority)
13. ⚠️ Dev Console
14. ⚠️ Integrations
15. ⚠️ Vault
16. ⚠️ Audit

---

## 🚀 Next Steps

1. **Implement Router Enhancement**
   - Add all route handlers
   - Connect navigation items to routes
   - Add route guards/authentication

2. **Build Core Pages**
   - Projects page
   - Tasks page
   - Library page

3. **Enhance Group Call**
   - Full-page call interface
   - Better controls
   - Participant management

4. **Add Page Transitions**
   - Smooth animations
   - Loading states
   - Error handling

---

## 📚 Documentation

- **Current Site**: https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html#/dashboard
- **Production**: https://meauxcloud.org/dashboard
- **GitHub Repo**: https://github.com/ceosamprimeaux/meauxCLOUD

