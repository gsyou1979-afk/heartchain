import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/providers/providers.dart';
import '../../shared/models/models.dart';

// Teams列表 Provider
final teamsProvider = FutureProvider<List<TeamModel>>((ref) async {
  final result = await ref.watch(apiClientProvider).get('/teams');
  if (result.isSuccess && result.data != null) {
    final list = result.data!['data'] ?? result.data!['teams'] ?? [];
    return (list as List).map((e) => TeamModel.fromJson(e)).toList();
  }
  return [];
});

class TeamsPage extends ConsumerStatefulWidget {
  const TeamsPage({super.key});

  @override
  ConsumerState<TeamsPage> createState() => _TeamsPageState();
}

class _TeamsPageState extends ConsumerState<TeamsPage> {
  final _inviteController = TextEditingController();

  @override
  void dispose() {
    _inviteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final teamsAsync = ref.watch(teamsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的团队'),
        backgroundColor: const Color(0xFFEF4444),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCreateTeam(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Invite Code Input
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444).withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.qr_code, color: Color(0xFFEF4444)),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _inviteController,
                    decoration: const InputDecoration(
                      hintText: '输入邀请码加入团队',
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () => _joinByCode(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEF4444),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('加入'),
                ),
              ],
            ),
          ),

          // Teams List
          Expanded(
            child: teamsAsync.when(
              data: (teams) {
                if (teams.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.group_add, size: 64, color: Colors.grey.shade300),
                        const SizedBox(height: 16),
                        Text('暂无团队', style: TextStyle(color: Colors.grey.shade500, fontSize: 16)),
                        const SizedBox(height: 8),
                        Text('输入邀请码或创建新团队', style: TextStyle(color: Colors.grey.shade400, fontSize: 13)),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () async => ref.invalidate(teamsProvider),
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: teams.length,
                    itemBuilder: (ctx, i) {
                      final team = teams[i];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: InkWell(
                          onTap: () => _showTeamDetail(context, team),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Row(
                              children: [
                                CircleAvatar(
                                  radius: 24,
                                  backgroundColor: const Color(0xFFEF4444).withOpacity(0.1),
                                  child: Text(
                                    team.name.substring(0, 1),
                                    style: const TextStyle(
                                      color: Color(0xFFEF4444),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 20,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(team.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                      if (team.description != null) ...[
                                        const SizedBox(height: 2),
                                        Text(team.description!, maxLines: 1, overflow: TextOverflow.ellipsis,
                                            style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                                      ],
                                      const SizedBox(height: 4),
                                      Row(
                                        children: [
                                          Icon(Icons.people, size: 14, color: Colors.grey.shade500),
                                          const SizedBox(width: 4),
                                          Text('${team.memberCount} 명', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                                          const SizedBox(width: 12),
                                          Icon(Icons.favorite, size: 14, color: Colors.grey.shade500),
                                          const SizedBox(width: 4),
                                          Text('${team.totalPoints} HRT', style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.chevron_right, color: Colors.grey),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.cloud_off, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text('加载失败: $e', style: const TextStyle(color: Colors.grey)),
                    TextButton(onPressed: () => ref.invalidate(teamsProvider), child: const Text('重试')),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _joinByCode(BuildContext context) async {
    final code = _inviteController.text.trim();
    if (code.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('请输入邀请码')),
      );
      return;
    }
    final api = ref.read(apiClientProvider);
    final result = await api.post('/teams/join/$code');
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result.isSuccess ? '加入成功!' : '加入失败: ${result.error}')),
      );
      if (result.isSuccess) {
        _inviteController.clear();
        ref.invalidate(teamsProvider);
      }
    }
  }

  void _showTeamDetail(BuildContext context, TeamModel team) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: const Color(0xFFEF4444).withOpacity(0.1),
                  child: Text(team.name.substring(0, 1),
                      style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 24)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(team.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      Text('成员 ${team.memberCount}명', style: TextStyle(color: Colors.grey.shade600)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (team.description != null) ...[
              Text(team.description!, style: TextStyle(color: Colors.grey.shade700)),
              const SizedBox(height: 16),
            ],
            Row(
              children: [
                const Icon(Icons.favorite, color: Color(0xFFEF4444), size: 18),
                const SizedBox(width: 6),
                Text('团队积分: ${team.totalPoints} HRT',
                    style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.qr_code, color: Colors.grey, size: 18),
                const SizedBox(width: 6),
                Text('邀请码: ${team.inviteCode}', style: TextStyle(color: Colors.grey.shade600)),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('团队详情开发中...')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF4444),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('查看成员'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCreateTeam(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('创建团队功能开发中...')),
    );
  }
}
