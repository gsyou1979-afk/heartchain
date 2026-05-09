import 'package:shared_preferences/shared_preferences.dart';
import '../../config/app_config.dart';
import 'api_client.dart';
import '../models/models.dart';

/// Generic API Result — 모든 서비스에서 사용
class ApiResult<T> {
  final T? data;
  final String? error;
  final int statusCode;

  ApiResult._({required this.data, required this.error, required this.statusCode});

  factory ApiResult.success(T data, int statusCode) {
    return ApiResult._(data: data, error: null, statusCode: statusCode);
  }

  factory ApiResult.failure(String? error, int statusCode) {
    return ApiResult._(data: null, error: error, statusCode: statusCode);
  }

  bool get isSuccess => statusCode >= 200 && statusCode < 300;
}

/// 인증 서비스 — 로그인/회원가입/JWT 토큰 관리
class AuthService {
  final ApiClient _client;

  AuthService(this._client);

  /// SMS 인증코드 발송
  Future<ApiResult<bool>> sendSms(String phone) async {
    final result = await _client.post('/auth/sms/send', body: {'phone': phone});
    if (result.isSuccess) return ApiResult<bool>.success(true, result.statusCode);
    return ApiResult<bool>.failure(result.error, result.statusCode);
  }

  /// SMS 코드 + 폰번호 로그인
  Future<ApiResult<AuthResponse>> loginWithSms(String phone, String code) async {
    final result = await _client.post('/auth/login', body: {
      'phone': phone,
      'code': code,
    });
    if (result.isSuccess && result.data != null) {
      return ApiResult<AuthResponse>.success(
        AuthResponse.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<AuthResponse>.failure(result.error, result.statusCode);
  }

  /// 비밀번호 로그인
  Future<ApiResult<AuthResponse>> loginWithPassword(String phone, String password) async {
    final result = await _client.post('/auth/password-login', body: {
      'phone': phone,
      'password': password,
    });
    if (result.isSuccess && result.data != null) {
      return ApiResult<AuthResponse>.success(
        AuthResponse.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<AuthResponse>.failure(result.error, result.statusCode);
  }

  /// 토큰 저장 (SharedPreferences)
  Future<void> saveTokens(String accessToken, String refreshToken, String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConfig.keyAccessToken, accessToken);
    await prefs.setString(AppConfig.keyRefreshToken, refreshToken);
    await prefs.setString(AppConfig.keyUserId, userId);
  }

  /// 저장된 토큰 로드
  Future<void> loadStoredToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(AppConfig.keyAccessToken);
    if (token != null) {
      _client.setToken(token);
    }
  }

  /// 로그아웃
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConfig.keyAccessToken);
    await prefs.remove(AppConfig.keyRefreshToken);
    await prefs.remove(AppConfig.keyUserId);
    _client.clearToken();
  }

  /// 토큰 존재 여부
  Future<bool> hasStoredToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(AppConfig.keyAccessToken) != null;
  }
}
