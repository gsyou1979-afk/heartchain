@echo off
echo ===== HeartChain 시작 중 =====

echo [1/2] 백엔드 시작 중...
cd /d E:\WorkBuddy\heartchain\backend
start "HeartChain-Backend" cmd /k "npm run start:dev"

timeout /t 3 > nul

echo [2/2] 프론트엔드 시작 중...
cd /d E:\WorkBuddy\heartchain\web
start "HeartChain-Frontend" cmd /k "npm run dev"

timeout /t 8 > nul

echo 브라우저를 엽니다...
start http://localhost:3001

echo.
echo 완료! 창을 그대로 두세요 (창을 닫으면 서버가 꺼집니다)
echo 창을 닫고 싶지 않으면 PM2 방식을 사용하세요.
pause
