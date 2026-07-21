// 同源 Serverless 登录接口（部署于 Vercel，脱离 Render 后端）
// 内置演示账号，无需外部数据库即可在线登录
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone = String(body?.phone || '').trim()
  const password = String(body?.password || '').trim()

  const users = [
    {
      id: 1,
      phone: '+821012345678',
      password: '12345678',
      nickname: '김영수',
      level: 3,
      levelName: '热心市民',
      points: 12400,
      helpCount: 36,
      rating: 4.8,
      rank: 3,
      monthlyHelp: 12,
      monthlyPoints: 2400,
    },
    {
      id: 2,
      phone: '+821022098999',
      password: '123456',
      nickname: 'KP',
      level: 3,
      levelName: '热心市民',
      points: 50000,
      helpCount: 10,
      rating: 5.0,
      rank: 1,
      monthlyHelp: 10,
      monthlyPoints: 5000,
    },
  ]

  if (!phone || !password) {
    throw createError({ statusCode: 400, message: '请输入手机号和密码' })
  }

  const user = users.find((u) => u.phone === phone && u.password === password)
  if (!user) {
    throw createError({ statusCode: 401, message: '手机号或密码错误' })
  }

  const { password: _pw, ...safeUser } = user
  const token = 'demo-token-' + user.id + '-' + Date.now()
  return {
    user: safeUser,
    accessToken: token,
    token,
  }
})
