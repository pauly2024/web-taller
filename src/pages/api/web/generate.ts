import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { tallerDefault } from "@/src/data/taller";

const app = new Hono();

app.post("/generate", (c) => {
  const body = await c.req.json();

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

  // Retornar configuración para generar el sitio
  return c.json({
    success: true,
    siteUrl: `/sitio/${Date.now()}`,
    config: sitioConfig,
    message: `Sitio ${packageType} generado para ${leadData?.nombre || "taller"}`,
  });
});

app.post("/deploy", (c) => {
  // Endpoint simulado para deploy en Cloudflare Pages
  const body = await c.req.json();
  const { config } = body;

  return c.json({
    success: true,
    siteUrl: `https://${config.nombreSitio.toLowerCase().replace(/ /g, "-")}.pages.dev`,
    message: "Deploy simulado en Cloudflare Pages",
  });
});

export const GET = app.get;
export const POST = app.post;