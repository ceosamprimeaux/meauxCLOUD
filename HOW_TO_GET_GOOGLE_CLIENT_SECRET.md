# 🔑 How to Get GOOGLE_CLIENT_SECRET

## ⚠️ Important: This is NOT the Vertex AI API Key

The Vertex AI API key you're looking at (`AQ.Ab8RN6I-...`) is different from the OAuth Client Secret we need.

---

## 📍 Where to Find GOOGLE_CLIENT_SECRET

### Step 1: Go to OAuth Credentials (Not Vertex AI)

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Look for**: "OAuth 2.0 Client IDs" section (NOT "API Keys")
3. **Find your OAuth client**: Look for one with Client ID: `365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu`
4. **Click on it** to view details

### Step 2: Get the Client Secret

1. In the OAuth client details page, you'll see:
   - **Client ID**: `365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu`
   - **Client secret**: (Click "Show" or "Reveal" to see it)
2. **Copy the Client Secret** (it looks like: `GOCSPX-...`)

### Step 3: Add to GitHub Secrets

**Via GitHub UI**:
- Go to: https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions
- Click "New repository secret"
- Name: `GOOGLE_CLIENT_SECRET`
- Value: (paste the OAuth client secret)

**Via CLI**:
```bash
gh secret set GOOGLE_CLIENT_SECRET --repo ceosamprimeaux/meauxCLOUD
# Paste the OAuth client secret when prompted
```

---

## 🔍 What's the Difference?

### Vertex AI API Key (What you're looking at)
- **Purpose**: Direct API access to Vertex AI/Gemini
- **Format**: `AQ.Ab8RN6I-...`
- **Location**: Vertex AI > Settings > API Keys
- **Use**: For direct API calls to Gemini

### OAuth Client Secret (What we need)
- **Purpose**: User authentication (Google Sign-In)
- **Format**: `GOCSPX-...` (usually)
- **Location**: APIs & Services > Credentials > OAuth 2.0 Client IDs
- **Use**: For OAuth flow (user login)

---

## 💡 Optional: Add Vertex AI Key Too

If you want to use that Vertex AI API key, we can add it as a separate secret:

```bash
gh secret set GOOGLE_VERTEX_API_KEY --repo ceosamprimeaux/meauxCLOUD
# Value: AQ.Ab8RN6I-IFmkYFGg5flgXe8fp1E90BG-qj1luXodEJfiMbEY3w
```

But this is **optional** - the main thing we need is the OAuth Client Secret.

---

## ✅ Quick Checklist

- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Find "OAuth 2.0 Client IDs" section
- [ ] Find client with ID: `365932368784-h35rgbm0aqimihjbqqaj1jitpif1cnfu`
- [ ] Click on it
- [ ] Click "Show" to reveal Client Secret
- [ ] Copy the Client Secret
- [ ] Add to GitHub Actions secrets as `GOOGLE_CLIENT_SECRET`

---

## 🆘 If You Can't Find It

If the OAuth client doesn't exist or you can't find it:

1. **Create a new OAuth client**:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "+ Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "MeauxCLOUD Web Client"
   - Authorized redirect URIs: `https://meauxcloud.org/api/auth/google/callback`
   - Click "Create"
   - Copy both Client ID and Client Secret

2. **Update GOOGLE_CLIENT_ID** in GitHub secrets if you create a new one

