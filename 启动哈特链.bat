@echo off
chcp 65001 >nul
echo ========================================
echo   HeartChain 一键启动脚本
echo   哈特链 一键启动
echo ========================================
echo.

cd /d E:\WorkBuddy\heartchain

REM 停止旧进程
echo [1/3] 停止旧进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM 启动后端 (端口3002)
echo [2/3] 启动后端服务 (端口3002)...
cd E:\WorkBuddy\heartchain\backend
start "HeartChain-Backend" cmd /k "node dist/main.js"

REM 等待后端启动
timeout /t 3 >nul

REM 启动前端 (端口3001)
echo [3/3] 启动前端服务 (端口3001)...
cd E:\WorkBuddy\heartchain\web
start "HeartChain-Frontend" cmd /k "node .output/server/index.mjs"

echo.
echo ========================================
echo   启动完成！
echo   
echo   后端: http://localhost:3002
echo   前端: http://localhost:3001
echo   API文档: http://localhost:3002/api/v1/docs
echo ========================================
echo.
echo 账号信息：
echo   管理员: +821022098999 / Admin@2026
echo   测试用户: +821098765432 / password123
echo.
pause
