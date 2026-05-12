export const useApi = () => {
  const config = useRuntimeConfig();

  // 客户端和服务端都使用 runtimeConfig 配置的后端地址
  // 开发环境可通过 NUXT_PUBLIC_API_BASE 环境变量覆盖
  const baseURL = 'https://heartchain-backend.onrender.com/api/v1';

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      if (import.meta.client) {
        const auth = localStorage.getItem('heartchain_auth');
        if (auth) {
          try {
            const parsed = JSON.parse(auth);
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${parsed.token}`,
            };
          } catch (e) { /* ignore */ }
        }
      }
    },
  });

  return api;
};
