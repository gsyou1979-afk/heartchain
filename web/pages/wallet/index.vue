<template>
  <div class="wallet-page">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand" @click="goHome">
          <span class="brand-icon">❤️</span>
          <span class="brand-text">HeartChain</span>
        </div>
        <div class="nav-links">
          <a @click="goPublish" class="nav-link">发布求助</a>
          <a @click="goHome" class="nav-link">首页</a>
          <a @click="goHelp" class="nav-link">说明</a>
        </div>
      </div>
    </nav>

    <div class="page-header">
      <h1 class="page-title">我的钱包</h1>
    </div>

    <div class="content">
      <!-- 余额卡片 -->
      <div class="balance-card">
        <div class="balance-main">
          <div class="balance-label">💎 可用余额</div>
          <div class="balance-amount">{{ wallet.availableBalance.toLocaleString() }}<span class="balance-unit">❤️</span></div>
        </div>
        <div class="balance-row">
          <div class="balance-item">
            <div class="num">{{ wallet.balance.toLocaleString() }}</div>
            <div class="label">总余额</div>
          </div>
          <div class="balance-item">
            <div class="num">{{ wallet.reservedBalance.toLocaleString() }}</div>
            <div class="label">冻结中</div>
          </div>
          <div class="balance-item">
            <div class="num">{{ (wallet.totalPoints || 0).toLocaleString() }}</div>
            <div class="label">累计获得</div>
          </div>
        </div>
      </div>

      <!-- 交易记录 -->
      <div class="section-title">📋 交易记录</div>

      <div class="filter-row">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >{{ f.label }}</button>
      </div>

      <div class="tx-list">
        <div class="tx-item" v-for="tx in filteredTransactions" :key="tx.id">
          <div class="tx-icon" :style="{ background: typeColor(tx.type) }">
            {{ typeIcon(tx.type) }}
          </div>
          <div class="tx-info">
            <div class="tx-title">{{ tx.description }}</div>
            <div class="tx-meta">
              <span class="tx-type-badge" :class="'badge-' + tx.type">{{ typeLabel(tx.type) }}</span>
              <span class="tx-date">{{ formatDate(tx.created_at) }}</span>
            </div>
          </div>
          <div class="tx-amount" :class="{ in: isIncome(tx.type), out: !isIncome(tx.type) }">
            {{ isIncome(tx.type) ? '+' : '-' }}{{ tx.amount }} ❤️
          </div>
        </div>

        <div v-if="filteredTransactions.length === 0" class="empty">暂无交易记录</div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <button class="action-btn" @click="goPublish">📢 发布新任务</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const currentUserId = 1

const wallet = reactive({
  balance: 0,
  reservedBalance: 0,
  availableBalance: 0,
  totalPoints: 0,
})

const transactions = ref<any[]>([])
const activeFilter = ref('all')

const filters = [
  { value: 'all', label: '全部' },
  { value: 'income', label: '收入' },
  { value: 'expense', label: '支出' },
  { value: 'mint', label: '系统铸造' },
  { value: 'publisher_reward', label: '发布人奖励' },
  { value: 'transfer', label: '转账' },
  { value: 'refund', label: '退款' },
]

const filteredTransactions = computed(() => {
  if (activeFilter.value === 'all') return transactions.value
  if (activeFilter.value === 'income') return transactions.value.filter(t => ['income','mint','transfer','refund','release','publisher_reward'].includes(t.type))
  if (activeFilter.value === 'expense') return transactions.value.filter(t => ['expense','reserve'].includes(t.type))
  return transactions.value.filter(t => t.type === activeFilter.value)
})

const TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; income: boolean }> = {
  income:           { label: '收入',     icon: '💰', color: '#dcfce7', income: true },
  expense:          { label: '支出',     icon: '💸', color: '#fee2e2', income: false },
  recharge:         { label: '充值',     icon: '💳', color: '#dbeafe', income: true },
  withdraw:         { label: '提现',     icon: '🏧', color: '#fef3c7', income: false },
  mint:             { label: '系统铸造', icon: '✨', color: '#f3e8ff', income: true },
  publisher_reward: { label: '发布人奖励', icon: '🎁', color: '#fef3c7', income: true },
  bonus:            { label: '额外奖励', icon: '🎁', color: '#dcfce7', income: true },
  transfer:         { label: '转账',     icon: '↔️', color: '#f3e8ff', income: true },
  refund:           { label: '退款',     icon: '🔙', color: '#dcfce7', income: true },
  reserve:          { label: '冻结',     icon: '🔒', color: '#fef3c7', income: false },
  release:          { label: '解冻',     icon: '🔓', color: '#dcfce7', income: true },
}

function typeLabel(type: string) { return TYPE_CONFIG[type]?.label ?? type }
function typeIcon(type: string) { return TYPE_CONFIG[type]?.icon ?? '📋' }
function typeColor(type: string) { return TYPE_CONFIG[type]?.color ?? '#f3f4f6' }
function isIncome(type: string) { return TYPE_CONFIG[type]?.income ?? true }

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function loadData() {
  try {
    const [wRes, tRes] = await Promise.all([
      fetch(`${apiBase}/users/${currentUserId}/wallet`),
      fetch(`${apiBase}/users/${currentUserId}/wallet/transactions`),
    ])
    if (wRes.ok) {
      const wData = await wRes.json()
      Object.assign(wallet, wData)
    }
    if (tRes.ok) {
      transactions.value = await tRes.json()
    }
  } catch (e) {
    console.error('Failed to load wallet data:', e)
  }
}

function goHome() { window.location.href = '/' }
function goPublish() { window.location.href = '/tasks/publish' }
function goHelp() { window.location.href = '/help' }

onMounted(loadData)
</script>

<style scoped>
.wallet-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.navbar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.brand-icon { font-size: 28px; }
.brand-text { font-size: 20px; font-weight: 800; color: #ef4444; }
.nav-links { display: flex; gap: 24px; }
.nav-link { font-size: 15px; color: #374151; cursor: pointer; font-weight: 500; }
.nav-link:hover { color: #ef4444; }

.page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 16px;
}
.page-title { font-size: 28px; font-weight: 800; color: #111827; }

.content { max-width: 800px; margin: 0 auto; padding: 0 24px 64px; }

.balance-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 28px;
  color: #fff;
  margin-bottom: 32px;
}
.balance-main { text-align: center; margin-bottom: 24px; }
.balance-label { font-size: 14px; opacity: 0.7; margin-bottom: 8px; }
.balance-amount { font-size: 42px; font-weight: 800; }
.balance-unit { font-size: 18px; opacity: 0.7; margin-left: 4px; }
.balance-row { display: flex; gap: 16px; }
.balance-item { flex: 1; text-align: center; padding: 12px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.balance-item .num { font-size: 20px; font-weight: 700; }
.balance-item .label { font-size: 12px; opacity: 0.6; margin-top: 4px; }

.section-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 16px; }

.filter-row { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  background: #f3f4f6;
  color: #6b7280;
  transition: all 0.2s;
}
.filter-btn.active { background: #ef4444; color: #fff; }
.filter-btn:hover:not(.active) { background: #e5e7eb; }

.tx-list { background: #fff; border-radius: 16px; border: 1px solid #e5e7eb; overflow: hidden; }
.tx-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}
.tx-item:last-child { border-bottom: none; }
.tx-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.tx-info { flex: 1; }
.tx-title { font-size: 14px; font-weight: 500; color: #374151; }
.tx-meta { display: flex; gap: 8px; align-items: center; margin-top: 4px; }
.tx-date { font-size: 12px; color: #9ca3af; }
.tx-type-badge { font-size: 10px; padding: 2px 8px; border-radius: 8px; }
.badge-mint { background: #f3e8ff; color: #7c3aed; }
.badge-publisher_reward { background: #fef3c7; color: #b45309; }
.badge-transfer { background: #dbeafe; color: #2563eb; }
.badge-refund { background: #dcfce7; color: #16a34a; }
.badge-income { background: #dcfce7; color: #16a34a; }
.badge-expense { background: #fee2e2; color: #dc2626; }
.badge-reserve { background: #fef3c7; color: #d97706; }
.tx-amount { font-size: 16px; font-weight: 600; }
.tx-amount.in { color: #16a34a; }
.tx-amount.out { color: #dc2626; }

.empty { text-align: center; padding: 48px; color: #9ca3af; font-size: 14px; }

.quick-actions { margin-top: 24px; }
.action-btn {
  width: 100%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .balance-row { flex-direction: column; }
}
</style>
