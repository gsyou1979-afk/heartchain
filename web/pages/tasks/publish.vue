<template>
  <div class="publish-page">
    <header class="header">
      <span class="back" @click="goBack">←</span>
      <span class="title">发布求助</span>
    </header>

    <div class="content">
      <!-- 1. 작업 성격 (카테고리) -->
      <label>任务类型</label>
      <div class="type-grid">
        <div
          v-for="t in categories"
          :key="t.value"
          class="type-btn"
          :class="{ selected: form.category === t.value }"
          @click="form.category = t.value"
        >
          <div class="icon">{{ t.icon }}</div>
          <div class="name">{{ t.name }}</div>
        </div>
      </div>

      <!-- 2. 제목 / 설명 -->
      <label>任务标题</label>
      <input v-model="form.title" class="input" placeholder="简短描述你的需求，如：帮忙买药" />

      <label>详细描述</label>
      <textarea v-model="form.description" class="input" placeholder="详细说明任务内容、注意事项等..."></textarea>

      <!-- 3. 평가용 필드 -->
      <label>需要学历 / 资格水平</label>
      <select v-model="form.educationLevel" class="input">
        <option value="none">无要求</option>
        <option value="highschool">高中</option>
        <option value="college">大专</option>
        <option value="university">本科</option>
        <option value="professional">专业资格</option>
      </select>

      <label>预计完成时间（小时）</label>
      <input v-model.number="form.estimatedHours" type="number" min="0.5" step="0.5" class="input" />

      <label>要求信用等级（1~5）</label>
      <input v-model.number="form.requiredCreditScore" type="number" min="1" max="5" class="input" />

      <label>要求经验值</label>
      <input v-model.number="form.requiredExperience" type="number" min="0" class="input" />

      <!-- 4. 平台自动评估 -->
      <div class="eval-box" v-if="evaluation">
        <div class="eval-label">🤖 平台自动评估</div>
        <div class="eval-row">
          <div class="eval-item">
            <div class="eval-item-label">任务生成积分</div>
            <div class="eval-amount">{{ evaluation.baseReward }} ❤️</div>
            <div class="eval-item-hint">完成者获得</div>
          </div>
          <div class="eval-divider">+</div>
          <div class="eval-item highlight">
            <div class="eval-item-label">发布人奖励积分</div>
            <div class="eval-amount">{{ evaluation.publisherReward }} ❤️</div>
            <div class="eval-item-hint">你将获得</div>
          </div>
        </div>
        <div class="eval-detail">
          <span>类型 {{ evaluation.breakdown.categoryScore }}</span>
          <span>学历 {{ evaluation.breakdown.educationScore }}</span>
          <span>时间 {{ evaluation.breakdown.timeScore }}</span>
          <span>信用 {{ evaluation.breakdown.creditScore }}</span>
          <span>经验 {{ evaluation.breakdown.experienceScore }}</span>
        </div>
      </div>

      <!-- 5. 추가 보상 (선택) -->
      <label>额外奖励（可选）</label>
      <div class="bonus-row">
        <input
          v-model.number="form.bonusPoints"
          type="number"
          min="0"
          class="reward-input"
          :disabled="!canAddBonus"
          placeholder="0"
        />
        <span class="reward-unit">❤️</span>
      </div>
      <p class="hint" v-if="canAddBonus">
        想让任务优先被处理？可追加额外奖励（将从你的钱包冻结）
      </p>
      <p class="hint disabled" v-else>
        ⚠️ 余额不足，无法追加额外奖励
      </p>

      <!-- 6. 발행인 잔고 표시 -->
      <div class="wallet-info">
        <span>我的余额：{{ wallet.availableBalance }} ❤️</span>
        <span v-if="wallet.reservedBalance > 0">（冻结 {{ wallet.reservedBalance }} ❤️）</span>
      </div>

      <!-- 7. 奖励总览 -->
      <div class="reward-summary" v-if="evaluation">
        <div class="summary-section">
          <div class="summary-title">🎯 完成者获得</div>
          <div class="summary-row">
            <span>任务生成积分</span>
            <span>{{ evaluation.baseReward }} ❤️</span>
          </div>
          <div class="summary-row">
            <span>额外奖励</span>
            <span>+ {{ form.bonusPoints || 0 }} ❤️</span>
          </div>
          <div class="summary-total">
            合计 {{ evaluation.baseReward + (form.bonusPoints || 0) }} ❤️
          </div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-section publisher">
          <div class="summary-title">🎁 你（发布人）获得</div>
          <div class="summary-row">
            <span>发布人奖励积分</span>
            <span class="publisher-reward">{{ evaluation.publisherReward }} ❤️</span>
          </div>
          <div class="summary-hint">任务被完成后自动发放</div>
        </div>
      </div>

      <button class="btn btn-primary" @click="submit">📢 发布求助</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUserId = 1 // 실제로는 auth store에서 가져옴

const categories = [
  { value: 'errand', icon: '🛒', name: '跑腿' },
  { value: 'transport', icon: '🚗', name: '搬运' },
  { value: 'teach', icon: '📱', name: '教学' },
  { value: 'pet', icon: '🐕', name: '宠物' },
  { value: 'repair', icon: '🔧', name: '维修' },
  { value: 'delivery', icon: '📦', name: '快递' },
]

const form = reactive({
  title: '',
  description: '',
  category: 'errand',
  educationLevel: 'none',
  estimatedHours: 1,
  requiredCreditScore: 1,
  requiredExperience: 0,
  bonusPoints: 0,
})

const evaluation = ref<any>(null)
const wallet = reactive({ balance: 0, reservedBalance: 0, availableBalance: 0 })

const canAddBonus = computed(() => wallet.availableBalance > 0)

async function loadWallet() {
  const res = await fetch(`/api/users/${currentUserId}/wallet`)
  const data = await res.json()
  Object.assign(wallet, data)
}

async function evaluate() {
  const res = await fetch('/api/evaluation/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category: form.category,
      educationLevel: form.educationLevel,
      estimatedHours: form.estimatedHours,
      requiredCreditScore: form.requiredCreditScore,
      requiredExperience: form.requiredExperience,
    }),
  })
  evaluation.value = await res.json()
}

async function submit() {
  await evaluate() // 최종 평가
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...form,
      creator_id: currentUserId,
      bonusPoints: form.bonusPoints || 0,
    }),
  })
  if (res.ok) router.push('/tasks')
}

function goBack() { router.back() }

onMounted(() => {
  loadWallet()
  evaluate()
})

// 평가 필드 변경 시 자동 재평가
watch(() => [form.category, form.educationLevel, form.estimatedHours, form.requiredCreditScore, form.requiredExperience],
  () => evaluate(), { deep: true })
</script>

<style scoped>
.publish-page { max-width: 420px; margin: 0 auto; background: #fff; min-height: 100vh; }
.header { background: linear-gradient(135deg,#1A1A2E,#16213E); color:#fff; padding:16px 20px; display:flex; align-items:center; gap:16px; }
.header .back { font-size:18px; cursor:pointer; }
.header .title { font-size:16px; font-weight:600; }
.content { padding: 20px; }
label { font-size:13px; font-weight:600; color:#333; display:block; margin:16px 0 6px; }
.input { width:100%; background:#f5f5f5; border:none; border-radius:10px; padding:12px 14px; font-size:14px; outline:none; box-sizing:border-box; }
.type-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.type-btn { background:#f5f5f5; border:2px solid transparent; border-radius:12px; padding:12px 6px; text-align:center; cursor:pointer; }
.type-btn.selected { border-color:#7B1FA2; background:#F3E5F5; }
.type-btn .icon { font-size:22px; }
.type-btn .name { font-size:12px; }
.eval-box { background:linear-gradient(135deg,#7B1FA2,#AB47BC); color:#fff; border-radius:14px; padding:16px; margin:16px 0; }
.eval-label { font-size:12px; opacity:.8; margin-bottom:8px; }
.eval-row { display:flex; align-items:center; gap:12px; }
.eval-item { flex:1; text-align:center; }
.eval-item.highlight { background:rgba(255,255,255,.15); border-radius:10px; padding:8px 4px; }
.eval-item-label { font-size:11px; opacity:.85; margin-bottom:2px; }
.eval-amount { font-size:20px; font-weight:700; }
.eval-item-hint { font-size:10px; opacity:.7; margin-top:2px; }
.eval-divider { font-size:18px; opacity:.6; }
.eval-detail { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; font-size:11px; opacity:.85; }
.bonus-row { display:flex; gap:8px; align-items:center; }
.reward-input { flex:1; background:#f5f5f5; border:none; border-radius:10px; padding:12px; font-size:16px; font-weight:700; outline:none; text-align:center; }
.reward-input:disabled { opacity:.5; }
.reward-unit { font-size:16px; color:#666; }
.hint { font-size:12px; color:#888; margin:6px 0; }
.hint.disabled { color:#F44336; }
.wallet-info { font-size:13px; color:#333; margin:12px 0; padding:10px; background:#FAF5FF; border-radius:10px; }
.reward-summary { padding:16px; background:#F3E5F5; border-radius:14px; margin-bottom:16px; }
.summary-section { padding:4px 0; }
.summary-section.publisher { text-align:center; }
.summary-title { font-size:13px; font-weight:700; color:#7B1FA2; margin-bottom:8px; }
.summary-row { display:flex; justify-content:space-between; align-items:center; font-size:14px; padding:4px 0; }
.summary-total { font-size:16px; font-weight:700; color:#333; margin-top:4px; text-align:right; }
.publisher-reward { font-size:18px; font-weight:700; color:#FF6F00; }
.summary-hint { font-size:11px; color:#888; margin-top:4px; }
.summary-divider { height:1px; background:rgba(123,31,162,.2); margin:12px 0; }
.btn { width:100%; border:none; padding:14px; border-radius:14px; font-size:16px; font-weight:700; cursor:pointer; }
.btn-primary { background:linear-gradient(135deg,#4CAF50,#43A047); color:#fff; }
</style>
