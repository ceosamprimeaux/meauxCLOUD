#!/usr/bin/env node

/**
 * Cloudflare Account Organization Analyzer
 * Fetches comprehensive account information and organizes it
 */

const ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA';
const API_BASE = 'https://api.cloudflare.com/client/v4';

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!data.success) {
            throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
        }

        return data.result;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        return null;
    }
}

async function getAllPages(endpoint, results = []) {
    const data = await fetchAPI(endpoint);
    if (!data) return results;

    if (Array.isArray(data)) {
        results.push(...data);
    } else if (data.result) {
        results.push(...(Array.isArray(data.result) ? data.result : [data.result]));
    }

    // Check for pagination
    if (data.result_info && data.result_info.cursor) {
        const nextEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}cursor=${data.result_info.cursor}`;
        return getAllPages(nextEndpoint, results);
    }

    return results;
}

async function analyzeAccount() {
    console.log('🔍 Analyzing Cloudflare Account...\n');

    // 1. Account Information
    console.log('📊 Fetching account information...');
    const account = await fetchAPI(`/accounts/${ACCOUNT_ID}`);

    // 2. Zones (Domains/URLs)
    console.log('🌐 Fetching zones (domains)...');
    const zones = await getAllPages(`/zones?account.id=${ACCOUNT_ID}&per_page=50`);

    // 3. Workers
    console.log('⚙️  Fetching Workers...');
    const workers = await getAllPages(`/accounts/${ACCOUNT_ID}/workers/scripts`);

    // 4. Workers KV Namespaces
    console.log('🗄️  Fetching KV Namespaces...');
    const kvNamespaces = await getAllPages(`/accounts/${ACCOUNT_ID}/storage/kv/namespaces`);

    // 5. D1 Databases
    console.log('💾 Fetching D1 Databases...');
    const d1Databases = await getAllPages(`/accounts/${ACCOUNT_ID}/d1/database`);

    // 6. R2 Buckets
    console.log('🪣 Fetching R2 Buckets...');
    const r2Buckets = await getAllPages(`/accounts/${ACCOUNT_ID}/r2/buckets`);

    // 7. Pages Projects
    console.log('📄 Fetching Pages Projects...');
    const pagesProjects = await getAllPages(`/accounts/${ACCOUNT_ID}/pages/projects`);

    // 8. Stream Videos
    console.log('🎥 Fetching Stream videos...');
    const streamVideos = await fetchAPI(`/accounts/${ACCOUNT_ID}/stream?per_page=50`);

    // 9. Images
    console.log('🖼️  Fetching Images...');
    const images = await fetchAPI(`/accounts/${ACCOUNT_ID}/images/v2?per_page=50`);

    // 10. Workers Domains
    console.log('🔗 Fetching Workers Domains...');
    const workersDomains = await fetchAPI(`/accounts/${ACCOUNT_ID}/workers/domains`);

    // Organize and format results
    return {
        account,
        zones,
        workers,
        kvNamespaces,
        d1Databases,
        r2Buckets,
        pagesProjects,
        streamVideos: streamVideos?.result || [],
        images: images?.result?.images || [],
        workersDomains: workersDomains?.result || [],
    };
}

function formatResults(data) {
    const output = [];

    // Account Summary
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push('                    CLOUDFLARE ACCOUNT ORGANIZATION');
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.account) {
        output.push(`Account Name: ${data.account.name || 'N/A'}`);
        output.push(`Account ID: ${data.account.id}`);
        output.push(`Account Type: ${data.account.type || 'Standard'}`);
        output.push(`Created: ${data.account.created_on ? new Date(data.account.created_on).toLocaleDateString() : 'N/A'}\n`);
    }

    // Zones (Domains/URLs)
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`🌐 ZONES (DOMAINS) - Total: ${data.zones?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════');

    if (data.zones && data.zones.length > 0) {
        const proZones = data.zones.filter(z => z.plan?.name?.includes('Pro') || z.plan?.name?.includes('pro'));
        const freeZones = data.zones.filter(z => !z.plan?.name?.includes('Pro') && !z.plan?.name?.includes('pro'));

        output.push(`\n📊 Plan Breakdown:`);
        output.push(`   Pro Plans: ${proZones.length}`);
        output.push(`   Free Plans: ${freeZones.length}\n`);

        data.zones.forEach((zone, idx) => {
            output.push(`${idx + 1}. ${zone.name}`);
            output.push(`   Zone ID: ${zone.id}`);
            output.push(`   Status: ${zone.status}`);
            output.push(`   Plan: ${zone.plan?.name || 'Free'}`);
            output.push(`   URLs:`);
            output.push(`      • https://${zone.name}`);
            output.push(`      • https://www.${zone.name}`);
            if (zone.name_servers) {
                output.push(`   Name Servers: ${zone.name_servers.join(', ')}`);
            }
            output.push('');
        });
    } else {
        output.push('No zones found.\n');
    }

    // Workers
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`⚙️  WORKERS - Total: ${data.workers?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.workers && data.workers.length > 0) {
        data.workers.forEach((worker, idx) => {
            output.push(`${idx + 1}. ${worker.id}`);
            output.push(`   Created: ${worker.created_on ? new Date(worker.created_on).toLocaleDateString() : 'N/A'}`);
            output.push(`   Modified: ${worker.modified_on ? new Date(worker.modified_on).toLocaleDateString() : 'N/A'}`);
            if (data.workersDomains && data.workersDomains.length > 0) {
                const workerDomain = data.workersDomains.find(d => d.zone_name?.includes(worker.id));
                if (workerDomain) {
                    output.push(`   Domain: ${workerDomain.zone_name}`);
                }
            }
            output.push('');
        });
    } else {
        output.push('No Workers found.\n');
    }

    // Workers Domains
    if (data.workersDomains && data.workersDomains.length > 0) {
        output.push('═══════════════════════════════════════════════════════════════════════════');
        output.push(`🔗 WORKERS DOMAINS - Total: ${data.workersDomains.length}`);
        output.push('═══════════════════════════════════════════════════════════════════════════\n');

        data.workersDomains.forEach((domain, idx) => {
            output.push(`${idx + 1}. ${domain.zone_name || domain.hostname || 'N/A'}`);
            output.push(`   Service: ${domain.service || 'N/A'}`);
            output.push(`   Environment: ${domain.environment || 'production'}`);
            output.push('');
        });
    }

    // Pages Projects
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`📄 PAGES PROJECTS - Total: ${data.pagesProjects?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.pagesProjects && data.pagesProjects.length > 0) {
        data.pagesProjects.forEach((project, idx) => {
            output.push(`${idx + 1}. ${project.name}`);
            output.push(`   Project ID: ${project.id}`);
            output.push(`   Production URL: https://${project.subdomain}.pages.dev`);
            if (project.domains && project.domains.length > 0) {
                output.push(`   Custom Domains:`);
                project.domains.forEach(domain => {
                    output.push(`      • https://${domain}`);
                });
            }
            output.push(`   Created: ${project.created_on ? new Date(project.created_on).toLocaleDateString() : 'N/A'}`);
            output.push(`   Latest Deployment: ${project.latest_deployment?.created_on ? new Date(project.latest_deployment.created_on).toLocaleDateString() : 'N/A'}`);
            output.push('');
        });
    } else {
        output.push('No Pages projects found.\n');
    }

    // R2 Buckets
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`🪣 R2 BUCKETS - Total: ${data.r2Buckets?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.r2Buckets && data.r2Buckets.length > 0) {
        data.r2Buckets.forEach((bucket, idx) => {
            output.push(`${idx + 1}. ${bucket.name}`);
            output.push(`   Created: ${bucket.creation_date ? new Date(bucket.creation_date).toLocaleDateString() : 'N/A'}`);
            output.push(`   Location: ${bucket.location || 'N/A'}`);
            output.push('');
        });
    } else {
        output.push('No R2 buckets found.\n');
    }

    // D1 Databases
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`💾 D1 DATABASES - Total: ${data.d1Databases?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.d1Databases && data.d1Databases.length > 0) {
        data.d1Databases.forEach((db, idx) => {
            output.push(`${idx + 1}. ${db.name || 'Unnamed'}`);
            output.push(`   Database ID: ${db.uuid}`);
            output.push(`   Created: ${db.created_at ? new Date(db.created_at).toLocaleDateString() : 'N/A'}`);
            output.push(`   Version: ${db.version || 'N/A'}`);
            output.push('');
        });
    } else {
        output.push('No D1 databases found.\n');
    }

    // KV Namespaces
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`🗄️  KV NAMESPACES - Total: ${data.kvNamespaces?.length || 0}`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    if (data.kvNamespaces && data.kvNamespaces.length > 0) {
        data.kvNamespaces.forEach((ns, idx) => {
            output.push(`${idx + 1}. ${ns.title || 'Unnamed'}`);
            output.push(`   Namespace ID: ${ns.id}`);
            output.push('');
        });
    } else {
        output.push('No KV namespaces found.\n');
    }

    // Stream Videos
    if (data.streamVideos && data.streamVideos.length > 0) {
        output.push('═══════════════════════════════════════════════════════════════════════════');
        output.push(`🎥 STREAM VIDEOS - Total: ${data.streamVideos.length}`);
        output.push('═══════════════════════════════════════════════════════════════════════════\n');
        output.push(`(Showing first ${data.streamVideos.length} videos)\n`);
    }

    // Images
    if (data.images && data.images.length > 0) {
        output.push('═══════════════════════════════════════════════════════════════════════════');
        output.push(`🖼️  IMAGES - Total: ${data.images.length}`);
        output.push('═══════════════════════════════════════════════════════════════════════════\n');
        output.push(`(Showing first ${data.images.length} images)\n`);
    }

    // Summary
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push('📊 SUMMARY');
    output.push('═══════════════════════════════════════════════════════════════════════════\n');

    const proZones = data.zones?.filter(z => z.plan?.name?.includes('Pro') || z.plan?.name?.includes('pro')) || [];
    const freeZones = data.zones?.filter(z => !z.plan?.name?.includes('Pro') && !z.plan?.name?.includes('pro')) || [];

    output.push(`Zones (Domains):        ${data.zones?.length || 0} (${proZones.length} Pro, ${freeZones.length} Free)`);
    output.push(`Workers:                ${data.workers?.length || 0}`);
    output.push(`Pages Projects:         ${data.pagesProjects?.length || 0}`);
    output.push(`R2 Buckets:            ${data.r2Buckets?.length || 0}`);
    output.push(`D1 Databases:          ${data.d1Databases?.length || 0}`);
    output.push(`KV Namespaces:         ${data.kvNamespaces?.length || 0}`);
    output.push(`Stream Videos:         ${data.streamVideos?.length || 0}`);
    output.push(`Images:                ${data.images?.length || 0}`);
    output.push(`Workers Domains:       ${data.workersDomains?.length || 0}`);

    output.push('\n═══════════════════════════════════════════════════════════════════════════\n');

    return output.join('\n');
}

// Main execution
(async () => {
    try {
        const data = await analyzeAccount();
        const formatted = formatResults(data);
        console.log(formatted);

        // Also save to file
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.join(__dirname, '..', 'CLOUDFLARE_ACCOUNT_ORGANIZATION.txt');
        fs.writeFileSync(outputPath, formatted);
        console.log(`\n✅ Results saved to: ${outputPath}`);

        // Also save JSON for programmatic access
        const jsonPath = path.join(__dirname, '..', 'CLOUDFLARE_ACCOUNT_ORGANIZATION.json');
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
        console.log(`✅ JSON data saved to: ${jsonPath}`);

    } catch (error) {
        console.error('Error analyzing account:', error);
        process.exit(1);
    }
})();

