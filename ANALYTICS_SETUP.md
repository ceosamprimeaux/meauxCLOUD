# 📊 Analytics Setup Guide

## Overview

MeauxCLOUD now includes comprehensive analytics to track:
- **GitHub Actions** usage (free tier: 2,000 minutes/month)
- **Cloudflare** usage (Workers, R2, D1, Pages)
- **Cost tracking** and estimates
- **Real-time alerts** when approaching limits

## API Endpoints

### Analytics Endpoints

1. **Overview** - Combined analytics
   ```
   GET /api/analytics/overview
   ```

2. **Cloudflare Usage**
   ```
   GET /api/analytics/cloudflare
   ```

3. **GitHub Actions Usage**
   ```
   GET /api/analytics/github
   ```

4. **Cost Breakdown**
   ```
   GET /api/analytics/costs
   ```

### Sync Endpoints

1. **Sync Status**
   ```
   GET /api/sync/status
   ```

2. **GitHub Events**
   ```
   GET /api/sync/events
   ```

3. **Webhook Handler**
   ```
   POST /api/sync/webhook
   ```

## GitHub Actions Monitoring

### Free Tier Limits
- **2,000 minutes/month** for private repos
- **500 minutes/month** for free accounts
- Self-hosted runners: **Unlimited** ✅

### Usage Tracking
The analytics endpoint tracks:
- Total workflow runs
- Success/failure rates
- Minutes used
- Remaining minutes
- Status alerts (ok/caution/warning)

### Example Response
```json
{
  "success": true,
  "github": {
    "repository": "ceosamprimeaux/meauxCLOUD",
    "stats": {
      "total": 45,
      "success": 42,
      "failure": 3
    },
    "usage": {
      "minutes": 1250,
      "freeMinutes": 2000,
      "usedPercentage": 62.5,
      "remaining": 750,
      "status": "ok"
    }
  }
}
```

## Cloudflare Usage Monitoring

### Tracked Resources
- Workers (count)
- R2 Buckets (count)
- D1 Databases (count)
- Pages Projects (count)

### Cost Estimates
Based on free tier limits:
- Workers: 100k requests/day free
- R2: 10 GB storage free
- D1: 5M reads, 100k writes free
- Pages: 500 builds/month free

## Cost Tracking

### Database Table
```sql
CREATE TABLE cost_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT,
    amount REAL,
    details TEXT,
    month TEXT,
    date INTEGER DEFAULT (unixepoch())
);
```

### Manual Cost Entry
```bash
POST /api/analytics/costs/track
{
  "service": "cloudflare",
  "amount": 0.00,
  "details": {"workers": 1000, "r2": "1GB"}
}
```

## Dashboard Integration

### Add to Dashboard HTML

```javascript
// Fetch analytics
async function loadAnalytics() {
    const response = await fetch('/api/analytics/overview');
    const data = await response.json();
    
    // Display in UI
    document.getElementById('github-usage').textContent = 
        `${data.github.usage.usedPercentage}% used`;
    
    document.getElementById('cloudflare-workers').textContent = 
        `${data.cloudflare.workers.total} workers`;
}
```

## Alerts

### Automatic Alerts
- **Warning**: GitHub Actions > 90% used
- **Caution**: GitHub Actions > 75% used
- **Info**: Normal usage

### Alert Response
```json
{
  "alerts": [
    {
      "type": "warning",
      "message": "GitHub Actions usage is above 90%",
      "action": "Consider optimizing workflows"
    }
  ]
}
```

## GitHub Webhook Setup

1. Go to GitHub repo → Settings → Webhooks
2. Add webhook:
   - **URL**: `https://meauxcloud.org/api/sync/webhook`
   - **Content type**: `application/json`
   - **Events**: Select "Workflow runs", "Deployments"
3. Save webhook secret to Cloudflare Worker secret:
   ```bash
   wrangler secret put GITHUB_WEBHOOK_SECRET
   ```

## Self-Hosted Runners

Since you're using self-hosted runners:
- ✅ **Unlimited minutes** (no GitHub Actions minutes used)
- ✅ **Faster builds** (your infrastructure)
- ✅ **More control** (custom environments)

The analytics still track workflow runs for monitoring purposes.

## Next Steps

1. ✅ Deploy updated worker with analytics endpoints
2. ✅ Add analytics UI to dashboard
3. ✅ Set up GitHub webhook
4. ✅ Monitor usage daily
5. ✅ Set up alerts for cost thresholds

---

**Last Updated:** January 4, 2026

