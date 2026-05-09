import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/providers/providers.dart';

class TasksPage extends ConsumerStatefulWidget {
  const TasksPage({super.key});

  @override
  ConsumerState<TasksPage> createState() => _TasksPageState();
}

class _TasksPageState extends ConsumerState<TasksPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedCategory = 'all';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final allTasks = ref.watch(tasksProvider({'status': null, 'category': _selectedCategory == 'all' ? null : _selectedCategory}));
    final myTasks = ref.watch(myTasksProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('任务大厅'),
        backgroundColor: const Color(0xFFEF4444),
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: '全部任务'),
            Tab(text: '我的任务'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Category Filter
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _filterChip('全部', 'all'),
                  _filterChip('环保', 'environment'),
                  _filterChip('敬老', 'elderly'),
                  _filterChip('助学', 'education'),
                  _filterChip('社区', 'community'),
                ],
              ),
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // All Tasks
                _buildTaskList(allTasks, showJoin: true),
                // My Tasks
                _buildTaskList(myTasks, showJoin: false),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFEF4444),
        foregroundColor: Colors.white,
        onPressed: () => _showCreateTask(context),
        icon: const Icon(Icons.add),
        label: const Text('发布任务'),
      ),
    );
  }

  Widget _filterChip(String label, String value) {
    final selected = _selectedCategory == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => setState(() => _selectedCategory = value),
        selectedColor: const Color(0xFFEF4444).withOpacity(0.2),
        checkmarkColor: const Color(0xFFEF4444),
      ),
    );
  }

  Widget _buildTaskList(AsyncValue tasks, {required bool showJoin}) {
    return tasks.when(
      data: (taskList) {
        if (taskList.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.task_alt, size: 64, color: Colors.grey.shade300),
                const SizedBox(height: 16),
                Text('暂无任务', style: TextStyle(color: Colors.grey.shade500, fontSize: 16)),
              ],
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: () async {
            if (showJoin) {
              ref.invalidate(tasksProvider({'status': null, 'category': null}));
            } else {
              ref.invalidate(myTasksProvider);
            }
          },
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: taskList.length,
            itemBuilder: (ctx, i) {
              final task = taskList[i];
              return Card(
                margin: const EdgeInsets.only(bottom: 10),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                child: InkWell(
                  onTap: () => _showTaskDetail(context, task),
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(task.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEF4444).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '+${task.rewardPoints} HRT',
                                style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(task.description, maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Icon(Icons.category, size: 14, color: Colors.grey.shade500),
                            const SizedBox(width: 4),
                            Text(task.category ?? '일반', style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                            const Spacer(),
                            if (showJoin && task.status.name == 'pending')
                              TextButton(
                                onPressed: () => _joinTask(context, task.id),
                                child: const Text('参与', style: TextStyle(fontSize: 13)),
                              ),
                            if (!showJoin)
                              _statusChip(task.status.name),
                          ],
                        ),
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
            const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
            const SizedBox(height: 8),
            Text('加载失败', style: TextStyle(color: Colors.grey.shade600)),
            TextButton(onPressed: () => ref.invalidate(tasksProvider({'status': null, 'category': null})), child: const Text('重试')),
          ],
        ),
      ),
    );
  }

  Widget _statusChip(String status) {
    Color color;
    String label;
    switch (status) {
      case 'assigned': color = Colors.blue; label = '进行中';
      case 'submitted': color = Colors.orange; label = '审核中';
      case 'approved': color = Colors.green; label = '已完成';
      case 'cancelled': color = Colors.red; label = '已取消';
      default: color = Colors.grey; label = '대기';
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }

  Future<void> _joinTask(BuildContext context, String taskId) async {
    final taskService = ref.read(taskServiceProvider);
    final result = await taskService.joinTask(taskId);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result.isSuccess ? '任务参与成功!' : '参与失败: ${result.error}')),
      );
      if (result.isSuccess) {
        ref.invalidate(tasksProvider({'status': null, 'category': null}));
        ref.invalidate(myTasksProvider);
      }
    }
  }

  void _showTaskDetail(BuildContext context, dynamic task) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(task.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Text(task.description, style: TextStyle(color: Colors.grey.shade700)),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.favorite, color: Color(0xFFEF4444), size: 18),
                const SizedBox(width: 6),
                Text('${task.rewardPoints} HRT', style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: task.status.name == 'pending' ? () { Navigator.pop(ctx); _joinTask(context, task.id); } : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF4444),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('立即参与'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCreateTask(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('任务发布功能开发中...')),
    );
  }
}
