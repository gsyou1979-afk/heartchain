// Simple i18n composable - replaces @nuxtjs/i18n
const messages: Record<string, string> = {
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
  'nav.tasks': '任务中心',
  'common.more': '查看更多',
  'task.categoryVolunteer': '志愿服务',
  'task.accept': '立即参与',
  'auth.login': '登录',
  'auth.register': '注册',
  'auth.forgotPassword': '忘记密码？',
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
  'wallet.balance': '钱包余额',
  'wallet.recharge': '充值',
  'wallet.withdraw': '提现',
  'wallet.history': '交易记录',
  'profile.edit': '编辑资料',
  'profile.avatar': '头像',
  'profile.nickname': '昵称',
  'profile.bio': '个人简介',
  'teams.title': '我的团队',
  'teams.create': '创建团队',
  'tasks.title': '任务中心',
  'tasks.publish': '发布任务',
  'tasks.myTasks': '我的任务',
  'tasks.allTasks': '全部任务',
};

export function useI18n() {
  const $t = (key: string): string => {
    return messages[key] || key;
  };
  
  return { $t };
}
