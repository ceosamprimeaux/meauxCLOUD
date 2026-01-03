# 🔐 Complete GitHub Secrets Setup Guide

## Required Secrets for Full Backend Connection

Add these secrets in: **GitHub Repo → Settings → Secrets and variables → Actions → New repository secret**

---

## 🌩️ Cloudflare API Secrets

### 1. `CLOUDFLARE_API_TOKEN`
**Purpose**: Full access to Cloudflare API (Workers, R2, Images, Gateways, etc.)

**How to get it:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template
4. Permissions needed:
   - Account: Workers Scripts: Edit
   - Account: Workers KV Storage: Edit
   - Account: Workers Routes: Edit
   - Account: R2: Object Read & Write
   - Account: Zone: Zone Settings: Read
   - Account: Zone: Zone: Read
5. Account Resources: Include - Specific account - `ede6590ac0d2fb7daf155b35653457b2`
6. Copy the token

**Value**: `your-cloudflare-api-token-here`

---

### 2. `CLOUDFLARE_ACCOUNT_ID`
**Purpose**: Your Cloudflare account identifier

**Value**: `ede6590ac0d2fb7daf155b35653457b2` (already in your code)

---

### 3. `AI_GATEWAY_TOKEN`
**Purpose**: Cloudflare AI Gateway authentication

**How to get it:**
1. Go to [Cloudflare Dashboard → AI Gateway](https://dash.cloudflare.com/?to=/:account/ai-gateway)
2. Create or select your gateway (e.g., `meauxcloudai`)
3. Go to **Settings → Authentication**
4. Copy the **Bearer Token**

**Value**: `your-ai-gateway-token-here`

---

## 🎥 Cloudflare Calls (SFU) Secrets

### 4. `SFU_APP_ID`
**Purpose**: Cloudflare Calls application ID for video conferencing

**How to get it:**
1. Go to [Cloudflare Dashboard → Calls](https://dash.cloudflare.com/?to=/:account/calls)
2. Create a new Calls application or use existing
3. Copy the **Application ID**

**Value**: `your-sfu-app-id-here`

---

### 5. `SFU_API_TOKEN`
**Purpose**: API token for Cloudflare Calls

**How to get it:**
1. In your Calls application settings
2. Go to **API Tokens**
3. Create a new token with **Full Access**
4. Copy the token

**Value**: `your-sfu-api-token-here`

---

## 🔄 TURN/STUN Secrets (WebRTC)

### 6. `TURN_TOKEN_ID`
**Purpose**: TURN server username for WebRTC connections

**How to get it:**
1. Go to [Cloudflare Dashboard → Calls → TURN](https://dash.cloudflare.com/?to=/:account/calls/turn)
2. Create TURN credentials
3. Copy the **Username/Token ID**

**Value**: `your-turn-token-id-here`

---

### 7. `TURN_API_TOKEN`
**Purpose**: TURN server credential/password

**How to get it:**
1. Same location as above
2. Copy the **Credential/Password**

**Value**: `your-turn-api-token-here`

---

## 🔐 Google OAuth & API Secrets

### 8. `GOOGLE_CLIENT_ID`
**Purpose**: Google OAuth client ID

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. **APIs & Services → Credentials**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Copy the **Client ID**

**Authorized JavaScript Origins:**
- `https://meauxcloud.org`
- `https://www.meauxcloud.org`
- `https://ceosamprimeaux.github.io`
- `https://meauxcloud.meauxbility.workers.dev`

**Authorized Redirect URIs:**
- `https://meauxcloud.org/api/auth/google/callback`
- `https://ceosamprimeaux.github.io/meauxCLOUD/api/auth/google/callback`

**Value**: `your-google-client-id.apps.googleusercontent.com`

---

### 9. `GOOGLE_CLIENT_SECRET`
**Purpose**: Google OAuth client secret

**How to get it:**
1. Same location as above
2. Copy the **Client Secret**

**Value**: `your-google-client-secret-here`

---

### 10. `GOOGLE_API_KEY`
**Purpose**: Google API key for Gemini, Maps, etc.

**How to get it:**
1. **APIs & Services → Credentials**
2. Click **"Create Credentials" → "API Key"**
3. Restrict it to:
   - Google Generative AI API
   - Any other Google APIs you use
4. Copy the API key

**Value**: `your-google-api-key-here`

---

## 📧 Resend Email Secrets

### 11. `RESEND_API_KEY`
**Purpose**: Resend API key for sending emails

**How to get it:**
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key

**Value**: `re_your-resend-api-key-here`

---

### 12. `RESEND_WEBHOOK_SECRET`
**Purpose**: Webhook secret for Resend email events

**How to get it:**
1. Go to [Resend Dashboard → Webhooks](https://resend.com/webhooks)
2. Create a webhook endpoint: `https://meauxcloud.org/api/webhooks/resend`
3. Copy the **Webhook Signing Secret**

**Value**: `whsec_your-webhook-secret-here`

---

## 🎨 MeshyAI Secrets

### 13. `MESHYAI_API_KEY`
**Purpose**: MeshyAI API key for 3D model generation

**How to get it:**
1. Go to [MeshyAI Dashboard](https://www.meshy.ai/api-keys)
2. Create a new API key
3. Copy the key

**Value**: `your-meshyai-api-key-here`

---

## 🔄 CloudConvert Secrets

### 14. `CLOUDCONVERT_API_KEY`
**Purpose**: CloudConvert API key for file conversion

**How to get it:**
1. Go to [CloudConvert Dashboard](https://cloudconvert.com/dashboard/api-keys)
2. Create a new API key
3. Copy the key

**Value**: `your-cloudconvert-api-key-here`

---

## 🗄️ Supabase Secrets

### 15. `SUPABASE_URL`
**Purpose**: Your Supabase project URL

**How to get it:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. **Settings → API**
4. Copy the **Project URL**

**Value**: `https://your-project.supabase.co`

---

### 16. `SUPABASE_ANON_KEY`
**Purpose**: Supabase anonymous/public key

**How to get it:**
1. Same location as above
2. Copy the **anon/public** key

**Value**: `your-supabase-anon-key-here`

---

### 17. `SUPABASE_SERVICE_ROLE_KEY`
**Purpose**: Supabase service role key (elevated permissions)

**How to get it:**
1. Same location as above
2. Copy the **service_role** key (⚠️ Keep this secret!)

**Value**: `your-supabase-service-role-key-here`

---

## 🐙 GitHub Secrets

### 18. `GITHUB_MARKETPLACE_WEBHOOK_SECRET`
**Purpose**: Webhook secret for GitHub Marketplace events

**How to get it:**
1. Go to your GitHub App settings
2. **Settings → Webhooks**
3. Create webhook: `https://meauxcloud.org/api/webhook/github-marketplace`
4. Generate a secret
5. Copy the secret

**Value**: `your-github-webhook-secret-here`

---

## 📱 Twilio Secrets (Optional - for SMS)

### 19. `TWILIO_ACCOUNT_SID`
**Purpose**: Twilio account SID

**Value**: `your-twilio-account-sid-here`

---

### 20. `TWILIO_AUTH_TOKEN`
**Purpose**: Twilio auth token

**Value**: `your-twilio-auth-token-here`

---

### 21. `TWILIO_PHONE_NUMBER`
**Purpose**: Twilio phone number

**Value**: `+1234567890`

---

## 📋 Quick Setup Checklist

Copy this list and check off as you add each secret:

- [ ] `CLOUDFLARE_API_TOKEN
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `AI_GATEWAY_TOKEN`
- [ ] `SFU_APP_ID`
- [ ] `SFU_API_TOKEN`
- [ ] `TURN_TOKEN_ID`
- [ ] `TURN_API_TOKEN`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_WEBHOOK_SECRET`
- [ ] `MESHYAI_API_KEY`
- [ ] `CLOUDCONVERT_API_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `GITHUB_MARKETPLACE_WEBHOOK_SECRET`
- [ ] `TWILIO_ACCOUNT_SID` (optional)
- [ ] `TWILIO_AUTH_TOKEN` (optional)
- [ ] `TWILIO_PHONE_NUMBER` (optional)

---

## 🚀 Setting Secrets in GitHub

1. Go to: `https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions`
2. Click **"New repository secret"**
3. Name: Use exact names from above (case-sensitive!)
4. Secret: Paste the value
5. Click **"Add secret"**
6. Repeat for all secrets

---

## 🔒 Setting Secrets in Cloudflare Worker

After adding to GitHub, also add to Cloudflare Worker:

1. Go to [Cloudflare Dashboard → Workers](https://dash.cloudflare.com/?to=/:account/workers)
2. Select your worker: `meauxcloud`
3. **Settings → Variables and Secrets**
4. Click **"Add variable"** for each secret
5. Use the same names as above

---

## ✅ Verification

After setting all secrets, verify:

1. **GitHub Actions** can deploy (check Actions tab)
2. **Cloudflare Worker** has all secrets (check Worker settings)
3. **API endpoints** work (test in browser console)

---

## 🆘 Troubleshooting

### "Secret not found" errors
- Check secret names match exactly (case-sensitive)
- Verify secrets are added to both GitHub AND Cloudflare Worker

### API calls failing
- Verify API keys are valid and not expired
- Check API quotas/limits
- Review Cloudflare Worker logs

### OAuth not working
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure client ID/secret are correct

---

## 📚 Additional Resources

- [Cloudflare API Tokens](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Cloudflare Calls Setup](https://developers.cloudflare.com/calls/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Resend API Docs](https://resend.com/docs/api-reference/overview)
- [MeshyAI API Docs](https://docs.meshy.ai/)
- [CloudConvert API Docs](https://cloudconvert.com/api/v2)

