import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // Parse JSON body for API routes
  if (context.request.method === 'POST' && context.url.pathname.startsWith('/api/')) {
    const contentType = context.request.headers.get('content-type');
    console.log('[Middleware] POST to API:', context.url.pathname, 'Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const body = await context.request.json();
        console.log('[Middleware] Parsed body:', body);
        // Store parsed body in context.locals for API routes to use
        context.locals.body = body;
      } catch (e) {
        console.error('[Middleware] JSON parse error:', e);
        return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  }
  
  return next();
});