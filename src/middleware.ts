import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Parse JSON body for API routes
  if (context.request.method === 'POST' && context.url.pathname.startsWith('/api/')) {
    const contentType = context.request.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const body = await context.request.json();
        // Store parsed body in context.locals for API routes to use
        context.locals.body = body;
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }
  
  return next();
});