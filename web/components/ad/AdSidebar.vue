<template>
  <div class="ad-sidebar">
    <!-- Sidebar Banner A2 (300x250) -->
    <div v-if="placement === 'A2'" class="ad-sidebar__banner ad-sidebar__banner--medium">
      <div v-if="loading" class="ad-sidebar__skeleton skeleton-medium"></div>
      <div v-else-if="currentAd" class="ad-sidebar__item" @click="handleClick">
        <img :src="currentAd.imageUrl" :alt="currentAd.title" />
        <div class="ad-sidebar__overlay">
          <span class="ad-badge" :class="`ad-badge--${currentAd.adType}`">
            {{ getBadgeText(currentAd.adType) }}
          </span>
          <p class="ad-sidebar__title">{{ currentAd.title }}</p>
        </div>
      </div>
      <div v-else class="ad-sidebar__empty">
        <p>广告位</p>
      </div>
    </div>

    <!-- Sidebar Rectangle A3 (300x250) -->
    <div v-else-if="placement === 'A3'" class="ad-sidebar__banner ad-sidebar__banner--medium">
      <div v-if="loading" class="ad-sidebar__skeleton skeleton-medium"></div>
      <div v-else-if="currentAd" class="ad-sidebar__item" @click="handleClick">
        <img :src="currentAd.imageUrl" :alt="currentAd.title" />
        <span class="ad-badge ad-badge--small" :class="`ad-badge--${currentAd.adType}`">
          {{ getBadgeText(currentAd.adType) }}
        </span>
      </div>
      <div v-else class="ad-sidebar__empty">
        <p>广告位</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Ad {
  id: string
  adType: string
  projectAdId?: string
  creativeId?: string
  title: string
  imageUrl: string
  landingUrl: string
}

const props = withDefaults(defineProps<{
  placement?: 'A2' | 'A3'
}>(), {
  placement: 'A2'
})

const loading = ref(true)
const currentAd = ref<Ad | null>(null)

const getBadgeText = (type: string) => {
  const badges: Record<string, string> = {
    project: '求助',
    commercial: '广告',
    public_service: '公益',
  }
  return badges[type] || '广告'
}

const fetchAd = async () => {
  try {
    const apiBase = '/api/v1/ad'
    const response = await fetch(`${apiBase}/request`, {
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
      currentAd.value = data.ads?.[0] || null
    }

    // Fallback: if no ad from request, load from active campaigns
    if (!currentAd.value) {
      await fetchCommercialAd(apiBase)
    }
  } catch (error) {
    console.error('Failed to fetch sidebar ad:', error)
  } finally {
    loading.value = false
  }
}

// Fallback: load commercial ad directly from active campaigns
const fetchCommercialAd = async (apiBase: string) => {
  try {
    const campaignsRes = await fetch(`${apiBase}/campaigns/active`)
    if (!campaignsRes.ok) return
    const campaigns = await campaignsRes.json()

    const matchingCampaigns = campaigns.filter((c: any) =>
      c.placements && c.placements.includes(props.placement)
    )

    for (const campaign of matchingCampaigns) {
      const itemsRes = await fetch(`${apiBase}/items/campaign/${campaign.id}`)
      if (!itemsRes.ok) continue
      const items = await itemsRes.json()
      const validItem = items.find((item: any) =>
        item.imageUrl && item.imageUrl.trim() !== '' && !item.imageUrl.startsWith('data:')
      )
      if (validItem) {
        currentAd.value = {
          id: validItem.id,
          adType: 'commercial',
          creativeId: validItem.id,
          title: campaign.name,
          imageUrl: validItem.imageUrl,
          landingUrl: validItem.landingUrl || '/',
        }
        break
      }
    }
  } catch (e) {
    console.error('Failed to fetch commercial sidebar ad:', e)
  }
}

const handleClick = async () => {
  if (!currentAd.value) return

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

  if (currentAd.value.landingUrl) {
    window.location.href = currentAd.value.landingUrl
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

onMounted(() => {
  fetchAd()
})
</script>

<style scoped>
.ad-sidebar {
  position: sticky;
  top: 20px;
}

.ad-sidebar__banner {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.ad-sidebar__banner--large {
  width: 300px;
  height: 600px;
}

.ad-sidebar__banner--medium {
  width: 300px;
  height: 250px;
}

.ad-sidebar__item {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.ad-sidebar__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ad-sidebar__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
}

.ad-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.ad-badge--small {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 10px;
  padding: 2px 6px;
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

.ad-sidebar__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-sidebar__empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.ad-sidebar__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
