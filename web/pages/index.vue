<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand" @click="navigateTo('/')">
          <span class="brand-icon">❤️</span>
          <span class="brand-text">HeartChain</span>
          <span class="brand-sub">哈特链</span>
        </div>
        <div class="nav-links">
          <a @click="navigateTo('/tasks/publish')" class="nav-link">发布求助</a>
          <a @click="navigateTo('/wallet')" class="nav-link">我的钱包</a>
          <a @click="navigateTo('/help')" class="nav-link">说明</a>
        </div>
      </div>
    </nav>

    <!-- 广告轮播横幅 -->
    <div class="ad-banner">
      <div class="ad-slides">
        <div
          v-for="(ad, i) in ads"
          :key="i"
          class="ad-slide"
          :class="{ active: currentAd === i }"
          :style="{ background: ad.bg }"
        >
          <div class="ad-content">
            <div class="ad-icon">{{ ad.icon }}</div>
            <div class="ad-text">
              <div class="ad-title">{{ ad.title }}</div>
              <div class="ad-desc">{{ ad.desc }}</div>
            </div>
            <div class="ad-tag">{{ ad.tag }}</div>
          </div>
        </div>
      </div>
      <div class="ad-dots">
        <span
          v-for="(ad, i) in ads"
          :key="i"
          class="ad-dot"
          :class="{ active: currentAd === i }"
          @click="currentAd = i"
        ></span>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">让互助更有价值</h1>
        <p class="hero-desc">
          HeartChain 是一个基于积分的互助平台。发布求助任务，平台自动评估积分奖励；<br/>
          任务完成后，完成者和发布人都能获得积分回报。
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="navigateTo('/tasks/publish')">
            📢 发布求助
          </button>
          <button class="btn btn-secondary" @click="navigateTo('/wallet')">
            💎 我的钱包
          </button>
          <button class="btn btn-outline" @click="navigateTo('/help')">
            📖 平台说明
          </button>
        </div>
      </div>
    </div>

    <!-- 积分规则说明 -->
    <div class="rules-section">
      <h2 class="section-title">积分规则</h2>
      <div class="rules-grid">
        <div class="rule-card">
          <div class="rule-icon">🎯</div>
          <div class="rule-name">任务生成积分</div>
          <div class="rule-desc">
            平台根据任务类型、学历要求、时间、信用等级、经验值自动评估<br/>
            <span class="rule-highlight">时薪基数：10,000 ❤️ / 小时</span>
          </div>
        </div>
        <div class="rule-card">
          <div class="rule-icon">🎁</div>
          <div class="rule-name">发布人奖励积分</div>
          <div class="rule-desc">
            任务完成后，发布人获得基础积分的 <span class="rule-highlight">10%</span> 奖励<br/>
            （最低 5 ❤️）
          </div>
        </div>
        <div class="rule-card">
          <div class="rule-icon">⚡</div>
          <div class="rule-name">额外奖励</div>
          <div class="rule-desc">
            发布人可追加额外积分，让任务优先被处理<br/>
            发布时从钱包冻结，完成时转给完成者
          </div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-access">
      <div class="qa-card" @click="navigateTo('/tasks/publish')">
        <div class="qa-icon">📝</div>
        <div class="qa-text">
          <div class="qa-title">发布任务</div>
          <div class="qa-desc">填写需求，实时查看积分评估</div>
        </div>
        <div class="qa-arrow">→</div>
      </div>
      <div class="qa-card" @click="navigateTo('/wallet')">
        <div class="qa-icon">💼</div>
        <div class="qa-text">
          <div class="qa-title">钱包管理</div>
          <div class="qa-desc">查看余额、冻结、交易记录</div>
        </div>
        <div class="qa-arrow">→</div>
      </div>
      <div class="qa-card" @click="navigateTo('/help')">
        <div class="qa-icon">📖</div>
        <div class="qa-text">
          <div class="qa-title">平台说明</div>
          <div class="qa-desc">了解积分规则、计算公式、FAQ</div>
        </div>
        <div class="qa-arrow">→</div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>HeartChain © 2026 · 互助积分平台</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const ads = [
  {
    icon: '🤝',
    title: '互助让社区更温暖',
    desc: '每一次帮助，都有积分回报',
    tag: 'HeartChain',
    bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
  },
  {
    icon: '🎯',
    title: '时薪基数 10,000 ❤️/h',
    desc: '平台自动评估，公平透明',
    tag: '积分系统',
    bg: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  },
  {
    icon: '🎁',
    title: '发布人也可获得奖励',
    desc: '基础积分的 10% 额外发放',
    tag: '双赢机制',
    bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
]

const currentAd = ref(0)
let adTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  adTimer = setInterval(() => {
    currentAd.value = (currentAd.value + 1) % ads.length
  }, 4000)
})

onUnmounted(() => {
  if (adTimer) clearInterval(adTimer)
})

function navigateTo(path: string) {
  window.location.href = path
}
</script>

<style scoped>
.home {
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
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.brand-icon { font-size: 28px; }
.brand-text { font-size: 20px; font-weight: 800; color: #ef4444; }
.brand-sub { font-size: 14px; color: #6b7280; }
.nav-links { display: flex; gap: 32px; }
.nav-link {
  font-size: 15px;
  color: #374151;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-link:hover { color: #ef4444; }

/* 广告轮播 */
.ad-banner {
  position: relative;
  height: 120px;
  overflow: hidden;
}
.ad-slides {
  position: relative;
  width: 100%;
  height: 100%;
}
.ad-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  display: flex;
  align-items: center;
}
.ad-slide.active { opacity: 1; }
.ad-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
}
.ad-icon { font-size: 40px; flex-shrink: 0; }
.ad-text { flex: 1; }
.ad-title { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.ad-desc { font-size: 14px; opacity: 0.85; }
.ad-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.ad-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.ad-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}
.ad-dot.active {
  background: #fff;
  width: 24px;
  border-radius: 4px;
}

/* Hero 区域 */
.hero {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  padding: 80px 24px;
  text-align: center;
  color: #fff;
}
.hero-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
}
.hero-desc {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.8;
  margin-bottom: 32px;
}
.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn-primary {
  background: #fff;
  color: #ef4444;
}
.btn-primary:hover {
  background: #fef2f2;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.6);
}
.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 积分规则 */
.rules-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px;
}
.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 40px;
}
.rules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.rule-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}
.rule-card:hover {
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  transform: translateY(-4px);
}
.rule-icon { font-size: 40px; margin-bottom: 16px; }
.rule-name { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 12px; }
.rule-desc { font-size: 14px; color: #6b7280; line-height: 1.6; }
.rule-highlight { color: #ef4444; font-weight: 600; }

/* 快速入口 */
.quick-access {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.qa-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}
.qa-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #ef4444;
}
.qa-icon { font-size: 36px; }
.qa-text { flex: 1; }
.qa-title { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.qa-desc { font-size: 14px; color: #6b7280; }
.qa-arrow { font-size: 24px; color: #ef4444; }

/* 页脚 */
.footer {
  text-align: center;
  padding: 32px;
  color: #9ca3af;
  font-size: 14px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-title { font-size: 28px; }
  .rules-grid { grid-template-columns: 1fr; }
  .quick-access { grid-template-columns: 1fr; }
  .nav-links { gap: 16px; }
  .ad-title { font-size: 16px; }
  .ad-desc { font-size: 12px; }
}
</style>
