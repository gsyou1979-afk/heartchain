/**
 * 获取后端 API 基础地址
 * 
 * Nuxt runtimeConfig 在 SPA 模式下客户端可能注入不正确，
 * 所以直接用环境变量 + 默认值双重保障
 */
export const useApiBase = (): string => {
  // 优先使用 Nuxt runtimeConfig
  try {
    const config = useRuntimeConfig();
    const apiBase = config.public?.apiBase as string;
    if (apiBase && apiBase.includes('://')) {
      return apiBase;
    }
  } catch {}

  // Fallback: 根据当前域名判断环境
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // 生产环境（Vercel 部署）
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://heartchain-backend.onrender.com/api/v1';
    }
  }

  // 本地开发
  return 'http://localhost:3002/api/v1';
};
