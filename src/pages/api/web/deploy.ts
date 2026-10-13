import type { APIRoute } from "astro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { config } = body;

    return new Response(
      JSON.stringify({
        success: true,
        siteUrl: `https://${config.nombreSitio.toLowerCase().replace(/ /g, "-")}.pages.dev`,
        message: "Deploy simulado en Cloudflare Pages",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error en deploy simulado" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: "Use POST to deploy" }),
    { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
};