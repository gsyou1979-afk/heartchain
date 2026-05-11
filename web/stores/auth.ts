import { defineStore } from 'pinia';

interface User {
  id: string;
  phone: string;
  nickname: string;
  role: string;
  region: string;
  email?: string;
  creditScore?: number;
  pointBalance?: number;
}

// API 地址：通过 useApiBase composable 获取（有域名判断 fallback）
const getApiBase = useApiBase as any;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    token: null as string | null,
  }),

  actions: {
    async loginWithPhone(phone: string, password: string) {
      const response = await fetch(`${getApiBase()}/auth/password-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }

      const data = await response.json();
      // 处理不同的响应格式
      const user = data.user || data;
      const token = data.accessToken || data.token;
      this.setAuth(user, token, data.refreshToken);
      
      // 立即获取最新的用户信息（包含技能等）
      await this.fetchCurrentUser();
    },

    async fetchCurrentUser() {
      if (!this.token) return;
      
      try {
        const response = await fetch(`${getApiBase()}/users/me`, {
          headers: { 'Authorization': `Bearer ${this.token}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          this.user = userData;
          
          // 更新 localStorage
          if (import.meta.client) {
            localStorage.setItem('heartchain_auth', JSON.stringify({ 
              user: userData, 
              token: this.token 
            }));
          }
        }
      } catch (e) {
        console.error('获取用户信息失败', e);
      }
    },

    login(user: User, token?: string) {
      this.isLoggedIn = true;
      this.user = user;
      this.token = token || 'dev-token';

      if (import.meta.client) {
        localStorage.setItem('heartchain_auth', JSON.stringify({ user, token: this.token }));
      }
    },

    setAuth(user: User, accessToken: string, refreshToken?: string) {
      this.isLoggedIn = true;
      this.user = user;
      this.token = accessToken;

      if (import.meta.client) {
        localStorage.setItem('heartchain_auth', JSON.stringify({ user, token: accessToken }));
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.token = null;

      if (import.meta.client) {
        localStorage.removeItem('heartchain_auth');
      }
    },

    async restore() {
      if (import.meta.client) {
        const data = localStorage.getItem('heartchain_auth');
        if (data) {
          try {
            const parsed = JSON.parse(data);
            
            // 验证用户是否仍然存在于后端
            if (parsed.user?.id && parsed.token) {
              try {
                const response = await fetch(`${getApiBase()}/users/${parsed.user.id}`, {
                  headers: { 'Authorization': `Bearer ${parsed.token}` }
                });
                
                if (response.ok) {
                  const userData = await response.json();
                  this.isLoggedIn = true;
                  this.user = userData;
                  this.token = parsed.token;
                  
                  // 更新本地存储的用户信息
                  localStorage.setItem('heartchain_auth', JSON.stringify({ 
                    user: userData, 
                    token: parsed.token 
                  }));
                } else {
                  // 用户不存在，清除 localStorage
                  localStorage.removeItem('heartchain_auth');
                }
              } catch {
                // 网络错误，保持本地状态
                this.isLoggedIn = true;
                this.user = parsed.user;
                this.token = parsed.token;
              }
            }
          } catch (e) {
            localStorage.removeItem('heartchain_auth');
          }
        }
      }
    },
  },
});
