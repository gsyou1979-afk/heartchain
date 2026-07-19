export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'HeartChain - 哈特链',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'HeartChain 互助平台 - 发布求助，获得奖励' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://heartchain-backend.onrender.com',
    },
  },
  nitro: { preset: 'vercel' },
})
