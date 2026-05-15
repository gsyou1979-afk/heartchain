// Ad Models for HeartChain Flutter App

enum AdType {
  commercial,
  publicService,
  project,
}

enum AdPlacement {
  MA1, // Splash Ad
  MB1, // Native Feed
  MB2, // Banner
}

class Ad {
  final String id;
  final AdType adType;
  final String? creativeId;
  final String? projectAdId;
  final String title;
  final String? description;
  final String imageUrl;
  final String? videoUrl;
  final String landingUrl;
  final String badge;
  final String source;

  Ad({
    required this.id,
    required this.adType,
    this.creativeId,
    this.projectAdId,
    required this.title,
    this.description,
    required this.imageUrl,
    this.videoUrl,
    required this.landingUrl,
    required this.badge,
    required this.source,
  });

  factory Ad.fromJson(Map<String, dynamic> json) {
    return Ad(
      id: json['projectAdId'] ?? json['creativeId'] ?? '',
      adType: _parseAdType(json['adType']),
      creativeId: json['creativeId'],
      projectAdId: json['projectAdId'],
      title: json['title'] ?? '',
      description: json['description'],
      imageUrl: json['imageUrl'] ?? '',
      videoUrl: json['videoUrl'],
      landingUrl: json['landingUrl'] ?? '',
      badge: json['badge'] ?? '广告',
      source: json['source'] ?? 'direct',
    );
  }

  static AdType _parseAdType(String? type) {
    switch (type) {
      case 'project':
        return AdType.project;
      case 'public_service':
        return AdType.publicService;
      default:
        return AdType.commercial;
    }
  }

  String get badgeText {
    switch (adType) {
      case AdType.project:
        return '求助';
      case AdType.publicService:
        return '公益';
      case AdType.commercial:
        return '广告';
    }
  }
}

class AdRequest {
  final String placementCode;
  final String? userId;
  final String deviceId;
  final String platform;
  final String? pageUrl;
  final AdGeoInfo? geoInfo;
  final List<String>? userInterests;

  AdRequest({
    required this.placementCode,
    this.userId,
    required this.deviceId,
    this.platform = 'android',
    this.pageUrl,
    this.geoInfo,
    this.userInterests,
  });

  Map<String, dynamic> toJson() => {
    'placementCode': placementCode,
    'userId': userId,
    'deviceId': deviceId,
    'platform': platform,
    'pageUrl': pageUrl,
    'geoInfo': geoInfo?.toJson(),
    'userInterests': userInterests,
  };
}

class AdGeoInfo {
  final String? country;
  final String? province;
  final String? city;
  final String? school;
  final double? lat;
  final double? lng;

  AdGeoInfo({
    this.country,
    this.province,
    this.city,
    this.school,
    this.lat,
    this.lng,
  });

  Map<String, dynamic> toJson() => {
    'country': country,
    'province': province,
    'city': city,
    'school': school,
    'lat': lat,
    'lng': lng,
  };
}

class AdStats {
  final int impressions;
  final int clicks;
  final double ctr;
  final int? conversions;
  final double? conversionRate;

  AdStats({
    required this.impressions,
    required this.clicks,
    required this.ctr,
    this.conversions,
    this.conversionRate,
  });

  factory AdStats.fromJson(Map<String, dynamic> json) {
    return AdStats(
      impressions: json['impressions'] ?? 0,
      clicks: json['clicks'] ?? 0,
      ctr: (json['ctr'] ?? 0).toDouble(),
      conversions: json['conversions'],
      conversionRate: json['conversionRate']?.toDouble(),
    );
  }
}
