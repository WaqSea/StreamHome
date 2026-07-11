@echo off
echo ====================================================
echo Stopping StreamHome backend and frontend processes...
echo ====================================================
taskkill /f /im python.exe /t >nul 2>&1
taskkill /f /im node.exe /t >nul 2>&1
echo Both python and node processes stopped.
pause
