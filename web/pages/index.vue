<template>
  <div class="min-h-screen bg-[#FAF5FF]">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div class="flex items-center justify-between px-4 h-14">
        <!-- 左侧：头像/菜单 -->
        <button @click="showSideMenu = true" class="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-lg font-bold shadow-md">
          {{ userInitial }}
        </button>

        <!-- 中间：Logo -->
        <div class="flex items-center gap-1.5">
          <span class="text-xl">❤️</span>
          <span class="text-lg font-bold text-[#1A1A2E]">HeartChain</span>
        </div>

        <!-- 右侧：筛选按钮 -->
        <button @click="showFilter = true" class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
        </button>
      </div>

      <!-- 筛选标签条 -->
      <div class="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
        <button
          @click="showFilter = true"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
          :class="filterDistance < 50 ? 'bg-[#7B1FA2] text-white' : 'bg-gray-100 text-gray-600'"
        >
          📍 {{ filterDistance >= 50 ? '全城' : filterDistance + 'km' }}
        </button>
        <button
          @click="showFilter = true"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
          :class="filterTime < 999 ? 'bg-[#FFB300] text-white' : 'bg-gray-100 text-gray-600'"
        >
          ⏰ {{ filterTime >= 999 ? '不限' : (filterTime <= 1 ? filterTime + 'h内' : '今天') }}
        </button>
        <button
          v-for="t in selectedTypes"
          :key="t"
          @click="toggleType(t)"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#7B1FA2] text-white whitespace-nowrap"
        >
          {{ typeEmoji[t] }} {{ typeNames[t] }}
        </button>
        <button
          v-if="selectedTypes.length === 0"
          @click="showFilter = true"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 whitespace-nowrap"
        >
          全部类型
        </button>
      </div>
    </header>

    <!-- 成就横幅 -->
    <div class="px-4 pt-4">
      <div class="gradient-dark rounded-2xl p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-6 -translate-x-6"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">🏆</span>
              <span class="text-sm font-medium opacity-80">本月成就</span>
            </div>
            <NuxtLink to="/achievement" class="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              详情 →
            </NuxtLink>
          </div>
          <div class="text-3xl font-bold mb-1">{{ stats.monthlyHelps }} 次帮助</div>
          <div class="text-sm opacity-80">+{{ stats.monthlyPoints }} ❤️ 爱心积分</div>
          <div class="flex gap-6 mt-3">
            <div>
              <div class="text-lg font-bold">{{ stats.totalHelps }}</div>
              <div class="text-xs opacity-60">总帮助</div>
            </div>
            <div>
              <div class="text-lg font-bold">{{ stats.totalPoints.toLocaleString() }}</div>
              <div class="text-xs opacity-60">总积分</div>
            </div>
            <div>
              <div class="text-lg font-bold">#{{ stats.rank }}</div>
              <div class="text-xs opacity-60">排名</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="px-4 pt-4">
      <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl h-40 relative overflow-hidden">
        <!-- 模拟地图 -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-green-300"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-green-200"></div>
        </div>
        <!-- 用户位置 -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
        </div>
        <!-- 任务标记 -->
        <div v-for="(task, i) in nearbyTasks" :key="task.id"
          :style="{ top: markerPositions[i]?.top, left: markerPositions[i]?.left }"
          class="absolute z-10 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          @click="openTaskDetail(task)"
        >
          <div class="bg-white rounded-full p-1.5 shadow-lg border-2 border-[#7B1FA2]">
            <span class="text-sm">{{ typeEmoji[task.type] || '📌' }}</span>
          </div>
        </div>
        <!-- 切换按钮 -->
        <button class="absolute bottom-3 right-3 bg-white/90 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 shadow">
          📋 列表视图
        </button>
      </div>
    </div>

    <!-- 附近任务列表 -->
    <div class="px-4 pt-4 pb-6">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-700">附近 {{ filteredTasks.length }} 个求助</span>
        <span class="text-xs text-gray-400">实时更新</span>
      </div>

      <div v-if="filteredTasks.length === 0" class="text-center py-12 text-gray-400">
        <div class="text-4xl mb-3">🔍</div>
        <div class="text-base font-medium">附近暂无求助</div>
        <div class="text-sm mt-1">试试扩大搜索范围？</div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          @click="openTaskDetail(task)"
          class="card cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">{{ typeEmoji[task.type] || '📌' }}</span>
                <span class="font-semibold text-[#1A1a2e] truncate">{{ task.title }}</span>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <span>📍 {{ task.distance }}km</span>
                <span v-if="task.deadline" :class="isUrgent(task.deadline) ? 'text-red-500 font-semibold' : ''">
                  ⏰ {{ formatDeadline(task.deadline) }}
                </span>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ task.address }}</div>
            </div>
            <button
              @click.stop="acceptTask(task)"
              class="btn-help flex-shrink-0"
            >
              我来帮助
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详情弹窗（底部弹出式） -->
    <Transition name="slide-up">
      <div v-if="selectedTask" class="fixed inset-0 z-[100] flex items-end">
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="selectedTask = null"></div>
        <!-- 详情卡片 -->
        <div class="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
          <!-- 拖动指示条 -->
          <div class="sticky top-0 bg-white pt-3 pb-2 z-10">
            <div class="w-10 h-1 bg-gray-300 rounded-full mx-auto"></div>
          </div>

          <div class="px-5 pb-6">
            <!-- 标题 -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-2xl">{{ typeEmoji[selectedTask.type] || '📌' }}</span>
                  <span class="text-xl font-bold text-[#1A1a2e]">{{ selectedTask.title }}</span>
                </div>
                <div class="text-sm text-gray-400">{{ formatTimeAgo(selectedTask.createdAt) }}</div>
              </div>
              <div v-if="selectedTask.deadline" class="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                ⏰ {{ formatDeadline(selectedTask.deadline) }}
              </div>
            </div>

            <!-- 求助者信息 -->
            <div class="flex items-center gap-3 p-3 bg-[#FAF5FF] rounded-xl mb-4">
              <div class="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                {{ selectedTask.creator?.name?.charAt(0) || '?' }}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-sm">{{ selectedTask.creator?.name || '匿名用户' }}</div>
                <div class="text-xs text-gray-500">⭐ {{ selectedTask.creator?.rating || 5.0 }} · 已完成 {{ selectedTask.creator?.completedTasks || 0 }} 次求助</div>
              </div>
              <button class="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-semibold">💬 聊天</button>
            </div>

            <!-- 任务详情 -->
            <div class="mb-4">
              <div class="text-sm font-semibold text-gray-700 mb-2">📋 任务详情</div>
              <div class="text-sm text-gray-600 leading-relaxed bg-[#FAF5FF] p-3 rounded-xl">{{ selectedTask.description }}</div>
            </div>

            <!-- 位置 -->
            <div class="mb-4">
              <div class="text-sm font-semibold text-gray-700 mb-2">📍 位置</div>
              <div class="bg-green-50 rounded-xl p-3 flex items-center gap-2">
                <span class="text-lg">🗺️</span>
                <div class="flex-1">
                  <div class="text-sm font-medium">{{ selectedTask.address }}</div>
                  <div class="text-xs text-green-600">距你 {{ selectedTask.distance }}km · 步行约 {{ Math.ceil(selectedTask.distance * 12) }} 分钟</div>
                </div>
                <button class="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold">导航</button>
              </div>
            </div>

            <!-- 奖励 -->
            <div class="flex gap-3 mb-6">
              <div class="flex-1 bg-purple-50 rounded-xl p-3 text-center">
                <div class="text-xl font-bold text-[#7B1FA2]">+{{ selectedTask.pointsReward || 200 }} ❤️</div>
                <div class="text-xs text-gray-500">爱心积分</div>
              </div>
              <div v-if="selectedTask.rewardAmount > 0" class="flex-1 bg-yellow-50 rounded-xl p-3 text-center">
                <div class="text-xl font-bold text-[#FFB300]">₩{{ selectedTask.rewardAmount?.toLocaleString() }}</div>
                <div class="text-xs text-gray-500">报酬</div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-3">
              <button @click="selectedTask = null" class="flex-1 btn-secondary py-3.5">稍后再看</button>
              <button @click="acceptTask(selectedTask)" class="flex-2 btn-primary py-3.5">✋ 我来帮助</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 侧边设置菜单 -->
    <Transition name="slide-left">
      <div v-if="showSideMenu" class="fixed inset-0 z-[100]">
        <div class="absolute inset-0 bg-black/50" @click="showSideMenu = false"></div>
        <div class="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col">
          <!-- 用户信息 -->
          <div class="gradient-dark p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                {{ userInitial }}
              </div>
              <div class="flex-1">
                <div class="text-white font-semibold">{{ userName }}</div>
                <div class="text-white/60 text-xs">{{ userPhone }}</div>
                <div class="text-[#FFB300] text-xs mt-0.5">⭐ {{ userRating }} · {{ userLevel }}</div>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="flex-1 text-center">
                <div class="text-white font-bold text-lg">{{ stats.totalHelps }}</div>
                <div class="text-white/50 text-[10px]">帮助次数</div>
              </div>
              <div class="flex-1 text-center">
                <div class="text-white font-bold text-lg">{{ stats.totalPoints.toLocaleString() }}</div>
                <div class="text-white/50 text-[10px]">爱心积分</div>
              </div>
              <div class="flex-1 text-center">
                <div class="text-white font-bold text-lg">#{{ stats.rank }}</div>
                <div class="text-white/50 text-[10px]">排名</div>
              </div>
            </div>
          </div>

          <!-- 菜单列表 -->
          <div class="flex-1 overflow-y-auto py-2">
            <MenuItem icon="📋" label="我的任务" to="/mytasks" @click="showSideMenu = false" />
            <MenuItem icon="📝" label="发布求助" to="/tasks/publish" @click="showSideMenu = false" />
            <MenuItem icon="💳" label="钱包" to="/wallet" @click="showSideMenu = false" />
            <MenuItem icon="🏆" label="成就" to="/achievement" @click="showSideMenu = false" />
            <MenuItem icon="📊" label="统计" to="/stats" @click="showSideMenu = false" />
            <div class="h-px bg-gray-100 mx-4 my-2"></div>
            <MenuItem icon="📍" label="定位设置" to="/settings/location" @click="showSideMenu = false" />
            <MenuItem icon="🔔" label="通知设置" to="/settings/notifications" @click="showSideMenu = false" />
            <MenuItem icon="🌐" label="语言/Language" to="/settings/language" @click="showSideMenu = false" />
            <div class="h-px bg-gray-100 mx-4 my-2"></div>
            <MenuItem icon="❓" label="帮助中心" to="/help" @click="showSideMenu = false" />
            <MenuItem icon="⚙️" label="系统设置" to="/settings" @click="showSideMenu = false" />
          </div>

          <!-- 退出 -->
          <div class="p-4 border-t border-gray-100">
            <button @click="handleLogout" class="flex items-center gap-3 text-red-500 font-medium text-sm">
              <span>🚪</span> 退出登录
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 筛选弹窗 -->
    <Transition name="slide-up">
      <div v-if="showFilter" class="fixed inset-0 z-[100] flex items-end">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showFilter = false"></div>
        <div class="relative w-full bg-white rounded-t-3xl p-5 pb-8">
          <div class="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div class="text-lg font-bold text-[#1A1a2e] mb-4">筛选条件</div>

          <!-- 距离 -->
          <div class="mb-5">
            <div class="text-sm font-semibold text-gray-700 mb-2">📍 搜索半径</div>
            <input type="range" v-model="filterDistance" min="1" max="50" class="w-full accent-[#7B1FA2]">
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>1km</span>
              <span class="text-[#7B1FA2] font-bold text-base">{{ filterDistance >= 50 ? '全城' : filterDistance + 'km' }}</span>
              <span>50km</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button v-for="d in [1, 5, 10, 50]" :key="d"
                @click="filterDistance = d"
                class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                :class="filterDistance === d ? 'bg-[#7B1FA2] text-white' : 'bg-gray-100 text-gray-600'"
              >
                {{ d >= 50 ? '全城' : d + 'km' }}
              </button>
            </div>
          </div>

          <!-- 时间 -->
          <div class="mb-5">
            <div class="text-sm font-semibold text-gray-700 mb-2">⏰ 时间要求</div>
            <div class="flex gap-2">
              <button v-for="(t, i) in [{v:0.5,l:'30分钟'},{v:2,l:'2小时'},{v:24,l:'今天'},{v:999,l:'不限'}]" :key="i"
                @click="filterTime = t.v"
                class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                :class="filterTime === t.v ? 'bg-[#FFB300] text-white' : 'bg-gray-100 text-gray-600'"
              >
                {{ t.l }}
              </button>
            </div>
          </div>

          <!-- 类型 -->
          <div class="mb-5">
            <div class="text-sm font-semibold text-gray-700 mb-2">任务类型</div>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="(name, key) in typeNames" :key="key"
                @click="toggleType(key)"
                class="py-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1"
                :class="selectedTypes.includes(key) ? 'bg-[#7B1FA2] text-white' : 'bg-gray-100 text-gray-600'"
              >
                <span class="text-lg">{{ typeEmoji[key] }}</span>
                {{ name }}
              </button>
            </div>
          </div>

          <button @click="showFilter = false" class="w-full btn-primary py-3.5">应用筛选</button>
        </div>
      </div>
    </Transition>

    <!-- 浮动发布按钮 -->
    <button @click="$router.push('/tasks/publish')" class="fixed bottom-6 right-5 w-14 h-14 gradient-accent rounded-full shadow-lg shadow-yellow-300 flex items-center justify-center text-white text-2xl z-40 active:scale-95 transition-transform">
      ＋
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 用户数据
const userName = ref('김영수')
const userPhone = ref('+82 10-****-8999')
const userRating = ref(4.8)
const userLevel = ref('Lv.3 热心市民')
const userInitial = computed(() => userName.value.charAt(0))

// 统计
const stats = ref({
  totalHelps: 36,
  monthlyHelps: 12,
  totalPoints: 12400,
  monthlyPoints: 2400,
  rank: 3
})

// 筛选
const showFilter = ref(false)
const filterDistance = ref(5)
const filterTime = ref(2)
const selectedTypes = ref([])

// 菜单
const showSideMenu = ref(false)

// 类型
const typeEmoji = { errand: '🛒', transport: '🚗', teach: '📱', pet: '🐕', repair: '🔧', delivery: '📦' }
const typeNames = { errand: '跑腿', transport: '搬运', teach: '教学', pet: '宠物', repair: '维修', delivery: '快递' }

// 任务详情
const selectedTask = ref(null)

// 模拟任务数据
const nearbyTasks = ref([
  { id: 1, type: 'errand', title: '帮忙买药', description: '할머니 댁에 약을 사다 드려야 하는데, 제가 출장중이라 부탁드립니다. 약국은 역삼동 하나로약국이고, 처방전은 사진으로 보내드릴게요.', distance: 0.8, address: '서울시 강남구 역삼동', deadline: new Date(Date.now() + 20*60000), pointsReward: 200, rewardAmount: 5000, createdAt: new Date(Date.now() - 10*60000), creator: { name: '김영수', rating: 4.8, completedTasks: 23 } },
  { id: 2, type: 'transport', title: '帮忙搬行李', description: '이사 짐을 옮겨야 하는데 혼자서 너무 무거워서 도움을 요청합니다. 엘리베이터 있는 4층에서 1층으로.', distance: 1.2, address: '서울시 강남구 삼성동', deadline: new Date(Date.now() + 50*60000), pointsReward: 350, rewardAmount: 10000, createdAt: new Date(Date.now() - 25*60000), creator: { name: '이민지', rating: 4.9, completedTasks: 15 } },
  { id: 3, type: 'teach', title: '教老人用手机', description: '어머니가 스마트폰을 못 쓰셔서, 카카오톡 보내는 법 좀 가르쳐 주세요.', distance: 2.5, address: '서울시 서초구 반포동', deadline: new Date(Date.now() + 2*3600000), pointsReward: 150, rewardAmount: 0, createdAt: new Date(Date.now() - 60*60000), creator: { name: '박지훈', rating: 4.5, completedTasks: 8 } },
  { id: 4, type: 'pet', title: '帮忙遛狗', description: '오늘 갑자기 일이 생겨서 산책을 시켜드리지 못합니다. 골든리트리버 1마리, 아이에요.', distance: 3.1, address: '서울시 강남구 청담동', deadline: new Date(Date.now() + 3*3600000), pointsReward: 100, rewardAmount: 3000, createdAt: new Date(Date.now() - 120*60000), creator: { name: '최수연', rating: 4.7, completedTasks: 31 } },
])

// 地图标记位置
const markerPositions = [
  { top: '35%', left: '40%' },
  { top: '55%', left: '60%' },
  { top: '25%', left: '70%' },
  { top: '65%', left: '30%' },
]

// 筛选后的任务
const filteredTasks = computed(() => {
  let tasks = [...nearbyTasks.value]

  // 距离筛选
  const maxDist = filterDistance.value >= 50 ? Infinity : filterDistance.value
  tasks = tasks.filter(t => t.distance <= maxDist)

  // 类型筛选
  if (selectedTypes.value.length > 0) {
    tasks = tasks.filter(t => selectedTypes.value.includes(t.type))
  }

  // 时间筛选
  if (filterTime.value < 999) {
    const cutoff = new Date(Date.now() + filterTime.value * 3600000)
    tasks = tasks.filter(t => new Date(t.deadline) <= cutoff)
  }

  return tasks.sort((a, b) => a.distance - b.distance)
})

function toggleType(type) {
  const idx = selectedTypes.value.indexOf(type)
  if (idx >= 0) {
    selectedTypes.value.splice(idx, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

function openTaskDetail(task) {
  selectedTask.value = task
}

function acceptTask(task) {
  alert(`已接单：${task.title}\n求助者将收到通知！`)
  selectedTask.value = null
}

function formatDeadline(deadline) {
  if (!deadline) return ''
  const diff = new Date(deadline) - Date.now()
  if (diff <= 0) return '已过期'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}分钟后`
  const hours = Math.floor(mins / 60)
  return `${hours}小时后`
}

function formatTimeAgo(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

function isUrgent(deadline) {
  return deadline && (new Date(deadline) - Date.now() < 30 * 60000)
}

function handleLogout() {
  // 清除登录状态
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  showSideMenu.value = false
  router.push('/auth/register')
}

onMounted(() => {
  // TODO: 获取用户GPS位置
  // TODO: 加载附近任务
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); }

.slide-left-enter-active,
.slide-left-leave-active { transition: all 0.3s ease; }
.slide-left-enter-from { transform: translateX(-100%); }
.slide-left-leave-to { transform: translateX(-100%); }
</style>
