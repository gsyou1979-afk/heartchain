<template>
  <div class="min-h-screen bg-[#FAF5FF]">
    <!-- 顶部 -->
    <div class="gradient-dark px-4 pt-4">
      <div class="flex items-center gap-3 mb-5">
        <button @click="step > 1 ? step-- : $router.back()" class="text-white text-lg">←</button>
        <span class="text-white font-semibold text-lg">发布求助</span>
      </div>
      <!-- 步骤指示 -->
      <div class="flex items-center gap-2 pb-5">
        <div v-for="s in 4" :key="s" class="flex items-center gap-2 flex-1">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            :class="s < step ? 'bg-[#FFB300] text-white' : s === step ? 'bg-white text-[#1A1a2e]' : 'bg-white/20 text-white/50'">
            {{ s < step ? '✓' : s }}
          </div>
          <span class="text-xs" :class="s <= step ? 'text-white' : 'text-white/40'">{{ stepNames[s-1] }}</span>
          <div v-if="s < 4" class="flex-1 h-px" :class="s < step ? 'bg-[#FFB300]' : 'bg-white/20'"></div>
        </div>
      </div>
    </div>

    <div class="px-4 -mt-3 pb-6">
      <!-- Step 1: 基本信息 -->
      <template v-if="step === 1">
        <div class="card mb-4">
          <div class="text-sm font-semibold text-gray-700 mb-3">选择任务类型</div>
          <div class="grid grid-cols-3 gap-3 mb-5">
            <button v-for="(name, key) in typeNames" :key="key"
              @click="form.type = key"
              class="py-4 rounded-2xl text-center transition-all flex flex-col items-center gap-2"
              :class="form.type === key ? 'bg-[#7B1FA2] text-white shadow-lg shadow-purple-200' : 'bg-white border border-gray-100 text-gray-600'"
            >
              <span class="text-2xl">{{ typeEmoji[key] }}</span>
              <span class="text-xs font-semibold">{{ name }}</span>
            </button>
          </div>

          <div class="mb-4">
            <label class="text-sm font-semibold text-gray-700 mb-1.5 block">任务标题</label>
            <input v-model="form.title" class="input-field" placeholder="简短描述你的需求，如：帮忙买药">
          </div>

          <div>
            <label class="text-sm font-semibold text-gray-700 mb-1.5 block">详细描述</label>
            <textarea v-model="form.description" class="input-field min-h-[100px] resize-none" placeholder="详细说明任务内容、注意事项等..."></textarea>
          </div>
        </div>

        <button @click="step = 2" class="w-full btn-primary py-3.5" :disabled="!form.type || !form.title">下一步 →</button>
      </template>

      <!-- Step 2: 时间 & 地点 -->
      <template v-if="step === 2">
        <div class="card mb-4">
          <div class="text-sm font-semibold text-gray-700 mb-3">⏰ 需要在多长时间内完成？</div>
          <div class="flex gap-3 mb-5">
            <button v-for="t in timeOptions" :key="t.value"
              @click="form.deadlineHours = t.value"
              class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
              :class="form.deadlineHours === t.value ? 'bg-[#FFB300] text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ t.emoji }} {{ t.label }}
            </button>
          </div>

          <div class="text-sm font-semibold text-gray-700 mb-3">📍 任务地点</div>
          <div class="bg-green-50 rounded-xl p-3 flex items-center gap-2 mb-3">
            <span class="text-lg">📍</span>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ location.address }}</div>
              <div class="text-xs text-green-600">{{ location.status }}</div>
            </div>
            <button class="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">重新定位</button>
          </div>

          <div>
            <label class="text-sm font-semibold text-gray-700 mb-1.5 block">详细地址（可选）</label>
            <input v-model="form.addressDetail" class="input-field" placeholder="如：역삼동 123-45，3楼">
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="step = 1" class="flex-1 btn-secondary py-3.5">← 上一步</button>
          <button @click="step = 3" class="flex-1 btn-primary py-3.5">下一步 →</button>
        </div>
      </template>

      <!-- Step 3: 报酬 & 图片 -->
      <template v-if="step === 3">
        <div class="card mb-4">
          <div class="text-sm font-semibold text-gray-700 mb-3">💰 报酬金额</div>
          <div class="flex items-center gap-3 mb-3">
            <input v-model="form.rewardAmount" type="number" class="input-field text-2xl font-bold text-center" placeholder="0">
            <span class="text-lg text-gray-500">원</span>
          </div>
          <div class="flex gap-2 mb-4">
            <button v-for="a in [3000, 5000, 10000, 20000]" :key="a"
              @click="form.rewardAmount = a"
              class="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600"
            >
              {{ a.toLocaleString() }}원
            </button>
          </div>

          <!-- 积分开关 -->
          <div class="flex items-center justify-between p-3 bg-purple-50 rounded-xl mb-5">
            <div>
              <div class="text-sm font-semibold text-[#7B1FA2]">接受❤️积分代替</div>
              <div class="text-xs text-gray-500">对方可以用积分代替金钱支付</div>
            </div>
            <button @click="form.acceptPoints = !form.acceptPoints"
              class="w-12 h-7 rounded-full transition-all relative"
              :class="form.acceptPoints ? 'bg-[#7B1FA2]' : 'bg-gray-300'">
              <div class="w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow"
                :class="form.acceptPoints ? 'right-1' : 'left-1'"></div>
            </button>
          </div>

          <div class="text-sm font-semibold text-gray-700 mb-3">📷 添加图片（可选）</div>
          <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-3 cursor-pointer hover:border-[#7B1FA2] transition-colors"
            @click="$refs.fileInput.click()">
            <div class="text-3xl mb-2">📷</div>
            <div class="text-sm text-gray-500">点击上传 · 最多3张</div>
            <input ref="fileInput" type="file" accept="image/*" multiple class="hidden">
          </div>
          <div v-if="form.images.length > 0" class="flex gap-2">
            <div v-for="(img, i) in form.images" :key="i" class="w-20 h-20 rounded-xl bg-gray-100 relative flex items-center justify-center text-2xl">
              {{ img }}
              <button @click="form.images.splice(i, 1)" class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="step = 2" class="flex-1 btn-secondary py-3.5">← 上一步</button>
          <button @click="step = 4" class="flex-1 btn-primary py-3.5">下一步 →</button>
        </div>
      </template>

      <!-- Step 4: 确认发布 -->
      <template v-if="step === 4">
        <div class="card mb-4">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">{{ typeEmoji[form.type] }}</div>
            <div class="text-sm text-gray-400">确认发布信息</div>
          </div>

          <!-- 预览卡片 -->
          <div class="bg-[#FAF5FF] rounded-xl p-4 mb-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">{{ typeEmoji[form.type] }}</span>
              <span class="font-semibold">{{ form.title }}</span>
            </div>
            <div class="text-sm text-gray-600 mb-3 whitespace-pre-line">{{ form.description }}</div>
            <div class="flex flex-wrap gap-3 text-xs text-gray-500">
              <span>📍 {{ location.address }}</span>
              <span>⏰ {{ timeOptions.find(t => t.value === form.deadlineHours)?.label || '不限' }}</span>
              <span v-if="form.rewardAmount > 0">💰 ₩{{ Number(form.rewardAmount).toLocaleString() }}</span>
              <span v-if="form.acceptPoints">❤️ 接受积分</span>
            </div>
          </div>

          <!-- 匿名开关 -->
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-4">
            <div>
              <div class="text-sm font-semibold">匿名发布</div>
              <div class="text-xs text-gray-500">不显示你的姓名和头像</div>
            </div>
            <button @click="form.anonymous = !form.anonymous"
              class="w-12 h-7 rounded-full transition-all relative"
              :class="form.anonymous ? 'bg-[#7B1FA2]' : 'bg-gray-300'">
              <div class="w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow"
                :class="form.anonymous ? 'right-1' : 'left-1'"></div>
            </button>
          </div>

          <div class="flex items-start gap-2">
            <input type="checkbox" v-model="form.agreeTerms" class="mt-1 accent-[#7B1FA2] w-4 h-4">
            <span class="text-xs text-gray-500">我已阅读并同意 <span class="text-[#7B1FA2] font-semibold">《服务条款》</span>和<span class="text-[#7B1FA2] font-semibold">《隐私政策》</span></span>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="step = 3" class="flex-1 btn-secondary py-3.5">← 上一步</button>
          <button @click="submitTask" class="flex-1 btn-primary py-3.5" :disabled="!form.agreeTerms">📢 发布求助</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const step = ref(1)
const stepNames = ['类型', '时间地点', '报酬图片', '确认']

const typeEmoji = { errand: '🛒', transport: '🚗', teach: '📱', pet: '🐕', repair: '🔧', delivery: '📦' }
const typeNames = { errand: '跑腿', transport: '搬运', teach: '教学', pet: '宠物', repair: '维修', delivery: '快递' }

const timeOptions = [
  { value: 0.5, label: '30分钟', emoji: '⚡' },
  { value: 2, label: '1小时', emoji: '🕐' },
  { value: 24, label: '今天', emoji: '📅' },
  { value: 999, label: '不限', emoji: '♾️' },
]

const location = reactive({
  address: '서울시 강남구 역삼동',
  status: 'GPS 已定位',
  lat: 37.5665,
  lng: 126.9780,
})

const form = reactive({
  type: '',
  title: '',
  description: '',
  deadlineHours: 2,
  addressDetail: '',
  rewardAmount: 5000,
  acceptPoints: true,
  images: [],
  anonymous: false,
  agreeTerms: false,
})

function submitTask() {
  alert('求助已发布！附近的人将看到你的请求。')
  router.push('/')
}
</script>
