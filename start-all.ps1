# HackMe'26 Development Server Launcher
# This script starts all three services in separate windows

Write-Host "🚀 Starting HackMe'26 Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Get the current directory
$rootDir = $PSScriptRoot

# Check if virtual environment exists for backend
$venvPath = Join-Path $rootDir "backend\venv\Scripts\Activate.ps1"
if (-Not (Test-Path $venvPath)) {
    Write-Host "⚠️  Virtual environment not found for backend!" -ForegroundColor Yellow
    Write-Host "   Creating virtual environment..." -ForegroundColor Yellow
    Set-Location (Join-Path $rootDir "backend")
    python -m venv venv
    & $venvPath
    pip install -r requirements.txt
    python manage.py migrate
    Set-Location $rootDir
}

# Start Backend (Django)
Write-Host "1️⃣  Starting Backend API (Django) on port 4000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; .\venv\Scripts\Activate.ps1; python manage.py runserver 4000"
Start-Sleep -Seconds 2

# Start Main Website (React)
Write-Host "2️⃣  Starting Main Website (React) on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; npm run dev"
Start-Sleep -Seconds 2

# Start Admin Panel (React)
Write-Host "3️⃣  Starting Admin Panel (React) on port 5174..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\admin'; npm run dev"

Write-Host ""
Write-Host "✅ All services are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access URLs:" -ForegroundColor Cyan
Write-Host "   Main Website:    http://localhost:5173" -ForegroundColor White
Write-Host "   Admin Panel:     http://localhost:5174" -ForegroundColor White
Write-Host "   Admin Portal:    http://localhost:5173/admin-portal" -ForegroundColor White
Write-Host "   Backend API:     http://localhost:4000/api/v1" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Press Ctrl+C in each window to stop the services" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy Hacking! 🎉" -ForegroundColor Magenta
