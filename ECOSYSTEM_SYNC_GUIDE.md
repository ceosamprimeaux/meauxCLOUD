# 🗂️ Ecosystem Sync Guide

## Overview

Your D1 database now has comprehensive tables to track:
- **Brands** - All your brands/organizations
- **URLs** - All domains, workers, pages URLs
- **Apps** - All applications/modules
- **Cloudflare Resources** - Workers, Pages, D1, R2, etc.
- **Health Checks** - URL status monitoring
- **Duplicates** - Tracking of duplicate resources

## Database Schema

### Tables Created

1. **brands** - Brand/organization information
2. **urls** - All URLs (domains, workers, pages)
3. **apps** - Applications and modules
4. **cloudflare_resources** - All Cloudflare resources
5. **url_health_checks** - URL status history
6. **duplicate_resources** - Duplicate tracking

See `database/migrations/001_brands_and_resources.sql` for full schema.

## Initial Sync

### Option 1: Via API Endpoint (Recommended)

```bash
curl -X POST https://meauxcloud.org/api/sync/cloudflare
```

This will:
- Create all brand tables
- Insert default brands
- Sync zones from Cloudflare
- Sync workers from Cloudflare
- Link resources to brands

### Option 2: Via Script

```bash
node scripts/populate_brands_from_cloudflare.js > populate.sql
wrangler d1 execute meauxos --file=populate.sql
```

## API Endpoints

### Brands
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create new brand

### URLs
- `GET /api/urls` - List URLs (filter by brand_id, status, url_type)
- `POST /api/urls` - Add new URL

### Resources
- `GET /api/resources` - List resources (filter by resource_type, brand_id, status)

### Analysis
- `GET /api/analysis/duplicates` - Find duplicate workers/URLs
- `POST /api/analysis/check-urls` - Check URL health (find 404s)

### Ecosystem Overview
- `GET /api/ecosystem/overview` - Complete ecosystem summary

## Adding Your Brands

When you provide brand information, use:

```bash
POST /api/brands
{
  "name": "Brand Name",
  "slug": "brand-slug",
  "description": "Description",
  "category": "core|ecommerce|energy|events|portfolio|client",
  "website_url": "https://..."
}
```

## Finding Duplicates

```bash
curl https://meauxcloud.org/api/analysis/duplicates
```

Returns:
- Duplicate workers (same base name with -dev, -staging, etc.)
- Duplicate URLs

## Finding 404s

```bash
curl -X POST https://meauxcloud.org/api/analysis/check-urls \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}'
```

This will:
- Check URL health
- Update status (active/404/error)
- Record in `url_health_checks` table

## Ecosystem Overview

```bash
curl https://meauxcloud.org/api/ecosystem/overview
```

Returns complete overview:
- Brand counts by category
- URL counts by status
- Resource counts by type
- Pending duplicates

## Next Steps

1. **Initial Sync**: Run `/api/sync/cloudflare` to populate database
2. **Add Your Brands**: Provide brand information, I'll add them
3. **Check Health**: Run URL health check to find 404s
4. **Find Duplicates**: Use duplicate analysis to identify cleanup targets
5. **Organize**: Link resources to brands systematically

## Ready for Your Brand Data

I'm ready to receive your brand/context information. I'll:
- Add brands to the database
- Link URLs and resources to brands
- Identify duplicates for cleanup
- Find 404s to remove
- Create a clean, organized ecosystem

**Just start providing your brand information and I'll organize it all!** 🚀

---

**Last Updated:** January 4, 2026

