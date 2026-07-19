<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold mb-6">{{ $t('nav.wallet') }}</h1>

    <!-- Balance Card -->
    <div class="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white mb-8">
      <p class="text-white/80 text-sm mb-1">{{ $t('wallet.balance') }}</p>
      <div class="text-4xl font-bold mb-4">0.00 <span class="text-xl">HRT</span></div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">{{ $t('wallet.send') }}</button>
        <button class="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">{{ $t('wallet.receive') }}</button>
      </div>
    </div>

    <!-- Transaction History -->
    <div>
      <h2 class="text-lg font-semibold mb-4">{{ $t('wallet.history') }}</h2>
      <div class="card">
        <p class="text-sm text-gray-400 text-center py-8">{{ $t('common.noData') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Wallet - HeartChain' });
</script>
