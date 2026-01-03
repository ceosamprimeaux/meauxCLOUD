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

// --- Dashboard Route ---
app.get('/dashboard', async (c) => {
    return getAsset(c, 'dashboard.html')
})

// --- Dashboard Stats API ---
app.get('/api/dashboard/stats', async (c) => {
    try {
        const db = c.env.DB;

        const [users, projects, tasks, deployments] = await Promise.all([
            db.prepare('SELECT COUNT(*) as count FROM users').first(),
            db.prepare('SELECT COUNT(*) as count FROM projects').first(),
            db.prepare('SELECT COUNT(*) as count FROM tasks').first(),
            db.prepare('SELECT COUNT(*) as count FROM deployments').first(),
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

app.get('/', (c) => getAsset(c, 'index.html'))
app.get('/dashboard', (c) => getAsset(c, 'dashboard.html'))
app.get('/dashboard/*', (c) => getAsset(c, 'dashboard.html'))
app.get('/assets/*', (c) => {
    const key = c.req.path.slice(1) // remove leading slash, e.g. "assets/main.js"
    return getAsset(c, key)
})
app.get('/output.css', (c) => getAsset(c, 'output.css'))

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
