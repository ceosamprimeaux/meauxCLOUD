import type { Env } from '../types/env';

export class ResendService {
    private apiKey: string;
    private fromEmail: string;

    constructor(env: Env) {
        this.apiKey = env.RESEND_API_KEY || '';
        this.fromEmail = 'admin@meauxcloud.org'; // Verified domain
    }

    async sendEmail(to: string, subject: string, html: string) {
        if (!this.apiKey) {
            console.warn('RESEND_API_KEY is missing. Email would have been:', { to, subject });
            return { id: 'mock_id', success: true };
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                from: `MeauxCloud <${this.fromEmail}>`,
                to: [to],
                subject: subject,
                html: html
            })
        });

        if (!res.ok) {
            const error = await res.json() as any;
            throw new Error(error.message || 'Failed to send email');
        }

        return await res.json();
    }

    async sendInquiryNotification(data: { name: string; email: string; type: string; message: string }) {
        // Send to admin
        await this.sendEmail(
            'meauxbility@gmail.com',
            `New ${data.type} Inquiry from ${data.name}`,
            `
            <h1>New Inquiry Received</h1>
            <p><strong>Type:</strong> ${data.type}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${data.message}</blockquote>
            `
        );

        // Send confirmation to user
        await this.sendEmail(
            data.email,
            `We received your request: ${data.type}`,
            `
            <div style="font-family: sans-serif; color: #333;">
                <h1>Thanks for reaching out, ${data.name.split(' ')[0]}!</h1>
                <p>We have received your inquiry regarding <strong>${data.type}</strong>.</p>
                <p>Our team is reviewing your message and will get back to you shortly.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>The MeauxCloud Team</strong></p>
            </div>
            `
        );
    }
}
