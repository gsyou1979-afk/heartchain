@echo off
chcp 65001 > nul
echo.
echo  =========================================
echo  哈特链 서비스 중지
echo  =========================================
echo.
cd /d E:\WorkBuddy\heartchain
npx pm2 stop all
npx pm2 delete all
echo.
echo  ✅ 모든 서비스 중지됨
echo.
pause
