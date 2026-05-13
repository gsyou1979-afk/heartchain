<template>
  <div>
    <!-- Hero Section -->
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
              {{ '立即开始' }}
            </NuxtLink>
            <a href="#how-it-works" class="inline-flex items-center justify-center px-8 py-3 border-2 border-white/50 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              {{ $t('home.howItWorks') }}
            </a>
          </div>
        </div>
      </div>
      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>

    <!-- Ad Banner: 首页横幅 (A1=hero) -->
    <section class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="A1" />
      </div>
    </section>

    <!-- Stats -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-red-500">{{ stat.value }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ $t(stat.label) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ad Banner: 首页信息流广告 (C1=feed) -->
    <section class="py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="C1" />
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">{{ $t('home.howItWorks') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-red-500">{{ index + 1 }}</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ $t(step.title) }}</h3>
            <p class="text-sm text-gray-500">{{ $t(step.desc) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ad Banner: 首页底部横幅 (D1=footer) -->
    <section class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="D1" />
      </div>
    </section>

    <!-- Recent Tasks Preview -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">{{ $t('nav.tasks') }}</h2>
          <NuxtLink to="/tasks" class="text-red-500 hover:text-red-600 text-sm font-medium">
            {{ $t('common.more') }} →
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="task in recentTasks" :key="task.id" class="card hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="badge" :class="'badge-' + task.taskType">{{ getTaskTypeLabel(task.taskType) }}</span>
              <span class="text-sm text-gray-400">{{ task.pointsReward }} HRT</span>
            </div>
            <h3 class="font-semibold mb-2">{{ task.title }}</h3>
            <p class="text-sm text-gray-500 mb-3 line-clamp-2">{{ task.description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ task.location || '不限地点' }}</span>
              <NuxtLink to="/tasks" class="text-sm text-red-500 hover:text-red-600">{{ $t('task.accept') }}</NuxtLink>
            </div>
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
import { getApiUrl } from '~/utils/api';
import AdBanner from '~/components/ad/AdBanner.vue'

useHead({ title: '哈特链 HeartChain - ' + '以爱心链接世界' });

const recentTasks = ref<any[]>([]);

const stats = [
  { value: '1,000+', label: 'home.stats.volunteers' },
  { value: '5,000+', label: 'home.stats.tasks' },
  { value: '100K+', label: 'home.stats.points' },
  { value: '50+', label: 'home.stats.teams' },
];

const steps = [
  { title: 'home.step1', desc: 'home.step1Desc' },
  { title: 'home.step2', desc: 'home.step2Desc' },
  { title: 'home.step3', desc: 'home.step3Desc' },
  { title: 'home.step4', desc: 'home.step4Desc' },
];

const taskTypeLabels: Record<string, string> = {
  single_once: '单人单次',
  single_multi: '单人多次',
  team_once: '团队单次',
  team_multi: '团队多次',
};

function getTaskTypeLabel(type: string) {
  return taskTypeLabels[type] || type;
}

async function fetchRecentTasks() {
  try {
    const res = await fetch(`${getApiUrl()}/tasks?status=open&limit=3`);
    if (res.ok) {
      const data = await res.json();
      recentTasks.value = data.items || [];
    }
  } catch (e) {
    console.error('获取任务失败', e);
  }
}

onMounted(() => {
  fetchRecentTasks();
});
</script>
