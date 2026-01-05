import type { Env } from '../types/env';

export class SupabaseService {
    private env: Env;
    private baseUrl: string;
    private key: string;

    constructor(env: Env) {
        this.env = env;
        this.baseUrl = env.SUPABASE_URL || '';
        this.key = env.SUPABASE_SERVICE_KEY || '';
    }

    /**
     * Upsert data into a Supabase table
     */
    async upsert(tableName: string, data: any[]) {
        if (!this.baseUrl || !this.key) {
            console.error('Missing Supabase credentials');
            return;
        }

        const url = `${this.baseUrl}/rest/v1/${tableName}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apikey': this.key,
                    'Authorization': `Bearer ${this.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates' // Upsert logic
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const text = await response.text();
                // If table doesn't exist, we can't create it via REST nicely without SQL editor
                console.error(`Supabase Sync Error (${tableName}):`, text);
            } else {
                console.log(`Synced ${data.length} rows to ${tableName}`);
            }
        } catch (e) {
            console.error('Supabase Network Error:', e);
        }
    }

    /**
     * Upload file to Supabase Storage (MeauxCLOUD bucket)
     */
    async uploadFile(path: string, fileData: ArrayBuffer, contentType: string) {
        if (!this.baseUrl || !this.key) return;

        const bucket = 'MeauxCLOUD';
        const url = `${this.baseUrl}/storage/v1/object/${bucket}/${path}`;

        try {
            const response = await fetch(url, {
                method: 'POST', // or PUT
                headers: {
                    'apikey': this.key,
                    'Authorization': `Bearer ${this.key}`,
                    'Content-Type': contentType
                    // 'x-upsert': 'true'
                },
                body: fileData
            });

            if (!response.ok) {
                console.error('Supabase Storage Error:', await response.text());
                return null;
            }

            // Return public URL
            return `${this.baseUrl}/storage/v1/object/public/${bucket}/${path}`;
        } catch (e) {
            console.error('Supabase Storage Network Error:', e);
            return null;
        }
    }
}
