// 同源 Serverless 发送验证码（部署于 Vercel，演示版：直接返回验证码，无需短信网关）
import { createHash } from 'crypto'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const phone = String(body?.phone || '').replace(/[^0-9+]/g, '')
  if (!phone) {
    throw createError({ statusCode: 400, message: '请输入手机号' })
  }
  // 演示：验证码由手机号确定性生成（无需真实短信，仅用于在线流程演示）
  const seed = createHash('sha256').update('heartchain-' + phone + '-demo').digest('hex')
  const n = parseInt(seed.slice(0, 8), 16)
  const code = String(n % 1000000).padStart(6, '0')
  return { success: true, message: '验证码已发送（演示环境直接返回）', code }
})
