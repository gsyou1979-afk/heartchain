// Simple i18n plugin - injects $t globally
const messages: Record<string, string> = {
  // App
  'app.name': '哈特链 HeartChain',
  'app.slogan': '以爱心链接世界',
  // Nav
  'nav.tasks': '任务大厅',
  'nav.teams': '团队',
  'nav.wallet': '我的钱包',
  'nav.profile': '个人中心',
  // Home
  'home.title': '哈特链 - 以爱心链接世界',
  'home.subtitle': '让善意可视化，让爱心永流传',
  'home.startNow': '立即开始',
  'home.howItWorks': '了解更多',
  'home.stats.volunteers': '志愿者',
  'home.stats.tasks': '任务',
  'home.stats.points': '爱心积分',
  'home.stats.teams': '团队',
  'home.step1': '注册账号',
  'home.step1Desc': '简单几步完成注册',
  'home.step2': '接任务',
  'home.step2Desc': '浏览并接受心仪任务',
  'home.step3': '完成任务',
  'home.step3Desc': '线下完成并发帖记录',
  'home.step4': '获得积分',
  'home.step4Desc': '审核通过获得爱心积分',
  // Common
  'common.more': '查看更多',
  'common.noData': '暂无数据',
  'common.save': '保存',
  'common.email': '邮箱',
  'common.password': '密码',
  'common.confirmPassword': '确认密码',
  'common.username': '用户名',
  'common.phone': '手机号',
  'common.submit': '提交',
  'common.cancel': '取消',
  'common.loading': '加载中...',
  'common.error': '操作失败',
  'common.success': '操作成功',
  // Auth
  'auth.login': '登录',
  'auth.register': '注册',
  'auth.forgotPassword': '忘记密码？',
  'auth.regionKr': '韩国',
  'auth.regionCn': '中国',
  // Task
  'task.categoryVolunteer': '志愿服务',
  'task.categorySkill': '技能服务',
  'task.categoryEmergency': '紧急求助',
  'task.categoryPaid': '付费任务',
  'task.categoryDonation': '捐赠',
  'task.all': '全部',
  'task.accept': '立即参与',
  'task.publish': '发布任务',
  'task.search': '搜索任务...',
  // Wallet
  'wallet.balance': '钱包余额',
  'wallet.send': '转账',
  'wallet.receive': '收款',
  'wallet.recharge': '充值',
  'wallet.withdraw': '提现',
  'wallet.history': '交易记录',
  // Profile
  'profile.edit': '编辑资料',
  'profile.avatar': '头像',
  'profile.nickname': '昵称',
  'profile.bio': '个人简介',
  'profile.creditScore': '信用分',
  'profile.completedTasks': '已完成',
  'profile.region': '地区',
  // Teams
  'team.members': '成员',
  'team.totalPoints': '总积分',
  'team.create': '创建团队',
  'team.join': '加入团队',
  'teams.title': '我的团队',
  'teams.create': '创建团队',
  // Tasks
  'tasks.title': '任务大厅',
  'tasks.publish': '发布任务',
  'tasks.myTasks': '我的任务',
  'tasks.allTasks': '全部任务',
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('t', (key: string): string => {
    return messages[key] || key;
  });
});

// Also provide $t globally for templates
declare module '#app' {
  interface NuxtApp {
    $t(key: string): string;
  }
}
