// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  
  // 开发服务器配置
  devServer: {
    port: 3004,
    host: '0.0.0.0',
  },
  
  // 禁用 SSR - 解决开发环境代理问题
  ssr: false,
  
  // 启用 pages 路由（必须显式配置）
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
      title: '哈特链 HeartChain',
      htmlAttrs: { lang: 'zh' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '哈特链 HeartChain - 以爱心链接世界 | Blockchain-based Volunteer Service Platform' },
        { name: 'theme-color', content: '#ef4444' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // 生产环境使用 Render 后端地址（更新于 2026-05-10）
      apiBase: 'https://heartchain-backend.onrender.com/api/v1',
      appName: 'HeartChain',
    },
  },

  css: ['~/assets/css/main.css'],

  // 路由中间件
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
