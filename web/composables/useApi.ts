export const useApi = () => {
  const config = useRuntimeConfig();

  // 开发环境直接连接后端3000端口
  const baseURL = import.meta.client 
    ? 'http://localhost:3000/api/v1' 
    : config.public.apiBase as string;

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
