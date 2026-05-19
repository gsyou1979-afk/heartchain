<template>
  <div>
    <!-- Hero Section - Ad Banner below -->
    <section class="relative bg-gradient-to-br from-red-500 via-pink-500 to-orange-400 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            哈特链 - 以爱心链接世界
          </h1>
          <p class="text-lg md:text-xl text-white/90 mb-8">
            让善意可视化，让爱心永流传
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/auth/register" class="inline-flex items-center justify-center px-8 py-3 bg-white text-red-500 font-bold rounded-lg hover:bg-gray-50 transition-colors">
              立即开始
            </NuxtLink>
            <a href="#how-it-works" class="inline-flex items-center justify-center px-8 py-3 border-2 border-white/50 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              了解更多
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Ad Banner A1 - 直接写死，避免 tree shaking -->
    <section class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientOnly>
          <AdBanner placement="A1" />
        </ClientOnly>
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-red-500">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">如何使用</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-red-500">{{ index + 1 }}</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-sm text-gray-500">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Tasks -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">任务大厅</h2>
          <NuxtLink to="/tasks" class="text-red-500 hover:text-red-600 text-sm font-medium">查看更多 →</NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="task in recentTasks" :key="task.id" class="card hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="badge">{{ task.taskType }}</span>
              <span class="text-sm text-gray-400">{{ task.pointsReward }} HRT</span>
            </div>
            <h3 class="font-semibold mb-2">{{ task.title }}</h3>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ task.description }}</p>
          </div>
          <div v-if="recentTasks.length === 0" class="col-span-3 text-center py-8 text-gray-400">
            暂无任务，去任务大厅发布吧！
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getApiUrl } from '~/utils/api'
import AdBanner from '~/components/ad/AdBanner.vue'

useHead({ title: '哈特链 HeartChain - 以爱心链接世界' })

const recentTasks = ref<any[]>([])
const stats = ref([
  { value: '0', label: '志愿者' },
  { value: '0', label: '任务' },
  { value: '0', label: '积分' },
  { value: '0', label: '团队' },
])
const steps = [
  { title: '注册账号', desc: '创建你的志愿者账户' },
  { title: '接任务', desc: '选择感兴趣的志愿服务' },
  { title: '完成任务', desc: '参与服务并获得积分' },
  { title: '获得奖励', desc: '积分可兑换各种奖励' },
]

async function fetchRecentTasks() {
  try {
    const res = await fetch(`${getApiUrl()}/tasks?status=open&limit=3`)
    if (res.ok) {
      const data = await res.json()
      recentTasks.value = data.items || []
    }
  } catch (e) {
    console.error('获取任务失败', e)
  }
}

async function fetchStats() {
  try {
    const res = await fetch(`${getApiUrl()}/stats`)
    if (res.ok) {
      const data = await res.json()
      stats.value = [
        { value: data.volunteers?.toLocaleString() || '0', label: '志愿者' },
        { value: data.tasks?.toLocaleString() || '0', label: '任务' },
        { value: data.totalPoints?.toLocaleString() || '0', label: '积分' },
        { value: data.completedTasks?.toLocaleString() || '0', label: '团队' },
      ]
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
}

onMounted(() => {
  fetchRecentTasks()
  fetchStats()
})
</script>
