/**
 * 广告管理页面 — 9个广告位 + 图片自动缩放
 * 
 * 修改内容：
 * 1. 默认广告位从6个改为9个（L1/L2/L3, C1/C2/C3, R1/R2/R3）
 * 2. 图片上传时自动等比缩放适配广告位尺寸
 * 3. 预览时显示缩放后的效果
 */

// ============================================
// 文件：web/pages/admin/ads/index.vue
// 在 sizeMap 中添加9个广告位的尺寸映射
// ============================================

const sizeMap: Record<string, { width: number; height: number }> = {
  // 左侧广告位 3个（上/中/下）
  'left-top':    { width: 300, height: 250 },
  'left-middle': { width: 300, height: 250 },
  'left-bottom': { width: 300, height: 250 },
  // 中间广告位 3个（上/中/下）
  'center-top':    { width: 728, height: 90 },
  'center-middle': { width: 600, height: 400 },
  'center-bottom': { width: 728, height: 90 },
  // 右侧广告位 3个（上/中/下）
  'right-top':    { width: 300, height: 250 },
  'right-middle': { width: 300, height: 250 },
  'right-bottom': { width: 300, height: 250 },
};

// ============================================
// 图片自动缩放函数
// 在 handleImageUpload 中使用
// ============================================

function handleImageUpload(idx: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // 获取目标广告位尺寸
      const targetSize = getTargetSize(); // 根据当前选择的广告位获取尺寸
      
      // 等比缩放
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let { width, height } = img;
      const targetWidth = targetSize.width;
      const targetHeight = targetSize.height;
      
      // 计算缩放比例（保持宽高比）
      const scale = Math.min(targetWidth / width, targetHeight / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制缩放后的图片
      ctx?.drawImage(img, 0, 0, width, height);
      
      // 转回base64
      campaignForm.value.items[idx].imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

// ============================================
// 9个广告位默认数据
// 在 placementForm 默认值中使用
// ============================================

const defaultPlacements = [
  // 左侧
  { code: 'L1', name: '左侧-上', location: 'left-top', width: 300, height: 250 },
  { code: 'L2', name: '左侧-中', location: 'left-middle', width: 300, height: 250 },
  { code: 'L3', name: '左侧-下', location: 'left-bottom', width: 300, height: 250 },
  // 中间
  { code: 'C1', name: '中间-上', location: 'center-top', width: 728, height: 90 },
  { code: 'C2', name: '中间-中', location: 'center-middle', width: 600, height: 400 },
  { code: 'C3', name: '中间-下', location: 'center-bottom', width: 728, height: 90 },
  // 右侧
  { code: 'R1', name: '右侧-上', location: 'right-top', width: 300, height: 250 },
  { code: 'R2', name: '右侧-中', location: 'right-middle', width: 300, height: 250 },
  { code: 'R3', name: '右侧-下', location: 'right-bottom', width: 300, height: 250 },
];
