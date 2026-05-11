<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">注册</h1>
        <p class="text-sm text-gray-500 mt-1">哈特链 HeartChain</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input v-model="form.phone" type="tel" placeholder="请输入手机号（如 +821098765432）" class="input-field" />
          </div>

          <!-- SMS Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <div class="flex gap-2">
              <input v-model="form.code" type="text" placeholder="请输入验证码" class="input-field flex-1" maxlength="6" />
              <button
                type="button"
                @click="sendCode"
                :disabled="countdown > 0"
                class="btn-secondary text-sm whitespace-nowrap"
                :class="{ 'opacity-50 cursor-not-allowed': countdown > 0 }"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input v-model="form.password" type="password" placeholder="请设置密码（至少6位）" class="input-field" />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" class="input-field" />
          </div>

          <!-- Nickname -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
            <input v-model="form.nickname" type="text" placeholder="请输入昵称" class="input-field" />
          </div>

          <!-- Region -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">地区</label>
            <select v-model="form.region" class="input-field">
              <option value="cn">中国大陆</option>
              <option value="kr">韩国</option>
              <option value="global">其他地区</option>
            </select>
          </div>

          <!-- Ad Preferences -->
          <div class="border-t pt-4 mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-3">广告偏好设置</h3>
            <p class="text-xs text-gray-500 mb-3">选择您希望看到的广告类型，帮助我们为您推荐相关内容</p>

            <div class="space-y-3">
              <label class="flex items-start gap-3">
                <input v-model="form.adPreferences.projectAds" type="checkbox" class="mt-1 w-4 h-4 text-red-500 rounded" />
                <div>
                  <span class="text-sm font-medium">项目求助广告</span>
                  <p class="text-xs text-gray-500">紧急求助、助学、扶贫等公益项目</p>
                </div>
              </label>

              <label class="flex items-start gap-3">
                <input v-model="form.adPreferences.charityAds" type="checkbox" class="mt-1 w-4 h-4 text-red-500 rounded" />
                <div>
                  <span class="text-sm font-medium">公益广告</span>
                  <p class="text-xs text-gray-500">公益活动宣传、志愿服务招募等</p>
                </div>
              </label>

              <label class="flex items-start gap-3">
                <input v-model="form.adPreferences.commercialAds" type="checkbox" class="mt-1 w-4 h-4 text-red-500 rounded" />
                <div>
                  <span class="text-sm font-medium">商业广告</span>
                  <p class="text-xs text-gray-500">企业品牌推广、产品促销等信息</p>
                </div>
              </label>
            </div>

            <div class="mt-4">
              <label class="flex items-center gap-2">
                <input v-model="form.adEnabled" type="checkbox" class="w-4 h-4 text-red-500 rounded" />
                <span class="text-sm">启用个性化广告推荐</span>
              </label>
              <p class="text-xs text-gray-500 mt-1 ml-6">关闭后您仍会看到广告，但不会基于您的兴趣推荐</p>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>

          <!-- Submit -->
          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </form>
      </div>

      <div class="mt-4 text-center text-sm">
        <span class="text-gray-500">已有账号？</span>
        <NuxtLink to="/auth/login" class="text-red-500 hover:text-red-600 font-medium">登录</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  region: 'cn',
  adEnabled: true,
  adPreferences: {
    projectAds: true,
    charityAds: true,
    commercialAds: false,
  },
});
const loading = ref(false);
const countdown = ref(0);
const error = ref('');
let timer: ReturnType<typeof setInterval>;

const getApiBase = useApiBase;

async function sendCode() {
  if (!form.phone) return;
  try {
    const res = await fetch(`${getApiBase()}/auth/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: form.phone }),
    });
    if (!res.ok) {
      const data = await res.json();
      error.value = data.message || '发送失败';
      return;
    }
    countdown.value = 60;
    timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) clearInterval(timer);
    }, 1000);
  } catch (e) {
    error.value = '网络错误';
  }
}

async function handleRegister() {
  if (!form.phone || !form.code || !form.password) {
    error.value = '请填写手机号、验证码和密码';
    return;
  }
  if (form.password.length < 6) {
    error.value = '密码至少6位';
    return;
  }
  if (form.password !== form.confirmPassword) {
    error.value = '两次密码不一致';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(`${getApiBase()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: form.phone,
        code: form.code,
        password: form.password,
        nickname: form.nickname || undefined,
        region: form.region,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      error.value = data.message || '注册失败';
      return;
    }
    auth.setAuth(data.user, data.accessToken, data.refreshToken);
    window.location.href = '/';
  } catch (e) {
    error.value = '网络错误';
  } finally {
    loading.value = false;
  }
}
</script>
