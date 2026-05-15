<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">忘记密码</h1>
        <p class="text-sm text-gray-500 mt-1">通过手机验证码重置密码</p>
      </div>

      <div class="card">
        <!-- 步骤1：输入手机号 -->
        <div v-if="step === 1">
          <form @submit.prevent="handleSendCode" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input
                v-model="phone"
                type="tel"
                placeholder="+821****5432"
                class="input-field"
                required
              />
              <p class="text-xs text-gray-400 mt-1">国际格式，如中国 +86，韩国 +82</p>
            </div>

            <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>

            <button type="submit" :disabled="loading" class="btn-primary w-full">
              {{ loading ? '发送中...' : '发送验证码' }}
            </button>
          </form>
        </div>

        <!-- 步骤2：输入验证码和新密码 -->
        <div v-if="step === 2">
          <div class="mb-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
            验证码已发送到 {{ phone }}
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <input
                v-model="code"
                type="text"
                placeholder="请输入6位验证码"
                class="input-field"
                maxlength="6"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <input
                v-model="newPassword"
                type="password"
                placeholder="至少6位字符"
                class="input-field"
                minlength="6"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次输入新密码"
                class="input-field"
                minlength="6"
                required
              />
            </div>

            <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>
            <div v-if="successMsg" class="text-green-500 text-sm text-center">{{ successMsg }}</div>

            <button type="submit" :disabled="loading" class="btn-primary w-full">
              {{ loading ? '重置中...' : '重置密码' }}
            </button>

            <button type="button" @click="step = 1; code = ''; newPassword = ''; confirmPassword = ''" class="btn-secondary w-full">
              返回上一步
            </button>
          </form>
        </div>

        <!-- 步骤3：重置成功 -->
        <div v-if="step === 3" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold mb-2">密码重置成功！</h2>
          <p class="text-sm text-gray-500 mb-4">请使用新密码登录</p>
          <NuxtLink to="/auth/login" class="btn-primary w-full inline-block text-center">
            去登录
          </NuxtLink>
        </div>
      </div>

      <div class="mt-4 text-center text-sm">
        <NuxtLink to="/auth/login" class="text-red-500 hover:text-red-600 font-medium">返回登录</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getApiUrl } from '~/utils/api';

const API_BASE = getApiUrl();
const phone = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const step = ref(1);
const loading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

async function handleSendCode() {
  if (!phone.value) {
    errorMsg.value = '请输入手机号';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch(`${API_BASE}/auth/sms/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.value }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || '发送失败');
    }

    step.value = 2;
  } catch (err: any) {
    errorMsg.value = err.message || '发送验证码失败';
  } finally {
    loading.value = false;
  }
}

async function handleResetPassword() {
  if (!code.value) {
    errorMsg.value = '请输入验证码';
    return;
  }
  if (newPassword.value.length < 6) {
    errorMsg.value = '密码至少6位字符';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致';
    return;
  }

  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.value,
        code: code.value,
        newPassword: newPassword.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || '重置失败');
    }

    step.value = 3;
  } catch (err: any) {
    errorMsg.value = err.message || '密码重置失败';
  } finally {
    loading.value = false;
  }
}
</script>
