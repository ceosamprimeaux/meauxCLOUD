# 🔐 Secrets Quick Reference

## All Required Secrets (Copy-Paste Ready)

Use this list when setting up secrets in GitHub and Cloudflare Worker.

---

## 🌩️ Cloudflare (3 secrets)

```
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
AI_GATEWAY_TOKEN
```

---

## 🎥 Video/Streaming (4 secrets)

```
SFU_APP_ID
SFU_API_TOKEN
TURN_TOKEN_ID
TURN_API_TOKEN
```

---

## 🔐 Google OAuth & API (3 secrets)

```
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_API_KEY
```

---

## 📧 Email (2 secrets)

```
RESEND_API_KEY
RESEND_WEBHOOK_SECRET
```

---

## 🎨 AI & Conversion (2 secrets)

```
MESHYAI_API_KEY
CLOUDCONVERT_API_KEY
```

---

## 🗄️ Database (3 secrets)

```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## 🐙 GitHub (1 secret)

```
GITHUB_MARKETPLACE_WEBHOOK_SECRET
```

---

## 📱 SMS - Optional (3 secrets)

```
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
```

---

## 📊 Summary

- **Total Required**: 18 secrets
- **Optional**: 3 secrets (Twilio)
- **Total**: 21 secrets

---

## 🚀 Where to Add

### GitHub Actions Secrets
1. Go to: `https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret from the list above

### Cloudflare Worker Secrets
1. Go to: [Cloudflare Dashboard → Workers → meauxcloud → Settings → Variables](https://dash.cloudflare.com/?to=/:account/workers/services/view/meauxcloud/settings/variables)
2. Click "Add variable" for each secret
3. Use same names as above

---

## ✅ Verification

After adding secrets, verify:

```bash
# Check GitHub Actions can access secrets
# (secrets are only available in Actions, not locally)

# For Cloudflare Worker, test an API endpoint:
curl https://meauxcloud.org/api/dashboard/stats
```

---

## 📖 Full Setup Instructions

See `GITHUB_SECRETS_SETUP.md` for detailed setup instructions for each secret.

