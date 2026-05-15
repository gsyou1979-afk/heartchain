<template>
  <footer class="bg-white border-t border-gray-100 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-3">
            <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-lg font-bold">{{ $t('app.name') }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ $t('app.slogan') }}</p>
          <p class="text-xs text-gray-400 mt-2">&copy; {{ new Date().getFullYear() }} HeartChain. All rights reserved.</p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Platform</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><NuxtLink to="/tasks" class="hover:text-red-500">{{ $t('nav.tasks') }}</NuxtLink></li>
            <li><NuxtLink to="/teams" class="hover:text-red-500">{{ $t('nav.teams') }}</NuxtLink></li>
            <li><a href="#" class="hover:text-red-500">About</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Support</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a href="#" class="hover:text-red-500">Help Center</a></li>
            <li><a href="#" class="hover:text-red-500">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-red-500">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
