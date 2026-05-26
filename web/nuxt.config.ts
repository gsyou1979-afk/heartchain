// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  
  devServer: {
    port: 3004,
    host: '0.0.0.0',
  },
  
  ssr: false,
  pages: true,
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  app: {
    head: {
      title: 'HeartChain - 连接每一份爱心',
      htmlAttrs: { lang: 'zh' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'HeartChain - 基于地理位置的互助服务平台' },
        { name: 'theme-color', content: '#7B1FA2' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'HeartChain' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'format-detection', content: 'telephone=no' },
        // Open Graph
        { property: 'og:title', content: 'HeartChain - 连接每一份爱心' },
        { property: 'og:description', content: '基于地理位置的互助服务平台，发布求助，帮助他人' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_BASE || 'https://heartchain-backend.onrender.com/api/v1',
      appName: 'HeartChain',
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/admin/**': { ssr: false },
    '/profile/**': { ssr: false },
    '/mytasks/**': { ssr: false },
    '/wallet/**': { ssr: false },
  },

  colorMode: {
    classSuffix: '',
  },
});
