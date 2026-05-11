<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-6">个人中心</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- User Info Card -->
      <div class="card text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-red-500">{{ userInitials }}</span>
        </div>
        <h2 class="font-semibold text-lg mb-1">{{ auth.user?.nickname || '未设置昵称' }}</h2>
        <p class="text-sm text-gray-500 mb-4">{{ auth.user?.phone }}</p>
        <div class="flex justify-center gap-4 text-sm">
          <div>
            <div class="font-bold text-red-500">{{ profileData?.stats?.totalPoints || 0 }}</div>
            <div class="text-gray-400">积分</div>
          </div>
          <div>
            <div class="font-bold text-red-500">{{ profileData?.stats?.creditScore || 0 }}</div>
            <div class="text-gray-400">信用分</div>
          </div>
          <div>
            <div class="font-bold text-red-500">{{ profileData?.stats?.completedTasks || 0 }}</div>
            <div class="text-gray-400">完成任务</div>
          </div>
        </div>
      </div>

      <!-- Profile Edit Form -->
      <div class="md:col-span-2 space-y-6">
        <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Basic Info -->
        <div class="card">
          <h3 class="font-semibold mb-4">基本信息</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <input v-model="form.nickname" type="text" class="input-field" placeholder="请输入昵称" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">地区</label>
                <select v-model="form.region" class="input-field">
                  <option value="cn">中国大陆</option>
                  <option value="kr">韩国</option>
                  <option value="global">其他地区</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input v-model="form.email" type="email" class="input-field" placeholder="请输入邮箱地址" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea v-model="form.bio" class="input-field" rows="3" placeholder="介绍一下自己..."></textarea>
            </div>

            <!-- Promotional Agreement -->
            <div class="flex items-center gap-2">
              <input v-model="form.agreePromotional" type="checkbox" id="agreePromo" class="w-4 h-4 text-red-500" />
              <label for="agreePromo" class="text-sm text-gray-600">同意接收网站推荐信息</label>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold">学历信息</h3>
            <button @click="addEducation" class="text-sm text-red-500 hover:text-red-600">
              + 添加学历
            </button>
          </div>
          <div v-if="form.education?.length" class="space-y-3">
            <div v-for="(edu, index) in form.education" :key="index" class="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
              <select v-model="edu.level" class="input-field w-28">
                <option value="">学历</option>
                <option value="high_school">高中</option>
                <option value="associate">大专</option>
                <option value="bachelor">本科</option>
                <option value="master">硕士</option>
                <option value="doctoral">博士</option>
              </select>
              <input v-model="edu.school" type="text" class="input-field flex-1 text-base" placeholder="学校名称" />
              <input v-model="edu.year" type="text" class="input-field w-28" placeholder="获得年份" />
              <button @click="removeEducation(index)" class="text-red-500 hover:text-red-600">×</button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400">暂无学历信息，点击上方按钮添加</p>

          <!-- Education bonus info -->
          <p class="text-xs text-gray-500 mt-2">
            💡 学历越高，信用分加成越多：本科+20，硕士+40，博士+60
          </p>
        </div>

        <!-- Skills -->
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold">技能标签</h3>
          </div>

          <!-- Preset Skills -->
          <div class="mb-4">
            <p class="text-sm text-gray-500 mb-2">选择技能：</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="skill in presetSkills"
                :key="skill.value"
                @click="toggleSkill(skill.value)"
                class="px-3 py-1 rounded-full text-sm transition-colors"
                :class="form.skills?.includes(skill.value) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                {{ skill.label }}
              </button>
            </div>
          </div>

          <!-- Custom Skills -->
          <div>
            <p class="text-sm text-gray-500 mb-2">自定义技能：</p>
            <div class="flex gap-2">
              <input v-model="customSkill" type="text" class="input-field flex-1" placeholder="输入自定义技能" />
              <button @click="addCustomSkill" class="btn-secondary">添加</button>
            </div>
            <div v-if="customSkills.length" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="skill in customSkills"
                :key="skill"
                class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm flex items-center gap-1"
              >
                {{ skill }}
                <button @click="removeCustomSkill(skill)" class="hover:text-blue-800">×</button>
              </span>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end items-center gap-3">
          <span v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</span>
          <span v-if="saveMsg" class="text-sm text-green-500">{{ saveMsg }}</span>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();
const API_BASE = useApiBase();

const profileData = ref<any>(null);
const saving = ref(false);
const saveMsg = ref('');
const errorMsg = ref('');
const customSkill = ref('');

// 预设技能列表
const presetSkills = [
  { value: 'medical', label: '医疗护理' },
  { value: 'legal', label: '法律咨询' },
  { value: 'teaching', label: '教育培训' },
  { value: 'tech', label: '技术开发' },
  { value: 'design', label: '设计创意' },
  { value: 'translation', label: '翻译' },
  { value: 'driving', label: '驾驶运输' },
  { value: 'cooking', label: '烹饪' },
  { value: 'cleaning', label: '保洁' },
  { value: 'repair', label: '维修' },
  { value: 'security', label: '安保' },
  { value: 'elderly_care', label: '养老护理' },
  { value: 'childcare', label: '育儿' },
  { value: 'event', label: '活动策划' },
  { value: 'media', label: '媒体宣传' },
];

const form = reactive({
  nickname: '',
  region: 'cn',
  email: '',
  bio: '',
  agreePromotional: false,
  skills: [] as string[],
  education: [] as { level: string; school: string; year: string }[],
});

// 计算属性：自定义技能（预设之外的）
const customSkills = computed(() => {
  const presetValues = presetSkills.map(s => s.value);
  return form.skills?.filter(s => !presetValues.includes(s)) || [];
});

// 预设技能的选中状态
const selectedPresets = computed(() => {
  return form.skills?.filter(s => presetSkills.some(p => p.value === s)) || [];
});

const userInitials = computed(() => {
  const name = auth.user?.nickname || auth.user?.phone || 'U';
  return name.charAt(0).toUpperCase();
});

// 获取用户资料
async function fetchProfile() {
  if (!auth.token) return;
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) {
      const data = await res.json();
      profileData.value = data;
      // 填充表单
      form.nickname = data.nickname || '';
      form.region = data.region || 'cn';
      form.email = data.email || '';
      form.bio = data.bio || '';
      form.agreePromotional = data.agreePromotional || false;
      form.skills = data.skills || [];
      form.education = data.education || [];
    }
  } catch (e) {
    console.error('获取资料失败', e);
  }
}

// 更新资料
async function updateProfile() {
  saving.value = true;
  saveMsg.value = '';
  errorMsg.value = '';
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        nickname: form.nickname,
        region: form.region,
        email: form.email,
        bio: form.bio,
        agreePromotional: form.agreePromotional,
        skills: form.skills,
        education: form.education,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      auth.user = { ...auth.user!, ...data, nickname: form.nickname };
      saveMsg.value = '✅ 保存成功！';
      setTimeout(() => (saveMsg.value = ''), 3000);
    } else {
      errorMsg.value = data.message || '保存失败，请重试';
    }
  } catch (e) {
    errorMsg.value = '网络错误，请检查网络连接';
  } finally {
    saving.value = false;
  }
}

// 切换预设技能
function toggleSkill(skill: string) {
  if (!form.skills) form.skills = [];
  const index = form.skills.indexOf(skill);
  if (index > -1) {
    form.skills.splice(index, 1);
  } else {
    form.skills.push(skill);
  }
}

// 添加自定义技能
function addCustomSkill() {
  if (!customSkill.value.trim()) return;
  if (!form.skills) form.skills = [];
  if (!form.skills.includes(customSkill.value.trim())) {
    form.skills.push(customSkill.value.trim());
  }
  customSkill.value = '';
}

// 删除自定义技能
function removeCustomSkill(skill: string) {
  if (!form.skills) return;
  const index = form.skills.indexOf(skill);
  if (index > -1) {
    form.skills.splice(index, 1);
  }
}

// 添加学历
function addEducation() {
  if (!form.education) form.education = [];
  form.education.push({ level: '', school: '', year: '' });
}

// 删除学历
function removeEducation(index: number) {
  form.education.splice(index, 1);
}

// 页面加载时获取资料
onMounted(async () => {
  await auth.restore();
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (!auth.isLoggedIn) {
    router.push('/auth/login');
    return;
  }
  fetchProfile();
});

useHead({ title: '个人中心 - HeartChain' });
</script>
