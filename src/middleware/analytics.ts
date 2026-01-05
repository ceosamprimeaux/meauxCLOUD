/**
 * Analytics Engine Middleware
 * 
 * Automatically tracks all requests to Analytics Engine for:
 * - Performance monitoring
 * - Error tracking
 * - Usage analytics
 * - Cost attribution
 */

import type { Context, Next } from 'hono';
import type { Env } from '@/types/env';

export async function analyticsMiddleware(
    c: Context<{ Bindings: Env }>,
    next: Next
) {
    const start = Date.now();
    const request = c.req.raw;
    const url = new URL(request.url);

    // Process the request
    await next();

    const duration = Date.now() - start;
    const response = c.res;

    // Track to Analytics Engine (non-blocking)
    c.executionCtx.waitUntil(
        trackRequest(c.env, {
            method: request.method,
            path: url.pathname,
            status: response.status,
            duration,
            userAgent: request.headers.get('user-agent') || 'unknown',
            cfRay: request.headers.get('cf-ray') || 'unknown',
            contentLength: parseInt(response.headers.get('content-length') || '0'),
            environment: c.env.ENVIRONMENT || 'production'
        })
    );
}

interface RequestMetrics {
    method: string;
    path: string;
    status: number;
    duration: number;
    userAgent: string;
    cfRay: string;
    contentLength: number;
    environment: string;
}

async function trackRequest(env: Env, metrics: RequestMetrics) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            // Blobs (strings) - up to 20
            blobs: [
                metrics.method,           // blob1: HTTP method
                metrics.path,             // blob2: Request path
                metrics.status.toString(), // blob3: Status code
                metrics.environment,      // blob4: Environment
            ],
            // Doubles (numbers) - up to 20
            doubles: [
                metrics.duration,         // double1: Duration in ms
                1,                        // double2: Request count
                metrics.contentLength,    // double3: Response size
            ],
            // Indexes (for fast filtering) - up to 20
            indexes: [
                metrics.cfRay,            // index1: Cloudflare Ray ID
            ]
        });
    } catch (error) {
        // Don't fail the request if analytics fails
        console.error('Analytics tracking failed:', error);
    }
}

/**
 * Track custom events to Analytics Engine
 */
export async function trackEvent(
    env: Env,
    eventType: string,
    eventData: {
        category?: string;
        action?: string;
        label?: string;
        value?: number;
        metadata?: Record<string, string | number>;
    }
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'custom-event',
                eventType,
                eventData.category || 'general',
                eventData.action || 'unknown',
                eventData.label || '',
            ],
            doubles: [
                eventData.value || 1,
                Date.now(),
            ],
            indexes: [
                eventType,
                eventData.category || 'general',
            ]
        });
    } catch (error) {
        console.error('Event tracking failed:', error);
    }
}

/**
 * Track project costs
 */
export async function trackProjectCost(
    env: Env,
    projectId: string,
    costType: 'time' | 'ai' | 'compute' | 'storage',
    amount: number,
    metadata?: {
        description?: string;
        userId?: string;
    }
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'project-cost',
                projectId,
                costType,
                metadata?.description || '',
                metadata?.userId || 'system',
            ],
            doubles: [
                amount,                   // Cost in USD
                1,                        // Event count
                Date.now(),
            ],
            indexes: [
                projectId,
                costType,
            ]
        });
    } catch (error) {
        console.error('Cost tracking failed:', error);
    }
}

/**
 * Track AI usage
 */
export async function trackAIUsage(
    env: Env,
    model: string,
    tokens: number,
    cost: number,
    projectId?: string
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'ai-usage',
                model,
                projectId || 'unknown',
                'tokens',
            ],
            doubles: [
                tokens,
                cost,
                1,                        // Request count
            ],
            indexes: [
                model,
                projectId || 'unknown',
            ]
        });
    } catch (error) {
        console.error('AI usage tracking failed:', error);
    }
}

/**
 * Track errors
 */
export async function trackError(
    env: Env,
    errorType: string,
    errorMessage: string,
    path: string,
    metadata?: {
        userId?: string;
        projectId?: string;
        stack?: string;
    }
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'error',
                errorType,
                path,
                errorMessage.substring(0, 100), // Truncate long messages
                metadata?.projectId || 'unknown',
            ],
            doubles: [
                1,                        // Error count
                Date.now(),
            ],
            indexes: [
                errorType,
                metadata?.projectId || 'unknown',
            ]
        });
    } catch (error) {
        console.error('Error tracking failed:', error);
    }
}

/**
 * Track user events (login, signup, etc.)
 */
export async function trackUserEvent(
    env: Env,
    userId: string,
    eventType: 'login' | 'logout' | 'signup' | 'password-reset' | 'profile-update',
    metadata?: {
        method?: string; // e.g., 'google-oauth', 'github-oauth', 'email'
        success?: boolean;
    }
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'user-event',
                eventType,
                userId,
                metadata?.method || 'unknown',
                metadata?.success ? 'success' : 'failure',
            ],
            doubles: [
                1,                        // Event count
                Date.now(),
            ],
            indexes: [
                userId,
                eventType,
            ]
        });
    } catch (error) {
        console.error('User event tracking failed:', error);
    }
}

/**
 * Track resource usage (Workers, R2, D1, etc.)
 */
export async function trackResourceUsage(
    env: Env,
    resourceType: 'worker' | 'r2' | 'd1' | 'durable-object' | 'ai',
    resourceId: string,
    usage: {
        requests?: number;
        bytes?: number;
        duration?: number;
        cost?: number;
    }
) {
    try {
        await env.ANALYTICS_ENGINE.writeDataPoint({
            blobs: [
                'resource-usage',
                resourceType,
                resourceId,
            ],
            doubles: [
                usage.requests || 0,
                usage.bytes || 0,
                usage.duration || 0,
                usage.cost || 0,
            ],
            indexes: [
                resourceType,
                resourceId,
            ]
        });
    } catch (error) {
        console.error('Resource usage tracking failed:', error);
    }
}
