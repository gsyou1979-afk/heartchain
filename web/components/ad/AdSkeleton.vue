<template>
  <div class="ad-skeleton" :class="`ad-skeleton--${type}`">
    <!-- Banner Skeleton -->
    <div v-if="type === 'banner'" class="skeleton-banner">
      <div class="skeleton-slide"></div>
      <div class="skeleton-dots">
        <div class="skeleton-dot"></div>
        <div class="skeleton-dot"></div>
        <div class="skeleton-dot"></div>
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--text"></div>
        <div class="skeleton-line skeleton-line--text skeleton-line--short"></div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div v-else-if="type === 'sidebar'" class="skeleton-sidebar">
      <div class="skeleton-box"></div>
    </div>

    <!-- Native Feed Skeleton -->
    <div v-else-if="type === 'native-feed'" class="skeleton-native">
      <div v-for="i in count" :key="i" class="skeleton-item">
        <div class="skeleton-item__image"></div>
        <div class="skeleton-item__content">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type: 'banner' | 'card' | 'sidebar' | 'native-feed'
  count?: number
}>(), {
  count: 3
})
</script>

<style scoped>
.ad-skeleton {
  --shimmer-color: #f0f0f0;
  --shimmer-highlight: #e0e0e0;
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Banner Skeleton */
.skeleton-banner {
  width: 100%;
  height: 400px;
  background: var(--shimmer-color);
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-slide {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0px,
    var(--shimmer-highlight) 100px,
    var(--shimmer-color) 200px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--shimmer-color);
}

/* Card Skeleton */
.skeleton-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.skeleton-image {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0px,
    var(--shimmer-highlight) 100px,
    var(--shimmer-color) 200px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Sidebar Skeleton */
.skeleton-sidebar {
  width: 300px;
}

.skeleton-box {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0px,
    var(--shimmer-highlight) 100px,
    var(--shimmer-color) 200px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

/* Native Feed Skeleton */
.skeleton-native {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.skeleton-item__image {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0px,
    var(--shimmer-highlight) 100px,
    var(--shimmer-color) 200px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Common Line Styles */
.skeleton-line {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--shimmer-color) 0px,
    var(--shimmer-highlight) 100px,
    var(--shimmer-color) 200px
  );
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-line--title {
  height: 20px;
  width: 80%;
}

.skeleton-line--text {
  height: 14px;
  width: 100%;
}

.skeleton-line--short {
  width: 60%;
}
</style>
