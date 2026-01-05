// Environment bindings type definitions for MeauxCLOUD Worker

export interface Env {
    // D1 Database
    DB: D1Database;

    // R2 Bucket
    R2_ASSETS: R2Bucket;

    // Analytics Engine
    ANALYTICS_ENGINE: AnalyticsEngineDataset;

    // Workers AI
    AI: any; // Cloudflare AI binding

    // Durable Objects
    CHAT_ROOM: DurableObjectNamespace;

    // Vectorize
    VECTORIZE_INDEX: VectorizeIndex;

    // Workflows
    BRAND_BUILDER: Workflow;

    // Services (Internal Workers)
    INTERNAL_SERVICE: Fetcher;

    // Browser Rendering
    MY_BROWSER: any; // cloudflare/puppeteer binding

    // Hyperdrive
    HYPERDRIVE: Hyperdrive;

    // Environment Variables
    ENVIRONMENT: 'development' | 'staging' | 'production';
    APP_NAME: string;
    APP_URL: string;

    // Secrets (set via wrangler secret put)
    AI_GATEWAY_TOKEN?: string;
    CLOUDCONVERT_API_KEY?: string;
    CLOUDFLARE_API_KEY?: string;
    CLOUDFLARE_API_TOKEN?: string;
    CLOUDFLARE_ACCOUNT_ID?: string;
    CURSOR_API_KEY?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GITHUB_MARKETPLACE_WEBHOOK_SECRET?: string;
    GITHUB_PAT?: string;
    GOOGLE_API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    MESHYAI_API_KEY?: string;
    RESEND_API_KEY?: string;
    RESEND_WEBHOOK_SECRET?: string;
    SFU_API_TOKEN?: string;
    SFU_APP_ID?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_S3_ACCESS_KEY_ID?: string;
    SUPABASE_S3_ENDPOINT?: string;
    SUPABASE_S3_REGION?: string;
    SUPABASE_S3_SECRET_ACCESS_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SUPABASE_SERVICE_KEY?: string;
    SUPABASE_URL?: string;
    TURN_API_TOKEN?: string;
    TURN_TOKEN_ID?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
}

// Extend Hono context with our environment
declare module 'hono' {
    interface ContextVariableMap {
        user?: User;
        session?: Session;
    }
}
