@echo off
echo ========================================================
echo Starting LearnWise Educational Analytics Platform
echo ========================================================

start "LearnWise Backend API (FastAPI)" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
start "LearnWise Frontend (React + Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching:
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000/api/v1/docs
echo ========================================================
pause
