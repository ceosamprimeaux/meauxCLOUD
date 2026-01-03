# ⚡ FAST Setup - No Wasted Time

## Option 1: Interactive Script (Fastest)

```bash
node scripts/quick_secrets_setup.js
```

This will:
- ✅ Only ask for what you need
- ✅ Skip optional services
- ✅ Give you direct links to get each key
- ✅ Generate commands to set everything

---

## Option 2: Bulk Import (If you have keys already)

If you already have keys somewhere (old .env, notes, etc.):

1. **Create `.secrets-local.json`** (don't commit this!):
```json
{
  "CLOUDFLARE_API_TOKEN": "your-token",
  "GOOGLE_CLIENT_ID": "your-id",
  ...
}
```

2. **Run bulk set script**:
```bash
node scripts/bulk_set_secrets.js
```

---

## Option 3: Minimal Setup (Get Started Fast)

**Only set these 5 to get started:**

1. `CLOUDFLARE_API_TOKEN` - [Get it here](https://dash.cloudflare.com/profile/api-tokens)
2. `CLOUDFLARE_ACCOUNT_ID` - Already known: `ede6590ac0d2fb7daf155b35653457b2`
3. `GOOGLE_CLIENT_ID` - [Get it here](https://console.cloud.google.com/apis/credentials)
4. `GOOGLE_CLIENT_SECRET` - Same page as above
5. `GOOGLE_API_KEY` - [Get it here](https://console.cloud.google.com/apis/credentials)

**Set in Cloudflare Worker:**
```bash
npx wrangler secret put CLOUDFLARE_API_TOKEN
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GOOGLE_API_KEY
```

**Set in GitHub Actions:**
- Go to: https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions
- Add the same 4 secrets

**Everything else can wait** - add as you need features!

---

## Option 4: Copy from Existing Worker

If you already have secrets in Cloudflare Worker:

```bash
# List what you have
npx wrangler secret list

# Then just add missing ones
npx wrangler secret put MISSING_SECRET
```

---

## 🎯 What You Actually Need RIGHT NOW

Based on your dashboard working, you probably already have:
- ✅ D1 Database (configured in wrangler.toml)
- ✅ R2 Storage (configured in wrangler.toml)
- ✅ Basic routing

**To make APIs work, you only need:**
1. Cloudflare API Token (for deployments)
2. Google OAuth (if using login)

**Everything else is feature-specific** - add when you need that feature!

---

## 💡 Pro Tip

**Don't collect everything at once!**

1. Set the 4-5 essentials above
2. Deploy and test
3. Add secrets as you add features:
   - Need video? → Add SFU secrets
   - Need email? → Add Resend
   - Need 3D? → Add MeshyAI
   - etc.

This way you're not wasting time on keys for features you're not using yet!

