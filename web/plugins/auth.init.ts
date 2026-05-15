/**
 * Pinia Auth Store 初始化插件
 * 功能：在客户端启动时从 localStorage 恢复登录状态
 * 触发时机：每次 Nuxt 应用初始化时（页面切换也会触发）
 */
export default defineNuxtPlugin(async () => {
  // 仅在客户端执行
  if (import.meta.client) {
    const auth = useAuthStore();
    await auth.restore();
  }
});
