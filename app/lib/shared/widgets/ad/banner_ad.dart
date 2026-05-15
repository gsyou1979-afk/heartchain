// Banner Ad Widget for HeartChain Flutter App
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/ad/ad_models.dart';
import '../services/ad/ad_service.dart';

class BannerAdWidget extends StatefulWidget {
  final String placementCode;
  final double height;
  final VoidCallback? onAdLoaded;
  final Function(Ad)? onAdClicked;

  const BannerAdWidget({
    super.key,
    this.placementCode = 'MB2',
    this.height = 60,
    this.onAdLoaded,
    this.onAdClicked,
  });

  @override
  State<BannerAdWidget> createState() => _BannerAdWidgetState();
}

class _BannerAdWidgetState extends State<BannerAdWidget> {
  Ad? _currentAd;
  bool _isLoading = true;
  bool _isVisible = false;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  Future<void> _loadAd() async {
    final ads = await AdService.requestAds(placementCode: widget.placementCode);
    if (ads.isNotEmpty && mounted) {
      setState(() {
        _currentAd = ads.first;
        _isLoading = false;
      });
      widget.onAdLoaded?.call();
    } else if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _handleTap() {
    if (_currentAd == null) return;

    AdService.reportClick(
      adType: _currentAd!.adType.name,
      creativeId: _currentAd!.creativeId,
      projectAdId: _currentAd!.projectAdId,
      placementCode: widget.placementCode,
      impressionId: _currentAd!.id,
    );

    widget.onAdClicked?.call(_currentAd!);
  }

  @override
  Widget build(BuildContext context) {
    return VisibilityDetector(
      onVisibilityChanged: (visible) {
        if (visible && !_isVisible && _currentAd != null) {
          _isVisible = true;
          AdService.reportImpression(
            adType: _currentAd!.adType.name,
            creativeId: _currentAd!.creativeId,
            projectAdId: _currentAd!.projectAdId,
            placementCode: widget.placementCode,
            impressionId: _currentAd!.id,
          );
        }
      },
      child: Container(
        height: widget.height,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: _isLoading
            ? const Center(
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              )
            : _currentAd != null
                ? GestureDetector(
                    onTap: _handleTap,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: CachedNetworkImage(
                            imageUrl: _currentAd!.imageUrl,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: Colors.grey[200],
                              child: const Center(
                                child: CircularProgressIndicator(strokeWidth: 2),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey[200],
                              child: const Icon(Icons.image_not_supported),
                            ),
                          ),
                        ),
                        // Ad badge
                        Positioned(
                          top: 4,
                          left: 4,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: _getBadgeColor(_currentAd!.adType),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              _currentAd!.badgeText,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
      ),
    );
  }

  Color _getBadgeColor(AdType type) {
    switch (type) {
      case AdType.project:
        return Colors.red;
      case AdType.publicService:
        return Colors.green;
      case AdType.commercial:
        return Colors.blue;
    }
  }
}

// Simple visibility detector widget
class VisibilityDetector extends StatefulWidget {
  final Widget child;
  final Function(bool)? onVisibilityChanged;

  const VisibilityDetector({
    super.key,
    required this.child,
    this.onVisibilityChanged,
  });

  @override
  State<VisibilityDetector> createState() => _VisibilityDetectorState();
}

class _VisibilityDetectorState extends State<VisibilityDetector> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      widget.onVisibilityChanged?.call(true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
