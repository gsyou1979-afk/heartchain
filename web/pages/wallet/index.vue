<template>
  <div class="wallet-page">
    <header class="header">
      <span class="back" @click="$router.back()">←</span>
      <span class="title">我的钱包</span>
    </header>

    <div class="content">
      <!-- 잔고 카드 -->
      <div class="balance-card">
        <div class="balance-label">💎 可用余额</div>
        <div class="balance-amount">{{ wallet.balance }}<span class="balance-unit">❤️</span></div>
        <div class="balance-row">
          <div class="balance-item">
            <div class="num">{{ wallet.reservedBalance }}</div>
            <div class="label">冻结中</div>
          </div>
          <div class="balance-item">
            <div class="num">{{ wallet.availableBalance }}</div>
            <div class="label">可用</div>
          </div>
          <div class="balance-item">
            <div class="num">{{ wallet.totalPoints }}</div>
            <div class="label">累计</div>
          </div>
        </div>
      </div>

      <!-- 거래 내역 -->
      <div class="section-title">📋 交易记录</div>

      <!-- 타입 필터 -->
      <div class="filter-row">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >{{ f.label }}</button>
      </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

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
  { value: 'transfer', label: '转账' },
  { value: 'refund', label: '退款' },
]

const filteredTransactions = computed(() => {
  if (activeFilter.value === 'all') return transactions.value
  if (activeFilter.value === 'income') return transactions.value.filter(t => ['income','mint','transfer','refund','release'].includes(t.type))
  if (activeFilter.value === 'expense') return transactions.value.filter(t => ['expense','reserve'].includes(t.type))
  return transactions.value.filter(t => t.type === activeFilter.value)
})

const TYPE_CONFIG: Record<string, { label: string; icon: string; color: string; income: boolean }> = {
  income:    { label: '收入',   icon: '💰', color: '#E8F5E9', income: true },
  expense:   { label: '支出',   icon: '💸', color: '#FCE4EC', income: false },
  recharge:  { label: '充值',   icon: '💳', color: '#E3F2FD', income: true },
  withdraw:  { label: '提现',   icon: '🏧', color: '#FFF3E0', income: false },
  mint:      { label: '系统铸造', icon: '✨', color: '#F3E5F5', income: true },
  bonus:     { label: '额外奖励', icon: '🎁', color: '#E8F5E9', income: true },
  transfer:  { label: '转账',   icon: '↔️', color: '#F3E5F5', income: true },
  refund:    { label: '退款',   icon: '🔙', color: '#E8F5E9', income: true },
  reserve:   { label: '冻结',   icon: '🔒', color: '#FFF3E0', income: false },
  release:   { label: '解冻',   icon: '🔓', color: '#E8F5E9', income: true },
}

function typeLabel(type: string) { return TYPE_CONFIG[type]?.label ?? type }
function typeIcon(type: string) { return TYPE_CONFIG[type]?.icon ?? '📋' }
function typeColor(type: string) { return TYPE_CONFIG[type]?.color ?? '#f0f0f0' }
function isIncome(type: string) { return TYPE_CONFIG[type]?.income ?? true }

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

async function loadData() {
  const [wRes, tRes] = await Promise.all([
    fetch(`/api/users/${currentUserId}/wallet`),
    fetch(`/api/users/${currentUserId}/wallet/transactions`),
  ])
  const wData = await wRes.json()
  Object.assign(wallet, wData)
  transactions.value = await tRes.json()
}

onMounted(loadData)
</script>

<style scoped>
.wallet-page { max-width:420px; margin:0 auto; background:#fff; min-height:100vh; }
.header { background:linear-gradient(135deg,#1A1A2E,#16213E); color:#fff; padding:16px 20px; display:flex; align-items:center; gap:16px; }
.header .back { font-size:18px; cursor:pointer; }
.header .title { font-size:16px; font-weight:600; }
.content { padding:20px; }
.balance-card { background:linear-gradient(135deg,#1A1A2E,#16213E); border-radius:16px; padding:24px; color:#fff; margin-bottom:24px; }
.balance-label { font-size:13px; opacity:.7; margin-bottom:4px; }
.balance-amount { font-size:36px; font-weight:800; }
.balance-unit { font-size:16px; opacity:.7; margin-left:4px; }
.balance-row { display:flex; gap:12px; margin-top:16px; }
.balance-item { flex:1; text-align:center; }
.balance-item .num { font-size:20px; font-weight:700; }
.balance-item .label { font-size:11px; opacity:.6; }
.section-title { font-size:14px; font-weight:600; margin-bottom:12px; }
.filter-row { display:flex; gap:6px; margin-bottom:16px; flex-wrap:wrap; }
.filter-btn { padding:6px 12px; border-radius:14px; border:none; font-size:12px; cursor:pointer; background:#f5f5f5; color:#666; }
.filter-btn.active { background:#7B1FA2; color:#fff; }
.tx-item { display:flex; align-items:center; gap:12px; padding:14px 0; border-bottom:1px solid #f0f0f0; }
.tx-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; }
.tx-info { flex:1; }
.tx-title { font-size:14px; font-weight:500; color:#333; }
.tx-meta { display:flex; gap:8px; align-items:center; margin-top:4px; }
.tx-date { font-size:12px; color:#888; }
.tx-type-badge { font-size:10px; padding:1px 6px; border-radius:8px; }
.badge-mint { background:#F3E5F5; color:#7B1FA2; }
.badge-transfer { background:#E3F2FD; color:#1976D2; }
.badge-refund { background:#E8F5E9; color:#388E3C; }
.badge-income { background:#E8F5E9; color:#388E3C; }
.badge-expense { background:#FCE4EC; color:#D32F2F; }
.badge-reserve { background:#FFF3E0; color:#F57C00; }
.tx-amount { font-size:15px; font-weight:600; }
.tx-amount.in { color:#4CAF50; }
.tx-amount.out { color:#F44336; }
.empty { text-align:center; padding:40px; color:#999; font-size:14px; }
</style>
