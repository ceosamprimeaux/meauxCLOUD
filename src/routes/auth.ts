import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import type { Env } from '../types/env';
import { createSession } from '../middleware/session';

const auth = new Hono<{ Bindings: Env }>();

// --- Google OAuth ---
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_INFO = 'https://www.googleapis.com/oauth2/v2/userinfo';

auth.get('/google', (c) => {
    // Matches Google Console: /api/auth/google/callback
    const redirectUri = `${c.env.APP_URL}/api/auth/google/callback`;

    const params = new URLSearchParams({
        client_id: c.env.GOOGLE_CLIENT_ID || '',
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/cloud-platform',
        prompt: 'select_account',
        access_type: 'offline' // Needed for refresh tokens if we want to use Drive later offline
    });

    return c.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
});

// Route matches /api/auth/google/callback
auth.get('/google/callback', async (c) => {
    const code = c.req.query('code');
    if (!code) return c.text('No code provided', 400);

    const redirectUri = `${c.env.APP_URL}/api/auth/google/callback`;

    // Exchange code for token
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: c.env.GOOGLE_CLIENT_ID || '',
            client_secret: c.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        })
    });

    const tokenData = await tokenResponse.json() as any;
    if (!tokenData.access_token) {
        return c.json({ error: 'Failed to get token', raw_response: tokenData, status: tokenResponse.status }, 400);
    }

    // Get user info
    const userResponse = await fetch(GOOGLE_USER_INFO, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userResponse.json() as any;

    // Create session
    const sessionId = await createSession(c.env, {
        userId: `google_${userData.id}`,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        provider: 'google',
        tokens: {
            ...tokenData,
            // Calculate absolute expiry time (now + expires_in seconds)
            expiry_date: Date.now() + (tokenData.expires_in * 1000)
        }
    });

    // Set cookie
    setCookie(c, 'meaux_session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return c.redirect('/dashboard');
});

// --- GitHub OAuth ---
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_INFO = 'https://api.github.com/user';

auth.get('/github', (c) => {
    const redirectUri = `${c.env.APP_URL}/api/auth/github/callback`;
    const params = new URLSearchParams({
        client_id: c.env.GITHUB_CLIENT_ID || '',
        redirect_uri: redirectUri,
        scope: 'user:email',
    });
    return c.redirect(`${GITHUB_AUTH_URL}?${params.toString()}`);
});

auth.get('/github/callback', async (c) => {
    const code = c.req.query('code');
    const marketplacePlan = c.req.query('marketplace_listing_plan_id');
    const setupAction = c.req.query('setup_action');

    // Handle Marketplace Installation Redirect (No code provided)
    if (!code && (marketplacePlan || setupAction === 'install')) {
        // Redirect them to login (or dashboard) to finish setup
        return c.redirect('/login?setup=complete');
    }

    if (!code) return c.text('No code provided', 400);

    const redirectUri = `${c.env.APP_URL}/api/auth/github/callback`;

    // Exchange code for token
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            client_id: c.env.GITHUB_CLIENT_ID,
            client_secret: c.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: redirectUri,
        })
    });

    const tokenData = await tokenResponse.json() as any;
    if (tokenData.error || !tokenData.access_token) {
        return c.json({ error: 'Failed to get GitHub token', raw: tokenData }, 400);
    }

    // Get user info
    const userResponse = await fetch(GITHUB_USER_INFO, {
        headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'User-Agent': 'MeauxCLOUD-Worker'
        }
    });

    if (!userResponse.ok) {
        return c.json({ error: 'Failed to get GitHub user profile', status: userResponse.status }, 400);
    }

    const userData = await userResponse.json() as any;

    // Fetch user emails (if primary email is private)
    let email = userData.email;
    if (!email) {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'User-Agent': 'MeauxCLOUD-Worker'
            }
        });
        if (emailsResponse.ok) {
            const emails = await emailsResponse.json() as any[];
            const primary = emails.find((e: any) => e.primary && e.verified);
            if (primary) email = primary.email;
        }
    }

    // Create session
    const sessionId = await createSession(c.env, {
        userId: `github_${userData.id}`,
        email: email || `github_${userData.id}@no-email.com`,
        name: userData.name || userData.login,
        picture: userData.avatar_url,
        provider: 'github',
        tokens: {
            access_token: tokenData.access_token,
            // GitHub tokens don't usually expire for OAuth apps unless configured
            expiry_date: Date.now() + (30 * 24 * 60 * 60 * 1000)
        }
    });

    // Set cookie
    setCookie(c, 'meaux_session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return c.redirect('/dashboard');
});

// --- Logout ---
auth.get('/logout', (c) => {
    deleteCookie(c, 'meaux_session');
    return c.redirect('/login');
});

export default auth;
