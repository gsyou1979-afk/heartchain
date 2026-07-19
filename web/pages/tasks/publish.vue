<template>
  <div class="publish-page">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand" @click="goHome">
          <span class="brand-icon">❤️</span>
          <span class="brand-text">HeartChain</span>
        </div>
        <div class="nav-links">
          <a @click="goHome" class="nav-link">首页</a>
          <a @click="goWallet" class="nav-link">钱包</a>
        </div>
      </div>
    </nav>

    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">发布求助任务</h1>
      <p class="page-subtitle">填写任务信息，平台自动评估积分奖励</p>
    </div>

    <!-- 双栏布局 -->
    <div class="main-layout">
      <!-- 左栏：表单 -->
      <div class="form-column">
        <!-- 1. 任务类型 -->
        <div class="form-card">
          <div class="card-header">
            <span class="card-step">1</span>
            <span class="card-title">选择任务类型</span>
          </div>
          <div class="type-grid">
            <div
              v-for="t in categories"
              :key="t.value"
              class="type-btn"
              :class="{ selected: form.category === t.value }"
              @click="form.category = t.value"
            >
              <div class="type-icon">{{ t.icon }}</div>
              <div class="type-name">{{ t.name }}</div>
              <div class="type-weight">基础分 {{ t.weight }}</div>
            </div>
          </div>
        </div>

        <!-- 2. 任务描述 -->
        <div class="form-card">
          <div class="card-header">
            <span class="card-step">2</span>
            <span class="card-title">任务描述</span>
          </div>
          <div class="form-group">
            <label class="form-label">任务标题</label>
            <input
              v-model="form.title"
              class="form-input"
              placeholder="简短描述你的需求，如：帮忙买药送到家"
              maxlength="200"
            />
          </div>
          <div class="form-group">
            <label class="form-label">详细描述</label>
            <textarea
              v-model="form.description"
              class="form-textarea"
              placeholder="详细说明任务内容、地点、注意事项等..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- 3. 评估参数 -->
        <div class="form-card">
          <div class="card-header">
            <span class="card-step">3</span>
            <span class="card-title">评估参数</span>
            <span class="card-hint">影响积分计算结果</span>
          </div>
          <div class="params-grid">
            <div class="form-group">
              <label class="form-label">学历 / 资格要求</label>
              <select v-model="form.educationLevel" class="form-input">
                <option value="none">无要求 (×1.0)</option>
                <option value="highschool">高中 (×1.0)</option>
                <option value="college">大专 (×1.2)</option>
                <option value="university">本科 (×1.4)</option>
                <option value="professional">专业资格 (×1.6)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">预计完成时间（小时）</label>
              <div class="input-with-suffix">
                <input
                  v-model.number="form.estimatedHours"
                  type="number"
                  min="0.5"
                  step="0.5"
                  class="form-input"
                />
                <span class="input-suffix">h</span>
              </div>
              <div class="param-hint">时薪基数：10,000 ❤️/h</div>
            </div>
            <div class="form-group">
              <label class="form-label">要求信用等级（1~5）</label>
              <div class="credit-stars">
                <button
                  v-for="n in 5"
                  :key="n"
                  class="star-btn"
                  :class="{ active: form.requiredCreditScore >= n }"
                  @click="form.requiredCreditScore = n"
                >★</button>
                <span class="credit-value">等级 {{ form.requiredCreditScore }}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">要求经验值</label>
              <input
                v-model.number="form.requiredExperience"
                type="number"
                min="0"
                class="form-input"
              />
              <div class="param-hint">每点经验值 +0.5 分</div>
            </div>
          </div>
        </div>

        <!-- 4. 额外奖励 -->
        <div class="form-card">
          <div class="card-header">
            <span class="card-step">4</span>
            <span class="card-title">额外奖励（可选）</span>
          </div>
          <div class="bonus-section">
            <div class="bonus-input-row">
              <input
                v-model.number="form.bonusPoints"
                type="number"
                min="0"
                class="form-input bonus-input"
                :disabled="!canAddBonus"
                placeholder="0"
              />
              <span class="bonus-unit">❤️</span>
            </div>
            <p class="bonus-hint" v-if="canAddBonus">
              💡 追加额外奖励可让任务优先被处理（发布时从钱包冻结，完成时转给完成者）
            </p>
            <p class="bonus-hint warning" v-else>
              ⚠️ 钱包余额不足，无法追加额外奖励
            </p>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button
          class="submit-btn"
          :class="{ loading: submitting }"
          :disabled="submitting || !form.title"
          @click="submit"
        >
          <span v-if="!submitting">📢 发布求助任务</span>
          <span v-else>发布中...</span>
        </button>
      </div>

      <!-- 右栏：实时积分面板 -->
      <div class="preview-column">
        <div class="preview-sticky">
          <!-- 钱包信息 -->
          <div class="wallet-card">
            <div class="wallet-header">
              <span class="wallet-icon">💎</span>
              <span class="wallet-title">我的钱包</span>
            </div>
            <div class="wallet-balance">
              <div class="balance-main">
                <span class="balance-num">{{ wallet.availableBalance }}</span>
                <span class="balance-unit">❤️</span>
              </div>
              <div class="balance-sub">可用余额</div>
            </div>
            <div class="wallet-detail" v-if="wallet.reservedBalance > 0">
              冻结中：{{ wallet.reservedBalance }} ❤️
            </div>
          </div>

          <!-- 积分评估面板 -->
          <div class="eval-card" v-if="evaluation">
            <div class="eval-header">
              <span class="eval-icon">🤖</span>
              <span class="eval-title">平台积分评估</span>
              <span class="eval-live-badge">实时</span>
            </div>

            <!-- 积分分解 -->
            <div class="eval-breakdown">
              <div class="breakdown-row">
                <span class="breakdown-label">📋 类型基础分</span>
                <span class="breakdown-value">{{ evaluation.breakdown.categoryScore }}</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">🎓 学历加分</span>
                <span class="breakdown-value">+ {{ evaluation.breakdown.educationScore }}</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">⏱️ 时间积分</span>
                <span class="breakdown-value">+ {{ evaluation.breakdown.timeScore.toLocaleString() }}</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">⭐ 信用要求</span>
                <span class="breakdown-value">+ {{ evaluation.breakdown.creditScore }}</span>
              </div>
              <div class="breakdown-row">
                <span class="breakdown-label">💪 经验要求</span>
                <span class="breakdown-value">+ {{ evaluation.breakdown.experienceScore }}</span>
              </div>
              <div class="breakdown-divider"></div>
              <div class="breakdown-row total">
                <span class="breakdown-label">基础积分合计</span>
                <span class="breakdown-value">{{ evaluation.baseReward.toLocaleString() }} ❤️</span>
              </div>
            </div>

            <!-- 奖励总览 -->
            <div class="reward-summary">
              <!-- 完成者获得 -->
              <div class="reward-block completer">
                <div class="reward-block-header">
                  <span class="reward-block-icon">🎯</span>
                  <span class="reward-block-title">完成者获得</span>
                </div>
                <div class="reward-rows">
                  <div class="reward-row">
                    <span>任务生成积分</span>
                    <span class="reward-amount">{{ evaluation.baseReward.toLocaleString() }} ❤️</span>
                  </div>
                  <div class="reward-row" v-if="form.bonusPoints > 0">
                    <span>额外奖励</span>
                    <span class="reward-amount">+ {{ form.bonusPoints.toLocaleString() }} ❤️</span>
                  </div>
                  <div class="reward-total">
                    <span>合计</span>
                    <span class="reward-total-amount">
                      {{ (evaluation.baseReward + (form.bonusPoints || 0)).toLocaleString() }} ❤️
                    </span>
                  </div>
                </div>
              </div>

              <!-- 发布人获得 -->
              <div class="reward-block publisher">
                <div class="reward-block-header">
                  <span class="reward-block-icon">🎁</span>
                  <span class="reward-block-title">你（发布人）获得</span>
                </div>
                <div class="reward-rows">
                  <div class="reward-row">
                    <span>发布人奖励（10%）</span>
                    <span class="reward-amount publisher-reward">
                      {{ evaluation.publisherReward.toLocaleString() }} ❤️
                    </span>
                  </div>
                  <div class="reward-hint-text">
                    任务完成后自动发放
                  </div>
                </div>
              </div>
            </div>

            <!-- 积分流向图 -->
            <div class="flow-diagram">
              <div class="flow-node platform">
                <div class="flow-node-icon">🏛️</div>
                <div class="flow-node-label">平台铸造</div>
              </div>
              <div class="flow-arrow down">↓</div>
              <div class="flow-split">
                <div class="flow-path">
                  <div class="flow-arrow">→</div>
                  <div class="flow-node completer-node">
                    <div class="flow-node-icon">🎯</div>
                    <div class="flow-node-label">完成者</div>
                    <div class="flow-node-value">{{ evaluation.baseReward.toLocaleString() }}</div>
                  </div>
                </div>
                <div class="flow-path">
                  <div class="flow-arrow">→</div>
                  <div class="flow-node publisher-node">
                    <div class="flow-node-icon">🎁</div>
                    <div class="flow-node-label">发布人</div>
                    <div class="flow-node-value">{{ evaluation.publisherReward.toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载中状态 -->
          <div class="eval-card loading-state" v-else>
            <div class="loading-spinner"></div>
            <p>正在计算积分...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <div class="modal-overlay" v-if="showSuccess" @click="showSuccess = false">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">✅</div>
        <h2 class="modal-title">任务发布成功！</h2>
        <p class="modal-desc" v-if="lastTask">
          任务 #{{ lastTask.id }} 已创建<br/>
          基础积分：{{ lastTask.baseReward }} ❤️ | 发布人奖励：{{ lastTask.publisherReward }} ❤️
        </p>
        <button class="modal-btn" @click="goWallet">查看钱包</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string
const currentUserId = 1

const categories = [
  { value: 'errand',    icon: '🛒', name: '跑腿',  weight: 50 },
  { value: 'delivery',  icon: '📦', name: '快递',  weight: 50 },
  { value: 'pet',       icon: '🐕', name: '宠物',  weight: 60 },
  { value: 'transport', icon: '🚗', name: '搬运',  weight: 70 },
  { value: 'teach',     icon: '📱', name: '教学',  weight: 80 },
  { value: 'repair',    icon: '🔧', name: '维修',  weight: 90 },
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
const wallet = reactive({ balance: 0, reservedBalance: 0, availableBalance: 0, totalPoints: 0 })
const submitting = ref(false)
const showSuccess = ref(false)
const lastTask = ref<any>(null)

const canAddBonus = computed(() => wallet.availableBalance > 0)

async function loadWallet() {
  try {
    const res = await fetch(`${apiBase}/users/${currentUserId}/wallet`)
    if (res.ok) {
      const data = await res.json()
      Object.assign(wallet, data)
    }
  } catch (e) {
    console.error('Failed to load wallet:', e)
  }
}

async function evaluate() {
  try {
    const res = await fetch(`${apiBase}/evaluation/calculate`, {
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
    if (res.ok) {
      evaluation.value = await res.json()
    }
  } catch (e) {
    console.error('Evaluation failed:', e)
  }
}

async function submit() {
  if (!form.title) return
  submitting.value = true
  try {
    const res = await fetch(`${apiBase}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        creator_id: currentUserId,
        bonusPoints: form.bonusPoints || 0,
      }),
    })
    if (res.ok) {
      lastTask.value = await res.json()
      showSuccess.value = true
      await loadWallet()
    } else {
      const err = await res.text()
      alert('发布失败: ' + err)
    }
  } catch (e) {
    alert('网络错误: ' + e)
  } finally {
    submitting.value = false
  }
}

function goHome() { window.location.href = '/' }
function goWallet() { window.location.href = '/wallet' }

onMounted(() => {
  loadWallet()
  evaluate()
})

watch(
  () => [form.category, form.educationLevel, form.estimatedHours, form.requiredCreditScore, form.requiredExperience],
  () => evaluate(),
  { deep: true }
)
</script>

<style scoped>
.publish-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 导航栏 */
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

/* 页面标题 */
.page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 16px;
}
.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}
.page-subtitle {
  font-size: 15px;
  color: #6b7280;
  margin-top: 4px;
}

/* 双栏布局 */
.main-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 64px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
}

/* 左栏：表单卡片 */
.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.card-step {
  width: 28px;
  height: 28px;
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}
.card-title { font-size: 17px; font-weight: 700; color: #111827; }
.card-hint { font-size: 13px; color: #9ca3af; margin-left: auto; }

/* 任务类型选择 */
.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.type-btn {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}
.type-btn:hover { border-color: #fca5a5; background: #fef2f2; }
.type-btn.selected {
  border-color: #ef4444;
  background: #fef2f2;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}
.type-icon { font-size: 28px; }
.type-name { font-size: 14px; font-weight: 600; color: #374151; margin-top: 6px; }
.type-weight { font-size: 11px; color: #9ca3af; margin-top: 2px; }

/* 表单元素 */
.form-group { margin-bottom: 16px; }
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}
.form-input {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: #ef4444; background: #fff; }
.form-textarea {
  width: 100%;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.2s;
}
.form-textarea:focus { border-color: #ef4444; background: #fff; }

.params-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.input-with-suffix {
  position: relative;
}
.input-suffix {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}
.param-hint { font-size: 12px; color: #9ca3af; margin-top: 4px; }

/* 信用星级 */
.credit-stars { display: flex; align-items: center; gap: 4px; }
.star-btn {
  font-size: 24px;
  color: #d1d5db;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}
.star-btn.active { color: #fbbf24; }
.star-btn:hover { color: #f59e0b; }
.credit-value { margin-left: 8px; font-size: 13px; color: #6b7280; }

/* 额外奖励 */
.bonus-input-row { display: flex; align-items: center; gap: 8px; }
.bonus-input { font-size: 20px; font-weight: 700; text-align: center; }
.bonus-input:disabled { opacity: 0.5; }
.bonus-unit { font-size: 20px; }
.bonus-hint { font-size: 13px; color: #6b7280; margin-top: 8px; }
.bonus-hint.warning { color: #f59e0b; }

/* 提交按钮 */
.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn.loading { opacity: 0.8; }

/* 右栏：预览面板 */
.preview-column {
  position: sticky;
  top: 80px;
}
.preview-sticky {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 钱包卡片 */
.wallet-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
}
.wallet-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.wallet-icon { font-size: 20px; }
.wallet-title { font-size: 14px; opacity: 0.8; }
.wallet-balance { text-align: center; }
.balance-main { display: flex; align-items: baseline; justify-content: center; gap: 4px; }
.balance-num { font-size: 32px; font-weight: 800; }
.balance-unit { font-size: 16px; opacity: 0.7; }
.balance-sub { font-size: 12px; opacity: 0.6; margin-top: 4px; }
.wallet-detail { font-size: 12px; opacity: 0.7; text-align: center; margin-top: 8px; }

/* 积分评估卡片 */
.eval-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}
.eval-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.eval-icon { font-size: 20px; }
.eval-title { font-size: 16px; font-weight: 700; color: #111827; }
.eval-live-badge {
  margin-left: auto;
  background: #fef2f2;
  color: #ef4444;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

/* 积分分解 */
.eval-breakdown { margin-bottom: 16px; }
.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
}
.breakdown-label { color: #6b7280; }
.breakdown-value { font-weight: 600; color: #374151; }
.breakdown-divider { height: 1px; background: #e5e7eb; margin: 8px 0; }
.breakdown-row.total .breakdown-label { font-weight: 700; color: #111827; }
.breakdown-row.total .breakdown-value { font-size: 16px; color: #ef4444; }

/* 奖励总览 */
.reward-summary { display: flex; flex-direction: column; gap: 12px; }
.reward-block {
  border-radius: 12px;
  padding: 16px;
}
.reward-block.completer {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}
.reward-block.publisher {
  background: #fffbeb;
  border: 1px solid #fde68a;
}
.reward-block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.reward-block-icon { font-size: 18px; }
.reward-block-title { font-size: 14px; font-weight: 700; }
.completer .reward-block-title { color: #15803d; }
.publisher .reward-block-title { color: #b45309; }

.reward-rows { display: flex; flex-direction: column; gap: 4px; }
.reward-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #374151;
}
.reward-amount { font-weight: 600; }
.reward-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  margin-top: 4px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 700;
}
.reward-total-amount { color: #15803d; font-size: 16px; }
.publisher-reward { color: #b45309; font-size: 16px; }
.reward-hint-text { font-size: 11px; color: #9ca3af; margin-top: 4px; }

/* 积分流向图 */
.flow-diagram {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}
.flow-node {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}
.flow-node.platform { background: #eff6ff; border-color: #bfdbfe; }
.flow-node-icon { font-size: 20px; }
.flow-node-label { font-size: 11px; color: #6b7280; margin-top: 2px; }
.flow-node-value { font-size: 14px; font-weight: 700; color: #ef4444; }
.flow-arrow { font-size: 18px; color: #9ca3af; }
.flow-arrow.down { margin: 4px 0; }
.flow-split { display: flex; justify-content: center; gap: 24px; }
.flow-path { display: flex; align-items: center; gap: 4px; }
.flow-node.completer-node { background: #f0fdf4; border-color: #bbf7d0; }
.flow-node.publisher-node { background: #fffbeb; border-color: #fde68a; }

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 40px 20px;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #ef4444;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-state p { color: #9ca3af; font-size: 14px; }

/* 成功弹窗 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
}
.modal-icon { font-size: 48px; margin-bottom: 16px; }
.modal-title { font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.modal-desc { font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
.modal-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 12px 32px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}
.modal-btn:hover { background: #dc2626; }

/* 响应式 */
@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
  .preview-column { position: static; }
  .params-grid { grid-template-columns: 1fr; }
  .type-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
