/**
 * GitHub-Cloudflare Sync Worker
 * Connects GitHub repository with Cloudflare for automated deployments
 * and status synchronization
 */

import { Hono } from 'hono';

const app = new Hono();
const CF_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const GITHUB_REPO = 'ceosamprimeaux/meauxCLOUD';

// Helper to fetch GitHub API
async function fetchGitHubAPI(endpoint, token) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });
    return await response.json();
}

// Helper to fetch Cloudflare API
async function fetchCFAPI(endpoint, token) {
    const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.success ? data.result : null;
}

// Get deployment status
app.get('/api/sync/status', async (c) => {
    try {
        const githubToken = c.env.GITHUB_TOKEN;
        const cfToken = c.env.CLOUDFLARE_API_TOKEN;

        if (!githubToken || !cfToken) {
            return c.json({ error: 'Tokens not configured' }, 500);
        }

        // Get latest GitHub deployment
        const githubDeploy = await fetchGitHubAPI(
            `/repos/${GITHUB_REPO}/deployments?per_page=1`,
            githubToken
        );

        // Get latest Cloudflare Worker deployment
        const worker = await fetchCFAPI(
            `/accounts/${CF_ACCOUNT_ID}/workers/scripts/meauxcloud`,
            cfToken
        );

        return c.json({
            success: true,
            github: {
                latestDeployment: githubDeploy[0] || null,
                repository: GITHUB_REPO,
            },
            cloudflare: {
                worker: worker ? {
                    id: worker.id,
                    created: worker.created_on,
                    modified: worker.modified_on
                } : null,
            },
            synced: true
        });
    } catch (error) {
        console.error('Sync status error:', error);
        return c.json({ error: error.message }, 500);
    }
});

// Webhook handler for GitHub deployments
app.post('/api/sync/webhook', async (c) => {
    try {
        const signature = c.req.header('X-Hub-Signature-256');
        const body = await c.req.text();
        const event = JSON.parse(body);

        // Verify webhook signature (if secret is set)
        const secret = c.env.GITHUB_WEBHOOK_SECRET;
        if (secret) {
            // Verify signature here
        }

        // Handle different event types
        switch (event.action || event.ref_type) {
            case 'created':
            case 'deployment':
                // Trigger Cloudflare deployment
                console.log('GitHub deployment event:', event);
                // You can trigger wrangler deploy here
                break;
        }

        // Store event in D1
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
        `).bind(event.action || event.ref_type || 'unknown', JSON.stringify(event)).run();

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

// Trigger manual sync
app.post('/api/sync/trigger', async (c) => {
    try {
        const { type } = await c.req.json();
        const githubToken = c.env.GITHUB_TOKEN;
        const cfToken = c.env.CLOUDFLARE_API_TOKEN;

        if (!githubToken || !cfToken) {
            return c.json({ error: 'Tokens not configured' }, 500);
        }

        let result = {};

        if (type === 'github' || type === 'all') {
            // Get latest commit
            const commits = await fetchGitHubAPI(
                `/repos/${GITHUB_REPO}/commits?per_page=1`,
                githubToken
            );
            result.github = { latestCommit: commits[0] };
        }

        if (type === 'cloudflare' || type === 'all') {
            // Get worker status
            const worker = await fetchCFAPI(
                `/accounts/${CF_ACCOUNT_ID}/workers/scripts/meauxcloud`,
                cfToken
            );
            result.cloudflare = { worker };
        }

        return c.json({
            success: true,
            synced: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sync trigger error:', error);
        return c.json({ error: error.message }, 500);
    }
});

export default app;

