<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
      <span class="text-2xl">💝</span>
      爱心榜
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-500">加载中...</div>

    <!-- 爱心榜内容 -->
    <div v-else class="space-y-6">
      <!-- 统计数据卡片 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <div class="text-3xl font-bold text-red-500">{{ stats.totalPoints }}</div>
          <div class="text-sm text-gray-500 mt-1">爱心积分总额</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-500">{{ stats.completedPoints }}</div>
          <div class="text-sm text-gray-500 mt-1">已完成积分</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-blue-500">{{ stats.memberCount }}</div>
          <div class="text-sm text-gray-500 mt-1">爱心会员人数</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-purple-500">{{ stats.completedTasks }}</div>
          <div class="text-sm text-gray-500 mt-1">已完成任务</div>
        </div>
      </div>

      <!-- 烫手爱心栏 -->
      <div class="card">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
          <span class="text-xl">🔥</span>
          烫手爱心栏 - 最新完成的爱心人士
        </h2>
        <div v-if="recentCompletions.length === 0" class="text-center py-8 text-gray-400">
          暂无完成记录，成为第一个爱心人士吧！
        </div>
        <div v-else class="space-y-3">
          <div v-for="item in recentCompletions" :key="item.id" class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-lg">{{ getEmoji(item.index) }}</span>
            </div>
            <div class="flex-1">
              <div class="font-medium">{{ item.nickname }}</div>
              <div class="text-sm text-gray-500">完成了「{{ item.taskTitle }}」</div>
              <div class="text-sm text-red-500 mt-1">💖 {{ item.message }}</div>
            </div>
            <div class="text-xs text-gray-400 flex-shrink-0">
              {{ formatDate(item.completedAt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 最感人事迹发表框 -->
      <div class="card">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
          <span class="text-xl">📝</span>
          最感人事迹
        </h2>
        
        <!-- 发表感人故事 -->
        <div v-if="auth.isLoggedIn" class="mb-4">
          <textarea 
            v-model="newStory" 
            class="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
            rows="3"
            placeholder="分享你遇到的感人爱心故事..."
          ></textarea>
          <div class="flex justify-end mt-2">
            <button 
              @click="submitStory"
              :disabled="!newStory.trim() || submitting"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? '发表中...' : '发表故事' }}
            </button>
          </div>
        </div>
        <div v-else class="mb-4 p-4 bg-gray-50 rounded-lg text-center">
          <p class="text-gray-500">登录后可以发表感人故事</p>
          <NuxtLink to="/auth/login" class="text-red-500 hover:underline mt-2 inline-block">去登录</NuxtLink>
        </div>

        <!-- 感人故事列表 -->
        <div v-if="stories.length === 0" class="text-center py-8 text-gray-400">
          暂无感人故事，成为第一个分享者吧！
        </div>
        <div v-else class="space-y-4">
          <div v-for="story in stories" :key="story.id" class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-sm">{{ story.nickname?.charAt(0) || '?' }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium">{{ story.nickname }}</span>
                  <span class="text-xs text-gray-400">{{ formatDate(story.createdAt) }}</span>
                </div>
                <p class="text-gray-700">{{ story.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 刷新按钮 -->
      <div class="text-center">
        <button @click="fetchData" class="text-red-500 hover:text-red-600">
          🔄 刷新数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApiUrl } from '~/utils/api';
const auth = useAuthStore();
const API_BASE = getApiUrl();

const loading = ref(false);
const submitting = ref(false);
const newStory = ref('');

const stats = ref({
  totalPoints: 0,
  completedPoints: 0,
  memberCount: 0,
  completedTasks: 0,
});

const recentCompletions = ref<any[]>([]);
const stories = ref<any[]>([]);

const gratitudeMessages = [
  '感谢您的无私奉献，世界因您而美好！',
  '您的爱心温暖了每一个需要帮助的人！',
  '善心善行，感恩有您！',
  '您的付出让世界充满爱！',
  '感谢您的善良，您的行动是最好的榜样！',
];

function getEmoji(index: number) {
  const emojis = ['🥇', '🥈', '🥉', '🌟', '✨', '💫', '⭐', '❤️'];
  return emojis[index % emojis.length];
}

function getRandomMessage() {
  return gratitudeMessages[Math.floor(Math.random() * gratitudeMessages.length)];
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function fetchStats() {
  try {
    // 获取所有已完成的任务来计算统计数据
    const res = await fetch(`${API_BASE}/tasks?status=completed&limit=1000`);
    if (res.ok) {
      const data = await res.json();
      const items = data.items || [];
      stats.value.completedTasks = items.length;
      stats.value.completedPoints = items.reduce((sum: number, t: any) => sum + (t.pointsReward || 0), 0);
    }

    // 获取所有任务计算总额
    const allRes = await fetch(`${API_BASE}/tasks?limit=1000`);
    if (allRes.ok) {
      const allData = await allRes.json();
      const allItems = allData.items || [];
      stats.value.totalPoints = allItems.reduce((sum: number, t: any) => sum + (t.pointsReward || 0), 0);
    }

    // 获取会员数
    const usersRes = await fetch(`${API_BASE}/users`);
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      stats.value.memberCount = usersData.total || 0;
    }
  } catch (e) {
    console.error('获取统计数据失败', e);
  }
}

async function fetchRecentCompletions() {
  try {
    // 获取已完成的任务作为最近完成记录
    const res = await fetch(`${API_BASE}/tasks?status=completed&limit=20`);
    if (res.ok) {
      const data = await res.json();
      recentCompletions.value = (data.items || []).map((task: any, index: number) => ({
        id: task.id,
        nickname: task.publisher?.nickname || '匿名爱心人士',
        taskTitle: task.title,
        completedAt: task.updatedAt,
        message: getRandomMessage(),
        index: index,
      }));
    }
  } catch (e) {
    console.error('获取最近完成记录失败', e);
  }
}

async function fetchStories() {
  // 从本地存储读取感人故事
  try {
    const saved = localStorage.getItem('heartchain_stories');
    if (saved) {
      stories.value = JSON.parse(saved);
    }
  } catch (e) {
    console.error('读取故事失败', e);
  }
}

async function submitStory() {
  if (!newStory.value.trim() || !auth.isLoggedIn) return;
  
  submitting.value = true;
  try {
    const story = {
      id: Date.now().toString(),
      nickname: auth.user?.nickname || '匿名',
      content: newStory.value.trim(),
      createdAt: new Date().toISOString(),
    };
    
    stories.value.unshift(story);
    localStorage.setItem('heartchain_stories', JSON.stringify(stories.value));
    newStory.value = '';
  } catch (e) {
    console.error('发表故事失败', e);
  } finally {
    submitting.value = false;
  }
}

async function fetchData() {
  loading.value = true;
  try {
    await Promise.all([
      fetchStats(),
      fetchRecentCompletions(),
      fetchStories(),
    ]);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  auth.restore();
  fetchData();
});

useHead({ title: '爱心榜 - HeartChain' });
</script>
