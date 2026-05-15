/// API 및 앱 전체 설정
/// HeartChain Backend: http://localhost:3000/api/v1
class AppConfig {
  // ─── API 서버 ─────────────────────────────────────────────
  /// Flutter Web → Backend API (CORS 허용: localhost:3002)
  /// localtunnel 외부 접근: https://famous-rabbits-sell.loca.lt/api/v1
  /// 로컬 네트워크 테스트: http://192.168.0.3:3000/api/v1
  // 生产环境：Render 后端地址（更新于 2026-05-10）
  static const String apiBaseUrl = 'https://heartchain-backend.onrender.com/api/v1';

  /// JWT Access Token 저장 키 (SharedPreferences)
  static const String keyAccessToken = 'hc_access_token';
  static const String keyRefreshToken = 'hc_refresh_token';
  static const String keyUserId = 'hc_user_id';

  // ─── 앱 정보 ─────────────────────────────────────────────
  static const String appName = '哈特链 HeartChain';
  static const String appVersion = '1.0.0';

  // ─── 테스트 계정 ─────────────────────────────────────────
  /// 관리자: phone +821098765432 / password123
}
