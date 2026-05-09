<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div class="mb-6">
      <NuxtLink to="/settings" class="text-red-500 hover:text-red-600 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        返回设置
      </NuxtLink>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-6">
      <h1 class="text-2xl font-bold mb-6">广告偏好设置</h1>

      <!-- Ad Enabled Toggle -->
      <div class="mb-8 pb-6 border-b">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-medium">广告展示</h2>
            <p class="text-sm text-gray-500 mt-1">关闭后将不再展示任何广告</p>
          </div>
          <button
            @click="toggleAdEnabled"
            :class="settings.adEnabled ? 'bg-red-500' : 'bg-gray-300'"
            class="relative w-14 h-7 rounded-full transition-colors"
          >
            <span
              :class="settings.adEnabled ? 'translate-x-7' : 'translate-x-1'"
              class="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
            ></span>
          </button>
        </div>
      </div>

      <!-- Ad Type Preferences -->
      <div v-if="settings.adEnabled" class="mb-8">
        <h2 class="text-lg font-medium mb-4">广告类型偏好</h2>
        <p class="text-sm text-gray-500 mb-4">选择您希望看到的广告类型，帮助我们为您推荐相关内容</p>

        <div class="space-y-4">
          <div
            v-for="adType in adTypes"
            :key="adType.key"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div :class="adType.bgColor" class="w-10 h-10 rounded-lg flex items-center justify-center">
                <span class="text-xl">{{ adType.icon }}</span>
              </div>
              <div>
                <div class="font-medium">{{ adType.name }}</div>
                <div class="text-xs text-gray-500">{{ adType.description }}</div>
              </div>
            </div>
            <button
              @click="toggleAdType(adType.key)"
              :class="settings.preferences[adType.key] ? 'bg-red-500' : 'bg-gray-300'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="settings.preferences[adType.key] ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Frequency Settings -->
      <div v-if="settings.adEnabled" class="mb-8">
        <h2 class="text-lg font-medium mb-4">展示频率</h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-gray-600">每日最多广告数</label>
            <select v-model="settings.maxDailyAds" class="input-field mt-1">
              <option :value="10">10条</option>
              <option :value="20">20条</option>
              <option :value="50">50条</option>
              <option :value="100">100条（无限制）</option>
            </select>
          </div>

          <div>
            <label class="text-sm text-gray-600">信息流广告间隔</label>
            <select v-model="settings.adInterval" class="input-field mt-1">
              <option :value="3">每3条内容</option>
              <option :value="5">每5条内容</option>
              <option :value="10">每10条内容</option>
              <option :value="20">每20条内容</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div v-if="settings.adEnabled" class="mb-8 pb-6 border-b">
        <h2 class="text-lg font-medium mb-4">个性化推荐</h2>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">基于兴趣的推荐</div>
            <p class="text-sm text-gray-500 mt-1">根据您的浏览和互动历史推荐相关广告</p>
          </div>
          <button
            @click="togglePersonalization"
            :class="settings.personalizedAds ? 'bg-red-500' : 'bg-gray-300'"
            class="relative w-12 h-6 rounded-full transition-colors"
          >
            <span
              :class="settings.personalizedAds ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow transition-transform"
            ></span>
          </button>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex gap-3">
        <button @click="resetToDefault" class="btn-secondary flex-1">
          恢复默认
        </button>
        <button @click="saveSettings" class="btn-primary flex-1" :disabled="saving">
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>

      <!-- Toast -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="showToast" class="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          {{ toastMessage }}
        </div>
      </Transition>
    </div>

    <!-- Ad Statistics Preview -->
    <div v-if="settings.adEnabled" class="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-medium mb-4">您的贡献</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ stats.adsViewed }}</div>
          <div class="text-xs text-gray-500 mt-1">浏览广告</div>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ stats.adsClicked }}</div>
          <div class="text-xs text-gray-500 mt-1">点击广告</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ stats.pointsEarned }}</div>
          <div class="text-xs text-gray-500 mt-1">获得积分</div>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-4 text-center">
        每浏览1次广告可获得1积分，每点击1次广告可获得5积分
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const API_BASE = 'http://localhost:3002/api/v1';
const saving = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

const adTypes = [
  { key: 'projectAds', name: '项目求助广告', description: '紧急求助、助学、扶贫等公益项目', icon: '❤️', bgColor: 'bg-red-100' },
  { key: 'charityAds', name: '公益广告', description: '公益活动宣传、志愿服务招募等', icon: '🌍', bgColor: 'bg-green-100' },
  { key: 'commercialAds', name: '商业广告', description: '企业品牌推广、产品促销等信息', icon: '🏢', bgColor: 'bg-blue-100' },
];

const settings = ref({
  adEnabled: true,
  preferences: {
    projectAds: true,
    charityAds: true,
    commercialAds: false,
  },
  maxDailyAds: 20,
  adInterval: 5,
  personalizedAds: true,
});

const stats = ref({
  adsViewed: 0,
  adsClicked: 0,
  pointsEarned: 0,
});

onMounted(async () => {
  await loadSettings();
});

async function loadSettings() {
  try {
    const res = await fetch(`${API_BASE}/users/me/ad-preferences`, {
      headers: { Authorization: `Bearer ${useCookie('accessToken').value}` },
    });
    if (res.ok) {
      const data = await res.json();
      settings.value = { ...settings.value, ...data };
    }
  } catch (e) {
    console.error('Failed to load ad settings');
  }
}

async function saveSettings() {
  saving.value = true;
  try {
    await fetch(`${API_BASE}/users/me/ad-preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCookie('accessToken').value}`,
      },
      body: JSON.stringify(settings.value),
    });
    showToastMessage('设置已保存');
  } catch (e) {
    showToastMessage('保存失败');
  } finally {
    saving.value = false;
  }
}

function toggleAdEnabled() {
  settings.value.adEnabled = !settings.value.adEnabled;
}

function toggleAdType(key: string) {
  settings.value.preferences[key] = !settings.value.preferences[key];
}

function togglePersonalization() {
  settings.value.personalizedAds = !settings.value.personalizedAds;
}

function resetToDefault() {
  settings.value = {
    adEnabled: true,
    preferences: {
      projectAds: true,
      charityAds: true,
      commercialAds: false,
    },
    maxDailyAds: 20,
    adInterval: 5,
    personalizedAds: true,
  };
  showToastMessage('已恢复默认设置');
}

function showToastMessage(message: string) {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
}
</script>
