import type { Env } from '../types/env';

export class GoogleService {
    private env: Env;
    private userId: string; // The D1 user ID (e.g. google_123)

    constructor(env: Env, userId: string) {
        this.env = env;
        this.userId = userId;
    }

    /**
     * Retrieves a valid Access Token, refreshing it if necessary.
     */
    async getAccessToken(): Promise<string | null> {
        // 1. Get tokens from Session/User
        // Note: In a real app, you might query the user table directly if sessions expire.
        // For now, we query the 'sessions' table for the user's active session.
        const session = await this.env.DB.prepare(
            'SELECT tokens FROM sessions WHERE user_id = ? ORDER BY expires_at DESC LIMIT 1'
        ).bind(this.userId).first();

        if (!session || !session.tokens) {
            console.error('No tokens found for user');
            return null;
        }

        let tokens = JSON.parse(session.tokens as string);
        const now = Date.now();

        // 2. Check Expiry (give 5 minute buffer)
        // expiry_date is usually in milliseconds from epoch if coming from Google libraries,
        // but often raw JSON has 'expires_in' (seconds).
        // Our auth.ts saved the raw response. Let's assume we saved it + a calculated expiry.
        // If we only have 'expires_in', we can't verify easily without a stored timestamp.
        // Let's assume we need to refresh if we aren't sure, or if we know it's old.

        // Use a heuristic: If we don't have a timestamp, or if it's been > 50 mins, refresh.
        // Better approach: Try to use it. If 401, refresh.
        // BEST approach: Store 'expiry_date' in auth.ts. 
        // For this iteration, let's implement the "Refresh" flow specifically.

        if (tokens.expiry_date && tokens.expiry_date > now) {
            return tokens.access_token;
        }

        if (!tokens.refresh_token) {
            console.warn('Token expired and no refresh token available');
            return null;
        }

        console.log('Refreshing Google Token...');
        const newTokens = await this.refreshTokens(tokens.refresh_token);
        if (newTokens) {
            // Merge new tokens (keeping the old refresh_token if new one not provided)
            const updatedTokens = { ...tokens, ...newTokens };
            // Ensure refresh_token is kept (Google doesn't always send it back)
            if (!updatedTokens.refresh_token) updatedTokens.refresh_token = tokens.refresh_token;

            // Updated expiry
            if (updatedTokens.expires_in) {
                updatedTokens.expiry_date = Date.now() + (updatedTokens.expires_in * 1000);
            }

            // 3. Save back to DB
            await this.env.DB.prepare(
                'UPDATE sessions SET tokens = ? WHERE user_id = ?'
            ).bind(JSON.stringify(updatedTokens), this.userId).run();

            return updatedTokens.access_token;
        }

        return null;
    }

    private async refreshTokens(refreshToken: string) {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: this.env.GOOGLE_CLIENT_ID || '',
                client_secret: this.env.GOOGLE_CLIENT_SECRET || '',
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });

        if (!response.ok) {
            console.error('Failed to refresh token', await response.text());
            return null;
        }

        return await response.json() as any;
    }

    /**
     * Call Gemini (Vertex AI)
     */
    async generateContent(prompt: string) {
        const token = await this.getAccessToken();
        if (!token) throw new Error('Failed to get access token');

        const PROJECT_ID = 'meauxcloud'; // Or fetch from env
        const LOCATION = 'us-central1';
        const MODEL = 'gemini-1.5-flash-001'; // Or pro

        const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 0.9,
                    topP: 1
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${await response.text()}`);
        }

        return await response.json();
    }

    /**
     * List Drive Files
     */
    async listFiles() {
        const token = await this.getAccessToken();
        if (!token) throw new Error('Failed to get access token');

        const response = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=nextPageToken,files(id,name,mimeType)', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return await response.json();
    }

    /**
     * Get Vector Embeddings for text (for Supabase Vector Search)
     */
    async embedContent(text: string) {
        const token = await this.getAccessToken();
        if (!token) throw new Error('Failed to get access token');

        const PROJECT_ID = 'meauxcloud';
        const LOCATION = 'us-central1';
        const MODEL = 'text-embedding-004'; // Dedicated embedding model

        const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instances: [{ content: text }]
            })
        });

        if (!response.ok) {
            throw new Error(`Embedding API Error: ${await response.text()}`);
        }

        const result = await response.json() as any;
        // Check structure of response for text-embedding-004
        if (result.predictions && result.predictions[0] && result.predictions[0].embeddings && result.predictions[0].embeddings.values) {
            return result.predictions[0].embeddings.values; // Array of floats
        }
        return null;
    }
}
