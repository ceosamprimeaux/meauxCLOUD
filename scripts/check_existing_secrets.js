#!/usr/bin/env node
/**
 * Check what secrets you already have vs what you need
 */

const { execSync } = require('child_process');

const required = [
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_ID', // Known: ede6590ac0d2fb7daf155b35653457b2
    'AI_GATEWAY_TOKEN',
    'SFU_APP_ID',
    'SFU_API_TOKEN',
    'TURN_TOKEN_ID',
    'TURN_API_TOKEN',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_API_KEY',
    'RESEND_API_KEY',
    'RESEND_WEBHOOK_SECRET',
    'MESHYAI_API_KEY',
    'CLOUDCONVERT_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GITHUB_MARKETPLACE_WEBHOOK_SECRET'
];

console.log('🔍 Checking existing secrets in Cloudflare Worker...\n');

let existing = [];
try {
    const output = execSync('npx wrangler secret list', { encoding: 'utf8' });
    const lines = output.split('\n');
    existing = lines
        .filter(line => line.includes('"name"'))
        .map(line => {
            const match = line.match(/"name":\s*"([^"]+)"/);
            return match ? match[1] : null;
        })
        .filter(Boolean);
} catch (error) {
    console.log('⚠️  Could not list secrets. Make sure you\'re logged in to Wrangler.\n');
}

console.log('✅ You already have:\n');
existing.forEach(secret => {
    console.log(`   ✅ ${secret}`);
});

console.log('\n❌ You still need:\n');
const missing = required.filter(s => !existing.includes(s));
if (missing.length === 0) {
    console.log('   🎉 Nothing! You have everything!\n');
} else {
    missing.forEach(secret => {
        console.log(`   ❌ ${secret}`);
    });
}

console.log('\n📊 Summary:');
console.log(`   ✅ Have: ${existing.length}`);
console.log(`   ❌ Need: ${missing.length}`);
console.log(`   📋 Total required: ${required.length}\n`);

if (missing.length > 0) {
    console.log('💡 Quick setup:');
    console.log('   1. Run: node scripts/quick_secrets_setup.js');
    console.log('   2. Or see: FAST_SETUP.md for minimal setup\n');
}

