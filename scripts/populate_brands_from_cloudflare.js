#!/usr/bin/env node

/**
 * Populate D1 Database with Brands and Resources from Cloudflare
 * Run this via: wrangler d1 execute meauxos --file=scripts/populate_brands_from_cloudflare.js
 * Or use the API endpoint: POST /api/sync/cloudflare
 */

const ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA';
const API_BASE = 'https://api.cloudflare.com/client/v4';

async function fetchAPI(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.success ? data.result : null;
}

async function getAllPages(endpoint, results = []) {
    const data = await fetchAPI(endpoint);
    if (!data) return results;

    if (Array.isArray(data)) {
        results.push(...data);
    } else if (data.result) {
        results.push(...(Array.isArray(data.result) ? data.result : [data.result]));
    }

    if (data.result_info && data.result_info.cursor) {
        const nextEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}cursor=${data.result_info.cursor}`;
        return getAllPages(nextEndpoint, results);
    }

    return results;
}

// This generates SQL that can be run via wrangler d1 execute
async function generatePopulateSQL() {
    console.log('-- Populate Brands and Resources from Cloudflare\n');
    console.log('-- Run via: wrangler d1 execute meauxos --file=this-file.sql\n\n');

    const zones = await getAllPages(`/zones?account.id=${ACCOUNT_ID}&per_page=50`);
    const workers = await getAllPages(`/accounts/${ACCOUNT_ID}/workers/scripts`);
    const pagesProjects = await getAllPages(`/accounts/${ACCOUNT_ID}/pages/projects`);
    const d1Databases = await getAllPages(`/accounts/${ACCOUNT_ID}/d1/database`);
    const r2Buckets = await getAllPages(`/accounts/${ACCOUNT_ID}/r2/buckets`);

    // Insert brands
    console.log('-- Insert Brands\n');
    const brands = [
        { name: 'MeauxCLOUD', slug: 'meauxcloud', category: 'core', description: 'Primary cloud platform' },
        { name: 'MeauxOS', slug: 'meauxos', category: 'core', description: 'Operating system layer' },
        { name: 'Meauxbility', slug: 'meauxbility', category: 'core', description: 'Parent organization • Tech & Innovation Hub' },
        { name: 'Inner Animal', slug: 'inner-animal', category: 'ecommerce', description: 'Pet accessories & apparel brand' },
        { name: 'SolarSpec', slug: 'solarspec', category: 'energy', description: 'Solar energy solutions' },
        { name: 'Krewe of Jesters', slug: 'krewe-of-jesters', category: 'events', description: 'Events & entertainment' },
        { name: 'SamPrimeaux.com', slug: 'samprimeaux', category: 'portfolio', description: 'Personal portfolio & consultancy' },
        { name: 'Client Projects', slug: 'client-projects', category: 'client', description: 'Enterprise solutions & consulting' },
        { name: 'New Iberia Church of Christ', slug: 'new-iberia-church', category: 'client', description: 'Church website and services' },
        { name: 'Southern Pets Animal Rescue', slug: 'southern-pets', category: 'client', description: 'Animal rescue organization' },
        { name: 'iAutodidact', slug: 'iautodidact', category: 'core', description: 'Education platform' },
    ];

    brands.forEach(brand => {
        console.log(`INSERT OR IGNORE INTO brands (name, slug, category, description) VALUES ('${brand.name}', '${brand.slug}', '${brand.category}', '${brand.description}');`);
    });

    console.log('\n-- Insert URLs from Zones\n');
    zones.forEach(zone => {
        const brandSlug = zone.name.includes('meauxcloud') ? 'meauxcloud' :
            zone.name.includes('meauxbility') ? 'meauxbility' :
                zone.name.includes('inneranimal') ? 'inner-animal' :
                    zone.name.includes('iautodidact') ? 'iautodidact' :
                        zone.name.includes('newiberia') ? 'new-iberia-church' :
                            zone.name.includes('southernpets') ? 'southern-pets' : 'client-projects';

        console.log(`INSERT OR IGNORE INTO urls (url, url_type, cloudflare_zone_id, plan, status) VALUES ('https://${zone.name}', 'domain', '${zone.id}', '${zone.plan?.name?.toLowerCase() || 'free'}', 'active');`);
    });

    console.log('\n-- Insert Workers as Resources\n');
    workers.forEach(worker => {
        console.log(`INSERT OR IGNORE INTO cloudflare_resources (resource_type, resource_name, resource_id, status) VALUES ('worker', '${worker.id}', '${worker.id}', 'active');`);
    });

    console.log('\n-- Insert Pages Projects\n');
    pagesProjects.forEach(project => {
        console.log(`INSERT OR IGNORE INTO cloudflare_resources (resource_type, resource_name, resource_id, status) VALUES ('pages', '${project.name}', '${project.id}', 'active');`);
    });

    console.log('\n-- Insert D1 Databases\n');
    d1Databases.forEach(db => {
        console.log(`INSERT OR IGNORE INTO cloudflare_resources (resource_type, resource_name, resource_id, status) VALUES ('d1', '${db.name || 'unnamed'}', '${db.uuid}', 'active');`);
    });

    console.log('\n-- Insert R2 Buckets\n');
    r2Buckets.forEach(bucket => {
        console.log(`INSERT OR IGNORE INTO cloudflare_resources (resource_type, resource_name, resource_id, status) VALUES ('r2', '${bucket.name}', '${bucket.name}', 'active');`);
    });

    console.log('\n-- Done!\n');
}

if (require.main === module) {
    generatePopulateSQL().catch(console.error);
}

module.exports = { generatePopulateSQL };

