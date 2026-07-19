@echo off
chcp 65001 > nul
echo.
echo  =========================================
echo  哈特链 서비스 상태
echo  =========================================
echo.
cd /d E:\WorkBuddy\heartchain
npx pm2 list

echo.
echo  [API 상태 확인]
curl -s http://localhost:3000/api/v1 2>nul || echo  ❌ 백엔드(3000) 응답 없음

echo.
echo  [포트 사용 현황]
netstat -ano | findstr ":3000 :3001"

echo.
pause
