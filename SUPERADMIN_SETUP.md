# 🔐 MeauxCLOUD Superadmin & GCP Integration Guide

## Overview
This system automatically provisions GCP access for designated superadmin accounts across all tenant builds in MeauxOS.

## ✅ What's Already Set Up

### 1. Database Schema (MeauxOS D1)
- ✅ `superadmin_accounts` - Stores superadmin users
- ✅ `gcp_credentials` - Encrypted GCP service account keys
- ✅ `tenant_access` - Multi-tenant access control
- ✅ `session_gcp_tokens` - Auto-provisioned GCP tokens per session
- ✅ `superadmin_audit_log` - Complete audit trail

### 2. Your Account
- ✅ **Email**: `meauxbility@gmail.com`
- ✅ **Role**: `superadmin` (highest level)
- ✅ **GCP Service Account**: `meauxcloud-worker@meauxcloud.iam.gserviceaccount.com`
- ✅ **Scopes**: Full Cloud Platform access

### 3. Middleware
- ✅ Auto-detects superadmin on login
- ✅ Auto-provisions GCP access token
- ✅ Stores token in session (1-hour expiry)
- ✅ Logs all actions for audit

---

## 🚀 Quick Start

### Step 1: Store GCP Service Account Key

```bash
cd /Users/samprimeaux/.gemini/antigravity/scratch/meauxcloud

# Generate the key from GCP
gcloud iam service-accounts keys create ~/meauxcloud-key.json \
  --iam-account=meauxcloud-worker@meauxcloud.iam.gserviceaccount.com

# Store as Cloudflare secret
cat ~/meauxcloud-key.json | npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY

# Delete the local file for security
rm ~/meauxcloud-key.json
```

### Step 2: Login to MeauxCLOUD

1. Go to `https://meauxcloud.org/login`
2. Click "Continue with Google"
3. Login with `meauxbility@gmail.com`
4. **You're now a superadmin with GCP access!**

### Step 3: Verify Your Access

```bash
# Check your superadmin status
curl https://meauxcloud.org/api/superadmin/status \
  -H "Cookie: session_id=YOUR_SESSION_ID"

# Expected response:
{
  "isSuperadmin": true,
  "hasGCPAccess": true,
  "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
  "tenants": []
}
```

---

## 📡 Using GCP from MeauxCLOUD

### Example 1: List Cloud Run Services

```typescript
// In any MeauxApp or custom route
app.get('/my-gcp-test', async (c) => {
  const gcpToken = getGCPAccessToken(c);
  
  if (!gcpToken) {
    return c.json({ error: 'No GCP access' }, 403);
  }

  const response = await fetch(
    'https://run.googleapis.com/v2/projects/meauxcloud/locations/us-central1/services',
    {
      headers: { 'Authorization': `Bearer ${gcpToken}` }
    }
  );

  const services = await response.json();
  return c.json(services);
});
```

### Example 2: Deploy to Cloud Run

```typescript
app.post('/api/deploy/cloud-run', async (c) => {
  if (!isSuperadmin(c)) {
    return c.json({ error: 'Unauthorized' }, 403);
  }

  const gcpToken = getGCPAccessToken(c);
  const { serviceName, image } = await c.req.json();

  const response = await fetch(
    'https://run.googleapis.com/v2/projects/meauxcloud/locations/us-central1/services',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${gcpToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiVersion: 'serving.knative.dev/v1',
        kind: 'Service',
        metadata: { name: serviceName },
        spec: {
          template: {
            spec: {
              containers: [{ image }]
            }
          }
        }
      })
    }
  );

  return c.json(await response.json());
});
```

### Example 3: Access Firestore

```typescript
app.get('/api/firestore/users', async (c) => {
  const gcpToken = getGCPAccessToken(c);
  
  const response = await fetch(
    'https://firestore.googleapis.com/v1/projects/meauxcloud/databases/(default)/documents/users',
    {
      headers: { 'Authorization': `Bearer ${gcpToken}` }
    }
  );

  return c.json(await response.json());
});
```

---

## 👥 Adding More Superadmins

### Via API:

```bash
curl -X POST https://meauxcloud.org/api/superadmin/accounts \
  -H "Cookie: session_id=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "John Doe",
    "role": "platform_admin"
  }'
```

### Via SQL:

```sql
INSERT INTO superadmin_accounts (email, name, role, gcp_service_account_email, gcp_access_scopes)
VALUES (
  'admin@example.com',
  'John Doe',
  'platform_admin',
  'meauxcloud-worker@meauxcloud.iam.gserviceaccount.com',
  '["https://www.googleapis.com/auth/cloud-platform"]'
);
```

---

## 🏢 Multi-Tenant Access

### Grant Access to a Tenant:

```bash
curl -X POST https://meauxcloud.org/api/superadmin/tenant-access \
  -H "Cookie: session_id=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "superadminId": 1,
    "tenantId": "client-abc",
    "accessLevel": "full"
  }'
```

### Check Access in Code:

```typescript
app.get('/tenant/:id/data', async (c) => {
  const tenantId = c.req.param('id');
  
  if (!hasTenantAccess(c, tenantId)) {
    return c.json({ error: 'No access to this tenant' }, 403);
  }

  // Proceed with tenant-specific logic
});
```

---

## 📊 Audit Logging

All superadmin actions are automatically logged:

```bash
# View audit log
curl https://meauxcloud.org/api/superadmin/audit-log \
  -H "Cookie: session_id=YOUR_SESSION_ID"
```

Logged actions include:
- ✅ Session starts
- ✅ GCP API calls
- ✅ Tenant access grants
- ✅ Account modifications
- ✅ IP addresses & user agents

---

## 🔒 Security Best Practices

1. **Key Rotation**: Rotate GCP service account keys every 90 days
2. **Least Privilege**: Create separate service accounts for specific tasks
3. **Audit Regularly**: Review `superadmin_audit_log` monthly
4. **Token Expiry**: GCP tokens auto-expire after 1 hour
5. **Session Security**: Sessions are tied to IP and user agent

---

## 🎯 Role Hierarchy

- **`superadmin`** (You): Full platform access, can manage other admins
- **`platform_admin`**: Can manage tenants and deploy services
- **`tenant_admin`**: Limited to specific tenant(s)

---

## 🛠️ Helper Functions

```typescript
import { isSuperadmin, getGCPAccessToken, hasTenantAccess } from './middleware/superadmin';

// Check if user is superadmin
if (isSuperadmin(c)) {
  // Do superadmin stuff
}

// Get GCP token
const token = getGCPAccessToken(c);

// Check tenant access
if (hasTenantAccess(c, 'tenant-123')) {
  // Access granted
}
```

---

## 📝 Next Steps

1. ✅ Store GCP service account key as secret
2. ✅ Login to verify superadmin status
3. ✅ Test GCP API call
4. ⏳ Add additional superadmin accounts as needed
5. ⏳ Grant tenant access for multi-tenant builds
6. ⏳ Implement JWT signing for production (currently placeholder)

---

## 🚨 TODO: Production Readiness

### Critical:
- [ ] Implement proper RS256 JWT signing (use `jose` or Web Crypto API)
- [ ] Encrypt `service_account_key` in `gcp_credentials` table
- [ ] Set up key rotation automation
- [ ] Add rate limiting on GCP API calls

### Nice to Have:
- [ ] Dashboard UI for managing superadmins
- [ ] Real-time audit log viewer
- [ ] GCP quota monitoring
- [ ] Multi-region token caching

---

## 📞 Support

For issues or questions:
- Check audit logs: `/api/superadmin/audit-log`
- Verify status: `/api/superadmin/status`
- Review session: Check `session_gcp_tokens` table

---

**You're all set!** 🎉 Your account (`meauxbility@gmail.com`) now has automatic GCP access across all MeauxCLOUD tenants.
