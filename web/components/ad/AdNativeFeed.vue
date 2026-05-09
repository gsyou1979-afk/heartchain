<template>
  <div class="ad-native-feed">
    <div 
      v-for="(item, index) in feedItems" 
      :key="item.id"
      class="ad-native-feed__item"
    >
      <!-- Native Ad Card -->
      <div 
        v-if="item.isAd" 
        class="native-ad-card"
        :class="`native-ad-card--${item.adType}`"
        @click="handleAdClick(item)"
      >
        <div class="native-ad-card__image">
          <img :src="item.imageUrl" :alt="item.title" />
          <span class="ad-badge" :class="`ad-badge--${item.adType}`">
            {{ getBadgeText(item.adType) }}
          </span>
        </div>
        <div class="native-ad-card__content">
          <h4 class="native-ad-card__title">{{ item.title }}</h4>
          <p v-if="item.description" class="native-ad-card__desc">{{ item.description }}</p>
          <div class="native-ad-card__meta">
            <span class="native-ad-card__source">
              {{ item.adType === 'project' ? '来自求助项目' : '广告' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Regular Content Card (slot) -->
      <slot v-else :name="`item-${index}`"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface FeedItem {
  id: string
  isAd: boolean
  adType?: string
  projectAdId?: string
  creativeId?: string
  title?: string
  description?: string
  imageUrl?: string
  landingUrl?: string
  badge?: string
}

const props = defineProps<{
  placement: string
  items: any[]
  adInterval?: number
}>()

const emit = defineEmits(['ad-click'])

const feedItems = ref<FeedItem[]>([])
const ads = ref<FeedItem[]>([])
const loading = ref(true)
const adInterval = props.adInterval || 3 // Insert ad every N items
let refreshTimer: NodeJS.Timeout | null = null

const getBadgeText = (type: string) => {
  const badges: Record<string, string> = {
    project: '求助',
    commercial: '广告',
    public_service: '公益',
  }
  return badges[type] || '广告'
}

const intersperseAds = () => {
  const result: FeedItem[] = []
  let adIndex = 0

  for (let i = 0; i < props.items.length; i++) {
    result.push({
      id: `content-${props.items[i].id || i}`,
      isAd: false,
    })

    // Insert ad every N items
    if ((i + 1) % adInterval === 0 && adIndex < ads.value.length) {
      result.push(ads.value[adIndex])
      adIndex++
    }
  }

  feedItems.value = result
}

const fetchAds = async () => {
  try {
    const response = await fetch('/api/v1/ad/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placementCode: props.placement,
        deviceId: getDeviceId(),
        platform: 'web',
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      ads.value = (data.ads || []).map((ad: any) => ({
        id: ad.projectAdId || ad.creativeId || Math.random().toString(36).substring(2),
        isAd: true,
        ...ad,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch native ads:', error)
  } finally {
    loading.value = false
  }
}

const handleAdClick = async (item: FeedItem) => {
  if (!item.isAd) return

  try {
    await fetch('/api/v1/ad/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: item.adType,
        projectAdId: item.projectAdId,
        creativeId: item.creativeId,
        placementCode: props.placement,
        impressionId: item.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to report click:', error)
  }

  emit('ad-click', item)

  if (item.landingUrl) {
    window.location.href = item.landingUrl
  }
}

const reportImpression = async (item: FeedItem) => {
  if (!item.isAd) return

  try {
    await fetch('/api/v1/ad/impression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: item.adType,
        projectAdId: item.projectAdId,
        creativeId: item.creativeId,
        placementCode: props.placement,
        impressionId: item.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to report impression:', error)
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

onMounted(async () => {
  await fetchAds()
  intersperseAds()

  // Refresh ads every 30 seconds
  refreshTimer = setInterval(async () => {
    await fetchAds()
    intersperseAds()
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// Watch for items changes
import { watch } from 'vue'
watch(() => props.items, () => {
  intersperseAds()
})
</script>

<style scoped>
.ad-native-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ad-native-feed__item {
  width: 100%;
}

/* Native Ad Card Styles */
.native-ad-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.native-ad-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.native-ad-card--project {
  border-left: 4px solid #e74c3c;
}

.native-ad-card--commercial {
  border-left: 4px solid #3498db;
}

.native-ad-card--public_service {
  border-left: 4px solid #27ae60;
}

.native-ad-card__image {
  position: relative;
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.native-ad-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ad-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: white;
}

.ad-badge--project {
  background: #e74c3c;
}

.ad-badge--commercial {
  background: #3498db;
}

.ad-badge--public_service {
  background: #27ae60;
}

.native-ad-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.native-ad-card__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.native-ad-card__desc {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.native-ad-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.native-ad-card__source {
  font-size: 11px;
  color: #999;
}
</style>
