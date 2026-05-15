<template>
  <div style="padding: 40px; max-width: 600px; margin: 0 auto; font-family: sans-serif;">
    <h1>🔍 登录诊断</h1>
    <p>API地址: <code>{{ apiUrl }}</code></p>

    <div style="margin-top: 20px;">
      <button @click="testLogin" :disabled="loading" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer;">
        {{ loading ? '测试中...' : '测试登录 (+821022098999 / Admin@2026)' }}
      </button>
    </div>

    <div v-if="result" style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; white-space: pre-wrap; font-size: 13px;">
      <strong>结果:</strong><br/>
      {{ result }}
    </div>

    <div v-if="error" style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 8px; color: #dc2626;">
      <strong>错误:</strong><br/>
      {{ error }}
    </div>

    <div v-if="rawResponse" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap; font-size: 12px; max-height: 300px; overflow-y: auto;">
      <strong>Raw Response:</strong><br/>
      {{ rawResponse }}
    </div>

    <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
      <strong>💡 提示：</strong>把这个页面的截图发给我，或者把"结果"和"错误"里的内容复制给我
    </div>
  </div>
</template>

<script setup lang="ts">
const apiUrl = ref('')
const loading = ref(false)
const result = ref('')
const error = ref('')
const rawResponse = ref('')

onMounted(() => {
  apiUrl.value = window.location.hostname
})

async function testLogin() {
  loading.value = true
  result.value = ''
  error.value = ''
  rawResponse.value = ''

  const phone = '+821022098999'
  const password = 'Admin@2026'

  // Determine API URL
  const host = window.location.hostname
  const base = (host !== 'localhost' && host !== '127.0.0.1')
    ? 'https://heartchain-backend.onrender.com/api/v1'
    : 'http://localhost:3002/api/v1'

  try {
    result.value += `正在连接: ${base}/auth/password-login\n`
    result.value += `手机号: ${phone}\n`
    result.value += `密码: ${password}\n\n`

    const response = await fetch(`${base}/auth/password-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    })

    rawResponse.value = `状态码: ${response.status}\n状态文本: ${response.statusText}`

    const data = await response.json()
    rawResponse.value += `\n\n响应体:\n${JSON.stringify(data, null, 2)}`

    if (response.ok && data.accessToken) {
      result.value = `✅ 登录成功！\nToken: ${data.accessToken.substring(0, 30)}...\n用户: ${JSON.stringify(data.user)}`
    } else {
      error.value = `❌ 登录失败: ${data.message || JSON.stringify(data)}`
    }
  } catch (e: any) {
    error.value = `❌ 网络错误: ${e.message}`
  } finally {
    loading.value = false
  }
}
</script>
