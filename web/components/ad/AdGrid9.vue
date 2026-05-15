<template>
  <div class="ad-grid-container">
    <!-- 左侧广告位 3个（上/中/下） -->
    <div class="ad-grid-left">
      <div
        v-for="pos in ['L1', 'L2', 'L3']"
        :key="pos"
        class="ad-slot"
        :class="{ 'ad-slot--empty': !getAd(pos) }"
      >
        <template v-if="getAd(pos)">
          <img
            :src="getAd(pos).imageUrl"
            :alt="getAd(pos).title"
            class="ad-slot__img"
            @click="handleClick(getAd(pos))"
          />
          <span class="ad-badge" :class="`ad-badge--${getAd(pos).adType}`">
            {{ getBadgeText(getAd(pos).adType) }}
          </span>
        </template>
        <div v-else class="ad-slot__placeholder">
          <svg class="ad-slot__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="ad-slot__text">广告位 {{ pos }}</span>
          <span class="ad-slot__subtext">欢迎发布广告</span>
        </div>
      </div>
    </div>

    <!-- 中间广告位 3个（上/中/下） -->
    <div class="ad-grid-center">
      <div
        v-for="pos in ['C1', 'C2', 'C3']"
        :key="pos"
        class="ad-slot"
        :class="{ 'ad-slot--empty': !getAd(pos) }"
      >
        <template v-if="getAd(pos)">
          <img
            :src="getAd(pos).imageUrl"
            :alt="getAd(pos).title"
            class="ad-slot__img"
            @click="handleClick(getAd(pos))"
          />
          <span class="ad-badge" :class="`ad-badge--${getAd(pos).adType}`">
            {{ getBadgeText(getAd(pos).adType) }}
          </span>
        </template>
        <div v-else class="ad-slot__placeholder">
          <svg class="ad-slot__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="ad-slot__text">广告位 {{ pos }}</span>
          <span class="ad-slot__subtext">欢迎发布广告</span>
        </div>
      </div>
    </div>

    <!-- 右侧广告位 3个（上/中/下） -->
    <div class="ad-grid-right">
      <div
        v-for="pos in ['R1', 'R2', 'R3']"
        :key="pos"
        class="ad-slot"
        :class="{ 'ad-slot--empty': !getAd(pos) }"
      >
        <template v-if="getAd(pos)">
          <img
            :src="getAd(pos).imageUrl"
            :alt="getAd(pos).title"
            class="ad-slot__img"
            @click="handleClick(getAd(pos))"
          />
          <span class="ad-badge" :class="`ad-badge--${getAd(pos).adType}`">
            {{ getBadgeText(getAd(pos).adType) }}
          </span>
        </template>
        <div v-else class="ad-slot__placeholder">
          <svg class="ad-slot__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="ad-slot__text">广告位 {{ pos }}</span>
          <span class="ad-slot__subtext">欢迎发布广告</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getApiUrl } from '~/utils/api';

interface Ad {
  id: string;
  adType: string;
  title: string;
  imageUrl: string;
  landingUrl: string;
  placementCode: string;
}

const props = defineProps<{
  /** 启用的广告位列表，如 ['L1','L2','C1','R3'] */
  enabledSlots?: string[];
}>();

const API_BASE = getApiUrl();
const ads = ref<Record<string, Ad>>({});

const ALL_SLOTS = ['L1', 'L2', 'L3', 'C1', 'C2', 'C3', 'R1', 'R2', 'R3'];

const getBadgeText = (type: string) => {
  const badges: Record<string, string> = {
    project: '求助',
    commercial: '广告',
    public_service: '公益',
  };
  return badges[type] || '广告';
};

const getAd = (placement: string): Ad | null => {
  return ads.value[placement] || null;
};

const handleClick = async (ad: Ad) => {
  try {
    await fetch(`${API_BASE}/ad/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: ad.adType,
        placementCode: ad.placementCode,
        impressionId: ad.id,
        deviceId: getDeviceId(),
        timestamp: Date.now(),
      }),
    });
  } catch (e) {
    console.error('Failed to report click:', e);
  }
  if (ad.landingUrl) {
    window.open(ad.landingUrl, '_blank');
  }
};

const getDeviceId = () => {
  let deviceId = localStorage.getItem('ad_device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2);
    localStorage.setItem('ad_device_id', deviceId);
  }
  return deviceId;
};

const fetchAds = async () => {
  const slots = props.enabledSlots?.length ? props.enabledSlots : ALL_SLOTS;
  
  for (const slot of slots) {
    try {
      const res = await fetch(`${API_BASE}/ad/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placementCode: slot,
          deviceId: getDeviceId(),
          platform: 'web',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ads?.[0]) {
          ads.value[slot] = { ...data.ads[0], placementCode: slot };
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ad for ${slot}:`, e);
    }
  }
};

onMounted(() => {
  fetchAds();
});
</script>

<style scoped>
.ad-grid-container {
  display: flex;
  gap: 16px;
  width: 100%;
}

.ad-grid-left,
.ad-grid-center,
.ad-grid-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.ad-slot {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  min-height: 180px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid transparent;
  transition: all 0.3s;
}

.ad-slot:hover {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
}

.ad-slot--empty {
  border: 2px dashed #dee2e6;
}

.ad-slot__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
  cursor: pointer;
  transition: transform 0.3s;
}

.ad-slot__img:hover {
  transform: scale(1.02);
}

.ad-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  z-index: 2;
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

.ad-slot__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  padding: 16px;
  text-align: center;
}

.ad-slot__icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.ad-slot__text {
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
}

.ad-slot__subtext {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 2px;
}

/* 响应式：小屏幕时堆叠显示 */
@media (max-width: 768px) {
  .ad-grid-container {
    flex-direction: column;
  }
  .ad-grid-left,
  .ad-grid-center,
  .ad-grid-right {
    flex-direction: row;
  }
  .ad-slot {
    min-height: 120px;
  }
}
</style>
