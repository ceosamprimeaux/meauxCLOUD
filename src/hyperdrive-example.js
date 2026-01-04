/**
 * Hyperdrive Usage Examples
 * How to use Hyperdrive for Supabase PostgreSQL queries in your Worker
 */

// Example 1: Simple Query
export async function simpleQuery(c) {
    const hyperdrive = c.env.HYPERDRIVE;
    
    try {
        const client = await hyperdrive.connect();
        const result = await client.query('SELECT NOW() as current_time');
        
        return c.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Hyperdrive query error:', error);
        return c.json({ error: error.message }, 500);
    }
}

// Example 2: Query with Parameters
export async function queryWithParams(c) {
    const hyperdrive = c.env.HYPERDRIVE;
    const { userId } = await c.req.json();
    
    try {
        const client = await hyperdrive.connect();
        const result = await client.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        
        return c.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Hyperdrive query error:', error);
        return c.json({ error: error.message }, 500);
    }
}

// Example 3: Complex Join Query
export async function complexQuery(c) {
    const hyperdrive = c.env.HYPERDRIVE;
    
    try {
        const client = await hyperdrive.connect();
        const result = await client.query(`
            SELECT 
                u.id,
                u.email,
                u.name,
                COUNT(p.id) as project_count
            FROM users u
            LEFT JOIN projects p ON p.owner_id = u.id
            GROUP BY u.id, u.email, u.name
            ORDER BY project_count DESC
            LIMIT 10
        `);
        
        return c.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Hyperdrive query error:', error);
        return c.json({ error: error.message }, 500);
    }
}

// Example 4: Transaction
export async function transactionExample(c) {
    const hyperdrive = c.env.HYPERDRIVE;
    const { userId, projectName } = await c.req.json();
    
    try {
        const client = await hyperdrive.connect();
        
        await client.query('BEGIN');
        
        try {
            // Insert project
            const projectResult = await client.query(
                'INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING id',
                [projectName, userId]
            );
            
            const projectId = projectResult.rows[0].id;
            
            // Update user stats
            await client.query(
                'UPDATE users SET project_count = project_count + 1 WHERE id = $1',
                [userId]
            );
            
            await client.query('COMMIT');
            
            return c.json({
                success: true,
                projectId
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Hyperdrive transaction error:', error);
        return c.json({ error: error.message }, 500);
    }
}

// Example 5: Use Hyperdrive as Fallback for D1
export async function hybridQuery(c) {
    const db = c.env.DB; // D1
    const hyperdrive = c.env.HYPERDRIVE; // PostgreSQL via Hyperdrive
    
    try {
        // Try D1 first (faster for simple queries)
        try {
            const d1Result = await db.prepare('SELECT * FROM users LIMIT 10').all();
            return c.json({
                success: true,
                source: 'D1',
                data: d1Result.results
            });
        } catch (d1Error) {
            // Fallback to Hyperdrive/PostgreSQL
            console.log('D1 query failed, using Hyperdrive:', d1Error.message);
            
            const client = await hyperdrive.connect();
            const result = await client.query('SELECT * FROM users LIMIT 10');
            
            return c.json({
                success: true,
                source: 'Hyperdrive',
                data: result.rows
            });
        }
    } catch (error) {
        console.error('Query error:', error);
        return c.json({ error: error.message }, 500);
    }
}

// Example 6: Add to your existing worker routes
export function addHyperdriveRoutes(app) {
    // Simple health check
    app.get('/api/hyperdrive/health', async (c) => {
        const hyperdrive = c.env.HYPERDRIVE;
        
        try {
            const client = await hyperdrive.connect();
            const result = await client.query('SELECT NOW() as time, version() as pg_version');
            
            return c.json({
                status: 'healthy',
                hyperdrive: 'connected',
                timestamp: result.rows[0].time,
                postgres_version: result.rows[0].pg_version
            });
        } catch (error) {
            return c.json({
                status: 'error',
                error: error.message
            }, 500);
        }
    });
    
    // Query endpoint
    app.post('/api/hyperdrive/query', async (c) => {
        const hyperdrive = c.env.HYPERDRIVE;
        const { sql, params = [] } = await c.req.json();
        
        try {
            const client = await hyperdrive.connect();
            const result = await client.query(sql, params);
            
            return c.json({
                success: true,
                rows: result.rows,
                rowCount: result.rowCount
            });
        } catch (error) {
            console.error('Hyperdrive query error:', error);
            return c.json({
                success: false,
                error: error.message
            }, 500);
        }
    });
}

