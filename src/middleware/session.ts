import type { Env } from '../../types/env';
import { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

export interface UserSession {
    id: string;
    userId: string;
    email: string;
    name: string;
    picture: string;
    provider: 'google' | 'github';
    createdAt: number;
    tokens?: any; // JSON object for access/refresh tokens
}

const SESSION_COOKIE = 'meaux_session';

// --- Session Helpers ---

export async function createSession(env: Env, user: Partial<UserSession>): Promise<string> {
    const sessionId = crypto.randomUUID();
    const now = Date.now();

    // Store session in D1
    await env.DB.prepare(
        `INSERT INTO sessions (id, user_id, email, name, picture, provider, tokens, created_at, expires_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
        sessionId,
        user.userId,
        user.email,
        user.name,
        user.picture,
        user.provider,
        user.tokens ? JSON.stringify(user.tokens) : null,
        now,
        now + (7 * 24 * 60 * 60 * 1000) // 7 days expiry
    ).run();

    return sessionId;
}

export async function getSession(env: Env, sessionId: string): Promise<UserSession | null> {
    const result = await env.DB.prepare(
        'SELECT * FROM sessions WHERE id = ? AND expires_at > ?'
    ).bind(sessionId, Date.now()).first();

    if (!result) return null;

    let tokens = null;
    try {
        if (result.tokens && typeof result.tokens === 'string') {
            tokens = JSON.parse(result.tokens);
        }
    } catch (e) {
        // ignore parse error
    }

    return {
        id: result.id as string,
        userId: result.user_id as string,
        email: result.email as string,
        name: result.name as string,
        picture: result.picture as string,
        provider: result.provider as 'google' | 'github',
        createdAt: result.created_at as number,
        tokens
    };
}

export async function deleteSession(env: Env, sessionId: string): Promise<void> {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

// --- Middleware ---

export async function sessionMiddleware(c: Context<{ Bindings: Env, Variables: { user: UserSession } }>, next: Next) {
    const sessionId = getCookie(c, SESSION_COOKIE);

    // Public routes that don't need auth (add more as needed)
    const publicPaths = ['/', '/login', '/api/auth', '/health', '/assets'];
    if (publicPaths.some(p => c.req.path.startsWith(p))) {
        return next();
    }

    if (!sessionId) {
        if (c.req.path.startsWith('/api/')) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        return c.redirect('/login');
    }

    const session = await getSession(c.env, sessionId);
    if (!session) {
        deleteCookie(c, SESSION_COOKIE);
        if (c.req.path.startsWith('/api/')) {
            return c.json({ error: 'Unauthorized' }, 401);
        }
        return c.redirect('/login');
    }

    // Attach user to context
    c.set('user', session);

    await next();
}
