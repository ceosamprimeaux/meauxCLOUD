# MeauxCLOUD Deployment Guide

## 🏗️ Architecture Overview

Your app uses a **hybrid architecture**:

1. **Cloudflare Worker** (`src/worker.js`) - Backend API + Asset Server
2. **R2 Bucket** (`meauxcloud`) - Static asset storage (HTML, CSS, JS, images)
3. **D1 Database** (`meauxos`) - SQLite edge database
4. **Multiple Frontend Types**:
   - **Standalone HTML** (`dashboard.html`) - Self-contained with inline CSS
   - **React App** (`dashboard_app.html`) - Requires built assets from `dist/`

## 🚨 Common Issues & Solutions

### Issue 1: Pages Load But Look Broken
**Problem**: HTML loads but CSS/JS don't load (404 errors)

**Cause**: Built assets in `dist/` aren't uploaded to R2

**Solution**: Run `npm run sync:r2` after building

### Issue 2: Duplicate Route Conflicts
**Problem**: Routes defined twice causing conflicts

**Solution**: ✅ Fixed - Removed duplicate routes at end of `worker.js`

### Issue 3: Wrong HTML File Being Served
**Problem**: React app HTML references assets that don't exist in R2

**Solution**: 
- Use `dashboard.html` for standalone dashboard (has inline CSS)
- Use `dashboard_app.html` for React app (requires assets in R2)

## 📦 Deployment Process

### Full Deployment (Recommended)
```bash
npm run deploy
```
This runs:
1. `npm run build` - Builds React app to `dist/`
2. `npm run sync:r2` - Uploads all `dist/` files to R2
3. `npm run deploy:worker` - Deploys Cloudflare Worker

### Step-by-Step Deployment

#### 1. Build Frontend
```bash
npm run build
```

#### 2. Sync Assets to R2
```bash
npm run sync:r2
```
This uploads:
- All files from `dist/` to R2 bucket `meauxcloud`
- Preserves directory structure (e.g., `dist/assets/main.js` → `assets/main.js` in R2)

#### 3. Deploy Worker
```bash
npm run deploy:worker
```

### Manual Asset Upload
If you need to upload a specific file:
```bash
npx wrangler r2 object put meauxcloud/path/to/file --file=./dist/path/to/file --content-type=text/html
```

## 🔍 Troubleshooting

### Check What's in R2
```bash
# List objects (requires Cloudflare dashboard or API)
# Or check via worker logs
```

### Verify Routes
Routes are defined in `src/worker.js`:
- `/` → `index.html` or `landing.html`
- `/dashboard` → `dashboard.html`
- `/login` → `login.html`
- `/assets/*` → Serves from R2 (e.g., `/assets/main.js` → `assets/main.js` in R2)

### Check Asset Paths
- React app HTML files reference `/assets/main-*.js` and `/assets/main-*.css`
- These must exist in R2 at `assets/main-*.js` (not `dist/assets/...`)

## 📁 File Structure

```
MeauxCLOUD/
├── src/
│   ├── worker.js          # Cloudflare Worker (backend + routing)
│   ├── main.jsx           # React app entry
│   └── components/        # React components
├── dist/                  # Built assets (uploaded to R2)
│   ├── assets/           # CSS/JS bundles
│   ├── dashboard_app.html # React app HTML
│   └── index.html        # Landing page
├── dashboard.html        # Standalone dashboard (inline CSS)
├── scripts/
│   └── sync_assets_to_r2.js  # Asset sync script
└── wrangler.toml         # Cloudflare config
```

## 🎯 Best Practices

1. **Always run full deploy** after making changes:
   ```bash
   npm run deploy
   ```

2. **For standalone HTML files** (like `dashboard.html`):
   - Upload directly: `npx wrangler r2 object put meauxcloud/dashboard.html --file=dashboard.html`

3. **For React app changes**:
   - Build → Sync → Deploy worker

4. **Check browser console** for 404 errors on assets

5. **Verify R2 uploads** by checking worker logs or testing routes

## 🔄 Current Setup

- ✅ Duplicate routes removed
- ✅ Asset sync script created
- ✅ Deployment scripts added to package.json
- ✅ Worker routes properly configured

## 🚀 Quick Deploy

```bash
# One command to rule them all
npm run deploy
```

