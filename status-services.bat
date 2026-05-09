@echo off
chcp 65001 > nul
echo ===== HeartChain 서비스 상태 확인 =====
echo.

echo [백엔드 상태]
sc query HeartChain-Backend | find "STATE"
echo.
echo [프론트엔드 상태]
sc query HeartChain-Frontend | find "STATE"

echo.
echo [포트 확인]
netstat -ano | find "3000"
netstat -ano | find "3001"

pause
