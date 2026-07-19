<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">我的成就</h1>
        <p class="text-gray-500 mt-2">记录您的爱心足迹</p>
      </div>

      <!-- 成就卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-2">💰</div>
          <div class="text-2xl font-bold text-gray-900">{{ totalPoints }}</div>
          <div class="text-sm text-gray-500">爱心积分</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-2">✅</div>
          <div class="text-2xl font-bold text-gray-900">{{ completedTasks }}</div>
          <div class="text-sm text-gray-500">完成任务</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-2">🔥</div>
          <div class="text-2xl font-bold text-gray-900">{{ totalTaskHours }}</div>
          <div class="text-sm text-gray-500">服务时长(小时)</div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="text-3xl mb-2">⭐</div>
          <div class="text-2xl font-bold text-gray-900">{{ creditScore }}</div>
          <div class="text-sm text-gray-500">信誉评分</div>
        </div>
      </div>

      <!-- 证明发放按钮 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">📜 志愿证明</h2>
        <p class="text-gray-500 mb-4">
          下载您的志愿活动参与证明书，记录您的爱心贡献。
        </p>
        <button
          @click="generateCertificate"
          :disabled="isGenerating || completedTasks === 0"
          class="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {{ isGenerating ? '生成中...' : '📄 下载志愿证明' }}
        </button>
        <p v-if="completedTasks === 0" class="text-sm text-gray-400 mt-2">
          完成至少一个任务后才能生成证明
        </p>
      </div>

      <!-- 任务历史 -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-4">📋 任务历史</h2>
        
        <div v-if="loading" class="text-center py-8 text-gray-500">
          加载中...
        </div>
        
        <div v-else-if="taskHistory.length === 0" class="text-center py-8 text-gray-400">
          暂无任务记录
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="task in taskHistory"
            :key="task.id"
            class="border border-gray-100 rounded-lg p-4"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ task.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span v-if="task.schedule">
                    {{ formatDate(task.schedule.date) }}
                    {{ task.schedule.startTime }} - {{ task.schedule.endTime }}
                  </span>
                  <span>{{ getTaskTypeName(task.taskType) }}</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-bold text-red-500">+{{ task.pointsReward }}</div>
                <div class="text-sm text-gray-400">积分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 证明预览弹窗 -->
    <div v-if="showCertificate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showCertificate = false">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div id="certificate-content" class="p-8" style="width: 210mm; min-height: 297mm; background: white;">
          <!-- 证明内容 -->
          <div class="text-center">
            <div class="text-4xl mb-4">❤️</div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">志愿服务证明书</h1>
            <h2 class="text-xl text-gray-600 mb-8">Volunteer Service Certificate</h2>
          </div>
          
          <div class="space-y-6 text-base leading-relaxed">
            <p class="text-indent-2">
              <strong>{{ userInfo?.nickname || '志愿者' }}</strong> 于 
              <strong>{{ certificatePeriod }}</strong> 期间，积极参与哈特链平台组织的志愿服务活动，
              展现了无私奉献的爱心精神。
            </p>
            
            <div class="border-t border-b border-gray-200 py-6 my-6">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-500">参与活动次数：</span>
                  <span class="font-bold">{{ completedTasks }} 次</span>
                </div>
                <div>
                  <span class="text-gray-500">累计服务时长：</span>
                  <span class="font-bold">{{ totalTaskHours }} 小时</span>
                </div>
                <div>
                  <span class="text-gray-500">获得爱心积分：</span>
                  <span class="font-bold">{{ totalPoints }} 分</span>
                </div>
                <div>
                  <span class="text-gray-500">信誉评分：</span>
                  <span class="font-bold">{{ creditScore }} 分</span>
                </div>
              </div>
            </div>
            
            <p class="text-indent-2">
              在此期间，您用实际行动诠释了"奉献、友爱、互助、进步"的志愿精神，
              为社会和谐发展贡献了自己的力量。世界因您而更美好！
            </p>
            
            <p class="text-center text-xl font-bold text-red-500 mt-8">
              "感谢您的每一份付出，世界因您更美丽！"
            </p>
          </div>
          
          <div class="mt-12 flex justify-between items-end">
            <div class="text-left">
              <p class="text-gray-500 text-sm">证明单位：哈特链 HeartChain</p>
              <p class="text-gray-500 text-sm mt-2">发证日期：{{ issueDate }}</p>
            </div>
            <div class="text-right">
              <div class="text-4xl mb-2">🔴</div>
              <p class="text-gray-600 font-bold">哈特链 会长</p>
              <p class="text-gray-400 text-sm mt-1">{{ issueDate }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t flex justify-end gap-4">
          <button
            @click="showCertificate = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            关闭
          </button>
          <button
            @click="downloadCertificate"
            class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            📥 下载PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const apiBase = '/api/v1';

// 数据
const loading = ref(true);
const taskHistory = ref<any[]>([]);
const isGenerating = ref(false);
const showCertificate = ref(false);
const userInfo = ref<any>(null);

// 计算属性
const totalPoints = computed(() => userInfo.value?.pointBalance || 0);
const creditScore = computed(() => userInfo.value?.creditScore || 0);
const completedTasks = computed(() => taskHistory.value.filter(t => t.status === 'completed').length);
const totalTaskHours = computed(() => {
  return taskHistory.value.reduce((sum, task) => {
    if (task.schedule?.startTime && task.schedule?.endTime) {
      const start = parseInt(task.schedule.startTime.split(':')[0]);
      const end = parseInt(task.schedule.endTime.split(':')[0]);
      return sum + (end - start);
    }
    return sum;
  }, 0);
});

const issueDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});

const certificatePeriod = computed(() => {
  if (taskHistory.value.length === 0) return '暂无';
  const dates = taskHistory.value
    .filter(t => t.schedule?.date)
    .map(t => t.schedule.date)
    .sort();
  if (dates.length === 0) return '暂无';
  return `${dates[0]} 至 ${dates[dates.length - 1]}`;
});

// 获取用户信息和任务历史
const fetchData = async () => {
  if (!auth.token || !auth.user?.id) return;
  
  try {
    // 获取用户信息
    const userRes = await fetch(`${apiBase}/users/${auth.user.id}`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    });
    if (userRes.ok) {
      userInfo.value = await userRes.json();
    }
    
    // 获取已完成的任务
    const tasksRes = await fetch(`${apiBase}/tasks/my/published?status=completed`, {
      headers: { 'Authorization': `Bearer ${auth.token}` }
    });
    if (tasksRes.ok) {
      const data = await tasksRes.json();
      taskHistory.value = data.items || [];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 生成证明
const generateCertificate = () => {
  if (completedTasks.value === 0) return;
  isGenerating.value = true;
  
  setTimeout(() => {
    showCertificate.value = true;
    isGenerating.value = false;
  }, 500);
};

// 下载证明 (使用 html2canvas + jsPDF)
const downloadCertificate = async () => {
  try {
    // 动态加载 html2canvas 和 jsPDF
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const element = document.getElementById('certificate-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`志愿证明_${userInfo.value?.nickname || '志愿者'}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('生成PDF失败:', error);
    alert('生成PDF失败，请重试');
  }
};

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '';
  return date.replace(/-/g, '年').replace(/T.*/, '') + '日';
};

// 获取任务类型名称
const getTaskTypeName = (type: string) => {
  const names: Record<string, string> = {
    single_once: '单人单次',
    single_multi: '单人多次',
    team_once: '团队单次',
    team_multi: '团队多次'
  };
  return names[type] || type;
};

// 初始化
onMounted(() => {
  if (auth.isLoggedIn) {
    fetchData();
  }
});
</script>

<style scoped>
.text-indent-2 {
  text-indent: 2em;
}
</style>
