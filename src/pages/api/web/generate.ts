import type { APIRoute } from "astro";
import { tallerDefault } from "../../../data/taller";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { leadData, packageType, packagePrice } = body;

    // Determinar el tipo de sitio según el paquete
    let sitioConfig: any = {};

    switch (packageType) {
      case "basico":
        sitioConfig = {
          nombreSitio: `${leadData?.nombre || "Taller"} Web Basico`,
          descripcion: "Sitio web corporativo para taller automotriz",
          serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
          paquete: "Basico",
          precio: packagePrice || "Desde $299",
          whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
          cta: "Agendar cita por WhatsApp",
        };
        break;
      case "pro":
        sitioConfig = {
          nombreSitio: `${leadData?.nombre || "Taller"} Web Pro`,
          descripcion: "Sitio web con agendamiento y sistema de citas",
          serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
          paquete: "Pro",
          precio: packagePrice || "Desde $499",
          whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
          cta: "Agendar cita por WhatsApp",
          features: [
            "Sistema de citas en línea",
            "Gallery de trabajos",
            "WhatsApp Business integrado",
          ],
        };
        break;
      case "premium":
        sitioConfig = {
          nombreSitio: `${leadData?.nombre || "Taller"} Web Premium`,
          descripcion: "Sitio web completo con IA y automatización",
          serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
          paquete: "Premium",
          precio: packagePrice || "Desde $799",
          whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
          cta: "Chatear por WhatsApp",
          features: [
            "Agente IA WhatsApp 24/7",
            "Sistema de citas inteligente",
            "Gallery profesional",
            "SEO optimizado local",
            "Integración CRM",
          ],
        };
        break;
      default:
        sitioConfig = {
          nombreSitio: `${leadData?.nombre || "Taller"} Web`,
          descripcion: "Sitio web para taller",
          serviciosDestacados: leadData?.servicios || tallerDefault.servicios,
          paquete: "Basico",
          precio: packagePrice || "Desde $299",
          whatsapp: leadData?.whatsapp || tallerDefault.whatsapp,
          cta: "Contactar",
        };
    }

    return new Response(
      JSON.stringify({
        success: true,
        siteUrl: `/sitio/${Date.now()}`,
        config: sitioConfig,
        message: `Sitio ${packageType} generado para ${leadData?.nombre || "taller"}`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Error generating site config" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: "Use POST to generate site config" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
};