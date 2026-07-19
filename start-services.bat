@echo off
chcp 65001 > nul
echo ===== HeartChain 서비스 시작 =====
echo.

net start HeartChain-Backend
timeout /t 2 > nul
net start HeartChain-Frontend

echo.
echo 서비스 상태 확인...
sc query HeartChain-Backend | find "STATE"
sc query HeartChain-Frontend | find "STATE"

echo.
echo 브라우저 열기...
start http://localhost:3001

pause
