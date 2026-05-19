<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">发布广告</h1>
            <p class="text-sm text-gray-500 mt-1">一站式广告发布，支持多种类型和投放位置</p>
          </div>
          <NuxtLink to="/admin/ads" class="text-sm text-gray-500 hover:text-gray-700">
            ← 返回广告管理
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 步骤指示器 -->
      <div class="mb-8">
        <div class="flex items-center justify-center">
          <div v-for="(s, idx) in steps" :key="s.key" class="flex items-center">
            <div
              class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
              :class="step >= idx + 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'"
            >
              {{ idx + 1 }}
            </div>
            <span class="ml-2 text-sm" :class="step >= idx + 1 ? 'text-gray-900' : 'text-gray-400'">
              {{ s.label }}
            </span>
            <div v-if="idx < steps.length - 1" class="w-12 h-0.5 mx-3" :class="step > idx + 1 ? 'bg-red-500' : 'bg-gray-200'" />
          </div>
        </div>
      </div>

      <!-- Step 1: 选择广告类型 -->
      <div v-if="step === 1" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">选择广告类型</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="type in adTypes"
            :key="type.value"
            @click="form.adType = type.value"
            class="border-2 rounded-xl p-4 cursor-pointer transition-all text-center"
            :class="form.adType === type.value ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div class="text-3xl mb-2">{{ type.icon }}</div>
            <div class="font-medium text-gray-900">{{ type.label }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ type.desc }}</div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="step = 2" :disabled="!form.adType" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
            下一步 →
          </button>
        </div>
      </div>

      <!-- Step 2: 基本信息 -->
      <div v-if="step === 2" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">基本信息</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告名称 <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" class="w-full border rounded-lg px-3 py-2" placeholder="输入广告名称，如：春季招聘广告" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">广告描述</label>
            <textarea v-model="form.description" rows="3" class="w-full border rounded-lg px-3 py-2" placeholder="简要描述广告内容（可选）" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">投放开始时间</label>
              <input v-model="form.startDate" type="date" class="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">投放结束时间</label>
              <input v-model="form.endDate" type="date" class="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">总预算（元）</label>
            <input v-model.number="form.budgetTotal" type="number" min="0" class="w-full border rounded-lg px-3 py-2" placeholder="0 表示不限预算" />
          </div>
        </div>
        <div class="mt-6 flex justify-between">
          <button @click="step = 1" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">← 上一步</button>
          <button @click="step = 3" :disabled="!form.name.trim()" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">下一步 →</button>
        </div>
      </div>

      <!-- Step 3: 上传素材 -->
      <div v-if="step === 3" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">上传素材</h2>
        <p class="text-sm text-gray-500 mb-4">支持多张图片轮播，建议尺寸：横幅 1200×400，信息流 580×300</p>

        <!-- 上传区域 -->
        <div
          @click="triggerUpload"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
          class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
          :class="dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'"
        >
          <div class="text-4xl mb-2">📷</div>
          <div class="text-gray-600">拖拽图片到此处，或点击上传</div>
          <div class="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，单张最大 5MB</div>
          <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="handleFileSelect" />
        </div>

        <!-- 图片列表 -->
        <div v-if="form.items.length > 0" class="mt-4 space-y-3">
          <div v-for="(item, idx) in form.items" :key="idx" class="border rounded-lg p-3">
            <div class="flex items-start gap-3">
              <div class="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                <span v-else class="text-gray-300 text-xl">📷</span>
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-medium text-gray-500">图片 {{ idx + 1 }}</span>
                  <span class="text-xs text-gray-400 truncate">{{ item.fileName || '已上传' }}</span>
                  <span v-if="item.uploading" class="text-xs text-blue-500">上传中...</span>
                  <span v-if="item.error" class="text-xs text-red-500">{{ item.error }}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <input v-model="item.landingUrl" type="text" class="border rounded px-2 py-1 text-xs" placeholder="跳转链接（可选）" />
                  <input v-model.number="item.rotationSeconds" type="number" min="1" max="60" class="border rounded px-2 py-1 text-xs" placeholder="轮播秒数" />
                </div>
              </div>
              <button @click="removeItem(idx)" class="text-red-400 hover:text-red-600 text-lg flex-shrink-0">×</button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button @click="step = 2" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">← 上一步</button>
          <button @click="step = 4" :disabled="form.items.length === 0" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">下一步 →</button>
        </div>
      </div>

      <!-- Step 4: 选择投放位置 -->
      <div v-if="step === 4" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">选择投放位置</h2>
        <p class="text-sm text-gray-500 mb-4">选择广告展示的位置，可多选</p>

        <div class="space-y-3">
          <div
            v-for="p in availablePlacements"
            :key="p.code"
            @click="togglePlacement(p.code)"
            class="border rounded-lg p-4 cursor-pointer transition-all"
            :class="form.placementCodes.includes(p.code) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <input type="checkbox" :checked="form.placementCodes.includes(p.code)" class="rounded" />
                <div>
                  <div class="font-medium text-gray-900">{{ p.name }}</div>
                  <div class="text-xs text-gray-500">{{ p.code }} · {{ p.width }}×{{ p.height }} · {{ getPositionText(p) }}</div>
                </div>
              </div>
              <div class="text-xs text-gray-400">{{ p.floorCpm }} CPM</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button @click="step = 3" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">← 上一步</button>
          <button @click="step = 5" :disabled="form.placementCodes.length === 0" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">下一步 →</button>
        </div>
      </div>

      <!-- Step 5: 预览 & 提交 -->
      <div v-if="step === 5" class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">预览 & 提交</h2>

        <!-- 预览卡片 -->
        <div class="border rounded-xl p-4 mb-6 bg-gray-50">
          <div class="text-sm font-medium text-gray-700 mb-3">广告预览</div>
          <div class="bg-white rounded-lg p-4 space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">{{ getAdTypeLabel(form.adType) }}</span>
              <span class="font-medium">{{ form.name }}</span>
            </div>
            <p v-if="form.description" class="text-sm text-gray-600">{{ form.description }}</p>
            <div v-if="form.items.length > 0" class="flex gap-2 overflow-x-auto">
              <div v-for="(item, idx) in form.items" :key="idx" class="w-32 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-for="code in form.placementCodes" :key="code" class="text-xs px-2 py-0.5 bg-gray-100 rounded">{{ code }}</span>
            </div>
          </div>
        </div>

        <!-- 提交信息 -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div class="flex items-start gap-2">
            <span class="text-yellow-600">⚠️</span>
            <div class="text-sm text-yellow-800">
              <p class="font-medium">提交后需要管理员审核</p>
              <p class="mt-1">广告将在审核通过后自动投放，请确保内容真实有效。</p>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button @click="step = 4" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">← 上一步</button>
          <div class="flex gap-3">
            <button @click="saveDraft" :disabled="submitting" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">
              保存草稿
            </button>
            <button @click="submitAd" :disabled="submitting" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
              {{ submitting ? '提交中...' : '提交审核' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 成功提示 -->
      <div v-if="step === 6" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <div class="text-5xl mb-4">✅</div>
        <h2 class="text-xl font-semibold mb-2">发布成功！</h2>
        <p v-if="auth.user?.role === 'admin'" class="text-gray-500 mb-6">广告已直接激活，正在各广告位投放中。</p>
        <p v-else class="text-gray-500 mb-6">广告已提交审核，审核通过后自动投放。</p>
        <div class="flex justify-center gap-3">
          <NuxtLink to="/admin/ads" class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">返回广告管理</NuxtLink>
          <button @click="resetForm" class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">继续发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getApiUrl } from '~/utils/api';

const auth = useAuthStore();
const router = useRouter();
const API = getApiUrl() + '/ad';

const steps = [
  { key: 'type', label: '选择类型' },
  { key: 'info', label: '基本信息' },
  { key: 'media', label: '上传素材' },
  { key: 'placement', label: '投放位置' },
  { key: 'preview', label: '预览提交' },
];

const adTypes = [
  { value: 'commercial', label: '商业广告', icon: '🏪', desc: '商品/服务推广' },
  { value: 'public_service', label: '公益广告', icon: '❤️', desc: '公益/志愿者活动' },
  { value: 'recruitment', label: '招聘广告', icon: '💼', desc: '家教/商户招工' },
  { value: 'school', label: '学校广告', icon: '🎓', desc: '学校/教育机构' },
];

const step = ref(1);
const submitting = ref(false);
const dragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const availablePlacements = ref<any[]>([]);

const form = reactive({
  adType: '',
  name: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  budgetTotal: 0,
  placementCodes: [] as string[],
  items: [] as Array<{
    imageUrl: string;
    fileName: string;
    landingUrl: string;
    rotationSeconds: number;
    uploading: boolean;
    error: string;
  }>,
});

onMounted(async () => {
  await auth.restore();
  if (!auth.isLoggedIn) {
    router.push('/');
    return;
  }
  // 加载可用广告位
  try {
    const res = await fetch(`${API}/placements?activeOnly=true`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (res.ok) availablePlacements.value = await res.json();
  } catch (e) {
    console.error('加载广告位失败', e);
  }
});

function getAdTypeLabel(type: string) {
  return adTypes.find(t => t.value === type)?.label || type;
}

function getPositionText(p: any): string {
  const map: Record<string, string> = {
    hero: '首页顶部', feed: '首页中部', footer: '首页底部',
    sidebar: '右侧边栏', splash: '开屏',
    'left-top': '左侧-上', 'left-middle': '左侧-中', 'left-bottom': '左侧-下',
    'center-top': '中间-上', 'center-middle': '中间-中', 'center-bottom': '中间-下',
    'right-top': '右侧-上', 'right-middle': '右侧-中', 'right-bottom': '右侧-下',
  };
  return map[p.position] || p.position || '未知';
}

function togglePlacement(code: string) {
  const idx = form.placementCodes.indexOf(code);
  if (idx >= 0) {
    form.placementCodes.splice(idx, 1);
  } else {
    form.placementCodes.push(code);
  }
}

function triggerUpload() {
  fileInput.value?.click();
}

function handleFileSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files) addFiles(Array.from(files));
}

function handleDrop(e: DragEvent) {
  dragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files) addFiles(Array.from(files));
}

function addFiles(files: File[]) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    if (file.size > 5 * 1024 * 1024) {
      alert(`文件 ${file.name} 超过5MB限制`);
      continue;
    }
    // 创建本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
      form.items.push({
        imageUrl: e.target?.result as string,
        fileName: file.name,
        landingUrl: '',
        rotationSeconds: 5,
        uploading: false,
        error: '',
      });
    };
    reader.readAsDataURL(file);
  }
}

function removeItem(idx: number) {
  form.items.splice(idx, 1);
}

async function saveDraft() {
  // 保存到 localStorage
  localStorage.setItem('ad_draft', JSON.stringify(form));
  alert('草稿已保存');
}

async function submitAd() {
  if (!form.name.trim()) { alert('请输入广告名称'); return; }
  if (form.items.length === 0) { alert('请至少上传一张图片'); return; }
  if (form.placementCodes.length === 0) { alert('请选择至少一个投放位置'); return; }

  submitting.value = true;
  try {
    // Step 1: Create campaign via POST /campaigns (status defaults to 'draft')
    const createRes = await fetch(`${API}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
      body: JSON.stringify({
        advertiserId: auth.user?.id || '',
        name: form.name,
        adType: form.adType,
        pricingModel: 'cpm',
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        budgetTotal: form.budgetTotal || undefined,
        placements: form.placementCodes,
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({ message: '创建失败' }));
      alert(err.message || '创建失败，请重试');
      return;
    }

    const campaign = await createRes.json();

    // Step 2: Save ad items (images) if any
    if (form.items.length > 0 && campaign.id) {
      const itemsPayload = form.items.map((item, idx) => ({
        campaignId: campaign.id,
        imageUrl: item.imageUrl,
        landingUrl: item.landingUrl || '',
        taskId: item.taskId || null,
        rotationSeconds: item.rotationSeconds || 5,
        sortOrder: idx,
      }));
      await fetch(`${API}/items/campaign/${campaign.id}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify(itemsPayload),
      });

      // Step 2b: Create AdCreative from first item (so requestAd can find it)
      const firstItem = form.items[0];
      if (firstItem.imageUrl) {
        const creativeRes = await fetch(`${API}/creatives`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
          body: JSON.stringify({
            campaignId: campaign.id,
            title: form.name,
            description: form.description || '',
            imageUrl: firstItem.imageUrl,
            landingUrl: firstItem.landingUrl || '/',
            creativeType: 'image',
          }),
        });
        if (creativeRes.ok) {
          const creative = await creativeRes.json();
          // Auto-approve the creative
          await fetch(`${API}/creatives/${creative.id}/approve`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${auth.token}` },
          });
        }
      }
    }

    // Step 3: Update status
    // Admin users bypass review → directly 'active'; others go to 'pending' for review
    if (campaign.id) {
      const isAdmin = auth.user?.role === 'admin';
      const finalStatus = isAdmin ? 'active' : 'pending';
      await fetch(`${API}/campaigns/${campaign.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ status: finalStatus }),
      });
    }

    step.value = 6; // 成功页面
  } catch (e) {
    alert('网络错误，请重试');
  } finally {
    submitting.value = false;
  }
}

function resetForm() {
  step.value = 1;
  form.adType = '';
  form.name = '';
  form.description = '';
  form.startDate = new Date().toISOString().split('T')[0];
  form.endDate = '';
  form.budgetTotal = 0;
  form.placementCodes = [];
  form.items = [];
}
</script>
