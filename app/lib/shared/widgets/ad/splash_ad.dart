// Splash Ad Widget for HeartChain Flutter App
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/ad/ad_models.dart';
import '../services/ad/ad_service.dart';

class SplashAdWidget extends StatefulWidget {
  final VoidCallback onComplete;
  final Function(Ad)? onAdShown;
  final Function(Ad)? onAdClicked;
  final Duration displayDuration;

  const SplashAdWidget({
    super.key,
    required this.onComplete,
    this.onAdShown,
    this.onAdClicked,
    this.displayDuration = const Duration(seconds: 3),
  });

  @override
  State<SplashAdWidget> createState() => _SplashAdWidgetState();
}

class _SplashAdWidgetState extends State<SplashAdWidget> {
  Ad? _currentAd;
  bool _isLoading = true;
  bool _canSkip = false;
  int _countdown = 3;
  Timer? _countdownTimer;
  Timer? _durationTimer;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _durationTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadAd() async {
    // Only request commercial ads for splash
    final ads = await AdService.requestAds(placementCode: 'MA1');
    if (ads.isNotEmpty && mounted) {
      setState(() {
        _currentAd = ads.first;
        _isLoading = false;
      });
      _startTimers();
    } else if (mounted) {
      // No ad available, complete immediately
      widget.onComplete();
    }
  }

  void _startTimers() {
    // Countdown timer for skip button
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _countdown--;
          if (_countdown <= 0) {
            _canSkip = true;
            timer.cancel();
          }
        });
      }
    });

    // Duration timer for auto-dismiss
    _durationTimer = Timer(widget.displayDuration, () {
      if (mounted) {
        _handleComplete();
      }
    });
  }

  void _handleSkip() {
    if (!_canSkip) return;
    _handleComplete();
  }

  void _handleComplete() {
    _countdownTimer?.cancel();
    _durationTimer?.cancel();
    widget.onComplete();
  }

  void _handleAdTap() {
    if (_currentAd == null) return;

    AdService.reportClick(
      adType: _currentAd!.adType.name,
      creativeId: _currentAd!.creativeId,
      projectAdId: _currentAd!.projectAdId,
      placementCode: 'MA1',
      impressionId: _currentAd!.id,
    );

    widget.onAdClicked?.call(_currentAd!);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return _buildLoadingScreen();
    }

    if (_currentAd == null) {
      return const SizedBox.shrink();
    }

    return Stack(
      fit: StackFit.expand,
      children: [
        // Ad Image
        GestureDetector(
          onTap: _handleAdTap,
          child: CachedNetworkImage(
            imageUrl: _currentAd!.imageUrl,
            fit: BoxFit.cover,
            placeholder: (context, url) => _buildLoadingScreen(),
            errorWidget: (context, url, error) => _buildLoadingScreen(),
          ),
        ),
        // Gradient overlay
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.black.withOpacity(0.3),
                  Colors.transparent,
                  Colors.black.withOpacity(0.5),
                ],
                stops: const [0.0, 0.5, 1.0],
              ),
            ),
          ),
        ),
        // Skip button
        Positioned(
          top: MediaQuery.of(context).padding.top + 16,
          right: 16,
          child: GestureDetector(
            onTap: _handleSkip,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.5),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (!_canSkip) ...[
                    SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    ),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    _canSkip ? '跳过' : '$_countdown 跳过',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Ad badge
        Positioned(
          bottom: MediaQuery.of(context).padding.bottom + 16,
          left: 16,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.8),
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              '广告',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLoadingScreen() {
    return Container(
      color: Colors.white,
      child: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text(
              '加载广告中...',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
