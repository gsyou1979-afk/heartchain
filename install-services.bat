@echo off
chcp 65001 > nul
echo ===== HeartChain Service Installation =====
echo.

set NSSM=E:\WorkBuddy\nssm\nssm-2.24\win64\nssm.exe

if not exist "%NSSM%" (
    echo [ERROR] nssm not found: %NSSM%
    pause
    exit /b 1
)

echo NSSM path: %NSSM%
echo.

echo [1/4] Removing existing services (if any)...
"%NSSM%" remove HeartChain-Backend confirm 2>nul
"%NSSM%" remove HeartChain-Frontend confirm 2>nul
timeout /t 2 > nul

echo [2/4] Installing backend service...
"%NSSM%" install HeartChain-Backend "cmd.exe" "/c cd /d E:\WorkBuddy\heartchain\backend && npm run start:dev"
"%NSSM%" set HeartChain-Backend AppDirectory "E:\WorkBuddy\heartchain\backend"
"%NSSM%" set HeartChain-Backend DisplayName "HeartChain Backend (NestJS)"
"%NSSM%" set HeartChain-Backend Description "HeartChain NestJS Backend - Port 3000"
"%NSSM%" set HeartChain-Backend Start SERVICE_AUTO_START
echo Backend service installed.

echo [3/4] Installing frontend service...
"%NSSM%" install HeartChain-Frontend "cmd.exe" "/c cd /d E:\WorkBuddy\heartchain\web && npm run dev"
"%NSSM%" set HeartChain-Frontend AppDirectory "E:\WorkBuddy\heartchain\web"
"%NSSM%" set HeartChain-Frontend DisplayName "HeartChain Frontend (Nuxt)"
"%NSSM%" set HeartChain-Frontend Description "HeartChain Nuxt3 Frontend - Port 3001"
"%NSSM%" set HeartChain-Frontend Start SERVICE_AUTO_START
echo Frontend service installed.

echo [4/4] Starting services...
net start HeartChain-Backend
timeout /t 3 > nul
net start HeartChain-Frontend

echo.
echo ===== Installation Complete =====
echo.
echo Service status:
sc query HeartChain-Backend | find "STATE"
sc query HeartChain-Frontend | find "STATE"

echo.
echo Opening browser...
timeout /t 5 > nul
start http://localhost:3001

pause
