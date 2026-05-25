<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-xl">❤️</span>
          <span class="text-lg font-bold text-[#1A1a2e]">HeartChain</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            active-class="!text-[#7B1FA2] !bg-purple-50"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center space-x-3">
          <template v-if="!isLoggedIn">
            <NuxtLink to="/auth/register" class="btn-primary text-sm py-2 px-4">注册</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/profile" class="flex items-center space-x-2">
              <div class="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ user?.nickname?.charAt(0) || 'U' }}</span>
              </div>
              <span class="text-sm text-gray-700 hidden sm:inline">{{ user?.nickname }}</span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden border-t border-gray-100">
      <div class="flex items-center justify-around py-2">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex flex-col items-center space-y-1 px-3 py-1 text-xs text-gray-500"
          active-class="!text-[#7B1FA2]"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

onMounted(() => { auth.restore() })

const isLoggedIn = computed(() => auth.isLoggedIn)
const user = computed(() => auth.user)

const navItems = computed(() => {
  const items = [
    { to: '/', label: '首页' },
    { to: '/tasks', label: '任务' },
    { to: '/achievement', label: '成就' },
  ]
  if (auth.isLoggedIn) {
    items.push({ to: '/wallet', label: '钱包' })
    if (auth.user?.role === 'admin') {
      items.push({ to: '/admin', label: '后台' })
    }
  }
  return items
})
</script>
