# HTML Refactoring Guide

## 🎯 Purpose

This tool automatically refactors HTML files to work seamlessly in both **dev** (GitHub Pages) and **production** (Cloudflare) environments with full API integration.

## 🚀 Quick Start

### Refactor All HTML Files
```bash
npm run refactor
```

### Refactor Specific File
```bash
npm run refactor:file path/to/file.html
```

### Manual Usage
```bash
node scripts/refactor_html_for_production.js --all
# or
node scripts/refactor_html_for_production.js file1.html file2.html
```

## ✨ What It Does

### 1. **Environment Detection**
- Automatically detects if file is in `dist/` (dev) or root (production)
- Sets correct base URLs for API calls

### 2. **API Endpoint Configuration**
Automatically configures:
- ✅ Google OAuth (`/api/auth/google`)
- ✅ GitHub OAuth (`/api/auth/github`)
- ✅ Dashboard Stats (`/api/dashboard/stats`)
- ✅ MeshyAI (`/api/meshy/generate`)
- ✅ CloudConvert (`/api/cloudconvert/jobs`)
- ✅ Resend Email (`/api/email/send`)
- ✅ Cloudflare Images (`/api/images/list`)
- ✅ Cloudflare Gateways (`/api/cloudflare/gateways`)
- ✅ SQL Execution (`/api/sql/execute`)
- ✅ Chat API (`/api/chat/messages`, `/api/chat/send`)

### 3. **Global API Helper**
Adds `window.meauxAPI` with helper methods:

```javascript
// Dashboard
const stats = await meauxAPI.getDashboardStats();

// OAuth
meauxAPI.initiateGoogleAuth();
meauxAPI.initiateGitHubAuth();

// MeshyAI
const result = await meauxAPI.generate3D({ prompt: "..." });

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
```

### 4. **Environment Variables**
Access environment info:
```javascript
window.MEAUX_ENV.isDev          // true/false
window.MEAUX_ENV.isProduction   // true/false
window.MEAUX_ENV.baseUrl         // API base URL
window.MEAUX_ENV.endpoints       // All API endpoints
window.MEAUX_ENV.oauth           // OAuth endpoints
```

### 5. **Asset Path Fixing**
- Dev (GitHub Pages): Uses relative paths
- Production: Uses absolute paths with base URL

### 6. **Error Handling**
- Global error handler for unhandled API rejections
- Console logging for debugging

## 📝 Example Usage in HTML

### Before Refactoring
```html
<script>
  fetch('/api/dashboard/stats')
    .then(r => r.json())
    .then(data => console.log(data));
</script>
```

### After Refactoring
```html
<script>
  // Automatically uses correct base URL
  meauxAPI.getDashboardStats()
    .then(data => console.log(data))
    .catch(err => console.error(err));
</script>
```

## 🔧 Integration Examples

### OAuth Login Buttons
```html
<button onclick="meauxAPI.initiateGoogleAuth()">
  Sign in with Google
</button>

<button onclick="meauxAPI.initiateGitHubAuth()">
  Sign in with GitHub
</button>
```

### Dashboard Stats
```html
<script>
  async function loadDashboard() {
    try {
      const stats = await meauxAPI.getDashboardStats();
      document.getElementById('projects').textContent = stats.projects;
      document.getElementById('users').textContent = stats.users;
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  }
  loadDashboard();
</script>
```

### MeshyAI 3D Generation
```html
<script>
  async function generate3D(prompt) {
    const result = await meauxAPI.generate3D({
      prompt: prompt,
      // ... other options
    });
    console.log('3D Model:', result);
  }
</script>
```

## 🎨 Build Process Integration

The refactoring is automatically included in the build:

```json
{
  "scripts": {
    "build": "esbuild ... && npm run copy:html && npm run refactor"
  }
}
```

This ensures all HTML files are properly configured before deployment.

## 🔍 Verification

After refactoring, check:
1. ✅ `window.MEAUX_ENV` is defined
2. ✅ `window.meauxAPI` is available
3. ✅ API calls use correct base URLs
4. ✅ OAuth links point to correct endpoints
5. ✅ Asset paths are correct for environment

## 🚨 Troubleshooting

### API calls failing?
- Check browser console for errors
- Verify `window.MEAUX_ENV.baseUrl` is correct
- Ensure CORS is configured on backend

### OAuth not working?
- Verify OAuth endpoints in `window.MEAUX_ENV.oauth`
- Check redirect URIs match backend configuration

### Assets not loading?
- Dev: Check relative paths in `dist/`
- Production: Verify assets uploaded to R2

