import vercel from '@astrojs/vercel';

/** @type {import('astro').Config} */
export default {
  integrations: [],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  output: 'hybrid',
}