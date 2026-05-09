import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../shared/providers/providers.dart';

class WalletPage extends ConsumerStatefulWidget {
  const WalletPage({super.key});

  @override
  ConsumerState<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends ConsumerState<WalletPage> {
  @override
  Widget build(BuildContext context) {
    final walletAsync = ref.watch(walletProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('我的钱包'),
        backgroundColor: const Color(0xFFEF4444),
        foregroundColor: Colors.white,
        actions: [
          IconButton(icon: const Icon(Icons.history), onPressed: () => _showTransactions(context)),
        ],
      ),
      body: walletAsync.when(
        data: (wallet) => RefreshIndicator(
          onRefresh: () async => ref.invalidate(walletProvider),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Balance Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFFEF4444), Color(0xFFEC4899)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFFEF4444).withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('HRT Balance', style: TextStyle(color: Colors.white70, fontSize: 14)),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Icon(Icons.favorite, color: Colors.white, size: 36),
                          const SizedBox(width: 8),
                          Text(
                            '${wallet.balance}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Padding(
                            padding: EdgeInsets.only(bottom: 6),
                            child: Text('HRT', style: TextStyle(color: Colors.white70, fontSize: 18)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: _walletStatItem(
                              icon: Icons.arrow_downward,
                              label: '累计获得',
                              value: '${wallet.totalEarned}',
                              color: Colors.greenAccent,
                            ),
                          ),
                          Container(width: 1, height: 40, color: Colors.white24),
                          Expanded(
                            child: _walletStatItem(
                              icon: Icons.arrow_upward,
                              label: '累计支出',
                              value: '${wallet.totalSpent}',
                              color: Colors.orangeAccent,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Actions
                Row(
                  children: [
                    Expanded(child: _actionButton(Icons.send, '转账', () => _showTransfer(context))),
                    const SizedBox(width: 12),
                    Expanded(child: _actionButton(Icons.qr_code, '收款码', () {})),
                  ],
                ),

                const SizedBox(height: 24),

                // Recent Transactions
                Align(
                  alignment: Alignment.centerLeft,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('最近交易', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      TextButton(onPressed: () => _showTransactions(context), child: const Text('查看全部')),
                    ],
                  ),
                ),
                const SizedBox(height: 8),

                if (wallet.transactions.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Column(
                        children: [
                          Icon(Icons.receipt_long, size: 48, color: Colors.grey.shade300),
                          const SizedBox(height: 8),
                          Text('暂无交易记录', style: TextStyle(color: Colors.grey.shade500)),
                        ],
                      ),
                    ),
                  )
                else
                  ...wallet.transactions.take(5).map((tx) => _transactionItem(tx)),
              ],
            ),
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.cloud_off, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              Text('加载失败: $e', style: const TextStyle(color: Colors.grey)),
              TextButton(
                onPressed: () => ref.invalidate(walletProvider),
                child: const Text('重试'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _walletStatItem({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 16),
            const SizedBox(width: 4),
            Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
      ],
    );
  }

  Widget _actionButton(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: const Color(0xFFEF4444).withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFEF4444).withOpacity(0.3)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: const Color(0xFFEF4444), size: 22),
            const SizedBox(width: 8),
            Text(label, style: const TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _transactionItem(dynamic tx) {
    final isPositive = tx.type == 'earn' || tx.type == 'transfer_in';
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 6)],
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: (isPositive ? Colors.green : Colors.orange).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isPositive ? Icons.arrow_downward : Icons.arrow_upward,
              color: isPositive ? Colors.green : Colors.orange,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tx.description ?? (isPositive ? '获得 HRT' : '支出 HRT'),
                    style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
                Text(
                  '${tx.createdAt.year}-${tx.createdAt.month.toString().padLeft(2, '0')}-${tx.createdAt.day.toString().padLeft(2, '0')}',
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
                ),
              ],
            ),
          ),
          Text(
            '${isPositive ? '+' : '-'}${tx.amount} HRT',
            style: TextStyle(
              color: isPositive ? Colors.green : Colors.orange,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  void _showTransfer(BuildContext context) {
    final phoneController = TextEditingController();
    final amountController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(ctx).viewInsets.bottom + 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('转账 HRT', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            TextField(controller: phoneController, decoration: const InputDecoration(labelText: '收款人手机号', hintText: '+82 10XXXXXXXX', border: OutlineInputBorder())),
            const SizedBox(height: 12),
            TextField(controller: amountController, decoration: const InputDecoration(labelText: '金额 (HRT)', hintText: '100', border: OutlineInputBorder()), keyboardType: TextInputType.number),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  final walletService = ref.read(walletServiceProvider);
                  final amount = int.tryParse(amountController.text) ?? 0;
                  final result = await walletService.transfer(phoneController.text.trim(), amount);
                  if (ctx.mounted) {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(result.isSuccess ? '转账成功!' : '转账失败: ${result.error}')),
                    );
                    if (result.isSuccess) ref.invalidate(walletProvider);
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEF4444),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('确认转账'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTransactions(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('交易记录详情开发中...')),
    );
  }
}
