#!/usr/bin/env node

/**
 * Supabase + Cloudflare D1 Connection Setup
 * Helps connect Supabase to D1 database for better SQL management
 */

const SUPABASE_URL = 'https://qmpghmthbhuumemnahcz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcGdobXRoYmh1dW1lbW5haGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDg0NTIsImV4cCI6MjA4MTkyNDQ1Mn0.FT7CUI-gHra5kyCkCqhW7YDuEPqH2siC-3ZkmZlbag4';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtcGdobXRoYmh1dW1lbW5haGN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjM0ODQ1MiwiZXhwIjoyMDgxOTI0NDUyfQ.GrGosRjddbb-PbLMmhotxFWG4xIUEjV1iU2Nwk-5xOU';

const D1_DATABASE_ID = 'd8261777-9384-44f7-924d-c92247d55b46';
const CLOUDFLARE_ACCOUNT_ID = 'ede6590ac0d2fb7daf155b35653457b2';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'hFWNgfyv09nhrDH27BW6yYVqLK2y-PhMqJMxBOMA';

console.log('🔗 Setting up Supabase + D1 Connection\n');

// Helper to query D1 via Cloudflare API
async function queryD1(sql) {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql }),
        }
    );
    
    const data = await response.json();
    if (!data.success) {
        throw new Error(`D1 Query Error: ${JSON.stringify(data.errors)}`);
    }
    
    return data.result;
}

// Helper to query Supabase
async function querySupabase(sql) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
    });
    
    return await response.json();
}

// Get all tables from D1
async function getD1Tables() {
    try {
        const result = await queryD1(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%'
            ORDER BY name;
        `);
        
        return result[0]?.results || [];
    } catch (error) {
        console.error('Error fetching D1 tables:', error);
        return [];
    }
}

// Get table schema from D1
async function getD1TableSchema(tableName) {
    try {
        const result = await queryD1(`PRAGMA table_info(${tableName});`);
        return result[0]?.results || [];
    } catch (error) {
        console.error(`Error fetching schema for ${tableName}:`, error);
        return [];
    }
}

// Main function
async function main() {
    console.log('📊 Fetching D1 database structure...\n');
    
    const tables = await getD1Tables();
    
    if (tables.length === 0) {
        console.log('⚠️  No tables found in D1 database');
        console.log('   This might be because:');
        console.log('   1. The database is empty');
        console.log('   2. API permissions issue');
        console.log('   3. Database ID is incorrect\n');
        return;
    }
    
    console.log(`✅ Found ${tables.length} tables in D1:\n`);
    
    const tableInfo = [];
    
    for (const table of tables) {
        const tableName = table.name;
        const schema = await getD1TableSchema(tableName);
        
        console.log(`📋 ${tableName}`);
        console.log(`   Columns: ${schema.length}`);
        
        if (schema.length > 0) {
            schema.forEach(col => {
                console.log(`      - ${col.name} (${col.type || 'TEXT'})`);
            });
        }
        
        // Get row count
        try {
            const countResult = await queryD1(`SELECT COUNT(*) as count FROM ${tableName}`);
            const count = countResult[0]?.results?.[0]?.count || 0;
            console.log(`   Rows: ${count}`);
        } catch (e) {
            console.log(`   Rows: Unable to count`);
        }
        
        tableInfo.push({
            name: tableName,
            schema,
        });
        
        console.log('');
    }
    
    // Generate SQL schema file
    const fs = require('fs');
    const path = require('path');
    
    let schemaSQL = `-- D1 Database Schema Export
-- Database: meauxos
-- Database ID: ${D1_DATABASE_ID}
-- Generated: ${new Date().toISOString()}

`;

    for (const table of tableInfo) {
        schemaSQL += `-- Table: ${table.name}\n`;
        schemaSQL += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
        
        const columns = table.schema.map(col => {
            let def = `    ${col.name} ${col.type || 'TEXT'}`;
            if (col.notnull) def += ' NOT NULL';
            if (col.dflt_value !== null) def += ` DEFAULT ${col.dflt_value}`;
            if (col.pk) def += ' PRIMARY KEY';
            return def;
        });
        
        schemaSQL += columns.join(',\n');
        schemaSQL += '\n);\n\n';
    }
    
    const schemaPath = path.join(__dirname, '..', 'database', 'd1_schema_export.sql');
    const schemaDir = path.dirname(schemaPath);
    
    if (!fs.existsSync(schemaDir)) {
        fs.mkdirSync(schemaDir, { recursive: true });
    }
    
    fs.writeFileSync(schemaPath, schemaSQL);
    console.log(`✅ Schema exported to: ${schemaPath}\n`);
    
    // Create connection guide
    const guide = `# Supabase + D1 Connection Guide

## Your Setup

- **Supabase Project:** qmpghmthbhuumemnahcz
- **D1 Database ID:** ${D1_DATABASE_ID}
- **D1 Database Name:** meauxos

## Connection Methods

### 1. Via Supabase Edge Function (Recommended)

Create an edge function that proxies to D1:

\`\`\`typescript
// supabase/functions/d1-query/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { sql } = await req.json()
  
  const response = await fetch(
    \`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query\`,
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${Deno.env.get('CLOUDFLARE_API_TOKEN')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    }
  )
  
  return new Response(JSON.stringify(await response.json()))
})
\`\`\`

### 2. Via Cloudflare Worker

Your worker already has D1 access. Use it as an API:

\`\`\`javascript
// In your worker
app.post('/api/d1/query', async (c) => {
  const { sql } = await c.req.json()
  const result = await c.env.DB.prepare(sql).all()
  return c.json(result)
})
\`\`\`

### 3. Direct D1 API (From Supabase)

Use the D1 API directly from Supabase functions with your API token.

## Tables Found

${tableInfo.map(t => `- **${t.name}** (${t.schema.length} columns)`).join('\n')}

## Next Steps

1. Use the exported schema file to understand your database structure
2. Create Supabase edge functions to query D1
3. Set up proper authentication for D1 queries
4. Consider using the D1 wrapper you already have configured

## Resources

- D1 API Docs: https://developers.cloudflare.com/d1/api/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
`;
    
    const guidePath = path.join(__dirname, '..', 'SUPABASE_D1_CONNECTION_GUIDE.md');
    fs.writeFileSync(guidePath, guide);
    console.log(`📖 Connection guide created: ${guidePath}\n`);
}

main().catch(console.error);

