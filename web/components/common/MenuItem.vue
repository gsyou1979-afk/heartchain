<template>
  <NuxtLink :to="to" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
    <span class="text-lg">{{ icon }}</span>
    <span class="text-sm text-gray-700">{{ label }}</span>
    <span v-if="badge" class="ml-auto text-xs bg-[#7B1FA2] text-white px-2 py-0.5 rounded-full">{{ badge }}</span>
    <span class="ml-auto text-gray-300 text-sm">›</span>
  </NuxtLink>
</template>

<script setup>
defineProps({ icon: String, label: String, to: String, badge: String })
</script>
