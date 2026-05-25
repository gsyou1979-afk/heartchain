<template>
  <div class="min-h-screen bg-[#FAF5FF]">
    <!-- 顶部 -->
    <div class="gradient-dark px-4 pt-4 pb-6">
      <div class="flex items-center gap-3 mb-6">
        <button @click="$router.back()" class="text-white text-lg">←</button>
        <span class="text-white font-semibold text-lg">🏆 我的成就</span>
      </div>

      <!-- 总览 -->
      <div class="text-center">
        <div class="text-white/60 text-sm mb-1">累计爱心积分</div>
        <div class="text-5xl font-bold text-white mb-1">{{ totalPoints.toLocaleString() }}</div>
        <div class="text-white/60 text-sm">❤️ Heart Points</div>
        <div class="flex justify-center gap-8 mt-5">
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ stats.totalHelps }}</div>
            <div class="text-white/50 text-xs">总帮助</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ stats.monthlyHelps }}</div>
            <div class="text-white/50 text-xs">本月</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">#{{ stats.rank }}</div>
            <div class="text-white/50 text-xs">排名</div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 -mt-3">
      <!-- 等级进度 -->
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-semibold text-gray-700">会员等级</span>
          <span class="text-sm font-bold text-[#7B1FA2]">{{ currentLevel.name }}</span>
        </div>
        <div class="bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
          <div class="gradient-primary h-full rounded-full transition-all" :style="{ width: levelProgress + '%' }"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400">
          <span>当前 {{ totalPoints.toLocaleString() }}</span>
          <span>下一级 {{ nextLevel.toLocaleString() }}</span>
        </div>
      </div>

      <!-- 成就徽章 -->
      <div class="card mb-4">
        <div class="text-sm font-semibold text-gray-700 mb-3">🏅 成就徽章</div>
        <div class="grid grid-cols-4 gap-3">
          <div v-for="badge in badges" :key="badge.code" class="text-center">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-1"
              :class="badge.unlocked ? 'shadow-md' : 'opacity-30 grayscale'"
              :style="badge.unlocked ? { background: badge.gradient } : { background: '#e0e0e0' }"
            >
              {{ badge.emoji }}
            </div>
            <div class="text-[10px] text-gray-500 leading-tight">{{ badge.name }}</div>
          </div>
        </div>
      </div>

      <!-- 本月统计 -->
      <div class="card mb-4">
        <div class="text-sm font-semibold text-gray-700 mb-3">📊 本月统计</div>
        <div class="flex gap-3">
          <div class="flex-1 bg-green-50 rounded-xl p-3 text-center">
            <div class="text-2xl font-bold text-green-600">{{ stats.monthlyHelps }}</div>
            <div class="text-xs text-gray-500">帮助次数</div>
          </div>
          <div class="flex-1 bg-purple-50 rounded-xl p-3 text-center">
            <div class="text-2xl font-bold text-[#7B1FA2]">{{ stats.monthlyPoints.toLocaleString() }}</div>
            <div class="text-xs text-gray-500">获得积分</div>
          </div>
          <div class="flex-1 bg-yellow-50 rounded-xl p-3 text-center">
            <div class="text-2xl font-bold text-[#FFB300]">{{ stats.avgRating }}</div>
            <div class="text-xs text-gray-500">平均评分</div>
          </div>
        </div>
      </div>

      <!-- 最近解锁 -->
      <div class="card mb-6">
        <div class="text-sm font-semibold text-gray-700 mb-3">🕐 最近解锁</div>
        <div class="space-y-3">
          <div v-for="badge in unlockedBadges.slice(0, 3)" :key="badge.code" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" :style="{ background: badge.gradient }">
              {{ badge.emoji }}
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ badge.name }}</div>
              <div class="text-xs text-gray-400">{{ badge.unlockedAt }}</div>
            </div>
            <span class="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">已解锁</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const totalPoints = ref(12400)
const stats = ref({
  totalHelps: 36,
  monthlyHelps: 12,
  monthlyPoints: 2400,
  avgRating: 4.9,
  rank: 3
})

const levels = [
  { level: 1, name: 'Lv.1 新手', points: 0 },
  { level: 2, name: 'Lv.2 志愿者', points: 1000 },
  { level: 3, name: 'Lv.3 热心市民', points: 5000 },
  { level: 4, name: 'Lv.4 爱心使者', points: 10000 },
  { level: 5, name: 'Lv.5 社区之星', points: 20000 },
  { level: 6, name: 'Lv.6 慈善家', points: 50000 },
]

const currentLevel = computed(() => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalPoints.value >= levels[i].points) return levels[i]
  }
  return levels[0]
})

const nextLevel = computed(() => {
  const idx = levels.findIndex(l => l.level === currentLevel.value.level)
  return idx < levels.length - 1 ? levels[idx + 1].points : currentLevel.value.points
})

const levelProgress = computed(() => {
  const current = currentLevel.value.points
  const next = nextLevel.value
  if (next === current) return 100
  return Math.round(((totalPoints.value - current) / (next - current)) * 100)
})

const badges = ref([
  { code: 'first_help', name: '首次帮助', emoji: '🌟', gradient: 'linear-gradient(135deg,#FFD700,#FFA000)', unlocked: true, unlockedAt: '2026.05.20' },
  { code: 'week_streak', name: '连续7天', emoji: '🌱', gradient: 'linear-gradient(135deg,#4CAF50,#8BC34A)', unlocked: true, unlockedAt: '2026.05.18' },
  { code: 'help_10', name: '帮助10次', emoji: '💎', gradient: 'linear-gradient(135deg,#2196F3,#03A9F4)', unlocked: true, unlockedAt: '2026.05.15' },
  { code: 'heart_ambassador', name: '爱心大使', emoji: '❤️', gradient: 'linear-gradient(135deg,#E91E63,#F06292)', unlocked: true, unlockedAt: '2026.05.10' },
  { code: 'monthly_top10', name: '月度Top10', emoji: '🔥', gradient: 'linear-gradient(135deg,#FF5722,#FF8A65)', unlocked: true, unlockedAt: '2026.05.01' },
  { code: 'lightning', name: '闪电响应', emoji: '⚡', gradient: 'linear-gradient(135deg,#9C27B0,#BA68C8)', unlocked: true, unlockedAt: '2026.05.22' },
  { code: 'help_50', name: '帮助50次', emoji: '🏅', gradient: 'linear-gradient(135deg,#FFB300,#FF8F00)', unlocked: false, unlockedAt: '' },
  { code: 'help_100', name: '帮助100次', emoji: '👑', gradient: 'linear-gradient(135deg,#FFD700,#FF6F00)', unlocked: false, unlockedAt: '' },
])

const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked))
</script>
