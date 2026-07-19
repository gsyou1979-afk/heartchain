import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/providers/providers.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final tasksAsync = ref.watch(myTasksProvider);
    final walletAsync = ref.watch(walletProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('哈特链 HeartChain'),
        backgroundColor: const Color(0xFFEF4444),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(myTasksProvider);
          ref.invalidate(walletProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFEF4444), Color(0xFFEC4899)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFEF4444).withOpacity(0.3),
                      blurRadius: 15,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      authState.isLoggedIn
                          ? '안녕하세요! ${authState.user?.nickname ?? '用户'}님'
                          : 'Welcome!',
                      style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      '오늘도 따뜻한志愿服务를 해주세요',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const SizedBox(height: 16),
                    // HRT Balance
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.favorite, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          walletAsync.when(
                            data: (w) => Text(
                              '${w.balance} HRT',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            loading: () => const Text('... HRT', style: TextStyle(color: Colors.white)),
                            error: (_, __) => const Text('0 HRT', style: TextStyle(color: Colors.white)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Row(
                children: [
                  Expanded(child: _QuickActionCard(
                    icon: Icons.add_task,
                    label: ' 发布任务',
                    color: Colors.blue,
                    onTap: () {},
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickActionCard(
                    icon: Icons.search,
                    label: ' 搜索任务',
                    color: Colors.green,
                    onTap: () {},
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: _QuickActionCard(
                    icon: Icons.qr_code,
                    label: ' 加入团队',
                    color: Colors.orange,
                    onTap: () {},
                  )),
                ],
              ),

              const SizedBox(height: 24),

              // Stats
              Row(
                children: [
                  Expanded(child: _StatCard(label: '我的任务', value: '3', icon: Icons.task, color: Colors.teal)),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(label: '我的团队', value: '1', icon: Icons.group, color: Colors.purple)),
                  const SizedBox(width: 12),
                  Expanded(child: _StatCard(label: '志愿时长', value: '12h', icon: Icons.access_time, color: Colors.amber)),
                ],
              ),

              const SizedBox(height: 24),

              // Recent Tasks
              const Text('최근任务', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),

              tasksAsync.when(
                data: (tasks) {
                  if (tasks.isEmpty) {
                    return Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(
                        child: Column(
                          children: [
                            Icon(Icons.task_alt, size: 48, color: Colors.grey),
                            SizedBox(height: 8),
                            Text('참여 중인任务이 없습니다', style: TextStyle(color: Colors.grey)),
                          ],
                        ),
                      ),
                    );
                  }
                  return Column(
                    children: tasks.take(3).map((task) => Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: const Color(0xFFEF4444).withOpacity(0.1),
                          child: const Icon(Icons.task, color: Color(0xFFEF4444), size: 20),
                        ),
                        title: Text(task.title, maxLines: 1, overflow: TextOverflow.ellipsis),
                        subtitle: Text('${task.rewardPoints} HRT', style: const TextStyle(color: Color(0xFFEF4444))),
                        trailing: _statusChip(task.status.name),
                      ),
                    )).toList(),
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => Center(child: Text('Error: $e', style: const TextStyle(color: Colors.red))),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusChip(String status) {
    Color color;
    String label;
    switch (status) {
      case 'assigned':
        color = Colors.blue; label = '进行中';
      case 'submitted':
        color = Colors.orange; label = '审核中';
      case 'approved':
        color = Colors.green; label = '已完成';
      default:
        color = Colors.grey; label = '대기';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickActionCard({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  const _StatCard({required this.label, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: color)),
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
        ],
      ),
    );
  }
}
