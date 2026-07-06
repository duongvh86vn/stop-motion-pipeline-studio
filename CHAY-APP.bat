@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  ===== Stop Motion Pipeline Studio =====
echo  Dang khoi dong server tai http://localhost:8317 ...
echo  (Dong cua so nay de tat app)
echo.
start "smx-server" /min cmd /c "npx --yes http-server -p 8317 -c-1 ."
timeout /t 2 /nobreak >nul
start "" http://localhost:8317
pause
