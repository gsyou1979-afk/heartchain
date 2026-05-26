<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Logo区域 -->
    <div class="text-center pt-16 pb-8">
      <div class="text-5xl mb-3">❤️</div>
      <div class="text-3xl font-bold text-[#1A1a2e]">HeartChain</div>
      <div class="text-sm text-gray-400 mt-2">{{ isLogin ? '欢迎回来' : '加入HeartChain，连接爱心' }}</div>
    </div>

    <!-- 表单区域 -->
    <div class="flex-1 px-6">
      <!-- 登录 -->
      <template v-if="isLogin">
        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">手机号</label>
          <div class="flex gap-2">
            <div class="bg-[#F5F5F5] rounded-xl px-4 py-3.5 text-sm text-gray-400">🇰🇷 +82</div>
            <input v-model="loginForm.phone" class="input-field flex-1" placeholder="010-XXXX-XXXX">
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">密码</label>
          <input v-model="loginForm.password" type="password" class="input-field" placeholder="请输入密码">
        </div>

        <div class="text-right mb-6">
          <NuxtLink to="/auth/forgot-password" class="text-xs text-[#7B1FA2] font-semibold">忘记密码？</NuxtLink>
        </div>

        <button @click="handleLogin" class="w-full btn-primary py-3.5 mb-3">登录</button>
        <button @click="isLogin = false" class="w-full btn-secondary py-3.5 mb-6">注册新账号</button>
      </template>

      <!-- 注册 -->
      <template v-else>
        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">手机号</label>
          <div class="flex gap-2">
            <div class="bg-[#F5F5F5] rounded-xl px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">🇰🇷 +82</div>
            <input v-model="regForm.phone" class="input-field flex-1" placeholder="010-XXXX-XXXX">
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">验证码</label>
          <div class="flex gap-2">
            <input v-model="regForm.code" class="input-field flex-1" placeholder="6位验证码">
            <button @click="sendCode" class="px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              :class="countdown > 0 ? 'bg-gray-200 text-gray-400' : 'bg-[#7B1FA2] text-white'">
              {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">设置密码</label>
          <input v-model="regForm.password" type="password" class="input-field" placeholder="至少8位，包含字母和数字">
        </div>

        <div class="mb-6">
          <label class="text-sm font-semibold text-gray-700 mb-1.5 block">确认密码</label>
          <input v-model="regForm.confirmPassword" type="password" class="input-field" placeholder="再次输入密码">
          <div v-if="regForm.password && regForm.confirmPassword" class="mt-1">
            <div v-if="regForm.password === regForm.confirmPassword" class="text-xs text-green-600">✅ 密码一致</div>
            <div v-else class="text-xs text-red-500">❌ 密码不一致</div>
          </div>
        </div>

        <button @click="handleRegister" class="w-full btn-primary py-3.5 mb-3">注册</button>
        <button @click="isLogin = true" class="w-full btn-secondary py-3.5 mb-6">已有账号？去登录</button>
      </template>

      <!-- 服务条款 -->
      <div class="text-center text-xs text-gray-400 pb-6">
        注册即表示同意 <span class="text-[#7B1FA2] font-semibold">《服务条款》</span> 和 <span class="text-[#7B1FA2] font-semibold">《隐私政策》</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isLogin = ref(true)
const countdown = ref(0)

const loginForm = reactive({ phone: '', password: '' })
const regForm = reactive({ phone: '', code: '', password: '', confirmPassword: '' })

function sendCode() {
  if (!regForm.phone) return alert('请输入手机号')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function handleLogin() {
  if (!loginForm.phone) return alert('请输入手机号')
  if (!loginForm.password) return alert('请输入密码')
  try {
    await auth.loginWithPhone(loginForm.phone, loginForm.password)
    router.push('/')
  } catch (e: any) {
    alert(e.message || '登录失败')
  }
}

function handleRegister() {
  if (!regForm.phone) return alert('请输入手机号')
  if (!regForm.code) return alert('请输入验证码')
  if (!regForm.password) return alert('请输入密码')
  if (regForm.password.length < 8) return alert('密码至少8位')
  if (regForm.password !== regForm.confirmPassword) return alert('两次密码不一致')
  // TODO: 调用注册API
  alert('注册成功！')
  isLogin.value = true
}
</script>
