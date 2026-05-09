@echo off
chcp 65001 > nul
echo ===== HeartChain 서비스 제거 =====
echo.

set NSSM=E:\WorkBuddy\nssm\nssm-2.24\win64\nssm.exe

echo 기존 서비스 중지 중...
net stop HeartChain-Frontend 2>nul
net stop HeartChain-Backend 2>nul
timeout /t 2 > nul

echo 서비스 제거 중...
"%NSSM%" remove HeartChain-Backend confirm
"%NSSM%" remove HeartChain-Frontend confirm

echo.
echo 서비스 제거 완료.
pause
