#!/usr/bin/env node
/**
 * Verify all required secrets are configured
 * Run this after setting up secrets to verify everything is ready
 */

const secrets = [
    // Cloudflare
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_ID',
    'AI_GATEWAY_TOKEN',
    
    // SFU & TURN
    'SFU_APP_ID',
    'SFU_API_TOKEN',
    'TURN_TOKEN_ID',
    'TURN_API_TOKEN',
    
    // Google OAuth & API
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_API_KEY',
    
    // Resend
    'RESEND_API_KEY',
    'RESEND_WEBHOOK_SECRET',
    
    // Third-party APIs
    'MESHYAI_API_KEY',
    'CLOUDCONVERT_API_KEY',
    
    // Supabase
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    
    // GitHub
    'GITHUB_MARKETPLACE_WEBHOOK_SECRET',
    
    // Optional
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
];

console.log('🔍 Checking required secrets...\n');

const required = secrets.filter(s => !s.includes('TWILIO'));
const optional = secrets.filter(s => s.includes('TWILIO'));

console.log('📋 Required Secrets:');
required.forEach(secret => {
    const value = process.env[secret];
    if (value) {
        console.log(`  ✅ ${secret}: ${value.substring(0, 10)}...`);
    } else {
        console.log(`  ❌ ${secret}: NOT SET`);
    }
});

console.log('\n📋 Optional Secrets:');
optional.forEach(secret => {
    const value = process.env[secret];
    if (value) {
        console.log(`  ✅ ${secret}: ${value.substring(0, 10)}...`);
    } else {
        console.log(`  ⚠️  ${secret}: Not set (optional)`);
    }
});

const missing = required.filter(s => !process.env[s]);

if (missing.length === 0) {
    console.log('\n✅ All required secrets are configured!');
    process.exit(0);
} else {
    console.log(`\n❌ Missing ${missing.length} required secret(s):`);
    missing.forEach(s => console.log(`   - ${s}`));
    console.log('\n📖 See GITHUB_SECRETS_SETUP.md for setup instructions');
    process.exit(1);
}

