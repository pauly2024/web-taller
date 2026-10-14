import { tallerDefault } from "../data/taller";

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

interface DeployResponse {
  success: boolean;
  siteUrl?: string;
  config?: any;
  deploymentId?: string;
  error?: string;
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

async function deployToVercel(config: any, slug: string): Promise<{ url: string; deploymentId: string } | null> {
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelTeamId = process.env.VERCEL_TEAM_ID;

  if (!vercelToken) {
    console.warn('VERCEL_TOKEN no configurado, usando modo simulación');
    return null;
  }

  try {
    // Crear archivos del proyecto para deploy
    const files = [
      {
        file: 'package.json',
        data: JSON.stringify({
          name: `taller-${slug}`,
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'astro dev',
            build: 'astro build',
            preview: 'astro preview',
          },
          dependencies: {
            astro: '^5.0.0',
            tailwindcss: '^3.4.0',
            '@astrojs/tailwind': '^5.1.0',
            '@astrojs/vercel': '^8.0.0',
          },
        }, null, 2),
      },
      {
        file: 'astro.config.mjs',
        data: `import vercel from '@astrojs/vercel';\n\nexport default {\n  integrations: [],\n  adapter: vercel(),\n  output: 'static',\n};`,
      },
      {
        file: 'tailwind.config.cjs',
        data: `/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],\n  theme: {\n    extend: {\n      colors: {\n        taller: {\n          primary: '#1e40af',\n          secondary: '#059669',\n          accent: '#f59e0b',\n          background: '#f8fafc',\n          card: '#ffffff',\n          border: '#e2e8f0',\n        },\n      },\n    },\n  },\n  plugins: [],\n};`,
      },
      {
        file: 'src/pages/index.astro',
        data: generateAstroPage(config),
      },
      {
        file: 'src/env.d.ts',
        data: `/// <reference types="astro/client" />`,
      },
    ];

    const deployBody = {
      name: `taller-${slug}`,
      files: files.map(f => ({ file: f.file, data: Buffer.from(f.data).toString('base64') })),
      target: 'production',
      projectSettings: {
        framework: 'astro',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        devCommand: 'npm run dev',
        installCommand: 'npm install',
      },
    };

    const url = vercelTeamId
      ? `https://api.vercel.com/v13/deployments?teamId=${vercelTeamId}`
      : 'https://api.vercel.com/v13/deployments';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deployBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Vercel API:', data);
      return null;
    }

    // Vercel devuelve URL inmediatamente para preview deployments
    const deploymentUrl = data.url
      ? `https://${data.url}`
      : `https://${data.name}.vercel.app`;

    return {
      url: deploymentUrl,
      deploymentId: data.id || data.uid || slug,
    };
  } catch (error) {
    console.error('Error deployando a Vercel:', error);
    return null;
  }
}

function generateAstroPage(config: any): string {
  const whatsappClean = config.whatsapp.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappClean}`;

  return `---
import { tallerDefault } from "../data/taller.js";
const config = ${JSON.stringify(config, null, 2)};
---

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>\${config.nombreSitio} - Generado por DigiMarket RD</title>
    <meta name="description" content="\${config.descripcion}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              taller: {
                primary: "#1e40af",
                secondary: "#059669",
                accent: "#f59e0b",
                background: "#f8fafc",
                card: "#ffffff",
                border: "#e2e8f0",
              },
            },
          },
        },
      };
    </script>
  </head>
  <body class="bg-taller-background text-taller-primary antialiased">
    <div class="min-h-screen">
      <header class="border-b border-taller-border bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-xl font-bold">DigiMarket RD</span>
            </div>
            <nav>
              <ul class="flex gap-6 text-sm">
                <li><a href="#servicios" class="hover:text-taller-primary transition">Servicios</a></li>
                <li><a href="#about" class="hover:text-taller-primary transition">Sobre</a></li>
                <li>
                  <a
                    href="\${whatsappUrl}"
                    class="bg-taller-primary text-white px-4 py-2 rounded hover:bg-white text-taller-primary transition font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    \${config.cta}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-['JetBrains_Mono'] font-bold tracking-tighter mb-4">
            \${config.nombreSitio}
          </h1>
          <p class="text-lg text-taller-secondary mb-6">
            \${config.valorPropuesta}
          </p>

          <div id="servicios" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            \${config.serviciosDestacados.map(
              (servicio: string, i: number) => \`
              <div class="bg-taller-card border border-taller-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div class="flex items-start gap-3">
                  <span class="w-6 h-6 rounded bg-taller-accent text-taller-primary flex items-center justify-center text-xs font-medium">
                    \${i + 1}
                  </span>
                  <div>
                    <p class="font-medium">\${servicio}</p>
                  </div>
                </div>
              </div>
            \`
            ).join('')}
          </div>

          \${config.features ? \`
          <section id="features" class="mt-12">
            <h2 class="text-2xl font-bold mb-6">Características incluidas</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              \${config.features.map((feature: string) => \`
                <div class="bg-taller-card border border-taller-border rounded-lg p-4">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded bg-taller-secondary text-white flex items-center justify-center">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </span>
                    <p>\${feature}</p>
                  </div>
                </div>
              \`).join('')}
            </div>
          </section>
          \` : ''}

          <section id="about" class="mt-12">
            <h2 class="text-2xl font-bold mb-4">Información de Contacto</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-taller-card border border-taller-border rounded-lg p-6">
                <h3 class="font-semibold mb-3">📍 Dirección</h3>
                <p>\${config.direccion}</p>
              </div>
              <div class="bg-taller-card border border-taller-border rounded-lg p-6">
                <h3 class="font-semibold mb-3">🕐 Horario</h3>
                <p>\${config.horario}</p>
              </div>
              <div class="bg-taller-card border border-taller-border rounded-lg p-6">
                <h3 class="font-semibold mb-3">⭐ Valoración</h3>
                <p>\${config.calificacion}★ (\${config.reviews} reseñas)</p>
              </div>
              <div class="bg-taller-card border border-taller-border rounded-lg p-6">
                <h3 class="font-semibold mb-3">📦 Paquete</h3>
                <p>\${config.paquete} - \${config.precio}</p>
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer class="border-t border-taller-border bg-white py-4">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center text-sm text-taller-secondary">
            <p>2026 DigiMarket RD - Todos los derechos reservados</p>
            <div class="flex gap-3">
              <a
                href="\${whatsappUrl}"
                class="hover:text-taller-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.488.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.402c-.669 0-4.295-3.074-4.295-6.08 0-1.313.536-3.142 1.346-4.778.81-1.637 1.883-2.923 3.276-3.951.297-.212 1.154-.52 1.255-.546.1-.013.247.075.297.212.05.149.099.497.099.866 0 .419-.212.708-.625.906-.236.106-.563.298-.69.497-.173.199-.372.579-.508.934-.212.536-.372 1.254-.372 1.528 0 .298.458.669.719.907.26.237.396.474.396.844 0 .297-.086.52-.16.669-.106.226-.247.498-.653 1.074-.406.577-.968 1.448-1.622 2.564-.653 1.115-1.548 2.074-2.542 2.779-.946.673-1.68.87-2.087.87z"></path>
                </svg>
              </a>
              <a href="#" class="hover:text-taller-primary transition">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </body>
</html>`;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { leadData, packageType, packagePrice }: DeployRequest = req.body;

    if (!leadData || !packageType) {
      return res.status(400).json({
        success: false,
        error: 'Datos requeridos: leadData, packageType'
      });
    }

    const nombre = leadData.nombre || tallerDefault.nombre;
    const slug = `taller-${slugify(nombre)}-${Date.now()}`;
    const config = generateSiteConfig(leadData, packageType, packagePrice);

    // Intentar deploy real a Vercel
    const vercelResult = await deployToVercel(config, slug);

    let siteUrl: string;
    let deploymentId: string;

    if (vercelResult) {
      siteUrl = vercelResult.url;
      deploymentId = vercelResult.deploymentId;
    } else {
      // Fallback: URL de preview simulada (para desarrollo local)
      siteUrl = `https://taller-${slug}.vercel.app`;
      deploymentId = `local-${slug}`;
    }

    return res.status(200).json({
      success: true,
      siteUrl,
      config,
      deploymentId,
      message: \`Sitio \${packageType} generado y desplegado para \${nombre}\`,
    });
  } catch (error) {
    console.error('Error generando/deployando sitio:', error);
    return res.status(500).json({
      success: false,
      error: 'Error generando o deployando sitio'
    });
  }
}