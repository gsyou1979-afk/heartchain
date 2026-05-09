/**
 * 权限指令
 * 用法: v-permission="'admin'" 或 v-permission="['admin', 'organization']"
 */
export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()

  nuxtApp.vueApp.directive('permission', {
    mounted(el, binding) {
      const value = binding.value
      const userRole = auth.user?.role

      if (!userRole) {
        el.style.display = 'none'
        return
      }

      // 如果是字符串，转为数组
      const allowedRoles = Array.isArray(value) ? value : [value]

      // admin 角色拥有所有权限
      if (userRole === 'admin' || allowedRoles.includes(userRole)) {
        el.style.display = ''
      } else {
        el.style.display = 'none'
      }
    },
    updated(el, binding) {
      const value = binding.value
      const userRole = auth.user?.role

      if (!userRole) {
        el.style.display = 'none'
        return
      }

      const allowedRoles = Array.isArray(value) ? value : [value]

      if (userRole === 'admin' || allowedRoles.includes(userRole)) {
        el.style.display = ''
      } else {
        el.style.display = 'none'
      }
    },
  })
})
