/**
 * API 基础地址
 * 优先使用 runtimeConfig 中的 apiBase（支持环境变量覆盖）
 * 回退到生产环境地址
 */
export function getApiUrl(): string {
  // 在 Nuxt 上下文中使用 runtimeConfig
  try {
    const config = useRuntimeConfig();
    if (config?.public?.apiBase) {
      return config.public.apiBase;
    }
  } catch {
    // 非 Nuxt 上下文（如 Pinia store）时使用默认值
  }
  return 'https://heartchain-backend.onrender.com/api/v1';
}
