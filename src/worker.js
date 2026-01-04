import { Hono } from 'hono'
import { Resend } from 'resend'
import { Webhook } from 'svix'

const app = new Hono()
const CF_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';


// Helper to get asset from R2
async function getAsset(c, key) {
    try {
        const object = await c.env.R2_ASSETS.get(key)
        if (!object) {
            return c.text('Not Found', 404)
        }

        const headers = new Headers()
        object.writeHttpMetadata(headers)

        // Set appropriate content type
        if (key.endsWith('.css')) headers.set('Content-Type', 'text/css')
        if (key.endsWith('.html')) headers.set('Content-Type', 'text/html')
        if (key.endsWith('.js')) headers.set('Content-Type', 'text/javascript')
        if (key.endsWith('.svg')) headers.set('Content-Type', 'image/svg+xml')

        headers.set('etag', object.httpEtag)

        return c.body(object.body, { headers })
    } catch (e) {
        return c.text(`Internal Server Error: ${e.message}`, 500)
    }
}

// --- Login Page Route ---
app.get('/login', async (c) => {
    return getAsset(c, 'login.html')
})

// --- Root Route (marketing landing page) ---
app.get('/', async (c) => {
    const html = await c.env.R2_ASSETS.get('landing.html')
    if (!html) {
        // Fallback to index.html if landing.html doesn't exist
        return getAsset(c, 'index.html')
    }
    return new Response(html.body, {
        headers: { 'Content-Type': 'text/html' }
    })
})

// --- Assets Route ---
app.get('/assets/*', async (c) => {
    const path = c.req.path.slice(1) // Remove leading slash
    return getAsset(c, path)
})

// --- Clean URL Routes (no .html extension) ---
app.get('/dashboard', async (c) => {
    return getAsset(c, 'dashboard.html')
})

app.get('/features', async (c) => {
    // Serve index.html and scroll to features/modules section
    const html = await getAsset(c, 'index.html');
    if (html instanceof Response) {
        const text = await html.text();
        const modified = text.replace('</body>', `
            <script>
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const section = document.getElementById('modules') || document.querySelector('[id*="feature"]');
                        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                });
            </script>
        </body>`);
        return new Response(modified, { headers: html.headers });
    }
    return html;
})

app.get('/applibrary', async (c) => {
    // Serve index.html and scroll to modules section
    const html = await getAsset(c, 'index.html');
    if (html instanceof Response) {
        const text = await html.text();
        const modified = text.replace('</body>', `
            <script>
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const section = document.getElementById('modules');
                        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                });
            </script>
        </body>`);
        return new Response(modified, { headers: html.headers });
    }
    return html;
})

app.get('/brands', async (c) => {
    // Serve index.html and scroll to brands section
    const html = await getAsset(c, 'index.html');
    if (html instanceof Response) {
        const text = await html.text();
        const modified = text.replace('</body>', `
            <script>
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        const section = document.getElementById('brands');
                        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                });
            </script>
        </body>`);
        return new Response(modified, { headers: html.headers });
    }
    return html;
})

// --- Dashboard Stats API ---
app.get('/api/dashboard/stats', async (c) => {
    try {
        const db = c.env.DB;

        // Ensure tables exist (self-healing)
        await ensureTablesExist(db);

        const [users, projects, tasks, deployments] = await Promise.all([
            db.prepare('SELECT COUNT(*) as count FROM users').first().catch(() => ({ count: 0 })),
            db.prepare('SELECT COUNT(*) as count FROM projects').first().catch(() => ({ count: 0 })),
            db.prepare('SELECT COUNT(*) as count FROM tasks').first().catch(() => ({ count: 0 })),
            db.prepare('SELECT COUNT(*) as count FROM deployments').first().catch(() => ({ count: 0 })),
        ]);

        return c.json({
            users: users?.count || 0,
            projects: projects?.count || 0,
            tasks: tasks?.count || 0,
            deployments: deployments?.count || 0,
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return c.json({ error: 'Failed to fetch stats' }, 500);
    }
})

// Helper to ensure tables exist
async function ensureTablesExist(db) {
    try {
        // Create projects table if it doesn't exist
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'active',
                owner_id INTEGER,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // Create tasks table if it doesn't exist
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                project_id INTEGER,
                status TEXT DEFAULT 'todo',
                priority TEXT DEFAULT 'medium',
                assigned_to INTEGER,
                due_date INTEGER,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // Create deployments table if it doesn't exist
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS deployments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER,
                environment TEXT DEFAULT 'production',
                status TEXT DEFAULT 'pending',
                version TEXT,
                created_at INTEGER DEFAULT (unixepoch())
            )
        `).run();
    } catch (e) {
        console.error('Error ensuring tables exist:', e);
    }
}

// --- Projects CRUD API ---
app.get('/api/projects', async (c) => {
    try {
        const db = c.env.DB;
        await ensureTablesExist(db);
        const projects = await db.prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT 50').all();
        return c.json(projects.results || []);
    } catch (error) {
        console.error('Projects fetch error:', error);
        return c.json({ error: 'Failed to fetch projects' }, 500);
    }
})

app.post('/api/projects', async (c) => {
    try {
        const db = c.env.DB;
        await ensureTablesExist(db);
        const { name, description, status } = await c.req.json();

        if (!name) {
            return c.json({ error: 'Project name is required' }, 400);
        }

        const result = await db.prepare(`
            INSERT INTO projects (name, description, status, created_at, updated_at)
            VALUES (?, ?, ?, unixepoch(), unixepoch())
        `).bind(name, description || '', status || 'active').run();

        const project = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(result.meta.last_row_id).first();
        return c.json(project);
    } catch (error) {
        console.error('Project create error:', error);
        return c.json({ error: 'Failed to create project' }, 500);
    }
})

app.put('/api/projects/:id', async (c) => {
    try {
        const db = c.env.DB;
        const id = c.req.param('id');
        const { name, description, status } = await c.req.json();

        await db.prepare(`
            UPDATE projects 
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                status = COALESCE(?, status),
                updated_at = unixepoch()
            WHERE id = ?
        `).bind(name, description, status, id).run();

        const project = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
        return c.json(project);
    } catch (error) {
        console.error('Project update error:', error);
        return c.json({ error: 'Failed to update project' }, 500);
    }
})

app.delete('/api/projects/:id', async (c) => {
    try {
        const db = c.env.DB;
        const id = c.req.param('id');
        await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error) {
        console.error('Project delete error:', error);
        return c.json({ error: 'Failed to delete project' }, 500);
    }
})

// --- Tasks CRUD API ---
app.get('/api/tasks', async (c) => {
    try {
        const db = c.env.DB;
        await ensureTablesExist(db);
        const projectId = c.req.query('project_id');

        let query = 'SELECT * FROM tasks ORDER BY created_at DESC LIMIT 100';
        let tasks;

        if (projectId) {
            tasks = await db.prepare('SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC').bind(projectId).all();
        } else {
            tasks = await db.prepare(query).all();
        }

        return c.json(tasks.results || []);
    } catch (error) {
        console.error('Tasks fetch error:', error);
        return c.json({ error: 'Failed to fetch tasks' }, 500);
    }
})

app.post('/api/tasks', async (c) => {
    try {
        const db = c.env.DB;
        await ensureTablesExist(db);
        const { title, description, project_id, status, priority, due_date } = await c.req.json();

        if (!title) {
            return c.json({ error: 'Task title is required' }, 400);
        }

        const result = await db.prepare(`
            INSERT INTO tasks (title, description, project_id, status, priority, due_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
        `).bind(title, description || '', project_id || null, status || 'todo', priority || 'medium', due_date || null).run();

        const task = await db.prepare('SELECT * FROM tasks WHERE id = ?').bind(result.meta.last_row_id).first();
        return c.json(task);
    } catch (error) {
        console.error('Task create error:', error);
        return c.json({ error: 'Failed to create task' }, 500);
    }
})

app.put('/api/tasks/:id', async (c) => {
    try {
        const db = c.env.DB;
        const id = c.req.param('id');
        const { title, description, status, priority, due_date } = await c.req.json();

        await db.prepare(`
            UPDATE tasks 
            SET title = COALESCE(?, title),
                description = COALESCE(?, description),
                status = COALESCE(?, status),
                priority = COALESCE(?, priority),
                due_date = COALESCE(?, due_date),
                updated_at = unixepoch()
            WHERE id = ?
        `).bind(title, description, status, priority, due_date, id).run();

        const task = await db.prepare('SELECT * FROM tasks WHERE id = ?').bind(id).first();
        return c.json(task);
    } catch (error) {
        console.error('Task update error:', error);
        return c.json({ error: 'Failed to update task' }, 500);
    }
})

app.delete('/api/tasks/:id', async (c) => {
    try {
        const db = c.env.DB;
        const id = c.req.param('id');
        await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
        return c.json({ success: true });
    } catch (error) {
        console.error('Task delete error:', error);
        return c.json({ error: 'Failed to delete task' }, 500);
    }
})

// --- Users API ---
app.get('/api/users', async (c) => {
    try {
        const db = c.env.DB;
        const users = await db.prepare('SELECT id, email, name, avatar_url, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 50').all();
        return c.json(users.results || []);
    } catch (error) {
        console.error('Users fetch error:', error);
        return c.json({ error: 'Failed to fetch users' }, 500);
    }
})

// --- Activities/Recent Activity API ---
app.get('/api/dashboard/activities', async (c) => {
    try {
        const db = c.env.DB;
        await ensureTablesExist(db);

        // Get recent projects, tasks, and deployments
        const [recentProjects, recentTasks, recentDeployments] = await Promise.all([
            db.prepare('SELECT id, name, created_at, "project" as type FROM projects ORDER BY created_at DESC LIMIT 5').all().catch(() => ({ results: [] })),
            db.prepare('SELECT id, title as name, created_at, "task" as type FROM tasks ORDER BY created_at DESC LIMIT 5').all().catch(() => ({ results: [] })),
            db.prepare('SELECT id, version as name, created_at, "deployment" as type FROM deployments ORDER BY created_at DESC LIMIT 5').all().catch(() => ({ results: [] }))
        ]);

        const activities = [
            ...(recentProjects.results || []),
            ...(recentTasks.results || []),
            ...(recentDeployments.results || [])
        ].sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 10);

        return c.json({ activities });
    } catch (error) {
        console.error('Activities fetch error:', error);
        return c.json({ activities: [] });
    }
})

// --- Observability / Telemetry Endpoint (OTLP) for MeauxCLOUD ---
// Separate endpoint for meauxcloud.org (not meauxbility.org)
app.post('/api/telemetry/otlp/v1/logs', async (c) => {
    try {
        // OTLP (OpenTelemetry Protocol) logs endpoint for Cloudflare Observability
        const body = await c.req.json();

        // Log the telemetry data
        console.log('[MeauxCLOUD Telemetry] Logs received:', JSON.stringify(body, null, 2));

        // Store in D1 if needed
        if (c.env.DB) {
            try {
                await c.env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS meauxcloud_telemetry_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        resource_attributes TEXT,
                        scope_logs TEXT,
                        service TEXT DEFAULT 'meauxcloud',
                        received_at INTEGER DEFAULT (unixepoch())
                    )
                `).run();

                await c.env.DB.prepare(`
                    INSERT INTO meauxcloud_telemetry_logs (resource_attributes, scope_logs, service)
                    VALUES (?, ?, 'meauxcloud')
                `).bind(
                    JSON.stringify(body.resourceLogs?.[0]?.resource?.attributes || {}),
                    JSON.stringify(body.resourceLogs?.[0]?.scopeLogs || [])
                ).run();
            } catch (dbError) {
                console.error('Error storing telemetry in D1:', dbError);
            }
        }

        return c.json({
            success: true,
            message: 'MeauxCLOUD telemetry logs received',
            service: 'meauxcloud',
            received: new Date().toISOString()
        });
    } catch (error) {
        console.error('MeauxCLOUD telemetry endpoint error:', error);
        return c.json({ error: 'Failed to process telemetry' }, 500);
    }
})

// Health check for MeauxCLOUD observability
app.get('/api/telemetry/health', async (c) => {
    return c.json({
        status: 'healthy',
        service: 'meauxcloud-central-analytics',
        domain: 'meauxcloud.org',
        timestamp: new Date().toISOString()
    });
})

// --- GitHub Marketplace Webhook ---
app.post('/api/webhook/github-marketplace', async (c) => {
    try {
        const signature = c.req.header('X-Hub-Signature-256');
        const body = await c.req.text();

        // Verify webhook signature
        const secret = c.env.GITHUB_MARKETPLACE_WEBHOOK_SECRET;
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
        const expectedSig = 'sha256=' + Array.from(new Uint8Array(sig))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (signature !== expectedSig) {
            return c.json({ error: 'Invalid signature' }, 401);
        }

        const event = JSON.parse(body);
        console.log('GitHub Marketplace event:', event.action, event.marketplace_purchase);

        // Store purchase in D1
        const db = c.env.DB;
        await db.prepare(`
            INSERT INTO marketplace_purchases (github_user, plan, action, created_at)
            VALUES (?, ?, ?, datetime('now'))
        `).bind(
            event.marketplace_purchase?.account?.login,
            event.marketplace_purchase?.plan?.name,
            event.action
        ).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('Marketplace webhook error:', error);
        return c.json({ error: 'Webhook processing failed' }, 500);
    }
})

// Resend Email Endpoint
app.post('/api/email/send', async (c) => {
    try {
        const resend = new Resend(c.env.RESEND_API_KEY)
        const body = await c.req.json()
        const { to, subject, html } = body

        const data = await resend.emails.send({
            from: 'MeauxCLOUD <notifications@meauxcloud.org>',
            to: to,
            subject: subject,
            html: html,
        })

        return c.json(data)
    } catch (e) {
        return c.json({ error: e.message }, 500)
    }
})

// Resend Webhook Endpoint
app.post('/api/webhooks/resend', async (c) => {
    try {
        const payload = await c.req.text()
        const headers = c.req.raw.headers

        const wh = new Webhook(c.env.RESEND_WEBHOOK_SECRET)

        // svix verify throws error if invalid
        const evt = wh.verify(payload, {
            "svix-id": headers.get("svix-id"),
            "svix-timestamp": headers.get("svix-timestamp"),
            "svix-signature": headers.get("svix-signature"),
        })

        // Log the webhook event - currently just console logging
        // In a real app, you might store this in D1 or KV
        console.log('Received Webhook:', evt.type, evt.data)

        return c.json({ success: true, message: 'Webhook received' })
    } catch (e) {
        console.error('Webhook Error:', e.message)
        return c.json({ error: 'Webhook verification failed' }, 400)
    }
})

// Google API Proxy (via Cloudflare AI Gateway)
app.post('/api/google/proxy', async (c) => {
    // In a real app, validate the request body and only proxy allowed endpoints
    const { endpoint, method, body } = await c.req.json()
    const apiKey = c.env.GOOGLE_API_KEY

    // Construct AI Gateway URL
    // Format: https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_slug}/{provider}/{path}
    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/meauxcloudai/google/${endpoint}?key=${apiKey}`

    try {
        const response = await fetch(gatewayUrl, {
            method: method || 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'cf-aig-authorization': `Bearer ${c.env.AI_GATEWAY_TOKEN}`
            }
        })
        const data = await response.json()
        return c.json(data)
    } catch (e) {
        return c.json({ error: e.message }, 500)
    }
})

// --- Authentication Endpoints (Google OAuth) ---
app.get('/api/auth/google', (c) => {
    const clientId = c.env.GOOGLE_CLIENT_ID;
    const redirectUri = 'https://meauxcloud.org/api/auth/google/callback';
    const scope = 'openid email profile';
    const responseType = 'code';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}&access_type=offline&prompt=consent`;

    return c.redirect(authUrl);
});


app.get('/api/auth/google/callback', async (c) => {
    const code = c.req.query('code');
    if (!code) return c.json({ error: 'No code provided' }, 400);

    const clientId = c.env.GOOGLE_CLIENT_ID;
    const clientSecret = c.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = 'https://meauxcloud.org/api/auth/google/callback';

    try {
        // Exchange code for token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await tokenResponse.json();
        if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

        // Get User Info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userResponse.json();

        // Check/Update Database (Upsert User)
        const { email, name, picture } = userData;

        try {
            // Attempt to insert or update (matched to your current schema: avatar_url)
            await c.env.DB.prepare(`
                INSERT INTO users (email, name, avatar_url) VALUES (?, ?, ?)
                ON CONFLICT(email) DO UPDATE SET name=excluded.name, avatar_url=excluded.avatar_url
            `).bind(email, name, picture).run();
        } catch (dbError) {
            // If table missing, create it (Self-Healing)
            if (dbError.message.includes('no such table')) {
                await c.env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE,
                        name TEXT,
                        avatar_url TEXT,
                        role TEXT DEFAULT 'member',
                        status TEXT DEFAULT 'online',
                        created_at INTEGER DEFAULT (unixepoch())
                    )
                `).run();
                // Retry insert
                await c.env.DB.prepare(`
                    INSERT INTO users (email, name, avatar_url) VALUES (?, ?, ?)
                    ON CONFLICT(email) DO UPDATE SET name=excluded.name, avatar_url=excluded.avatar_url
                `).bind(email, name, picture).run();
            } else {
                throw dbError;
            }
        }

        // Create Session (Simple Cookie)
        // In production, sign this with a JWT secret!
        const sessionToken = btoa(JSON.stringify({ email, name, picture, exp: Date.now() + 86400000 }));

        // Set Cookie and Redirect to Dashboard
        c.header('Set-Cookie', `auth_token=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`);

        return c.redirect('https://meauxcloud.org/dashboard');

    } catch (error) {
        return c.json({ error: 'Authentication failed', details: error.message }, 500);
    }
});

app.get('/api/auth/me', async (c) => {
    const cookie = c.req.header('Cookie');
    const token = cookie?.split(';').find(c => c.trim().startsWith('auth_token='))?.split('=')[1];

    if (!token) return c.json({ authenticated: false }, 401);

    try {
        const session = JSON.parse(atob(token));
        if (session.exp < Date.now()) return c.json({ authenticated: false, reason: 'expired' }, 401);

        return c.json({
            authenticated: true,
            user: { email: session.email, name: session.name, picture: session.picture }
        });
    } catch {
        return c.json({ authenticated: false }, 401);
    }
});

// Meshy AI Proxy (Text to 3D)
app.post('/api/meshy/generate', async (c) => {
    const body = await c.req.json()
    try {
        const response = await fetch('https://api.meshy.ai/v1/image-to-3d', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.MESHYAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return c.json(data)
    } catch (e) {
        return c.json({ error: e.message }, 500)
    }
})

// --- Hyperdrive (Supabase PostgreSQL) Routes ---
app.get('/api/hyperdrive/health', async (c) => {
    try {
        if (!c.env.HYPERDRIVE) {
            return c.json({ error: 'Hyperdrive not configured' }, 500);
        }

        const hyperdrive = c.env.HYPERDRIVE;
        const client = await hyperdrive.connect();
        const result = await client.query('SELECT NOW() as time, version() as pg_version');

        return c.json({
            status: 'healthy',
            hyperdrive: 'connected',
            timestamp: result.rows[0].time,
            postgres_version: result.rows[0].pg_version
        });
    } catch (error) {
        console.error('Hyperdrive health check error:', error);
        return c.json({
            status: 'error',
            error: error.message
        }, 500);
    }
})

app.post('/api/hyperdrive/query', async (c) => {
    try {
        if (!c.env.HYPERDRIVE) {
            return c.json({ error: 'Hyperdrive not configured' }, 500);
        }

        const { sql, params = [] } = await c.req.json();

        if (!sql) {
            return c.json({ error: 'SQL query required' }, 400);
        }

        const hyperdrive = c.env.HYPERDRIVE;
        const client = await hyperdrive.connect();
        const result = await client.query(sql, params);

        return c.json({
            success: true,
            rows: result.rows,
            rowCount: result.rowCount
        });
    } catch (error) {
        console.error('Hyperdrive query error:', error);
        return c.json({
            success: false,
            error: error.message
        }, 500);
    }
})

// Supabase Proxy (Elevated Access)
app.post('/api/supabase/proxy', async (c) => {
    try {
        const { path, method, body } = await c.req.json();
        const url = `${c.env.SUPABASE_URL}/rest/v1/${path}`;

        const response = await fetch(url, {
            method: method || 'GET',
            headers: {
                'apikey': c.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// CloudConvert Proxy
app.post('/api/cloudconvert/jobs', async (c) => {
    const body = await c.req.json()
    try {
        const response = await fetch('https://api.cloudconvert.com/v2/jobs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.CLOUDCONVERT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()
        return c.json(data)
    } catch (e) {
        return c.json({ error: e.message }, 500)
    }
})

// --- Chat Endpoints (D1 Backed) ---
app.get('/api/chat/messages', async (c) => {
    try {
        const messages = await c.env.DB.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50').all();
        return c.json(messages.results || []);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.post('/api/chat/send', async (c) => {
    try {
        const { user, text, initials, color } = await c.req.json();
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Insert into D1
        await c.env.DB.prepare(
            'INSERT INTO messages (user, text, time, initials, color, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(user, text, timestamp, initials, color, Date.now()).run();

        return c.json({ success: true });
    } catch (e) {
        // If table doesn't exist, try to create it on the fly (Self-Healing)
        if (e.message.includes('no such table')) {
            try {
                await c.env.DB.prepare(`
                    CREATE TABLE IF NOT EXISTS messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user TEXT,
                        text TEXT,
                        time TEXT,
                        initials TEXT,
                        color TEXT,
                        timestamp INTEGER
                    )
                `).run();
                // Retry insert
                const { user, text, initials, color } = await c.req.json();
                const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                await c.env.DB.prepare(
                    'INSERT INTO messages (user, text, time, initials, color, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
                ).bind(user, text, timestamp, initials, color, Date.now()).run();
                return c.json({ success: true, healed: true });
            } catch (createError) {
                return c.json({ error: "Failed to create table: " + createError.message }, 500);
            }
        }
        return c.json({ error: e.message }, 500);
    }
});

// --- Media/Stream Endpoint ---
app.get('/api/stream/status', async (c) => {
    // In a real app, fetch from Cloudflare Stream API
    // For now, return the provided ID
    return c.json({
        live: true,
        videoId: '89108139bd010041d13f982992922659',
        customerCode: 'g7wf09fCONpnidkRnR_5vw'
    });
});

// --- Basic MCP Tool Endpoint ---
app.post('/api/mcp/tool', async (c) => {
    const { tool, args } = await c.req.json();

    if (tool === 'list_tables') {
        const tables = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        return c.json({ result: tables.results.map(t => t.name) });
    }

    if (tool === 'get_messages') {
        const msgs = await c.env.DB.prepare('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 5').all();
        return c.json({ result: msgs.results });
    }

    return c.json({ error: "Tool not found" }, 404);
});

// --- Cloudflare AI Gateway Endpoints ---
// AI Gateway logic uses global CF_ACCOUNT_ID


app.get('/api/cloudflare/gateways', async (c) => {
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai-gateway/gateways`, {
            headers: {
                'Authorization': `Bearer ${c.env.CLOUDFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.post('/api/cloudflare/gateways', async (c) => { // Create Gateway
    try {
        const body = await c.req.json();
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai-gateway/gateways`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${c.env.CLOUDFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.get('/api/cloudflare/gateways/:gatewayId/logs', async (c) => {
    const gatewayId = c.req.param('gatewayId');
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai-gateway/gateways/${gatewayId}/logs`, {
            headers: {
                'Authorization': `Bearer ${c.env.CLOUDFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// --- Twilio SMS Endpoint ---
app.post('/api/sms/send', async (c) => {
    try {
        const { to, body } = await c.req.json();
        const accountSid = c.env.TWILIO_ACCOUNT_SID;
        const authToken = c.env.TWILIO_AUTH_TOKEN;
        // You should also put your Twilio Phone Number in secrets as TWILIO_PHONE_NUMBER
        // For now we will assume the user will set it or pass it, but better to use a stored one.
        const from = '+18556840336'; // Standard Twilio Test or User's number. 

        // Authenticate with Basic Auth
        const credentials = btoa(`${accountSid}:${authToken}`);

        const params = new URLSearchParams();
        params.append('To', to);
        params.append('From', from); // This needs to be a valid Twilio sender
        params.append('Body', body);

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();

        if (!response.ok) {
            return c.json({ error: data.message || 'Failed to send SMS' }, response.status);
        }

        return c.json({ success: true, sid: data.sid });
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// D1 Database SQL Execution
app.post('/api/sql/execute', async (c) => {
    try {
        const { query } = await c.req.json();

        // Basic safety check - in production you'd want stricter controls
        if (!query) return c.json({ error: "Query is required" }, 400);

        // Execute raw query against D1
        const results = await c.env.DB.prepare(query).all();
        return c.json(results);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// --- WebSocket Upgrade (Durable Objects) ---
app.get('/api/chat/ws/:room', async (c) => {
    const upgradeHeader = c.req.header('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return c.text('Expected Upgrade: websocket', 426);
    }
    const room = c.req.param('room');
    const id = c.env.CHAT_ROOM.idFromName(room);
    const obj = c.env.CHAT_ROOM.get(id);
    return obj.fetch(c.req.raw);
});

// --- TURN/ICE Credentials Endpoint ---
app.get('/api/turn/credentials', async (c) => {
    // Return standard Cloudflare TURN configuration
    // In a production environment with short-lived tokens, you would generate them here.
    // For Cloudflare Calls with static tokens, we pass them securely to the client.
    return c.json({
        iceServers: [
            {
                urls: "stun:stun.cloudflare.com:3478"
            },
            {
                urls: [
                    "turn:turn.cloudflare.com:3478?transport=udp",
                    "turn:turn.cloudflare.com:3478?transport=tcp"
                ],
                username: c.env.TURN_TOKEN_ID,
                credential: c.env.TURN_API_TOKEN
            }
        ]
    });
});

// --- Cloudflare Calls (SFU) Endpoint ---
app.post('/api/sfu/session', async (c) => {
    try {
        const appId = c.env.SFU_APP_ID;
        const apiToken = c.env.SFU_API_TOKEN;

        // Create a new session via Cloudflare Calls API
        const response = await fetch(`https://rtc.live.cloudflare.com/v1/apps/${appId}/sessions/new`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return c.json({ error: data.error || 'Failed to create SFU session' }, response.status);
        }

        // Return the session details (sessionId, etc) to the client
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// --- Cloudflare Images API ---
app.get('/api/images/list', async (c) => {
    try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`, {
            headers: {
                'Authorization': `Bearer ${c.env.CLOUDFLARE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return c.json(data);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.post('/api/images/analyze', async (c) => {
    // "AI" analysis for optimization suggestions
    // In a real scenario, we could send image metadata to Gemini here
    // For now, we mock the logic to return suggestions for duplicates/optimization
    try {
        const { images } = await c.req.json(); // Expects array of image metadata

        // Mock logic: Find potential duplicates by size/name
        const suggestions = [];
        const seenSizes = {};

        images.forEach(img => {
            if (seenSizes[img.size]) {
                suggestions.push({
                    type: 'duplicate',
                    message: `Potential duplicate found: ${img.filename} matches size of another image.`,
                    ids: [img.id, seenSizes[img.size].id]
                });
            } else {
                seenSizes[img.size] = img;
            }

            if (img.size > 1000000) { // > 1MB
                suggestions.push({
                    type: 'optimize',
                    message: `Large image detected: ${img.filename} (${(img.size / 1000000).toFixed(2)}MB). Consider converting to WebP/AVIF.`,
                    id: img.id
                });
            }
        });

        return c.json({ success: true, suggestions });
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

// --- User R2 Bucket Provisioning (Placeholder) ---
// This would programmatically create buckets for users, but requires 'Edit Cloudflare Workers' permissions
app.post('/api/r2/provision', async (c) => {
    // Placeholder: Real implementation would use Cloudflare API to create a new bucket 'meauxcloud-user-{id}'
    return c.json({ message: "User R2 buckets provisioning logic ready for implementation." });
});

// --- MeauxCloudAI AutoRAG Pipeline ---
app.post('/api/ai/rag', async (c) => {
    try {
        const { query } = await c.req.json();
        if (!query) return c.json({ error: "Query required" }, 400);

        const ai = c.env.AI;
        // 1. Query Rewrite (Improving retrieval accuracy)
        // Using Llama 3.1 8B as it is fast and reliable for simple transformations
        const rewriteMsg = [
            { role: 'system', content: 'Rewrite the following user query to be more specific and optimized for vector retrieval transparency. Output ONLY the rewritten query.' },
            { role: 'user', content: query }
        ];
        const rewriteResp = await ai.run('@cf/meta/llama-3.1-8b-instruct', { messages: rewriteMsg });
        const rewrittenQuery = rewriteResp.response.trim();

        // 2. Embedding
        const embeddingResp = await ai.run('@cf/baai/bge-m3', { text: [rewrittenQuery] });
        const vector = embeddingResp.data[0];

        // 3. Retrieval (Assumes 'VECTOR_INDEX' binding to 'allinfrastructure')
        // Check if binding exists, otherwise mock result for demo stability
        let matches = [];
        if (c.env.VECTOR_INDEX) {
            const vectorQuery = await c.env.VECTOR_INDEX.query(vector, { topK: 15 }); // Fetch slightly more for reranking
            matches = vectorQuery.matches;
        } else {
            console.warn("VECTOR_INDEX not bound. Using mock data.");
            // Mock data representing "allinfrastructure"
            matches = [
                { id: '1', active: true, metadata: { text: "MeauxCloud uses Cloudflare Workers for its compute layer." } },
                { id: '2', active: true, metadata: { text: "The database used is D1, a distinct SQLite edge database." } },
                { id: '3', active: true, metadata: { text: "Assets are optimized using the /api/images/analyze endpoint." } }
            ];
        }

        // 4. Reranking
        const docs = matches.map(m => m.metadata?.text || "").filter(t => t.length > 0);
        let relevantDocs = docs;

        if (docs.length > 0) {
            const rerankResp = await ai.run('@cf/baai/bge-reranker-base', {
                query: rewrittenQuery,
                source_documents: docs
            });
            // Take top 5 strictly relevant
            relevantDocs = rerankResp.results.slice(0, 5).map(r => r.document);
        }

        // 5. Generation
        const contextBlock = relevantDocs.join("\n---\n");
        const systemPrompt = `You are MeauxCloudAI, an advanced assistant built on AutoRAG.
        Use the following retrieved context to answer the user's question accurately.
        If the answer is not in the context, use your general knowledge but mention you are doing so.
        
        Context:
        ${contextBlock}`;

        const genResp = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ]
        });

        return c.json({
            success: true,
            query: { original: query, rewritten: rewrittenQuery },
            response: genResp.response,
            sources: relevantDocs.length
        });

    } catch (e) {
        return c.json({ error: e.message, stack: e.stack }, 500);
    }
});

// =========================================================
// ANALYTICS ENDPOINTS (Cost Tracking & Usage Monitoring)
// =========================================================

// Get Cloudflare Analytics
app.get('/api/analytics/cloudflare', async (c) => {
    try {
        const token = c.env.CLOUDFLARE_API_TOKEN;
        if (!token) {
            return c.json({ error: 'API token not configured' }, 500);
        }

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endDate = now.toISOString();

        // Get Workers usage
        const workersRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/workers/scripts`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const workersData = await workersRes.json();
        const workers = workersData.success ? workersData.result : [];

        // Get R2 buckets
        const r2Res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/r2/buckets`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const r2Data = await r2Res.json();
        const r2Buckets = r2Data.success ? r2Data.result : [];

        // Get D1 databases
        const d1Res = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const d1Data = await d1Res.json();
        const d1Databases = d1Data.success ? d1Data.result : [];

        return c.json({
            success: true,
            period: { start: startDate, end: endDate },
            cloudflare: {
                workers: {
                    total: Array.isArray(workers) ? workers.length : 0,
                },
                r2: {
                    buckets: Array.isArray(r2Buckets) ? r2Buckets.length : 0,
                },
                d1: {
                    databases: Array.isArray(d1Databases) ? d1Databases.length : 0,
                }
            }
        });
    } catch (error) {
        console.error('Cloudflare analytics error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Get GitHub Actions Analytics
app.get('/api/analytics/github', async (c) => {
    try {
        const token = c.env.GITHUB_TOKEN;
        if (!token) {
            return c.json({ error: 'GitHub token not configured' }, 500);
        }

        const repo = 'ceosamprimeaux/meauxCLOUD';
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

        const response = await fetch(
            `https://api.github.com/repos/${repo}/actions/runs?per_page=100&created=>${startDate}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        const data = await response.json();
        const runs = data.workflow_runs || [];

        const stats = {
            total: runs.length,
            success: runs.filter(r => r.conclusion === 'success').length,
            failure: runs.filter(r => r.conclusion === 'failure').length,
            cancelled: runs.filter(r => r.conclusion === 'cancelled').length,
            in_progress: runs.filter(r => r.status === 'in_progress').length,
            queued: runs.filter(r => r.status === 'queued').length,
        };

        const totalMinutes = runs.reduce((sum, run) => {
            const start = new Date(run.created_at);
            const end = run.updated_at ? new Date(run.updated_at) : new Date();
            const minutes = Math.ceil((end - start) / 1000 / 60);
            return sum + minutes;
        }, 0);

        const freeMinutes = 2000;
        const usedPercentage = (totalMinutes / freeMinutes) * 100;

        return c.json({
            success: true,
            period: { start: startDate, end: now.toISOString() },
            github: {
                repository: repo,
                stats,
                usage: {
                    minutes: totalMinutes,
                    freeMinutes,
                    usedPercentage: Math.min(usedPercentage, 100),
                    remaining: Math.max(0, freeMinutes - totalMinutes),
                    status: usedPercentage > 90 ? 'warning' : usedPercentage > 75 ? 'caution' : 'ok'
                },
                recentRuns: runs.slice(0, 10).map(run => ({
                    id: run.id,
                    name: run.name,
                    status: run.status,
                    conclusion: run.conclusion,
                    created: run.created_at,
                    duration: run.updated_at ?
                        Math.ceil((new Date(run.updated_at) - new Date(run.created_at)) / 1000 / 60) : 0
                }))
            }
        });
    } catch (error) {
        console.error('GitHub analytics error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Get Cost Breakdown
app.get('/api/analytics/costs', async (c) => {
    try {
        const db = c.env.DB;

        await db.prepare(`
            CREATE TABLE IF NOT EXISTS cost_tracking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                service TEXT,
                amount REAL,
                details TEXT,
                month TEXT,
                date INTEGER DEFAULT (unixepoch())
            )
        `).run();

        const costData = await db.prepare(`
            SELECT * FROM cost_tracking 
            WHERE month = strftime('%Y-%m', 'now')
            ORDER BY date DESC
        `).all().catch(() => ({ results: [] }));

        const estimatedCosts = {
            cloudflare: {
                workers: { requests: 0, cost: 0 },
                r2: { storage: 0, operations: 0, cost: 0 },
                d1: { reads: 0, writes: 0, cost: 0 },
                pages: { builds: 0, cost: 0 },
                total: 0
            },
            github: {
                actions: { minutes: 0, cost: 0 },
                storage: { gb: 0, cost: 0 },
                total: 0
            },
            total: 0
        };

        return c.json({
            success: true,
            costs: estimatedCosts,
            historical: costData.results || [],
            note: 'Costs are estimates based on free tier usage. Actual billing may vary.'
        });
    } catch (error) {
        console.error('Cost analytics error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Get Overview (Combined Analytics)
app.get('/api/analytics/overview', async (c) => {
    try {
        const baseUrl = c.req.url.split('/api/analytics/overview')[0];

        const [cloudflare, github, costs] = await Promise.all([
            fetch(`${baseUrl}/api/analytics/cloudflare`).then(r => r.json()).catch(() => ({})),
            fetch(`${baseUrl}/api/analytics/github`).then(r => r.json()).catch(() => ({})),
            fetch(`${baseUrl}/api/analytics/costs`).then(r => r.json()).catch(() => ({}))
        ]);

        return c.json({
            success: true,
            timestamp: new Date().toISOString(),
            cloudflare: cloudflare.cloudflare || {},
            github: github.github || {},
            costs: costs.costs || {},
            alerts: [
                ...(github.github?.usage?.status === 'warning' ? [{
                    type: 'warning',
                    message: 'GitHub Actions usage is above 90%',
                    action: 'Consider optimizing workflows'
                }] : []),
                ...(github.github?.usage?.status === 'caution' ? [{
                    type: 'info',
                    message: 'GitHub Actions usage is above 75%',
                    action: 'Monitor usage closely'
                }] : [])
            ]
        });
    } catch (error) {
        console.error('Overview analytics error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// =========================================================
// GITHUB-CLOUDFLARE SYNC ENDPOINTS
// =========================================================

// Get sync status
app.get('/api/sync/status', async (c) => {
    try {
        const githubToken = c.env.GITHUB_TOKEN;
        const cfToken = c.env.CLOUDFLARE_API_TOKEN;

        if (!githubToken || !cfToken) {
            return c.json({ error: 'Tokens not configured' }, 500);
        }

        const repo = 'ceosamprimeaux/meauxCLOUD';

        const githubRes = await fetch(
            `https://api.github.com/repos/${repo}/deployments?per_page=1`,
            {
                headers: {
                    'Authorization': `Bearer ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );
        const githubDeploy = await githubRes.json();

        return c.json({
            success: true,
            github: {
                latestDeployment: githubDeploy[0] || null,
                repository: repo,
            },
            cloudflare: {
                worker: 'meauxcloud',
            },
            synced: true
        });
    } catch (error) {
        console.error('Sync status error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// GitHub webhook handler
app.post('/api/sync/webhook', async (c) => {
    try {
        const body = await c.req.text();
        const event = JSON.parse(body);

        const db = c.env.DB;
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS github_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT,
                event_data TEXT,
                received_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        await db.prepare(`
            INSERT INTO github_events (event_type, event_data)
            VALUES (?, ?)
        `).bind(event.action || event.ref_type || 'webhook', body).run();

        return c.json({ success: true, received: event.action || 'webhook' });
    } catch (error) {
        console.error('Webhook error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Get recent GitHub events
app.get('/api/sync/events', async (c) => {
    try {
        const db = c.env.DB;
        const events = await db.prepare(`
            SELECT * FROM github_events 
            ORDER BY received_at DESC 
            LIMIT 50
        `).all().catch(() => ({ results: [] }));

        return c.json({
            success: true,
            events: events.results.map(e => ({
                ...e,
                event_data: JSON.parse(e.event_data || '{}')
            }))
        });
    } catch (error) {
        console.error('Events fetch error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// =========================================================
// BRAND & RESOURCE MANAGEMENT ENDPOINTS
// =========================================================

// Ensure brand/resource tables exist
async function ensureBrandTablesExist(db) {
    try {
        // Brands table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS brands (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                slug TEXT NOT NULL UNIQUE,
                description TEXT,
                category TEXT,
                status TEXT DEFAULT 'active',
                website_url TEXT,
                parent_brand_id INTEGER,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // URLs table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brand_id INTEGER,
                url TEXT NOT NULL UNIQUE,
                url_type TEXT,
                cloudflare_zone_id TEXT,
                cloudflare_worker_id TEXT,
                cloudflare_pages_id TEXT,
                status TEXT DEFAULT 'active',
                plan TEXT,
                last_checked INTEGER,
                http_status INTEGER,
                notes TEXT,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // Apps table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS apps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                brand_id INTEGER,
                name TEXT NOT NULL,
                slug TEXT NOT NULL,
                description TEXT,
                app_type TEXT,
                status TEXT DEFAULT 'active',
                github_repo TEXT,
                cloudflare_worker_name TEXT,
                cloudflare_pages_project TEXT,
                primary_url TEXT,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // Cloudflare resources table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS cloudflare_resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resource_type TEXT NOT NULL,
                resource_name TEXT NOT NULL,
                resource_id TEXT,
                brand_id INTEGER,
                app_id INTEGER,
                status TEXT DEFAULT 'active',
                metadata TEXT,
                created_at INTEGER DEFAULT (unixepoch()),
                updated_at INTEGER DEFAULT (unixepoch()),
                UNIQUE(resource_type, resource_name)
            )
        `).run();

        // URL health checks table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS url_health_checks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url_id INTEGER NOT NULL,
                http_status INTEGER,
                response_time_ms INTEGER,
                error_message TEXT,
                checked_at INTEGER DEFAULT (unixepoch())
            )
        `).run();

        // Duplicates tracking table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS duplicate_resources (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resource_type TEXT NOT NULL,
                resource_name TEXT NOT NULL,
                duplicate_of_id INTEGER,
                status TEXT DEFAULT 'pending',
                notes TEXT,
                created_at INTEGER DEFAULT (unixepoch())
            )
        `).run();
    } catch (e) {
        console.error('Error ensuring brand tables exist:', e);
    }
}

// Brands API
app.get('/api/brands', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const brands = await db.prepare('SELECT * FROM brands ORDER BY name').all();
        return c.json(brands.results || []);
    } catch (error) {
        console.error('Brands fetch error:', error);
        return c.json({ error: error.message }, 500);
    }
});

app.post('/api/brands', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const { name, slug, description, category, website_url, parent_brand_id } = await c.req.json();
        
        if (!name || !slug) {
            return c.json({ error: 'Name and slug are required' }, 400);
        }

        const result = await db.prepare(`
            INSERT INTO brands (name, slug, description, category, website_url, parent_brand_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
        `).bind(name, slug, description || null, category || null, website_url || null, parent_brand_id || null).run();

        const brand = await db.prepare('SELECT * FROM brands WHERE id = ?').bind(result.meta.last_row_id).first();
        return c.json(brand);
    } catch (error) {
        console.error('Brand create error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// URLs API
app.get('/api/urls', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const { brand_id, status, url_type } = c.req.query();
        
        let query = 'SELECT * FROM urls WHERE 1=1';
        const params = [];
        
        if (brand_id) {
            query += ' AND brand_id = ?';
            params.push(brand_id);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (url_type) {
            query += ' AND url_type = ?';
            params.push(url_type);
        }
        
        query += ' ORDER BY url';
        const urls = await db.prepare(query).bind(...params).all();
        return c.json(urls.results || []);
    } catch (error) {
        console.error('URLs fetch error:', error);
        return c.json({ error: error.message }, 500);
    }
});

app.post('/api/urls', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const { url, url_type, brand_id, cloudflare_zone_id, cloudflare_worker_id, cloudflare_pages_id, plan, notes } = await c.req.json();
        
        if (!url) {
            return c.json({ error: 'URL is required' }, 400);
        }

        const result = await db.prepare(`
            INSERT INTO urls (url, url_type, brand_id, cloudflare_zone_id, cloudflare_worker_id, cloudflare_pages_id, plan, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, unixepoch(), unixepoch())
        `).bind(url, url_type || null, brand_id || null, cloudflare_zone_id || null, cloudflare_worker_id || null, cloudflare_pages_id || null, plan || null, notes || null).run();

        const urlRecord = await db.prepare('SELECT * FROM urls WHERE id = ?').bind(result.meta.last_row_id).first();
        return c.json(urlRecord);
    } catch (error) {
        console.error('URL create error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Resources API
app.get('/api/resources', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const { resource_type, brand_id, status } = c.req.query();
        
        let query = 'SELECT * FROM cloudflare_resources WHERE 1=1';
        const params = [];
        
        if (resource_type) {
            query += ' AND resource_type = ?';
            params.push(resource_type);
        }
        if (brand_id) {
            query += ' AND brand_id = ?';
            params.push(brand_id);
        }
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY resource_type, resource_name';
        const resources = await db.prepare(query).bind(...params).all();
        return c.json(resources.results || []);
    } catch (error) {
        console.error('Resources fetch error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Analysis: Find Duplicates
app.get('/api/analysis/duplicates', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        
        // Find duplicate workers (same name pattern)
        const duplicateWorkers = await db.prepare(`
            SELECT resource_name, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM cloudflare_resources
            WHERE resource_type = 'worker'
            GROUP BY resource_name
            HAVING count > 1
        `).all();

        // Find duplicate URLs
        const duplicateURLs = await db.prepare(`
            SELECT url, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM urls
            GROUP BY url
            HAVING count > 1
        `).all();

        return c.json({
            success: true,
            duplicates: {
                workers: duplicateWorkers.results || [],
                urls: duplicateURLs.results || []
            }
        });
    } catch (error) {
        console.error('Duplicate analysis error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Analysis: Check URL Health (404s)
app.post('/api/analysis/check-urls', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);
        const { limit = 50 } = await c.req.json();
        
        // Get URLs that haven't been checked recently
        const urls = await db.prepare(`
            SELECT * FROM urls 
            WHERE status = 'active' 
            ORDER BY last_checked ASC NULLS FIRST
            LIMIT ?
        `).bind(limit).all();

        const results = [];
        for (const urlRecord of urls.results || []) {
            const startTime = Date.now();
            const status = await checkURLStatus(urlRecord.url);
            const responseTime = Date.now() - startTime;

            // Record health check
            await db.prepare(`
                INSERT INTO url_health_checks (url_id, http_status, response_time_ms, error_message)
                VALUES (?, ?, ?, ?)
            `).bind(
                urlRecord.id,
                status.status === 'ERROR' ? null : status.status,
                responseTime,
                status.error || null
            ).run();

            // Update URL status
            const newStatus = status.status === 404 ? '404' : 
                            status.status === 'ERROR' ? 'error' : 'active';
            
            await db.prepare(`
                UPDATE urls 
                SET status = ?, http_status = ?, last_checked = unixepoch(), updated_at = unixepoch()
                WHERE id = ?
            `).bind(newStatus, status.status === 'ERROR' ? null : status.status, urlRecord.id).run();

            results.push({
                url: urlRecord.url,
                status: status.status,
                responseTime,
                error: status.error
            });
        }

        return c.json({
            success: true,
            checked: results.length,
            results
        });
    } catch (error) {
        console.error('URL health check error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Helper function to check URL status
async function checkURLStatus(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(url, { 
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        return {
            status: response.status,
            ok: response.ok
        };
    } catch (error) {
        return {
            status: 'ERROR',
            ok: false,
            error: error.message
        };
    }
}

// Sync Cloudflare data to D1
app.post('/api/sync/cloudflare', async (c) => {
    try {
        const db = c.env.DB;
        const token = c.env.CLOUDFLARE_API_TOKEN;
        
        if (!token) {
            return c.json({ error: 'Cloudflare API token not configured' }, 500);
        }

        await ensureBrandTablesExist(db);
        
        // Insert default brands
        const defaultBrands = [
            { name: 'MeauxCLOUD', slug: 'meauxcloud', category: 'core', description: 'Primary cloud platform' },
            { name: 'MeauxOS', slug: 'meauxos', category: 'core', description: 'Operating system layer' },
            { name: 'Meauxbility', slug: 'meauxbility', category: 'core', description: 'Parent organization • Tech & Innovation Hub' },
            { name: 'Inner Animal', slug: 'inner-animal', category: 'ecommerce', description: 'Pet accessories & apparel brand' },
            { name: 'SolarSpec', slug: 'solarspec', category: 'energy', description: 'Solar energy solutions' },
            { name: 'Krewe of Jesters', slug: 'krewe-of-jesters', category: 'events', description: 'Events & entertainment' },
            { name: 'SamPrimeaux.com', slug: 'samprimeaux', category: 'portfolio', description: 'Personal portfolio & consultancy' },
            { name: 'Client Projects', slug: 'client-projects', category: 'client', description: 'Enterprise solutions & consulting' },
            { name: 'New Iberia Church of Christ', slug: 'new-iberia-church', category: 'client', description: 'Church website and services' },
            { name: 'Southern Pets Animal Rescue', slug: 'southern-pets', category: 'client', description: 'Animal rescue organization' },
            { name: 'iAutodidact', slug: 'iautodidact', category: 'core', description: 'Education platform' },
        ];

        for (const brand of defaultBrands) {
            await db.prepare(`
                INSERT OR IGNORE INTO brands (name, slug, category, description)
                VALUES (?, ?, ?, ?)
            `).bind(brand.name, brand.slug, brand.category, brand.description).run();
        }

        const accountId = c.env.CLOUDFLARE_ACCOUNT_ID || 'ede6590ac0d2fb7daf155b35653457b2';
        
        // Fetch and sync Cloudflare data
        const zonesRes = await fetch(
            `https://api.cloudflare.com/client/v4/zones?account.id=${accountId}&per_page=50`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const zonesData = await zonesRes.json();
        const zones = zonesData.success ? zonesData.result : [];

        // Sync zones to URLs table
        for (const zone of zones) {
            const brandSlug = zone.name.includes('meauxcloud') ? 'meauxcloud' :
                            zone.name.includes('meauxbility') ? 'meauxbility' :
                            zone.name.includes('inneranimal') ? 'inner-animal' :
                            zone.name.includes('iautodidact') ? 'iautodidact' :
                            zone.name.includes('newiberia') ? 'new-iberia-church' :
                            zone.name.includes('southernpets') ? 'southern-pets' : 'client-projects';
            
            const brand = await db.prepare('SELECT id FROM brands WHERE slug = ?').bind(brandSlug).first();
            const brandId = brand?.id || null;

            await db.prepare(`
                INSERT OR IGNORE INTO urls (url, url_type, cloudflare_zone_id, brand_id, plan, status)
                VALUES (?, 'domain', ?, ?, ?, 'active')
            `).bind(`https://${zone.name}`, zone.id, brandId, zone.plan?.name?.toLowerCase() || 'free').run();
        }

        // Fetch workers
        const workersRes = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const workersData = await workersRes.json();
        const workers = workersData.success ? workersData.result : [];

        // Sync workers
        for (const worker of workers) {
            await db.prepare(`
                INSERT OR IGNORE INTO cloudflare_resources (resource_type, resource_name, resource_id, status)
                VALUES ('worker', ?, ?, 'active')
            `).bind(worker.id, worker.id).run();
        }

        return c.json({
            success: true,
            synced: {
                brands: defaultBrands.length,
                zones: zones.length,
                workers: workers.length
            }
        });
    } catch (error) {
        console.error('Cloudflare sync error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Get comprehensive ecosystem overview
app.get('/api/ecosystem/overview', async (c) => {
    try {
        const db = c.env.DB;
        await ensureBrandTablesExist(db);

        const [brands, urls, resources, duplicates] = await Promise.all([
            db.prepare('SELECT * FROM brands ORDER BY category, name').all(),
            db.prepare('SELECT * FROM urls ORDER BY url').all(),
            db.prepare('SELECT * FROM cloudflare_resources ORDER BY resource_type, resource_name').all(),
            db.prepare('SELECT * FROM duplicate_resources WHERE status = "pending"').all()
        ]);

        // Count by status
        const urlStatusCounts = await db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM urls 
            GROUP BY status
        `).all();

        const resourceTypeCounts = await db.prepare(`
            SELECT resource_type, COUNT(*) as count 
            FROM cloudflare_resources 
            GROUP BY resource_type
        `).all();

        return c.json({
            success: true,
            overview: {
                brands: {
                    total: brands.results?.length || 0,
                    byCategory: brands.results?.reduce((acc, b) => {
                        acc[b.category] = (acc[b.category] || 0) + 1;
                        return acc;
                    }, {}) || {}
                },
                urls: {
                    total: urls.results?.length || 0,
                    byStatus: urlStatusCounts.results?.reduce((acc, u) => {
                        acc[u.status] = u.count;
                        return acc;
                    }, {}) || {}
                },
                resources: {
                    total: resources.results?.length || 0,
                    byType: resourceTypeCounts.results?.reduce((acc, r) => {
                        acc[r.resource_type] = r.count;
                        return acc;
                    }, {}) || {}
                },
                duplicates: {
                    pending: duplicates.results?.length || 0
                }
            },
            data: {
                brands: brands.results || [],
                urls: urls.results || [],
                resources: resources.results || [],
                duplicates: duplicates.results || []
            }
        });
    } catch (error) {
        console.error('Ecosystem overview error:', error);
        return c.json({ error: error.message }, 500);
    }
});

export default app

// --- Durable Object Class ---
export class ChatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = [];
    }

    async fetch(request) {
        if (request.headers.get("Upgrade") !== "websocket") {
            // You could handle HTTP requests to the DO here too
            return new Response("Expected websocket", { status: 426 });
        }

        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        this.handleSession(server);

        return new Response(null, { status: 101, webSocket: client });
    }

    handleSession(webSocket) {
        webSocket.accept();
        this.sessions.push(webSocket);

        webSocket.addEventListener("message", async msg => {
            // Broadcast message to all other sessions
            this.sessions = this.sessions.filter(s => {
                try {
                    s.send(msg.data);
                    return true;
                } catch (err) {
                    // Session closed
                    return false;
                }
            });

            // Optionally persist to D1 for history (async)
            try {
                const data = JSON.parse(msg.data);
                // We could fire-and-forget an insert here or batch them
                if (data.text) {
                    // await this.env.DB.prepare('INSERT...').run(); // simplified
                }
            } catch (e) { }
        });

        webSocket.addEventListener("close", () => {
            this.sessions = this.sessions.filter(s => s !== webSocket);
        });
    }
}
