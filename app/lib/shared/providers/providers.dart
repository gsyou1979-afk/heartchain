import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_client.dart';
import '../services/auth_service.dart';
import '../services/user_service.dart';
import '../services/task_service.dart';
import '../services/wallet_service.dart';
import '../models/models.dart';

// ─── Core ──────────────────────────────────────────────────
final apiClientProvider = Provider<ApiClient>((ref) => apiClient);

// ─── Services ───────────────────────────────────────────────
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.watch(apiClientProvider));
});
final userServiceProvider = Provider<UserService>((ref) {
  return UserService(ref.watch(apiClientProvider));
});
final taskServiceProvider = Provider<TaskService>((ref) {
  return TaskService(ref.watch(apiClientProvider));
});
final walletServiceProvider = Provider<WalletService>((ref) {
  return WalletService(ref.watch(apiClientProvider));
});

// ─── Auth State ─────────────────────────────────────────────
class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;
  final bool isLoggedIn;

  AuthState({this.user, this.isLoading = false, this.error, this.isLoggedIn = false});

  AuthState copyWith({UserModel? user, bool? isLoading, String? error, bool? isLoggedIn}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(AuthState());

  /// 저장된 토큰으로 자동 로그인
  Future<void> tryAutoLogin() async {
    state = state.copyWith(isLoading: true);
    await _authService.loadStoredToken();
    final hasToken = await _authService.hasStoredToken();
    if (hasToken) {
      state = state.copyWith(isLoading: false, isLoggedIn: true);
    } else {
      state = state.copyWith(isLoading: false, isLoggedIn: false);
    }
  }

  /// SMS 로그인
  Future<bool> loginWithSms(String phone, String code) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _authService.loginWithSms(phone, code);
    if (result.isSuccess && result.data != null) {
      await _authService.saveTokens(
        result.data!.accessToken,
        result.data!.refreshToken,
        result.data!.user.id,
      );
      apiClient.setToken(result.data!.accessToken);
      state = state.copyWith(
        user: result.data!.user,
        isLoading: false,
        isLoggedIn: true,
      );
      return true;
    } else {
      state = state.copyWith(isLoading: false, error: result.error);
      return false;
    }
  }

  /// 비밀번호 로그인
  Future<bool> loginWithPassword(String phone, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _authService.loginWithPassword(phone, password);
    if (result.isSuccess && result.data != null) {
      await _authService.saveTokens(
        result.data!.accessToken,
        result.data!.refreshToken,
        result.data!.user.id,
      );
      apiClient.setToken(result.data!.accessToken);
      state = state.copyWith(
        user: result.data!.user,
        isLoading: false,
        isLoggedIn: true,
      );
      return true;
    } else {
      state = state.copyWith(isLoading: false, error: result.error);
      return false;
    }
  }

  /// 로그아웃
  Future<void> logout() async {
    await _authService.logout();
    state = AuthState(isLoggedIn: false);
  }

  /// 유저 정보 갱신
  void setUser(UserModel user) {
    state = state.copyWith(user: user);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.watch(authServiceProvider));
});

// ─── Tasks State ────────────────────────────────────────────
final tasksProvider = FutureProvider.family<List<TaskModel>, Map<String, String?>>((ref, params) async {
  final service = ref.watch(taskServiceProvider);
  final result = await service.getTasks(
    status: params['status'],
    category: params['category'],
  );
  if (result.isSuccess && result.data != null) return result.data!;
  return [];
});

final myTasksProvider = FutureProvider<List<TaskModel>>((ref) async {
  final service = ref.watch(taskServiceProvider);
  final result = await service.getMyJoinedTasks();
  if (result.isSuccess && result.data != null) return result.data!;
  return [];
});

// ─── Wallet State ───────────────────────────────────────────
final walletProvider = FutureProvider<WalletModel>((ref) async {
  final service = ref.watch(walletServiceProvider);
  final result = await service.getBalance();
  if (result.isSuccess && result.data != null) return result.data!;
  return WalletModel(balance: 0);
});

// ─── Profile State ──────────────────────────────────────────
final profileProvider = FutureProvider<UserModel>((ref) async {
  final service = ref.watch(userServiceProvider);
  final result = await service.getMyProfile();
  if (result.isSuccess && result.data != null) {
    ref.read(authProvider.notifier).setUser(result.data!);
    return result.data!;
  }
  throw Exception(result.error ?? 'Failed to load profile');
});
