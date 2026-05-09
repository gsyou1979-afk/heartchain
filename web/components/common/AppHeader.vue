<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">
            哈特链
            <span class="text-xs text-gray-400 ml-1">HeartChain</span>
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            active-class="!text-red-500 !bg-red-50"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center space-x-3">
          <template v-if="!isLoggedIn">
            <NuxtLink to="/auth/login" class="btn-secondary text-sm">登录</NuxtLink>
            <NuxtLink to="/auth/register" class="btn-primary text-sm">注册</NuxtLink>
          </template>
          <template v-else>
            <!-- 头像 -->
            <NuxtLink to="/profile" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-red-500">{{ user?.nickname?.charAt(0) || 'U' }}</span>
              </div>
              <span class="text-sm text-gray-700 hidden sm:inline">{{ user?.nickname }}</span>
            </NuxtLink>
            <!-- 退出按钮 -->
            <button 
              @click="handleLogout" 
              class="px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              退出
            </button>
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
          active-class="!text-red-500"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();

// 确保客户端启动时恢复登录状态
onMounted(() => {
  auth.restore();
  console.log('AppHeader mounted, isLoggedIn:', auth.isLoggedIn, 'user:', auth.user);
});

// 监听登录状态变化，确保 UI 及时更新
const isLoggedIn = computed(() => auth.isLoggedIn);
const user = computed(() => auth.user);

// 退出登录
const handleLogout = () => {
  auth.logout();
  router.push('/');
};

const navItems = computed(() => {
  const items = [
    { to: '/', label: '首页' },
    { to: '/tasks', label: '任务大厅' },
  ];
  if (auth.isLoggedIn) {
    items.push(
      { to: '/mytasks', label: '我的任务' },
      { to: '/wallet', label: '成就' }
    );
    // 管理员显示后台入口
    if (auth.user?.role === 'admin') {
      items.push({ to: '/admin', label: '管理后台' });
    }
  } else {
    items.push({ to: '/heart-board', label: '爱心榜' });
  }
  return items;
});
</script>
