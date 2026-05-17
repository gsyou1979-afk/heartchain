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
    </section>

    <!-- Ad Banner: A1 -->
    <section class="py-8 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="homeAd" class="ad-home-banner" :style="{ backgroundImage: `url(${homeAd.imageUrl})` }">
          <span class="ad-badge">{{ homeAd.badge }}</span>
          <h3>{{ homeAd.title }}</h3>
          <p v-if="homeAd.description">{{ homeAd.description }}</p>
        </div>
        <div v-else class="ad-home-banner ad-home-banner--fallback">
          <span class="ad-badge">广告</span>
          <h3>广告位招商</h3>
          <p>欢迎投放广告，请联系管理员</p>
        </div>
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

useHead({ title: '哈特链 HeartChain - ' + '以爱心链接世界' });

const recentTasks = ref<any[]>([]);
const homeAd = ref<any>(null);

const stats = ref([
  { value: '0', label: 'home.stats.volunteers' },
  { value: '0', label: 'home.stats.tasks' },
  { value: '0', label: 'home.stats.points' },
  { value: '0', label: 'home.stats.teams' },
]);

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

async function fetchStats() {
  try {
    const res = await fetch(`${getApiUrl()}/stats`);
    if (res.ok) {
      const data = await res.json();
      stats.value = [
        { value: data.volunteers?.toLocaleString() || '0', label: 'home.stats.volunteers' },
        { value: data.tasks?.toLocaleString() || '0', label: 'home.stats.tasks' },
        { value: data.totalPoints?.toLocaleString() || '0', label: 'home.stats.points' },
        { value: data.completedTasks?.toLocaleString() || '0', label: 'home.stats.teams' },
      ];
    }
  } catch (e) {
    console.error('获取统计数据失败', e);
  }
}

async function fetchHomeAd() {
  try {
    const apiBase = getApiUrl();
    // Try requestAd first
    const reqRes = await fetch(`${apiBase}/ad/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placementCode: 'A1', deviceId: 'home', platform: 'web' }),
    });
    if (reqRes.ok) {
      const data = await reqRes.json();
      if (data.ads && data.ads.length > 0 && data.ads[0].imageUrl) {
        homeAd.value = data.ads[0];
        return;
      }
    }
    // Fallback: load from active campaigns + AdItems
    const campaignsRes = await fetch(`${apiBase}/ad/campaigns/active`);
    if (campaignsRes.ok) {
      const campaigns = await campaignsRes.json();
      for (const c of campaigns) {
        if (!c.placements || !c.placements.includes('A1')) continue;
        const itemsRes = await fetch(`${apiBase}/ad/items/campaign/${c.id}`);
        if (itemsRes.ok) {
          const items = await itemsRes.json();
          const item = items.find((i: any) => i.imageUrl && i.imageUrl.trim() !== '');
          if (item) {
            homeAd.value = {
              adType: 'commercial',
              title: c.name,
              description: '',
              imageUrl: item.imageUrl,
              landingUrl: item.landingUrl || '/',
              badge: '广告',
            };
            return;
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch home ad:', e);
  }
}

onMounted(() => {
  fetchRecentTasks();
  fetchStats();
  fetchHomeAd();
});
</script>

<style scoped>
.ad-home-banner {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
  color: white;
  overflow: hidden;
}
.ad-home-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
}
.ad-home-banner > * {
  position: relative;
  z-index: 1;
}
.ad-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: #3498db;
  color: white;
  margin-bottom: 8px;
}
.ad-home-banner h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}
.ad-home-banner p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}
.ad-home-banner--fallback {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #4a5568;
  border: 2px dashed #cbd5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.ad-home-banner--fallback .ad-badge {
  background: #a0aec0;
}
.ad-home-banner--fallback h3 {
  color: #2d3748;
}
.ad-home-banner--fallback p {
  color: #718096;
}
</style>
