/**
 * 获取后端 API 基础地址
 * 生产环境: Render 后端
 * 开发环境: localhost:3002
 */
export const useApiBase = () => {
  const config = useRuntimeConfig();
  return (config.public?.apiBase as string) || 'http://localhost:3002/api/v1';
};
