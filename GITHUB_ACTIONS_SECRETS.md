# 🔐 GitHub Actions Secrets - MeauxCLOUD

## Required Secrets for CI/CD

Add these in: **https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions**

---

## ✅ Core Cloudflare (Required)

```
CLOUDFLARE_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
```

**Note**: The API token you have might be old. Get a fresh one:
- https://dash.cloudflare.com/profile/api-tokens
- Create "Edit Cloudflare Workers" token

---

## ✅ Google OAuth & API (Required)

```
GOOGLE_CLIENT_ID=365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<get-from-google-cloud-console>
GOOGLE_API_KEY=<your-google-api-key>
```

**Get GOOGLE_CLIENT_SECRET**:
- https://console.cloud.google.com/apis/credentials
- Find OAuth client: `365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu`
- Copy the Client Secret

---

## ✅ Resend Email (Required)

```
RESEND_API_KEY=<your-resend-api-key>
RESEND_WEBHOOK_SECRET=<your-resend-webhook-secret>
```

---

## ✅ Supabase (If Using)

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
```

---

## ✅ Video/Streaming (If Using SFU)

```
SFU_APP_ID=<Get from Cloudflare Calls dashboard>
SFU_API_TOKEN=<Get from Cloudflare Calls dashboard>
TURN_TOKEN_ID=<Get from Cloudflare Calls TURN settings>
TURN_API_TOKEN=<Get from Cloudflare Calls TURN settings>
```

**Get these from**: https://dash.cloudflare.com/?to=/:account/calls

---

## ✅ Third-Party APIs (Optional - Add as needed)

```
MESHYAI_API_KEY=<your-meshyai-api-key>
CLOUDCONVERT_API_KEY=<your-cloudconvert-api-key>
```

---

## ✅ GitHub (If Using Webhooks)

```
GITHUB_MARKETPLACE_WEBHOOK_SECRET=<Your webhook secret>
```

---

## ✅ Twilio (If Using SMS)

```
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<Your Twilio number>
```

---

## 🚨 IMPORTANT: What NOT to Add

**DO NOT add these to GitHub Actions** (they're for other projects or local dev only):

- ❌ AWS keys (not used in MeauxCLOUD worker)
- ❌ CURSOR_API_KEY (local dev only)
- ❌ GH_ECOSYSTEM_TOKEN (not needed for CI/CD)
- ❌ MEAUXMCP keys (MCP-specific, not for worker)
- ❌ ANTHROPOTHIC_MCP_KEY (MCP-specific)
- ❌ REALTIME_BROADCASTER_TOKEN (not in worker.js)
- ❌ Google Vertex token (not in worker.js)
- ❌ All the other project-specific keys (hybridsaas, meauxbility.org, etc.)

---

## 📋 Quick Setup Checklist

### Minimum Required (5 secrets):
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET` (need to get this)
- [ ] `GOOGLE_API_KEY`

### Recommended (3 more):
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_WEBHOOK_SECRET`
- [ ] `SUPABASE_URL` (if using Supabase)

### Optional (add as you need features):
- [ ] `SFU_APP_ID` (for video)
- [ ] `SFU_API_TOKEN`
- [ ] `TURN_TOKEN_ID`
- [ ] `TURN_API_TOKEN`
- [ ] `MESHYAI_API_KEY`
- [ ] `CLOUDCONVERT_API_KEY`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`

---

## 🔒 Security Notes

1. **Never commit secrets** - They're only in GitHub Actions secrets
2. **Worker secrets are separate** - These are for GitHub Actions CI/CD
3. **Rotate regularly** - Update tokens every 90 days
4. **Use least privilege** - Only add secrets you actually use

---

## ✅ After Adding Secrets

1. Push to `main` branch
2. Check Actions tab: https://github.com/ceosamprimeaux/meauxCLOUD/actions
3. Verify deployment succeeds
4. Test your app!

