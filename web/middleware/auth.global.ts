/**
 * 路由守卫中间件
 * 用于保护需要登录或特定角色的页面
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  // 公开页面 - 无需登录
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/tasks',
    '/heart-board',
  ]

  // 需要登录的页面
  const authRequired = [
    '/mytasks',
    '/profile',
    '/wallet',
    '/admin',
  ]

  // 需要管理员角色的页面
  const adminRequired = [
    '/admin',
  ]

  // 公开页面直接放行
  if (publicPaths.some(path => to.path === path || to.path.startsWith(path + '/'))) {
    return
  }

  // 检查是否需要登录
  if (authRequired.some(path => to.path.startsWith(path))) {
    const token = auth.token || (import.meta.client ? JSON.parse(localStorage.getItem('heartchain_auth') || '{}')?.token : null)
    if (!token && !auth.isLoggedIn) {
      return navigateTo('/auth/login')
    }
  }

  // 检查是否需要管理员权限
  if (adminRequired.some(path => to.path.startsWith(path))) {
    if (auth.user?.role !== 'admin') {
      alert('您没有管理员权限')
      return navigateTo('/')
    }
  }
})

