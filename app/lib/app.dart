import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'shared/theme/app_theme.dart';
import 'shared/widgets/app_router.dart';

class HeartChainApp extends StatelessWidget {
  const HeartChainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: '哈特链 HeartChain',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: AppRouter.router,
    );
  }
}
