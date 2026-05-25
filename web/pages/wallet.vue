<template>
  <div class="min-h-screen bg-[#FAF5FF]">
    <!-- 顶部 -->
    <div class="gradient-dark px-4 pt-4 pb-6">
      <div class="flex items-center gap-3 mb-5">
        <button @click="$router.back()" class="text-white text-lg">←</button>
        <span class="text-white font-semibold text-lg">我的钱包</span>
      </div>

      <!-- Tab切换 -->
      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          :class="activeTab === tab.key ? 'bg-white text-[#1A1a2e]' : 'bg-white/15 text-white/70'"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="px-4 -mt-3">
      <!-- Tab 1: 余额 -->
      <template v-if="activeTab === 'balance'">
        <div class="card mb-4 text-center py-6">
          <div class="text-sm text-gray-500 mb-1">账户余额</div>
          <div class="text-4xl font-bold text-[#1A1a2e]">₩{{ wallet.balance.toLocaleString() }}</div>
        </div>

        <div class="grid grid-cols-4 gap-3 mb-4">
          <button class="flex flex-col items-center gap-1.5 p-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">💳</div>
            <span class="text-xs text-gray-600">充值</span>
          </button>
          <button class="flex flex-col items-center gap-1.5 p-3">
            <div class="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-xl">🏧</div>
            <span class="text-xs text-gray-600">提现</span>
          </button>
          <button class="flex flex-col items-center gap-1.5 p-3">
            <div class="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">💸</div>
            <span class="text-xs text-gray-600">转账</span>
          </button>
          <button class="flex flex-col items-center gap-1.5 p-3">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-xl">📊</div>
            <span class="text-xs text-gray-600">明细</span>
          </button>
        </div>

        <!-- 交易记录 -->
        <div class="text-sm font-semibold text-gray-700 mb-3">最近交易</div>
        <div class="space-y-2">
          <div v-for="tx in transactions" :key="tx.id" class="card flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              :class="tx.direction === 'in' ? 'bg-green-50' : 'bg-red-50'">
              {{ tx.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ tx.title }}</div>
              <div class="text-xs text-gray-400">{{ tx.date }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold" :class="tx.direction === 'in' ? 'text-green-600' : 'text-red-500'">
                {{ tx.direction === 'in' ? '+' : '-' }}₩{{ tx.amount.toLocaleString() }}
              </div>
              <div class="text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5"
                :class="tx.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'">
                {{ tx.status === 'completed' ? '已完成' : '处理中' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Tab 2: 积分 -->
      <template v-if="activeTab === 'points'">
        <div class="card mb-4 text-center py-6" style="background: linear-gradient(135deg, #7B1FA2, #6A1B9A);">
          <div class="text-white/60 text-sm mb-1">❤️ 爱心积分</div>
          <div class="text-4xl font-bold text-white">{{ wallet.points.toLocaleString() }}</div>
          <div class="text-white/60 text-sm mt-1">可抵扣 ₩{{ wallet.points.toLocaleString() }}</div>
        </div>

        <!-- 兑换比例 -->
        <div class="card mb-4">
          <div class="text-sm font-semibold text-gray-700 mb-3">积分兑换</div>
          <div class="flex gap-3">
            <div class="flex-1 bg-purple-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-[#7B1FA2]">100❤️</div>
              <div class="text-xs text-gray-500">= ₩100</div>
            </div>
            <div class="flex-1 bg-purple-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-[#7B1FA2]">1,000❤️</div>
              <div class="text-xs text-gray-500">= ₩1,100</div>
            </div>
            <div class="flex-1 bg-purple-50 rounded-xl p-3 text-center">
              <div class="text-lg font-bold text-[#7B1FA2]">10,000❤️</div>
              <div class="text-xs text-gray-500">= ₩12,000</div>
            </div>
          </div>
          <button class="w-full btn-primary mt-3">兑换积分</button>
        </div>

        <div class="text-sm font-semibold text-gray-700 mb-3">积分记录</div>
        <div class="space-y-2">
          <div v-for="tx in pointTransactions" :key="tx.id" class="card flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-purple-50">❤️</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ tx.title }}</div>
              <div class="text-xs text-gray-400">{{ tx.date }}</div>
            </div>
            <div class="text-sm font-semibold text-[#7B1FA2]">+{{ tx.points }}❤️</div>
          </div>
        </div>
      </template>

      <!-- Tab 3: 记录 -->
      <template v-if="activeTab === 'history'">
        <div class="flex gap-2 mb-4">
          <button v-for="f in ['all', 'in', 'out']" :key="f"
            @click="historyFilter = f"
            class="px-4 py-2 rounded-full text-xs font-semibold transition-all"
            :class="historyFilter === f ? 'bg-[#7B1FA2] text-white' : 'bg-gray-100 text-gray-600'"
          >
            {{ f === 'all' ? '全部' : f === 'in' ? '收入' : '支出' }}
          </button>
        </div>

        <div class="space-y-2">
          <div v-for="tx in filteredHistory" :key="tx.id" class="card flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              :class="tx.direction === 'in' ? 'bg-green-50' : 'bg-red-50'">
              {{ tx.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium truncate">{{ tx.title }}</div>
              <div class="text-xs text-gray-400">{{ tx.date }}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold" :class="tx.direction === 'in' ? 'text-green-600' : 'text-red-500'">
                {{ tx.direction === 'in' ? '+' : '-' }}{{ tx.points ? tx.points + '❤️' : '₩' + tx.amount?.toLocaleString() }}
              </div>
              <div class="text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5"
                :class="tx.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'">
                {{ tx.status === 'completed' ? '已完成' : '处理中' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = [
  { key: 'balance', label: '余额', icon: '💰' },
  { key: 'points', label: '积分', icon: '❤️' },
  { key: 'history', label: '记录', icon: '📋' },
]
const activeTab = ref('balance')
const historyFilter = ref('all')

const wallet = ref({
  balance: 125000,
  points: 12400,
})

const transactions = ref([
  { id: 1, icon: '✋', title: '帮助买药', date: '今天 14:30', amount: 5000, direction: 'in', status: 'completed' },
  { id: 2, icon: '💳', title: '充值', date: '今天 10:15', amount: 50000, direction: 'in', status: 'completed' },
  { id: 3, icon: '🏧', title: '提现', date: '昨天 18:20', amount: 20000, direction: 'out', status: 'pending' },
  { id: 4, icon: '✋', title: '帮忙搬行李', date: '昨天 09:45', amount: 8000, direction: 'in', status: 'completed' },
])

const pointTransactions = ref([
  { id: 1, title: '帮助买药', date: '今天 14:30', points: 200 },
  { id: 2, title: '帮忙搬行李', date: '昨天 09:45', points: 350 },
  { id: 3, title: '教老人用手机', date: '5月20日', points: 150 },
  { id: 4, title: '月度Top10奖励', date: '5月1日', points: 1000 },
])

const allHistory = computed(() => {
  const txs = [
    ...transactions.value.map(t => ({ ...t, icon: t.icon })),
    ...pointTransactions.value.map(t => ({ ...t, direction: 'in', icon: '❤️', points: t.points, amount: 0, status: 'completed' })),
  ]
  return txs.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return allHistory.value
  return allHistory.value.filter(t => t.direction === historyFilter.value)
})
</script>
