@echo off
chcp 65001 > nul
echo Stopping HeartChain services...
taskkill /f /im node.exe
echo Done.
pause
