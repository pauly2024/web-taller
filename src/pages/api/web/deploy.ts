import type { APIRoute } from 'astro';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function setCors(res: Response) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.headers.set(key, value));
}

export const POST: APIRoute = async ({ request }) => {
  setCors(new Response());

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Parse JSON body
  let body: any = {};
  try {
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    }
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { config } = body;

  if (!config) {
    return new Response(JSON.stringify({ success: false, error: 'Config required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Simulated deploy - returns a preview URL
    const siteUrl = `https://${config.nombreSitio.toLowerCase().replace(/ /g, '-')}.vercel.app`;
    
    return new Response(JSON.stringify({
      success: true,
      siteUrl,
      message: 'Deploy simulado en Vercel',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message || 'Error en deploy' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};