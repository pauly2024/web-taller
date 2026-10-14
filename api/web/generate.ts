const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function setCors(res: any) {
  Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

const tallerDefault = {
  nombre: "Taller Ejemplo",
  rubro: "Automotriz",
  servicios: [
    "Mantenimiento y reparación",
    "Diagnóstico computarizado",
    "Cambio de aceite",
    "Neumáticos",
  ],
  whatsapp: "+1 809-555-1234",
  direccion: "Av. Principal #123, Ciudad",
  horario: "Lun-Vie 8:00-18:00, Sáb 9:00-13:00",
  calificacion: 4.5,
  reviews: 128,
  valorPropuesta: "Atención rápida y precios justos para tu vehículo",
};

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use req.body directly - Vercel parses JSON automatically
  const body = req.body || {};

  console.log('generate: received body', body);

  const { leadData, packageType, packagePrice } = body;

  console.log('generate: parsed', { leadData, packageType, packagePrice });

  let sitioConfig = {};

  switch (packageType) {
    case 'basico':
      sitioConfig = {
        nombreSitio: `${leadData?.nombre || 'Taller'} Web Basico`,
        descripcion: 'Sitio web corporativo para taller automotriz',
        serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
        paquete: 'Basico',
        precio: packagePrice || 'Desde $299',
        whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
        cta: 'Agendar cita por WhatsApp',
      };
      break;
    case 'pro':
      sitioConfig = {
        nombreSitio: `${leadData?.nombre || 'Taller'} Web Pro`,
        descripcion: 'Sitio web con agendamiento y sistema de citas',
        serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
        paquete: 'Pro',
        precio: packagePrice || 'Desde $499',
        whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
        cta: 'Agendar cita por WhatsApp',
        features: [
          'Sistema de citas en línea',
          'Gallery de trabajos',
          'WhatsApp Business integrado',
        ],
      };
      break;
    case 'premium':
      sitioConfig = {
        nombreSitio: `${leadData?.nombre || 'Taller'} Web Premium`,
        descripcion: 'Sitio web completo con IA y automatización',
        serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
        paquete: 'Premium',
        precio: packagePrice || 'Desde $799',
        whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
        cta: 'Chatear por WhatsApp',
        features: [
          'Agente IA WhatsApp 24/7',
          'Sistema de citas inteligente',
          'Gallery profesional',
          'SEO optimizado local',
          'Integración CRM',
        ],
      };
      break;
    default:
      sitioConfig = {
        nombreSitio: `${leadData?.nombre || 'Taller'} Web`,
        descripcion: 'Sitio web para taller',
        serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
        paquete: 'Basico',
        precio: packagePrice || 'Desde $299',
        whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
        cta: 'Contactar',
      };
  }

  return res.status(200).json({
    success: true,
    siteUrl: `/sitio/${Date.now()}`,
    config: sitioConfig,
    message: `Sitio ${packageType} generado para ${leadData?.nombre || 'taller'}`,
  });
}