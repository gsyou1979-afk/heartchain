@echo off
echo ========================================
echo HeartChain 前端启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 清除缓存...
if exist .nuxt rmdir /s /q .nuxt

echo [2/3] 安装依赖（如果需要）...
if not exist node_modules (
    echo 正在安装依赖...
    call npm install
) else (
    echo 依赖已安装，跳过。
)

echo [3/3] 启动开发服务器...
echo.
echo 启动后访问: http://localhost:3001
echo 登录页面: http://localhost:3001/auth/login
echo.
npm run dev

pause
