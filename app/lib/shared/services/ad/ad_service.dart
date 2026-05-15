// Ad Service for HeartChain Flutter App
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'ad_models.dart';

class AdService {
  // API base URL - change this to your actual backend URL
  static const String _baseUrl = 'http://localhost:3000/api/v1/ad';
  
  // Device ID storage
  static String? _deviceId;

  /// Initialize device ID
  static void initDeviceId(String deviceId) {
    _deviceId = deviceId;
  }

  /// Get or generate device ID
  static String getDeviceId() {
    if (_deviceId == null) {
      _deviceId = 'mobile_${DateTime.now().millisecondsSinceEpoch}';
    }
    return _deviceId!;
  }

  /// Request ads for a placement
  static Future<List<Ad>> requestAds({
    required String placementCode,
    String? userId,
    AdGeoInfo? geoInfo,
    List<String>? userInterests,
  }) async {
    try {
      final request = AdRequest(
        placementCode: placementCode,
        userId: userId,
        deviceId: getDeviceId(),
        platform: 'android',
        geoInfo: geoInfo,
        userInterests: userInterests,
      );

      final response = await http.post(
        Uri.parse('$_baseUrl/request'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final ads = (data['ads'] as List?)
            ?.map((ad) => Ad.fromJson(ad))
            .toList() ?? [];
        return ads;
      }

      return [];
    } catch (e) {
      debugPrint('Failed to fetch ads: $e');
      return [];
    }
  }

  /// Report ad impression
  static Future<void> reportImpression({
    required String adType,
    String? creativeId,
    String? projectAdId,
    required String placementCode,
    required String impressionId,
    String? userId,
    int? viewDuration,
    int? viewPercentage,
  }) async {
    try {
      await http.post(
        Uri.parse('$_baseUrl/impression'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'adType': adType,
          'creativeId': creativeId,
          'projectAdId': projectAdId,
          'placementCode': placementCode,
          'impressionId': impressionId,
          'userId': userId,
          'deviceId': getDeviceId(),
          'viewDuration': viewDuration,
          'viewPercentage': viewPercentage,
          'timestamp': DateTime.now().millisecondsSinceEpoch,
        }),
      );
    } catch (e) {
      debugPrint('Failed to report impression: $e');
    }
  }

  /// Report ad click
  static Future<void> reportClick({
    required String adType,
    String? creativeId,
    String? projectAdId,
    required String placementCode,
    required String impressionId,
    String? userId,
  }) async {
    try {
      await http.post(
        Uri.parse('$_baseUrl/click'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'adType': adType,
          'creativeId': creativeId,
          'projectAdId': projectAdId,
          'placementCode': placementCode,
          'impressionId': impressionId,
          'userId': userId,
          'deviceId': getDeviceId(),
          'timestamp': DateTime.now().millisecondsSinceEpoch,
        }),
      );
    } catch (e) {
      debugPrint('Failed to report click: $e');
    }
  }

  /// Report project ad conversion
  static Future<void> reportConversion({
    required String projectAdId,
    String? clickId,
    String? impressionId,
    required String userId,
    required String conversionType,
  }) async {
    try {
      await http.post(
        Uri.parse('$_baseUrl/conversion'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'projectAdId': projectAdId,
          'clickId': clickId,
          'impressionId': impressionId,
          'userId': userId,
          'conversionType': conversionType,
          'timestamp': DateTime.now().millisecondsSinceEpoch,
        }),
      );
    } catch (e) {
      debugPrint('Failed to report conversion: $e');
    }
  }

  /// Get ad badge text
  static String getBadgeText(AdType type) {
    switch (type) {
      case AdType.project:
        return '求助';
      case AdType.publicService:
        return '公益';
      case AdType.commercial:
        return '广告';
    }
  }
}
