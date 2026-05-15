// Ad API composable for HeartChain

interface AdRequest {
  placementCode: string
  userId?: string
  deviceId: string
  platform: 'web' | 'ios' | 'android'
  pageUrl?: string
  geoInfo?: {
    country?: string
    province?: string
    city?: string
    school?: string
    lat?: number
    lng?: number
  }
  userInterests?: string[]
}

interface AdResponse {
  ads: Array<{
    id: string
    adType: 'commercial' | 'public_service' | 'project'
    creativeId?: string
    projectAdId?: string
    title: string
    description?: string
    imageUrl: string
    videoUrl?: string
    landingUrl: string
    badge: string
    tracking: {
      impression: string
      click: string
    }
    source: string
  }>
  fallback?: {
    type: string
    content: any
  }
}

interface ImpressionReport {
  adType: string
  creativeId?: string
  projectAdId?: string
  placementCode: string
  impressionId: string
  userId?: string
  deviceId: string
  viewDuration?: number
  viewPercentage?: number
  timestamp: number
}

interface ClickReport {
  adType: string
  creativeId?: string
  projectAdId?: string
  placementCode: string
  impressionId: string
  userId?: string
  deviceId: string
  timestamp: number
}

interface ConversionReport {
  projectAdId: string
  clickId?: string
  impressionId?: string
  userId: string
  conversionType: 'sign_up' | 'donate' | 'share'
  timestamp: number
}

export const useAd = () => {
  const apiBase = 'https://heartchain-backend.onrender.com/api/v1/ad'

  // Get device ID (persistent)
  const getDeviceId = () => {
    if (typeof window === 'undefined') return ''
    
    let deviceId = localStorage.getItem('ad_device_id')
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now()
      localStorage.setItem('ad_device_id', deviceId)
    }
    return deviceId
  }

  // Get user geo info
  const getGeoInfo = async () => {
    // Simplified - in production, use IP geolocation or GPS
    return {
      country: 'CN',
      city: 'Beijing',
    }
  }

  // Request ads for a placement
  const requestAds = async (placementCode: string, options?: Partial<AdRequest>): Promise<AdResponse> => {
    const response = await fetch(`${apiBase}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placementCode,
        deviceId: getDeviceId(),
        platform: 'web',
        ...options,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch ads')
    }

    return response.json()
  }

  // Report impression
  const reportImpression = async (data: ImpressionReport) => {
    try {
      await fetch(`${apiBase}/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to report impression:', error)
    }
  }

  // Report click
  const reportClick = async (data: ClickReport) => {
    try {
      await fetch(`${apiBase}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to report click:', error)
    }
  }

  // Report conversion (for project ads)
  const reportConversion = async (data: ConversionReport) => {
    try {
      await fetch(`${apiBase}/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Failed to report conversion:', error)
    }
  }

  // Get ad badge text
  const getBadgeText = (type: string) => {
    const badges: Record<string, string> = {
      project: '求助',
      commercial: '广告',
      public_service: '公益',
    }
    return badges[type] || '广告'
  }

  return {
    getDeviceId,
    getGeoInfo,
    requestAds,
    reportImpression,
    reportClick,
    reportConversion,
    getBadgeText,
  }
}

// Ad stats composable
export const useAdStats = () => {
  const apiBase = '/api/v1/ad/reports'

  const getOverallStats = async (adType?: string) => {
    const url = adType ? `${apiBase}/overall?adType=${adType}` : `${apiBase}/overall`
    const response = await fetch(url)
    return response.json()
  }

  const getStatsByType = async () => {
    const response = await fetch(`${apiBase}/by-type`)
    return response.json()
  }

  const getStatsByPlacement = async () => {
    const response = await fetch(`${apiBase}/by-placement`)
    return response.json()
  }

  const getDailyStats = async (days: number = 7, adType?: string) => {
    const url = adType 
      ? `${apiBase}/daily?days=${days}&adType=${adType}`
      : `${apiBase}/daily?days=${days}`
    const response = await fetch(url)
    return response.json()
  }

  const getProjectAdStats = async (projectAdId: string) => {
    const response = await fetch(`${apiBase}/project-ad/${projectAdId}`)
    return response.json()
  }

  return {
    getOverallStats,
    getStatsByType,
    getStatsByPlacement,
    getDailyStats,
    getProjectAdStats,
  }
}
