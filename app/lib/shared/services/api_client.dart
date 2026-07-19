import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../config/app_config.dart';

/// HTTP 응답 (내부용 - generic 버전은 auth_service.dart의 ApiResult 사용)
class _HttpResult {
  final dynamic data;
  final String? error;
  final int statusCode;

  _HttpResult._({required this.data, required this.error, required this.statusCode});

  factory _HttpResult.success(dynamic data, int statusCode) {
    return _HttpResult._(data: data, error: null, statusCode: statusCode);
  }

  factory _HttpResult.failure(String? error, int statusCode) {
    return _HttpResult._(data: null, error: error, statusCode: statusCode);
  }

  bool get isSuccess => statusCode >= 200 && statusCode < 300;
}

/// Dio-like HTTP Client for HeartChain API
class ApiClient {
  final String baseUrl;
  String? _accessToken;

  ApiClient({String? baseUrl}) : baseUrl = baseUrl ?? AppConfig.apiBaseUrl;

  /// AccessToken 설정 (로그인 후 저장)
  void setToken(String token) => _accessToken = token;

  /// 토큰 초기화 (로그아웃)
  void clearToken() => _accessToken = null;

  /// GET 요청
  Future<_HttpResult> get(
    String path, {
    Map<String, String>? query,
  }) async {
    final uri = Uri.parse('$baseUrl$path').replace(queryParameters: query);
    final resp = await http.get(
      uri,
      headers: _headers(),
    );
    return _handle(resp);
  }

  /// POST 요청 (JSON Body)
  Future<_HttpResult> post(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final resp = await http.post(
      uri,
      headers: _headers(),
      body: body != null ? jsonEncode(body) : null,
    );
    return _handle(resp);
  }

  /// PUT 요청
  Future<_HttpResult> put(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final resp = await http.put(
      uri,
      headers: _headers(),
      body: body != null ? jsonEncode(body) : null,
    );
    return _handle(resp);
  }

  /// PATCH 요청
  Future<_HttpResult> patch(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final resp = await http.patch(
      uri,
      headers: _headers(),
      body: body != null ? jsonEncode(body) : null,
    );
    return _handle(resp);
  }

  Map<String, String> _headers() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_accessToken != null) {
      headers['Authorization'] = 'Bearer $_accessToken';
    }
    return headers;
  }

  _HttpResult _handle(http.Response resp) {
    try {
      final body = resp.body.isNotEmpty
          ? jsonDecode(resp.body) as Map<String, dynamic>
          : <String, dynamic>{};
      if (resp.statusCode >= 200 && resp.statusCode < 300) {
        return _HttpResult.success(body, resp.statusCode);
      } else {
        return _HttpResult.failure(
          body['message'] ?? body['error'] ?? 'Request failed',
          resp.statusCode,
        );
      }
    } catch (e) {
      return _HttpResult.failure('Parse error: $e', resp.statusCode);
    }
  }
}

// ─── 전역 API 클라이언트 ─────────────────────────────────────
final apiClient = ApiClient();
