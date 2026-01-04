#!/usr/bin/env node

/**
 * Fix Observability Destination 404 Error
 * Creates the telemetry endpoint in the worker
 */

const fs = require('fs');
const path = require('path');

const WORKER_FILE = path.join(__dirname, '..', 'src', 'worker.js');

console.log('🔧 Fixing Observability Destination endpoint...\n');

// Read the worker file
let workerContent = fs.readFileSync(WORKER_FILE, 'utf8');

// Check if endpoint already exists
if (workerContent.includes('/api/telemetry/otlp/v1/logs')) {
    console.log('✅ Telemetry endpoint already exists in worker.js');
    console.log('   The 404 error might be due to:');
    console.log('   1. Worker not deployed with this endpoint');
    console.log('   2. Wrong route configuration');
    console.log('   3. CORS issues\n');
} else {
    console.log('📝 Adding telemetry endpoint to worker.js...\n');
    
    // Find where to insert the endpoint (after other API routes)
    const apiRoutePattern = /\/\/ --- .* API ---/;
    const lastApiMatch = [...workerContent.matchAll(new RegExp(apiRoutePattern, 'g'))].pop();
    
    if (lastApiMatch) {
        const insertPosition = lastApiMatch.index + lastApiMatch[0].length;
        
        const telemetryEndpoint = `

// --- Observability / Telemetry Endpoint ---
app.post('/api/telemetry/otlp/v1/logs', async (c) => {
    try {
        // OTLP (OpenTelemetry Protocol) logs endpoint
        const body = await c.req.json();
        
        // Log the telemetry data (you can process/store it here)
        console.log('Telemetry logs received:', JSON.stringify(body, null, 2));
        
        // Store in D1 if needed
        if (c.env.DB) {
            try {
                await c.env.DB.prepare(\`
                    CREATE TABLE IF NOT EXISTS telemetry_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        resource_attributes TEXT,
                        scope_logs TEXT,
                        received_at INTEGER DEFAULT (unixepoch())
                    )
                \`).run();
                
                await c.env.DB.prepare(\`
                    INSERT INTO telemetry_logs (resource_attributes, scope_logs)
                    VALUES (?, ?)
                \`).bind(
                    JSON.stringify(body.resourceLogs?.[0]?.resource?.attributes || {}),
                    JSON.stringify(body.resourceLogs?.[0]?.scopeLogs || [])
                ).run();
            } catch (dbError) {
                console.error('Error storing telemetry in D1:', dbError);
            }
        }
        
        return c.json({ 
            success: true, 
            message: 'Telemetry logs received',
            received: new Date().toISOString()
        });
    } catch (error) {
        console.error('Telemetry endpoint error:', error);
        return c.json({ error: 'Failed to process telemetry' }, 500);
    }
});

// Health check for observability
app.get('/api/telemetry/health', async (c) => {
    return c.json({ 
        status: 'healthy',
        service: 'meauxbility-central-analytics',
        timestamp: new Date().toISOString()
    });
});
`;

        workerContent = workerContent.slice(0, insertPosition) + telemetryEndpoint + workerContent.slice(insertPosition);
        
        fs.writeFileSync(WORKER_FILE, workerContent);
        console.log('✅ Telemetry endpoint added to worker.js');
        console.log('   Endpoint: POST /api/telemetry/otlp/v1/logs');
        console.log('   Health check: GET /api/telemetry/health\n');
    } else {
        console.log('⚠️  Could not find insertion point. Adding at end of routes...\n');
        
        // Find the export default statement
        const exportMatch = workerContent.match(/export default/);
        if (exportMatch) {
            const insertPosition = exportMatch.index;
            
            const telemetryEndpoint = `

// --- Observability / Telemetry Endpoint ---
app.post('/api/telemetry/otlp/v1/logs', async (c) => {
    try {
        const body = await c.req.json();
        console.log('Telemetry logs received:', JSON.stringify(body, null, 2));
        
        if (c.env.DB) {
            try {
                await c.env.DB.prepare(\`
                    CREATE TABLE IF NOT EXISTS telemetry_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        resource_attributes TEXT,
                        scope_logs TEXT,
                        received_at INTEGER DEFAULT (unixepoch())
                    )
                \`).run();
                
                await c.env.DB.prepare(\`
                    INSERT INTO telemetry_logs (resource_attributes, scope_logs)
                    VALUES (?, ?)
                \`).bind(
                    JSON.stringify(body.resourceLogs?.[0]?.resource?.attributes || {}),
                    JSON.stringify(body.resourceLogs?.[0]?.scopeLogs || [])
                ).run();
            } catch (dbError) {
                console.error('Error storing telemetry in D1:', dbError);
            }
        }
        
        return c.json({ success: true, message: 'Telemetry logs received' });
    } catch (error) {
        console.error('Telemetry endpoint error:', error);
        return c.json({ error: 'Failed to process telemetry' }, 500);
    }
});

app.get('/api/telemetry/health', async (c) => {
    return c.json({ status: 'healthy', service: 'meauxbility-central-analytics' });
});

`;

            workerContent = workerContent.slice(0, insertPosition) + telemetryEndpoint + workerContent.slice(insertPosition);
            fs.writeFileSync(WORKER_FILE, telemetryContent);
            console.log('✅ Telemetry endpoint added to worker.js\n');
        }
    }
}

console.log('📋 Next Steps:');
console.log('   1. Deploy the updated worker: npm run deploy:worker');
console.log('   2. Verify endpoint works: curl https://meauxbility.org/api/telemetry/health');
console.log('   3. Update Cloudflare Observability destination to use the correct URL');
console.log('   4. Test with: curl -X POST https://meauxbility.org/api/telemetry/otlp/v1/logs -H "Content-Type: application/json" -d \'{"test": true}\'\n');

