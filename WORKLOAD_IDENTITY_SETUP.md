# 🔐 Alternative: Workload Identity Federation Setup

## Why This Approach is Better

Your GCP organization has `constraints/iam.disableServiceAccountKeyCreation` enabled, which is a **security best practice**. Service account keys are:
- ❌ Long-lived credentials (security risk)
- ❌ Can be leaked/stolen
- ❌ Require manual rotation

**Workload Identity Federation** is:
- ✅ Keyless authentication
- ✅ Short-lived tokens
- ✅ No secrets to manage
- ✅ Google's recommended approach

---

## Option 1: Use Existing Google OAuth (Recommended for Now)

Since you're already using Google OAuth for login, we can leverage that:

### How It Works:
1. User logs in with Google OAuth
2. We get their OAuth token
3. Use that token to call GCP APIs on their behalf
4. No service account keys needed!

### Implementation:

```typescript
// In your auth callback, store the Google OAuth token
app.get('/api/auth/google/callback', async (c) => {
  // ... existing OAuth flow ...
  
  // Store the access token in session
  await c.env.DB.prepare(`
    INSERT INTO session_gcp_tokens (session_id, access_token, refresh_token, expires_at, scopes)
    VALUES (?, ?, ?, datetime('now', '+1 hour'), ?)
  `).bind(
    sessionId,
    tokenData.access_token,
    tokenData.refresh_token,
    'https://www.googleapis.com/auth/cloud-platform'
  ).run();
});
```

### Pros:
- ✅ Works immediately
- ✅ No additional setup
- ✅ User-scoped permissions

### Cons:
- ⚠️ Limited to user's GCP permissions
- ⚠️ Requires user to grant cloud-platform scope

---

## Option 2: Workload Identity Federation (Production-Ready)

This is the **proper** way to authenticate Cloudflare Workers to GCP without keys.

### Setup Steps:

#### 1. Create Workload Identity Pool

```bash
gcloud iam workload-identity-pools create cloudflare-pool \
  --location="global" \
  --display-name="Cloudflare Workers" \
  --description="Identity pool for Cloudflare Workers" \
  --project=meauxcloud
```

#### 2. Create Workload Identity Provider

```bash
gcloud iam workload-identity-pools providers create-oidc cloudflare-provider \
  --location="global" \
  --workload-identity-pool="cloudflare-pool" \
  --issuer-uri="https://cloudflare.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.account_id=assertion.account_id" \
  --project=meauxcloud
```

#### 3. Grant Service Account Access

```bash
gcloud iam service-accounts add-iam-policy-binding \
  cloudflare-worker@meauxcloud.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/365932368784/locations/global/workloadIdentityPools/cloudflare-pool/*"
```

#### 4. Get Credentials in Worker

```typescript
// Exchange Cloudflare identity for GCP token
const response = await fetch(
  'https://sts.googleapis.com/v1/token',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grantType: 'urn:ietf:params:oauth:grant-type:token-exchange',
      audience: '//iam.googleapis.com/projects/365932368784/locations/global/workloadIdentityPools/cloudflare-pool/providers/cloudflare-provider',
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token',
      subjectToken: cloudflareToken,
      subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt'
    })
  }
);
```

---

## Option 3: Request Policy Exception (Not Recommended)

You could ask your org admin to create an exception, but this defeats the security purpose.

```bash
# Don't do this unless absolutely necessary
gcloud resource-manager org-policies delete \
  constraints/iam.disableServiceAccountKeyCreation \
  --project=meauxcloud
```

---

## 🎯 Recommended Path Forward

### For Immediate Use:
**Use Google OAuth tokens** from your existing login flow. This works NOW and is secure.

### For Production:
**Set up Workload Identity Federation** for keyless, automated access.

---

## Quick Fix: Use Your Personal OAuth Token

Since you're the owner and already login with Google:

1. Login to MeauxCLOUD
2. Your Google OAuth token is stored in session
3. That token has Owner permissions on the project
4. Use it to call GCP APIs!

### Test It:

```bash
# After logging in, check your session
curl https://meauxcloud.org/api/superadmin/status \
  -H "Cookie: session_id=YOUR_SESSION"

# The middleware will use YOUR Google OAuth token for GCP calls
```

---

## Summary

| Method | Setup Time | Security | Maintenance |
|--------|-----------|----------|-------------|
| **Google OAuth** | ✅ Immediate | ✅ Good | ✅ None |
| **Workload Identity** | ⏱️ 1 hour | ✅✅ Excellent | ✅ None |
| **Service Account Keys** | ❌ Blocked | ⚠️ Risky | ❌ Manual rotation |

**My Recommendation:** Use Google OAuth tokens for now (already working!), then migrate to Workload Identity Federation for production.

---

## Need Help?

The superadmin middleware I built already supports using OAuth tokens! Just make sure when users login with Google, we request the `cloud-platform` scope.

Want me to update the OAuth flow to request GCP scopes?
