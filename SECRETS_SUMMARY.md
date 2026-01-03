# 🔐 Secrets Summary - What Goes Where

## ✅ For GitHub Actions (CI/CD Deployment)

**Location**: https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions

### Minimum Required (5):
```
CLOUDFLARE_ACCOUNT_ID=ede6590ac0d2fb7daf155b35653457b2
CLOUDFLARE_API_TOKEN=hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA
GOOGLE_CLIENT_ID=365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<Get from Google Cloud Console>
GOOGLE_API_KEY=AIzaSyBs5S9tnSIYCMbqp4xaqsnvDBAUGw2ubyk
```

### Recommended (3):
```
RESEND_API_KEY=re_Dkh3uDgE_8j9HKZBHcfFytGWQpSuE8Jtb
RESEND_WEBHOOK_SECRET=whsec_S3L3dbw9ttxraxfd6/Hrzi636WPfY429
SUPABASE_URL=https://nkeavhmqvudknofavuid.supabase.co
```

### Optional (add as needed):
```
SUPABASE_ANON_KEY=sb_publishable_I8YNzmXs2_cT8IkUfjTrng_cJ5HfYQt
SUPABASE_SERVICE_ROLE_KEY=sb_secret_dCkmJkZ-6-Jng0ChaodPpg_zJ495Lu3
MESHYAI_API_KEY=msy_CwgKmtLEhYOFrBe7fV0P7B1v2bISUG0PhcwC
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
```

---

## ✅ Already in Cloudflare Worker (28 secrets)

Your Worker already has all these - **no action needed**:
- All Cloudflare keys
- All Google keys
- All Resend keys
- All Supabase keys
- All SFU/TURN keys
- All third-party API keys

---

## ❌ NOT Needed for MeauxCLOUD (Other Projects)

These are for other projects - **don't add to GitHub Actions**:
- AWS keys (hybridsaas, meauxbility.org)
- CURSOR_API_KEY (local dev only)
- MEAUXMCP keys (MCP-specific)
- ANTHROPOTHIC_MCP_KEY (MCP-specific)
- REALTIME_BROADCASTER_TOKEN (not in worker)
- Google Vertex token (not in worker)
- All the D1 database IDs (in wrangler.toml)
- All the R2 bucket names (in wrangler.toml)
- Worker URLs (not secrets)

---

## 🎯 Quick Action Items

1. **Add to GitHub Actions** (5 minutes):
   - Go to: https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions
   - Add the 5 minimum required secrets above
   - Get `GOOGLE_CLIENT_SECRET` from: https://console.cloud.google.com/apis/credentials

2. **Verify Cloudflare Worker** (already done ✅):
   - Your Worker has all 28 secrets already
   - No action needed

3. **Test Deployment**:
   - Push to main
   - Check Actions tab
   - Verify deployment succeeds

---

## 📋 Full Details

See `GITHUB_ACTIONS_SECRETS.md` for complete setup instructions.

