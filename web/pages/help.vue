<template>
  <div class="help-page">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand" @click="goHome">
          <span class="brand-icon">❤️</span>
          <span class="brand-text">HeartChain</span>
        </div>
        <div class="nav-links">
          <a @click="goHome" class="nav-link">首页</a>
          <a @click="goPublish" class="nav-link">发布求助</a>
          <a @click="goWallet" class="nav-link">钱包</a>
          <a @click="goHelp" class="nav-link active">说明</a>
        </div>
      </div>
    </nav>

    <div class="page-header">
      <h1 class="page-title">📖 平台说明</h1>
      <p class="page-subtitle">了解 HeartChain 哈特链的运作方式和积分规则</p>
    </div>

    <div class="content">
      <!-- 目录 -->
      <div class="toc-card">
        <div class="toc-title">📑 目录</div>
        <div class="toc-list">
          <a href="#what-is" class="toc-link">1. 什么是 HeartChain？</a>
          <a href="#points-system" class="toc-link">2. 积分系统详解</a>
          <a href="#how-to-publish" class="toc-link">3. 如何发布任务</a>
          <a href="#reward-calc" class="toc-link">4. 积分计算公式</a>
          <a href="#reward-flow" class="toc-link">5. 积分发放在务</a>
          <a href="#faq" class="toc-link">6. 常见问题</a>
        </div>
      </div>

      <!-- 1. 什么是 HeartChain -->
      <section id="what-is" class="section">
        <h2 class="section-title">1. 什么是 HeartChain？</h2>
        <div class="section-body">
          <p>HeartChain（哈特链）是一个基于积分的互助平台。用户可以发布求助任务，也可以帮助他人完成任务来赚取积分。</p>
          <p>平台的核心理念是：<strong>让互助更有价值</strong>。每一次帮助都会得到积分回报，积分可以在平台内使用或积累。</p>
        </div>
      </section>

      <!-- 2. 积分系统 -->
      <section id="points-system" class="section">
        <h2 class="section-title">2. 积分系统详解</h2>
        <div class="section-body">
          <p>HeartChain 有三种积分类型：</p>
          <div class="points-grid">
            <div class="point-card base">
              <div class="point-icon">🎯</div>
              <div class="point-name">任务生成积分 (baseReward)</div>
              <div class="point-desc">
                平台根据任务类型、学历要求、时间、信用等级、经验值自动评估。<br/>
                任务完成时，由平台铸造发放给完成者。
              </div>
              <div class="point-formula">时薪基数：10,000 ❤️ / 小时</div>
            </div>
            <div class="point-card publisher">
              <div class="point-icon">🎁</div>
              <div class="point-name">发布人奖励积分 (publisherReward)</div>
              <div class="point-desc">
                基础积分的 <strong>10%</strong>（最低 5 ❤️）。<br/>
                任务完成时，由平台铸造发放给发布人。
              </div>
              <div class="point-formula">publisherReward = max(baseReward × 10%, 5)</div>
            </div>
            <div class="point-card bonus">
              <div class="point-icon">⚡</div>
              <div class="point-name">额外奖励 (bonusReward)</div>
              <div class="point-desc">
                发布人可选追加的额外积分。<br/>
                发布时从钱包冻结，完成时转账给完成者。
              </div>
              <div class="point-formula">由发布人自行设定（可选）</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 如何发布任务 -->
      <section id="how-to-publish" class="section">
        <h2 class="section-title">3. 如何发布任务</h2>
        <div class="section-body">
          <div class="steps">
            <div class="step">
              <div class="step-num">1</div>
              <div class="step-content">
                <div class="step-title">选择任务类型</div>
                <div class="step-desc">从跑腿、快递、宠物、搬运、教学、维修中选择最匹配的类型。不同类型有不同的基础分权重。</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <div class="step-content">
                <div class="step-title">填写任务描述</div>
                <div class="step-desc">输入简短的标题和详细的描述，让帮助者了解你的需求。</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <div class="step-content">
                <div class="step-title">设置评估参数</div>
                <div class="step-desc">包括学历要求、预计完成时间、信用等级要求、经验值要求。这些参数会影响积分计算。</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <div class="step-content">
                <div class="step-title">查看实时积分评估</div>
                <div class="step-desc">右侧面板会实时显示积分计算结果，包括基础积分、完成者获得、发布人获得等详细信息。</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">5</div>
              <div class="step-content">
                <div class="step-title">添加额外奖励（可选）</div>
                <div class="step-desc">如果想让任务优先被处理，可以追加额外奖励积分（从钱包余额中冻结）。</div>
              </div>
            </div>
            <div class="step">
              <div class="step-num">6</div>
              <div class="step-content">
                <div class="step-title">发布任务</div>
                <div class="step-desc">点击"发布求助任务"按钮，任务即创建成功。如果有额外奖励，相应积分会从钱包冻结。</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. 积分计算公式 -->
      <section id="reward-calc" class="section">
        <h2 class="section-title">4. 积分计算公式</h2>
        <div class="section-body">
          <div class="formula-card">
            <div class="formula-label">基础积分 (baseReward) 计算公式：</div>
            <div class="formula-box">
              baseReward = categoryScore + educationScore + timeScore + creditScore + experienceScore
            </div>
          </div>

          <table class="formula-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>说明</th>
                <th>计算方式</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>categoryScore</td>
                <td>任务类型基础分</td>
                <td>跑腿50 / 快递50 / 宠物60 / 搬运70 / 教学80 / 维修90</td>
              </tr>
              <tr>
                <td>educationScore</td>
                <td>学历要求加分</td>
                <td>无要求×1.0 / 高中×1.0 / 大专×1.2 / 本科×1.4 / 专业资格×1.6</td>
              </tr>
              <tr>
                <td>timeScore</td>
                <td>时间积分</td>
                <td>estimatedHours × 10,000（时薪基数）</td>
              </tr>
              <tr>
                <td>creditScore</td>
                <td>信用等级要求加分</td>
                <td>等级 × 10（等级1~5）</td>
              </tr>
              <tr>
                <td>experienceScore</td>
                <td>经验值要求加分</td>
                <td>requiredExperience × 0.5</td>
              </tr>
            </tbody>
          </table>

          <div class="example-card">
            <div class="example-title">💡 计算示例</div>
            <div class="example-body">
              <p>假设发布一个"教学"任务，要求本科学历，预计2小时，信用等级3，经验值100：</p>
              <ul>
                <li>类型基础分：80（教学）</li>
                <li>学历加分：80 × (1.4 - 1.0) = 32</li>
                <li>时间积分：2 × 10,000 = 20,000</li>
                <li>信用要求：3 × 10 = 30</li>
                <li>经验要求：100 × 0.5 = 50</li>
                <li><strong>基础积分合计：20,192 ❤️</strong></li>
                <li>完成者获得：20,192 ❤️</li>
                <li>发布人获得：20,192 × 10% = 2,019 ❤️</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. 积分发放在务 -->
      <section id="reward-flow" class="section">
        <h2 class="section-title">5. 积分发放流程</h2>
        <div class="section-body">
          <div class="flow-steps">
            <div class="flow-step">
              <div class="flow-step-icon">📝</div>
              <div class="flow-step-title">发布任务</div>
              <div class="flow-step-desc">如有额外奖励，从发布人钱包冻结相应积分</div>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-step">
              <div class="flow-step-icon">🤝</div>
              <div class="flow-step-title">接受任务</div>
              <div class="flow-step-desc">帮助者接受任务并开始执行</div>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-step">
              <div class="flow-step-icon">✅</div>
              <div class="flow-step-title">任务完成</div>
              <div class="flow-step-desc">平台铸造基础积分，分别发放给完成者和发布人</div>
            </div>
          </div>

          <div class="flow-detail">
            <div class="flow-detail-row">
              <span class="flow-detail-icon">🎯</span>
              <span class="flow-detail-text"><strong>完成者获得：</strong>baseReward（任务生成积分）+ bonusReward（额外奖励，如有）</span>
            </div>
            <div class="flow-detail-row">
              <span class="flow-detail-icon">🎁</span>
              <span class="flow-detail-text"><strong>发布人获得：</strong>publisherReward（基础积分的10%，最低5分）</span>
            </div>
            <div class="flow-detail-row">
              <span class="flow-detail-icon">🏛️</span>
              <span class="flow-detail-text"><strong>平台铸造：</strong>baseReward + publisherReward（均为系统新增积分，非转账）</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. FAQ -->
      <section id="faq" class="section">
        <h2 class="section-title">6. 常见问题</h2>
        <div class="section-body">
          <div class="faq-item">
            <div class="faq-q">Q: 发布任务需要登录吗？</div>
            <div class="faq-a">A: 当前版本为演示模式，无需登录。系统自动使用测试用户（KP），钱包余额 50,000 ❤️。</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Q: 额外奖励的积分会被扣除吗？</div>
            <div class="faq-a">A: 是的。发布任务时，额外奖励积分会从钱包余额中冻结。任务完成后，冻结的积分会转账给完成者。如果任务被取消，冻结积分会退回。</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Q: 发布人为什么也能获得积分？</div>
            <div class="faq-a">A: 发布人奖励机制旨在鼓励用户发布真实有效的求助任务，活跃平台生态。发布人获得基础积分的10%作为奖励。</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Q: 时薪基数是什么？</div>
            <div class="faq-a">A: 时薪基数是计算时间积分的基准，当前为 10,000 ❤️/小时。预计完成时间越长，时间积分越高。</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">Q: 积分可以提现吗？</div>
            <div class="faq-a">A: 当前版本暂不支持提现功能。积分用于平台内的互助任务流转。</div>
          </div>
        </div>
      </section>

      <!-- 底部操作 -->
      <div class="bottom-actions">
        <button class="btn btn-primary" @click="goPublish">📢 立即发布任务</button>
        <button class="btn btn-secondary" @click="goWallet">💎 查看我的钱包</button>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <p>HeartChain © 2026 · 互助积分平台</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
function goHome() { window.location.href = '/' }
function goPublish() { window.location.href = '/tasks/publish' }
function goWallet() { window.location.href = '/wallet' }
function goHelp() { window.location.href = '/help' }
</script>

<style scoped>
.help-page {
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
  max-width: 900px;
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
.nav-link { font-size: 15px; color: #374151; cursor: pointer; font-weight: 500; transition: color 0.2s; }
.nav-link:hover { color: #ef4444; }
.nav-link.active { color: #ef4444; font-weight: 700; }

/* 页面标题 */
.page-header {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px 16px;
}
.page-title { font-size: 28px; font-weight: 800; color: #111827; }
.page-subtitle { font-size: 15px; color: #6b7280; margin-top: 4px; }

/* 内容区 */
.content { max-width: 900px; margin: 0 auto; padding: 0 24px 64px; }

/* 目录卡片 */
.toc-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
}
.toc-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 12px; }
.toc-list { display: flex; flex-direction: column; gap: 8px; }
.toc-link {
  font-size: 14px;
  color: #ef4444;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fef2f2;
  transition: all 0.2s;
}
.toc-link:hover { background: #fee2e2; }

/* 章节 */
.section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  scroll-margin-top: 80px;
}
.section-title {
  font-size: 22px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #fee2e2;
}
.section-body { font-size: 15px; color: #374151; line-height: 1.8; }
.section-body p { margin-bottom: 12px; }

/* 积分类型卡片 */
.points-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
.point-card {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.point-card.base { background: #eff6ff; border: 1px solid #bfdbfe; }
.point-card.publisher { background: #fffbeb; border: 1px solid #fde68a; }
.point-card.bonus { background: #f0fdf4; border: 1px solid #bbf7d0; }
.point-icon { font-size: 32px; margin-bottom: 8px; }
.point-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.point-desc { font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 12px; }
.point-formula {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
}
.base .point-formula { color: #2563eb; }
.publisher .point-formula { color: #b45309; }
.bonus .point-formula { color: #15803d; }

/* 步骤 */
.steps { display: flex; flex-direction: column; gap: 16px; }
.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}
.step-num {
  width: 32px;
  height: 32px;
  background: #ef4444;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}
.step-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.step-desc { font-size: 14px; color: #6b7280; line-height: 1.6; }

/* 公式 */
.formula-card { margin-bottom: 20px; }
.formula-label { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
.formula-box {
  background: #1a1a2e;
  color: #4ade80;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}
.formula-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 13px;
}
.formula-table th {
  background: #f3f4f6;
  padding: 10px 14px;
  text-align: left;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}
.formula-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #f3f4f6;
  color: #6b7280;
}
.formula-table td:first-child {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #ef4444;
}
.example-card {
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 20px;
}
.example-title { font-size: 15px; font-weight: 700; color: #b45309; margin-bottom: 8px; }
.example-body { font-size: 14px; color: #374151; line-height: 1.8; }
.example-body ul { padding-left: 20px; }
.example-body li { margin-bottom: 4px; }

/* 流程 */
.flow-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.flow-step {
  text-align: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  min-width: 160px;
}
.flow-step-icon { font-size: 32px; margin-bottom: 8px; }
.flow-step-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.flow-step-desc { font-size: 12px; color: #6b7280; line-height: 1.5; }
.flow-arrow { font-size: 24px; color: #ef4444; }
.flow-detail {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.flow-detail-row { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
.flow-detail-icon { font-size: 20px; flex-shrink: 0; }
.flow-detail-text { color: #374151; line-height: 1.6; }

/* FAQ */
.faq-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 12px;
}
.faq-q { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.faq-a { font-size: 14px; color: #6b7280; line-height: 1.6; }

/* 底部操作 */
.bottom-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
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
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3); }
.btn-secondary {
  background: #fff;
  color: #ef4444;
  border: 2px solid #ef4444;
}
.btn-secondary:hover { background: #fef2f2; }

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
  .points-grid { grid-template-columns: 1fr; }
  .flow-steps { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); }
  .formula-table { font-size: 12px; }
}
</style>
