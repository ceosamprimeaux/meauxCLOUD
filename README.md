# meauxCLOUD # Meaux Platform — README
**Meaux is an operating system for organizations.**  
A unified, multi-tenant platform where teams communicate, plan, design, automate, manage data, and ship content—without fragmentation.

This repository is the **source of truth** for:
- The **Meaux OS shell** (`/dashboard`) and all internal app modules (Talk, Work, SQL, CAD, Media, IDE, OS)
- The **public site** (SEO-first marketing pages for each product)
- Shared **design system**, **SEO/schema**, and **deployment discipline**
- The long-term roadmap to a **GitHub App**, **Chrome Extension**, and **iOS app**

---

## Contents
- [Product Map](#product-map)
- [Core Principles](#core-principles)
- [Apps & Modules](#apps--modules)
- [Information Architecture](#information-architecture)
- [Design System](#design-system)
- [SEO, Schema, Metadata Standards](#seo-schema-metadata-standards)
- [Build & Deploy Model](#build--deploy-model)
- [Page-by-Page Delivery Protocol](#page-by-page-delivery-protocol)
- [Data & Infrastructure](#data--infrastructure)
- [Security & Multi-Tenancy](#security--multi-tenancy)
- [Future Targets](#future-targets)
- [Repository Structure](#repository-structure)
- [Contributing & Quality Gates](#contributing--quality-gates)

---

## Product Map
Meaux is not a collection of random apps. It is a single operating environment.

### Foundation
- **MeauxStack** (internal): platform primitives, multi-tenancy, governance, security patterns

### Control Plane
- **MeauxCloud**: infrastructure surface for storage, APIs, visibility, governance

### Core App Modules (inside `/dashboard`)
- **MeauxTalk**: channels, rooms, events (one-to-many streaming), presence, organizational context
- **MeauxWork**: Kanban + project execution (boards, columns, cards, assignments)
- **MeauxSQL**: controlled query workspace (editor, schema, saved queries, audit trail)
- **MeauxCAD**: design + modeling workflows (Meshy + Blender + CloudConvert + R2 pipelines)
- **MeauxMedia**: content production + optimization + distribution workflows
- **MeauxIDE**: unified environment for building/configuring Meaux systems
- **MeauxOS**: deployable operating models (templates, playbooks, courseware)

### Cross-Cutting Capabilities (shared primitives)
- OAuth + Identity
- Tenant settings & theming
- File storage (R2) + previews + conversions
- Durable Objects for presence/stateful rooms
- Queues for background execution
- AI pipelines (assistive, auditable)

---

## Core Principles
**Fortune-500 quality is the minimum bar.**  
This repo enforces discipline so we can ship page-by-page without degrading.

### Non-negotiables
- One OS shell, many modules (no fragmented apps)
- `.tsx` everywhere, no index.html-first approach
- Shared design tokens, shared UI primitives, shared layouts
- One deployable page per cycle (prevents sloppy “20-page” dumps)
- Public pages are index-ready the moment they are approved

---

## Apps & Modules
Each app is defined by **purpose**, **allowed scope**, and **forbidden scope**.  
Agents must build only within these boundaries.

### MeauxTalk
**Purpose:** Structured communication with organizational context  
**Core surfaces:**
- Channels (async)
- Event Directory (Upcoming / Live / Past)
- Event Mode (one-to-many streaming)
- Context panel (participants, files, linked docs/projects)
**Forbidden:** social/gaming affordances, decorative backgrounds, feature-bloat clones.

### MeauxWork
**Purpose:** Execution clarity via boards and assignments  
**Core surfaces:**
- Boards → Columns → Cards
- Assignments, status, due dates
- Activity (lightweight)
**Forbidden:** analytics dashboards, complex automation until requested.

### MeauxSQL
**Purpose:** Controlled access to data with auditability  
**Core surfaces:**
- Query editor
- Schema viewer
- Saved queries/snippets
- History + audit trail
**Forbidden:** exposing credentials, unbounded queries, provisioning external DBs in early phases.

### MeauxCAD
**Purpose:** Design workflows connected to execution  
**Core surfaces:**
- Project/asset library
- Upload → convert → render → export lifecycle
- Status + job history
**Pipelines:** Meshy + Blender + CloudConvert + R2  
**Forbidden:** building full in-browser 3D modeling before the pipeline UX is mature.

### MeauxMedia
**Purpose:** Content production + optimization + distribution  
**Core surfaces:**
- Media library
- Editing workflow stages (draft → refine → publish)
- Multi-platform exports (templates)
**Forbidden:** manual repeated steps; workflows should become structured and repeatable.

### MeauxIDE
**Purpose:** Unified system interface for builders/operators  
**Core surfaces:**
- Projects/config
- Scripts/actions
- Integrations
- Logs/audit
**Forbidden:** over-abstracting or hiding system behavior.

### MeauxOS
**Purpose:** Operating models and templates that help orgs run well  
**Product lines:**
- Nonprofit OS
- Creator OS
- Operations OS
**Delivery:** deployable templates + guided implementation + optional courses.

---

## Information Architecture
### Public (indexable)
- `/` (home)
- `/products` (platform overview)
- `/solutions/*` (audience pages)
- `/pricing`
- `/docs`
- `/meauxcloud`
- `/meauxtalk`
- `/meauxwork`
- `/meauxsql`
- `/meauxcad`
- `/meauxmedia`
- `/meauxide`
- `/meauxos`

### Dashboard (authenticated OS)
- `/dashboard` (OS Home)
- `/dashboard/apps` (App Drawer / “store”)
- `/dashboard/talk` + `/dashboard/talk/events`
- `/dashboard/work`
- `/dashboard/sql`
- `/dashboard/cad`
- `/dashboard/media`
- `/dashboard/ide`
- `/dashboard/settings`

**Rule:** marketing routes describe; dashboard routes do.

---

## Design System
Meaux uses a restrained **glass/clay** aesthetic:
- Calm background gradients (no overpowering imagery)
- Frosted surfaces, subtle blur, controlled elevation
- Minimal borders, strong typography hierarchy
- Light/dark themes as first-class (tenant-scoped)

### Design Tokens
All surfaces must use tokens (CSS variables):
- `--bg`, `--surface`, `--surface-2`, `--border`
- `--text`, `--muted`, `--brand`, `--accent`
- `--radius`, `--shadow`, `--blur`
No hard-coded colors in components.

---

## SEO, Schema, Metadata Standards
Public pages must be **index-ready on approval**.

### Every public page must include
- One `<h1>`
- `<title>` and meta description (unique)
- Canonical URL
- OpenGraph + Twitter cards
- JSON-LD schema (page-appropriate)
- Clean semantic sections (no div soup)

### Schema guidance
- Root: `Organization`, `WebSite` (+ SearchAction), `SoftwareApplication`
- Product pages: `SoftwareApplication` + relevant category types (e.g. `CommunicationApplication`)
- MeauxOS: may include `Course` / `EducationalOrganization` where applicable

### Copy separation
- **Public copy**: minimal, value-focused, non-technical, index-safe
- **Internal copy**: operational, directive, implementation-ready (not indexed)

---

## Build & Deploy Model
We deploy as **two Cloudflare Pages projects**:
1. `apps/web` → `meauxcloud.org` (public)
2. `apps/dashboard` → `meauxcloud.org/dashboard` (authenticated OS)

Pages Functions handle:
- OAuth callbacks/session validation
- DB/R2/DO integration endpoints
- Lightweight APIs needed for each page

A separate Worker API is optional later (only if needed).

---

## Page-by-Page Delivery Protocol
Agents must follow this protocol for every build cycle:

1. **Declare scope**
   - App name
   - Route
   - What is NOT included
2. **Define UI structure**
   - Layout regions
   - Components used/created
   - State sources (read-only vs interactive)
3. **Implement**
   - `.tsx` components only
   - Use shared tokens + primitives
   - No duplicated markup
4. **Assets**
   - Store assets in R2 (no base64, no local-only)
5. **Validate**
   - Tenant boundaries respected
   - Navigation continuity
   - Metadata + schema correct (public pages)
6. **Deploy-ready**
   - One page/module only
7. **Stop**
   - Do not expand scope “helpfully”

---

## Data & Infrastructure
### Storage
- **R2**: media, exports, previews, CAD assets, recordings

### Persistence
- **D1** (or current DB): tenants, memberships, settings, app entitlements, audit logs, content metadata

### Stateful coordination
- **Durable Objects**: presence, rooms, event state, live session coordination

### Background execution
- **Queues**: conversion jobs, render jobs, indexing, AI summaries, distribution workflows

### AI pipelines
Used for:
- Summaries, action extraction, highlights, structured outputs
Never:
- Unpredictable automation without audit or approval

---

## Security & Multi-Tenancy
### Multi-tenant rule
All data access is scoped by `tenant_id`.
- Tenant settings include theme + app entitlements.
- Every request resolves tenant context.
- Audit logs are mandatory for sensitive actions (SQL runs, publishing, admin changes).

### OAuth
Google OAuth is the standard provider for this repo.

---

## Future Targets
This codebase is designed to expand into:
- **GitHub App**
  - Install into orgs
  - Connect repos/issues/projects into MeauxWork and MeauxTalk
  - Trigger AutoMeaux workflows from GitHub events
- **Chrome Extension**
  - Quick capture to MeauxDOC
  - Save links/files to MeauxMedia
  - “Send to MeauxTalk” context
- **iOS App**
  - Notifications + event participation
  - MeauxTalk rooms/events
  - Lightweight MeauxWork updates and approvals

**Rule:** future targets consume the same core primitives (auth, tenant model, R2, audit).

---

## Repository Structure
Recommended layout:
