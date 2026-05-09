import 'api_client.dart';
import '../models/models.dart';
import 'auth_service.dart';

/// 사용자 프로필 서비스
class UserService {
  final ApiClient _client;
  UserService(this._client);

  /// 내 프로필 조회
  Future<ApiResult<UserModel>> getMyProfile() async {
    final result = await _client.get('/users/me');
    if (result.isSuccess && result.data != null) {
      return ApiResult<UserModel>.success(
        UserModel.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<UserModel>.failure(result.error, result.statusCode);
  }

  /// 프로필 수정
  Future<ApiResult<UserModel>> updateProfile({
    String? nickname,
    String? avatar,
    String? bio,
    String? region,
  }) async {
    final body = <String, dynamic>{};
    if (nickname != null) body['nickname'] = nickname;
    if (avatar != null) body['avatar'] = avatar;
    if (bio != null) body['bio'] = bio;
    if (region != null) body['region'] = region;

    final result = await _client.put('/users/me', body: body);
    if (result.isSuccess && result.data != null) {
      return ApiResult<UserModel>.success(
        UserModel.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<UserModel>.failure(result.error, result.statusCode);
  }

  /// 전체 회원 수
  Future<ApiResult<int>> getTotalUsers() async {
    final result = await _client.get('/users');
    if (result.isSuccess && result.data != null) {
      final count = result.data!['count'] ?? result.data!['total'] ?? 0;
      return ApiResult<int>.success(count as int, result.statusCode);
    }
    return ApiResult<int>.failure(result.error, result.statusCode);
  }
}
