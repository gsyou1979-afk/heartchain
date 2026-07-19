// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  devtools: { enabled: true },
  
  // 开发服务器配置
  devServer: {
    port: 3001,
    host: '0.0.0.0', // Listen on all interfaces for service mode
  },
  
  // SSR Mode - Windows에서 Vite Node IPC 문제 해결을 위해 활성화
  // ssr: false, // 주석 처리 - 기본값(true) 사용
  
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
      // 开发环境直接连后端，绕过代理问题
      apiBase: 'http://localhost:3002/api/v1',
      appName: 'HeartChain',
    },
  },

  // Nitro 설정 간소화 - Vite Node IPC 문제 해결
  nitro: {
    // devProxy 제거 - apiBase로 직접 연결하므로 불필요
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
