# 🔐 Wrangler Secrets Reference

## Current Secrets in Cloudflare Worker

**Note**: Wrangler doesn't allow viewing secret values for security. This is a reference of what's configured.

### Your Configured Secrets:

```
AI_GATEWAY_TOKEN
CLOUDCONVERT_API_KEY
CLOUDFLARE_API_KEY
CLOUDFLARE_API_TOKEN
CURSOR_API_KEY
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_MARKETPLACE_WEBHOOK_SECRET
GITHUB_PAT
GOOGLE_API_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
MESHYAI_API_KEY
RESEND_API_KEY
RESEND_WEBHOOK_SECRET
SFU_API_TOKEN
SFU_APP_ID
SUPABASE_ANON_KEY
SUPABASE_S3_ACCESS_KEY_ID
SUPABASE_S3_ENDPOINT
SUPABASE_S3_REGION
SUPABASE_S3_SECRET_ACCESS_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_URL
TURN_API_TOKEN
TURN_TOKEN_ID
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
```

---

## To View/Update a Secret:

```bash
# List all secrets (names only)
npx wrangler secret list

# Update a secret (will prompt for value)
npx wrangler secret put SECRET_NAME

# Delete a secret
npx wrangler secret delete SECRET_NAME
```

---

## To Export for Local Development:

Create a `.dev.vars` file (this is gitignored):

```bash
# .dev.vars (for local development only - DO NOT COMMIT)
AI_GATEWAY_TOKEN=your-value-here
CLOUDCONVERT_API_KEY=your-value-here
CLOUDFLARE_API_KEY=your-value-here
CLOUDFLARE_API_TOKEN=your-value-here
# ... etc
```

**⚠️ WARNING**: Never commit `.dev.vars` to git! It's already in `.gitignore`.

---

## Account ID (Not a Secret)

Your Cloudflare Account ID is in `wrangler.toml`:
```
account_id = "ede6590ac0d2fb7daf155b35653457b2"
```

This is public and safe to commit.

