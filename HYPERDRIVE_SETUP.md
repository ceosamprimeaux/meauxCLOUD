# 🚀 Hyperdrive Setup Guide

## Your Hyperdrive Configuration

- **Name:** `meauxhyper`
- **ID:** `9108dd6499bb44c286e4eb298c6ffafb`
- **Purpose:** Connection pooling for Supabase PostgreSQL database

## What is Hyperdrive?

Hyperdrive is Cloudflare's database connection pooling service that:
- Reduces connection overhead
- Improves query performance
- Provides connection pooling for PostgreSQL databases
- Works seamlessly with Cloudflare Workers

## Benefits

1. **Faster Queries:** Connection pooling reduces latency
2. **Better Performance:** Reuses connections instead of creating new ones
3. **Cost Effective:** Reduces database connection costs
4. **Edge-Optimized:** Works at Cloudflare's edge network

## Setup Steps

### 1. Add to wrangler.toml

```toml
[[hyperdrive]]
binding = "HYPERDRIVE"
id = "9108dd6499bb44c286e4eb298c6ffafb"
```

### 2. Use in Worker

```javascript
// In your worker.js
app.get('/api/db/query', async (c) => {
  const hyperdrive = c.env.HYPERDRIVE;
  
  // Connect using Hyperdrive
  const client = await hyperdrive.connect();
  
  const result = await client.query('SELECT * FROM your_table');
  
  return c.json(result.rows);
});
```

### 3. Supabase Connection String

Your Supabase connection string should be:
```
postgresql://postgres:[PASSWORD]@db.qmpghmthbhuumemnahcz.supabase.co:5432/postgres
```

Replace `[PASSWORD]` with your actual database password.

## Integration with Your Current Setup

Since you already have:
- Supabase Edge Functions
- D1 Database (meauxos)
- Supabase D1 Wrapper configured

You can use Hyperdrive for:
1. **Direct PostgreSQL queries** (faster than D1 wrapper)
2. **Complex joins** across multiple tables
3. **Real-time data** from Supabase
4. **Migration scripts** and bulk operations

## Performance Comparison

| Method | Latency | Best For |
|--------|---------|----------|
| D1 (SQLite) | ~5-10ms | Simple queries, edge-first |
| Hyperdrive (PostgreSQL) | ~10-20ms | Complex queries, joins |
| Direct Supabase | ~50-100ms | Development, admin tasks |

## Next Steps

1. ✅ Add Hyperdrive binding to `wrangler.toml`
2. ✅ Update worker to use Hyperdrive for Supabase queries
3. ✅ Test connection and query performance
4. ✅ Monitor usage and optimize queries

---

**Hyperdrive ID:** `9108dd6499bb44c286e4eb298c6ffafb`  
**Status:** Ready to use

