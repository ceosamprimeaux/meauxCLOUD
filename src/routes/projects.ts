import { Hono } from 'hono';
import type { Env } from '../types/env';

const projects = new Hono<{ Bindings: Env }>();

// List all projects
projects.get('/', async (c) => {
    try {
        const { results } = await c.env.DB.prepare(
            'SELECT * FROM projects ORDER BY created_at DESC'
        ).all();
        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// Create a new project
projects.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const id = crypto.randomUUID();
        const now = Date.now();

        // Validate basics
        if (!body.name) return c.json({ error: 'Name is required' }, 400);

        const { success } = await c.env.DB.prepare(
            `INSERT INTO projects (id, name, description, status, priority, budget, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            body.name,
            body.description || '',
            body.status || 'active',
            body.priority || 'medium',
            body.budget || 0,
            now,
            now
        ).run();

        if (!success) {
            return c.json({ error: 'Failed to create project' }, 500);
        }

        return c.json({ id, ...body, created_at: now }, 201);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// Delete a project
projects.delete('/:id', async (c) => {
    const id = c.req.param('id');
    await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
    return c.json({ success: true });
});

export default projects;
