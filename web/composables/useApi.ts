export const useApi = () => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
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
