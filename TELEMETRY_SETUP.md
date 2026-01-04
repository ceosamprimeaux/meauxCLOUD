# 📊 Telemetry Setup for MeauxCLOUD

## Endpoint Configuration

### MeauxCLOUD.org Telemetry
- **Endpoint:** `POST https://meauxcloud.org/api/telemetry/otlp/v1/logs`
- **Health Check:** `GET https://meauxcloud.org/api/telemetry/health`
- **Service Name:** `meauxcloud-central-analytics`
- **Database Table:** `meauxcloud_telemetry_logs`

### Meauxbility.org Telemetry (Separate)
- **Endpoint:** `POST https://meauxbility.org/api/telemetry/otlp/v1/logs`
- **Service Name:** `meauxbility-central-analytics`
- **Database Table:** `telemetry_logs` (different table)

## Setup in Cloudflare Dashboard

### For MeauxCLOUD Worker

1. Go to **Workers & Pages** → **meauxcloud**
2. Click **Observability** tab
3. Click **Configure Observability Destinations**
4. Add new destination:
   - **Name:** `meauxcloud-central-analytics`
   - **Type:** Custom Endpoint
   - **URL:** `https://meauxcloud.org/api/telemetry/otlp/v1/logs`
   - **Method:** POST
   - **Headers:** 
     - `Content-Type: application/json`

## Testing

### Health Check
```bash
curl https://meauxcloud.org/api/telemetry/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "meauxcloud-central-analytics",
  "domain": "meauxcloud.org",
  "timestamp": "2026-01-04T..."
}
```

### Test Telemetry Endpoint
```bash
curl -X POST https://meauxcloud.org/api/telemetry/otlp/v1/logs \
  -H "Content-Type: application/json" \
  -d '{
    "resourceLogs": [{
      "resource": {
        "attributes": [{"key": "service.name", "value": "meauxcloud"}]
      },
      "scopeLogs": []
    }]
  }'
```

## Database Schema

The telemetry logs are stored in D1:

```sql
CREATE TABLE meauxcloud_telemetry_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_attributes TEXT,
    scope_logs TEXT,
    service TEXT DEFAULT 'meauxcloud',
    received_at INTEGER DEFAULT (unixepoch())
);
```

## Querying Telemetry Data

```sql
-- Get recent telemetry logs
SELECT * FROM meauxcloud_telemetry_logs 
ORDER BY received_at DESC 
LIMIT 100;

-- Count logs by service
SELECT service, COUNT(*) as count 
FROM meauxcloud_telemetry_logs 
GROUP BY service;
```

## Differences from Meauxbility

| Feature | MeauxCLOUD | Meauxbility |
|----------|-----------|-------------|
| **Domain** | meauxcloud.org | meauxbility.org |
| **Service Name** | meauxcloud-central-analytics | meauxbility-central-analytics |
| **Database Table** | meauxcloud_telemetry_logs | telemetry_logs |
| **Endpoint** | /api/telemetry/otlp/v1/logs | /api/telemetry/otlp/v1/logs |

Both use the same endpoint path but are on different domains and store data in separate tables.

---

**Last Updated:** January 4, 2026

