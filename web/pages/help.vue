<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <section class="bg-white border-b border-gray-100">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">📖 平台说明</h1>
        <p class="text-lg text-gray-500 mt-2">了解 HeartChain 哈特链的运作方式和积分规则</p>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <!-- 目录 -->
      <div class="card p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">📑 目录</h2>
        <div class="flex flex-wrap gap-3">
          <a v-for="(item, i) in tocItems" :key="i" :href="item.href" class="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            {{ i + 1 }}. {{ item.label }}
          </a>
        </div>
      </div>

      <!-- 1. 什么是 HeartChain -->
      <section id="what-is" class="card p-8 scroll-mt-20">
        <h2 class="section-title">1. 什么是 HeartChain？</h2>
        <div class="text-gray-600 leading-relaxed space-y-3">
          <p>HeartChain（哈特链）是一个基于积分的互助平台。用户可以发布求助任务，也可以帮助他人完成任务来赚取积分。</p>
          <p>平台的核心理念是：<strong class="text-gray-900">让互助更有价值</strong>。每一次帮助都会得到积分回报，积分可以在平台内使用或积累。</p>
        </div>
      </section>

      <!-- 2. 积分系统 -->
      <section id="points-system" class="card p-8 scroll-mt-20">
        <h2 class="section-title">2. 积分系统详解</h2>
        <p class="text-gray-600 mb-6">HeartChain 有三种积分类型：</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <div class="text-3xl mb-2">🎯</div>
            <div class="text-sm font-bold text-gray-900 mb-2">任务生成积分 (baseReward)</div>
            <div class="text-xs text-gray-500 leading-relaxed mb-3">
              平台根据任务类型、学历要求、时间、信用等级、经验值自动评估。<br/>任务完成时，由平台铸造发放给完成者。
            </div>
            <div class="text-xs font-semibold text-blue-600 bg-white/60 rounded-lg px-3 py-1.5">
              时薪基数：10,000 ❤️ / 小时
            </div>
          </div>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
            <div class="text-3xl mb-2">🎁</div>
            <div class="text-sm font-bold text-gray-900 mb-2">发布人奖励积分 (publisherReward)</div>
            <div class="text-xs text-gray-500 leading-relaxed mb-3">
              基础积分的 <strong>10%</strong>（最低 5 ❤️）。<br/>任务完成时，由平台铸造发放给发布人。
            </div>
            <div class="text-xs font-semibold text-amber-700 bg-white/60 rounded-lg px-3 py-1.5">
              publisherReward = max(baseReward × 10%, 5)
            </div>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div class="text-3xl mb-2">⚡</div>
            <div class="text-sm font-bold text-gray-900 mb-2">额外奖励 (bonusReward)</div>
            <div class="text-xs text-gray-500 leading-relaxed mb-3">
              发布人可选追加的额外积分。<br/>发布时从钱包冻结，完成时转账给完成者。
            </div>
            <div class="text-xs font-semibold text-green-700 bg-white/60 rounded-lg px-3 py-1.5">
              由发布人自行设定（可选）
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 如何发布任务 -->
      <section id="how-to-publish" class="card p-8 scroll-mt-20">
        <h2 class="section-title">3. 如何发布任务</h2>
        <div class="space-y-4">
          <div v-for="(step, i) in publishSteps" :key="i" class="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{{ i + 1 }}</div>
            <div>
              <div class="font-semibold text-gray-900 text-sm">{{ step.title }}</div>
              <div class="text-sm text-gray-500 mt-1">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. 积分计算公式 -->
      <section id="reward-calc" class="card p-8 scroll-mt-20">
        <h2 class="section-title">4. 积分计算公式</h2>
        <div class="mb-6">
          <div class="text-sm font-semibold text-gray-700 mb-2">基础积分 (baseReward) 计算公式：</div>
          <div class="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-xl text-center">
            baseReward = categoryScore + educationScore + timeScore + creditScore + experienceScore
          </div>
        </div>
        <div class="overflow-x-auto mb-6">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="text-left p-3 font-bold text-gray-700 border-b-2 border-gray-200">参数</th>
                <th class="text-left p-3 font-bold text-gray-700 border-b-2 border-gray-200">说明</th>
                <th class="text-left p-3 font-bold text-gray-700 border-b-2 border-gray-200">计算方式</th>
              </tr>
            </thead>
            <tbody class="text-gray-600">
              <tr class="border-b border-gray-100">
                <td class="p-3 font-mono font-semibold text-red-500">categoryScore</td>
                <td class="p-3">任务类型基础分</td>
                <td class="p-3">跑腿50 / 快递50 / 宠物60 / 搬运70 / 教学80 / 维修90</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-3 font-mono font-semibold text-red-500">educationScore</td>
                <td class="p-3">学历要求加分</td>
                <td class="p-3">无要求×1.0 / 高中×1.0 / 大专×1.2 / 本科×1.4 / 专业资格×1.6</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-3 font-mono font-semibold text-red-500">timeScore</td>
                <td class="p-3">时间积分</td>
                <td class="p-3">estimatedHours × 10,000（时薪基数）</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-3 font-mono font-semibold text-red-500">creditScore</td>
                <td class="p-3">信用等级要求加分</td>
                <td class="p-3">等级 × 10（等级1~5）</td>
              </tr>
              <tr>
                <td class="p-3 font-mono font-semibold text-red-500">experienceScore</td>
                <td class="p-3">经验值要求加分</td>
                <td class="p-3">requiredExperience × 0.5</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 示例 -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div class="font-bold text-amber-700 text-sm mb-2">💡 计算示例</div>
          <div class="text-sm text-gray-700 space-y-1">
            <p>假设发布一个"教学"任务，要求本科学历，预计2小时，信用等级3，经验值100：</p>
            <ul class="list-disc pl-5 mt-2 space-y-0.5 text-gray-600">
              <li>类型基础分：80（教学）</li>
              <li>学历加分：80 × (1.4 - 1.0) = 32</li>
              <li>时间积分：2 × 10,000 = 20,000</li>
              <li>信用要求：3 × 10 = 30</li>
              <li>经验要求：100 × 0.5 = 50</li>
              <li><strong class="text-gray-900">基础积分合计：20,192 ❤️</strong></li>
              <li>完成者获得：20,192 ❤️</li>
              <li>发布人获得：20,192 × 10% = 2,019 ❤️</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 5. 积分发放流程 -->
      <section id="reward-flow" class="card p-8 scroll-mt-20">
        <h2 class="section-title">5. 积分发放流程</h2>
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <div class="text-center p-5 bg-gray-50 rounded-xl border border-gray-200 min-w-[140px]">
            <div class="text-3xl mb-2">📝</div>
            <div class="font-bold text-sm text-gray-900">发布任务</div>
            <div class="text-xs text-gray-500 mt-1">如有额外奖励，冻结相应积分</div>
          </div>
          <div class="text-2xl text-red-400 md:rotate-0 rotate-90">→</div>
          <div class="text-center p-5 bg-gray-50 rounded-xl border border-gray-200 min-w-[140px]">
            <div class="text-3xl mb-2">🤝</div>
            <div class="font-bold text-sm text-gray-900">接受任务</div>
            <div class="text-xs text-gray-500 mt-1">帮助者接受并开始执行</div>
          </div>
          <div class="text-2xl text-red-400 md:rotate-0 rotate-90">→</div>
          <div class="text-center p-5 bg-gray-50 rounded-xl border border-gray-200 min-w-[140px]">
            <div class="text-3xl mb-2">✅</div>
            <div class="font-bold text-sm text-gray-900">任务完成</div>
            <div class="text-xs text-gray-500 mt-1">铸造积分，发放给双方</div>
          </div>
        </div>
        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <div class="flex items-start gap-3 text-sm">
            <span class="text-xl shrink-0">🎯</span>
            <span><strong>完成者获得：</strong>baseReward（任务生成积分）+ bonusReward（额外奖励，如有）</span>
          </div>
          <div class="flex items-start gap-3 text-sm">
            <span class="text-xl shrink-0">🎁</span>
            <span><strong>发布人获得：</strong>publisherReward（基础积分的10%，最低5分）</span>
          </div>
          <div class="flex items-start gap-3 text-sm">
            <span class="text-xl shrink-0">🏛️</span>
            <span><strong>平台铸造：</strong>baseReward + publisherReward（均为系统新增积分，非转账）</span>
          </div>
        </div>
      </section>

      <!-- 6. FAQ -->
      <section id="faq" class="card p-8 scroll-mt-20">
        <h2 class="section-title">6. 常见问题</h2>
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="p-4 bg-gray-50 rounded-xl">
            <div class="font-bold text-sm text-gray-900 mb-2">{{ faq.q }}</div>
            <div class="text-sm text-gray-600 leading-relaxed">{{ faq.a }}</div>
          </div>
        </div>
      </section>

      <!-- 底部操作 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <NuxtLink to="/tasks/publish" class="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
          📢 立即发布任务
        </NuxtLink>
        <NuxtLink to="/wallet" class="inline-flex items-center justify-center px-8 py-3.5 bg-white text-red-500 font-bold rounded-xl border-2 border-red-500 hover:bg-red-50 transition-colors">
          💎 查看我的钱包
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tocItems = [
  { label: '什么是 HeartChain？', href: '#what-is' },
  { label: '积分系统详解', href: '#points-system' },
  { label: '如何发布任务', href: '#how-to-publish' },
  { label: '积分计算公式', href: '#reward-calc' },
  { label: '积分发放流程', href: '#reward-flow' },
  { label: '常见问题', href: '#faq' },
];

const publishSteps = [
  { title: '选择任务类型', desc: '从跑腿、快递、宠物、搬运、教学、维修中选择最匹配的类型。不同类型有不同的基础分权重。' },
  { title: '填写任务描述', desc: '输入简短的标题和详细的描述，让帮助者了解你的需求。' },
  { title: '设置评估参数', desc: '包括学历要求、预计完成时间、信用等级要求、经验值要求。这些参数会影响积分计算。' },
  { title: '查看实时积分评估', desc: '右侧面板会实时显示积分计算结果，包括基础积分、完成者获得、发布人获得等详细信息。' },
  { title: '添加额外奖励（可选）', desc: '如果想让任务优先被处理，可以追加额外奖励积分（从钱包余额中冻结）。' },
  { title: '发布任务', desc: '点击"发布求助任务"按钮，任务即创建成功。如果有额外奖励，相应积分会从钱包冻结。' },
];

const faqs = [
  { q: 'Q: 发布任务需要登录吗？', a: 'A: 当前版本为演示模式，无需登录。系统自动使用测试用户（KP），钱包余额 50,000 ❤️。' },
  { q: 'Q: 额外奖励的积分会被扣除吗？', a: 'A: 是的。发布任务时，额外奖励积分会从钱包余额中冻结。任务完成后，冻结的积分会转账给完成者。如果任务被取消，冻结积分会退回。' },
  { q: 'Q: 发布人为什么也能获得积分？', a: 'A: 发布人奖励机制旨在鼓励用户发布真实有效的求助任务，活跃平台生态。发布人获得基础积分的10%作为奖励。' },
  { q: 'Q: 时薪基数是什么？', a: 'A: 时薪基数是计算时间积分的基准，当前为 10,000 ❤️/小时。预计完成时间越长，时间积分越高。' },
  { q: 'Q: 积分可以提现吗？', a: 'A: 当前版本暂不支持提现功能。积分用于平台内的互助任务流转。' },
];
</script>

<style scoped>
.card {
  @apply bg-white rounded-2xl border border-gray-100;
}
.section-title {
  @apply text-xl font-extrabold text-gray-900 mb-5 pb-3 border-b-2 border-red-100;
}
</style>
