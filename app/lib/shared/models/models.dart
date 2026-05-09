/// HeartChain API Response Models
/// Backend: NestJS + TypeORM + PostgreSQL

class UserModel {
  final String id;
  final String phone;
  final String? nickname;
  final String? avatar;
  final String? region;
  final String? bio;
  final int totalPoints;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.phone,
    this.nickname,
    this.avatar,
    this.region,
    this.bio,
    this.totalPoints = 0,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      phone: json['phone'] ?? '',
      nickname: json['nickname'],
      avatar: json['avatar'],
      region: json['region'],
      bio: json['bio'],
      totalPoints: json['totalPoints'] ?? json['total_points'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'phone': phone,
        'nickname': nickname,
        'avatar': avatar,
        'region': region,
        'bio': bio,
        'totalPoints': totalPoints,
        'createdAt': createdAt.toIso8601String(),
      };
}

// ─── Auth ───────────────────────────────────────────────────

class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final UserModel user;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] ?? json['access_token'] ?? '',
      refreshToken: json['refreshToken'] ?? json['refresh_token'] ?? '',
      user: UserModel.fromJson(json['user'] ?? {}),
    );
  }
}

// ─── Task ───────────────────────────────────────────────────

enum TaskStatus { pending, assigned, submitted, approved, cancelled }
enum TaskDifficulty { easy, medium, hard }

class TaskModel {
  final String id;
  final String title;
  final String description;
  final int rewardPoints;
  final TaskStatus status;
  final TaskDifficulty difficulty;
  final String? category;
  final String? location;
  final DateTime? deadline;
  final String publisherId;
  final String? publisherName;
  final String? assigneeId;
  final String? proofUrl;
  final int participantCount;
  final DateTime createdAt;

  TaskModel({
    required this.id,
    required this.title,
    required this.description,
    required this.rewardPoints,
    required this.status,
    required this.difficulty,
    this.category,
    this.location,
    this.deadline,
    required this.publisherId,
    this.publisherName,
    this.assigneeId,
    this.proofUrl,
    this.participantCount = 0,
    required this.createdAt,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      rewardPoints: json['rewardPoints'] ?? json['reward_points'] ?? 0,
      status: _parseTaskStatus(json['status']),
      difficulty: _parseDifficulty(json['difficulty']),
      category: json['category'],
      location: json['location'],
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline']) : null,
      publisherId: json['publisherId'] ?? json['publisher_id'] ?? '',
      publisherName: json['publisherName'] ?? json['publisher_name'],
      assigneeId: json['assigneeId'] ?? json['assignee_id'],
      proofUrl: json['proofUrl'] ?? json['proof_url'],
      participantCount: json['participantCount'] ?? json['participant_count'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  static TaskStatus _parseTaskStatus(String? s) {
    switch (s) {
      case 'assigned': return TaskStatus.assigned;
      case 'submitted': return TaskStatus.submitted;
      case 'approved': return TaskStatus.approved;
      case 'cancelled': return TaskStatus.cancelled;
      default: return TaskStatus.pending;
    }
  }

  static TaskDifficulty _parseDifficulty(String? s) {
    switch (s) {
      case 'medium': return TaskDifficulty.medium;
      case 'hard': return TaskDifficulty.hard;
      default: return TaskDifficulty.easy;
    }
  }
}

// ─── Team ───────────────────────────────────────────────────

class TeamModel {
  final String id;
  final String name;
  final String? description;
  final String? avatar;
  final String inviteCode;
  final int memberCount;
  final int totalPoints;
  final DateTime createdAt;

  TeamModel({
    required this.id,
    required this.name,
    this.description,
    this.avatar,
    required this.inviteCode,
    this.memberCount = 0,
    this.totalPoints = 0,
    required this.createdAt,
  });

  factory TeamModel.fromJson(Map<String, dynamic> json) {
    return TeamModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      avatar: json['avatar'],
      inviteCode: json['inviteCode'] ?? json['invite_code'] ?? '',
      memberCount: json['memberCount'] ?? json['member_count'] ?? 0,
      totalPoints: json['totalPoints'] ?? json['total_points'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}

// ─── Wallet / Points ───────────────────────────────────────

class WalletModel {
  final int balance;
  final int totalEarned;
  final int totalSpent;
  final List<TransactionModel> transactions;

  WalletModel({
    required this.balance,
    this.totalEarned = 0,
    this.totalSpent = 0,
    this.transactions = const [],
  });

  factory WalletModel.fromJson(Map<String, dynamic> json) {
    return WalletModel(
      balance: json['balance'] ?? 0,
      totalEarned: json['totalEarned'] ?? json['total_earned'] ?? 0,
      totalSpent: json['totalSpent'] ?? json['total_spent'] ?? 0,
      transactions: (json['transactions'] as List?)
              ?.map((e) => TransactionModel.fromJson(e))
              .toList() ??
          [],
    );
  }
}

class TransactionModel {
  final String id;
  final String type;
  final int amount;
  final String? description;
  final DateTime createdAt;

  TransactionModel({
    required this.id,
    required this.type,
    required this.amount,
    this.description,
    required this.createdAt,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] ?? '',
      type: json['type'] ?? 'earn',
      amount: json['amount'] ?? 0,
      description: json['description'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }
}
