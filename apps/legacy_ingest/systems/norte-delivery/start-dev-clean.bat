@echo off
echo Starting Delivery Platform...

:: Kill existing node processes to free ports
echo Cleaning ports...
taskkill /F /IM node.exe >nul 2>&1

echo Starting API in a new window...
start "Delivery API" cmd /k "cd apps\api && npm run start:dev"

echo Starting Web App in a new window...
start "Delivery Web" cmd /k "cd apps\web && npm run dev"

echo.
echo Systems are starting...
echo API: http://localhost:3333
echo Web: http://localhost:3000
echo.
pause
