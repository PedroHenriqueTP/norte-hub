@echo off
echo Starting Medical CRM Environment...

echo [1/3] Starting Databases...
docker-compose up -d

echo [2/3] Starting Backend...
start "CRM Backend" cmd /k "venv\Scripts\activate && cd backend && uvicorn app.main:app --reload --port 8000"

echo [3/3] Starting Frontend...
start "CRM Frontend" cmd /k "cd frontend && npm run dev"

echo Done! Access at http://localhost:3000
pause
