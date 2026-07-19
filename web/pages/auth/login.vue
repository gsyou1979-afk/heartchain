<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">登录</h1>
        <p class="text-sm text-gray-500 mt-1">哈特链 / HeartChain</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <div class="flex gap-2">
              <select v-model="countryCode" class="input-field w-28 flex-shrink-0">
                <option value="+82">🇰🇷 +82</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+84">🇻🇳 +84</option>
                <option value="+66">🇹🇭 +66</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+60">🇲🇾 +60</option>
                <option value="+63">🇵🇭 +63</option>
                <option value="+62">🇮🇩 +62</option>
              </select>
              <input
                v-model="phone"
                type="tel"
                placeholder="请输入手机号"
                class="input-field flex-1"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              class="input-field"
              required
            />
          </div>

          <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="mt-4 text-center text-sm text-gray-500">
          以爱心链接世界
        </div>
      </div>

      <div class="mt-4 text-center text-sm">
        <span class="text-gray-500">还没有账号？</span>
        <NuxtLink to="/auth/register" class="text-red-500 hover:text-red-600 font-medium">注册</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhone } from '~/utils/phone'

const phone = ref('')
const countryCode = ref('+82')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()
const auth = useAuthStore()

async function handleLogin() {
  if (!phone.value || !password.value) {
    errorMsg.value = '请输入手机号和密码'
    return
  }
  
  loading.value = true
  errorMsg.value = ''

  const formattedPhone = formatPhone(phone.value, countryCode.value)
  
  try {
    await auth.loginWithPhone(formattedPhone, password.value)
    router.push('/')
  } catch (err: any) {
    console.error('登录失败:', err)
    errorMsg.value = err.message || '登录失败，请检查手机号和密码'
  } finally {
    loading.value = false
  }
}
</script>
