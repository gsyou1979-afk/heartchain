@echo off
chcp 65001 >nul
echo ========================================
echo   HeartChain 重新构建脚本
echo ========================================
echo.

cd /d E:\WorkBuddy\heartchain

REM 停止旧进程
echo [1/4] 停止旧进程...
pm2 delete all 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

REM 重新构建后端
echo [2/4] 重新构建后端...
cd E:\WorkBuddy\heartchain\backend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo 后端构建失败！
    pause
    exit /b 1
)

REM 重新构建前端
echo [3/4] 重新构建前端...
cd E:\WorkBuddy\heartchain\web
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)

REM 启动服务
echo [4/4] 启动服务...
cd E:\WorkBuddy\heartchain
pm2 start ecosystem.config.js

echo.
echo ========================================
echo   重新构建完成！
echo   
echo   后端: http://localhost:3002
echo   前端: http://localhost:3001
echo ========================================
echo.
pause
