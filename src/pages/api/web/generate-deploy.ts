import type { APIRoute } from 'astro';

import { tallerDefault } from '../../data/taller';

interface LeadData {
  nombre?: string;
  rubro?: string;
  servicios?: string[];
  whatsapp?: string;
  direccion?: string;
  horario?: string;
  calificacion?: number;
  reviews?: number;
  sitioWeb?: string;
  galeria?: string[];
  valorPropuesta?: string;
}

interface DeployRequest {
  leadData: LeadData;
  packageType: 'basico' | 'pro' | 'premium';
  packagePrice?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSiteConfig(leadData: LeadData, packageType: string, packagePrice?: string) {
  const nombre = leadData.nombre || tallerDefault.nombre;
  const servicios = leadData.servicios || tallerDefault.servicios;
  const whatsapp = leadData.whatsapp || tallerDefault.whatsapp;
  const direccion = leadData.direccion || tallerDefault.direccion;
  const horario = leadData.horario || tallerDefault.horario;
  const calificacion = leadData.calificacion || tallerDefault.calificacion;
  const reviews = leadData.reviews || tallerDefault.reviews;
  const valorPropuesta = leadData.valorPropuesta || tallerDefault.valorPropuesta;

  const baseConfig = {
    nombreSitio: `${nombre} Web ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}`,
    descripcion: `Sitio web para ${nombre}`,
    serviciosDestacados: servicios,
    paquete: packageType.charAt(0).toUpperCase() + packageType.slice(1),
    precio: packagePrice || 'Desde $299',
    whatsapp,
    direccion,
    horario,
    calificacion,
    reviews,
    valorPropuesta,
    cta: 'Agendar cita por WhatsApp',
  };

  switch (packageType) {
    case 'pro':
      return {
        ...baseConfig,
        features: [
          'Sistema de citas en línea',
          'Galería de trabajos',
          'WhatsApp Business integrado',
        ],
      };
    case 'premium':
      return {
        ...baseConfig,
        cta: 'Chatear por WhatsApp',
        features: [
          'Agente IA WhatsApp 24/7',
          'Sistema de citas inteligente',
          'Galería profesional',
          'SEO optimizado local',
          'Integración CRM',
        ],
      };
    default:
      return baseConfig;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const POST: APIRoute = async ({ request }) => {
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

  let body: DeployRequest = { leadData: {}, packageType: 'basico' };
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

  const { leadData, packageType, packagePrice } = body;

  if (!leadData || !packageType) {
    return new Response(JSON.stringify({ success: false, error: 'Datos requeridos: leadData, packageType' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const nombre = leadData.nombre || tallerDefault.nombre;
    const slug = `taller-${slugify(nombre)}-${Date.now()}`;
    const config = generateSiteConfig(leadData, packageType, packagePrice);

    // Simulated deploy - returns a preview URL
    const siteUrl = `https://${slug}.vercel.app`;

    return new Response(JSON.stringify({
      success: true,
      siteUrl,
      config,
      deploymentId: slug,
      message: `Sitio ${packageType} generado y desplegado para ${nombre}`,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error generando/deployando sitio:', error);
    return new Response(JSON.stringify({ success: false, error: error.message || 'Error generando o deployando sitio' }), {
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