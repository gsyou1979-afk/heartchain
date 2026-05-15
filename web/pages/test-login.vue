<template>
  <div style="padding: 50px; text-align: center;">
    <h1>测试登录页面</h1>
    <button @click="testLogin">点击测试登录</button>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();

function testLogin() {
  console.log('testLogin called!');
  alert('函数被调用了！');
  
  auth.setAuth({
    id: '1',
    phone: '123',
    nickname: '测试用户',
    role: 'volunteer',
    region: 'cn'
  }, 'token');
  
  alert('即将跳转...');
  window.location.href = '/';
}
</script>
