// 同源 Serverless 注册接口（部署于 Vercel，演示版：内置账号，无需外部数据库）
import { createHash } from 'crypto'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone = String(body?.phone || '').replace(/[^0-9+]/g, '')
  const code = String(body?.code || '').trim()
  const password = String(body?.password || '')

  if (!phone || !code || !password) {
    throw createError({ statusCode: 400, message: '请填写完整信息' })
  }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw createError({ statusCode: 400, message: '密码至少8位，且需包含字母和数字' })
  }
  // 校验验证码（与发送端确定性算法一致）
  const seed = createHash('sha256').update('heartchain-' + phone + '-demo').digest('hex')
  const n = parseInt(seed.slice(0, 8), 16)
  const expected = String(n % 1000000).padStart(6, '0')
  if (code !== expected) {
    throw createError({ statusCode: 400, message: '验证码错误' })
  }

  const token = 'demo-token-new-' + Date.now()
  const user = {
    id: 99,
    phone,
    nickname: '新用户',
    level: 1,
    levelName: '新成员',
    points: 0,
    helpCount: 0,
    rating: 5.0,
    rank: 99,
    monthlyHelp: 0,
    monthlyPoints: 0,
  }
  return { success: true, message: '注册成功', user, accessToken: token, token }
})
