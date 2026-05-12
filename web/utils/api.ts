/**
 * API 基础地址
 * 纯函数，不依赖任何框架（Nuxt/Pinia），不使用 composable
 * 可在 <script setup>、Pinia store、任意 JS 上下文中安全调用
 */
export function getApiUrl(): string {
  return 'https://heartchain-backend.onrender.com/api/v1';
}
