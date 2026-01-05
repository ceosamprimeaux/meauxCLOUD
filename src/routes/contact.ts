import { Hono } from 'hono';
import type { Env } from '../types/env';
import { ResendService } from '../services/resend';

const app = new Hono<{ Bindings: Env }>();

app.post('/inquiry', async (c) => {
    try {
        const body = await c.req.json();
        const { name, email, type, message } = body;

        // Validation
        if (!name || !email || !message) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        // Send Emails
        const resend = new ResendService(c.env);
        await resend.sendInquiryNotification({ name, email, type, message });

        // Store in DB (optional but good practice)
        try {
            await c.env.DB.prepare(
                'INSERT INTO inquiries (name, email, type, message, status) VALUES (?, ?, ?, ?, ?)'
            ).bind(name, email, type, message, 'new').run();
        } catch (dbError) {
            console.error('Failed to save inquiry to DB:', dbError);
            // Don't fail the request if DB fails, as email was sent
        }

        return c.json({ success: true, message: 'Inquiry received!' });

    } catch (e: any) {
        console.error('Inquiry Error:', e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;
