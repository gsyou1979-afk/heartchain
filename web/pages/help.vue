<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题 -->
    <section class="bg-gradient-to-br from-red-500 via-pink-500 to-orange-400 text-white py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">平台说明</h1>
        <p class="text-white/80 text-lg">了解 HeartChain 积分系统与使用指南</p>
      </div>
    </section>

    <!-- 目录导航 -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-bold text-gray-800 mb-4">📑 目录</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a v-for="item in toc" :key="item.id" :href="'#' + item.id"
            class="text-sm text-red-500 hover:text-red-600 hover:underline py-1">{{
              item.label }}</a>
        </div>
      </div>
    </section>

    <!-- 1. 什么是 HeartChain -->
    <section id="what-is" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">什么是 HeartChain？</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          HeartChain（哈特链）是一个连接有爱心的志愿者与需要帮助的个人/组织的平台。通过完成公益任务，
          志愿者可以获得积分奖励，积分可以兑换福利或在平台内流通使用。
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div class="bg-red-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-red-500 mb-1">{{ stats.users }}</div>
            <div class="text-sm text-gray-500">注册用户</div>
          </div>
          <div class="bg-orange-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-orange-500 mb-1">{{ stats.tasks }}</div>
            <div class="text-sm text-gray-500">完成任务</div>
          </div>
          <div class="bg-pink-50 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-pink-500 mb-1">{{ stats.points }}</div>
            <div class="text-sm text-gray-500">发放积分</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. 积分系统 -->
    <section id="points-system" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">积分系统详解</h2>
        <div class="space-y-6">
          <div class="border-l-4 border-red-500 pl-4">
            <h3 class="text-lg font-semibold text-gray-800">HRT 积分</h3>
            <p class="text-gray-600 mt-1">基础积分，通过完成任务获得。可用于兑换福利、参与排行榜等。</p>
          </div>
          <div class="border-l-4 border-orange-500 pl-4">
            <h3 class="text-lg font-semibold text-gray-800">爱心值</h3>
            <p class="text-gray-600 mt-1">衡量志愿者活跃度与贡献度的综合指标，影响用户等级与特权。</p>
          </div>
          <div class="border-l-4 border-pink-500 pl-4">
            <h3 class="text-lg font-semibold text-gray-800">经验值 (EXP)</h3>
            <p class="text-gray-600 mt-1">用户等级经验，通过持续参与平台活动累积，解锁更多功能与奖励。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. 如何发布任务 -->
    <section id="how-to-post" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">如何发布任务</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-bold text-red-500">1</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">注册并登录</h3>
              <p class="text-sm text-gray-500 mt-1">使用手机号注册 HeartChain 账户，完成实名认证。</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-bold text-red-500">2</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">进入任务大厅</h3>
              <p class="text-sm text-gray-500 mt-1">点击导航栏"任务大厅"，选择"发布求助"或"发布任务"。</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-bold text-red-500">3</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">填写任务详情</h3>
              <p class="text-sm text-gray-500 mt-1">设置标题、描述、类型、地点、时间与积分奖励。</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span class="text-sm font-bold text-red-500">4</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800">等待审核</h3>
              <p class="text-sm text-gray-500 mt-1">提交后等待管理员审核，通过后任务将公开展示。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 积分计算 -->
    <section id="points-calc" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">积分计算公式</h2>
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <div class="text-center mb-3">
            <span class="text-lg font-mono font-bold text-red-500">总积分 = 基础积分 × 难度系数 × 完成质量系数</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">基础积分</span>
            <span class="text-sm text-gray-500">任务设定的基础奖励积分</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">难度系数</span>
            <span class="text-sm text-gray-500">简单 1.0 / 普通 1.5 / 困难 2.0</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-gray-100">
            <span class="text-gray-600">质量系数</span>
            <span class="text-sm text-gray-500">根据任务完成评价 0.5-1.5</span>
          </div>
        </div>
        <div class="mt-6 bg-red-50 rounded-lg p-4">
          <p class="text-sm text-red-600">
            <strong>示例：</strong>完成一个基础积分 100、难度普通(1.5)、获得好评(1.2)的任务<br/>
            总积分 = 100 × 1.5 × 1.2 = <strong>180 HRT</strong>
          </p>
        </div>
      </div>
    </section>

    <!-- 5. 积分发放流程 -->
    <section id="points-flow" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">积分发放流程</h2>
        <div class="flex flex-col md:flex-row items-center justify-center gap-4">
          <div class="bg-red-50 rounded-lg p-4 text-center w-full md:w-40">
            <div class="text-red-500 text-2xl mb-1">✅</div>
            <div class="text-sm font-semibold text-gray-700">完成任务</div>
          </div>
          <div class="text-gray-300 text-2xl hidden md:block">→</div>
          <div class="bg-orange-50 rounded-lg p-4 text-center w-full md:w-40">
            <div class="text-orange-500 text-2xl mb-1">📋</div>
            <div class="text-sm font-semibold text-gray-700">提交凭证</div>
          </div>
          <div class="text-gray-300 text-2xl hidden md:block">→</div>
          <div class="bg-pink-50 rounded-lg p-4 text-center w-full md:w-40">
            <div class="text-pink-500 text-2xl mb-1">🔍</div>
            <div class="text-sm font-semibold text-gray-700">审核通过</div>
          </div>
          <div class="text-gray-300 text-2xl hidden md:block">→</div>
          <div class="bg-green-50 rounded-lg p-4 text-center w-full md:w-40">
            <div class="text-green-500 text-2xl mb-1">🎁</div>
            <div class="text-sm font-semibold text-gray-700">积分到账</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. 常见问题 -->
    <section id="faq" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">常见问题</h2>
        <div class="space-y-4">
          <details v-for="faq in faqs" :key="faq.id" class="group border border-gray-200 rounded-lg">
            <summary class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 rounded-lg">
              <span class="font-medium text-gray-800">{{ faq.question }}</span>
              <svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{{ faq.answer }}</div>
          </details>
        </div>
      </div>
    </section>

    <!-- 底部间距 -->
    <div class="h-12"></div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '平台说明 - 哈特链 HeartChain' })

const toc = [
  { id: 'what-is', label: '什么是 HeartChain？' },
  { id: 'points-system', label: '积分系统详解' },
  { id: 'how-to-post', label: '如何发布任务' },
  { id: 'points-calc', label: '积分计算公式' },
  { id: 'points-flow', label: '积分发放流程' },
  { id: 'faq', label: '常见问题' },
]

const stats = {
  users: '1,200+',
  tasks: '850+',
  points: '50,000+',
}

const faqs = [
  {
    id: 1,
    question: '如何获得积分？',
    answer: '通过浏览任务大厅选择合适的志愿服务任务，按要求完成后提交凭证，经审核通过后积分将自动发放到您的账户。'
  },
  {
    id: 2,
    question: '积分有什么用？',
    answer: '积分是衡量您在平台上贡献的重要指标。高积分用户可以参与排行榜、解锁高级任务、兑换平台福利等。未来还将开放积分商城功能。'
  },
  {
    id: 3,
    question: '任务审核需要多久？',
    answer: '通常在工作日24小时内完成审核。周末和节假日可能稍有延长。您可以在"我的任务"中实时查看审核状态。'
  },
  {
    id: 4,
    question: '如何保证任务真实性？',
    answer: '所有任务都经过平台审核，完成任务需要提交照片/视频等凭证，由发布者和平台管理员双重确认后才发放积分。'
  },
  {
    id: 5,
    question: '可以取消已接的任务吗？',
    answer: '在任务截止时间前可以取消接单。但频繁取消可能影响您的信用评分，请确认后再接单。'
  },
]
</script>
