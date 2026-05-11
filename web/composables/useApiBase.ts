/**
 * 获取后端 API 基础地址
 * 根据当前域名判断环境，不依赖 runtimeConfig
 */
export const useApiBase = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://heartchain-backend.onrender.com/api/v1';
    }
  }
  return 'http://localhost:3002/api/v1';
};
