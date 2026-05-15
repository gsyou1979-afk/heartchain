// Native Ad Widget for HeartChain Flutter App
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../services/ad/ad_models.dart';
import '../services/ad/ad_service.dart';

class NativeAdWidget extends StatefulWidget {
  final String placementCode;
  final VoidCallback? onAdLoaded;
  final Function(Ad)? onAdClicked;

  const NativeAdWidget({
    super.key,
    this.placementCode = 'MB1',
    this.onAdLoaded,
    this.onAdClicked,
  });

  @override
  State<NativeAdWidget> createState() => _NativeAdWidgetState();
}

class _NativeAdWidgetState extends State<NativeAdWidget> {
  Ad? _currentAd;
  bool _isLoading = true;
  bool _hasReportedImpression = false;

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
    if (_isLoading) {
      return _buildSkeleton();
    }

    if (_currentAd == null) {
      return const SizedBox.shrink();
    }

    return _buildAdCard();
  }

  Widget _buildSkeleton() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 100,
            height: 70,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 16,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  height: 12,
                  width: 150,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: BorderSide(
            color: _getBorderColor(_currentAd!.adType),
            width: 4,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: _handleTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // Image
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: CachedNetworkImage(
                        imageUrl: _currentAd!.imageUrl,
                        width: 100,
                        height: 70,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(
                          width: 100,
                          height: 70,
                          color: Colors.grey[200],
                          child: const Center(
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                        ),
                        errorWidget: (context, url, error) => Container(
                          width: 100,
                          height: 70,
                          color: Colors.grey[200],
                          child: const Icon(Icons.image_not_supported),
                        ),
                      ),
                    ),
                    // Badge
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
                const SizedBox(width: 12),
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _currentAd!.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.black87,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (_currentAd!.description != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _currentAd!.description!,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                      const SizedBox(height: 8),
                      Text(
                        _currentAd!.adType == AdType.project
                            ? '来自求助项目'
                            : '广告',
                        style: TextStyle(
                          fontSize: 11,
                          color: Colors.grey[400],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
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

  Color _getBorderColor(AdType type) {
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
