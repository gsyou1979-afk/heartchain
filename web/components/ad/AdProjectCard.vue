<template>
  <div class="ad-project-card" @click="handleClick">
    <!-- Urgent Badge -->
    <div v-if="projectAd.urgency === 'urgent'" class="ad-project-card__urgent">
      <span class="urgent-icon">!</span>
      紧急求助
    </div>

    <!-- Image -->
    <div class="ad-project-card__image">
      <img :src="projectAd.imageUrl || '/assets/default-project-ad.png'" :alt="projectAd.title" />
      <div class="ad-project-card__overlay">
        <span class="ad-badge">求助</span>
      </div>
    </div>

    <!-- Content -->
    <div class="ad-project-card__content">
      <h3 class="ad-project-card__title">{{ projectAd.title }}</h3>
      
      <p v-if="projectAd.description" class="ad-project-card__desc">
        {{ projectAd.description }}
      </p>

      <!-- Location & Tags -->
      <div class="ad-project-card__meta">
        <span v-if="projectAd.geoTarget?.city" class="meta-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {{ projectAd.geoTarget.city }}
        </span>
        
        <span v-if="projectAd.interestTarget?.length" class="meta-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          {{ projectAd.interestTarget[0] }}
        </span>
      </div>

      <!-- Progress Bar -->
      <div class="ad-project-card__progress">
        <div class="progress-info">
          <span>展示进度</span>
          <span>{{ quotaPercent }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${quotaPercent}%` }"></div>
        </div>
      </div>

      <!-- CTA -->
      <div class="ad-project-card__cta">
        <button class="cta-button">
          立即响应
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ProjectAd {
  id: string
  title: string
  description?: string
  imageUrl?: string
  landingUrl: string
  geoTarget?: {
    city?: string
    school?: string
  }
  interestTarget?: string[]
  urgency: string
  quotaTotal: number
  quotaUsed: number
}

const props = defineProps<{
  projectAd: ProjectAd
}>()

const emit = defineEmits(['click'])

const quotaPercent = computed(() => {
  if (!props.projectAd.quotaTotal) return 0
  return Math.round((props.projectAd.quotaUsed / props.projectAd.quotaTotal) * 100)
})

const handleClick = async () => {
  // Report click
  try {
    await fetch('/api/v1/ad/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: 'project',
        projectAdId: props.projectAd.id,
        placementCode: 'C1',
        impressionId: props.projectAd.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    console.error('Failed to report click:', error)
  }

  emit('click', props.projectAd)

  if (props.projectAd.landingUrl) {
    window.location.href = props.projectAd.landingUrl
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
</script>

<style scoped>
.ad-project-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.ad-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(231, 76, 60, 0.2);
}

/* Urgent Badge */
.ad-project-card__urgent {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #e74c3c;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.urgent-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: white;
  color: #e74c3c;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Image */
.ad-project-card__image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.ad-project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.ad-project-card:hover .ad-project-card__image img {
  transform: scale(1.05);
}

.ad-project-card__overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.ad-badge {
  padding: 4px 10px;
  background: #e74c3c;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

/* Content */
.ad-project-card__content {
  padding: 16px;
}

.ad-project-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ad-project-card__desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Meta */
.ad-project-card__meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.icon {
  width: 14px;
  height: 14px;
}

/* Progress */
.ad-project-card__progress {
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  margin-bottom: 4px;
}

.progress-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #e74c3c, #ff6b6b);
  border-radius: 2px;
  transition: width 0.3s;
}

/* CTA */
.ad-project-card__cta {
  text-align: center;
}

.cta-button {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.cta-button:hover {
  opacity: 0.9;
}
</style>
