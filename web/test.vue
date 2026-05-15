<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold mb-4">测试登录</h1>
      
      <input 
        type="text" 
        id="testPhone" 
        placeholder="手机号" 
        class="border p-2 rounded w-full mb-2"
      />
      
      <input 
        type="password" 
        id="testPassword" 
        placeholder="密码" 
        class="border p-2 rounded w-full mb-4"
      />
      
      <button 
        @click="testLogin"
        class="bg-red-500 text-white px-6 py-2 rounded w-full hover:bg-red-600"
      >
        测试登录
      </button>
      
      <div id="status" class="mt-4 text-center text-gray-600"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const status = ref('');

function testLogin() {
  const phoneInput = document.getElementById('testPhone') as HTMLInputElement;
  const statusDiv = document.getElementById('status') as HTMLDivElement;
  
  status.value = '正在登录...';
  
  const auth = useAuthStore();
  
  auth.setAuth({
    id: 'test-1',
    phone: phoneInput.value || '123456',
    nickname: '测试用户',
    role: 'volunteer',
    region: 'cn'
  }, 'test-token-abc123');
  
  status.value = '登录成功！正在跳转...';
  
  // 延迟跳转，让用户看到成功消息
  setTimeout(() => {
    window.location.href = '/';
  }, 500);
}
</script>
