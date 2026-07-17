export default defineNuxtConfig({ devtools: { enabled: false }, modules: ['@nuxtjs/tailwindcss'], app: { head: { title: 'HeartChain' } }, nitro: { preset: 'vercel' } })
