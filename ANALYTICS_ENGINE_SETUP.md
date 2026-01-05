# 📊 Analytics Engine Setup - MeauxCLOUD Ecosystem

## 🎯 Overview

**Analytics Engine** provides real-time, high-performance analytics for your entire ecosystem. This will track:
- Worker requests across all projects
- API endpoint performance
- User interactions
- Cost metrics
- Resource usage
- Error rates
- Custom business metrics

---

## ✅ Configuration Added

### **wrangler.toml**
```toml
[[analytics_engine_datasets]]
binding = "ANALYTICS_ENGINE"
dataset = "meauxcloud_analytics"
```

This binding is now available in your Worker as `env.ANALYTICS_ENGINE`.

---

## 🚀 How to Use Analytics Engine

### **1. Basic Event Tracking**

```typescript
// Track a simple event
await env.ANALYTICS_ENGINE.writeDataPoint({
  blobs: ['user-login', 'google-oauth'],
  doubles: [1], // count
  indexes: ['user-123']
});
```

### **2. Request Tracking**

```typescript
// Track every request
export async function trackRequest(
  env: Env,
  request: Request,
  response: Response,
  duration: number
) {
  await env.ANALYTICS_ENGINE.writeDataPoint({
    blobs: [
      request.method,           // GET, POST, etc.
      new URL(request.url).pathname,
      response.status.toString()
    ],
    doubles: [
      duration,                 // Response time in ms
      1                         // Request count
    ],
    indexes: [
      request.headers.get('cf-ray') || 'unknown'
    ]
  });
}
```

### **3. Cost Tracking**

```typescript
// Track costs per project
export async function trackProjectCost(
  env: Env,
  projectId: string,
  costType: 'time' | 'ai' | 'compute',
  amount: number
) {
  await env.ANALYTICS_ENGINE.writeDataPoint({
    blobs: [
      projectId,
      costType,
      'cost'
    ],
    doubles: [
      amount,                   // Cost in USD
      1                         // Event count
    ],
    indexes: [
      projectId
    ]
  });
}
```

### **4. AI Usage Tracking**

```typescript
// Track AI model usage
export async function trackAIUsage(
  env: Env,
  model: string,
  tokens: number,
  cost: number
) {
  await env.ANALYTICS_ENGINE.writeDataPoint({
    blobs: [
      'ai-usage',
      model,
      'tokens'
    ],
    doubles: [
      tokens,
      cost,
      1
    ],
    indexes: [
      model
    ]
  });
}
```

### **5. Error Tracking**

```typescript
// Track errors
export async function trackError(
  env: Env,
  errorType: string,
  errorMessage: string,
  path: string
) {
  await env.ANALYTICS_ENGINE.writeDataPoint({
    blobs: [
      'error',
      errorType,
      path
    ],
    doubles: [1],
    indexes: [errorType]
  });
}
```

---

## 🏗️ Implementation in Worker

### **Main Worker with Analytics Middleware**

```typescript
// src/index.ts
import { Hono } from 'hono';
import { analyticsMiddleware } from './middleware/analytics';

type Bindings = {
  DB: D1Database;
  R2_ASSETS: R2Bucket;
  ANALYTICS_ENGINE: AnalyticsEngineDataset;
  AI: any;
  CHAT_ROOM: DurableObjectNamespace;
  HYPERDRIVE: Hyperdrive;
};

const app = new Hono<{ Bindings: Bindings }>();

// Apply analytics middleware to all routes
app.use('*', analyticsMiddleware);

// Your routes
app.get('/', (c) => c.text('MeauxCLOUD'));

export default app;
```

### **Analytics Middleware**

```typescript
// src/middleware/analytics.ts
import { Context, Next } from 'hono';

export async function analyticsMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const request = c.req.raw;
  
  // Process request
  await next();
  
  const duration = Date.now() - start;
  const response = c.res;
  
  // Track to Analytics Engine
  try {
    await c.env.ANALYTICS_ENGINE.writeDataPoint({
      blobs: [
        request.method,
        new URL(request.url).pathname,
        response.status.toString(),
        c.env.ENVIRONMENT || 'production'
      ],
      doubles: [
        duration,                           // Response time (ms)
        1,                                  // Request count
        response.headers.get('content-length') 
          ? parseInt(response.headers.get('content-length')!) 
          : 0                               // Response size (bytes)
      ],
      indexes: [
        request.headers.get('cf-ray') || 'unknown',
        request.headers.get('user-agent')?.substring(0, 100) || 'unknown'
      ]
    });
  } catch (error) {
    // Don't fail the request if analytics fails
    console.error('Analytics tracking failed:', error);
  }
}
```

---

## 📊 Querying Analytics Data

### **Using GraphQL API**

```typescript
// src/lib/analytics-query.ts

export async function queryAnalytics(
  accountId: string,
  apiToken: string,
  query: string
) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    }
  );
  
  return await response.json();
}

// Example: Get request count by path (last 24 hours)
export async function getRequestsByPath(accountId: string, apiToken: string) {
  const query = `
    SELECT
      blob2 as path,
      SUM(double2) as request_count,
      AVG(double1) as avg_duration_ms
    FROM meauxcloud_analytics
    WHERE timestamp > NOW() - INTERVAL '24' HOUR
      AND blob1 = 'GET'
    GROUP BY path
    ORDER BY request_count DESC
    LIMIT 10
  `;
  
  return await queryAnalytics(accountId, apiToken, query);
}

// Example: Get cost by project (last 7 days)
export async function getCostByProject(accountId: string, apiToken: string) {
  const query = `
    SELECT
      blob1 as project_id,
      blob2 as cost_type,
      SUM(double1) as total_cost
    FROM meauxcloud_analytics
    WHERE timestamp > NOW() - INTERVAL '7' DAY
      AND blob3 = 'cost'
    GROUP BY project_id, cost_type
    ORDER BY total_cost DESC
  `;
  
  return await queryAnalytics(accountId, apiToken, query);
}

// Example: Get error rate (last hour)
export async function getErrorRate(accountId: string, apiToken: string) {
  const query = `
    SELECT
      blob2 as error_type,
      COUNT(*) as error_count
    FROM meauxcloud_analytics
    WHERE timestamp > NOW() - INTERVAL '1' HOUR
      AND blob1 = 'error'
    GROUP BY error_type
    ORDER BY error_count DESC
  `;
  
  return await queryAnalytics(accountId, apiToken, query);
}
```

---

## 🎯 Analytics Schema Design

### **Event Types**

| blob1 | blob2 | blob3 | double1 | double2 | double3 | index1 | index2 |
|-------|-------|-------|---------|---------|---------|--------|--------|
| **Request Tracking** |
| method | path | status | duration_ms | count | size_bytes | cf-ray | user-agent |
| **Cost Tracking** |
| project_id | cost_type | 'cost' | amount_usd | count | - | project_id | - |
| **AI Usage** |
| 'ai-usage' | model | 'tokens' | tokens | cost | count | model | - |
| **Error Tracking** |
| 'error' | error_type | path | count | - | - | error_type | - |
| **User Events** |
| 'user-event' | event_type | user_id | count | - | - | user_id | - |
| **Resource Usage** |
| 'resource' | resource_type | project_id | usage | count | - | project_id | - |

---

## 📈 Dashboard Integration

### **Real-time Analytics API Endpoint**

```typescript
// src/routes/analytics.ts
import { Hono } from 'hono';

const analytics = new Hono();

// Get real-time metrics
analytics.get('/metrics/realtime', async (c) => {
  const { accountId, apiToken } = c.env;
  
  // Last 5 minutes of data
  const query = `
    SELECT
      COUNT(*) as total_requests,
      AVG(double1) as avg_response_time,
      SUM(CASE WHEN blob3 LIKE '5%' THEN 1 ELSE 0 END) as error_count
    FROM meauxcloud_analytics
    WHERE timestamp > NOW() - INTERVAL '5' MINUTE
  `;
  
  const result = await queryAnalytics(accountId, apiToken, query);
  
  return c.json(result);
});

// Get cost trends
analytics.get('/metrics/costs', async (c) => {
  const { accountId, apiToken } = c.env;
  
  const query = `
    SELECT
      DATE_TRUNC('day', timestamp) as date,
      blob2 as cost_type,
      SUM(double1) as total_cost
    FROM meauxcloud_analytics
    WHERE timestamp > NOW() - INTERVAL '30' DAY
      AND blob3 = 'cost'
    GROUP BY date, cost_type
    ORDER BY date DESC
  `;
  
  const result = await queryAnalytics(accountId, apiToken, query);
  
  return c.json(result);
});

export default analytics;
```

---

## 🚀 Next Steps

### **1. Create Analytics Engine Dataset**

```bash
# This will be created automatically when you first deploy
wrangler deploy
```

### **2. Initialize Package.json**

```bash
cd /Users/samprimeaux/.gemini/antigravity/scratch/meauxcloud
npm init -y
npm install hono
npm install -D @cloudflare/workers-types typescript wrangler
```

### **3. Create TypeScript Config**

See next file: `tsconfig.json`

### **4. Create Source Structure**

```bash
mkdir -p src/{routes,middleware,lib,types}
```

### **5. Deploy**

```bash
wrangler deploy
```

---

## 📊 Benefits of Analytics Engine

✅ **Real-time**: Sub-second query performance  
✅ **Scalable**: Handles millions of events  
✅ **Cost-effective**: Pay only for what you use  
✅ **SQL queries**: Familiar query language  
✅ **No setup**: Automatic provisioning  
✅ **Integrated**: Works seamlessly with Workers  

---

## 🎯 Use Cases for MeauxCLOUD

1. **Performance Monitoring**: Track response times across all endpoints
2. **Cost Attribution**: Know exactly what each project costs
3. **Error Tracking**: Identify and fix issues quickly
4. **Usage Analytics**: Understand how users interact with your platform
5. **Resource Optimization**: Find bottlenecks and optimize
6. **Business Intelligence**: Custom metrics for decision-making
7. **Compliance**: Audit trails and access logs

---

**Ready to track everything! 🚀**
