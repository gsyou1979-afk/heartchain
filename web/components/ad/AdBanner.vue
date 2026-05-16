<template>
  <div class="ad-banner" :class="[`ad-banner--${placement}`, { 'ad-banner--loading': loading }]">
    <!-- Loading skeleton -->
    <div v-if="loading" class="ad-banner__skeleton">
      <div class="skeleton-slide" v-for="i in 3" :key="i"></div>
    </div>

    <!-- Banner carousel -->
    <div v-else-if="ads.length > 0" class="ad-banner__carousel" ref="carouselRef">
      <transition name="slide-fade" mode="out-in">
        <div 
          :key="currentIndex" 
          class="ad-banner__slide"
          :style="{ backgroundImage: `url(${currentAd.imageUrl})` }"
          @click="handleAdClick"
        >
          <div class="ad-banner__content">
            <span class="ad-badge" :class="`ad-badge--${currentAd.adType}`">
              {{ getBadgeText(currentAd.adType) }}
            </span>
            <h3 class="ad-banner__title">{{ currentAd.title }}</h3>
            <p v-if="currentAd.description" class="ad-banner__desc">{{ currentAd.description }}</p>
          </div>
        </div>
      </transition>

      <!-- Navigation dots -->
      <div class="ad-banner__dots" v-if="ads.length > 1">
        <button 
          v-for="(ad, index) in ads" 
          :key="ad.id"
          class="ad-banner__dot"
          :class="{ 'ad-banner__dot--active': index === currentIndex }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>

    <!-- Fallback -->
    <div v-else class="ad-banner__fallback">
      <div class="fallback-content">
        <h3>HeartChain 志愿服务平台</h3>
        <p>Join us to make a difference!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Ad {
  id: string
  adType: string
  projectAdId?: string
  creativeId?: string
  title: string
  description?: string
  imageUrl: string
  videoUrl?: string
  landingUrl: string
  badge: string
  source: string
}

const props = defineProps<{
  placement: string
  width?: number
  height?: number
}>()

const loading = ref(true)
const ads = ref<Ad[]>([])
const currentIndex = ref(0)
const carouselRef = ref<HTMLElement | null>(null)
let autoplayTimer: NodeJS.Timeout | null = null

const currentAd = computed(() => ads.value[currentIndex.value] || null)

const getBadgeText = (type: string) => {
  const badges: Record<string, string> = {
    project: '求助',
    commercial: '广告',
    public_service: '公益',
  }
  return badges[type] || '广告'
}

const fetchAds = async () => {
  try {
    const apiBase = '/api/v1/ad'
    const response = await fetch(`${apiBase}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placementCode: props.placement,
        deviceId: getDeviceId(),
        platform: 'web',
        geoInfo: await getGeoInfo(),
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      ads.value = data.ads || []
    }
  } catch (error) {
    console.error('Failed to fetch ads:', error)
    ads.value = []
  } finally {
    loading.value = false
  }
}

const handleAdClick = async () => {
  if (!currentAd.value) return

  // Report click
  try {
    await fetch('/api/v1/ad/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: currentAd.value.adType,
        projectAdId: currentAd.value.projectAdId,
        creativeId: currentAd.value.creativeId,
        placementCode: props.placement,
        impressionId: currentAd.value.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to report click:', error)
  }

  // Navigate to landing URL
  if (currentAd.value.landingUrl) {
    window.location.href = currentAd.value.landingUrl
  }
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  resetAutoplay()
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % ads.value.length
}

const resetAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
  if (ads.value.length > 1) {
    autoplayTimer = setInterval(nextSlide, 5000)
  }
}

const getDeviceId = () => {
  let deviceId = localStorage.getItem('ad_device_id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2)
    localStorage.setItem('ad_device_id', deviceId)
  }
  return deviceId
}

const getGeoInfo = async () => {
  // Simplified geo info
  return {
    country: 'CN',
    city: 'Beijing',
  }
}

// Report impression when ad is viewed
const reportImpression = async () => {
  if (!currentAd.value) return

  try {
    await fetch('/api/v1/ad/impression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: currentAd.value.adType,
        projectAdId: currentAd.value.projectAdId,
        creativeId: currentAd.value.creativeId,
        placementCode: props.placement,
        impressionId: currentAd.value.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to report impression:', error)
  }
}

onMounted(() => {
  fetchAds().then(() => {
    resetAutoplay()
    reportImpression()
  })
})

onUnmounted(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
})
</script>

<style scoped>
.ad-banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #f5f5f5;
}

.ad-banner--A1 {
  height: 400px;
}

.ad-banner--C1 {
  height: 300px;
}

.ad-banner--D1 {
  height: 150px;
}

.ad-banner__carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.ad-banner__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
}

.ad-banner__slide::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%);
}

.ad-banner__content {
  position: relative;
  z-index: 1;
  padding: 24px;
  color: white;
  width: 100%;
}

.ad-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.ad-badge--project {
  background: #e74c3c;
  color: white;
}

.ad-badge--commercial {
  background: #3498db;
  color: white;
}

.ad-badge--public_service {
  background: #27ae60;
  color: white;
}

.ad-banner__title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
}

.ad-banner__desc {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-banner__dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.ad-banner__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.ad-banner__dot--active {
  background: white;
  transform: scale(1.2);
}

.ad-banner__fallback {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.fallback-content h3 {
  font-size: 24px;
  margin: 0 0 8px;
}

.fallback-content p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* Loading skeleton */
.ad-banner__skeleton {
  width: 100%;
  height: 100%;
  display: flex;
}

.skeleton-slide {
  flex: 1;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
