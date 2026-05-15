/**
 * 项目广告填充脚本 - 直接写入数据库
 * 
 * 使用 Supabase PostgreSQL 直接插入数据
 * 绕过 API 的 DTO 验证问题
 * 
 * 运行: cd backend && node seed-project-ads.js
 */

const { Client } = require('pg');

const DB_URL = 'postgresql://postgres.mjozkluhwvfusbgzpsje:Admin%402026%402@db.mjozkluhwvfusbgzpsje.supabase.co:6543/postgres';

const ADS = [
  {
    code: 'A1',
    title: '传递爱心，温暖世界',
    description: '伸出援助之手，让爱心传递到每一个角落。韩国志愿者服务，用行动温暖需要帮助的人。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_volunteers_donating_foo_2026-05-10T15-41-29.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/volunteer',
    targetAmount: 1000000,
    urgencyLevel: 2
  },
  {
    code: 'A2',
    title: '志愿同行，让爱传递',
    description: '与志愿者同行，用爱心点亮希望。韩国青年志愿服务队，欢迎您的加入！',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_youth_volunteers_planti_2026-05-10T15-40-48.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/mytasks',
    targetAmount: 500000,
    urgencyLevel: 1
  },
  {
    code: 'A3',
    title: '小行动，大爱心',
    description: '每一个小行动，都是大爱心的体现。韩国志愿者，用平凡成就非凡。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_volunteers_tutoring_chi_2026-05-10T15-42-33.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/tasks',
    targetAmount: 800000,
    urgencyLevel: 2
  },
  {
    code: 'B1',
    title: '用爱温暖每一位需要的人',
    description: '韩国老年人关怀志愿服务，为独居老人送去温暖与陪伴。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_elderly_volunteers_c_2026-05-10T15-40-25.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/tasks',
    targetAmount: 300000,
    urgencyLevel: 3
  },
  {
    code: 'B2',
    title: '爱心让世界更美丽',
    description: '灾害救援志愿服务，关键时刻伸出援手。韩国救灾志愿者队伍随时待命。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_disaster_volunteers_r_2026-05-10T15-40-37.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/tasks',
    targetAmount: 2000000,
    urgencyLevel: 3
  },
  {
    code: 'C1',
    title: '伸出援手，让爱发光',
    description: '社区志愿服务，从身边做起。韩国各地志愿者团队，欢迎您的参与。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_environmental_cleanup_2026-05-10T15-42-16.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/tasks',
    targetAmount: 600000,
    urgencyLevel: 1
  },
  {
    code: 'C2',
    title: '一人帮人人，人人互帮',
    description: '志愿服务，人人参与。韩国志愿服务平台，连接爱心与需求。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_blood_donation_volu_2026-05-10T15-41-50.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/volunteer',
    targetAmount: 400000,
    urgencyLevel: 2
  },
  {
    code: 'MA1',
    title: '一人帮人人，人人互帮',
    description: 'HeartChain 志愿服务平台，让爱心传递更简单。下载APP，随时随地参与志愿服务。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_blood_donation_volu_2026-05-10T15-41-50.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/app',
    targetAmount: 100000,
    urgencyLevel: 1
  },
  {
    code: 'MB1',
    title: '奉献爱心，收获快乐',
    description: '志愿服务是一种生活方式。韩国志愿者，在付出中获得成长与快乐。',
    imageUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/ads/Korean_volunteers_tutoring_chi_2026-05-10T15-42-33.png',
    landingUrl: 'https://heartchain-anqam8gak-gsyou1979-afks-projects.vercel.app/tasks',
    targetAmount: 700000,
    urgencyLevel: 2
  }
];

async function seed() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔌 已连接到 Supabase PostgreSQL\n');

    // 检查表是否存在
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'project_ads'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ project_ads 表不存在！');
      return;
    }
    console.log('✅ project_ads 表存在\n');

    for (const ad of ADS) {
      // 生成 UUID
      const id = generateUUID();
      const now = new Date().toISOString();
      const urgency = ad.urgencyLevel >= 3 ? 'critical' : ad.urgencyLevel >= 2 ? 'urgent' : 'normal';

      const sql = `
        INSERT INTO project_ads (
          id, "taskId", "projectId", title, description, "imageUrl", "landingUrl",
          "applicantName", "applicantAvatar", "targetAmount", "raisedAmount",
          "geoTarget", "interestTarget", urgency, "urgencyLevel", "priorityScore",
          "startDate", "endDate", "dailyBudget", "quotaTotal", "quotaUsed",
          impressions, clicks, conversions, status, "createdAt", "updatedAt"
        ) VALUES (
          $1, NULL, NULL, $2, $3, $4, $5,
          '系统管理员', NULL, $6, 0,
          NULL, NULL, $7, $8, $9,
          $10, $11, 0, 100000, 0,
          0, 0, 0, 'active', $12, $12
        )
        ON CONFLICT DO NOTHING;
      `;

      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);

      await client.query(sql, [
        id,
        ad.title,
        ad.description,
        ad.imageUrl,
        ad.landingUrl,
        ad.targetAmount,
        urgency,
        ad.urgencyLevel,
        ad.urgencyLevel * 10,
        now,
        endDate.toISOString(),
        now
      ]);

      console.log(`✅ 项目广告 "${ad.title}" (${ad.code}) 创建成功`);
    }

    console.log('\n✨ 所有项目广告创建完成！');
    console.log('\n请刷新哈特链首页查看广告效果。');

  } catch (err) {
    console.error('❌ 错误:', err.message);
  } finally {
    await client.end();
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

seed();
