<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-6">我的任务</h1>

    <!-- 未登录提示 -->
    <div v-if="!auth.isLoggedIn" class="text-center py-12">
      <p class="text-gray-500 mb-4">请先登录查看我的任务</p>
      <button @click="router.push('/auth/login')" class="btn-primary">去登录</button>
    </div>

    <!-- 已登录 -->
    <div v-else>
      <!-- Tab Navigation -->
      <div class="flex gap-2 mb-6 border-b">
        <button 
          @click="activeTab = 'published'"
          class="px-4 py-2 font-medium transition-colors border-b-2"
          :class="activeTab === 'published' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          我发布的 ({{ publishedTasks.length }})
        </button>
        <button 
          @click="activeTab = 'joined'"
          class="px-4 py-2 font-medium transition-colors border-b-2"
          :class="activeTab === 'joined' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          我接的任务 ({{ joinedTasks.length }})
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12 text-gray-500">加载中...</div>

      <!-- 我发布的任务 -->
      <div v-else-if="activeTab === 'published'" class="space-y-4">
        <div v-if="publishedTasks.length === 0" class="text-center py-12 text-gray-400">
          暂无发布的任务
        </div>
        <div v-else class="space-y-4">
          <div v-for="task in publishedTasks" :key="task.id" class="card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="badge" :class="'badge-' + task.taskType">{{ getTaskTypeLabel(task.taskType) }}</span>
                  <span v-if="task.status === 'open'" class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded">招募中</span>
                  <span v-else-if="task.status === 'in_progress'" class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded">进行中</span>
                  <span v-else-if="task.status === 'completed'" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">已完成</span>
                </div>
                <h3 class="font-semibold mb-1">{{ task.title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ formatTaskSchedule(task.schedule) }} · {{ task.location || '不限地点' }}</p>
                <div class="flex items-center gap-4 text-sm">
                  <span class="text-red-500 font-medium">{{ task.pointsReward }} HRT</span>
                  <span v-if="task.teamSize" class="text-gray-500">已报名 {{ task.currentParticipants || 0 }}/{{ task.teamSize }}</span>
                  <span v-else class="text-gray-500">{{ task.assigneeId ? '已接取' : '待接取' }}</span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <button v-if="task.status === 'open' && task.assigneeId" 
                        @click="completeTask(task)"
                        class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                  确认完成
                </button>
                <button v-if="task.status === 'open'"
                        @click="cancelTask(task)"
                        class="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-lg hover:bg-red-50">
                  取消任务
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我接的任务 -->
      <div v-else-if="activeTab === 'joined'" class="space-y-4">
        <div v-if="joinedTasks.length === 0" class="text-center py-12 text-gray-400">
          暂无接取的任务
        </div>
        <div v-else class="space-y-4">
          <div v-for="task in joinedTasks" :key="task.id" class="card">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="badge" :class="'badge-' + task.taskType">{{ getTaskTypeLabel(task.taskType) }}</span>
                  <span v-if="task.status === 'open'" class="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded">待开始</span>
                  <span v-else-if="task.status === 'in_progress'" class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded">进行中</span>
                  <span v-else-if="task.status === 'completed'" class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">已完成</span>
                </div>
                <h3 class="font-semibold mb-1">{{ task.title }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ formatTaskSchedule(task.schedule) }} · {{ task.location || '不限地点' }}</p>
                <p class="text-sm text-gray-500">发布者：{{ task.publisher?.nickname || '未知' }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-red-500 font-medium">{{ task.pointsReward }} HRT</span>
                <button v-if="task.status === 'in_progress'" 
                        @click="confirmComplete(task)"
                        class="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                  完成任务
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 查询完成任务情况按钮 -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold mb-2">📊 完成任务统计</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-red-500">{{ taskStats.total }}</div>
              <div class="text-sm text-gray-500">总任务</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-500">{{ taskStats.completed }}</div>
              <div class="text-sm text-gray-500">已完成</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-yellow-500">{{ taskStats.inProgress }}</div>
              <div class="text-sm text-gray-500">进行中</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-500">{{ taskStats.points }}</div>
              <div class="text-sm text-gray-500">获得积分</div>
            </div>
          </div>
          <button @click="refreshStats" class="mt-4 text-sm text-red-500 hover:text-red-600">
            🔄 刷新统计
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApiUrl } from '~/utils/api';
const auth = useAuthStore();
const router = useRouter();
const API_BASE = getApiUrl();

const activeTab = ref('published');
const loading = ref(false);
const publishedTasks = ref<any[]>([]);
const joinedTasks = ref<any[]>([]);
const taskStats = ref({ total: 0, completed: 0, inProgress: 0, points: 0 });

const taskTypeLabels: Record<string, string> = {
  single_once: '单人单次',
  single_multi: '单人多次',
  team_once: '团队单次',
  team_multi: '团队多次',
};

function getTaskTypeLabel(type: string) {
  return taskTypeLabels[type] || type;
}

function formatTaskSchedule(schedule: any) {
  if (!schedule) return '时间待定';
  if (schedule.type === 'once' && schedule.date) {
    const date = new Date(schedule.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    if (schedule.startTime && schedule.endTime) {
      return `${date} ${schedule.startTime}-${schedule.endTime}`;
    }
    return date;
  }
  if (schedule.type === 'range' && schedule.startDate && schedule.endDate) {
    const start = new Date(schedule.startDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    const end = new Date(schedule.endDate).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    return `${start} 至 ${end}`;
  }
  return '时间待定';
}

// 获取我发布的任务
async function fetchPublishedTasks() {
  if (!auth.isLoggedIn) return;
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/tasks/my/published`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      const data = await res.json();
      publishedTasks.value = data.items || data || [];
    }
  } catch (e) {
    console.error('获取我发布的任务失败', e);
  } finally {
    loading.value = false;
  }
}

// 获取我接的任务
async function fetchJoinedTasks() {
  if (!auth.isLoggedIn) return;
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}/tasks/my/joined`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      const data = await res.json();
      joinedTasks.value = data.items || data || [];
      calculateStats();
    }
  } catch (e) {
    console.error('获取我接的任务失败', e);
  } finally {
    loading.value = false;
  }
}

// 计算统计数据
function calculateStats() {
  taskStats.value = {
    total: joinedTasks.value.length,
    completed: joinedTasks.value.filter(t => t.status === 'completed').length,
    inProgress: joinedTasks.value.filter(t => t.status === 'in_progress').length,
    points: joinedTasks.value.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.pointsReward || 0), 0),
  };
}

// 刷新统计
function refreshStats() {
  fetchJoinedTasks();
}

// 取消任务（发布者）
async function cancelTask(task: any) {
  if (!confirm('确定要取消这个任务吗？')) return;
  try {
    const res = await fetch(`${API_BASE}/tasks/${task.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      fetchPublishedTasks();
      alert('任务已取消');
    } else {
      const data = await res.json();
      alert(data.message || '取消失败');
    }
  } catch (e) {
    alert('网络错误');
  }
}

// 확인 완료（자원봉사자）
async function confirmComplete(task: any) {
  if (!confirm('정말로 작업을 완료하시겠습니까?')) return;
  try {
    const res = await fetch(`${API_BASE}/tasks/${task.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      fetchJoinedTasks();
      alert('완료 확인되었습니다!');
    } else {
      const data = await res.json();
      // 자원봉사자가 완료 버튼을 눌렀을 때 안내 메시지
      if (data.message && data.message.includes('publisher')) {
        alert('작업자가 아직 확인을 완료하지 않았습니다. 작업자와 수혜자가 모두 확인하면 포인트가 지갑으로 지급되고 작업이 종료됩니다. 사랑한 마음 감사합니다!');
      } else {
        alert(data.message || '작업 실패');
      }
    }
  } catch (e) {
    alert('네트워크 오류');
  }
}

// 确认完成（发布者）
async function completeTask(task: any) {
  if (!confirm('确认任务已完成？')) return;
  try {
    const res = await fetch(`${API_BASE}/tasks/${task.id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      fetchPublishedTasks();
      alert('任务已完成！');
    } else {
      const data = await res.json();
      alert(data.message || '操作失败');
    }
  } catch (e) {
    alert('网络错误');
  }
}

// 监听 Tab 切换
watch(activeTab, (tab) => {
  if (tab === 'published') {
    fetchPublishedTasks();
  } else {
    fetchJoinedTasks();
  }
});

// 监听登录状态恢复
watch(() => auth.isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    if (activeTab.value === 'published') {
      fetchPublishedTasks();
    } else {
      fetchJoinedTasks();
    }
  }
});

onMounted(async () => {
  // 恢复登录状态
  await auth.restore();
  
  // 延迟检查登录状态，确保恢复完成
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!auth.isLoggedIn) {
    router.push('/auth/login');
    return;
  }
  fetchPublishedTasks();
});

useHead({ title: '我的任务 - HeartChain' });
</script>
