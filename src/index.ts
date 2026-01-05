/**
 * MeauxCLOUD - Infrastructure for Modern Nonprofits
 * Main Worker with Dashboard and Cloudflare Stream Integration
 */

import { Hono } from 'hono';
import { analyticsMiddleware } from './middleware/analytics';
import { sessionMiddleware } from './middleware/session';
import { superadminMiddleware } from './middleware/superadmin';
import auth from './routes/auth';
import projects from './routes/projects';
import contact from './routes/contact';
import superadminRoutes from './routes/superadmin';
import proxy from './routes/proxy';
// ... props ...
import { getHomepage } from './frontend/templates/public/home';
import { getAboutPage } from './frontend/templates/public/about';
import { getTermsPage } from './frontend/templates/public/terms';
import { getPrivacyPage } from './frontend/templates/public/privacy';

import { getLoginPage } from './frontend/templates/auth/login';
import { getProjectsPage } from './frontend/templates/dashboard/projects';
import { getDashboard } from './frontend/templates/dashboard/overview';
import { getSettingsPage } from './frontend/templates/dashboard/settings';
import { getLayout } from './frontend/templates/layout';
import type { Env } from './types/env';


const app = new Hono<{ Bindings: Env }>();
// ... app init ...


// Analytics tracking on all requests
app.use('*', analyticsMiddleware);

// Session middleware (must come before superadmin)
app.use('*', sessionMiddleware);

// Superadmin middleware (auto-provisions GCP access)
app.use('*', superadminMiddleware);

// Auth Routes
app.route('/api/auth', auth);

// Superadmin Routes
app.route('/api/superadmin', superadminRoutes);

// Contact / Inquiry Routes
app.route('/api/contact', contact);

// Projects API
app.route('/api/projects', projects);

// Asset Proxy (Fixes CORS for 3D Models)
app.route('/api/proxy', proxy);

// Settings API
app.get('/api/settings/themes', async (c) => {
  const themes = await c.env.DB.prepare('SELECT * FROM theme_configs WHERE is_active = 1').all();
  // Parse config_json string to object for frontend convenience
  const results = themes.results.map((t: any) => ({
    ...t,
    config_json: typeof t.config_json === 'string' ? JSON.parse(t.config_json) : t.config_json
  }));
  return c.json(results);
});


// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  });
});

// Homepage
app.get('/', (c) => {
  return c.html(getHomepage());
});


// About Page
app.get('/about', (c) => {
  const isDark = true;
  return c.html(getAboutPage(isDark));
});

// Terms of Service
app.get('/terms', (c) => c.html(getTermsPage()));

// Privacy Policy
app.get('/privacy', (c) => c.html(getPrivacyPage()));

// Support (redirect to contact)
app.get('/support', (c) => c.redirect('/contact'));

// Login Page
app.get('/login', (c) => {
  return c.html(getLoginPage());
});

// Protected Pages --------------------------------------

// Dashboard
app.get('/dashboard', sessionMiddleware, async (c) => {
  const user = c.get('user');
  return c.html(getDashboard(c.env, user));
});

// Projects
app.get('/projects', sessionMiddleware, (c) => {
  const user = c.get('user' as any);
  return c.html(getProjectsPage(c.env, user));
});

// Settings Page
app.get('/settings', sessionMiddleware, (c) => {
  const user = c.get('user' as any);
  return c.html(getSettingsPage(c.env, user));
});

// --- Generic Route Handlers for Sidebar Items ---
const placeholderPage = (title: string, activeId: string) => (c: any) => {
  const user = c.get('user');
  const content = `
    <div class="flex flex-col items-center justify-center h-full p-12 text-center">
      <div class="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center text-peach-500 mb-6">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">${title}</h2>
      <p class="text-gray-500 max-w-md">This module is part of the planned route structure and is currently under development.</p>
    </div>
  `;
  // We use the globally imported getLayout
  return c.html(getLayout({
    title: `${title} - MeauxCLOUD`,
    bodyContent: content,
    activeItem: activeId,
    user: user
  }));
};

app.get('/dashboard/library', sessionMiddleware, placeholderPage('Library', 'library'));
app.get('/dashboard/tasks', sessionMiddleware, placeholderPage('Tasks', 'tasks'));
app.get('/dashboard/automations', sessionMiddleware, placeholderPage('Automations', 'automations'));

// Pipelines Page
import { getPipelinesPage } from './frontend/templates/dashboard/pipelines';
app.get('/dashboard/pipelines', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(getPipelinesPage(c.env, user));
});

app.get('/dashboard/prompts', sessionMiddleware, placeholderPage('Prompts', 'prompts'));
app.get('/dashboard/mail', sessionMiddleware, placeholderPage('Mail', 'mail'));
app.get('/dashboard/calendar', sessionMiddleware, placeholderPage('Calendar', 'calendar'));

// Brain Ingestion UI
import { getBrainPage } from './frontend/templates/dashboard/brain';
app.get('/dashboard/brain', sessionMiddleware, (c) => {
  const user = c.get('user');
  // Only allow admin
  if (user.email !== 'meauxbility@gmail.com' && user.email !== 'sam@meauxbility.org') {
    return c.redirect('/dashboard');
  }
  return c.html(getBrainPage(c.env, user));
});

// Meaux Apps Handlers
// Meaux Apps Handlers
import { getMeauxDocPage } from './frontend/templates/dashboard/apps/meauxdoc';
import { getMeauxSafePage } from './frontend/templates/dashboard/apps/meauxsafe';
import { meauxCadTemplate } from './frontend/templates/dashboard/apps/meauxcad';
import { meauxGrantsTemplate } from './frontend/templates/dashboard/apps/meauxgrants';
import { meauxCreateTemplate } from './frontend/templates/dashboard/apps/meauxcreate';

app.get('/meauxphoto', sessionMiddleware, placeholderPage('MeauxPHOTO', 'meauxphoto'));

app.get('/meauxdoc', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(getMeauxDocPage(c.env, user));
});

app.get('/meauxsafe', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(getMeauxSafePage(c.env, user));
});

app.get('/meauxcad', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(meauxCadTemplate('', user));
});

app.get('/meauxgrants', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(meauxGrantsTemplate('', user));
});

app.get('/meauxcreate', sessionMiddleware, (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');
  return c.html(meauxCreateTemplate('', user));
});
// MeauxCloud (already redirected to /dashboard usually, but sidebar link exists)
app.get('/meauxcloud', sessionMiddleware, (c) => c.redirect('/dashboard'));




// API: Dashboard stats
app.get('/api/dashboard/stats', async (c) => {
  try {
    const db = c.env.DB;

    // Get project count
    const projectsResult = await db.prepare('SELECT COUNT(*) as count FROM projects').first();
    const projects = projectsResult?.count || 0;

    // Get user count
    const usersResult = await db.prepare('SELECT COUNT(*) as count FROM users').first();
    const users = usersResult?.count || 0;

    // Get task count
    const tasksResult = await db.prepare('SELECT COUNT(*) as count FROM tasks').first();
    const tasks = tasksResult?.count || 0;

    return c.json({
      projects,
      users,
      tasks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ projects: 0, users: 0, tasks: 0 }, 500);
  }
});

// Admin Sync Test
import { SupabaseService } from './services/supabase';
app.get('/api/admin/sync-test', sessionMiddleware, async (c) => {
  const user = c.get('user');
  // Simple check for admin email
  if (user.email !== 'meauxbility@gmail.com' && user.email !== 'sam@meauxbility.org') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const sb = new SupabaseService(c.env);
  // Just try to upsert a dummy log to see if connection works
  // Note: 'audit_logs' table must exist in Supabase for this to succeed
  await sb.upsert('audit_logs', [{
    event: 'sync_test',
    user: user.email,
    timestamp: new Date().toISOString()
  }]);

  return c.json({ status: 'Sync initiated', target: c.env.SUPABASE_URL });
});

// --- Brain / Knowledge Ingestion ---
app.post('/api/brain/ingest', sessionMiddleware, async (c) => {
  const user = c.get('user');
  // Security check
  if (user.email !== 'meauxbility@gmail.com' && user.email !== 'sam@meauxbility.org') {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  // Parse body
  const body = await c.req.json();
  const text = body.content as string;

  if (!text || text.length < 10) {
    return c.json({ error: 'Content too short' }, 400);
  }

  try {
    // 1. Generate Embedding via Gemini
    const { GoogleService } = await import('./services/google');
    const google = new GoogleService(c.env, user.userId);
    const vector = await google.embedContent(text);

    if (!vector) {
      return c.json({ error: 'Failed to generate embedding' }, 500);
    }

    // 2. Save to Supabase via SupabaseService
    const { SupabaseService } = await import('./services/supabase');
    const sb = new SupabaseService(c.env);

    await sb.upsert('knowledge', [{
      content: text,
      embedding: vector,
      metadata: { source: 'admin_dump', ingested_by: user.email }
    }]);

    return c.json({ status: 'Knowledge Ingested', size: text.length });

  } catch (e: any) {
    console.error('Ingest Error:', e);
    return c.json({ error: e.message }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - MeauxCLOUD</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #fef5f1 0%, #faf8f6 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1f2937;
        }
        .container { text-align: center; padding: 2rem; }
        h1 { font-size: 4rem; margin-bottom: 1rem; color: #f27a4f; }
        p { font-size: 1.25rem; margin-bottom: 2rem; color: #4b5563; }
        a {
          display: inline-block;
          padding: 12px 24px;
          background: #f27a4f;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="/">Go Home</a>
      </div>
    </body>
    </html>
  `, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// --- Workflows ---
import { BrandBuilderWorkflow } from './workflows/brand_builder';
export { BrandBuilderWorkflow }; // REQUIRED export for Workers Runtime

// Trigger Route
app.post('/api/workflows/brand-init', sessionMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { name, description } = body;

  // Start the workflow
  const instance = await c.env.BRAND_BUILDER.create();

  // Pass params
  await instance.run({
    projectName: name,
    description: description,
    userId: user.userId // Pass user ID so workflow can use their Google Token
  });

  return c.json({
    id: instance.id,
    status: 'started',
    message: 'Brand Builder AI is working in the background...'
  });
});

// Test Service Binding
app.get('/api/test-service', async (c) => {
  // This call goes DIRECTLY to the other worker (no internet traversal)
  const response = await c.env.INTERNAL_SERVICE.fetch('http://internal/generate-id?type=PROJ');
  const data = await response.json();
  return c.json({
    message: 'Generated ID via Service Binding',
    result: data
  });
});

// --- MeauxApps API Proxy ---
// This allows the frontend to call these apps securely
app.post('/api/apps/:app/:action', sessionMiddleware, async (c) => {
  const appName = c.req.param('app');
  const action = c.req.param('action'); // e.g., 'generate', 'audit'
  const body = await c.req.json();

  // Mapping to internal service paths
  // Frontend calls: /api/apps/meauxdoc/generate
  // Internal Service: /meauxdoc/generate
  const internalPath = `/${appName}/${action}`;
  const url = `http://internal${internalPath}`;

  try {
    const response = await c.env.INTERNAL_SERVICE.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      return c.json({ error: `Service Error: ${response.statusText}` }, response.status as any);
    }

    const data = await response.json();
    return c.json(data);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// --- R2 Asset Management (Main Bucket) ---
app.get('/api/r2/list', async (c) => {
  try {
    const listing = await c.env.R2_ASSETS.list({ limit: 1000 });
    const assets = listing.objects.map((obj: any) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      httpEtag: obj.httpEtag
    }));

    return c.json({
      count: assets.length,
      assets,
      truncated: listing.truncated
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/assets/:path{.*}', async (c) => {
  const path = c.req.param('path');
  const object = await c.env.R2_ASSETS.get(path);

  if (!object) {
    return c.text('Asset Not Found', 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000');

  return new Response(object.body, { headers });
});

app.put('/api/r2/upload/:path{.*}', async (c) => {
  const path = c.req.param('path');
  const body = await c.req.arrayBuffer();

  await c.env.R2_ASSETS.put(path, body, {
    httpMetadata: {
      contentType: c.req.header('content-type') || 'application/octet-stream'
    }
  });

  return c.json({ success: true, path, size: body.byteLength });
});

// --- 3D Asset Library API ---
app.get('/api/assets/library', async (c) => {
  try {
    const listing = await c.env.SPLINE_ICONS.list();
    // Return a cleaner structure
    const assets = listing.objects.map((obj: any) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      url: `/api/assets/serve/${encodeURIComponent(obj.key)}`, // Proxy URL
      type: obj.key.endsWith('.glb') ? 'model' : obj.key.endsWith('.splinecode') ? 'spline' : 'image'
    }));
    return c.json({ assets });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

app.get('/api/assets/serve/:key', async (c) => {
  const key = decodeURIComponent(c.req.param('key'));
  const object = await c.env.SPLINE_ICONS.get(key);

  if (!object) {
    return c.text('Object Not Found', 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  // Set proper content type if known or missing
  if (key.endsWith('.glb')) headers.set('Content-Type', 'model/gltf-binary');
  if (key.endsWith('.splinecode')) headers.set('Content-Type', 'application/octet-stream');

  return new Response(object.body, {
    headers,
  });
});

// About Page
import { getAboutPage } from './frontend/templates/public/about';
import { getServicesPage } from './frontend/templates/public/services';
import { getProductsPage } from './frontend/templates/public/products';
import { getContactPage } from './frontend/templates/public/contact';

app.get('/about', async (c) => {
  return c.html(getAboutPage());
});

app.get('/services', async (c) => {
  return c.html(getServicesPage());
});

app.get('/products', async (c) => {
  return c.html(getProductsPage());
});

app.get('/contact', async (c) => {
  return c.html(getContactPage());
});

export default app;
