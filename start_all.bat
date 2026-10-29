@echo off
title Smart Classroom AV Troubleshooting Assistant - Unified Launcher
echo ========================================================================
echo  Starting Smart Classroom AV Platform (AI Engine + Web + Mobile Backend)
echo ========================================================================

echo [1/3] Starting FastAPI AI Diagnostics Engine on http://localhost:8000 ...
start "AV AI Backend (:8000)" cmd /k "cd /d %~dp0av-troubleshooter-ai && set PYTHONPATH=. && .venv\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting React Web Dashboard on http://localhost:5173 ...
start "AV Web Dashboard (:5173)" cmd /k "cd /d %~dp0web && npm run dev"

echo.
echo All background services started!
echo   - AI Engine Docs  : http://localhost:8000/docs
echo   - Web Dashboard   : http://localhost:5173/
echo.
echo To start Mobile App:
echo   cd mobile ^&^& npm start
echo ========================================================================
pause

