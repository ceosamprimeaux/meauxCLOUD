# MeauxCLOUD 🌩️
<<<<<<< HEAD

**Enterprise Cloud Platform | Multi-Tenant SaaS Infrastructure**

[![Deploy](https://github.com/ceosamprimeaux/meauxCLOUD/actions/workflows/deploy.yml/badge.svg)](https://github.com/ceosamprimeaux/meauxCLOUD/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

---

## 🚀 Live Environments

### Production
- **Main Platform**: [meauxcloud.org](https://meauxcloud.org)
- **Dashboard**: [meauxcloud.org/dashboard](https://meauxcloud.org/dashboard)
- **API**: [meauxcloud.org/api](https://meauxcloud.org/api)

### Development
- **GitHub Pages**: [ceosamprimeaux.github.io/meauxCLOUD](https://ceosamprimeaux.github.io/meauxCLOUD/)
- **Dev Dashboard**: [ceosamprimeaux.github.io/meauxCLOUD/dashboard.html](https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html)

### Tenant Subdomains
- `dev.meauxcloud.org` - Development environment
- `admin.meauxcloud.org` - Admin portal
- `fred.meauxcloud.org` - Fred's workspace
- `connor.meauxcloud.org` - Connor's workspace
=======
**Enterprise Cloud Platform | Multi-Tenant SaaS Infrastructure**

*Deploy License*

## 🚀 Live Environments

| Environment | URL |
| :--- | :--- |
| **Production** | |
| Main Platform | [meauxcloud.org](https://meauxcloud.org) |
| Dashboard | [meauxcloud.org/dashboard](https://meauxcloud.org/dashboard) |
| API | [meauxcloud.org/api](https://meauxcloud.org/api) |
| **Development** | |
| GitHub Pages | [ceosamprimeaux.github.io/meauxCLOUD](https://ceosamprimeaux.github.io/meauxCLOUD) |
| Dev Dashboard | [ceosamprimeaux.github.io/meauxCLOUD/dashboard.html](https://ceosamprimeaux.github.io/meauxCLOUD/dashboard.html) |
| **Tenant Subdomains** | |
| Dev | `dev.meauxcloud.org` |
| Admin | `admin.meauxcloud.org` |
| Fred | `fred.meauxcloud.org` |
| Connor | `connor.meauxcloud.org` |
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

---

## 🏗️ Architecture

<<<<<<< HEAD
```
MeauxCLOUD Platform
├── Frontend
│   ├── GitHub Pages (Dev/Staging)
│   ├── Cloudflare R2 (Asset Storage)
│   └── React + esbuild (Fast builds)
├── Backend
│   ├── Cloudflare Workers (Edge Functions)
│   ├── D1 Database (SQLite at Edge)
│   ├── Hyperdrive (PostgreSQL Connection Pooling)
│   └── Supabase (PostgreSQL Database)
├── Infrastructure
│   ├── Cloudflare (CDN, Workers, R2, D1, Pages)
│   ├── GitHub (Source Control, CI/CD, Self-Hosted Runners)
│   ├── Google Cloud (OAuth, APIs)
│   └── Supabase (Database, Edge Functions)
└── Integrations
    ├── Resend (Email)
    ├── Google OAuth
    ├── GitHub OAuth
    └── Cloudflare AI Gateway
```

---
=======
```mermaid
graph TD
    User --> Cloudflare
    Cloudflare --> Workers[Frontend/Backend Workers]
    Workers --> D1[D1 Database (SQLite)]
    Workers --> R2[R2 Storage (Assets)]
    Workers --> Hyperdrive
    Hyperdrive --> Supabase[PostgreSQL]
    Workers --> AI[AI Gateway (Gemini/OpenAI)]
    
    subgraph "CI/CD Pipeline"
        GitHub[Source Code] --> Actions[GitHub Actions]
        Actions --> Pages[GitHub Pages (Dev)]
        Actions --> Workers[Deploy to Prod]
    end
```
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

## 🛠️ Tech Stack

### Frontend
<<<<<<< HEAD
- **Framework**: React 19.2
- **Build Tool**: esbuild (233ms builds!)
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: React Router v7

### Backend
- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Database**: 
  - D1 (SQLite at edge) - Primary
  - Supabase PostgreSQL (via Hyperdrive) - Complex queries
- **Storage**: 
  - R2 (Object storage)
  - Supabase Storage

### Infrastructure
- **CDN/Edge**: Cloudflare
- **CI/CD**: GitHub Actions (Self-Hosted Runners)
- **Deployment**: 
  - GitHub Pages (Dev)
  - Cloudflare Workers (Production)
- **Monitoring**: Cloudflare Observability + Custom Analytics

### Integrations
- **Email**: Resend API
- **Auth**: Google OAuth, GitHub OAuth
- **AI**: Cloudflare AI Gateway (Gemini, OpenAI, Anthropic)
- **3D**: MeshyAI
- **File Conversion**: CloudConvert
=======
- **Framework:** React 19.2 (via simple templates currently)
- **Build Tool:** esbuild (233ms builds!)
- **Styling:** Tailwind CSS + Custom "Clay Global" Aesthetic
- **3D Engine:** `@google/model-viewer` + MeshyAI assets

### Backend
- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Database:** D1 (Primary), Supabase (Complex/History)
- **Storage:** Cloudflare R2

### Infrastructure
- **Hosting:** Cloudflare (Workers, Pages, DNS)
- **CI/CD:** GitHub Actions (Self-Hosted Runners)
- **Identity:** Google OAuth, GitHub OAuth
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

---

## 📦 Quick Start

### Prerequisites
- Node.js 20+
<<<<<<< HEAD
- npm or yarn
- Cloudflare account
- GitHub account
=======
- Cloudflare Account
- Git
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

### Installation

```bash
# Clone repository
git clone https://github.com/ceosamprimeaux/meauxCLOUD.git
cd meauxCLOUD

# Install dependencies
npm install

# Build project
npm run build

<<<<<<< HEAD
# Preview locally
npm run preview
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy:worker

# Deploy everything (build + R2 + worker)
npm run deploy
=======
# Deploy to Worker
npm run deploy:worker
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)
```

---

## 🔧 Configuration

<<<<<<< HEAD
### Environment Variables

See `.env.example` for required environment variables. **Never commit secrets!**

Key variables:
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `SUPABASE_URL` - Supabase project URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

### GitHub Secrets

Required secrets for GitHub Actions (see `GITHUB_ACTIONS_SECRETS.md`):
- Cloudflare credentials
- API keys (Google, Resend, etc.)
- Database credentials

### Cloudflare Workers

Worker configuration in `wrangler.toml`:
- Routes: `meauxcloud.org` and subdomains
- Bindings: D1, R2, Hyperdrive, AI, KV
- Observability: Enabled for monitoring
=======
**Never commit secrets!** Use `wrangler secret put` for production variables.

### Key Secrets
- `CLOUDFLARE_API_TOKEN`
- `GITHUB_CLIENT_ID` / `SECRET`
- `GOOGLE_CLIENT_ID` / `SECRET`
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

---

## 📊 Account Resources

<<<<<<< HEAD
### Cloudflare Account
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Domains**: 11 zones (1 Pro, 10 Free)
- **Workers**: 136 workers
- **Pages Projects**: 10 projects
- **D1 Databases**: 21 databases
- **R2 Buckets**: Multiple buckets
- **Hyperdrive**: 1 connection pool

### GitHub Repository
- **Repository**: `ceosamprimeaux/meauxCLOUD`
- **Self-Hosted Runners**: Enabled
- **GitHub Pages**: Enabled
- **Workflows**: Automated CI/CD

See `ACCOUNT_ORGANIZATION_GUIDE.md` for complete account structure.

---

## 🎯 Features

### Core Platform
- ✅ Multi-tenant architecture
- ✅ Real-time dashboard
- ✅ Project & task management
- ✅ User authentication (Google, GitHub)
- ✅ File storage (R2, Supabase)
- ✅ Email notifications (Resend)

### Advanced Features
- ✅ Group video calls (WebRTC, SFU, TURN)
- ✅ AI Assistant (Google Gemini via AI Gateway)
- ✅ Real-time chat (Durable Objects)
- ✅ Analytics dashboard
- ✅ API rate limiting
- ✅ Webhook support

### Developer Tools
- ✅ Self-healing database tables
- ✅ Automated HTML refactoring
- ✅ Environment-specific builds
- ✅ Comprehensive error logging
- ✅ Observability endpoints

---

## 📈 Analytics & Monitoring

### Built-in Analytics
- **Dashboard**: Real-time usage metrics
- **Cost Tracking**: Cloudflare billing monitoring
- **Performance**: Response times, error rates
- **GitHub Actions**: Build times, success rates

### Monitoring Endpoints
- `GET /api/analytics/overview` - Overall metrics
- `GET /api/analytics/cloudflare` - Cloudflare usage
- `GET /api/analytics/github` - GitHub Actions stats
- `GET /api/analytics/costs` - Cost breakdown

See `ANALYTICS_SETUP.md` for detailed setup.

---

## 🔐 Security

### Best Practices
- ✅ Secrets stored in Cloudflare Workers secrets
- ✅ GitHub Secrets for CI/CD
- ✅ Environment variables for local dev
- ✅ OAuth for authentication
- ✅ API rate limiting
- ✅ CORS protection

### Secrets Management
- **Cloudflare**: Worker secrets (via `wrangler secret put`)
- **GitHub**: Repository secrets (via GitHub UI)
- **Local**: `.env` file (gitignored)

**Never commit secrets to the repository!**

---

## 🚀 Deployment

### GitHub Pages (Dev/Staging)
Automatically deploys on push to `main`:
1. Builds with esbuild
2. Uploads to GitHub Pages
3. Available at `ceosamprimeaux.github.io/meauxCLOUD`

### Cloudflare Workers (Production)
Manual deployment:
```bash
npm run deploy:worker
```

Or via GitHub Actions (when configured).

### R2 Assets
Sync assets to R2:
```bash
npm run sync:r2
```

---

## 📚 Documentation

- **Account Organization**: `ACCOUNT_ORGANIZATION_GUIDE.md`
- **Billing Explained**: `CLOUDFLARE_BILLING_EXPLAINED.md`
- **Hyperdrive Setup**: `HYPERDRIVE_SETUP.md`
- **Telemetry Setup**: `TELEMETRY_SETUP.md`
- **GitHub Secrets**: `GITHUB_ACTIONS_SECRETS.md`
- **Complete Setup**: `COMPLETE_SETUP_SUMMARY.md`
- **URL Receipt**: `URL_RECEIPT.md`

---

## 🧪 Testing

### Local Testing
```bash
# Run tests (when implemented)
npm test

# Test API endpoints locally
npm run dev
# Then visit http://localhost:8787
```

### Production Testing
- Test endpoints: `https://meauxcloud.org/api/health`
- Check logs: Cloudflare Dashboard → Workers → Logs
- Monitor analytics: Dashboard → Analytics

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **On Push to Main**:
   - Checkout code
   - Install dependencies
   - Build with esbuild
   - Deploy to GitHub Pages

2. **Self-Hosted Runners**:
   - Runs on your own infrastructure
   - Faster builds
   - No GitHub Actions minutes used

### Manual Deployment
```bash
# Full deployment
npm run deploy

# Worker only
npm run deploy:worker

# Assets only
npm run sync:r2
```

---

## 👥 Team

- **CEO**: ceo@meauxcloud.org
- **Sam**: sam@meauxcloud.org
- **Fred**: fred@meauxcloud.org
- **Connor**: connor@meauxcloud.org
- **Dev**: dev@meauxcloud.org
- **Admin**: admin@meauxcloud.org

---

## 📊 Current Stats

- **Users**: 14+
- **Projects**: 25+
- **Tasks**: 29+
- **Deployments**: Multiple
- **Database Tables**: 150+
- **Workers**: 136
- **Domains**: 11

---

## 🎨 Brand

- **Primary Color**: `#f27a4f` (Peach/Orange)
- **Secondary Color**: `#e85d30` (Orange)
- **Accent**: `#22d3ee` (Cyan)
- **Background**: `#faf8f6` (Warm White)

---

## 📝 License

Proprietary - MeauxCLOUD Enterprise Platform

All rights reserved. This software is proprietary and confidential.

---

## 🤝 Contributing

This is a private enterprise platform. For access, contact the team.

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues (private repo)
- **Email**: support@meauxcloud.org
=======
- **Account ID:** `ede6590ac0d2fb7daf155b35653457b2`
- **Workers:** 136 Active Workers
- **Domains:** 11 Zones

---

## 🎨 Brand: "Clay Global"

- **Primary:** `#f27a4f` (Peach/Orange)
- **Background:** `#1e293b` (Deep Space Clay)
- **Accent:** `#22d3ee` (Cyan Glow)
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)

---

## 🗺️ Roadmap

<<<<<<< HEAD
### Current Focus
- ✅ Full D1 database integration
- ✅ Analytics dashboard
- ✅ Cost monitoring
- ✅ GitHub-Cloudflare integration

### Upcoming
- [ ] Advanced analytics
- [ ] Cost optimization
- [ ] Performance improvements
- [ ] Additional integrations

---

**Built with 💎 by the MeauxCLOUD team**

=======
- [x] Full D1 database integration
- [x] Analytics dashboard
- [x] GitHub-Cloudflare integration
- [x] Clay Global UI Remaster
- [x] 3D Propulsion Engine Integration
- [ ] Advanced cost optimization
- [ ] Native iOS App wrappers

---

*Built with 💎 by the MeauxCLOUD team.*
>>>>>>> 714d3ee (MeauxCLOUD V1.0: Clay Global + 3D Engine + GitHub OAuth)
*Last Updated: January 4, 2026*
