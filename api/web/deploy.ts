const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function setCors(res: any) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { config } = req.body;

    return res.status(200).json({
      success: true,
      siteUrl: `https://${config.nombreSitio.toLowerCase().replace(/ /g, '-')}.pages.dev`,
      message: 'Deploy simulado en Cloudflare Pages',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error en deploy simulado' });
  }
}