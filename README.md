# MeauxCLOUD 🌩️

**Enterprise Cloud Platform | Multi-Tenant SaaS Infrastructure**

[![Deploy](https://github.com/ceosamprimeaux/meauxCLOUD/actions/workflows/deploy.yml/badge.svg)](https://github.com/ceosamprimeaux/meauxCLOUD/actions/workflows/deploy.yml)

## 🚀 Live Environments

- **Production**: [meauxcloud.org](https://meauxcloud.org)
- **Dev Container**: [ceosamprimeaux.github.io/meauxCLOUD](https://ceosamprimeaux.github.io/meauxCLOUD/)
- **Tenant Subdomains**:
  - `fred.meauxcloud.org`
  - `connor.meauxcloud.org`
  - `dev.meauxcloud.org`
  - `admin.meauxcloud.org`

## 🏗️ Architecture

```
MeauxCLOUD (Dev Container)
├── Cloudflare Workers (Backend)
├── Cloudflare Pages (Frontend Auto-Deploy)
├── R2 Storage (Assets)
├── D1 Database (meauxos - 150+ tables)
├── Google Cloud (OAuth, Secret Manager)
└── GitHub (Source Control, CI/CD)
```

## 🎯 Multi-Tenant Apps

Each tenant gets a fully functional app with:
- Custom subdomain
- Isolated data
- Branded UI
- OAuth integration
- Email routing

## 🛠️ Tech Stack

- **Frontend**: React + esbuild (233ms builds!)
- **Backend**: Cloudflare Workers (Hono framework)
- **Database**: D1 (SQLite at edge)
- **Storage**: R2 + Supabase
- **Auth**: Google OAuth + GitHub OAuth
- **Email**: Cloudflare Email Routing + Resend
- **CI/CD**: GitHub Actions → GitHub Pages

## 📦 Quick Start

```bash
# Clone
git clone https://github.com/ceosamprimeaux/meauxCLOUD.git
cd meauxCLOUD

# Install
npm install

# Setup environment
source scripts/setup_env.sh

# Build
npm run build

# Deploy to Cloudflare
npx wrangler deploy
```

## 🔐 Team

- **CEO**: ceo@meauxcloud.org
- **Sam**: sam@meauxcloud.org
- **Fred**: fred@meauxcloud.org
- **Connor**: connor@meauxcloud.org
- **Dev**: dev@meauxcloud.org
- **Admin**: admin@meauxcloud.org

## 📊 Current Stats

- **Users**: 14
- **Projects**: 25
- **Tasks**: 29
- **Deployments**: 2
- **Database Tables**: 150+

## 🎨 Brand

- **Primary**: `#22d3ee` (Cyan)
- **Secondary**: `#2c3e50` (Gunmetal Grey)

## 📝 License

Proprietary - MeauxCLOUD Enterprise Platform

---

Built with 💎 by the MeauxCLOUD team
