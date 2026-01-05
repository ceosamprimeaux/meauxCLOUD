/**
 * Superadmin & GCP Access Middleware
 * Automatically provisions GCP credentials for superadmin accounts
 */

import type { Context } from 'hono';
import type { Env } from '../types/env';

export interface SuperadminSession {
    isSuperadmin: boolean;
    superadminId?: number;
    gcpAccessToken?: string;
    gcpScopes?: string[];
    tenantAccess?: string[];
}

/**
 * Check if user is a superadmin and provision GCP access
 */
export async function superadminMiddleware(c: Context<{ Bindings: Env }>, next: () => Promise<void>) {
    const session = c.get('session');

    if (!session?.user?.email) {
        c.set('superadmin', { isSuperadmin: false });
        return next();
    }

    try {
        // Check if user is a superadmin
        const superadmin = await c.env.DB.prepare(
            'SELECT * FROM superadmin_accounts WHERE email = ? AND is_active = 1'
        ).bind(session.user.email).first();

        if (!superadmin) {
            c.set('superadmin', { isSuperadmin: false });
            return next();
        }

        // Get or create GCP access token
        let gcpToken = await getGCPToken(c, session.session_id);

        if (!gcpToken) {
            // Generate new token
            gcpToken = await generateGCPToken(c, superadmin.id);

            if (gcpToken) {
                // Store in session
                await c.env.DB.prepare(`
          INSERT INTO session_gcp_tokens (session_id, access_token, expires_at, scopes)
          VALUES (?, ?, datetime('now', '+1 hour'), ?)
        `).bind(
                    session.session_id,
                    gcpToken.access_token,
                    superadmin.gcp_access_scopes || '[]'
                ).run();
            }
        }

        // Get tenant access
        const tenants = await c.env.DB.prepare(
            'SELECT tenant_id, access_level FROM tenant_access WHERE superadmin_id = ?'
        ).bind(superadmin.id).all();

        // Set superadmin context
        c.set('superadmin', {
            isSuperadmin: true,
            superadminId: superadmin.id,
            gcpAccessToken: gcpToken?.access_token,
            gcpScopes: JSON.parse(superadmin.gcp_access_scopes || '[]'),
            tenantAccess: tenants.results.map((t: any) => t.tenant_id)
        });

        // Log access
        await logSuperadminAction(c, superadmin.id, 'session_start', 'session', session.session_id);

    } catch (error) {
        console.error('Superadmin middleware error:', error);
        c.set('superadmin', { isSuperadmin: false });
    }

    return next();
}

/**
 * Get existing GCP token from session
 */
async function getGCPToken(c: Context<{ Bindings: Env }>, sessionId: string) {
    const token = await c.env.DB.prepare(`
    SELECT access_token, expires_at 
    FROM session_gcp_tokens 
    WHERE session_id = ? AND datetime(expires_at) > datetime('now')
    ORDER BY created_at DESC LIMIT 1
  `).bind(sessionId).first();

    return token ? { access_token: token.access_token } : null;
}

/**
 * Generate new GCP access token using service account
 */
async function generateGCPToken(c: Context<{ Bindings: Env }>, superadminId: number) {
    try {
        // Get service account key from secrets
        const serviceAccountKey = c.env.GOOGLE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            console.warn('GOOGLE_SERVICE_ACCOUNT_KEY not configured');
            return null;
        }

        const key = JSON.parse(serviceAccountKey);
        const now = Math.floor(Date.now() / 1000);

        // Create JWT for Google OAuth
        const header = {
            alg: 'RS256',
            typ: 'JWT'
        };

        const claimSet = {
            iss: key.client_email,
            scope: 'https://www.googleapis.com/auth/cloud-platform',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        };

        // Sign JWT (you'll need to implement JWT signing with RS256)
        // For now, return a placeholder - we'll implement full JWT signing next
        const jwt = await createJWT(header, claimSet, key.private_key);

        // Exchange JWT for access token
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
        });

        if (!response.ok) {
            console.error('Failed to get GCP token:', await response.text());
            return null;
        }

        const data = await response.json() as any;
        return { access_token: data.access_token };

    } catch (error) {
        console.error('Error generating GCP token:', error);
        return null;
    }
}

/**
 * Create JWT (simplified - you'll want to use a proper crypto library)
 */
async function createJWT(header: any, payload: any, privateKey: string): Promise<string> {
    // This is a placeholder - implement proper RS256 signing
    // You can use the Web Crypto API or a library like jose
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    // TODO: Implement RS256 signature with privateKey
    const signature = 'placeholder_signature';

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Log superadmin action for audit trail
 */
async function logSuperadminAction(
    c: Context<{ Bindings: Env }>,
    superadminId: number,
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata?: any
) {
    try {
        const request = c.req.raw;
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        await c.env.DB.prepare(`
      INSERT INTO superadmin_audit_log 
      (superadmin_id, action, resource_type, resource_id, ip_address, user_agent, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
            superadminId,
            action,
            resourceType || null,
            resourceId || null,
            ip,
            userAgent,
            metadata ? JSON.stringify(metadata) : null
        ).run();
    } catch (error) {
        console.error('Failed to log superadmin action:', error);
    }
}

/**
 * Helper to check if current user is superadmin
 */
export function isSuperadmin(c: Context): boolean {
    const superadmin = c.get('superadmin') as SuperadminSession;
    return superadmin?.isSuperadmin || false;
}

/**
 * Helper to get GCP access token for current superadmin
 */
export function getGCPAccessToken(c: Context): string | null {
    const superadmin = c.get('superadmin') as SuperadminSession;
    return superadmin?.gcpAccessToken || null;
}

/**
 * Helper to check tenant access
 */
export function hasTenantAccess(c: Context, tenantId: string): boolean {
    const superadmin = c.get('superadmin') as SuperadminSession;
    return superadmin?.tenantAccess?.includes(tenantId) || false;
}
