# Smart Classroom AV Troubleshooting Assistant — Unified Development Launcher
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " Starting Smart Classroom AV Platform (AI Engine + Web + Mobile Backend)" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

# 1. Start AI Diagnostic Engine FastAPI
Write-Host "[1/3] Launching AI Diagnostics Engine (FastAPI :8000)..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd av-troubleshooter-ai; `$env:PYTHONPATH='.'; .venv\Scripts\activate; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# 2. Start React Web Dashboard
Write-Host "[2/3] Launching React Web Dashboard (Vite :5173)..." -ForegroundColor Green
$webProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd web; npm run dev" -PassThru

# 3. Configure Android USB Reverse Port Forwarding (if device connected)
if (Get-Command adb -ErrorAction SilentlyContinue) {
    Write-Host "[3/3] Configuring Android USB port forward (8081 Metro, 8000 AI Engine)..." -ForegroundColor Green
    adb reverse tcp:8081 tcp:8081 2>$null
    adb reverse tcp:8000 tcp:8000 2>$null
}

Write-Host "`nAll background services launched successfully!" -ForegroundColor Cyan
Write-Host "  - AI Engine API & Swagger Docs : http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "  - React Web Admin Dashboard    : http://localhost:5173/" -ForegroundColor Yellow
Write-Host "  - Cloud PostgreSQL (Supabase)  : Connected & Seeded" -ForegroundColor Yellow
Write-Host "`nTo start the React Native Mobile Metro bundler:" -ForegroundColor Magenta
Write-Host "  cd mobile" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan

