import 'api_client.dart';
import '../models/models.dart';
import 'auth_service.dart';

/// 태스크/미션 서비스
class TaskService {
  final ApiClient _client;
  TaskService(this._client);

  /// 전체 태스크 목록 (필터 가능)
  Future<ApiResult<List<TaskModel>>> getTasks({
    String? status,
    String? category,
    int page = 1,
    int limit = 20,
  }) async {
    final query = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
      if (status != null) 'status': status,
      if (category != null) 'category': category,
    };
    final result = await _client.get('/tasks', query: query);
    if (result.isSuccess && result.data != null) {
      final list = result.data!['data'] ?? result.data!['items'] ?? [];
      return ApiResult<List<TaskModel>>.success(
        (list as List).map((e) => TaskModel.fromJson(e as Map<String, dynamic>)).toList(),
        result.statusCode,
      );
    }
    return ApiResult<List<TaskModel>>.failure(result.error, result.statusCode);
  }

  /// 내 참가 중인 태스크
  Future<ApiResult<List<TaskModel>>> getMyJoinedTasks({int page = 1, int limit = 20}) async {
    final result = await _client.get('/tasks/my/joined', query: {
      'page': page.toString(),
      'limit': limit.toString(),
    });
    if (result.isSuccess && result.data != null) {
      final list = result.data!['data'] ?? result.data!['items'] ?? [];
      return ApiResult<List<TaskModel>>.success(
        (list as List).map((e) => TaskModel.fromJson(e as Map<String, dynamic>)).toList(),
        result.statusCode,
      );
    }
    return ApiResult<List<TaskModel>>.failure(result.error, result.statusCode);
  }

  /// 내가 게시한 태스크
  Future<ApiResult<List<TaskModel>>> getMyPublishedTasks({int page = 1, int limit = 20}) async {
    final result = await _client.get('/tasks/my/published', query: {
      'page': page.toString(),
      'limit': limit.toString(),
    });
    if (result.isSuccess && result.data != null) {
      final list = result.data!['data'] ?? result.data!['items'] ?? [];
      return ApiResult<List<TaskModel>>.success(
        (list as List).map((e) => TaskModel.fromJson(e as Map<String, dynamic>)).toList(),
        result.statusCode,
      );
    }
    return ApiResult<List<TaskModel>>.failure(result.error, result.statusCode);
  }

  /// 태스크 상세
  Future<ApiResult<TaskModel>> getTaskById(String id) async {
    final result = await _client.get('/tasks/$id');
    if (result.isSuccess && result.data != null) {
      return ApiResult<TaskModel>.success(
        TaskModel.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<TaskModel>.failure(result.error, result.statusCode);
  }

  /// 태스크 참가
  Future<ApiResult<bool>> joinTask(String taskId) async {
    final result = await _client.post('/tasks/$taskId/join');
    if (result.isSuccess) return ApiResult<bool>.success(true, result.statusCode);
    return ApiResult<bool>.failure(result.error, result.statusCode);
  }

  /// 완료 증빙 제출
  Future<ApiResult<bool>> submitProof(String taskId, String proofUrl) async {
    final result = await _client.post('/tasks/$taskId/proof', body: {
      'proofUrl': proofUrl,
    });
    if (result.isSuccess) return ApiResult<bool>.success(true, result.statusCode);
    return ApiResult<bool>.failure(result.error, result.statusCode);
  }
}
