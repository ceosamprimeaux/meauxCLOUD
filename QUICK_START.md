# 🚀 Quick Start: HTML Refactoring & CI/CD

## ✅ What You Now Have

### 1. **Automated HTML Refactoring**
Any HTML file you provide will be automatically:
- ✅ Connected to all your APIs (OAuth, MeshyAI, CloudConvert, Resend, Cloudflare)
- ✅ Configured for dev (GitHub Pages) and production (Cloudflare)
- ✅ Given a global `window.meauxAPI` helper
- ✅ Environment-aware (auto-detects dev vs production)

### 2. **Reliable CI/CD Pipeline**
- ✅ **Dev**: Auto-deploys to GitHub Pages on every push
- ✅ **Production**: Auto-deploys to Cloudflare (R2 + Worker) on main branch
- ✅ Build verification before deployment
- ✅ Parallel deployments for speed

## 📝 How to Use

### Adding a New HTML File

1. **Create your HTML file** (e.g., `new-page.html`)

2. **Add it to the build process** (optional - if you want it auto-copied):
   ```json
   // In package.json, update copy:html:
   "copy:html": "mkdir -p dist && cp dashboard.html index.html login.html new-page.html output.css dist/ 2>/dev/null || true"
   ```

3. **Refactor it**:
   ```bash
   npm run refactor:file new-page.html
   ```

4. **Or refactor all files**:
   ```bash
   npm run refactor
   ```

5. **Build and deploy**:
   ```bash
   npm run build  # Includes refactoring automatically
   git add . && git commit -m "Add new page" && git push
   ```

### Using the API in Your HTML

After refactoring, you get `window.meauxAPI` with all integrations:

```html
<script>
  // Dashboard stats
  const stats = await meauxAPI.getDashboardStats();
  
  // OAuth
  meauxAPI.initiateGoogleAuth();
  meauxAPI.initiateGitHubAuth();
  
  // MeshyAI
  const model = await meauxAPI.generate3D({ prompt: "..." });
  
  // CloudConvert
  const job = await meauxAPI.createJob({ ... });
  
  // Resend Email
  await meauxAPI.sendEmail({ to: "...", subject: "...", html: "..." });
  
  // Cloudflare Images
  const images = await meauxAPI.listImages();
  
  // SQL
  const results = await meauxAPI.executeSQL("SELECT * FROM users");
  
  // Chat
  const messages = await meauxAPI.getMessages();
  await meauxAPI.sendMessage({ user: "...", text: "..." });
</script>
```

## 🔄 Workflow

### Development
1. Edit HTML files
2. Run `npm run refactor` (or it runs automatically on build)
3. Test locally: `npm run preview`
4. Push to GitHub → Auto-deploys to dev container

### Production
1. Push to `main` branch
2. CI/CD automatically:
   - Builds with refactoring
   - Deploys to GitHub Pages (dev)
   - Deploys to Cloudflare (production)

## 🎯 What Gets Refactored

- ✅ API endpoint URLs (dev vs production)
- ✅ OAuth links (Google, GitHub)
- ✅ Asset paths
- ✅ Adds environment detection
- ✅ Adds global API helper
- ✅ Adds error handling

## 📚 Full Documentation

See `REFACTORING_GUIDE.md` for complete details.

## 🚨 Important Notes

1. **Always run refactor after editing HTML** (or it runs on build)
2. **Dev environment** uses GitHub Pages URL for APIs
3. **Production environment** uses meauxcloud.org for APIs
4. **All API calls** automatically use correct base URL based on environment

