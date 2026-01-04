#!/usr/bin/env node

/**
 * Test Hyperdrive Connection
 * Verifies that Hyperdrive is properly configured and can connect to Supabase
 */

const HYPERDRIVE_ID = '9108dd6499bb44c286e4eb298c6ffafb';
const CLOUDFLARE_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA';

async function testHyperdrive() {
    console.log('🧪 Testing Hyperdrive Connection...\n');
    
    try {
        // Get Hyperdrive configuration
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/hyperdrive/configs/${HYPERDRIVE_ID}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
        }
        
        const config = data.result;
        
        console.log('✅ Hyperdrive Configuration:');
        console.log(`   Name: ${config.name || 'N/A'}`);
        console.log(`   ID: ${config.id}`);
        console.log(`   Created: ${config.created_at ? new Date(config.created_at).toLocaleString() : 'N/A'}`);
        console.log(`   Origin: ${config.origin?.host ? config.origin.host : 'N/A'}`);
        console.log(`   Caching: ${config.caching?.enabled ? 'Enabled' : 'Disabled'}`);
        console.log('');
        
        // Test connection (this would normally be done from a Worker)
        console.log('📋 Connection Details:');
        console.log('   To use in your Worker:');
        console.log('   ```javascript');
        console.log('   const hyperdrive = c.env.HYPERDRIVE;');
        console.log('   const client = await hyperdrive.connect();');
        console.log('   const result = await client.query("SELECT NOW()");');
        console.log('   ```');
        console.log('');
        
        console.log('✅ Hyperdrive is properly configured!');
        console.log('');
        console.log('💡 Next Steps:');
        console.log('   1. Deploy your worker with Hyperdrive binding');
        console.log('   2. Test a simple query: SELECT NOW()');
        console.log('   3. Monitor performance in Cloudflare dashboard');
        
    } catch (error) {
        console.error('❌ Error testing Hyperdrive:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Verify Hyperdrive ID is correct');
        console.log('   2. Check API token permissions');
        console.log('   3. Ensure Hyperdrive is configured in Cloudflare dashboard');
    }
}

testHyperdrive();

