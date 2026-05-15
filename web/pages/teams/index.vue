<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ $t('nav.teams') }}</h1>
      <div class="flex gap-3">
        <button class="btn-secondary text-sm">{{ $t('team.join') }}</button>
        <button class="btn-primary text-sm">{{ $t('team.create') }}</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="card hover:shadow-md transition-shadow">
        <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
          <span class="text-lg font-bold text-red-500">T{{ i }}</span>
        </div>
        <h3 class="font-semibold mb-1">Sample Team {{ i }}</h3>
        <p class="text-sm text-gray-500 mb-3">Team description here</p>
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>{{ 10 * i }} {{ $t('team.members') }}</span>
          <span>{{ i * 500 }} {{ $t('team.totalPoints') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Teams - HeartChain' });
</script>
