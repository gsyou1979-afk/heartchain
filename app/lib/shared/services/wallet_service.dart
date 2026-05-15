import 'api_client.dart';
import '../models/models.dart';
import 'auth_service.dart';

/// 지갑/포인트 서비스
class WalletService {
  final ApiClient _client;
  WalletService(this._client);

  /// 잔액 조회
  Future<ApiResult<WalletModel>> getBalance() async {
    final result = await _client.get('/points/balance');
    if (result.isSuccess && result.data != null) {
      return ApiResult<WalletModel>.success(
        WalletModel.fromJson(result.data as Map<String, dynamic>),
        result.statusCode,
      );
    }
    return ApiResult<WalletModel>.failure(result.error, result.statusCode);
  }

  /// 거래 내역
  Future<ApiResult<List<TransactionModel>>> getTransactions({int page = 1, int limit = 20}) async {
    final result = await _client.get('/points/transactions', query: {
      'page': page.toString(),
      'limit': limit.toString(),
    });
    if (result.isSuccess && result.data != null) {
      final list = result.data!['data'] ?? result.data!['transactions'] ?? [];
      return ApiResult<List<TransactionModel>>.success(
        (list as List).map((e) => TransactionModel.fromJson(e as Map<String, dynamic>)).toList(),
        result.statusCode,
      );
    }
    return ApiResult<List<TransactionModel>>.failure(result.error, result.statusCode);
  }

  /// HRT 전송
  Future<ApiResult<bool>> transfer(String toPhone, int amount) async {
    final result = await _client.post('/points/transfer', body: {
      'toPhone': toPhone,
      'amount': amount,
    });
    if (result.isSuccess) return ApiResult<bool>.success(true, result.statusCode);
    return ApiResult<bool>.failure(result.error, result.statusCode);
  }
}
