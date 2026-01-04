#!/usr/bin/env node

/**
 * Get All URLs from Cloudflare Account
 * Fetches all domains, workers, pages, and checks their status
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
    
    if (data.result_info && data.result_info.cursor) {
        const nextEndpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}cursor=${data.result_info.cursor}`;
        return getAllPages(nextEndpoint, results);
    }
    
    return results;
}

async function checkURLStatus(url) {
    try {
        const response = await fetch(url, { 
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(5000)
        });
        return {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        };
    } catch (error) {
        return {
            status: 'ERROR',
            statusText: error.message,
            ok: false
        };
    }
}

async function getAllURLs() {
    console.log('🔍 Fetching all URLs from Cloudflare account...\n');
    
    // 1. Zones (Domains)
    console.log('📊 Fetching zones...');
    const zones = await getAllPages(`/zones?account.id=${ACCOUNT_ID}&per_page=50`);
    
    // 2. Workers
    console.log('⚙️  Fetching workers...');
    const workers = await getAllPages(`/accounts/${ACCOUNT_ID}/workers/scripts`);
    
    // 3. Workers Domains
    console.log('🔗 Fetching workers domains...');
    const workersDomains = await fetchAPI(`/accounts/${ACCOUNT_ID}/workers/domains`);
    
    // 4. Pages Projects
    console.log('📄 Fetching pages projects...');
    const pagesProjects = await getAllPages(`/accounts/${ACCOUNT_ID}/pages/projects`);
    
    return {
        zones,
        workers,
        workersDomains: workersDomains?.result || [],
        pagesProjects,
    };
}

function formatURLs(data) {
    const output = [];
    const allURLs = [];
    
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push('                    CLOUDFLARE ACCOUNT - ALL URLs RECEIPT');
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    // Zones (Domains)
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`🌐 DOMAINS (ZONES) - ${data.zones?.length || 0} Total`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    if (data.zones && data.zones.length > 0) {
        data.zones.forEach((zone, idx) => {
            const urls = [
                `https://${zone.name}`,
                `https://www.${zone.name}`,
                `http://${zone.name}`,
                `http://www.${zone.name}`
            ];
            
            output.push(`${idx + 1}. ${zone.name}`);
            output.push(`   Zone ID: ${zone.id}`);
            output.push(`   Status: ${zone.status}`);
            output.push(`   Plan: ${zone.plan?.name || 'Free'}`);
            output.push(`   URLs:`);
            urls.forEach(url => {
                output.push(`      • ${url}`);
                allURLs.push({ url, type: 'Domain', name: zone.name, status: zone.status });
            });
            output.push('');
        });
    }
    
    // Workers
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`⚙️  WORKERS - ${data.workers?.length || 0} Total`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    if (data.workers && data.workers.length > 0) {
        data.workers.forEach((worker, idx) => {
            const workerURL = `https://${worker.id}.${ACCOUNT_ID}.workers.dev`;
            output.push(`${idx + 1}. ${worker.id}`);
            output.push(`   URL: ${workerURL}`);
            allURLs.push({ url: workerURL, type: 'Worker', name: worker.id });
            output.push('');
        });
    }
    
    // Workers Custom Domains
    if (data.workersDomains && data.workersDomains.length > 0) {
        output.push('═══════════════════════════════════════════════════════════════════════════');
        output.push(`🔗 WORKERS CUSTOM DOMAINS - ${data.workersDomains.length} Total`);
        output.push('═══════════════════════════════════════════════════════════════════════════\n');
        
        data.workersDomains.forEach((domain, idx) => {
            const url = domain.zone_name ? `https://${domain.zone_name}` : `https://${domain.hostname}`;
            output.push(`${idx + 1}. ${domain.service || 'N/A'}`);
            output.push(`   Domain: ${url}`);
            allURLs.push({ url, type: 'Worker Domain', name: domain.service || domain.zone_name });
            output.push('');
        });
    }
    
    // Pages Projects
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push(`📄 PAGES PROJECTS - ${data.pagesProjects?.length || 0} Total`);
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    if (data.pagesProjects && data.pagesProjects.length > 0) {
        data.pagesProjects.forEach((project, idx) => {
            const pagesURL = `https://${project.subdomain}.pages.dev`;
            output.push(`${idx + 1}. ${project.name}`);
            output.push(`   Project ID: ${project.id}`);
            output.push(`   Pages URL: ${pagesURL}`);
            allURLs.push({ url: pagesURL, type: 'Pages', name: project.name });
            
            if (project.domains && project.domains.length > 0) {
                output.push(`   Custom Domains:`);
                project.domains.forEach(domain => {
                    const customURL = `https://${domain}`;
                    output.push(`      • ${customURL}`);
                    allURLs.push({ url: customURL, type: 'Pages Custom', name: project.name });
                });
            }
            output.push('');
        });
    }
    
    // Summary
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push('📊 SUMMARY');
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    output.push(`Total Domains:        ${data.zones?.length || 0}`);
    output.push(`Total Workers:        ${data.workers?.length || 0}`);
    output.push(`Total Pages Projects: ${data.pagesProjects?.length || 0}`);
    output.push(`Total URLs:           ${allURLs.length}\n`);
    
    // All URLs List
    output.push('═══════════════════════════════════════════════════════════════════════════');
    output.push('📋 COMPLETE URL LIST');
    output.push('═══════════════════════════════════════════════════════════════════════════\n');
    
    allURLs.forEach((item, idx) => {
        output.push(`${idx + 1}. [${item.type}] ${item.url}`);
        output.push(`   Name: ${item.name}\n`);
    });
    
    return { output: output.join('\n'), allURLs };
}

// Main execution
(async () => {
    try {
        const data = await getAllURLs();
        const { output, allURLs } = formatURLs(data);
        
        console.log(output);
        
        // Save to file
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.join(__dirname, '..', 'CLOUDFLARE_ALL_URLS.txt');
        fs.writeFileSync(outputPath, output);
        console.log(`\n✅ URLs saved to: ${outputPath}`);
        
        // Save JSON
        const jsonPath = path.join(__dirname, '..', 'CLOUDFLARE_ALL_URLS.json');
        fs.writeFileSync(jsonPath, JSON.stringify({ urls: allURLs, summary: data }, null, 2));
        console.log(`✅ JSON saved to: ${jsonPath}`);
        
        // Now check status of key URLs
        console.log('\n🔍 Checking status of key URLs...\n');
        
        const keyURLs = [
            ...allURLs.filter(u => u.type === 'Domain').slice(0, 5).map(u => u.url),
            ...allURLs.filter(u => u.type === 'Pages').slice(0, 3).map(u => u.url),
        ];
        
        const statusReport = [];
        for (const url of keyURLs) {
            console.log(`Checking: ${url}...`);
            const status = await checkURLStatus(url);
            statusReport.push({ url, ...status });
            console.log(`  Status: ${status.status} ${status.statusText}\n`);
        }
        
        const statusPath = path.join(__dirname, '..', 'CLOUDFLARE_URL_STATUS.json');
        fs.writeFileSync(statusPath, JSON.stringify(statusReport, null, 2));
        console.log(`✅ Status check saved to: ${statusPath}`);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();

