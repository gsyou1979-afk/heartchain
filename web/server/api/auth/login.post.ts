import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const response = await axios.post('http://localhost:3002/api/v1/auth/password-login', {
      phone: body.phone,
      password: body.password,
    }, {
      timeout: 10000,
    })
    
    return response.data
  } catch (error: any) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || '登录失败'
    
    throw createError({
      statusCode: status,
      message: message,
    })
  }
})
