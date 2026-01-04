#!/usr/bin/env node

/**
 * Ingest Meaux Ecosystem Brand Guide
 * Stores full context in R2, metadata in D1
 */

const fs = require('fs');
const path = require('path');

const brandGuidePath = path.join(__dirname, '..', 'data', 'meaux-ecosystem-brand-guide.json');
const brandGuide = JSON.parse(fs.readFileSync(brandGuidePath, 'utf8'));

// Ingest master brand
async function ingestMasterBrand() {
    const masterBrand = {
        name: brandGuide.masterBrand.name,
        slug: brandGuide.masterBrand.slug,
        category: brandGuide.masterBrand.category,
        description: brandGuide.masterBrand.description,
        website_url: "https://meauxcloud.org",
        parent_brand_id: null,
        context: brandGuide
    };

    console.log('Ingesting master brand:', masterBrand.name);
    
    const response = await fetch('https://meauxcloud.org/api/ingest/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(masterBrand)
    });

    const result = await response.json();
    console.log('Result:', JSON.stringify(result, null, 2));
    return result;
}

// Ingest all modules
async function ingestModules(masterBrandId) {
    const modules = brandGuide.modules || [];
    const results = [];

    for (const module of modules) {
        const moduleData = {
            name: module.name,
            slug: module.slug,
            category: 'module',
            description: `${module.purpose}. ${module.positioning}`,
            parent_brand_id: masterBrandId,
            context: {
                ...module,
                masterBrand: brandGuide.masterBrand.name
            }
        };

        console.log(`Ingesting module: ${module.name}`);
        
        const response = await fetch('https://meauxcloud.org/api/ingest/brand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleData)
        });

        const result = await response.json();
        results.push(result);
        console.log(`✅ ${module.name} ingested`);
    }

    return results;
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting brand guide ingestion...\n');
        
        // Ingest master brand
        const masterResult = await ingestMasterBrand();
        const masterBrandId = masterResult.brand?.id;

        if (!masterBrandId) {
            console.error('❌ Failed to ingest master brand');
            return;
        }

        console.log(`✅ Master brand ingested (ID: ${masterBrandId})\n`);

        // Ingest modules
        console.log('📦 Ingesting modules...\n');
        const moduleResults = await ingestModules(masterBrandId);

        console.log(`\n✅ Ingestion complete!`);
        console.log(`   - Master brand: 1`);
        console.log(`   - Modules: ${moduleResults.length}`);
        console.log(`\n📊 All data stored in R2, metadata in D1`);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

if (require.main === module) {
    main();
}

module.exports = { ingestMasterBrand, ingestModules };

