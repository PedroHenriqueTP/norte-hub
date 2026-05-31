@echo off
echo ==========================================
echo   MedCura Bio-System Launcher
echo ==========================================
echo.
echo [1/3] Starting Backend Server (Port 8000)...
start "MedCura Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload"

echo [2/3] Starting Frontend Client (Port 3000)...
start "MedCura Frontend" cmd /k "cd frontend && npm run dev"

echo [3/3] Opening Browser...
timeout /t 5 >nul
start http://localhost:3000

echo.
echo System is running! Minimizing launcher...
timeout /t 3 >nul
exit
