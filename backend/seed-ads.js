/**
 * 广告内容填充脚本
 * 运行方式: cd backend && node seed-ads.js
 * 
 * 前提: 后端服务必须正在运行
 */

const API_BASE = 'https://heartchain-backend.onrender.com/api/v1/ad';
const PLACEMENTS_BASE = `${API_BASE}/placements`;
const CAMPAIGNS_BASE = `${API_BASE}/campaigns`;

// 志愿者公益广告图片（使用前端 public 目录下的图片）
const AD_IMAGES = {
  // 首页顶部 A1 - 728x90 横幅
  A1: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_volunteers_donating_foo_2026-05-10T15-41-29.png',
    description: '首页顶部横幅 - 传递爱心'
  },
  // 首页中部 A2 - 600x400 推荐
  A2: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_youth_volunteers_planti_2026-05-10T15-40-48.png',
    description: '首页中部推荐 - 志愿同行'
  },
  // 首页底部 A3 - 728x90 横幅
  A3: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_volunteers_tutoring_chi_2026-05-10T15-42-33.png',
    description: '首页底部 - 小行动大爱心'
  },
  // 侧边栏 S1 - 300x250
  S1: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_elderly_volunteers_c_2026-05-10T15-40-25.png',
    description: '侧边栏上 - 用爱温暖老人'
  },
  // 侧边栏 S2 - 300x250
  S2: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_disaster_volunteers_r_2026-05-10T15-40-37.png',
    description: '侧边栏下 - 爱心让世界更美丽'
  },
  // 信息流 F1 - 600x400
  F1: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_environmental_cleanup_2026-05-10T15-42-16.png',
    description: '信息流 - 环保志愿者'
  },
  // 开屏 H1 - 1080x1920
  H1: {
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_blood_donation_volu_2026-05-10T15-41-50.png',
    description: '开屏广告 - 献血救人'
  }
};

// 感人的标语
const SLOGANS = [
  '传递爱心，温暖世界',
  '志愿同行，让爱传递',
  '小行动，大爱心',
  '用爱温暖每一位需要的人',
  '爱心让世界更美丽',
  '伸出援手，让爱发光',
  '一人帮人人，人人互帮',
  '奉献爱心，收获快乐',
  '爱心无价，志愿无悔',
  '让爱传递，从心开始'
];

// 广告位配置
const PLACEMENTS = [
  { code: 'A1', name: '首页顶部横幅', location: 'homepage-top', width: 728, height: 90 },
  { code: 'A2', name: '首页中部推荐', location: 'homepage-middle', width: 600, height: 400 },
  { code: 'A3', name: '首页底部横幅', location: 'homepage-bottom', width: 728, height: 90 },
  { code: 'S1', name: '右侧边栏上', location: 'sidebar-top', width: 300, height: 250 },
  { code: 'S2', name: '右侧边栏下', location: 'sidebar-bottom', width: 300, height: 250 },
  { code: 'F1', name: '信息流插入', location: 'feed', width: 600, height: 400 },
  { code: 'H1', name: 'App开屏广告', location: 'splash', width: 1080, height: 1920 }
];

// 公益广告数据
const CAMPAIGNS = [
  {
    code: 'A1',
    name: '传递爱心，温暖世界',
    slogan: '传递爱心，温暖世界',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['A1']
  },
  {
    code: 'A2',
    name: '志愿同行，让爱传递',
    slogan: '志愿同行，让爱传递',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['A2']
  },
  {
    code: 'A3',
    name: '小行动，大爱心',
    slogan: '小行动，大爱心',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['A3']
  },
  {
    code: 'S1',
    name: '用爱温暖每一位需要的人',
    slogan: '用爱温暖每一位需要的人',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['S1']
  },
  {
    code: 'S2',
    name: '爱心让世界更美丽',
    slogan: '爱心让世界更美丽',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['S2']
  },
  {
    code: 'F1',
    name: '伸出援手，让爱发光',
    slogan: '伸出援手，让爱发光',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['F1']
  },
  {
    code: 'H1',
    name: '一人帮人人，人人互帮',
    slogan: '一人帮人人，人人互帮',
    type: 'public_service',
    dailyBudget: 0,
    bidAmount: 0,
    placements: ['H1']
  }
];

async function createPlacement(placement) {
  const mapping = {
    'homepage-top': { platform: 'web', page: 'home', position: 'hero' },
    'homepage-middle': { platform: 'web', page: 'home', position: 'feed' },
    'homepage-bottom': { platform: 'web', page: 'home', position: 'footer' },
    'sidebar-top': { platform: 'web', page: 'home', position: 'sidebar' },
    'sidebar-bottom': { platform: 'web', page: 'home', position: 'sidebar' },
    'feed': { platform: 'web', page: 'home', position: 'feed' },
    'splash': { platform: 'android', page: 'splash', position: 'splash' },
  };
  const m = mapping[placement.location] || { platform: 'web', page: 'home', position: 'hero' };

  const payload = {
    code: placement.code,
    name: placement.name,
    description: `${placement.name} - 公益广告位`,
    platform: m.platform,
    page: m.page,
    position: m.position,
    width: placement.width,
    height: placement.height,
    supportedTypes: ['commercial', 'public_service', 'project'],
    floorCpm: 0,
    isActive: true,
  };

  try {
    const res = await fetch(PLACEMENTS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ 广告位 ${placement.code} 创建成功`);
      return data;
    } else {
      const err = await res.json().catch(() => ({ message: 'Unknown error' }));
      console.log(`⚠️  广告位 ${placement.code}: ${err.message || res.status}`);
      return null;
    }
  } catch (e) {
    console.log(`❌  广告位 ${placement.code}: ${e.message}`);
    return null;
  }
}

async function createCampaign(campaign, imageData) {
  const payload = {
    advertiserId: 'system-admin',
    name: campaign.name,
    adType: campaign.type,
    imageUrl: imageData.imageUrl,
    pricingModel: 'cpm',
    budgetDaily: campaign.dailyBudget,
    budgetTotal: campaign.dailyBudget * 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targeting: {
      interests: [],
      frequency: { daily: 10 },
    },
    placements: campaign.placements,
    description: campaign.slogan,
  };

  try {
    const res = await fetch(CAMPAIGNS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ 广告计划 "${campaign.name}" 创建成功`);
      return data;
    } else {
      const err = await res.json().catch(() => ({ message: 'Unknown error' }));
      console.log(`⚠️  广告计划 "${campaign.name}": ${err.message || res.status}`);
      return null;
    }
  } catch (e) {
    console.log(`❌  广告计划 "${campaign.name}": ${e.message}`);
    return null;
  }
}

async function seed() {
  console.log('🚀 开始填充广告内容...\n');

  console.log('📍 第一步：创建广告位...');
  console.log('='.repeat(50));
  
  for (const placement of PLACEMENTS) {
    await createPlacement(placement);
    await new Promise(r => setTimeout(r, 500)); // 避免请求过快
  }

  console.log('\n📢 第二步：创建公益广告计划...');
  console.log('='.repeat(50));
  
  for (const campaign of CAMPAIGNS) {
    const imageData = AD_IMAGES[campaign.code];
    if (imageData) {
      await createCampaign(campaign, imageData);
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n✨ 广告内容填充完成！');
  console.log('\n请刷新管理后台广告页面查看效果。');
}

seed().catch(console.error);
