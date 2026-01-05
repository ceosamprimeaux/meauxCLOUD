/**
 * Superadmin Management Routes
 * API endpoints for managing superadmin accounts and GCP access
 */

import { Hono } from 'hono';
import type { Env } from '../types/env';
import { isSuperadmin, getGCPAccessToken } from '../middleware/superadmin';

const superadmin = new Hono<{ Bindings: Env }>();

/**
 * GET /api/superadmin/status
 * Check if current user is a superadmin and get their GCP status
 */
superadmin.get('/status', async (c) => {
    const superadminData = c.get('superadmin');

    if (!superadminData?.isSuperadmin) {
        return c.json({ isSuperadmin: false });
    }

    return c.json({
        isSuperadmin: true,
        hasGCPAccess: !!superadminData.gcpAccessToken,
        scopes: superadminData.gcpScopes,
        tenants: superadminData.tenantAccess
    });
});

/**
 * POST /api/superadmin/accounts
 * Add a new superadmin account (superadmin only)
 */
superadmin.post('/accounts', async (c) => {
    if (!isSuperadmin(c)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const { email, name, role = 'platform_admin' } = await c.req.json();

    if (!email || !name) {
        return c.json({ error: 'Email and name required' }, 400);
    }

    try {
        const result = await c.env.DB.prepare(`
      INSERT INTO superadmin_accounts (email, name, role, gcp_service_account_email, gcp_access_scopes)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
            email,
            name,
            role,
            'meauxcloud-worker@meauxcloud.iam.gserviceaccount.com',
            JSON.stringify(['https://www.googleapis.com/auth/cloud-platform'])
        ).run();

        return c.json({
            success: true,
            id: result.meta.last_row_id,
            message: `Superadmin account created for ${email}`
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

/**
 * GET /api/superadmin/accounts
 * List all superadmin accounts (superadmin only)
 */
superadmin.get('/accounts', async (c) => {
    if (!isSuperadmin(c)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const accounts = await c.env.DB.prepare(`
    SELECT id, email, name, role, gcp_service_account_email, is_active, created_at
    FROM superadmin_accounts
    ORDER BY created_at DESC
  `).all();

    return c.json({ accounts: accounts.results });
});

/**
 * POST /api/superadmin/tenant-access
 * Grant tenant access to a superadmin (superadmin only)
 */
superadmin.post('/tenant-access', async (c) => {
    if (!isSuperadmin(c)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const { superadminId, tenantId, accessLevel = 'full' } = await c.req.json();

    if (!superadminId || !tenantId) {
        return c.json({ error: 'superadminId and tenantId required' }, 400);
    }

    try {
        await c.env.DB.prepare(`
      INSERT INTO tenant_access (superadmin_id, tenant_id, access_level, gcp_enabled)
      VALUES (?, ?, ?, 1)
    `).bind(superadminId, tenantId, accessLevel).run();

        return c.json({
            success: true,
            message: `Access granted to tenant ${tenantId}`
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

/**
 * GET /api/superadmin/audit-log
 * Get audit log for superadmin actions
 */
superadmin.get('/audit-log', async (c) => {
    if (!isSuperadmin(c)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const limit = parseInt(c.req.query('limit') || '100');
    const offset = parseInt(c.req.query('offset') || '0');

    const logs = await c.env.DB.prepare(`
    SELECT 
      l.*,
      s.email as superadmin_email,
      s.name as superadmin_name
    FROM superadmin_audit_log l
    JOIN superadmin_accounts s ON l.superadmin_id = s.id
    ORDER BY l.created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

    return c.json({ logs: logs.results });
});

/**
 * POST /api/superadmin/gcp/call
 * Make a GCP API call using superadmin credentials
 */
superadmin.post('/gcp/call', async (c) => {
    if (!isSuperadmin(c)) {
        return c.json({ error: 'Unauthorized' }, 403);
    }

    const token = getGCPAccessToken(c);
    if (!token) {
        return c.json({ error: 'No GCP access token available' }, 403);
    }

    const { url, method = 'GET', body } = await c.req.json();

    if (!url) {
        return c.json({ error: 'URL required' }, 400);
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();

        return c.json({
            status: response.status,
            data
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

export default superadmin;
