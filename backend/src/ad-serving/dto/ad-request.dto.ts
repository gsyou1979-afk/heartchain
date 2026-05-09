export class AdRequestDto {
  placementCode: string;
  userId?: string;
  deviceId: string;
  platform: 'web' | 'ios' | 'android';
  pageUrl?: string;
  geoInfo?: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
  };
  userInterests?: string[];
}

export class AdImpressionDto {
  adType: string;
  creativeId?: string;
  projectAdId?: string;
  placementCode: string;
  impressionId?: string;
  userId?: string;
  deviceId: string;
  geoInfo?: {
    country?: string;
    province?: string;
    city?: string;
    school?: string;
    lat?: number;
    lng?: number;
  };
  viewDuration?: number;
  viewPercentage?: number;
  timestamp?: number;
}

export class AdClickDto {
  adType: string;
  creativeId?: string;
  projectAdId?: string;
  placementCode: string;
  impressionId: string;
  userId?: string;
  deviceId: string;
  timestamp?: number;
}

export class ConversionDto {
  projectAdId: string;
  clickId?: string;
  impressionId?: string;
  userId: string;
  conversionType: 'sign_up' | 'donate' | 'share';
  timestamp: number;
}
