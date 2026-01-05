# MeauxCLOUD Team Sync: Master Architecture 🌩️

**Version 1.0 "Clay Propulsion"**  
*Central Reference for Engineering & Operations*

---

## 1. Authentication & User Flow

### 🔐 OAuth Architecture
We support **Google** and **GitHub** for authentication. We do not store passwords.

1.  **User Visits:** `https://meauxcloud.org/login`
2.  **Action:** Clicks "Continue with GitHub".
3.  **Redirect:** Browser goes to `https://github.com/login/oauth/authorize`.
4.  **Callback:** GitHub redirects back to `https://meauxcloud.org/api/auth/github/callback` with a `?code=...`.
5.  **Exchange:** Worker exchanges `code` for `access_token` (Server-to-Server).
6.  **Session:** Worker creates a session in D1 (`sessions` table) and sets a `HttpOnly` cookie (`meaux_session`).
7.  **Dashboard:** User is redirected to `/dashboard`.

| Provider | Client ID | Callback URL |
| :--- | :--- | :--- |
| **GitHub** | `Ov23liNZWtaQbQT6RkZi` | `.../api/auth/github/callback` |
| **Google** | *(Secret)* | `.../api/auth/google/callback` |

---

## 2. Infrastructure & Cloudflare

### ⚡ Worker Architecture (`src/index.ts`)
The entire backend runs on a single Cloudflare Worker using the **Hono** framework.

*   **Entry Point:** `src/index.ts`
*   **Routing:**
    *   `/api/auth/*` -> `src/routes/auth.ts` (Login/Logout)
    *   `/api/superadmin/*` -> `src/routes/superadmin.ts` (Admin Tools)
    *   `/api/projects/*` -> `src/routes/projects.ts` (CRUD)
    *   `/api/proxy/*` -> `src/routes/proxy.ts` (CORS Bypass for 3D Assets)
*   **Middleware:**
    *   `sessionMiddleware`: Check cookie, validate session in D1.
    *   `analyticsMiddleware`: Logs request data to `MEAUXCLOUD_ANALYTICS`.

### 🌍 GCP Integration
We use Google Cloud Platform primarily for **AI and Identity**.
*   **Service:** `superadmin.ts` auto-provisions GCP Project access for Admins.
*   **IAM:** Uses Workload Identity Federation (GitHub Actions -> GCP).

---

## 3. Database Schema (D1: `meauxos`)

The neural memory of the platform.

### Table: `sessions`
Tracks active user logins.
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT,          -- Added in V1.0
  name TEXT,           -- Added in V1.0
  picture TEXT,        -- Added in V1.0
  provider TEXT,       -- 'google' or 'github'
  tokens TEXT,         -- JSON blob of OAuth tokens
  created_at INTEGER,
  expires_at INTEGER
);
```

### Table: `users` (Planned/Implicit)
Currently derived from OAuth profiles. Future consolidation planned.

### Table: `projects`
Tracks user workloads and "Meauxbility" initiatives.

---

## 4. Branding & Design: "Clay Global"

**Philosophy:** Technology should feel tactile and permanent, like fired clay in deep space.

*   **Background:** `#1e293b` (Deep Space Slate)
*   **Surface:** `#334155` (Clay Card)
*   **Shadows:** Outer drop shadows + Inner inset shadows (The "Pressed" look).
*   **Iconography:** custom SVG (No Emojis allowed).
*   **3D Elements:** `@google/model-viewer` displaying `.glb` assets (Jets, Engines) via R2 Proxy.

---

## 5. MeauxAI & Agents 🧠

**"The Neural Core"**
Our agents are not chatbots; they are infrastructure automators.

1.  **Brand Builder Workflow:** (`src/workflows/brand-builder`)
    *   Automates asset generation and consistency checks.
2.  **Analytics Agent:**
    *   Analyzes `analytics_engine` data to optimize costs.

**Integration:**
Agents run as **Cloudflare Workflows** or **Durable Objects** to maintain state and execute long-running tasks asynchronously.

---

## 6. Directory Structure

```text
meauxcloud/
├── .github/workflows/    # CI/CD Pipelines
├── src/
│   ├── frontend/         # HTML/TS Templates (The UI)
│   │   ├── public/       # Home, About, Services
│   │   ├── dashboard/    # App Interface
│   │   └── auth/         # Login Pages
│   ├── middleware/       # Session, Analytics
│   ├── routes/           # API Endpoints
│   ├── workflows/        # Agent Definitions
│   └── index.ts          # Main Router
├── wrangler.toml         # Infrastructure Config
└── README.md             # Public Docs
```

---

## 7. Meauxbility & Inner Animals

**Meauxbility Connection:**
MeauxCLOUD is the *operating system* for the Meauxbility non-profit. It powers the donation portals, case management (Inner Animals), and logistics.

**Inner Animals Integration:**
*   **Shared Auth:** Admins on MeauxCLOUD can manage Inner Animals cases.
*   **Shared D1:** `meauxos` contains case data for animal rescues (future migration).

---

*Generated for Team Sync - January 4, 2026*
