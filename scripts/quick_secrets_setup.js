#!/usr/bin/env node
/**
 * Quick Secrets Setup - Interactive guide to collect only missing secrets
 * This will check what you already have and only ask for what's missing
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const secrets = {
    // Cloudflare
    CLOUDFLARE_API_TOKEN: {
        name: 'Cloudflare API Token',
        url: 'https://dash.cloudflare.com/profile/api-tokens',
        hint: 'Create "Edit Cloudflare Workers" token',
        required: true
    },
    CLOUDFLARE_ACCOUNT_ID: {
        name: 'Cloudflare Account ID',
        value: 'ede6590ac0d2fb7daf155b35653457b2', // Already known!
        required: true
    },
    AI_GATEWAY_TOKEN: {
        name: 'AI Gateway Token',
        url: 'https://dash.cloudflare.com/?to=/:account/ai-gateway',
        hint: 'From AI Gateway settings',
        required: true
    },
    
    // SFU & TURN
    SFU_APP_ID: {
        name: 'SFU App ID (Cloudflare Calls)',
        url: 'https://dash.cloudflare.com/?to=/:account/calls',
        hint: 'Create Calls app, copy App ID',
        required: true
    },
    SFU_API_TOKEN: {
        name: 'SFU API Token',
        url: 'https://dash.cloudflare.com/?to=/:account/calls',
        hint: 'From Calls app API tokens',
        required: true
    },
    TURN_TOKEN_ID: {
        name: 'TURN Token ID',
        url: 'https://dash.cloudflare.com/?to=/:account/calls/turn',
        hint: 'Create TURN credentials',
        required: true
    },
    TURN_API_TOKEN: {
        name: 'TURN API Token',
        url: 'https://dash.cloudflare.com/?to=/:account/calls/turn',
        hint: 'TURN credential password',
        required: true
    },
    
    // Google
    GOOGLE_CLIENT_ID: {
        name: 'Google OAuth Client ID',
        url: 'https://console.cloud.google.com/apis/credentials',
        hint: 'Create OAuth 2.0 Client ID',
        required: true
    },
    GOOGLE_CLIENT_SECRET: {
        name: 'Google OAuth Client Secret',
        url: 'https://console.cloud.google.com/apis/credentials',
        hint: 'Same OAuth client',
        required: true
    },
    GOOGLE_API_KEY: {
        name: 'Google API Key',
        url: 'https://console.cloud.google.com/apis/credentials',
        hint: 'Create API Key',
        required: true
    },
    
    // Resend
    RESEND_API_KEY: {
        name: 'Resend API Key',
        url: 'https://resend.com/api-keys',
        hint: 'Create API key',
        required: true
    },
    RESEND_WEBHOOK_SECRET: {
        name: 'Resend Webhook Secret',
        url: 'https://resend.com/webhooks',
        hint: 'Create webhook, get signing secret',
        required: false // Can skip if not using webhooks
    },
    
    // Third-party
    MESHYAI_API_KEY: {
        name: 'MeshyAI API Key',
        url: 'https://www.meshy.ai/api-keys',
        hint: 'Create API key',
        required: false // Optional
    },
    CLOUDCONVERT_API_KEY: {
        name: 'CloudConvert API Key',
        url: 'https://cloudconvert.com/dashboard/api-keys',
        hint: 'Create API key',
        required: false // Optional
    },
    
    // Supabase
    SUPABASE_URL: {
        name: 'Supabase URL',
        url: 'https://app.supabase.com/',
        hint: 'Project Settings → API → Project URL',
        required: false // Optional if not using
    },
    SUPABASE_ANON_KEY: {
        name: 'Supabase Anon Key',
        url: 'https://app.supabase.com/',
        hint: 'Project Settings → API → anon key',
        required: false
    },
    SUPABASE_SERVICE_ROLE_KEY: {
        name: 'Supabase Service Role Key',
        url: 'https://app.supabase.com/',
        hint: 'Project Settings → API → service_role key',
        required: false
    },
    
    // GitHub
    GITHUB_MARKETPLACE_WEBHOOK_SECRET: {
        name: 'GitHub Webhook Secret',
        url: 'https://github.com/settings/apps',
        hint: 'App webhook secret',
        required: false
    }
};

async function main() {
    console.log('🚀 Quick Secrets Setup\n');
    console.log('This will help you collect ONLY the secrets you need.\n');
    console.log('💡 Tip: Open this in one tab, and the URLs in another tab\n');
    
    const collected = {};
    const skipped = [];
    
    for (const [key, config] of Object.entries(secrets)) {
        // Skip if we already have the value
        if (config.value) {
            collected[key] = config.value;
            console.log(`✅ ${config.name}: ${config.value} (already known)`);
            continue;
        }
        
        console.log(`\n📋 ${config.name}`);
        if (config.url) console.log(`   🔗 ${config.url}`);
        if (config.hint) console.log(`   💡 ${config.hint}`);
        
        const answer = await question(`\n   Enter value (or 'skip' to skip${config.required ? '' : ', optional'}): `);
        
        if (answer.toLowerCase() === 'skip' && !config.required) {
            skipped.push(key);
            console.log(`   ⏭️  Skipped ${config.name}`);
        } else if (answer.trim()) {
            collected[key] = answer.trim();
            console.log(`   ✅ Saved ${config.name}`);
        } else if (config.required) {
            console.log(`   ⚠️  WARNING: ${config.name} is required but empty!`);
            const confirm = await question('   Continue anyway? (y/n): ');
            if (confirm.toLowerCase() !== 'y') {
                console.log('   ❌ Setup cancelled');
                process.exit(1);
            }
        }
    }
    
    console.log('\n\n📊 Summary:\n');
    console.log(`✅ Collected: ${Object.keys(collected).length} secrets`);
    console.log(`⏭️  Skipped: ${skipped.length} secrets`);
    
    // Generate commands to set secrets
    console.log('\n\n🔧 Commands to set secrets in Cloudflare Worker:\n');
    console.log('# Run these commands:');
    console.log('npx wrangler secret put CLOUDFLARE_API_TOKEN');
    console.log('# (It will prompt for the value - paste from collected secrets below)\n');
    
    Object.entries(collected).forEach(([key, value]) => {
        console.log(`npx wrangler secret put ${key}`);
    });
    
    // Save to file for reference
    const secretsFile = path.join(__dirname, '..', '.secrets-collected.json');
    fs.writeFileSync(secretsFile, JSON.stringify(collected, null, 2));
    console.log(`\n\n💾 Secrets saved to: ${secretsFile}`);
    console.log('⚠️  Keep this file secure! Add to .gitignore if committing.\n');
    
    // Generate GitHub Actions secrets format
    console.log('\n📋 For GitHub Actions, add these in:');
    console.log('   https://github.com/ceosamprimeaux/meauxCLOUD/settings/secrets/actions\n');
    
    Object.keys(collected).forEach(key => {
        console.log(`   ${key}`);
    });
    
    rl.close();
}

main().catch(console.error);

