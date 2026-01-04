#!/usr/bin/env node

/**
 * Analyze Duplicates and 404s
 * Identifies duplicate resources and checks URL health
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

async function checkURLStatus(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal
        });

        clearTimeout(timeout);
        return {
            status: response.status,
            ok: response.ok
        };
    } catch (error) {
        return {
            status: 'ERROR',
            ok: false,
            error: error.message
        };
    }
}

async function analyze() {
    console.log('🔍 Analyzing Duplicates and 404s...\n');

    const workers = await getAllPages(`/accounts/${ACCOUNT_ID}/workers/scripts`);
    const zones = await getAllPages(`/zones?account.id=${ACCOUNT_ID}&per_page=50`);
    const pagesProjects = await getAllPages(`/accounts/${ACCOUNT_ID}/pages/projects`);

    // Find duplicate workers (same base name with variations)
    console.log('📊 Finding Duplicate Workers...\n');
    const workerGroups = {};
    workers.forEach(worker => {
        const baseName = worker.id.replace(/-dev$|-staging$|-production$|-v\d+$|-\d+$/, '');
        if (!workerGroups[baseName]) {
            workerGroups[baseName] = [];
        }
        workerGroups[baseName].push(worker);
    });

    const duplicates = Object.entries(workerGroups).filter(([_, workers]) => workers.length > 1);

    console.log(`Found ${duplicates.length} duplicate worker groups:\n`);
    duplicates.forEach(([baseName, workerList]) => {
        console.log(`  ${baseName}:`);
        workerList.forEach(w => {
            console.log(`    - ${w.id} (created: ${new Date(w.created_on).toLocaleDateString()})`);
        });
        console.log('');
    });

    // Check URL health
    console.log('🌐 Checking URL Health...\n');
    const urlsToCheck = [
        ...zones.map(z => `https://${z.name}`),
        ...zones.map(z => `https://www.${z.name}`),
        ...pagesProjects.map(p => `https://${p.subdomain}.pages.dev`),
    ].slice(0, 20); // Limit to 20 for now

    const urlStatuses = [];
    for (const url of urlsToCheck) {
        console.log(`Checking: ${url}...`);
        const status = await checkURLStatus(url);
        urlStatuses.push({ url, ...status });

        if (status.status === 404 || status.status === 'ERROR') {
            console.log(`  ❌ ${status.status}`);
        } else {
            console.log(`  ✅ ${status.status}`);
        }
    }

    const broken = urlStatuses.filter(u => u.status === 404 || u.status === 'ERROR');

    console.log('\n═══════════════════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════════════════\n');

    console.log(`Duplicate Worker Groups: ${duplicates.length}`);
    console.log(`Total Workers: ${workers.length}`);
    console.log(`URLs Checked: ${urlsToCheck.length}`);
    console.log(`Broken URLs (404/Error): ${broken.length}\n`);

    if (broken.length > 0) {
        console.log('❌ Broken URLs:\n');
        broken.forEach(b => {
            console.log(`  - ${b.url} (${b.status})`);
        });
    }

    // Save to file
    const fs = require('fs');
    const path = require('path');
    const report = {
        timestamp: new Date().toISOString(),
        duplicates: duplicates.map(([base, workers]) => ({
            baseName: base,
            workers: workers.map(w => ({
                id: w.id,
                created: w.created_on,
                modified: w.modified_on
            }))
        })),
        brokenUrls: broken.map(b => ({ url: b.url, status: b.status }))
    };

    const reportPath = path.join(__dirname, '..', 'CLEANUP_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n✅ Report saved to: ${reportPath}\n`);
}

analyze().catch(console.error);

