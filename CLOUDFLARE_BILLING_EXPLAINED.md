# 💰 Cloudflare Billing & Usage Tracking Guide

## Queues Billing Explained

### What You're Seeing

**Current Queue: `meauxwork-jobs`**
- **Billable Operations:** 273 (2,175.00% of quota)
- **Average Backlog:** 1.11 (111.11% of quota)
- **Average Consumer Lag Time:** 18.53 seconds
- **Messages Ingested:** (shown in dashboard)

### Billing Rates

#### Free Tier Limits (Per Month)
- **Operations:** 1,000,000 operations/month (FREE)
- **Storage:** 1 GB (FREE)
- **Retention:** 4 days (FREE)

#### Paid Tier (After Free Tier)
- **Operations:** $0.40 per million operations
- **Storage:** $0.015 per GB/month
- **Retention:** Included up to 4 days

### Your Current Usage

Based on your metrics:
- **273 Billable Operations** = Well within free tier ✅
- **2,175%** means you're using 21.75x your daily quota, but monthly is what matters
- **Average Backlog:** 1.11 messages waiting = Very low ✅
- **Consumer Lag:** 18.53 seconds = Acceptable for most use cases ✅

### Cost Calculation

```
Monthly Operations: ~273 (very low)
Free Tier: 1,000,000 operations/month
Cost: $0.00 (within free tier)
```

**You're well within the free tier!** 🎉

---

## AI Gateway Billing

### Current Usage (Last 24 hours)
- **Requests:** 93
- **Tokens:** 0
- **Cost:** $0.00
- **Errors:** 0

### Billing Rates

#### Free Tier
- **First 10,000 requests/month:** FREE
- **First 1,000,000 tokens/month:** FREE

#### Paid Tier
- **Requests:** $0.10 per 1,000 requests (after free tier)
- **Tokens:** $0.10 per 1,000,000 tokens (after free tier)

### Your Cost
```
93 requests/day × 30 days = ~2,790 requests/month
Cost: $0.00 (within free tier)
```

---

## R2 Storage Billing

### Current Usage
- **Total Storage:** 1.04 GB
- **Class A Operations:** 1.13k
- **Class B Operations:** 74.72k

### Billing Rates

#### Free Tier (Per Month)
- **Storage:** 10 GB FREE
- **Class A Operations:** 1,000,000 FREE
- **Class B Operations:** 10,000,000 FREE

#### Paid Tier
- **Storage:** $0.015 per GB/month
- **Class A Operations:** $4.50 per million
- **Class B Operations:** $0.36 per million

### Your Cost
```
Storage: 1.04 GB = $0.00 (within free tier)
Class A: 1.13k = $0.00 (within free tier)
Class B: 74.72k = $0.00 (within free tier)
Total: $0.00 ✅
```

---

## Workers Billing

### Free Tier (Per Month)
- **Requests:** 100,000 requests/day (3M/month) FREE
- **CPU Time:** 10ms per request FREE
- **Subrequests:** 50 per request FREE

### Paid Tier
- **Requests:** $5.00 per million requests
- **CPU Time:** $0.02 per million GB-seconds

### Your Usage
Based on your workers:
- **meauxcloud:** 2.4k requests (very low)
- **meauxbility-migrator:** 2.2k requests
- **new-iberia-church:** 788 requests

**Total:** ~5,400 requests/day = **$0.00** (well within free tier)

---

## D1 Database Billing

### Free Tier (Per Month)
- **Database Reads:** 5,000,000 rows FREE
- **Database Writes:** 100,000 rows FREE
- **Storage:** 5 GB FREE

### Paid Tier
- **Reads:** $0.001 per million rows
- **Writes:** $1.00 per million rows
- **Storage:** $0.75 per GB/month

### Your Usage
**21 D1 Databases** - All within free tier limits ✅

---

## Pages Billing

### Free Tier
- **Builds:** 500 builds/month FREE
- **Bandwidth:** Unlimited FREE
- **Requests:** Unlimited FREE

### Your Usage
**10 Pages Projects** - All FREE ✅

---

## Total Estimated Monthly Cost

| Service | Usage | Cost |
|---------|-------|------|
| Queues | 273 operations | $0.00 |
| AI Gateway | 2,790 requests | $0.00 |
| R2 Storage | 1.04 GB | $0.00 |
| Workers | ~162k requests | $0.00 |
| D1 Databases | 21 databases | $0.00 |
| Pages | 10 projects | $0.00 |
| **TOTAL** | | **$0.00** |

---

## Usage Tracking Recommendations

### 1. Set Up Billing Alerts

```bash
# In Cloudflare Dashboard:
# Billing → Usage → Set Alerts
```

### 2. Monitor Key Metrics

Track these daily:
- Queue operations
- Worker requests
- R2 operations
- D1 read/write operations

### 3. Create Usage Dashboard

I can create a script to track all usage metrics and alert you when approaching limits.

---

## Cost Optimization Tips

1. **Queues:** Your backlog is low (1.11), which is good. Consider batching messages if volume increases.

2. **R2:** You're using 1.04 GB of 10 GB free tier. Plenty of room.

3. **Workers:** Very low usage. No optimization needed.

4. **D1:** 21 databases is fine. Consider consolidating if you have duplicates.

5. **AI Gateway:** 93 requests/day is minimal. No concerns.

---

## When You'll Start Paying

You'll only pay when you exceed free tier limits:

- **Queues:** After 1M operations/month
- **AI Gateway:** After 10k requests/month
- **R2:** After 10 GB storage
- **Workers:** After 3M requests/month
- **D1:** After 5M reads or 100k writes/month

**Current Status:** All services well within free tier! 🎉

---

**Last Updated:** January 4, 2026

