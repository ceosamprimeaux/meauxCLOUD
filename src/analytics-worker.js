/**
 * Analytics Worker
 * Tracks GitHub Actions usage, Cloudflare usage, and costs
 * Provides reliable analytics to control spending
 */

import { Hono } from 'hono';

const app = new Hono();
const CF_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';

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

        // Get account analytics
        const analytics = await fetchCFAPI(
            `/accounts/${CF_ACCOUNT_ID}/analytics/aggregate?since=${startDate}&until=${endDate}`,
            token
        );

        // Get Workers usage
        const workers = await fetchCFAPI(
            `/accounts/${CF_ACCOUNT_ID}/workers/scripts`,
            token
        );

        // Get R2 usage
        const r2Buckets = await fetchCFAPI(
            `/accounts/${CF_ACCOUNT_ID}/r2/buckets`,
            token
        );

        // Get D1 databases
        const d1Databases = await fetchCFAPI(
            `/accounts/${CF_ACCOUNT_ID}/d1/database`,
            token
        );

        return c.json({
            success: true,
            period: { start: startDate, end: endDate },
            cloudflare: {
                analytics: analytics || {},
                workers: {
                    total: Array.isArray(workers) ? workers.length : 0,
                    list: Array.isArray(workers) ? workers.map(w => ({ id: w.id, created: w.created_on })) : []
                },
                r2: {
                    buckets: Array.isArray(r2Buckets) ? r2Buckets.length : 0,
                    total: Array.isArray(r2Buckets) ? r2Buckets.map(b => b.name) : []
                },
                d1: {
                    databases: Array.isArray(d1Databases) ? d1Databases.length : 0,
                    list: Array.isArray(d1Databases) ? d1Databases.map(d => ({ name: d.name, uuid: d.uuid })) : []
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
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Get workflow runs
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

        // Calculate stats
        const stats = {
            total: runs.length,
            success: runs.filter(r => r.conclusion === 'success').length,
            failure: runs.filter(r => r.conclusion === 'failure').length,
            cancelled: runs.filter(r => r.conclusion === 'cancelled').length,
            in_progress: runs.filter(r => r.status === 'in_progress').length,
            queued: runs.filter(r => r.status === 'queued').length,
        };

        // Calculate minutes used (approximate)
        const totalMinutes = runs.reduce((sum, run) => {
            const start = new Date(run.created_at);
            const end = run.updated_at ? new Date(run.updated_at) : new Date();
            const minutes = Math.ceil((end - start) / 1000 / 60);
            return sum + minutes;
        }, 0);

        // Free tier: 2,000 minutes/month
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
        
        // Get cost data from D1 (if stored)
        const costData = await db.prepare(`
            SELECT * FROM cost_tracking 
            WHERE month = strftime('%Y-%m', 'now')
            ORDER BY date DESC
        `).all().catch(() => ({ results: [] }));

        // Calculate estimated costs based on usage
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
        // Fetch all analytics in parallel
        const [cloudflare, github, costs] = await Promise.all([
            fetch(`${c.req.url.split('/api/analytics/overview')[0]}/api/analytics/cloudflare`).then(r => r.json()),
            fetch(`${c.req.url.split('/api/analytics/overview')[0]}/api/analytics/github`).then(r => r.json()),
            fetch(`${c.req.url.split('/api/analytics/overview')[0]}/api/analytics/costs`).then(r => r.json())
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

// Store cost data (called by scheduled worker)
app.post('/api/analytics/costs/track', async (c) => {
    try {
        const db = c.env.DB;
        const { service, amount, details } = await c.req.json();

        // Ensure table exists
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

        await db.prepare(`
            INSERT INTO cost_tracking (service, amount, details, month)
            VALUES (?, ?, ?, strftime('%Y-%m', 'now'))
        `).bind(service, amount, JSON.stringify(details || {})).run();

        return c.json({ success: true });
    } catch (error) {
        console.error('Cost tracking error:', error);
        return c.json({ error: error.message }, 500);
    }
});

export default app;

